# Benchmark results, 2026-10-06 (release-0.2.0-a2)

> **Variant run: release-0.2.0-a2.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit e40a86d-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 22.1% (limit 5%), max 1-min load 6.49 **FLAGGED (speed drifted, machine busy): compare frameworks within this run only.**

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
| create 1,000 rows | 244.3 / 360.1 | 274.3 / 317.1 | 252.9 / 435.7 | 254.9 / 268.7 | 240.2 / 324.4 | **219.5 / 308.7** | 245.3 / 287.7 |
| replace 1,000 rows | 261.3 / 275.1 | 303.7 / 314.1 | 288.1 / 298.2 | 285.0 / 294.8 | 268.6 / 281.2 | **245.1 / 257.4** | 262.3 / 284.2 |
| update every 10th row | 72.5 / 76.8 | 74.0 / 86.6 | 73.7 / 78.9 | 86.4 / 90.3 | 71.8 / 79.1 | 71.5 / 84.7 | **71.3 / 74.3** |
| select row | 15.7 / 17.9 | 13.7 / 15.4 | 13.6 / 14.8 | 26.2 / 36.2 | 16.6 / 17.7 | 12.2 / 18.7 | **10.3 / 18.3** |
| swap rows | 41.8 / 71.3 | 44.2 / 100.0 | 254.1 / 374.1 | 47.5 / 94.3 | **31.1 / 72.0** | 32.3 / 47.6 | 38.9 / 75.8 |
| remove row | 62.2 / 94.7 | 67.3 / 89.8 | 63.3 / 89.0 | 88.2 / 127.0 | 65.4 / 98.2 | 68.4 / 90.8 | **60.9 / 101.3** |
| create 10,000 rows | 2605.7 / 3041.7 | 2979.4 / 3239.4 | 3276.5 / 3530.6 | 2804.5 / 3032.1 | 2574.2 / 2698.3 | **2322.8 / 2442.6** | 2473.3 / 2683.3 |
| append 1,000 rows | 311.8 / 363.3 | 345.6 / 381.1 | 317.7 / 330.5 | 346.2 / 365.3 | 306.1 / 339.3 | **285.0 / 296.7** | 310.4 / 345.2 |
| clear 1,000 rows | 29.4 / 51.9 | 37.1 / 48.0 | 33.8 / 58.7 | 27.7 / 37.1 | 30.8 / 57.1 | **23.8 / 49.1** | 24.9 / 42.4 |
| geometric mean of slowdown vs fastest | 1.16 | 1.26 | 1.48 | 1.36 | 1.14 | 1.04 | 1.07 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 41.8 / 160.7 / 39.4 / 3.3 | 59.0 / 170.9 / 42.7 / 3.1 | 57.9 / 157.2 / 37.0 / 1.7 | 59.4 / 158.9 / 36.8 / 1.7 | 48.0 / 155.0 / 37.1 / 2.7 | 28.7 / 154.9 / 37.3 / 1.9 | 47.1 / 156.4 / 39.1 / 1.7 |
| replace 1,000 rows | 62.6 / 156.6 / 39.7 / 3.0 | 86.7 / 168.6 / 44.8 / 3.3 | 89.0 / 157.1 / 38.7 / 1.9 | 87.2 / 158.1 / 37.8 / 1.5 | 67.3 / 159.9 / 39.9 / 3.0 | 49.6 / 155.3 / 38.8 / 1.4 | 68.6 / 156.7 / 38.0 / 1.2 |
| update every 10th row | 4.1 / 40.8 / 24.4 / 1.9 | 3.8 / 41.7 / 27.2 / 2.1 | 6.9 / 40.6 / 24.0 / 1.2 | 18.1 / 40.1 / 25.6 / 1.6 | 4.2 / 40.6 / 25.1 / 1.5 | 4.7 / 40.9 / 25.8 / 1.6 | 3.0 / 41.3 / 25.1 / 1.1 |
| select row | 3.1 / 0.0 / 6.5 / 7.0 | 2.1 / 0.0 / 6.6 / 4.9 | 3.8 / 0.0 / 6.2 / 2.9 | 18.6 / 0.0 / 6.4 / 1.2 | 2.2 / 0.0 / 6.3 / 7.1 | 4.8 / 0.0 / 6.3 / 1.3 | 0.9 / 0.0 / 6.2 / 1.9 |
| swap rows | 3.1 / 15.8 / 21.6 / 2.1 | 2.7 / 16.3 / 23.6 / 2.3 | 40.0 / 158.5 / 50.4 / 2.0 | 18.8 / 13.9 / 11.4 / 1.7 | 2.5 / 14.9 / 12.4 / 1.7 | 3.0 / 14.2 / 13.7 / 1.4 | 8.0 / 13.8 / 13.4 / 1.9 |
| remove row | 6.4 / 19.3 / 34.5 / 3.9 | 5.6 / 19.6 / 38.2 / 4.3 | 10.0 / 15.3 / 37.4 / 2.5 | 29.6 / 17.9 / 40.7 / 2.8 | 16.2 / 14.6 / 35.0 / 3.9 | 4.2 / 20.4 / 37.1 / 2.7 | 8.6 / 15.3 / 35.9 / 2.7 |
| create 10,000 rows | 446.6 / 1771.8 / 344.9 / 7.8 | 626.9 / 1910.3 / 413.9 / 12.7 | 1193.7 / 1780.9 / 330.3 / 5.6 | 625.1 / 1802.2 / 346.0 / 5.0 | 469.6 / 1763.2 / 329.3 / 6.1 | 295.3 / 1672.7 / 333.2 / 5.3 | 446.2 / 1667.0 / 325.5 / 4.7 |
| append 1,000 rows | 47.6 / 197.4 / 62.0 / 3.9 | 57.9 / 211.7 / 73.2 / 4.9 | 59.5 / 196.0 / 58.4 / 1.9 | 87.6 / 194.6 / 58.8 / 2.1 | 48.0 / 197.8 / 57.9 / 3.3 | 31.9 / 193.6 / 56.5 / 2.0 | 56.9 / 192.1 / 57.8 / 1.9 |
| clear 1,000 rows | 24.5 / 0.7 / 2.1 / 1.9 | 32.6 / 0.7 / 2.1 / 2.0 | 30.3 / 0.4 / 2.3 / 1.0 | 23.4 / 0.1 / 2.4 / 1.1 | 25.8 / 0.5 / 2.4 / 2.6 | 20.4 / 0.5 / 2.1 / 1.0 | 21.5 / 0.3 / 2.3 / 1.1 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.26 | 1.20 | 1.55 | 1.17 | 1.32 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.05 | 1.98 | 3.28 | 2.79 | 3.01 | 2.48 | 3.12 |
| after clearing them | 1.41 | 1.30 | 2.14 | 1.27 | 1.53 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 402 / 409 | 370 / 375 | 686 / 700 | 357 / 364 | 458 / 471 | 409 / 415 | 366 / 367 |
| first todo added (interactive) | 443 / 451 | 409 / 418 | 737 / 763 | 399 / 411 | 502 / 520 | 451 / 463 | 407 / 417 |
