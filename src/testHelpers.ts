import fs from "fs";
import path from "path";
import { genRandom } from "./services/SeedInfo/random/random";
import createModule from "./services/SeedInfo/noita_random/noita_random";

import wasm from "./services/SeedInfo/noita_random/noita_random.wasm";

// Hack: Jest does it's own bundling and mishandles binary imports
const isJest = () => {
  return process.env.JEST_WORKER_ID !== undefined;
};

export const loadRandom = async (flags?: string[]): Promise<Awaited<ReturnType<typeof genRandom>>> => {
  // With jest, import returns a string
  // With Node and webpack, it returns Buffer
  const config: any = {
    wasmBinary: !isJest()
      ? wasm.default || wasm
      : fs.readFileSync(path.resolve(__dirname, "./services/SeedInfo/noita_random/noita_random.wasm")),
  };

  const Module = await createModule(config);
  const randoms = await genRandom(Module);
  await randoms.SetUnlockedSpells(getUnlockedSpells(flags));
  return randoms;
};

export const getUnlockedSpells = (flags?: string[]) => {
  // This should be configurable with persistence flags
  return Array(393)
    .fill("")
    .map(s => true);
};
