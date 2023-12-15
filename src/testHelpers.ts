import fs from "fs";
import path from "path";
import { IRandomModule, genRandom } from "./services/SeedInfo/random/random";

export const loadRandom = async (flags?: string[]): Promise<Awaited<ReturnType<typeof genRandom>>> => {
  // With jest, import returns a string
  // With Node and webpack, it returns Buffer
  const config: any = {
    wasmBinary: fs.readFileSync(path.resolve(__dirname, "./services/SeedInfo/noita_random/noita_random.wasm")),
  };

  const createModule = (await import("./services/SeedInfo/noita_random/noita_random.mjs")).default;

  const Module = (await createModule(config)) as unknown as IRandomModule;
  const randoms = await genRandom(Module);
  await randoms.SetUnlockedSpells(getUnlockedSpells(flags));
  return randoms;
};

export const getUnlockedSpells = (flags?: string[]) => {
  // This should be configurable with persistence flags
  return Array(413)
    .fill("")
    .map(s => true);
};
