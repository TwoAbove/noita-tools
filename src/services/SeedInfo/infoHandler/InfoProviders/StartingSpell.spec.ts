/**
 * @jest-environment node
 */

import { StartingSpellInfoProvider } from "./StartingSpell";
import { loadRandom } from "../../../../testHelpers";

describe("StartingSpellInfoProvider", () => {
  const tests = [
    {
      seed: 123,
      ans: "LIGHT_BULLET",
    },
    {
      seed: 5151515,
      ans: "RUBBER_BALL",
    },
    {
      seed: 123435616,
      ans: "SPITTER",
    },
  ];

  describe("#provide", () => {
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const ap = new StartingSpellInfoProvider(randoms);
        randoms.SetWorldSeed(t.seed);
        const res = ap.provide();
        expect(res).toEqual(t.ans);
      });
    });
  });
});
