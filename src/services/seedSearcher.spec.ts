import { describe, it, expect } from "vitest";
import { getUnlockedSpells, loadRandom } from "../testHelpers";
import GameInfoProvider from "./SeedInfo/infoHandler";
import { RuleType } from "./SeedInfo/infoHandler/IRule";
import { SeedSearcher } from "./seedSearcher";

global.performance = require("perf_hooks").performance;

describe("SeedSearcher", () => {
  const tests = [
    {
      config: {
        rules: {
          id: "1",
          type: RuleType.AND,
          rules: [
            {
              id: "6",
              type: "startingBombSpell",
              path: "",
              params: [],
              val: "MINE",
            },
            {
              id: "13",
              type: "pacifistChest",
              path: "",
              params: [],
              val: [["data/entities/items/pickup/moon.xml"], [], [], [], [], [], []],
              strict: true,
            },
          ],
          selectedRule: "13",
        },
      },
      ans: 1151,
    },
    {
      config: {
        currentSeed: 7193400,
        rules: {
          id: "1",
          type: RuleType.AND,
          rules: [
            {
              id: "19",
              type: "weather",
              path: "",
              params: [],
              val: {
                rain_material: "acid",
              },
            },
            {
              id: "26",
              type: "perk",
              path: "",
              params: [],
              val: {
                all: [["REMOVE_FOG_OF_WAR"], [], [], [], [], [], []],
                some: [[]],
                deck: [[]],
              },
              strict: true,
            },
            {
              id: "38",
              type: "startingBombSpell",
              path: "",
              params: [],
              val: "BOMB",
            },
            {
              id: "41",
              type: "shop",
              path: "",
              params: [],
              val: [
                {
                  type: 1,
                  items: [],
                },
                null,
                null,
                null,
                null,
                null,
                null,
              ],
              strict: true,
            },
          ],
          selectedRule: "search",
        },
      },
      ans: 7193451,
    },
  ];

  tests.forEach((t, i) => {
    it(`Should find the correct seed #${i}`, async () => {
      const randoms = await loadRandom();

      const infoProvider = new GameInfoProvider({ seed: 1 }, getUnlockedSpells(), undefined, randoms, false);
      await infoProvider.ready();
      const solver = new SeedSearcher(infoProvider);
      solver.update(t.config as any);
      await solver.work();
      const res = solver.getInfo();
      expect(res.foundSeed).toEqual(t.ans);
    });
  });

  it(`Should sort the rules by complexity`, async () => {
    const config = {
      currentSeed: 7193400,
      rules: {
        id: "1",
        type: RuleType.AND,
        rules: [
          {
            id: "19",
            type: "weather",
            path: "",
            params: [],
            val: {
              material: "acid",
            },
          },
          {
            id: "26",
            type: "perk",
            path: "",
            params: [],
            val: {
              all: [["REMOVE_FOG_OF_WAR"], [], [], [], [], [], []],
              some: [[]],
              deck: [[]],
            },
            strict: true,
          },
          {
            id: "38",
            type: "startingBombSpell",
            path: "",
            params: [],
            val: "BOMB",
          },
          {
            id: "41",
            type: "shop",
            path: "",
            params: [],
            val: [
              {
                type: 1,
                items: [],
              },
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            strict: true,
          },
        ],
        selectedRule: "search",
      },
    };
    const ans = {
      id: "1",
      type: RuleType.AND,
      rules: [
        {
          id: "19",
          type: "weather",
          path: "",
          params: [],
          val: {
            material: "acid",
          },
        },
        {
          id: "38",
          type: "startingBombSpell",
          path: "",
          params: [],
          val: "BOMB",
        },
        {
          id: "41",
          type: "shop",
          path: "",
          params: [],
          val: [
            {
              type: 1,
              items: [],
            },
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          strict: true,
        },
        {
          id: "26",
          type: "perk",
          path: "",
          params: [],
          val: {
            all: [["REMOVE_FOG_OF_WAR"], [], [], [], [], [], []],
            some: [[]],
            deck: [[]],
          },
          strict: true,
        },
      ],
      selectedRule: "search",
    };

    const randoms = await loadRandom();

    const infoProvider = new GameInfoProvider({ seed: 1 }, getUnlockedSpells(), undefined, randoms, false);
    await infoProvider.ready();

    const solver = new SeedSearcher(infoProvider);
    solver.update(config as any);
    expect(solver.rules).toEqual(ans);
  });

  it(`Should sort the rules by complexity in subrules`, async () => {
    const config = {
      currentSeed: 7193400,
      rules: {
        id: "1",
        type: RuleType.AND,
        rules: [
          {
            id: "31",
            type: RuleType.AND,
            rules: [
              {
                id: "19",
                type: "weather",
                path: "",
                params: [],
                val: {
                  material: "acid",
                },
              },
              {
                id: "26",
                type: "perk",
                path: "",
                params: [],
                val: {
                  all: [["REMOVE_FOG_OF_WAR"], [], [], [], [], [], []],
                  some: [[]],
                  deck: [[]],
                },
                strict: true,
              },
              {
                id: "38",
                type: "startingBombSpell",
                path: "",
                params: [],
                val: "BOMB",
              },
              {
                id: "41",
                type: "shop",
                path: "",
                params: [],
                val: [
                  {
                    type: 1,
                    items: [],
                  },
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                ],
                strict: true,
              },
            ],
          },
        ],
        selectedRule: "search",
      },
    };
    const ans = {
      id: "1",
      type: RuleType.AND,
      rules: [
        {
          id: "31",
          type: RuleType.AND,
          rules: [
            {
              id: "19",
              type: "weather",
              path: "",
              params: [],
              val: {
                material: "acid",
              },
            },
            {
              id: "38",
              type: "startingBombSpell",
              path: "",
              params: [],
              val: "BOMB",
            },
            {
              id: "41",
              type: "shop",
              path: "",
              params: [],
              val: [
                {
                  type: 1,
                  items: [],
                },
                null,
                null,
                null,
                null,
                null,
                null,
              ],
              strict: true,
            },
            {
              id: "26",
              type: "perk",
              path: "",
              params: [],
              val: {
                all: [["REMOVE_FOG_OF_WAR"], [], [], [], [], [], []],
                some: [[]],
                deck: [[]],
              },
              strict: true,
            },
          ],
        },
      ],
      selectedRule: "search",
    };

    const randoms = await loadRandom();

    const infoProvider = new GameInfoProvider({ seed: 1 }, getUnlockedSpells(), undefined, randoms, false);
    await infoProvider.ready();

    const solver = new SeedSearcher(infoProvider);
    solver.update(config as any);
    expect(solver.rules).toEqual(ans);
  });
});
