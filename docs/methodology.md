# Methodology

`pnpm bench` builds every app, measures bundle sizes, then drives Chromium with Playwright.
Results go to `results/<date>/results.json` (all samples) and `results.md` (tables);
`--label=<name>` writes `results/<date>-<name>/` instead.

## Builds

- Vite 8 production build (`vite build`, Vite's default target and minifier) for every app,
  with each framework's official Vite plugin and otherwise identical settings
  (`scripts/build.mjs`). Gyral uses `gyralVitePreset()`, as `npm create gyral` sets up.
- All packages are the current npm releases on the run date, pinned exactly in each
  `frameworks/<name>/package.json`, with two exceptions: lit-html is pinned to 3.3.0 for Lit
  and Gyral 0.2.0 (root `pnpm.overrides`; see the last section), and the `gyral-next` variant
  installs Gyral 0.3.0 from its release tarballs (`vendor-next/`) until 0.3.0 is on npm.
  `frameworks/gyral` is `@gyral/core` 0.2.0 from npm.

## Bundle size

- Every `.js` (and for "total", `.html` and `.css`) file in the build output, each compressed
  on its own as a server would send it: gzip level 9 and brotli quality 11, plus the raw
  minified size (`scripts/sizes.mjs`).
- `floor` is the cost of the framework itself: an app that renders one paragraph.
- Lazily imported chunks count too. Gyral 0.3.0's builds emit two (server-render hydration and
  an invoker-commands shim) that a client-only page in current Chromium doesn't fetch; the
  run notes give its entry-chunk-only size separately. Every other build emits one chunk.

## Runtime (keyed table app)

The nine js-framework-benchmark operations: create 1,000 rows, replace 1,000, update every 10th,
select, swap, remove, create 10,000, append 1,000, clear 1,000 (`scripts/lib/runtime.mjs`).

- **Every sample uses a fresh page.** It first runs js-framework-benchmark's in-page warm-up
  without throttling (for example five create+clear cycles before timing create), forces a
  garbage collection, then throttles the CPU 4x (CDP `Emulation.setCPUThrottlingRate`) and
  times one operation.
- **Runs:** 5 warm-up samples, then 15 measured samples per operation and framework. The
  frameworks are interleaved: each round times every framework once, in a shuffled order, so
  drift during the run spreads over all of them. Reported: median and p90 (nearest rank), with
  min, max, mean and standard deviation in the JSON. The summary row is the geometric mean of
  each framework's median divided by the fastest median, per operation (1.00 = fastest at
  everything).

### Trace-based timing (default since 2026-10-05)

`scripts/lib/trace.mjs` follows js-framework-benchmark's `webdriver-ts`
(`src/timeline.ts`, `computeResultsCPU`):

- The timed click is a **real mouse click** (CDP input via `page.mouse.click` at the target's
  centre, found and scrolled into view before tracing starts), recorded in a **Chrome
  performance trace** (`devtools.timeline`, `disabled-by-default-devtools.timeline`,
  `v8.execute`).
- **Start:** the start of the click's `EventDispatch` on the renderer main thread. Pointer,
  mouse-down and focus events before it are excluded, as in js-framework-benchmark.
- **End:** the end of the first `Commit` after the last `FireAnimationFrame`, `TimerFire`,
  `Layout` or `FunctionCall` that follows the click (falling back to the last `Commit`), the
  same rule as js-framework-benchmark. Work the framework defers to a timer or animation frame
  is therefore included.
- **Breakdown** per sample, stored in `results.json` (`breakdown`: medians per operation):
  **script** (`EventDispatch`, `FunctionCall`, `TimerFire`, `FireAnimationFrame`,
  `RunMicrotasks`, `V8.Execute`, `EvaluateScript`, …), **style+layout**
  (`UpdateLayoutTree`, `Layout`), **paint** (`PrePaint`, `Paint`, `Layerize`, `Commit`), each
  the union of its intervals, and **idle**: the part of the total covered by none of them
  (mostly waiting for the next frame to begin). Script and style+layout can overlap where
  script forces a layout.
- The harness waits for the result by polling the DOM through CDP evaluations every 10 ms;
  these show up in the trace only as `RunMicrotasks` entries of a few microseconds.
- `--timing=frame` keeps the older end point (below) for comparison runs.

Where we differ from js-framework-benchmark:

