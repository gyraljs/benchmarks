# Benchmark results, 2026-10-05 (lit-html-3.3.0)

> **Variant run: lit-html-3.3.0.** Compare only the frameworks measured in this run.

- Machine: Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz (12 cores), 31 GiB RAM, linux 6.11.0-29-generic
- Browser: Chromium 153.0.8010.12 (Playwright 1.63.0), headless
- Node v24.15.0, Vite 8.3.2; commit cc346e1-dirty
- Runtime: 15 runs after 5 warm-up per operation, CPU throttled 4x
- Memory: 5 runs. Startup: 15 runs, CPU 4x, network 150 ms RTT, 1.6 Mbit/s down

Framework versions:

- **gyral**: @gyral/core 0.1.0, @gyral/time 0.1.0, lit 3.3.3, lit-html 3.3.0
- **lit**: lit 3.3.3, lit-html 3.3.0

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

| App | gyral | lit |
| --- | ---: | ---: |
| floor | 49.2 | 5.8 |
| counter | 49.3 | 5.8 |
| todo | 51.0 | 7.3 |
| search | 51.7 | 6.6 |
| form | 50.6 | 6.4 |
| table | 51.1 | 7.5 |

## Bundle size: JavaScript, brotli quality 11 (KiB)

| App | gyral | lit |
| --- | ---: | ---: |
| floor | 43.5 | 5.2 |
| counter | 43.7 | 5.3 |
| todo | 45.0 | 6.6 |
| search | 45.6 | 6.0 |
| form | 44.6 | 5.8 |
| table | 45.1 | 6.8 |

## Bundle size: JavaScript, minified (KiB)

| App | gyral | lit |
| --- | ---: | ---: |
| floor | 150.3 | 15.0 |
| counter | 150.7 | 15.2 |
| todo | 155.1 | 19.2 |
| search | 155.9 | 16.9 |
| form | 153.7 | 16.9 |
| table | 155.1 | 19.5 |

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

| App | gyral | lit |
| --- | ---: | ---: |
| floor | 49.5 | 6.0 |
| counter | 49.6 | 6.1 |
| todo | 51.3 | 7.5 |
| search | 51.9 | 6.8 |
| form | 50.8 | 6.7 |
| table | 51.3 | 7.7 |

## Runtime: keyed table app (lower is better; fastest in bold)

Each time ends when the frame after the change has rendered, so it moves in steps of about
one frame (16.7 ms at 60 Hz). Differences smaller than a frame, as in "select row", mostly
reflect whether the work finished before the next frame started.

| Operation (median / p90, ms) | gyral | lit |
| --- | ---: | ---: |
| create 1,000 rows | **341.0 / 382.3** | 356.4 / 413.0 |
| replace 1,000 rows | 413.5 / 491.3 | **404.8 / 486.3** |
| update every 10th row | 82.2 / 97.1 | **79.5 / 123.1** |
| select row | 14.3 / 16.0 | **11.6 / 14.8** |
| swap rows | **36.7 / 47.1** | 38.0 / 63.4 |
| remove row | 57.9 / 79.1 | **56.2 / 63.1** |
| create 10,000 rows | 3274.3 / 3459.5 | **3251.8 / 3658.0** |
| append 1,000 rows | **420.0 / 556.1** | 422.1 / 506.7 |
| clear 1,000 rows | 56.1 / 81.7 | **51.8 / 56.7** |
| geometric mean of slowdown vs fastest | 1.04 | 1.01 |

## Memory: keyed table app

| JS heap (MB, median) | gyral | lit |
| --- | ---: | ---: |
| after load | 1.71 | 1.20 |
| after creating 1,000 rows | 2.54 | 1.98 |
| after clearing them | 1.86 | 1.30 |

## Startup: todo app, cold cache, throttled network and CPU

| Todo app startup (median / p90, ms) | gyral | lit |
| --- | ---: | ---: |
| input rendered | 633 / 660 | 379 / 396 |
| first todo added (interactive) | 679 / 693 | 425 / 465 |
