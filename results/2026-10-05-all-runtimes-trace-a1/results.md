# Benchmark results, 2026-10-05 (all-runtimes-trace-a1)

> **Variant run: all-runtimes-trace-a1.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 5e6c2bb-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 4.6% (limit 5%), max 1-min load 6.03 **FLAGGED (machine busy): compare frameworks within this run only.**

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
| create 1,000 rows | 267.8 / 317.5 | 273.6 / 392.5 | 265.1 / 294.5 | 269.0 / 293.3 | 266.6 / 284.3 | 269.9 / 304.4 | **221.0 / 247.8** | 233.9 / 300.4 |
| replace 1,000 rows | 312.9 / 567.5 | 307.0 / 358.4 | 319.8 / 674.7 | 311.7 / 360.8 | 307.2 / 353.3 | 312.5 / 343.4 | **246.4 / 272.8** | 264.6 / 326.9 |
| update every 10th row | 78.9 / 83.8 | 76.7 / 81.9 | 78.0 / 81.3 | 77.3 / 80.5 | 77.5 / 81.7 | 76.3 / 81.4 | 72.5 / 79.5 | **71.0 / 85.6** |
| select row | 14.1 / 16.3 | 14.0 / 16.7 | 15.0 / 16.7 | 14.5 / 16.3 | 14.8 / 16.3 | 14.1 / 16.6 | 15.8 / 19.3 | **7.5 / 18.5** |
| swap rows | 38.7 / 47.2 | 38.3 / 41.9 | 39.1 / 45.6 | 40.0 / 41.1 | 38.0 / 40.4 | 39.6 / 42.2 | **26.4 / 28.6** | 30.9 / 34.7 |
| remove row | 49.9 / 67.6 | 50.6 / 59.6 | 51.9 / 59.7 | 52.1 / 62.7 | 50.3 / 54.2 | 50.8 / 54.9 | **45.1 / 54.1** | 48.2 / 60.7 |
| create 10,000 rows | 2777.1 / 2935.1 | 2808.6 / 3644.8 | 2756.6 / 2816.5 | 2760.3 / 2997.6 | 2769.0 / 2921.8 | 2781.9 / 3066.8 | **2127.0 / 2203.2** | 2283.2 / 2331.8 |
| append 1,000 rows | 334.0 / 353.2 | 331.6 / 343.5 | 333.3 / 349.2 | 336.8 / 350.0 | 334.3 / 356.1 | 333.5 / 351.7 | **272.6 / 280.1** | 298.1 / 313.6 |
| clear 1,000 rows | 35.8 / 37.3 | 36.5 / 37.8 | 35.8 / 37.1 | 36.0 / 37.4 | 35.8 / 37.1 | 35.4 / 36.7 | **22.3 / 23.0** | 23.9 / 28.7 |
| geometric mean of slowdown vs fastest | 1.33 | 1.33 | 1.35 | 1.35 | 1.33 | 1.33 | 1.09 | 1.07 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 52.3 / 167.2 / 43.8 / 3.3 | 53.1 / 174.0 / 43.0 / 3.6 | 52.6 / 166.5 / 41.5 / 3.3 | 52.5 / 170.9 / 42.9 / 3.5 | 52.1 / 168.7 / 41.5 / 3.2 | 57.0 / 169.0 / 44.7 / 3.0 | 29.1 / 153.7 / 36.3 / 1.7 | 46.5 / 149.1 / 36.6 / 1.5 |
| replace 1,000 rows | 87.4 / 175.8 / 46.8 / 3.6 | 85.9 / 172.8 / 46.6 / 3.4 | 87.9 / 175.5 / 50.6 / 4.2 | 87.6 / 169.8 / 47.3 / 3.5 | 86.5 / 171.8 / 46.4 / 3.6 | 87.0 / 172.5 / 47.6 / 3.9 | 50.7 / 153.7 / 40.5 / 1.7 | 71.3 / 153.2 / 39.6 / 1.7 |
| update every 10th row | 4.3 / 42.8 / 29.0 / 2.5 | 4.5 / 42.2 / 27.6 / 2.2 | 4.4 / 42.1 / 28.0 / 2.4 | 4.4 / 42.5 / 27.8 / 2.1 | 4.3 / 42.6 / 29.1 / 2.4 | 4.0 / 42.5 / 28.1 / 2.3 | 4.8 / 40.9 / 26.0 / 1.5 | 3.2 / 40.5 / 25.9 / 1.3 |
| select row | 2.8 / 0.0 / 6.3 / 5.7 | 2.8 / 0.0 / 6.0 / 5.5 | 2.7 / 0.0 / 6.0 / 6.1 | 2.8 / 0.0 / 6.4 / 5.8 | 3.0 / 0.0 / 6.5 / 5.3 | 2.5 / 0.0 / 6.5 / 5.2 | 5.3 / 0.0 / 6.5 / 1.4 | 0.8 / 0.0 / 6.2 / 1.5 |
| swap rows | 2.9 / 14.4 / 19.4 / 2.2 | 3.0 / 14.4 / 18.7 / 1.9 | 2.7 / 14.8 / 19.0 / 2.1 | 2.8 / 14.4 / 18.7 / 1.9 | 2.7 / 14.2 / 18.7 / 2.0 | 2.5 / 14.6 / 19.2 / 2.0 | 2.6 / 11.9 / 10.7 / 1.1 | 7.6 / 11.6 / 11.0 / 1.2 |
| remove row | 4.5 / 13.6 / 32.1 / 2.4 | 4.1 / 13.5 / 31.4 / 2.3 | 4.4 / 13.7 / 32.1 / 2.5 | 4.5 / 13.9 / 32.0 / 2.7 | 4.6 / 13.7 / 30.6 / 2.2 | 3.8 / 13.6 / 31.9 / 2.5 | 2.8 / 12.2 / 27.6 / 1.9 | 7.3 / 11.4 / 28.1 / 1.6 |
| create 10,000 rows | 589.8 / 1778.2 / 400.2 / 11.9 | 584.8 / 1789.9 / 421.8 / 12.4 | 590.1 / 1758.3 / 397.1 / 12.0 | 579.7 / 1770.3 / 403.2 / 11.9 | 589.6 / 1782.3 / 403.3 / 12.5 | 601.0 / 1791.6 / 372.6 / 11.6 | 275.3 / 1539.0 / 306.4 / 4.5 | 407.3 / 1565.7 / 303.0 / 4.8 |
| append 1,000 rows | 55.2 / 202.2 / 70.6 / 4.1 | 55.2 / 202.2 / 69.5 / 4.4 | 55.8 / 204.3 / 68.7 / 4.7 | 55.3 / 205.4 / 70.3 / 4.2 | 55.1 / 204.9 / 69.2 / 4.3 | 57.2 / 202.9 / 68.8 / 4.4 | 30.5 / 183.8 / 55.6 / 2.0 | 57.6 / 186.6 / 54.4 / 1.9 |
| clear 1,000 rows | 31.5 / 0.4 / 2.1 / 1.9 | 32.0 / 0.5 / 2.2 / 1.9 | 31.5 / 0.1 / 2.2 / 2.1 | 31.6 / 0.4 / 1.8 / 2.2 | 31.5 / 0.4 / 2.2 / 2.1 | 31.1 / 0.5 / 2.1 / 1.7 | 18.8 / 0.4 / 2.2 / 0.7 | 20.8 / 0.5 / 2.1 / 0.8 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.36 | 1.24 | 1.24 | 1.24 | 1.24 | 1.20 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.18 | 2.06 | 2.06 | 2.07 | 2.07 | 1.98 | 2.48 | 3.12 |
| after clearing them | 1.51 | 1.38 | 1.38 | 1.39 | 1.39 | 1.30 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 476 / 477 | 393 / 393 | 401 / 402 | 400 / 402 | 407 / 408 | 369 / 370 | 407 / 418 | 365 / 367 |
| first todo added (interactive) | 516 / 521 | 433 / 435 | 442 / 444 | 441 / 443 | 448 / 451 | 407 / 411 | 448 / 460 | 406 / 416 |
