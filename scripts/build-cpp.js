import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import chokidar from "chokidar";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { glob } from "glob";

const execPromise = promisify(exec);

const modules = [
	{
		name: "noita_random",
		path: "src/services/SeedInfo/noita_random",
		files: "src/wasm_in.cpp",
		outputName: "noita_random",
		exportName: "create_noita_random",
		exportedFns: "['_generate_path_map','_free','_malloc']",
	},
	{
		name: "infoHandler",
		path: "src/services/SeedInfo/infoHandler",
		files: "*.cpp",
		pre: "pre.js",
	},
];

const getInfoHandlerModules = async () => {
	const files = await glob("src/services/SeedInfo/infoHandler/*/*.cpp");
	const moduleDirs = new Set(files.map((file) => path.dirname(file)));
	return Array.from(moduleDirs).map((dir) => {
		const moduleName = path.basename(dir);
		return {
			name: moduleName,
			path: dir,
			files: "*.cpp",
			outputName: moduleName,
			exportName: `create_${moduleName}`,
			exportedFns: "['_free','_malloc']",
			pre: "../pre.js",
		};
	});
};

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const compilerFlags = {
	WASM: 1,
	FILESYSTEM: 0,
	ALLOW_MEMORY_GROWTH: 1,
	MODULARIZE: 1,
	NO_EXIT_RUNTIME: 1,
	ENVIRONMENT: '"web,worker,node"',
};

const compileModule = async (module) => {
	const { name, path: modulePath, files, outputName, exportName, exportedFns, pre } = module;
	console.log(`Compiling ${name}...`);

	const compile = async (output, flags) => {
		const command = [
			"em++",
			"--bind",
			"-O3",
			...flags,
			"-o",
			`${output}.mjs`,
			"--std=c++20",
			pre ? `--extern-pre-js="${pre}"` : "",
			"--emit-tsd",
			`${output}.d.ts`,
			...Object.entries(compilerFlags).map(([key, value]) => `-s ${key}=${value}`),
			"-s",
			`EXPORT_NAME="${exportName}"`,
			"-s",
      `"EXPORTED_FUNCTIONS=${exportedFns}"`,
			files,
		]
			.filter(Boolean)
			.join(" ");

		await execPromise(command, { cwd: modulePath });
		await execPromise(`du -sh ${output}.wasm`, { cwd: modulePath }).then(({ stdout }) => console.log(stdout.trim()));
		await execPromise(`du -sh ${output}.mjs`, { cwd: modulePath }).then(({ stdout }) => console.log(stdout.trim()));
	};

	await compile(outputName, ["-msse2", "-msimd128"]);
	await compile(`${outputName}-base`, []);
};

const getSourceGlobs = (module) => {
	return path.join(module.path, module.files);
};

const buildAll = async () => {
	const infoHandlerModules = await getInfoHandlerModules();
	for (const module of [...modules.filter(m => m.name !== 'infoHandler'), ...infoHandlerModules]) {
		await compileModule(module);
	}
};

const watch = async () => {
	const infoHandlerModules = await getInfoHandlerModules();
	const allModules = [...modules.filter(m => m.name !== 'infoHandler'), ...infoHandlerModules];

	const watcher = chokidar.watch(
		allModules.map(getSourceGlobs),
		{
			ignored: /(^|[\/\\])\../, // ignore dotfiles
			persistent: true,
		}
	);

	const debouncedCompile = debounce(async (filePath) => {
		const module = allModules.find((m) => filePath.startsWith(m.path));
		if (module) {
			console.log(`\nFile ${filePath} has been changed.`);
			await compileModule(module);
		}
	}, 2000);

	watcher.on("change", debouncedCompile);

	console.log("Watching for changes...");
};

const main = async () => {
	const argv = yargs(hideBin(process.argv)).option("watch", {
		alias: "w",
		type: "boolean",
		description: "Watch for changes and recompile",
	}).argv;

	if (argv.watch) {
		await watch();
	} else {
		await buildAll();
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
