# Benchmark results, 2026-10-12 (full)

> **Variant run: full.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 156.0.8078.4 (Playwright 1.64.0), headless
- Node v24.15.0, Vite 8.3.4; commit 09296f2
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 5.6% (limit 5%), max 1-min load 6.21 **FLAGGED (speed drifted, machine busy): compare frameworks within this run only.**

Framework versions:

- **gyral**: @gyral/core 0.3.1, @gyral/time 0.3.1
- **gyral-0.3.0**: @gyral/core 0.3.0, @gyral/time 0.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0
- **react**: react 19.3.0, react-dom 19.3.0
- **preact**: preact 11.0.1
- **vue**: vue 3.5.43
- **svelte**: svelte 5.57.2
- **solid**: solid-js 1.9.17

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-0.3.0 | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 7.9 | 11.7 | 5.8 | 66.1 | 4.8 | 23.0 | 9.0 | 3.7 |
| counter | 8.0 | 11.8 | 5.8 | 66.2 | 5.7 | 23.4 | 10.0 | 4.3 |
| todo | 9.9 | 13.6 | 7.3 | 66.6 | 6.1 | 25.0 | 14.2 | 6.6 |
| search | 11.1 | 15.1 | 6.6 | 67.0 | 6.6 | 25.1 | 13.9 | 5.9 |
| form | 8.7 | 12.5 | 6.4 | 66.8 | 6.3 | 25.8 | 14.5 | 7.0 |
| table | 10.2 | 14.0 | 7.5 | 67.1 | 6.5 | 24.4 | 13.6 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-0.3.0 | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 7.2 | 10.5 | 5.2 | 57.0 | 4.3 | 21.0 | 8.2 | 3.4 |
| counter | 7.3 | 10.6 | 5.3 | 57.0 | 5.2 | 21.3 | 9.1 | 3.9 |
| todo | 9.0 | 12.3 | 6.6 | 57.3 | 5.5 | 22.8 | 12.9 | 6.0 |
| search | 10.2 | 13.7 | 6.0 | 57.7 | 6.0 | 22.9 | 12.7 | 5.4 |
| form | 7.9 | 11.2 | 5.8 | 57.5 | 5.7 | 23.5 | 13.1 | 6.3 |
| table | 9.3 | 12.6 | 6.8 | 57.9 | 5.9 | 22.2 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-0.3.0 | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 20.9 | 29.0 | 15.0 | 214.4 | 11.1 | 59.0 | 22.4 | 9.5 |
| counter | 21.2 | 29.3 | 15.2 | 214.7 | 13.5 | 60.0 | 25.0 | 10.8 |
| todo | 26.2 | 34.2 | 19.2 | 215.6 | 14.3 | 64.2 | 36.3 | 16.9 |
| search | 29.2 | 38.2 | 16.9 | 216.2 | 15.2 | 64.0 | 35.3 | 14.2 |
| form | 22.8 | 31.0 | 16.9 | 216.1 | 15.0 | 66.5 | 37.4 | 17.8 |
| table | 27.0 | 35.1 | 19.5 | 217.2 | 15.8 | 62.6 | 34.4 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-0.3.0 | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 8.1 | 11.9 | 6.0 | 66.3 | 5.0 | 23.2 | 9.2 | 4.0 |
| counter | 8.2 | 12.0 | 6.1 | 66.4 | 6.0 | 23.6 | 10.2 | 4.5 |
| todo | 10.1 | 13.9 | 7.5 | 66.8 | 6.3 | 25.3 | 14.5 | 6.8 |
| search | 11.4 | 15.3 | 6.8 | 67.2 | 6.8 | 25.3 | 14.1 | 6.1 |
| form | 8.9 | 12.7 | 6.7 | 67.0 | 6.5 | 26.0 | 14.7 | 7.2 |
| table | 10.5 | 14.2 | 7.7 | 67.3 | 6.8 | 24.6 | 13.8 | 7.4 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-0.3.0 | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 233.5 / 261.0 | 233.4 / 253.8 | 269.5 / 283.9 | 252.4 / 268.7 | 254.6 / 281.1 | 245.4 / 261.3 | **230.0 / 246.0** | 247.9 / 256.4 |
| replace 1,000 rows | 249.6 / 274.8 | 252.5 / 273.0 | 296.7 / 338.1 | 289.8 / 315.2 | 282.7 / 315.1 | 263.9 / 286.2 | **246.9 / 266.1** | 266.3 / 291.6 |
| update every 10th row | 75.3 / 89.4 | **75.1 / 93.1** | 81.3 / 93.1 | 78.5 / 91.5 | 90.2 / 106.2 | 85.1 / 92.6 | 78.5 / 91.5 | 78.0 / 89.3 |
| select row | 13.7 / 17.6 | 11.4 / 19.1 | 13.7 / 16.9 | 12.7 / 14.5 | 26.1 / 29.2 | 15.5 / 18.8 | 15.4 / 18.7 | **8.7 / 18.7** |
| swap rows | 30.4 / 35.0 | 30.0 / 34.5 | 47.1 / 60.8 | 234.6 / 248.2 | 48.7 / 53.5 | 29.4 / 35.0 | **28.7 / 40.8** | 35.2 / 41.5 |
| remove row | **45.6 / 48.1** | **45.6 / 50.2** | 53.6 / 62.6 | 51.9 / 64.0 | 66.8 / 72.9 | 54.6 / 68.6 | 46.4 / 54.5 | 49.5 / 56.4 |
| create 10,000 rows | 2274.4 / 2353.5 | 2345.9 / 2491.9 | 2715.3 / 2858.4 | 3122.5 / 3366.2 | 2550.9 / 2644.4 | 2423.2 / 2485.3 | **2234.5 / 2311.3** | 2426.3 / 2599.8 |
| append 1,000 rows | 296.5 / 327.6 | **293.8 / 359.1** | 349.0 / 390.0 | 324.9 / 348.5 | 345.9 / 394.8 | 304.0 / 346.9 | 297.3 / 324.2 | 310.6 / 339.6 |
| clear 1,000 rows | **21.2 / 22.9** | 21.5 / 28.1 | 32.8 / 36.5 | 31.2 / 35.2 | 24.3 / 27.6 | 28.1 / 34.0 | 22.3 / 25.4 | 23.6 / 26.0 |
| geometric mean of slowdown vs fastest | 1.07 | 1.05 | 1.30 | 1.51 | 1.37 | 1.17 | 1.08 | 1.08 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-0.3.0 | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 30.9 / 161.6 / 39.0 / 1.5 | 30.6 / 159.2 / 39.2 / 1.5 | 48.4 / 175.0 / 45.1 / 3.3 | 53.5 / 158.2 / 39.9 / 1.9 | 56.1 / 156.6 / 38.6 / 1.6 | 43.8 / 160.3 / 38.4 / 3.1 | 30.6 / 157.8 / 38.9 / 1.7 | 47.2 / 158.3 / 38.8 / 1.8 |
| replace 1,000 rows | 48.2 / 157.8 / 40.5 / 1.9 | 48.1 / 160.0 / 39.9 / 1.8 | 74.0 / 171.3 / 47.2 / 3.6 | 86.8 / 160.8 / 42.1 / 1.8 | 83.2 / 157.4 / 41.0 / 1.8 | 64.1 / 156.8 / 40.0 / 2.9 | 49.0 / 153.3 / 40.8 / 1.5 | 66.6 / 153.9 / 39.8 / 2.2 |
| update every 10th row | 3.5 / 42.3 / 27.6 / 1.8 | 3.1 / 43.2 / 27.6 / 1.9 | 3.9 / 45.4 / 29.4 / 2.8 | 8.1 / 41.4 / 27.9 / 1.6 | 17.5 / 42.9 / 28.7 / 1.6 | 4.6 / 46.7 / 29.5 / 1.9 | 5.3 / 43.8 / 28.1 / 1.8 | 3.3 / 42.8 / 27.7 / 2.1 |
| select row | 2.2 / 0.0 / 6.4 / 4.6 | 1.7 / 0.0 / 6.7 / 1.3 | 2.5 / 0.0 / 6.0 / 3.4 | 3.7 / 0.0 / 6.3 / 2.1 | 17.3 / 0.0 / 7.3 / 1.1 | 1.9 / 0.0 / 6.4 / 7.3 | 4.9 / 0.0 / 6.2 / 3.7 | 0.9 / 0.0 / 6.0 / 1.7 |
| swap rows | 2.6 / 13.4 / 13.2 / 1.4 | 2.4 / 13.5 / 12.9 / 1.4 | 2.6 / 17.2 / 23.9 / 2.4 | 37.1 / 151.0 / 41.8 / 2.0 | 18.4 / 14.6 / 12.8 / 1.2 | 2.3 / 13.7 / 12.4 / 1.3 | 3.1 / 12.4 / 12.1 / 1.3 | 7.6 / 13.3 / 13.1 / 1.6 |
| remove row | 2.8 / 11.8 / 29.2 / 1.7 | 2.5 / 12.1 / 28.8 / 1.8 | 4.4 / 16.2 / 32.9 / 2.5 | 6.9 / 12.7 / 30.4 / 2.1 | 18.0 / 13.4 / 30.7 / 1.7 | 11.5 / 11.6 / 29.0 / 3.5 | 2.9 / 12.0 / 30.1 / 2.0 | 7.3 / 12.0 / 28.6 / 1.6 |
| create 10,000 rows | 299.1 / 1637.8 / 312.2 / 4.7 | 305.0 / 1675.0 / 323.2 / 4.7 | 470.7 / 1835.0 / 390.5 / 12.0 | 1103.3 / 1712.1 / 318.4 / 5.4 | 549.7 / 1686.8 / 307.3 / 4.3 | 396.6 / 1681.1 / 313.1 / 5.3 | 283.5 / 1614.1 / 313.6 / 4.4 | 427.2 / 1655.1 / 330.1 / 4.5 |
| append 1,000 rows | 33.0 / 196.7 / 61.0 / 2.2 | 33.7 / 198.7 / 59.6 / 2.0 | 50.4 / 214.5 / 77.1 / 4.7 | 57.4 / 200.0 / 62.0 / 2.1 | 85.8 / 193.6 / 59.3 / 2.1 | 43.9 / 197.3 / 59.9 / 3.1 | 32.4 / 196.3 / 58.2 / 1.8 | 59.3 / 193.8 / 59.1 / 2.3 |
| clear 1,000 rows | 17.2 / 0.5 / 2.1 / 1.0 | 17.6 / 0.6 / 2.4 / 1.0 | 28.4 / 0.7 / 2.4 / 1.7 | 27.9 / 0.5 / 2.0 / 1.0 | 20.8 / 0.4 / 2.3 / 1.0 | 23.6 / 0.5 / 2.4 / 1.8 | 18.8 / 0.4 / 2.1 / 0.9 | 20.2 / 0.4 / 2.0 / 1.0 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-0.3.0 | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.22 | 1.22 | 1.23 | 1.58 | 1.21 | 1.36 | 1.23 | 1.16 |
| after creating 1,000 rows | 2.17 | 2.17 | 2.02 | 3.32 | 2.84 | 3.05 | 2.52 | 3.15 |
| after clearing them | 1.44 | 1.44 | 1.34 | 2.18 | 1.30 | 1.56 | 1.50 | 1.37 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-0.3.0 | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 388 / 392 | 388 / 397 | 371 / 381 | 696 / 710 | 359 / 367 | 464 / 476 | 413 / 425 | 372 / 382 |
| first todo added (interactive) | 438 / 444 | 436 / 447 | 419 / 433 | 752 / 783 | 406 / 418 | 516 / 531 | 463 / 485 | 421 / 432 |
