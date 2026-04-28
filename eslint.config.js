import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React 19 JSX transform doesn't require React in scope; allow it as harmless.
      'no-unused-vars': ['warn', { varsIgnorePattern: '^(React|_)', args: 'none' }],
      // Helpful in this multi-export module structure; demote to warning.
      'react-refresh/only-export-components': 'warn',
    },
  },
])
