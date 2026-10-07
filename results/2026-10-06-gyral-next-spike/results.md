# Benchmark results, 2026-10-06 (gyral-next-spike)

> **Variant run: gyral-next-spike.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit 53b2978-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down
- Machine during the run: calibration spread 78.0% (limit 5%), max 1-min load 23.76 **FLAGGED (speed drifted, machine busy): compare frameworks within this run only.**

Framework versions:

- **gyral**: @gyral/core 0.2.0, @gyral/time 0.2.0, effect none, lit 3.3.3, lit-html 3.3.0
- **gyral-next**: @gyral/core 0.3.0-next, @gyral/time 0.3.0-next
- **lit**: lit 3.3.3, lit-html 3.3.0
- **svelte**: svelte 5.57.1
- **solid**: solid-js 1.9.15

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | gyral-next | lit | solid | svelte |
| --- | ---: | ---: | ---: | ---: | ---: |
| floor | 11.9 | 12.3 | 5.8 | 3.7 | 9.0 |
| counter | 12.0 | 12.4 | 5.8 | 4.3 | 9.9 |
| todo | 13.6 | 13.0 | 7.3 | 6.6 | 14.2 |
| search | 14.1 | 13.7 | 6.6 | 5.9 | 13.8 |
| form | 13.1 | 13.1 | 6.4 | 6.9 | 14.4 |
| table | 13.7 | 13.3 | 7.5 | 7.1 | 13.5 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | gyral-next | lit | solid | svelte |
| --- | ---: | ---: | ---: | ---: | ---: |
| floor | 10.8 | 11.1 | 5.2 | 3.4 | 8.2 |
| counter | 10.8 | 11.2 | 5.3 | 3.9 | 9.1 |
| todo | 12.3 | 11.7 | 6.6 | 6.0 | 12.9 |
| search | 12.8 | 12.4 | 6.0 | 5.3 | 12.6 |
| form | 11.8 | 11.9 | 5.8 | 6.3 | 13.1 |
| table | 12.4 | 12.1 | 6.8 | 6.5 | 12.3 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | gyral-next | lit | solid | svelte |
| --- | ---: | ---: | ---: | ---: | ---: |
| floor | 32.2 | 33.2 | 15.0 | 9.5 | 22.3 |
| counter | 32.5 | 33.6 | 15.2 | 10.8 | 24.9 |
| todo | 36.9 | 35.3 | 19.2 | 16.9 | 36.1 |
| search | 37.7 | 36.9 | 16.9 | 14.2 | 35.1 |
| form | 35.5 | 35.6 | 16.9 | 17.8 | 37.2 |
| table | 36.9 | 36.1 | 19.5 | 18.1 | 34.2 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | gyral-next | lit | solid | svelte |
| --- | ---: | ---: | ---: | ---: | ---: |
| floor | 12.1 | 12.5 | 6.0 | 4.0 | 9.2 |
| counter | 12.2 | 12.6 | 6.1 | 4.5 | 10.1 |
| todo | 13.8 | 13.2 | 7.5 | 6.8 | 14.4 |
| search | 14.4 | 13.9 | 6.8 | 6.1 | 14.1 |
| form | 13.3 | 13.4 | 6.7 | 7.2 | 14.6 |
| table | 13.9 | 13.5 | 7.7 | 7.3 | 13.7 |

## Runtime: keyed table app (lower is better; fastest in bold)

Trace-based timing: from the click's dispatch to the end of the Commit of the frame that
shows the result, read from a Chrome performance trace (as js-framework-benchmark does).

| Operation (median / p90, ms) | gyral | gyral-next | lit | solid | svelte |
| --- | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 244.9 / 280.3 | 245.9 / 281.3 | 280.4 / 303.7 | 245.9 / 322.4 | **236.6 / 273.4** |
| replace 1,000 rows | 302.9 / 373.1 | 300.7 / 402.7 | 357.5 / 476.2 | 308.3 / 362.5 | **274.4 / 346.1** |
| update every 10th row | 91.4 / 136.8 | 91.3 / 128.7 | 98.9 / 143.4 | **84.1 / 128.8** | 87.5 / 107.3 |
| select row | 14.3 / 18.3 | 15.2 / 18.6 | **13.5 / 16.9** | 17.2 / 19.9 | 16.9 / 23.8 |
| swap rows | 46.3 / 104.3 | 36.3 / 62.0 | 48.8 / 115.1 | 40.0 / 88.2 | **34.2 / 82.8** |
| remove row | 55.2 / 69.0 | 52.1 / 63.3 | 60.5 / 86.5 | 58.1 / 68.4 | **50.8 / 58.9** |
| create 10,000 rows | 5262.4 / 6205.8 | 5336.1 / 5508.1 | 6016.2 / 7148.3 | 5298.6 / 5823.4 | **5007.0 / 6019.0** |
| append 1,000 rows | 321.8 / 369.6 | 303.4 / 308.3 | 354.4 / 376.8 | 320.8 / 359.4 | **290.2 / 328.3** |
| clear 1,000 rows | 29.1 / 33.0 | **23.3 / 26.6** | 36.9 / 38.1 | 25.2 / 32.4 | 23.8 / 26.3 |
| geometric mean of slowdown vs fastest | 1.12 | 1.06 | 1.24 | 1.11 | 1.03 |

