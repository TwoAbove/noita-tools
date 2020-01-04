import { MaterialPicker } from '../services/Calculator2';

const includesAll = (arr: string[], target: string[]) =>
	arr.length ? target.every(v => arr.includes(v)) : true;

interface ISeedSolverConfig {
	apIngredients?: string[];
	lcIngredients?: string[];
	currentSeed?: number;
}
export class SeedSolver {
	private apIngredients!: string[];
	private lcIngredients!: string[];
	private AP!: string[];
	private LC!: string[];
	private shouldCancel = false;
	private foundSeed?: number;
	private running = false;
	private count = 0;
	private currentSeed = 0;

	constructor(config: ISeedSolverConfig = {}) {
		this.lcIngredients = config.lcIngredients || [];
		this.apIngredients = config.apIngredients || [];
	}

	private async work() {
		while (!this.shouldCancel && this.currentSeed < 4_294_967_294) {
			if (this.currentSeed % 10000 === 0) {
				console.log(`On seed ${this.currentSeed}`);
			}
			const found: any = await new Promise(async res => {
				setTimeout(() => {
					const { LC, AP } = MaterialPicker.PickForSeed(this.currentSeed);
					const allLC = includesAll(this.lcIngredients, LC);
					const allAP = includesAll(this.apIngredients, AP);
					if (allLC && allAP) {
						return res({ LC, AP });
					}
					res();
				}, 0);
			});
			if (found) {
				const { LC, AP } = found;
				this.foundSeed = +this.currentSeed;
				this.LC = LC;
				this.AP = AP;
				break;
			}
			this.currentSeed++;
			this.count++;
		}
		this.running = false;
	}

	public async start() {
		this.currentSeed++;
		this.shouldCancel = false;
		this.running = true;
		this.work();
	}

	public async update(config: ISeedSolverConfig = {}) {
		if (config.currentSeed) {
			this.currentSeed = config.currentSeed;
		}
		if (config.apIngredients) {
			this.apIngredients = config.apIngredients || [];
		}
		if (config.lcIngredients) {
			this.lcIngredients = config.lcIngredients || [];
		}
	}

	public async stop() {
		this.shouldCancel = true;
		this.running = false;
	}

	public async getInfo() {
		return {
			count: this.count,
			currentSeed: this.currentSeed,
			foundSeed: this.foundSeed,
			running: this.running,
			LC: this.LC,
			AP: this.AP
		};
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
