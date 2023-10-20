import fs from "fs";
import path from "path";
import Jimp from "jimp";
import { parseStringPromise } from "xml2js";

const root = path.resolve(__dirname, "../../src/services/SeedInfo/data");

const src = path.resolve(root, "perks.json");
const dest = path.resolve(__dirname, "out", "perks.json");

(async () => {
  const data: any[] = JSON.parse(fs.readFileSync(src).toString());
  const out: any[] = [];
  // console.log(data);
  for (const item of data) {
    await new Promise<void>((res, rej) => {
      const buf = Buffer.from(item.ui_icon, "base64");
      Jimp.read(buf, (err, image) => {
        if (err) {
          return rej(err);
        }
        image.autocrop().getBase64(Jimp.MIME_PNG, (err, src) => {
          if (err) {
            return rej(err);
          }
          item.ui_icon = src.replaceAll("data:image/png;base64,", "");
          res();
        });
      });
    });
    out.push(item);
  }
  fs.writeFileSync(dest, JSON.stringify(out, null, 2));
})();

export {};
