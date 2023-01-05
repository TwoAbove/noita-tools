import D from 'decimal.js';
import { IRandom } from '../../../random';
import { GameGetDateAndTimeLocal } from '../helpers';

import materials from '../../../data/materials.json';

type TLoadPixelScene = (
	materials_filename: string,
	colors_filename: string,
	x: number,
	y: number,
	background_file?: string,
	skip_biome_checks?: boolean,
	skip_edge_textures?: boolean,
	color_to_material_table?: {},
	background_z_index?: number
) => void;

type THandleInterest = (
	item: string,
	x: number,
	y: number,
	extra?: any
) => void;

type TBiomeMapGetVerticalPositionInsideBiome = (x: number, y: number) => number;
type TRaytracePlatforms = (x1: number, y1: number, x2: number, y2: number) => [boolean, number, number];

type IConfig = {
	funcs?: string[]
};

interface IProb {
	prob?: number;
	min_count: number;
	max_count: number;

	spawn_check?: () => boolean;
	ngpluslevel?: number;
	parallel?: number;
	entity?: string;
	entities?: Array<IProb | string>;

	offset_x?: number;
	offset_y?: number;
}

interface IProbScene {
	prob?: number;

	spawn_check?: () => boolean;
	ngpluslevel?: number;
	parallel?: number;

	material_file?: string;
	visual_file?: string;
	background_file?: string;
	is_unique?: boolean | number;
	z_index?: number;
	color_material?: { [color: string]: string[] };
}

export default class Base {
	debug = false;

	spawnlists = {
		potion_spawnlist: {
			rnd_min: 1,
			rnd_max: 91,
			spawns: [
				{
					value_min: 90,
					value_max: 91,
					load_entity_func: (data, x, y) => {
						const ox = data.offset_x || 0;
						const oy = data.offset_y || 0;

						if (
							this.GameHasFlagRun('greed_curse') &&
							this.GameHasFlagRun('greed_curse_gone') === false
						) {
							this.EntityLoad(
								'data/entities/items/pickup/physics_gold_orb_greed.xml',
								x + ox,
								y + oy
							);
						} else {
							this.EntityLoad(
								'data/entities/items/pickup/physics_gold_orb.xml',
								x + ox,
								y + oy
							);
						}
					},
					offset_y: -2
				},
				{
					value_min: 86,
					value_max: 89,
					load_entity: 'data/entities/items/pickup/broken_wand.xml',
					offset_y: -2
				},
				{
					value_min: 84,
					value_max: 85,
					load_entity: 'data/entities/items/pickup/thunderstone.xml',
					offset_y: -2
				},
				{
					value_min: 80,
					value_max: 83,
					load_entity: 'data/entities/items/pickup/brimstone.xml',
					offset_y: -2
				},
				{
					value_min: 78,
					value_max: 79,
					load_entity: 'data/entities/items/pickup/egg_monster.xml',
					offset_y: -2
				},
				{
					value_min: 74,
					value_max: 77,
					load_entity: 'data/entities/items/pickup/egg_slime.xml',
					offset_y: -2
				},
				{
					value_min: 73,
					value_max: 73,
					load_entity: 'data/entities/items/pickup/egg_purple.xml',
					offset_y: -2
				},
				{
					value_min: 72,
					value_max: 72,
					load_entity_func: (data, x, y) => {
						this.randoms.SetRandomSeed(x + 425, y - 243);
						const opts = [
							'laser',
							'fireball',
							'lava',
							'slow',
							'null',
							'disc',
							'metal'
						];
						let rnd = this.randoms.Random(0, opts.length);
						const opt = opts[rnd];
						const ox = data.offset_x || 0;
						const oy = data.offset_y || 0;
						const entity_id = this.EntityLoad(
							'data/entities/items/pickup/runestones/runestone_' + opt + '.xml',
							x + ox,
							y + oy
						);
						rnd = this.randoms.Random(1, 10);
						if (rnd === 2) {
							// runestone_activate(entity_id);
						}
					},
					offset_y: -10
				},
				{
					value_min: 71,
					value_max: 71,
					load_entity_func: (data, x, y) => {
						const ox = data.offset_x || 0;
						const oy = data.offset_y || 0;

						if (
							this.GameHasFlagRun('greed_curse') &&
							this.GameHasFlagRun('greed_curse_gone') === false
						) {
							this.EntityLoad(
								'data/entities/items/pickup/physics_greed_die.xml',
								x + ox,
								y + oy
							);
						} else {
							this.EntityLoad(
								'data/entities/items/pickup/physics_die.xml',
								x + ox,
								y + oy
							);
						}
					},
					offset_y: -12,
					spawn_requires_flag: 'card_unlocked_duplicate'
				},
				{
					value_min: 66,
					value_max: 70,
					load_entity: 'data/entities/items/pickup/powder_stash.xml',
					offset_y: -2
				},
				{
					value_min: 1,
					value_max: 65,
					load_entity: 'data/entities/items/pickup/potion.xml',
					offset_y: -2
				}
			]
		},
		potion_spawnlist_liquidcave: {
			rnd_min: 1,
			rnd_max: 86,
			spawns: [
				{
					value_min: 83,
					value_max: 86,
					load_entity: 'data/entities/items/pickup/broken_wand.xml',
					offset_y: -2
				},
				{
					value_min: 77,
					value_max: 82,
					load_entity: 'data/entities/items/pickup/moon.xml',
					offset_y: -2
				},
				{
					value_min: 71,
					value_max: 76,
					load_entity: 'data/entities/items/pickup/thunderstone.xml',
					offset_y: -2
				},
				{
					value_min: 65,
					value_max: 70,
					load_entity: 'data/entities/items/pickup/brimstone.xml',
					offset_y: -2
				},
				{
					value_min: 59,
					value_max: 64,
					load_entity: 'data/entities/items/pickup/egg_monster.xml',
					offset_y: -2
				},
				{
					value_min: 56,
					value_max: 58,
					load_entity: 'data/entities/items/pickup/egg_slime.xml',
					offset_y: -2
				},
				{
					value_min: 53,
					value_max: 55,
					load_entity: 'data/entities/items/pickup/egg_fire.xml',
					offset_y: -2
				},
				{
					value_min: 50,
					value_max: 52,
					load_entity: 'data/entities/items/pickup/egg_purple.xml',
					offset_y: -2
				},
				{
					value_min: 1,
					value_max: 49,
					load_entity: 'data/entities/items/pickup/potion.xml',
					offset_y: -2
				}
			]
		}
	};

