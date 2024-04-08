/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";
import { MapInfoProvider } from "./Map";
import { WandInfoProvider } from "./Wand";

const getWandArgs = (wand: string): [number, number, boolean] => {
  switch (wand) {
    case "data/entities/items/wand_level_03.xml":
      return [60, 3, false];
    case "data/entities/items/wand_unshuffle_02.xml":
      return [40, 2, true];
  }
  return [0, 0, false];
};

export class ExcavationsiteCubeChamberInfoProvider extends InfoProvider {
  wandInfoProvider: WandInfoProvider;
  mapInfoProvider: MapInfoProvider;
  constructor(randoms, mapInfoProvider: MapInfoProvider, wandInfoProvider: WandInfoProvider) {
    super(randoms);
    this.mapInfoProvider = mapInfoProvider;
    this.wandInfoProvider = wandInfoProvider;
  }

  provide(seed: number) {
    const points = this.mapInfoProvider.provide(26, 18, seed);
    const wandPoint = points.interestPoints.points!.find(p => p.item.startsWith("data/entities/items/wand_"))!;
    const wand = this.wandInfoProvider.provide(wandPoint.gx, wandPoint.gy, ...getWandArgs(wandPoint.item), false);
    return wand;
  }

  test(rule: IRule): boolean {
    return true;
  }
}
