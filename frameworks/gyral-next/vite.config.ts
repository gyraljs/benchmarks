import { gyralVitePreset } from '@gyral/core/vite';
import { defineConfig } from 'vite';

// gyralVitePreset(): the template compiler (`vite build` checks and precompiles templates), as
// create-gyral sets up. @gyral/core here is the 0.3 pack in vendor-next/ (no Lit).
export default defineConfig({ ...gyralVitePreset() });
