# Benchmark results, 2026-10-05 (whitespace)

> **Variant run: whitespace.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit e40a86d-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 7.8% (limit 5%), max 1-min load 5.66 **FLAGGED (speed drifted): compare frameworks within this run only.**

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
- **gyral-ws**: @gyral/core-ws 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-ws | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| floor | 24.0 | 25.1 | 5.8 | 9.0 | 3.7 |
| counter | 24.1 | 25.2 | 5.8 | 9.9 | 4.3 |
| todo | 25.8 | 26.9 | 7.3 | 14.2 | 6.6 |
| search | 26.4 | 27.5 | 6.6 | 13.8 | 5.9 |
| form | 25.3 | 26.4 | 6.4 | 14.4 | 6.9 |
| table | 25.9 | 27.0 | 7.5 | 13.5 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-ws | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| floor | 21.7 | 22.7 | 5.2 | 8.2 | 3.4 |
| counter | 21.7 | 22.8 | 5.3 | 9.1 | 3.9 |
| todo | 23.2 | 24.2 | 6.6 | 12.9 | 6.0 |
| search | 23.7 | 24.7 | 6.0 | 12.6 | 5.3 |
| form | 22.8 | 23.8 | 5.8 | 13.1 | 6.3 |
| table | 23.3 | 24.3 | 6.8 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-ws | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| floor | 68.0 | 70.5 | 15.0 | 22.3 | 9.5 |
| counter | 68.3 | 70.8 | 15.2 | 24.9 | 10.8 |
| todo | 72.7 | 75.2 | 19.2 | 36.1 | 16.9 |
| search | 73.6 | 76.1 | 16.9 | 35.1 | 14.2 |
| form | 71.3 | 73.8 | 16.9 | 37.2 | 17.8 |
| table | 72.8 | 75.2 | 19.5 | 34.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-ws | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| floor | 24.3 | 25.4 | 6.0 | 9.2 | 4.0 |
| counter | 24.4 | 25.5 | 6.1 | 10.1 | 4.5 |
| todo | 26.1 | 27.2 | 7.5 | 14.4 | 6.8 |
| search | 26.6 | 27.7 | 6.8 | 14.1 | 6.1 |
| form | 25.5 | 26.6 | 6.7 | 14.6 | 7.2 |
| table | 26.1 | 27.2 | 7.7 | 13.7 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-ws | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 260.0 / 276.9 | 232.4 / 244.0 | 267.5 / 282.0 | **213.1 / 225.7** | 231.8 / 252.6 |
| replace 1,000 rows | 337.4 / 406.7 | 280.9 / 307.4 | 333.0 / 360.5 | **266.9 / 299.6** | 280.6 / 382.8 |
| update every 10th row | 76.0 / 82.7 | 74.9 / 80.6 | 72.8 / 84.5 | 72.7 / 88.3 | **69.9 / 80.7** |
| select row | 13.1 / 15.2 | 16.2 / 17.5 | **12.9 / 15.5** | 15.4 / 20.9 | 15.4 / 19.9 |
| swap rows | 41.3 / 58.4 | 38.3 / 70.4 | 42.4 / 85.9 | **29.1 / 61.3** | 33.8 / 64.6 |
| remove row | 58.2 / 69.2 | 53.0 / 56.7 | 59.4 / 72.7 | **51.5 / 55.8** | 57.0 / 63.5 |
| create 10,000 rows | 2778.1 / 2837.2 | 2367.2 / 2405.8 | 2780.1 / 2890.6 | **2131.7 / 2210.4** | 2280.0 / 2343.5 |
| append 1,000 rows | 329.2 / 359.4 | 298.8 / 317.0 | 330.1 / 345.3 | **270.3 / 289.8** | 296.8 / 315.9 |
| clear 1,000 rows | 35.8 / 37.5 | 27.8 / 32.8 | 35.1 / 35.9 | **21.8 / 23.1** | 23.5 / 24.6 |
| geometric mean of slowdown vs fastest | 1.24 | 1.14 | 1.24 | 1.02 | 1.09 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-ws | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 51.6 / 165.2 / 40.4 / 3.1 | 41.2 / 151.9 / 35.1 / 3.1 | 56.0 / 164.0 / 42.1 / 3.3 | 28.2 / 149.2 / 33.5 / 1.8 | 47.2 / 148.8 / 34.2 / 1.5 |
| replace 1,000 rows | 94.0 / 182.7 / 49.5 / 3.9 | 66.2 / 167.6 / 43.9 / 3.4 | 93.2 / 180.6 / 49.0 / 3.8 | 53.9 / 163.3 / 43.7 / 1.7 | 70.5 / 163.5 / 42.7 / 2.1 |
| update every 10th row | 4.6 / 42.0 / 25.9 / 2.5 | 4.4 / 42.4 / 25.0 / 2.0 | 3.6 / 41.2 / 25.8 / 2.1 | 4.7 / 41.0 / 24.8 / 1.5 | 3.2 / 41.0 / 24.7 / 1.6 |
| select row | 3.2 / 0.0 / 7.1 / 2.4 | 3.1 / 0.0 / 7.5 / 5.5 | 2.6 / 0.0 / 7.5 / 2.6 | 5.2 / 0.0 / 6.5 / 3.3 | 0.9 / 0.0 / 6.8 / 8.5 |
| swap rows | 2.9 / 15.3 / 20.9 / 2.1 | 3.0 / 14.1 / 19.2 / 1.8 | 2.8 / 16.3 / 21.5 / 2.5 | 2.8 / 13.0 / 11.9 / 1.5 | 7.6 / 12.7 / 11.7 / 1.4 |
| remove row | 4.8 / 16.4 / 35.7 / 3.1 | 4.5 / 14.2 / 31.9 / 2.8 | 4.5 / 16.9 / 34.8 / 3.9 | 3.2 / 13.0 / 32.3 / 2.0 | 7.8 / 13.5 / 32.2 / 2.1 |
| create 10,000 rows | 588.4 / 1764.8 / 396.5 / 11.9 | 422.2 / 1625.8 / 313.3 / 6.8 | 599.1 / 1801.1 / 367.8 / 11.7 | 267.7 / 1554.5 / 303.9 / 4.3 | 405.9 / 1567.8 / 305.5 / 4.2 |
| append 1,000 rows | 55.7 / 203.3 / 67.7 / 4.2 | 46.3 / 190.7 / 59.1 / 3.5 | 55.5 / 201.8 / 67.2 / 4.3 | 30.2 / 184.2 / 54.0 / 1.8 | 55.1 / 185.2 / 53.3 / 2.0 |
| clear 1,000 rows | 31.4 / 0.5 / 2.1 / 1.9 | 23.9 / 0.6 / 2.1 / 1.8 | 30.9 / 0.2 / 2.2 / 1.5 | 18.8 / 0.3 / 2.0 / 0.8 | 20.3 / 0.4 / 1.9 / 0.8 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-ws | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| after load | 1.36 | 1.39 | 1.20 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.19 | 2.20 | 1.98 | 2.48 | 3.11 |
| after clearing them | 1.51 | 1.54 | 1.30 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-ws | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| input rendered | 475 / 478 | 478 / 489 | 369 / 370 | 407 / 408 | 366 / 367 |
| first todo added (interactive) | 515 / 522 | 519 / 534 | 407 / 408 | 448 / 450 | 406 / 407 |
