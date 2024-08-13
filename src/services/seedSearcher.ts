import GameInfoProvider from "../services/SeedInfo/infoHandler";
import { IRules, ILogicRules, RuleType, IRuleRules } from "./SeedInfo/infoHandler/IRule";

// const includesAll = (arr: string[], target: string[]) =>
// 	arr.length ? target.every(v => arr.includes(v)) : true;

export interface ISeedSearcherConfig {
  currentSeed?: number;
  seedEnd?: number;
  rules?: ILogicRules;
  unlockedSpells?: boolean[];
  findAll?: boolean;
}

export const searchWeights = {
  spells: 0.04035,
  weather: 0.04068,
  waterCave: 0.04069,
  startingFlask: 0.0407,
  pacifistChest: 0.04087,
  startingSpell: 0.04089,
  chestRandom: 0.04094,
  startingBombSpell: 0.04096,
  powderStash: 0.04125,
  potionSecret: 0.04193,
  potionRandomMaterial: 0.04336,
  material: 0.04354,
  potion: 0.04446,
  shop: 0.05129,
  lottery: 0.05217,
  biome: 0.05945,
  default: 0.06155, // average
  perk: 0.06346,
  alwaysCast: 0.06586,
  biomeModifier: 0.06789,
  wand: 0.07342,
  fungalShift: 0.15964,
  alchemy: 0.22039,
  map: 0.6,
};

const sortRules = (rules: ILogicRules | IRuleRules): void => {
  if (!rules.rules) {
    return;
  }
  rules.rules.sort((a, b) => {
    if (a.type in RuleType || b.type in RuleType) {
      return 0;
    }
    return searchWeights[a.type] - searchWeights[b.type];
  });
  rules.rules.forEach(r => sortRules(r));
};

export class SeedSearcher {
  gameInfoProvider: GameInfoProvider;
  shouldCancel = false;
  foundSeed?: number;
  running = false;
  count = 0;
  currentSeed = 0;
  findAll = false;
  seedEnd?: number;
  offset = 0;
  step = 1;
  gcEvery = 1000;
  infoFreq = 20000;
  rules!: ILogicRules;
  avgExecTime = 0;
  sumExecTime = 0;

  constructor(gameInfoProvider?: GameInfoProvider) {
    if (gameInfoProvider) {
      this.gameInfoProvider = gameInfoProvider;
    } else {
      this.gameInfoProvider = new GameInfoProvider({ seed: 0 }, [], undefined, undefined, false);
    }
  }

  infocb = (info: ReturnType<SeedSearcher["getInfo"]>) => {};
  foundcb = (info: ReturnType<SeedSearcher["getInfo"]>) => {};

  init(offset: number, step: number) {
    this.offset = offset;
    this.step = step;
  }

  check(rule: IRules): boolean {
    switch (rule.type) {
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
        const res = this.gameInfoProvider.providers[rule.type].test(rule);
        return res;
      }
    }
  }

  findSync(from: number, to: number): number[] {
    if (to < from) {
      return this.findSync(to, from);
    }

    const res: number[] = [];

    for (let seed = from; seed < to; seed++) {
      const startTime = performance.now();
      this.gameInfoProvider.randoms.SetWorldSeed(seed);
      let found = false;
      try {
        found = this.rules.rules.every(r => this.check(r));
      } catch (e) {
        console.error(`Seed ${seed} error: `, e);
      }
      const endTime = performance.now();
      this.sumExecTime += endTime - startTime;
      if (found) {
        this.foundSeed = +seed;
        res.push(+seed);
        if (this.findAll) {
          this.foundcb(this.getInfo());
        } else {
          break;
        }
      }
      this.count++;
    }
    this.running = false;
    // setTimeout(() => console.profileEnd(), 10);
    this.calculateStats();
    this.sendInfo();

    return res;
  }

  async work() {
    this.running = true;
    this.shouldCancel = false;

    // we need a failsafe for too-long loops, so we'll just stop after 5 minutes
    setTimeout(
      () => {
        this.shouldCancel = true;
      },
      1000 * 60 * 5,
    );

    // console.profile();
    while (!this.shouldCancel && this.currentSeed <= (this.seedEnd || 2_147_483_645)) {
      if (this.count && this.count % this.gcEvery === 0) {
        // Free the event loop to GC
        await new Promise(res => setTimeout(res, 0.1));
      }
      if (this.count && this.infoFreq && this.count % this.infoFreq === 0) {
        this.calculateStats();
        this.sendInfo();
        // Free the event loop to check for stop
        await new Promise(res => setTimeout(res, 0));
      }
      const startTime = performance.now();
      this.gameInfoProvider.randoms.SetWorldSeed(this.currentSeed);
      let found = false;
      try {
        found = this.rules.rules.every(r => this.check(r));
      } catch (e) {
        console.error(`Seed ${this.currentSeed} error: `, e);
      }
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
    // setTimeout(() => console.profileEnd(), 10);
    this.calculateStats();
    this.sendInfo();
    this.currentSeed += this.step;
  }

  calculateStats() {
    this.avgExecTime = this.sumExecTime / this.infoFreq;
    this.sumExecTime = 0;
  }

  async ready() {
    return this.gameInfoProvider.ready().catch(e => {
      console.log(e);
    });
  }

  async start() {
    this.foundSeed = undefined;
    console.log("Getting ready");
    await this.gameInfoProvider.ready();
    console.log("Starting");
    return this.work();
  }

  async update(config: ISeedSearcherConfig = {}) {
    if (typeof config.currentSeed === "number") {
      this.currentSeed = config.currentSeed + this.offset;
    }
    if (typeof config.seedEnd === "number") {
      if (!config.seedEnd) {
        delete this.seedEnd;
      } else if (config.seedEnd > 0) {
        this.seedEnd = config.seedEnd + this.offset;
      }
    }
    if (config.rules) {
      // stringify and parse the JSON to fix a [bug/feature?] in
      // string equality when sending between worker threads
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/String#string_constructor_and_string_function
      this.rules = JSON.parse(JSON.stringify(config.rules));
      sortRules(this.rules);
    }
    if (config.findAll) {
      this.findAll = config.findAll;
    }
    if (config.unlockedSpells) {
      this.gameInfoProvider.unlockedSpells = config.unlockedSpells;
      await this.gameInfoProvider
        .ready()
        .then(() => {
          this.gameInfoProvider.randoms.SetUnlockedSpells(config.unlockedSpells!);
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {});
    }
  }

  async stop() {
    this.shouldCancel = true;
  }

  onInfo(cb: (info: ReturnType<SeedSearcher["getInfo"]>) => void) {
    this.infocb = cb;
    // return cb(this.getInfo());
  }

  onFound(cb: (info: ReturnType<SeedSearcher["getInfo"]>) => void) {
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
        running: this.running,
      },
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
