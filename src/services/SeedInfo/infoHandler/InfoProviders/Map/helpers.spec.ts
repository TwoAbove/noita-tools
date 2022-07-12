import { hexRGBAtoIntRGB } from '../../../../../components/LiveSeedStats/OCRHandler/imageActions';
import {
	iteratePixels,
	getColor,
	imageFromHexArray,
	getGlobalPos,
	getLocalPos
} from './helpers';

global.ImageData = require('@canvas/image-data');

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

describe('Map.index', () => {
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
			const steps: string[] = [];
			await iteratePixels(image, 1, async (x, y, color) => {
				steps.push(color);
			});
			expect(steps).toEqual(['00000000', 'ffffffff', '00000000', '00000000']);
		});
	});

	describe('getColor', () => {
		it('Should get color of pixel', () => {
			const image = imageFromHexArray(withWhite.arr, withWhite.w, withWhite.h);
			expect(getColor(image, 0, 0)).toEqual('00000000');
			expect(getColor(image, 0, 1)).toEqual('00000000');
			expect(getColor(image, 1, 0)).toEqual('ffffffff');
			expect(getColor(image, 1, 1)).toEqual('00000000');
		});
	});

	describe('getGlobalPos getLocalPos', () => {
		it('Should correctly convert from global to local and back', () => {
			const x = 35;
			const y = 14;
			const res = getGlobalPos(x, y, 1, 1);
			expect(res).toEqual({ gx: -12, gy: -12 });
			const res2 = getLocalPos(x, y, res.gx, res.gy);
			expect(res2).toEqual({ px: 1, py: 1 });
		});
		it('Should correctly convert from global to local and back with negatives', () => {
			const x = 32;
			const y = 16;
			const res = getGlobalPos(x, y, 1, 1);
			expect(res).toEqual({ gx: -1548, gy: 1012 });
			const res2 = getLocalPos(x, y, res.gx, res.gy);
			expect(res2).toEqual({ px: 1, py: 1 });
		});
		it('Should correctly convert from global to local and back with negatives', () => {
			const x = 36;
			const y = 12;
			const res = getGlobalPos(x, y, 1, 1);
			expect(res).toEqual({ gx: 500, gy: -1036 });
			const res2 = getLocalPos(x, y, res.gx, res.gy);
			expect(res2).toEqual({ px: 1, py: 1 });
		});
	});
});
