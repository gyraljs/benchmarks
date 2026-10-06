# Gyral 0.3 final: speed gate run, 2026-10-06

Gyral bead gyral-g1r.15 (Phase 8, merge gate 4 of ADR 0018: "no benchmark operation slower than
0.2.0; better geomean"). ADR 0018's "Measuring" section asks for one run in which
`frameworks/gyral` (published 0.2.0) and `frameworks/gyral-next` (0.3, packed from `next`, never
published) are measured together and compared only within that run. This is that run.

- **gyral-next**: `@gyral/core` and `@gyral/time` **0.3.0-next.6**, Gyral's own packs from `next`
  at **2cc2704** (`../gyral-tarballs/SOURCE-0.3.0-next.6.json`), copied unchanged into
  `vendor-next/` (`vendor-next/SOURCE.json`). No Lit in its tree.
- **gyral**: `@gyral/core` 0.2.0 from npm (Lit 3.3.3, lit-html pinned to 3.3.0 as in every run).
- Also measured, unchanged: Lit, Solid, Svelte, Vue, Preact, React (current pinned releases).
- Command: `flock /tmp/gyral-bench.lock timeout 7200 pnpm bench --label=gyral-0.3-final
  --only=gyral,gyral-next,lit,solid,svelte,vue,preact,react`: the full run (5 warm-up + 15
  measured samples per operation, interleaved, CPU 4x, trace timing; memory 5 runs; startup 15
  runs). Bench commit 972f1ac (clean tree). 19:13–19:37 local time.
- All 48 app/framework pairs passed `tests/apps.spec.ts` against the production builds first.

## Machine state

- **Drift not flagged:** calibration spread 3.3% (limit 5%; 29.4–30.4 ms), 1-minute load 2.2–3.3
  on 12 cores (flag threshold 6). The spike run had 78% spread and load up to 23.8.
- Other work on the machine, left running: an unrelated `vitest` worker in
  `two-track-fp-skill-examples/ecommerce` spinning at ~96% of one core the whole time (8 h 45 min
  old at the start), other agents' sessions, a browser and Discord. An ESLint and `pnpm check`
  in `gyral-shop` ran a few minutes before the bench and were gone when it started. A per-minute log
  showed load 2.2–3.3 throughout, with the spinning worker as the only steady consumer besides
  headless Chromium. It takes one of 12 cores, and the calibration workload stayed within
  29.4–30.4 ms, so any effect it had is inside the 3.3% spread. It still makes absolute
  numbers not comparable with other runs.
- The CPU governor is `powersave`: the probes saw 1.6–4.0 GHz between operations. The
  interleaving spreads that over all frameworks.
- The run took 24 minutes (the spike: 19 minutes for five frameworks). Under the spike's load,
  create 10,000 rows took 2.2× as long in absolute terms (5,262 vs 2,400 ms for 0.2.0).

## The gate: Gyral 0.2.0 vs gyral-next, this run

Noise estimate per operation: a 95% bootstrap interval for the ratio of medians (20,000
resamples of the 15 samples on each side) and a two-sided Mann–Whitney U test. An operation
**fails** when 0.3's median is higher and the difference is beyond noise (p < 0.05, or the
interval lies above 1.00).

