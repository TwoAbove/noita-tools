/**
 * @jest-environment node
 */

import { ChestRandomProvider } from './ChestRandom';
import { loadRandom, getUnlockedSpells } from '../../../../testHelpers';

describe('ChestRandomProvider', () => {
	const tests = [
		{
			seed: 1674055821,
			params: {
				x: -78, y: 1371, greed: false
			},
			ans: [{ entity: 'data/entities/items/pickup/heart.xml', x: -78, y: 1371 }]
		},
		// {
		// 	seed: 5151515,
		// 	params: {
		// 		x: 1,
		// 		y: 0,
		// 	},
		// 	ans: ''
		// },
		// {
		// 	seed: 123435616,
		// 	params: {
		// 		x: 1,
		// 		y: 1,
		// 	},
		// 	ans: ''
		// },
		// {
		// 	seed: 123435616,
		// 	params: {
		// 		x: 1,
		// 		y: 1,
		// 	},
		// 	ans: ''
		// }
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new ChestRandomProvider(randoms, getUnlockedSpells());
				randoms.SetWorldSeed(t.seed);
				const res = ap.provide(t.params.x, t.params.y);
				expect(res).toEqual(t.ans);
			});
		});
	});
});
