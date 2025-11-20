import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

const errorLevel = 'warn'

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: { js },
		extends: ['js/recommended', 'prettier'],
		languageOptions: { globals: globals.browser },
	},

	{
		rules: {
			'arrow-body-style': ['error', 'always'],
			'no-alert': 'error',
			'require-await': errorLevel,
			'prefer-template': errorLevel,
			'prefer-arrow-callback': errorLevel,
			'class-methods-use-this': errorLevel,
			'no-negated-condition': 'error',
		},
	},
])
