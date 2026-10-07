# Benchmark results, 2026-10-07 (full)

> **Variant run: full.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 557eddb
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 4.1% (limit 5%), max 1-min load 2.14

Framework versions:

- **gyral**: @gyral/core 0.2.0, @gyral/time 0.2.0, effect none, lit 3.3.3, lit-html 3.3.0
- **gyral-next**: @gyral/core 0.3.0, @gyral/time 0.3.0
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
| create 1,000 rows | 229.6 / 236.7 | 222.0 / 229.6 | 264.0 / 274.6 | 232.6 / 238.6 | **218.1 / 237.9** | 231.8 / 244.3 | 243.8 / 251.9 | 242.0 / 258.1 |
| replace 1,000 rows | 268.2 / 292.3 | 254.9 / 277.1 | 302.7 / 318.2 | 266.1 / 275.5 | **242.5 / 263.0** | 272.3 / 288.3 | 285.5 / 297.5 | 291.7 / 304.8 |
| update every 10th row | 74.2 / 78.3 | **71.4 / 74.9** | 76.4 / 86.5 | 72.5 / 79.0 | 76.9 / 80.7 | 76.2 / 79.5 | 87.3 / 94.6 | 77.5 / 85.7 |
| select row | 17.3 / 19.3 | 8.8 / 15.9 | 14.3 / 16.4 | **8.4 / 18.8** | 13.2 / 18.5 | 17.8 / 18.8 | 24.9 / 27.2 | 13.8 / 15.7 |
| swap rows | 35.3 / 38.5 | 30.3 / 33.1 | 40.0 / 43.8 | 33.2 / 34.9 | 28.7 / 30.8 | **27.5 / 30.0** | 43.4 / 60.6 | 222.1 / 230.6 |
| remove row | 48.5 / 52.0 | **45.7 / 50.2** | 53.0 / 58.0 | 50.2 / 54.7 | 46.5 / 48.2 | 55.4 / 59.0 | 64.2 / 73.2 | 51.0 / 60.2 |
| create 10,000 rows | 2427.2 / 2461.1 | 2311.8 / 2340.9 | 2834.9 / 2877.0 | 2347.4 / 2410.2 | **2188.6 / 2213.7** | 2402.7 / 2465.0 | 2576.1 / 2648.0 | 3107.7 / 3352.8 |
| append 1,000 rows | 305.7 / 332.5 | 285.0 / 299.8 | 336.4 / 343.7 | 306.3 / 316.5 | **278.5 / 294.1** | 292.7 / 298.9 | 336.1 / 348.2 | 311.4 / 324.1 |
| clear 1,000 rows | 28.9 / 29.9 | **21.7 / 22.5** | 34.8 / 37.3 | 24.2 / 25.4 | 22.2 / 22.9 | 28.9 / 31.6 | 25.6 / 29.4 | 31.9 / 33.8 |
| geometric mean of slowdown vs fastest | 1.21 | 1.03 | 1.31 | 1.08 | 1.07 | 1.20 | 1.38 | 1.55 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 39.2 / 151.7 / 35.8 / 2.8 | 33.5 / 152.0 / 34.8 / 1.5 | 55.9 / 162.3 / 42.3 / 3.3 | 45.9 / 149.5 / 35.4 / 1.3 | 28.2 / 150.3 / 34.8 / 1.4 | 45.8 / 148.8 / 34.8 / 2.7 | 57.9 / 148.8 / 34.6 / 1.2 | 54.3 / 148.3 / 35.6 / 1.3 |
| replace 1,000 rows | 63.1 / 158.2 / 41.7 / 2.8 | 54.5 / 158.0 / 41.2 / 1.4 | 84.6 / 167.2 / 47.4 / 3.3 | 68.9 / 153.9 / 40.9 / 1.6 | 49.2 / 151.8 / 39.7 / 1.6 | 68.9 / 158.6 / 42.0 / 3.2 | 87.0 / 154.8 / 41.6 / 1.7 | 89.6 / 157.3 / 41.0 / 1.7 |
| update every 10th row | 4.3 / 41.5 / 26.8 / 1.6 | 3.4 / 41.2 / 25.8 / 1.5 | 3.6 / 42.4 / 27.8 / 2.4 | 3.0 / 41.4 / 26.2 / 1.2 | 4.9 / 41.8 / 27.9 / 1.3 | 4.3 / 41.0 / 27.6 / 1.7 | 18.4 / 40.9 / 26.6 / 1.4 | 7.1 / 41.2 / 27.2 / 1.3 |
| select row | 2.8 / 0.0 / 6.1 / 7.9 | 1.8 / 0.0 / 6.3 / 0.8 | 2.5 / 0.0 / 6.8 / 5.4 | 0.8 / 0.0 / 6.5 / 1.2 | 5.1 / 0.0 / 6.4 / 0.9 | 2.0 / 0.0 / 6.5 / 9.1 | 17.4 / 0.0 / 6.3 / 1.1 | 3.6 / 0.0 / 6.4 / 3.8 |
| swap rows | 2.8 / 13.0 / 18.0 / 1.5 | 2.2 / 13.4 / 12.4 / 1.4 | 2.5 / 14.9 / 20.9 / 2.1 | 7.5 / 12.2 / 11.6 / 1.3 | 2.5 / 12.8 / 12.2 / 1.1 | 2.0 / 12.4 / 11.7 / 1.3 | 18.0 / 12.9 / 11.7 / 1.2 | 36.6 / 142.9 / 40.5 / 1.7 |
| remove row | 4.3 / 12.4 / 30.6 / 1.8 | 2.5 / 11.9 / 30.3 / 1.7 | 3.6 / 14.3 / 33.5 / 2.3 | 7.6 / 11.6 / 29.8 / 1.8 | 2.8 / 11.6 / 29.8 / 1.6 | 10.6 / 11.4 / 29.8 / 3.4 | 18.9 / 13.1 / 30.4 / 1.9 | 6.3 / 12.2 / 30.9 / 1.5 |
| create 10,000 rows | 427.9 / 1654.9 / 331.8 / 7.0 | 342.5 / 1628.0 / 322.7 / 4.6 | 613.3 / 1821.8 / 392.5 / 12.2 | 412.2 / 1599.8 / 313.1 / 4.7 | 276.1 / 1585.2 / 319.3 / 4.2 | 435.2 / 1651.0 / 317.8 / 5.5 | 589.0 / 1662.2 / 323.1 / 4.6 | 1132.9 / 1647.0 / 319.6 / 5.2 |
| append 1,000 rows | 45.2 / 196.7 / 62.3 / 3.3 | 35.9 / 189.8 / 58.4 / 1.9 | 56.9 / 204.9 / 70.4 / 4.4 | 57.8 / 188.1 / 58.3 / 1.8 | 32.0 / 189.1 / 56.1 / 1.9 | 44.8 / 187.8 / 54.9 / 2.8 | 84.3 / 190.4 / 58.3 / 1.9 | 58.7 / 192.0 / 58.5 / 2.1 |
| clear 1,000 rows | 24.1 / 0.6 / 2.1 / 2.1 | 18.5 / 0.3 / 2.1 / 0.8 | 31.0 / 0.4 / 2.0 / 1.7 | 20.6 / 0.5 / 2.2 / 0.8 | 19.1 / 0.3 / 2.3 / 0.5 | 24.6 / 0.2 / 2.1 / 2.0 | 22.5 / 0.3 / 2.3 / 0.8 | 28.5 / 0.2 / 2.2 / 0.8 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.26 | 1.18 | 1.20 | 1.13 | 1.19 | 1.32 | 1.17 | 1.55 |
| after creating 1,000 rows | 2.05 | 2.13 | 1.98 | 3.12 | 2.48 | 3.01 | 2.79 | 3.28 |
| after clearing them | 1.41 | 1.40 | 1.30 | 1.33 | 1.47 | 1.53 | 1.27 | 2.14 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-next | lit | solid | svelte | vue | preact | react |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 402 / 403 | 383 / 386 | 368 / 376 | 365 / 367 | 407 / 412 | 458 / 466 | 357 / 362 | 683 / 693 |
| first todo added (interactive) | 443 / 445 | 423 / 429 | 407 / 417 | 405 / 407 | 447 / 459 | 502 / 511 | 396 / 401 | 735 / 747 |
