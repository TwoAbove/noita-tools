import { Remote, wrap, releaseProxy, proxy } from 'comlink';
import { ILogicRules, IRules } from './SeedInfo/infoHandler/IRule';
import * as seedSearcher from './seedSearcher';

export class WorkerHandler extends EventTarget {
  latestData?: ReturnType<seedSearcher.SeedSearcher['getInfo']>;
  worker: Worker;
  comlinkWorker: Remote<seedSearcher.SeedSearcher>;

  constructor(offset: number, step: number) {
    super();
    this.worker = new Worker(
      new URL('../workers/seedSearcher.worker.ts', import.meta.url)
    );
    this.comlinkWorker = wrap(this.worker);
    this.worker.postMessage({ type: 'init', offset, step });
    this.worker.addEventListener('message', ({ data }) => {
      switch (data.type) {
        case 'info': {
          this.latestData = data.data;
          if (data.data.foundSeed) {
            this.dispatchEvent(
              new CustomEvent('foundSeed', { detail: data.data })
            );
          }
          break;
        }
        case 'found': {
          this.dispatchEvent(
            new CustomEvent('foundSeedAll', { detail: data.data })
          );
        }
      }
    });
  }

  async searchChunk(from: number, to: number, rules: ILogicRules) {
    await this.comlinkWorker.update({
      findAll: true,
      currentSeed: from,
      seedEnd: to,
      rules
    })
    const res = await this.comlinkWorker.findSync(from, to);

    return res;
  }

  async ready() {
    await this.comlinkWorker.ready();
  }

  terminate() {
    this.worker.terminate();
  }
}

export default class SeedSolver {
  public workerList: WorkerHandler[] = [];
  startTime!: number;

  foundSeeds: string[] = [];

  workersReadyPromise: Promise<void>;

  constructor(workerCount: number = 1, stopOnFind = true) {
    const workerReady: Promise<void>[] = [];
    for (let i = 0; i < workerCount; i++) {
      const worker = new WorkerHandler(i, workerCount);
      worker.addEventListener('foundSeed', e => {
        if (stopOnFind) {
          this.stop();
        }
      });
      worker.addEventListener('foundSeedAll', (e: any) => {
        const seed = e.detail.foundSeed;
        this.foundSeeds.push(seed);
      });
      this.workerList.push(worker);
      workerReady.push(worker.ready());
    }
    this.workersReadyPromise = Promise.allSettled(workerReady).catch(e => console.error(e)).then(() => { console.log('workers ready') });
  }

  public destroy() {
    for (const worker of this.workerList) {
      worker.terminate();
    }
  }

  public update(config: seedSearcher.ISeedSearcherConfig) {
    for (const worker of this.workerList) {
      worker.worker.postMessage({ type: 'update', config });
    }
  }

  public start() {
    this.startTime = new Date().getTime();
    for (const worker of this.workerList) {
      worker.worker.postMessage({ type: 'start' });
    }
  }

  public stop() {
    for (const worker of this.workerList) {
      worker.worker.postMessage({ type: 'stop' });
    }
  }

  public hardGetInfo() {
    for (const worker of this.workerList) {
      worker.worker.postMessage({ type: 'getInfo' });
    }
  }

  public async searchChunk(
    from: number,
    to: number,
    rules: ILogicRules
  ) {
    await this.workersReadyPromise;

    const subChunkSize = Math.ceil((to - from) / this.workerList.length);

    const chunkConfigs = new Array(this.workerList.length).fill(0).map((_, i) => {
      return {
        subFrom: from + subChunkSize * i,
        subTo: Math.min(from + subChunkSize * (i + 1), to)
      }
    });

    const res: number[] = [];

    await Promise.allSettled(this.workerList.map(async (worker, i) => {
      const { subFrom, subTo } = chunkConfigs[i];
      const r = await worker.searchChunk(subFrom, subTo, rules);
      res.push(...r);
    }));

    return res;
  }

  public getInfo(): ReturnType<seedSearcher.SeedSearcher['getInfo']>[] {
    const allInfo = this.workerList
      .map(worker => worker.latestData!)
      .filter(Boolean);
    allInfo.sort((a, b) => a.currentSeed - b.currentSeed);
    if (allInfo.length === 0) {
      return [];
    }
    const res = allInfo.reduce(
      (acc, cur) => {
        acc.count += cur.count;
        acc.currentSeed = Math.min(
          acc.currentSeed || cur.currentSeed,
          cur.currentSeed
        );
        acc.running = acc.running || cur.running;
        acc.avgExecTime = cur.avgExecTime;
        return acc;
      },
      { count: 0 } as ReturnType<seedSearcher.SeedSearcher['getInfo']>
    );
    const duration = new Date().getTime() - this.startTime;
    const rate = res.currentSeed / duration;
    (res as any).msLeft = Math.floor((2_147_483_645 - res.currentSeed) / rate);
    return [res, ...allInfo];
  }
}