| Operation             | 0.2.0 median (p90) | 0.3 median (p90) | Δ median | 95% CI of ratio | MW p  | script 0.2.0 → 0.3 | verdict                    |
| --------------------- | -----------------: | ---------------: | -------: | :-------------: | ----: | -----------------: | -------------------------- |
| create 1,000 rows     |      237.6 (246.6) |    230.1 (243.4) |    −3.1% |   0.936–0.989   | 0.002 |        40.8 → 34.7 | pass, faster beyond noise  |
| replace 1,000 rows    |      263.3 (276.0) |    249.6 (255.2) |    −5.2% |   0.934–0.960   | 0.000 |        62.9 → 53.2 | pass, faster beyond noise  |
| update every 10th row |        75.5 (80.7) |      72.8 (83.0) |    −3.6% |   0.947–0.993   | 0.009 |          4.3 → 3.2 | pass, faster beyond noise  |
| select row            |        16.7 (17.9) |       9.4 (19.0) |   −43.8% |   0.530–1.014   | 0.068 |          3.0 → 1.9 | pass, within noise (below) |
| swap rows             |        36.2 (40.5) |      28.3 (30.1) |   −22.0% |   0.754–0.802   | 0.000 |          3.0 → 2.0 | pass, faster beyond noise  |
| remove row            |        47.5 (54.7) |      45.6 (50.7) |    −3.9% |   0.932–1.043   | 0.062 |          4.2 → 2.3 | pass, within noise         |
| create 10,000 rows    |    2399.6 (2522.7) |  2293.2 (2375.1) |    −4.4% |   0.939–0.961   | 0.000 |      422.6 → 342.3 | pass, faster beyond noise  |
| append 1,000 rows     |      309.0 (315.2) |    291.4 (309.9) |    −5.7% |   0.930–0.956   | 0.000 |        45.1 → 37.1 | pass, faster beyond noise  |
| clear 1,000 rows      |        29.1 (29.8) |      22.3 (23.3) |   −23.5% |   0.752–0.795   | 0.000 |        24.3 → 18.9 | pass, faster beyond noise  |

**Verdict: PASS.** No operation is slower than 0.2.0. Seven are faster beyond noise and two are
within noise, both with lower medians. Geomean vs fastest: **1.03 for 0.3, 1.20 for 0.2.0**. The
geometric mean of the nine 0.3/0.2.0 ratios is 0.860 (−14.0%), or 0.907 (−9.3%) without select
row. The drift caveat doesn't apply: the run was not flagged.

- **Script time is lower on every operation** (create 10,000: 342 vs 423 ms; replace: 53 vs 63;
  clear: 18.9 vs 24.3). Style/layout and paint are the same for both (the same DOM), except
  swap's paint (11.7 vs 17.6 ms). There, 0.3 matches Solid, Svelte and Vue (11.5–11.9), and
  0.2.0 is nearer Lit (20.5): probably how lit-html's `repeat` moves the two rows (not traced).
