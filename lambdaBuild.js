const fs = require('fs');
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

require('esbuild').buildSync({
	entryPoints: ['./src/consoleSearch.ts','./src/consoleSearchWorker.ts'],
	bundle: true,
	loader: { '.wasm': 'binary', '.node': 'copy', '.json': 'copy' },
	platform: 'node',
	metafile: true,
	minify: true,
	target: ['node18'],
	outdir: 'lambda-build',
	external: ['./consoleSearchWorker'],
	// plugins: [
	// 	requireResolvePlugin(),
	// ],
	// outfile: 'lambda-build/consoleSearch.js'
	// packages: 'external'
});
