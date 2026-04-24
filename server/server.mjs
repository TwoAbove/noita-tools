import express, { static as expressStatic } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { schedule } from "node-cron";
import multer from "multer";
import RateLimit from "express-rate-limit";

import B2 from "backblaze-b2";
import { randomUUID } from "crypto";

import { createServer } from "http";

import { genSessionCookie } from "./helpers.mjs";
import { logger } from "./logger.mjs";
import { scraperGuard } from "./scraperGuard.mjs";

const PORT = process.env.PORT || 3001;

const hasB2 = process.env.B2_APP_KEY_ID && process.env.B2_APP_KEY;

const b2 = new B2({
  applicationKeyId: process.env.B2_APP_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

const app = express();

app.set("trust proxy", 2);

app.use(scraperGuard);
app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();
  const request = {
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    ip: req.ip,
    referrer: req.get("referer") || req.get("referrer") || "",
    userAgent: req.get("user-agent") || "",
  };

  res.on("finish", () => {
    logger.http("request", {
      ...request,
      status: res.statusCode,
      bytes: res.getHeader("content-length"),
      responseTimeMs: Number(process.hrtime.bigint() - startedAt) / 1e6,
    });
  });

  next();
});
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
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return Math.floor((tomorrow - now) / 1000);
};

class DailySeedCache {
  constructor() {
    this.seed = null;
    this.lock = false;
  }

  async fetchSeed() {
    if (this.lock) {
      while (this.lock) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
      return;
    }

    this.lock = true;

    try {
      const response = await fetch("http://takapuoli.noitagame.com/callback/", {
        timeout: 5000,
        headers: {
          "User-Agent": "Noitool/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.text();
      const [versionHash, dailySeed, practiceSeed, x] = data.split(";");

      this.seed = dailySeed.trim();

      daily.push([new Date().toISOString(), data]);
    } catch (error) {
      logger.error("Failed to fetch daily seed", error);
      throw error;
    } finally {
      this.lock = false;
    }
  }

  clear() {
    this.seed = null;
    this.lastFetch = null;
    this.lastFetchDate = null;
  }
}

const dailySeedCache = new DailySeedCache();
dailySeedCache.fetchSeed();
schedule("*/15 * * * *", async () => {
  await dailySeedCache.fetchSeed();
});

app.get("/api/daily-seed", async (req, res) => {
  try {
    const dailySeed = await dailySeedCache.seed;

    if (!dailySeed) {
      throw new Error("Daily seed not available");
    }

    // We can cache this till 00:00 UTC - changes daily
    res.append("Cache-Control", `max-age=${getSecondsTillUtcMidnight()}`);
    res.append("Content-Type", "application/json");

    res.send({ seed: dailySeed });
  } catch (error) {
    logger.error("Error fetching daily seed", error);
    res.status(503).json({
      error: "Failed to fetch daily seed",
      message: error.message,
    });
  }
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

const uploadToB2 = async (data, bucketId, fileName, maxRetries = 3) => {
  if (!hasB2) {
    return;
  }

  let lastError;
  let attempt = 0;

  while (attempt <= maxRetries) {
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

      if (attempt > 0) {
        logger.info(`Upload succeeded after ${attempt} retries`);
      }

      return upload;
    } catch (error) {
      lastError = error;
      attempt++;

      if (attempt <= maxRetries) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 30000);
        logger.warn(`Upload attempt ${attempt} failed, retrying in ${delay}ms`, error);

        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error(`Upload failed after ${maxRetries} retries`, error);
      }
    }
  }

  throw lastError;
};

const m = multer();
app.post("/api/db_debug/", m.any(), async (req, res) => {
  const id = randomUUID();
  res.send({ id });

  try {
    const upload = await uploadToB2(req.files[0].buffer, "93c80a630c6d59a37add0615", `${id}.db`);
    logger.info(`Debug database uploaded: ${id}.db`);
  } catch (error) {
    logger.error(`Failed to upload debug database ${id}`, error);
  }
});

app.get("/m/*", async (req, res) => {
  const m = req.params[0];
  logger.info("Map ping", { path: m });
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
  logger.error("Unhandled request error", {
    method: req.method,
    url: req.originalUrl,
    error: err,
  });
  res.status(500).send("Server error");
});

server.listen(PORT, () => {
  logger.info(`Running at http://localhost:${PORT}`);
});

const uploadStats = async () => {
  if (!hasB2) {
    return;
  }

  const dataToUpload = { data, stats, daily };
  const fileName = `${new Date().toISOString()}.json`;

  try {
    logger.info(`Uploading daily stats (${data.length + stats.length + daily.length} items)`);

    const upload = await uploadToB2(Buffer.from(JSON.stringify(dataToUpload)), "93c80a630c6d59a37add0615", fileName, 5);

    logger.info(`Daily stats uploaded successfully: ${fileName}`);
    data = [];
    stats = [];
  } catch (e) {
    logger.error("Failed to upload daily stats after all retries", e);
    logger.warn("Data will be preserved for next attempt");
  }
};

schedule("0 0 * * *", uploadStats);

const shutdown = signal => err => {
  if (err) logger.error(`Shutdown requested by ${signal}`, err);
  if (process.env.NODE_ENV !== "production") {
    logger.info("Not Production, exiting non-gracefully");
    process.exit(0);
  }
  setTimeout(() => {
    logger.error("Waited 10s, exiting non-gracefully");
    process.exit(1);
  }, 10000).unref();
  Promise.allSettled([uploadStats(), new Promise(res => server.close(res))]).then(() => {
    logger.info("Gracefully shut down");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM")()).on("SIGINT", () => shutdown("SIGINT")());

process.on("uncaughtException", shutdown("uncaughtException"));
