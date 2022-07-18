// data/scripts/biomes/snowcave.lua
import { GameGetDateAndTimeLocal } from '../../helpers';
import Base from '../Base';
class Snowcavetunnel extends Base {
  chestLevel = 2;
  g_small_enemies = [
    { prob: 0.1, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/shotgunner.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/slimeshooter.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 4,
      entity: 'data/entities/animals/rat.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/iceskull.xml'
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/scavenger_grenade.xml'
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/scavenger_smg.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        'data/entities/animals/scavenger_smg.xml',
        'data/entities/animals/scavenger_grenade.xml'
      ]
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/sniper.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/tank.xml'
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/tank_rocket.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      ngpluslevel: 1,
      entity: 'data/entities/animals/thundermage.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      ngpluslevel: 2,
      entity: 'data/entities/animals/thundermage_big.xml'
    }
  ];
  g_big_enemies = [
    { prob: 0.3, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 0.15,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/thundermage.xml'
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      ngpluslevel: 1,
      entity: 'data/entities/animals/thundermage_big.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/worm_big.xml'
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/worm.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 3,
      entity: 'data/entities/animals/worm_tiny.xml'
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 3,
      entity: 'data/entities/animals/iceskull.xml'
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/giant.xml'
    },
    {
      prob: 0.04,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/icemage.xml'
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entities: [
        {
          min_count: 1,
          max_count: 1,
          entity: 'data/entities/animals/sniper.xml'
        },
        {
          min_count: 0,
          max_count: 2,
          entity: 'data/entities/animals/shotgunner.xml'
        }
      ]
    },
    {
      prob: 0.2,
      min_count: 2,
      max_count: 3,
      entity: 'data/entities/animals/scavenger_grenade.xml'
    },
    {
      prob: 0.2,
      min_count: 2,
      max_count: 3,
      entity: 'data/entities/animals/scavenger_smg.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entities: [
        {
          min_count: 1,
          max_count: 2,
          entity: 'data/entities/animals/scavenger_smg.xml'
        },
        {
          min_count: 1,
          max_count: 2,
          entity: 'data/entities/animals/scavenger_grenade.xml'
        }
      ]
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      ngpluslevel: 1,
      entities: [
        {
          min_count: 1,
          max_count: 1,
          entity: 'data/entities/animals/scavenger_smg.xml'
        },
        {
          min_count: 1,
          max_count: 2,
          entity: 'data/entities/animals/scavenger_grenade.xml'
        },
        {
          min_count: 0,
          max_count: 1,
          entity: 'data/entities/animals/coward.xml'
        }
      ]
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/tank.xml'
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/tank_rocket.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        {
          min_count: 1,
          max_count: 3,
          entity: 'data/entities/animals/scavenger_smg.xml'
        },
        {
          min_count: 1,
          max_count: 3,
          entity: 'data/entities/animals/scavenger_grenade.xml'
        },
        'data/entities/animals/scavenger_leader.xml'
      ]
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/monk.xml'
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/wizard_neutral.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/thunderskull.xml'
    },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 4,
      entity: 'data/entities/animals/scavenger_glue.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/drone_shield.xml',
      ngpluslevel: 2
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/buildings/hpcrystal.xml',
      ngpluslevel: 1
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/easter/sniper.xml',
      spawn_check: () => {
        const [year, month, day] = GameGetDateAndTimeLocal();
        if (month === 8 && day === 24) {
          return true;
        }
        return false;
      }
    }
  ];
  g_scavenger_party = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entities: [
        {
          min_count: 1,
          max_count: 3,
          entity: 'data/entities/animals/scavenger_smg.xml'
        },
        {
          min_count: 1,
          max_count: 3,
          entity: 'data/entities/animals/scavenger_grenade.xml'
        },
        {
          min_count: 0,
          max_count: 1,
          entity: 'data/entities/animals/coward.xml'
        },
        'data/entities/animals/scavenger_leader.xml'
      ]
    }
  ];
  g_unique_enemy = [
    { prob: 0, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/tank.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/tank_rocket.xml'
    },
    {
      prob: 0.001,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/tank_super.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/wizard_tele.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/wizard_dark.xml'
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/wizard_swapper.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/necromancer.xml'
    }
  ];
  g_unique_enemy2 = [
    { prob: 0, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/scavenger_grenade.xml'
    },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/scavenger_smg.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/sniper.xml'
    }
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/items/wand_level_02.xml'
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/items/wand_level_02_better.xml'
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/items/wand_unshuffle_02.xml'
    }
  ];
  g_pixel_scene_01 = [
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/verticalobservatory.png',
      visual_file: 'data/biome_impl/snowcave/verticalobservatory_visual.png',
      background_file:
        'data/biome_impl/snowcave/verticalobservatory_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/verticalobservatory2.png',
      visual_file: 'data/biome_impl/snowcave/verticalobservatory2_visual.png',
      background_file:
        'data/biome_impl/snowcave/verticalobservatory2_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/icebridge2.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/pipe.png',
      visual_file: 'data/biome_impl/snowcave/pipe_visual.png',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.25,
      material_file: 'data/biome_impl/snowcave/receptacle_water.png',
      visual_file: '',
      background_file:
        'data/biome_impl/snowcave/receptacle_water_background.png',
      is_unique: 0
    }
  ];
  g_pixel_scene_01_alt = [
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/verticalobservatory_alt.png',
      visual_file: 'data/biome_impl/snowcave/verticalobservatory_visual.png',
      background_file:
        'data/biome_impl/snowcave/verticalobservatory_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/verticalobservatory2_alt.png',
      visual_file: 'data/biome_impl/snowcave/verticalobservatory2_visual.png',
      background_file:
        'data/biome_impl/snowcave/verticalobservatory2_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/icebridge2_alt.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/pipe_alt.png',
      visual_file: 'data/biome_impl/snowcave/pipe_visual.png',
      background_file: '',
      is_unique: 0
    }
  ];
  g_pixel_scene_02 = [
    {
      prob: 0.4,
      material_file: 'data/biome_impl/snowcave/crater.png',
      visual_file: 'data/biome_impl/snowcave/crater_visual.png',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/horizontalobservatory.png',
      visual_file: 'data/biome_impl/snowcave/horizontalobservatory_visual.png',
      background_file:
        'data/biome_impl/snowcave/horizontalobservatory_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/horizontalobservatory2.png',
      visual_file: 'data/biome_impl/snowcave/horizontalobservatory2_visual.png',
      background_file:
        'data/biome_impl/snowcave/horizontalobservatory2_background.png',
      is_unique: 0
    },
    {
      prob: 0.3,
      material_file: 'data/biome_impl/snowcave/horizontalobservatory3.png',
      visual_file: 'data/biome_impl/snowcave/horizontalobservatory3_visual.png',
      background_file:
        'data/biome_impl/snowcave/horizontalobservatory3_background.png',
      is_unique: 0
    },
    {
      prob: 0.4,
      material_file: 'data/biome_impl/snowcave/icebridge.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.4,
      material_file: 'data/biome_impl/snowcave/snowcastle.png',
      visual_file: 'data/biome_impl/snowcave/snowcastle_visual.png',
      background_file: 'data/biome_impl/snowcave/snowcastle_background.png',
      is_unique: 0
    },
    {
      prob: 0,
      material_file: 'data/biome_impl/snowcave/symbolroom.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/icepillar.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 1.5,
      material_file: 'data/biome_impl/snowcave/shop.png',
      visual_file: 'data/biome_impl/snowcave/shop_visual.png',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/camp.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    }
  ];
  g_pixel_scene_03 = [
    {
      prob: 0.9,
      material_file: '',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/tinyobservatory.png',
      visual_file: 'data/biome_impl/snowcave/tinyobservatory_visual.png',
      background_file:
        'data/biome_impl/snowcave/tinyobservatory_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/tinyobservatory2.png',
      visual_file: 'data/biome_impl/snowcave/tinyobservatory2_visual.png',
      background_file:
        'data/biome_impl/snowcave/tinyobservatory2_background.png',
      is_unique: 0
    },
    {
      prob: 0.2,
      material_file: 'data/biome_impl/snowcave/buried_eye.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    }
  ];
  g_acidtank_right = [
    {
      prob: 1.7,
      material_file: '',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.2,
      material_file: 'data/biome_impl/acidtank_2.png',
      visual_file: 'data/biome_impl/acidtank_2_visual.png',
      background_file: 'data/biome_impl/acidtank_2_background.png',
      is_unique: 0
    }
  ];
  g_acidtank_left = [
    {
      prob: 1.7,
      material_file: '',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.2,
      material_file: 'data/biome_impl/acidtank.png',
      visual_file: 'data/biome_impl/acidtank_visual.png',
      background_file: 'data/biome_impl/acidtank_background.png',
      is_unique: 0
    }
  ];
  g_pixel_scene_04 = [
    {
      prob: 0.5,
      material_file: '',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/icicles.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/icicles2.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/icicles3.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/snowcave/icicles4.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    }
  ];
  g_puzzle_capsule = [
    {
      prob: 9,
      material_file: '',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 1,
      material_file: 'data/biome_impl/snowcave/puzzle_capsule.png',
      visual_file: 'data/biome_impl/snowcave/puzzle_capsule_visual.png',
      background_file: 'data/biome_impl/snowcave/puzzle_capsule_background.png',
      is_unique: 0
    }
  ];
  g_puzzle_capsule_b = [
    {
      prob: 9,
      material_file: '',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 1,
      material_file: 'data/biome_impl/snowcave/puzzle_capsule_b.png',
      visual_file: 'data/biome_impl/snowcave/puzzle_capsule_b_visual.png',
      background_file:
        'data/biome_impl/snowcave/puzzle_capsule_b_background.png',
      is_unique: 0
    }
  ];
  g_lamp = [
    { prob: 0.4, min_count: 1, max_count: 1, entity: '' },
    {
      prob: 0.7,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/physics_lantern_small.xml'
    }
  ];
  g_props = [
    { prob: 0.15, min_count: 0, max_count: 0, offset_y: 0, entity: '' },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_box_explosive.xml'
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_propane_tank.xml'
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_barrel_oil.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_trap_electricity_enabled.xml'
    }
  ];
  g_skulls = [
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_skull_01.xml'
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_skull_02.xml'
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_skull_03.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_bone_01.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_bone_02.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_bone_03.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_bone_04.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_bone_05.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_bone_06.xml'
    }
  ];
  g_stones = [
    {
      prob: 2,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/stonepile.xml'
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_stone_01.xml'
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_stone_02.xml'
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_stone_03.xml'
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: 'data/entities/props/physics_stone_04.xml'
    },
    { prob: 4, min_count: 1, max_count: 1, offset_y: 0, entity: '' }
  ];
  g_ghostlamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      offset_y: 10,
      entity: 'data/entities/props/physics_chain_torch_ghostly.xml'
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
  g_vines = [
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/verlet_chains/cords/verlet_cord.xml'
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/verlet_chains/cords/verlet_cord_long.xml'
    },
    { prob: 1.5, min_count: 1, max_count: 1, entity: '' },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/verlet_chains/cords/verlet_cord_short.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/verlet_chains/cords/verlet_cord_shorter.xml'
    }
  ];
  g_fish = [
    {
      prob: 1,
      min_count: 3,
      max_count: 4,
      entity: 'data/entities/animals/fish_large.xml'
    },
    { prob: 5, min_count: 1, max_count: 1, entity: '' }
  ];

  safe(x: number, y: number) {
    if (x >= 125 && x <= 249 && y >= 3070 && y <= 3187) {
      return false;
    }
    return true;
  }

  async init(x: number, y: number, w, h) {
    for (let i = 0; i < 8; i++) {
      let biome_x_min = -2350;
      let biome_x_max = 2350;
      let biome_y_min = 3140;
      let biome_y_max = 4500;

      let pos_x = this.randoms.ProceduralRandomi(
        109,
        i * 53,
        biome_x_min,
        biome_x_max
      );
      let pos_y = this.randoms.ProceduralRandomi(
        111,
        i * 2.9,
        biome_y_min,
        biome_y_max
      );

      if (pos_x >= x && pos_x <= x + w && pos_y >= y && pos_y <= y + h) {
        await this.LoadPixelScene(
          'data/biome_impl/snowcave/statue_hand.png',
          '',
          pos_x - 22,
          pos_y - 22,
          '',
          true
        );
      }
    }
  }

  async spawn_small_enemies(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.spawn(this.g_small_enemies, x, y);
    }
  }
  async spawn_big_enemies(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.spawn(this.g_big_enemies, x, y);
    }
  }
  async spawn_unique_enemy(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.spawn(this.g_unique_enemy, x, y);
    }
  }
  async spawn_unique_enemy2(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.spawn(this.g_unique_enemy2, x, y);
    }
  }
  async spawn_scavenger_party(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.spawn(this.g_scavenger_party, x, y);
    }
  }
  async spawn_items(x: number, y: number) {
    const r = this.randoms.ProceduralRandomf(x - 11.631, y + 10.2257, 0, 1);
    if (r < 0.45) {
      await this.LoadPixelScene(
        'data/biome_impl/wand_altar.png',
        'data/biome_impl/wand_altar_visual.png',
        x - 15,
        y - 17,
        '',
        true
      );
    }
  }
  async spawn_lamp(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.spawn(this.g_lamp, x + 5, y + 10, 0, 0);
    }
  }
  async spawn_props(x: number, y: number) {
    if (!this.safe(x, y)) {
      return;
    }
    const r = this.randoms.ProceduralRandomf(x - 11.231, y + 10.2157, 0, 1);
    if (r < 0.9) {
      await this.spawn(this.g_props, x, y - 3, 0, 0);
    } else {
      await this.LoadPixelScene(
        'data/biome_impl/snowperson.png',
        'data/biome_impl/snowperson_visual.png',
        x - 12,
        y - 38,
        '',
        true
      );
    }
  }
  async spawn_skulls(x: number, y: number) {
    await this.spawn(this.g_skulls, x, y, 0, 0);
  }
  async spawn_stones(x: number, y: number) {
    await this.spawn(this.g_stones, x, y, 0, 0);
  }
  async load_pixel_scene(x: number, y: number) {
    await this.load_random_pixel_scene(this.g_pixel_scene_01, x, y);
  }
  async load_pixel_scene_alt(x: number, y: number) {
    await this.load_random_pixel_scene(this.g_pixel_scene_01_alt, x, y);
  }
  async load_pixel_scene2(x: number, y: number) {
    await this.load_random_pixel_scene(this.g_pixel_scene_02, x, y);
  }
  async load_pixel_scene3(x: number, y: number) {
    await this.load_random_pixel_scene(this.g_pixel_scene_03, x, y);
  }
  async load_pixel_scene4(x: number, y: number) {
    await this.load_random_pixel_scene(this.g_pixel_scene_04, x, y);
  }
  async load_puzzle_capsule(x: number, y: number) {
    await this.load_random_pixel_scene(this.g_puzzle_capsule, x, y);
  }
  async load_puzzle_capsule_b(x: number, y: number) {
    await this.load_random_pixel_scene(
      this.g_puzzle_capsule_b,
      x - 50,
      y - 230
    );
  }
  async spawn_altar_torch(x: number, y: number) {
    await this.EntityLoad('data/entities/props/altar_torch.xml', x - 7, y - 36);
  }
  async spawn_acid(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.EntityLoad('data/entities/props/dripping_acid_gas.xml', x, y);
    }
  }
  async load_altar(x: number, y: number) {
    await this.LoadPixelScene(
      'data/biome_impl/altar.png',
      'data/biome_impl/altar_visual.png',
      x - 92,
      y - 96,
      '',
      true
    );
    await this.EntityLoad('data/entities/buildings/altar.xml', x, y - 32);
  }
  async load_acidtank_right(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.load_random_pixel_scene(this.g_acidtank_right, x - 12, y - 12);
    }
  }
  async load_acidtank_left(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.load_random_pixel_scene(this.g_acidtank_left, x - 252, y - 12);
    }
  }
  async spawn_shopitem(x: number, y: number) {
    await this.HandleInterest('ShopInfoProvider', x, y, [x, y, false, 3]);
  }
  async spawn_vines(x: number, y: number) {
    await this.spawn(this.g_vines, x + 5, y + 5);
  }
  async spawn_electricity_trap(x: number, y: number) {
    await this.EntityLoad(
      'data/entities/props/physics_trap_electricity_enabled.xml',
      x,
      y
    );
  }
  async spawn_burning_barrel(x: number, y: number) {
    if (this.safe(x, y)) {
      await this.EntityLoad(
        'data/entities/props/physics_barrel_burning.xml',
        x,
        y
      );
    }
  }
  async spawn_fish(x: number, y: number) {
    await this.spawn(this.g_fish, x, y);
  }
  async spawn_buried_eye_teleporter(x: number, y: number) {
    await this.EntityLoad(
      'data/entities/buildings/teleport_snowcave_buried_eye.xml',
      x,
      y
    );
  }
  async spawn_statue_hand(x: number, y: number) {
    await this.EntityLoad('data/entities/buildings/statue_hand_1.xml', x, y);
  }
  async spawn_receptacle(x: number, y: number) {
    await this.EntityLoad('data/entities/buildings/receptacle_water.xml', x, y);
  }
}
export default Snowcavetunnel;
