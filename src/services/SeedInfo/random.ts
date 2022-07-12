// import {
// 	ProceduralRandomf,
// 	Random,
// 	ProceduralRandomi
// } from './noita_random/noita_random.cpp';
// const wasm = await import('./noita_random/noita_random.cpp');
import {
	rgb2rgba,
	rgba2rgb
} from '../../components/LiveSeedStats/OCRHandler/imageActions';
import createModule from './noita_random/noita_random.js';
import noitaRandomModule from './noita_random/noita_random.wasm';

import D, { Decimal } from 'decimal.js';
import { cloneDeep } from 'lodash';

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const logify = func => (...args) => {
	// console.groupCollapsed(func);
	const res = func(...args);
	console.log(...args, res);
	console.trace();
	console.groupEnd();
	return res;
};
interface IRandomModule {
	printErr: any;
	print: any;
	cwrap: any;
	_generate_map: any;

	doLeakCheck: () => void;

	ProceduralRandomf(
		arg0: number,
		arg1: number,
		arg2: number,
		arg3: number
	): number;

	RoundHalfOfEven(number): number;

	Randomf(): number;

	Random(arg0: number, arg1: number): number;
	Random(arg0: number): number;
	Random(): number;

	ProceduralRandomi(
		arg0: number,
		arg1: number,
		arg2: number,
		arg3: number
	): number;

	RandomDistribution(
		min: number,
		max: number,
		mean: number,
		sharpness?: number,
		baseline?: number
	): number;

	RandomDistributionf(
		min: number,
		max: number,
		mean: number,
		sharpness?: number,
		baseline?: number
	): number;

	SetRandomSeed(arg0: number, arg1: number): void;

	SetWorldSeed(arg0: number): void;

	PickForSeed(): string;

	GetRandomAction(x: number, y: number, level: number, i: number): string;

	GetRandomActionWithType(
		x: number,
		y: number,
		level: number,
		type: number,
		i: number
	): string;

	_malloc(number): number;
	_free(number): number;

	HEAPU8: any;

	GenerateMap(
		mapData: any,
		w: number,
		h: number,
		result: any,
		xs: number,
		ys: number,
		isCoalMine: boolean,
		randomMaterials: number[],
		xOffset: number,
		yOffset: number,
		limit: number
	): void;

	SetUnlockedSpells(i: number, val: number): void;
	GetWidthFromPix(x1: number, x2: number): number;
}

interface IRND {
	x: number;
	y: number;
}

const loadWasm = async () => {
	const Module: IRandomModule = await createModule({
		locateFile(path) {
			if (path.endsWith('.wasm')) {
				return noitaRandomModule;
			}
			return path;
		}
	});
	return Module;
};

