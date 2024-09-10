import handler from "serve-handler";
import express, { static as expressStatic } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { schedule } from "node-cron";
import multer from "multer";
import RateLimit from "express-rate-limit";

import B2 from "backblaze-b2";
import { randomUUID } from "crypto";

import { createServer } from "http";

import { genSessionCookie } from "./helpers.mjs";

const PORT = process.env.PORT || 3001;

const hasB2 = process.env.B2_APP_KEY_ID && process.env.B2_APP_KEY;

const b2 = new B2({
  applicationKeyId: process.env.B2_APP_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

const app = express();

app.set("trust proxy", 2);

app.use(morgan("combined"));
app.use(cookieParser());
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

let data = [];
let stats = [];
let daily = [];

import apiRoutes from "./routes.mjs";

app.use((req, res, next) => {
  // Set session cookie
  if (!req.cookies.noitoolSessionToken) {
    genSessionCookie(res);
  }
  next();
});

app.use("/api/session", (req, res) => {
  res.send("ok");
});

app.use("/api/version", (req, res) => {
  res.send({
    outdated: process.env.SHOW_OUTDATED === "true",
    version: process.env.npm_package_version,
  });
});

app.use("/api", apiRoutes);

const getSecondsTillUtcMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
};

const getDailySeed = async () => {
  const ans = await fetch("http://takapuoli.noitagame.com/callback/").then(r => r.text());
  daily.push([new Date().toISOString(), ans]);
  const [versionHash, dailySeed, practiceSeed, x] = ans.split(";");
  return dailySeed;
};

app.get("/api/daily-seed", async (req, res) => {
  const dailySeed = await getDailySeed();

  // We can cache this till 00:00 UTC - changes daily
  res.append("Cache-Control", `max-age=${getSecondsTillUtcMidnight()}`);

  res.send({ seed: dailySeed });
});

app.post("/api/data", (req, res) => {
  data.push(req.body);
  res.sendStatus(200);
});

app.post("/api/stats", (req, res) => {
  stats.push(req.body);
  res.sendStatus(200);
});

import patreonRouter from "./patreon.mjs";
app.use("/api/patreon", patreonRouter);

let r;
const authorize = async () => {
  r = await b2.authorize();
};

if (hasB2) {
  authorize();
  setInterval(authorize, 1000 * 60 * 60 * 23); // 23h
}

const uploadToB2 = async (data, bucketId, fileName) => {
  if (!hasB2) {
    return;
  }
  try {
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId,
    });

    const upload = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName,
      data,
    });

    return upload;
  } catch (error) {
    console.error("Error in uploadToB2:", error);
    throw error;
  }
};

const m = multer();
app.post("/api/db_debug/", m.any(), async (req, res) => {
  const id = randomUUID();
  res.send({ id });

  const upload = await uploadToB2(req.files[0].buffer, "93c80a630c6d59a37add0615", `${id}.db`);
  console.log(upload.data);
});

app.get("/m/*", async (req, res) => {
  const m = req.params[0];
  console.log(JSON.stringify(m));
  res.append("Cache-Control", "immutable, max-age=360");
  res.send({});
});

import Socket from "./io/index.mjs";

const server = createServer(app);
const io = Socket(server, app);

// This is a hack for cleaner routing from the client's React Router.
// So that 404s still work, but the client can still route only to existing pages.
for (const route of ["/", "/info", "/search", "/live", "/test", "/compute", "/compute-console"]) {
  app.get(
    route,
    RateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 600, // to prevent ddos but allow a lot of refreshing
    }),
    (req, res) => {
      res.setHeader("Cache-Control", "no-store");
      res.sendFile("build/index.html", { root: "." });
    },
  );
}

app.use(
  "/static",
  expressStatic("build/static", {
    maxAge: "1y",
  }),
);
app.use(
  "/locales",
  expressStatic("build/locales", {
    maxAge: "1d",
  }),
);
app.use(
  "/ocr",
  expressStatic("build/ocr", {
    maxAge: "1d",
  }),
);
app.use(
  "/",
  expressStatic("build/", {
    maxAge: "1d",
  }),
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

server.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});

const uploadStats = async () => {
  if (!hasB2) {
    return;
  }
  try {
    const upload = await uploadToB2(
      Buffer.from(JSON.stringify({ data, stats, daily })),
      "93c80a630c6d59a37add0615",
      `${new Date().toISOString()}.json`,
    );
    data = [];
    stats = [];
  } catch (e) {
    console.error(e);
  }
};

schedule("0 0 * * *", uploadStats);

const shutdown = signal => err => {
  if (err) console.error(err.stack || err);
  if (process.env.NODE_ENV !== "production") {
    console.log("Not Production, exiting non-gracefully");
    process.exit(0);
  }
  setTimeout(() => {
    console.error("Waited 10s, exiting non-gracefully");
    process.exit(1);
  }, 10000).unref();
  Promise.allSettled([uploadStats(), new Promise(res => server.close(res))]).then(() => {
    console.log("Gracefully shut down");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown("SIGTERM")).on("SIGINT", shutdown("SIGINT"));

process.on("uncaughtException", shutdown("SIGINT"));

import "./jobs/index.mjs";
