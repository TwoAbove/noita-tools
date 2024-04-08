import { describe, it, expect } from "vitest";
import { PotionInfoProvider } from "./Potion";
import { loadRandom } from "../../../../testHelpers";

describe("PotionInfoProvider", () => {
  const tests = [
    {
      seed: 1674055821,
      params: {
        x: 1390,
        y: 183,
      },
      ans: "material_confusion",
    },
    {
      seed: 1674055821,
      params: {
        x: 1200,
        y: 633,
      },
      ans: "lava",
    },
    {
      seed: 1674055821,
      params: {
        x: 1480,
        y: 833,
      },
      ans: "magic_liquid_invisibility",
    },
    {
      seed: 1674055821,
      params: {
        x: 190,
        y: 113,
      },
      ans: "magic_liquid_invisibility",
    },
    {
      seed: 5,
      params: {
        x: -78,
        y: 1373,
      },
      ans: "magic_liquid_worm_attractor",
    },
    {
      seed: 10,
      params: {
        x: -78,
        y: 1373,
      },
      ans: "magic_liquid_faster_levitation",
    },
  ];

  describe("#provide", () => {
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const potion = new PotionInfoProvider(randoms);
        randoms.SetWorldSeed(t.seed);
        const res = potion.provide(t.params.x, t.params.y);
        expect(res).toEqual(t.ans);
      });
    });
  });
});
