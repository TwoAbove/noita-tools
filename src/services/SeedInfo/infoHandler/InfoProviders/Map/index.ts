/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Not available in web worker
import {
	cropImageData,
	imageFromBase64,
	hexRGBAtoIntRGB,
	scaleImageData,
	drawImageData
} from '../../../../../components/LiveSeedStats/OCRHandler/imageActions';
import mapData from '../../../data/obj/maps.json';
import { IRule } from '../../IRule';
import { InfoProvider } from '../Base';

import impls from '../../../data/obj/impl.json';

import MapImplementations from './MapImplementations';
import { isUndefined } from 'lodash';
import { getColor, getGlobalPos, getLocalPos, imageFromHexArray, iteratePixels } from './helpers';

const worldMap = await imageFromBase64(
	'data:image/png;base64,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',
	70,
	48
);

export interface Interest {
	item: string;
	gx: number;
	gy: number;
	px: number;
	py: number;

	extra?: any;
}

const getMapChunk = (
	map: ImageData,
	_x: number,
	_y: number,
	width: number,
	height: number
) => {
	// return map;
	const tiles_w = map.width / width;
	const tiles_h = map.height / height;

	const x = _x % tiles_w;
	const y = _y % tiles_h;
	return cropImageData(map, x * width, y * height, width, height);
};

export class MapInfoProvider extends InfoProvider {
	maps = mapData;

	imageCache = new Map<string, ImageData>();
	rawMapCache = new Map<string, ImageData>();
	mapCache = new Map<string, ImageData>();
	interestPointsCache = new Map<string, any>();
	seed?: string;

	getArea(x, y, color) {
		const mapData = this.maps[color];
		const areas = mapData.areas || [];
		const areaIndex = areas.findIndex(
			a => a.x1 <= x && a.x2 >= x && a.y1 <= y && a.y2 >= y
		);
		return areas[areaIndex];
	}

	async getMap(
		x: number,
		y: number,
		seed: string,
		worldOffset: number,
		iter: number
	) {
		const color = getColor(worldMap, x, y);
		const mapData = this.maps[color];

		if (!mapData || !mapData.wang) {
			return;
		}

		const { map_width, map_height, template_file } = mapData.wang!;
		const area = this.getArea(x, y, color);
		const cacheKey = `${color} ${area.x1} ${area.y1} ${iter}`;

		if (this.rawMapCache.has(cacheKey)) {
			const map = this.rawMapCache.get(cacheKey);

			return map;
		}

		const wang_map = await imageFromBase64(
			template_file,
			map_width,
			map_height
		);
		const w = this.randoms.GetWidthFromPix(area.x1, area.x2 + 1);
		const h = this.randoms.GetWidthFromPix(area.y1, area.y2 + 1);

		const randomMaterials: number[][] = [];

		if (mapData.randomMaterials) {
			for (const from of Object.keys(mapData.randomMaterials)) {
				const fromInt = hexRGBAtoIntRGB(from);
				const to = mapData.randomMaterials[from].map(hexRGBAtoIntRGB);
				// To send a 1d array to c++
				const flat = [fromInt, to.length, ...to];
				randomMaterials.push(flat);
			}
		}
		const flatRandomMaterials = [
			randomMaterials.length,
			...randomMaterials.flat()
		];
		const startTime = performance.now();
		const map = this.randoms.GenerateMap(
			wang_map,
			map_width,
			map_height,
			w,
			h,
			mapData.name === 'coalmine',
			flatRandomMaterials,
			area.x1,
			area.y1,
			iter
		);
		const endTime = performance.now();
		const execTime = endTime - startTime;
		console.log({ execTime });
		this.rawMapCache.set(cacheKey, map);
		// return map
		return map;
	}


