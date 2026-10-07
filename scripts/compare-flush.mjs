// node scripts/compare-flush.mjs [--quick] [--runs=N] [--ops=select,swap] [--label=x]
// The flush-timing spike (Gyral bead gyral-g1r.8): times the gyral-next table app with each
// scheduler flush strategy in one interleaved session, next to published Gyral 0.2.0 and Lit,
// with trace timing. The strategies are picked by `?gyral-flush=` on the page URL, which only
// a gyral-next pack built with results/2026-10-06-gyral-next-spike/flush-switch.patch reads
// (the switch was temporary and is not in any Gyral commit). Writes
// results/<date>-gyral-next-spike/flush[-label].{json,md}. Run under the machine lock:
// `flock /tmp/gyral-bench.lock node scripts/compare-flush.mjs`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { ROOT } from './lib/config.mjs';
import { driftSummary, probe } from './lib/drift.mjs';
import { OPERATIONS, runtime } from './lib/runtime.mjs';
import { startServer } from './serve.mjs';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const quick = process.argv.includes('--quick');
const keys = (arg('ops') ?? 'select,swap,update10th,create1k,clear1k').split(',');
const label = arg('label');
const VARIANTS = {
  'gyral 0.2.0': 'gyral/table/',
  lit: 'lit/table/',
  'next microtask': 'gyral-next/table/',
  'next task (MessageChannel)': 'gyral-next/table/?gyral-flush=task',
  'next setTimeout 0': 'gyral-next/table/?gyral-flush=timeout',
  'next rAF': 'gyral-next/table/?gyral-flush=raf',
};
const runs = Number(arg('runs') ?? (quick ? 3 : 10));
const settings = { warmup: quick ? 1 : 2, runs, cpu: 4 };
const operations = OPERATIONS.filter((op) => keys.includes(op.key));
const names = Object.keys(VARIANTS);
const probes = [probe('start')];

const server = await startServer();
const browser = await chromium.launch();
let results;
try {
  results = await runtime(browser, server.url, names, {
    ...settings,
    operations,
    url: (name) => `${server.url}/${VARIANTS[name]}`,
    log: (line) => console.log(line),
    afterOperation: (op) => {
      probes.push(probe(op.key));
    },
  });
} finally {
  await browser.close();
  await server.close();
}
probes.push(probe('end'));
const drift = { ...driftSummary(probes), probes };

const f = (x) => (x === undefined ? '' : x.toFixed(1));
const lines = [
  `# Flush strategies (gyral-next), ${new Date().toISOString().slice(0, 10)}`,
  '',
  `Trace timing, CPU 4x, ${settings.warmup} warm-up + ${runs} measured samples per cell, ` +
    `interleaved. Machine drift ${(drift.spread * 100).toFixed(1)}%` +
    `${drift.flagged ? ' (FLAGGED: compare within this run only)' : ''}.`,
  '',
  'Median total ms (p90), then the median breakdown: script / paint / idle.',
  '',
  `| Variant | ${operations.map((op) => op.name).join(' | ')} |`,
  `| --- | ${operations.map(() => '---:').join(' | ')} |`,
  ...names.map((name) => {
    const cells = operations.map((op) => {
      const r = results[name][op.key];
      const b = r.breakdown ?? {};
      return `${f(r.median)} (${f(r.p90)})<br>${f(b.script)} / ${f(b.paint)} / ${f(b.idle)}`;
    });
    return `| ${name} | ${cells.join(' | ')} |`;
  }),
  '',
];
const dir = join(ROOT, 'results', `${new Date().toISOString().slice(0, 10)}-gyral-next-spike`);
mkdirSync(dir, { recursive: true });
const base = label === undefined ? 'flush' : `flush-${label}`;
writeFileSync(
  join(dir, `${base}.json`),
  `${JSON.stringify({ variants: VARIANTS, settings, drift, results }, null, 2)}\n`,
);
writeFileSync(join(dir, `${base}.md`), lines.join('\n'));
console.log(lines.join('\n'));
