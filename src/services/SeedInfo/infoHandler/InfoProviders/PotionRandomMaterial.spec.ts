import { describe, it, expect } from "vitest";
import { PotionRandomMaterialInfoProvider } from "./PotionRandomMaterial";
import { loadRandom } from "../../../../testHelpers";
import _ from "lodash";

describe("PotionRandomMaterialInfoProvider", () => {
  const tests = [
    {
      seed: 40309,
      params: {
        x: 432,
        y: 2056,
      },
      ans: "ceiling_plant_material",
    },
    {
      seed: 60408,
      params: {
        x: 432,
        y: 2056,
      },
      ans: "meat_slime_sand",
    },
    {
      seed: 77657,
      params: {
        x: 432,
        y: 2056,
      },
      ans: "plasma_fading_green",
    },
    {
      seed: 90921,
      params: {
        x: 432,
        y: 2056,
      },
      ans: "sandstone_surface",
    },
    {
      seed: 171952,
      params: {
        x: 432,
        y: 2056,
      },
      ans: "fungus_powder",
    },
    {
      seed: 193007,
      params: {
        x: 432,
        y: 2056,
      },
      ans: "juhannussima",
    },
  ];

  describe("#provide", () => {
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i} (seed ${t.seed})`, async () => {
        const randoms = await loadRandom();
        const potion = new PotionRandomMaterialInfoProvider(randoms);
        randoms.SetWorldSeed(t.seed);
        const res = potion.provide(t.params.x, t.params.y);
        expect(res).toEqual(t.ans);
      });
    });
  });
});
