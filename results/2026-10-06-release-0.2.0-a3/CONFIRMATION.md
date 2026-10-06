# Gyral 0.2.0 candidate: confirmation run

Branch `release/0.2.0` of gyraljs/gyral (commit 74054b3): hand-written runtime (no Effect),
template whitespace minification, lit-html 3.3.0. Packed as `vendor/gyral-*-0.2.0-rc.tgz`
(the tarballs still report version 0.1.0; `changeset version` has not run). Trace timing,
15 runs after 5 warm-up, CPU 4x, all seven frameworks in one session.

## Run quality

All three attempts were flagged by the drift guard, because other work was running on the
machine. **Attempt 3 is the reported run** (calibration spread 6.8% against a 5% limit, peak
load 4.16, the lowest of the three). Attempts 1 (5.3%, load 8.04) and 2 (22.1%, load 6.49)
are kept. Gyral's position against every framework is the same in all three, and sizes and
memory do not depend on timing. Compare frameworks within one run, not across runs.

## Against the report's projections

| Measure | Projected | Measured (a3) | Range a1–a3 | Verdict |
| --- | ---: | ---: | ---: | --- |
| JS gzip, empty app (KiB) | ≈ 11.9 | 11.9 | 11.9 | matches |
| JS gzip, todo app (KiB) | ≈ 13.6 | 13.6 | 13.6 | matches |
| Todo app interactive (ms) | ≈ 438 | 442 | — | matches (Lit 406, gap +36) |
| JS heap after load (MB) | 1.24 | 1.26 | — | matches (+0.02) |
| Clear 1,000 rows (ms) | ≈ 28 | 27.9 | 27.9–29.7 | matches |
| Replace 1,000 rows (ms) | ≈ 252 | 249.3 | 249.3–262.9 | matches |
| Create 1,000 rows (ms) | ≈ 226 | 232.2 | 232.2–244.3 | 3% slower than projected |
| Create 10,000 rows (ms) | ≈ 2,305 | 2,303.3 | 2,303–2,606 | matches |
| Select row (ms) | ≈ 15.7 | 16.7 | 15.7–17.2 | 1 ms slower; Lit 15.0 in the same run |

## Against the other frameworks (a3)

| | Gyral 0.2.0 rc | Lit | React | Preact | Vue | Svelte | Solid |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| JS gzip, todo (KiB) | 13.6 | 7.3 | 66.6 | 6.1 | 25.0 | 14.2 | 6.6 |
| Todo interactive (ms) | 442 | 406 | 732 | 395 | 502 | 448 | 405 |
| Table geometric mean vs fastest | **1.20** | 1.34 | 1.54 | 1.41 | **1.20** | 1.06 | 1.07 |
| Heap after load (MB) | 1.26 | 1.20 | 1.55 | 1.17 | 1.32 | 1.19 | 1.13 |

- **Gyral is now faster than Lit** on every table operation except select (geometric mean 1.20
  vs 1.34), because minified templates create fewer DOM nodes: create 10,000 rows spends
  1,578 ms in style and layout against Lit's 1,759.
- **Gyral ties Vue** on the overall table score and beats React and Preact.
- **Gyral matches Solid** on create 1,000 (232 vs 234), replace (249 vs 253), append (290 vs
  292) and is close on create 10,000 (2,303 vs 2,242).
- **Smaller than Svelte** on every app except the empty and counter apps.
- **Select row** stays the one weak spot: 16.7 ms, against 15.0 for Lit and 7.6 for Solid.
  Script is 2.8 ms; the rest is waiting for the frame (idle 6.5 ms), as in the profiling.
