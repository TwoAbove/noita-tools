/**
 * @jest-environment node
 */

import { PacifistChestProvider } from './PacifistChest';
import { loadRandom, getUnlockedSpells } from '../../../../testHelpers';

describe('PacifistChestProvider', () => {
	const tests = [
		{
			seed: 1674055821,
			params: {
				level: 0,
				worldOffset: 0,
				fallback: 0,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/pickup/spell_refresh.xml',
					pos_x: -68,
					pos_y: 1371,
					x: 431.7,
					y: 2054.1
				}
			]
		},
		{
			seed: 1674055821,
			params: {
				level: 1,
				worldOffset: 0,
				fallback: 0,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/pickup/goldnugget_200.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				}
			]
		},
		{
			seed: 1674055821,
			params: {
				level: 2,
				worldOffset: 0,
				fallback: 0,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/wand_level_03.xml',
					x: 431.7,
					y: 5638.1,
					pos_x: -74,
					pos_y: 4959,
					extra: {
						cost: 60,
						force_unshuffle: false,
						level: 3
					}
				}
			]
		},
		{
			seed: 475,
			params: {
				level: 0,
				worldOffset: 0,
				fallback: 0,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/pickup/heart_better.xml',
					pos_x: -72,
					pos_y: 1368,
					x: 431.7,
					y: 2054.1
				}
			]
		},
		{
			seed: 551,
			params: {
				level: 0,
				worldOffset: 0,
				fallback: 0,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/pickup/spell_refresh.xml',
					pos_x: -70,
					pos_y: 1374,
					x: 431.7,
					y: 2054.1
				}
			]
		},
		{
			seed: 551,
			params: {
				level: 1,
				worldOffset: 0,
				fallback: 0,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/pickup/thunderstone.xml',
					pos_x: -78,
					pos_y: 2907,
					x: -78,
					y: 2907
				}
			]
		},
		{
			seed: 1151,
			params: {
				level: 0,
				worldOffset: 28,
				fallback: 0,
				greed: false
			},
			ans: [
				{
					entity: 'data/entities/items/pickup/goldnugget_200.xml',
					pos_x: 1003440,
					pos_y: 1371,
					x: 1003440,
					y: 1371
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: 1003440,
					pos_y: 1371,
					x: 1003440,
					y: 1371
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: 1003440,
					pos_y: 1371,
					x: 1003440,
					y: 1371
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: 1003440,
					pos_y: 1371,
					x: 1003440,
					y: 1371
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: 1003440,
					pos_y: 1371,
					x: 1003440,
					y: 1371
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: 1003440,
					pos_y: 1371,
					x: 1003440,
					y: 1371
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: 1003440,
					pos_y: 1371,
					x: 1003440,
					y: 1371
				},
				{
					entity: 'data/entities/items/pickup/goldnugget.xml',
					pos_x: 1003440,
					pos_y: 1371,
					x: 1003440,
					y: 1371
				}
			]
		}
		// {
		// 	seed: 123435616,
		// 	params: {
		// 		level: 1,
		// 		worldOffset: 1,
		// 		fallback: 0,
		// 		greed: false,
		// 	},
		// 	ans: ''
		// },
		// {
		// 	seed: 123435616,
		// 	params: {
		// 		level: 1,
		// 		worldOffset: 1,
		// 		fallback: 1,
		// 		greed: false,
		// 	},
		// 	ans: ''
		// }
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new PacifistChestProvider(randoms, getUnlockedSpells());
				randoms.SetWorldSeed(t.seed);
				const res = ap.provide(
					t.params.level,
					t.params.worldOffset,
					t.params.fallback,
					t.params.greed
				);
				expect(res).toEqual(t.ans);
			});
		});
	});
});
