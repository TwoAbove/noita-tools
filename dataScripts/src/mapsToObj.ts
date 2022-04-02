import fs from 'fs';
import util from 'util';
import path from 'path';
import Jimp from 'jimp';
import _ from 'lodash';
import { parseStringPromise } from 'xml2js';
import parser, {
	AssignmentStatement,
	Expression,
	NumericLiteral,
	StringLiteral,
	TableConstructorExpression
} from 'luaparse';
import { parse } from 'csv-parse/sync';

// https://github.com/Dadido3/noita-mapcap

const argbTorgba = (s: string) =>
	s
		.replace('0x', '')
		.replace(/(..)(......)/, '$2$1')
		.toLowerCase();

const noitaData = path.resolve(
	require('os').homedir(),
	'.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/'
);
const defaultColorsPath = path.resolve(
	noitaData,
	'data/scripts/wang_scripts.csv'
);

const defaultColorArray: any[] = parse(fs.readFileSync(defaultColorsPath), {
	columns: true,
	skip_empty_lines: true
});
const colors = defaultColorArray.reduce((o, c) => {
	const color = argbTorgba(c['#COLOR']);
	o[color] = c['#FUNCTION_NAME'];
	return o;
}, {});

const biomeDataXMLPath = path.resolve(noitaData, 'data/biome/_biomes_all.xml');

const getBase64 = (p: string) =>
	new Promise<{ src: string; width: number; height: number }>((res, rej) =>
		Jimp.read(p, (err, image) => {
			if (err) {
				return rej(err);
			}

			image.autocrop().getBase64(Jimp.MIME_PNG, (err, src) => {
				if (err) {
					return rej(err);
				}
				res({
					src,
					width: image.getWidth(),
					height: image.getHeight()
				});
			});
		})
	);

const parseLua = (script: string) => {
	const ast = parser.parse(script, { wait: false });
	return ast;
};

