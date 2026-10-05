// pnpm report results/<run>: regenerates results.md from that run's results.json (the JSON is
// the record; the markdown is derived from it).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { markdown } from './lib/report.mjs';

const dir = process.argv[2];
if (dir === undefined) {
  console.error('usage: pnpm report results/<run>');
  process.exit(1);
}
const results = JSON.parse(readFileSync(join(resolve(dir), 'results.json'), 'utf8'));
writeFileSync(join(resolve(dir), 'results.md'), markdown(results));
console.log(`wrote ${join(dir, 'results.md')}`);
