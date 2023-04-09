import SeedSolver from '../seedSolverHandler';
import SocketHandler, {
  SocketHandlerConfig
} from '../socketHandler';
import { Status } from './ChunkProvider';

export interface ComputeSocketConfig extends SocketHandlerConfig {
  computeId: string;
  seedSolver?: SeedSolver;

  isHost?: boolean;
}

export class ComputeSocket extends SocketHandler {
  computeId: string;
  seedSolver?: SeedSolver;
  isHost: boolean;

  jobName?: string;
  jobStats?: Status;
  chunkTo?: number;
  chunkFrom?: number;

  running = false;

  constructor(config: ComputeSocketConfig) {
    super(config);

    this.computeId = config.computeId;
    this.seedSolver = config.seedSolver;
    this.isHost = config.isHost || false;
  }

  configIO(): void {
    this.io.on('connect', () => {
      this.ready = true;
      this.io.emit(this.isHost ? 'host' : 'join', this.computeId, this.onUpdate);
      // this.io.emit('join', this.computeId, this.onUpdate);
      this.connected = true;
      this.onUpdate();
    });

    this.io.on('disconnect', reason => {
      console.log('disconnected: ', reason);
      this.connected = false;
      this.onUpdate();
    });
  }

  async start() {
    if (this.running) {
      return;
    }
    if (!this.seedSolver) {
      console.error('No seed solver. Running from Console?');
      return;
    }
    this.running = true;
    this.onUpdate();
    while (this.running) {
      await new Promise<void>(res => {
        const t = setTimeout(() => res(), 10000);
        this.io.emit('compute:need_job', this.seedSolver?.workerList.length, async (data, cb) => {
          try {
            clearTimeout(t);
            if (!data || data.done) {
              setTimeout(() => res(), 5000);
              return;
            }


            const { from, to, jobName, rules, hostId, chunkId, stats } = data;

            this.jobName = jobName;
            this.jobStats = stats;
            this.chunkTo = to;
            this.chunkFrom = from;
            this.onUpdate();

            const result = await this.seedSolver!.searchChunk(from, to, rules);

            this.io.emit('compute:done', { hostId, result, chunkId });

            this.jobName = '';
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
    console.log('Stop');
    this.onUpdate();
  }
}