- We keep events of the renderer **main thread** (the click's process and thread);
  js-framework-benchmark keeps the whole renderer process. Chrome reports `Commit` on the main
  thread, so the end point is the same.
- js-framework-benchmark subtracts `requestAnimationFrame` → `FireAnimationFrame` delays over
  16 ms (a headless-Chrome artefact). We record the largest such delay per operation
  (`maxRafDelay`) but subtract nothing; none of the apps here schedules work with
  `requestAnimationFrame`.
- Playwright and headless Chromium instead of Puppeteer/WebDriver and headful Chrome; our own
  apps, warm-ups and 15 samples instead of its configuration.

**Validation** (`pnpm validate:timing`, results in `results/<date>-timing-validation/`): a
synthetic page whose click handler busy-waits a known time measures within ±2 ms of it at
CPU 1x and 4x (median error under 0.7 ms on 2026-10-05), and `tests/trace.spec.ts` checks a
20 ms handler on every `pnpm check`.

### The older end point (`--timing=frame`, runs before 2026-10-05 trace runs)

From just before the button's `click()` (a synthetic click) until the DOM shows the expected
result (checked by a MutationObserver) and a `requestAnimationFrame` callback plus a
`MessageChannel` task have run. The validation run showed what was wrong with it:

- It did **not** move in ~16.7 ms frame steps on this machine, as this document used to say:
  for long operations it agrees with trace timing within a few milliseconds.
- For operations shorter than a frame it was **bimodal and often missed the paint**: "select
  row" for Solid measured 1.0–2.4 ms in most samples and 13.6–18.5 ms in a few, where the
  trace shows 7–21 ms because repainting the selected row (about 7 ms at 4x) is part of the
  work. That under-counting reversed at least one ranking (see the trace run's notes).

### Machine state

`scripts/lib/drift.mjs` times a fixed CPU workload (median of 5, after warm-up) and records the
1-minute load average and mean CPU frequency at the start, after each runtime operation and at
the end. A run is **flagged** in `results.md` when the workload's time spreads by more than 5%
or the load average exceeds half the cores; `--strict-drift` makes `pnpm bench` exit 1 then.
Flagged runs are still comparable within the run (frameworks are interleaved) but not across
runs.

### Limits

- Headless Chromium on one Linux desktop. Absolute numbers depend on the machine; compare
  frameworks within one run, not across runs.
- Operations that take less than a frame include waiting for the frame that paints them
  (the **idle** column), as in js-framework-benchmark; read small differences there from the
  breakdown, not the total.
- **Select row is frame-quantized and paints nothing of its own.** The table apps have no CSS,
  so `class="danger"` changes nothing visible: the measured frame paints the clicked button's
  `:active`/`:focus` change (about 6 ms at 4x, the same for every framework), and the idle is
  the wait for Chrome's next BeginFrame, which restarts about one frame after the input when
  the page was quiet, unless a frame was already due. Samples are bimodal (about 7–10 ms or
  16–20 ms) for every framework, and which mode dominates varies between runs. An
  implementation that renders after that frame would look faster here, not slower. Details:
  [results/2026-10-06-gyral-next-spike/NOTES.md](../results/2026-10-06-gyral-next-spike/NOTES.md).

## Memory (keyed table app)

JS heap (`Performance.getMetrics` → `JSHeapUsedSize`, after a forced GC) after load, after
creating 1,000 rows, and after clearing them; 5 runs, median reported. This is the JavaScript
heap only: DOM nodes are not included.

## Startup (todo app)

- A new browser context per sample (cold cache), 4x CPU throttling and a throttled network:
  150 ms round trip, 1.6 Mbit/s down, 750 kbit/s up. The server sends brotli-compressed files.
- A probe installed before the page loads checks once per animation frame. When the todo input
  first exists it records **input rendered**, types a todo and submits the form; when the todo
  appears it records **first todo added (interactive)**. Both are milliseconds since navigation
  start.
- 1 warm-up and 15 measured runs per framework, interleaved. The once-per-frame polling makes
  the result up to one frame late, the same for every framework.

## Correctness

`pnpm test` runs the same behavioural spec against every production build (`tests/`), and
`pnpm check` runs it in the gate. A broken implementation fails the gate before it can be
benchmarked.

## Known upstream issue affecting Lit and Gyral 0.2.0

lit-html 3.3.1 to 3.3.3 (the current release) leaves one empty comment node in the DOM for every
item `repeat` removes ([lit/lit#5010](https://github.com/lit/lit/issues/5010),
[lit/lit#5298](https://github.com/lit/lit/issues/5298)): `removePart()` removes an item's start
marker and content but not its end marker. Lists with churn therefore accumulate nodes, and
clearing or replacing rows gets slower each cycle. The in-page warm-up (five create+clear
cycles) makes this visible in "clear" and "replace" for Lit and Gyral 0.2.0 (and the 0.1.0
experiments), which render with lit-html. Gyral 0.3.0 has its own view layer and does not use
lit-html. Results up to 2026-10-05 used lit-html 3.3.3, the version users install today, with a
supplementary run on 3.3.0 (`results/2026-10-05-lit-html-3.3.0/`); later runs pin lit-html to
3.3.0 for Lit and Gyral 0.2.0, as each run's "Framework versions" records.