	// All of the g_* objects are mutable, so they must be
	// as object properties.
	g_items?: any;
	g_candles?: any;
	g_ghostlamp?: any;

	init(x?: number, y?: number, w?: number, h?: number) {

	}

	spawn(what: IProb[], x, y, rand_x?, rand_y?) {
		const x_offset = 5;
		const y_offset = 5;
		const v = this.random_from_table(what, x, y);
		if (v) {
			this.entity_load_camera_bound(
				v,
				x + x_offset,
				y + y_offset,
				rand_x,
				rand_y
			);
		}
	}

	spawn_with_limited_random(what: IProb[], x, y, rand_x, rand_y, entities_to_randomize: string[]) {
		let x_offset = 5;
		let y_offset = 5;

		let v = this.random_from_table(what, x, y);
		if (!v) {
			return;
		}
		let entity_files: string[] = [];
		let do_randomization = false;

		if (entities_to_randomize) {
			if (v.entity) {
				entity_files.push(v.entity);
			} else if (v.entities) {
				for (const entity_data of v.entities) {
					if (typeof entity_data === 'string') {
						entity_files.push(entity_data);
					} else {
						if (entity_data.entity) {
							entity_files.push(entity_data.entity);
						}
					}
				}
			}
			for (const entity_file of entity_files) {
				if (!entity_file) {
					continue;
				}
				let entity_name_xml = entity_file.split('/');
				let entity_name = entity_name_xml[entity_name_xml.length - 1].split('.')[0];
				if (entities_to_randomize.includes(entity_name)) {
					do_randomization = true;
				}
			}
		}

		let random_x = rand_x || 0;
		let random_y = rand_y || 0;

		if (do_randomization) {
			random_x += 4;
		}

		this.entity_load_camera_bound(v, x + x_offset, y + y_offset, random_x, random_y)
	};

	total_prob = (prob: IProbScene[], x: number): number => {
		return prob.reduce((c, p) => {
			if (p.prob) {
				if (p.spawn_check && !p.spawn_check()) {
					return c;
				}
				if (p.ngpluslevel && !this.check_newgame_plus_level(p.ngpluslevel)) {
					return c;
				}
				if (p.parallel && !this.check_parallel(p.parallel, x)) {
					return c;
				}
				return c.add(p.prob)
			}
			return c;
		}, new D(0)).toNumber();
	};

	check_newgame_plus_level(level: number) {
		const newgame_n = 0;
		// const newgame_n = SessionNumbersGetValue("NEW_GAME_PLUS_COUNT") || 0;
		return newgame_n >= level;
	}

