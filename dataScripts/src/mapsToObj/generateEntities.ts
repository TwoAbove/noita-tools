import { existsSync } from "fs";
import util from "util";
import path from "path";
import Jimp from "jimp";
import _ from "lodash";
import { parseStringPromise } from "xml2js";

import cliProgress from "cli-progress";

import recursiveReaddir from "recursive-readdir";

import { fileURLToPath } from "url";
import { getCleanedFile } from "../helpers/cleanFiles";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://github.com/Dadido3/noita-mapcap

const argbTorgba = (s: string) =>
  s
    .replace("0x", "")
    .replace(/(..)(......)/, "$2$1")
    .toLowerCase();

const noitaData = path.resolve(__dirname, "../../noita-data/");

const getJimp = (p: string) => Jimp.read(path.resolve(noitaData, p));

const getBase64 = (p: string) =>
  new Promise<{ src: string; width: number; height: number }>((res, rej) =>
    Jimp.read(p, (err, image) => {
      if (err) {
        return rej(err);
      }

      image.autocrop().getBase64(Jimp.MIME_PNG, (err, src) => {
        if (err) {
          return rej(err);
        }
        res({
          src,
          width: image.getWidth(),
          height: image.getHeight(),
        });
      });
    }),
  );

const tryGetXML = async (xml: string | Buffer) => {
  try {
    return parseStringPromise(xml);
  } catch (e) {
    console.error(`Could not parse XML:`, e);
    return {};
  }
};

