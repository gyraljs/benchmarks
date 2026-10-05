# Benchmark results, 2026-10-05

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 0ccf82a
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, lit 3.3.3
- **lit**: lit 3.3.3
- **react**: react 19.3.0, react-dom 19.3.0
- **preact**: preact 11.0.0
- **vue**: vue 3.5.43
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 49.3 | 5.8 | 66.1 | 4.7 | 23.0 | 9.0 | 3.7 |
| counter | 49.4 | 5.9 | 66.2 | 5.7 | 23.4 | 9.9 | 4.3 |
| todo | 51.0 | 7.3 | 66.6 | 6.1 | 25.0 | 14.2 | 6.6 |
| search | 51.6 | 6.6 | 67.0 | 6.5 | 25.1 | 13.8 | 5.9 |
| form | 50.6 | 6.4 | 66.8 | 6.2 | 25.8 | 14.4 | 6.9 |
| table | 51.1 | 7.5 | 67.1 | 6.5 | 24.4 | 13.5 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 43.6 | 5.2 | 57.0 | 4.3 | 21.0 | 8.2 | 3.4 |
| counter | 43.6 | 5.3 | 57.0 | 5.2 | 21.3 | 9.1 | 3.9 |
| todo | 45.0 | 6.6 | 57.3 | 5.5 | 22.8 | 12.9 | 6.0 |
| search | 45.6 | 6.0 | 57.7 | 6.0 | 22.9 | 12.6 | 5.3 |
| form | 44.6 | 5.8 | 57.5 | 5.6 | 23.5 | 13.1 | 6.3 |
| table | 45.2 | 6.8 | 57.9 | 5.9 | 22.2 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 150.4 | 15.0 | 214.4 | 11.1 | 59.0 | 22.3 | 9.5 |
| counter | 150.7 | 15.2 | 214.7 | 13.5 | 60.0 | 24.9 | 10.8 |
| todo | 155.0 | 19.1 | 215.6 | 14.2 | 64.2 | 36.1 | 16.9 |
| search | 155.9 | 16.9 | 216.2 | 15.1 | 64.0 | 35.1 | 14.2 |
| form | 153.7 | 16.9 | 216.1 | 14.9 | 66.5 | 37.2 | 17.8 |
| table | 155.0 | 19.5 | 217.2 | 15.7 | 62.6 | 34.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 49.5 | 6.0 | 66.3 | 5.0 | 23.2 | 9.2 | 4.0 |
| counter | 49.6 | 6.1 | 66.4 | 5.9 | 23.6 | 10.1 | 4.5 |
| todo | 51.3 | 7.5 | 66.8 | 6.3 | 25.3 | 14.4 | 6.8 |
| search | 51.9 | 6.8 | 67.2 | 6.7 | 25.3 | 14.1 | 6.1 |
| form | 50.8 | 6.7 | 67.0 | 6.5 | 26.0 | 14.6 | 7.2 |
| table | 51.4 | 7.7 | 67.3 | 6.7 | 24.6 | 13.7 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Each time ends when the frame after the change has rendered, so it moves in steps of about
one frame (16.7 ms at 60 Hz). Differences smaller than a frame, as in "select row", mostly
reflect whether the work finished before the next frame started.

| Operation (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 357.4 / 428.1 | 356.3 / 429.1 | 325.8 / 396.6 | 309.5 / 339.6 | 298.3 / 361.6 | **263.3 / 324.2** | 285.9 / 361.3 |
| replace 1,000 rows | 2230.5 / 3439.2 | 2226.9 / 5355.8 | 350.8 / 656.2 | 353.4 / 534.2 | 346.1 / 401.2 | **305.9 / 460.9** | 336.1 / 819.2 |
| update every 10th row | 80.3 / 88.5 | 78.0 / 95.7 | 79.1 / 87.1 | 90.0 / 98.2 | 76.8 / 93.4 | 76.2 / 124.1 | **73.2 / 88.3** |
| select row | 13.4 / 16.9 | 15.5 / 17.7 | 17.2 / 18.9 | 19.6 / 30.2 | 16.9 / 18.5 | 16.1 / 21.4 | **1.9 / 16.4** |
| swap rows | 39.2 / 53.4 | **33.8 / 53.9** | 297.9 / 367.8 | 48.4 / 60.9 | 37.6 / 45.1 | 39.8 / 46.5 | 38.5 / 49.9 |
| remove row | 56.1 / 66.8 | 58.4 / 67.4 | **53.8 / 56.9** | 72.1 / 82.8 | 58.6 / 71.0 | 54.4 / 60.2 | 56.8 / 72.0 |
| create 10,000 rows | 2963.6 / 4870.5 | 2913.9 / 4054.5 | 3255.4 / 4763.5 | 2610.9 / 3077.3 | 2401.1 / 3771.3 | **2149.7 / 3345.8** | 2320.3 / 3669.2 |
| append 1,000 rows | 436.0 / 564.5 | 523.5 / 732.5 | 412.1 / 831.1 | 428.6 / 800.8 | 379.1 / 570.0 | **373.9 / 478.1** | 407.2 / 718.2 |
| clear 1,000 rows | 3746.1 / 7668.3 | 3763.5 / 5730.5 | 39.9 / 66.7 | 39.9 / 54.7 | 39.5 / 61.8 | **25.8 / 44.0** | 28.3 / 40.6 |
| geometric mean of slowdown vs fastest | 3.03 | 3.09 | 1.90 | 1.61 | 1.43 | 1.30 | 1.07 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.71 | 1.20 | 1.55 | 1.17 | 1.32 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.54 | 1.98 | 3.28 | 2.79 | 3.01 | 2.48 | 3.11 |
| after clearing them | 1.88 | 1.32 | 2.14 | 1.27 | 1.52 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 657 / 711 | 390 / 421 | 736 / 772 | 378 / 408 | 481 / 511 | 425 / 460 | 389 / 409 |
| first todo added (interactive) | 725 / 779 | 438 / 473 | 801 / 866 | 445 / 473 | 533 / 592 | 475 / 540 | 450 / 476 |
