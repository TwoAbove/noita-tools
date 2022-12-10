import path from 'path';
import fs from 'fs';
import generateMaps from './generateMaps';
import generateMapImpls from './generateMapImpls';
import generateImpl from './generateImpl';
import generateEntities from './generateEntities';
import { exec, execSync } from 'child_process';

const d = async () => {
	try {
		fs.unlinkSync(path.resolve(__dirname, 'maps.json'));
		fs.unlinkSync(path.resolve(__dirname, 'entities.json'));
	} catch (e) { }

	// const maps = await generateMaps();
	// const mapCopy = JSON.parse(JSON.stringify(maps));
	// for (const c in mapCopy) {
	// 	for (const k in mapCopy[c].config) {
	// 		if (k !== 'spawnFunctions') {
	// 			delete mapCopy[c].config[k];
	// 		}
	// 	}
	// }
	// fs.writeFileSync(
	// 	path.resolve(__dirname, 'maps.json'),
	// 	JSON.stringify(mapCopy, null, 2)
	// );
	// const genPath = path.resolve(__dirname, 'gen');
	// const implPath = path.resolve(genPath, 'impl');
	// try {
	// 	fs.mkdirSync(genPath);
	// } catch { }
	// try {
	// 	fs.mkdirSync(implPath);
	// } catch { }
	// const mapImpls = await generateMapImpls(maps);
	// for (const mi of mapImpls) {
	// 	fs.writeFileSync(path.resolve(genPath, mi.fileName), mi.file);
	// }
	// execSync(`npx prettier --write ${genPath}/`);

	// const impl = await generateImpl();
	// fs.writeFileSync(
	// 	path.resolve(__dirname, 'impl.json'),
	// 	JSON.stringify(impl, null, 2)
	// );

	const entities = await generateEntities();
	fs.writeFileSync(
		path.resolve(__dirname, 'entities.json'),
		JSON.stringify(entities, null, 2)
	);
};

d().catch(e => console.log(e));
