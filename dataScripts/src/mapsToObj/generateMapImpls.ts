import { capitalize, camelCase } from "lodash";

const MI = (maps: any[], luas: Map<string, string>) => {
  let res = "/* This file is auto-generated from dataScripts/mapsToObj. Do not modify it! */\n";

  for (let i of [...luas.values()]) {
    res += `import ${i} from './impl/${i}'; \n`;
  }

  res += `\nimport Base from './Base';\n`;

  res += `\nconst MapImplementations: { [color: string]:typeof Base } = {\n`;

  for (let i of maps) {
    res += `'${i.color}': ${luas.get(i.lua_script)},\n`;
  }

  res += `};

  export default MapImplementations;
  `;
  return res;
};

const generateImpl = (map: any) => {
  if (!map.config) {
    return "";
  }
  let res = "";

  res += `\n // ${map.lua_script} \n`;

  const name = formatName(map.name);

  res += `import Base from '../Base';\n`;

  res += `class ${name} extends Base {\n`;

  res += `chestLevel = ${map.config.chestLevel};\n`;

  for (const n in map.config) {
    if (!n.startsWith("g_")) {
      continue;
    }
    res += `${n} = ${JSON.stringify(map.config[n])}\n`;
  }

  for (const sf in map.config.spawnFunctions) {
    res += `\n  async ${map.config.spawnFunctions[sf]} (x: number, y: number) {console.error(\`\$ TODO: AUTO_GEN not implemented for \${this.constructor.name}\`);}`;
  }

  res += `}`;

  res += `\nexport default ${name};\n`;
  return res;
};

const formatName = (n: string) => capitalize(camelCase(n));

type IRecturn = { fileName: string; file: string }[];
const generateMapImpls = async (maps: any): Promise<IRecturn> => {
  const res: IRecturn = [];

  const uniqueLuas = new Map();

  Object.values(maps).forEach((m: any) => {
    if (uniqueLuas.has(m.lua_script)) {
      return;
    }
    uniqueLuas.set(m.lua_script, `${formatName(m.name)}`);
  });

  const mapArr: any[] = Object.values(maps);

  const mapImplFileData = Object.values(maps).map((m: any) => ({
    name: `${formatName(m.name)}`,
    lua_script: m.lua_script,
    color: m.color,
  }));

  res.push({
    fileName: "MapImplementations.ts",
    file: MI(mapImplFileData, uniqueLuas),
  });

  for (const l of [...uniqueLuas.keys()]) {
    const map = mapArr.find(m => m.lua_script === l);
    res.push({
      fileName: `impl/${formatName((map as any).name)}.ts`,
      file: generateImpl(map),
    });
  }

  return res;
};

export default generateMapImpls;
