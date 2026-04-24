const levelWeights = {
  debug: 10,
  http: 20,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug");
const minLevel = levelWeights[configuredLevel] || levelWeights.info;
const reservedFields = new Set(["time", "level", "message", "error", "details"]);

const redactString = value =>
  value
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [redacted]")
    .replace(/([?&](?:access_token|refresh_token|client_secret|token)=)[^&\s]+/gi, "$1[redacted]");

const sanitizeHeaders = headers => {
  const source = headers?._headers || headers || {};
  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => {
      if (/cookie|authorization|token|secret/i.test(key)) {
        return [key, "[redacted]"];
      }
      return [key, sanitize(value)];
    }),
  );
};

const sanitize = (value, seen = new WeakSet()) => {
  if (typeof value === "string") {
    return redactString(value);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return "[circular]";
  }
  seen.add(value);

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      status: value.status,
      body: sanitize(value.body, seen),
    };
  }

  if (value.constructor?.name === "Headers") {
    return sanitizeHeaders(value);
  }

  if (value.constructor?.name === "Body") {
    return {
      url: redactString(value.url || ""),
      status: value.status,
      statusText: value.statusText,
      ok: value.ok,
      headers: sanitizeHeaders(value.headers),
      bodyUsed: value.bodyUsed,
    };
  }

  if (value.readable || value.writable || value.constructor?.name?.includes("Stream")) {
    return {
      type: value.constructor?.name || "Stream",
      readable: value.readable,
      writable: value.writable,
    };
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitize(item, seen));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (/cookie|authorization|token|secret/i.test(key)) {
        return [key, "[redacted]"];
      }
      return [key, sanitize(item, seen)];
    }),
  );
};

const mergeField = (entry, key, value) => {
  const targetKey = reservedFields.has(key) ? `_${key}` : key;
  entry[targetKey] = value;
};

const addDetail = (entry, value) => {
  const detail = sanitize(value);

  if (detail && typeof detail === "object" && !Array.isArray(detail)) {
    for (const [key, item] of Object.entries(detail)) {
      mergeField(entry, key, item);
    }
    return;
  }

  if (!entry.details) {
    entry.details = [];
  }
  entry.details.push(detail);
};

const createEntry = (level, args) => {
  const [first, ...rest] = args;
  const entry = {
    time: new Date().toISOString(),
    level,
  };

  if (typeof first === "string") {
    entry.message = sanitize(first);
  } else if (first !== undefined) {
    addDetail(entry, first);
  }

  for (const arg of rest) {
    const value = sanitize(arg);

    if (value && typeof value === "object" && "name" in value && "stack" in value) {
      entry.error = value;
      continue;
    }

    addDetail(entry, value);
  }

  return entry;
};

const stringify = entry => {
  try {
    return JSON.stringify(entry);
  } catch (error) {
    return JSON.stringify({
      time: new Date().toISOString(),
      level: "error",
      message: "Failed to serialize log entry",
      error: sanitize(error),
    });
  }
};

const write = (level, args) => {
  if (levelWeights[level] < minLevel) {
    return;
  }

  const line = stringify(createEntry(level, args));
  const stream = level === "error" || level === "warn" ? process.stderr : process.stdout;
  stream.write(`${line}\n`);
};

export const logger = {
  debug: (...args) => write("debug", args),
  info: (...args) => write("info", args),
  warn: (...args) => write("warn", args),
  error: (...args) => write("error", args),
  http: (...args) => write("http", args),
};
