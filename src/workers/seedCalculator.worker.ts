import { MaterialPicker } from '../services/Calculator2';

const includesAll = (arr: string[], target: string[]) =>
	target.every(v => arr.includes(v));

interface ISeedSolverConfig {
	apIngredients: string[];
	lcIngredients: string[];
}
export class SeedSolver {
	private apIngredients: string[];
	private lcIngredients: string[];
	private shouldCancel = false;
	private foundSeed?: number;
	private running = false;
	private count = 0;
	private currentSeed = 1;

	constructor(config: ISeedSolverConfig) {
		this.lcIngredients = config.lcIngredients || [];
		this.apIngredients = config.apIngredients || [];
	}

	private async work() {
		while (!this.shouldCancel && this.currentSeed < 2_147_483_647) {
			const { LC, AP } = MaterialPicker.PickForSeed(this.currentSeed);
			const allLC = includesAll(this.lcIngredients, LC);
			const allAP = includesAll(this.apIngredients, AP);
			if (allLC && allAP) {
				this.foundSeed = +this.currentSeed;
				return;
			}
			this.currentSeed++;
			this.count++;
		}
	}

	public async start() {
		this.running = true;
		this.work();
	}

	public async stop() {
		this.shouldCancel = true;
		this.running = false;
	}

	public async getCount() {
		return this.count;
	}

	public async getCurrentSeed() {
		return this.currentSeed;
	}

	public async getFoundSeed() {
		return this.foundSeed;
	}
}
