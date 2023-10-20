import path from "path";
import fs from "fs";
import generateMaps from "./generateMaps";
import generateMapImpls from "./generateMapImpls";
import generateImpl from "./generateImpl";
import generateEntities from "./generateEntities";
import { exec, execSync } from "child_process";

async function d() {
  // try {
  //   fs.unlinkSync(path.resolve(__dirname, "maps.json"));
  //   fs.unlinkSync(path.resolve(__dirname, "entities.json"));
  // } catch (e) {}
  // console.log("Generating maps...");
  // const maps = await generateMaps();
  // const mapCopy = JSON.parse(JSON.stringify(maps));
  // for (const c in mapCopy) {
  //   for (const k in mapCopy[c].config) {
  //     if (k !== "spawnFunctions") {
  //       delete mapCopy[c].config[k];
  //     }
  //   }
  // }
  // fs.writeFileSync(path.resolve(__dirname, "../out/obj", "maps.json"), JSON.stringify(mapCopy, null, 2));
  // const genPath = path.resolve(__dirname, "../out", "gen");
  // const implPath = path.resolve(genPath, "impl");
  // try {
  //   fs.mkdirSync(genPath);
  // } catch {}
  // try {
  //   fs.mkdirSync(implPath);
  // } catch {}
  // console.log("Generating map classes...");
  // const mapImpls = await generateMapImpls(maps);
  // for (const mi of mapImpls) {
  //   fs.writeFileSync(path.resolve(genPath, mi.fileName), mi.file);
  // }
  // execSync(`npx prettier --write ${genPath}/`);

  // console.log("Generating map assets...");
  // const impl = await generateImpl(maps);
  // fs.writeFileSync(path.resolve(__dirname, "../out/obj", "impl.json"), JSON.stringify(impl, null, 2));

  console.log("Generating entities...");
  const entities = await generateEntities();
  fs.writeFileSync(path.resolve(__dirname, "../out/obj", "entities.json"), JSON.stringify(entities, null, 2));
}

d().catch(e => console.log(e));
