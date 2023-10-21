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

// https://github.com/Dadido3/noita-mapcap

const argbTorgba = (s: string) =>
  s
    .replace("0x", "")
    .replace(/(..)(......)/, "$2$1")
    .toLowerCase();

const noitaData = path.resolve(
  require("os").homedir(),
  ".steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/",
);
const defaultColorsPath = path.resolve(noitaData, "data/scripts/wang_scripts.csv");
const mapPNGPath = path.resolve(noitaData, "data/biome_impl/biome_map.png");
const extraLayersPath = path.resolve(noitaData, "data/wang_tiles/extra_layers");

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
  new Promise<{ src: string; width: number; height: number }>((res, rej) =>
    Jimp.read(p, (err, image) => {
      if (err) {
        return rej(err);
      }

      image.autocrop().getBase64(Jimp.MIME_PNG, (err, src) => {
        if (err) {
          return rej(err);
        }
        res({
          src,
          width: image.getWidth(),
          height: image.getHeight(),
        });
      });
    }),
  );

const parseLua = (script: string) => {
  // https://astexplorer.net/
  const ast = parser.parse(script, { wait: false });
  return ast;
};

const getValue = (ex: Expression): any => {
  switch (ex.type) {
    case "NumericLiteral": {
      return ex.value;
    }
    case "StringLiteral": {
      return ex.raw.replaceAll('"', "");
    }
    case "UnaryExpression": {
      if (ex.operator === "-") {
        if (ex.argument.type !== "NumericLiteral") {
          console.error("Unhandled type: ", ex);
          break;
        }
        return -ex.argument.value;
      }
      console.error("Unhandled type: ", ex);
      break;
    }
    case "Identifier": {
      return ex.name;
    }
    case "FunctionDeclaration": {
      // Function, need to handle this manually
      return "TODO: FunctionDeclaration";
    }
    case "TableConstructorExpression": {
      let r: any;
      let ra: any;
      const hasTableKey = ex.fields.findIndex(e => e.type === "TableKey") !== -1;
      const hasTableValue = ex.fields.findIndex(e => e.type === "TableValue") !== -1;
      const hasTableKeyString = ex.fields.findIndex(e => e.type === "TableKeyString") !== -1;
      if (hasTableKey && hasTableValue && hasTableKeyString) {
        console.error("Can't handle both TableKey and TableValue", ex);
        return {};
      }
      if (!hasTableKey && !hasTableValue && !hasTableKeyString) {
        console.log(ex);
      }
      if (hasTableKey) {
        r = {};
      }
      if (hasTableKeyString) {
        r = {};
      }
      if (hasTableValue) {
        ra = [];
      }
      for (const field of ex.fields) {
        switch (field.type) {
          case "TableKeyString": {
            let key = getValue(field.key);
            let val = getValue(field.value);
            r[key] = val;
            break;
          }
          case "TableKey": {
            let key = getValue(field.key);
            let val = getValue(field.value);
            r[key] = val;
            break;
          }
          case "TableValue": {
            ra.push(getValue(field.value));
            break;
          }
        }
      }
      return ra || r;
    }
    default: {
      console.error("Unhandled type: ", ex);
    }
  }
};

const addArea = (
  map: Jimp,
  x: number,
  y: number,
  hex: string,
  visited: { [key: string]: boolean },
  area: { x: number; y: number }[] = [],
) => {
  area.push({ x, y });
  visited[`${x} ${y}`] = true;
  for (const direction of ["u", "d", "l", "r"]) {
    let ox = +x;
    let oy = +y;
    switch (direction) {
      case "u": {
        ox -= 1;
        break;
      }
      case "d": {
        ox += 1;
        break;
      }
      case "l": {
        oy -= 1;
        break;
      }
      case "r": {
        oy += 1;
        break;
      }
    }
    if (ox < 0 || ox >= map.bitmap.width) {
      continue;
    }
    if (oy < 0 || oy >= map.bitmap.height) {
      continue;
    }
    if (visited[`${ox} ${oy}`]) {
      continue;
    }
    if (hexAt(map, ox, oy) === hex) {
      addArea(map, ox, oy, hex, visited, area);
    }
  }
  return area;
};

const hexAt = (map: Jimp, x: number, y: number) => {
  const idx = map.getPixelIndex(x, y);
  const r = map.bitmap.data[idx + 0];
  const g = map.bitmap.data[idx + 1];
  const b = map.bitmap.data[idx + 2];
  return (b | (g << 8) | (r << 16) | (1 << 24)).toString(16).slice(1) + "ff";
};

