// Runtime of the keyed table app (js-framework-benchmark operations). Every sample uses a fresh
// page: prepare unthrottled, collect garbage, then throttle the CPU and time one operation.
// Timing is trace-based by default (trace.mjs); `timing: 'frame'` keeps the older in-page
// "next frame rendered" end point for comparison.
import { summarize } from './stats.mjs';
import { tableHelpers } from './page.mjs';
import { analyzeTrace, TRACE_CATEGORIES } from './trace.mjs';

// One step = click `target`, wait until `cond(ctx)` holds. `ctx` holds ids read just before
// the step ({ first, id998 }), for conditions that depend on the current rows.
const RUN = { target: { sel: '#run' }, cond: () => ({ count: 1000 }) };
const RUN_LOTS = { target: { sel: '#runlots' }, cond: () => ({ count: 10000 }) };
const REPLACE = {
  target: { sel: '#run' },
  cond: (ctx) => ({ count: 1000, firstIdNot: ctx.first }),
};
const ADD = { target: { sel: '#add' }, cond: () => ({ count: 2000 }) };
const CLEAR = { target: { sel: '#clear' }, cond: () => ({ count: 0 }) };
const SWAP = { target: { sel: '#swaprows' }, cond: (ctx) => ({ idAt: [1, ctx.id998] }) };
const update = (n) => ({
  target: { sel: '#update' },
  cond: () => ({ suffixCount: { rows: [0, 500, 990], n } }),
});
const select = (row) => ({ target: { sel: '.lbl', row }, cond: () => ({ selected: row }) });
const remove = (row, count) => ({ target: { sel: '.remove', row }, cond: () => ({ count }) });
const times = (n, steps) => Array.from({ length: n }, () => steps).flat();

/**
 * The js-framework-benchmark operations with its in-page warm-up: `prep` runs unthrottled
 * (warming the JIT and setting up the rows), then `step` is timed under CPU throttling.
 */
