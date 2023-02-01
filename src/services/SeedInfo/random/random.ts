// import {
// 	ProceduralRandomf,
// 	Random,
// 	ProceduralRandomi
// } from './noita_random/noita_random.cpp';
// const wasm = await import('./noita_random/noita_random.cpp');

import D, { Decimal } from 'decimal.js';
import cloneDeep from 'lodash/cloneDeep.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const logify = func => (...args) => {
	// console.groupCollapsed(func);
	const res = func(...args);
	console.log(...args, res);
	console.trace();
	console.groupEnd();
	return res;
};

export interface IRandomModule {
	Module: any;

	printErr: any;
	print: any;
	cwrap: any;
	_generate_map: any;
	_generate_path_map: any;

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
		color: number,
		w: number,
		h: number,
		result: any,
		xs: number,
		ys: number,
		isCoalMine: boolean,
		shouldBlockOutRooms: boolean,
		randomMaterials: number[],
		xOffset: number,
		yOffset: number,
		limit: number
	): void;

	GetGlobalPos(): number;
	GeneratePathMap(): void;

	SetUnlockedSpells(i: number, val: number): void;
	GetWidthFromPix(x1: number, x2: number): number;
}

interface IRND {
	x: number;
	y: number;
}


export const genRandom = async (Module: IRandomModule) => {
	Module.GenerateMap = Module._generate_map;
	Module.GeneratePathMap = Module._generate_path_map;

	Module.print = function (text) {
		if (arguments.length > 1)
			text = Array.prototype.slice.call(arguments).join(' ');
		console.warn(text);
	};

	Module.printErr = Module.print;

	const randomFromArray = <T>(arr: T[]) => {
		const i = Module.Random(0, arr.length - 1);
		return arr[i];
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

	const SetUnlockedSpells = (spells: boolean[]) => {
		// For some reason using the pointer method like GenerateMap
		// doesn't work - we get an error when calling, so we
		// do this.
		for (let i = 0; i < spells.length; i++) {
			Module.SetUnlockedSpells(i, Number(spells[i]));
		}
	};

	return {
		Module,

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
		GetGlobalPos: Module.GetGlobalPos,

		SetUnlockedSpells,
		random_next,
		random_nexti,
		randomFromArray,
		random_create,
		pick_random_from_table_backwards,
		pick_random_from_table_weighted
	};
};
