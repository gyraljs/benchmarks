// The frameworks and apps the benchmark covers. Every script reads these lists.
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DIST = join(ROOT, 'dist');

export const FRAMEWORKS = ['gyral', 'gyral-ws', 'lit', 'react', 'preact', 'vue', 'svelte', 'solid'];
export const APPS = ['floor', 'counter', 'todo', 'search', 'form', 'table'];

/** The framework packages each implementation depends on, for the results metadata. */
const MAIN_PACKAGES = {
  gyral: ['@gyral/core', '@gyral/time', 'effect', 'lit', 'lit-html'],
  'gyral-ws': ['@gyral/core-ws', '@gyral/time', 'effect', 'lit', 'lit-html'],
  lit: ['lit', 'lit-html'],
  react: ['react', 'react-dom'],
  preact: ['preact'],
  vue: ['vue'],
  svelte: ['svelte'],
  solid: ['solid-js'],
};

/**
 * The package.json of `name` as the framework's apps resolve it (lit-html is not a direct
 * dependency: it is found through lit, from the framework's directory).
 */
function packageJson(fw, name) {
  const direct = join(ROOT, 'frameworks', fw, 'node_modules', name, 'package.json');
  if (existsSync(direct)) return direct;
  const lit = realpathSync(join(ROOT, 'frameworks', fw, 'node_modules', 'lit', 'package.json'));
  const fromLit = createRequire(lit);
  let dir = dirname(fromLit.resolve(name));
  while (!existsSync(join(dir, 'package.json')) || dir.endsWith('development')) dir = dirname(dir);
  return join(dir, 'package.json');
}

/** `{ react: { react: '19.3.0', ... }, ... }` read from each framework's installed packages. */
export function frameworkVersions() {
  const out = {};
  for (const fw of FRAMEWORKS) {
    out[fw] = {};
    for (const name of MAIN_PACKAGES[fw]) {
      out[fw][name] = JSON.parse(readFileSync(packageJson(fw, name), 'utf8')).version;
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
