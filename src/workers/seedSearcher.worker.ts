/* eslint-disable no-restricted-globals */
import { SeedSolver } from '../services/seedSearcher';

const seedSolver = new SeedSolver();

self.onmessage = message => {
  const data = message.data;
  switch (data.type) {
    case "start":
      seedSolver.start();
      break;
    case "stop":
      seedSolver.stop();
      break;
    case "update":
      seedSolver.update(data.config);
      break;
    case "getInfo":
      self.postMessage({ type: "info", data: seedSolver.getInfo() });
      break;
    case "init":
      seedSolver.init(data.offset, data.step);
  };
};

seedSolver.onInfo((data) => {
  self.postMessage({ type: "info", data });
});

export { seedSolver };

export default null as any;
