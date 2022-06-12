/**
 * @jest-environment node
 */

import { WaterCaveInfoProvider } from './WaterCave';
import { loadRandom } from '../../../../testHelpers';

describe('WaterCaveInfoProvider', () => {
	const tests = [
		{
			seed: 123,
			ans: 2
		},
		{
			seed: 5151515,
			ans: 0
		},
		{
			seed: 123435616,
			ans: 4
		}
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new WaterCaveInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const res = ap.provide();
				expect(res).toEqual(t.ans);
			});
		});
	});
});
