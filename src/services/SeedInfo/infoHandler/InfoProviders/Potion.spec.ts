/**
 * @jest-environment node
 */

import { PotionInfoProvider } from './Potion';
import { loadRandom } from '../../../../testHelpers';
import Decimal from 'decimal.js';

describe('PotionInfoProvider', () => {
	const tests = [
		{
			seed: 1674055821,
			params: {
				x: 1390,
				y: 181
			},
			ans: 'magic_liquid_mana_regeneration'
		},
		{
			seed: 1674055821,
			params: {
				x: 1200,
				y: 631
			},
			ans: 'lava'
		},
		{
			seed: 1674055821,
			params: {
				x: 1480,
				y: 831
			},
			ans: 'magic_liquid_random_polymorph'
		},
		{
			seed: 1674055821,
			params: {
				x: 190,
				y: 111
			},
			ans: 'magic_liquid_faster_levitation'
		},
		{
			seed: 5,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'magic_liquid_unstable_teleportation'
		},
		{
			seed: 10,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'magic_liquid_mana_regeneration'
		},
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const potion = new PotionInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const res = potion.provide(t.params.x, t.params.y);
				expect(res).toEqual(t.ans);
			});
		});
	});
});
