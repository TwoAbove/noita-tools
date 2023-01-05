/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Not available in web worker
import {
	cropImageData,
	imageFromBase64,
	hexRGBAtoIntRGB,
	scaleImageData,
	drawImageData,
	imageToBase64
} from '../../../../../components/LiveSeedStats/OCRHandler/imageActions';
import mapData from '../../../data/obj/maps.json';
import { IRule } from '../../IRule';
import { InfoProvider } from '../Base';

import impls from '../../../data/obj/impl.json';

import MapImplementations from './MapImplementations';
import { isUndefined } from 'lodash';
import {
	getColor,
	getGlobalPos,
	getLocalPos,
	imageFromHexArray,
	iteratePixels,
	somePixelsSync
} from './helpers';
import { IRandom } from '../../../random';

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

const isPurple = c => c === '7f007fff';
const inMainPath = (
	map: ImageData,
	px: number,
	py: number,
	step: number
): boolean => {
	return (
		isPurple(getColor(map, px - 1, py)) ||
		isPurple(getColor(map, px, py - 1)) ||
		isPurple(getColor(map, px + step, py)) ||
		isPurple(getColor(map, px, py + step)) ||
		isPurple(getColor(map, px - 1, py - 1)) ||
		isPurple(getColor(map, px + step, py - 1)) ||
		isPurple(getColor(map, px - 1, py + step)) ||
		isPurple(getColor(map, px + step, py + step))
	);
};

const maps = Object.values(mapData).reduce((c, v: any) => {
	const color = parseInt(v.color, 16);
	if (v.config && v.config.spawnFunctions) {
		const sf = Object.entries<string>(v.config.spawnFunctions).reduce(
			(cc, [kk, vv]) => {
				const color = parseInt(kk, 16);
				cc.set(color, vv);
				return cc;
			},
			new Map<number, string>()
		);
		v.config.spawnFunctions = sf;
	}
	c.set(color, v);
	return c;
}, new Map<number, any>());

export class MapInfoProvider extends InfoProvider {
	maps = maps;
	imageCache = new Map<string, ImageData>();
	rawMapCache = new Map<string, ImageData>();
	mapCache = new Map<string, ImageData>();
	mapMainPathCache = new Map<string, ImageData>();
	interestPointsCache = new Map<string, any>();
	seed?: string;

	worldMap!: ImageData;
	impls = new Map<string, ImageData>();

	loadAllImagesPromise: Promise<any>;
	worldMapPromise: Promise<any>;
	wangPromise: Promise<any>;
	implPromise: Promise<any>;

	constructor(randoms: IRandom) {
		super(randoms);
		this.worldMapPromise = imageFromBase64(
			'data:image/png;base64,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'
		).then(map => {
			this.worldMap = map;
		});

		this.loadAllImagesPromise = this.loadAllImages();

		this.wangPromise = this.loadAllImagesPromise;
		this.implPromise = this.loadAllImagesPromise;

		// Promise.allSettled([
		// 	this.worldMapPromise,
		// 	this.wangPromise,
		// 	this.implPromise
		// ]).catch(e => console.error(e));
	}

	wang_maps: { [color: number]: ImageData } = {};

	async ready() {
		return Promise.all([
			this.worldMapPromise,
			this.wangPromise,
			this.implPromise
		]);
	}

	async loadAllImages() {
		for (const [k, v] of this.maps.entries()) {
			const mapData = v as any;
			if (!mapData || !mapData.wang || !mapData.wang.template_file) {
				continue;
			}
			this.wang_maps[k] = await imageFromBase64(mapData.wang.template_file);
		}
		for (const k of Object.keys(impls)) {
			if (!impls[k].src) {
				continue;
			}
			this.impls.set(k, await imageFromBase64(impls[k].src));
		}
	}

	getArea(x: number, y: number, color: number) {
		const mapData = this.maps.get(color);
		const areas = mapData.areas || [];
		const areaIndex = areas.findIndex(
			a => a.x1 <= x && a.x2 >= x && a.y1 <= y && a.y2 >= y
		);
		return areas[areaIndex];
	}

