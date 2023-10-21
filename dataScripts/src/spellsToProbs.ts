import fs from "fs";
import path from "path";
import util from "util";

const root = path.resolve(__dirname, "out");

const spellRoot = path.resolve(__dirname, "../../src/services/SeedInfo/noita_random/src/");

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

const startOfFile = `
#pragma once
#include <string>

struct Spell
{
  std::string id;
  int type;
  double spawn_probabilities[11];
};

enum ACTION_TYPE
{
  PROJECTILE = 0,
  STATIC_PROJECTILE = 1,
  MODIFIER = 2,
  DRAW_MANY = 3,
  MATERIAL = 4,
  OTHER = 5,
  UTILITY = 6,
  PASSIVE = 7
};

const static Spell all_spells[] =
`;

(async () => {
  const data: any[] = JSON.parse(fs.readFileSync(path.resolve(root, "spells.json")).toString());
  let out = "{\n";
  for (const d of data) {
    out += `  {"${d.id}", ${mapToType[d.type]}, {${probsToList(d.spawn_probabilities)}}},\n`;
  }
  out += "};\n";

  fs.writeFileSync(path.resolve(__dirname, "out", "spells.h"), startOfFile + out);
})();

export {};
