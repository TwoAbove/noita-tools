// data/scripts/biomes/coalmine_alt.lua
import { isChristmas } from '../../helpers';
import Base from '../Base';
class Coalminealt extends Base {
	chestLevel = 1;
	g_small_enemies = [
		{ prob: 1, min_count: 0, max_count: 0, entity: '' },
		{
			prob: 0.4,
			min_count: 1,
			max_count: 2,
			entity: 'data/entities/animals/zombie.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/slimeshooter.xml'
		},
		{
			prob: 0.2,
			min_count: 1,
			max_count: 3,
			entity: 'data/entities/animals/frog.xml'
		},
		{
			prob: 0.3,
			min_count: 2,
			max_count: 2,
			entity: 'data/entities/animals/miner_weak.xml'
		},
		{
			prob: 0.1,
			min_count: 2,
			max_count: 2,
			entity: 'data/entities/animals/miner_fire.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/shotgunner.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/wizard_dark.xml',
			ngpluslevel: 1
		}
	];
	g_big_enemies = [
		{ prob: 1.7, min_count: 0, max_count: 0, entity: '' },
		{
			prob: 0.2,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/firemage_weak.xml'
		},
		{
			prob: 0.01,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/worm.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entities: [
				'data/entities/animals/miner.xml',
				'data/entities/animals/miner.xml',
				'data/entities/animals/shotgunner.xml'
			]
		},
		{
			prob: 0.12,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/shotgunner.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/acidshooter.xml'
		},
		{
			prob: 0.08,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/giantshooter.xml'
		},
		{
			prob: 0.09,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/fireskull.xml'
		},
		{
			prob: 0.2,
			min_count: 3,
			max_count: 5,
			entity: 'data/entities/animals/frog.xml'
		},
		{
			prob: 0.13,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/frog_big.xml'
		},
		{
			prob: 0.05,
			min_count: 1,
			max_count: 1,
			entities: [
				'data/entities/animals/frog.xml',
				'data/entities/animals/frog.xml',
				'data/entities/animals/frog_big.xml'
			]
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 2,
			entity: 'data/entities/animals/miner_santa.xml',
			spawn_check: isChristmas
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/shaman.xml'
		},
		{
			prob: 0.02,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/drone_shield.xml',
			ngpluslevel: 2
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/scavenger_clusterbomb.xml',
			ngpluslevel: 1
		}
	];
	g_lamp = [
		{
			prob: 0.7,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/props/physics/lantern_small.xml'
		},
		{ prob: 0.3, min_count: 1, max_count: 1, entity: '' }
	];
	g_unique_enemy = [
		{ prob: 0, min_count: 0, max_count: 0, entity: '' },
		{
			prob: 0.5,
			min_count: 1,
			max_count: 3,
			entity: 'data/entities/animals/slimeshooter.xml'
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 2,
			entity: 'data/entities/animals/acidshooter.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/giantshooter.xml'
		}
	];
	g_unique_enemy2 = [
		{ prob: 1.5, min_count: 0, max_count: 0, entity: '' },
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/miner_santa.xml',
			spawn_check: isChristmas
		},
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/shotgunner.xml'
		},
		{
			prob: 0.5,
			min_count: 2,
			max_count: 2,
			entity: 'data/entities/animals/miner.xml'
		},
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/slimeshooter.xml'
		}
	];
	g_unique_enemy3 = [
		{ prob: 0, min_count: 0, max_count: 0, entity: '' },
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/firemage_weak.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/thundermage.xml'
		}
	];
	g_fungi = [
		{ prob: 0.5, min_count: 0, max_count: 0, entity: '' },
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/fungus.xml'
		}
	];
	g_items = [
		{ prob: 0, min_count: 0, max_count: 0, entity: '' },
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_001.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_002.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_003.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_004.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_005.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_006.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_007.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_008.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_009.xml'
		}
	];
	g_props = [
		{ prob: 0.2, min_count: 0, max_count: 0, offset_y: 0, entity: '' },
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			offset_y: 0,
			entity: 'data/entities/props/physics_box_explosive.xml'
		},
		{
			prob: 0.25,
			min_count: 1,
			max_count: 1,
			offset_y: -3,
			entity: 'data/entities/props/physics/minecart.xml'
		},
		{
			prob: 0.2,
			min_count: 1,
			max_count: 1,
			offset_y: 0,
			entity: 'data/entities/props/physics_barrel_radioactive.xml'
		},
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			offset_y: 0,
			entity: 'data/entities/props/physics_barrel_oil.xml'
		}
	];
	g_props2 = [
		{ prob: 0.5, min_count: 0, max_count: 0, offset_y: 0, entity: '' },
		{
			prob: 0.2,
			min_count: 1,
			max_count: 1,
			offset_y: -3,
			entity: 'data/entities/props/physics/minecart.xml'
		},
		{
			prob: 0.25,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/props/physics_cart.xml'
		},
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/props/physics_brewing_stand.xml'
		}
	];
	g_props3 = [
		{ prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: '' },
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/items/pickup/potion.xml'
		}
	];
	g_structures = [
		{ prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: '' },
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/props/coalmine_structure_01.xml'
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/props/coalmine_structure_01.xml'
		}
	];
	g_large_structures = [
		{ prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: '' },
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/props/coalmine_large_structure_01.xml'
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/props/coalmine_large_structure_02.xml'
		}
	];
	g_ghostlamp = [
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/props/physics/chain_torch_ghostly.xml'
		}
	];
	g_candles = [
		{
			prob: 0.33,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/props/physics_candle_1.xml'
		},
		{
			prob: 0.33,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/props/physics_candle_2.xml'
		},
		{
			prob: 0.33,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/props/physics_candle_3.xml'
		}
	];
	g_nest = [
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/buildings/flynest.xml'
		},
		{ prob: 0.5, min_count: 1, max_count: 1, entity: '' }
	];
	g_pixel_scene_01 = [
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/coalpit01.png',
			visual_file: 'data/biome_impl/coalmine/coalpit01_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/coalpit02.png',
			visual_file: 'data/biome_impl/coalmine/coalpit02_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/carthill.png',
			visual_file: 'data/biome_impl/coalmine/carthill_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/coalpit03.png',
			visual_file: 'data/biome_impl/coalmine/coalpit03_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/coalpit04.png',
			visual_file: 'data/biome_impl/coalmine/coalpit04_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/coalpit05.png',
			visual_file: 'data/biome_impl/coalmine/coalpit05_visual.png',
			background_file: '',
			is_unique: 0
		}
	];
	g_pixel_scene_02 = [
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/shrine01_alt.png',
			visual_file: 'data/biome_impl/coalmine/shrine01_visual.png',
			background_file: '',
			is_unique: 1
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/shrine02_alt.png',
			visual_file: 'data/biome_impl/coalmine/shrine02_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/swarm_alt.png',
			visual_file: 'data/biome_impl/coalmine/swarm_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 1.2,
			material_file: 'data/biome_impl/coalmine/symbolroom_alt.png',
			visual_file: '',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 1.2,
			material_file: 'data/biome_impl/coalmine/physics_01_alt.png',
			visual_file: 'data/biome_impl/coalmine/physics_01_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 1.2,
			material_file: 'data/biome_impl/coalmine/physics_02_alt.png',
			visual_file: 'data/biome_impl/coalmine/physics_02_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 1.2,
			material_file: 'data/biome_impl/coalmine/physics_03_alt.png',
			visual_file: '',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.75,
			material_file: 'data/biome_impl/coalmine/shop_alt.png',
			visual_file: 'data/biome_impl/coalmine/shop_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/radioactivecave.png',
			visual_file: '',
			background_file: '',
			is_unique: 0
		}
	];
	g_vines = [
		{
			prob: 0.4,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/verlet_chains/vines/verlet_vine.xml'
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/verlet_chains/vines/verlet_vine_long.xml'
		},
		{ prob: 1.5, min_count: 1, max_count: 1, entity: '' },
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/verlet_chains/vines/verlet_vine_short.xml'
		},
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/verlet_chains/vines/verlet_vine_shorter.xml'
		}
	];

	spawn_items(x: number, y: number) {
		let r = this.randoms.ProceduralRandomf(x, y, 0, 1);
		// -- 20% is air, nothing happens
		if (r < 0.47) {
			return;
		}
		r = this.randoms.ProceduralRandomf(x - 11.431, y + 10.5257, 0, 1);

		if (r < 0.725) {
		} else {
			this.LoadPixelScene(
				'data/biome_impl/wand_altar.png',
				'data/biome_impl/wand_altar_visual.png',
				x - 10,
				y - 17,
				'',
				true
			);
		}
	}

	spawn_small_enemies(x: number, y: number) {
		this.spawn_with_limited_random(this.g_small_enemies, x, y, 0, 0, [
			'fungus',
			'frog'
		]);
	}

	spawn_big_enemies(x: number, y: number) {
		this.spawn_with_limited_random(this.g_big_enemies, x, y, 0, 0, [
			'fungus',
			'frog'
		]);
	}

	spawn_lamp(x: number, y: number) {
		this.spawn(this.g_lamp, x, y, 0, 0);
	}

	spawn_ghostlamp(x: number, y: number) {
		this.spawn(this.g_ghostlamp, x, y, 0, 0);
	}

	spawn_props(x: number, y: number) {
		this.spawn(this.g_props, x, y - 3, 0, 0);
	}

	spawn_props2(x: number, y: number) {
		this.spawn(this.g_props2, x, y - 3, 0, 0);
	}

	spawn_props3(x: number, y: number) {
		this.spawn(this.g_props3, x, y, 0, 0);
	}

	spawn_unique_enemy(x: number, y: number) {
		this.spawn(this.g_unique_enemy, x, y);
	}

	spawn_unique_enemy2(x: number, y: number) {
		this.spawn(this.g_unique_enemy2, x, y);
	}

	spawn_unique_enemy3(x: number, y: number) {
		this.spawn(this.g_unique_enemy3, x, y);
	}

	load_pixel_scene(x: number, y: number) {
		this.load_random_pixel_scene(this.g_pixel_scene_01, x, y);
	}

	load_pixel_scene2(x: number, y: number) {
		this.load_random_pixel_scene(this.g_pixel_scene_02, x, y);
	}

	load_structures(x: number, y: number) {
		this.spawn(this.g_structures, x, y - 30, 0, 0);
	}

	load_large_structures(x: number, y: number) {
		this.spawn(this.g_large_structures, x, y - 30, 0, 0);
	}

	spawn_nest(x: number, y: number) {
		this.spawn(this.g_nest, x + 4, y);
	}

	spawn_fungi(x: number, y: number) {
		this.spawn(this.g_fungi, x, y);
	}

	spawn_vines(x: number, y: number) {
		this.spawn(this.g_vines, x + 5, y + 5);
	}

	spawn_shopitem(x: number, y: number) {
		this.HandleInterest('ShopInfoProvider', x, y, [x, y, false, 1]);
	}
}
export default Coalminealt;
