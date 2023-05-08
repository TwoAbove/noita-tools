import fs from "fs";
import path from "path";

const root = path.resolve(__dirname, "../../src/services/SeedInfo/data");

(async () => {
  const data: any[] = JSON.parse(fs.readFileSync(path.resolve(root, "spells.json")).toString());
  const out = {};
  for (const d of data) {
  }
  fs.writeFileSync(path.resolve(root, "obj/spells_probs.json"), JSON.stringify(out, null, 4));
})();

export {};
