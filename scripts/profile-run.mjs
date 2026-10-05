// pnpm profile:run [--quick] — times the profiling variants (scripts/lib/variants.mjs) with
// trace timing in one interleaved session, and writes results/<date>-profile/variants.json +
// variants.md (median and the script / style+layout / paint breakdown per operation).
// Run under the machine lock: `flock /tmp/gyral-bench.lock pnpm profile:run`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { loadavg } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { ROOT } from './lib/config.mjs';
import { driftSummary, probe } from './lib/drift.mjs';
import { OPERATIONS, runtime } from './lib/runtime.mjs';
import { VARIANTS } from './lib/variants.mjs';
import { startServer } from './serve.mjs';

const quick = process.argv.includes('--quick');
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
// --ops=create10k,clear1k re-runs a subset; --label=x writes variants-x.{json,md}.
const KEYS = arg('ops')?.split(',') ?? [
  'create1k',
  'replace1k',
  'update10th',
  'select',
  'swap',
  'create10k',
  'clear1k',
];
const label = arg('label');
// Work outside the lock (other Chromium runs) skews timings: wait for a quiet machine.
const QUIET_LOAD = Number(arg('quiet') ?? 3);
async function quiet() {
  while (loadavg()[0] > QUIET_LOAD) await new Promise((r) => setTimeout(r, 15000));
}
const operations = OPERATIONS.filter((op) => KEYS.includes(op.key));
const settings = quick ? { warmup: 1, runs: 2, cpu: 4 } : { warmup: 2, runs: 10, cpu: 4 };
const names = Object.keys(VARIANTS);
await quiet();
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
    beforeSample: quiet,
    afterOperation: async (op) => {
      probes.push(probe(op.key));
      await quiet();
    },
  });
} finally {
  await browser.close();
  await server.close();
}
probes.push(probe('end'));

const date = new Date().toISOString().slice(0, 10);
const dir = join(ROOT, 'results', quick ? 'quick-profile' : `${date}-profile`);
mkdirSync(dir, { recursive: true });
const meta = {
  date,
  settings,
  browser: browser.version(),
  variants: VARIANTS,
  drift: driftSummary(probes),
  probes,
};
const file = label === undefined ? 'variants' : `variants-${label}`;
writeFileSync(join(dir, `${file}.json`), `${JSON.stringify({ meta, results }, null, 2)}\n`);

const ms = (n) => (n === undefined ? '' : n.toFixed(1));
const lines = [
  `# Profiling variants (${date}${quick ? ', quick' : ''})`,
  '',
  `Trace timing, CPU ${settings.cpu}x, ${settings.runs} runs after ${settings.warmup} warm-up, interleaved. ` +
    `Drift: spread ${meta.drift.spread}, peak load ${meta.drift.maxLoad1}${meta.drift.flagged ? ' — **FLAGGED**' : ''}.`,
  '',
];
for (const op of operations) {
  lines.push(
    `## ${op.name}`,
    '',
    '| variant | median | p90 | script | style+layout | paint | idle |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  );
  for (const name of names) {
    const r = results[name][op.key];
    const b = r.breakdown ?? {};
    lines.push(
      `| ${name} | ${ms(r.median)} | ${ms(r.p90)} | ${ms(b.script)} | ${ms(b.styleLayout)} | ${ms(b.paint)} | ${ms(b.idle)} |`,
    );
  }
  lines.push('');
}
writeFileSync(join(dir, `${file}.md`), `${lines.join('\n')}\n`);
console.log(`wrote ${join(dir, `${file}.md`)}`);
