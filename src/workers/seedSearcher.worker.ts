/* eslint-disable no-restricted-globals */
import { SeedSolver } from '../services/seedSearcher';

const seedSolver = new SeedSolver();

self.onmessage = async message => {
  const data = message.data;
  switch (data.type) {
    case "start":
      await seedSolver.start();
      break;
    case "stop":
      await seedSolver.stop();
      break;
    case "update":
      await seedSolver.update(data.config);
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

seedSolver.onFound((data) => {
  self.postMessage({ type: "found", data });
});

export { seedSolver };

export default null as any;
