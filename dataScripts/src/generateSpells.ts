import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

import spells from './toJs2';

const root = path.resolve(__dirname, '../../src/services/SeedInfo/data');

const noitaData = path.resolve( require('os').homedir(), 	'.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/'
);
const translationFile = path.resolve(require('os').homedir(), '.steam/debian-installation/steamapps/common/Noita/data/translations/common.csv'
);

const translationCSV = fs.readFileSync(translationFile).toString();

const translation: { [id: string]: string } = {};

translationCSV.split('\n').forEach((row, i) => {
	if (!i) {
		// csv col definitions
		return;
	}
	const items = row.split(',');

	translation[items[0]] = items[1];
});

(async () => {
	const newSpells: any[] = [];

	for (const spell of spells as any[]) {
		await new Promise<void>(res => {
			const img = fs.readFileSync(path.resolve(noitaData, spell.sprite));
			Jimp.read(img, (err, image) => {
				image.getBase64(Jimp.MIME_PNG, (err, src) => {
					const s = {
						...spell,
						sprite: src,
						name: translation[spell.name.replace('$', '')],
						description: translation[spell.description.replace('$', '')]
					};
					const spawnLevels = s.spawn_level.split(',');
					const spawnProbabilities = s.spawn_probability.split(',');
					s.spawn_probabilities = {};
					for (let i = 0; i < spawnLevels.length; i++) {
						s.spawn_probabilities[spawnLevels[i]] = Number(
							spawnProbabilities[i]
						);
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
		path.resolve(root, 'spells.new.json'),
		JSON.stringify(newSpells, null, 2)
	);

	fs.writeFileSync(
		path.resolve(root, 'obj/spells.new.json'),
		JSON.stringify(out, null, 2)
	);

})();
