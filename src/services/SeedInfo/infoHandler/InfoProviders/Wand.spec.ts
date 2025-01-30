import { describe, it, expect } from "vitest";
import { WandInfoProvider } from "./Wand";
import { loadRandom } from "../../../../testHelpers";

describe("WandInfoProvider", () => {
  const tests = [
    {
      seed: 123,
      params: {
        x: 10,
        y: 10,
        cost: 20,
        level: 1,
        force_unshuffle: false,
        unshufflePerk: false,
      },
      ans: {
        gun: {
          actions_per_round: 1,
          // cost: 2.6, // cost has floating point error like 2.6000000000000014
          deck_capacity: 6,
          fire_rate_wait: 18,
          force_unshuffle: 0,
          is_rare: 0,
          mana_charge_speed: 245,
          mana_max: 80,
          prob_draw_many: 0.15,
          prob_unshuffle: 0.1,
          reload_time: 28,
          shuffle_deck_when_empty: 1,
          speed_multiplier: 1.08233642578125,
          spread_degrees: 2,
        },
        cards: {
          cards: ["BURST_2", "HEAVY_SPREAD", "DYNAMITE", "DYNAMITE", "DYNAMITE"],
        },
      },
    },
    {
      seed: 123,
      params: {
        x: 155,
        y: 6161,
        cost: 200,
        level: 6,
        force_unshuffle: false,
        unshufflePerk: false,
      },
      ans: {
        gun: {
          actions_per_round: 4,
          cost: 0,
          // deck_capacity: 6,
          fire_rate_wait: 13,
          force_unshuffle: 0,
          is_rare: 0,
          mana_charge_speed: 304,
          mana_max: 980,
          prob_draw_many: 0.15,
          prob_unshuffle: 0.1,
          reload_time: 38,
          shuffle_deck_when_empty: 1,
          speed_multiplier: 1.09279203414917,
          spread_degrees: 4,
        },
        cards: {
          cards: [
            "EXPLODING_DEER",
            "GRENADE_LARGE",
            "ROCKET_TIER_3",
            "GRENADE_TIER_3",
            "MAGIC_SHIELD",
            "PIPE_BOMB_DEATH_TRIGGER",
            "SLOW_BULLET_TRIGGER",
            "BLACK_HOLE_DEATH_TRIGGER",
            "GRENADE_TRIGGER",
            "GRENADE_TRIGGER",
            "HITFX_CRITICAL_BLOOD",
            "EXPLOSION_REMOVE",
            "NUKE",
            "SUMMON_ROCK",
            "TNTBOX_BIG",
            "METEOR",
          ],
        },
      },
    },
    {
      seed: 123,
      params: {
        x: 155,
        y: 6161,
        cost: 200,
        level: 6,
        force_unshuffle: true,
        unshufflePerk: false,
      },
      ans: {
        gun: {
          actions_per_round: 4,
          cost: 0,
          // deck_capacity: 6,
          fire_rate_wait: 13,
          force_unshuffle: 0,
          is_rare: 0,
          mana_charge_speed: 304,
          mana_max: 980,
          prob_draw_many: 0.15,
          prob_unshuffle: 0.1,
          reload_time: 38,
          shuffle_deck_when_empty: 0,
          speed_multiplier: 1.09279203414917,
          spread_degrees: 4,
        },
        cards: {
          cards: [
            "EXPLODING_DEER",
            "GRENADE_LARGE",
            "ROCKET_TIER_3",
            "GRENADE_TIER_3",
            "MAGIC_SHIELD",
            "PIPE_BOMB_DEATH_TRIGGER",
            "SLOW_BULLET_TRIGGER",
            "BLACK_HOLE_DEATH_TRIGGER",
            "GRENADE_TRIGGER",
            "GRENADE_TRIGGER",
            "HITFX_CRITICAL_BLOOD",
            "EXPLOSION_REMOVE",
            "NUKE",
            "SUMMON_ROCK",
            "TNTBOX_BIG",
            "METEOR",
          ],
        },
      },
    },
    {
      seed: 123,
      params: {
        x: 155,
        y: 6161,
        cost: 200,
        level: 6,
        force_unshuffle: false,
        unshufflePerk: true,
      },
      ans: {
        gun: {
          actions_per_round: 4,
          cost: 0,
          // deck_capacity: 6,
          fire_rate_wait: 13,
          force_unshuffle: 0,
          is_rare: 0,
          mana_charge_speed: 304,
          mana_max: 980,
          prob_draw_many: 0.15,
          prob_unshuffle: 0.1,
          reload_time: 38,
          shuffle_deck_when_empty: 0,
          speed_multiplier: 1.09279203414917,
          spread_degrees: 4,
        },
        cards: {
          cards: [
            "EXPLODING_DEER",
            "GRENADE_LARGE",
            "ROCKET_TIER_3",
            "GRENADE_TIER_3",
            "MAGIC_SHIELD",
            "PIPE_BOMB_DEATH_TRIGGER",
            "SLOW_BULLET_TRIGGER",
            "BLACK_HOLE_DEATH_TRIGGER",
            "GRENADE_TRIGGER",
            "GRENADE_TRIGGER",
            "HITFX_CRITICAL_BLOOD",
            "EXPLOSION_REMOVE",
            "NUKE",
            "SUMMON_ROCK",
            "TNTBOX_BIG",
            "METEOR",
          ],
        },
      },
    },
  ];

  describe("#provide", () => {
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const ap = new WandInfoProvider(randoms);
        await ap.ready();
        randoms.SetWorldSeed(t.seed);
        const res = ap.provide(
          t.params.x,
          t.params.y,
          t.params.cost,
          t.params.level,
          t.params.force_unshuffle,
          t.params.unshufflePerk,
        );
        expect(res.gun).toMatchObject(t.ans.gun);
        expect(res.cards).toEqual(t.ans.cards);
      });
    });
  });

  describe.skip("statistics", () => {
    it("should gather wand parameter statistics", async () => {
      const randoms = await loadRandom();
      randoms.SetWorldSeed(123);
      const provider = new WandInfoProvider(randoms);
      await provider.ready();

      const stats: Record<
        number,
        {
          deck_capacity: number[];
          actions_per_round: number[];
          reload_time: number[];
          shuffle_deck_when_empty: number[];
          fire_rate_wait: number[];
          spread_degrees: number[];
          speed_multiplier: number[];
          mana_charge_speed: number[];
          mana_max: number[];
        }
      > = {};

      const samples = 10000;
      const levels = Array.from({ length: 12 }, (_, i) => i + 1);
      const costs = Array.from({ length: 101 }, (_, i) => i * 10);

      for (const level of levels) {
        stats[level] = {
          deck_capacity: [],
          actions_per_round: [],
          reload_time: [],
          shuffle_deck_when_empty: [],
          fire_rate_wait: [],
          spread_degrees: [],
          speed_multiplier: [],
          mana_charge_speed: [],
          mana_max: [],
        };

        for (let i = 0; i < samples; i++) {
          const x = Math.floor(Math.random() * 10000);
          const y = Math.floor(Math.random() * 10000);
          const cost = costs[Math.floor(Math.random() * costs.length)];

          const wand = provider.provide(x, y, cost, level, false, false);

          Object.entries(wand.gun).forEach(([key, value]) => {
            if (key in stats[level]) {
              stats[level][key].push(value);
            }
          });
        }

        // Calculate statistics for this level
        const levelStats = Object.entries(stats[level]).reduce(
          (acc, [key, values]) => {
            acc[key] = {
              min: Math.min(...values),
              max: Math.max(...values),
            };
            return acc;
          },
          {} as Record<string, any>,
        );

        console.log(`\n\nLevel ${level} Statistics:`);
        Object.entries(levelStats).forEach(([key, stat]) => {
          console.log(`${key}: Min: ${stat.min.toFixed(2)}, Max: ${stat.max.toFixed(2)}`);
        });
      }
    });
  });
});
