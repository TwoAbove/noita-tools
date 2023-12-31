import { beforeAll, beforeEach, describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

import dirTree from "directory-tree";

import { loadImage as skiaLoadImage, Canvas, Image, ImageData } from "@napi-rs/canvas";

import pixelmatch from "pixelmatch";

import { InterestType, MapInfoProvider } from "./index";
import { loadRandom } from "../../../../../testHelpers";

import { createCanvas, getContext } from "../../../../imageActions/nodeImageActions";
import { inspect } from "util";

const tree = dirTree(path.resolve(__dirname, "fixtures"));

const loadImage = async (p: string) => {
  const buf = fs.readFileSync(path.resolve(__dirname, p));
  const img = await skiaLoadImage(buf);
  const cv = new Canvas(img.width, img.height);
  const cx = cv.getContext("2d");
  cx.drawImage(img, 0, 0);

  return cv;
};

const save = (data: ImageData, folder: string, name: string) => {
  const resCV = createCanvas(data.width, data.height);
  const resCX = getContext(resCV);
  resCX.putImageData(data as any, 0, 0);
  const b = resCV.toBuffer("image/png");
  try {
    fs.mkdirSync(path.resolve(__dirname, "test", folder));
  } catch (e) {}
  fs.writeFileSync(path.resolve(__dirname, "test", folder, name), b);
};

const paramMap = {
  "clouds.png": {
    x: 53,
    y: 3,
  },
  "coalmine.png": {
    x: 53,
    y: 31,
  },
  "coalmine_alt.png": {
    x: 32,
    y: 15,
  },
  "crypt.png": {
    x: 26,
    y: 36,
  },
  "excavationsite.png": {
    x: 53,
    y: 30,
  },
  "fungicave.png": {
    x: 34,
    y: 28,
  },
  "fungiforest.png": {
    x: 59,
    y: 36,
  },
  "liquidcave.png": {
    x: 28,
    y: 14,
  },
  "pyramid.png": {
    x: 52,
    y: 12,
  },
  "rainforest_dark.png": {
    x: 25,
    y: 26,
  },
  "rainforest_open.png": {
    x: 30,
    y: 28,
  },
  "rainforest.png": {
    x: 30,
    y: 27,
  },
  "robobase.png": {
    x: 2,
    y: 47,
  },
  "sandcave.png": {
    x: 2,
    y: 47,
  },
  "snowcastle.png": {
    x: 53,
    y: 28,
  },
  "snowcave.png": {
    x: 30,
    y: 20,
  },
  "snowchasm.png": {
    x: 20,
    y: 16,
  },
  "the_end.png": {
    x: 32,
    y: 44,
  },
  "the_sky.png": {
    x: 27,
    y: 0,
  },
  "vault_frozen.png": {
    x: 12,
    y: 15,
  },
  "vault.png": {
    x: 32,
    y: 31,
  },
  "wand.png": {
    x: 53,
    y: 39,
  },
  "wizardcave.png": {
    x: 53,
    y: 40,
  },
};

describe("#getMap", () => {
  describe("MapInfoProvider", () => {
    const tests = tree.children!.flatMap(d => {
      return d.children!.flatMap(m => {
        const params = paramMap[m.name];
        return {
          seed: parseInt(d.name, 10),
          name: `${d.name} - ${m.name}`,
          params,
          ans: `fixtures/${d.name}/${m.name}`,
        };
      });
    });

    let randoms: Awaited<ReturnType<typeof loadRandom>>;
    let mapInfoProvider: MapInfoProvider;

    beforeAll(async () => {
      randoms = await loadRandom();
      mapInfoProvider = new MapInfoProvider(randoms);
      await mapInfoProvider.ready();
    });

    beforeEach(() => {
      mapInfoProvider.clearCache();
    });

    tests.forEach((t, i) => {
      it(`Should generate correct output - ${i} - ${t.name}`, async () => {
        const { x, y } = t.params;
        const ans = await loadImage(t.ans);

        randoms.SetWorldSeed(t.seed);
        const mh = mapInfoProvider.getMapHandler(x, y)!;

        const color = mapInfoProvider.imageActions.getColor(mapInfoProvider.worldMap, x, y);
        const mapData = mapInfoProvider.maps.get(color)!;

        mh.generate_map(mapData.wang.template_file);
        const map = mh.getMapImageData();

        const ansCX = getContext(ans);
        const ansID = ansCX.getImageData(0, 0, ans.width, ans.height);
        save(map, i.toString(), "map.png");

        const diff = new ImageData(map.width, map.height);

        if (map.width !== ansID.width || map.height !== ansID.height) {
          console.log({
            name: i,
            mapWidth: map.width,
            ansWidth: ansID.width,
            mapHeight: map.height,
            ansHeight: ansID.height,
          });
        }

        const numDiffPixelsnumDiffPixels = pixelmatch(map.data, ansID.data, diff.data, ans.width, ans.height, {
          threshold: 0.0038,
        });

        save(diff, i.toString(), "diff.png");
        expect(numDiffPixelsnumDiffPixels).toEqual(0);
      }, 10000);
    });
  });

  describe("iterateMap", () => {
    let randoms: Awaited<ReturnType<typeof loadRandom>>;
    let mapInfoProvider: MapInfoProvider;

    beforeAll(async () => {
      randoms = await loadRandom();
      mapInfoProvider = new MapInfoProvider(randoms);
      await mapInfoProvider.ready();
    });

    beforeEach(() => {
      mapInfoProvider.clearCache();
    });

    const tests = [
      {
        seed: 1674055821,
        x: 36,
        y: 14,
        points: [
          {
            item: "spawn_potion_altar",
            gx: 525,
            gy: 967,
            type: InterestType.Wang,
          },
          {
            item: "spawn_potion_altar",
            gx: 1475,
            gy: 837,
            type: InterestType.Wang,
          },
        ],
      },
      {
        seed: 299840293,
        x: 34,
        y: 17,
        points: [
          {
            item: "spawn_tower_short",
            gx: 425,
            gy: 1607,
            type: InterestType.Wang,
          },
          {
            item: "spawn_tower_short",
            gx: -1855,
            gy: 2407,
            type: InterestType.Wang,
          },
        ],
      },
      {
        seed: 299840293,
        x: 35,
        y: 24,
        points: [
          {
            item: "load_chamfer_top_r",
            gx: -1175,
            gy: 5247,
            type: InterestType.Wang,
          },
        ],
      },
      {
        seed: 299840293,
        x: 35,
        y: 29,
        points: [
          {
            item: "load_pixel_scene4",
            gx: -1495,
            gy: 8127,
            type: InterestType.Wang,
          },
        ],
      },
      {
        seed: 299840293,
        x: 34,
        y: 31,
        points: [
          {
            item: "load_pixel_scene_wide",
            gx: -2885,
            gy: 9657,
            type: InterestType.Wang,
          },
          {
            item: "load_pixel_scene_wide",
            gx: -1085,
            gy: 9057,
            type: InterestType.Wang,
          },
        ],
      },
    ];

    tests.forEach((t, i) => {
      it(`Should get RegisterSpawnFunction calls at correct positions #${i}`, () => {
        const { seed, points, x, y } = t;

        randoms.SetWorldSeed(t.seed);
        const res = mapInfoProvider.provide(x, y, seed);

        expect(res);
        const neededItems = points.reduce((c, r) => c.add(r.item), new Set());
        expect(res!.interestPoints!.points!.filter(p => neededItems.has(p.item)).sort((a, b) => a.gx - b.gx)).toEqual(
          expect.arrayContaining(points),
        );
      });
    });
  });

  describe("DrawImageData", () => {
    let randoms: Awaited<ReturnType<typeof loadRandom>>;
    let mapInfoProvider: MapInfoProvider;

    beforeAll(async () => {
      randoms = await loadRandom();
      mapInfoProvider = new MapInfoProvider(randoms);
      await mapInfoProvider.ready();
    });

    beforeEach(() => {
      mapInfoProvider.clearCache();
    });

    const tests = [
      {
        seed: 1674055821,
        x: 36,
        y: 14,
        points: [
          {
            item: "spawn_potions",
            gx: 1480,
            gy: 833,
            type: InterestType.Pixel,
          },
        ],
      },
      {
        seed: 299840293,
        x: 34,
        y: 17,
        points: [
          {
            item: "data/biome_impl/excavationsite/meditation_cube.png",
            gx: -1965,
            gy: 1768,
            type: InterestType.PixelScene,
          },
        ],
      },
      {
        seed: 299840293,
        x: 34,
        y: 24,
        points: [
          {
            item: "data/biome_impl/snowcastle/bar.png",
            gx: -1275,
            gy: 5327,
            type: InterestType.PixelScene,
          },
          {
            item: "data/biome_impl/wand_altar_vault.png",
            gx: -1310,
            gy: 5298,
            type: InterestType.PixelScene,
          },
        ],
      },
      {
        seed: 299840293,
        x: 29,
        y: 31,
        points: [
          {
            item: "data/biome_impl/vault/lab_puzzle.png",
            gx: -2285,
            gy: 9457,
            type: InterestType.PixelScene,
          },
        ],
      },
      {
        seed: 299840293,
        x: 34,
        y: 22,
        points: [
          {
            item: "data/biome_impl/snowcave/shop.png",
            gx: 295,
            gy: 3807,
            type: InterestType.PixelScene,
          },
          {
            item: "data/biome_impl/snowcave/puzzle_capsule.png",
            gx: 815,
            gy: 3937,
            type: InterestType.PixelScene,
          },
        ],
      },
      {
        seed: 299840293,
        x: 34,
        y: 32,
        points: [
          {
            item: "data/biome_impl/vault/shop.png",
            gx: -1085,
            gy: 9057,
            type: InterestType.PixelScene,
          },
          {
            item: "spawn_shopitem",
            gx: -888,
            gy: 9211,
            type: InterestType.Pixel,
          },
        ],
      },
    ];

    tests.forEach((t, i) => {
      it(`Should generate interesting points at the correct positions #${i}`, () => {
        const { seed, points, x, y } = t;

        randoms.SetWorldSeed(t.seed);
        const res = mapInfoProvider.provide(x, y, seed);

        expect(res);
        const neededItems = points.reduce((c, r) => c.add(r.item), new Set());
        expect(res!.interestPoints!.points!.filter(p => neededItems.has(p.item)).sort((a, b) => a.gx - b.gx)).toEqual(
          expect.arrayContaining(points),
        );
      });
    });
  });

  describe("mapHandler", () => {
    let randoms: Awaited<ReturnType<typeof loadRandom>>;
    let mapInfoProvider: MapInfoProvider;

    beforeAll(async () => {
      randoms = await loadRandom();
      mapInfoProvider = new MapInfoProvider(randoms);
      await mapInfoProvider.ready();
    });

    beforeEach(() => {
      mapInfoProvider.clearCache();
    });

    describe("somePixels", () => {
      it("Should iterate and return true", () => {
        const mh = mapInfoProvider.getMapHandler(35, 14);
        const found = mh.somePixels(mh.map, 1, 1, 1, (px, py, c) => {
          return false;
        });
        expect(found).toEqual(false);
      });

      it("Should iterate and return false", () => {
        const mh = mapInfoProvider.getMapHandler(35, 14);
        const found = mh.somePixels(mh.map, 1, 1, 1, (px, py, c) => {
          return true;
        });
        expect(found).toEqual(true);
      });
    });
  });
});
