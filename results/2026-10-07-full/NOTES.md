# Full run, 2026-10-07: Gyral 0.3.0 release packs

A fresh full run of every framework the README compares, the first with Gyral's **0.3.0
release** packs in the `gyral-next` slot (the 2026-10-06 final run measured 0.3.0-next.6).

- **gyral-next = Gyral 0.3.0**: `@gyral/core` and `@gyral/time` 0.3.0, Gyral's release
  tarballs (tag `v0.3.0`, commit e79abd6), copied unchanged into `vendor-next/`
  (`vendor-next/SOURCE.json`). Not on npm yet. No Lit in its tree.
- **gyral = Gyral 0.2.0** from npm (Lit 3.3.3, lit-html pinned to 3.3.0 as in every run since
  2026-10-05).
- Also measured, unchanged: Lit 3.3.3, Solid 1.9.15, Svelte 5.57.1, Vue 3.5.43, Preact 11.0.0,
  React 19.3.0.
- Command: `flock /tmp/gyral-bench.lock … timeout 7200 pnpm bench --label=full
  --only=gyral,gyral-next,lit,solid,svelte,vue,preact,react`: the full run (5 warm-up + 15
  measured samples per operation, interleaved, CPU 4x, trace timing; memory 5 runs; startup 15
  runs). Bench commit 557eddb, clean tree (`results.md` would say `-dirty` otherwise).
  Measurement 07:57–08:20 local time (23 minutes).
- Every bundle has the same gzip byte count as in the 2026-10-06 run, and gyral-next's chunk
  file names (content hashes) are unchanged: the 0.3.0 packs build to the same apps as
  0.3.0-next.6, as `vendor-next/SOURCE.json` says.
- The apps passed `tests/apps.spec.ts` against the production builds (`pnpm check` after the
  run, same sources).

## Machine state

- **Drift not flagged:** calibration spread 4.1% (limit 5%; 29.45–30.65 ms), 1-minute load
  1.30–2.14 at the probes on 12 cores (flag threshold 6). The 2026-10-06 final run: spread 3.3%,
  load 2.2–3.3. So this run had less load but a slightly wider calibration spread; both are
  within the limits.
