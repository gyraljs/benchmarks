# Benchmark results, 2026-10-06 (release-0.2.0-a1)

> **Variant run: release-0.2.0-a1.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit e40a86d-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 5.3% (limit 5%), max 1-min load 8.04 **FLAGGED (speed drifted, machine busy): compare frameworks within this run only.**

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, effect none, lit 3.3.3, lit-html 3.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0
- **react**: react 19.3.0, react-dom 19.3.0
- **preact**: preact 11.0.0
- **vue**: vue 3.5.43
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 11.9 | 5.8 | 66.1 | 4.7 | 23.0 | 9.0 | 3.7 |
| counter | 12.0 | 5.8 | 66.2 | 5.7 | 23.4 | 9.9 | 4.3 |
| todo | 13.6 | 7.3 | 66.6 | 6.1 | 25.0 | 14.2 | 6.6 |
| search | 14.1 | 6.6 | 67.0 | 6.5 | 25.1 | 13.8 | 5.9 |
| form | 13.1 | 6.4 | 66.8 | 6.2 | 25.8 | 14.4 | 6.9 |
| table | 13.7 | 7.5 | 67.1 | 6.5 | 24.4 | 13.5 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 10.8 | 5.2 | 57.0 | 4.3 | 21.0 | 8.2 | 3.4 |
| counter | 10.8 | 5.3 | 57.0 | 5.2 | 21.3 | 9.1 | 3.9 |
| todo | 12.3 | 6.6 | 57.3 | 5.5 | 22.8 | 12.9 | 6.0 |
| search | 12.8 | 6.0 | 57.7 | 6.0 | 22.9 | 12.6 | 5.3 |
| form | 11.8 | 5.8 | 57.5 | 5.6 | 23.5 | 13.1 | 6.3 |
| table | 12.4 | 6.8 | 57.9 | 5.9 | 22.2 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 32.2 | 15.0 | 214.4 | 11.1 | 59.0 | 22.3 | 9.5 |
| counter | 32.5 | 15.2 | 214.7 | 13.5 | 60.0 | 24.9 | 10.8 |
| todo | 36.9 | 19.2 | 215.6 | 14.2 | 64.2 | 36.1 | 16.9 |
| search | 37.7 | 16.9 | 216.2 | 15.1 | 64.0 | 35.1 | 14.2 |
| form | 35.5 | 16.9 | 216.1 | 14.9 | 66.5 | 37.2 | 17.8 |
| table | 36.9 | 19.5 | 217.2 | 15.7 | 62.6 | 34.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 12.1 | 6.0 | 66.3 | 5.0 | 23.2 | 9.2 | 4.0 |
| counter | 12.2 | 6.1 | 66.4 | 5.9 | 23.6 | 10.1 | 4.5 |
| todo | 13.8 | 7.5 | 66.8 | 6.3 | 25.3 | 14.4 | 6.8 |
| search | 14.4 | 6.8 | 67.2 | 6.7 | 25.3 | 14.1 | 6.1 |
| form | 13.3 | 6.7 | 67.0 | 6.5 | 26.0 | 14.6 | 7.2 |
| table | 13.9 | 7.7 | 67.3 | 6.7 | 24.6 | 13.7 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 238.4 / 252.5 | 274.2 / 321.1 | 252.7 / 261.3 | 252.1 / 312.9 | 241.6 / 287.6 | **223.2 / 239.7** | 242.1 / 274.4 |
| replace 1,000 rows | 262.9 / 302.6 | 302.3 / 322.2 | 284.0 / 312.4 | 288.2 / 304.5 | 274.4 / 298.8 | **244.9 / 258.0** | 261.4 / 271.1 |
| update every 10th row | 74.8 / 84.4 | 76.8 / 82.4 | 78.0 / 85.1 | 88.0 / 96.5 | 74.3 / 90.9 | 76.7 / 87.2 | **70.5 / 94.3** |
| select row | 17.2 / 18.5 | 14.8 / 16.3 | 13.9 / 15.0 | 26.1 / 29.2 | 17.6 / 18.8 | 12.0 / 14.3 | **7.8 / 18.2** |
| swap rows | 34.2 / 36.9 | 38.5 / 43.0 | 217.9 / 223.1 | 42.8 / 51.0 | **26.1 / 33.3** | 27.0 / 29.2 | 31.4 / 32.5 |
| remove row | 45.3 / 51.2 | 50.4 / 56.1 | 47.8 / 60.0 | 61.1 / 79.0 | 53.0 / 62.0 | **43.7 / 52.3** | 48.6 / 54.7 |
| create 10,000 rows | 2447.1 / 3311.8 | 2903.6 / 3141.9 | 3188.3 / 3428.1 | 2632.0 / 3013.3 | 2487.7 / 3097.0 | **2209.4 / 2344.3** | 2372.7 / 2762.6 |
| append 1,000 rows | 320.8 / 353.9 | 358.7 / 398.5 | 326.1 / 344.2 | 349.7 / 375.1 | 312.8 / 347.3 | **289.3 / 311.2** | 316.9 / 326.2 |
| clear 1,000 rows | 29.7 / 34.6 | 36.3 / 46.6 | 32.9 / 39.7 | 27.2 / 44.5 | 29.9 / 64.2 | **23.1 / 36.6** | 24.5 / 40.6 |
| geometric mean of slowdown vs fastest | 1.22 | 1.34 | 1.56 | 1.41 | 1.21 | 1.06 | 1.08 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 41.3 / 156.6 / 38.1 / 2.9 | 57.7 / 169.0 / 44.2 / 3.3 | 56.8 / 156.5 / 37.5 / 1.9 | 59.7 / 152.1 / 38.3 / 1.7 | 47.7 / 153.6 / 37.1 / 3.0 | 28.9 / 155.4 / 37.4 / 1.8 | 47.4 / 156.1 / 38.2 / 1.7 |
| replace 1,000 rows | 61.9 / 156.9 / 40.0 / 3.1 | 85.9 / 167.0 / 46.2 / 3.6 | 88.1 / 155.2 / 40.0 / 1.3 | 88.8 / 155.2 / 40.5 / 1.6 | 67.7 / 156.5 / 40.8 / 3.0 | 50.1 / 152.9 / 39.6 / 1.9 | 67.3 / 152.5 / 38.5 / 1.6 |
| update every 10th row | 4.3 / 41.7 / 27.4 / 1.7 | 3.7 / 42.8 / 28.1 / 2.3 | 7.3 / 41.8 / 27.0 / 1.8 | 18.2 / 41.6 / 26.9 / 1.4 | 4.4 / 41.2 / 26.5 / 1.6 | 5.0 / 42.0 / 27.3 / 1.3 | 3.0 / 40.9 / 25.9 / 1.2 |
| select row | 2.9 / 0.0 / 6.4 / 7.5 | 2.3 / 0.0 / 6.3 / 6.6 | 3.6 / 0.0 / 6.0 / 4.4 | 18.2 / 0.0 / 6.4 / 0.9 | 2.2 / 0.0 / 6.1 / 9.2 | 4.7 / 0.0 / 6.0 / 1.3 | 0.7 / 0.0 / 6.1 / 0.8 |
| swap rows | 2.8 / 12.7 / 16.9 / 1.4 | 2.6 / 14.8 / 19.4 / 2.0 | 36.0 / 141.6 / 38.8 / 1.7 | 18.2 / 12.4 / 11.3 / 1.1 | 2.0 / 11.8 / 10.8 / 1.6 | 2.7 / 12.2 / 11.1 / 1.3 | 7.4 / 11.8 / 10.9 / 1.4 |
| remove row | 4.2 / 12.1 / 27.9 / 1.7 | 3.7 / 13.9 / 31.1 / 2.4 | 6.2 / 11.9 / 28.3 / 1.5 | 18.9 / 12.4 / 27.8 / 1.7 | 10.2 / 11.6 / 27.5 / 2.9 | 2.8 / 11.6 / 27.8 / 1.5 | 7.5 / 11.7 / 28.1 / 1.7 |
| create 10,000 rows | 424.9 / 1669.4 / 334.6 / 7.7 | 630.2 / 1872.8 / 398.1 / 12.4 | 1126.0 / 1700.4 / 329.2 / 5.3 | 593.2 / 1694.8 / 320.1 / 4.6 | 447.4 / 1716.9 / 328.3 / 6.1 | 274.5 / 1603.4 / 316.4 / 4.7 | 421.3 / 1624.0 / 330.0 / 5.3 |
| append 1,000 rows | 46.7 / 202.4 / 66.1 / 3.4 | 59.0 / 214.4 / 76.4 / 4.7 | 63.0 / 200.9 / 60.6 / 2.2 | 88.4 / 199.3 / 60.3 / 1.9 | 49.1 / 198.6 / 60.0 / 3.3 | 32.9 / 193.5 / 57.7 / 2.0 | 57.5 / 196.8 / 59.6 / 2.0 |
| clear 1,000 rows | 25.3 / 0.5 / 2.4 / 2.1 | 31.9 / 0.5 / 2.2 / 1.9 | 29.8 / 0.5 / 2.0 / 0.9 | 24.0 / 0.3 / 2.2 / 1.1 | 25.4 / 0.6 / 2.6 / 1.9 | 19.8 / 0.2 / 2.0 / 0.8 | 21.0 / 0.3 / 1.8 / 1.5 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.26 | 1.20 | 1.55 | 1.17 | 1.32 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.05 | 1.98 | 3.28 | 2.79 | 3.01 | 2.48 | 3.11 |
| after clearing them | 1.41 | 1.30 | 2.14 | 1.27 | 1.53 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 402 / 404 | 369 / 371 | 685 / 690 | 358 / 359 | 458 / 460 | 408 / 409 | 366 / 367 |
| first todo added (interactive) | 443 / 451 | 408 / 412 | 738 / 746 | 399 / 401 | 502 / 506 | 450 / 452 | 407 / 411 |
