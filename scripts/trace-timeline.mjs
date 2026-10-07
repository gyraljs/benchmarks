// node scripts/trace-timeline.mjs [--only=gyral,solid] [--ops=select,swap] [--runs=3]
//                                 [--cpu=4] [--out=dir] [--url=fw=path,…]
// Explains where a table operation's time goes: runs the operation exactly as `pnpm bench`
// does (fresh page, unthrottled warm-up, GC, CPU throttling, a real mouse click in a Chrome
// trace), with extra trace categories (top-level tasks, frame scheduling), and prints the
// renderer main thread's timeline from the click to the end of the frame's Commit: every task,
// the click's dispatch, microtasks, timers, animation frames, style, layout, paint and commit,
// with times relative to the click. `--out` also saves each raw trace (open it in DevTools'
// Performance panel). Needs a build (`pnpm build`). Used for the idle-gap analysis of
// results/2026-10-06-gyral-next-spike/NOTES.md.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { selectedFrameworks } from './lib/config.mjs';
import { OPERATIONS, openTable } from './lib/runtime.mjs';
import { analyzeTrace, TRACE_CATEGORIES } from './lib/trace.mjs';
import { startServer } from './serve.mjs';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const frameworks = selectedFrameworks();
const keys = (arg('ops') ?? 'select').split(',');
const runs = Number(arg('runs') ?? 3);
const cpu = Number(arg('cpu') ?? 4);
const out = arg('out');
// --url=gyral-next=gyral-next/table/?flush=task: a framework name mapped to another page.
const urls = Object.fromEntries(
  (arg('url') ?? '')
    .split(',')
    .filter(Boolean)
    .map((p) => [p.slice(0, p.indexOf('=')), p.slice(p.indexOf('=') + 1)]),
);

const CATEGORIES = [
  ...TRACE_CATEGORIES,
  'toplevel',
  'disabled-by-default-devtools.timeline.frame',
  'blink.user_timing',
];
// Main-thread slices worth printing (top-level tasks are printed as their own lines).
const SHOWN = new Set([
  'EventDispatch',
  'FunctionCall',
  'TimerFire',
  'FireAnimationFrame',
  'RunMicrotasks',
  'UpdateLayoutTree',
  'Layout',
  'PrePaint',
  'Paint',
  'Layerize',
  'Commit',
  'HitTest',
  'ParseHTML',
  'BeginMainThreadFrame',
  'ScheduleStyleRecalculation',
  'RequestAnimationFrame',
  'TimerInstall',
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function traceOnce(page, op) {
  const cdp = await page.context().newCDPSession(page);
  for (const step of op.prep) {
    const ctx = await page.evaluate(() => ({
      first: window.__bench.rowId(0),
      id998: window.__bench.rowId(998),
    }));
    await page.evaluate(([t, c]) => window.__bench.measure(t, c), [step.target, step.cond(ctx)]);
  }
  await cdp.send('HeapProfiler.collectGarbage');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  const ctx = await page.evaluate(() => ({
    first: window.__bench.rowId(0),
    id998: window.__bench.rowId(998),
  }));
  const cond = op.step.cond(ctx);
  const at = await page.evaluate((t) => window.__bench.point(t), op.step.target);
  const browser = page.context().browser();
  await browser.startTracing(page, { categories: CATEGORIES });
  let events;
  try {
    await page.mouse.click(at.x, at.y);
    while (!(await page.evaluate((c) => window.__bench.holds(c), cond))) await sleep(10);
    await sleep(50);
    await page.evaluate(() => 0);
    await sleep(50);
  } finally {
    events = JSON.parse((await browser.stopTracing()).toString()).traceEvents;
  }
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await cdp.detach();
  return events;
}

/** The main thread's slices from the click to the end of the measured Commit, as text lines. */
function timeline(events, result) {
  const click = events.find(
    (e) => e.ph === 'X' && e.name === 'EventDispatch' && e.args?.data?.type === 'click',
  );
  const from = click.ts;
  const to = from + result.total * 1000;
  const main = events.filter(
    (e) =>
      e.pid === click.pid &&
      e.tid === click.tid &&
      e.ts + (e.dur ?? 0) >= from - 2000 &&
      e.ts <= to + 500,
  );
  const ms = (us) => ((us - from) / 1000).toFixed(2).padStart(7);
  const lines = [];
  for (const e of main.sort((a, b) => a.ts - b.ts)) {
    const task = e.name === 'ThreadControllerImpl::RunTask';
    if (!task && !SHOWN.has(e.name)) continue;
    if (task && (e.dur ?? 0) < 50) continue; // skip empty tasks (< 0.05 ms)
    const dur = e.dur === undefined ? '      ' : `${(e.dur / 1000).toFixed(2).padStart(6)}`;
    const data = e.args?.data ?? {};
    const where = data.url
      ? `${data.url.split('/').at(-1)}:${data.lineNumber}:${data.columnNumber}`
      : '';
    const detail = [
      data.type,
      data.functionName,
      where,
      data.timerId,
      data.frame === undefined ? '' : 'frame',
    ]
      .filter((x) => x !== undefined && x !== '')
      .join(' ');
    const indent = task ? '' : '  ';
    lines.push(`${ms(e.ts)} ${dur} ${indent}${task ? 'TASK' : e.name} ${detail}`.trimEnd());
  }
  return lines;
}

const server = await startServer();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
try {
  for (const key of keys) {
    const op = OPERATIONS.find((o) => o.key === key);
    for (const fw of frameworks) {
      for (let run = 0; run < runs; run++) {
        const page = await openTable(context, `${server.url}/${urls[fw] ?? `${fw}/table/`}`);
        const events = await traceOnce(page, op);
        await page.close();
        const r = analyzeTrace(events);
        console.log(
          `\n## ${fw} ${key} #${run + 1}: total ${r.total} ms (script ${r.script}, ` +
            `style+layout ${r.styleLayout}, paint ${r.paint}, idle ${r.idle})`,
        );
        for (const line of timeline(events, r)) console.log(line);
        if (out !== undefined) {
          mkdirSync(out, { recursive: true });
          writeFileSync(
            join(out, `${fw}-${key}-${run + 1}.json`),
            JSON.stringify({ traceEvents: events }),
          );
        }
      }
    }
  }
} finally {
  await context.close();
  await browser.close();
  await server.close();
}