export const genRandom = async Module => {
	Module.GenerateMap = Module._generate_map;
	// Module.GenerateMap = Module.cwrap('generate_map', null, [
	// 	'number',
	// 	'number',
	// 	'number',
	// 	'number',
	// 	'number',
	// 	'number',
	// 	'number',
	// 	'number',
	// ]);

	Module.print = function (text) {
		if (arguments.length > 1)
			text = Array.prototype.slice.call(arguments).join(' ');
		console.warn(text);
	};

	Module.printErr = Module.print;

	const randomFromArray = <T>(arr: T[]) => {
		return arr[Module.Random(0, arr.length - 1)];
	};

	const random_create = (x: number, y: number) => ({
		x,
		y
	});

	const random_next = (rnd: IRND, min: number, max: number) => {
		let result = Module.ProceduralRandomf(rnd.x, rnd.y, min, max);
		rnd.y++;
		return result;
	};

	const pick_random_from_table_backwards = <T>(t: T[], rnd: IRND) => {
		let result: T | undefined;
		let len = t.length;

		for (let i = len - 1; i >= 0; i--) {
			if (random_next(rnd, 0.0, 1.0) <= (t[i] as any).chance) {
				result = t[i];
				break;
			}
		}

		if (!result) {
			return t[0];
		}

		return result;
	};

	interface ITable {
		weight_min: Decimal;
		weight_max: Decimal;
		probability: Decimal;
	}
	const pick_random_from_table_weighted = <T>(rnd: IRND, t: T[]) => {
		// if (t.length === 0) {
		// 	return null;
		// }
		const table: Array<T & ITable> = cloneDeep(t) as any;

		let weight_sum = new D(0.0);
		for (let i = 0; i < table.length; i++) {
			const it = table[i];
			it.weight_min = new D(weight_sum);
			it.weight_max = weight_sum.add(it.probability);
			weight_sum = new D(it.weight_max);
		}

		const val = new D(random_next(rnd, 0.0, weight_sum.toNumber()));
		let result = table[0];
		for (let i = 0; i < table.length; i++) {
			const it = table[i];
			if (
				val.greaterThanOrEqualTo(it.weight_min) &&
				val.lessThanOrEqualTo(it.weight_max)
			) {
				result = it;
				break;
			}
		}

		return result as T;
	};

	const random_nexti = (rnd: IRND, min, max) => {
		const result = Module.ProceduralRandomi(rnd.x, rnd.y, min, max);
		rnd.y = rnd.y + 1;
		return result;
	};

	const GenerateMap = (
		wang: ImageData,
		tiles_w: number,
		tiles_h: number,
		map_w: number,
		map_h: number,
		isCoalMine: boolean,
		randomMaterials: number[],
		xOffset: number,
		yOffset: number,
		iter: number
	): ImageData => {
		const tilesDataPtr = Module._malloc(3 * tiles_w * tiles_h);
		// 8-bit (char)
		const tileData = new Uint8Array(
			Module.HEAPU8.buffer,
			tilesDataPtr,
			3 * tiles_w * tiles_h
		);
		rgba2rgb(wang.data, tileData);

		const randomMaterialsPtr = Module._malloc(randomMaterials.length * 4);
		// 32-bit (uint)
		const randomMatData = new Uint32Array(
			Module.HEAPU32.buffer,
			randomMaterialsPtr,
			randomMaterials.length * 4
		);
		randomMatData.set(randomMaterials);

		const resultPtr = Module._malloc(3 * map_w * map_h);
		const result = new Uint8Array(
			Module.HEAPU8.buffer,
			resultPtr,
			3 * map_w * map_h
		);

		Module.GenerateMap(
			tilesDataPtr,
			tiles_w,
			tiles_h,
			resultPtr,
			map_w,
			map_h,
			isCoalMine,
			randomMaterialsPtr,
			xOffset,
			yOffset,
			iter
		);

		const resImgData = new ImageData(map_w, map_h);
		rgb2rgba(result, resImgData.data);

		Module._free(randomMaterialsPtr);
		Module._free(tilesDataPtr);
		Module._free(resultPtr);

		return resImgData;
	};

	const SetUnlockedSpells = (spells: boolean[]) => {
		// For some reason using the pointer method like GenerateMap
		// doesn't work - we get an error when calling, so we
		// do this.
		for (let i = 0; i < spells.length; i++) {
			Module.SetUnlockedSpells(i, Number(spells[i]));
		}
	};

	return {
		Random: Module.Random,
		Randomf: Module.Randomf,
		RandomDistribution: Module.RandomDistribution,
		RandomDistributionf: Module.RandomDistributionf,
		ProceduralRandomf: Module.ProceduralRandomf,
		ProceduralRandomi: Module.ProceduralRandomi,
		SetRandomSeed: Module.SetRandomSeed,
		SetWorldSeed: Module.SetWorldSeed,
		PickForSeed: Module.PickForSeed,
		RoundHalfOfEven: Module.RoundHalfOfEven,
		GetRandomAction: Module.GetRandomAction,
		GetRandomActionWithType: Module.GetRandomActionWithType,
		GetWidthFromPix: Module.GetWidthFromPix,

		SetUnlockedSpells,
		GenerateMap,
		random_next,
		random_nexti,
		randomFromArray,
		random_create,
		pick_random_from_table_backwards,
		pick_random_from_table_weighted
	};
};

const load = async () => {
	const Module = await loadWasm();
	return genRandom(Module);
};

export type IRandom = Awaited<ReturnType<typeof load>>;
export default load;
