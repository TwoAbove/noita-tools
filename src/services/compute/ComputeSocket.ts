import SeedSolver from "../seedSolverHandler";
import SocketHandler, { SocketHandlerConfig } from "../socketHandler";
import { Status } from "./ChunkProvider";

export interface ComputeSocketConfig extends SocketHandlerConfig {
  version: string;

  sessionToken?: string;
  userId?: string;

  seedSolver?: SeedSolver;

  isHost?: boolean;

  onDone?: () => void;
}

export class ComputeSocket extends SocketHandler {
  version: string;

  sessionToken?: string;
  userId?: string;

  seedSolver?: SeedSolver;
  isHost: boolean;

  jobName?: string;
  jobStats?: Status;
  chunkTo?: number;
  chunkFrom?: number;

  running = false;

  onDone?: () => void;

  constructor(config: ComputeSocketConfig) {
    super(config);

    this.version = config.version;

    this.sessionToken = config.sessionToken;
    this.userId = config.userId;
    this.seedSolver = config.seedSolver;
    this.isHost = config.isHost || false;
    this.onDone = config.onDone;
  }

  configIO(): void {
    this.io.on("connect", () => {
      this.ready = true;
      // this.io.emit('join', this.computeId, this.onUpdate);
      this.connected = true;
      this.onUpdate();
      if (this.running) {
        this.register();
      }
    });

    this.io.on("disconnect", reason => {
      console.log("disconnected: ", reason);
      this.connected = false;
      this.onUpdate();
    });
  }

  register() {
    this.io.emit(
      this.isHost ? "compute:host:register" : "compute:worker:register",
      {
        version: this.version,
        userId: this.userId,
        sessionToken: this.sessionToken,
        appetite: this.seedSolver?.workerList.length,
      },
      this.onUpdate
    );
  }
  unregister() {
    this.io.emit(
      this.isHost ? "compute:host:unregister" : "compute:worker:unregister",
      {
        version: this.version,
        userId: this.userId,
        sessionToken: this.sessionToken,
        appetite: this.seedSolver?.workerList.length,
      },
      this.onUpdate
    );
  }

  async start() {
    if (this.running) {
      return;
    }
    if (!this.seedSolver) {
      console.error("No seed solver. Running from Console?");
      return;
    }
    this.running = true;
    this.onUpdate();
    while (this.running) {
      await new Promise<void>(res => {
        const t = setTimeout(() => res(), 10000);
        this.io.emit("compute:need_job", this.seedSolver?.workerList.length, async data => {
          try {
            clearTimeout(t);
            if (!data || data.done) {
              setTimeout(() => res(), 5000);
              this.onDone?.();
              return;
            }

            const { from, to, jobName, rules, hostId, chunkId, stats } = data;

            this.jobName = jobName;
            this.jobStats = stats;
            this.chunkTo = to;
            this.chunkFrom = from;
            this.onUpdate();

            const result = await this.seedSolver!.searchChunk(from, to, rules);

            this.io.emit("compute:done", { hostId, result, chunkId });

            this.jobName = "";
            this.jobStats = undefined;
            this.chunkTo = 0;
            this.chunkFrom = 0;
            this.onUpdate();

            res();
          } catch (e) {
            this.stop();
            res();
            throw e;
          }
        });
      });
    }
  }

  stop() {
    this.running = false;
    console.log("Stop");
    this.onUpdate();
    this.unregister();
    this.io.disconnect();
  }
}
