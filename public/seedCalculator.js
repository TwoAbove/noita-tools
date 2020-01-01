// eslint-disable-next-line no-undef
importScripts('https://unpkg.com/comlink/dist/umd/comlink.js');

// From Bridge.NET:
// https://github.com/bridgedotnet/Bridge/blob/8b1a4a0dee448319ac7bb0879d0019a26285e100/Bridge/Resources/Integer.js#L834
const intMul = (a, b) => {
	var ah = (a >>> 16) & 0xffff,
		al = a & 0xffff,
		bh = (b >>> 16) & 0xffff,
		bl = b & 0xffff;
	return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
};
// https://github.com/bridgedotnet/Bridge/blob/8b1a4a0dee448319ac7bb0879d0019a26285e100/Bridge/Resources/Integer.js#L720-L738
const intTrunc = num => {
	return num > 0 ? Math.floor(num) : Math.ceil(num);
};

const intDiv = (x, y) => {
	if (y === 0) {
		throw new Error('Dividing by Zero');
	}
	return intTrunc(x / y);
};

const toInt = i =>
	Math.max(2147483648 * -1, Math.min(Math.floor(i), 2147483647)) | 0;

const toUInt = i => Math.max(0, Math.min(Math.floor(i), 4294967295)) >>> 0;

class NollaPrng {
	constructor(seed /* int, double */) {
		this.SEED_BASE = 23456789 + 1 + 11 * 11;
		// this.seed = seed;
		this.seed = toUInt(seed);
		this.Next();
	}
	Next() {
		// this.seed =
		// toInt(this.seed) * 16807 + toInt(this.seed) / 127773 * -2_147_483_647;
		this.seed =
			(intMul(toInt(this.seed), 16807) +
				intMul(intDiv(toInt(this.seed), 127773) | 0, -2147483647)) |
			0;
		// this.seed = Math.min(
		// 	toInt(this.seed) * 16807 + toInt(this.seed) / 127773,
		// 	2_147_483_646
		// );
		if (this.seed < 0) {
			this.seed += 2147483647 | 0;
		}
		return this.seed / 2147483647;
	}
}

NollaPrng.BETA_SEED = false;

class MaterialPicker {
	constructor(prng, worldSeed /* uint */) {
		this.Materials = [];
		this.PRNG = prng;
		this.PickMaterials(MaterialPicker.LIQUIDS, 3);
		this.PickMaterials(MaterialPicker.ALCHEMY, 1);
		this.ShuffleList(worldSeed);
		this.PRNG.Next();
		this.PRNG.Next();
	}
	PickMaterials(source, count /* int */) {
		let counter = 0; // int
		let failed = 0; // int
		while (counter < count && failed < 99999) {
			const rand = this.PRNG.Next() * source.length;
			const i = toInt(rand);
			var picked = source[i];
			if (!this.Materials.includes(picked)) {
				this.Materials.push(picked);
				counter++;
			} else {
				failed++;
			}
		}
		return;
	}
	ShuffleList(worldSeed /* uint */) {
		var prng = new NollaPrng((worldSeed >> 1) + 12534);
		// Toxic sludge, blood, and soil for first
		for (let i = this.Materials.length - 1; i >= 0; i--) {
			let rand = toInt(prng.Next() * (i + 1));
			[this.Materials[i], this.Materials[rand]] = [
				this.Materials[rand],
				this.Materials[i]
			];
		}
	}
	static PickForSeed(worldSeed /* uint */) {
		var prng = new NollaPrng(worldSeed * 0.17127 + 1323.5903);
		// Preheat random!
		for (let i = 0; i < 5; i++) {
			prng.Next();
		}
		const LC = new MaterialPicker(prng, worldSeed);
		const AP = new MaterialPicker(prng, worldSeed);
		return {
			seed: worldSeed,
			LC: [LC.Materials[0], LC.Materials[1], LC.Materials[2]],
			AP: [AP.Materials[0], AP.Materials[1], AP.Materials[2]]
		};
	}
}

MaterialPicker.LIQUIDS = [
	'water',
	'water_ice',
	'water_swamp',
	'oil',
	'alcohol',
	'swamp',
	'mud',
	'blood',
	'blood_fungi',
	'blood_worm',
	'radioactive_liquid',
	'cement',
	'acid',
	'lava',
	'urine',
	'poison',
	'magic_liquid_teleportation',
	'magic_liquid_polymorph',
	'magic_liquid_random_polymorph',
	'magic_liquid_berserk',
	'magic_liquid_charm',
	'magic_liquid_invisibility'
];
MaterialPicker.ALCHEMY = [
	'sand',
	'bone',
	'soil',
	'honey',
	'slime',
	'snow',
	'rotten_meat',
	'wax',
	'gold',
	'silver',
	'copper',
	'brass',
	'diamond',
	'coal',
	'gunpowder',
	'gunpowder_explosive',
	'grass',
	'fungi'
];

const includesAll = (arr, target) =>
	arr.length ? target.every(v => arr.includes(v)) : true;
class SeedSolver {
	constructor(config = {}) {
		this.shouldCancel = false;
		this.running = false;
		this.count = 0;
		this.currentSeed = 0;
		this.lcIngredients = config.lcIngredients || [];
		this.apIngredients = config.apIngredients || [];
	}
	async work() {
		while (!this.shouldCancel && this.currentSeed < 2147483647) {
			const { LC, AP } = MaterialPicker.PickForSeed(this.currentSeed);
			const allLC = includesAll(this.lcIngredients, LC);
			const allAP = includesAll(this.apIngredients, AP);
			if (allLC && allAP) {
				this.foundSeed = +this.currentSeed;
				this.LC = LC;
				this.AP = AP;
				break;
			}
			this.currentSeed++;
			this.count++;
		}
		this.running = false;
	}
	async start() {
		this.currentSeed++;
		this.running = true;
		this.work();
	}
	async update(config = {}) {
		this.lcIngredients = config.lcIngredients || [];
		this.apIngredients = config.apIngredients || [];
	}
	async stop() {
		this.shouldCancel = true;
		this.running = false;
	}
	async getInfo() {
		return {
			count: this.count,
			currentSeed: this.currentSeed,
			foundSeed: this.foundSeed,
			running: this.running,
			LC: this.LC,
			AP: this.AP
		};
	}
	async getCount() {
		return this.count;
	}
	async getCurrentSeed() {
		return this.currentSeed;
	}
	async getFoundSeed() {
		return this.foundSeed;
	}
}

const seedSolver = new SeedSolver();

// const tasks = {
// 	start: () => seedSolver.start(),
// 	stop: () => seedSolver.stop(),
// 	update: () => seedSolver.update(),
// 	getInfo: () => seedSolver.getInfo()
// };

Comlink.expose(seedSolver);
