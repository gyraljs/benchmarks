// The frameworks and apps the benchmark covers. Every script reads these lists.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DIST = join(ROOT, 'dist');

export const FRAMEWORKS = ['gyral', 'lit', 'react', 'preact', 'vue', 'svelte', 'solid'];
export const APPS = ['floor', 'counter', 'todo', 'search', 'form', 'table'];

/** The framework packages each implementation depends on, for the results metadata. */
const MAIN_PACKAGES = {
  gyral: ['@gyral/core', '@gyral/time', 'lit'],
  lit: ['lit'],
  react: ['react', 'react-dom'],
  preact: ['preact'],
  vue: ['vue'],
  svelte: ['svelte'],
  solid: ['solid-js'],
};

/** `{ react: { react: '19.3.0', ... }, ... }` read from each framework's installed packages. */
export function frameworkVersions() {
  const out = {};
  for (const fw of FRAMEWORKS) {
    out[fw] = {};
    for (const name of MAIN_PACKAGES[fw]) {
      const pkg = join(ROOT, 'frameworks', fw, 'node_modules', name, 'package.json');
      out[fw][name] = JSON.parse(readFileSync(pkg, 'utf8')).version;
    }
  }
  return out;
}

/** `--only gyral,react` → ['gyral', 'react']; defaults to every framework. */
export function selectedFrameworks(argv = process.argv) {
  const flag = argv.find((a) => a.startsWith('--only='));
  if (flag === undefined) return FRAMEWORKS;
  const wanted = flag.slice('--only='.length).split(',');
  const unknown = wanted.filter((fw) => !FRAMEWORKS.includes(fw));
  if (unknown.length > 0) throw new Error(`Unknown framework(s): ${unknown.join(', ')}`);
  return wanted;
}
