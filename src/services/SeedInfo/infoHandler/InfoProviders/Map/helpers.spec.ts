/**
 * @jest-environment node
 */

import { loadRandom } from '../../../../../testHelpers';
import {
	hexRGBAtoIntRGB,
	iteratePixels,
	hexTorgba,
	rgbaToInt,
	getColor,
	imageFromHexArray,
	getGlobalPos,
	getLocalPos,
	getTilePos
} from '../../../../imageActions/nodeImageActions';

const blackSquare = {
	arr: [
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000',
		'00000000'
	],
	w: 4,
	h: 4
};

const withWhite = {
	arr: ['00000000', 'ffffffff', '00000000', '00000000'],
	w: 2,
	h: 2
};

describe('helpers', () => {
	let randoms: Awaited<ReturnType<typeof loadRandom>>;
	beforeAll(async () => {
		randoms = await loadRandom();
	});

	describe('hexTorgba', () => {
		it('Should correctly convert hex', () => {
			const c = '7f007fff';
			const res = hexTorgba(c);
			expect(res).toEqual([127, 0, 127, 255]);
			expect(rgbaToInt(res[0], res[1], res[2], res[3])).toEqual(2130739199);
		});
		it('Should correctly convert hex', () => {
			const c = 'ff020480';
			const res = hexTorgba(c);
			expect(res).toEqual([255, 2, 4, 128]);
			expect(rgbaToInt(res[0], res[1], res[2], res[3])).toEqual(4278322304);
		});
	});

	describe('iteratePixels', () => {
		it('Should iterate with step', async () => {
			const image = imageFromHexArray(
				blackSquare.arr,
				blackSquare.w,
				blackSquare.h
			);
			const steps: [number, number][] = [];
			await iteratePixels(image, 2, async (x, y, color) => {
				steps.push([x, y]);
			});
			expect(steps).toEqual([[0, 0], [2, 0], [0, 2], [2, 2]]);
		});

		it('Should iterate with color', async () => {
			const image = imageFromHexArray(withWhite.arr, withWhite.w, withWhite.h);
			const steps: number[] = [];
			await iteratePixels(image, 1, async (x, y, color) => {
				steps.push(color);
			});
			expect(steps).toEqual([0, 4294967295, 0, 0]);
		});
	});

	describe('getColor', () => {
		it('Should get color of pixel', () => {
			const image = imageFromHexArray(withWhite.arr, withWhite.w, withWhite.h);
			expect(getColor(image, 0, 0)).toEqual(0);
			expect(getColor(image, 0, 1)).toEqual(0);
			expect(getColor(image, 1, 0)).toEqual(4294967295);
			expect(getColor(image, 1, 1)).toEqual(0);
		});
	});


	describe('GetWidthFromPix', () => {
		// TODO: Handle WORLD_OFFSET_X and WORLD_OFFSET_Y and not
		// magic numbers

		const WORLD_OFFSET_X = 35;
		const WORLD_OFFSET_Y = 14;

		const tests = [
			{
				x0: 35,
				x1: 36,
				y0: 14,
				y1: 15,
				w: 51,
				h: 52,
			},
			{
				x0: 36,
				x1: 37,
				y0: 14,
				y1: 15,
				w: 51,
				h: 52,
			},
			{
				x0: 37,
				x1: 38,
				y0: 14,
				y1: 15,
				w: 51,
				h: 52,
			},
			{
				x0: 34,
				x1: 35,
				y0: 15,
				y1: 16,
				w: 52,
				h: 51,
			},
			{
				x0: 35,
				x1: 36,
				y0: 15,
				y1: 16,
				w: 51,
				h: 51,
			},
			{
				x0: 36,
				x1: 37,
				y0: 15,
				y1: 16,
				w: 51,
				h: 51,
			},
			{
				x0: 37,
				x1: 38,
				y0: 15,
				y1: 16,
				w: 51,
				h: 51,
			},
			{
				x0: 38,
				x1: 39,
				y0: 15,
				y1: 16,
				w: 51,
				h: 51,
			},
		];
		tests.forEach(test => {
			it('Should handle the integer division discrepancy correctly', () => {
				const w = randoms.GetWidthFromPixWithOffset(test.x0, test.x1, 0);
				const h = randoms.GetWidthFromPixWithOffset(test.y0, test.y1, 0);
				expect({ w, h }).toEqual({ w: test.w, h: test.h });
			});
		});
	});
});
