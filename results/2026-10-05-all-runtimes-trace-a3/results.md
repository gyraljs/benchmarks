# Benchmark results, 2026-10-05 (all-runtimes-trace-a3)

> **Variant run: all-runtimes-trace-a3.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 5e6c2bb-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 4.9% (limit 5%), max 1-min load 2.71

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
- **gyral-noeffect**: @gyral/core-noeffect 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **gyral-twotrack**: @gyral/core-twotrack 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **gyral-pipewise**: @gyral/core-pipewise 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **gyral-combo**: @gyral/core-combo 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 24.0 | 10.8 | 11.1 | 12.3 | 12.7 | 5.8 | 9.0 | 3.7 |
| counter | 24.1 | 10.9 | 11.2 | 12.5 | 12.8 | 5.8 | 9.9 | 4.3 |
| todo | 25.8 | 12.5 | 12.8 | 14.1 | 14.4 | 7.3 | 14.2 | 6.6 |
| search | 26.4 | 13.0 | 13.4 | 14.6 | 14.9 | 6.6 | 13.8 | 5.9 |
| form | 25.3 | 12.0 | 12.4 | 13.6 | 13.9 | 6.4 | 14.4 | 6.9 |
| table | 25.9 | 12.6 | 12.9 | 14.2 | 14.5 | 7.5 | 13.5 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 21.7 | 9.8 | 10.1 | 11.2 | 11.5 | 5.2 | 8.2 | 3.4 |
| counter | 21.7 | 9.9 | 10.2 | 11.3 | 11.6 | 5.3 | 9.1 | 3.9 |
| todo | 23.2 | 11.3 | 11.6 | 12.7 | 13.0 | 6.6 | 12.9 | 6.0 |
| search | 23.7 | 11.8 | 12.1 | 13.2 | 13.5 | 6.0 | 12.6 | 5.3 |
| form | 22.8 | 10.9 | 11.2 | 12.3 | 12.6 | 5.8 | 13.1 | 6.3 |
| table | 23.3 | 11.4 | 11.7 | 12.8 | 13.1 | 6.8 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 68.0 | 29.7 | 30.4 | 34.4 | 35.1 | 15.0 | 22.3 | 9.5 |
| counter | 68.3 | 30.0 | 30.8 | 34.7 | 35.4 | 15.2 | 24.9 | 10.8 |
| todo | 72.7 | 34.4 | 35.1 | 39.1 | 39.8 | 19.2 | 36.1 | 16.9 |
| search | 73.6 | 35.3 | 36.0 | 39.9 | 40.6 | 16.9 | 35.1 | 14.2 |
| form | 71.3 | 33.0 | 33.8 | 37.7 | 38.4 | 16.9 | 37.2 | 17.8 |
| table | 72.8 | 34.5 | 35.2 | 39.1 | 39.8 | 19.5 | 34.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 24.3 | 11.0 | 11.4 | 12.6 | 12.9 | 6.0 | 9.2 | 4.0 |
| counter | 24.4 | 11.1 | 11.5 | 12.7 | 13.0 | 6.1 | 10.1 | 4.5 |
| todo | 26.1 | 12.7 | 13.1 | 14.3 | 14.6 | 7.5 | 14.4 | 6.8 |
| search | 26.6 | 13.3 | 13.6 | 14.8 | 15.1 | 6.8 | 14.1 | 6.1 |
| form | 25.5 | 12.3 | 12.6 | 13.8 | 14.1 | 6.7 | 14.6 | 7.2 |
| table | 26.1 | 12.8 | 13.2 | 14.4 | 14.7 | 7.7 | 13.7 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 259.0 / 275.9 | 256.6 / 278.9 | 257.4 / 267.9 | 258.2 / 275.5 | 256.4 / 274.0 | 261.4 / 281.8 | **212.3 / 224.0** | 233.3 / 246.8 |
| replace 1,000 rows | 296.4 / 300.6 | 293.0 / 310.1 | 294.4 / 316.8 | 294.1 / 312.2 | 292.5 / 313.8 | 291.0 / 316.0 | **236.9 / 266.5** | 256.5 / 266.7 |
| update every 10th row | 75.3 / 82.1 | 73.4 / 81.6 | 73.8 / 81.8 | 73.7 / 104.5 | 73.3 / 93.3 | 72.8 / 80.4 | 70.4 / 75.9 | **68.1 / 80.2** |
| select row | 14.0 / 15.9 | 14.3 / 16.5 | 15.1 / 17.3 | 14.8 / 16.0 | 15.3 / 16.8 | 14.7 / 15.9 | 11.9 / 18.2 | **7.2 / 14.3** |
| swap rows | 38.9 / 41.8 | 37.8 / 40.1 | 38.6 / 43.8 | 37.8 / 42.2 | 40.9 / 48.8 | 37.0 / 43.7 | **26.2 / 29.1** | 30.7 / 33.1 |
| remove row | 49.3 / 52.6 | 49.8 / 53.9 | 51.0 / 55.9 | 50.1 / 54.0 | 48.6 / 52.6 | 48.3 / 54.1 | **42.3 / 46.6** | 47.0 / 50.9 |
| create 10,000 rows | 2746.0 / 2959.6 | 2743.6 / 2763.4 | 2746.8 / 2866.7 | 2738.9 / 2857.5 | 2735.7 / 2793.7 | 2769.9 / 2800.7 | **2111.3 / 2143.0** | 2275.3 / 2377.7 |
| append 1,000 rows | 328.2 / 344.9 | 328.1 / 345.1 | 329.3 / 345.9 | 329.9 / 348.1 | 327.6 / 352.9 | 329.9 / 345.1 | **270.9 / 282.3** | 294.3 / 313.2 |
| clear 1,000 rows | 36.1 / 37.5 | 36.3 / 37.1 | 35.7 / 37.3 | 36.6 / 38.7 | 35.9 / 38.0 | 35.8 / 37.2 | **21.9 / 22.5** | 24.0 / 29.1 |
| geometric mean of slowdown vs fastest | 1.35 | 1.34 | 1.36 | 1.35 | 1.36 | 1.34 | 1.06 | 1.08 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 51.1 / 163.0 / 39.8 / 3.3 | 51.6 / 162.9 / 39.0 / 3.3 | 50.9 / 164.6 / 39.5 / 3.1 | 51.2 / 164.2 / 39.8 / 3.2 | 51.2 / 162.5 / 40.0 / 3.0 | 56.1 / 162.4 / 40.0 / 3.0 | 28.1 / 148.9 / 33.6 / 1.6 | 46.4 / 150.5 / 34.5 / 1.4 |
| replace 1,000 rows | 84.7 / 164.6 / 42.9 / 3.1 | 85.0 / 163.2 / 42.5 / 3.4 | 84.0 / 164.7 / 42.8 / 3.6 | 83.5 / 162.8 / 42.7 / 3.2 | 84.1 / 163.3 / 42.6 / 3.5 | 83.6 / 163.4 / 42.1 / 3.0 | 49.0 / 150.8 / 36.1 / 1.5 | 66.1 / 149.5 / 35.7 / 1.6 |
| update every 10th row | 4.5 / 41.4 / 26.0 / 2.0 | 4.2 / 41.2 / 25.8 / 1.8 | 4.2 / 42.1 / 25.3 / 2.1 | 4.3 / 41.4 / 25.1 / 2.2 | 4.4 / 41.1 / 25.6 / 1.9 | 3.4 / 41.4 / 26.1 / 2.3 | 4.6 / 40.9 / 23.5 / 1.2 | 3.2 / 39.8 / 23.8 / 1.4 |
| select row | 2.8 / 0.0 / 6.0 / 5.3 | 2.8 / 0.0 / 6.1 / 5.4 | 2.8 / 0.0 / 6.0 / 6.4 | 2.8 / 0.0 / 6.1 / 5.8 | 2.6 / 0.0 / 6.1 / 6.2 | 2.1 / 0.0 / 6.1 / 5.7 | 4.8 / 0.0 / 5.8 / 1.1 | 0.8 / 0.0 / 5.5 / 0.8 |
| swap rows | 2.7 / 14.4 / 18.7 / 2.0 | 3.0 / 14.4 / 18.9 / 1.9 | 3.0 / 14.6 / 19.0 / 2.0 | 2.8 / 14.1 / 18.6 / 2.0 | 2.9 / 15.2 / 20.2 / 1.9 | 2.5 / 14.7 / 18.1 / 2.1 | 2.5 / 12.2 / 10.5 / 1.2 | 7.4 / 11.6 / 10.5 / 1.3 |
| remove row | 4.4 / 13.6 / 30.4 / 2.2 | 4.1 / 13.4 / 30.5 / 2.4 | 4.1 / 13.6 / 31.8 / 2.5 | 4.1 / 13.7 / 31.1 / 2.2 | 4.2 / 13.3 / 30.1 / 2.1 | 3.8 / 13.8 / 29.7 / 2.5 | 2.8 / 11.1 / 26.3 / 1.4 | 7.3 / 11.5 / 26.3 / 1.5 |
| create 10,000 rows | 576.1 / 1769.6 / 393.9 / 11.8 | 568.6 / 1770.7 / 389.0 / 11.8 | 573.9 / 1764.8 / 397.4 / 11.8 | 576.8 / 1765.1 / 394.5 / 11.9 | 572.6 / 1757.8 / 394.9 / 11.7 | 590.3 / 1800.9 / 366.2 / 11.6 | 264.2 / 1543.2 / 297.1 / 4.2 | 405.8 / 1567.2 / 297.9 / 4.3 |
| append 1,000 rows | 55.2 / 202.5 / 66.3 / 4.5 | 54.5 / 201.3 / 66.8 / 4.1 | 54.5 / 201.6 / 67.2 / 4.6 | 54.2 / 203.2 / 66.1 / 5.1 | 54.1 / 202.2 / 66.3 / 4.4 | 55.6 / 203.0 / 66.3 / 4.4 | 30.6 / 185.4 / 53.6 / 1.9 | 55.0 / 183.7 / 52.6 / 2.2 |
| clear 1,000 rows | 31.7 / 0.6 / 1.8 / 2.0 | 32.0 / 0.4 / 1.9 / 2.2 | 31.8 / 0.5 / 1.8 / 1.8 | 32.2 / 0.6 / 2.3 / 2.0 | 31.4 / 0.5 / 1.8 / 2.2 | 31.3 / 0.5 / 2.0 / 1.9 | 19.0 / 0.2 / 2.0 / 0.7 | 20.4 / 0.6 / 1.9 / 0.9 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.36 | 1.24 | 1.24 | 1.24 | 1.24 | 1.20 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.19 | 2.06 | 2.06 | 2.07 | 2.07 | 1.98 | 2.48 | 3.12 |
| after clearing them | 1.51 | 1.38 | 1.39 | 1.39 | 1.39 | 1.30 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-noeffect | gyral-twotrack | gyral-pipewise | gyral-combo | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 477 / 490 | 394 / 401 | 402 / 420 | 401 / 412 | 409 / 417 | 370 / 371 | 408 / 421 | 366 / 372 |
| first todo added (interactive) | 522 / 534 | 438 / 445 | 445 / 465 | 442 / 456 | 449 / 467 | 409 / 415 | 452 / 465 | 408 / 415 |
