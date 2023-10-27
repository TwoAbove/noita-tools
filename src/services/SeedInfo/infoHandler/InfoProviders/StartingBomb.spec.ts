import { describe, it, expect } from "vitest";
import { StartingBombSpellInfoProvider } from "./StartingBomb";
import { loadRandom } from "../../../../testHelpers";

describe("StartingBombSpellInfoProvider", () => {
  const tests = [
    {
      seed: 123,
      ans: "DYNAMITE",
    },
    {
      seed: 5151515,
      ans: "BOMB",
    },
    {
      seed: 123435616,
      ans: "MINE",
    },
  ];

  describe("#provide", () => {
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const ap = new StartingBombSpellInfoProvider(randoms);
        randoms.SetWorldSeed(t.seed);
        const res = ap.provide();
        expect(res).toEqual(t.ans);
      });
    });
  });
});