export const OPERATIONS = [
  { key: 'create1k', name: 'create 1,000 rows', prep: times(5, [RUN, CLEAR]), step: RUN },
  {
    key: 'replace1k',
    name: 'replace 1,000 rows',
    prep: [RUN, ...times(5, [REPLACE])],
    step: REPLACE,
  },
  {
    key: 'update10th',
    name: 'update every 10th row',
    prep: [RUN, update(1), update(2), update(3)],
    step: update(4),
  },
  {
    key: 'select',
    name: 'select row',
    prep: [RUN, ...[5, 6, 7, 8, 9].map(select)],
    step: select(1),
  },
  { key: 'swap', name: 'swap rows', prep: [RUN, ...times(5, [SWAP])], step: SWAP },
  {
    key: 'remove',
    name: 'remove row',
    prep: [RUN, ...[999, 998, 997, 996, 995].map((count) => remove(5, count))],
    step: remove(1, 994),
  },
  { key: 'create10k', name: 'create 10,000 rows', prep: times(5, [RUN, CLEAR]), step: RUN_LOTS },
  { key: 'append1k', name: 'append 1,000 rows', prep: [...times(5, [RUN, CLEAR]), RUN], step: ADD },
  { key: 'clear1k', name: 'clear 1,000 rows', prep: [...times(5, [RUN, CLEAR]), RUN], step: CLEAR },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rowIds = (page) =>
  page.evaluate(() => ({ first: window.__bench.rowId(0), id998: window.__bench.rowId(998) }));

/** Runs one step in the page and returns its duration in ms (in-page, next-frame end point). */
async function runStep(page, step) {
  const ctx = await rowIds(page);
  return page.evaluate(([t, c]) => window.__bench.measure(t, c), [step.target, step.cond(ctx)]);
}

/**
 * Runs one step with a real mouse click inside a Chrome trace and returns `analyzeTrace`'s
 * breakdown. Nothing of ours runs in the page during the trace except the polling below
 * (CDP evaluations, which show up only as tiny RunMicrotasks entries).
 */
async function tracedStep(page, step) {
  const cond = step.cond(await rowIds(page));
  const at = await page.evaluate((t) => window.__bench.point(t), step.target);
  if (at === null) throw new Error(`target not found: ${JSON.stringify(step.target)}`);
  return traceClick(page, at, () => page.evaluate((c) => window.__bench.holds(c), cond));
}

/**
 * Clicks the viewport point `at` with the mouse while Chrome traces, polls `done()` until it
 * is true, waits for the frame that shows the result, and returns `analyzeTrace`'s result.
 */
export async function traceClick(page, at, done) {
  const browser = page.context().browser();
  await browser.startTracing(page, { categories: TRACE_CATEGORIES });
  let events;
  try {
    await page.mouse.click(at.x, at.y);
    const deadline = Date.now() + 60000;
    while (!(await done())) {
      if (Date.now() > deadline) throw new Error('timed out waiting for the result');
      await sleep(10);
    }
    // The DOM is right; let the frame that shows it start, then wait (an evaluation queues
    // behind that frame's style, layout, paint and commit on the main thread).
    await sleep(50);
    await page.evaluate(() => 0);
    await sleep(50);
  } finally {
    events = JSON.parse((await browser.stopTracing()).toString()).traceEvents;
  }
  return analyzeTrace(events);
}

/** Opens the table app with the helpers installed and waits until it has rendered. */
export async function openTable(context, url) {
  const page = await context.newPage();
  await page.addInitScript(tableHelpers);
  await page.goto(url);
  await page.waitForFunction(() => window.__bench?.ready() === true);
  return page;
}

/** One sample: `{ total }` with frame timing, or the full trace breakdown. */
async function sample(context, url, op, cpu, timing) {
  const page = await openTable(context, url);
  const cdp = await context.newCDPSession(page);
  try {
    for (const step of op.prep) await runStep(page, step);
    await cdp.send('HeapProfiler.collectGarbage');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
    const result =
      timing === 'frame'
        ? { total: await runStep(page, op.step) }
        : await tracedStep(page, op.step);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    return result;
  } finally {
    await cdp.detach();
    await page.close();
  }
}

/** Fisher-Yates on a copy, with a seeded generator so a run's order is reproducible. */
export function shuffled(items, seed) {
  const out = [...items];
  let x = seed;
  for (let i = out.length - 1; i > 0; i--) {
    x = (x * 1103515245 + 12345) % 2147483648;
    const j = x % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Per-sample fields summarised separately (trace timing has a breakdown; frame only total). */
const FIELDS = ['total', 'script', 'styleLayout', 'paint', 'idle'];

function summarizeSamples(list) {
  const out = summarize(list.map((s) => s.total));
  if (list[0]?.script !== undefined) {
    out.breakdown = Object.fromEntries(
      FIELDS.slice(1).map((f) => [f, summarize(list.map((s) => s[f])).median]),
    );
    out.maxRafDelay = Math.max(...list.map((s) => s.rafDelay));
    out.commits = summarize(list.map((s) => s.commits)).median;
  }
  return out;
}

/**
 * `{ gyral: { create1k: {median, p90, ..., breakdown}, ... }, ... }`. Frameworks are
 * interleaved: each round times every framework once, in a shuffled order, so drift during
 * the run (thermal, background load) spreads over all of them instead of hitting whichever
 * runs last. `afterOperation(op)` runs between operations (machine-state probes).
 */
export async function runtime(browser, baseUrl, frameworks, options) {
  const { warmup, runs, cpu, log, timing = 'trace', afterOperation, operations } = options;
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const url = (fw) => `${baseUrl}/${fw}/table/`;
  const ops = operations ?? OPERATIONS;
  const samples = Object.fromEntries(frameworks.map((fw) => [fw, {}]));
  try {
    for (const op of ops) {
      for (const fw of frameworks) {
        for (let i = 0; i < warmup; i++) await sample(context, url(fw), op, cpu, timing);
        samples[fw][op.key] = [];
      }
      for (let round = 0; round < runs; round++) {
        for (const fw of shuffled(frameworks, round + 1)) {
          samples[fw][op.key].push(await sample(context, url(fw), op, cpu, timing));
        }
      }
      log(
        `  ${op.name}: ` +
          frameworks
            .map((fw) => `${fw} ${summarize(samples[fw][op.key].map((s) => s.total)).median}`)
            .join(', '),
      );
      await afterOperation?.(op);
    }
  } finally {
    await context.close();
  }
  return Object.fromEntries(
    frameworks.map((fw) => [
      fw,
      Object.fromEntries(ops.map((op) => [op.key, summarizeSamples(samples[fw][op.key])])),
    ]),
  );
}