	async getInterestPoints(x: number, y: number, color: string, areaMap: ImageData) {
		const area = this.getArea(x, y, color);

		const points: Interest[] = [];
		// This is defined because it's being
		const mapData = this.maps[color]!;
		if (!MapImplementations[color]) {
			console.error(`No MapImplementation for ${color}`);
			return;
		}

		const LoadPixelScene = async (
			path: string,
			visual_file: string,
			gx: number,
			gy: number,
			background_file = '',
			skip_biome_checks = false,
			skip_edge_textures = false,
			color_to_material_table = {},
			background_z_index = 50
		) => {
			console.log('LoadPixelScene', path, gx, gy);
			const impl = impls[path];
			if (!impl) {
				console.error(
					`${path} not in impls! Please add it to dataScripts/src/pixelScenes.ts and re-run generation.`
				);
				return;
			}
			const image = this.imageCache.has(path) ? this.imageCache.get(path)! : await imageFromBase64(impl.src, impl.w, impl.h);

			const { px, py } = getLocalPos(x, y, gx, gy);

			drawImageData(image, areaMap, px, py);
			console.groupCollapsed(path + ' iter');
			await iteratePixels(image, 1, async (dx, dy, c) => {
				const funcName = mapData.config!.spawnFunctions[c];
				if (!funcName) {
					return;
				}
				// const { gx, gy } = getGlobalPos(x, y, px + dx, py + dy);
				console.log('iteratePixels', { gx, gy, px, py, dx, dy, x, y, funcName });
				await mapImplementation.handle(funcName, gx + dx, gy + dy);
			});
			console.groupEnd();
		};

		const HandleInterest = async (item: string, gx: number, gy: number, extra?: any) => {
			const { px, py } = getLocalPos(x, y, gx, gy);
			const res: Interest = {
				item,
				gx,
				gy,
				px,
				py
			};
			if (extra) {
				res.extra = extra;
			}
			points.push(res);
		};

		const mapImplementation = new MapImplementations[color](
			this.randoms,
			LoadPixelScene,
			HandleInterest
		);
		const p = imageFromHexArray(['ff0000ff'], 1, 1);
		try {
			await iteratePixels(areaMap, 10, async (px, py, c) => {
				// drawImageData(new ImageData(new Uint8ClampedArray([0xff, 0x00, 0x00, 0x00]), 1, 1), areaMap, px, py);
				const funcName = mapData.config!.spawnFunctions[c];
				if (!funcName) {
					return;
				}
				drawImageData(p, areaMap, px, py);
				const { gx, gy } = getGlobalPos(x, y, px, py);
				// console.log(funcName, gx, gy);
				await mapImplementation.handle(funcName, gx, gy);
			});
		} catch (e) {
			console.error("Iteration error: ");
			console.error(e);
		}

		return {
			points,
			area
		};
	}

	async provide(
		tx: number,
		ty: number,
		seed: string,
		worldOffset: number,
		iter: number
	) {
		if (this.seed !== seed) {
			this.seed = seed;
			this.rawMapCache = new Map();
			this.mapCache = new Map();
			this.interestPointsCache = new Map();
		}

		const color = getColor(worldMap, tx, ty);
		const area = this.getArea(tx, ty, color);
		const cacheKey = `${color} ${area.x1} ${area.y1} ${iter}`;
		const map = this.mapCache.get(cacheKey);
		if (map) {
			return {
				map: getMapChunk(map, tx - area.x1, ty - area.y1, 512, 512),
				interestPoints: this.interestPointsCache.get(cacheKey)
			};
		}

		const startTime = performance.now();
		const areaMap = await this.getMap(tx, ty, seed, worldOffset, iter);
		if (!areaMap) {
			console.groupEnd();
			return;
		}

		// return { map: areaMap };

		const areaMapToScale = await scaleImageData(areaMap, 10);
		console.log(areaMapToScale);
		// const interestPoints = {};
		const interestPoints = await this.getInterestPoints(area.x1, area.y1, color, areaMapToScale);

		const res = {
			interestPoints: interestPoints,
			map: getMapChunk(areaMapToScale, tx - area.x1, ty - area.y1, 512, 512)
		};
		const endTime = performance.now();
		const fullExec = endTime - startTime;
		console.log(res);
		console.log({ fullExec });
		console.groupEnd();
		this.mapCache.set(cacheKey, areaMapToScale);
		this.interestPointsCache.set(cacheKey, interestPoints);
		return res;
	}

	test(rule: IRule): boolean {
		return true;
	}
}
