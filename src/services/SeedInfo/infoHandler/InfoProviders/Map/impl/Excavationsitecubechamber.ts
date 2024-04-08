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

  spawn_small_enemies(x: number, y: number) {}
  spawn_big_enemies(x: number, y: number) {}
  spawn_shopitem(x: number, y: number) {
    this.warn(`$ TODO: AUTO_GEN not implemented for ${this.constructor.name}`);
  }
  spawn_props(x: number, y: number) {}
  spawn_lamp(x: number, y: number) {
    this.spawn(this.g_lamp, x, y, 0, 20);
  }
  load_pixel_scene(x: number, y: number) {}
  load_pixel_scene2(x: number, y: number) {}
  spawn_unique_enemy(x: number, y: number) {}
  spawn_skulls(x: number, y: number) {
    this.spawn(this.g_skulls, x, y, 0, 0);
  }
  init(x: number, y: number) {
    this.LoadPixelScene(
      "data/biome_impl/excavationsite/cube_chamber.png",
      "data/biome_impl/excavationsite/cube_chamber_visual.png",
      x,
      y,
      "data/biome_impl/excavationsite/cube_chamber_background.png",
      true,
    );
  }
  spawn_teleporter(x: number, y: number) {
    this.EntityLoad("data/entities/buildings/teleport_meditation_cube_return.xml", x, y);
  }
}
export default Excavationsitecubechamber;
