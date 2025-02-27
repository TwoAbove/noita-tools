import { Socket, Server as SocketIOServer } from "socket.io";

interface ComputeCounts {
  hosts: number;
  workers: number;
  appetite: number;
}

interface SocketSets {
  hosts: Set<string>;
  workers: Set<string>;
}

interface PendingJob {
  hostId: string;
  workerId: string;
  appetite: number;
  start: number;
}

interface PendingJobs {
  [key: string]: PendingJob;
}

interface ComputeConfig {
  version: string;
  appetite?: number;
}

export const counts: ComputeCounts = {
  hosts: 0,
  workers: 0,
  appetite: 0,
};

const sockets: SocketSets = {
  hosts: new Set(),
  workers: new Set(),
};

const registerSocket = (socketId: string, type: keyof SocketSets, appetite = 0): void => {
  if (!sockets[type].has(socketId)) {
    counts[type]++;
    counts.appetite += appetite;
    sockets[type].add(socketId);
  }
};

const unregisterSocket = (socketId: string, type: keyof SocketSets, appetite = 0): void => {
  if (sockets[type].has(socketId)) {
    counts[type]--;
    counts.appetite -= appetite;
    sockets[type].delete(socketId);
  }
};

const pingLambda = async (): Promise<void> => {
  if (!process.env.START_SEARCH_CLUSTER_LAMBDA_ENDPOINT) {
    return;
  }

  try {
    await fetch(process.env.START_SEARCH_CLUSTER_LAMBDA_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        hosts: counts.hosts,
        cluster: process.env.START_SEARCH_CLUSTER_LAMBDA_CLUSTER,
        bearer: process.env.START_SEARCH_CLUSTER_LAMBDA_BEARER,
      }),
    });
  } catch (e) {
    console.error("Failed to ping lambda:", e);
  }
};

const randomFromArray = <T>(array: Set<T>): T | undefined => {
  const arr = Array.from(array);
  return arr[Math.floor(Math.random() * arr.length)];
};

const pendingJobs: PendingJobs = {};

export const handleCompute = (socket: Socket, io: SocketIOServer): void => {
  let computeAppetite = 0;

  const register = async (type: keyof SocketSets, config: ComputeConfig, cb: (status: string) => void) => {
    const [configMajor, configMinor] = config.version.split(".");
    const [serverMajor, serverMinor] = process.env.npm_package_version?.split(".") || ["0", "0"];

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

  socket.on("compute:host:register", (config: ComputeConfig, cb: (status: string) => void) =>
    register("hosts", config, cb),
  );

  socket.on("compute:host:unregister", () => {
    unregisterSocket(socket.id, "hosts");
  });

  socket.on("compute:worker:register", (config: ComputeConfig, cb: (status: string) => void) =>
    register("workers", config, cb),
  );

  socket.on("compute:worker:unregister", () => {
    unregisterSocket(socket.id, "workers", computeAppetite);
  });

  socket.on("compute:workers", (cb: (count: number) => void) => {
    cb(counts.workers);
  });

  socket.on("compute:need_job", async (appetite: number, cb: (data?: any) => void) => {
    // Pick a random host
    const hostId = randomFromArray(sockets.hosts);
    if (!hostId) {
      cb();
      return;
    }

    const host = io.sockets.sockets.get(hostId);
    if (!host) {
      return;
    }

    host.emit("compute:get_job", appetite, (data: any) => {
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

  socket.on("compute:done", async ({ hostId, result, chunkId }: { hostId: string; result: any; chunkId: string }) => {
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
