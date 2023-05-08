// data/scripts/biomes/mountain/mountain_left_entrance.lua
import Base from "../Base";
class Mountainleftentrance extends Base {
  chestLevel = 3;
  g_trees = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/tree_spruce_1.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/tree_spruce_2.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/tree_spruce_3.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/tree_spruce_4.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/tree_spruce_5.xml",
    },
  ];
  g_big_bushes = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/plant_bush_big_1.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/plant_bush_big_2.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/plant_bush_big_3.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/plant_bush_big_4.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/plant_bush_big_5.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/plant_bush_1.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/vegetation/plant_bush_2.xml",
    },
  ];
  g_vines = [
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine.xml",
    },
    {
      prob: 0.3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_long.xml",
    },
    { prob: 1.5, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_short.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/vines/verlet_vine_shorter.xml",
    },
  ];
  g_props = [
    { prob: 0.2, min_count: 0, max_count: 0, offset_y: 0, entity: "" },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_stone_01.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_stone_02.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_stone_03.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_stone_04.xml",
    },
  ];
  g_surprise = [
    { prob: 0.875, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.125,
      min_count: 1,
      max_count: 1,
      offset_x: -96,
      offset_y: 128,
      entity: "data/entities/props/physics_pata.xml",
      spawn_check: "TODO: FunctionDeclaration",
    },
  ];

  spawn_small_enemies(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_big_enemies(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_items(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_props(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_props2(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_props3(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_lamp(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  load_pixel_scene(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  load_pixel_scene2(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_unique_enemy(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_unique_enemy2(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_unique_enemy3(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_ghostlamp(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_candles(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_potion_altar(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_potions(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_apparition(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_heart(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wands(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_portal(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_end_portal(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_orb(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_perk(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_all_perks(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wand_trap(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wand_trap_ignite(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wand_trap_electricity_source(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wand_trap_electricity(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_moon(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_collapse(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  init(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_trees(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_big_bushes(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_vines(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wasd(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_wasd_trigger(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_mouse(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_mouse_trigger(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_grass(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_music_trigger(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_vines_b(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
}
export default Mountainleftentrance;
