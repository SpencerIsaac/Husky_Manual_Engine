import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// ESLint is the project's "code quality spell-checker."
// This file combines general JavaScript rules, TypeScript rules,
// and React-specific rules in one flat configuration.
export default defineConfig([
  // Build output is generated code, so we do not lint it.
  globalIgnores(['dist']),
  {
    // Apply these rules only to TypeScript source files.
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // Modern browser syntax/features are allowed.
      ecmaVersion: 2020,
      // Browser globals include names like `window` and `document`.
      globals: globals.browser,
    },
  },
])