const generateMaps = async () => {
  const mapPNG = await Jimp.read(mapPNGPath);
  const visited: { [key: string]: boolean } = {};
  const areas: any[] = [];

  for (let x = 0; x < mapPNG.bitmap.width; x++) {
    for (let y = 0; y < mapPNG.bitmap.height; y++) {
      if (visited[`${x} ${y}`]) {
        continue;
      }
      const hex = hexAt(mapPNG, x, y);
      const area = addArea(mapPNG, x, y, hex, visited);
      areas.push({
        hex,
        area,
      });
      // console.log(area);
      // const color =
    }
  }

  const areaHexes: {
    [hex: string]: {
      x1: number;
      x2: number;
      y1: number;
      y2: number;
      w: number;
      h: number;
    }[];
  } = {};
  for (const a of areas) {
    const { area, hex } = a;
    if (!areaHexes[hex]) {
      areaHexes[hex] = [];
    }
    let x1 = area[0].x;
    let y1 = area[0].y;
    let x2 = area[0].x;
    let y2 = area[0].y;
    for (const coords of area) {
      x1 = Math.min(x1, coords.x);
      x2 = Math.max(x2, coords.x);
      y1 = Math.min(y1, coords.y);
      y2 = Math.max(y2, coords.y);
    }
    areaHexes[hex].push({
      x1,
      x2,
      y1,
      y2,
      w: x2 - x1 + 1,
      h: y2 - y1 + 1,
    });
  }
  // const allBiomeData = await cheerio.load(fs.readFileSync(biomeDataXMLPath), {
  // 	xmlMode: true
  // });
  const BiomeDataXML = await parseStringPromise(fs.readFileSync(biomeDataXMLPath));
  const allBiomeData = BiomeDataXML.BiomesToLoad;

  const maps: any = {};

  for (const b of allBiomeData.Biome as any) {
    const { biome_filename, height_index, color } = b.$;
    const biome_path = path.resolve(noitaData, biome_filename);
    const name = path.basename(biome_path, ".xml");
    // console.log(name);
    const Biome = (await parseStringPromise(fs.readFileSync(biome_path))).Biome;
    const { Topology: _T, Materials: _M } = Biome;
    const Topology = _T[0].$;
    const RandomMaterials = _T[0]?.RandomMaterials?.[0];
    const BitmapCaves = _T[0]?.BitmapCaves?.[0];
    const Materials = _M[0].$;
    const MaterialComponents = _M[0].MaterialComponent;

    const res: any = {
      height_index,
      color: argbTorgba(color),
      name,
      translateName: Topology.name,
      type: Topology.type,
      lua_script: Topology.lua_script,
    };
    if (RandomMaterials) {
      const randomMaterials: any = {};
      for (const randomColor of RandomMaterials.RandomColor) {
        const { input_color, output_colors } = randomColor.$;
        const outputColors = output_colors.split(",").map(argbTorgba);
        randomMaterials[argbTorgba(input_color)] = outputColors;
      }
      res.randomMaterials = randomMaterials;
    }
    if (res.type === "BIOME_WANG_TILE" && Topology.wang_template_file) {
      const data = Topology.wang_template_file
        ? await getBase64(path.resolve(noitaData, Topology.wang_template_file))
        : null;
      res.wang = {
        template_file: data?.src,
        map_width: data?.width,
        map_height: data?.height,
      };
    }
    if (res.lua_script) {
      const lua_things = parseLua(fs.readFileSync(path.resolve(noitaData, res.lua_script)).toString());
      const o: any = {
        include: [],
        spawnFunctions: {},
        g: {},
      };
      for (const statement of lua_things.body) {
        fs.writeFileSync(".tmp.body.json", JSON.stringify(lua_things, null, 2));
        switch (statement.type) {
          case "AssignmentStatement": {
            if (
              statement.init[0].type === "TableConstructorExpression" &&
              statement.variables[0].type === "Identifier"
            ) {
              // tables
              const name = statement.variables[0].name;
              const table = getValue(statement.init[0]);
              o[name] = table;
            }
            if (statement.variables[0].type === "Identifier" && statement.variables[0].name === "CHEST_LEVEL") {
              // chest
              o.chestLevel = (statement.init[0] as NumericLiteral).value;
            }
            break;
          }
          case "CallStatement": {
            if (statement.expression.type === "CallExpression" && statement.expression.base.type === "Identifier") {
              if (statement.expression.base.name === "RegisterSpawnFunction") {
                const args = statement.expression.arguments;
                let color = argbTorgba((args[0] as NumericLiteral).raw);
                const val = (args[1] as StringLiteral).raw.replaceAll('"', "");
                o.spawnFunctions[color] = val;
              }
              if (statement.expression.base.name === "dofile_once") {
                const args = statement.expression.arguments;
                let path = (args[0] as StringLiteral).raw.replaceAll('"', "");
                o.include.push(path);
              }
            }
            break;
          }
        }
      }
      o.spawnFunctions = { ...colors, ...o.spawnFunctions };
      res.config = o;
      res.areas = areaHexes[res.color];
    }
    maps[res.color] = res;
  }
  return maps;
};

export default generateMaps;
