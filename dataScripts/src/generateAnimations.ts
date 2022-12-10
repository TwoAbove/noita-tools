import fs from 'fs';
import util from 'util';
import path from 'path';
import Jimp from 'jimp';
import sharp from 'sharp';
import _ from 'lodash';
import { parseStringPromise } from 'xml2js';

const recursiveReaddir = require('recursive-readdir');
const DOMParser = require('xmldom').DOMParser;

import { GifFrame, GifUtil, GifCodec, JimpBitmap, BitmapImage } from 'gifwrap';

const codec = new GifCodec();

const makeGif = async (inFrames: GifFrame[]) => {
	return codec.encodeGif(inFrames, { loops: 0 });
};

const noitaData = path.resolve(
	require('os').homedir(),
	'.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/'
);

const getJimp = (p: string) => Jimp.read(path.resolve(noitaData, p));

function memo(cache: any) {
	return async (key: string, fn: (...args: any[]) => Promise<any>) => {
		if (cache[key]) {
			return cache[key];
		}
		cache[key] = await fn();
		return cache[key];
	};
}

const tryRead = (path: string, fallback?: string) => {
	try {
		return fs.readFileSync(path);
	} catch (e) {
		if (fallback || fallback === '') {
			return fallback;
		}
		throw e;
	}
};

const parseTag = (obj: any, key: string) => {
	if (obj[key]) {
		if (obj[key].includes && obj[key].includes(',')) {
			obj[key] = obj[key].split(',');
		} else {
			obj[key] = [obj[key]];
		}
	}
};
const iterate = async (
	obj: any,
	fn: (obj: any, key: string, val: any) => Promise<void>
) => {
	for (const key of Object.keys(obj)) {
		if (typeof obj[key] === 'object' && obj[key] !== null) {
			await iterate(obj[key], fn);
		}
		await fn(obj, key, obj[key]);
	}
};

const tryNumber = (n: string) => {
	if (n === '') {
		return n;
	}
	return isNaN(Number(n)) ? n : Number(n);
};

const parseObj = (obj: any) => {
	if (!obj) {
		return {};
	}
	const res: any = {};
	for (const key of Object.keys(obj)) {
		res[key] = tryNumber(obj[key]);
	}
	return res;
};

