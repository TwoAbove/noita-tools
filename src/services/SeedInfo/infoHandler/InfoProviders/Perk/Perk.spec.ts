import { describe, it, expect, vi, beforeEach } from "vitest";
import { IPerkChangeStateType, PerkInfoProvider, IPerkChangeAction, ISelectAction } from "./";
import { loadRandom } from "../../../testHelpers"; // Corrected path
import { NoitaRandomItem } from "../../random"; // Corrected path
import { getPerk } from "../../../../../testHelpers"; // getPerk seems to be from testHelpers too

describe("PerkInfoProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
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
  });

  it('should correctly handle EXTRA_PERK from GAMBLE in provideStateless without double counting', async () => {
    await loadRandom(); // Load WASM random generator
    const randoms = new NoitaRandomItem(12345); // Use a fixed seed for reproducibility
    const perkProvider = new PerkInfoProvider(randoms);
    await perkProvider.ready(); // Ensure perks are loaded if actual data is partially used

    const mockPerksData = {
      'GAMBLE': { id: 'GAMBLE', ui_name: 'Gamble', not_in_default_perk_pool: false, stackable: false, perk_icon: '', description: '' },
      'EXTRA_PERK': { id: 'EXTRA_PERK', ui_name: 'Extra Perk', not_in_default_perk_pool: false, stackable: false, perk_icon: '', description: '' },
      'TEST_PERK_1': { id: 'TEST_PERK_1', ui_name: 'Test Perk 1', not_in_default_perk_pool: false, stackable: false, perk_icon: '', description: '' },
      'TEST_PERK_2': { id: 'TEST_PERK_2', ui_name: 'Test Perk 2', not_in_default_perk_pool: false, stackable: false, perk_icon: '', description: '' },
      'ALWAYS_CAST': { id: 'ALWAYS_CAST', ui_name: 'Always Cast', not_in_default_perk_pool: false, stackable: false, perk_icon: '', description: '' },
      'DEFAULT_PERK': { id: 'DEFAULT_PERK', ui_name: 'Default Perk', not_in_default_perk_pool: false, stackable: false, perk_icon: '', description: '' },
    };
    perkProvider.perks = mockPerksData;
    perkProvider.perksArr = Object.values(mockPerksData);

    // Initialize TEMPLE_PERK_COUNT. provideStateless will reset its internal _G instance.
    // We will check perkProvider._G after the call.
    const initialTemplePerkCount = 3;
    // perkProvider._G.SetValue("TEMPLE_PERK_COUNT", initialTemplePerkCount); // provideStateless resets _G

    const getNextPerkCallOrder: string[] = [];
    vi.spyOn(perkProvider, '_getNextPerk').mockImplementation(() => {
      const callNum = getNextPerkCallOrder.length;
      getNextPerkCallOrder.push('called');
      if (callNum === 0) return 'GAMBLE';      // For genRow: perk 1
      if (callNum === 1) return 'TEST_PERK_2'; // For genRow: perk 2
      if (callNum === 2) return 'ALWAYS_CAST'; // For genRow: perk 3
      if (callNum === 3) return 'EXTRA_PERK';  // For GAMBLE action: first gamble result
      if (callNum === 4) return 'TEST_PERK_1'; // For GAMBLE action: second gamble result
      return 'DEFAULT_PERK'; // Should not be reached in this test ideally
    });

    vi.spyOn(perkProvider, 'getPerkDeck').mockReturnValue(Object.keys(mockPerksData));

    const actions: IPerkChangeAction[] = [
      { type: IPerkChangeStateType.set, data: 0 },    // Set world offset to 0
      { type: IPerkChangeStateType.genRow, data: 0 }, // Generate row 0. This will use _getNextPerk 3 times.
      {                                               // Initial perks in row 0: ['GAMBLE', 'TEST_PERK_2', 'ALWAYS_CAST']
        type: IPerkChangeStateType.select,
        data: { row: 0, pos: 0 }                      // Select 'GAMBLE' at pos 0 of row 0. This uses _getNextPerk 2 times for gamble results.
      }
    ];

    // provideStateless initializes its own _G, so TEMPLE_PERK_COUNT starts at 3 internally.
    const result = perkProvider.provideStateless(actions);

    // Assertions
    // TEMPLE_PERK_COUNT should be initial (3) + 1 (from EXTRA_PERK via handlePerkPickup) = 4
    // The bug was that it would be 3 + 1 (from handlePerkPickup) + 1 (from the now-removed block) = 5
    expect(perkProvider._G.GetValue("TEMPLE_PERK_COUNT")).toBe(initialTemplePerkCount + 1);

    expect(result.perks[0]).toBeDefined();
    expect(result.perks[0].length).toBe(3 + 2); // Original 3 + 2 from gamble
    expect(result.perks[0]).toContain('GAMBLE');
    expect(result.perks[0]).toContain('TEST_PERK_2');
    expect(result.perks[0]).toContain('ALWAYS_CAST');
    expect(result.perks[0]).toContain('EXTRA_PERK'); // First gamble result
    expect(result.perks[0]).toContain('TEST_PERK_1');  // Second gamble result
    
    expect(result.pickedPerks[0]).toBeDefined();
    // Check selected perks. pos 0 is GAMBLE, pos 3 is EXTRA_PERK (newly added), pos 4 is TEST_PERK_1 (newly added)
    expect(result.pickedPerks[0][0]).toBe('GAMBLE');
    expect(result.pickedPerks[0][3]).toBe('EXTRA_PERK');
    expect(result.pickedPerks[0][4]).toBe('TEST_PERK_1');

    // Ensure other original perks are not marked as picked unless they were
    expect(result.pickedPerks[0][1]).toBeUndefined(); 
    expect(result.pickedPerks[0][2]).toBeUndefined(); 
  });
});
