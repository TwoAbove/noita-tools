export const counts = {
  hosts: 0,
  workers: 0,
  appetite: 0,
};

const sockets = {
  hosts: new Set(),
  workers: new Set(),
};

const registerSocket = (socketId, type, appetite = 0) => {
  if (!sockets[type].has(socketId)) {
    counts[type]++;
    counts.appetite += appetite;
    sockets[type].add(socketId);
  }
};

const unregisterSocket = (socketId, type, appetite = 0) => {
  if (sockets[type].has(socketId)) {
    counts[type]--;
    counts.appetite -= appetite;
    sockets[type].delete(socketId);
  }
};

const pingLambda = () => {
  if (!process.env.START_SEARCH_CLUSTER_LAMBDA_ENDPOINT) {
    return;
  }

  return fetch(process.env.START_SEARCH_CLUSTER_LAMBDA_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      hosts: counts.hosts,
      cluster: process.env.START_SEARCH_CLUSTER_LAMBDA_CLUSTER,
      bearer: process.env.START_SEARCH_CLUSTER_LAMBDA_BEARER,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .catch(console.error)
    .then(() => {
      console.log(
        "Pinged lambda",
        process.env.START_SEARCH_CLUSTER_LAMBDA_ENDPOINT,
        counts.hosts,
        process.env.START_SEARCH_CLUSTER_LAMBDA_CLUSTER,
      );
    });
};

setInterval(() => {
  console.info(sockets);
  if (counts.hosts > 0) {
    pingLambda();
  }
}, 10000);

// Make a function be called n times with backoff. ex: 0, 10, 100, 1000, 10000 seconds from now
const echoedCall = (fn, count, backoff) => {
  if (count === 0) {
    return;
  }
  fn();
  setTimeout(() => echoedCall(fn, count - 1, backoff * 10), backoff * 1000);
};

const randomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

// Track the time it takes to compute a job
const pendingJobs = {};

export const handleCompute = (socket, io) => {
  let computeAppetite = 0;

  const register = async (type, config, cb) => {
    const [configMajor, configMinor] = config.version.split(".");
    const [serverMajor, serverMinor] = process.env.npm_package_version.split(".");

    if (configMajor !== serverMajor) {
      socket.emit("compute:version_mismatch", {
        serverVersion: process.env.npm_package_version,
        clientVersion: config.version,
      });
      return;
    }

    computeAppetite = config.appetite || 0;
    registerSocket(socket.id, type, computeAppetite);

    cb("ok");
  };

  socket.on("compute:host:register", (config, cb) => register("hosts", config, cb));
  socket.on("compute:host:unregister", () => {
    unregisterSocket(socket.id, "hosts");
  });

  socket.on("compute:worker:register", (config, cb) => register("workers", config, cb));
  socket.on("compute:worker:unregister", () => {
    unregisterSocket(socket.id, "workers", computeAppetite);
  });

  socket.on("compute:workers", async cb => {
    cb(counts.workers);
  });

  socket.on("compute:need_job", async (appetite, cb) => {
    // Pick a random host
    const hostId = randomFromArray([...sockets.hosts]);
    if (!hostId) {
      cb();
      return;
    }

    const host = io.sockets.sockets.get(hostId);
    if (!host) {
      return;
    }

    host.emit("compute:get_job", appetite, data => {
      data.hostId = hostId;
      pendingJobs[`${hostId}:${data.chunkId}`] = {
        hostId,
        workerId: socket.id,
        appetite,
        start: Date.now(),
      };
      cb(data);
    });
  });

  socket.on("compute:done", async ({ hostId, result, chunkId }) => {
    const host = io.sockets.sockets.get(hostId);
    if (!host) {
      return;
    }

    delete pendingJobs[`${hostId}:${chunkId}`];
    host.emit("compute:done", { result, chunkId });
  });

  socket.on("disconnect", () => {
    unregisterSocket(socket.id, "hosts");
    unregisterSocket(socket.id, "workers", computeAppetite);
  });
};
