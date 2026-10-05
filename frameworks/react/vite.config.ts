import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The official React plugin with its defaults (no React Compiler: it is opt-in).
export default defineConfig({ plugins: [react()] });
