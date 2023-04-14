const fs = require('fs');
const path = require('path');
// const requireResolvePlugin = require('@chialab/esbuild-plugin-require-resolve');
// const { resolve } = require('path');
// const tsc = require('tsc-prog');

// rimraf lambda-build/* && tsc --project ./tsconfig.lambda.json && copyfiles -u 1 src/**/*.wasm lambda-build

// tsc.build({
// 	basePath: __dirname,
// 	configFilePath: 'tsconfig.lambda.json',
// 	copyOtherToOutDir: true,
// 	clean: { outDir: true }
// });

// writeFileSync(
// 	resolve(__dirname, 'lambda-build/package.json'),
// 	JSON.stringify(
// 		{
// 			// type: 'commonjs',
// 			main: './lambdaSearch.js'
// 			// exports: {
// 			// '.': {
// 			// require: './lambdaSearch.js' // CJS
// 			// "import": "./index.mjs"   // ESM
// 			// }
// 			// }
// 		},
// 		null,
// 		2
// 	)
// );
if (!fs.existsSync('lambda-build')) {
	fs.mkdirSync('lambda-build');
}

const pkg = require(path.resolve("./package.json"));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

require('esbuild')
	.build({
		entryPoints: [
			'./src/services/SeedInfo/infoHandler/index.ts',
			'./src/consoleSearch.ts',
			'./src/workers/seedSearcher.worker.node.ts'
		],
		bundle: true,
		loader: { '.wasm': 'file', '.node': 'copy', '.json': 'copy' },
		platform: 'node',
		metafile: true,
		sourcemap: true,
		// minify: true,
		target: ['node18'],
		outdir: 'lambda-build',
		format: 'esm',
		banner: {
			js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
		},
		// outfile: 'lambda-build/consoleSearch.js'
		packages: 'external',
		external,
	})
	.then(() => {
		const pkg = {
			name: 'noitool-console',
			type: 'module',
			module: 'consoleSearch.js',
			version: '0.0.0'
		};

		fs.writeFileSync(
			path.resolve(__dirname, 'lambda-build', 'package.json'),
			JSON.stringify(pkg, null, 4)
		);

		{
			// Need to figure out how to correctly fix URL requires with esbuild
			const fixFile = path.resolve(
				__dirname,
				'lambda-build',
				'consoleSearch.js'
			);
			let f = fs.readFileSync(fixFile, 'utf8');
			let result = f.replace(
				'../workers/seedSearcher.worker.node.ts',
				'./workers/seedSearcher.worker.node.js'
			);
			fs.writeFileSync(fixFile, result);
		}

		{
			// Need to figure out how to correctly fix URL requires with esbuild
			const fixFile = path.resolve(
				__dirname,
				'lambda-build',
				'workers/seedSearcher.worker.node.js'
			);
			let f = fs.readFileSync(fixFile, 'utf8');
			let result = "" + f;
			result = result.replaceAll(`.json";`, `.json"assert{type:"json"};`);
			result = result.replaceAll(`__dirname`, `import.meta.url`);
			result = result.replaceAll(`__dirname`, `import.meta.url`);
			fs.writeFileSync(fixFile, result);
		}
	});
