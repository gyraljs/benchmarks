import { fileURLToPath } from 'node:url';
import { gyralVitePreset } from '@gyral/core/vite';
import { defineConfig } from 'vite';

// The same app sources as frameworks/gyral (apps/ is a symlink), built against @gyral/core from
// Gyral branch exp/whitespace (template whitespace minification, gyral-9rf; Effect 4 + lit-html
// 3.3.0 like frameworks/gyral). Every bare `@gyral/core` import, including the one inside
// @gyral/time, resolves to that build.
const preset = gyralVitePreset();
const wsCore = fileURLToPath(import.meta.resolve('@gyral/core-ws'));

export default defineConfig({
  ...preset,
  resolve: {
    ...preset.resolve,
    alias: [{ find: /^@gyral\/core$/, replacement: wsCore }],
  },
});
