const fs = require("fs");
const path = require("path");

const mkDir = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

["console-build", "console-build/workers", "console-build/noita_random", "console-build/wasm"].forEach(mkDir);

const copyFile = (from, to) => {
  fs.copyFileSync(path.resolve(__dirname, from), path.resolve(__dirname, to));
};

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
    target: ["node22.16"],
    format: "esm",
    banner: {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
    },
    outdir: "console-build",
    packages: "external",
    external,
  })
  .then(() => {
    const mainPackageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json")));
    const searchPackageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "search.package.json")));

    searchPackageJson.version = mainPackageJson.version;

    fs.writeFileSync(
      path.resolve(__dirname, "console-build", "package.json"),
      JSON.stringify(searchPackageJson, null, 2),
    );

    {
      const fixFile = path.resolve(__dirname, "console-build", "consoleSearch.js");
      let f = fs.readFileSync(fixFile, "utf8");
      let result = f.replace("../workers/seedSearcher.worker.node.ts", "./workers/seedSearcher.worker.node.js");
      fs.writeFileSync(fixFile, result);
    }

    {
      const fixFile = path.resolve(__dirname, "console-build", "workers/seedSearcher.worker.node.js");
      let f = fs.readFileSync(fixFile, "utf8");
      let result = "" + f;
      result = result.replaceAll(`.json";`, `.json"assert{type:"json"};`);
      result = result.replaceAll(`__dirname`, `import.meta.url`);
      result = result.replaceAll(`__dirname`, `import.meta.url`);
      fs.writeFileSync(fixFile, result);
    }

    {
      const fixFile = path.resolve(__dirname, "console-build", "workers/seedSearcher.worker.node.js");
      let f = fs.readFileSync(fixFile, "utf8");
      let result = f.replace("./nodeImageActions", "../services/imageActions/nodeImageActions.js");
      fs.writeFileSync(fixFile, result);
    }

    copyFile("src/services/SeedInfo/noita_random/noita_random.wasm", "console-build/noita_random/noita_random.wasm");
    copyFile("src/services/SeedInfo/wasm/rng.wasm", "console-build/wasm/rng.wasm");
    copyFile(
      "src/services/SeedInfo/infoHandler/InfoProviders/Alchemy/Alchemy.wasm",
      "console-build/workers/Alchemy.wasm",
    );
    copyFile(
      "src/services/SeedInfo/infoHandler/InfoProviders/FungalShift/FungalShift.wasm",
      "console-build/workers/FungalShift.wasm",
    );
  });
