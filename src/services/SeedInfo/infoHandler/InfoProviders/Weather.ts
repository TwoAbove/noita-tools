/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRule } from "../IRule";
import { InfoProvider } from "./Base";
import { GameGetDateAndTimeLocal } from "./helpers";

const snowfall_chance = 1 / 12;
const rainfall_chance = 1 / 15;
const rain_duration_on_run_start = 4 * 60 * 60;

export const RAIN_TYPE_NONE = 0;
export const RAIN_TYPE_SNOW = 1;
export const RAIN_TYPE_LIQUID = 2;

const snow_types = [
  {
    chance: 1.0,
    rain_material: "snow",
    rain_particles_min: 1,
    rain_particles_max: 4,
    rain_duration: -1,
    rain_draw_long_chance: 0.5,
    rain_type: RAIN_TYPE_SNOW,
  },
  {
    chance: 0.25,
    rain_material: "slush",
    rain_particles_min: 3,
    rain_particles_max: 5,
    rain_duration: rain_duration_on_run_start,
    rain_draw_long_chance: 0.5,
    rain_type: RAIN_TYPE_SNOW,
  },
];

const rain_types = [
  {
    chance: 1.0, // light rain
    rain_material: "water",
    rain_particles_min: 4,
    rain_particles_max: 7,
    rain_duration: rain_duration_on_run_start,
    rain_draw_long_chance: 1.0,
    rain_type: RAIN_TYPE_LIQUID,
  },
  {
    chance: 0.05, // heavy rain
    rain_material: "water",
    rain_particles_min: 10,
    rain_particles_max: 15,
    rain_duration: rain_duration_on_run_start / 2,
    rain_draw_long_chance: 1.0,
    rain_type: RAIN_TYPE_LIQUID,
  },
  {
    chance: 0.001,
    rain_material: "blood",
    rain_particles_min: 10,
    rain_particles_max: 15,
    rain_duration: rain_duration_on_run_start / 2,
    rain_draw_long_chance: 1.0,
    rain_type: RAIN_TYPE_LIQUID,
  },
  {
    chance: 0.0002,
    rain_material: "acid",
    rain_particles_min: 10,
    rain_particles_max: 15,
    rain_draw_long_chance: 1.0,
    rain_duration: rain_duration_on_run_start / 2,
    rain_type: RAIN_TYPE_LIQUID,
  },
  {
    chance: 0.0001,
    rain_material: "slime",
    rain_particles_min: 1,
    rain_particles_max: 4,
    rain_draw_long_chance: 1.0,
    rain_duration: rain_duration_on_run_start / 2,
    rain_type: RAIN_TYPE_LIQUID,
  },
];

// interface IWeather {
// 	hour: number;
// 	day: number;
// 	rain_type: number;
// 	fog: number;
// 	clouds: number;
// }

export interface IWeather {
  chance: number;
  rain_material: string;
  rain_particles: number;
  rain_particles_min: number;
  rain_particles_max: number;
  rain_duration: number;
  rain_draw_long: boolean;
  rain_draw_long_chance: number;
  rain_type: number;

  hour: number;
  day: number;
  fog: number;
  clouds: number;
}

export class WeatherInfoProvider extends InfoProvider {
  provide() {
    const [year, month, day, hour, minute] = GameGetDateAndTimeLocal();

    const rnd = this.randoms.random_create(7893434, 3458934);
    const rnd_time = this.randoms.random_create(hour + day, hour + day + 1);

    const snows1 = month >= 12;
    const snows2 = month <= 2;
    const snows = (snows1 || snows2) && this.randoms.random_next(rnd_time, 0.0, 1.0) <= snowfall_chance; // snow is based on real world time
    const rains = !snows && this.randoms.random_next(rnd, 0.0, 1.0) <= rainfall_chance; // rain is based on world seed

    let rain_type = RAIN_TYPE_NONE;
    let weather: Partial<IWeather> = {};

    if (snows) {
      rain_type = RAIN_TYPE_SNOW;
      weather = this.randoms.pick_random_from_table_backwards(snow_types, rnd_time);
    } else if (rains) {
      rain_type = RAIN_TYPE_LIQUID;
      weather = this.randoms.pick_random_from_table_backwards(rain_types, rnd);
    }
    weather.rain_type = rain_type;
    weather.hour = hour;
    weather.day = day;
    if (!weather.rain_material) {
      weather.rain_material = "";
    }

    // make it foggy and cloudy if stuff is falling from the sky, randomize rain type
    if (weather.rain_type === RAIN_TYPE_NONE) {
      weather.fog = 0.0;
      weather.clouds = 0.0;
    } else {
      weather.fog = this.randoms.random_next(rnd, 0.3, 0.85);
      weather.clouds = Math.max(weather.fog, this.randoms.random_next(rnd, 0.0, 1.0));
      weather.rain_draw_long = this.randoms.random_next(rnd, 0.0, 1.0) <= weather.rain_draw_long_chance!;
      weather.rain_particles = this.randoms.random_next(rnd, weather.rain_particles_min!, weather.rain_particles_max!);
    }

    return weather as IWeather;
  }

  test(rule: IRule<IWeatherRule>): boolean {
    let info = this.provide();

    if (!rule.val) {
      return true;
    }

    for (const [key, val] of Object.entries(rule.val)) {
      switch (key) {
        case "rain_material":
          if (val !== info.rain_material) {
            return false;
          }
          break;
        case "fog":
        case "clouds":
          if (info[key] < val[0] || info[key] > val[1]) {
            return false;
          }
          break;

        default:
          if (val !== info[key]) {
            return false;
          }
      }
    }

    return true;
  }
}

export interface IWeatherRule {
  rain_material?: string;
  fog?: [number, number];
  clouds?: [number, number];
}
