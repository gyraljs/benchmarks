import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// The official Vue plugin with its defaults (single-file components, runtime-only build).
export default defineConfig({ plugins: [vue()] });
