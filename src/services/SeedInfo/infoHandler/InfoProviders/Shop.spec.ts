/**
 * @jest-environment node
 */

import { ShopInfoProvider, IShopType } from './Shop';
import { WandInfoProvider } from './Wand';
import { loadRandom } from '../../../../testHelpers';

describe('ShopInfoProvider', () => {
	describe('#provide', () => {
		describe('type', () => {
			const tests = [
				{
					seed: 123,
					ans: {
						row: 0,
						type: IShopType.wand
					}
				},
				{
					seed: 5151515,
					ans: {
						row: 4,
						type: IShopType.item
					}
				},
				{
					seed: 123435616,
					ans: {
						row: 6,
						type: IShopType.item
					}
				}
			];

			tests.forEach((t, i) => {
				it(`Should generate correct output #${i}`, async () => {
					const randoms = await loadRandom();
					const ap = new ShopInfoProvider(
						randoms,
						new WandInfoProvider(randoms)
					);
					randoms.SetWorldSeed(t.seed);
					const r = ap.provide();
					const res = r[t.ans.row];
					expect(res.type).toEqual(t.ans.type);
				});
			});
		});

		describe('items - spells', () => {
			const tests = [
				{
					seed: 123,
					ans: {
						row: 2,
						items: [
							'EXPLOSION_REMOVE',
							'MATTER_EATER',
							'TELEPORT_PROJECTILE_CLOSER',
							'QUANTUM_SPLIT',
							'LASER_EMITTER_WIDER',
							'BOUNCE_SPARK',
							'BOMB_HOLY',
							'GRENADE_TIER_2',
							'BULLET_TIMER',
							'LIGHTNING'
						]
					}
				}
			];

			tests.forEach((t, i) => {
				it(`Should generate correct output #${i}`, async () => {
					const randoms = await loadRandom();
					const ap = new ShopInfoProvider(
						randoms,
						new WandInfoProvider(randoms)
					);
					randoms.SetWorldSeed(t.seed);
					const r = ap.provide();
					const res = r[t.ans.row];
					expect(res.type).toEqual(IShopType.item);
					const items = res.items.map(i => i.spell.id);
					expect(items).toEqual(t.ans.items);
				});
			});
		});
	});
});
