import { describe, it, expect } from "vitest";
import { IPerkChangeStateType, PerkInfoProvider } from "./";
import { loadRandom } from "../../../../../testHelpers";

describe("PerkInfoProvider", () => {
  describe("#provide", () => {
    const tests: any[] = [
      {
        seed: 123,
        params: {},
        ans: [
          ["LOW_HP_DAMAGE_BOOST", "PROJECTILE_HOMING", "MOLD"],
          ["BLEED_GAS", "RADAR_ENEMY", "FASTER_LEVITATION"],
          ["GLASS_CANNON", "PROJECTILE_REPULSION_SECTOR", "ORBIT"],
          ["TELEPORTITIS", "REMOVE_FOG_OF_WAR", "SAVING_GRACE"],
          ["RESPAWN", "PERSONAL_LASER", "TELEKINESIS"],
          ["FAST_PROJECTILES", "BOUNCE", "BLEED_OIL"],
          ["HOMUNCULUS", "PEACE_WITH_GODS", "PROJECTILE_EATER_SECTOR"],
        ],
      },
      {
        seed: 123,
        params: { maxLevels: 2 },
        ans: [
          ["LOW_HP_DAMAGE_BOOST", "PROJECTILE_HOMING", "MOLD"],
          ["BLEED_GAS", "RADAR_ENEMY", "FASTER_LEVITATION"],
        ],
      },
      {
        seed: 123,
        params: { maxLevels: 1, rerolls: new Map([[0, 1]]) },
        ans: [["LOW_HP_DAMAGE_BOOST", "PROJECTILE_HOMING", "MOLD"]],
      },
      {
        seed: 266197553,
        params: {
          perk_picks: new Map([[8, [["EXTRA_PERK"]]]]),
          worldOffset: 8,
        },
        ans: [
          ["LASER_AIM", "EXTRA_PERK", "IRON_STOMACH"],
          ["CRITICAL_HIT", "EXTRA_SHOP_ITEM", "TELEKINESIS", "UNLIMITED_SPELLS"],
          ["FASTER_WANDS", "ADVENTURER", "BOUNCE", "EXTRA_PERK"],
          ["PERSONAL_LASER", "FASTER_LEVITATION", "PROJECTILE_EATER_SECTOR", "ANGRY_GHOST"],
          ["EDIT_WANDS_EVERYWHERE", "EXTRA_MANA", "GAMBLE", "EXPLODING_GOLD"],
          ["GLASS_CANNON", "REVENGE_TENTACLE", "HOMUNCULUS", "ELECTRICITY"],
        ],
      },
      {
        seed: 806,
        params: {
          maxLevels: 2,
          perk_picks: new Map([[0, [[]]]]),
          worldOffset: 0,
        },
        ans: [
          ["BLEED_GAS", "PROTECTION_ELECTRICITY", "VAMPIRISM"],
          ["BLEED_OIL", "EXTRA_PERK", "PROTECTION_RADIOACTIVITY"],
        ],
      },
      {
        seed: 806,
        params: {
          maxLevels: 2,
          perk_picks: new Map([[0, [["BLEED_GAS"]]]]),
          worldOffset: 0,
        },
        ans: [
          ["BLEED_GAS", "PROTECTION_ELECTRICITY", "VAMPIRISM"],
          ["BLEED_OIL", "EXTRA_PERK", "TELEPORTITIS"],
        ],
      },
      {
        seed: 1879996134,
        params: {
          maxLevels: 7,
          perk_picks: new Map([[0, [, , , , , ["GAMBLE"]]]]),
          worldOffset: 0,
        },
        ans: [
          ["MEGA_BEAM_STONE", "PROTECTION_RADIOACTIVITY", "PERKS_LOTTERY"],
          ["EXTRA_HP", "WORM_SMALLER_HOLES", "PLAGUE_RATS"],
          ["EXTRA_MONEY_TRICK_KILL", "PROJECTILE_REPULSION", "REVENGE_TENTACLE"],
          ["MOVEMENT_FASTER", "PROJECTILE_EATER_SECTOR", "PERSONAL_LASER"],
          ["PROTECTION_EXPLOSION", "REMOVE_FOG_OF_WAR", "EXTRA_MANA"],
          ["GAMBLE", "TRICK_BLOOD_MONEY", "REVENGE_EXPLOSION", "BLEED_OIL", "GENOME_MORE_LOVE"],
          ["EXTRA_SLOTS", "HUNGRY_GHOST", "DISSOLVE_POWDERS"],
        ],
      },
    ];
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const ap = new PerkInfoProvider(randoms);
        await ap.ready();
        randoms.SetWorldSeed(t.seed);
        const { perk_picks, maxLevels, returnPerkObjects, worldOffset, rerolls } = t.params;
        const res = ap.provide(perk_picks, maxLevels, returnPerkObjects, worldOffset, rerolls);
        expect(res).toEqual(t.ans);
      });
    });
  });

  describe("#provideStateless", () => {
    const tests: any[] = [
      {
        seed: 123,
        params: { state: [] },
        ans: {
          lotteries: 0,
          perkRerolls: [],
          perks: [],
          pickedState: new Map(),
          pickedPerks: [],
          worldOffset: 0,
        },
      },
      {
        seed: 123,
        params: { state: [{ type: IPerkChangeStateType.genRow, data: 0 }] },
        ans: {
          lotteries: 0,
          perkRerolls: [],
          perks: [["LOW_HP_DAMAGE_BOOST", "PROJECTILE_HOMING", "MOLD"]],
          pickedState: new Map([[0, []]]),
          pickedPerks: [],
          worldOffset: 0,
        },
      },
      {
        seed: 123,
        params: {
          state: [
            { type: IPerkChangeStateType.genRow, data: 0 },
            { type: IPerkChangeStateType.genRow, data: 1 },
          ],
        },
        ans: {
          lotteries: 0,
          perkRerolls: [],
          perks: [
            ["LOW_HP_DAMAGE_BOOST", "PROJECTILE_HOMING", "MOLD"],
            ["BLEED_GAS", "RADAR_ENEMY", "FASTER_LEVITATION"],
          ],
          pickedState: new Map([[0, []]]),
          pickedPerks: [],
          worldOffset: 0,
        },
      },
      {
        seed: 806,
        params: {
          state: [
            { type: IPerkChangeStateType.genRow, data: 0 },
            { type: IPerkChangeStateType.genRow, data: 1 },
          ],
        },
        ans: {
          lotteries: 0,
          perkRerolls: [],
          perks: [
            ["BLEED_GAS", "PROTECTION_ELECTRICITY", "VAMPIRISM"],
            ["BLEED_OIL", "EXTRA_PERK", "PROTECTION_RADIOACTIVITY"],
          ],
          pickedState: new Map([[0, []]]),
          pickedPerks: [],
          worldOffset: 0,
        },
      },
      {
        seed: 806,
        params: {
          state: [
            { type: IPerkChangeStateType.genRow, data: 0 },
            { type: IPerkChangeStateType.select, data: { row: 0, pos: 0 } },
            { type: IPerkChangeStateType.genRow, data: 1 },
          ],
        },
        ans: {
          lotteries: 0,
          pickedState: new Map([[0, [["BLEED_GAS"]]]]),
          perkRerolls: [],
          perks: [
            ["BLEED_GAS", "PROTECTION_ELECTRICITY", "VAMPIRISM"],
            ["BLEED_OIL", "EXTRA_PERK", "TELEPORTITIS"],
          ],
          pickedPerks: [["BLEED_GAS"]],
          worldOffset: 0,
        },
      },

      // TODO: This should be better tested
    ];
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const ap = new PerkInfoProvider(randoms);
        await ap.ready();
        randoms.SetWorldSeed(t.seed);
        const { state } = t.params;
        const res = ap.provideStateless(state);
        expect(res).toEqual(t.ans);
      });
    });

    it("counts Extra Perk from Gamble once in advanced mode", async () => {
      const randoms = await loadRandom();
      const ap = new PerkInfoProvider(randoms);
      await ap.ready();
      randoms.SetWorldSeed(835278105);

      const state: Parameters<PerkInfoProvider["provideStateless"]>[0] = [];

      for (let level = 0; level < 7; level++) {
        state.push({ type: IPerkChangeStateType.genRow, data: level });
      }

      for (let world = 1; world <= 4; world++) {
        state.push({ type: IPerkChangeStateType.shift, data: 1 });
        if (world < 4) {
          for (let level = 0; level < 6; level++) {
            state.push({ type: IPerkChangeStateType.genRow, data: level });
          }
        }
      }

      state.push({ type: IPerkChangeStateType.genRow, data: 0 });

      const east4 = ap.provideStateless(state);
      const gamblePos = east4.perks[0].indexOf("GAMBLE");
      expect(gamblePos).not.toBe(-1);

      state.push({ type: IPerkChangeStateType.select, data: { row: 0, pos: gamblePos } });
      state.push({ type: IPerkChangeStateType.genRow, data: 1 });

      const afterGamble = ap.provideStateless(state);

      expect(afterGamble.perks[0].slice(-2)).toEqual(["FAST_PROJECTILES", "EXTRA_PERK"]);
      expect(afterGamble.perks[1]).toHaveLength(4);
    });
  });
});