- CPU governor `powersave`; the probes saw 2.4–4.0 GHz between operations (final run: 1.6–4.0).
- **Two earlier attempts were stopped and thrown away.** Before the run, the machine was quiet
  (load 0.43). Then a Playwright smoke test of another repository
  (`starwars.run-site-v2`, `scripts/smoke.mjs`, several headless Chromium renderers) ran outside
  the shared lock, twice: load reached 8.9 in the first attempt (swap rows +50% for every
  framework) and the second attempt's create 1,000 rows was 37% slower for 0.2.0 than in this
  run. Both would have been flagged (load above 6), so they were stopped after a few operations
  and their output was not kept. The third attempt held the lock and waited until the machine
  had been quiet for two minutes (load below 2.5, no headless Chromium from other repositories)
  before starting. A per-minute log during it showed load 1.3–2.2, no other Chromium, and only
  the usual desktop work (a browser, Discord, other agents' idle sessions).

## Every framework (medians, ms)

| Operation               | **Gyral 0.3.0** | Gyral 0.2.0 |    Lit |  Solid |     Svelte |      Vue | Preact |  React |
| ----------------------- | --------------: | ----------: | -----: | -----: | ---------: | -------: | -----: | -----: |
| create 1,000 rows       |           222.0 |       229.6 |  264.0 |  232.6 |  **218.1** |    231.8 |  243.8 |  242.0 |
| replace 1,000 rows      |           254.9 |       268.2 |  302.7 |  266.1 |  **242.5** |    272.3 |  285.5 |  291.7 |
| update every 10th row   |        **71.4** |        74.2 |   76.4 |   72.5 |       76.9 |     76.2 |   87.3 |   77.5 |
| select row              |             8.8 |        17.3 |   14.3 |  **8.4** |     13.2 |     17.8 |   24.9 |   13.8 |
| swap rows               |            30.3 |        35.3 |   40.0 |   33.2 |       28.7 | **27.5** |   43.4 |  222.1 |
| remove row              |        **45.7** |        48.5 |   53.0 |   50.2 |       46.5 |     55.4 |   64.2 |   51.0 |
| create 10,000 rows      |          2311.8 |      2427.2 | 2834.9 | 2347.4 | **2188.6** |   2402.7 | 2576.1 | 3107.7 |
| append 1,000 rows       |           285.0 |       305.7 |  336.4 |  306.3 |  **278.5** |    292.7 |  336.1 |  311.4 |
| clear 1,000 rows        |        **21.7** |        28.9 |   34.8 |   24.2 |       22.2 |     28.9 |   25.6 |   31.9 |
| **geomean vs fastest**  |        **1.03** |        1.21 |   1.31 |   1.08 |       1.07 |     1.20 |   1.38 |   1.55 |
| geomean, without select |            1.03 |        1.13 |   1.27 |   1.10 |   **1.02** |     1.11 |   1.25 |   1.53 |

Ranking by geomean: Gyral 0.3.0 1.03, Svelte 1.07, Solid 1.08, Vue 1.20, Gyral 0.2.0 1.21, Lit
1.31, Preact 1.38, React 1.55. Without select row (frame-aligned, below), Svelte 1.02 and Gyral
0.3.0 1.03 change places, then Solid 1.10, Vue 1.11, Gyral 0.2.0 1.13, Preact 1.25, Lit 1.27,
React 1.53. Gyral 0.3.0 is fastest at update every 10th row, remove and clear; Svelte at create,
replace, create 10,000 and append; Solid at select; Vue at swap. Every p90 is in `results.md`.

## Gyral 0.3.0 vs 0.2.0, this run

The same noise test as the 2026-10-06 final run: a 95% bootstrap interval for the ratio of
medians (0.3.0 / 0.2.0; 20,000 resamples of the 15 samples on each side) and a two-sided
Mann–Whitney U test (normal approximation, tie-corrected). A difference is **beyond noise**
when p < 0.05 or the interval excludes 1.00. (The same script reproduces the final run's table
from its `results.json`.)

| Operation             | 0.2.0 median (p90) | 0.3.0 median (p90) | Δ median | 95% CI of ratio | MW p  | script 0.2.0 → 0.3.0 | verdict                       |
| --------------------- | -----------------: | -----------------: | -------: | :-------------: | ----: | -------------------: | ----------------------------- |
| create 1,000 rows     |      229.6 (236.7) |      222.0 (229.6) |    −3.3% |   0.947–0.984   | 0.002 |          39.2 → 33.5 | faster beyond noise           |
| replace 1,000 rows    |      268.2 (292.3) |      254.9 (277.1) |    −5.0% |   0.930–1.009   | 0.085 |          63.1 → 54.5 | within noise, lower median    |
| update every 10th row |        74.2 (78.3) |        71.4 (74.9) |    −3.8% |   0.943–0.992   | 0.023 |            4.3 → 3.4 | faster beyond noise           |
| select row            |        17.3 (19.3) |         8.8 (15.9) |   −49.0% |   0.474–0.599   | 0.000 |            2.8 → 1.8 | faster beyond noise; frame mode, below |
| swap rows             |        35.3 (38.5) |        30.3 (33.1) |   −14.2% |   0.794–0.888   | 0.000 |            2.8 → 2.2 | faster beyond noise           |
| remove row            |        48.5 (52.0) |        45.7 (50.2) |    −5.9% |   0.897–1.026   | 0.115 |            4.3 → 2.5 | within noise, lower median    |
| create 10,000 rows    |    2427.2 (2461.1) |    2311.8 (2340.9) |    −4.8% |   0.937–0.966   | 0.000 |        427.9 → 342.5 | faster beyond noise           |
| append 1,000 rows     |      305.7 (332.5) |      285.0 (299.8) |    −6.8% |   0.908–0.954   | 0.000 |          45.2 → 35.9 | faster beyond noise           |
| clear 1,000 rows      |        28.9 (29.9) |        21.7 (22.5) |   −24.9% |   0.737–0.802   | 0.000 |          24.1 → 18.5 | faster beyond noise           |

- **No operation is slower with 0.3.0.** Seven are faster beyond noise; replace and remove
  have lower medians but are within noise this time (replace was beyond noise in the final
  run, select was not). Leaving select out, six of eight are faster beyond noise.
- Geometric mean of the nine 0.3.0/0.2.0 ratios: 0.855 (−14.5%); without select 0.911
  (−8.9%). The final run: 0.860 and 0.907.
- **Script time is lower on every operation** (create 10,000: 343 vs 428 ms; replace 54.5 vs
  63.1; clear 18.5 vs 24.1). Style/layout and paint are the same for both (the same DOM),
  except swap's paint again (12.4 vs 18.0 ms).
- **Select row: don't read −49% as a speedup.** It is frame-quantized
  ([methodology](../../docs/methodology.md#limits)): samples fall at about 7–10 ms or 15–20 ms
  depending on whether a frame was already due. Samples under 12.5 ms in this run: Gyral 0.3.0
  12 of 15, Solid 11, Svelte 7, Gyral 0.2.0 3, Vue 3, React 1, Lit 0, Preact 0 (Preact's whole
  distribution sits at 24–29 ms). In the final run: 9, 9, 4, 1, 2, 6, 3, 0. The modes move
  between runs for every framework; script time (1.8 vs 2.8 ms) is the comparable part.

## Bundle sizes (KiB, JS: gzip / brotli / min)

The harness counts every chunk the build emits ([methodology](../../docs/methodology.md#bundle-size)).
Gyral 0.3.0's builds emit two lazily imported chunks besides the entry: `hydration-client`
(6.0 KB min, for server-rendered components) and `invokers-shim` (0.5 KB, where the browser
lacks invoker commands). The final run checked in Chromium 153 that a client-only page fetches
only the entry chunk; the builds are unchanged, so the "entry only" column (computed separately:
gzip 9 / brotli 11 on the entry file, not by the harness) is what such a page loads.

| App     | Gyral 0.3.0, all chunks | Gyral 0.3.0, entry only | Gyral 0.2.0        | Lit              | Solid            | Svelte             | Vue                | Preact           | React               |
| ------- | ----------------------- | ----------------------- | ------------------ | ---------------- | ---------------- | ------------------ | ------------------ | ---------------- | ------------------- |
| floor   | 11.6 / 10.5 / 28.9      | **8.6 / 7.8 / 22.4**    | 11.9 / 10.8 / 32.2 | 5.8 / 5.2 / 15.0 | 3.7 / 3.4 / 9.5  | 9.0 / 8.2 / 22.3   | 23.0 / 21.0 / 59.0 | 4.7 / 4.3 / 11.1 | 66.1 / 57.0 / 214.4 |
| counter | 11.7 / 10.6 / 29.2      | **8.7 / 7.9 / 22.7**    | 12.0 / 10.8 / 32.5 | 5.8 / 5.3 / 15.2 | 4.3 / 3.9 / 10.8 | 9.9 / 9.1 / 24.9   | 23.4 / 21.3 / 60.0 | 5.7 / 5.2 / 13.5 | 66.2 / 57.0 / 214.7 |
| todo    | 13.6 / 12.2 / 34.1      | **10.5 / 9.5 / 27.6**   | 13.6 / 12.3 / 36.9 | 7.3 / 6.6 / 19.2 | 6.6 / 6.0 / 16.9 | 14.2 / 12.9 / 36.1 | 25.0 / 22.8 / 64.2 | 6.1 / 5.5 / 14.2 | 66.6 / 57.3 / 215.6 |
| search  | 15.1 / 13.7 / 38.0      | **12.0 / 11.0 / 31.6**  | 14.1 / 12.8 / 37.7 | 6.6 / 6.0 / 16.9 | 5.9 / 5.3 / 14.2 | 13.8 / 12.6 / 35.1 | 25.1 / 22.9 / 64.0 | 6.5 / 6.0 / 15.1 | 67.0 / 57.7 / 216.2 |
| form    | 12.4 / 11.1 / 30.8      | **9.4 / 8.4 / 24.4**    | 13.1 / 11.8 / 35.5 | 6.4 / 5.8 / 16.9 | 6.9 / 6.3 / 17.8 | 14.4 / 13.1 / 37.2 | 25.8 / 23.5 / 66.5 | 6.2 / 5.6 / 14.9 | 66.8 / 57.5 / 216.1 |
| table   | 13.9 / 12.6 / 35.0      | **10.9 / 9.9 / 28.5**   | 13.7 / 12.4 / 36.9 | 7.5 / 6.8 / 19.5 | 7.1 / 6.5 / 18.1 | 13.5 / 12.3 / 34.2 | 24.4 / 22.2 / 62.6 | 6.5 / 5.9 / 15.7 | 67.1 / 57.9 / 217.2 |

- Identical to the final run, byte for byte in gzip. Size is still Gyral's weak point: the
  0.3.0 floor is 11.6 KiB counting every chunk (8.6 entry only), against Lit 5.8, Preact 4.7,
  Solid 3.7 and Svelte 9.0. Counting all chunks, search (+1.0) and table (+0.2) are larger than
  with 0.2.0; entry only, every app is 2.1–3.7 KiB smaller.
- `results.md` has the harness's tables, plus "everything served" with HTML.

## Memory and startup

| Framework       | JS heap after load (MB) | with 1k rows | after clear | todo input rendered (ms) | todo interactive, median (p90) |
| --------------- | ----------------------: | -----------: | ----------: | -----------------------: | -----------------------------: |
| **Gyral 0.3.0** |                **1.18** |     **2.13** |    **1.40** |                  **383** |                  **423 (429)** |
| Gyral 0.2.0     |                    1.26 |         2.05 |        1.41 |                      402 |                      443 (445) |
| Lit             |                    1.20 |         1.98 |        1.30 |                      368 |                      407 (417) |
| Solid           |                    1.13 |         3.12 |        1.33 |                      365 |                      405 (407) |
| Svelte          |                    1.19 |         2.48 |        1.47 |                      407 |                      447 (459) |
| Vue             |                    1.32 |         3.01 |        1.53 |                      458 |                      502 (511) |
| Preact          |                    1.17 |         2.79 |        1.27 |                      357 |                      396 (401) |
| React           |                    1.55 |         3.28 |        2.14 |                      683 |                      735 (747) |

- Memory is identical to the final run for every framework (it is deterministic at this
  resolution). 0.3.0 starts with a smaller heap than 0.2.0 (1.18 vs 1.26 MB) but holds 1,000
  rows in slightly more (2.13 vs 2.05); only Lit (1.98) holds them in less.
- Startup: the todo app is interactive at 423 ms with 0.3.0, 20 ms sooner than with 0.2.0,
  16–18 ms behind Lit and Solid and 27 ms behind Preact.

## Compared with the 2026-10-06 final run

The method says to compare frameworks within a run, not absolute numbers across runs. Here
the builds are byte-identical and the machine was similar, so the cross-run test (same
bootstrap and Mann–Whitney test, per framework and operation) shows what is noise:

- **Rankings and geomeans held.** Every framework's geomean moved by at most 0.02 (Preact 1.40
  → 1.38, React 1.53 → 1.55, Gyral 0.2.0 1.20 → 1.21); the order is the same, with Vue and
  Gyral 0.2.0 swapping their tie at 1.20/1.21. Gyral 0.3.0 is 1.03 in both.
- **Gyral 0.3.0 vs 0.2.0 held:** the within-run ratios agree to about 2 points on every
  operation except swap (−22.0% then, −14.2% now; 0.3.0's swap median 28.3 → 30.3 ms, not
  beyond noise across runs, p = 0.07) and select (frame mode).
- **Moved beyond noise** (the same rule: p < 0.05 or the interval excludes 1.00), 21 of 72
  framework/operation pairs, and 20 of them are *faster* now: create 1,000 rows for **every**
  framework (−2.3% to −5.9%, p ≤ 0.008), clear for four (Gyral 0.3.0, Lit, Svelte, Vue; −2% to
  −3%), append for four (Gyral 0.3.0, Lit, Vue, Preact; −1% to −4%), update every 10th row for
  three (both Gyrals, Lit; about −2%), and Preact's select (−8%). The one slower case is Lit's
  select (+5.4%), which is frame-aligned. Faster across the board with unchanged builds is a
  machine shift (the `powersave` governor ran at higher clocks this time: median probe
  3.7 GHz vs 2.7 GHz), not a framework change, and it doesn't change any comparison within the
  run.
- Startup medians moved by 0.7–3.5 ms (Gyral 0.3.0 424.6 → 422.9, 0.2.0 444.9 → 442.8); memory
  and sizes did not move at all.

**README headline:** this run replaces the 2026-10-06 final run as the headline. Neither was
flagged; this one measured the 0.3.0 release packs rather than 0.3.0-next.6, had a clean tree
and lower load (max 2.14 vs 3.33), at a slightly wider calibration spread (4.1% vs 3.3%).
