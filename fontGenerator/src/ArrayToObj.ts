import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const root = path.resolve(__dirname, '../../src/services/SeedInfo/data');

interface IConfig {
	src: string;
	dest: string;
	id: string;
}

const configs: IConfig[] = [
	{
		src: path.resolve(root, 'perks_new.json'),
		dest: path.resolve(root, 'obj', 'perks.json'),
		id: 'id'
	},
	{
		src: path.resolve(root, 'biome_modifiers.json'),
		dest: path.resolve(root, 'obj', 'biome_modifiers.json'),
		id: 'id'
	},
	{
		src: path.resolve(root, 'biome_names.json'),
		dest: path.resolve(root, 'obj', 'biome_names.json'),
		id: 'id'
	},
	{
		src: path.resolve(root, 'spells.json'),
		dest: path.resolve(root, 'obj', 'spells.json'),
		id: 'id'
	},
];

(async () => {
	for (const config of configs) {
		const data: any[] = JSON.parse(fs.readFileSync(config.src).toString());
    const out: any = {};
    for (const d of data) {
      out[d[config.id]] = d;
    }
		fs.writeFileSync(config.dest, JSON.stringify(out, null, 2));
	}
})();

export {};
