# Benchmark results, 2026-10-05 (lit-html-3.3.0-effect4-trace)

> **Variant run: lit-html-3.3.0-effect4-trace.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 11c7161-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 2.9% (limit 5%), max 1-min load 3.22

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

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 265.3 / 291.0 | 274.3 / 288.8 | 252.0 / 268.3 | 248.2 / 276.1 | 238.4 / 256.0 | **218.4 / 241.9** | 239.9 / 249.5 |
| replace 1,000 rows | 307.9 / 325.1 | 308.4 / 320.9 | 292.8 / 311.7 | 287.4 / 306.1 | 268.9 / 279.0 | **249.0 / 263.6** | 262.4 / 291.2 |
| update every 10th row | 83.2 / 94.1 | 80.8 / 83.7 | 82.0 / 95.1 | 94.8 / 117.9 | 78.9 / 86.1 | 77.2 / 80.4 | **75.3 / 80.0** |
| select row | 14.6 / 16.1 | 14.1 / 15.8 | 13.2 / 14.8 | 26.8 / 38.7 | 16.6 / 18.5 | 12.5 / 17.6 | **8.1 / 18.1** |
| swap rows | 38.2 / 42.9 | 37.0 / 43.0 | 215.8 / 222.7 | 44.0 / 53.7 | **25.8 / 28.3** | 26.3 / 31.6 | 30.9 / 35.7 |
| remove row | 48.7 / 60.9 | 48.9 / 58.1 | 47.4 / 52.1 | 59.0 / 63.5 | 51.3 / 59.0 | **41.8 / 47.0** | 46.2 / 59.2 |
| create 10,000 rows | 2944.1 / 3139.0 | 2849.9 / 2951.4 | 3157.2 / 3410.3 | 2631.3 / 2767.6 | 2427.1 / 2547.3 | **2210.0 / 2262.9** | 2407.0 / 2512.5 |
| append 1,000 rows | 371.4 / 442.3 | 351.0 / 390.1 | 328.0 / 355.6 | 358.4 / 427.5 | 327.8 / 342.3 | **312.1 / 357.8** | 321.7 / 371.3 |
| clear 1,000 rows | 38.5 / 40.2 | 37.9 / 44.0 | 34.1 / 41.0 | 27.4 / 29.9 | 31.1 / 32.3 | **24.0 / 30.1** | 26.0 / 29.0 |
| geometric mean of slowdown vs fastest | 1.33 | 1.31 | 1.54 | 1.40 | 1.19 | 1.05 | 1.07 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 51.4 / 168.3 / 43.0 / 3.4 | 56.9 / 169.4 / 44.2 / 3.5 | 57.0 / 154.3 / 39.0 / 2.0 | 59.7 / 151.0 / 37.2 / 1.6 | 47.0 / 151.9 / 37.4 / 2.6 | 29.3 / 151.0 / 38.4 / 1.4 | 48.1 / 151.1 / 37.9 / 1.6 |
| replace 1,000 rows | 86.9 / 170.4 / 45.9 / 3.4 | 88.5 / 169.9 / 46.4 / 3.2 | 90.0 / 157.7 / 42.3 / 2.1 | 89.8 / 157.3 / 40.6 / 1.5 | 68.7 / 159.7 / 39.8 / 2.9 | 52.2 / 155.8 / 39.6 / 1.4 | 70.5 / 151.1 / 39.0 / 1.5 |
| update every 10th row | 4.9 / 44.1 / 30.4 / 2.7 | 3.6 / 44.0 / 30.8 / 2.4 | 7.6 / 43.6 / 28.8 / 1.9 | 19.2 / 43.3 / 29.5 / 1.5 | 4.7 / 43.0 / 28.9 / 2.1 | 5.3 / 42.5 / 27.8 / 1.4 | 3.0 / 42.1 / 28.7 / 1.4 |
| select row | 2.7 / 0.0 / 6.7 / 4.3 | 2.4 / 0.0 / 6.7 / 3.8 | 3.8 / 0.0 / 6.5 / 3.0 | 19.2 / 0.0 / 6.7 / 1.0 | 2.0 / 0.0 / 6.5 / 8.0 | 5.0 / 0.0 / 6.3 / 1.0 | 0.9 / 0.0 / 6.5 / 1.0 |
| swap rows | 2.9 / 14.5 / 18.4 / 1.9 | 2.5 / 14.4 / 18.9 / 1.8 | 36.8 / 139.3 / 38.0 / 1.5 | 18.8 / 12.2 / 11.2 / 1.2 | 1.9 / 12.1 / 10.7 / 1.2 | 2.8 / 11.7 / 10.7 / 1.2 | 7.5 / 11.7 / 10.6 / 1.2 |
| remove row | 4.1 / 13.3 / 29.7 / 2.2 | 3.7 / 13.5 / 29.9 / 2.4 | 6.3 / 11.6 / 28.4 / 1.6 | 18.1 / 11.7 / 26.9 / 1.6 | 10.5 / 11.5 / 27.0 / 2.5 | 2.8 / 11.4 / 26.6 / 1.4 | 7.3 / 11.7 / 26.9 / 1.7 |
| create 10,000 rows | 601.7 / 1877.2 / 433.6 / 12.2 | 606.2 / 1833.2 / 388.2 / 12.0 | 1134.4 / 1659.8 / 321.3 / 5.3 | 598.2 / 1716.4 / 317.9 / 4.7 | 441.8 / 1663.2 / 314.1 / 5.6 | 293.0 / 1591.5 / 316.6 / 4.6 | 427.8 / 1634.5 / 330.0 / 4.5 |
| append 1,000 rows | 62.3 / 221.2 / 76.8 / 4.7 | 58.1 / 213.9 / 76.2 / 4.8 | 60.7 / 200.5 / 62.9 / 2.3 | 95.1 / 199.9 / 61.9 / 2.2 | 50.1 / 207.9 / 63.6 / 3.6 | 35.8 / 205.2 / 63.7 / 2.2 | 62.0 / 195.3 / 60.5 / 2.0 |
| clear 1,000 rows | 33.8 / 0.6 / 2.0 / 2.2 | 33.3 / 0.7 / 2.0 / 2.1 | 30.6 / 0.1 / 2.4 / 0.9 | 23.9 / 0.4 / 2.3 / 1.0 | 26.3 / 0.6 / 2.1 / 2.0 | 20.5 / 0.4 / 2.3 / 0.9 | 21.5 / 0.1 / 2.3 / 1.1 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.36 | 1.20 | 1.55 | 1.17 | 1.32 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.19 | 1.98 | 3.28 | 2.79 | 3.01 | 2.48 | 3.11 |
| after clearing them | 1.51 | 1.30 | 2.14 | 1.27 | 1.53 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 480 / 492 | 370 / 378 | 693 / 707 | 359 / 368 | 461 / 467 | 409 / 422 | 366 / 370 |
| first todo added (interactive) | 528 / 541 | 410 / 422 | 747 / 788 | 406 / 422 | 509 / 520 | 453 / 478 | 409 / 414 |
