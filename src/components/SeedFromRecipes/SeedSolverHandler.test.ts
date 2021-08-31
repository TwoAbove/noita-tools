import SeedSolver from './SeedSolverHandler';

jest.mock('../../workers/seedCalculator.worker', () => {
  const { SeedSolver } = jest.requireActual('../../services/seedCalculator');
  const SeedSolverWorker = function () {
    const seedSolver = new SeedSolver();
    seedSolver.cbs = {};
    seedSolver.addEventListener = (type, fn) => {
      seedSolver.cbs[type] = fn;
    };
    seedSolver.cb = (type, data) => {
      seedSolver.cbs[type]({ data });
    };

    seedSolver.onInfo((data) => {
      seedSolver.cb('message', { type: "info", data });
    });
    seedSolver.postMessage = (data) => {
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
          seedSolver.cb('message', { type: "info", data: seedSolver.getInfo() });
          break;
        case "init":
          seedSolver.init(data.offset, data.step);
      };
    };
    return seedSolver;
  };
  return SeedSolverWorker;
});


describe('SeedSolverHandler', () => {
  it('should be defined', () => {
    expect(SeedSolver).toBeDefined();
  });
  it('Should solve', async () => {
    const startFrom = 12341000;
    const seedSolver = new SeedSolver(10);
    await seedSolver.update({
      currentSeed: startFrom,
      lcIngredients: ['water_swamp', 'brass', 'chaotic_polymorphine'],
      apIngredients: ['lava', 'honey', 'blood']
    });
    seedSolver.start();
    const found = await new Promise((res) => {
      setInterval(() => {
        const data = seedSolver.getInfo();
        if (data?.foundSeed) {
          res(data);
        }
      }, 10);
    });
    expect(found.currentSeed).toBe(12341234);
  });
});
