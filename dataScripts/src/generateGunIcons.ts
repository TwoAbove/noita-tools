import fs from "fs";
import path from "path";
import Jimp from "jimp";
import { parseStringPromise } from "xml2js";

import data from "./gunFile";

import { homedir } from "os";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "../../src/services/SeedInfo/data");

const dest = path.resolve(root, "gunfile.json");
const noitaData = path.resolve(
  homedir(),
  ".steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/",
);

(async () => {
  const out: any = [];
  for (const item of data) {
    await new Promise<void>((res, rej) => {
      return Jimp.read(path.resolve(noitaData, item.file), (err, image) => {
        if (err) {
          return rej(err);
        }
        image.autocrop().getBase64(Jimp.MIME_PNG, (err, src) => {
          if (err) {
            return rej(err);
          }
          item.file = src;
          res();
        });
      });
    });
    out.push(item);
  }
  fs.writeFileSync(dest, JSON.stringify(out, null, 2));
})().finally(() => {});

export {};
