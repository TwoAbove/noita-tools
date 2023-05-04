// data/scripts/biomes/rainforest_dark.lua
import Base from "../Base";
class Rainforestdark extends Base {
  chestLevel = 4;
  g_small_enemies = [
    { prob: 0.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki_creepy_long.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/lurker.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki_dark.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/wizard_weaken.xml",
    },
    {
      prob: 0.06,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/wizard_twitchy.xml",
    },
    {
      prob: 0.06,
      min_count: 1,
      max_count: 3,
      entity: "data/entities/animals/wizard_homing.xml",
    },
  ];
  g_big_enemies = [
    { prob: 0.6, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 3,
      entity: "data/entities/animals/rainforest/fungus.xml",
    },
    {
      prob: 0.1,
      min_count: 2,
      max_count: 3,
      entity: "data/entities/animals/fungus_big.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki_dark.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lurker.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki.xml",
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_dark.xml",
    },
    {
      prob: 0.03,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/wizard_hearty.xml",
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/necrobot.xml",
      ngpluslevel: 1,
    },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/necrobot_super.xml",
      ngpluslevel: 2,
    },
  ];
  g_unique_enemy = [
    { prob: 1, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/drone_shield.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lurker.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki_dark.xml",
    },
  ];
  g_unique_enemy2 = [
    { prob: 1, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/buildings/lukki_eggs.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki_dark.xml",
    },
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_04.xml",
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_05.xml",
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_03.xml",
    },
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_04.xml",
    },
    {
      prob: 5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_05_better.xml",
    },
  ];
  g_nest = [{ prob: 0.5, min_count: 1, max_count: 1, entity: "" }];
  g_large_enemies = [
    { prob: 0.4, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lurker.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/rainforest/fungus.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/fungus_big.xml",
    },
    {
      prob: 0.09,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/lukki/lukki_dark.xml",
    },
    {
      prob: 0.2,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/animals/crypt/skullfly.xml",
    },
  ];
  g_scavengers = [{ prob: 0.5, min_count: 0, max_count: 0, entity: "" }];
  g_props = [
    { prob: 2.5, min_count: 0, max_count: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_barrel_radioactive.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_fungus_small.xml",
    },
    {
      prob: 0.1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_fungus.xml",
    },
    {
      prob: 0.08,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_fungus_big.xml",
    },
  ];
  g_lamp = [
    { prob: 0.3, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.6,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_torch_stand_blue.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_fungus_small.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_fungus.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics_fungus_big.xml",
    },
  ];
  g_lamp2 = [{ prob: 0, min_count: 1, max_count: 1, entity: "" }];
  g_pixel_scene_01 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/pit01.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/pit02.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/pit03.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_pixel_scene_02 = [
    {
      prob: 0.5,
      material_file: "data/biome_impl/rainforest/hut03.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
    {
      prob: 1.2,
      material_file: "data/biome_impl/rainforest/symbolroom.png",
      visual_file: "",
      background_file: "",
      is_unique: 0,
    },
  ];
  g_ghostlamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      offset_y: 10,
      entity: "data/entities/props/physics_chain_torch_ghostly.xml",
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
  g_vines = [
    { prob: 0.5, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_dark.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_dark_long.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_dark_short.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_dark_shorter.xml",
    },
  ];
  init(x: number, y: number) {
    // apply_modifier( "rainforest_dark", "FOG_OF_WAR_REAPPEARS" );
  }

  spawn_small_enemies(x: number, y: number) {
    this.spawn(this.g_small_enemies, x, y);
  }
  spawn_big_enemies(x: number, y: number) {
    this.spawn(this.g_big_enemies, x, y);
  }
  spawn_items(x: number, y: number) {
    const r = this.randoms.ProceduralRandomf(x - 11.631, y + 10.2257, 0, 1);

    if (r > 0.27)
      this.LoadPixelScene(
        "data/biome_impl/wand_altar.png",
        "data/biome_impl/wand_altar_visual.png",
        x - 10,
        y - 17,
        "",
        true
      );
  }
  spawn_props(x: number, y: number) {
    this.spawn(this.g_props, x, y);
  }
  spawn_lamp(x: number, y: number) {
    this.spawn(this.g_lamp, x, y - 10);
  }
  load_pixel_scene(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pixel_scene_01, x, y);
  }
  load_pixel_scene2(x: number, y: number) {
    this.load_random_pixel_scene(this.g_pixel_scene_02, x, y);
  }
  spawn_unique_enemy(x: number, y: number) {
    this.spawn(this.g_unique_enemy, x, y + 12);
  }
  spawn_unique_enemy2(x: number, y: number) {
    this.spawn(this.g_unique_enemy, x, y);
  }
  spawn_scavengers(x: number, y: number) {}
  spawn_large_enemies(x: number, y: number) {
    this.spawn(this.g_large_enemies, x, y);
  }
  spawn_lamp2(x: number, y: number) {
    this.spawn(this.g_lamp2, x - 8, y - 4, 0, 0);
  }
  load_pixel_scene4(x: number, y: number) {}
  spawn_vines(x: number, y: number) {
    this.spawn(this.g_vines, x + 5, y + 5);
    // -- chance for an extra spawn for denser vineage
    if (this.randoms.ProceduralRandomf(x, y, 0, 1) < 0.5) {
      this.spawn(this.g_vines, x, y + 5);
    }
  }
  spawn_dragonspot(x: number, y: number) {}
  spawn_root_grower(x: number, y: number) {
    if (this.randoms.ProceduralRandomf(x, y, 0, 1) < 0.5) return;
    this.EntityLoad("data/entities/props/root_grower.xml", x + 5, y + 5);
  }
  spawn_tree(x: number, y: number) {}
}
export default Rainforestdark;
