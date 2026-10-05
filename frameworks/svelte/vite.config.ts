import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// The official Svelte plugin with its defaults (Svelte 5, runes).
export default defineConfig({ plugins: [svelte()] });
