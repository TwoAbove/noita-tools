/**
 * @jest-environment node
 */

import { PowderStashInfoProvider } from './PowderStash';
import { loadRandom } from '../../../../testHelpers';

describe('PowderStashInfoProvider', () => {
	const tests = [
		{
			seed: 9,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'bone'
		},
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const potion = new PowderStashInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const res = potion.provide(t.params.x, t.params.y);
				expect(res).toEqual(t.ans);
			});
		});
	});
});
