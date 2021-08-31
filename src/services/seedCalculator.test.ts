import { SeedSolver } from './seedCalculator';
import { MaterialPicker } from '../services/Calculator2';

describe("SeedSolver", () => {
  it('Should find a correct seed', async () => {
    const seed = 12341233;
    // this is correct for seed 12341234
    const seedSolver = new SeedSolver(0, 1);
    seedSolver.update({
      lcIngredients: ['water_swamp', 'brass', 'chaotic_polymorphine'],
      apIngredients: ['lava', 'honey', 'blood']
    });
    seedSolver.currentSeed = seed;
    let foundSeed;
    seedSolver.onInfo((data) => {
      foundSeed = data.foundSeed;
    });
    await seedSolver.start();
    expect(foundSeed).toBe(12341234);
  });

  it('Should correctly iterate seeds in multithreaded', async () => {
    const solvers: SeedSolver[] = [];
    const solverCount = 10;
    const out: number[] = [];
    for (let i = 0; i < solverCount; i++) {
      const s = new SeedSolver();
      s.init(i, solverCount);
      s.infoFreq = 100;
      s.update({
        currentSeed: 0,
        lcIngredients: [...MaterialPicker.LIQUIDS, ...MaterialPicker.ALCHEMY],
        apIngredients: [...MaterialPicker.LIQUIDS, ...MaterialPicker.ALCHEMY]
      });
      s.onInfo((data) => {
        // console.log('data', data)
        out.push(data.currentSeed);
      });
      solvers.push(s);
    }
    await Promise.all(solvers.map(s => s.start()));
    // expect(out.length).toBe(solverCount);
    for (let i = 0; i < solverCount; i++) {
      expect(out).toContain(i);
    }
    await Promise.all(solvers.map(s => s.start()));
    for (let i = 0; i < solverCount * 2; i++) {
      expect(out).toContain(i);
    }
  });

  it('Should find a correct seed multithreaded', async () => {
    const startFrom = 12341000;
    const solvers: SeedSolver[] = [];
    const solverCount = 10;
    const allData: ReturnType<SeedSolver["getInfo"]>[] = [];
    for (let i = 0; i < solverCount; i++) {
      const s = new SeedSolver();
      s.init(i, solverCount);
      s.infoFreq = 1;
      s.update({
        currentSeed: startFrom,
        lcIngredients: ['water_swamp', 'brass', 'chaotic_polymorphine'],
        apIngredients: ['lava', 'honey', 'blood']
      });
      s.onInfo((data) => {
        allData[i] = data;
        if (data.foundSeed) {
          for (const solver of solvers) {
            solver.stop();
          }
        }
      });
      solvers.push(s);
    }
    await Promise.all(solvers.map(async s => s.start()));
    // console.log(solvers.map(s => s.currentSeed));
    const found = allData.find(d => d.foundSeed)!;
    expect(found).toBeTruthy();
    expect(found.currentSeed).toBe(12341234);
  });
});
