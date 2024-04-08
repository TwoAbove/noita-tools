import { loadImageActions } from "../../../../imageActions";

import { IRule } from "../../IRule";
import { InfoProvider } from "../Base";

import MapImplementations from "./MapImplementations";
import { IRandom } from "../../../random";
import { generatePoints } from "../../../../helpers";
import { IImageActions } from "../../../../imageActions/IImageActions";
import { MapHandler } from "../../../random/random";

export interface Interest {
  item: string;
  gx: number;
  gy: number;
  type: InterestType;

  s?: number;
  extra?: any;
}

export enum InterestType {
  Wang,
  PixelScene,
  Pixel,
  Interest,
}

const mapDataPromise = import("../../../data/obj/maps.json")
  .then(m => m.default)
  .then(mapData => {
    return Object.values(mapData).reduce((c, v: any) => {
      const color = parseInt(v.color, 16);
      if (v.config && v.config.spawnFunctions) {
        const sf = Object.entries<string>(v.config.spawnFunctions).reduce((cc, [kk, vv]) => {
          const color = parseInt(kk, 16);
          cc.set(color, vv);
          return cc;
        }, new Map<number, string>());
        v.config.spawnFunctions = sf;
      }
      c.set(color, v);
      return c;
    }, new Map<number, any>());
  });

const biomeImplPromise = import("../../../data/obj/biome_impl.json").then(i => i.default);

const isPurple = (c: number) => c === 0x7f007fff;

export class MapInfoProvider extends InfoProvider {
  maps;
  biomeImpls;

  mapHandlerCache = new Map<string, MapHandler>();
  imageCache = new Map<string, ImageData>();
  rawMapCache = new Map<string, ImageData>();
  mapCache = new Map<string, OffscreenCanvas>();
  mapMainPathCache = new Map<string, ImageData>();
  interestPointsCache = new Map<string, ReturnType<MapInfoProvider["getInterestPoints"]>>();
  seed?: number;

  imageActions!: IImageActions;

  worldMap!: ImageData;

  worldMapPromise: Promise<any>;
  biomeImplPromise: Promise<any>;
  loadImageActionsPromise: Promise<any>;

  constructor(randoms: IRandom) {
    super(randoms);

    this.loadImageActionsPromise = this.loadImageActions();

    this.worldMapPromise = this.loadWorldMap();

    mapDataPromise.then(_maps => {
      this.maps = _maps;
    });

    this.biomeImplPromise = biomeImplPromise.then(_biomeImpls => {
      this.biomeImpls = _biomeImpls;
    });
  }

  wang_maps: { [color: number]: ImageData } = {};

  async ready() {
    return Promise.allSettled([
      this.loadImageActionsPromise,
      this.worldMapPromise,
      this.biomeImplPromise,
      mapDataPromise,
    ]).then(() => {});
  }

  async loadImageActions() {
    return loadImageActions()
      .then(ia => {
        this.imageActions = ia;
      })
      .catch(e => console.error(e));
  }

  async loadWorldMap() {
    await this.loadImageActionsPromise;
    return this.imageActions
      .imageFromBase64(
        "data:image/png;base64,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",
      )
      .then(map => {
        this.worldMap = map;
      })
      .catch(e => console.error(e));
  }

  getMapChunk = (map: OffscreenCanvas, _x: number, _y: number, width: number, height: number) => {
    // return map;
    const tiles_w = map.width / width;
    const tiles_h = map.height / height;

    const x = _x % tiles_w;
    const y = _y % tiles_h;
    return this.imageActions.getPixels(this.imageActions.crop(map, x * width, y * height, width, height));
  };

  inOtherBiome = (color: number, gx: number, gy: number): boolean => {
    const res = this.randoms.GetTilePos(gx, gy);
    const px = res.get(0);
    const py = res.get(1);
    const mapColor = this.imageActions.getColor(this.worldMap, px, py);
    return color !== mapColor;
  };

  inMainPath = (map: ImageData, px: number, py: number, step: number): boolean => {
    return (
      isPurple(this.imageActions.getColor(map, px - 1, py)) ||
      isPurple(this.imageActions.getColor(map, px, py - 1)) ||
      isPurple(this.imageActions.getColor(map, px + step, py)) ||
      isPurple(this.imageActions.getColor(map, px, py + step)) ||
      isPurple(this.imageActions.getColor(map, px - 1, py - 1)) ||
      isPurple(this.imageActions.getColor(map, px + step, py - 1)) ||
      isPurple(this.imageActions.getColor(map, px - 1, py + step)) ||
      isPurple(this.imageActions.getColor(map, px + step, py + step))
    );
  };

