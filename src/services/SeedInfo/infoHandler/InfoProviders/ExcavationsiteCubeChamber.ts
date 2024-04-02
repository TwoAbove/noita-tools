/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { mapHandlerStub } from "../helpers";
import { InfoProvider } from "./Base";
import { MapInfoProvider } from "./Map";
import { WandInfoProvider } from "./Wand";

export class ExcavationsiteCubeChamberInfoProvider extends InfoProvider {
  wandInfoProvider: WandInfoProvider;
  mapInfoProvider: MapInfoProvider;
  constructor(randoms, wandInfoProvider: WandInfoProvider, mapInfoProvider: MapInfoProvider) {
    super(randoms);
    this.wandInfoProvider = wandInfoProvider;
    this.mapInfoProvider = mapInfoProvider;
  }

  provide(seed: number) {
    const points = this.mapInfoProvider.provide(26, 18, seed);
    return points;
  }

  test(rule: IRule): boolean {
    return true;
  }
}
