// pnpm sizes: bundle sizes of every built app. Each file is compressed on its own, as a server
// would send it: gzip level 9 and brotli quality 11. "js" counts JavaScript only; "total"
// adds HTML and CSS.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { APPS, DIST, FRAMEWORKS } from './lib/config.mjs';

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

function measure(buffer) {
  return {
    min: buffer.length,
    gzip: gzipSync(buffer, { level: 9 }).length,
    brotli: brotliCompressSync(buffer, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  };
}

const add = (a, b) => ({ min: a.min + b.min, gzip: a.gzip + b.gzip, brotli: a.brotli + b.brotli });
const ZERO = { min: 0, gzip: 0, brotli: 0 };

/** `{ gyral: { counter: { js: {min,gzip,brotli}, total: {...} } } }` */
export function sizes(frameworks = FRAMEWORKS) {
  const out = {};
  for (const fw of frameworks) {
    out[fw] = {};
    for (const app of APPS) {
      let js = ZERO;
      let total = ZERO;
      for (const file of files(join(DIST, fw, app))) {
        const ext = extname(file);
        if (!['.js', '.css', '.html'].includes(ext)) continue;
        const size = measure(readFileSync(file));
        total = add(total, size);
        if (ext === '.js') js = add(js, size);
      }
      out[fw][app] = { js, total };
    }
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const table = sizes();
  for (const app of APPS) {
    console.log(`\n${app} (JS gzip KiB)`);
    for (const fw of FRAMEWORKS) {
      console.log(`  ${fw.padEnd(7)} ${(table[fw][app].js.gzip / 1024).toFixed(1)}`);
    }
  }
}
