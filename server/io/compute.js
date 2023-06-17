const cron = require("node-cron");

const B2 = require("backblaze-b2");
B2.prototype.uploadAny = require("@gideo-llc/backblaze-b2-upload-any");

const { User } = require("../db");

const counts = {
  hosts: 0,
  workers: 0,
  appetite: 0,
};
const users = {};

const registerUserSocket = (userId, socketId, type, appetite = 0) => {
  if (!users[userId]) {
    users[userId] = { hosts: new Set(), workers: new Set() };
  }
  if (!users[userId][type].has(socketId)) {
    counts[type]++;
    counts.appetite += appetite;
    users[userId][type].add(socketId);
  }
};
const unregisterUserSocket = (userId, socketId, type, appetite = 0) => {
  if (!users[userId]) {
    return;
  }
  if (users[userId][type].has(socketId)) {
    counts[type]--;
    counts.appetite -= appetite;
    users[userId][type].delete(socketId);
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
        process.env.START_SEARCH_CLUSTER_LAMBDA_CLUSTER
      );
    });
};

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

const transactComputeTime = async (hostId, workerId, hostTime, workerTime) => {
  if (hostId === workerId) {
    // Don't count time spent on self
    return;
  }

  const hostUser = await User.findById(hostId);
  const workerUser = await User.findById(workerId);

  if (!hostUser || !workerUser) {
    return;
  }

  if (hostUser.compute.providedComputeLeft) {
    hostUser.compute.providedComputeLeft -= hostTime;
    if (hostUser.compute.providedComputeLeft < 0) {
      hostUser.compute.providedComputeLeft = 0;
    }
  } else {
    hostUser.compute.patreonComputeLeft -= hostTime;
    if (hostUser.compute.patreonComputeLeft < 0) {
      hostUser.compute.patreonComputeLeft = 0;
    }
  }
  workerUser.compute.providedComputeLeft += workerTime;

  await hostUser.save();
  await workerUser.save();
};

const handleCompute = (socket, io) => {
  let computeUserId;
  let user;
  let computeAppetite = 0;

  const register = async (type, config, cb) => {
    if (!config.sessionToken && !config.userId) {
      return;
    }

    // Check that the version matches at least MINOR
    const [major, minor] = process.env.npm_package_version.split(".");
    const [clientMajor, clientMinor] = config.version.split(".");
    if (major !== clientMajor || minor !== clientMinor) {
      socket.emit("compute:version_mismatch", {
        serverVersion: process.env.npm_package_version,
        clientVersion: config.version,
      });
      return;
    }

    user = (await User.findOne({ sessionToken: config.sessionToken })) || (await User.findOne({ _id: config.userId }));
    if (!user) {
      socket.emit("compute:unauthorized");
      return;
    }

    computeAppetite = config.appetite || 0;
    computeUserId = user.id;

    registerUserSocket(computeUserId, socket.id, type, config.appetite || 0);
    if (type === "hosts") {
      echoedCall(pingLambda, 5, 10);
    }
    cb("ok");
  };

  socket.on("compute:host:register", (config, cb) => register("hosts", config, cb));
  socket.on("compute:host:unregister", () => {
    unregisterUserSocket(computeUserId, socket.id, "hosts");
  });
  socket.on("compute:worker:register", (config, cb) => register("workers", config, cb));
  socket.on("compute:worker:unregister", () => {
    unregisterUserSocket(computeUserId, socket.id, "workers", computeAppetite);
  });
  socket.on("compute:workers", async cb => {
    const workers = counts.workers;
    cb(workers);
  });

  socket.on("compute:need_job", async (appetite, cb) => {
    // Worker asks for a job, we find a host,
    // ask it for a job, and send it to the worker

    const usersHosts = users[computeUserId]?.hosts;
    // Prioritize hosts of the user, randomly
    let hostId;
    if (usersHosts?.size > 0) {
      hostId = randomFromArray([...usersHosts]);
    } else {
      // If no hosts of the user, pick a random host, but check that it has compute left
      const hostsWithCompute = Object.values(users).flatMap(u => (u.computeLeft > 0 ? [...u.hosts] : []));
      hostId = randomFromArray(hostsWithCompute);
    }
    if (!hostId) {
      cb();
      return;
    }

    // Hack - there should be a better way to handle getting specific sockets;
    const host = io.sockets.sockets.get(hostId);
    if (!host) {
      return;
    }

    host.emit("compute:get_job", appetite, data => {
      // job from host
      data.hostId = hostId;
      // Track the time it takes to compute a job
      pendingJobs[`${hostId}:${data.chunkId}`] = {
        hostId,
        workerId: socket.id,
        appetite,
        start: Date.now(),
      };

      // Sent to the worker, which will send its result in the compute:done event
      cb(data);
    });
  });

  socket.on("compute:done", async ({ hostId, result, chunkId }) => {
    // Worker sends its result to the host
    const host = io.sockets.sockets.get(hostId);
    if (!host) {
      return;
    }
    const job = pendingJobs[`${hostId}:${chunkId}`];
    if (!job) {
      return;
    }

    // This is a compromise to make sure that the worker doesn't get penalized for
    // being fast. It's not a perfect solution, but it's better than nothing.
    // This works because of the "smart" compute time target in the client
    // 5 seconds of compute is 5 seconds of work for an 18-core CPU
    const computeCredits = (Date.now() - job.start) * (job.appetite / 18);

    const hostUserId = Object.keys(users).find(k => users[k].hosts.has(hostId));
    const workerUserId = Object.keys(users).find(k => users[k].workers.has(socket.id));

    await transactComputeTime(hostUserId, workerUserId, computeCredits, computeCredits);

    delete pendingJobs[`${hostId}:${chunkId}`];
    host.emit("compute:done", { result, chunkId });
  });

  socket.on("disconnect", () => {
    unregisterUserSocket(computeUserId, socket.id, "hosts");
    unregisterUserSocket(computeUserId, socket.id, "workers", computeAppetite);
  });
};

cron.schedule("*/10 * * * * *", async () => {
  const connectedUsers = Object.keys(users);
  const dbUsers = await User.find({ _id: { $in: connectedUsers } });
  dbUsers.forEach(u => {
    users[u.id].computeLeft = u.compute.providedComputeLeft + u.compute.patreonComputeLeft;
  });
});

module.exports = { handleCompute, counts };
