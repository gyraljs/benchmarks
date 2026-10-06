# Benchmark results, 2026-10-06 (gyral-0.3-final)

> **Variant run: gyral-0.3-final.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 972f1ac
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 3.3% (limit 5%), max 1-min load 3.33

Framework versions:

- **gyral**: @gyral/core 0.2.0, @gyral/time 0.2.0, effect none, lit 3.3.3, lit-html 3.3.0
- **gyral-next**: @gyral/core 0.3.0-next.6, @gyral/time 0.3.0-next.6
- **lit**: lit 3.3.3, lit-html 3.3.0
- **react**: react 19.3.0, react-dom 19.3.0
- **preact**: preact 11.0.0
- **vue**: vue 3.5.43
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 11.9 | 11.6 | 5.8 | 3.7 | 9.0 | 23.0 | 4.7 | 66.1 |
| counter | 12.0 | 11.7 | 5.8 | 4.3 | 9.9 | 23.4 | 5.7 | 66.2 |
| todo | 13.6 | 13.6 | 7.3 | 6.6 | 14.2 | 25.0 | 6.1 | 66.6 |
| search | 14.1 | 15.1 | 6.6 | 5.9 | 13.8 | 25.1 | 6.5 | 67.0 |
| form | 13.1 | 12.4 | 6.4 | 6.9 | 14.4 | 25.8 | 6.2 | 66.8 |
| table | 13.7 | 13.9 | 7.5 | 7.1 | 13.5 | 24.4 | 6.5 | 67.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 10.8 | 10.5 | 5.2 | 3.4 | 8.2 | 21.0 | 4.3 | 57.0 |
| counter | 10.8 | 10.6 | 5.3 | 3.9 | 9.1 | 21.3 | 5.2 | 57.0 |
| todo | 12.3 | 12.2 | 6.6 | 6.0 | 12.9 | 22.8 | 5.5 | 57.3 |
| search | 12.8 | 13.7 | 6.0 | 5.3 | 12.6 | 22.9 | 6.0 | 57.7 |
| form | 11.8 | 11.1 | 5.8 | 6.3 | 13.1 | 23.5 | 5.6 | 57.5 |
| table | 12.4 | 12.6 | 6.8 | 6.5 | 12.3 | 22.2 | 5.9 | 57.9 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 32.2 | 28.9 | 15.0 | 9.5 | 22.3 | 59.0 | 11.1 | 214.4 |
| counter | 32.5 | 29.2 | 15.2 | 10.8 | 24.9 | 60.0 | 13.5 | 214.7 |
| todo | 36.9 | 34.1 | 19.2 | 16.9 | 36.1 | 64.2 | 14.2 | 215.6 |
| search | 37.7 | 38.0 | 16.9 | 14.2 | 35.1 | 64.0 | 15.1 | 216.2 |
| form | 35.5 | 30.8 | 16.9 | 17.8 | 37.2 | 66.5 | 14.9 | 216.1 |
| table | 36.9 | 35.0 | 19.5 | 18.1 | 34.2 | 62.6 | 15.7 | 217.2 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 12.1 | 11.9 | 6.0 | 4.0 | 9.2 | 23.2 | 5.0 | 66.3 |
| counter | 12.2 | 12.0 | 6.1 | 4.5 | 10.1 | 23.6 | 5.9 | 66.4 |
| todo | 13.8 | 13.8 | 7.5 | 6.8 | 14.4 | 25.3 | 6.3 | 66.8 |
| search | 14.4 | 15.3 | 6.8 | 6.1 | 14.1 | 25.3 | 6.7 | 67.2 |
| form | 13.3 | 12.6 | 6.7 | 7.2 | 14.6 | 26.0 | 6.5 | 67.0 |
| table | 13.9 | 14.2 | 7.7 | 7.3 | 13.7 | 24.6 | 6.7 | 67.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 237.6 / 246.6 | 230.1 / 243.4 | 274.4 / 280.9 | 242.4 / 261.5 | **223.1 / 250.5** | 246.3 / 260.2 | 256.0 / 268.9 | 250.9 / 266.9 |
| replace 1,000 rows | 263.3 / 276.0 | 249.6 / 255.2 | 306.0 / 313.0 | 267.3 / 279.7 | **245.8 / 254.5** | 269.6 / 286.4 | 291.8 / 326.6 | 294.3 / 310.4 |
| update every 10th row | 75.5 / 80.7 | **72.8 / 83.0** | 78.0 / 92.5 | 74.8 / 80.5 | 74.7 / 79.6 | 75.8 / 80.4 | 88.7 / 94.2 | 78.3 / 97.9 |
| select row | 16.7 / 17.9 | 9.4 / 19.0 | 13.6 / 15.4 | **8.1 / 18.2** | 13.9 / 18.8 | 16.7 / 17.5 | 27.1 / 30.3 | 13.0 / 14.5 |
| swap rows | 36.2 / 40.5 | 28.3 / 30.1 | 41.1 / 45.9 | 33.1 / 37.5 | 28.6 / 30.5 | **27.7 / 34.3** | 44.0 / 54.7 | 222.5 / 235.0 |
| remove row | 47.5 / 54.7 | **45.6 / 50.7** | 52.1 / 58.1 | 50.5 / 54.3 | 45.9 / 49.4 | 55.4 / 59.7 | 65.7 / 77.3 | 49.4 / 54.3 |
| create 10,000 rows | 2399.6 / 2522.7 | 2293.2 / 2375.1 | 2835.5 / 2864.1 | 2328.5 / 2379.2 | **2199.7 / 2254.4** | 2430.9 / 2520.7 | 2590.2 / 2651.0 | 3135.0 / 3308.2 |
| append 1,000 rows | 309.0 / 315.2 | 291.4 / 309.9 | 339.5 / 358.0 | 308.5 / 322.8 | **281.0 / 289.8** | 305.1 / 315.0 | 344.9 / 358.7 | 313.9 / 331.1 |
| clear 1,000 rows | 29.1 / 29.8 | **22.3 / 23.3** | 35.9 / 37.0 | 24.4 / 30.6 | 22.9 / 23.6 | 29.7 / 35.6 | 25.8 / 27.3 | 32.4 / 33.9 |
| geometric mean of slowdown vs fastest | 1.20 | 1.03 | 1.31 | 1.08 | 1.07 | 1.20 | 1.40 | 1.53 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 40.8 / 154.9 / 37.6 / 3.2 | 34.7 / 156.3 / 37.1 / 1.8 | 57.6 / 167.6 / 43.6 / 3.7 | 47.2 / 153.6 / 37.2 / 1.8 | 28.8 / 154.1 / 37.4 / 1.5 | 48.6 / 158.1 / 37.4 / 2.9 | 61.1 / 155.9 / 37.0 / 1.7 | 56.1 / 154.8 / 37.3 / 1.9 |
| replace 1,000 rows | 62.9 / 157.5 / 40.7 / 3.1 | 53.3 / 155.2 / 39.2 / 2.1 | 86.8 / 169.1 / 45.7 / 3.7 | 68.6 / 156.7 / 39.9 / 1.9 | 50.0 / 155.0 / 39.9 / 1.9 | 68.1 / 158.3 / 40.7 / 3.1 | 89.6 / 158.3 / 40.2 / 1.9 | 92.2 / 158.6 / 40.5 / 1.7 |
| update every 10th row | 4.3 / 42.4 / 27.2 / 1.8 | 3.2 / 42.1 / 26.1 / 1.6 | 3.9 / 43.0 / 28.3 / 2.7 | 3.2 / 42.0 / 27.0 / 1.8 | 5.0 / 41.4 / 26.5 / 1.5 | 4.4 / 42.4 / 26.9 / 1.7 | 18.4 / 41.8 / 27.6 / 1.2 | 7.3 / 42.2 / 26.4 / 1.6 |
| select row | 3.0 / 0.0 / 6.6 / 7.1 | 1.9 / 0.0 / 6.2 / 1.2 | 2.5 / 0.0 / 6.7 / 4.2 | 0.9 / 0.0 / 6.4 / 1.6 | 4.9 / 0.0 / 6.7 / 1.2 | 2.0 / 0.0 / 6.4 / 8.3 | 18.8 / 0.0 / 6.9 / 1.4 | 3.6 / 0.0 / 6.2 / 2.8 |
| swap rows | 3.0 / 13.6 / 17.6 / 1.9 | 2.0 / 13.4 / 11.7 / 1.4 | 2.5 / 15.7 / 20.5 / 2.3 | 7.5 / 12.8 / 11.6 / 1.2 | 2.9 / 12.8 / 11.5 / 1.3 | 2.1 / 13.0 / 11.9 / 1.1 | 18.3 / 13.2 / 11.7 / 1.3 | 37.3 / 142.1 / 39.4 / 2.0 |
| remove row | 4.2 / 12.8 / 29.9 / 1.9 | 2.3 / 12.6 / 29.1 / 1.9 | 4.2 / 14.7 / 31.8 / 2.5 | 7.3 / 12.0 / 28.9 / 1.9 | 3.0 / 12.0 / 28.9 / 1.6 | 11.4 / 12.3 / 28.7 / 3.3 | 19.4 / 12.6 / 29.6 / 2.0 | 6.3 / 12.3 / 29.4 / 2.0 |
| create 10,000 rows | 422.6 / 1647.0 / 326.4 / 8.0 | 342.3 / 1626.3 / 317.7 / 5.0 | 599.4 / 1835.4 / 383.3 / 12.9 | 406.8 / 1599.0 / 315.3 / 4.7 | 275.8 / 1593.6 / 315.0 / 5.1 | 439.3 / 1667.0 / 315.4 / 6.3 | 591.6 / 1675.5 / 318.3 / 4.9 | 1112.0 / 1686.4 / 322.5 / 5.7 |
| append 1,000 rows | 45.1 / 196.5 / 62.5 / 3.8 | 37.1 / 194.6 / 57.6 / 2.0 | 55.9 / 207.0 / 72.2 / 4.8 | 56.5 / 192.0 / 58.2 / 2.0 | 31.6 / 190.1 / 57.1 / 2.1 | 46.8 / 195.1 / 58.3 / 3.4 | 87.7 / 195.6 / 58.8 / 2.3 | 58.9 / 194.0 / 58.4 / 2.2 |
| clear 1,000 rows | 24.3 / 0.7 / 2.1 / 1.7 | 18.9 / 0.5 / 2.2 / 0.8 | 31.5 / 0.6 / 2.0 / 2.0 | 20.9 / 0.6 / 1.9 / 1.2 | 19.6 / 0.4 / 2.1 / 1.0 | 25.1 / 0.5 / 2.4 / 2.0 | 22.1 / 0.6 / 2.2 / 0.8 | 29.4 / 0.1 / 1.8 / 0.9 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.26 | 1.18 | 1.20 | 1.13 | 1.19 | 1.32 | 1.17 | 1.55 |
| after creating 1,000 rows | 2.05 | 2.13 | 1.98 | 3.12 | 2.48 | 3.01 | 2.79 | 3.28 |
| after clearing them | 1.41 | 1.40 | 1.30 | 1.33 | 1.47 | 1.53 | 1.27 | 2.14 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 403 / 409 | 383 / 385 | 370 / 372 | 366 / 371 | 408 / 411 | 458 / 460 | 357 / 361 | 686 / 690 |
| first todo added (interactive) | 445 / 453 | 425 / 428 | 410 / 412 | 407 / 413 | 450 / 454 | 503 / 509 | 398 / 402 | 739 / 745 |
