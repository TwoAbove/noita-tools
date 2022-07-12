/**
 * @jest-environment node
 */

import { PotionInfoProvider } from './Potion';
import { loadRandom } from '../../../../testHelpers';

describe('PotionInfoProvider', () => {
	const tests = [
		{
			seed: 1674055821,
			params: {
				x: 1390,
				y: 183
			},
			ans: 'magic_liquid_mana_regeneration'
		},
		{
			seed: 1674055821,
			params: {
				x: 1200,
				y: 633
			},
			ans: 'lava'
		},
		{
			seed: 1674055821,
			params: {
				x: 1480,
				y: 833
			},
			ans: 'magic_liquid_random_polymorph'
		},
		{
			seed: 1674055821,
			params: {
				x: 190,
				y: 113
			},
			ans: 'magic_liquid_faster_levitation'
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
