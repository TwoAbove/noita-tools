// data/scripts/biomes/meat.lua
import Base from "../Base";
class Meat extends Base {
  chestLevel = 2;
  g_small_enemies = [
    { prob: 0.1, min_count: 0, max_count: 0, entity: "" },
    { prob: 0.3, min_count: 1, max_count: 2, entity: "data/entities/animals/shotgunner_hell.xml" },
    { prob: 0.3, min_count: 1, max_count: 2, entity: "data/entities/animals/miner_hell.xml" },
    { prob: 0.5, min_count: 1, max_count: 4, entity: "data/entities/animals/rat.xml" },
    { prob: 0.2, min_count: 1, max_count: 1, entity: "data/entities/animals/sniper_hell.xml" },
  ];
  g_big_enemies = [
    { prob: 0.3, min_count: 0, max_count: 0, entity: "" },
    { prob: 0.05, min_count: 1, max_count: 1, entity: "data/entities/animals/worm_big.xml" },
    { prob: 0.01, min_count: 1, max_count: 1, entity: "data/entities/animals/worm.xml" },
    { prob: 0.2, min_count: 1, max_count: 1, entity: "data/entities/animals/wizard_hearty.xml" },
    { prob: 0.05, min_count: 1, max_count: 1, entity: "data/entities/buildings/hpcrystal.xml" },
    {
      prob: 0.01,
      min_count: 1,
      max_count: 2,
      entity: "data/entities/animals/easter/sniper.xml",
      spawn_check: "TODO: FunctionDeclaration",
    },
    { prob: 0.2, min_count: 1, max_count: 1, entity: "data/entities/animals/bloodcrystal_physics.xml" },
    { prob: 0.1, min_count: 1, max_count: 1, entity: "data/entities/animals/necrobot.xml" },
    { prob: 0.06, min_count: 1, max_count: 1, ngpluslevel: 1, entity: "data/entities/animals/necrobot_super.xml" },
    { prob: 0.1, min_count: 1, max_count: 1, entity: "data/entities/animals/failed_alchemist.xml" },
  ];
  g_unique_enemy = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    { prob: 0.1, min_count: 1, max_count: 1, entity: "data/entities/animals/wizard_tele.xml" },
    { prob: 0.1, min_count: 1, max_count: 1, entity: "data/entities/animals/wizard_dark.xml" },
    { prob: 0.07, min_count: 1, max_count: 1, entity: "data/entities/animals/wizard_swapper.xml" },
    { prob: 0.1, min_count: 1, max_count: 1, entity: "data/entities/animals/necromancer.xml" },
  ];
  g_unique_enemy2 = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    { prob: 0.5, min_count: 3, max_count: 4, entity: "data/entities/animals/sniper_hell.xml" },
  ];
  g_items = [
    { prob: 0, min_count: 0, max_count: 0, entity: "" },
    { prob: 5, min_count: 1, max_count: 1, entity: "data/entities/items/wand_level_03.xml" },
    { prob: 5, min_count: 1, max_count: 1, entity: "data/entities/items/wand_level_04.xml" },
    { prob: 5, min_count: 1, max_count: 1, entity: "data/entities/items/wand_unshuffle_02.xml" },
    { prob: 5, min_count: 1, max_count: 1, entity: "data/entities/items/wand_unshuffle_03.xml" },
  ];
  g_lamp = [
    { prob: 0.4, min_count: 1, max_count: 1, entity: "" },
    { prob: 0.7, min_count: 1, max_count: 1, entity: "data/entities/props/physics_lantern_small.xml" },
  ];
  g_props = [
    { prob: 0.15, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    { prob: 0.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_box_explosive.xml" },
    { prob: 0.2, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_propane_tank.xml" },
    { prob: 0.3, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_barrel_oil.xml" },
    {
      prob: 0.05,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_trap_electricity_enabled.xml",
    },
  ];
  g_skulls = [
    { prob: 1.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_skull_01.xml" },
    { prob: 1.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_skull_02.xml" },
    { prob: 1.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_skull_03.xml" },
    { prob: 0.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_bone_01.xml" },
    { prob: 0.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_bone_02.xml" },
    { prob: 0.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_bone_03.xml" },
    { prob: 0.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_bone_04.xml" },
    { prob: 0.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_bone_05.xml" },
    { prob: 0.5, min_count: 1, max_count: 1, offset_y: 0, entity: "data/entities/props/physics_bone_06.xml" },
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
    { prob: 0.33, min_count: 1, max_count: 1, entity: "data/entities/props/physics_candle_1.xml" },
    { prob: 0.33, min_count: 1, max_count: 1, entity: "data/entities/props/physics_candle_2.xml" },
    { prob: 0.33, min_count: 1, max_count: 1, entity: "data/entities/props/physics_candle_3.xml" },
  ];

  async spawn_small_enemies(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_big_enemies(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_items(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_props(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_props2(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_props3(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_lamp(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async load_pixel_scene(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async load_pixel_scene2(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_unique_enemy(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_unique_enemy2(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_unique_enemy3(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_ghostlamp(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_candles(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_potion_altar(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_potions(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_apparition(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_heart(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_wands(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_portal(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_end_portal(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_orb(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_perk(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_all_perks(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_wand_trap(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_wand_trap_ignite(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_wand_trap_electricity_source(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_wand_trap_electricity(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_moon(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_collapse(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async init(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_skulls(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  async spawn_cyst(x: number, y: number) {
    console.error(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
}
export default Meat;
