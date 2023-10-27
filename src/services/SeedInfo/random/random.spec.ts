import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { loadRandom } from "../../../testHelpers";

describe("Randoms", () => {
  describe("#Random", () => {
    const tests = [
      {
        seed: 1674055821,
        params: {
          x: 1475.5,
          y: 827,
        },
        ans: [65, 40641, 57806, 3],
      },
      {
        seed: 1674055821,
        params: {
          x: 1385.5,
          y: 177,
        },
        ans: [64, 57621, 39985, 12],
      },
      {
        seed: 1674055821,
        params: {
          x: 185.5,
          y: 107,
        },
        ans: [69, 86000, 94607, 9],
      },
    ];
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const random = await loadRandom();
        random.SetWorldSeed(t.seed);
        random.SetRandomSeed(t.params.x, t.params.y);
        expect(random.Random(0, 100)).toEqual(t.ans[0]);
        expect(random.Random(0, 100000)).toEqual(t.ans[1]);
        expect(random.Random(200, 100000)).toEqual(t.ans[2]);
        expect(random.Random(1, 12)).toEqual(t.ans[3]);
      });
    });
  });
});
