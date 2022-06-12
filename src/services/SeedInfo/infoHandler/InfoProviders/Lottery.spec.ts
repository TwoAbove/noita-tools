/**
 * @jest-environment node
 */

import { LotteryInfoProvider } from './Lottery';
import { loadRandom } from '../../../../testHelpers';

describe('LotteryInfoProvider', () => {
	const tests = [
		{
			seed: 123,
			params: [0, 0, 3, 0, 1],
			ans: true
		},
		{
			seed: 123,
			params: [1, 0, 3, 0, 1],
			ans: false
		},
		{
			seed: 123,
			params: [0, 2, 3, 0, 1],
			ans: true
		},
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new LotteryInfoProvider(randoms);
				const [level, perkNumber, perksOnLevel, worldOffset, lotteries] = t.params;
				randoms.SetWorldSeed(t.seed);
				const res = ap.provide(level, perkNumber, perksOnLevel, worldOffset, lotteries);
				expect(res).toEqual(t.ans);
			});
		});
	});
});
