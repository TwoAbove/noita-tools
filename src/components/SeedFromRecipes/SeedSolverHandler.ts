// import { Remote, wrap, releaseProxy, proxy } from 'comlink';
import SeedSolverWorker from '../../workers/seedCalculator.worker';
import { SeedSolver as _SeedSolver } from '../../services/seedCalculator';

export class WorkerHandler extends EventTarget {
  latestData?: ReturnType<_SeedSolver["getInfo"]>;
  worker: Worker;

  constructor(offset: number, step: number) {
    super();
    this.worker = new SeedSolverWorker();
    this.worker.postMessage({ type: 'init', offset, step });
    this.worker.addEventListener('message', e => {
      switch (e.data.type) {
        case 'info':
          this.latestData = e.data.data;
          if (e.data.foundSeed) {
            this.dispatchEvent(new CustomEvent('foundSeed', { detail: e.data.data }));
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

  public update(config: any) {
    for (const worker of this.workerList) {
      worker.worker.postMessage({ type: 'update', config });
    }
  }

  public start() {
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

  public getInfo(): ReturnType<_SeedSolver["getInfo"]> | undefined {
    const allInfo = this.workerList.map(worker => worker.latestData!).filter(Boolean);
    allInfo.sort((a, b) => a.currentSeed - b.currentSeed);
    if (allInfo.length === 0) {
      return undefined;
    }
    const res = allInfo.reduce((acc, cur) => {
      acc.count += cur.count;
      acc.currentSeed = Math.min(acc.currentSeed || cur.currentSeed, cur.currentSeed);
      if (cur.foundSeed) {
        acc.foundSeed = Math.min(acc.foundSeed || cur.foundSeed, cur.foundSeed);
      }
      acc.running = acc.running || cur.running;
      if (!acc.LC) {
        acc.LC = cur.LC;
      }
      if (!acc.AP) {
        acc.AP = cur.AP;
      }
      acc.apIngredients = cur.apIngredients;
      acc.lcIngredients = cur.lcIngredients;
      return acc;
    }, { count: 0 } as ReturnType<_SeedSolver["getInfo"]>);
    return res;
  }
}
