import { GameGetDateAndTimeLocal, isChristmas } from '../helpers';
import Base from './Base';

export default class CoalMineI extends Base {
	g_small_enemies = [
		{
			prob: 0.1,
			min_count: 0,
			max_count: 0,
			entity: ''
		},
		{
			prob: 0.5,
			min_count: 1,
			max_count: 2,
			entity: 'data/entities/animals/zombie_weak.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/slimeshooter_weak.xml'
		},
		{
			prob: 0.2,
			min_count: 1,
			max_count: 3,
			entity: 'data/entities/animals/longleg.xml'
		},
		{
			prob: 0.25,
			min_count: 1,
			max_count: 2,
			entity: 'data/entities/animals/miner_weak.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/shotgunner_weak.xml'
		}
	];

	g_big_enemies = [
		{
			prob: 0.7,
			min_count: 0,
			max_count: 0,
			entity: ''
		},
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
			prob: 0.2,
			min_count: 5,
			max_count: 10,
			entity: 'data/entities/animals/longleg.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entities: [
				'data/entities/animals/miner_weak.xml',
				'data/entities/animals/miner_weak.xml',
				'data/entities/animals/shotgunner_weak.xml'
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
			prob: 0.2,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/shotgunner_weak.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/acidshooter_weak.xml'
		},
		{
			prob: 0.08,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/giantshooter_weak.xml'
		},
		{
			prob: 0.09,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/fireskull.xml'
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 2,
			entity: 'data/entities/animals/miner_santa.xml',
			spawn_check: isChristmas
		},
		{
			prob: 0.02,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/shaman.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/drone_shield.xml',
			ngpluslevel: 2
		}
	];

	g_lamp = [
		{
			prob: 0.4,
			min_count: 1,
			max_count: 1,
			entity: ''
		},
		{
			prob: 0.7,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/props/physics/lantern_small.xml'
		}
	];

	g_unique_enemy = [
		{
			prob: 0,
			min_count: 0,
			max_count: 0,
			entity: ''
		},
		{
			prob: 0.5,
			min_count: 1,
			max_count: 3,
			entity: 'data/entities/animals/slimeshooter_weak.xml'
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 2,
			entity: 'data/entities/animals/acidshooter_weak.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/giantshooter_weak.xml'
		}
	];

	g_unique_enemy2 = [
		// -- this is air, so nothing spawns at 0.6
		{
			prob: 1.5,
			min_count: 0,
			max_count: 0,
			entity: ''
		},
		// -- add skullflys after this step
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/miner_santa.xml',
			spawn_check: isChristmas
		},
		{
			prob: 0.85,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/shotgunner_weak.xml'
		},
		{
			prob: 0.5,
			min_count: 2,
			max_count: 2,
			entity: 'data/entities/animals/miner_weak.xml'
		},
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/slimeshooter_weak.xml'
		}
	];

	g_unique_enemy3 = [
		{
			prob: 0,
			min_count: 0,
			max_count: 0,
			entity: ''
		},
		{
			prob: 0.7,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/firemage_weak.xml'
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/alchemist.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/thundermage.xml'
		}
	];

	g_fungi = [
		{
			prob: 0.5,
			min_count: 0,
			max_count: 0,
			entity: ''
		},
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/fungus.xml'
		},
		{
			prob: 0.05,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/animals/fungus_big.xml'
		}
	];

	g_items = [
		{
			prob: 0,
			min_count: 0,
			max_count: 0,
			entity: ''
		},
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
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_010.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_011.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_012.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_013.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_014.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_015.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_016.xml'
		},
		{
			prob: 1,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wands/level_01/wand_017.xml'
		},
		{
			prob: 1.9,
			min_count: 1,
			max_count: 1,
			entity: 'data/entities/items/wand_level_01.xml'
		}
	];

	g_props = [
		{
			prob: 0.2,
			min_count: 0,
			max_count: 0,
			offset_y: 0,
			entity: ''
		},
		{
			prob: 0.5,
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
			prob: 0.25,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/props/physics_cart.xml'
		},
		{
			prob: 0.1,
			min_count: 1,
			max_count: 1,
			offset_y: 0,
			entity: 'data/entities/props/physics_barrel_radioactive.xml'
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			offset_y: 0,
			entity: 'data/entities/props/physics_barrel_oil.xml'
		}
	];

	g_props2 = [
		{
			prob: 0.5,
			min_count: 0,
			max_count: 0,
			offset_y: 0,
			entity: ''
		},
		{
			prob: 0.2,
			min_count: 1,
			max_count: 1,
			offset_y: -3,
			entity: 'data/entities/props/physics/minecart.xml'
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
		{
			prob: 0.1,
			min_count: 0,
			max_count: 0,
			offset_y: 0,
			entity: ''
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/items/pickup/potion.xml'
		}
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
			material_file: 'data/biome_impl/coalmine/shrine01.png',
			visual_file: 'data/biome_impl/coalmine/shrine01_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/shrine02.png',
			visual_file: 'data/biome_impl/coalmine/shrine02_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/slimepit.png',
			visual_file: 'data/biome_impl/coalmine/slimepit_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/laboratory.png',
			visual_file: 'data/biome_impl/coalmine/laboratory_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/swarm.png',
			visual_file: 'data/biome_impl/coalmine/swarm_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/symbolroom.png',
			visual_file: '',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/physics_01.png',
			visual_file: 'data/biome_impl/coalmine/physics_01_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/physics_02.png',
			visual_file: 'data/biome_impl/coalmine/physics_02_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/physics_03.png',
			visual_file: '',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 1.5,
			material_file: 'data/biome_impl/coalmine/shop.png',
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
		},
		{
			prob: 0.75,
			material_file: 'data/biome_impl/coalmine/wandtrap_h_02.png',
			visual_file: 'data/biome_impl/coalmine/wandtrap_h_02_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.75,
			material_file: 'data/biome_impl/coalmine/wandtrap_h_04.png',
			visual_file: 'data/biome_impl/coalmine/wandtrap_h_04_visual.png',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: ['oil', 'alcohol', 'gunpowder_explosive']
			}
		},
		{
			prob: 0.75,
			material_file: 'data/biome_impl/coalmine/wandtrap_h_06.png',
			visual_file: 'data/biome_impl/coalmine/wandtrap_h_06_visual.png',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: [
					'magic_liquid_teleportation',
					'magic_liquid_polymorph',
					'magic_liquid_random_polymorph',
					'radioactive_liquid'
				]
			}
		},
		{
			prob: 0.75,
			material_file: 'data/biome_impl/coalmine/wandtrap_h_07.png',
			visual_file: 'data/biome_impl/coalmine/wandtrap_h_06_visual.png',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: ['water', 'oil', 'alcohol', 'radioactive_liquid']
			}
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/physics_swing_puzzle.png',
			visual_file: 'data/biome_impl/coalmine/physics_swing_puzzle_visual.png',
			background_file: '',
			is_unique: 0
		},
		{
			prob: 0.5,
			material_file: 'data/biome_impl/coalmine/receptacle_oil.png',
			visual_file: 'data/biome_impl/coalmine/receptacle_oil_visual.png',
			background_file: 'data/biome_impl/coalmine/receptacle_oil_background.png',
			is_unique: 0
		}
	];

	g_oiltank = [
		{
			prob: 1,
			material_file: 'data/biome_impl/coalmine/oiltank_1.png',
			visual_file: 'data/biome_impl/coalmine/oiltank_1_visual.png',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: [
					'water',
					'oil',
					'water',
					'oil',
					'alcohol',
					'sand',
					'coal',
					'radioactive_liquid'
				]
			}
		},
		{
			prob: 0.0004,
			material_file: 'data/biome_impl/coalmine/oiltank_1.png',
			visual_file: 'data/biome_impl/coalmine/oiltank_1_visual.png',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: [
					'magic_liquid_teleportation',
					'magic_liquid_polymorph',
					'magic_liquid_random_polymorph',
					'magic_liquid_berserk',
					'magic_liquid_charm',
					'magic_liquid_invisibility',
					'magic_liquid_hp_regeneration',
					'salt',
					'blood',
					'gold',
					'honey'
				]
			}
		},
		{
			prob: 0.01,
			material_file: 'data/biome_impl/coalmine/oiltank_2.png',
			visual_file: 'data/biome_impl/coalmine/oiltank_2_visual.png',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: [
					'blood_fungi',
					'blood_cold',
					'lava',
					'poison',
					'slime',
					'gunpowder_explosive',
					'soil',
					'salt',
					'blood',
					'cement'
				]
			}
		},
		{
			prob: 1,
			material_file: 'data/biome_impl/coalmine/oiltank_2.png',
			visual_file: 'data/biome_impl/coalmine/oiltank_2_visual.png',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: [
					'water',
					'oil',
					'water',
					'oil',
					'alcohol',
					'oil',
					'coal',
					'radioactive_liquid'
				]
			}
		},
		{
			prob: 1,
			material_file: 'data/biome_impl/coalmine/oiltank_3.png',
			visual_file: 'data/biome_impl/coalmine/oiltank_3_visual.png',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: [
					'water',
					'oil',
					'water',
					'oil',
					'alcohol',
					'water',
					'coal',
					'radioactive_liquid',
					'magic_liquid_teleportation'
				]
			}
		},
		{
			prob: 1,
			material_file: 'data/biome_impl/coalmine/oiltank_4.png',
			visual_file: 'data/biome_impl/coalmine/oiltank_4_visual.png',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: [
					'water',
					'oil',
					'water',
					'oil',
					'alcohol',
					'sand',
					'coal',
					'radioactive_liquid',
					'magic_liquid_polymorph'
				]
			}
		},
		{
			prob: 1,
			material_file: 'data/biome_impl/coalmine/oiltank_5.png',
			visual_file: '',
			background_file: '',
			is_unique: 0,
			color_material: {
				fff0bbee: [
					'water',
					'oil',
					'water',
					'oil',
					'alcohol',
					'radioactive_liquid',
					'coal',
					'radioactive_liquid'
				]
			}
		},
		{
			prob: 0.05,
			material_file: 'data/biome_impl/coalmine/oiltank_puzzle.png',
			visual_file: 'data/biome_impl/coalmine/oiltank_puzzle_visual.png',
			background_file: 'data/biome_impl/coalmine/oiltank_puzzle_background.png',
			is_unique: 0
		}
	];

	g_oiltank_alt = [
		{
			prob: 1,
			material_file: 'data/biome_impl/coalmine/oiltank_alt.png',
			visual_file: 'data/biome_impl/coalmine/oiltank_alt_visual.png',
			background_file: '',
			color_material: {
				fff0bbee: [
					'water',
					'oil',
					'water',
					'oil',
					'alcohol',
					'sand',
					'radioactive_liquid',
					'radioactive_liquid',
					'magic_liquid_berserk'
				]
			}
		}
	];

	g_i_structures = [
		{
			prob: 0.1,
			min_count: 0,
			max_count: 0,
			offset_y: 0,
			entity: ''
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/props/coalmine_i_structure_01.xml'
		},
		{
			prob: 0.3,
			min_count: 1,
			max_count: 1,
			offset_y: -5,
			entity: 'data/entities/props/coalmine_i_structure_02.xml'
		}
	];

	g_structures = [
		{
			prob: 0.1,
			min_count: 0,
			max_count: 0,
			offset_y: 0,
			entity: ''
		},
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
		{
			prob: 0.1,
			min_count: 0,
			max_count: 0,
			offset_y: 0,
			entity: ''
		},
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
		{
			prob: 0.5,
			min_count: 1,
			max_count: 1,
			entity: ''
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
		{
			prob: 1.5,
			min_count: 1,
			max_count: 1,
			entity: ''
		},
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

	chestLevel = 1;

	async load_i_structures(x: number, y: number) { }
	async spawn_vines(x: number, y: number) { }
	async spawn_lamp(x: number, y: number) { }

	async spawn_small_enemies(x: number, y: number, w, h, is_open_path) {
		// TODO: figure out is_open_path, BiomeMapGetVerticalPositionInsideBiome
		// this.warn(`spawn_small_enemies not implemented for ${CoalMineI.name}`);
	}

	async load_large_structures(x: number, y: number) {
		await this.spawn(this.g_large_structures, x, y - 30, 0, 0);
	}
	async spawn_big_enemies(x: number, y: number, w, h, is_open_path) {
		// TODO: figure out is_open_path, BiomeMapGetVerticalPositionInsideBiome
		// this.warn(`spawn_big_enemies not implemented for ${CoalMineI.name}`);
	}
	async spawn_props(x: number, y: number) {
		await this.spawn(this.g_props, x, y - 3, 0, 0);
	}
	async spawn_props2(x: number, y: number) {
		await this.spawn(this.g_props2, x, y - 3, 0, 0);
	}
	async spawn_props3(x: number, y: number) {
		await this.spawn(this.g_props3, x, y - 3, 0, 0);
	}
	async spawn_unique_enemy(x: number, y: number) {
		await this.spawn(this.g_unique_enemy, x, y, 0, 0);
	}
	async spawn_unique_enemy2(x: number, y: number) {
		await this.spawn(this.g_unique_enemy2, x, y, 0, 0);
	}
	async spawn_unique_enemy3(x: number, y: number) {
		await this.spawn(this.g_unique_enemy3, x, y, 0, 0);
	}
	async spawn_fungi(x: number, y: number) {
		await this.spawn(this.g_fungi, x, y);
	}

	async spawn_items(x: number, y: number) {
		const x_offset = 5;
		const y_offset = 5;

		let r = this.randoms.ProceduralRandomf(x, y, 0, 1);
		// -- 20% is air, nothing happens
		if (r < 0.47) {
			return;
		}
		r = this.randoms.ProceduralRandomf(x - 11.431, y + 10.5257, 0, 1);

		if (r < 0.755) {
		} else {
			await this.LoadPixelScene(
				'data/biome_impl/wand_altar.png',
				'data/biome_impl/wand_altar_visual.png',
				x - 10 + x_offset,
				y - 17 + x_offset,
				'',
				true
			);
		}
	}

	async spawn_trapwand(x: number, y: number) {
		const options = [
			'wands/level_01/wand_001',
			'wands/level_01/wand_002',
			'wands/level_01/wand_003',
			'wands/level_01/wand_004',
			'wands/level_01/wand_005',
			'wands/level_01/wand_006',
			'wands/level_01/wand_007',
			'wands/level_01/wand_008',
			'wands/level_01/wand_009',
			'wand_level_01'
		];
		this.randoms.SetRandomSeed(x, y);

		const rnd = this.randoms.Random(0, options.length - 1);
		const wand_to_spawn = 'data/entities/items/' + options[rnd] + '.xml';
		await this.HandleInterest(wand_to_spawn, x, y);
	}

	async spawn_shopitem(x, y) {
		await this.HandleInterest('ShopInfoProvider', x, y, [x, y, false, 1]);
	}

	async load_pixel_scene(x: number, y: number) {
		this.randoms.SetRandomSeed(x, y);
		if (this.randoms.Random(1, 100) > 50) {
			await this.load_random_pixel_scene(this.g_oiltank, x, y);
		} else {
			await this.load_random_pixel_scene(this.g_pixel_scene_01, x, y);
		}
	}

	async load_pixel_scene2(x: number, y: number) {
		await this.load_random_pixel_scene(this.g_pixel_scene_02, x, y);
	}


	async load_oiltank_alt(x: number, y: number) {
		await this.load_random_pixel_scene(this.g_oiltank_alt, x, y);
	}


	async load_structures(x: number, y: number) {
		await this.spawn(this.g_structures, x, y - 30, 0, 0);
	}

	async load_oiltank(x: number, y: number) {
		this.randoms.SetRandomSeed(x, y);
		if (this.randoms.Random(1, 100) <= 50) {
			await this.load_random_pixel_scene(this.g_oiltank, x, y);
		} else {
			await this.load_random_pixel_scene(this.g_pixel_scene_01, x, y);
		}
	}
}
