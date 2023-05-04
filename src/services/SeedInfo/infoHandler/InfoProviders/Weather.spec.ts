/**
 * @jest-environment node
 */

import { WeatherInfoProvider } from "./Weather";
import { loadRandom } from "../../../../testHelpers";

describe("WeatherInfoProvider", () => {
  const tests = [
    {
      seed: 123,
      ans: {
        chance: 1,
        clouds: 0.32803621888160706,
        fog: 0.32803621888160706,
        rain_draw_long: true,
        rain_draw_long_chance: 1,
        rain_duration: 14400,
        rain_material: "water",
        rain_particles: 6.031702041625977,
        rain_particles_max: 7,
        rain_particles_min: 4,
        rain_type: 2,
        hour: expect.any(Number),
        day: expect.any(Number),
      },
    },
    {
      seed: 5151515,
      ans: {
        chance: 1,
        clouds: 0.7956304550170898,
        fog: 0.7956304550170898,
        rain_draw_long: true,
        rain_draw_long_chance: 1,
        rain_duration: 14400,
        rain_material: "water",
        rain_particles: 5.772556304931641,
        rain_particles_max: 7,
        rain_particles_min: 4,
        rain_type: 2,
        hour: expect.any(Number),
        day: expect.any(Number),
      },
    },
    {
      seed: 123435616,
      ans: {
        rain_material: "",
        clouds: 0,
        hour: expect.any(Number),
        day: expect.any(Number),
        fog: 0,
        rain_type: 0,
      },
    },
  ];

  describe("#provide", () => {
    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const randoms = await loadRandom();
        const ap = new WeatherInfoProvider(randoms);
        randoms.SetWorldSeed(t.seed);
        const res = ap.provide();
        expect(res).toEqual(t.ans);
      });
    });
  });
});
