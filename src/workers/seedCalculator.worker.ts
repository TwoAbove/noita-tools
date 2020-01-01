import * as Comlink from 'comlink';

import { SeedSolver } from './seedCalculator';

const seedSolver = new SeedSolver();

Comlink.expose(seedSolver);

export default null as any;
