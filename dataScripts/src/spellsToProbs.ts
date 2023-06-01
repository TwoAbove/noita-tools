import fs from "fs";
import path from "path";
import util from "util";

const root = path.resolve(__dirname, "../../src/services/SeedInfo/data");

const mapToType = {
  0: "PROJECTILE",
  1: "STATIC_PROJECTILE",
  2: "MODIFIER",
  3: "DRAW_MANY",
  4: "MATERIAL",
  5: "OTHER",
  6: "UTILITY",
  7: "PASSIVE",
};

const probsToList = (probs: { [level: string]: number }) => {
  const out: number[] = [];
  for (let i = 0; i < 11; i++) {
    out.push(probs[i] || 0);
  }
  return out.join(", ");
};

(async () => {
  const data: any[] = JSON.parse(fs.readFileSync(path.resolve(root, "spells.json")).toString());
  let out = "{\n";
  for (const d of data) {
    out += `  {"${d.id}", ${mapToType[d.type]}, {${probsToList(d.spawn_probabilities)}}},\n`;
  }
  out += "}";
  console.log(out);
})();

export {};
