import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import { forEach } from 'lodash';

import glob from 'glob';

const noitaData = path.resolve(
	require('os').homedir(),
	'.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/'
);
// Add to these when transferring map impl from Noita.

const additional = [
	'data/biome_impl/wand_altar.png',
	'data/biome_impl/potion_altar.png',
	'data/biome_impl/mimic_sign.png',
	'data/biome_impl/snowcastle/chamfer_top_r.png',
	'data/biome_impl/snowcastle/chamfer_inner_bottom_r.png',
	'data/biome_impl/wand_altar_vault.png',
	'data/biome_impl/snowcastle/pillar_filler_01.png'
];

const exportImpl = async () => {
	const impls: any = {};
	const files = new Set<string>();
	await new Promise<void>((r) => {
		glob(
			'*/biome_impl/**/*.png',
			{ cwd: noitaData, root: noitaData },
			(err: any, ff: string[]) => {
				for (const f of ff) {
					files.add(f);
				}
				r();
			}
		);
	})

	for (const scene of [...files.values()]) {
		try {
			const png = await Jimp.read(path.resolve(noitaData, scene));
			impls[scene] = {
				src: await png.getBase64Async(Jimp.MIME_PNG),
				w: png.getWidth(),
				h: png.getHeight()
			};
		} catch (e) {
			console.log(scene, 'failed:', e);
		}
	}
	return impls;
};
// const exportImpl = async (maps: any) => {
// 	const impls: any = {};
// 	const scenes = new Set<string>();

// 	const traverse = (obj: any) => {
// 		for (let k in obj) {
// 			if (obj.hasOwnProperty(k) && obj[k] && typeof obj[k] === 'object') {
// 				traverse(obj[k])
// 			} else {
// 				if (k === 'material_file') {
// 					if (obj[k]) {
// 						scenes.add(obj[k]);
// 					}
// 				}
// 				// Do something with obj[k]
// 			}
// 		}
// 	}
// 	traverse(maps);
// 	for (const scene of [...scenes, ...additional]) {
// 		const png = await Jimp.read(path.resolve(noitaData, scene));
// 		impls[scene] = {
// 			src: await png.getBase64Async(Jimp.MIME_PNG),
// 			w: png.getWidth(),
// 			h: png.getHeight()
// 		};
// 	}
// 	return impls;
// }
export default exportImpl;
