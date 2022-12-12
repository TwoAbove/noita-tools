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
			ans: [{ entity: 'data/entities/items/pickup/heart.xml', x: -78, y: 1371 }]
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
				{ entity: 'data/entities/misc/custom_cards/bomb.xml', x: -78, y: 2907 }
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
					entity: 'data/entities/items/wand_level_01.xml',
					x: -78,
					y: 4955,
					extra: {
						cost: 30,
						force_unshuffle: false,
						level: 1
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
				{ entity: 'data/entities/items/pickup/potion.xml', x: -78, y: 1373 },
				{ entity: 'Spell', extra: 'GRENADE_LARGE', x: -78, y: 1371 },
				{ entity: 'Spell', extra: 'PHASING_ARC', x: -78, y: 1371 }
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
				{ entity: 'data/entities/items/pickup/potion.xml', x: -78, y: 1373 },
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
				{ entity: 'Spell', extra: 'GRAVITY', x: -78, y: 2907 },
				{ entity: 'Spell', extra: 'BURST_3', x: -78, y: 2907 },
				{ entity: 'Spell', extra: 'TENTACLE_RAY_ENEMY', x: -78, y: 2907 },
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
