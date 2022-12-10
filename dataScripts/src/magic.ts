import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

import spells from '../../src/services/SeedInfo/data/spells.json';
console.log(spells.findIndex(s => s.spawn_requires_flag === 'card_unlocked_duplicate'));

// const noitaData = path.resolve(require('os').homedir(), '.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita');
// const altarPng = path.resolve(noitaData, 'data/biome_impl/temple/altar.png');

// const src = 0x33934cff;
// const dest = [0x420a3dff, 0x420a3fff];

// (async () => {
//   const data = fs.readFileSync(altarPng);
//   const img = await Jimp.read(data);

//   let srcCoords;

//   for (let x = 0; x < img.getWidth(); x++) {
//     for (let y = 0; y < img.getHeight(); y++) {
//       const color = img.getPixelColor(x, y);
//       if (color === src) {
//         srcCoords = {
//           x, y
//         };
//         console.log(x, y);
//       }
//       if (!srcCoords) {
//         continue;
//       }
//       if (dest.includes(color)) {
//         console.log();
//         console.log(color.toString(16));
//         console.log(x - srcCoords.x,  y - srcCoords.y);
//         console.log();
//       }
//     }
//   }
// })();
