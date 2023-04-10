import { uniqueId } from 'lodash';
import SimpleETA from 'simple-eta';

export interface Status {
  running: boolean;
  checked: number;
  results: number[];
  currentChunk: number;
  estimate: number;
  rate: number;
}

export interface IComputeHandlerConfig {
  searchFrom: number;
  searchTo: number;
  chunkSize: number;
  etaHistoryTimeConstant: number;

  chunkProcessingTimeTarget: number;

  jobName?: string;
}

export type ChunkStatus = {
  chunkId: string;
  from: number;
  to: number;
  appetite: number;
  status: 'waiting' | 'pending' | 'done';
  crashId?: NodeJS.Timeout;
};

export class ChunkProvider {
  eta: ReturnType<typeof SimpleETA>;
  progress = 0;
  startTime = Date.now();

  results: number[] = [];

  ratePerAppetiteArr: number[] = [];
  ratePerAppetite = 0;

  chunkStartTimes: { [chunkId: string]: number } = {};

  constructor(public config: IComputeHandlerConfig) {
    this.eta = SimpleETA({
      min: this.config.searchFrom,
      max: this.config.searchTo,
      historyTimeConstant: this.config.etaHistoryTimeConstant
    });
  }

  unCommittedChunks: ChunkStatus[] = [];
  orphanChunks: ChunkStatus[] = [];

  commitChunk(chunkId: string, results: number[]) {
    const chunk = this.unCommittedChunks.splice(
      this.unCommittedChunks.findIndex(c => c.chunkId === chunkId),
      1
    )[0];

    if (!chunk) {
      return;
    }

    clearTimeout(chunk.crashId!);

    const chunkSize = chunk.to - chunk.from;
    this.progress += chunkSize;
    this.eta.report(this.progress);
    chunk.status = 'done';
    this.results.push(...results);

    this.ratePerAppetiteArr.push(
      ((chunkSize / (Date.now() - this.chunkStartTimes[chunk.chunkId])) * 1000) /
      chunk.appetite
    );
    if (this.ratePerAppetiteArr.length > 10) {
      this.ratePerAppetiteArr.shift();
    }

    this.ratePerAppetite =
      this.ratePerAppetiteArr.reduce((a, b) => a + b, 0) /
      this.ratePerAppetiteArr.length;

    delete this.chunkStartTimes[chunk.chunkId];
  }

  registerChunk(chunk: ChunkStatus) {
    const crashId = setTimeout(() => {
      this.unCommittedChunks.splice(
        this.unCommittedChunks.findIndex(c => c.chunkId === chunk.chunkId),
        1
      );
      chunk.status = 'waiting';
      this.orphanChunks.push(chunk);
    }, 1000 * 60 * 5);
    this.chunkStartTimes[chunk.chunkId] = Date.now();
    chunk.crashId = crashId;
    this.unCommittedChunks.push(chunk);
  }

  // Appetite is a rough measure of how much work the worker can do
  // for now, this is just the number of workers
  getNextChunk(appetite: number): ChunkStatus | null {
    const {
      searchFrom,
      searchTo,
      chunkSize,
      etaHistoryTimeConstant,
      chunkProcessingTimeTarget
    } = this.config;

    if (searchFrom >= searchTo) {
      return null;
    }

    if (this.orphanChunks.length > 0) {
      const chunk = this.orphanChunks.shift()!;
      chunk.status = 'pending';
      this.registerChunk(chunk);
      return chunk;
    }

    // confidence is a measure of how confident we are in the ETA
    // and will be used to adjust the ideal chunk size
    const confidence = Math.min(
      (Date.now() - this.startTime) / etaHistoryTimeConstant,
      1
    );

    // modified chunk size that targets chunkProcessingTimeTarget seconds per chunk
    const idealChunkSize = Math.max(
      Math.round(
        this.ratePerAppetite * appetite * confidence * chunkProcessingTimeTarget
      ),
      chunkSize
    );

    const chunk: ChunkStatus = {
      chunkId: uniqueId('chunk_'),
      from: searchFrom,
      to: Math.min(searchFrom + idealChunkSize, searchTo),
      status: 'pending',
      appetite
    };

    // Since this chunk will be either committed or orphaned, we can update the searchFrom
    this.config.searchFrom = chunk.to;

    this.registerChunk(chunk);

    return chunk;
  }
}
