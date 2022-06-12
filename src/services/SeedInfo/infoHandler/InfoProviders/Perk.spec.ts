/**
 * @jest-environment node
 */

import { IPerkChangeStateType, PerkInfoProvider } from './Perk';
import { loadRandom } from '../../../../testHelpers';

describe('PerkInfoProvider', () => {
	describe('#provide', () => {
		const tests: any[] = [
			{
				seed: 123,
				params: {},
				ans: [
					['LOW_HP_DAMAGE_BOOST', 'PROJECTILE_HOMING', 'MOLD'],
					['BLEED_GAS', 'RADAR_ENEMY', 'FASTER_LEVITATION'],
					['GLASS_CANNON', 'PROJECTILE_REPULSION_SECTOR', 'ORBIT'],
					['TELEPORTITIS', 'REMOVE_FOG_OF_WAR', 'SAVING_GRACE'],
					['RESPAWN', 'PERSONAL_LASER', 'TELEKINESIS'],
					['FAST_PROJECTILES', 'BOUNCE', 'BLEED_OIL'],
					['HOMUNCULUS', 'PEACE_WITH_GODS', 'PROJECTILE_EATER_SECTOR']
				]
			},
			{
				seed: 123,
				params: { maxLevels: 2 },
				ans: [
					['LOW_HP_DAMAGE_BOOST', 'PROJECTILE_HOMING', 'MOLD'],
					['BLEED_GAS', 'RADAR_ENEMY', 'FASTER_LEVITATION']
				]
			},
			{
				seed: 123,
				params: { maxLevels: 1, rerolls: new Map([[0, 1]]) },
				ans: [['LOW_HP_DAMAGE_BOOST', 'PROJECTILE_HOMING', 'MOLD']]
			},
			{
				seed: 266197553,
				params: {
					perk_picks: new Map([[8, [['EXTRA_PERK']]]]),
					worldOffset: 8
				},
				ans: [
					['LASER_AIM', 'EXTRA_PERK', 'IRON_STOMACH'],
					[
						'CRITICAL_HIT',
						'EXTRA_SHOP_ITEM',
						'TELEKINESIS',
						'UNLIMITED_SPELLS'
					],
					['FASTER_WANDS', 'ADVENTURER', 'BOUNCE', 'EXTRA_PERK'],
					[
						'PERSONAL_LASER',
						'FASTER_LEVITATION',
						'PROJECTILE_EATER_SECTOR',
						'ANGRY_GHOST'
					],
					['EDIT_WANDS_EVERYWHERE', 'EXTRA_MANA', 'GAMBLE', 'EXPLODING_GOLD'],
					['GLASS_CANNON', 'REVENGE_TENTACLE', 'HOMUNCULUS', 'ELECTRICITY']
				]
			}
		];
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new PerkInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const {
					perk_picks,
					maxLevels,
					returnPerkObjects,
					worldOffset,
					rerolls
				} = t.params;
				const res = ap.provide(
					perk_picks,
					maxLevels,
					returnPerkObjects,
					worldOffset,
					rerolls
				);
				expect(res).toEqual(t.ans);
			});
		});
	});

	describe('#provideStateless', () => {
		const tests: any[] = [
			{
				seed: 123,
				params: { state: [] },
				ans: {
					lotteries: 0,
					perkRerolls: [],
					perks: [],
					pickedPerks: [],
					worldOffset: 0
				}
			},
			{
				seed: 123,
				params: { state: [{ type: IPerkChangeStateType.genRow, data: 0 }] },
				ans: {
					lotteries: 0,
					perkRerolls: [],
					perks: [['LOW_HP_DAMAGE_BOOST', 'PROJECTILE_HOMING', 'MOLD']],
					pickedPerks: [],
					worldOffset: 0
				}
			},
			{
				seed: 123,
				params: {
					state: [
						{ type: IPerkChangeStateType.genRow, data: 0 },
						{ type: IPerkChangeStateType.genRow, data: 1 }
					]
				},
				ans: {
					lotteries: 0,
					perkRerolls: [],
					perks: [
						['LOW_HP_DAMAGE_BOOST', 'PROJECTILE_HOMING', 'MOLD'],
						['BLEED_GAS', 'RADAR_ENEMY', 'FASTER_LEVITATION']
					],
					pickedPerks: [],
					worldOffset: 0
				}
			}
			// TODO: This should be better tested
		];
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new PerkInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const { state } = t.params;
				const res = ap.provideStateless(state);
				expect(res).toEqual(t.ans);
			});
		});
	});
});
