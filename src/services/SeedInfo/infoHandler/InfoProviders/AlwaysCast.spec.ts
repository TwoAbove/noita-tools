/**
 * @jest-environment node
 */

import { AlwaysCastInfoProvider } from './AlwaysCast';
import { loadRandom } from '../../../../testHelpers';

describe('AlwaysCastInfoProvider', () => {
	const tests = [
		{
			seed: 123,
			params: [0, 0, 3, 0],
			ans: "ACID_TRAIL"
		},
		{
			seed: 266197553,
			params: [0, 3, 3, 0],
			ans: "SLOW_BUT_STEADY"
		},
		{
			seed: 6023,
			params: [0, 3, 3, 0],
			ans: "FIREBALL_RAY_LINE"
		},
	]

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new AlwaysCastInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const [level, perkNumber, perksOnLevel, worldOffset] = t.params;
				const res = ap.provide(level, perkNumber, perksOnLevel, worldOffset);
				expect(res).toEqual(t.ans);
			});
		})
	});
});
