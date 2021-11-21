import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const src = path.resolve(
	__dirname,
	'../..',
	'src/services/SeedInfo/data/spells.json'
);
const noitaData = path.resolve(
	'/home/twoabove/.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/'
);

(async () => {
	const spells: any[] = JSON.parse(fs.readFileSync(src).toString());
	const newSpells: any[] = [];

	for (const spell of spells) {
		await new Promise<void>(res => {
			const img = fs.readFileSync(path.resolve(noitaData, spell.sprite));
			Jimp.read(img, (err, image) => {
				image.getBase64(Jimp.MIME_PNG, (err, src) => {
					newSpells.push({ ...spell, sprite: src });
					res();
				});
			});
		});
	}

	console.log('newSpells', newSpells);

	fs.writeFileSync(
		path.resolve(__dirname, 'new.json'),
		JSON.stringify(newSpells, null, 2)
	);
})();
