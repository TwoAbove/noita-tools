import fs from "fs";
import path from "path";
import Jimp from "jimp";

const root = path.resolve(__dirname, "../../src/services/SeedInfo/data");

interface IConfig {
  src: string;
  dest: string;
  id: string;
}

(async () => {
  {
    const data: any[] = JSON.parse(fs.readFileSync(path.resolve(root, "spells.json")).toString());
    const out = data.map(d => {
      const spawnLevels = d.spawn_level.split(",");
      const spawnProbabilities = d.spawn_probability.split(",");
      d.spawn_probabilities = {};
      for (let i = 0; i < spawnLevels.length; i++) {
        d.spawn_probabilities[spawnLevels[i]] = Number(spawnProbabilities[i]);
      }
      return d;
    });
    fs.writeFileSync(path.resolve(root, "spells.json"), JSON.stringify(out, null, 4));
  }
  {
    const data: { [key: string]: any } = JSON.parse(fs.readFileSync(path.resolve(root, "obj/spells.json")).toString());
    const out = Object.values(data).map(d => {
      const spawnLevels = d.spawn_level.split(",");
      const spawnProbabilities = d.spawn_probability.split(",");
      d.spawn_probabilities = {};
      for (let i = 0; i < spawnLevels.length; i++) {
        d.spawn_probabilities[spawnLevels[i]] = Number(spawnProbabilities[i]);
      }
      return d;
    });
    const out2: any = {};
    for (const d of out) {
      out2[d["id"]] = d;
    }
    fs.writeFileSync(path.resolve(root, "obj/spells.json"), JSON.stringify(out2, null, 4));
  }
})();

export {};
