/* eslint-disable no-restricted-globals */

import { parentPort } from "worker_threads";
import { Remote, wrap, releaseProxy, proxy, expose } from 'comlink';
import nodeEndpoint from 'comlink/dist/umd/node-adapter.js';
import { SeedSearcher } from '../services/seedSearcher';

const seedSearcher = new SeedSearcher();

parentPort!.on('message', async message => {
  const data = message;
  switch (data.type) {
    case "start":
      await seedSearcher.start();
      break;
    case "stop":
      await seedSearcher.stop();
      break;
    case "update":
      await seedSearcher.update(data.config);
      break;
    case "getInfo":
      parentPort!.postMessage({ type: "info", data: seedSearcher.getInfo() });
      break;
    case "init":
      seedSearcher.init(data.offset, data.step);
  };
});

seedSearcher.onInfo((data) => {
  parentPort!.postMessage({ type: "info", data });
});

seedSearcher.onFound((data) => {
  parentPort!.postMessage({ type: "found", data });
});

expose(seedSearcher, nodeEndpoint(parentPort!));

export { seedSearcher };

export default null as any;
