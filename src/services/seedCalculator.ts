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
	private offset = 0;
	private step = 1;

	private infocb?: (info: ReturnType<SeedSolver["getInfo"]>) => void;

	public init(offset: number = 0, step: number = 1) {
		this.offset = offset;
		this.step = step;
	}

	private async work() {
		while (!this.shouldCancel && this.currentSeed < 4_294_967_294) {
			if (this.count % 100 === 0) {
				this.sendInfo();
			}
			const found: any = await new Promise(res => { // Free the event loop
				setTimeout(() => {
					const { LC, AP } = MaterialPicker.PickForSeed(this.currentSeed);
					const allLC = includesAll(this.lcIngredients, LC);
					const allAP = includesAll(this.apIngredients, AP);
					if (allLC && allAP) {
						return res({ LC, AP });
					}
					res(false);
				}, 0);
			});
			if (found) {
				const { LC, AP } = found;
				this.foundSeed = +this.currentSeed;
				this.LC = LC;
				this.AP = AP;
				break;
			}
			this.currentSeed += this.step;
			this.count++;
		}
		this.currentSeed += this.step;
		this.running = false;
		this.sendInfo();
	}

	public async start() {
		this.shouldCancel = false;
		this.running = true;
		this.work();
	}

	public async update(config: ISeedSolverConfig = {}) {
		if (config.currentSeed) {
			this.currentSeed = config.currentSeed + this.offset;
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


	public onInfo(cb: (info: ReturnType<SeedSolver["getInfo"]>) => void) {
		this.infocb = cb;
		// return cb(this.getInfo());
	}
	private sendInfo() {
		if (this.infocb) {
			this.infocb(this.getInfo());
		}
	}
	public getInfo() {
		return {
			count: this.count,
			currentSeed: this.currentSeed,
			foundSeed: this.foundSeed,
			running: this.running,
			LC: this.LC,
			AP: this.AP,
			apIngredients: this.apIngredients,
			lcIngredients: this.lcIngredients,
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
