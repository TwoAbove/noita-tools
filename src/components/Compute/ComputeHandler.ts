import { uniqueId } from 'lodash';
import SimpleETA from 'simple-eta';

import { ILogicRules } from '../../services/SeedInfo/infoHandler/IRule';
import { ComputeSocket } from './ComputeSocket';

export interface Status {
  running: boolean;
  chunkStatus: ChunkStatus[];
  numberOfWorkers: number;
  checked: number;
  results: number[];

  estimate: number;
  rate: number;
}

export interface IComputeHandlerConfig {
  searchFrom: number;
  searchTo: number;
  chunkSize: number;
}

export type ChunkStatus = {
  from: number;
  to: number;
  chunkId: string;
  crashId?: NodeJS.Timeout;
  status: 'waiting' | 'pending' | 'done';
};

export default class ComputeHandler {
  running = false;
  numberOfWorkers = 0;

  chunkStatus: ChunkStatus[] = [];
  results: number[] = [];

  searchFrom!: number;
  searchTo!: number;
  chunkSize!: number;
  eta!: ReturnType<typeof SimpleETA>;
  progress = 0;

  constructor(
    public computeSocket: ComputeSocket,
    public rules: ILogicRules,
    public config: IComputeHandlerConfig,
    public onUpdate: (status: Status) => void
  ) {
    setInterval(() => {
      this.computeSocket.io.emit('compute:workers', workers => {
        this.numberOfWorkers = workers;
        this.update();
      });
    }, 5000);
    this.handleJob = this.handleJob.bind(this);

    this.computeSocket.io.on('compute:done', ({ result, chunkId }) => {
      const chunk = this.chunkStatus.find(c => c.chunkId === chunkId);
      if (!chunk) {
        return;
      }
      clearTimeout(chunk.crashId);
      this.progress += chunk.to - chunk.from;
      this.eta.report(this.progress);
      chunk.status = 'done';
      this.results.push(...result);
      this.update();
    });
  }

  setRules(rules: ILogicRules) {
    this.rules = rules;
  }

  updateConfig(newConfig: IComputeHandlerConfig) {
    this.searchFrom = newConfig.searchFrom;
    this.searchTo = newConfig.searchTo;
    this.chunkSize = newConfig.chunkSize;

    const chunkAmount = Math.ceil(
      (this.searchTo - this.searchFrom) / this.chunkSize
    );

    const chunks = new Array(chunkAmount).fill(0).map<ChunkStatus>((_, i) => {
      return {
        chunkId: uniqueId('chunk_'),
        from: this.searchFrom + this.chunkSize * i,
        to: Math.min(this.searchFrom + this.chunkSize * (i + 1), this.searchTo),
        status: 'waiting'
      };
    });
    this.chunkStatus = chunks;
  }

  getStatus(): Status {
    return {
      running: this.running,
      chunkStatus: this.chunkStatus,
      numberOfWorkers: this.numberOfWorkers,
      estimate: this.eta?.estimate(),
      rate: this.eta?.rate(),
      checked: this.progress,
      results: this.results,
    };
  }

  update() {
    this.onUpdate(this.getStatus());
  }

  handleJob(cb) {
    const chunkIndex = this.chunkStatus.findIndex(c => c.status === 'waiting');
    if (chunkIndex === -1) {
      cb({ done: true });
      this.running = false;
      this.computeSocket.io.off('compute:get_job', this.handleJob);
      return;
    }

    const chunk = this.chunkStatus[chunkIndex];

    chunk.status = 'pending';

    chunk.crashId = setTimeout(() => {
      // return it to the "queue"
      console.error('Timed out on chunk', chunk);
      chunk.status = 'waiting';
    }, 1000 * 60 * 60); // Wait about an hour before returning
    // cb({})
    cb({
      rules: this.rules,
      to: chunk.to,
      from: chunk.from,
      chunkId: chunk.chunkId
    });
  }

  async start() {
    if (this.running) {
      return;
    }
    this.eta = SimpleETA({
      min: this.searchFrom,
      max: this.searchTo,
      historyTimeConstant: 30
    });
    this.results = [];
    this.progress = this.searchFrom;
    this.eta.start();
    this.running = true;
    this.computeSocket.io.on('compute:get_job', this.handleJob);
  }

  stop() {
    this.running = false;
    this.computeSocket.io.off('compute:get_job', this.handleJob);
  }
}
