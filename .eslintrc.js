module.exports = {
	extends: ['react-app'],
	rules: {},
	ignorePatterns: ['**/*.spec.*', 'dataScripts/**'],
	overrides: [
		{
			extends: ['plugin:cypress/recommended'],
			files: ['cypress/**/*.js', 'cypress/**/*.ts']
		},
		{
			files: ['**/*.ts?(x)'],
			// ignorePatterns: ['**/*.spec.ts?(x)'],
			rules: {
				'@typescript-eslint/no-misused-promises': [
					'warn',
					{
						checksVoidReturn: false
					}
				],
				'@typescript-eslint/no-floating-promises': [
					'error',
					{
						ignoreVoid: false,
						ignoreIIFE: false
					}
				],
				'@typescript-eslint/no-unused-vars': [0]
			},
			parserOptions: {
				project: ['./tsconfig.json'] // Specify it only for TypeScript files
			}
		}
	]
};
