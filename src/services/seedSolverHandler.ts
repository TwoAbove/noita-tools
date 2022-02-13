// import { Remote, wrap, releaseProxy, proxy } from 'comlink';
import { SeedSolver as _SeedSolver, ISeedSolverConfig } from './seedSearcher';

export class WorkerHandler extends EventTarget {
  latestData?: ReturnType<_SeedSolver["getInfo"]>;
  worker: Worker;

  constructor(offset: number, step: number) {
    super();
    this.worker = new Worker(new URL('../workers/seedSearcher.worker.ts', import.meta.url));
    this.worker.postMessage({ type: 'init', offset, step });
    this.worker.addEventListener('message', ({ data }) => {
      switch (data.type) {
        case 'info':
          this.latestData = data.data;
          if (data.data.foundSeed) {
            this.dispatchEvent(new CustomEvent('foundSeed', { detail: data.data }));
          }
          break;
      }
    });
  }
  terminate() {
    this.worker.terminate();
  }
}

export default class SeedSolver {
  public workerList: WorkerHandler[] = [];
  startTime!: number;

  constructor(workerCount: number = 1) {
    for (let i = 0; i < workerCount; i++) {
      const worker = new WorkerHandler(i, workerCount);
      worker.addEventListener('foundSeed', e => {
        this.stop();
      });
      this.workerList.push(worker);
    }
  }

  public destroy() {
    for (const worker of this.workerList) {
      worker.terminate();
    }
  };

  public update(config: ISeedSolverConfig) {
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

  public getInfo(): ReturnType<_SeedSolver["getInfo"]>[] {
    const allInfo = this.workerList.map(worker => worker.latestData!).filter(Boolean);
    allInfo.sort((a, b) => a.currentSeed - b.currentSeed);
    if (allInfo.length === 0) {
      return [];
    }
    const hasFoundSeed = allInfo.filter(info => info.foundSeed);
    if (hasFoundSeed.length) {
      return hasFoundSeed;
    }
    const res = allInfo.reduce((acc, cur) => {
      acc.count += cur.count;
      acc.currentSeed = Math.max(acc.currentSeed || cur.currentSeed, cur.currentSeed);
      acc.running = acc.running || cur.running;
      acc.avgExecTime = cur.avgExecTime;
      return acc;
    }, { count: 0 } as ReturnType<_SeedSolver["getInfo"]>);
    const duration = new Date().getTime() - this.startTime;
    const rate = res.currentSeed / duration;
    (res as any).msLeft = Math.floor((4_294_967_294 - res.currentSeed) / rate);
    return [res];
  }
}
