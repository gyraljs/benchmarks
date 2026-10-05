// Runtime of the keyed table app (js-framework-benchmark operations). Every sample uses a fresh
// page: prepare unthrottled, collect garbage, then throttle the CPU and time one operation.
import { summarize } from './stats.mjs';
import { tableHelpers } from './page.mjs';

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

/** Runs one step in the page and returns its duration in ms. */
async function runStep(page, step) {
  const ctx = await page.evaluate(() => ({
    first: window.__bench.rowId(0),
    id998: window.__bench.rowId(998),
  }));
  return page.evaluate(([t, c]) => window.__bench.measure(t, c), [step.target, step.cond(ctx)]);
}

/** Opens the table app with the helpers installed and waits until it has rendered. */
export async function openTable(context, url) {
  const page = await context.newPage();
  await page.addInitScript(tableHelpers);
  await page.goto(url);
  await page.waitForFunction(() => window.__bench?.ready() === true);
  return page;
}

async function sample(context, url, op, cpu) {
  const page = await openTable(context, url);
  const cdp = await context.newCDPSession(page);
  try {
    for (const step of op.prep) await runStep(page, step);
    await cdp.send('HeapProfiler.collectGarbage');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
    const ms = await runStep(page, op.step);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    return ms;
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

/**
 * `{ gyral: { create1k: {median, p90, ...}, ... }, ... }`. Frameworks are interleaved: each
 * round times every framework once, in a shuffled order, so drift during the run (thermal,
 * background load) spreads over all of them instead of hitting whichever runs last.
 */
export async function runtime(browser, baseUrl, frameworks, { warmup, runs, cpu, log }) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const url = (fw) => `${baseUrl}/${fw}/table/`;
  const samples = Object.fromEntries(frameworks.map((fw) => [fw, {}]));
  try {
    for (const op of OPERATIONS) {
      for (const fw of frameworks) {
        for (let i = 0; i < warmup; i++) await sample(context, url(fw), op, cpu);
        samples[fw][op.key] = [];
      }
      for (let round = 0; round < runs; round++) {
        for (const fw of shuffled(frameworks, round + 1)) {
          samples[fw][op.key].push(await sample(context, url(fw), op, cpu));
        }
      }
      log(
        `  ${op.name}: ` +
          frameworks.map((fw) => `${fw} ${summarize(samples[fw][op.key]).median}`).join(', '),
      );
    }
  } finally {
    await context.close();
  }
  return Object.fromEntries(
    frameworks.map((fw) => [
      fw,
      Object.fromEntries(OPERATIONS.map((op) => [op.key, summarize(samples[fw][op.key])])),
    ]),
  );
}
