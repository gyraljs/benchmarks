import { gyralVitePreset } from '@gyral/core/vite';
import { defineConfig } from 'vite';

// gyralVitePreset(): the template compiler (`vite build` checks and precompiles templates), as
// create-gyral 0.3.0 set up. This slot keeps Gyral 0.3.0 (npm) and the apps as measured on
// 2026-10-07, for comparison with the current release in frameworks/gyral.
export default defineConfig({ ...gyralVitePreset() });
