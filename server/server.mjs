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
B2.prototype.uploadAny = await import("@gideo-llc/backblaze-b2-upload-any");

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
  res.send(process.env.npm_package_version);
});

app.use("/api", apiRoutes);

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

const m = multer();
app.post("/api/db_debug/", m.any(), async (req, res) => {
  const id = randomUUID();
  res.send({ id });
  try {
    await b2.uploadAny({
      bucketId: "e3081aa3bc7d39b38a1d0615",
      fileName: `${id}.db`,
      partSize: r.data.recommendedPartSize,
      data: req.files[0].buffer,
    });
  } catch (e) {
    console.error(e);
  }
});

app.get("/m/*", async (req, res) => {
  const m = req.params[0];
  console.log(m);
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

const upload = async () => {
  if (!hasB2) {
    return;
  }
  try {
    await b2.uploadAny({
      bucketId: "93c80a630c6d59a37add0615",
      fileName: `${new Date().toISOString()}.json`,
      partSize: r.data.recommendedPartSize,
      data: Buffer.from(JSON.stringify({ data, stats })),
    });
    data = [];
    stats = [];
  } catch (e) {
    console.error(e);
  }
};

schedule("0 0 * * *", upload);

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
  Promise.allSettled([upload(), new Promise(res => server.close(res))]).then(() => {
    console.log("Gracefully shut down");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown("SIGTERM")).on("SIGINT", shutdown("SIGINT"));

process.on("uncaughtException", shutdown("SIGINT"));

import "./jobs/index.mjs";
