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
});
