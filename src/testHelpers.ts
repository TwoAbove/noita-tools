import fs from 'fs';
import path from 'path';
import { genRandom } from './services/SeedInfo/random/random';
import createModule from './services/SeedInfo/noita_random/noita_random';

export const loadRandom = async (flags?: string[]): Promise<Awaited<ReturnType<typeof genRandom>>> => {
	const wasmPath = await import('./services/SeedInfo/noita_random/noita_random.wasm');
	const Module = await createModule({
		wasmBinary: wasmPath,
	});
	const randoms = await genRandom(Module);
	await randoms.SetUnlockedSpells(getUnlockedSpells(flags));
	return randoms;
};

export const getUnlockedSpells = (flags?: string[]) => {
	// This should be configurable with persistence flags
	return Array(393)
		.fill('')
		.map(s => true);
};
