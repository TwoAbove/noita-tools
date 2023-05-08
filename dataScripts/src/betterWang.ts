import fs from "fs";
import util from "util";
import path from "path";
import Jimp from "jimp";
import _ from "lodash";
import { parseStringPromise } from "xml2js";
import parser, {
  AssignmentStatement,
  Expression,
  NumericLiteral,
  StringLiteral,
  TableConstructorExpression,
} from "luaparse";
import { parse } from "csv-parse/sync";
import { AsyncResource } from "async_hooks";

const argbTorgba = (s: string) =>
  s
    .replace("0x", "")
    .replace(/(..)(......)/, "$2$1")
    .toLowerCase();

const noitaData = path.resolve(
  require("os").homedir(),
  ".steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/"
);
const defaultColorsPath = path.resolve(noitaData, "data/scripts/wang_scripts.csv");

const defaultColorArray: any[] = parse(fs.readFileSync(defaultColorsPath), {
  columns: true,
  skip_empty_lines: true,
});
const colors = defaultColorArray.reduce((o, c) => {
  const color = argbTorgba(c["#COLOR"]);
  o[color] = c["#FUNCTION_NAME"];
  return o;
}, {});

const biomeDataXMLPath = path.resolve(noitaData, "data/biome/_biomes_all.xml");

const getBase64 = (p: string) =>
  new Promise<Jimp>((res, rej) =>
    Jimp.read(p, (err, image) => {
      if (err) {
        return rej(err);
      }

      return res(image);
    })
  );

const xOffset = 35;
const yOffset = 14;
