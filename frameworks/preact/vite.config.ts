import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

// The official Preact preset with its defaults (prerendering off).
export default defineConfig({ plugins: [preact()] });
