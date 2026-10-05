# Experiment: lit-html 3.3.0 pin, then Effect 4 (gyral-bu6)

Local experiment, not published. Three runs of the same harness on the same machine
(i5-10400, headless Chromium 153, CPU 4x, 15 runs after 5 warm-up):

- **A** `results/2026-10-05`: Gyral 0.1.0 from npm, Effect 3.22.2, lit-html 3.3.3. All frameworks.
- **B** `results/2026-10-05-lit-html-3.3.0`: same, lit-html pinned to 3.3.0. Gyral and Lit only.
- **C** `results/2026-10-05-lit-html-3.3.0-effect4`: Gyral built from branch
  `exp/lit330-effect4` (commit 371855b, Effect 4.0.1), lit-html 3.3.0. All frameworks.
  Gyral comes from local tarballs in `vendor/` via `pnpm.overrides`. The lit-html override
  changes only Lit and Gyral; the other five frameworks don't use lit-html.

## Read this first: the machine was faster during run C

The five unchanged frameworks were 10-15% faster in C than in A (runtime geometric mean
C/A: React 0.87, Preact 0.85, Vue 0.87, Svelte 0.90, Solid 0.90; startup 0.89-0.94).
So raw A-vs-C milliseconds overstate Gyral's runtime gain. Compare **within a run**:

| Within each run | A | B | C |
| --- | ---: | ---: | ---: |
| Gyral / Lit, table runtime geometric mean (excl. select) | 1.00 | 1.01 | 1.02 |
| Startup gap, Gyral minus Lit, todo interactive (ms) | +286 | +254 | **+109** |
| JS heap after load, Gyral / Lit (MB) | 1.71 / 1.20 | 1.71 / 1.20 | **1.36** / 1.20 |
| Clear 1,000 rows, Gyral (ms) | 3,746 | **56** | 46 |
| Replace 1,000 rows, Gyral (ms) | 2,231 | **414** | 373 |
| JS gzip, todo app (KiB) | 51.0 | 51.0 | **25.8** |

## What each change bought

1. **lit-html 3.3.0 pin (A → B):** fixes clear (67x faster) and replace (5.4x), and the DOM
   no longer grows under churn. No size change. Lit gets the same fix.
2. **Effect 4 (B → C):** bundle halves (todo 51.0 → 25.8 KiB gzip; floor 49.2 → 24.0), the
   startup gap to Lit shrinks from about 254 ms to 109 ms, heap after load drops 0.35 MB.
   Runtime relative to Lit is unchanged (1.01 → 1.02, within noise): the interpreter was
   never the bottleneck.
3. **Gyral stays at Lit's runtime speed** in every run: MVI costs no measurable runtime.

## Where Gyral stands after both changes (run C, all frameworks)

| | Solid | Preact | Lit | Svelte | Vue | Gyral | React |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| JS gzip KiB, empty app | 3.7 | 4.7 | 5.8 | 9.0 | 23.0 | **24.0** | 66.1 |
| JS gzip KiB, todo app | 6.6 | 6.1 | 7.3 | 14.2 | 25.0 | **25.8** | 66.6 |
| Todo interactive, cold + throttled (ms) | 406 | 397 | 407 | 448 | 502 | **516** | 734 |
| Table runtime, geometric mean vs fastest | 1.07 | 1.57 | 1.59 | 1.16 | 1.18 | **1.61** | 1.91 |
| JS heap after load (MB) | 1.13 | 1.17 | 1.20 | 1.19 | 1.32 | **1.36** | 1.55 |

Gyral moves from second-largest to Vue's size class, and from about 300 ms behind the
small frameworks at startup to about 110 ms. It is still roughly 3-4x the JavaScript of
Lit, Preact or Solid: Effect 4 is about 13 KiB of the 24. Lit-based rendering is
somewhat slower than Svelte/Solid at bulk create, append and clear; that is Lit, not Gyral.

## Caveats

- Timing ends at the next rendered frame (rAF + MessageChannel), not trace paint events, so
  differences under about 17 ms are not meaningful (gyral-7se.12 tracks trace-based timing).
- One machine, one session per run, and session drift of 10-15% between A and C (above).
- B measured only Gyral and Lit.
- "select row" is under one frame for every framework and is excluded from the ratios.
- Outliers checked: A's replace and clear had very wide spreads (p90 3,439 and 7,668 ms)
  because the leak makes each run slower than the last; B and C spreads are tight.
  React's swap (248 ms) is React's known keyed-swap behaviour and appears in every run.

Full per-run tables: `results.md` in each run directory. Gyral across all three runs, every
metric: [gyral-across-runs.md](gyral-across-runs.md).
