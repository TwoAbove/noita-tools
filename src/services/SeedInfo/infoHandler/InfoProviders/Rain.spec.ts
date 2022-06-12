/**
 * @jest-environment node
 */

import { RainInfoProvider } from './Rain';
import { loadRandom } from '../../../../testHelpers';

describe('RainInfoProvider', () => {
	const tests = [
		{
			seed: 123,
			ans: {
				isRaining: true,
				material: 'water',
				probability: 0.06666666666666667
			}
		},
		{
			seed: 5151515,
			ans: {
				isRaining: true,
				material: 'water',
				probability: 0.06666666666666667
			}
		},
		{
			seed: 123435616,
			ans: { isRaining: false, material: '', probability: 0.9333333333333333 }
		}
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new RainInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const res = ap.provide();
				expect(res).toEqual(t.ans);
			});
		});
	});
});
