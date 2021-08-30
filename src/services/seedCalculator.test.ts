import { SeedSolver } from './seedCalculator';

describe("SeedSolver", () => {
  it('Should find a correct seed', async () => {
    const seed = 12341233;
    // this is correct for seed 12341234
    const seedSolver = new SeedSolver({
      lcIngredients: ['water_swamp', 'brass', 'chaotic_polymorphine'],
      apIngredients: ['lava', 'honey', 'blood']
    });
    seedSolver.currentSeed = seed;
    await seedSolver.work();
    expect(seedSolver.currentSeed).toBe(12341234);
  });
  it('Should find a correct seed multithreaded', async () => {
    const seed = 12341233;
    // this is correct for seed 12341234
    const seedSolver = new SeedSolver({
      lcIngredients: ['water_swamp', 'brass', 'chaotic_polymorphine'],
      apIngredients: ['lava', 'honey', 'blood']
    });
    seedSolver.currentSeed = seed;
    await seedSolver.work();
    expect(seedSolver.currentSeed).toBe(12341234);
  });
});
