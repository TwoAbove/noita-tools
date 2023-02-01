/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';

import dirTree from "directory-tree";

import {
  loadImage as skiaLoadImage,
  Canvas,
  Image,
  ImageData,
} from '@napi-rs/canvas';

import pixelmatch from 'pixelmatch';

import { InterestType, MapInfoProvider } from './index';
import { loadRandom } from '../../../../../testHelpers';

import { createCanvas, getContext } from '../../../../imageActions/nodeImageActions';
import { inspect } from 'util';

const tree = dirTree(path.resolve(__dirname, 'fixtures'));

const loadImage = async (p: string) => {
  const buf = fs.readFileSync(path.resolve(__dirname, p));
  const img = await skiaLoadImage(buf)
  const cv = new Canvas(img.width, img.height);
  const cx = cv.getContext('2d');
  cx.drawImage(img, 0, 0);

  return cv;
}

const save = (data: ImageData, folder: string, name: string) => {
  const resCV = createCanvas(data.width, data.height);
  const resCX = getContext(resCV);
  resCX.putImageData(data as any, 0, 0);
  const b = resCV.toBuffer('image/png');
  try {
    fs.mkdirSync(path.resolve(__dirname, 'test', folder));
  } catch (e) { }
  fs.writeFileSync(path.resolve(__dirname, 'test', folder, name), b);
}

const paramMap = {
  "clouds.png": {
    x: 53,
    y: 3
  },
  "coalmine.png": {
    x: 53,
    y: 31
  },
  "coalmine_alt.png": {
    x: 32,
    y: 15
  },
  "crypt.png": {
    x: 26,
    y: 36
  },
  "excavationsite.png": {
    x: 53,
    y: 30
  },
  "fungicave.png": {
    x: 34,
    y: 28
  },
  "fungiforest.png": {
    x: 59,
    y: 36
  },
  "liquidcave.png": {
    x: 28,
    y: 14
  },
  "pyramid.png": {
    x: 52,
    y: 12
  },
  "rainforest_dark.png": {
    x: 25,
    y: 26
  },
  "rainforest_open.png": {
    x: 30,
    y: 28
  },
  "rainforest.png": {
    x: 30,
    y: 27
  },
  "robobase.png": {
    x: 2,
    y: 47
  },
  "sandcave.png": {
    x: 2,
    y: 47
  },
  "snowcastle.png": {
    x: 53,
    y: 28
  },
  "snowcave.png": {
    x: 30,
    y: 20
  },
  "snowchasm.png": {
    x: 13,
    y: 15
  },
  "the_end.png": {
    x: 25,
    y: 43
  },
  "the_sky.png": {
    x: 27,
    y: 0
  },
  "vault_frozen.png": {
    x: 12,
    y: 15
  },
  "vault.png": {
    x: 32,
    y: 31
  },
  "wand.png": {
    x: 53,
    y: 39
  },
  "wizardcave.png": {
    x: 53,
    y: 40
  },
}

describe('#getMap', () => {
  describe('MapInfoProvider', () => {
    const tests = tree.children!.flatMap(d => {
      return d.children!.flatMap(m => {
        const params = paramMap[m.name];
        return ({
          seed: parseInt(d.name, 10),
          name: `${d.name} - ${m.name}`,
          params,
          ans: `fixtures/${d.name}/${m.name}`
        });
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
        const color = mapInfoProvider.imageActions.getColor(mapInfoProvider.worldMap, x, y);
        const map = mapInfoProvider.getMap(x, y, color)!;

        const ansCX = getContext(ans);
        const ansID = ansCX.getImageData(0, 0, ans.width, ans.height);
        save(map, i.toString(), 'map.png');

        const diff = new ImageData(map.width, map.height);

        const numDiffPixelsnumDiffPixels = pixelmatch(map.data, ansID.data, diff.data, ans.width, ans.height, { threshold: 0.01 });

        save(diff, i.toString(), 'diff.png');
        expect(numDiffPixelsnumDiffPixels).toEqual(0);
      }, 10000);
    });
  });

  describe('getInterestPoints', () => {

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
          { item: 'spawn_potion_altar', gx: 525, gy: 967, px: 1050, py: 980, type: InterestType.Wang },
          { item: 'spawn_potion_altar', gx: 1475, gy: 837, px: 2000, py: 850, type: InterestType.Wang },
          { item: 'spawn_potions', gx: 1480, gy: 833, px: 1995, py: 835, type: InterestType.Pixel },
        ]
      }
    ];

    tests.forEach((t, i) => {
      it(`Should generate interesting points at the correct positions #${i}`, () => {
        const { seed, points, x, y } = t;

        randoms.SetWorldSeed(t.seed);
        const res = mapInfoProvider.provide(x, y, seed.toString());

        expect(res);
        expect(res!.interestPoints.points).toEqual(expect.arrayContaining(points));
      });
    })
  })
});
