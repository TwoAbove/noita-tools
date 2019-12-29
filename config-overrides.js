const path = require('path');
const util = require('util');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = function override(config, env) {
	//do stuff with the webpack config...
	// console.log(util.inspect(config.plugins, false, null, true /* enable colors */));
	config.entry.push(resolveApp('src/workers/seedCalculator.worker.ts'));

	const bablelConfig = {
		...config.module.rules[2].oneOf[1],
		...{
			test: /\.worker\.(js|mjs|ts)$/,
			// include: resolveApp('src'),
			loader: 'babel-loader!comlink-loader'
			// loader: 'comlink-loader!babel-loader'
		}
	};

	config.module.rules[2].oneOf.unshift(bablelConfig);

	return config;
};
