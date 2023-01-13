/**
 * @jest-environment node
 */

import {
	hexRGBAtoIntRGB,
	iteratePixels,
	hexTorgba,
	rgbaToInt,
	getColor,
	imageFromHexArray,
	getGlobalPos,
	getLocalPos
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
	describe('hexTorgba', () => {
		it("Should correctly convert hex", () => {
			const c = '7f007fff';
			const res = hexTorgba(c);
			expect(res).toEqual([127, 0, 127, 255]);
			expect(rgbaToInt(res[0], res[1], res[2], res[3])).toEqual(2130739199);
		});
		it("Should correctly convert hex", () => {
			const c = 'ff020480';
			const res = hexTorgba(c);
			expect(res).toEqual([255, 2, 4, 128]);
			expect(rgbaToInt(res[0], res[1], res[2], res[3])).toEqual(4278322304);
		})
	})

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

	describe('getGlobalPos getLocalPos', () => {
		const tests = [
			{
				x: 34,
				y: 14,

				px: 1170,
				py: 90,

				gx: 645,
				gy: 77,
			},
			{
				x: 31,
				y: 17,

				px: 2510,
				py: 820,

				gx: 455,
				gy: 2347,
			},
			{
				x: 31,
				y: 17,

				px: 2080,
				py: 80,

				gx: 25,
				gy: 1607,
			},
			{
				x: 31,
				y: 17,

				px: 1470,
				py: 150,

				gx: -585,
				gy: 1677,
			},
		]

		for (const t of tests) {
			it('Should correctly convert from global to local and back', () => {
				const res = getGlobalPos(t.x, t.y, t.px, t.py);
				expect(res).toEqual({ gx: t.gx, gy: t.gy });
				const res2 = getLocalPos(t.x, t.y, res.gx, res.gy);
				expect(res2).toEqual({ px: t.px, py: t.py });
			});
		}
	});
});