  getArea(x: number, y: number, color: number) {
    const mapData = this.maps.get(color);
    const areas = mapData.areas || [];
    const areaIndex = areas.findIndex(a => a.x1 <= x && a.x2 >= x && a.y1 <= y && a.y2 >= y);
    return areas[areaIndex];
  }

  // NYI
  // getPathMap(x: number, y: number, color: number) {
  // 	const area = this.getArea(x, y, color);
  // 	const cacheKey = `${color} ${area.x1} ${area.y1}`;

  // 	if (this.mapMainPathCache.has(cacheKey)) {
  // 		return this.mapMainPathCache.get(cacheKey);
  // 	}

  // 	const map = this.getMap(x, y, color);
  // 	if (!map) {
  // 		return;
  // 	}

  // 	const pathMap = this.imageActions.GetPathMap(
  // 		this.randoms,
  // 		map,
  // 		map.width,
  // 		map.height,
  // 		x,
  // 		y
  // 	);
  // 	const pathMapScaled = this.imageActions.scaleImageData(pathMap, 10);
  // 	this.mapMainPathCache.set(cacheKey, pathMapScaled);
  // 	return pathMapScaled;
  // }

  getInterestPoints(mh: MapHandler, x: number, y: number, color: number, funcs?) {
    const points: Interest[] = [];
    const mapData = this.maps.get(color)!;
    const Implementation = MapImplementations[color.toString(16).padStart(8, "0")];
    if (!Implementation) {
      console.error(`No MapImplementation for ${color}`);
      return;
    }

    // const pathMap = this.getPathMap(x, y, color)!;

    const LoadPixelScene = (
      path: string,
      visual_file: string,
      gx: number,
      gy: number,
      background_file = "",
      skip_biome_checks = false,
      skip_edge_textures = false,
      color_to_material_table = {},
      background_z_index = 50,
    ) => {
      const impl = this.biomeImpls[path];
      if (!impl) {
        console.error(
          `${path} not in biomeImpls! Please add it to dataScripts/src/pixelScenes.ts and re-run generation.`,
        );
        return;
      }

      // if fits and doesn't encroach onto other biomes
      const r = gx + Math.floor(impl.w / 10) * 10;
      const b = gy + Math.floor(impl.h / 10) * 10;
      // TODO: handle LoadPixelScene where it draws outside of the chunks
      // ex: Holy Mountains and spawn_altar_top
      if (
        this.inOtherBiome(color, gx, gy) ||
        this.inOtherBiome(color, r, gy) ||
        this.inOtherBiome(color, gx, b) ||
        this.inOtherBiome(color, r, b)
      ) {
        return;
      }

      points.push({
        item: path,
        gx,
        gy,
        type: InterestType.PixelScene,
      });

      const ctmtptr = this.randoms.objToMapUIntUIntPtr(color_to_material_table);
      mh.drawImageData(path, this.biomeImpls[path].src, gx, gy, ctmtptr);
      // this.randoms.Module._free(ctmtptr);
      ctmtptr.delete();

      this.biomeImpls[path].f.forEach(({ x: dx, y: dy, c }) => {
        const funcName = mapData.config!.spawnFunctions.get(c);
        if (!funcName) {
          return;
        }

        // TODO: doing a second flood fill just for this seems
        // like too much. Maybe we can reuse it from the map gen?
        // const is_open_path = inMainPath(pathMap, gx + dx, gy + dy, 1);
        const is_open_path = false;

        points.push({
          item: funcName,
          gx: gx + dx,
          gy: gy + dy,
          type: InterestType.Pixel,
        });

        mapImplementation.handle(funcName, gx + dx, gy + dy, 1, 1, is_open_path);
      });
    };

    const HandleInterest = (item: string, gx: number, gy: number, extra?: any) => {
      const { px, py } = this.imageActions.getLocalPos(x, y, gx, gy);
      const res: Interest = {
        item,
        gx,
        gy,
        type: InterestType.Interest,
      };
      if (extra) {
        res.extra = extra;
      }
      points.push(res);
    };

    const BiomeMapGetVerticalPositionInsideBiome = (x: number, y: number) => {
      // This might not be accurate;
      const y0 = Math.floor(y / 512) * 512;
      const y1 = mh.height * 10;

      return (y - y0) / y1;
    };

    const RaytracePlatforms = (x1, y1, x2, y2): [boolean, number, number] => {
      console.error("TODO: RaytracePlatforms");
      return [true, x1, y1];
    };

    const mapImplementation = new Implementation(
      this.randoms,
      LoadPixelScene,
      HandleInterest,
      BiomeMapGetVerticalPositionInsideBiome,
      RaytracePlatforms,
      {
        funcs,
      },
    );
    try {
      const g = this.randoms.GetGlobalPos(x, y);
      mapImplementation.init(g.get(0), g.get(1), 512, 512);
      mh.iterateMap(x, y, (gx, gy, c) => {
        const funcName = mapData.config!.spawnFunctions.get(c);
        if (!funcName) {
          return 0;
        }
        // const { px, py } = this.imageActions.getLocalPos(x, y, gx, gy);
        // is_open_path is only used in the coalmine biome:
        // data/scripts/biomes/coalmine.lua
        // const is_open_path = inMainPath(pathMap, px, py, 10);
        // console.log(funcName, px, py, gx, gy, is_open_path);
        points.push({
          item: funcName,
          gx,
          gy,
          type: InterestType.Wang,
        });
        mapImplementation.handle(funcName, gx, gy, 10, 10, false);
        return 1;
      });
    } catch (e) {
      console.error("Iteration error: ");
      console.error(e);
    }

    return points;
  }

