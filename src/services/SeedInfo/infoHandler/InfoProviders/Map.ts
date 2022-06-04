/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Not available in web worker
import {
	cropImageData,
	imageFromBase64,
	rgbaToHex
} from '../../../../components/LiveSeedStats/OCRHandler/imageActions';
import { Objectify } from '../../../helpers';
import mapData from '../../data/obj/maps.json';
import { IRule } from '../IRule';
import { InfoProvider } from './Base';

const worldMap = await imageFromBase64(
	'data:image/png;base64,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',
	70,
	48
);

const getColor = (x, y) => {
	const pixelPos = 4 * (x + y * worldMap.width);
	const color = rgbaToHex(
		worldMap.data[pixelPos + 0],
		worldMap.data[pixelPos + 1],
		worldMap.data[pixelPos + 2],
		worldMap.data[pixelPos + 3]
	);
	return color;
};

export class MapInfoProvider extends InfoProvider {
	maps = mapData as Objectify<typeof mapData>;

	mapCache = new Map<string, ImageData>();
	seed?: string;

	getMapChunk(
		map: ImageData,
		_x: number,
		_y: number,
		width: number,
		height: number
	) {
		return map;
		const tiles_w = map.width / width;
		const tiles_h = map.height / height;

		const x = _x % tiles_w;
		const y = _y % tiles_h;
		return cropImageData(map, x * width, y * height, width, height);
	}

	async provide(x: number, y: number, seed: string) {
		if (this.seed !== seed) {
			this.mapCache = new Map();
		}
		const color = getColor(x, y);
		const mapData = this.maps[color];
		if (!mapData || !mapData.wang) {
			// console.error('Cannot generate map for color ' + color);
			return;
		}

		const {
			map_width,
			map_height,
			wang_map_width: res_width,
			wang_map_height: res_height,
			template_file
		} = mapData.wang!;
		const areas = mapData.areas || [];
		const areaIndex = areas.findIndex(
			a => a.x1 <= x && a.x2 >= x && a.y1 <= y && a.y2 >= y
		);
		const area = areas[areaIndex];
		const cacheKey = `${color} ${areaIndex}`;

		if (this.mapCache.has(cacheKey)) {
			const map = this.mapCache.get(cacheKey);

			return (
				map &&
				this.getMapChunk(
					map,
					x - area.x1,
					y - area.y1,
					res_width / 5,
					res_height / 5
				)
			);
		}

		const img = await imageFromBase64(template_file, map_width, map_height);

		const map = this.randoms.GenerateMap(
			img,
			map_width,
			map_height,
			51.2 * area.w,
			51.2 * area.h
		);

		this.mapCache.set(cacheKey, map);
		// return map
		return this.getMapChunk(
			map,
			x - area.x1,
			y - area.y1,
			res_width / 5,
			res_height / 5
		);
		// return this.getMapChunk(map, x, y, res_width/ 5, res_height/ 5);
		for (let i = 0; i < map.data.length; i += 4) {
			// colors in mapData are [rgba]
			const color = rgbaToHex(
				map.data[i + 0],
				map.data[i + 1],
				map.data[i + 2],
				map.data[i + 3]
			);
		}
	}

	test(rule: IRule): boolean {
		return true;
	}
}
