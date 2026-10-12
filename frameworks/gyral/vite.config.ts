import { gyralVitePreset } from '@gyral/core/vite';
import { defineConfig } from 'vite';

// gyralVitePreset({ clientOnly: true }), as create-gyral's client-rendered template sets up:
// the template compiler (`vite build` checks and precompiles templates), and no hydration code,
// since no page here is rendered on a server.
export default defineConfig({ ...gyralVitePreset({ clientOnly: true }) });
