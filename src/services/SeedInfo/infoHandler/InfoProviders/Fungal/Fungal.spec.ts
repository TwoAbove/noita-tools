import { describe, it, expect } from "vitest";
import { FungalInfoProvider } from "./";
import { loadRandom } from "../../../../../testHelpers";

describe("FungalInfoProvider", () => {
  const tests = [
    {
      seed: 123,
      ans: [
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["lava"],
          to: "sand",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["magic_liquid_polymorph", "magic_liquid_unstable_polymorph"],
          to: "blood",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["radioactive_liquid", "poison", "material_darkness"],
          to: "water",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["water", "water_static", "water_salt", "water_ice"],
          to: "radioactive_liquid",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["lava"],
          to: "blood",
          gold_to_x: "gold",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["radioactive_liquid", "poison", "material_darkness"],
          to: "acid",
          gold_to_x: "mammi",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["oil", "swamp", "peat"],
          to: "water",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["water", "water_static", "water_salt", "water_ice"],
          to: "pea_soup",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["acid"],
          to: "lava",
          gold_to_x: "gold",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["water", "water_static", "water_salt", "water_ice"],
          to: "blood_fungi",
          gold_to_x: "mammi",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["oil", "swamp", "peat"],
          to: "acid",
          gold_to_x: "mammi",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["oil", "swamp", "peat"],
          to: "vomit",
          gold_to_x: "acid_gas",
        },
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["acid"],
          to: "fungi",
          gold_to_x: "gold",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: [
            "acid_gas",
            "acid_gas_static",
            "poison_gas",
            "fungal_gas",
            "radioactive_gas",
            "radioactive_gas_static",
          ],
          to: "gunpowder",
          gold_to_x: "brass",
        },
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["silver", "brass", "copper"],
          to: "acid",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["oil", "swamp", "peat"],
          to: "silver",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["diamond"],
          to: "silver",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["diamond"],
          to: "radioactive_liquid",
          gold_to_x: "gold",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["lava"],
          to: "radioactive_liquid",
          gold_to_x: "acid_gas",
        },
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["lava"],
          to: "water",
          gold_to_x: "gold",
        },
      ],
    },
    {
      seed: 1307857905,
      ans: [
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["oil", "swamp", "peat"],
          to: "steam",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["diamond"],
          to: "silver",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["diamond"],
          to: "silver",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["diamond"],
          to: "magic_liquid_teleportation",
          gold_to_x: "gold",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["snow_sticky"],
          to: "poison",
          gold_to_x: "vomit",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["blood_cold", "blood_worm"],
          to: "alcohol",
          gold_to_x: "pea_soup",
        },
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["blood"],
          to: "fungi",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["acid"],
          to: "sand",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["magic_liquid_polymorph", "magic_liquid_unstable_polymorph"],
          to: "water",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["water", "water_static", "water_salt", "water_ice"],
          to: "lava",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["lava"],
          to: "oil",
          gold_to_x: "gold",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["lava"],
          to: "water_swamp",
          gold_to_x: "silver",
        },
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["blood"],
          to: "water",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["water", "water_static", "water_salt", "water_ice"],
          to: "gunpowder",
          gold_to_x: "gold",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["steam", "smoke"],
          to: "blood_fungi",
          gold_to_x: "radioactive_liquid",
        },
        {
          flaskTo: false,
          flaskFrom: false,
          from: ["oil", "swamp", "peat"],
          to: "blood_fungi",
          gold_to_x: "gold",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["radioactive_liquid", "poison", "material_darkness"],
          to: "steam",
          gold_to_x: "gold",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["diamond"],
          to: "radioactive_liquid",
          gold_to_x: "radioactive_liquid",
        },
        {
          flaskTo: false,
          flaskFrom: true,
          from: ["lava"],
          to: "radioactive_liquid",
          gold_to_x: "gold",
        },
        {
          flaskTo: true,
          flaskFrom: false,
          from: ["lava"],
          to: "poison",
          gold_to_x: "radioactive_liquid",
        },
      ],
    },
  ];

  describe("#provide", () => {
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const ap = new FungalInfoProvider(randoms);
        await ap.ready();
        randoms.SetWorldSeed(t.seed);
        const res = ap.provide();
        expect(res).toEqual(t.ans);
      });
    });
  });
});
