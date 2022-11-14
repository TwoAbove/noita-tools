// data/scripts/biomes/rainforest.lua
import Base from '../Base';
class Rainforest extends Base {
  chestLevel = 4;
  g_small_enemies = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 0.3,
      min_count: 2,
      max_count: 4,
      entity: 'data/entities/animals/rainforest/fly.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/lukki/lukki_longleg.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/lukki/lukki.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/rainforest/shooterflower.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/scavenger_poison.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/scavenger_clusterbomb.xml'
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/projectiles/mine.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/bloom.xml'
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 3,
      entity: 'data/entities/animals/shaman.xml'
    },
    {
      prob: 0.06,
      min_count: 1,
      max_count: 3,
      entity: 'data/entities/animals/wizard_twitchy.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        'data/entities/animals/rainforest/scavenger_smg.xml',
        'data/entities/animals/rainforest/scavenger_grenade.xml',
        'data/entities/animals/rainforest/coward.xml'
      ]
    }
  ];
  g_big_enemies = [
    { prob: 0.6, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 3,
      entity: 'data/entities/animals/rainforest/fungus.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/lukki/lukki_longleg.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/bloom.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/scavenger_mine.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        'data/entities/animals/rainforest/scavenger_poison.xml',
        'data/entities/animals/rainforest/scavenger_clusterbomb.xml'
      ]
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        'data/entities/animals/rainforest/scavenger_poison.xml',
        'data/entities/animals/rainforest/scavenger_clusterbomb.xml',
        'data/entities/animals/rainforest/scavenger_heal.xml'
      ]
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/projectiles/mine.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/shooterflower.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/lukki/lukki.xml'
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/spearbot.xml'
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/wizard_hearty.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      ngpluslevel: 1,
      entities: [
        'data/entities/animals/rainforest/scavenger_poison.xml',
        'data/entities/animals/rainforest/scavenger_clusterbomb.xml',
        'data/entities/animals/rainforest/scavenger_leader.xml',
        'data/entities/animals/rainforest/coward.xml'
      ]
    }
  ];
  g_unique_enemy = [
    { prob: 1, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/buildings/physics_cocoon.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/projectiles/mine.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/shooterflower.xml'
    }
  ];
  g_unique_enemy2 = [
    { prob: 1, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/buildings/lukki_eggs.xml'
    }
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/items/wand_level_04.xml'
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/items/wand_level_05.xml'
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/items/wand_unshuffle_02.xml'
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/items/wand_unshuffle_03.xml'
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/items/wand_level_04_better.xml'
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
      entity: 'data/entities/buildings/spidernest.xml'
    }
  ];
  g_large_enemies = [
    { prob: 0.4, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/shooterflower.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/rainforest/fungus.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 2,
      entity: 'data/entities/animals/rainforest/bloom.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/lukki/lukki_longleg.xml'
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/lukki/lukki.xml'
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entities: [
        {
          min_count: 1,
          max_count: 2,
          entity: 'data/entities/animals/rainforest/scavenger_clusterbomb.xml'
        },
        {
          min_count: 1,
          max_count: 2,
          entity: 'data/entities/animals/rainforest/scavenger_poison.xml'
        },
        'data/entities/animals/rainforest/scavenger_leader.xml'
      ]
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/projectiles/mine.xml'
    }
  ];
  g_scavengers = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 2,
      entities: [
        'data/entities/animals/rainforest/scavenger_smg.xml',
        'data/entities/animals/rainforest/scavenger_grenade.xml'
      ]
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/flamer.xml'
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/sniper.xml'
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/scavenger_leader.xml'
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/projectiles/mine.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/animals/rainforest/scavenger_mine.xml'
    }
  ];
  g_props = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: '' },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/physics_barrel_radioactive.xml'
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/physics_barrel_oil.xml'
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/physics_box_explosive.xml'
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/projectiles/mine.xml'
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: -2,
      entity: 'data/entities/props/physics_seamine.xml'
    }
  ];
  g_lamp = [
    { prob: 0.3, min_count: 1, max_count: 1, entity: '' },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/physics_torch_stand.xml'
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/projectiles/mine.xml'
    }
  ];
  g_lamp2 = [
    { prob: 0, min_count: 1, max_count: 1, entity: '' },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/physics_tubelamp.xml'
    }
  ];
  g_pixel_scene_01 = [
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/pit01.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/pit02.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/pit03.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.8,
      material_file: 'data/biome_impl/rainforest/oiltank_01.png',
      visual_file: 'data/biome_impl/rainforest/oiltank_01_visual.png',
      background_file: '',
      is_unique: 0
    }
  ];
  g_pixel_scene_02 = [
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/hut01.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/hut01_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/hut02.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.4,
      material_file: 'data/biome_impl/rainforest/base.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/hut03.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    },
    {
      prob: 1.2,
      material_file: 'data/biome_impl/rainforest/symbolroom.png',
      visual_file: '',
      background_file: '',
      is_unique: 0
    }
  ];
  g_pixel_scene_04 = [
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife2_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife3_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife4_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife5_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife6_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife7_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife8_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife9_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife10_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife11_background.png',
      is_unique: 0
    },
    {
      prob: 0.5,
      material_file: 'data/biome_impl/rainforest/plantlife.png',
      visual_file: '',
      background_file: 'data/biome_impl/rainforest/plantlife12_background.png',
      is_unique: 0
    }
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
    { prob: 1.5, min_count: 1, max_count: 1, entity: '' },
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
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/verlet_chains/root/hanging_root_random.xml'
    }
  ];
  g_trees = [
    { prob: 1.5, min_count: 1, max_count: 1, entity: '' },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      offset_x: -10,
      offset_y: -113,
      entity: 'data/entities/props/rainforest_tree_01.xml'
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/rainforest_tree_02.xml'
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/rainforest_tree_03.xml'
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/rainforest_tree_04.xml'
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/rainforest_tree_05.xml'
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: 'data/entities/props/rainforest_tree_06.xml'
    }
  ];

  get_portal_position() {
    const biome_x_min = -2450;
    const biome_x_max = 1900;
    const biome_y_min = 6700;
    const biome_y_max = 8000;
    const rim = 200;
    const portal_x = this.randoms.ProceduralRandomi(
      209,
      13,
      biome_x_min + rim,
      biome_x_max - rim
    );
    const portal_y = this.randoms.ProceduralRandomi(
      211,
      1.9,
      biome_y_min + rim,
      biome_y_max - rim
    );
    // --print("portal position: " .. portal_x .. ", " .. portal_y)
    return [portal_x, portal_y];
  }

  async init(x: number, y: number, w: number, h: number) {
    const is_inside_tile = (pos_x, pos_y) =>
      pos_x >= x && pos_x <= x + w && pos_y >= y && pos_y <= y + h;

    const biome_x_min = -2450;
    const biome_x_max = 1900;
    const biome_y_min = 6700;
    const biome_y_max = 8000;
    const rim = 200; // -- hint statues spawn on rim, portal target inside rim

    const [portal_x, portal_y] = this.get_portal_position();
    await this.HandleInterest('jungle_portal', portal_x, portal_y);

    if (is_inside_tile(portal_x, portal_y)) {
      await this.EntityLoad(
        'data/entities/misc/summon_portal_target.xml',
        portal_x,
        portal_y
      );
      await this.LoadPixelScene(
        'data/biome_impl/hole.png',
        '',
        portal_x - 22,
        portal_y - 22,
        '',
        true
      );
    }

    const spawn_statue = async (
      statue_num,
      spawn_x,
      spawn_y,
      ray_dir_x,
      ray_dir_y
    ) => {
      let [_, x1, y1] = await this.RaytracePlatforms(
        spawn_x,
        spawn_y,
        spawn_x + ray_dir_x * 100,
        spawn_y + ray_dir_y * 100
      );

      x1 = x1 + ray_dir_x * 20;
      y1 = y1 + ray_dir_y * 12;

      await this.LoadPixelScene(
        'data/biome_impl/rainforest/rainforest_statue_0' + statue_num + '.png',
        'data/biome_impl/rainforest/rainforest_statue_0' +
        statue_num +
        '_visual.png',
        x1,
        y1,
        '',
        true
      );
    };
    let pos_x = this.randoms.ProceduralRandomi(
      87,
      -254,
      biome_x_min,
      biome_x_min + rim
    );
    let pos_y = portal_y - 38; // -- offset to match staff position in pixel scene
    if (is_inside_tile(pos_x, pos_y))
      await spawn_statue(1, pos_x, pos_y, -1, 0);
    // -- statue 1, right
    pos_x = this.randoms.ProceduralRandomi(
      8,
      -5,
      biome_x_max - rim,
      biome_x_max
    );
    if (is_inside_tile(pos_x, pos_y)) await spawn_statue(1, pos_x, pos_y, 1, 0);

    // -- statue 2, top
    pos_x = portal_x - 13;
    pos_y = this.randoms.ProceduralRandomi(
      1999,
      7,
      biome_y_min,
      biome_y_min + rim
    );
    if (is_inside_tile(pos_x, pos_y)) await spawn_statue(2, pos_x, pos_y, 0, 1);
    // -- statue 2, bottom
    pos_y = this.randoms.ProceduralRandomi(
      -415,
      40,
      biome_y_max - rim,
      biome_y_max
    );
    if (is_inside_tile(pos_x, pos_y)) await spawn_statue(2, pos_x, pos_y, 0, 1);
  }

  async spawn_small_enemies(x: number, y: number) {
    await this.spawn(this.g_small_enemies, x, y);
  }
  async spawn_big_enemies(x: number, y: number) {
    await this.spawn(this.g_big_enemies, x, y);
  }
  async spawn_unique_enemy(x: number, y: number) {
    await this.spawn(this.g_unique_enemy, x, y + 12);
  }
  async spawn_unique_enemy2(x: number, y: number) {
    await this.spawn(this.g_unique_enemy2, x, y);
  }
  async spawn_items(x: number, y: number) {
    const r = this.randoms.ProceduralRandomf(x - 11.631, y + 10.2257, 0, 1);
    if (r > 0.27) {
      await this.LoadPixelScene(
        'data/biome_impl/wand_altar.png',
        'data/biome_impl/wand_altar_visual.png',
        x - 10,
        y - 17,
        '',
        true
      );
    }
  }
  async spawn_nest(x: number, y: number) {
    await this.spawn(this.g_nest, x, y);
  }
  async spawn_props(x: number, y: number) {
    await this.spawn(this.g_props, x, y);
  }
  async spawn_scavengers(x: number, y: number) {
    await this.spawn(this.g_scavengers, x, y);
  }
  async spawn_large_enemies(x: number, y: number) {
    await this.spawn(this.g_large_enemies, x, y);
  }
  async spawn_lamp(x: number, y: number) {
    await this.spawn(this.g_lamp, x, y - 10);
  }
  async spawn_lamp2(x: number, y: number) {
    await this.spawn(this.g_lamp2, x - 8, y - 4, 0, 0);
  }
  async load_pixel_scene(x: number, y: number) {
    await this.load_random_pixel_scene(this.g_pixel_scene_01, x, y);
  }
  async load_pixel_scene2(x: number, y: number) {
    await this.load_random_pixel_scene(this.g_pixel_scene_02, x, y);
  }
  async load_pixel_scene4(x: number, y: number) {
    await this.load_random_pixel_scene(this.g_pixel_scene_04, x, y);
  }
  async spawn_vines(x: number, y: number) {
    await this.spawn(this.g_vines, x + 5, y + 5);
    if (this.randoms.ProceduralRandomf(x, y, 0, 1) < 0.5) {
      await this.spawn(this.g_vines, x, y + 5);
    }
  }
  async spawn_dragonspot(x: number, y: number) {
    await this.EntityLoad('data/entities/buildings/dragonspot.xml', x, y);
  }
  async spawn_tree(x: number, y: number) {
    await this.spawn(this.g_trees, x + 5, y + 5);
  }
  async spawn_root_grower(x: number, y: number) {
    if (this.randoms.ProceduralRandomf(x, y, 0, 1) < 0.5) {
      return;
    }
    await this.EntityLoad('data/entities/props/root_grower.xml', x + 5, y + 5);
  }
}
export default Rainforest;
