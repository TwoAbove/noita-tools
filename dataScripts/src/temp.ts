import fs from "fs";
import path from "path";
import Jimp from "jimp";

const { resolve } = require("path");
const { readdir } = require("fs").promises;

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      if (res.endsWith(".png")) {
        yield res;
      }
    }
  }
}

// iterate over all the images in the images folder
const noitaData = path.resolve(
  require("os").homedir(),
  ".steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/data"
);

(async () => {
  for await (const f of getFiles(noitaData)) {
    try {
      const png = await Jimp.read(f);
      // see if the png contains the color 0xffb539ff (rgba)
      const contains = png.scan(0, 0, png.bitmap.width, png.bitmap.height, function (x, y, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        const alpha = this.bitmap.data[idx + 3];
        if (red === 0xff && green === 0xb5 && blue === 0x39 && alpha === 0xff) {
          // console.log(f);
          console.log(
            f.replace(
              "/home/twoabove/.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/",
              ""
            )
          );
          return;
        }
      });
      // if (contains) {
      // }
    } catch (e) {}
  }
})();

// (async () => {
// 	const impls: any = {};
// 	for (const scene of scenes) {
// 		const png = await Jimp.read(path.resolve(noitaData, scene));
// 		impls[scene] = {
// 			src: await png.getBase64Async(Jimp.MIME_PNG),
// 			w: png.getWidth(),
// 			h: png.getHeight()
// 		};
// 	}
// 	fs.writeFileSync(
// 		path.resolve(
// 			__dirname,
// 			'../../src/services/SeedInfo/data/obj',
// 			'impl.json'
// 		),
// 		JSON.stringify(impls, null, 2)
// 	);
// })();
