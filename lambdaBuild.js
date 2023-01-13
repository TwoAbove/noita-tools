const fs = require('fs');
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
	entryPoints: ['src/lambdaSearch.ts'],
	bundle: true,
	loader: { '.wasm': 'copy', '.json': 'copy' },
	platform: 'node',
	target: ['node18'],
	outfile: 'lambda-build/lambdaSearch.js',
	// packages: 'external'
});
