import fs from "fs";
import path from "path";
import { loadMapWasmModule } from "./services/SeedInfo/noita_random/mapWasm";
import { loadRngModule, withRngWasm } from "./services/SeedInfo/random/rngWasm";
import { genRandom } from "./services/SeedInfo/random/random";
import { NOITA_SPELL_COUNT } from "./static";

export const loadRandom = async (flags?: string[]): Promise<Awaited<ReturnType<typeof genRandom>>> => {
  const Module = await loadMapWasmModule(
    fs.readFileSync(path.resolve(__dirname, "./services/SeedInfo/noita_random/noita_random.wasm")),
  );
  const rngWasm = await loadRngModule(fs.readFileSync(path.resolve(__dirname, "./services/SeedInfo/wasm/rng.wasm")));
  const randoms = await genRandom(withRngWasm(Module, rngWasm));
  await randoms.SetUnlockedSpells(getUnlockedSpells(flags));
  return randoms;
};

export const getUnlockedSpells = (flags?: string[]) => {
  return Array(NOITA_SPELL_COUNT)
    .fill("")
    .map(s => true);
};
