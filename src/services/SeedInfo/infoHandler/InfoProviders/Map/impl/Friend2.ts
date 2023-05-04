// data/scripts/biomes/friend_2.lua
import Base from "../Base";
class Friend2 extends Base {
  chestLevel = 3;
  g_trees = [
    { prob: 1.5, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      offset_x: -10,
      offset_y: -113,
      entity: "data/entities/props/rainforest_tree_01.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_02.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_03.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_04.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_05.xml",
    },
    {
      prob: 0.4,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/rainforest_tree_06.xml",
    },
  ];
  g_vines = [
    { prob: 1.5, min_count: 1, max_count: 1, entity: "" },
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
    {
      prob: 3,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/verlet_chains/root/hanging_root_random.xml",
    },
  ];
  g_lamp = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics/lantern_small.xml",
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
  spawn_fruit(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_killer(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_friend(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_tree(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_vines(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
}
export default Friend2;
