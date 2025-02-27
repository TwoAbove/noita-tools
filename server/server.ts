import handler from "serve-handler";
import express, { Request, Response, NextFunction, static as expressStatic } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { schedule } from "node-cron";
import multer from "multer";
import RateLimit from "express-rate-limit";
import B2 from "backblaze-b2";
import { randomUUID } from "crypto";
import { createServer } from "http";
import { genSessionCookie } from "./helpers";

const PORT = process.env.PORT || 3001;

const hasB2 = process.env.B2_APP_KEY_ID && process.env.B2_APP_KEY;

const b2 = new B2({
  applicationKeyId: process.env.B2_APP_KEY_ID || "",
  applicationKey: process.env.B2_APP_KEY || "",
});

const app = express();
app.set("trust proxy", 2);

app.use(morgan("combined"));
app.use(cookieParser());
app.use(
  bodyParser.json({
    verify: (req: Request & { rawBody?: Buffer }, res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

interface DataItem {
  [key: string]: any;
}

let data: DataItem[] = [];
let stats: DataItem[] = [];
let daily: [string, string][] = [];

import apiRoutes from "./routes";

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.noitoolSessionToken) {
    genSessionCookie(res);
  }
  next();
});

app.use("/api/session", (req: Request, res: Response) => {
  res.send("ok");
});

app.use("/api/version", (req: Request, res: Response) => {
  res.send({
    outdated: process.env.SHOW_OUTDATED === "true",
    version: process.env.npm_package_version,
  });
});

app.use("/api", apiRoutes);

const getSecondsTillUtcMidnight = (): number => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
};

const getDailySeed = async (): Promise<string> => {
  const ans = await fetch("http://takapuoli.noitagame.com/callback/").then(r => r.text());
  daily.push([new Date().toISOString(), ans]);
  const [versionHash, dailySeed, practiceSeed, x] = ans.split(";");
  return dailySeed;
};

app.get("/api/daily-seed", async (req: Request, res: Response) => {
  const dailySeed = await getDailySeed();
  res.append("Cache-Control", `max-age=${getSecondsTillUtcMidnight()}`);
  res.send({ seed: dailySeed });
});

app.post("/api/data", (req: Request, res: Response) => {
  data.push(req.body);
  res.sendStatus(200);
});

app.post("/api/stats", (req: Request, res: Response) => {
  stats.push(req.body);
  res.sendStatus(200);
});

import patreonRouter from "./patreon";
app.use("/api/patreon", patreonRouter);

const uploadToB2 = async (buffer: Buffer, folderId: string, fileName: string) => {
  await b2.authorize();
  const {
    data: { uploadUrl, authorizationToken },
  } = await b2.getUploadUrl({
    bucketId: process.env.B2_BUCKET_ID || "",
  });
  return b2.uploadFile({
    uploadUrl,
    uploadAuthToken: authorizationToken,
    fileName: `${folderId}/${fileName}`,
    data: buffer,
    onUploadProgress: null,
  });
};

const m = multer();
app.post("/api/upload-db", m.any(), async (req: Request, res: Response) => {
  const id = randomUUID();
  const upload = await uploadToB2(
    (req.files as Express.Multer.File[])[0].buffer,
    "93c80a630c6d59a37add0615",
    `${id}.db`,
  );
  res.send(upload.data);
});

app.get("/m/*", async (req: Request, res: Response) => {
  const m = req.params[0];
  console.log(JSON.stringify(m));
  res.append("Cache-Control", "immutable, max-age=360");
  res.send({});
});

import Socket from "./io/index";
const server = createServer(app);
const io = Socket(server, app);

// Route for React Router
const routes = ["/", "/info", "/search", "/live", "/test", "/compute", "/compute-console"];
routes.forEach(route => {
  app.get(
    route,
    RateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 600,
    }),
    (req: Request, res: Response) => {
      res.setHeader("Cache-Control", "no-store");
      res.sendFile("build/index.html", { root: "." });
    },
  );
});

// Static file serving
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

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

const uploadStats = async (): Promise<void> => {
  if (!hasB2) return;

  try {
    await uploadToB2(
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

const shutdown = (signal: string) => (err?: Error) => {
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

server.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
