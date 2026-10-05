# Benchmark results, 2026-10-05 (whitespace-confirm)

> **Variant run: whitespace-confirm.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit e40a86d-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 3.6% (limit 5%), max 1-min load 3.55

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
- **gyral-ws**: @gyral/core-ws 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-ws | solid |
| --- | ---: | ---: | ---: |
| floor | 24.0 | 25.1 | 3.7 |
| counter | 24.1 | 25.2 | 4.3 |
| todo | 25.8 | 26.9 | 6.6 |
| search | 26.4 | 27.5 | 5.9 |
| form | 25.3 | 26.4 | 6.9 |
| table | 25.9 | 27.0 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-ws | solid |
| --- | ---: | ---: | ---: |
| floor | 21.7 | 22.7 | 3.4 |
| counter | 21.7 | 22.8 | 3.9 |
| todo | 23.2 | 24.2 | 6.0 |
| search | 23.7 | 24.7 | 5.3 |
| form | 22.8 | 23.8 | 6.3 |
| table | 23.3 | 24.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-ws | solid |
| --- | ---: | ---: | ---: |
| floor | 68.0 | 70.5 | 9.5 |
| counter | 68.3 | 70.8 | 10.8 |
| todo | 72.7 | 75.2 | 16.9 |
| search | 73.6 | 76.1 | 14.2 |
| form | 71.3 | 73.8 | 17.8 |
| table | 72.8 | 75.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-ws | solid |
| --- | ---: | ---: | ---: |
| floor | 24.3 | 25.4 | 4.0 |
| counter | 24.4 | 25.5 | 4.5 |
| todo | 26.1 | 27.2 | 6.8 |
| search | 26.6 | 27.7 | 6.1 |
| form | 25.5 | 26.6 | 7.2 |
| table | 26.1 | 27.2 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-ws | solid |
| --- | ---: | ---: | ---: |
| create 1,000 rows | 266.3 / 273.7 | **233.8 / 248.3** | 235.9 / 245.1 |
| replace 1,000 rows | 300.1 / 324.8 | **259.3 / 279.0** | 261.8 / 270.0 |
| update every 10th row | 74.3 / 76.6 | 72.6 / 79.0 | **70.0 / 76.0** |
| select row | 14.9 / 16.6 | 16.3 / 19.0 | **8.0 / 18.7** |
| swap rows | 38.7 / 45.7 | 33.5 / 37.1 | **30.9 / 31.7** |
| remove row | 54.6 / 76.7 | **51.5 / 59.9** | 51.8 / 58.0 |
| create 10,000 rows | 2819.1 / 2939.7 | 2377.3 / 2488.8 | **2314.3 / 2381.5** |
| append 1,000 rows | 359.5 / 512.0 | **326.5 / 616.6** | 350.7 / 654.5 |
| clear 1,000 rows | 37.4 / 40.4 | 29.1 / 42.7 | **26.0 / 31.4** |
| geometric mean of slowdown vs fastest | 1.23 | 1.11 | 1.01 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-ws | solid |
| --- | ---: | ---: | ---: |
| create 1,000 rows | 50.9 / 169.5 / 43.0 / 3.3 | 40.7 / 152.5 / 36.6 / 2.8 | 45.5 / 152.2 / 35.1 / 1.8 |
| replace 1,000 rows | 85.4 / 166.3 / 43.4 / 3.4 | 61.8 / 154.1 / 40.6 / 2.6 | 66.4 / 153.3 / 40.4 / 1.6 |
| update every 10th row | 4.1 / 41.5 / 26.6 / 1.8 | 4.4 / 40.6 / 25.1 / 1.5 | 3.2 / 40.2 / 25.4 / 1.5 |
| select row | 3.0 / 0.0 / 6.2 / 6.3 | 2.9 / 0.0 / 6.3 / 6.8 | 0.9 / 0.0 / 5.8 / 1.0 |
| swap rows | 2.7 / 14.7 / 19.7 / 2.1 | 3.0 / 12.7 / 16.1 / 1.5 | 7.3 / 11.5 / 10.7 / 1.4 |
| remove row | 4.7 / 14.6 / 34.0 / 2.6 | 5.0 / 13.3 / 31.2 / 2.7 | 7.3 / 12.0 / 31.2 / 1.8 |
| create 10,000 rows | 587.8 / 1799.0 / 407.9 / 12.1 | 417.7 / 1635.0 / 325.7 / 7.2 | 407.3 / 1580.3 / 316.5 / 4.5 |
| append 1,000 rows | 58.1 / 219.2 / 79.0 / 4.7 | 49.0 / 203.6 / 66.4 / 3.8 | 66.3 / 209.8 / 63.6 / 2.5 |
| clear 1,000 rows | 32.7 / 0.6 / 2.2 / 2.0 | 24.4 / 0.7 / 2.6 / 1.9 | 21.9 / 0.2 / 2.1 / 1.1 |
