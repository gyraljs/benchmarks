# Benchmark results, 2026-10-05 (all-runtimes-trace-a2)

> **Variant run: all-runtimes-trace-a2.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 5e6c2bb-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 5.8% (limit 5%), max 1-min load 2.56 **FLAGGED (speed drifted): compare frameworks within this run only.**

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
- **gyral-noeffect**: @gyral/core-noeffect 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **gyral-twotrack**: @gyral/core-twotrack 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **gyral-pipewise**: @gyral/core-pipewise 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **gyral-combo**: @gyral/core-combo 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 24.0 | 10.8 | 11.1 | 12.3 | 12.7 | 5.8 | 9.0 | 3.7 |
| counter | 24.1 | 10.9 | 11.2 | 12.5 | 12.8 | 5.8 | 9.9 | 4.3 |
| todo | 25.8 | 12.5 | 12.8 | 14.1 | 14.4 | 7.3 | 14.2 | 6.6 |
| search | 26.4 | 13.0 | 13.4 | 14.6 | 14.9 | 6.6 | 13.8 | 5.9 |
| form | 25.3 | 12.0 | 12.4 | 13.6 | 13.9 | 6.4 | 14.4 | 6.9 |
| table | 25.9 | 12.6 | 12.9 | 14.2 | 14.5 | 7.5 | 13.5 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 21.7 | 9.8 | 10.1 | 11.2 | 11.5 | 5.2 | 8.2 | 3.4 |
| counter | 21.7 | 9.9 | 10.2 | 11.3 | 11.6 | 5.3 | 9.1 | 3.9 |
| todo | 23.2 | 11.3 | 11.6 | 12.7 | 13.0 | 6.6 | 12.9 | 6.0 |
| search | 23.7 | 11.8 | 12.1 | 13.2 | 13.5 | 6.0 | 12.6 | 5.3 |
| form | 22.8 | 10.9 | 11.2 | 12.3 | 12.6 | 5.8 | 13.1 | 6.3 |
| table | 23.3 | 11.4 | 11.7 | 12.8 | 13.1 | 6.8 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 68.0 | 29.7 | 30.4 | 34.4 | 35.1 | 15.0 | 22.3 | 9.5 |
| counter | 68.3 | 30.0 | 30.8 | 34.7 | 35.4 | 15.2 | 24.9 | 10.8 |
| todo | 72.7 | 34.4 | 35.1 | 39.1 | 39.8 | 19.2 | 36.1 | 16.9 |
| search | 73.6 | 35.3 | 36.0 | 39.9 | 40.6 | 16.9 | 35.1 | 14.2 |
| form | 71.3 | 33.0 | 33.8 | 37.7 | 38.4 | 16.9 | 37.2 | 17.8 |
| table | 72.8 | 34.5 | 35.2 | 39.1 | 39.8 | 19.5 | 34.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 24.3 | 11.0 | 11.4 | 12.6 | 12.9 | 6.0 | 9.2 | 4.0 |
| counter | 24.4 | 11.1 | 11.5 | 12.7 | 13.0 | 6.1 | 10.1 | 4.5 |
| todo | 26.1 | 12.7 | 13.1 | 14.3 | 14.6 | 7.5 | 14.4 | 6.8 |
| search | 26.6 | 13.3 | 13.6 | 14.8 | 15.1 | 6.8 | 14.1 | 6.1 |
| form | 25.5 | 12.3 | 12.6 | 13.8 | 14.1 | 6.7 | 14.6 | 7.2 |
| table | 26.1 | 12.8 | 13.2 | 14.4 | 14.7 | 7.7 | 13.7 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 284.1 / 344.3 | 281.5 / 519.8 | 274.8 / 327.3 | 264.8 / 305.1 | 275.5 / 332.2 | 282.1 / 311.0 | **225.0 / 302.4** | 248.8 / 322.7 |
| replace 1,000 rows | 293.7 / 308.8 | 298.1 / 311.0 | 294.7 / 298.1 | 297.3 / 310.6 | 297.5 / 319.8 | 294.8 / 309.1 | **236.9 / 242.7** | 253.9 / 272.6 |
| update every 10th row | 74.1 / 80.1 | 71.8 / 74.2 | 72.0 / 77.8 | 72.9 / 78.5 | 72.2 / 80.3 | 71.8 / 78.5 | 69.0 / 76.3 | **68.2 / 75.5** |
| select row | 15.5 / 16.8 | 15.4 / 16.9 | 15.9 / 16.7 | 15.9 / 17.3 | 14.8 / 16.0 | 14.4 / 15.9 | 11.9 / 15.7 | **7.2 / 14.3** |
| swap rows | 37.5 / 46.0 | 37.7 / 42.7 | 38.8 / 46.7 | 37.3 / 40.1 | 38.1 / 42.0 | 37.2 / 42.5 | **26.4 / 28.9** | 30.7 / 32.6 |
| remove row | 48.1 / 53.5 | 49.1 / 56.4 | 48.9 / 61.2 | 48.2 / 56.0 | 49.3 / 56.0 | 48.1 / 53.7 | **41.5 / 46.0** | 46.0 / 55.5 |
| create 10,000 rows | 2744.3 / 2781.6 | 2770.7 / 2805.3 | 2760.9 / 2783.2 | 2747.1 / 2866.0 | 2771.0 / 2878.6 | 2755.9 / 2843.1 | **2125.2 / 2178.8** | 2270.1 / 2372.6 |
| append 1,000 rows | 328.0 / 334.6 | 330.2 / 347.5 | 328.2 / 353.5 | 329.8 / 350.7 | 327.1 / 340.9 | 328.6 / 346.6 | **269.2 / 289.3** | 291.9 / 319.0 |
| clear 1,000 rows | 36.0 / 36.9 | 35.6 / 36.4 | 36.0 / 37.3 | 35.8 / 37.1 | 35.6 / 36.9 | 35.1 / 37.6 | **22.0 / 23.9** | 23.7 / 28.8 |
| geometric mean of slowdown vs fastest | 1.36 | 1.36 | 1.36 | 1.35 | 1.35 | 1.34 | 1.06 | 1.07 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 52.7 / 177.7 / 44.4 / 3.3 | 54.4 / 176.6 / 45.9 / 3.6 | 52.3 / 171.3 / 43.7 / 3.4 | 51.9 / 168.4 / 43.7 / 3.5 | 53.8 / 174.5 / 43.3 / 3.6 | 58.1 / 174.2 / 46.4 / 3.5 | 29.0 / 155.6 / 36.3 / 1.6 | 49.3 / 158.4 / 39.4 / 1.8 |
| replace 1,000 rows | 83.8 / 164.0 / 42.3 / 3.5 | 84.3 / 166.2 / 43.7 / 3.3 | 84.0 / 164.5 / 42.5 / 3.3 | 83.7 / 165.3 / 43.2 / 3.7 | 83.7 / 164.9 / 44.2 / 3.8 | 84.3 / 163.3 / 43.0 / 3.1 | 48.6 / 149.2 / 37.2 / 2.0 | 65.9 / 147.8 / 36.2 / 1.6 |
| update every 10th row | 4.2 / 41.4 / 26.1 / 2.3 | 4.1 / 40.6 / 24.9 / 2.3 | 4.0 / 41.0 / 25.0 / 2.1 | 4.2 / 41.2 / 25.6 / 2.0 | 4.0 / 41.1 / 25.5 / 1.9 | 3.6 / 40.9 / 24.9 / 2.1 | 4.8 / 39.1 / 24.0 / 1.1 | 3.1 / 39.7 / 24.3 / 1.6 |
| select row | 2.8 / 0.0 / 6.2 / 6.5 | 2.8 / 0.0 / 6.3 / 6.9 | 2.8 / 0.0 / 6.0 / 6.9 | 2.8 / 0.0 / 6.2 / 7.2 | 2.8 / 0.0 / 6.0 / 5.7 | 2.4 / 0.0 / 6.0 / 6.2 | 4.6 / 0.0 / 6.3 / 0.9 | 0.8 / 0.0 / 5.7 / 1.0 |
| swap rows | 3.0 / 14.6 / 18.3 / 1.9 | 2.8 / 14.6 / 18.8 / 1.9 | 2.9 / 14.9 / 19.3 / 2.2 | 3.0 / 14.4 / 18.0 / 1.8 | 2.8 / 14.5 / 18.5 / 2.0 | 2.5 / 14.5 / 18.8 / 2.0 | 2.6 / 12.2 / 10.6 / 1.2 | 7.3 / 11.9 / 10.4 / 1.1 |
| remove row | 4.0 / 13.1 / 29.6 / 2.1 | 4.5 / 13.3 / 30.4 / 2.3 | 4.5 / 13.5 / 29.6 / 2.3 | 4.3 / 13.0 / 30.1 / 2.0 | 4.3 / 13.5 / 30.8 / 1.9 | 3.7 / 13.6 / 29.8 / 2.3 | 2.7 / 11.3 / 26.2 / 1.4 | 7.3 / 11.3 / 26.5 / 1.8 |
| create 10,000 rows | 567.1 / 1769.9 / 396.2 / 11.9 | 569.1 / 1790.8 / 392.4 / 11.8 | 573.8 / 1784.2 / 393.6 / 11.7 | 578.0 / 1765.9 / 394.1 / 11.8 | 577.0 / 1783.0 / 394.4 / 11.7 | 585.9 / 1801.0 / 365.9 / 11.8 | 268.5 / 1554.1 / 299.5 / 4.6 | 403.9 / 1561.2 / 302.0 / 4.3 |
| append 1,000 rows | 54.0 / 201.2 / 67.7 / 4.4 | 55.0 / 202.5 / 67.3 / 4.3 | 54.5 / 200.6 / 67.2 / 4.2 | 54.9 / 202.2 / 67.8 / 4.5 | 53.9 / 203.0 / 66.5 / 4.3 | 54.8 / 200.7 / 67.3 / 4.1 | 30.6 / 182.9 / 53.5 / 1.7 | 54.8 / 182.6 / 53.3 / 1.9 |
| clear 1,000 rows | 31.7 / 0.6 / 2.1 / 1.9 | 31.4 / 0.6 / 2.2 / 1.7 | 31.7 / 0.5 / 2.0 / 1.9 | 31.2 / 0.5 / 2.1 / 1.8 | 31.4 / 0.4 / 2.1 / 1.9 | 31.1 / 0.1 / 1.9 / 1.9 | 18.9 / 0.2 / 2.3 / 0.6 | 20.2 / 0.6 / 1.9 / 0.8 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.36 | 1.24 | 1.24 | 1.24 | 1.24 | 1.20 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.19 | 2.06 | 2.06 | 2.07 | 2.07 | 1.98 | 2.48 | 3.12 |
| after clearing them | 1.51 | 1.38 | 1.39 | 1.39 | 1.39 | 1.30 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 475 / 479 | 393 / 394 | 400 / 406 | 400 / 402 | 407 / 409 | 369 / 371 | 407 / 408 | 366 / 367 |
| first todo added (interactive) | 516 / 520 | 433 / 437 | 441 / 448 | 441 / 442 | 448 / 451 | 407 / 411 | 448 / 450 | 406 / 408 |
