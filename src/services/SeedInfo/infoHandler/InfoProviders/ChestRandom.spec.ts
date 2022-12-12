/**
 * @jest-environment node
 */

import { ChestRandomProvider } from './ChestRandom';
import { loadRandom, getUnlockedSpells } from '../../../../testHelpers';

describe('ChestRandomProvider', () => {
	const tests = [
		{
			seed: 1674055821,
			params: {
				x: -78, y: 1371, greed: false
			},
			ans: [{ entity: 'data/entities/items/pickup/heart.xml', x: -78, y: 1371 }]
		},
		{
			seed: 551,
			params: {
				x: -78, y: 1371, greed: false
			},
			ans: [{ entity: 'data/entities/items/pickup/potion.xml', x: -78, y: 1373 }]
		},
		{
			seed: 551,
			params: {
				x: -78, y: 2907, greed: false
			},
			ans: [
				{ entity: 'Spell', extra: 'GRAVITY', x: -78, y: 2907 },
				{ entity: 'Spell', extra: 'BURST_3', x: -78, y: 2907 },
				{ entity: 'Spell', extra: 'TENTACLE_RAY_ENEMY', x: -78, y: 2907 },
			]
		}
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new ChestRandomProvider(randoms, getUnlockedSpells());
				randoms.SetWorldSeed(t.seed);
				const res = ap.provide(t.params.x, t.params.y);
				expect(res).toEqual(t.ans);
			});
		});
	});
});