  getMapHandler(tx: number, ty: number) {
    const color = this.imageActions.getColor(this.worldMap, tx, ty);
    const area = this.getArea(tx, ty, color);
    const mapData = this.maps.get(color)!;

    const randomMaterials: number[][] = [];
    if (mapData.randomMaterials) {
      for (const from of Object.keys(mapData.randomMaterials)) {
        const fromInt = this.imageActions.hexRGBAtoIntRGB(from);
        const to = mapData.randomMaterials[from].map(this.imageActions.hexRGBAtoIntRGB);
        // To send a 1d array to c++
        const flat = [fromInt, to.length, ...to];
        randomMaterials.push(flat);
      }
    }
    const flatRandomMaterials = [randomMaterials.length, ...randomMaterials.flat()];
    const randomMaterialsPtr = this.randoms.Module._malloc(flatRandomMaterials.length * 4);
    const randomMatData = new Uint32Array(
      this.randoms.Module.HEAPU32.buffer,
      randomMaterialsPtr,
      flatRandomMaterials.length * 4,
    );
    randomMatData.set(flatRandomMaterials);

    const w = this.randoms.GetWidthFromPix(area.x1, area.x2 + 1);
    const h = this.randoms.GetWidthFromPix(area.y1, area.y2 + 1);

    const mh = new this.randoms.MapHandler(
      w,
      h,
      color,
      ["solid_wall_tower_1", "coalmine"].includes(mapData.name),
      ["solid_wall_tower_1", "solid_wall_tower_2", "coalmine", "excavationsite"].includes(mapData.name),
      randomMaterialsPtr,
      area.x1,
      area.y1,
    );

    const self = this;

    return Object.assign(mh, {
      release: function () {
        self.randoms.Module._free(randomMaterialsPtr);
        (this as any).delete();
      },
      getMapImageData: function () {
        const resImgData = self.imageActions.ImageData(w, h);
        resImgData.data.set(new Uint8ClampedArray(self.randoms.Module.HEAPU8.buffer, mh.map, 4 * w * h));
        return resImgData;
      },
      getBigMapImageData: function () {
        const areaMapToScaleID = self.imageActions.ImageData(w * 10, h * 10);
        areaMapToScaleID.data.set(
          new Uint8ClampedArray(self.randoms.Module.HEAPU8.buffer, mh.bigMap, 4 * w * h * 10 * 10),
        );
        return areaMapToScaleID;
      },
    });
  }

