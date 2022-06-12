/**
 * @jest-environment node
 */

import { BiomeModifierInfoProvider } from './BiomeModifier';
import { loadRandom } from '../../../../testHelpers';

describe('BiomeModifierInfoProvider', () => {
	const tests = [
		{
			seed: 123,
			ans: [
				'mountain_top',
				'mountain_floating_island',
				'winter',
				'lavalake',
				'desert',
				'pyramid_entrance',
				'pyramid_left',
				'pyramid_top',
				'pyramid_right',
				'watercave'
			]
		}
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new BiomeModifierInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const res = ap.provide();
				// get keys that have vals
				const arr = Object.entries(res)
					.filter(a => !!a[1])
					.map(a => a[0]);
				expect(arr).toEqual(t.ans);
			});
		});
	});
});
