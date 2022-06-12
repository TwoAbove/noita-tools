/**
 * @jest-environment node
 */

import { StartingFlaskInfoProvider } from './StartingFlask';
import { loadRandom } from '../../../../testHelpers';

describe('StartingFlaskInfoProvider', () => {
	const tests = [
		{
			seed: 123,
			ans: "snow"
		},
		{
			seed: 5151515,
			ans: "mud"
		},
		{
			seed: 123435616,
			ans: "water"
		}
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new StartingFlaskInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const res = ap.provide();
				expect(res).toEqual(t.ans);
			});
		});
	});
});
