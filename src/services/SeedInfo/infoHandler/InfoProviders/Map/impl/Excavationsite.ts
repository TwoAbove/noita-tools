// data/scripts/biomes/excavationsite.lua
import { isChristmas } from "../../helpers";
import Base from "../Base";
class Excavationsite extends Base {
  chestLevel = 1;
  g_small_enemies = [
    { prob: 0.55, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/firebug.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 4,
      entity: "data/entities/animals/rat.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/slimeshooter.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/miner.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/shotgunner.xml",
    },
    {
      prob: 0.2,
      min_count: 2,
      max_count: 5,
      entity: "data/entities/animals/bat.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/bigfirebug.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/goblin_bomb.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_hearty.xml",
      ngpluslevel: 2,
    },
  ];
  g_big_enemies = [
    { prob: 0.98, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entities: ["data/entities/animals/miner.xml", "data/entities/animals/shotgunner.xml"],
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/shotgunner.xml",
    },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/miner_fire.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/slimeshooter.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/fireskull.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/bigbat.xml",
    },
    {
      prob: 0.02,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/scavenger_mine.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/miner_santa.xml",
      spawn_check: isChristmas,
    },
    {
      prob: 0.2,
      min_count: 2,
      max_count: 4,
      entity: "data/entities/animals/firebug.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/bigfirebug.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/alchemist.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/tank_super.xml",
      ngpluslevel: 1,
    },
  ];
  g_lamp = [
    { prob: 0.4, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.7,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics/lantern_small.xml",
    },
  ];
  g_unique_enemy = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/slimeshooter.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/acidshooter.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/giantshooter.xml",
    },
  ];
  g_unique_enemy2 = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/miner_santa.xml",
      spawn_check: isChristmas,
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/shotgunner.xml",
    },
  ];
  g_unique_enemy3 = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/firemage.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/thundermage.xml",
    },
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_01.xml",
    },
    {
      prob: 2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_02.xml",
    },
    {
      prob: 2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_02_better.xml",
    },
  ];
  g_props = [
    { prob: 1, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_box_explosive.xml",
    },
    {
      prob: 0.25,
      min_count: 1,
      max_count: 1,
      offset_y: -3,
      entity: "data/entities/props/physics/minecart.xml",
    },
    {
      prob: 0.25,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_cart.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_barrel_radioactive.xml",
    },
    {
      prob: 0.07,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_barrel_oil.xml",
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      offset_y: -8,
      entity: "data/entities/props/physics_seamine.xml",
    },
  ];
  g_props2 = [
    { prob: 0.5, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: -3,
      entity: "data/entities/props/physics/minecart.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_brewing_stand.xml",
    },
  ];
  g_props3 = [
    { prob: 0.1, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_bottle_green.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_bottle_red.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_bottle_blue.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      offset_y: -5,
      entity: "data/entities/props/physics_bottle_yellow.xml",
    },
  ];
  g_cranes = [
    { prob: 2.2, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_wheel_stand_01.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_wheel_stand_02.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_wheel_stand_03.xml",
    },
  ];
  g_mechanism_background = [
    {
      prob: 1,
      sprite_file: "data/biome_impl/excavationsite/mechanism_background.png",
      z_index: 50,
    },
    {
      prob: 1,
      sprite_file: "data/biome_impl/excavationsite/mechanism_background2.png",
      z_index: 50,
    },
    {
      prob: 1,
      sprite_file: "data/biome_impl/excavationsite/mechanism_background3.png",
      z_index: 50,
    },
  ];
  g_pixel_scene_04 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_1.png",
      visual_file: "data/biome_impl/excavationsite/machine_1_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_1_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_2.png",
      visual_file: "data/biome_impl/excavationsite/machine_2_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_2_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_3b.png",
      visual_file: "data/biome_impl/excavationsite/machine_3b_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_3b_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_4.png",
      visual_file: "data/biome_impl/excavationsite/machine_4_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_4_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_5.png",
      visual_file: "data/biome_impl/excavationsite/machine_5_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_5_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_6.png",
      visual_file: "data/biome_impl/excavationsite/machine_6_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.3,
      material_file: "data/biome_impl/excavationsite/machine_7.png",
      visual_file: "data/biome_impl/excavationsite/machine_5_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_5_background.png",
      is_unique: 0,
    },
    {
      prob: 3,
      material_file: "data/biome_impl/excavationsite/shop.png",
      visual_file: "data/biome_impl/excavationsite/shop_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.8,
      material_file: "data/biome_impl/excavationsite/oiltank_1.png",
      visual_file: "data/biome_impl/excavationsite/oiltank_1_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.8,
      material_file: "data/biome_impl/excavationsite/lake.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pixel_scene_04_alt = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_1_alt.png",
      visual_file: "data/biome_impl/excavationsite/machine_1_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_1_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_2_alt.png",
      visual_file: "data/biome_impl/excavationsite/machine_2_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_2_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_3b_alt.png",
      visual_file: "data/biome_impl/excavationsite/machine_3b_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_3b_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_4_alt.png",
      visual_file: "data/biome_impl/excavationsite/machine_4_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_4_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_5_alt.png",
      visual_file: "data/biome_impl/excavationsite/machine_5_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_5_background.png",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/excavationsite/machine_6_alt.png",
      visual_file: "data/biome_impl/excavationsite/machine_6_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.3,
      material_file: "data/biome_impl/excavationsite/machine_7_alt.png",
      visual_file: "data/biome_impl/excavationsite/machine_5_visual.png",
      background_file: "data/biome_impl/excavationsite/machine_5_background.png",
      is_unique: 0,
    },
    {
      prob: 3,
      material_file: "data/biome_impl/excavationsite/shop_alt.png",
      visual_file: "data/biome_impl/excavationsite/shop_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.7,
      material_file: "data/biome_impl/excavationsite/receptacle_steam.png",
      visual_file: "",
      background_file: "data/biome_impl/excavationsite/receptacle_steam_background.png",
      is_unique: 0,
    },
    {
      prob: 0.8,
      material_file: "data/biome_impl/excavationsite/lake_alt.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_puzzleroom = [
    {
      prob: 1.5,
      material_file: "data/biome_impl/excavationsite/puzzleroom_01.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.5,
      material_file: "data/biome_impl/excavationsite/puzzleroom_02.png",
      visual_file: "data/biome_impl/excavationsite/puzzleroom_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.5,
      material_file: "data/biome_impl/excavationsite/puzzleroom_03.png",
      visual_file: "data/biome_impl/excavationsite/puzzleroom_03_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_gunpowderpool_01 = [
    {
      prob: 1.5,
      material_file: "data/biome_impl/excavationsite/gunpowderpool_01.png",
      visual_file: "data/biome_impl/excavationsite/gunpowderpool_01_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_gunpowderpool_02 = [
    {
      prob: 1.5,
      material_file: "data/biome_impl/excavationsite/gunpowderpool_02.png",
      visual_file: "data/biome_impl/excavationsite/gunpowderpool_02_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_gunpowderpool_03 = [
    {
      prob: 1.5,
      material_file: "data/biome_impl/excavationsite/gunpowderpool_03.png",
      visual_file: "data/biome_impl/excavationsite/gunpowderpool_03_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_gunpowderpool_04 = [
    {
      prob: 1.5,
      material_file: "data/biome_impl/excavationsite/gunpowderpool_04.png",
      visual_file: "data/biome_impl/excavationsite/gunpowderpool_04_visual.png",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_nest = [
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/firebugnest.xml",
    },
    { prob: 0.5, min_count: 1, max_count: 1, entity: "" },
  ];
  g_ghostlamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_chain_torch_ghostly.xml",
    },
  ];
  g_hanger = [
    { prob: 1, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_bucket.xml",
    },
  ];
  g_physicsstructure = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/excavationsite_machine_3b.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/excavationsite_machine_3c.xml",
    },
  ];
  g_rock = [
    { prob: 1.2, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_stone_01.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_stone_02.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_stone_03.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_stone_04.xml",
    },
  ];
  g_hanging_props = [
    { prob: 1, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/suspended_container.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/suspended_tank_radioactive.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/suspended_seamine.xml",
    },
  ];
  g_candles = [
    {
      prob: 0.33,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_candle_1.xml",
    },
    {
      prob: 0.33,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_candle_2.xml",
    },
    {
      prob: 0.33,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_candle_3.xml",
    },
  ];
  g_tower_mids = [
    {
      prob: 1,
      sprite_file: "data/biome_impl/excavationsite/tower_mid_1.png",
      z_index: 40,
    },
    {
      prob: 1,
      sprite_file: "data/biome_impl/excavationsite/tower_mid_2.png",
      z_index: 40,
    },
    {
      prob: 0.5,
      sprite_file: "data/biome_impl/excavationsite/tower_mid_3.png",
      z_index: 40,
    },
    {
      prob: 0.5,
      sprite_file: "data/biome_impl/excavationsite/tower_mid_4.png",
      z_index: 40,
    },
  ];
  g_tower_tops = [
    {
      prob: 1,
      sprite_file: "data/biome_impl/excavationsite/tower_top_1.png",
      z_index: 20,
    },
    {
      prob: 1,
      sprite_file: "data/biome_impl/excavationsite/tower_top_2.png",
      z_index: 20,
    },
    {
      prob: 1,
      sprite_file: "data/biome_impl/excavationsite/tower_top_3.png",
      z_index: 20,
    },
    {
      prob: 2,
      sprite_file: "data/biome_impl/excavationsite/tower_top_4.png",
      z_index: 20,
    },
    {
      prob: 1,
      sprite_file: "data/biome_impl/excavationsite/tower_top_5.png",
      z_index: 20,
    },
  ];

  spawn_items(x: number, y: number) {
    let r = this.randoms.ProceduralRandomf(x, y, 0, 1);
    // -- 20% is air, nothing happens
    // if (r < 0.47) {
    //   return;
    // }
    r = this.randoms.ProceduralRandomf(x - 11.431, y + 10.5257, 0, 1);

    if (r < 0.755) {
    } else {
      this.LoadPixelScene(
        "data/biome_impl/wand_altar.png",
        "data/biome_impl/wand_altar_visual.png",
        x - 10,
        y - 17,
        "",
        true
      );
    }
  }

  spawn_small_enemies(x: number, y: number) {
    const r = this.randoms.ProceduralRandomf(x, y, 0, 1);
    let spawn_percent = this.BiomeMapGetVerticalPositionInsideBiome(x, y);
    spawn_percent = 2.5 * spawn_percent + 0.35;
    if (r > spawn_percent) return;

    this.spawn(this.g_small_enemies, x, y);
  }

  spawn_big_enemies(x: number, y: number) {
    const r = this.randoms.ProceduralRandomf(x, y, 0, 1);
    let spawn_percent = this.BiomeMapGetVerticalPositionInsideBiome(x, y);
    spawn_percent = 2.1 * spawn_percent;
    if (r > spawn_percent) return;

    this.spawn(this.g_big_enemies, x, y);
  }

  spawn_lamp(x: number, y: number) {
    this.spawn(this.g_lamp, x, y + 2, 0, 0);
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

  load_pixel_scene(x: number, y: number) {}

  load_pixel_scene2(x: number, y: number) {
    // load_random_background_sprite
  }

  load_pixel_scene4(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pixel_scene_04, x, y);
  }
  load_pixel_scene4_alt(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pixel_scene_04_alt, x, y);
  }

  load_puzzleroom(x: number, y: number) {
    this.load_random_pixel_scene(this.g_puzzleroom, x, y);
  }

  load_gunpowderpool_01(x: number, y: number) {
    this.load_random_pixel_scene(this.g_gunpowderpool_01, x, y);
  }

  load_gunpowderpool_02(x: number, y: number) {
    this.load_random_pixel_scene(this.g_gunpowderpool_02, x, y);
  }

  load_gunpowderpool_03(x: number, y: number) {
    this.load_random_pixel_scene(this.g_gunpowderpool_03, x - 3, y + 3);
  }

  load_gunpowderpool_04(x: number, y: number) {
    this.load_random_pixel_scene(this.g_gunpowderpool_04, x, y);
  }

  spawn_physicsstructure(x: number, y: number) {
    this.spawn(this.g_physicsstructure, x - 5, y - 5, 0, 0);
  }

  spawn_wheel(x: number, y: number) {
    this.EntityLoad("data/entities/props/physics_wheel.xml", x, y);
  }
  spawn_wheel_small(x: number, y: number) {
    this.EntityLoad("data/entities/props/physics_wheel_small.xml", x, y);
  }
  spawn_wheel_tiny(x: number, y: number) {
    this.EntityLoad("data/entities/props/physics_wheel_tiny.xml", x, y);
  }

  spawn_hanger(x: number, y: number) {
    this.spawn(this.g_hanger, x, y, 0, 0);
  }

  spawn_rock(x: number, y: number) {
    this.spawn(this.g_rock, x, y);
  }

  spawn_hanging_prop(x: number, y: number) {
    this.spawn(this.g_hanging_props, x, y);
  }

  spawn_nest(x: number, y: number) {
    this.spawn(this.g_nest, x + 4, y + 8, 0, 0);
  }

  spawn_ladder(x: number, y: number) {}

  spawn_shopitem(x: number, y: number) {
    this.HandleInterest("ShopInfoProvider", x, y, [x, y, false, 2]);
  }

  spawn_meditation_cube(x: number, y: number) {
    this.randoms.SetRandomSeed(x, y);
    const rnd = this.randoms.Random(1, 100);
    if (rnd > 96 /* and not nightmare */) {
      this.LoadPixelScene(
        "data/biome_impl/excavationsite/meditation_cube.png",
        "data/biome_impl/excavationsite/meditation_cube_visual.png",
        x - 20,
        y - 29,
        "",
        true
      );
      this.EntityLoad("data/entities/buildings/teleport_meditation_cube.xml", x, y - 70);
    }
  }

  spawn_receptacle(x: number, y: number) {
    this.EntityLoad("data/entities/buildings/receptacle_steam.xml", x, y);
  }

  spawn_tower_short(x: number, y: number) {
    this.generate_tower(x, y, this.randoms.ProceduralRandomi(x - 4, y + 3, 0, 2));
  }

  spawn_tower_tall(x: number, y: number) {
    this.generate_tower(x, y, this.randoms.ProceduralRandomi(x + 7, y - 1, 0, 2));
  }

  generate_tower(x: number, y: number, height: number) {
    // if (this.randoms.ProceduralRandomf(x, y) > 0.5) {
    //   return;
    // }
    // y = y + 15
    // this.LoadBackgroundSprite("data/biome_impl/excavationsite/tower_bottom_1.png", x, y, 40, true)
    // y = y - 60
    // for (let i = 1; i <= height; i++) {
    //   if (y > 1600) {
    //     this.load_random_background_sprite(this.g_tower_mids, x, y);
    //     y = y - 60
    //   }
    // }
    // x = x - 50
    // this.load_random_background_sprite(this.g_tower_tops, x, y);
  }

  spawn_beam_low(x: number, y: number) {
    //  this.LoadBackgroundSprite("data/biome_impl/excavationsite/beam_low.png", x-60, y-35, 60, true);
  }
  spawn_beam_low_flipped(x: number, y: number) {
    //  this.LoadBackgroundSprite("data/biome_impl/excavationsite/beam_low_flipped.png", x-60, y-35, 60, true);
  }
  spawn_beam_steep(x: number, y: number) {
    //  this.LoadBackgroundSprite("data/biome_impl/excavationsite/beam_steep.png", x-35, y-60, 60, true);
  }
  spawn_beam_steep_flipped(x: number, y: number) {
    //  this.LoadBackgroundSprite("data/biome_impl/excavationsite/beam_steep_flipped.png", x-35, y-60, 60, true);
  }
}
export default Excavationsite;
