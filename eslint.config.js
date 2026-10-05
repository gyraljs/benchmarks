import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// TypeScript and scripts. .vue and .svelte files are checked by vue-tsc and svelte-check.
export default tseslint.config(
  { ignores: ['dist/', 'results/', 'test-results/', 'playwright-report/', '**/node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Node scripts; scripts/lib also holds functions that run inside the page (page.mjs and
    // page.evaluate callbacks), so browser globals are allowed too.
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
);
