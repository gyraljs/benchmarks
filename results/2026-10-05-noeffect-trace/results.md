# Benchmark results, 2026-10-05 (noeffect-trace)

> **Variant run: noeffect-trace.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 9d77c4f-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 8.6% (limit 5%), max 1-min load 11.04 **FLAGGED (speed drifted, machine busy): compare frameworks within this run only.**

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
- **gyral-noeffect**: @gyral/core-noeffect 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0
- **react**: react 19.3.0, react-dom 19.3.0
- **preact**: preact 11.0.0
- **vue**: vue 3.5.43
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-noeffect | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 24.0 | 10.8 | 5.8 | 66.1 | 4.7 | 23.0 | 9.0 | 3.7 |
| counter | 24.1 | 10.9 | 5.8 | 66.2 | 5.7 | 23.4 | 9.9 | 4.3 |
| todo | 25.8 | 12.5 | 7.3 | 66.6 | 6.1 | 25.0 | 14.2 | 6.6 |
| search | 26.4 | 13.0 | 6.6 | 67.0 | 6.5 | 25.1 | 13.8 | 5.9 |
| form | 25.3 | 12.0 | 6.4 | 66.8 | 6.2 | 25.8 | 14.4 | 6.9 |
| table | 25.9 | 12.6 | 7.5 | 67.1 | 6.5 | 24.4 | 13.5 | 7.1 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-noeffect | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 21.7 | 9.8 | 5.2 | 57.0 | 4.3 | 21.0 | 8.2 | 3.4 |
| counter | 21.7 | 9.9 | 5.3 | 57.0 | 5.2 | 21.3 | 9.1 | 3.9 |
| todo | 23.2 | 11.3 | 6.6 | 57.3 | 5.5 | 22.8 | 12.9 | 6.0 |
| search | 23.7 | 11.8 | 6.0 | 57.7 | 6.0 | 22.9 | 12.6 | 5.3 |
| form | 22.8 | 10.9 | 5.8 | 57.5 | 5.6 | 23.5 | 13.1 | 6.3 |
| table | 23.3 | 11.4 | 6.8 | 57.9 | 5.9 | 22.2 | 12.3 | 6.5 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-noeffect | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 68.0 | 29.7 | 15.0 | 214.4 | 11.1 | 59.0 | 22.3 | 9.5 |
| counter | 68.3 | 30.0 | 15.2 | 214.7 | 13.5 | 60.0 | 24.9 | 10.8 |
| todo | 72.7 | 34.4 | 19.2 | 215.6 | 14.2 | 64.2 | 36.1 | 16.9 |
| search | 73.6 | 35.3 | 16.9 | 216.2 | 15.1 | 64.0 | 35.1 | 14.2 |
| form | 71.3 | 33.0 | 16.9 | 216.1 | 14.9 | 66.5 | 37.2 | 17.8 |
| table | 72.8 | 34.5 | 19.5 | 217.2 | 15.7 | 62.6 | 34.2 | 18.1 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-noeffect | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| floor | 24.3 | 11.0 | 6.0 | 66.3 | 5.0 | 23.2 | 9.2 | 4.0 |
| counter | 24.4 | 11.1 | 6.1 | 66.4 | 5.9 | 23.6 | 10.1 | 4.5 |
| todo | 26.1 | 12.7 | 7.5 | 66.8 | 6.3 | 25.3 | 14.4 | 6.8 |
| search | 26.6 | 13.3 | 6.8 | 67.2 | 6.7 | 25.3 | 14.1 | 6.1 |
| form | 25.5 | 12.3 | 6.7 | 67.0 | 6.5 | 26.0 | 14.6 | 7.2 |
| table | 26.1 | 12.8 | 7.7 | 67.3 | 6.7 | 24.6 | 13.7 | 7.3 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-noeffect | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 381.3 / 460.4 | 379.6 / 491.6 | 398.5 / 492.9 | 321.5 / 426.2 | 378.7 / 467.0 | 346.3 / 421.5 | **317.6 / 421.7** | 345.4 / 443.3 |
| replace 1,000 rows | 475.5 / 500.4 | 441.9 / 501.8 | 429.9 / 516.5 | 320.8 / 531.4 | 395.4 / 484.9 | 305.7 / 422.3 | 373.3 / 434.4 | **301.2 / 407.1** |
| update every 10th row | 73.4 / 90.0 | 74.3 / 80.0 | 73.6 / 78.1 | 72.9 / 77.2 | 85.1 / 89.7 | 70.7 / 78.3 | 71.5 / 91.7 | **67.7 / 72.0** |
| select row | 15.2 / 17.1 | 15.3 / 17.0 | 14.9 / 15.9 | 14.2 / 15.6 | 25.1 / 34.0 | 16.8 / 18.9 | 11.9 / 17.1 | **7.3 / 7.9** |
| swap rows | 36.6 / 37.5 | 36.7 / 45.0 | 36.6 / 41.7 | 208.9 / 225.5 | 45.0 / 51.7 | **25.5 / 26.9** | 25.7 / 27.3 | 30.3 / 32.8 |
| remove row | 49.0 / 56.3 | 48.6 / 57.4 | 49.0 / 53.1 | 45.9 / 51.2 | 59.3 / 65.5 | 52.7 / 61.9 | **41.9 / 47.1** | 47.5 / 55.4 |
| create 10,000 rows | 2771.5 / 2872.2 | 2733.8 / 2767.7 | 2748.7 / 2880.5 | 2996.9 / 3243.1 | 2510.7 / 2604.6 | 2351.4 / 2462.4 | **2112.6 / 2212.3** | 2253.3 / 2365.2 |
| append 1,000 rows | 331.8 / 343.7 | 337.5 / 352.0 | 333.3 / 339.5 | 304.4 / 324.9 | 333.9 / 347.8 | 290.9 / 303.1 | **271.5 / 283.4** | 299.1 / 311.3 |
| clear 1,000 rows | 36.4 / 42.4 | 36.3 / 37.0 | 35.4 / 36.6 | 31.3 / 34.0 | 25.3 / 26.3 | 29.4 / 31.4 | **22.2 / 23.4** | 23.8 / 24.9 |
| geometric mean of slowdown vs fastest | 1.39 | 1.38 | 1.37 | 1.53 | 1.45 | 1.20 | 1.09 | 1.07 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-noeffect | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 78.1 / 210.9 / 49.5 / 4.1 | 64.2 / 222.2 / 61.0 / 4.2 | 58.4 / 233.6 / 49.2 / 3.5 | 73.5 / 183.1 / 52.3 / 2.5 | 71.7 / 222.2 / 42.9 / 1.7 | 71.0 / 196.8 / 43.3 / 3.3 | 41.5 / 193.8 / 53.9 / 2.5 | 60.3 / 197.6 / 50.7 / 2.1 |
| replace 1,000 rows | 109.1 / 237.0 / 63.7 / 4.0 | 111.0 / 226.7 / 52.5 / 3.8 | 106.5 / 199.4 / 52.9 / 3.5 | 96.8 / 163.3 / 46.1 / 2.6 | 102.1 / 202.8 / 52.4 / 2.6 | 78.6 / 181.8 / 53.4 / 4.0 | 61.2 / 223.9 / 58.3 / 2.5 | 82.9 / 183.7 / 46.9 / 2.0 |
| update every 10th row | 4.4 / 40.1 / 26.8 / 2.2 | 4.3 / 40.5 / 26.3 / 2.4 | 3.5 / 40.8 / 26.5 / 2.1 | 7.0 / 39.7 / 24.8 / 1.2 | 18.4 / 39.9 / 24.8 / 1.2 | 4.4 / 39.4 / 25.9 / 1.5 | 4.8 / 41.0 / 23.8 / 1.5 | 2.9 / 39.2 / 24.5 / 1.2 |
| select row | 2.7 / 0.0 / 6.1 / 6.8 | 3.0 / 0.0 / 6.2 / 6.2 | 2.4 / 0.0 / 6.2 / 6.0 | 3.4 / 0.0 / 6.0 / 4.9 | 17.5 / 0.0 / 6.2 / 1.1 | 2.0 / 0.0 / 5.8 / 8.3 | 4.5 / 0.0 / 6.5 / 0.9 | 0.7 / 0.0 / 5.7 / 0.9 |
| swap rows | 2.8 / 14.2 / 17.7 / 1.8 | 2.8 / 14.0 / 18.0 / 1.8 | 2.4 / 14.2 / 18.3 / 2.0 | 35.5 / 134.5 / 36.6 / 1.4 | 18.9 / 12.0 / 10.9 / 1.1 | 2.1 / 11.7 / 10.5 / 1.3 | 2.6 / 11.4 / 10.6 / 1.4 | 7.1 / 11.5 / 10.4 / 1.6 |
| remove row | 4.1 / 13.1 / 30.8 / 2.5 | 4.1 / 13.3 / 30.4 / 2.1 | 3.9 / 13.2 / 30.4 / 2.1 | 6.2 / 11.3 / 27.6 / 1.6 | 18.9 / 11.8 / 27.3 / 1.6 | 10.8 / 11.7 / 27.7 / 2.8 | 2.8 / 11.3 / 26.8 / 1.4 | 7.0 / 11.3 / 27.9 / 1.4 |
| create 10,000 rows | 577.7 / 1772.7 / 402.1 / 11.7 | 568.9 / 1755.9 / 402.1 / 11.9 | 584.6 / 1779.5 / 366.4 / 11.8 | 1079.6 / 1613.8 / 307.9 / 5.1 | 583.0 / 1607.7 / 304.7 / 4.2 | 425.7 / 1615.5 / 306.4 / 5.2 | 271.5 / 1532.8 / 304.0 / 4.2 | 405.7 / 1543.7 / 308.4 / 4.4 |
| append 1,000 rows | 54.0 / 201.7 / 69.8 / 4.6 | 55.3 / 206.3 / 71.1 / 4.4 | 55.0 / 202.8 / 70.8 / 4.3 | 58.0 / 186.4 / 57.4 / 2.0 | 86.0 / 186.6 / 55.9 / 2.3 | 45.6 / 186.6 / 55.8 / 3.2 | 30.8 / 182.3 / 55.8 / 1.8 | 57.0 / 183.0 / 56.8 / 1.6 |
| clear 1,000 rows | 32.0 / 0.5 / 1.7 / 2.3 | 31.9 / 0.3 / 1.9 / 2.1 | 31.2 / 0.4 / 2.3 / 1.4 | 28.2 / 0.4 / 2.0 / 0.9 | 22.2 / 0.4 / 2.0 / 0.8 | 24.9 / 0.3 / 2.3 / 2.1 | 19.1 / 0.1 / 2.0 / 0.9 | 20.4 / 0.1 / 2.2 / 1.0 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-noeffect | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| after load | 1.36 | 1.24 | 1.20 | 1.55 | 1.17 | 1.32 | 1.19 | 1.13 |
| after creating 1,000 rows | 2.19 | 2.06 | 1.98 | 3.28 | 2.79 | 3.01 | 2.48 | 3.12 |
| after clearing them | 1.51 | 1.38 | 1.30 | 2.14 | 1.27 | 1.53 | 1.47 | 1.33 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-noeffect | lit | react | preact | vue | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| input rendered | 476 / 487 | 394 / 395 | 369 / 371 | 684 / 686 | 357 / 359 | 458 / 461 | 407 / 410 | 366 / 367 |
| first todo added (interactive) | 519 / 530 | 435 / 438 | 408 / 411 | 737 / 739 | 396 / 400 | 502 / 508 | 449 / 454 | 406 / 410 |
