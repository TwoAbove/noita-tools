import fs from "fs";
import path from "path";
import Jimp from "jimp";
import { parse } from "csv-parse/sync";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { getCleanedFile } from "./helpers/cleanFiles";

const noitaData = path.resolve(__dirname, "../noita-data/");
const defaultColorsPath = path.resolve(noitaData, "data/scripts/wang_scripts.csv");
const pixelScene = path.resolve(noitaData, "data/biome_impl/biome_map.png");
// const pixelScene = path.resolve(noitaData, "data/biome_impl/snowcave/secret_chamber.png");

const defaultColorArray: any[] = parse(getCleanedFile(defaultColorsPath), {
  columns: true,
  skip_empty_lines: true,
});

defaultColorArray.push({
  "#COLOR": "ff18a0d6",
  "#FUNCTION_NAME": "data/biome/snowcave_secret_chamber.xml",
});

const argbTorgba = (s: string) =>
  s
    .replace("0x", "")
    .replace(/(..)(......)/, "$2$1")
    .toLowerCase();

const colors = defaultColorArray.reduce((o, c) => {
  const color = argbTorgba(c["#COLOR"]);
  o[color] = c["#FUNCTION_NAME"];
  return o;
}, {});

(async () => {
  const data = fs.readFileSync(pixelScene);
  const img = await Jimp.read(data);

  for (let x = 0; x < img.getWidth(); x++) {
    for (let y = 0; y < img.getHeight(); y++) {
      const color = img.getPixelColor(x, y).toString(16);

      if (colors[color]) {
        console.log(colors[color], { x, y });
      }
    }
  }
})();
