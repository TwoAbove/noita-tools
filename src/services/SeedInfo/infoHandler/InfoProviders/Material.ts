/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import materialsData from '../../data/materials.json';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';

export class MaterialInfoProvider extends InfoProvider {
  materials = materialsData // await this.loadAsync("data/materials.json");
  allMaterials = Array.prototype.concat.apply(this, this.materials.map(e => e.normal.concat(e.statics)));

  provide(materialName: string) {
    if (materialName.charAt(0) === '(') {  // specials, like (flask) for fungal shift
      return {
        translated_name: materialName
      }
    }
    let found = this.allMaterials.find(e => e.name === materialName);
    if (found) return found;
    console.warn("Could not find material: " + materialName);
    return {
      translated_name: materialName
    };
  }

  translate(materialName: any) {
    return this.provide(materialName).translated_name;
  }

  test(rule: IRule): boolean {
    return true;
  }
}
