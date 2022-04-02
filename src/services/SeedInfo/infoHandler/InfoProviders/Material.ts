/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { i18n } from 'i18next';
import materialsData from '../../data/materials.json';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';

// import i18n from '../../../../i18n';

export class MaterialInfoProvider extends InfoProvider {
  materials = materialsData;

  i18n?: i18n;

  constructor(i18n?: i18n) {
    super({} as any);
    this.i18n = i18n;
  }

  provide(materialName: string) {
    if (materialName.charAt(0) === '(') {  // specials, like (flask) for fungal shift
      return {
        ui_name: materialName
      }
    }
    let found = this.materials[materialName];
    if (found) return found;
    console.warn("Could not find material: " + materialName);
    return {
      ui_name: materialName
    };
  }

  translate(materialName: string) {
    if (!this.i18n?.t) {
      return materialName;
    }
    return this.i18n.t(this.provide(materialName).ui_name, { ns: 'materials' });
  }

  test(rule: IRule): boolean {
    return true;
  }
}