const generateEntities = async () => {
  function memo(cache: any) {
    return async (key: string, fn: (...args: any[]) => Promise<any>) => {
      if (cache[key]) {
        return cache[key];
      }
      cache[key] = await fn();
      return cache[key];
    };
  }

  const spriteMemo = memo({});
  const entityMemo = memo({});

  const iterate = async (obj: any, fn: (obj: any, key: string, val: any) => Promise<void>) => {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        await iterate(obj[key], fn);
      }
      await fn(obj, key, obj[key]);
    }
  };

  const tryNumber = (n: string) => {
    if (n === "") {
      return n;
    }
    return isNaN(Number(n)) ? n : Number(n);
  };

  const parseObj = (obj: any) => {
    if (!obj) {
      return {};
    }
    const res: any = {};
    for (const key of Object.keys(obj)) {
      res[key] = tryNumber(obj[key]);
    }
    return res;
  };

  const parseTag = (obj: any, key: string) => {
    if (obj[key]) {
      if (obj[key].includes && obj[key].includes(",")) {
        obj[key] = obj[key].split(",");
      } else {
        obj[key] = [obj[key]];
      }
    }
  };

  const parsePhysics = async (entityData: any): Promise<IVisualData> => {
    const img = await getJimp(entityData.PhysicsImageShapeComponent[0].$.image_file);

    return {
      default: "default",
      config: entityData.PhysicsImageShapeComponent[0].$,
      actions: {
        default: {
          src: [await img.getBase64Async(Jimp.MIME_PNG)],
          config: {
            static: true,
          },
        },
      },
    };
  };

  const parsePhysicsComponent = async (entityData: any): Promise<IVisualData> => {
    return parsePhysics(entityData);
  };

  const parsePixelSprite = async (entityData: any): Promise<IVisualData> => {
    const img = await getJimp(entityData.PixelSpriteComponent[0].$.image_file);
    return {
      default: "default",
      actions: {
        default: {
          src: [await img.getBase64Async(Jimp.MIME_PNG)],
          config: {
            static: true,
          },
        },
      },
    };
  };

  const parsePixelSpriteComponent = async (entityData: any): Promise<IVisualData> => {
    return parsePixelSprite(entityData);
  };

  const parseItemComponent = async (entityData: any): Promise<IVisualData> => {
    const img = await getJimp(entityData.ItemComponent[0].$.ui_sprite);

    return {
      default: "default",
      actions: {
        default: {
          src: [await img.getBase64Async(Jimp.MIME_PNG)],
          config: {
            static: true,
          },
        },
      },
    };
  };

  const parseAnimationsArray = async (breakdowns: FrameBreakdown[]): Promise<IVisualData> => {
    // console.log(util.inspect(breakdowns, undefined, 4, true));
    const default_animations = _.uniq(
      breakdowns.reduce<string[]>((c, r) => {
        c.push(r.config.default_animation);
        return c;
      }, []),
    );

    if (default_animations.length > 1) {
      // console.log(breakdowns);
    }

    const out: IVisualData = {
      default: default_animations[0],
      actions: {},
    };

    const actionKeys = _.union(breakdowns.flatMap(b => Object.keys(b.actions)));
    for (const actionKey of actionKeys) {
      const actions = breakdowns.flatMap(b => b.actions[actionKey]).filter(Boolean);
      // Assuming all configs are the same
      const { frame_count, frame_wait } = actions[0].config;
      out.actions[actionKey] = {
        config: {
          frame_count,
          frame_wait,
        },
        src: [],
      };
      for (let i = 0; i < frame_count; i++) {
        const frame = actions.reduce<Jimp>(
          (c, r) => {
            if (r.frames[i]) {
              return c.composite(r.frames[i], 0, 0);
            }
            return c;
          },
          new Jimp(actions[0].config.frame_width, actions[0].config.frame_height),
        );
        out.actions[actionKey].src.push(await frame.getBase64Async(Jimp.MIME_PNG));
      }
    }
    return out;
  };
  const parsePNGSpriteComponent = async (entityData: any): Promise<IVisualData> => {
    let path: string = entityData.SpriteComponent[0].$.image_file;
    if (path.startsWith("data/temp")) {
      // don't handle this
      return {
        default: "",
        actions: {},
      };
    }
    const range = /\$\[(\d*)-(\d)\]/;
    const r = range.exec(path);
    if (r) {
      // just get one from the range
      const number = r[1];
      path = path.replace(range, number);
    }
    path = path.toLocaleLowerCase();

    const img = await getJimp(path);

    return {
      default: "default",
      config: entityData.SpriteComponent[0].$,
      actions: {
        default: {
          src: [await img.getBase64Async(Jimp.MIME_PNG)],
          config: {
            static: true,
          },
        },
      },
    };
  };
  const parseXMLSpriteComponent = async (entityData: any): Promise<IVisualData> => {
    const out: IVisualData = { default: "", actions: {} };

    let composite;
    let breakdowns: FrameBreakdown[] = [];

    for (const Sprite of entityData.SpriteComponent) {
      const uiElements = ["health_bar", "ui", "aiming_reticle"];
      if (_.intersection(Sprite.$._tags, uiElements).length) {
        continue;
      }
      const player_elements = [
        "lukki_enable",
        "player_amulet",
        "player_amulet_gem",
        "player_hat",
        "player_hat2",
        "player_hat2_shadow",
      ];
      if (_.intersection(Sprite.$._tags, player_elements).length) {
        continue;
      }
      const other = ["driver"];
      if (_.intersection(Sprite.$._tags, other).length) {
        continue;
      }
      // TODO: handle emissive and additive
      if (Sprite.$.emissive || Sprite.$.additive) {
        continue;
      }
      if (!Sprite.$.image_file) {
        continue;
      }
      if (Sprite.$._enabled === "0" || Sprite.$._enabled === 0) {
        continue;
      }
      if (!Sprite.$.image_file.endsWith(".xml")) {
        // TODO: Handle mixed content
        continue;
      }
      const spriteData = await spriteMemo(Sprite.$.image_file, () =>
        tryGetXML(getCleanedFile(path.resolve(noitaData, Sprite.$.image_file), "")),
      );
      if (!spriteData) {
        continue;
      }
      breakdowns.push(await makeBreakdown(spriteData));
    }
    if (breakdowns.length === 1) {
      return parseAnimations(breakdowns[0]);
    }

    if (breakdowns.length > 1) {
      return parseAnimationsArray(breakdowns);
    }

    return out;
  };

  const parseSpriteComponent = async (entityData: any): Promise<IVisualData> => {
    // Looking through lots of SpriteComponents,
    // it's either animations (.xml) or static images (.png)
    // There are weird multi-component entities like worms
    // that I couldn't figure out how they combine the sprite components
    // to make the worm. They are currently not supported.
    if (!entityData.SpriteComponent[0].$.image_file) {
      return {
        default: "",
        actions: {},
      };
    }

    const isPng = entityData.SpriteComponent[0].$.image_file.endsWith(".png");

    if (isPng) {
      return parsePNGSpriteComponent(entityData);
    }
    return parseXMLSpriteComponent(entityData);
  };

  const cut = (image: Jimp, x: any, y: any, w: any, h: any) => {
    try {
      return image.clone().crop(x, y, w, h);
    } catch (e) {
      return new Jimp(w, h, 0x00000000);
    }
  };

  interface IVisualData {
    default: string;
    config?: any;
    actions: {
      [action: string]: { src: string[]; config: any };
    };
  }

  interface FrameBreakdown {
    config: any;
    just_png?: boolean;
    actions: {
      [action: string]: { config: any; frames: Jimp[] };
    };
  }
  const makeBreakdown = async (spriteData: any): Promise<FrameBreakdown> => {
    const out: FrameBreakdown = {
      config: parseObj(spriteData.Sprite.$),
      actions: {},
    };

    const { filename, offset_x, offset_y, default_animation } = spriteData.Sprite.$;

    const img = await getJimp(filename);

    if (!spriteData.Sprite.RectAnimation) {
      // No animations, so just save the image?
      // ex: data/buildings_gfx/arrowtrap_left.xml
      out.just_png = true;
      out.config.default_animation = "default";
      out.actions = {
        default: {
          config: {},
          frames: [await getJimp(spriteData.Sprite.$.filename)],
        },
      };
      return out;
    }

    for (const Rect of spriteData.Sprite.RectAnimation) {
      const config = parseObj(Rect.$);
      // console.log(Rect);
      if (!config.frame_count) {
        continue;
      }

      const frames: Jimp[] = [];

      for (let i = 0; i < config.frame_count; i++) {
        const f = cut(
          img,
          config.pos_x + config.frame_width * i,
          config.pos_y,
          config.frame_width,
          config.frame_height,
        );
        frames.push(f);
      }

      out.actions[config.name] = { config, frames };
    }

    return out;
  };

  const parseAnimations = async (breakdown: any): Promise<IVisualData> => {
    const out: IVisualData = {
      default: breakdown.config.default_animation,
      actions: {},
    };

    if (breakdown.just_png) {
    }

    for (const key of Object.keys(breakdown.actions).filter(k => k !== "config")) {
      const { frames, config } = breakdown.actions[key];
      const {
        frame_count,
        frame_height,
        frame_wait,
        frame_width,
        frames_per_row,
        name,
        pos_x,
        pos_y,
        shrink_by_one_pixel,
      } = config;

      if (!frame_count) {
        continue;
      }
      out.actions[name] = {
        config: {
          frame_count,
          frame_wait,
        },
        src: [],
      };
      for (const frame of frames) {
        out.actions[name].src.push(await frame.getBase64Async(Jimp.MIME_PNG));
      }
    }
    return out;
  };

  const parseSprite = async (p: string) => {
    if (!p.endsWith("xml")) {
      return;
    }
    try {
      const spriteData = (await spriteMemo(p, () => tryGetXML(getCleanedFile(path.resolve(noitaData, p), "")))).Sprite;

      const sprite = parseObj(spriteData.$);
      if (spriteData.RectAnimation) {
        sprite.animations = spriteData.RectAnimation.map((R: any) => {
          // Save only the "default" animation;
          const animation = R.$;
          if (animation.name === sprite.default_animation) {
            const a = parseObj(animation);
            return a;
          }
          return false;
        }).filter(Boolean);
      }

      if (sprite.filename) {
        sprite.filename = await getBase64(path.resolve(noitaData, sprite.filename));
      }
      return sprite;
    } catch (e) {
      return "";
    }
  };

  const parseEntity = async (entityData: any): Promise<any> => {
    let entity: any = {};
    let baseEntity: any = {};

    if (entityData.Base) {
      for (const B of entityData.Base) {
        // console.log(`	${B.$.file}`);
        const seb = (await entityMemo(B.$.file, () => tryGetXML(getCleanedFile(path.resolve(noitaData, B.$.file), ""))))
          .Entity;
        const subEntityBase = await parseEntity(seb);
        const subEntityChildren = await parseEntity(B);
        baseEntity = _.assign(baseEntity, subEntityBase, subEntityChildren);
      }
    }

    entity = parseObj(entityData.$);
    if (entity.tags) {
      parseTag(entity, "tags");
    }

    if (entityData.ItemChestComponent) {
      entity.chestComponent = parseObj(entityData.ItemChestComponent[0].$);
    }

    if (entityData.DamageModelComponent) {
      entity.damageModelComponent = parseObj(entityData.DamageModelComponent[0].$);
      parseTag(entity.damageModelComponent, "materials_that_damage");
      parseTag(entity.damageModelComponent, "materials_how_much_damage");
    }

    if (entityData.PhysicsImageShapeComponent) {
      const physicsImage = parseObj(entityData.PhysicsImageShapeComponent[0].$);
      if (physicsImage.image_file) {
        const s = await getBase64(path.resolve(noitaData, physicsImage.image_file));
        physicsImage.image = s;
      }
      if (physicsImage._tags) {
        parseTag(physicsImage, "_tags");
      }
      entity.physicsImage = physicsImage;
    }

    let animations;
    // Use "enabled_in_hand" tagged assets only
    // Hack: all gold have an ItemComponent, but it's the same.
    // Also, fortunately, all of their ui_description is unique
    if (
      entityData.ItemComponent &&
      entityData.ItemComponent[0].ui_sprite &&
      entityData.ItemComponent[0].ui_description !== "Lorem ipsum"
    ) {
      animations = await parseItemComponent(entityData);
    } else if (entityData.SpriteComponent) {
      animations = await parseSpriteComponent(entityData);
    } else if (entityData.PixelSpriteComponent) {
      animations = await parsePixelSpriteComponent(entityData);
    } else if (entityData.PhysicsImageShapeComponent && entityData.PhysicsImageShapeComponent[0].image_file) {
      animations = await parsePhysicsComponent(entityData);
    } else {
      animations = null;
    }
    if (animations) {
      entity.animations = animations;
    }

    if (entityData.ItemComponent) {
      const itemImage = parseObj(entityData.ItemComponent[0].$);
      if (itemImage.ui_sprite) {
        const s = await getBase64(path.resolve(noitaData, itemImage.ui_sprite));
        itemImage.image = s;
      }
      if (itemImage._tags) {
        parseTag(itemImage, "_tags");
      }
      entity.itemImage = itemImage;
    }

    if (entityData.SpriteComponent) {
      const sprite = parseObj(entityData.SpriteComponent[0].$);
      if (sprite.image_file) {
        let s = await parseSprite(sprite.image_file);
        try {
          if (!s) {
            s = await getBase64(path.resolve(noitaData, sprite.image_file));
          }
        } catch (e) {}
        sprite.image = s;
      }
      if (sprite._tags) {
        parseTag(sprite, "_tags");
      }
      entity.sprite = sprite;
    }

    if (entityData.Sprite) {
      entity.animations = await parseAnimations(await makeBreakdown(entityData));
    }

    const res = {
      ..._.assign({}, baseEntity, entity),
      tags: _.merge([], baseEntity.tags, entity.tags),
    };
    if (entity.sprite && entity.sprite.additive) {
      res.sprite = _.flattenDeep([baseEntity.sprite, entity.sprite]);
    }

    return res;
  };

  const entities: any = {};

  const files = await recursiveReaddir(path.resolve(noitaData, "data/entities"), ["*.png", "*.lua", "*.txt", "*.psd"]);

  let i = 0;
  let total = files.length;

  const progress = new cliProgress.SingleBar({ clearOnComplete: false }, cliProgress.Presets.shades_classic);
  progress.start(total, 0);

  for (let val of files) {
    progress.increment();
    val = val.substring(noitaData.length + 1);
    if (val.includes("_debug") || val.includes("debug_")) {
      // Skip debug entities
      continue;
    }
    if (val.includes("_workdir")) {
      // Skip debug entities
      continue;
    }
    if (
      [
        "data/entities/props/_test_physics_heavy.xml",
        "data/entities/props/_test_physics_heavy.xml",
        "data/entities/props/_test_physics_heavy.xml",
      ].includes(val)
    ) {
      continue;
    }
    if (entities[val]) {
      // Already parsed this entity
      continue;
    }
    // console.log(`${i++}/${total}: ${val}`);
    const entityXMLPath = path.resolve(noitaData, val);
    // console.log(entityXMLPath);
    if (existsSync(entityXMLPath)) {
      const entityData = await entityMemo(val, () => tryGetXML(getCleanedFile(entityXMLPath, "")));
      if (!entityData) {
        continue;
      }
      let entity;
      entity = await parseEntity(entityData.Entity || entityData.Sprite);
      entities[val] = entity;
    }
  }
  progress.stop();
  return entities;
};

export default generateEntities;
