const path = require('path');
const util = require('util');
const fs = require('fs');

const CracoSwcPlugin = require('craco-swc');
const { addBeforeLoader, loaderByName } = require('@craco/craco');
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

const { IgnorePlugin } = require('webpack');

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
				asyncWebAssembly: true
			};

			config.resolve.fallback = {
				path: false,
				fs: false
			};

			return config;
		},
		plugins: [
			new BundleAnalyzerPlugin({
				analyzerMode: process.env.STATS || 'disabled'
			}),
			new IgnorePlugin({
				checkResource: (resource, context) => {
					try {
						// Don't bundle node canvas
						return context.includes('@napi-rs');
					} catch (e) {
						return false;
					}
				}
			})
		]
		// stats: 'errors-only',
	},
	// jest: {
	// 	// configure: {
	// 	// 	transform: {},
	// 	// 	preset: 'ts-jest/presets/default-esm',
	// 	// 	modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
	// 	// 	extensionsToTreatAsEsm: ['.ts']
	// 	// }
	// },
	plugins: [{ plugin: CracoSwcPlugin }]
	// style: {
	//   postcss: {
	//     plugins: [
	//       require("tailwindcss")("./tailwind.config.js"),
	//       require('autoprefixer'),
	//     ],
	//   },
	// },
};
