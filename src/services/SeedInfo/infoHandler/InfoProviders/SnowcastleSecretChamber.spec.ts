import { describe, it, expect } from "vitest";
import { SnowcastleSecretChamberInfoProvider } from "./SnowcastleSecretChamber";
import { MapInfoProvider } from "./Map";
import { loadRandom } from "../../../../testHelpers";

describe.skip("SnowcastleSecretChamberInfoProvider", () => {
  const tests = [
    {
      seed: 123,
      ans: [],
    },
  ];

  describe("#provide", () => {
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const mapInfoProvider = new MapInfoProvider(randoms);
        await mapInfoProvider.ready();
        const provider = new SnowcastleSecretChamberInfoProvider(randoms, mapInfoProvider);
        await provider.ready();
        randoms.SetWorldSeed(t.seed);
        const res = provider.provide(t.seed);
        expect(res).toEqual(t.ans);
      });
    });
  });
});
