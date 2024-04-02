/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { mapHandlerStub } from "../helpers";
import { InfoProvider } from "./Base";
import Snowcavesecretchamber from "./Map/impl/Snowcavesecretchamber";
import { WandInfoProvider } from "./Wand";

/*
Generated from printing the gen function from data/scripts/biomes/snowcave_secret_chamber.lua
Math for wand position:
cube chunk - x: 42, y: 36
position in chunk - x: 350, y: 303
*/

const wandPositions = [
  {
    x: 42 * 512 + 333,
    y: 36 * 512 + 297,
  },
  {
    x: 42 * 512 + 439,
    y: 36 * 512 + 324,
  },
];

export class EyeChamberInfoProvider extends InfoProvider {
  wandInfoProvider: WandInfoProvider;
  snowcavesecretchamber: Snowcavesecretchamber;
  constructor(randoms, wandInfoProvider: WandInfoProvider) {
    super(randoms);
    this.wandInfoProvider = wandInfoProvider;
    this.snowcavesecretchamber = new Snowcavesecretchamber(
      randoms,
      mapHandlerStub,
      mapHandlerStub,
      mapHandlerStub,
      mapHandlerStub,
    );
  }

  provide(): ReturnType<WandInfoProvider["provide"]> {
    this.snowcavesecretchamber.HandleInterest = (item, x, y) => {
      console.log(item, x, y);
    };

    const [wand1, wand2] = wandPositions.map(pos => this.snowcavesecretchamber.spawn_wands(pos.x, pos.y));

    return {} as any;
    // const wand = this.wandInfoProvider.provide();
    // wand.gun.cost = 0;

    // return wand;
  }

  test(rule: IRule): boolean {
    return true;
  }
}
