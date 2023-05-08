/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import templeData from "../../data/temple-locations.json";
import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

export class LotteryInfoProvider extends InfoProvider {
  temples = templeData;

  provide(level: number, perkNumber: number, perksOnLevel: number, worldOffset = 0, lotteries = 0) {
    const { x, y } = this.temples[level];
    const perkY = y;
    // In Noita's code x is `x + (i-0.5)*item_width`
    // Since we use 0..n-1 instead of 1..n, we use `+ 0.5` since we can
    // think of this as `i + 1 - 0.5`, which can be simplified to
    // `i + 0.5`
    const perkX = this.randoms.RoundHalfOfEven(x + (perkNumber + 0.5) * (60 / perksOnLevel)) + 35840 * worldOffset;
    const probability = 100 * Math.pow(0.5, lotteries);
    this.randoms.SetRandomSeed(perkX, perkY);
    return !(this.randoms.Random(1, 100) <= probability);
  }

  test(rule: IRule): boolean {
    return true;
  }
}
