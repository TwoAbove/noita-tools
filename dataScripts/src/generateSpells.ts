import fs from "fs";
import util from "util";
import path from "path";
import Jimp from "jimp";

import { parseAST } from "./ast";
import parser from "luaparse";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const noitaData = path.resolve(__dirname, "../noita-data/");

const spellTypes = fs.readFileSync(path.resolve(noitaData, "data/scripts/gun/gun_enums.lua")).toString();

const spellPath = path.resolve(noitaData, "data/scripts/gun/gun_actions.lua");
const spellFile = fs.readFileSync(spellPath).toString();
const data = parseAST(parser.parse(spellTypes + "\n\n" + spellFile, { wait: false }));
// console.log(util.inspect(data.actions, false, null, true));

const spells = data.actions;

(async () => {
  const newSpells: any[] = [];

  for (const spell of spells as any[]) {
    await new Promise<void>(res => {
      const p = path.resolve(noitaData, spell.sprite);
      if (!fs.existsSync(p)) {
        return res();
      }
      const img = fs.readFileSync(p);
      Jimp.read(img, (err, image) => {
        image.getBase64(Jimp.MIME_PNG, (err, src) => {
          const s = {
            ...spell,
            sprite: src,
          };
          const spawnLevels = s.spawn_level.split(",");
          const spawnProbabilities = s.spawn_probability.split(",");
          s.spawn_probabilities = {};
          for (let i = 0; i < spawnLevels.length; i++) {
            const probability = Number(spawnProbabilities[i]);
            if (probability) {
              s.spawn_probabilities[spawnLevels[i]] = probability;
            }
          }
          newSpells.push(s);
          res();
        });
      });
    });
  }

  const out: any = {};

  for (const d of newSpells) {
    out[d.id] = d;
  }

  fs.writeFileSync(path.resolve(__dirname, "out", "spells.json"), JSON.stringify(newSpells, null, 2));

  fs.writeFileSync(path.resolve(__dirname, "out", "obj", "spells.json"), JSON.stringify(out, null, 2));
})();
