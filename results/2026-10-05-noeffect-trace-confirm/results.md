# Benchmark results, 2026-10-05 (noeffect-trace-confirm)

> **Variant run: noeffect-trace-confirm.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 0704355-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 4.0% (limit 5%), max 1-min load 9.75 **FLAGGED (machine busy): compare frameworks within this run only.**

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, effect 4.0.1, lit 3.3.3, lit-html 3.3.0
- **gyral-noeffect**: @gyral/core-noeffect 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-noeffect | lit |
| --- | ---: | ---: | ---: |
| floor | 24.0 | 10.8 | 5.8 |
| counter | 24.1 | 10.9 | 5.8 |
| todo | 25.8 | 12.5 | 7.3 |
| search | 26.4 | 13.0 | 6.6 |
| form | 25.3 | 12.0 | 6.4 |
| table | 25.9 | 12.6 | 7.5 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-noeffect | lit |
| --- | ---: | ---: | ---: |
| floor | 21.7 | 9.8 | 5.2 |
| counter | 21.7 | 9.9 | 5.3 |
| todo | 23.2 | 11.3 | 6.6 |
| search | 23.7 | 11.8 | 6.0 |
| form | 22.8 | 10.9 | 5.8 |
| table | 23.3 | 11.4 | 6.8 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-noeffect | lit |
| --- | ---: | ---: | ---: |
| floor | 68.0 | 29.7 | 15.0 |
| counter | 68.3 | 30.0 | 15.2 |
| todo | 72.7 | 34.4 | 19.2 |
| search | 73.6 | 35.3 | 16.9 |
| form | 71.3 | 33.0 | 16.9 |
| table | 72.8 | 34.5 | 19.5 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-noeffect | lit |
| --- | ---: | ---: | ---: |
| floor | 24.3 | 11.0 | 6.0 |
| counter | 24.4 | 11.1 | 6.1 |
| todo | 26.1 | 12.7 | 7.5 |
| search | 26.6 | 13.3 | 6.8 |
| form | 25.5 | 12.3 | 6.7 |
| table | 26.1 | 12.8 | 7.7 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-noeffect | lit |
| --- | ---: | ---: | ---: |
| create 1,000 rows | 262.6 / 274.0 | **260.7 / 274.4** | 268.4 / 273.8 |
| replace 1,000 rows | 309.8 / 323.8 | 309.5 / 325.6 | **308.2 / 316.3** |
| update every 10th row | **76.9 / 92.0** | 77.5 / 86.3 | 77.2 / 93.7 |
| select row | 21.3 / 27.1 | 19.0 / 26.5 | **18.8 / 26.0** |
| swap rows | 68.4 / 88.7 | **67.4 / 102.0** | 72.7 / 87.2 |
| remove row | 92.0 / 120.0 | 90.9 / 114.8 | **85.9 / 108.8** |
| create 10,000 rows | **3027.9 / 4508.8** | 3200.0 / 4731.0 | 3128.5 / 4705.5 |
| append 1,000 rows | 344.4 / 387.1 | **340.5 / 379.8** | 341.0 / 377.3 |
| clear 1,000 rows | 36.8 / 37.7 | **36.1 / 37.5** | 36.2 / 37.3 |
| geometric mean of slowdown vs fastest | 1.03 | 1.01 | 1.02 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-noeffect | lit |
| --- | ---: | ---: | ---: |
| create 1,000 rows | 53.1 / 163.0 / 40.9 / 3.4 | 52.8 / 164.6 / 41.5 / 3.1 | 57.6 / 165.3 / 40.5 / 3.3 |
| replace 1,000 rows | 86.2 / 171.3 / 47.9 / 3.8 | 87.4 / 173.2 / 47.2 / 3.7 | 86.4 / 169.5 / 47.0 / 3.6 |
| update every 10th row | 4.2 / 44.0 / 27.6 / 2.4 | 4.1 / 42.6 / 28.5 / 2.1 | 3.7 / 42.7 / 27.6 / 2.3 |
| select row | 4.8 / 0.1 / 11.5 / 3.3 | 4.6 / 0.3 / 11.2 / 2.9 | 3.9 / 0.1 / 11.6 / 3.5 |
| swap rows | 4.4 / 24.8 / 31.3 / 3.2 | 4.1 / 27.2 / 32.9 / 4.0 | 4.2 / 30.9 / 35.9 / 3.7 |
| remove row | 7.5 / 24.1 / 50.4 / 5.9 | 6.2 / 23.7 / 55.2 / 4.6 | 5.9 / 23.8 / 50.8 / 4.6 |
| create 10,000 rows | 652.5 / 1922.7 / 465.2 / 13.0 | 635.2 / 2035.2 / 479.3 / 13.6 | 649.7 / 1971.4 / 566.0 / 15.0 |
| append 1,000 rows | 59.4 / 208.6 / 72.5 / 4.7 | 57.3 / 207.7 / 69.7 / 4.7 | 58.4 / 207.5 / 70.8 / 4.4 |
| clear 1,000 rows | 31.9 / 0.5 / 2.2 / 2.0 | 31.8 / 0.4 / 1.9 / 1.9 | 31.3 / 0.6 / 2.5 / 1.8 |
