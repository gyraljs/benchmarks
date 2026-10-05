// node scripts/compare-noeffect.mjs <results-dir>: writes <results-dir>/COMPARISON-noeffect.md,
// comparing Gyral on Effect 4 with Gyral without Effect, next to Lit, Svelte and Solid, all
// from one results.json (one session, so milliseconds are directly comparable).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (dir === undefined) throw new Error('usage: node scripts/compare-noeffect.mjs <results-dir>');
const data = JSON.parse(readFileSync(join(dir, 'results.json'), 'utf8'));
const FWS = ['gyral', 'gyral-noeffect', 'lit', 'svelte', 'solid'].filter((fw) =>
  data.meta.frameworks.includes(fw),
);
const NAMES = { gyral: 'Gyral (Effect 4)', 'gyral-noeffect': 'Gyral (no Effect)' };
const name = (fw) => NAMES[fw] ?? fw[0].toUpperCase() + fw.slice(1);
const row = (cells) => `| ${cells.join(' | ')} |`;
const header = (first) => [
  row([first, ...FWS.map(name)]),
  row(['---', ...FWS.map(() => '---:')]),
];
const kib = (bytes) => (bytes / 1024).toFixed(1);
const ms = (n) => (n === undefined ? '—' : n.toFixed(1));

const lines = [
  '# Gyral with and without Effect (gyral-das)',
  '',
  `Run \`${data.meta.label ?? data.meta.date}\`, commit \`${data.meta.commit}\`, ` +
    `${data.meta.settings?.runs ?? '?'} runs per op, CPU ${data.meta.settings?.cpu ?? '?'}x, ` +
    'trace timing, lit-html 3.3.0 for Lit and both Gyral builds. Both Gyral builds use the ' +
    'same app sources (`frameworks/gyral-noeffect/apps` is a symlink).',
  '',
  `Machine drift: spread ${(data.meta.drift.spread * 100).toFixed(1)}% (limit ` +
    `${(data.meta.drift.limit * 100).toFixed(0)}%), max load ${data.meta.drift.maxLoad1}, ` +
    `${data.meta.drift.flagged ? '**FLAGGED**' : 'not flagged'}.`,
  '',
  '## Bundle size (JS, gzip KiB)',
  '',
  ...header('App'),
];
for (const app of Object.keys(data.sizes.gyral)) {
  lines.push(row([app, ...FWS.map((fw) => kib(data.sizes[fw][app].js.gzip))]));
}
lines.push('', '## Startup (todo app, ms, median)', '', ...header('Metric'));
for (const key of Object.keys(data.startup.gyral)) {
  lines.push(row([key, ...FWS.map((fw) => ms(data.startup[fw][key].median))]));
}
lines.push('', '## Memory (JS heap MB, median)', '', ...header('When'));
for (const key of Object.keys(data.memory.gyral)) {
  lines.push(row([key, ...FWS.map((fw) => data.memory[fw][key].median.toFixed(2))]));
}
lines.push('', '## Table operations (ms, median / p90)', '', ...header('Op'));
for (const op of Object.keys(data.runtime.gyral)) {
  lines.push(
    row([
      op,
      ...FWS.map((fw) => `${ms(data.runtime[fw][op].median)} / ${ms(data.runtime[fw][op].p90)}`),
    ]),
  );
}
lines.push(
  '',
  '## Where the time goes (median ms: script / style+layout / paint)',
  '',
  ...header('Op'),
);
for (const op of Object.keys(data.runtime.gyral)) {
  lines.push(
    row([
      op,
      ...FWS.map((fw) => {
        const b = data.runtime[fw][op].breakdown;
        return b === undefined
          ? '—'
          : `${ms(b.script)} / ${ms(b.styleLayout)} / ${ms(b.paint)}`;
      }),
    ]),
  );
}
const geo = (fw) => {
  const ops = Object.keys(data.runtime.gyral);
  const ratios = ops.map((op) => {
    const best = Math.min(...data.meta.frameworks.map((f) => data.runtime[f][op].median));
    return data.runtime[fw][op].median / best;
  });
  return Math.exp(ratios.reduce((s, r) => s + Math.log(r), 0) / ratios.length);
};
lines.push(
  '',
  '## Table runtime, geometric mean vs fastest (all frameworks in this run)',
  '',
  row(data.meta.frameworks.map(name)),
  row(data.meta.frameworks.map(() => '---:')),
  row(data.meta.frameworks.map((fw) => geo(fw).toFixed(2))),
  '',
);
writeFileSync(join(dir, 'COMPARISON-noeffect.md'), lines.join('\n'));
console.log(`wrote ${join(dir, 'COMPARISON-noeffect.md')}`);
