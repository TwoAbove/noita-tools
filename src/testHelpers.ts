import fs from 'fs';
import path from 'path';
import load, { IRandom, genRandom } from './services/SeedInfo/random';
import createModule from './services/SeedInfo/noita_random/noita_random.js';

export const loadRandom = async (flags?: string[]): Promise<IRandom> => {
	const wasmPath = path.resolve(
		__dirname,
		'services/SeedInfo/noita_random/noita_random.wasm'
	);
	const Module = await createModule({
		locateFile(path) {
			if (path.endsWith('.wasm')) {
				return wasmPath;
			}
			return path;
		}
	});
	const randoms = await genRandom(Module);
	await randoms.SetUnlockedSpells(getUnlockedSpells(flags))
	return randoms;
};

export const getUnlockedSpells = (flags?: string[]) => {
	// This should be configurable with persistence flags
	return Array(393)
		.fill('')
		.map(s => true);
};
