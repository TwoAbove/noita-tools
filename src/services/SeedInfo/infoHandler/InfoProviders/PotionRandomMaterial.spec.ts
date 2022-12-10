/**
 * @jest-environment node
 */

import { PotionRandomMaterialInfoProvider } from './PotionRandomMaterial';
import { loadRandom } from '../../../../testHelpers';
import _ from 'lodash';

describe('PotionRandomMaterialInfoProvider', () => {
	const tests = [
		{
			seed: 17172,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'burning_powder'
		},
		{
			seed: 25784,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'radioactive_liquid_yellow'
		},
		{
			seed: 29664,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'urine'
		},
		{
			seed: 67686,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'plasma_fading_green'
		},
		{
			seed: 81151,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'bush_seed'
		},
		{
			seed: 102316,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'steel_sand'
		},
		{
			seed: 114713,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'material_darkness'
		},
		{
			seed: 124650,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'spore'
		},
		{
			seed: 127104,
			params: {
				x: -78,
				y: 1371
			},
			ans: 'slush'
		}
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const potion = new PotionRandomMaterialInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const res = potion.provide(t.params.x, t.params.y);
				expect(res).toEqual(t.ans);
			});
		});
	});
});
