// data/scripts/biomes/excavationsite_cube_chamber.lua
import Base from "../Base";
class Excavationsitecubechamber extends Base {
  chestLevel = 3;
  g_items = [
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_level_03.xml",
    },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/items/wand_unshuffle_02.xml",
    },
  ];
  g_skulls = [
    { prob: 6, min_count: 1, max_count: 1, offset_y: 0, entity: "" },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_skull_01.xml",
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_skull_02.xml",
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_skull_03.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_bone_01.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_bone_02.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_bone_03.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_bone_04.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_bone_05.xml",
    },
    {
      prob: 0.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_bone_06.xml",
    },
  ];
  g_stones = [
    {
      prob: 2,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/stonepile.xml",
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_stone_01.xml",
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_stone_02.xml",
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_stone_03.xml",
    },
    {
      prob: 1.5,
      min_count: 1,
      max_count: 1,
      offset_y: 0,
      entity: "data/entities/props/physics_stone_04.xml",
    },
    { prob: 4, min_count: 1, max_count: 1, offset_y: 0, entity: "" },
  ];
  g_lamp = [
    { prob: 0.25, min_count: 1, max_count: 1, entity: "" },
    {
      prob: 1,
      min_count: 1,
      max_count: 1,
      entity: "data/entities/props/physics/temple_lantern.xml",
    },
  ];

  spawn_small_enemies(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_big_enemies(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_items(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_props3(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_lamp(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  load_pixel_scene2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_unique_enemy(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_unique_enemy2(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_unique_enemy3(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_ghostlamp(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_candles(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_potion_altar(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_potions(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_apparition(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_heart(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wands(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_portal(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_end_portal(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_orb(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_perk(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_all_perks(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap_ignite(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap_electricity_source(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_wand_trap_electricity(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_moon(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_collapse(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_skulls(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  init(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
  spawn_teleporter(x: number, y: number) {
    console.error(
      `$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`
    );
  }
}
export default Excavationsitecubechamber;
