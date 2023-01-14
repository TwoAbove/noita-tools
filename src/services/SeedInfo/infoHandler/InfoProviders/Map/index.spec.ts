/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';

import {
  loadImage as skiaLoadImage,
  Canvas,
  Image,
  ImageData,
} from 'skia-canvas';

import pixelmatch from 'pixelmatch';

import { MapInfoProvider } from './index';
import { loadRandom } from '../../../../../testHelpers';

import { createCanvas, getContext } from '../../../../imageActions/nodeImageActions';

const loadImage = async (p: string) => {
  const buf = fs.readFileSync(path.resolve(__dirname, p));
  const img = await skiaLoadImage(buf)
  const cv = new Canvas(img.width, img.height);
  const cx = cv.getContext('2d');
  cx.drawImage(img, 0, 0);

  return cv;
}

const save = (data: ImageData, name: string) => {
  const resCV = createCanvas(data.width, data.height);
  const resCX = getContext(resCV);
  resCX.putImageData(data, 0, 0);
  const b = resCV.toBuffer('image/png');
  fs.writeFileSync(path.resolve(__dirname, 'test', name), b);
}

describe('#getMap', () => {
  describe('MapInfoProvider', () => {
    const tests = [
      {
        seed: 1674055821,
        // Liquid Cave
        params: {
          x: 28,
          y: 14,
        },
        ans: 'fixtures/liquidcave.png'
      },
    ];
    let randoms: Awaited<ReturnType<typeof loadRandom>>;
    let mapInfoProvider: MapInfoProvider;

    beforeAll(async () => {
      randoms = await loadRandom();
      mapInfoProvider = new MapInfoProvider(randoms);
      await mapInfoProvider.ready();
    });

    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const { x, y } = t.params;
        randoms.SetWorldSeed(t.seed);
        const color = mapInfoProvider.imageActions.getColor(mapInfoProvider.worldMap, x, y);
        const map = mapInfoProvider.getMap(x, y, color)!;

        const ans = await loadImage(t.ans);
        const ansCX = getContext(ans);
        const ansID = ansCX.getImageData(0, 0, ans.width, ans.height);
        save(map, 'map.png');
        save(mapInfoProvider.worldMap, 'world.png');

        const diff = new ImageData(map.width, map.height);

        const numDiffPixelsnumDiffPixels = pixelmatch(map.data, ansID.data, diff.data, ans.width, ans.height, { threshold: 0.01 });

        if (numDiffPixelsnumDiffPixels) {
          save(diff, 'diff.png');
        }

        expect(numDiffPixelsnumDiffPixels).toEqual(0);
      });
    });
  });
});
