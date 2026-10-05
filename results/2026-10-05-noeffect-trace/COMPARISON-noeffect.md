# Gyral with and without Effect (gyral-das)

Run `noeffect-trace`, commit `9d77c4f-dirty`, 15 runs per op, CPU 4x, trace timing, lit-html 3.3.0 for Lit and both Gyral builds. Both Gyral builds use the same app sources (`frameworks/gyral-noeffect/apps` is a symlink).

Machine drift: spread 8.6% (limit 5%), max load 11.04, **FLAGGED**.

## Bundle size (JS, gzip KiB)

| App | Gyral (Effect 4) | Gyral (no Effect) | Lit | Svelte | Solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| floor | 24.0 | 10.8 | 5.8 | 9.0 | 3.7 |
| counter | 24.1 | 10.9 | 5.8 | 9.9 | 4.3 |
| todo | 25.8 | 12.5 | 7.3 | 14.2 | 6.6 |
| search | 26.4 | 13.0 | 6.6 | 13.8 | 5.9 |
| form | 25.3 | 12.0 | 6.4 | 14.4 | 6.9 |
| table | 25.9 | 12.6 | 7.5 | 13.5 | 7.1 |

## Startup (todo app, ms, median)

| Metric | Gyral (Effect 4) | Gyral (no Effect) | Lit | Svelte | Solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| rendered | 476.1 | 393.6 | 368.8 | 407.2 | 365.5 |
| interactive | 518.8 | 434.8 | 407.6 | 448.6 | 406.3 |

## Memory (JS heap MB, median)

| When | Gyral (Effect 4) | Gyral (no Effect) | Lit | Svelte | Solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| ready | 1.36 | 1.24 | 1.20 | 1.19 | 1.13 |
| after1k | 2.19 | 2.06 | 1.98 | 2.48 | 3.12 |
| afterClear | 1.51 | 1.38 | 1.30 | 1.47 | 1.33 |

## Table operations (ms, median / p90)

| Op | Gyral (Effect 4) | Gyral (no Effect) | Lit | Svelte | Solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| create1k | 381.3 / 460.4 | 379.6 / 491.6 | 398.5 / 492.9 | 317.6 / 421.7 | 345.4 / 443.3 |
| replace1k | 475.5 / 500.4 | 441.9 / 501.8 | 429.9 / 516.5 | 373.3 / 434.4 | 301.2 / 407.1 |
| update10th | 73.4 / 90.0 | 74.3 / 80.0 | 73.6 / 78.1 | 71.5 / 91.7 | 67.7 / 72.0 |
| select | 15.2 / 17.1 | 15.3 / 17.0 | 14.9 / 15.9 | 11.9 / 17.1 | 7.3 / 7.9 |
| swap | 36.6 / 37.5 | 36.7 / 45.0 | 36.6 / 41.7 | 25.7 / 27.3 | 30.3 / 32.8 |
| remove | 49.0 / 56.3 | 48.6 / 57.4 | 49.0 / 53.1 | 41.9 / 47.1 | 47.5 / 55.4 |
| create10k | 2771.5 / 2872.2 | 2733.8 / 2767.7 | 2748.7 / 2880.5 | 2112.6 / 2212.3 | 2253.3 / 2365.2 |
| append1k | 331.8 / 343.7 | 337.5 / 352.0 | 333.3 / 339.5 | 271.5 / 283.4 | 299.1 / 311.3 |
| clear1k | 36.4 / 42.4 | 36.3 / 37.0 | 35.4 / 36.6 | 22.2 / 23.4 | 23.8 / 24.9 |

## Where the time goes (median ms: script / style+layout / paint)

| Op | Gyral (Effect 4) | Gyral (no Effect) | Lit | Svelte | Solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| create1k | 78.1 / 210.9 / 49.5 | 64.2 / 222.2 / 61.0 | 58.4 / 233.6 / 49.2 | 41.5 / 193.8 / 53.9 | 60.3 / 197.6 / 50.7 |
| replace1k | 109.1 / 237.0 / 63.7 | 111.0 / 226.7 / 52.5 | 106.5 / 199.4 / 52.9 | 61.2 / 223.9 / 58.3 | 82.9 / 183.7 / 46.9 |
| update10th | 4.4 / 40.1 / 26.8 | 4.3 / 40.5 / 26.3 | 3.5 / 40.8 / 26.5 | 4.8 / 41.0 / 23.8 | 2.9 / 39.2 / 24.5 |
| select | 2.7 / 0.0 / 6.1 | 3.0 / 0.0 / 6.2 | 2.4 / 0.0 / 6.2 | 4.5 / 0.0 / 6.5 | 0.7 / 0.0 / 5.7 |
| swap | 2.8 / 14.2 / 17.7 | 2.8 / 14.0 / 18.0 | 2.4 / 14.2 / 18.3 | 2.6 / 11.4 / 10.6 | 7.1 / 11.5 / 10.4 |
| remove | 4.1 / 13.1 / 30.8 | 4.1 / 13.3 / 30.4 | 3.9 / 13.2 / 30.4 | 2.8 / 11.3 / 26.8 | 7.0 / 11.3 / 27.9 |
| create10k | 577.7 / 1772.7 / 402.1 | 568.9 / 1755.9 / 402.1 | 584.6 / 1779.5 / 366.4 | 271.5 / 1532.8 / 304.0 | 405.7 / 1543.7 / 308.4 |
| append1k | 54.0 / 201.7 / 69.8 | 55.3 / 206.3 / 71.1 | 55.0 / 202.8 / 70.8 | 30.8 / 182.3 / 55.8 | 57.0 / 183.0 / 56.8 |
| clear1k | 32.0 / 0.5 / 1.7 | 31.9 / 0.3 / 1.9 | 31.2 / 0.4 / 2.3 | 19.1 / 0.1 / 2.0 | 20.4 / 0.1 / 2.2 |

## Table runtime, geometric mean vs fastest (all frameworks in this run)

| Gyral (Effect 4) | Gyral (no Effect) | Lit | React | Preact | Vue | Svelte | Solid |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1.39 | 1.38 | 1.37 | 1.53 | 1.45 | 1.20 | 1.09 | 1.07 |
