/**
 * @jest-environment node
 */

import { IRandom } from "../../../random";
import { AlchemyInfoProvider } from "./";
import { loadRandom } from "../../../../../testHelpers";

describe("AlchemyInfoProvider", () => {
  let randoms: IRandom;
  beforeAll(async () => {
    randoms = await loadRandom();
  });

  it("Should generate output", async () => {
    const ap = new AlchemyInfoProvider(randoms);
    await ap.ready();
    randoms.SetWorldSeed(123);
    const res = ap.provide();
    expect(res).toEqual({
      AP: ["swamp", "magic_liquid_movement_faster", "wax"],
      LC: ["lava", "magic_liquid_invisibility", "diamond"],
    });
  });
});
