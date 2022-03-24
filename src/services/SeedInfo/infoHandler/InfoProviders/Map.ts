/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { createImage, imageFromBase64 } from '../../../../components/LiveSeedStats/OCRHandler/imageActions';
import { Objectify } from '../../../helpers';
import mapData from '../../data/obj/maps.json';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';

export class MapInfoProvider extends InfoProvider {
  maps = mapData  as Objectify<typeof mapData>;

  async provide(color: string | number, xs: number, ys: number) {
    const mapData = this.maps[color];
    if (mapData.type !== 'BIOME_WANG_TILE') {
      console.error('Cannot generate map for color ' + color);
      return;
    }
    const {map_height, map_width, template_file} = mapData.wang!;

    const img = await imageFromBase64(template_file, map_width, map_height);

    this.randoms.GenerateMap(img, map_height, map_width, xs, ys);
  }

  test(rule: IRule): boolean {
    return true;
  }
}