  provide(tx: number, ty: number, seed: number, funcs?) {
    if (this.seed !== seed) {
      this.seed = seed;
      this.clearCache();
    }

    const color = this.imageActions.getColor(this.worldMap, tx, ty);
    const area = this.getArea(tx, ty, color);
    const cacheKey = `${color} ${area.x1} ${area.y1}`;
    const map = this.mapCache.get(cacheKey);
    if (map) {
      return {
        map: this.getMapChunk(map, tx - area.x1, ty - area.y1, 512, 512),
        interestPoints: {
          points: this.interestPointsCache.get(cacheKey),
          area,
        },
      };
    }

    const mapData = this.maps.get(color)!;

    const mh = this.getMapHandler(tx, ty);

    mh.generate_map(mapData?.wang?.template_file || "");

    this.rawMapCache.set(cacheKey, mh.getMapImageData());

    mh.toBig();

    const interestPoints: Interest[] = [];
    for (const [x, y] of generatePoints(area.x1, area.x2, area.y1, area.y2)) {
      const points = this.getInterestPoints(mh, x, y, color, funcs);
      if (!points) {
        continue;
      }
      interestPoints.push(...points);
    }

    const areaMapToScale = this.imageActions.copyImage(mh.getBigMapImageData());

    this.mapCache.set(cacheKey, areaMapToScale);
    this.interestPointsCache.set(cacheKey, interestPoints);

    const res = {
      interestPoints: { points: interestPoints, area },
      map: this.getMapChunk(areaMapToScale, tx - area.x1, ty - area.y1, 512, 512),
    };

    mh.release();
    return res;
  }

  clearCache() {
    this.mapHandlerCache = new Map();
    this.rawMapCache = new Map();
    this.mapCache = new Map();
    this.mapMainPathCache = new Map();
    this.interestPointsCache = new Map();
  }

  test(rule: IRule): boolean {
    this.clearCache();
    // Do two passes - First for all functions, then for all searches
    // initialize handlers before the test for proper memory management

    const mapHandlers: {
      [key: string]: ReturnType<MapInfoProvider["getMapHandler"]>;
    } = {};

    const search = () => {
      const configs = rule.val;
      for (const key in configs) {
        const config = configs[key];
        const { x, y } = config.pos;
        const color = this.imageActions.getColor(this.worldMap, x, y);
        const mapData = this.maps.get(color)!;
        const set = new Set<string>(config.funcs);

        const mh = this.getMapHandler(x, y);
        mh.generate_map(mapData.wang.template_file);
        mapHandlers[key] = mh;

        const found = mh.somePixels(mh.map, mh.width, mh.height, 1, (px, py, c) => {
          if (set.size === 0) {
            // Found all of the needed funcs
            return true;
          }
          const funcName = mapData.config!.spawnFunctions.get(c);
          if (!funcName) {
            return false;
          }
          set.delete(funcName);
          return false;
        });

        if (!found) {
          return false;
        }
      }

      for (const key in configs) {
        const config = configs[key];
        const { x, y } = config.pos;
        const color = this.imageActions.getColor(this.worldMap, x, y);
        const mh = mapHandlers[key];
        mh.toBig();
        const interestPoints = this.getInterestPoints(mh, x, y, color, config.funcs)!;
        // const mapData = (await map.provide(x, y, seed.toString(), config.funcs))!;
        const method = config.searchType === "and" ? "every" : "some";
        const points = new Set(interestPoints.map(p => p.item));
        const check = (config.search as string[])[method](
          // These might be equal string values, but not equal "Strings"
          s => points.has(String(s)),
        );
        if (!check) {
          return false;
        }
      }
      // for (const key in configs) {
      // 	const areaMap = maps[key];
      // 	this.imageActions.printImage(areaMap);
      // }
      return true;
    };

    const found = search();
    for (const mh of Object.values(mapHandlers)) {
      mh.release();
    }

    return found;
  }
}

/* v1
from - 1
to - 1 000 000
coalmine: 33
excavationSite: 6149
snowCave: 12942
snowCastle: 37912
vault: 18253
*/

/* v2
from - 1
to - 5 000
coalmine, 87000, 370
excavationSite, 93000, 29
snowCave, 191000, 98
snowCastle, 99000, 1333
vault, 194000, 631
*/

/* v2
from - 1
to - 100 000
coalmine, 942357, 7057
excavationSite, 1063416, 583
snowCave, 2160684, 1988
snowCastle, 1104125, 25762
vault, 2252795, 11505
*/
