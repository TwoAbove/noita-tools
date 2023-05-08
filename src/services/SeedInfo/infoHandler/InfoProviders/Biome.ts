/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import biomesData from "../../data/biome_names.json";
import { IRule } from "../IRule";
import { InfoProvider } from "./Base";

export class BiomeInfoProvider extends InfoProvider {
  biomes = biomesData;
  provide(biomeId: string) {
    let found = this.biomes.find(e => e.id === biomeId);
    if (found) return found;
    console.warn("Could not find biome: " + biomeId);
    return {
      translated_name: biomeId,
    };
  }

  isPrimary(biomeId: string) {
    let found = this.biomes.find(e => e.id === biomeId);
    return found && found.translated_name !== "";
  }

  translate(biomeName: any) {
    return this.provide(biomeName).translated_name;
  }

  test(rule: IRule): boolean {
    return true;
  }
}
