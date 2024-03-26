import { describe, it, expect } from "vitest";
import { ShopInfoProvider, IShopType } from "./Shop";
import { WandInfoProvider } from "./Wand";
import { loadRandom } from "../../../../testHelpers";
import { SpellInfoProvider } from "./Spell";

const spellInfoProvider = new SpellInfoProvider({} as any);

describe("ShopInfoProvider", () => {
  describe("#provide", () => {
    describe("type", () => {
      const tests = [
        {
          seed: 123,
          ans: {
            row: 0,
            type: IShopType.wand,
          },
        },
        {
          seed: 5151515,
          ans: {
            row: 4,
            type: IShopType.item,
          },
        },
        {
          seed: 123435616,
          ans: {
            row: 6,
            type: IShopType.item,
          },
        },
      ];

      tests.forEach((t, i) => {
        it(`Should generate correct output #${i}`, async () => {
          const randoms = await loadRandom();
          const wandInfoProvider = new WandInfoProvider(randoms);
          await wandInfoProvider.ready();
          const ap = new ShopInfoProvider(randoms, wandInfoProvider, spellInfoProvider);
          randoms.SetWorldSeed(t.seed);
          const r = ap.provide();
          const res = r[t.ans.row];
          expect(res.type).toEqual(t.ans.type);
        });
      });
    });

    describe("items - spells", () => {
      const tests = [
        {
          seed: 123,
          ans: {
            row: 2,
            items: [
              "RECHARGE",
              "CLOUD_ACID",
              "TELEPORT_PROJECTILE_CLOSER",
              "MANA_REDUCE",
              "EXPLOSION_TINY",
              "ROCKET_OCTAGON",
              "PROPANE_TANK",
              "GRENADE_TRIGGER",
              "BULLET_TIMER",
              "LIGHTNING",
            ],
          },
        },

        {
          seed: 123,
          ans: {
            row: 6,
            items: [
              "RANDOM_EXPLOSION",
              "ROCKET_TIER_3",
              "HOMING_CURSOR",
              "CURSE_WITHER_MELEE",
              "RECHARGE",
              "RECOIL_DAMPER",
              "BLACK_HOLE_BIG",
              "HEAVY_SPREAD",
              "BULLET_TIMER",
              "MINE",
            ],
          },
        },
      ];

      tests.forEach((t, i) => {
        it(`Should generate correct output #${i}`, async () => {
          const randoms = await loadRandom();
          const wandInfoProvider = new WandInfoProvider(randoms);
          await wandInfoProvider.ready();
          const ap = new ShopInfoProvider(randoms, wandInfoProvider, spellInfoProvider);
          randoms.SetWorldSeed(t.seed);
          const r = ap.provide();
          const res = r[t.ans.row];
          expect(res.type).toEqual(IShopType.item);
          const items = res.items.map(i => i.spell.id);
          expect(items).toEqual(t.ans.items);
        });
      });
    });
  });
});