const getTable = (ex: TableConstructorExpression) => {
	const res = [];
	for (const e of ex.fields) {
		if (
			e.type === 'TableValue' &&
			e.value.type === 'TableConstructorExpression'
		) {
			const o: any = {};
			for (const field of e.value.fields) {
				if (field.type === 'TableKeyString') {
					let key = field.key.name;
					let val;
					switch (field.value.type) {
						case 'NumericLiteral': {
							val = field.value.value;
							break;
						}
						case 'StringLiteral': {
							val = field.value.raw.replaceAll('"', '');
							break;
						}
						case 'UnaryExpression': {
							if (field.value.operator === '-') {
								if (field.value.argument.type !== 'NumericLiteral') {
									console.log('Unhandled type: ', field);
									break;
								}
								val = -field.value.argument.value;
							}
							break;
						}
						case 'Identifier': {
							// Assignment, don't think I need to handle this
							break;
						}
						case 'FunctionDeclaration': {
							// Function, don't think I need to handle this
							break;
						}
						case 'TableConstructorExpression': {
							val = getTable(field.value);
							break;
						}
						default: {
							console.log('Unhandled type: ', field);
						}
					}
					o[key] = val;
				}
			}
			res.push(o);
		}
	}
	return res;
};
(async () => {
	const allBiomeData = (await parseStringPromise(
		fs.readFileSync(biomeDataXMLPath)
	)).BiomesToLoad;
	const maps: any = {};
	for (const b of allBiomeData.Biome) {
		const { biome_filename, height_index, color } = b.$;
		const biome_path = path.resolve(noitaData, biome_filename);
		const name = path.basename(biome_path, '.xml');
		const { Topology: _T, Materials: _M } = (await parseStringPromise(
			fs.readFileSync(biome_path)
		)).Biome;
		const Topology = _T[0].$;

		const res: any = {
			height_index,
			color: argbTorgba(color),
			name,
			translateName: Topology.name,
			type: Topology.type,
			lua_script: Topology.lua_script
		};
		if (res.type === 'BIOME_WANG_TILE' && Topology.wang_template_file) {
			const data = Topology.wang_template_file
				? await getBase64(
					path.resolve(noitaData, Topology.wang_template_file)
				)
				: null;
			res.wang = {
				template_file: data?.src,
				map_width: data?.width,
				wang_map_width: Number(Topology.wang_map_width),
				map_height: data?.height,
				wang_map_height: Number(Topology.wang_map_height)
			};
		}
		if (res.lua_script) {
			const lua_things = parseLua(
				fs.readFileSync(path.resolve(noitaData, res.lua_script)).toString()
			);
			const o: any = {
				spawnFunctions: {}
			};
			for (const statement of lua_things.body) {
				switch (statement.type) {
					case 'AssignmentStatement': {
						if (
							statement.init[0].type === 'TableConstructorExpression' &&
							statement.variables[0].type === 'Identifier'
						) {
							// tables
							const name = statement.variables[0].name;
							const table = getTable(statement.init[0]);
							o[name] = table;
						}
						if (
							statement.variables[0].type === 'Identifier' &&
							statement.variables[0].name === 'CHEST_LEVEL'
						) {
							// chest
							o.chestLevel = (statement.init[0] as NumericLiteral).value;
						}
						break;
					}
					case 'CallStatement': {
						if (
							statement.expression.type === 'CallExpression' &&
							statement.expression.base.type === 'Identifier'
						) {
							if (statement.expression.base.name === 'RegisterSpawnFunction') {
								const args = statement.expression.arguments;
								let color = argbTorgba((args[0] as NumericLiteral).raw);
								const val = (args[1] as StringLiteral).raw.replaceAll('"', '');
								o.spawnFunctions[color] = val;
							}
						}
						break;
					}
				}
			}
			o.spawnFunctions = { ...colors, ...o.spawnFunctions };
			res.config = o;
		}
		maps[res.color] = res;
	}

	fs.writeFileSync(
		path.resolve(__dirname, './maps.json'),
		JSON.stringify(maps, null, 2)
	);

	function memo(cache: any) {
		return async (key: string, fn: (...args: any[]) => Promise<any>) => {
			if (cache[key]) {
				return cache[key];
			}
			cache[key] = await fn();
			return cache[key];
		};
	}

	const spriteMemo = memo({});

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

	const parseTag = (obj: any, key: string) => {
		if (obj[key]) {
			if (obj[key].includes && obj[key].includes(',')) {
				obj[key] = obj[key].split(',');
			} else {
				obj[key] = [obj[key]];
			}
		}
	};

	const parseSprite = async (p: string) => {
		if (!p.endsWith('xml')) {
			return;
		}
		const spriteData = (await spriteMemo(p, () =>
			parseStringPromise(fs.readFileSync(path.resolve(noitaData, p)))
		)).Sprite;

		const sprite = parseObj(spriteData.$);
		if (spriteData.RectAnimation) {
			sprite.animations = spriteData.RectAnimation.map((R: any) => {
				// Save only the "default" animation;
				const animation = R.$;
				if (animation.name === sprite.default_animation) {
					const a = parseObj(animation);
					return a;
				}
				return false;
			}).filter(Boolean);
		}

		if (sprite.filename) {
			sprite.filename = (await getBase64(
				path.resolve(noitaData, sprite.filename)
			));
		}

		return sprite;
	};

	const entityMemo = memo({});

	const parseEntity = async (entityData: any): Promise<any> => {
		let entity: any = {};
		let baseEntity: any = {};
		if (entityData.Base && entityData.Base[0].$.file) {
			const seb = (await entityMemo(entityData.Base[0].$.file, () =>
				parseStringPromise(
					fs.readFileSync(path.resolve(noitaData, entityData.Base[0].$.file))
				)
			)).Entity;
			const subEntityBase = await parseEntity(seb);
			const subEntityChildren = await parseEntity(entityData.Base[0]);
			baseEntity = _.assign({}, subEntityBase, subEntityChildren);
		}
		entity = parseObj(entityData.$);
		if (entity.tags) {
			parseTag(entity, 'tags');
		}

		if (entityData.ItemChestComponent) {
			entity.chestComponent = parseObj(entityData.ItemChestComponent[0].$);
		}

		if (entityData.DamageModelComponent) {
			entity.damageModelComponent = parseObj(
				entityData.DamageModelComponent[0].$
			);
			parseTag(entity.damageModelComponent, 'materials_that_damage');
			parseTag(entity.damageModelComponent, 'materials_how_much_damage');
		}

		if (entityData.SpriteComponent) {
			const sprite = parseObj(entityData.SpriteComponent[0].$);
			if (sprite.image_file) {
				const s = await parseSprite(sprite.image_file);
				sprite.image = s;
			}
			if (sprite._tags) {
				parseTag(sprite, '_tags');
			}
			entity.sprite = sprite;
		}

		const res = {
			..._.assign({}, baseEntity, entity),
			tags: _.merge([], baseEntity.tags, entity.tags)
		};
		if (entity.sprite && entity.sprite.additive) {
			res.sprite = _.flattenDeep([baseEntity.sprite, entity.sprite]);
		}

		return res;
	};

	const entities: any = {};

	await iterate(maps, async (obj, key, val) => {
		if (key !== 'entity') {
			return;
		}
		if (val === '') {
			return;
		}
		if (entities[val]) {
			// Already parsed this entity
			return;
		}
		const entityXMLPath = path.resolve(noitaData, val);
		if (fs.existsSync(entityXMLPath)) {
			const entityData = (await entityMemo(val, () =>
				parseStringPromise(fs.readFileSync(entityXMLPath))
			)).Entity;
			const entity = await parseEntity(entityData);
			entities[val] = entity;
		}
	});
	// console.log(util.inspect(entities, false, null, true));
	fs.writeFileSync(
		path.resolve(__dirname, './entities.json'),
		JSON.stringify(entities, null, 2)
	);
})();
export { };
