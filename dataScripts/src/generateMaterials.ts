import fs from "fs";
import path from "path";
import Jimp from "jimp";
import { parseStringPromise } from "xml2js";
import parser, {
  AssignmentStatement,
  Expression,
  NumericLiteral,
  StringLiteral,
  TableConstructorExpression,
} from "luaparse";
import { parse } from "csv-parse/sync";

import { homedir } from "os";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const argbTorgba = (s: string) =>
  s
    .replace("0x", "")
    .replace(/(..)(......)/, "$2$1")
    .toLowerCase();

const noitaData = path.resolve(__dirname, "../noita-data/");

const root = path.resolve(__dirname, "../../src/services/SeedInfo/data");

const materialsXMLPath = path.resolve(noitaData, "data/materials.xml");

const getCellData = (cell: any) => {
  const c: any = {};

  const params = ["wang_color", "name", "hp", "tags", "burnable", "density", "ui_name"];
  for (const p of params) {
    if (cell[p]) {
      switch (p) {
        case "wang_color": {
          c.wang_color = cell.wang_color;
          c.color = argbTorgba(cell[p]).toLowerCase();
          break;
        }
        case "tags": {
          c.tags = cell.tags.replaceAll("[", "").replaceAll("]", "").split(",");
          break;
        }
        default: {
          c[p] = cell[p];
        }
      }
    }
  }
  return c;
};

(async () => {
  const materialsData = (await parseStringPromise(fs.readFileSync(materialsXMLPath))).Materials;
  const materials: any = {};
  for (const { $: cell, Graphics } of materialsData.CellData) {
    const c = getCellData(cell);
    materials[c.name] = c;
    if (Graphics) {
      materials[c.name].graphics = Graphics[0].$;
    }
  }
  for (const { $: cell, Graphics } of materialsData.CellDataChild) {
    const parent = materials[cell._parent];
    const c = getCellData(cell);
    materials[c.name] = { ...parent, ...c };
    if (Graphics) {
      materials[c.name].graphics = Graphics[0].$;
    }
  }
  fs.writeFileSync(path.resolve(__dirname, "out", "./materials.json"), JSON.stringify(materials, null, 2));
})();

export {};
