/**
 * @jest-environment node
 */

import { IRandom } from '../../../random';
import { loadRandom } from '../../../../../testHelpers';
import Base from './Base';

import Coalmine from './impl/Coalmine';

describe('Base Map Implementation', () => {
	describe('#load_random_pixel_scene', () => {
		it('Should generate correct scene', async () => {
			const randoms = await loadRandom();
			randoms.SetWorldSeed(1674055821);
			const LoadPixelScene = jest
				.fn()
				.mockImplementation(() => Promise.resolve());
			const HandleInterest = jest
				.fn()
				.mockImplementation(() => Promise.resolve());
			const BiomeMapGetVerticalPositionInsideBiome = jest
				.fn()
				.mockImplementation(() => 0);
			const RaytracePlatforms = jest
				.fn()
				.mockImplementation(() => [true, 0, 0]);
			const impl = new Base(
				randoms,
				LoadPixelScene,
				HandleInterest,
				BiomeMapGetVerticalPositionInsideBiome,
				RaytracePlatforms,
				{}
			);
			const cmi = new Coalmine(
				randoms,
				LoadPixelScene,
				HandleInterest,
				BiomeMapGetVerticalPositionInsideBiome,
				RaytracePlatforms,
				{}
			);
			await impl.load_random_pixel_scene(cmi.g_pixel_scene_02, 645, 77);
			expect(LoadPixelScene.mock.calls[0][0]).toEqual(
				'data/biome_impl/coalmine/wandtrap_h_06.png'
			);
			expect(LoadPixelScene.mock.calls[0][7]).toEqual({
				f0bbeeff: '7fceea80'
			});
		});
	});
});