- **Select row: don't read −44% as a speedup.** It is frame-quantized
  ([methodology](../../docs/methodology.md#limits)); samples are bimodal at about 8–10 ms or
  15–20 ms. In this run 9 of 15 gyral-next samples landed in the fast mode against 1 of 15 for
  0.2.0 (Solid 9, React 6, Svelte 4, Lit 3, Vue 2, Preact 0). Script was 1.9 vs 3.0 ms. The
  gate only needs "not slower", and it isn't (p = 0.068 for the difference).

## Every framework (medians, ms)

| Operation                 |    Gyral 0.2.0 | **gyral-next** |    Lit |  Solid |   Svelte |    Vue | Preact |  React |
| ------------------------- | -------------: | -------------: | -----: | -----: | -------: | -----: | -----: | -----: |
| create 1,000 rows         |          237.6 |          230.1 |  274.4 |  242.4 | **223.1** |  246.3 |  256.0 |  250.9 |
| replace 1,000 rows        |          263.3 |          249.6 |  306.0 |  267.3 | **245.8** |  269.6 |  291.8 |  294.2 |
| update every 10th row     |           75.5 |       **72.8** |   78.0 |   74.8 |     74.7 |   75.8 |   88.7 |   78.3 |
| select row                |           16.7 |            9.4 |   13.6 |  **8.1** |     13.9 |   16.7 |   27.1 |   13.0 |
| swap rows                 |           36.2 |           28.3 |   41.1 |   33.1 |     28.6 | **27.7** |   44.0 |  222.5 |
| remove row                |           47.5 |       **45.6** |   52.1 |   50.5 |     45.9 |   55.4 |   65.7 |   49.4 |
| create 10,000 rows        |         2399.6 |         2293.2 | 2835.5 | 2328.5 | **2199.7** | 2430.9 | 2590.2 | 3135.0 |
| append 1,000 rows         |          309.0 |          291.4 |  339.5 |  308.5 | **281.0** |  305.1 |  344.9 |  313.9 |
| clear 1,000 rows          |           29.1 |       **22.3** |   35.9 |   24.4 |     22.9 |   29.7 |   25.8 |   32.4 |
| **geomean vs fastest**    |       **1.20** |       **1.03** |   1.31 |   1.08 |     1.07 |   1.20 |   1.40 |   1.53 |
| geomean, without select   |           1.12 |           1.02 |   1.28 |   1.09 |     1.01 |   1.12 |   1.26 |   1.52 |

Ranking by geomean: gyral-next 1.03, Svelte 1.07, Solid 1.08, Vue 1.20, Gyral 0.2.0 1.20, Lit
1.31, Preact 1.40, React 1.53. Without select row (the frame-quantized operation), Svelte
1.01 and gyral-next 1.02 change places. ADR 0018's target of 1.20 is met.

## Bundle sizes (KiB, JS)

The harness counts **every chunk the build emits** (methodology). gyral-next's builds emit two
lazily imported chunks besides the entry: `hydration-client` (6.0 KB min, only for pages with
server-rendered components) and `invokers-shim` (0.5 KB, only where the browser lacks invoker
commands). A check in Chromium 153 (`page.on('request')` on all six gyral-next apps) showed
that only the entry chunk is fetched, so the harness numbers overstate what a client-only
0.3 page loads by about 3 KiB gzip. Both views below. 0.2.0 and the others emit one chunk.

| App: gzip / brotli / min | Gyral 0.2.0        | gyral-next, all chunks | gyral-next, entry only | Lit              | Solid            | Svelte            | Vue               | Preact           | React               |
| ------------------------ | ------------------ | ---------------------- | ---------------------- | ---------------- | ---------------- | ----------------- | ----------------- | ---------------- | ------------------- |
| floor                    | 11.9 / 10.8 / 32.2 | 11.6 / 10.5 / 28.9     | **8.6 / 7.8 / 22.4**   | 5.8 / 5.2 / 15.0 | 3.7 / 3.4 / 9.5  | 9.0 / 8.2 / 22.3  | 23.0 / 21.0 / 59.0 | 4.7 / 4.3 / 11.1 | 66.1 / 57.0 / 214.4 |
| counter                  | 12.0 / 10.8 / 32.5 | 11.7 / 10.6 / 29.2     | **8.7 / 7.9 / 22.7**   | 5.8 / 5.3 / 15.2 | 4.3 / 3.9 / 10.8 | 9.9 / 9.1 / 24.9  | 23.4 / 21.3 / 60.0 | 5.7 / 5.2 / 13.5 | 66.2 / 57.0 / 214.7 |
| todo                     | 13.6 / 12.3 / 36.9 | 13.6 / 12.2 / 34.1     | **10.5 / 9.5 / 27.6**  | 7.3 / 6.6 / 19.2 | 6.6 / 6.0 / 16.9 | 14.2 / 12.9 / 36.1 | 25.0 / 22.8 / 64.2 | 6.1 / 5.5 / 14.2 | 66.6 / 57.3 / 215.6 |
| search                   | 14.1 / 12.8 / 37.7 | 15.1 / 13.7 / 38.0     | **12.0 / 11.0 / 31.6** | 6.6 / 6.0 / 16.9 | 5.9 / 5.3 / 14.2 | 13.8 / 12.6 / 35.1 | 25.1 / 22.9 / 64.0 | 6.5 / 6.0 / 15.1 | 67.0 / 57.7 / 216.2 |
| form                     | 13.1 / 11.8 / 35.5 | 12.4 / 11.1 / 30.8     | **9.4 / 8.4 / 24.4**   | 6.4 / 5.8 / 16.9 | 6.9 / 6.3 / 17.8 | 14.4 / 13.1 / 37.2 | 25.8 / 23.5 / 66.5 | 6.2 / 5.6 / 14.9 | 66.8 / 57.5 / 216.1 |
| table                    | 13.7 / 12.4 / 36.9 | 13.9 / 12.6 / 35.0     | **10.9 / 9.9 / 28.5**  | 7.5 / 6.8 / 19.5 | 7.1 / 6.5 / 18.1 | 13.5 / 12.3 / 34.2 | 24.4 / 22.2 / 62.6 | 6.5 / 5.9 / 15.7 | 67.1 / 57.9 / 217.2 |

- Entry only, 0.3 is 2.1–3.7 KiB gzip smaller than 0.2.0 in every app (floor 8.6 vs 11.9).
  Counting all chunks, it is smaller in floor, counter and form (0.3–0.7 KiB), the same in todo,
  and **larger in search (+1.0) and table (+0.2)**.
- ADR 0018's floor target is ≤ 8 KiB gzip: the floor entry is 8.6, not there yet. (Gyral's own
  migration note gives 8.9 for its hello-world example.) Lit's floor is 5.8, Svelte's 9.0.
- Entry-only figures are computed separately (gzip 9, brotli 11 on the entry file), not by the
  harness. `results.md` has the harness's all-chunk tables, plus "everything served" with HTML.

## Memory and startup

| Framework       | JS heap after load (MB) | with 1k rows | after clear | todo input rendered (ms) | todo interactive, median (p90) |
| --------------- | ----------------------: | -----------: | ----------: | -----------------------: | -----------------------------: |
| Gyral 0.2.0     |                    1.26 |         2.05 |        1.41 |                      403 |                      445 (453) |
| **gyral-next**  |                **1.18** |     **2.13** |    **1.40** |                  **383** |                  **425 (428)** |
| Lit             |                    1.20 |         1.98 |        1.30 |                      370 |                      410 (412) |
| Solid           |                    1.13 |         3.12 |        1.33 |                      366 |                      407 (413) |
| Svelte          |                    1.19 |         2.48 |        1.47 |                      408 |                      450 (454) |
| Vue             |                    1.32 |         3.01 |        1.53 |                      458 |                      503 (509) |
| Preact          |                    1.17 |         2.79 |        1.27 |                      357 |                      398 (402) |
| React           |                    1.55 |         3.28 |        2.14 |                      686 |                      739 (745) |

- 0.3 starts with a smaller heap than 0.2.0 (1.18 vs 1.26 MB) but holds 1,000 rows in slightly
  more (2.13 vs 2.05). That is still less than Solid, Svelte, Vue, Preact or React; only Lit
  (1.98) holds less.
- Startup: the todo app is interactive 20 ms sooner than with 0.2.0 (425 vs 445 ms), about
  15 ms behind Lit and Solid, 27 ms behind Preact.

## Compared with the spike run (`../2026-10-06-gyral-next-spike/`)

Absolute numbers can't be compared across runs (the spike was flagged, load up to 23.8). The
0.3/0.2.0 ratio within each run can:

| Operation             | spike: next vs 0.2.0 | final: 0.3 vs 0.2.0 |
| --------------------- | -------------------: | ------------------: |
| create 1,000 rows     |                +0.4% |               −3.1% |
| replace 1,000 rows    |                −0.7% |               −5.2% |
| update every 10th row |                −0.1% |               −3.6% |
| select row            |                +5.6% |  −43.8% (frame mode) |
| swap rows             |               −21.7% |              −22.0% |
| remove row            |                −5.6% |               −3.9% |
| create 10,000 rows    |                +1.4% |               −4.4% |
| append 1,000 rows     |                −5.7% |               −5.7% |
| clear 1,000 rows      |               −20.1% |              −23.5% |
| geomean vs fastest    |    1.06 vs 1.12 (5 fw) |  1.03 vs 1.20 (8 fw) |

- The three operations the spike left "within noise, slightly slower" (create 1k, create 10k,
  select) are now faster. Create 1k and create 10k are faster beyond noise. The spike's
  "script lower everywhere" holds, and on a quiet machine it now shows in the totals too.
- Size (all chunks, gzip): the spike pack (`next-spike` 784bd2f) had floor 12.3 KiB. The final
  pack has 11.6 (entry 8.6): since the spike, features load with the API that uses them and
  hydration is a lazy chunk. Search grew from 13.7 to 15.1 KiB counting all chunks.

## App changes since the spike

- Table and todo rows now name intents with a module-level `const i = intents<Msg>()`, the
  idiom Gyral's skill documents for 0.3 (`skills/gyral/references/view.md`, "Lists"). `pick`
  now carries only the table's selection (a boolean) and is gone from the todo list. That
  removes the per-row pick object and the spike's `Picked` interfaces.
- No other API change needed: the apps already used attribute form state (`value=`,
  `?checked=`), `each`, and `gyralVitePreset()` (template compiler). They build with no
  compiler errors and pass the spec. The form app keeps the shared validation rules through
  plain intents, as 0.2.0 does (not `form()`/`invalid()`, to keep validation code identical
  across frameworks; `docs/apps.md`).
