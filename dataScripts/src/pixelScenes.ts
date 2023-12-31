import fs from "fs";
import path from "path";
import Jimp from "jimp";

import { homedir } from "os";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const noitaData = path.resolve(
  homedir(),
  ".steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/",
);
// Add to these when transferring map impl from Noita.
const scenes = [
  "data/biome_impl/potion_altar.png",
  "data/biome_impl/wand_altar.png",
  "data/biome_impl/coalmine/coalpit01.png",
  "data/biome_impl/coalmine/coalpit02.png",
  "data/biome_impl/coalmine/coalpit03.png",
  "data/biome_impl/coalmine/coalpit04.png",
  "data/biome_impl/coalmine/coalpit05.png",
  "data/biome_impl/coalmine/wandtrap_h_01.png",
  "data/biome_impl/coalmine/wandtrap_h_02.png",
  "data/biome_impl/coalmine/wandtrap_h_03.png",
  "data/biome_impl/coalmine/wandtrap_h_04.png",
  "data/biome_impl/coalmine/wandtrap_h_05.png",
  "data/biome_impl/coalmine/wandtrap_h_06.png",
  "data/biome_impl/coalmine/wandtrap_h_07.png",
];

(async () => {
  const impls: any = {};
  for (const scene of scenes) {
    const png = await Jimp.read(path.resolve(noitaData, scene));
    impls[scene] = {
      src: await png.getBase64Async(Jimp.MIME_PNG),
      w: png.getWidth(),
      h: png.getHeight(),
    };
  }
  fs.writeFileSync(
    path.resolve(__dirname, "../../src/services/SeedInfo/data/obj", "impl.json"),
    JSON.stringify(impls, null, 2),
  );
})();
