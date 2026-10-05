# gyral-benchmarks

A reproducible benchmark of [Gyral](https://gyral.dev) against React, Preact, Vue, Svelte,
Solid and Lit. The same six apps are written in every framework, each following that
framework's official documentation, and checked by one shared correctness spec. Then:

- **Bundle size** of every app: minified, gzip and brotli, plus the framework's floor (an app
  that renders one paragraph).
- **Runtime**: the nine js-framework-benchmark operations on a keyed table, with in-page
  warm-up, under 4x CPU throttling, 15 interleaved runs each, timed from Chrome performance
  traces with a script / style+layout / paint breakdown.
- **Memory**: JS heap of the table app after load, with 1,000 rows, and after clearing.
- **Startup**: a todo app on a cold cache with a throttled network and CPU, until the first
  todo can be added.

## Results, 2026-10-05

Full tables: [results/2026-10-05/results.md](results/2026-10-05/results.md). Every sample is in
`results.json`. Headline numbers, Gyral 0.1.0 (on Effect 3) against the current releases:

|                                                    | Solid | Preact |  Lit | Svelte |  Vue | **Gyral** | React |
| -------------------------------------------------- | ----: | -----: | ---: | -----: | ---: | --------: | ----: |
| JS, gzip KiB: floor (framework alone)              |   3.7 |    4.7 |  5.8 |    9.0 | 23.0 |  **49.3** |  66.1 |
| JS, gzip KiB: todo app                             |   6.6 |    6.1 |  7.3 |   14.2 | 25.0 |  **51.0** |  66.6 |
| Todo app interactive, cold, throttled (ms, median) |   450 |    445 |  438 |    475 |  533 |   **725** |   801 |
| Table runtime, geometric mean vs fastest           |  1.07 |   1.61 | 3.09 |   1.30 | 1.43 |  **3.03** |  1.90 |
| JS heap after load (MB)                            |  1.13 |   1.17 | 1.20 |   1.19 | 1.32 |  **1.71** |  1.55 |

What the numbers say:

- **Size is Gyral's weak point.** Its floor is 49.3 KiB gzip, second only to React and about
  43.5 KiB more than Lit, which it renders with. Gyral's runtime-size spike (ADR 0015 in the
  Gyral repo) attributes about 38 KiB of that to the Effect 3 runtime and measured, in its own
  setup, a counter at about 23 KiB with Effect 4, 15 KiB with Effect Micro and 10 KiB without
  Effect. Those are context from that spike, not results of this repository.
- **Startup follows size.** On a cold cache with a throttled network and CPU, the Gyral todo
  app becomes interactive 275–290 ms after Lit, Preact and Solid, and about 75 ms before
  React.
- **Runtime is Lit's.** Gyral tracks plain Lit: within 4% on create, replace, update, remove,
  create 10,000 and clear; 16% slower on swap and 17% faster on append (under one frame and
  about 90 ms respectively, in opposite directions). Intents, messages and the Effect-based
  interpreter add no consistent interaction cost here.
- **lit-html 3.3.3 has a leak that dominates two operations.** Every row `repeat` removes leaves
  an empty comment node behind ([lit/lit#5010](https://github.com/lit/lit/issues/5010)), so
  after the warm-up cycles "clear 1,000 rows" takes about 3.7 s for Lit and Gyral (others: 26–40
  ms) and "replace" about 2.2 s (others: 306–353 ms). With lit-html pinned to 3.3.0
  ([variant run](results/2026-10-05-lit-html-3.3.0/results.md)), Gyral's clear is 56 ms and
  replace 414 ms. Lit-based apps are still somewhat slower than the others at bulk creation
  and removal.
- **Memory:** Gyral starts with the largest JS heap (1.71 MB, the Effect runtime) but holds
  1,000 rows in less heap than React, Preact, Vue or Solid.

These runtime numbers use the older in-page "next frame" end point, which often missed the
repaint for operations shorter than a frame (so "select row" is not meaningful there). Runtime
timing is now **trace-based**, like js-framework-benchmark's
([methodology](docs/methodology.md#trace-based-timing-default-since-2026-10-05)). A trace-based
run on Gyral's experiment builds (Effect 4, lit-html 3.3.0; not the published 0.1.0) gives a
geometric mean of Svelte 1.05, Solid 1.07, Vue 1.19, Lit 1.31, Gyral 1.33, Preact 1.40, React
1.54: [results and notes](results/2026-10-05-lit-html-3.3.0-effect4-trace/NOTES.md).
How each number is measured, and the limits of the method:
[docs/methodology.md](docs/methodology.md). The apps and per-framework choices:
[docs/apps.md](docs/apps.md).

## Run it

```sh
pnpm install
pnpm exec playwright install chromium
pnpm check           # typecheck, lint, format, build, correctness tests
pnpm bench --quick   # a few samples, to try the harness (results/quick/)
pnpm bench           # the full run, about an hour (results/<date>/)
```

`--only=gyral,react` limits any of `build` and `bench` to some frameworks.

## Ground rules

- Every framework's current npm release, pinned exactly; Vite 8 production builds with each
  framework's official plugin and otherwise identical settings.
- No UI, state or form libraries. Shared code (row data, a fake search API, validation rules)
  is the same for everyone, so the comparison is about the frameworks.
- Results are reported as measured, including where Gyral loses.

Gyral is MIT-licensed; this repository is MIT as well. © 2026 Mike Zupper.