	load_random_pixel_scene(what: IProbScene[], x: number, y: number) {
		let r = new D(
			this.randoms.ProceduralRandomf(x, y, 0, 1) * this.total_prob(what, x)
		);

		let last_element: IProbScene | undefined;
		for (let i = 0; i < what.length; i++) {
			const v = what[i];
			if (!v.prob) {
				continue;
			}
			if (r.greaterThan(v.prob)) {
				r = r.minus(v.prob);
				if (v.is_unique !== 1) {
					last_element = v;
				}
				continue;
			}
			if (!v.material_file && !v.visual_file && !v.background_file) {
				// -- loading empty pixelscene, don't do anything
				return;
			}
			const color_material_table = {};
			// -- Note( Petri ): I couldn't get this to work from lua... I don't know why. Lua is not really being all that helpful
			if (v.color_material) {
				this.randoms.SetRandomSeed(x + 11, y - 21);
				for (let [color, material] of Object.entries(v.color_material)) {
					let res: string;
					if (typeof material !== 'string') {
						res =
							material[
							Math.ceil(
								this.randoms.ProceduralRandomf(x + 11, y - 21, 0, 1) *
								material.length
							) - 1
							];
					} else {
						res = material;
					}
					color_material_table[color] = materials[res].color;
				}
			}
			let z_index = 50;
			if (v.z_index) {
				z_index = v.z_index;
			}
			this.LoadPixelScene(
				v.material_file!,
				v.visual_file!,
				x,
				y,
				v.background_file,
				false,
				false,
				color_material_table,
				z_index
			);
			if (v.is_unique) {
				what[i].prob = 0;
			}
			return;
		}

		this.err('ERROR ' + what.length + ', ' + what[0]['visual_file']);
		this.err(
			"ERROR - director_helpers.lua - load_random_pixel_scene() shouldn't reach here"
		);

		if (last_element) {
			if (
				!last_element.material_file &&
				!last_element.visual_file &&
				!last_element.background_file
			) {
				this.LoadPixelScene(
					last_element.material_file!,
					last_element.visual_file!,
					x,
					y
				);
			} else {
				this.err('ERROR ' + what.length);
				this.err(
					'ERROR - director_helpers.lua - load_random_pixel_scene() should it be loading a scene? '
				);
			}
		} else {
			this.err('ERROR ' + what.length);
			this.err(
				"ERROR - director_helpers.lua - load_random_pixel_scene() shouldn't reach here"
			);
		}
	}

	entity_load_camera_bound(
		entity_data: IProb,
		x: number,
		y: number,
		rand_x = 4,
		rand_y = 4
	) {
		if (entity_data.entities) {
			entity_data.entities.forEach((ev, j) => {
				if (typeof ev === 'object') {
					let count = 1;
					if (ev.min_count && ev.max_count) {
						count = this.randoms.ProceduralRandomf(
							x + j,
							y,
							ev.min_count,
							ev.max_count
						);
					}

					for (let i = 1; i <= count; i++) {
						let pos_x =
							x + this.randoms.ProceduralRandomf(x + j, y + i, -rand_x, rand_x);
						let pos_y =
							y + this.randoms.ProceduralRandomf(x + j, y + i, -rand_y, rand_y);
						if (ev.offset_y) {
							pos_y = pos_y + ev.offset_y;
						}
						if (ev.offset_x) {
							pos_x = pos_x + ev.offset_x;
						}
						this.HandleInterest(ev.entity!, pos_x, pos_y);
						// EntityLoadCameraBound(ev.entity, pos_x, pos_y)
					}
				} else if (ev) {
					let pos_x =
						x + this.randoms.ProceduralRandomf(x + j, y, -rand_x, rand_x);
					let pos_y =
						y + this.randoms.ProceduralRandomf(x + j, y, -rand_y, rand_y);
					// if (ev.offset_y) {
					// 	pos_y = pos_y + ev.offset_y
					// }
					// if (ev.offset_x) {
					// 	pos_x = pos_x + ev.offset_x
					// }
					this.HandleInterest(ev, pos_x, pos_y);
				}
			});
		}

		if (!entity_data.entity) {
			return;
		}

		const how_many = this.randoms.ProceduralRandomf(
			x,
			y,
			entity_data.min_count,
			entity_data.max_count
		);
		if (how_many <= 0) {
			return;
		}

		let pos_x = x;
		let pos_y = y;
		for (let i = 0; i < how_many; i++) {
			pos_x = x + this.randoms.ProceduralRandomf(x + i, y, -rand_x, rand_x);
			pos_y = y + this.randoms.ProceduralRandomf(x + i, y, -rand_y, rand_y);
			if (entity_data.offset_y) {
				pos_y = pos_y + entity_data.offset_y;
			}
			if (entity_data.offset_x) {
				pos_x = pos_x + entity_data.offset_x;
			}

			this.HandleInterest(entity_data.entity, pos_x, pos_y);
			// EntityLoadCameraBound(entity_data.entity, pos_x, pos_y)
		}
	}