	getMap(x: number, y: number, color: number) {
		const mapData = this.maps.get(color);

		if (!mapData || !mapData.wang) {
			return;
		}

		const { map_width, map_height, template_file } = mapData.wang!;
		const area = this.getArea(x, y, color);
		const cacheKey = `${color} ${area.x1} ${area.y1}`;

		if (this.rawMapCache.has(cacheKey)) {
			const map = this.rawMapCache.get(cacheKey);

			return map;
		}

		const wang_map = this.wang_maps[color];
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
			color,
			map_width,
			map_height,
			w,
			h,
			mapData.name === 'coalmine',
			flatRandomMaterials,
			area.x1,
			area.y1
		);
		const endTime = performance.now();
		const execTime = endTime - startTime;
		// console.log({ execTime });
		this.rawMapCache.set(cacheKey, map);
		// return map
		return map;
	}

	getPathMap(x: number, y: number, color: number) {
		const area = this.getArea(x, y, color);
		const cacheKey = `${color} ${area.x1} ${area.y1}`;

		if (this.mapMainPathCache.has(cacheKey)) {
			return this.mapMainPathCache.get(cacheKey);
		}

		const map = this.getMap(x, y, color);
		if (!map) {
			return;
		}

		const pathMap = this.randoms.GetPathMap(map, map.width, map.height, x, y);
		const pathMapScaled = scaleImageData(pathMap, 10);
		this.mapMainPathCache.set(cacheKey, pathMapScaled);
		return pathMapScaled;
	}

	getInterestPoints(
		x: number,
		y: number,
		color: number,
		areaMap: ImageData,
		funcs?
	) {
		const points: Interest[] = [];
		const mapData = this.maps.get(color)!;
		const Implementation = MapImplementations[color.toString(16).padStart(8, '0')];
		if (!Implementation) {
			console.error(`No MapImplementation for ${color}`);
			return;
		}
		// const pathMap = this.getPathMap(x, y, color)!;

		const LoadPixelScene = (
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
			// console.log('LoadPixelScene', path, gx, gy);

			const { px, py } = getLocalPos(x, y, gx, gy);

			points.push({
				item: path,
				gx,
				gy,
				px,
				py
			});

			const impl = this.impls.get(path);
			if (!impl) {
				console.error(
					`${path} not in impls! Please add it to dataScripts/src/pixelScenes.ts and re-run generation.`
				);
				return;
			}

			drawImageData(impl, areaMap, px, py, color_to_material_table);
			iteratePixels(impl, 1, (dx, dy, c) => {
				const funcName = mapData.config!.spawnFunctions[c];
				if (!funcName) {
					return;
				}
				// const { gx, gy } = getGlobalPos(x, y, px + dx, py + dy);
				// console.log('iteratePixels', {
				// 	gx,
				// 	gy,
				// 	px,
				// 	py,
				// 	dx,
				// 	dy,
				// 	x,
				// 	y,
				// 	funcName
				// });
				// TODO: doing a second flood fill just for this seems
				// like too much. Maybe we can reuse it from the map gen?
				// const is_open_path = inMainPath(pathMap, gx + dx, gy + dy, 1);
				mapImplementation.handle(
					funcName,
					gx + dx,
					gy + dy,
					1,
					1,
					false // is_open_path
				);
			});
		};

		const HandleInterest = (
			item: string,
			gx: number,
			gy: number,
			extra?: any
		) => {
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

		const BiomeMapGetVerticalPositionInsideBiome = (x: number, y: number) => {
			// This might not be accurate;
			const y0 = Math.floor(y / 512) * 512;
			const y1 = areaMap.height;

			return (y - y0) / y1;
		};

		const RaytracePlatforms = (x1, y1, x2, y2): [boolean, number, number] => {
			console.error('TODO: RaytracePlatforms');
			return [true, x1, y1];
		};

		const mapImplementation = new Implementation(
			this.randoms,
			LoadPixelScene,
			HandleInterest,
			BiomeMapGetVerticalPositionInsideBiome,
			RaytracePlatforms,
			{
				funcs
			}
		);
		try {
			mapImplementation.init();
			iteratePixels(areaMap, 10, (px, py, c) => {
				// drawImageData(new ImageData(new Uint8ClampedArray([0xff, 0x00, 0x00, 0x00]), 1, 1), areaMap, px, py);
				if (c === 255) {
					return;
				}
				const funcName = mapData.config!.spawnFunctions.get(c);
				if (!funcName) {
					return;
				}
				const { gx, gy } = getGlobalPos(x, y, px, py);
				// is_open_path is only used in the coalmine biome:
				// data/scripts/biomes/coalmine.lua
				// const is_open_path = inMainPath(pathMap, px, py, 10);
				// console.log(funcName, px, py, gx, gy, is_open_path);
				mapImplementation.handle(funcName, gx, gy, 10, 10, false);
			});
		} catch (e) {
			console.error('Iteration error: ');
			console.error(e);
		}

		const area = this.getArea(x, y, color);
		return {
			points,
			area
		};
	}

	async provide(tx: number, ty: number, seed: string, funcs?) {
		await this.ready();
		if (this.seed !== seed) {
			this.seed = seed;
			this.clearCache();
		}

		const color = getColor(this.worldMap, tx, ty);
		const area = this.getArea(tx, ty, color);
		const cacheKey = `${color} ${area.x1} ${area.y1}`;
		const map = this.mapCache.get(cacheKey);
		if (map) {
			return {
				map: getMapChunk(map, tx - area.x1, ty - area.y1, 512, 512),
				interestPoints: this.interestPointsCache.get(cacheKey)
			};
		}

		const startTime = performance.now();
		const areaMap = this.getMap(tx, ty, color);
		if (!areaMap) {
			// console.groupEnd();
			return;
		}

		// return { map: areaMap };

		const startTime_mapScale = performance.now();
		const areaMapToScale = scaleImageData(areaMap, 10);
		const endTime_mapScale = performance.now();
		// console.log(areaMapToScale);
		// const interestPoints = {};
		const startTime_interestingPoints = performance.now();
		const interestPoints = this.getInterestPoints(
			area.x1,
			area.y1,
			color,
			areaMapToScale,
			funcs
		);
		const endTime_interestingPoints = performance.now();

		const res = {
			interestPoints: interestPoints,
			map: getMapChunk(areaMapToScale, tx - area.x1, ty - area.y1, 512, 512)
		};
		const endTime = performance.now();
		const fullExec = endTime - startTime;
		const mapScale = endTime_mapScale - startTime_mapScale;
		const interstingPointsTime =
			endTime_interestingPoints - startTime_interestingPoints;
		// console.log(res);
		// console.log({ fullExec, mapScale, interstingPointsTime });
		// console.groupEnd();
		this.mapCache.set(cacheKey, areaMapToScale);
		this.interestPointsCache.set(cacheKey, interestPoints);
		return res;
	}

	clearCache() {
		this.rawMapCache = new Map();
		this.mapCache = new Map();
		this.mapMainPathCache = new Map();
		this.interestPointsCache = new Map();
	}

	test(rule: IRule): boolean {
		this.clearCache();
		for (const key in configs) {
			const config = configs[key];
			const { x, y } = config.pos;
			const color = getColor(this.worldMap, x, y);
			const areaMap = this.getMap(x, y, color)!;
			const mapData = this.maps.get(color)!;

			const set = new Set<string>(config.funcs);

			const found = somePixelsSync(areaMap, 1, (px, py, c) => {
				if (set.size === 0) {
					// Found all of the needed funcs
					return true;
				}
				const funcName = mapData.config!.spawnFunctions.get(c);
				if (!funcName) {
					return false;
				}
				set.delete(funcName);
				return false;
			});

			if (!found) {
				return false;
			}

			const areaMapToScale = scaleImageData(areaMap, 10);
			const interestPoints = this.getInterestPoints(
				x,
				y,
				color,
				areaMapToScale,
				config.funcs
			)!;
			// const mapData = (await map.provide(x, y, seed.toString(), config.funcs))!;
			// console.log(interestPoints);
			const all = (config.search as string[]).every(
				s => interestPoints.points.findIndex(p => p.item === s) !== -1
			);
			if (!all) {
				return false;
			}
		}
		return true;
	}
}

