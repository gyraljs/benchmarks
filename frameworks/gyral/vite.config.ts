import { gyralVitePreset } from '@gyral/core/vite';
import { defineConfig } from 'vite';

// gyralVitePreset(): one copy of Lit and Lit's modules pre-bundled (as create-gyral sets up).
export default defineConfig({ ...gyralVitePreset() });
