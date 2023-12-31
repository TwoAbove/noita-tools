import { describe, it, expect } from "vitest";
import { PotionSecretInfoProvider } from "./PotionSecret";
import { loadRandom } from "../../../../testHelpers";

describe("PotionSecretInfoProvider", () => {
  const tests = [
    {
      seed: 31,
      params: {
        x: -78,
        y: 1373,
      },
      ans: "salt",
    },
    {
      seed: 560,
      params: {
        x: -78,
        y: 1373,
      },
      ans: "bush_seed",
    },
    {
      seed: 574,
      params: {
        x: -78,
        y: 1373,
      },
      ans: "magic_liquid_hp_regeneration_unstable",
    },
    {
      seed: 915,
      params: {
        x: -78,
        y: 1373,
      },
      ans: "purifying_powder",
    },
    {
      seed: 1700,
      params: {
        x: -78,
        y: 1373,
      },
      ans: "snow",
    },
    {
      seed: 2825,
      params: {
        x: -78,
        y: 1373,
      },
      ans: "blood_worm",
    },
  ];

  describe("#provide", () => {
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const potion = new PotionSecretInfoProvider(randoms);
        randoms.SetWorldSeed(t.seed);
        const res = potion.provide(t.params.x, t.params.y);
        expect(res).toEqual(t.ans);
      });
    });
  });
});
