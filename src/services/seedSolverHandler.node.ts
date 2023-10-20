import { Worker } from "worker_threads";

import { Remote, wrap, releaseProxy, proxy } from "comlink";
import { ILogicRules, IRules } from "./SeedInfo/infoHandler/IRule";
import * as seedSearcher from "./seedSearcher";
import nodeEndpoint from "comlink/dist/umd/node-adapter.js";
import EventEmitter from "events";
import { getTreeTools } from "../components/SearchSeeds/node";

export class WorkerHandler extends EventTarget {
  latestData?: ReturnType<seedSearcher.SeedSearcher["getInfo"]>;
  worker: Worker;
  comlinkWorker: Remote<seedSearcher.SeedSearcher>;

  constructor(offset: number, step: number) {
    super();
    this.worker = new Worker(new URL("../workers/seedSearcher.worker.node.ts", import.meta.url));
    this.comlinkWorker = wrap(nodeEndpoint(this.worker));
    this.worker.postMessage({ type: "init", offset, step });
  }

  async searchChunk(from: number, to: number, rules: ILogicRules) {
    await this.comlinkWorker.update({
      findAll: true,
      currentSeed: from,
      seedEnd: to,
      rules,
    });
    const res = await this.comlinkWorker.findSync(from, to);

    return res;
  }

  async ready() {
    await this.comlinkWorker.ready();
  }

  terminate() {
    return this.worker.terminate();
  }
}

export default class SeedSolver {
  public workerList: WorkerHandler[] = [];
  startTime!: number;

  workersReadyPromise: Promise<void>;

  constructor(workerCount: number = 1, stopOnFind = true) {
    const workerReady: Promise<void>[] = [];
    for (let i = 0; i < workerCount; i++) {
      const worker = new WorkerHandler(i, workerCount);
      this.workerList.push(worker);
      workerReady.push(worker.ready());
    }
    this.workersReadyPromise = Promise.allSettled(workerReady)
      .catch(e => console.error(e))
      .then(() => {
        console.log("workers ready");
      });
  }

  public destroy() {
    const promises: Promise<unknown>[] = [];
    for (const worker of this.workerList) {
      promises.push(worker.terminate());
    }
    return Promise.all(promises);
  }

  public update(config: seedSearcher.ISeedSearcherConfig) {
    for (const worker of this.workerList) {
      worker.worker.postMessage({ type: "update", config });
    }
  }

  public start() {
    this.startTime = new Date().getTime();
    for (const worker of this.workerList) {
      worker.worker.postMessage({ type: "start" });
    }
  }

  public stop() {
    for (const worker of this.workerList) {
      worker.worker.postMessage({ type: "stop" });
    }
  }

  public hardGetInfo() {
    for (const worker of this.workerList) {
      worker.worker.postMessage({ type: "getInfo" });
    }
  }

  public async searchChunk(from: number, to: number, rules: ILogicRules) {
    await this.workersReadyPromise;

    // If we have map rules, then we'll also check if we need to subdivide the chunk even
    // more so that GC will have time to clean up the large memory allocations for maps
    const tt = getTreeTools("id", "rules");

    const hasMapRules = tt.dfs(rules, n => {
      return n.type === "map";
    });

    let subChunkSize = Math.ceil((to - from) / this.workerList.length);
    if (hasMapRules) {
      subChunkSize = Math.min(subChunkSize, 100); // TODO: Figure out map complexity (by map size?) and adjust further
    }

    const numberOfChunks = Math.ceil((to - from) / subChunkSize);

    const chunkConfigs = new Array(numberOfChunks).fill(0).map((_, i) => {
      return {
        subFrom: from + subChunkSize * i,
        subTo: Math.min(from + subChunkSize * (i + 1), to),
      };
    });

    const res: number[] = [];

    let checked = 0;

    // This works by awaiting on searchChunk(), so a worker needs to finish their current chunk
    // before they can start the next one.
    await Promise.all(
      this.workerList.map(async (worker, i) => {
        for (let config = chunkConfigs.pop(); config; config = chunkConfigs.pop()) {
          const { subFrom, subTo } = config;
          checked += subTo - subFrom;
          const r = await worker.searchChunk(subFrom, subTo, rules);
          res.push(...r);
          await new Promise(res => setTimeout(res, 0));
        }
      })
    );

    return res;
  }
}
