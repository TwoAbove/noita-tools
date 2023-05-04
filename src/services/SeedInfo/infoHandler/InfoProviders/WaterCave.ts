/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

export class WaterCaveInfoProvider extends InfoProvider {
  provide() {
    // Generated from printing the gen function from data/scripts/biomes/watercave.lua
    return Math.floor(this.randoms.ProceduralRandomf(-2048, 515, 0, 5));
  }

  test(rule: IRule): boolean {
    return true;
  }
}
