const path = require('path');
const util = require('util');
const fs = require('fs');

const { addBeforeLoader, loaderByName } = require('@craco/craco');
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

module.exports = {
	webpack: {
		configure: config => {
			// setUpWorker(config);
			// https://stackoverflow.com/questions/65922329/babel-cant-resolve-imports-in-it-its-own-source-code
			config.module.rules.push({
				test: /\.m?js/,
				resolve: {
					fullySpecified: false
				}
			});

			config.experiments = {
				futureDefaults: true,
				asyncWebAssembly: true,
			};

			return config;
		},
		plugins: [
			new BundleAnalyzerPlugin({
				analyzerMode: process.env.STATS || 'disabled'
			})
		],
		// stats: 'errors-only',

	}
	// style: {
	//   postcss: {
	//     plugins: [
	//       require("tailwindcss")("./tailwind.config.js"),
	//       require('autoprefixer'),
	//     ],
	//   },
	// },
};
