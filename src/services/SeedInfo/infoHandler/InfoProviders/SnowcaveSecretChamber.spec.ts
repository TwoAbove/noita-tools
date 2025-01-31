import { describe, it, expect } from "vitest";
import { SnowcaveSecretChamberInfoProvider } from "./SnowcaveSecretChamber";
import { WandInfoProvider } from "./Wand";
import { MapInfoProvider } from "./Map";
import { loadRandom } from "../../../../testHelpers";

describe.skip("SnowcaveSecretChamberInfoProvider", () => {
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
        const wandInfoProvider = new WandInfoProvider(randoms);
        const mapInfoProvider = new MapInfoProvider(randoms);
        await wandInfoProvider.ready();
        await mapInfoProvider.ready();
        const provider = new SnowcaveSecretChamberInfoProvider(randoms, mapInfoProvider, wandInfoProvider);
        await provider.ready();
        randoms.SetWorldSeed(t.seed);
        const res = provider.provide(t.seed);
        expect(res).toEqual(t.ans);
      });
    });
  });
});
