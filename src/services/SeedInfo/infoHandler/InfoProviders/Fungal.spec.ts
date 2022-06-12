/**
 * @jest-environment node
 */

import { FungalInfoProvider } from './Fungal';
import { loadRandom } from '../../../../testHelpers';

describe('FungalInfoProvider', () => {
	const tests = [
		{
			seed: 123,
			ans: [
				{
					flaskFrom: false,
					flaskTo: false,
					from: ['radioactive_liquid', 'poison', 'material_darkness'],
					to: 'pea_soup'
				},
				{
					flaskFrom: false,
					flaskTo: true,
					from: ['acid'],
					to: 'gunpowder'
				},
				{
					flaskFrom: false,
					flaskTo: true,
					from: ['steam', 'smoke'],
					to: 'blood_fungi'
				},
				{
					flaskFrom: false,
					flaskTo: false,
					from: ['oil', 'swamp', 'peat'],
					to: 'pea_soup'
				},
				{
					flaskFrom: true,
					flaskTo: false,
					from: ['acid'],
					to: 'silver'
				},
				{
					flaskFrom: true,
					flaskTo: false,
					from: ['diamond'],
					to: 'radioactive_liquid'
				},
				{
					flaskFrom: false,
					flaskTo: true,
					from: ['lava'],
					to: 'radioactive_liquid'
				},
				{
					flaskFrom: false,
					flaskTo: true,
					from: ['lava'],
					to: 'lava'
				},
				{
					flaskFrom: false,
					flaskTo: false,
					from: ['water', 'water_static', 'water_salt', 'water_ice'],
					to: 'sand'
				},
				{
					flaskFrom: true,
					flaskTo: false,
					from: [
						'acid_gas',
						'acid_gas_static',
						'poison_gas',
						'fungal_gas',
						'radioactive_gas',
						'radioactive_gas_static'
					],
					to: 'gunpowder'
				},
				{
					flaskFrom: false,
					flaskTo: true,
					from: ['steam', 'smoke'],
					to: 'sima'
				},
				{
					flaskFrom: false,
					flaskTo: false,
					from: ['blood_fungi', 'fungi', 'fungisoil'],
					to: 'acid'
				},
				{
					flaskFrom: true,
					flaskTo: false,
					from: ['oil', 'swamp', 'peat'],
					to: 'material_confusion'
				},
				{
					flaskFrom: false,
					flaskTo: true,
					from: ['sand'],
					to: 'blood'
				},
				{
					flaskFrom: false,
					flaskTo: true,
					from: ['radioactive_liquid', 'poison', 'material_darkness'],
					to: 'radioactive_liquid'
				},
				{
					flaskFrom: false,
					flaskTo: false,
					from: ['lava'],
					to: 'vomit'
				},
				{
					flaskFrom: false,
					flaskTo: true,
					from: ['acid'],
					to: 'gunpowder'
				},
				{
					flaskFrom: false,
					flaskTo: false,
					from: ['steam', 'smoke'],
					to: 'alcohol'
				},
				{
					flaskFrom: false,
					flaskTo: false,
					from: ['blood'],
					to: 'silver'
				},
				{
					flaskFrom: true,
					flaskTo: false,
					from: ['diamond'],
					to: 'material_confusion'
				}
			]
		}
	];

	describe('#provide', () => {
		tests.forEach((t, i) => {
			it(`Should generate correct output #${i}`, async () => {
				const randoms = await loadRandom();
				const ap = new FungalInfoProvider(randoms);
				randoms.SetWorldSeed(t.seed);
				const res = ap.provide();
				expect(res).toEqual(t.ans);
			});
		});
	});
});
