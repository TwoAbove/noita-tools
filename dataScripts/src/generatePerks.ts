import fs from 'fs';
import util from 'util';
import path from 'path';
import Jimp from 'jimp';
import parser from 'luaparse';
import {parseAST} from './ast';

// const { parse: parseLua } = require('luaparse')

const { format, parse } = require('lua-json');
const root = path.resolve(__dirname, '../../src/services/SeedInfo/data');

const noitaData = path.resolve(require('os').homedir(), '.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/'
);

const perkPath = path.resolve(noitaData, "data/scripts/perks/perk_list.lua");

const perkFile = fs.readFileSync(perkPath).toString();

// const perks = parse(perkFile);
const data = parseAST( parser.parse(perkFile, { wait: false }));

const perks = data.perk_list;

// console.log(util.inspect(perks, false, null, true));

const getImage = async (path: any) => {
	return new Promise((res, rej) => {
		Jimp.read(path, (err, image) => {
			if (err) {
				return rej(err);
			}
			image.autocrop().getBase64(Jimp.MIME_PNG, (err, src) => {
				res(src);
			});
		});
	});
}

(async () => {
	const newPerks: any[] = [];

	for (const perk of perks as any[]) {
		await new Promise<void>(async res => {
			const s = {
				...perk,
				ui_icon: await getImage(fs.readFileSync(path.resolve(noitaData, perk.ui_icon))),
				perk_icon: await getImage(fs.readFileSync(path.resolve(noitaData, perk.perk_icon)))
			};
			newPerks.push(s);
			res();
		});
	}

	const out: any = {};

	for (const d of newPerks) {
		out[d.id] = d;
	}

	fs.writeFileSync(
		path.resolve(__dirname, 'perks.new.json'),
		JSON.stringify(newPerks, null, 2)
	);

	fs.writeFileSync(
		path.resolve(__dirname, 'perks.new.obj.json'),
		JSON.stringify(out, null, 2)
	);
})();