(async () => {
	const entityMemo = memo({});
	const spriteMemo = memo({});

	const entities: { [id: string]: IVisualData } = {};
	let files = await recursiveReaddir(path.resolve(noitaData, 'data/entities'), [
		'*.png',
		'*.lua',
		'*.txt'
	]);
	files = files.filter((f: any) => !f.includes('data/entities/_debug'));
	// files = [
	// 	// path.resolve(noitaData, 'data/entities/items/pickup/bloodmoney_200000.xml'),
	// 	// path.resolve(noitaData, 'data/entities/items/pickup/chest_random.xml'),
	// 	// path.resolve(noitaData, 'data/entities/props/furniture_table.xml'),
	// 	// path.resolve(noitaData, 'data/entities/props/physics/minecart.xml'),
	// 	// path.resolve(noitaData, 'data/entities/animals/zombie.xml'),
	// 	// path.resolve(noitaData, 'data/entities/base_torch.xml')
	// 	// path.resolve(noitaData, 'data/entities/animals/tank_super.xml')
	// 	path.resolve(noitaData, 'data/entities/misc/custom_cards/bomb.xml')
	// 	// path.resolve(noitaData, 'data/entities/items/pickup/egg_slime.xml'),
	// ];

	const getEntity = async (entityData: any): Promise<any> => {
		let entity: any = {};
		let baseEntity: any = {};
		if (entityData.Base) {
			for (const B of entityData.Base) {
				const seb = (await entityMemo(B.$.file, () =>
					parseStringPromise(tryRead(path.resolve(noitaData, B.$.file), ''))
				)).Entity;
				const subEntityBase = await getEntity(seb);
				const subEntityChildren = await getEntity(B);
				baseEntity = _.merge(baseEntity, subEntityBase, subEntityChildren);
			}
		}

		entity = parseObj(entityData.$);
		if (entity.tags) {
			parseTag(entity, 'tags');
		}

		for (const k of [
			'UIInfoComponent',
			'PhysicsImageShapeComponent',
			'PixelSpriteComponent',
			'PhysicsJointComponent',
			'PhysicsJoint2MutatorComponent',
			'PhysicsJoint2Component',
			'SpriteComponent',
			'ItemComponent',
			'ItemChestComponent',
			'HitboxComponent',
			'SpriteParticleEmitterComponent',
			'AbilityComponent'
		]) {
			if (!entityData[k]) {
				continue;
			}
			entity[k] = [];
			for (const c of entityData[k]) {
				const data = parseObj(c.$);
				if (data._tags) {
					parseTag(data, '_tags');
				}
				entity[k].push(data);
			}
		}

		const customizer = (objValue: any, srcValue: any) => {
			if (_.isArray(objValue)) {
				return objValue.concat(srcValue);
			}
		};

		return _.mergeWith(baseEntity, entity, customizer);
	};

	const cut = (image: Jimp, x: any, y: any, w: any, h: any) => {
		try {
			return image.clone().crop(x, y, w, h);
		} catch (e) {
			return new Jimp(w, h, 0x00000000);
		}
	};

	interface IVisualData {
		default: string;
		config?: any;
		actions: {
			[action: string]: { src: string[]; config: any };
		};
	}

	const parsePhysics = async (entityData: any): Promise<IVisualData> => {
		const img = await getJimp(
			entityData.PhysicsImageShapeComponent[0].image_file
		);

		return {
			default: 'default',
			config: entityData.PhysicsImageShapeComponent[0],
			actions: {
				default: {
					src: [await img.getBase64Async(Jimp.MIME_PNG)],
					config: {
						static: true
					}
				}
			}
		};
	};

	const parsePixelSprite = async (entityData: any): Promise<IVisualData> => {
		const img = await getJimp(entityData.PixelSpriteComponent[0].image_file);
		return {
			default: 'default',
			actions: {
				default: {
					src: [await img.getBase64Async(Jimp.MIME_PNG)],
					config: {
						static: true
					}
				}
			}
		};
	};

	const parseItemComponent = async (entityData: any): Promise<IVisualData> => {
		const img = await getJimp(entityData.ItemComponent[0].ui_sprite);

		return {
			default: 'default',
			actions: {
				default: {
					src: [await img.getBase64Async(Jimp.MIME_PNG)],
					config: {
						static: true
					}
				}
			}
		};
	};

	interface FrameBreakdown {
		config: any;
		just_png?: boolean;
		actions: {
			[action: string]: { config: any; frames: Jimp[] };
		};
	}
	const makeBreakdown = async (spriteData: any): Promise<FrameBreakdown> => {
		const out: FrameBreakdown = {
			config: parseObj(spriteData.Sprite.$),
			actions: {}
		};

		const {
			filename,
			offset_x,
			offset_y,
			default_animation
		} = spriteData.Sprite.$;

		const img = await getJimp(filename);

		if (!spriteData.Sprite.RectAnimation) {
			// No animations, so just save the image?
			// ex: data/buildings_gfx/arrowtrap_left.xml
			out.just_png = true;
			out.config.default_animation = 'default';
			out.actions = {
				default: {
					config: {},
					frames: [await getJimp(spriteData.Sprite.$.filename)]
				}
			};
			return out;
		}

		for (const Rect of spriteData.Sprite.RectAnimation) {
			const config = parseObj(Rect.$);
			// console.log(Rect);
			if (!config.frame_count) {
				continue;
			}

			const frames: Jimp[] = [];

			for (let i = 0; i < config.frame_count; i++) {
				const f = cut(
					img,
					config.pos_x + config.frame_width * i,
					config.pos_y,
					config.frame_width,
					config.frame_height
				);
				frames.push(f);
			}

			out.actions[config.name] = { config, frames };
		}

		return out;
	};

	const parseSprite = async (breakdown: any): Promise<IVisualData> => {
		const out: IVisualData = {
			default: breakdown.config.default_animation,
			actions: {}
		};

		if (breakdown.just_png) {
		}

		for (const key of Object.keys(breakdown.actions).filter(
			k => k !== 'config'
		)) {
			const { frames, config } = breakdown.actions[key];
			const {
				frame_count,
				frame_height,
				frame_wait,
				frame_width,
				frames_per_row,
				name,
				pos_x,
				pos_y,
				shrink_by_one_pixel
			} = config;

			if (!frame_count) {
				continue;
			}
			out.actions[name] = {
				config: {
					frame_count,
					frame_wait
				},
				src: []
			};
			for (const frame of frames) {
				out.actions[name].src.push(await frame.getBase64Async(Jimp.MIME_PNG));
			}
		}
		return out;
	};

	const parseSpriteArray = async (
		breakdowns: FrameBreakdown[]
	): Promise<IVisualData> => {
		// console.log(util.inspect(breakdowns, undefined, 4, true));
		const default_animations = _.uniq(
			breakdowns.reduce<string[]>((c, r) => {
				c.push(r.config.default_animation);
				return c;
			}, [])
		);

		if (default_animations.length > 1) {
			// console.log(breakdowns);
		}

		const out: IVisualData = {
			default: default_animations[0],
			actions: {}
		};

		const actionKeys = _.union(breakdowns.flatMap(b => Object.keys(b.actions)));
		for (const actionKey of actionKeys) {
			const actions = breakdowns
				.flatMap(b => b.actions[actionKey])
				.filter(Boolean);
			// Assuming all configs are the same
			const { frame_count, frame_wait } = actions[0].config;
			out.actions[actionKey] = {
				config: {
					frame_count,
					frame_wait
				},
				src: []
			};
			for (let i = 0; i < frame_count; i++) {
				const frame = actions.reduce<Jimp>((c, r) => {
					if (r.frames[i]) {
						return c.composite(r.frames[i], 0, 0);
					}
					return c;
				}, new Jimp(actions[0].config.frame_width, actions[0].config.frame_height));
				out.actions[actionKey].src.push(
					await frame.getBase64Async(Jimp.MIME_PNG)
				);
			}
		}
		return out;
	};

	const parsePNGSpriteComponent = async (
		entityData: any
	): Promise<IVisualData> => {
		let path: string = entityData.SpriteComponent[0].image_file;
		if (path.startsWith('data/temp')) {
			// don't handle this
			return {
				default: '',
				actions: {}
			};
		}
		const range = /\$\[(\d*)-(\d)\]/;
		const r = range.exec(path);
		if (r) {
			// just get one from the range
			const number = r[1];
			path = path.replace(range, number);
		}
		path = path.toLocaleLowerCase();

		const img = await getJimp(path);

		return {
			default: 'default',
			config: entityData.SpriteComponent[0],
			actions: {
				default: {
					src: [await img.getBase64Async(Jimp.MIME_PNG)],
					config: {
						static: true
					}
				}
			}
		};
	};
	const parseXMLSpriteComponent = async (
		entityData: any
	): Promise<IVisualData> => {
		const out: IVisualData = { default: '', actions: {} };

		let composite;
		let breakdowns: FrameBreakdown[] = [];

		for (const Sprite of entityData.SpriteComponent) {
			const uiElements = ['health_bar', 'ui', 'aiming_reticle'];
			if (_.intersection(Sprite._tags, uiElements).length) {
				continue;
			}
			const player_elements = [
				'lukki_enable',
				'player_amulet',
				'player_amulet_gem',
				'player_hat',
				'player_hat2',
				'player_hat2_shadow'
			];
			if (_.intersection(Sprite._tags, player_elements).length) {
				continue;
			}
			const other = ['driver'];
			if (_.intersection(Sprite._tags, other).length) {
				continue;
			}
			// TODO: handle emissive and additive
			if (Sprite.emissive || Sprite.additive) {
				continue;
			}
			if (!Sprite.image_file) {
				continue;
			}
			if (Sprite._enabled === '0' || Sprite._enabled === 0) {
				continue;
			}
			if (!Sprite.image_file.endsWith('.xml')) {
				// TODO: Handle mixed content
				continue;
			}
			const spriteData = await parseStringPromise(
				tryRead(path.resolve(noitaData, Sprite.image_file), '')
			);
			if (!spriteData) {
				continue;
			}
			breakdowns.push(await makeBreakdown(spriteData));
		}
		if (breakdowns.length === 1) {
			return parseSprite(breakdowns[0]);
		}

		if (breakdowns.length > 1) {
			return parseSpriteArray(breakdowns);
		}

		return out;
	};

	const parseSpriteComponent = async (
		entityData: any
	): Promise<IVisualData> => {
		// Looking through lots of SpriteComponents,
		// it's either animations (.xml) or static images (.png)
		// There are weird multi-component entities like worms
		// that I couldn't figure out how they combine the sprite components
		// to make the worm. They are currently broken.

		const isPng = entityData.SpriteComponent[0].image_file.endsWith('.png');

		if (isPng) {
			return parsePNGSpriteComponent(entityData);
		}
		return parseXMLSpriteComponent(entityData);
	};

	const parsePixelSpriteComponent = async (
		entityData: any
	): Promise<IVisualData> => {
		return parsePixelSprite(entityData);
	};

	const parsePhysicsComponent = async (
		entityData: any
	): Promise<IVisualData> => {
		return parsePhysics(entityData);
	};

	const parseEntity = async (entityData: any): Promise<any> => {
		const entity = await getEntity(entityData.Entity);
		const out: any = {};
		let animations;
		// Use "enabled_in_hand" tagged assets only
		// Hack: all gold have an ItemComponent, but it's the same.
		// Also, fortunately, all of their ui_description is unique
		if (
			entity.ItemComponent &&
			entity.ItemComponent[0].ui_sprite &&
			entity.ItemComponent[0].ui_description !== 'Lorem ipsum'
		) {
			animations = await parseItemComponent(entity);
		} else if (entity.SpriteComponent) {
			animations = await parseSpriteComponent(entity);
		} else if (entity.PixelSpriteComponent) {
			animations = await parsePixelSpriteComponent(entity);
		} else if (
			entity.PhysicsImageShapeComponent &&
			entity.PhysicsImageShapeComponent[0].image_file
		) {
			animations = await parsePhysicsComponent(entity);
		} else {
			animations = null;
		}
		if (animations) {
			out.animations = animations;
		}

		if (entity.ItemComponent) {
			const name = entity.ItemComponent[0].item_name;
			if (name) {
				out.name = name;
			}
		}

		if (entity.AbilityComponent) {
			const ui_name = entity.AbilityComponent[0].ui_name;
			if (ui_name) {
				out.ui_name = ui_name;
			}
		}

		return out;
	};

	for (let val of files) {
		val = val.substring(noitaData.length + 1);
		console.log(val);
		if (entities[val]) {
			// Already parsed this entity
			return;
		}
		const entityXMLPath = path.resolve(noitaData, val);
		if (fs.existsSync(entityXMLPath)) {
			const entityData = await entityMemo(val, () =>
				parseStringPromise(tryRead(entityXMLPath, ''))
			);
			if (!entityData) {
				continue;
			}
			let entity;
			if (entityData.Entity) {
				entity = await parseEntity(entityData);
			} else if (entityData.Sprite) {
				entity = {
					animations: await parseSprite(await makeBreakdown(entityData))
				};
			}
			if (entity) {
				entities[val] = entity;
			}
		}
	}
	// console.log(entities)
	fs.writeFileSync(
		path.resolve(__dirname, 'entities.json'),
		JSON.stringify(entities, null, 2)
	);
})();
