import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { WeatherInfoProvider } from "./Weather";
import { loadRandom } from "../../../../testHelpers";

describe("WeatherInfoProvider", () => {
  const tests = [
    {
      date: new Date("February 11, 2024 13:59:46"),
      seed: 123,
      ans: {
        chance: 1,
        clouds: 0.993828296661377,
        fog: 0.32327699661254883,

        rain_draw_long: true,
        rain_draw_long_chance: 0.5,
        rain_duration: -1,
        rain_material: "snow",
        rain_particles: 3.91402268409729,
        rain_particles_max: 4,
        rain_particles_min: 1,
        rain_type: 1,
        hour: expect.any(Number),
        day: expect.any(Number),
      },
    },
    {
      date: new Date("February 11, 2024 14:59:46"),
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
      date: new Date("February 11, 2024 14:59:46"),
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
      date: new Date("February 11, 2024 13:59:46"),
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
    afterEach(() => {
      vi.useRealTimers();
    });

    tests.forEach((t, i) => {
      it(`Should generate correct output #${i}`, async () => {
        const date = t.date;
        vi.useFakeTimers({
          now: date,
        });
        const randoms = await loadRandom();
        const ap = new WeatherInfoProvider(randoms);
        randoms.SetWorldSeed(t.seed);
        const res = ap.provide();
        expect(res).toEqual(t.ans);
      });
    });
  });
});
