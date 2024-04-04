/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";
import { MapInfoProvider } from "./Map";

export class SnowcaveSecretChamberProvider extends InfoProvider {
  mapInfoProvider: MapInfoProvider;
  constructor(randoms, mapInfoProvider: MapInfoProvider) {
    super(randoms);
    this.mapInfoProvider = mapInfoProvider;
  }

  provide(seed: number) {
    const points = this.mapInfoProvider.provide(42, 22, seed);
    return points;
  }

  test(rule: IRule): boolean {
    return true;
  }
}
