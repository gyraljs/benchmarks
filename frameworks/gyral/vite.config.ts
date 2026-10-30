import { gyral } from '@gyral/core/vite';
import { defineConfig } from 'vite';

// gyral({ clientOnly: true }), as create-gyral's client-rendered template sets up: Gyral's Vite
// plugins, with the template compiler (`vite build` checks and precompiles templates), and no
// hydration code, since no page here is rendered on a server.
export default defineConfig({ plugins: [gyral({ clientOnly: true })] });
