import GameInfoHandler from '../services/SeedInfo/infoHandler';
import { IRule } from './SeedInfo/infoHandler/IRule';

// const includesAll = (arr: string[], target: string[]) =>
// 	arr.length ? target.every(v => arr.includes(v)) : true;

export interface ISeedSolverConfig {
	currentSeed?: number;
	rules?: IRule[];
}

export class SeedSolver {
	gameInfoHandler = new GameInfoHandler({ seed: 0 }); // we will use the provider itself but later on we will use the whole thing
	shouldCancel = false;
	foundSeed?: number;
	running = false;
	count = 0;
	currentSeed = 0;
	offset = 0;
	step = 1;
	infoFreq = 25000;
	rules!: IRule[];
	avgExecTime = 0;
	sumExecTime = 0;

	infocb?: (info: ReturnType<SeedSolver['getInfo']>) => void;

	constructor(offset: number = 0, step: number = 1) {
		this.init(offset, step);
	}

	init(offset: number, step: number) {
		this.offset = offset;
		this.step = step;
	}

	check(rule: IRule): boolean {
		return this.gameInfoHandler.providers[rule.type].test(rule);
	}

	async work() {
		this.running = true;
		this.shouldCancel = false;
		while (!this.shouldCancel && this.currentSeed < 4_294_967_294) {
			while (!this.gameInfoHandler.ready) {
				// Free the event loop to check for stop
				await new Promise(res => setTimeout(res, 0));
			}
			if (this.count && this.count % this.infoFreq === 0) {
				this.avgExecTime = this.sumExecTime / this.infoFreq;
				this.sumExecTime = 0;
				this.sendInfo();
				// Free the event loop to check for stop
				await new Promise(res => setTimeout(res, 0));
			}
			const startTime = performance.now();
			this.gameInfoHandler.randoms!.SetWorldSeed(this.currentSeed);
			const found = this.rules.every(r => this.check(r));
			const endTime = performance.now();
			this.sumExecTime += endTime - startTime;

			if (found) {
				this.foundSeed = +this.currentSeed;
				break;
			}
			this.currentSeed += this.step;
			this.count++;
		}
		this.running = false;
		this.sendInfo();
		this.currentSeed += this.step;
	}

	async start() {
		this.foundSeed = undefined;
		return this.work();
	}

	async update(config: ISeedSolverConfig = {}) {
		if (typeof config.currentSeed === 'number') {
			this.currentSeed = config.currentSeed + this.offset;
		}
		if (config.rules) {
			this.rules = config.rules;
		}
	}

	async stop() {
		this.shouldCancel = true;
		this.running = false;
	}

	onInfo(cb: (info: ReturnType<SeedSolver['getInfo']>) => void) {
		this.infocb = cb;
		// return cb(this.getInfo());
	}

	sendInfo() {
		if (this.infocb) {
			this.infocb(this.getInfo());
		}
	}

	getInfo() {
		return Object.assign(
			{},
			{
				avgExecTime: this.avgExecTime,
				count: this.count,
				currentSeed: this.currentSeed,
				foundSeed: this.foundSeed,
				running: this.running
			}
		);
	}

	async getCount() {
		return this.count;
	}

	async getCurrentSeed() {
		return this.currentSeed;
	}

	async getFoundSeed() {
		return this.foundSeed;
	}
}
