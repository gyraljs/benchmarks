# Full run, 2026-10-12: Gyral 0.3.1 from npm

The first full run with every Gyral package installed from npm, and with the other frameworks
on their current releases.

- **gyral = Gyral 0.3.1**: `@gyral/core` and `@gyral/time` 0.3.1 from npm, apps written to the
  0.3.1 documentation (`define<State, Msg>()(tag, spec)`, `intentsOf` for pure list rows,
  `gyralVitePreset({ clientOnly: true })` as create-gyral 0.3.1's client-rendered template sets
  up).
- **gyral-0.3.0 = Gyral 0.3.0** from npm, with the app sources measured on 2026-10-07 (then the
  `gyral-next` slot). npm's 0.3.0 has the same files as the release packs measured then.
- Also measured: Lit 3.3.3 (lit-html pinned to 3.3.0, lit/lit#5010), React 19.3.0,
  Preact 11.0.1, Vue 3.5.43, Svelte 5.57.2, Solid 1.9.17. Chromium 156 (Playwright 1.64.0),
  Vite 8.3.4, Node 24.15.0.
- Command: `flock /tmp/gyral-bench.lock pnpm bench --label=full`, the full run (5 warm-up + 15
  measured samples per operation, interleaved, CPU 4x, trace timing; memory 5 runs; startup 15
  runs). Bench commit 09296f2, clean tree. Measurement 08:12–08:36 local time.
- The apps passed `tests/apps.spec.ts` against the production builds (`pnpm check` before the
  run, same sources).

## Machine state: flagged

- **Drift flagged:** calibration spread 5.6% (limit 5%), maximum 1-minute load 6.21 on 12
  cores. Two self-hosted CI runners of other repositories run on this machine and the desktop
  carried a background load of 5–7 even with no tests running; the run was started on purpose
  as soon as no other headless Chromium, vitest or Playwright process was running, without
  waiting for the load to fall. Interleaving spreads the noise over every framework, so the
  comparison within this run holds; absolute numbers are noisier than on 2026-10-07 (spread
  4.1%, load 1.3–2.1) and shouldn't be compared across runs.

## Runtime (medians, ms)

| Operation               | **Gyral 0.3.1** | Gyral 0.3.0 |    Lit |  React | Preact |    Vue |     Svelte |    Solid |
| ----------------------- | --------------: | ----------: | -----: | -----: | -----: | -----: | ---------: | -------: |
| create 1,000 rows       |           233.5 |       233.4 |  269.5 |  252.4 |  254.6 |  245.4 |  **230.0** |    247.9 |
| replace 1,000 rows      |           249.6 |       252.5 |  296.7 |  289.8 |  282.7 |  263.9 |  **246.9** |    266.3 |
| update every 10th row   |            75.3 |    **75.1** |   81.3 |   78.5 |   90.2 |   85.1 |       78.5 |     78.0 |
| select row              |            13.7 |        11.4 |   13.7 |   12.7 |   26.1 |   15.5 |       15.4 |  **8.7** |
| swap rows               |            30.4 |        30.0 |   47.1 |  234.6 |   48.7 |   29.4 |   **28.7** |     35.2 |
| remove row              |        **45.6** |    **45.6** |   53.6 |   51.9 |   66.8 |   54.6 |       46.4 |     49.5 |
| create 10,000 rows      |          2274.4 |      2345.9 | 2715.3 | 3122.5 | 2550.9 | 2423.2 | **2234.5** |   2426.3 |
| append 1,000 rows       |           296.5 |   **293.8** |  349.0 |  324.9 |  345.9 |  304.0 |      297.3 |    310.6 |
| clear 1,000 rows        |        **21.2** |        21.5 |   32.8 |   31.2 |   24.3 |   28.1 |       22.3 |     23.6 |
| geomean vs fastest      |            1.07 |    **1.05** |   1.30 |   1.51 |   1.37 |   1.17 |       1.08 |     1.08 |
| geomean, without select |        **1.01** |        1.02 |   1.27 |   1.52 |   1.25 |   1.11 |       1.02 |     1.09 |

Ranking by geomean: Gyral 0.3.0 1.05, Gyral 0.3.1 1.07, Svelte 1.08, Solid 1.08, Vue 1.17,
Lit 1.30, Preact 1.37, React 1.51. Without select row: Gyral 0.3.1 1.01, Svelte 1.02,
Gyral 0.3.0 1.02, Solid 1.09, Vue 1.11, Preact 1.25, Lit 1.27, React 1.52. The geomeans
without select row are computed from the medians above, not by the harness.

- **0.3.1 against 0.3.0: the same speed.** Every operation except select row is within 3%
  (create 10,000 rows −3.0%, all others within ±1.4%), script time is within 0.7 ms on every
  operation below 10,000 rows, and the geomeans without select row differ by 0.01. The only
  difference that moves the with-select geomean is select row (13.7 vs 11.4 ms), which is
  frame-aligned and bimodal (see [the methodology's limits](../../docs/methodology.md#limits)):
  don't read it as a regression.
- **Against the others,** the ranking matches 2026-10-07: Gyral, Svelte and Solid lead, Svelte
  is fastest at create, replace, swap and create 10,000, Gyral at remove and clear.

## Size

| JS gzip KiB | Gyral 0.3.1 | Gyral 0.3.0 | Lit | React | Preact |  Vue | Svelte | Solid |
| ----------- | ----------: | ----------: | --: | ----: | -----: | ---: | -----: | ----: |
| floor       |         7.9 |        11.7 | 5.8 |  66.1 |    4.8 | 23.0 |    9.0 |   3.7 |
| todo        |         9.9 |        13.6 | 7.3 |  66.6 |    6.1 | 25.0 |   14.2 |   6.6 |
| table       |        10.2 |        14.0 | 7.5 |  67.1 |    6.5 | 24.4 |   13.6 |   7.1 |

- **The drop from 11.7 to 7.9 KiB comes almost entirely from `clientOnly`,** which 0.3.0 doesn't
  have: a client-only build no longer emits the hydration and fallback chunks. Built once with
  the default preset (not by the harness), 0.3.1's floor is 12.1 KiB counting every chunk
  (8.9 KiB for the entry chunk alone) against 0.3.0's 11.7 (8.6): without the option, 0.3.1 is
  about 0.3 KiB larger, mostly the error channel.
- Gyral 0.3.1 is now smaller than Svelte for every app and smaller than Vue and React by a
  wide margin; Lit, Preact and Solid still ship less.
- 0.3.0 measures 11.7 KiB here against 11.6 on 2026-10-07 with the same sources, probably the
  Vite update.

## Memory and startup

- **Memory:** both Gyral releases hold the same heap (1.22 MB after load, 2.17 MB with 1,000
  rows, 1.44 MB after clearing). Only Lit holds 1,000 rows in less (2.02 MB).
- **Startup:** the todo app is interactive at 438 ms (0.3.0: 436), behind Preact (406),
  Lit (419) and Solid (421), ahead of Svelte (463), Vue (516) and React (752). The smaller
  bundle didn't show up in startup at this noise level.
