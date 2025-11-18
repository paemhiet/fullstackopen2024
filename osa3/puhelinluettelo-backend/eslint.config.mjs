import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  {
    files: ['**/*.js'],
    ignores: ['dist/**'], // <-- estää buildin virheet

    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node
      }
    },

    plugins: {
      '@stylistic/js': stylisticJs
    },

    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      ...js.configs.recommended.rules
    }
  }
]