### Where the time goes (medians)

Script includes event handling, microtasks and timers; style+layout and paint are the
browser's rendering work. They can overlap where script forces a layout; idle is the part
of the total covered by none of them (mostly waiting for the next frame to start).

| Operation: script / style+layout / paint / idle (ms) | gyral | gyral-next | lit | solid | svelte |
| --- | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 42.8 / 160.2 / 40.8 / 3.0 | 35.4 / 160.6 / 40.0 / 2.1 | 58.3 / 171.8 / 46.5 / 3.5 | 48.1 / 156.1 / 39.8 / 1.7 | 30.9 / 162.6 / 41.7 / 2.0 |
| replace 1,000 rows | 74.5 / 172.3 / 46.7 / 3.8 | 59.8 / 178.3 / 46.1 / 2.4 | 98.7 / 192.7 / 54.0 / 3.9 | 77.0 / 170.5 / 45.6 / 2.3 | 54.9 / 168.8 / 45.8 / 2.0 |
| update every 10th row | 6.0 / 49.3 / 33.5 / 3.2 | 5.3 / 49.6 / 32.7 / 1.6 | 4.5 / 51.9 / 34.8 / 3.6 | 3.7 / 47.8 / 32.1 / 2.3 | 6.2 / 48.0 / 32.8 / 1.6 |
| select row | 3.6 / 0.1 / 7.6 / 1.9 | 3.1 / 0.1 / 8.1 / 2.5 | 2.8 / 0.0 / 7.5 / 2.4 | 1.1 / 0.0 / 8.1 / 5.8 | 7.2 / 0.1 / 8.0 / 1.8 |
| swap rows | 5.2 / 20.5 / 22.0 / 2.3 | 3.9 / 15.7 / 15.3 / 2.3 | 2.9 / 18.9 / 24.4 / 2.4 | 7.8 / 15.1 / 15.6 / 1.7 | 3.2 / 15.3 / 12.8 / 1.9 |
| remove row | 5.0 / 14.9 / 32.6 / 2.9 | 4.3 / 13.5 / 32.3 / 1.9 | 4.6 / 17.4 / 35.5 / 3.7 | 7.7 / 15.0 / 33.5 / 1.9 | 3.1 / 13.8 / 32.5 / 2.0 |
| create 10,000 rows | 1064.9 / 3577.6 / 600.9 / 10.4 | 907.5 / 3502.4 / 630.9 / 8.8 | 1514.1 / 3685.0 / 729.1 / 19.9 | 1029.2 / 3556.9 / 634.5 / 9.1 | 705.1 / 3537.5 / 620.8 / 6.7 |
| append 1,000 rows | 48.0 / 203.2 / 67.6 / 4.0 | 42.4 / 194.9 / 62.1 / 2.5 | 57.4 / 213.1 / 75.7 / 5.0 | 60.9 / 192.8 / 60.3 / 2.2 | 33.3 / 194.0 / 61.0 / 2.1 |
| clear 1,000 rows | 24.0 / 0.5 / 2.2 / 2.1 | 19.0 / 0.6 / 2.1 / 1.0 | 31.9 / 0.5 / 2.5 / 1.8 | 21.3 / 0.5 / 2.2 / 0.9 | 20.2 / 0.4 / 2.1 / 1.0 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | gyral-next | lit | solid | svelte |
| --- | ---: | ---: | ---: | ---: | ---: |
| after load | 1.26 | 1.20 | 1.20 | 1.13 | 1.19 |
| after creating 1,000 rows | 2.05 | 2.16 | 1.98 | 3.12 | 2.48 |
| after clearing them | 1.41 | 1.39 | 1.30 | 1.33 | 1.47 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | gyral-next | lit | solid | svelte |
| --- | ---: | ---: | ---: | ---: | ---: |
| input rendered | 525 / 571 | 506 / 542 | 499 / 592 | 475 / 539 | 536 / 637 |
| first todo added (interactive) | 660 / 756 | 608 / 669 | 598 / 687 | 593 / 662 | 651 / 725 |