	check_parallel(c, x) {
		if (c) {
			// TODO: parallel world
			// (return this.worldOffset !== 0);
			return false;
		}
		return false;
	}

	random_from_table(what: IProb[], x: number, y: number) {
		let r = new D(
			this.randoms.ProceduralRandomf(x, y, 0, 1) * this.total_prob(what, x)
		);
		for (const v of what) {
			if (v.prob) {
				if (v.spawn_check && !v.spawn_check()) {
					continue;
				}
				if (v.ngpluslevel && !this.check_newgame_plus_level(v.ngpluslevel)) {
					continue;
				}
				if (v.parallel && !this.check_parallel(v.parallel, x)) {
					continue;
				}
				if (r.lessThanOrEqualTo(v.prob)) {
					return v;
				}
				r = r.minus(v.prob);
			}
		}
	}

	GameHasFlagRun(flag) {
		return false;
	}
	HasFlagPersistent(flag) {
		return false;
	}

	spawn_mimic_sign(x: number, y: number) {
		this.LoadPixelScene(
			'data/biome_impl/mimic_sign.png',
			'data/biome_impl/mimic_sign_visual.png',
			x,
			y - 23,
			'',
			true,
			true
		);
	}

	spawn_heart(x: number, y: number) {
		let r = this.randoms.ProceduralRandomf(x, y, 0, 1);
		this.randoms.SetRandomSeed(x, y);
		let heart_spawn_percent = 0.7;
		const [year, month, day] = GameGetDateAndTimeLocal();
		if (month === 2 && day === 14) {
			heart_spawn_percent = 0.35;
		}

		if (r > heart_spawn_percent) {
			const entity = this.EntityLoad(
				'data/entities/items/pickup/heart.xml',
				x,
				y
			);
		} else if (r > 0.3) {
			this.randoms.SetRandomSeed(x + 45, y - 2123);
			let rnd = this.randoms.Random(1, 100);
			if (rnd <= 90 || y < 512 * 3) {
				rnd = this.randoms.Random(1, 1000);
				if (this.randoms.Random(1, 300) === 1) {
					this.spawn_mimic_sign(x, y);
				}
				if (rnd < 1000) {
					const entity = this.EntityLoad(
						'data/entities/items/pickup/chest_random.xml',
						x,
						y
					);
				} else {
					const entity = this.EntityLoad(
						'data/entities/items/pickup/chest_random_super.xml',
						x,
						y
					);
				}
			} else {
				rnd = this.randoms.Random(1, 100);
				if (this.randoms.Random(1, 30) === 1) {
					this.spawn_mimic_sign(x, y);
				}
				if (rnd <= 95) {
					const entity = this.EntityLoad(
						'data/entities/animals/chest_mimic.xml',
						x,
						y
					);
				} else {
					const entity = this.EntityLoad(
						'data/entities/items/pickup/chest_leggy.xml',
						x,
						y
					);
				}
			}
		}
	}

	EntityLoad(entity, x, y) {
		this.log('EntityLoad', entity, x, y);
		this.HandleInterest(entity, x, y);
	}

	constructor(
		public randoms: IRandom,
		public LoadPixelScene: TLoadPixelScene,
		public HandleInterest: THandleInterest,
		public BiomeMapGetVerticalPositionInsideBiome: TBiomeMapGetVerticalPositionInsideBiome,
		public RaytracePlatforms: TRaytracePlatforms,
		public config: IConfig
	) { }

	spawn_from_list(list: any, x: number, y: number) {
		this.randoms.SetRandomSeed(x + 425, y - 243);

		const spawnlist = this.spawnlists[list] || list;

		const rndmin = spawnlist.rnd_min || 0;
		const rndmax = spawnlist.rnd_max || 100;

		const rnd = this.randoms.Random(rndmin, rndmax);
		for (const data of spawnlist.spawns) {
			const vmin = data.value_min || rndmin;
			const vmax = data.value_max || rndmax;

			if (rnd >= vmin && rnd <= vmax) {
				if (
					data.spawn_requires_flag &&
					this.HasFlagPersistent(data.spawn_requires_flag) === false
				) {
					return;
				}

				const ox = data.offset_x || 0;
				const oy = data.offset_y || 0;

				if (data.load_entity_func) {
					data.load_entity_func(data, x, y);
					return;
				} else if (data.load_entity_from_list) {
					this.spawn_from_list(data.load_entity_from_list, x, y);
					return;
				} else if (data.load_entity) {
					this.EntityLoad(data.load_entity, x + ox, y + oy);
					return;
				}
			}
		}
	}

