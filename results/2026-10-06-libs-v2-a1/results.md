# Benchmark results, 2026-10-06 (libs-v2-a1)

> **Variant run: libs-v2-a1.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 5c407db-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 4.8% (limit 5%), max 1-min load 1.98

Framework versions:

- **gyral**: @gyral/core 0.2.0, @gyral/time 0.2.0, effect none, lit 3.3.3, lit-html 3.3.0
- **gyral-twotrack**: @gyral/core-twotrack 0.2.0, @gyral/time 0.2.0, lit 3.3.3, lit-html 3.3.0
- **gyral-pipewise**: @gyral/core-pipewise 0.2.0, @gyral/time 0.2.0, lit 3.3.3, lit-html 3.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-twotrack | gyral-pipewise | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 11.9 | 12.7 | 13.6 | 5.8 | 9.0 | 3.7 |
| counter | 12.0 | 12.8 | 13.7 | 5.8 | 9.9 | 4.3 |
| todo | 13.6 | 14.4 | 15.4 | 7.3 | 14.2 | 6.6 |
| search | 14.1 | 14.9 | 15.9 | 6.6 | 13.8 | 5.9 |
| form | 13.1 | 13.9 | 14.9 | 6.4 | 14.4 | 6.9 |
| table | 13.7 | 14.5 | 15.4 | 7.5 | 13.5 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-twotrack | gyral-pipewise | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 10.8 | 11.5 | 12.4 | 5.2 | 8.2 | 3.4 |
| counter | 10.8 | 11.6 | 12.5 | 5.3 | 9.1 | 3.9 |
| todo | 12.3 | 13.0 | 13.9 | 6.6 | 12.9 | 6.0 |
| search | 12.8 | 13.5 | 14.4 | 6.0 | 12.6 | 5.3 |
| form | 11.8 | 12.6 | 13.4 | 5.8 | 13.1 | 6.3 |
| table | 12.4 | 13.2 | 14.0 | 6.8 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-twotrack | gyral-pipewise | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 32.2 | 34.4 | 37.5 | 15.0 | 22.3 | 9.5 |
| counter | 32.5 | 34.8 | 37.8 | 15.2 | 24.9 | 10.8 |
| todo | 36.9 | 39.1 | 42.2 | 19.2 | 36.1 | 16.9 |
| search | 37.7 | 40.0 | 43.0 | 16.9 | 35.1 | 14.2 |
| form | 35.5 | 37.7 | 40.8 | 16.9 | 37.2 | 17.8 |
| table | 36.9 | 39.2 | 42.2 | 19.5 | 34.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-twotrack | gyral-pipewise | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 12.1 | 12.9 | 13.9 | 6.0 | 9.2 | 4.0 |
| counter | 12.2 | 13.0 | 14.0 | 6.1 | 10.1 | 4.5 |
| todo | 13.8 | 14.6 | 15.6 | 7.5 | 14.4 | 6.8 |
| search | 14.4 | 15.2 | 16.1 | 6.8 | 14.1 | 6.1 |
| form | 13.3 | 14.2 | 15.1 | 6.7 | 14.6 | 7.2 |
| table | 13.9 | 14.7 | 15.7 | 7.7 | 13.7 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-twotrack | gyral-pipewise | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 229.8 / 243.1 | 230.4 / 246.1 | 228.8 / 279.5 | 262.1 / 281.7 | **213.9 / 221.5** | 232.2 / 240.1 |
| replace 1,000 rows | 258.9 / 283.1 | 257.1 / 270.0 | 258.6 / 269.5 | 296.2 / 307.1 | **245.3 / 252.2** | 257.1 / 261.6 |
| update every 10th row | 70.6 / 77.4 | 71.5 / 76.0 | 76.2 / 83.0 | 74.2 / 79.4 | 70.1 / 76.7 | **67.7 / 73.0** |
| select row | 16.8 / 18.1 | 17.5 / 18.7 | 16.7 / 17.9 | 13.8 / 15.6 | 13.0 / 17.2 | **7.7 / 18.6** |
| swap rows | 33.6 / 36.5 | 33.4 / 35.7 | 33.1 / 37.5 | 38.6 / 40.4 | **26.2 / 28.4** | 31.3 / 33.5 |
| remove row | 43.9 / 46.1 | 44.2 / 50.1 | 43.8 / 48.5 | 48.0 / 51.1 | **42.3 / 46.8** | 46.3 / 51.5 |
| create 10,000 rows | 2393.6 / 2428.1 | 2381.8 / 2475.9 | 2388.1 / 2452.5 | 2775.8 / 2898.6 | **2146.5 / 2179.3** | 2309.7 / 2353.7 |
| append 1,000 rows | 301.3 / 313.0 | 304.2 / 313.5 | 299.3 / 308.1 | 331.8 / 344.8 | **275.6 / 280.9** | 302.9 / 317.6 |
| clear 1,000 rows | 27.9 / 29.4 | 28.1 / 28.8 | 28.8 / 30.3 | 35.6 / 38.5 | **22.2 / 23.2** | 23.6 / 24.1 |
| geometric mean of slowdown vs fastest | 1.20 | 1.21 | 1.21 | 1.32 | 1.06 | 1.07 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-twotrack | gyral-pipewise | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 40.9 / 151.5 / 35.5 / 3.0 | 41.3 / 151.3 / 35.4 / 2.8 | 39.6 / 151.0 / 35.5 / 2.9 | 56.2 / 161.3 / 41.4 / 3.0 | 28.4 / 149.0 / 34.4 / 1.6 | 46.8 / 148.9 / 34.9 / 1.8 |
| replace 1,000 rows | 61.9 / 154.7 / 39.1 / 2.4 | 62.6 / 152.7 / 38.3 / 2.8 | 62.2 / 153.0 / 38.2 / 2.7 | 84.1 / 162.9 / 43.5 / 3.5 | 50.0 / 155.1 / 38.3 / 1.6 | 67.6 / 149.2 / 37.0 / 1.4 |
| update every 10th row | 4.0 / 40.3 / 24.8 / 1.4 | 4.2 / 40.5 / 24.9 / 1.3 | 4.2 / 41.1 / 26.7 / 1.9 | 3.6 / 41.6 / 26.7 / 2.1 | 4.8 / 40.5 / 24.0 / 1.1 | 2.9 / 39.8 / 23.6 / 1.2 |
| select row | 3.0 / 0.0 / 6.2 / 7.5 | 2.9 / 0.0 / 6.3 / 7.9 | 2.9 / 0.0 / 6.4 / 7.8 | 2.3 / 0.0 / 6.2 / 5.5 | 4.9 / 0.0 / 6.2 / 1.1 | 0.9 / 0.0 / 6.2 / 0.8 |
| swap rows | 2.9 / 12.5 / 16.8 / 1.3 | 3.0 / 12.6 / 16.8 / 1.1 | 2.9 / 12.8 / 16.1 / 1.7 | 2.4 / 14.3 / 19.6 / 2.0 | 2.7 / 11.7 / 10.8 / 1.0 | 7.5 / 11.5 / 10.6 / 1.3 |
| remove row | 4.0 / 11.7 / 26.8 / 1.7 | 4.0 / 11.6 / 27.6 / 1.5 | 3.9 / 11.9 / 27.5 / 1.5 | 4.0 / 13.2 / 29.6 / 2.1 | 2.9 / 11.3 / 26.6 / 1.5 | 7.1 / 11.2 / 26.4 / 1.6 |
| create 10,000 rows | 419.9 / 1629.4 / 322.0 / 6.8 | 424.7 / 1628.3 / 320.1 / 7.1 | 418.9 / 1637.5 / 320.7 / 6.9 | 589.7 / 1803.0 / 372.7 / 11.7 | 270.4 / 1560.3 / 308.8 / 4.5 | 407.3 / 1591.0 / 310.2 / 4.5 |
| append 1,000 rows | 45.5 / 192.3 / 60.7 / 3.3 | 45.4 / 193.4 / 61.2 / 3.1 | 44.6 / 190.8 / 61.4 / 3.5 | 55.6 / 202.7 / 69.6 / 4.3 | 30.7 / 186.9 / 56.4 / 1.8 | 58.1 / 189.3 / 54.7 / 1.9 |
| clear 1,000 rows | 23.7 / 0.5 / 2.1 / 1.8 | 23.5 / 0.3 / 2.1 / 1.9 | 24.0 / 0.1 / 2.3 / 2.0 | 30.9 / 0.6 / 2.0 / 1.9 | 18.9 / 0.4 / 2.0 / 0.7 | 20.1 / 0.1 / 1.8 / 0.9 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-twotrack | gyral-pipewise | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.26 | 1.27 | 1.27 | 1.20 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.05 | 2.06 | 2.06 | 1.98 | 2.48 | 3.12 |
| after clearing them | 1.41 | 1.42 | 1.42 | 1.30 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-twotrack | gyral-pipewise | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 402 / 403 | 409 / 410 | 409 / 410 | 369 / 370 | 406 / 408 | 366 / 367 |
| first todo added (interactive) | 443 / 445 | 451 / 452 | 450 / 451 | 407 / 410 | 448 / 451 | 407 / 412 |
