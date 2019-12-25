// 107788269

export class SapphireRandom {
	public seed: number;

	constructor(seed: number) {
		this.seed = seed;
	}

	public Next() {
		let seed = this.seed;
		seed = seed * 16807 + seed / 127773 * -2_147_483_647;
		if (seed < 0) seed += 2_147_483_647;
		console.log('seed / 2_147_483_647', seed / 2_147_483_647);
		return seed / 2_147_483_647;
	}
}

export default class Recipes {
	public WorldRandom: SapphireRandom;
	public seed: number;

	constructor(seed: number) {
		this.WorldRandom = new SapphireRandom(seed * 0.17127 + 1323.5903);
		this.WorldRandom.Next();
		this.WorldRandom.Next();
		this.WorldRandom.Next();
		this.WorldRandom.Next();
		this.WorldRandom.Next();
		this.WorldRandom.Next();
		this.seed = seed;
		console.log(`WORLD SEED: ${this.seed}`);
	}

	public LiquidMaterials: string[] = [
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

	public AlchemyMaterials: string[] = [
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

	public GetRecipes(full: boolean = false): any[] {
		const LC = this.GetRandomRecipe('LC', full);
		const AP = this.GetRandomRecipe('AP', full);
		return [LC, AP];
	}

	public ChooseRandomMaterials(
		target: string[],
		material_list: string[],
		iters: number
	): void {
		for (var i = 0; i < iters; i++) {
			var pick = material_list[this.WorldRandom.Next() * material_list.length];
			if (target.includes(pick)) {
				i -= 1;
				continue;
			}
			target.push(pick);
		}
	}

	public GetRandomRecipe(name: string, full: boolean) {
		const mats: string[] = [];

		this.ChooseRandomMaterials(mats, this.LiquidMaterials, 3);
		this.ChooseRandomMaterials(mats, this.AlchemyMaterials, 1);

		var probability = this.WorldRandom.Next();
		this.WorldRandom.Next();

		probability = 10 - probability * -91;

		this.Shuffle(mats);
		if (!full && mats.length === 4) {
			mats.splice(mats.length - 1);
		}

		if (full && mats.length === 4) {
			return [name, probability, mats[0], mats[1], mats[2], mats[3]];
		} else {
			return [name, probability, mats[0], mats[1], mats[2]];
		}
	}

	public Shuffle(ary: string[]): void {
		var prng = new SapphireRandom((this.seed >> 1) + 0x30f6);
		prng.Next();

		for (var i = ary.length - 1; i >= 0; i--) {
			var swap_idx = prng.Next() * (i + 1);
			var elem = ary[i];
			ary[i] = ary[swap_idx];
			ary[swap_idx] = elem;
		}
	}
}