const configs = {
	coalmine: {
		pos: {
			x: 34,
			y: 15
		},
		search: [
			'data/biome_impl/coalmine/physics_swing_puzzle.png',
			'data/biome_impl/coalmine/receptacle_oil.png',
			'data/biome_impl/coalmine/oiltank_puzzle.png'
		],
		funcs: ['load_pixel_scene2', 'load_pixel_scene', 'load_oiltank']
	},
	snowCastle: {
		pos: {
			x: 34,
			y: 25
		},
		search: ['data/biome_impl/snowcastle/kitchen.png'],
		funcs: ['load_pixel_scene2']
	},
	excavationSite: {
		pos: {
			x: 34,
			y: 17
		},
		search: [
			'data/biome_impl/excavationsite/meditation_cube.png',
			'data/biome_impl/excavationsite/receptacle_steam.png'
		],
		funcs: ['spawn_meditation_cube', 'load_pixel_scene4_alt']
	},
	snowCave: {
		pos: {
			x: 34,
			y: 21
		},
		search: [
			'data/biome_impl/snowcave/receptacle_water.png',
			'data/biome_impl/snowcave/buried_eye.png'
		],
		funcs: ['load_pixel_scene', 'load_pixel_scene3']
	},
	vault: {
		pos: {
			x: 34,
			y: 31
		},
		search: ['data/biome_impl/vault/lab_puzzle.png'],
		funcs: ['load_pixel_scene2']
	},
};
