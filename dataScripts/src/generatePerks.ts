import { homedir } from "os";
import fs from "fs";
import util from "util";
import path from "path";
import Jimp from "jimp";
import parser from "luaparse";
import { parseAST } from "./ast";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const noitaData = path.resolve(__dirname, "../noita-data/");

const perkPath = path.resolve(noitaData, "data/scripts/perks/perk_list.lua");

const perkFile = fs.readFileSync(perkPath).toString();

// const perks = parse(perkFile);
const data = parseAST(parser.parse(perkFile, { wait: false }));

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
};

(async () => {
  const newPerks: any[] = [];

  for (const perk of perks as any[]) {
    await new Promise<void>(async res => {
      const s = {
        ...perk,
        ui_icon: await getImage(fs.readFileSync(path.resolve(noitaData, perk.ui_icon))),
        perk_icon: await getImage(fs.readFileSync(path.resolve(noitaData, perk.perk_icon))),
      };
      newPerks.push(s);
      res();
    });
  }

  const out: any = {};

  for (const d of newPerks) {
    out[d.id] = d;
  }

  fs.writeFileSync(path.resolve(__dirname, "out", "perks.json"), JSON.stringify(newPerks, null, 2));

  fs.writeFileSync(path.resolve(__dirname, "out", "obj/perks.json"), JSON.stringify(out, null, 2));
})();