	spawn_wands(x: number, y: number) {
		if (!this.g_items) {
			this.err(
				`g_items needs to exist on class ${this.constructor.name}`
			);
			return;
		}
		this.spawn(this.g_items, x, y, 0, 0);
	}

	spawn_shopitem(x, y) {
		this.HandleInterest('ShopInfoProvider', x, y, [x, y, false, 10]);
	}

	spawn_candles(x: number, y: number) {
		if (!this.g_candles) {
			this.err(
				`g_candles needs to exist on class ${this.constructor.name}`
			);
			return;
		}
		this.spawn(this.g_candles, x - 5, y, 0, 0);
	}

	spawn_ghostlamp(x: number, y: number) {
		if (!this.g_ghostlamp) {
			this.err(
				`g_ghostlamp needs to exist on class ${this.constructor.name}`
			);
			return;
		}
		this.spawn(this.g_ghostlamp, x, y, 0, 0);
	}

	spawn_potions(x: number, y: number) {
		this.spawn_from_list('potion_spawnlist', x, y);
	}

	spawn_potion_altar(x: number, y: number) {
		const r = this.randoms.ProceduralRandomf(x, y, 0, 1);
		if (r > 0.65) {
			this.log('spawn_potion_altar', x, y);
			this.LoadPixelScene(
				'data/biome_impl/potion_altar.png',
				'',
				x - 5,
				y - 15,
				'',
				true
			);
		}
	}
	spawn_collapse(x, y) {
		this.EntityLoad('data/entities/misc/loose_chunks.xml', x, y);
	}
	spawn_moon(x, y) {
		this.EntityLoad('data/entities/buildings/moon_altar.xml', x, y);
	}
	spawn_wand_trap(x, y) {
		this.EntityLoad('data/entities/props/physics_trap_circle_acid.xml', x, y);
	}
	spawn_wand_trap_ignite(x, y) {
		this.EntityLoad('data/entities/props/physics_trap_ignite.xml', x, y);
	}
	spawn_wand_trap_electricity(x, y) {
		this.EntityLoad('data/entities/props/physics_trap_electricity.xml', x, y);
	}
	spawn_wand_trap_electricity_source(x, y) {
		this.EntityLoad(
			'data/entities/buildings/wand_trap_electricity.xml',
			x,
			y
		);
	}

	spawn_apparition(x, y) {
		this.randoms.SetRandomSeed(x, y);
		let PlaceItems1 = 1;
		let PlaceItems2 = 2;
		let Spawn = 3;

		let level = 0; // -- TODO: fetch biome level somehow
		let [state, apparition_entity_id] = [0, 0]; //  SpawnApparition(x, y, level) // TODO;

		// -- let r = ProceduralRandom(x + 5.352, y - 4.463)
		// -- if (r > 0.1) then

		let place_items = () => {
			for (let i = 1; i <= 4; i++) {
				let rx = x + this.randoms.Random(-10, 10);
				this.spawn_candles(rx, y);
			}
		};

		if (state === PlaceItems1 || state === PlaceItems2) {
			place_items();
			// print( tostring(x) .. ", " .. tostring(y) ) -- DEBUG:
		} else if (state === Spawn) {
			this.LoadPixelScene(
				'data/biome_impl/grave.png',
				'data/biome_impl/grave_visual.png',
				x - 10,
				y - 15,
				'',
				true
			);
		}
		// --[[
		// GamePrint( "___________________________" )
		// GamePrint( "" )
		// GamePrint( "A chill runs up your spine!" )
		// GamePrint( "___________________________" )
		// --]]
		// print( tostring(x) .. ", " .. tostring(y) ) -- DEBUG:
	}

	handle(f: string, x: number, y: number, w, h, is_open_path) {
		if (!this[f]) {
			this.err(`${f} not implemented for ${this.constructor.name}`);
			return;
		}
		if (this.config.funcs && !this.config.funcs.includes(f)) {
			return;
		}
		// console.group(`${f} ${x} ${y}`);
		this.debug && console.group(`${f} ${x} ${y} ${w} ${h} ${is_open_path}`);
		if (f === 'spawn_potion_altar') {
		} else {
		}
		this[f](x, y, w, h, is_open_path);
		this.debug && console.groupEnd();
	}

	log(...args) {
		this.debug && console.log(...args);
	}
	warn(...args) {
		this.debug && console.warn(...args);
	}
	err(...args) {
		console.error(...args);
	}
}
