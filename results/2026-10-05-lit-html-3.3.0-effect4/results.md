# Benchmark results, 2026-10-05 (lit-html-3.3.0-effect4)

> **Variant run: lit-html-3.3.0-effect4.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 33f650f-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
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
| floor | 24.0 | 5.8 | 66.1 | 4.7 | 23.0 | 9.0 | 3.7 |
| counter | 24.1 | 5.8 | 66.2 | 5.7 | 23.4 | 9.9 | 4.3 |
| todo | 25.8 | 7.3 | 66.6 | 6.1 | 25.0 | 14.2 | 6.6 |
| search | 26.4 | 6.6 | 67.0 | 6.5 | 25.1 | 13.8 | 5.9 |
| form | 25.3 | 6.4 | 66.8 | 6.2 | 25.8 | 14.4 | 6.9 |
| table | 25.9 | 7.5 | 67.1 | 6.5 | 24.4 | 13.5 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 21.7 | 5.2 | 57.0 | 4.3 | 21.0 | 8.2 | 3.4 |
| counter | 21.7 | 5.3 | 57.0 | 5.2 | 21.3 | 9.1 | 3.9 |
| todo | 23.2 | 6.6 | 57.3 | 5.5 | 22.8 | 12.9 | 6.0 |
| search | 23.7 | 6.0 | 57.7 | 6.0 | 22.9 | 12.6 | 5.3 |
| form | 22.8 | 5.8 | 57.5 | 5.6 | 23.5 | 13.1 | 6.3 |
| table | 23.3 | 6.8 | 57.9 | 5.9 | 22.2 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 68.0 | 15.0 | 214.4 | 11.1 | 59.0 | 22.3 | 9.5 |
| counter | 68.3 | 15.2 | 214.7 | 13.5 | 60.0 | 24.9 | 10.8 |
| todo | 72.7 | 19.2 | 215.6 | 14.2 | 64.2 | 36.1 | 16.9 |
| search | 73.6 | 16.9 | 216.2 | 15.1 | 64.0 | 35.1 | 14.2 |
| form | 71.3 | 16.9 | 216.1 | 14.9 | 66.5 | 37.2 | 17.8 |
| table | 72.8 | 19.5 | 217.2 | 15.7 | 62.6 | 34.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 24.3 | 6.0 | 66.3 | 5.0 | 23.2 | 9.2 | 4.0 |
| counter | 24.4 | 6.1 | 66.4 | 5.9 | 23.6 | 10.1 | 4.5 |
| todo | 26.1 | 7.5 | 66.8 | 6.3 | 25.3 | 14.4 | 6.8 |
| search | 26.6 | 6.8 | 67.2 | 6.7 | 25.3 | 14.1 | 6.1 |
| form | 25.5 | 6.7 | 67.0 | 6.5 | 26.0 | 14.6 | 7.2 |
| table | 26.1 | 7.7 | 67.3 | 6.7 | 24.6 | 13.7 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Each time ends when the frame after the change has rendered, so it moves in steps of about
one frame (16.7 ms at 60 Hz). Differences smaller than a frame, as in "select row", mostly
reflect whether the work finished before the next frame started.

| Operation (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 292.9 / 296.1 | 304.8 / 316.7 | 269.9 / 285.5 | 277.7 / 286.3 | 261.7 / 276.9 | **239.3 / 246.1** | 259.2 / 268.4 |
| replace 1,000 rows | 373.1 / 404.3 | 363.1 / 379.5 | 321.1 / 350.9 | 322.7 / 338.5 | 305.3 / 342.9 | **275.8 / 289.6** | 293.8 / 308.9 |
| update every 10th row | 74.2 / 78.8 | 69.8 / 78.2 | 74.4 / 78.3 | 82.0 / 88.8 | 70.2 / 77.8 | **67.9 / 74.7** | 70.4 / 80.1 |
| select row | 16.5 / 18.4 | 17.0 / 18.0 | 19.0 / 19.7 | 18.7 / 23.8 | 2.9 / 19.8 | 4.8 / 21.3 | **1.5 / 2.2** |
| swap rows | 34.5 / 36.9 | **32.5 / 35.6** | 247.6 / 259.8 | 40.6 / 44.5 | 35.8 / 38.6 | 37.5 / 39.4 | 36.6 / 39.0 |
| remove row | 49.1 / 63.5 | 47.2 / 53.1 | **47.0 / 52.8** | 57.3 / 71.8 | 48.5 / 51.2 | 49.4 / 53.5 | 50.3 / 56.3 |
| create 10,000 rows | 2654.8 / 2764.1 | 2658.4 / 2772.3 | 3015.2 / 3120.0 | 2523.2 / 2578.9 | 2273.9 / 2351.6 | **2067.1 / 2135.2** | 2207.3 / 2324.7 |
| append 1,000 rows | 369.5 / 378.9 | 376.2 / 385.1 | 343.7 / 351.1 | 369.1 / 381.0 | 331.2 / 339.1 | **310.0 / 318.2** | 333.5 / 339.7 |
| clear 1,000 rows | 46.2 / 49.2 | 45.9 / 55.5 | 33.1 / 34.6 | 26.8 / 28.4 | 29.4 / 31.2 | **21.5 / 23.0** | 23.8 / 25.4 |
| geometric mean of slowdown vs fastest | 1.61 | 1.59 | 1.91 | 1.57 | 1.18 | 1.16 | 1.07 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.36 | 1.20 | 1.55 | 1.17 | 1.32 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.19 | 1.98 | 3.28 | 2.79 | 3.01 | 2.48 | 3.11 |
| after clearing them | 1.51 | 1.30 | 2.14 | 1.27 | 1.52 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 475 / 476 | 369 / 370 | 683 / 686 | 357 / 358 | 458 / 459 | 407 / 408 | 366 / 367 |
| first todo added (interactive) | 516 / 519 | 407 / 409 | 734 / 737 | 397 / 399 | 502 / 505 | 448 / 451 | 406 / 408 |
