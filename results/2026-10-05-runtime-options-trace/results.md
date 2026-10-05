# Benchmark results, 2026-10-05 (runtime-options-trace)

> **Variant run: runtime-options-trace.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 69f3ae4
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 5.9% (limit 5%), max 1-min load 4.69 **FLAGGED (speed drifted): compare frameworks within this run only.**

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
- **gyral-noeffect**: @gyral/core-noeffect 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **gyral-twotrack**: @gyral/core-twotrack 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 24.0 | 10.8 | 11.1 | 5.8 | 9.0 | 3.7 |
| counter | 24.1 | 10.9 | 11.2 | 5.8 | 9.9 | 4.3 |
| todo | 25.8 | 12.5 | 12.8 | 7.3 | 14.2 | 6.6 |
| search | 26.4 | 13.0 | 13.4 | 6.6 | 13.8 | 5.9 |
| form | 25.3 | 12.0 | 12.4 | 6.4 | 14.4 | 6.9 |
| table | 25.9 | 12.6 | 12.9 | 7.5 | 13.5 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 21.7 | 9.8 | 10.1 | 5.2 | 8.2 | 3.4 |
| counter | 21.7 | 9.9 | 10.2 | 5.3 | 9.1 | 3.9 |
| todo | 23.2 | 11.3 | 11.6 | 6.6 | 12.9 | 6.0 |
| search | 23.7 | 11.8 | 12.1 | 6.0 | 12.6 | 5.3 |
| form | 22.8 | 10.9 | 11.2 | 5.8 | 13.1 | 6.3 |
| table | 23.3 | 11.4 | 11.7 | 6.8 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 68.0 | 29.7 | 30.4 | 15.0 | 22.3 | 9.5 |
| counter | 68.3 | 30.0 | 30.8 | 15.2 | 24.9 | 10.8 |
| todo | 72.7 | 34.4 | 35.1 | 19.2 | 36.1 | 16.9 |
| search | 73.6 | 35.3 | 36.0 | 16.9 | 35.1 | 14.2 |
| form | 71.3 | 33.0 | 33.8 | 16.9 | 37.2 | 17.8 |
| table | 72.8 | 34.5 | 35.2 | 19.5 | 34.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 24.3 | 11.0 | 11.4 | 6.0 | 9.2 | 4.0 |
| counter | 24.4 | 11.1 | 11.5 | 6.1 | 10.1 | 4.5 |
| todo | 26.1 | 12.7 | 13.1 | 7.5 | 14.4 | 6.8 |
| search | 26.6 | 13.3 | 13.6 | 6.8 | 14.1 | 6.1 |
| form | 25.5 | 12.3 | 12.6 | 6.7 | 14.6 | 7.2 |
| table | 26.1 | 12.8 | 13.2 | 7.7 | 13.7 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-noeffect | gyral-twotrack | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 291.2 / 494.6 | 307.8 / 475.9 | 291.6 / 587.8 | 300.5 / 347.9 | **249.0 / 301.1** | 263.1 / 417.6 |
| replace 1,000 rows | 312.0 / 685.1 | 318.4 / 354.8 | 310.4 / 431.1 | 302.6 / 556.6 | **260.3 / 399.2** | 272.3 / 345.7 |
| update every 10th row | 76.5 / 98.7 | 76.0 / 88.0 | 74.5 / 87.1 | 75.2 / 88.7 | 71.6 / 79.4 | **71.5 / 79.0** |
| select row | 14.8 / 16.3 | 16.1 / 18.6 | 15.2 / 16.6 | 14.4 / 16.1 | 12.1 / 23.1 | **7.3 / 18.2** |
| swap rows | 41.6 / 47.9 | 45.7 / 51.2 | 42.6 / 48.5 | 42.5 / 52.4 | **29.0 / 35.1** | 33.6 / 43.8 |
| remove row | 49.6 / 61.7 | 49.9 / 54.1 | 49.1 / 55.4 | 48.8 / 56.6 | **42.1 / 46.9** | 46.2 / 50.7 |
| create 10,000 rows | 2764.9 / 2873.1 | 2771.9 / 2815.8 | 2764.6 / 2952.7 | 2760.7 / 2817.7 | **2129.9 / 2237.0** | 2312.0 / 2433.8 |
| append 1,000 rows | 328.0 / 344.3 | 332.6 / 349.5 | 329.6 / 347.6 | 328.1 / 336.7 | **271.8 / 277.7** | 297.6 / 308.5 |
| clear 1,000 rows | 35.7 / 38.0 | 35.8 / 38.0 | 35.8 / 38.3 | 34.9 / 35.9 | **22.1 / 23.1** | 23.2 / 28.4 |
| geometric mean of slowdown vs fastest | 1.33 | 1.37 | 1.33 | 1.32 | 1.06 | 1.06 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-noeffect | gyral-twotrack | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 55.3 / 188.2 / 47.2 / 3.6 | 59.3 / 187.2 / 48.5 / 4.4 | 55.8 / 184.3 / 46.6 / 3.7 | 63.0 / 175.5 / 47.6 / 3.7 | 31.5 / 172.5 / 41.5 / 2.2 | 50.8 / 168.8 / 42.7 / 2.0 |
| replace 1,000 rows | 85.1 / 172.3 / 48.9 / 3.8 | 87.5 / 178.9 / 48.9 / 3.5 | 86.4 / 172.8 / 47.1 / 3.7 | 86.3 / 169.5 / 47.1 / 3.3 | 52.1 / 161.6 / 42.5 / 2.2 | 69.7 / 160.2 / 41.3 / 2.0 |
| update every 10th row | 4.7 / 42.9 / 27.2 / 2.5 | 4.2 / 43.0 / 26.6 / 2.5 | 4.5 / 41.8 / 26.1 / 2.3 | 3.6 / 41.8 / 26.9 / 2.4 | 5.0 / 40.1 / 24.6 / 1.7 | 3.0 / 40.4 / 26.1 / 1.4 |
| select row | 2.6 / 0.0 / 5.9 / 5.8 | 2.8 / 0.0 / 6.2 / 6.5 | 3.0 / 0.0 / 6.3 / 5.5 | 2.5 / 0.0 / 6.3 / 6.0 | 4.7 / 0.0 / 6.3 / 1.0 | 0.8 / 0.0 / 5.8 / 0.9 |
| swap rows | 2.8 / 15.7 / 20.9 / 2.0 | 3.0 / 16.5 / 22.3 / 2.0 | 3.1 / 15.0 / 20.7 / 2.1 | 2.6 / 15.9 / 22.3 / 2.3 | 2.8 / 13.1 / 11.9 / 1.6 | 7.8 / 13.0 / 11.8 / 1.5 |
| remove row | 4.2 / 13.7 / 30.9 / 2.7 | 4.3 / 13.5 / 30.1 / 2.2 | 4.1 / 13.4 / 30.4 / 2.2 | 4.1 / 13.4 / 30.0 / 2.2 | 2.7 / 11.2 / 26.3 / 1.9 | 7.1 / 11.3 / 26.3 / 1.4 |
| create 10,000 rows | 577.8 / 1786.1 / 392.0 / 11.9 | 573.9 / 1779.3 / 393.5 / 12.2 | 578.2 / 1784.7 / 390.8 / 12.1 | 585.1 / 1805.5 / 364.1 / 11.5 | 266.4 / 1562.5 / 299.9 / 4.1 | 407.8 / 1591.3 / 301.2 / 4.2 |
| append 1,000 rows | 53.9 / 204.2 / 66.5 / 4.4 | 54.1 / 205.4 / 67.9 / 4.7 | 54.5 / 202.1 / 67.5 / 4.5 | 55.4 / 202.1 / 66.4 / 4.1 | 30.4 / 186.5 / 53.0 / 1.9 | 55.5 / 185.8 / 53.1 / 1.6 |
| clear 1,000 rows | 31.3 / 0.5 / 2.1 / 1.9 | 31.9 / 0.5 / 1.8 / 2.1 | 31.6 / 0.5 / 1.9 / 1.9 | 31.0 / 0.1 / 2.0 / 1.9 | 18.9 / 0.2 / 2.2 / 0.7 | 20.3 / 0.1 / 1.9 / 1.0 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-noeffect | gyral-twotrack | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.36 | 1.24 | 1.24 | 1.20 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.19 | 2.06 | 2.06 | 1.98 | 2.48 | 3.12 |
| after clearing them | 1.51 | 1.39 | 1.38 | 1.30 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-noeffect | gyral-twotrack | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 475 / 477 | 393 / 395 | 400 / 401 | 369 / 370 | 407 / 408 | 366 / 367 |
| first todo added (interactive) | 517 / 520 | 433 / 435 | 440 / 441 | 407 / 408 | 448 / 450 | 406 / 406 |
