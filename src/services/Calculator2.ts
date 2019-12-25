// Taken from Bridge.NET:
// https://github.com/bridgedotnet/Bridge/blob/8b1a4a0dee448319ac7bb0879d0019a26285e100/Bridge/Resources/Integer.js#L834
const intMul = (a: number, b: number) => {
	var ah = (a >>> 16) & 0xffff,
		al = a & 0xffff,
		bh = (b >>> 16) & 0xffff,
		bl = b & 0xffff;

	return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
};

// https://github.com/bridgedotnet/Bridge/blob/8b1a4a0dee448319ac7bb0879d0019a26285e100/Bridge/Resources/Integer.js#L720-L738
const intTrunc = (num: number): number => {
	return num > 0 ? Math.floor(num) : Math.ceil(num);
};
const intDiv = (x: number, y: number): number => {
	if (y === 0) {
		throw new Error('Dividing by Zero');
	}

	return intTrunc(x / y);
};

const toInt = (i: number) =>
	Math.max(2_147_483_648 * -1, Math.min(Math.floor(i), 2_147_483_647)) | 0;
const toUInt = (i: number) =>
	Math.max(0, Math.min(Math.floor(i), 4_294_967_295)) >>> 0;

export class NollaPrng {
	public static BETA_SEED: boolean = false;
	public SEED_BASE = 23456789 + 1 + 11 * 11;
	public seed: number; //double

	constructor(seed: number /* int, double */) {
		// this.seed = seed;
		this.seed = toUInt(seed);
		this.Next();
	}

	public Next(): number {
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
			this.seed += 2_147_483_647 | 0;
		}
		return this.seed / 2_147_483_647;
	}
}

export class MaterialPicker {
	LIQUIDS = [
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
		'radioactive_liquid', // aka "toxic sludge"
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

	ALCHEMY = [
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

	PRNG: NollaPrng;
	Materials: string[] = [];

	constructor(prng: NollaPrng, worldSeed: number /* uint */) {
		this.PRNG = prng;
		this.PickMaterials(this.LIQUIDS, 3);
		this.PickMaterials(this.ALCHEMY, 1);
		this.ShuffleList(worldSeed);
		this.PRNG.Next();
		this.PRNG.Next();
	}

	public PickMaterials(source: string[], count: number /* int */): void {
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

	public ShuffleList(worldSeed: number /* uint */): void {
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

	public static PickForSeed(worldSeed: number /* uint */) {
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
