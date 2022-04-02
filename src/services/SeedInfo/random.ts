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

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

interface IRandomModule {
	printErr: any;
	print: any;
	cwrap: any;
	_generate_map: any;

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
		result: any,
		w: number,
		h: number,
		xs: number,
		ys: number
	): void;
}

interface IRND {
	x: number;
	y: number;
}

const load = async () => {
	const Module: IRandomModule = await createModule({
		locateFile(path) {
			if (path.endsWith('.wasm')) {
				return noitaRandomModule;
			}
			return path;
		}
	});

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

	Module.print = function(text) {
		if (arguments.length > 1)
			text = Array.prototype.slice.call(arguments).join(' ');
		console.warn(text);
	};

	Module.printErr = Module.print;

	const randomFromArray = <T>(arr: T[]) => {
		return arr[Module.Random(1, arr.length) - 1];
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

	const pick_random_from_table_weighted = <T>(rnd: IRND, t: T[]) => {
		// if (t.length === 0) {
		// 	return null;
		// }

		let weight_sum = 0.0;
		for (let i = 0; i < t.length; i++) {
			const it = t[i] as any;
			it.weight_min = weight_sum;
			it.weight_max = weight_sum + it.probability;
			weight_sum = it.weight_max;
		}

		const val = random_next(rnd, 0.0, weight_sum);
		let result = t[0];
		for (let i = 0; i < t.length; i++) {
			const it = t[i] as any;
			if (val >= it.weight_min && val <= it.weight_max) {
				result = it;
				break;
			}
		}

		return result;
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
		map_h: number
	): ImageData => {
		const tilesDataP = Module._malloc(3 * tiles_w * tiles_h);
		const resultP = Module._malloc(3 * map_w * map_h);
		const tileData = new Uint8Array(
			Module.HEAPU8.buffer,
			tilesDataP,
			3 * tiles_w * tiles_h
		);
		const result = new Uint8Array(
			Module.HEAPU8.buffer,
			resultP,
			3 * map_w * map_h
		);

		rgba2rgb(wang.data, tileData);

		Module.GenerateMap(tilesDataP, resultP, tiles_w, tiles_h, map_w, map_h);

		const resImgData = new ImageData(map_w, map_h);
		rgb2rgba(result, resImgData.data);

		Module._free(tilesDataP);
		Module._free(resultP);

		return resImgData;
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const logify = func => (...args) => {
		console.groupCollapsed(func);
		console.log(...args);
		const res = func(...args);
		console.log(res);
		console.groupEnd();
		return res;
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

		GenerateMap,
		random_next,
		random_nexti,
		randomFromArray,
		random_create,
		pick_random_from_table_backwards,
		pick_random_from_table_weighted
	};
};

export type IRandom = Awaited<ReturnType<typeof load>>;
export default load;
