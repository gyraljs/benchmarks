// node scripts/validate-timing.mjs [--quick]
// Checks the runtime timing method and writes results/<date>-timing-validation/:
// 1. Accuracy: a synthetic page whose click handler busy-waits a known number of ms. The
//    trace's script time must match it within ±2 ms, at CPU 1x and 4x.
// 2. Frame steps: the same sweep, plus "select row" and "update every 10th row" on two
//    frameworks, timed with both methods. The older in-page method rounds up to the next
//    frame (~16.7 ms steps); trace timing should follow the work continuously.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { ROOT } from './lib/config.mjs';
import { probe } from './lib/drift.mjs';
import { OPERATIONS, runtime, traceClick } from './lib/runtime.mjs';
import { summarize } from './lib/stats.mjs';
import { startServer } from './serve.mjs';

const quick = process.argv.includes('--quick');
const BUSY = [2, 5, 8.3, 12.5, 20, 25, 33.3, 41.7, 50];
const N = quick ? 3 : 10;
const FRAME = 1000 / 60;
const PAGE = `<!doctype html><button id="go" style="font:20px sans-serif">go</button><p id="out">0</p>
<script>
  let n = 0;
  document.getElementById('go').addEventListener('click', () => {
    const until = performance.now() + Number(document.body.dataset.busy);
    while (performance.now() < until);
    document.getElementById('out').textContent = String(++n);
  });
  window.frameTimed = () => new Promise((resolve) => {
    const t0 = performance.now();
    document.getElementById('go').click();
    requestAnimationFrame(() => {
      const ch = new MessageChannel();
      ch.port1.onmessage = () => resolve(performance.now() - t0);
      ch.port2.postMessage(null);
    });
  });
</script>`;

/** Distance in ms from `t` to the nearest whole number of frames. */
const offFrame = (t) => Math.abs(t - Math.round(t / FRAME) * FRAME);

async function synthetic(browser, cpu) {
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await page.setContent(PAGE);
  const box = await page.locator('#go').boundingBox();
  const at = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  const rows = [];
  for (const busy of BUSY) {
    await page.evaluate((b) => (document.body.dataset.busy = String(b)), busy);
    const trace = [];
    const frame = [];
    for (let i = 0; i < N; i++) {
      const before = await page.textContent('#out');
      trace.push(
        await traceClick(page, at, async () => (await page.textContent('#out')) !== before),
      );
      frame.push(await page.evaluate(() => window.frameTimed()));
    }
    const script = summarize(trace.map((t) => t.script));
    rows.push({
      busy,
      scriptMedian: script.median,
      scriptError: Math.round((script.median - busy) * 100) / 100,
      maxAbsError: Math.max(...trace.map((t) => Math.abs(t.script - busy))),
      total: summarize(trace.map((t) => t.total)),
      frame: summarize(frame),
    });
  }
  await page.close();
  return rows;
}

const server = await startServer();
const browser = await chromium.launch();
const out = { date: new Date().toISOString().slice(0, 10), quick, probes: [probe('start')] };
try {
  out.synthetic = { cpu1: await synthetic(browser, 1), cpu4: await synthetic(browser, 4) };
  const ops = OPERATIONS.filter((op) => op.key === 'select' || op.key === 'update10th');
  const settings = { warmup: 1, runs: quick ? 3 : 30, cpu: 4, log: console.log, operations: ops };
  out.frameworks = {};
  for (const timing of ['trace', 'frame']) {
    out.frameworks[timing] = await runtime(browser, server.url, ['solid', 'gyral'], {
      ...settings,
      timing,
    });
  }
} finally {
  await browser.close();
  await server.close();
}
out.probes.push(probe('end'));

// Report.
const f1 = (x) => x.toFixed(1);
const lines = [`# Timing validation, ${out.date}${quick ? ' (quick)' : ''}`, ''];
lines.push(
  '## 1. Accuracy: synthetic busy loop',
  '',
  `${N} samples per row. "script" is the trace's script time (median); it should equal the`,
  'busy time within ±2 ms. "total" adds the frame that shows the change. "frame method" is',
  'the older in-page end point (rAF + MessageChannel) for the same click.',
  '',
);
for (const [key, rows] of Object.entries(out.synthetic)) {
  lines.push(`### CPU ${key.slice(3)}x`, '');
  lines.push(
    '| busy (ms) | script | error | max abs error | total (median) | frame method (median) |',
  );
  lines.push('| ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const r of rows) {
    lines.push(
      `| ${r.busy} | ${f1(r.scriptMedian)} | ${r.scriptError >= 0 ? '+' : ''}${r.scriptError.toFixed(2)} | ${r.maxAbsError.toFixed(2)} | ${f1(r.total.median)} | ${f1(r.frame.median)} |`,
    );
  }
  const pass = rows.every((r) => Math.abs(r.scriptError) <= 2);
  lines.push('', `Within ±2 ms (median): **${pass ? 'yes' : 'NO'}**`, '');
}
lines.push('## 2. Frame steps: real operations, CPU 4x', '');
lines.push(
  'For each method: median, spread (max − min), and the mean distance of the samples from the',
  'nearest multiple of 16.7 ms. Times that snap to frames have a small mean distance; a',
  'continuous measurement averages about 4.2 ms (a quarter frame) for spread-out values.',
  '',
  '| framework / operation | method | median | min–max | mean distance to frame multiple | samples |',
  '| --- | --- | ---: | ---: | ---: | --- |',
);
for (const timing of ['trace', 'frame']) {
  for (const [fw, byOp] of Object.entries(out.frameworks[timing])) {
    for (const [op, s] of Object.entries(byOp)) {
      const dist = s.samples.reduce((a, t) => a + offFrame(t), 0) / s.samples.length;
      lines.push(
        `| ${fw} / ${op} | ${timing} | ${f1(s.median)} | ${f1(s.min)}–${f1(s.max)} | ${dist.toFixed(1)} | ${[
          ...s.samples,
        ]
          .sort((a, b) => a - b)
          .map(f1)
          .join(', ')} |`,
      );
    }
  }
}
const cal = out.probes.map((p) => `${p.label} ${p.calibrationMs} ms, load ${p.load1}`).join('; ');
lines.push('', `Machine probes: ${cal}.`, '');
const dir = join(ROOT, 'results', `${out.date}-timing-validation${quick ? '-quick' : ''}`);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'validation.json'), `${JSON.stringify(out, null, 2)}\n`);
writeFileSync(join(dir, 'VALIDATION.md'), lines.join('\n'));
console.log(`wrote ${join(dir, 'VALIDATION.md')}`);
