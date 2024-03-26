const fs = require("fs");
const path = require("path");

// const requireResolvePlugin = require('@chialab/esbuild-plugin-require-resolve');
// const { resolve } = require('path');
// const tsc = require('tsc-prog');

// rimraf console-build/* && tsc --project ./tsconfig.lambda.json && copyfiles -u 1 src/**/*.wasm console-build

// tsc.build({
// 	basePath: __dirname,
// 	configFilePath: 'tsconfig.lambda.json',
// 	copyOtherToOutDir: true,
// 	clean: { outDir: true }
// });

// writeFileSync(
// 	resolve(__dirname, 'console-build/package.json'),
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

const mkDir = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

["console-build", "console-build/workers", "console-build/noita_random"].forEach(mkDir);

const pkg = require(path.resolve("./package.json"));

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

require("esbuild")
  .build({
    entryPoints: [
      "./src/services/SeedInfo/infoHandler/index.ts",
      "./src/consoleSearch.ts",
      "./src/workers/seedSearcher.worker.node.ts",
      "./src/services/imageActions/nodeImageActions.ts",
    ],
    bundle: true,
    loader: { ".wasm": "file", ".node": "copy" },
    platform: "node",
    metafile: true,
    sourcemap: true,
    // minify: true,
    target: ["node20"],
    format: "esm",
    banner: {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
    },
    outdir: "console-build",
    packages: "external",
    external,
  })
  .then(() => {
    fs.copyFileSync(
      path.resolve(__dirname, "search.package.json"),
      path.resolve(__dirname, "console-build", "package.json"),
    );

    {
      // Need to figure out how to correctly fix URL requires with esbuild
      const fixFile = path.resolve(__dirname, "console-build", "consoleSearch.js");
      let f = fs.readFileSync(fixFile, "utf8");
      let result = f.replace("../workers/seedSearcher.worker.node.ts", "./workers/seedSearcher.worker.node.js");
      fs.writeFileSync(fixFile, result);
    }

    {
      // Need to figure out how to correctly fix URL requires with esbuild
      const fixFile = path.resolve(__dirname, "console-build", "workers/seedSearcher.worker.node.js");
      let f = fs.readFileSync(fixFile, "utf8");
      let result = "" + f;
      result = result.replaceAll(`.json";`, `.json"assert{type:"json"};`);
      result = result.replaceAll(`__dirname`, `import.meta.url`);
      result = result.replaceAll(`__dirname`, `import.meta.url`);
      fs.writeFileSync(fixFile, result);
    }

    {
      // Need to figure out how to correctly fix URL requires with esbuild
      const fixFile = path.resolve(__dirname, "console-build", "workers/seedSearcher.worker.node.js");
      let f = fs.readFileSync(fixFile, "utf8");
      let result = f.replace("./nodeImageActions", "../services/imageActions/nodeImageActions.js");
      fs.writeFileSync(fixFile, result);
    }

    {
      fs.copyFileSync(
        path.resolve(__dirname, "src/services/SeedInfo/noita_random/noita_random.wasm"),
        path.resolve(__dirname, "console-build", "noita_random/noita_random.wasm"),
      );
    }
    {
      fs.copyFileSync(
        path.resolve(__dirname, "src/services/SeedInfo/infoHandler/InfoProviders/Alchemy/Alchemy.wasm"),
        path.resolve(__dirname, "console-build", "workers/Alchemy.wasm"),
      );
    }
    {
      fs.copyFileSync(
        path.resolve(__dirname, "src/services/SeedInfo/infoHandler/InfoProviders/Fungal/Fungal.wasm"),
        path.resolve(__dirname, "console-build", "workers/Fungal.wasm"),
      );
    }
  });
