# Benchmark results, 2026-10-06 (release-0.2.0-a3)

> **Variant run: release-0.2.0-a3.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit e40a86d-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 6.8% (limit 5%), max 1-min load 4.16 **FLAGGED (speed drifted): compare frameworks within this run only.**

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
| create 1,000 rows | 232.2 / 252.5 | 267.6 / 281.5 | 241.6 / 259.6 | 251.9 / 266.2 | 238.0 / 256.5 | **215.8 / 227.2** | 233.7 / 249.7 |
| replace 1,000 rows | 249.3 / 265.0 | 292.2 / 306.1 | 277.3 / 302.6 | 281.0 / 289.0 | 258.1 / 273.9 | **235.2 / 249.9** | 252.6 / 284.4 |
| update every 10th row | 68.3 / 74.6 | 71.8 / 76.9 | 69.6 / 76.0 | 80.5 / 88.2 | 66.9 / 73.6 | 67.2 / 74.6 | **65.7 / 93.1** |
| select row | 16.7 / 18.3 | 15.0 / 16.4 | 13.7 / 15.2 | 25.3 / 27.6 | 17.6 / 18.7 | 11.9 / 17.7 | **7.6 / 19.1** |
| swap rows | 32.3 / 37.7 | 36.8 / 41.3 | 207.1 / 219.0 | 42.8 / 49.4 | **25.2 / 27.6** | 25.9 / 28.3 | 30.5 / 34.4 |
| remove row | 43.8 / 51.1 | 47.7 / 54.0 | 44.8 / 48.7 | 58.8 / 72.9 | 50.7 / 56.8 | **42.3 / 46.5** | 45.5 / 49.7 |
| create 10,000 rows | 2303.3 / 2404.7 | 2718.7 / 2815.5 | 3001.4 / 3187.0 | 2490.4 / 2521.2 | 2341.9 / 2442.5 | **2080.5 / 2160.8** | 2242.3 / 2306.1 |
| append 1,000 rows | 289.7 / 308.4 | 324.6 / 340.2 | 296.4 / 317.7 | 322.6 / 341.9 | 282.8 / 296.0 | **264.8 / 295.9** | 292.2 / 308.3 |
| clear 1,000 rows | 27.9 / 29.3 | 34.9 / 36.6 | 31.0 / 32.1 | 25.1 / 28.8 | 28.2 / 29.2 | **22.2 / 22.6** | 23.1 / 29.8 |
| geometric mean of slowdown vs fastest | 1.20 | 1.34 | 1.54 | 1.41 | 1.20 | 1.06 | 1.07 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 40.3 / 152.7 / 36.2 / 2.7 | 57.2 / 164.5 / 41.3 / 3.3 | 55.4 / 149.8 / 35.7 / 1.7 | 61.9 / 151.7 / 36.3 / 1.8 | 47.0 / 152.4 / 36.2 / 3.0 | 28.5 / 148.7 / 35.9 / 1.6 | 46.6 / 149.9 / 36.8 / 1.5 |
| replace 1,000 rows | 61.2 / 147.9 / 37.4 / 2.7 | 84.8 / 161.3 / 44.4 / 3.6 | 87.7 / 150.0 / 36.9 / 1.9 | 88.0 / 149.2 / 37.9 / 1.8 | 67.1 / 148.7 / 37.5 / 2.8 | 48.4 / 148.9 / 36.9 / 1.6 | 66.4 / 146.8 / 36.4 / 1.6 |
| update every 10th row | 4.3 / 39.1 / 23.5 / 1.7 | 3.5 / 40.5 / 25.6 / 2.0 | 6.7 / 38.2 / 22.6 / 1.8 | 18.0 / 38.0 / 23.1 / 1.4 | 4.3 / 38.1 / 23.6 / 1.3 | 4.9 / 38.4 / 22.6 / 1.4 | 3.0 / 38.4 / 23.6 / 1.4 |
| select row | 2.8 / 0.0 / 6.0 / 6.5 | 2.5 / 0.0 / 6.0 / 6.3 | 3.5 / 0.0 / 5.6 / 3.6 | 17.8 / 0.0 / 6.3 / 1.2 | 2.0 / 0.0 / 6.0 / 9.7 | 4.8 / 0.0 / 6.4 / 0.9 | 0.9 / 0.0 / 5.6 / 1.0 |
| swap rows | 3.0 / 12.3 / 15.3 / 1.4 | 2.5 / 14.5 / 18.9 / 1.6 | 35.5 / 133.8 / 35.4 / 1.4 | 18.2 / 12.2 / 10.5 / 1.1 | 2.0 / 11.6 / 10.5 / 1.1 | 2.7 / 11.6 / 10.6 / 0.9 | 7.2 / 11.6 / 10.7 / 1.2 |
| remove row | 4.0 / 11.7 / 27.2 / 1.6 | 3.7 / 13.3 / 29.5 / 1.8 | 6.0 / 11.1 / 26.4 / 1.3 | 18.3 / 11.5 / 26.8 / 1.6 | 10.6 / 11.5 / 27.0 / 2.8 | 2.8 / 11.0 / 27.5 / 1.2 | 7.0 / 11.0 / 26.6 / 1.4 |
| create 10,000 rows | 412.2 / 1578.1 / 310.5 / 6.7 | 585.0 / 1759.4 / 363.4 / 11.7 | 1088.3 / 1601.1 / 301.7 / 5.3 | 584.0 / 1605.3 / 300.7 / 4.3 | 429.4 / 1610.9 / 300.8 / 5.2 | 267.7 / 1515.2 / 298.7 / 4.0 | 398.1 / 1534.3 / 300.3 / 4.5 |
| append 1,000 rows | 44.5 / 182.9 / 57.8 / 3.1 | 55.5 / 195.0 / 66.5 / 4.3 | 57.0 / 182.8 / 54.1 / 2.0 | 83.3 / 181.8 / 52.2 / 1.9 | 44.6 / 181.3 / 52.7 / 3.1 | 30.9 / 179.9 / 53.0 / 1.8 | 54.5 / 185.2 / 51.8 / 2.1 |
| clear 1,000 rows | 23.2 / 0.4 / 2.0 / 2.1 | 30.5 / 0.5 / 2.2 / 1.8 | 27.9 / 0.2 / 2.2 / 0.7 | 21.7 / 0.5 / 2.2 / 0.5 | 23.9 / 0.5 / 1.9 / 2.0 | 19.1 / 0.3 / 2.3 / 0.7 | 19.9 / 0.6 / 2.1 / 1.0 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.26 | 1.20 | 1.55 | 1.17 | 1.32 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.05 | 1.98 | 3.28 | 2.79 | 3.01 | 2.48 | 3.11 |
| after clearing them | 1.41 | 1.30 | 2.14 | 1.27 | 1.53 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 401 / 403 | 368 / 370 | 681 / 687 | 357 / 358 | 458 / 459 | 407 / 410 | 365 / 366 |
| first todo added (interactive) | 442 / 444 | 406 / 409 | 732 / 740 | 395 / 397 | 502 / 504 | 448 / 455 | 405 / 407 |
