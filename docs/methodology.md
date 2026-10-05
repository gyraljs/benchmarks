# Methodology

`pnpm bench` builds every app, measures bundle sizes, then drives Chromium with Playwright.
Results go to `results/<date>/results.json` (all samples) and `results.md` (tables).

## Builds

- Vite 8 production build (`vite build`, Vite's default target and minifier) for every app,
  with each framework's official Vite plugin and otherwise identical settings
  (`scripts/build.mjs`). Gyral uses `gyralVitePreset()`, as `npm create gyral` sets up.
- All packages are the current npm releases on the run date, pinned exactly in each
  `frameworks/<name>/package.json`. Gyral is `@gyral/core` 0.1.0 from npm.

## Bundle size

- Every `.js` (and for "total", `.html` and `.css`) file in the build output, each compressed
  on its own as a server would send it: gzip level 9 and brotli quality 11, plus the raw
  minified size (`scripts/sizes.mjs`).
- `floor` is the cost of the framework itself: an app that renders one paragraph.

## Runtime (keyed table app)

The nine js-framework-benchmark operations: create 1,000 rows, replace 1,000, update every 10th,
select, swap, remove, create 10,000, append 1,000, clear 1,000 (`scripts/lib/runtime.mjs`).

- **Every sample uses a fresh page.** It first runs js-framework-benchmark's in-page warm-up
  without throttling (for example five create+clear cycles before timing create), forces a
  garbage collection, then throttles the CPU 4x (CDP `Emulation.setCPUThrottlingRate`) and
  times one operation.
- **What is timed:** from just before the button's `click()` until the DOM shows the expected
  result (checked by a MutationObserver) and the following frame has rendered
  (`requestAnimationFrame`, then a `MessageChannel` task, which runs after that frame's
  style, layout and paint). This includes the framework's event handling, its rendering
  (synchronous or scheduled), and the browser's layout and paint.
- **Runs:** 5 warm-up samples, then 15 measured samples per operation and framework. The
  frameworks are interleaved: each round times every framework once, in a shuffled order, so
  drift during the run spreads over all of them. Reported: median and p90 (nearest rank), with
  min, max, mean and standard deviation in the JSON. The summary row is the geometric mean of
  each framework's median divided by the fastest median, per operation (1.00 = fastest at
  everything).

### Limits

- This is not js-framework-benchmark's trace-based measurement (it reads paint events from a
  Chrome performance trace). The `requestAnimationFrame` + `MessageChannel` end point
  approximates "next frame painted"; it can be up to one frame late, the same for everyone.
- The MutationObserver check runs as a microtask after DOM changes and costs a little time,
  again the same for every framework.
- Headless Chromium on one Linux desktop. Absolute numbers depend on the machine; compare
  frameworks within one run, not across runs.

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

## Known upstream issue affecting Lit and Gyral

lit-html 3.3.1 to 3.3.3 (the current release) leaves one empty comment node in the DOM for every
item `repeat` removes ([lit/lit#5010](https://github.com/lit/lit/issues/5010),
[lit/lit#5298](https://github.com/lit/lit/issues/5298)): `removePart()` removes an item's start
marker and content but not its end marker. Lists with churn therefore accumulate nodes, and
clearing or replacing rows gets slower each cycle. The in-page warm-up (five create+clear
cycles) makes this visible in "clear" and "replace" for Lit and Gyral. The primary results use
the versions users install today; a supplementary run with lit-html pinned to 3.3.0 shows the
effect, when present in the results folder.
