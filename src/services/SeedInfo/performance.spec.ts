import { describe, it, expect } from "vitest";
import { loadRandom, getUnlockedSpells } from "../../testHelpers";
import GameInfoProvider from "./infoHandler";
import { performance } from "perf_hooks";

type IPerf = {
  key: string;
  stats: {
    min: number;
    max: number;
    avg: number;
    median: number;
  };
  allTimings: {
    time: number;
    seed: number;
    x: number;
    y: number;
  }[];
};

const mapPos = [
  [28, 14], // liquidcave
  [36, 14], // coalmine
  [34, 17], // excavationSite
  [34, 21], // snowCave
  [34, 24], // snowcastle
  [34, 31], // vault
];

const params = {
  alchemy: (x, y) => [],
  alwaysCast: (x, y) => [1, 2, 3],
  biome: (x, y) => ["coalmine"],
  biomeModifier: (x, y) => [],
  chestRandom: (x, y) => [x, y],
  fungalShift: (x, y) => [],
  lottery: (x, y) => [1, 2, 3],
  material: (x, y) => ["water"],
  pacifistChest: (x, y) => [1],
  perk: (x, y) => [new Map(), undefined, true, 0, new Map()],
  potion: (x, y) => [x, y],
  potionRandomMaterial: (x, y) => [x, y],
  potionSecret: (x, y) => [x, y],
  powderStash: (x, y) => [x, y],
  weather: (x, y) => [],
  shop: (x, y) => [1],
  map: (x, y, seed) => [...mapPos[(x + y) % mapPos.length], seed],
  spells: (x, y) => ["BOMB"],
  startingBombSpell: (x, y) => [],
  startingFlask: (x, y) => [],
  startingSpell: (x, y) => [],
  wand: (x, y) => [x, y, 60, 3, false, false],
  waterCave: (x, y) => [],
  excavationSiteCubeChamber: (x, y) => [x, y],
};

const getParams = (provider: string, x: any, y: any, seed): any[] => {
  return params[provider](x, y, seed);
};

const getStats = (timings: IPerf["allTimings"]): IPerf["stats"] => {
  const stats = timings
    .sort((a, b) => a.time - b.time)
    .reduce<{
      avg: number;
      min: number;
      median: number;
      max: number;
    }>(
      (c, r) => {
        c.min = Math.min(c.min, r.time);
        c.max = Math.max(c.max, r.time);
        c.avg = c.avg + r.time;
        return c;
      },
      { min: Infinity, max: -Infinity, avg: 0, median: 0 },
    );

  stats.avg = stats.avg / timings.length;
  stats.median = timings[Math.floor(timings.length / 2)].time;

  return stats;
};

const printStats = (info: { [provider: string]: IPerf }) => {
  const data = Object.keys(info)
    .map(provider => {
      const data = info[provider];
      return { name: provider, ...data.stats };
    })
    .sort((a, b) => b.avg - a.avg)
    .map(data => ({
      name: data.name,
      "Min, µs": (data.min * 1000).toFixed(5),
      "Max, µs ": (data.max * 1000).toFixed(5),
      "Avg, µs": (data.avg * 1000).toFixed(5),
      "Med, µs": (data.median * 1000).toFixed(5),
    }));
  console.table(data);
};

describe("Performance", () => {
  const box = 20;
  const seedBox = 20;

  it(`Generate infoProvider performance`, async () => {
    const res: { [provider: string]: IPerf } = {};
    const randoms = await loadRandom();

    const infoProvider = new GameInfoProvider({ seed: 1 }, getUnlockedSpells(), undefined, randoms, false);

    await infoProvider.ready();

    const providers = Object.keys(infoProvider.providers);

    for (const provider of providers) {
      if (["statelessPerk", "map"].includes(provider)) {
        continue;
      }
      const timings: IPerf["allTimings"] = [];

      let action = "provide";
      if (provider === "shop") {
        action = "provideLevel";
      }

      for (let seed = 1; seed < seedBox; seed++) {
        infoProvider.updateConfig({ seed });
        for (let x = 0; x < box; x++) {
          for (let y = 0; y < box; y++) {
            const startTime = performance.now();
            const res = infoProvider.providers[provider][action](...getParams(provider, x, y, seed));
            const endTime = performance.now();
            timings.push({
              seed,
              time: endTime - startTime,
              x,
              y,
            });
          }
        }
      }

      res[provider] = {
        key: provider,
        stats: getStats(timings),
        allTimings: timings,
      };
    }

    printStats(res);
  });
});
