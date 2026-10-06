# Libraries v2: two-track 9bcac0e and pipewise 6d6a957 vs Gyral 0.2.0

One session (attempt 1 of up to 3; not flagged: calibration spread 4.8%, max load 1.98).
Trace timing, lit-html 3.3.0, 15 runs after 5 warm-up, CPU 4x.

- **gyral**: the published `@gyral/core` 0.2.0 from npm (hand-written runtime, whitespace
  minification).
- **gyral-twotrack**: Gyral branch `exp/two-track-v2` (6206e0f), based on released 0.2.0
  (e24dff3). switch/exhaust/queue run on `Lane.switchLane` / `exhaustLane` / `queueLane` with
  one lane-level abort fired on disconnect. Retry uses `Async.retry` + `backoff`.
- **gyral-pipewise**: Gyral branch `exp/pipewise-v2` (e6f0d86), based on released 0.2.0.
  Lanes on `mergeMap` / `switchMap` / `exhaustMap` / `concatMap`; retry hand-written.

All three Gyral builds pass the shared correctness spec (70/70 across all variants), and
both library builds pass Gyral's 655 tests and `smoke:prod`.

## Size, startup, memory

| | gyral 0.2.0 | two-track v2 | pipewise v2 | Lit | Svelte | Solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| JS gzip KiB, empty app | 11.9 | 12.7 (+0.8) | 13.6 (+1.7) | 5.8 | 9.0 | 3.7 |
| JS gzip KiB, todo | 13.6 | 14.4 (+0.8) | 15.4 (+1.8) | 7.3 | 14.2 | 6.6 |
| Todo interactive (ms) | 443 | 451 (+8) | 450 (+7) | 407 | 448 | 407 |
| Heap after load (MB) | 1.26 | 1.27 | 1.27 | 1.20 | 1.19 | 1.13 |

## Table runtime (median ms)

| Operation | gyral 0.2.0 | two-track v2 | pipewise v2 | Lit | Svelte | Solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1k | 229.8 | 230.4 | 228.8 | 262.1 | 213.9 | 232.2 |
| replace 1k | 258.9 | 257.1 | 258.6 | 296.2 | 245.3 | 257.1 |
| update every 10th | 70.6 | 71.5 | 76.2 | 74.2 | 70.1 | 67.7 |
| select | 16.8 | 17.5 | 16.7 | 13.8 | 13.0 | 7.7 |
| swap | 33.6 | 33.4 | 33.1 | 38.6 | 26.2 | 31.3 |
| remove | 43.9 | 44.2 | 43.8 | 48.0 | 42.3 | 46.3 |
| create 10k | 2393.6 | 2381.8 | 2388.1 | 2775.8 | 2146.5 | 2309.7 |
| append 1k | 301.3 | 304.2 | 299.3 | 331.8 | 275.6 | 302.9 |
| clear 1k | 27.9 | 28.1 | 28.8 | 35.6 | 22.2 | 23.6 |
| Geometric mean vs fastest | 1.20 | 1.21 | 1.21 | 1.32 | 1.06 | 1.07 |

The table never issues commands, so the three Gyral builds render identically: every
difference is within the p90 spread. Script time per operation is within 1 ms.

## Against the previous run (results/2026-10-05-all-runtimes-trace-a3)

| | previous (libraries before) | this run (v2) |
| --- | --- | --- |
| Gyral base | hand-written, no minification | 0.2.0 from npm, with minification |
| Table geometric mean, Gyral | 1.34 | 1.20 |
| two-track over hand-written, empty app | +0.3 KiB | +0.8 KiB (now also carries the lane code) |
| pipewise over hand-written, empty app | +1.5 KiB | +1.7 KiB |
| Startup cost vs hand-written | +6 ms / +3.5 ms | +8 ms / +7 ms |

The geometric-mean drop from 1.34 to 1.20 is the whitespace minification in 0.2.0, shared by
all three Gyral builds.

## Caveats

- One machine, one clean session. Compare within this run.
- `gyral` is the npm package; the two library variants are local packs of branches based on
  the same release commit, so the only difference is the interpreter and its dependency.
