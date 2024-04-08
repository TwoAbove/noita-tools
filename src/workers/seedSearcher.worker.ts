/* eslint-disable no-restricted-globals */
import { Remote, wrap, releaseProxy, proxy, expose } from "comlink";
import { SeedSearcher } from "../services/seedSearcher";

const seedSearcher = new SeedSearcher();

self.onmessage = async message => {
  try {
    const data = message.data;
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
        self.postMessage({ type: "info", data: seedSearcher.getInfo() });
        break;
      case "init":
        seedSearcher.init(data.offset, data.step);
    }
  } catch (e) {
    console.error(e);
  }
};

seedSearcher.onInfo(data => {
  self.postMessage({ type: "info", data });
});

seedSearcher.onFound(data => {
  self.postMessage({ type: "found", data });
});

expose(seedSearcher);

export { seedSearcher };

export default null as any;
