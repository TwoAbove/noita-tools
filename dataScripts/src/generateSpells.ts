import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

import spells from './toJs3';

const root = path.resolve(__dirname, '../../src/services/SeedInfo/data');

const noitaData = path.resolve(require('os').homedir(), '.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/'
);

const spellPath = path.resolve(noitaData, "data/scripts/gun/gun_actions.lua");

(async () => {
	const newSpells: any[] = [];

	for (const spell of spells as any[]) {
		await new Promise<void>(res => {
			const p = path.resolve(noitaData, spell.sprite);
			if (!fs.existsSync(p)) {
				return res();
			}
			const img = fs.readFileSync(p);
			Jimp.read(img, (err, image) => {
				image.getBase64(Jimp.MIME_PNG, (err, src) => {
					const s = {
						...spell,
						sprite: src
					};
					const spawnLevels = s.spawn_level.split(',');
					const spawnProbabilities = s.spawn_probability.split(',');
					s.spawn_probabilities = {};
					for (let i = 0; i < spawnLevels.length; i++) {
						const probability = Number(
							spawnProbabilities[i]
						)
						if (probability) {
							s.spawn_probabilities[spawnLevels[i]] = probability;
						}
					}
					newSpells.push(s);
					res();
				});
			});
		});
	}

	const out: any = {};

	for (const d of newSpells) {
		out[d.id] = d;
	}

	fs.writeFileSync(
		path.resolve(__dirname, 'spells.new.json'),
		JSON.stringify(newSpells, null, 2)
	);

	fs.writeFileSync(
		path.resolve(__dirname, 'spells.new.obj.json'),
		JSON.stringify(out, null, 2)
	);
})();
