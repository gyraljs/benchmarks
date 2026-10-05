import { fileURLToPath } from 'node:url';
import { gyralVitePreset } from '@gyral/core/vite';
import { defineConfig } from 'vite';

// The same app sources as frameworks/gyral (apps/ is a symlink), built against the
// two-track @gyral/core (Gyral branch exp/two-track). Every bare `@gyral/core` import in the
// bundle, including the one inside @gyral/time, resolves to that build.
const preset = gyralVitePreset();
const twoTrackCore = fileURLToPath(import.meta.resolve('@gyral/core-twotrack'));

export default defineConfig({
  ...preset,
  resolve: {
    ...preset.resolve,
    alias: [{ find: /^@gyral\/core$/, replacement: twoTrackCore }],
  },
});
