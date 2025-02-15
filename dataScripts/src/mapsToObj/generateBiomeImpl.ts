import path from "path";
import Jimp from "jimp";

import { glob } from "glob";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const noitaData = path.resolve(__dirname, "../../noita-data/");

const exportImpl = async maps => {
  const functionColors = new Set<number>();

  for (let k of Object.keys(maps)) {
    const map = maps[k];
    if (map.config && map.config.spawnFunctions) {
      for (let kk of Object.keys(map.config.spawnFunctions)) {
        functionColors.add(parseInt(kk, 16));
      }
    }
  }

  const impls: any = {};
  const files = new Set<string>();
  await new Promise<void>(async r => {
    const ff = await glob("*/biome_impl/**/*.png", { cwd: noitaData, root: noitaData });
    for (const f of ff) {
      files.add(f);
    }
    r();
  });

  for (const scene of [...files.values()]) {
    try {
      const png = await Jimp.read(path.resolve(noitaData, scene));

      const f: { x: number; y: number; c: number }[] = [];

      const width = png.getWidth();
      const height = png.getHeight();

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const color = png.getPixelColor(x, y);
          if (functionColors.has(color)) {
            f.push({ x, y, c: color });
          }
        }
      }

      impls[scene] = {
        src: await png.getBase64Async(Jimp.MIME_PNG),
        w: width,
        h: height,
        f,
      };
    } catch (e) {
      console.log(scene, "failed:", e);
    }
  }
  return impls;
};

// exportImpl().then(impls => {
//   fs.writeFileSync(path.resolve(__dirname, "impl.json"), JSON.stringify(impls, null, 2));
// });
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
