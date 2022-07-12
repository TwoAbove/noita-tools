import GameInfoProvider from '../services/SeedInfo/infoHandler';
import { IRules, ILogicRules, RuleType } from './SeedInfo/infoHandler/IRule';

// const includesAll = (arr: string[], target: string[]) =>
// 	arr.length ? target.every(v => arr.includes(v)) : true;

export interface ISeedSolverConfig {
	currentSeed?: number;
	seedEnd?: number;
	rules?: ILogicRules;
	unlockedSpells?: boolean[];
	findAll?: boolean;
}

export class SeedSolver {
	gameInfoHandler = new GameInfoProvider({ seed: 0 }); // we will use the provider itself but later on we will use the whole thing
	shouldCancel = false;
	foundSeed?: number;
	running = false;
	count = 0;
	currentSeed = 0;
	findAll = false;
	seedEnd?: number;
	offset = 0;
	step = 1;
	infoFreq = 25000;
	rules!: ILogicRules;
	avgExecTime = 0;
	sumExecTime = 0;

	infocb!: (info: ReturnType<SeedSolver['getInfo']>) => void;
	foundcb!: (info: ReturnType<SeedSolver['getInfo']>) => void;

	init(offset: number, step: number) {
		this.offset = offset;
		this.step = step;
	}

	check(rule: IRules): boolean {
		switch(rule.type) {
			case RuleType.NOT: {
				const res = this.check(rule.rules[0]);
				return !res;
			}
			case RuleType.AND: {
				const res = rule.rules.every(r => this.check(r));
				return res;
			}
			case RuleType.OR: {
				const res = rule.rules.some(r => this.check(r));
				return res;
			}
			default: {
				const res = this.gameInfoHandler.providers[rule.type].test(rule);
				return res;
			}
		}
	}

	async work() {
		this.running = true;
		this.shouldCancel = false;
		while (
			!this.shouldCancel &&
			this.currentSeed < (this.seedEnd || 4_294_967_294)
		) {
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
			const found = this.rules.rules.every(r => this.check(r));
			const endTime = performance.now();
			this.sumExecTime += endTime - startTime;

			if (found) {
				this.foundSeed = +this.currentSeed;
				if (this.findAll) {
					this.foundcb(this.getInfo());
				} else {
					break;
				}
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
		if (typeof config.seedEnd === 'number') {
			if (!config.seedEnd) {
				delete this.seedEnd;
			} else if (config.seedEnd > 0) {
				this.seedEnd = config.seedEnd + this.offset;
			}
		}
		if (config.rules) {
			this.rules = config.rules;
		}
		if (config.findAll) {
			this.findAll = config.findAll;
		}
		if (config.unlockedSpells) {
			this.gameInfoHandler.onRandomLoad(() => {
				this.gameInfoHandler.randoms.SetUnlockedSpells(config.unlockedSpells!);
			}).finally(() => {});
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

	onFound(cb: (info: ReturnType<SeedSolver['getInfo']>) => void) {
		this.foundcb = cb;
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
