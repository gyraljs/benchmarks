// node scripts/compare.mjs <out.md> <label>=<results dir> ...
// Compares Gyral across result runs (e.g. A, B, C) and writes a markdown table per metric.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [out, ...specs] = process.argv.slice(2);
if (out === undefined || specs.length < 2) {
  console.error('usage: node scripts/compare.mjs <out.md> <label>=<results dir> ...');
  process.exit(1);
}
const runs = specs.map((spec) => {
  const [label, dir] = spec.split('=');
  return { label, data: JSON.parse(readFileSync(join(dir, 'results.json'), 'utf8')), dir };
});

const kib = (bytes) => (bytes / 1024).toFixed(1);
const row = (cells) => `| ${cells.join(' | ')} |`;
const header = (first) => [
  row([first, ...runs.map((r) => r.label)]),
  row(['---', ...runs.map(() => '---:')]),
];

const lines = ['## Gyral across runs', ''];
lines.push('### Bundle: JavaScript gzip (KiB)', '', ...header('App'));
for (const app of Object.keys(runs[0].data.sizes.gyral)) {
  lines.push(row([app, ...runs.map((r) => kib(r.data.sizes.gyral[app].js.gzip))]));
}
lines.push('', '### Bundle: JavaScript brotli (KiB)', '', ...header('App'));
for (const app of Object.keys(runs[0].data.sizes.gyral)) {
  lines.push(row([app, ...runs.map((r) => kib(r.data.sizes.gyral[app].js.brotli))]));
}
lines.push('', '### Startup, todo app, CPU 4x + network throttled (ms, median / p90)', '');
lines.push(...header('Milestone'));
for (const key of Object.keys(runs[0].data.startup.gyral)) {
  const cell = (r) => {
    const s = r.data.startup.gyral[key];
    return s === undefined ? '—' : `${s.median.toFixed(0)} / ${s.p90.toFixed(0)}`;
  };
  lines.push(row([key, ...runs.map(cell)]));
}
lines.push('', '### Table runtime, CPU 4x (ms, median / p90)', '', ...header('Operation'));
for (const op of Object.keys(runs[0].data.runtime.gyral)) {
  const cell = (r) => {
    const s = r.data.runtime.gyral[op];
    return s === undefined ? '—' : `${s.median.toFixed(1)} / ${s.p90.toFixed(1)}`;
  };
  lines.push(row([op, ...runs.map(cell)]));
}
lines.push('', '### JS heap (MB, median)', '', ...header('Point'));
for (const key of Object.keys(runs[0].data.memory.gyral)) {
  const cell = (r) => r.data.memory.gyral[key]?.median.toFixed(2) ?? '—';
  lines.push(row([key, ...runs.map(cell)]));
}
lines.push('', 'Sources:', '', ...runs.map((r) => `- **${r.label}**: \`${r.dir}\``), '');
writeFileSync(out, lines.join('\n'));
console.log(`wrote ${out}`);
