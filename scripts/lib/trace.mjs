// Trace-based timing, following js-framework-benchmark's webdriver-ts (src/timeline.ts,
// computeResultsCPU): a Chrome performance trace is recorded around one click, and the
// duration runs from the start of the click's EventDispatch to the end of the first Commit
// after the last piece of work the click caused. docs/methodology.md lists where we differ.

/** Categories passed to Chrome's tracing (Playwright `browser.startTracing`). */
export const TRACE_CATEGORIES = [
  'devtools.timeline',
  'disabled-by-default-devtools.timeline',
  'v8.execute',
];

// Work that can follow the click (rAF callbacks, timers, layout, other callbacks): the end is
// the first Commit after the last of these. Same list as js-framework-benchmark.
const WORK = new Set(['FireAnimationFrame', 'TimerFire', 'Layout', 'FunctionCall']);

/** Breakdown categories (js-framework-benchmark's JS and paint lists; style split out). */
export const CATEGORIES = {
  script: [
    'EventDispatch',
    'EvaluateScript',
    'v8.evaluateModule',
    'FunctionCall',
    'TimerFire',
    'FireIdleCallback',
    'FireAnimationFrame',
    'RunMicrotasks',
    'V8.Execute',
  ],
  styleLayout: ['UpdateLayoutTree', 'Layout'],
  paint: ['PrePaint', 'Paint', 'Layerize', 'Commit'],
};

const end = (e) => e.ts + e.dur;

/** Total length of the union of `[ts, ts + dur)` intervals, clipped to `[from, to]`, in µs. */
export function unionLength(events, from, to) {
  const spans = events
    .map((e) => [Math.max(e.ts, from), Math.min(end(e), to)])
    .filter(([a, b]) => b > a)
    .sort((x, y) => x[0] - y[0]);
  let total = 0;
  let cur = null;
  for (const [a, b] of spans) {
    if (cur === null || a > cur[1]) {
      if (cur !== null) total += cur[1] - cur[0];
      cur = [a, b];
    } else if (b > cur[1]) {
      cur[1] = b;
    }
  }
  if (cur !== null) total += cur[1] - cur[0];
  return total;
}

/**
 * Analyses the trace events of one sample. Returns milliseconds:
 * `{ total, script, styleLayout, paint, idle, commits, rafDelay }`. `total` runs from the
 * click's dispatch to the end of the frame's Commit; the categories overlap where script
 * forces a layout, and `idle` is the part of `total` covered by none of them (mostly waiting
 * for the next frame to begin).
 */
export function analyzeTrace(traceEvents) {
  const complete = traceEvents.filter((e) => e.ph === 'X' && typeof e.dur === 'number');
  const clicks = complete.filter(
    (e) => e.name === 'EventDispatch' && e.args?.data?.type === 'click',
  );
  if (clicks.length !== 1) {
    throw new Error(`expected exactly one click in the trace, found ${clicks.length}`);
  }
  const [click] = clicks;
  // The renderer's main thread: where the click ran, and where Chrome reports Commit.
  const main = complete.filter((e) => e.pid === click.pid && e.tid === click.tid);
  const after = main.filter((e) => e.ts > end(click));
  const last = [click, ...after.filter((e) => WORK.has(e.name))].sort((a, b) => end(a) - end(b));
  const startFrom = last.at(-1);
  const commits = main.filter((e) => e.name === 'Commit' && e.ts >= click.ts);
  commits.sort((a, b) => a.ts - b.ts);
  const commit = commits.find((e) => e.ts > end(startFrom)) ?? commits.at(-1);
  if (commit === undefined) throw new Error('no Commit after the click');
  const from = click.ts;
  const to = end(commit);
  const ms = (us) => Math.round(us) / 1000;
  const of = (names) => main.filter((e) => names.includes(e.name));
  const busy = unionLength(of(Object.values(CATEGORIES).flat()), from, to);
  // requestAnimationFrame → FireAnimationFrame delays: js-framework-benchmark flags (and
  // subtracts) delays over 16 ms as a headless-Chrome artefact; we only record them.
  const rafDelay = main
    .filter((e) => e.name === 'RequestAnimationFrame' && e.ts >= from && e.ts <= to)
    .map((req) => {
      const id = req.args?.data?.id;
      const fire = main.find(
        (e) => e.name === 'FireAnimationFrame' && e.args?.data?.id === id && e.ts >= req.ts,
      );
      return fire === undefined ? 0 : fire.ts - end(req);
    })
    .reduce((m, d) => Math.max(m, d), 0);
  return {
    total: ms(to - from),
    script: ms(unionLength(of(CATEGORIES.script), from, to)),
    styleLayout: ms(unionLength(of(CATEGORIES.styleLayout), from, to)),
    paint: ms(unionLength(of(CATEGORIES.paint), from, to)),
    idle: ms(to - from - busy),
    commits: commits.filter((e) => e.ts <= to).length,
    rafDelay: ms(rafDelay),
  };
}
