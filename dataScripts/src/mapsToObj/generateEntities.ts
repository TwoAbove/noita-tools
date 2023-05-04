import fs from "fs";
import util from "util";
import path from "path";
import Jimp from "jimp";
import _ from "lodash";
import { parseStringPromise } from "xml2js";

const recursiveReaddir = require("recursive-readdir");
const DOMParser = require("xmldom").DOMParser;

// https://github.com/Dadido3/noita-mapcap

const argbTorgba = (s: string) =>
  s
    .replace("0x", "")
    .replace(/(..)(......)/, "$2$1")
    .toLowerCase();

const noitaData = path.resolve(
  require("os").homedir(),
  ".steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/"
);

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
    })
  );

const tryRead = (path: string, fallback?: string) => {
  try {
    return fs.readFileSync(path);
  } catch (e) {
    if (fallback || fallback === "") {
      return fallback;
    }
    throw e;
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

  const parseSprite = async (p: string) => {
    if (!p.endsWith("xml")) {
      return;
    }
    try {
      const spriteData = (await spriteMemo(p, () => parseStringPromise(tryRead(path.resolve(noitaData, p), ""))))
        .Sprite;

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

  const entityMemo = memo({});

  const parseEntity = async (entityData: any): Promise<any> => {
    let entity: any = {};
    let baseEntity: any = {};

    if (entityData.Base) {
      for (const B of entityData.Base) {
        console.log(`	${B.$.file}`);
        const seb = (
          await entityMemo(B.$.file, () => parseStringPromise(tryRead(path.resolve(noitaData, B.$.file), "")))
        ).Entity;
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

  const files = await recursiveReaddir(path.resolve(noitaData, "data/entities"), ["*.png", "*.lua", "*.txt"]);

  for (let val of files) {
    val = val.substring(noitaData.length + 1);

    if (entities[val]) {
      // Already parsed this entity
      return;
    }
    console.log(val);
    const entityXMLPath = path.resolve(noitaData, val);
    if (fs.existsSync(entityXMLPath)) {
      const entityData = await entityMemo(val, () => parseStringPromise(tryRead(entityXMLPath, "")));
      const entity = await parseEntity(entityData.Entity || entityData.Sprite);
      entities[val] = entity;
    }
  }
  return entities;
};

export default generateEntities;
