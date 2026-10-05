## Gyral across runs

### Bundle: JavaScript gzip (KiB)

| App | A (0.1.0, Effect 3, lit-html 3.3.3) | B (0.1.0, Effect 3, lit-html 3.3.0) | C (exp branch, Effect 4, lit-html 3.3.0) |
| --- | ---: | ---: | ---: |
| floor | 49.3 | 49.2 | 24.0 |
| counter | 49.4 | 49.3 | 24.1 |
| todo | 51.0 | 51.0 | 25.8 |
| search | 51.6 | 51.7 | 26.4 |
| form | 50.6 | 50.6 | 25.3 |
| table | 51.1 | 51.1 | 25.9 |

### Bundle: JavaScript brotli (KiB)

| App | A (0.1.0, Effect 3, lit-html 3.3.3) | B (0.1.0, Effect 3, lit-html 3.3.0) | C (exp branch, Effect 4, lit-html 3.3.0) |
| --- | ---: | ---: | ---: |
| floor | 43.6 | 43.5 | 21.7 |
| counter | 43.6 | 43.7 | 21.7 |
| todo | 45.0 | 45.0 | 23.2 |
| search | 45.6 | 45.6 | 23.7 |
| form | 44.6 | 44.6 | 22.8 |
| table | 45.2 | 45.1 | 23.3 |

### Startup, todo app, CPU 4x + network throttled (ms, median / p90)

| Milestone | A (0.1.0, Effect 3, lit-html 3.3.3) | B (0.1.0, Effect 3, lit-html 3.3.0) | C (exp branch, Effect 4, lit-html 3.3.0) |
| --- | ---: | ---: | ---: |
| rendered | 657 / 711 | 633 / 660 | 475 / 476 |
| interactive | 725 / 779 | 679 / 693 | 516 / 519 |

### Table runtime, CPU 4x (ms, median / p90)

| Operation | A (0.1.0, Effect 3, lit-html 3.3.3) | B (0.1.0, Effect 3, lit-html 3.3.0) | C (exp branch, Effect 4, lit-html 3.3.0) |
| --- | ---: | ---: | ---: |
| create1k | 357.4 / 428.1 | 341.0 / 382.3 | 292.9 / 296.1 |
| replace1k | 2230.5 / 3439.2 | 413.5 / 491.3 | 373.1 / 404.3 |
| update10th | 80.3 / 88.5 | 82.2 / 97.1 | 74.2 / 78.8 |
| select | 13.4 / 16.9 | 14.3 / 16.0 | 16.5 / 18.4 |
| swap | 39.2 / 53.4 | 36.7 / 47.1 | 34.5 / 36.9 |
| remove | 56.1 / 66.8 | 57.9 / 79.1 | 49.1 / 63.5 |
| create10k | 2963.6 / 4870.5 | 3274.3 / 3459.5 | 2654.8 / 2764.1 |
| append1k | 436.0 / 564.5 | 420.0 / 556.1 | 369.5 / 378.9 |
| clear1k | 3746.1 / 7668.3 | 56.1 / 81.7 | 46.2 / 49.2 |

### JS heap (MB, median)

| Point | A (0.1.0, Effect 3, lit-html 3.3.3) | B (0.1.0, Effect 3, lit-html 3.3.0) | C (exp branch, Effect 4, lit-html 3.3.0) |
| --- | ---: | ---: | ---: |
| ready | 1.71 | 1.71 | 1.36 |
| after1k | 2.54 | 2.54 | 2.19 |
| afterClear | 1.88 | 1.86 | 1.51 |

Sources:

- **A (0.1.0, Effect 3, lit-html 3.3.3)**: `results/2026-10-05`
- **B (0.1.0, Effect 3, lit-html 3.3.0)**: `results/2026-10-05-lit-html-3.3.0`
- **C (exp branch, Effect 4, lit-html 3.3.0)**: `results/2026-10-05-lit-html-3.3.0-effect4`
