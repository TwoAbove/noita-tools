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
				x: -78,
				y: 1371,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/pickup/spell_refresh.xml',
					pos_x: -68,
					pos_y: 1371,
					x: 431.7,
					y: 2054.1
				}
			]
		},
		{
			seed: 551,
			params: {
				x: -78,
				y: 1371,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/pickup/spell_refresh.xml',
					pos_x: -70,
					pos_y: 1374,
					x: 431.7,
					y: 2054.1
				}
			]
		},
		{
			seed: 551,
			params: {
				x: -78,
				y: 2907,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/pickup/thunderstone.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				}
			]
		}
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

	it("Should correctly handle PW >27", async () => {
		const randoms = await loadRandom();
		const ap = new ChestRandomProvider(randoms, getUnlockedSpells());
		randoms.SetWorldSeed(1151);
		// assuming regular rounding
		const x1 = 1003442;
		const x2 = 1003442 + 1;
		const x3 = 1003442 - 5;
		const res1 = ap.provide(x1, 2000);
		const res2 = ap.provide(x2, 2000);
		const res3 = ap.provide(x3, 2000);
		expect(res1).toEqual(res2);
		expect(res1).toEqual(res3);
	});
});
