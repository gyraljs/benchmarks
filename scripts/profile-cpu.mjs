// pnpm profile:cpu — V8 CPU profiles (CDP Profiler, 100 µs sampling) of table operations for
// the unminified, one-file-per-module builds (dist/u-<fw>/table, scripts/profile-build.mjs),
// so every sample can be attributed to lit-html, @gyral/core, effect, the app or the browser.
// Same operation prep and 4x CPU throttling as the timing runs; N samples per operation.
// Writes results/<date>-profile/cpu.{json,md}. Run under the machine lock.
import { mkdirSync, writeFileSync } from 'node:fs';
import { loadavg } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { ROOT } from './lib/config.mjs';
import { openTable, OPERATIONS } from './lib/runtime.mjs';
import { startServer } from './serve.mjs';

const N = Number(process.argv.find((a) => a.startsWith('--n='))?.slice(4) ?? 5);
const KEYS = ['create1k', 'update10th', 'select', 'swap'];
const operations = OPERATIONS.filter((op) => KEYS.includes(op.key));
const TARGETS = { gyral: 'u-gyral/table/?shadow=1', lit: 'u-lit/table/?shadow=1' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** Waits for a quiet machine (1-minute load ≤ 3), as profile-run.mjs does. */
async function quiet() {
  while (loadavg()[0] > 3) await sleep(15000);
}

/** Which bucket a sampled call frame belongs to, from its module URL. */
export function bucket(frame) {
  const { url, functionName } = frame;
  if (url === '') {
    if (functionName === '(garbage collector)') return 'gc';
    if (functionName === '(idle)') return 'idle';
    // (program): the renderer outside JS (style, layout, paint, parsing); named frames with no
    // URL are native DOM methods (insertBefore, importNode, …) called by the JS above them.
    if (functionName === '(program)' || functionName === '(root)') return 'program';
    return 'native DOM';
  }
  if (/lit-html|lit-element|reactive-element|\/lit@/.test(url)) return 'lit';
  if (/gyral_core|@gyral/.test(url)) return 'gyral core';
  if (/effect@/.test(url)) return 'effect';
  if (/shared\/src|frameworks\//.test(url)) return 'app';
  return `other`;
}

/** Self time (ms) per bucket and per function from one Profiler profile. */
function selfTimes(profile) {
  const byId = new Map(profile.nodes.map((n) => [n.id, n]));
  const counts = new Map();
  for (const id of profile.samples) counts.set(id, (counts.get(id) ?? 0) + 1);
  const total = profile.endTime - profile.startTime;
  const perSample = total / 1000 / Math.max(1, profile.samples.length);
  const buckets = {};
  const fns = {};
  for (const [id, n] of counts) {
    const frame = byId.get(id).callFrame;
    const b = bucket(frame);
    const ms = n * perSample;
    buckets[b] = (buckets[b] ?? 0) + ms;
    const file = frame.url.split('/').slice(-2).join('/');
    const key = `${frame.functionName || '(anonymous)'} ${file}:${frame.lineNumber + 1} [${b}]`;
    fns[key] = (fns[key] ?? 0) + ms;
  }
  return { buckets, fns };
}

async function profiled(context, url, op) {
  const page = await openTable(context, url);
  const cdp = await context.newCDPSession(page);
  try {
    for (const step of op.prep) {
      const ctx = await page.evaluate(() => ({
        first: window.__bench.rowId(0),
        id998: window.__bench.rowId(998),
      }));
      await page.evaluate(([t, c]) => window.__bench.measure(t, c), [step.target, step.cond(ctx)]);
    }
    await cdp.send('HeapProfiler.collectGarbage');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.setSamplingInterval', { interval: 100 });
    const ctx = await page.evaluate(() => ({
      first: window.__bench.rowId(0),
      id998: window.__bench.rowId(998),
    }));
    const at = await page.evaluate((t) => window.__bench.point(t), op.step.target);
    const cond = op.step.cond(ctx);
    await cdp.send('Profiler.start');
    await page.mouse.click(at.x, at.y);
    while (!(await page.evaluate((c) => window.__bench.holds(c), cond))) await sleep(5);
    await sleep(60);
    const { profile } = await cdp.send('Profiler.stop');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    return selfTimes(profile);
  } finally {
    await cdp.detach();
    await page.close();
  }
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length === 0 ? 0 : s[Math.floor(s.length / 2)];
};

const server = await startServer();
const browser = await chromium.launch();
const out = {};
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  for (const op of operations) {
    for (const [fw, path] of Object.entries(TARGETS)) {
      const runs = [];
      for (let i = 0; i < N + 1; i++) {
        await quiet();
        runs.push(await profiled(context, `${server.url}/${path}`, op));
      }
      runs.shift(); // warm-up
      const names = new Set(runs.flatMap((r) => Object.keys(r.buckets)));
      const fnNames = new Set(runs.flatMap((r) => Object.keys(r.fns)));
      const buckets = Object.fromEntries(
        [...names].map((b) => [b, median(runs.map((r) => r.buckets[b] ?? 0))]),
      );
      const top = [...fnNames]
        .map((f) => [f, median(runs.map((r) => r.fns[f] ?? 0))])
        .filter(([f]) => !/\[(idle|program|gc)\]/.test(f))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12);
      (out[op.key] ??= {})[fw] = { buckets, top };
      console.log(
        `${op.key} ${fw}: ${Object.entries(buckets)
          .map(([b, v]) => `${b} ${v.toFixed(1)}`)
          .join(', ')}`,
      );
    }
  }
  await context.close();
} finally {
  await browser.close();
  await server.close();
}

const date = new Date().toISOString().slice(0, 10);
const dir = join(ROOT, 'results', `${date}-profile`);
mkdirSync(dir, { recursive: true });
writeFileSync(
  join(dir, 'cpu.json'),
  `${JSON.stringify({ n: N, targets: TARGETS, out }, null, 2)}\n`,
);
const BUCKETS = ['app', 'gyral core', 'effect', 'lit', 'native DOM', 'gc', 'program', 'other'];
const lines = [`# JS self time by module (median of ${N}, ms, CPU 4x)`, ''];
for (const op of operations) {
  lines.push(
    `## ${op.name}`,
    '',
    `| | ${BUCKETS.join(' | ')} |`,
    `| --- |${' ---: |'.repeat(BUCKETS.length)}`,
  );
  for (const fw of Object.keys(TARGETS)) {
    const b = out[op.key][fw].buckets;
    lines.push(`| ${fw} | ${BUCKETS.map((k) => (b[k] ?? 0).toFixed(1)).join(' | ')} |`);
  }
  for (const fw of Object.keys(TARGETS)) {
    lines.push(
      '',
      `Top self time, ${fw}:`,
      '',
      ...out[op.key][fw].top.map(([f, v]) => `- ${v.toFixed(2)} ms ${f}`),
    );
  }
  lines.push('');
}
writeFileSync(join(dir, 'cpu.md'), `${lines.join('\n')}\n`);
console.log(`wrote ${join(dir, 'cpu.md')}`);
