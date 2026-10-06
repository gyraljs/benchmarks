# Template whitespace minification (gyral-9rf)

**Builds.** `gyral` = Gyral branch `exp/lit330-effect4` (Effect 4, lit-html 3.3.0).
`gyral-ws` = Gyral branch `exp/whitespace` (`ec6bc52` + `4464441`): the same plus `html`/`svg`
template whitespace minification. Same app sources (symlinked). Lit, Svelte, Solid unchanged.
Trace timing, CPU 4x, N=15 interleaved, every run under `flock /tmp/gyral-bench.lock`.

**Runs.**
- `results/2026-10-05-whitespace/`: full run, gyral, gyral-ws, lit, svelte, solid. Machine drift
  7.8% (FLAGGED, limit 5%) — compare within the run only.
- `results/2026-10-05-whitespace-confirm/`: runtime only, gyral, gyral-ws, solid. Drift 3.6%
  (not flagged).

## Table operations, median ms (lower is better)

| Operation | gyral (full) | gyral-ws (full) | change | gyral (confirm) | gyral-ws (confirm) | change | solid (confirm) | svelte (full) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1,000 rows | 260.0 | 232.4 | −10.6% | 266.3 | 233.8 | −12.2% | 235.9 | 213.1 |
| replace 1,000 rows | 337.4 | 281.0 | −16.7% | 300.1 | 259.3 | −13.6% | 261.8 | 266.9 |
| update every 10th row | 76.0 | 74.9 | −1.3% | 74.3 | 72.6 | −2.3% | 70.0 | 72.7 |
| select row | 13.1 | 16.2 | +23% | 14.9 | 16.3 | +9.5% | 8.0 | 15.4 |
| swap rows | 41.3 | 38.3 | −7.1% | 38.7 | 33.5 | −13.4% | 30.9 | 29.2 |
| remove row | 58.2 | 53.0 | −9.1% | 54.6 | 51.5 | −5.6% | 51.8 | 51.5 |
| create 10,000 rows | 2778.1 | 2367.2 | −14.8% | 2819.1 | 2377.3 | −15.7% | 2314.3 | 2131.7 |
| append 1,000 rows | 329.2 | 298.8 | −9.2% | 359.5 | 326.5 | −9.2% | 350.7 | 270.3 |
| clear 1,000 rows | 35.8 | 27.8 | −22.2% | 37.4 | 29.1 | −22.2% | 26.0 | 21.8 |

In the unflagged confirming run Gyral with minified templates is within 1% of Solid on create
1k, replace and remove, 2.7% behind on create 10k, 7% faster on append, and behind on swap
(+8.6%), clear (+12%) and select.

**Select row is slower in both runs** (+1.4 to +3.0 ms). Select is 2–3 ms of script and
mostly idle time before the next frame (gyral-1kq, gyral-xal), so this is likely frame
alignment rather than work, but it is consistent across two runs and not explained yet.

## Size, startup, memory (full run)

| | gyral | gyral-ws | lit | svelte | solid |
| --- | ---: | ---: | ---: | ---: | ---: |
| JS gzip, todo app (KiB) | 25.8 | 26.9 | 7.3 | 14.2 | 6.6 |
| JS gzip, table app (KiB) | 25.9 | 27.0 | 7.5 | 13.5 | 7.1 |
| Todo app interactive (ms) | 514.9 | 519.3 | 406.7 | 447.8 | 406.1 |
| Heap after load (MB) | 1.36 | 1.39 | 1.20 | 1.19 | 1.13 |
| Heap with 1k rows (MB) | 2.19 | 2.20 | 1.98 | 2.48 | 3.11 |

The minifier costs **+1.1 KiB gzip** on every app (about 2.5 KiB minified) and no measurable
startup time (+4 ms, within noise). One-time cost per template call site: about 11 µs
(Node microbenchmark, benchmark table row).

## Caveats

- Single machine (i5-10400), headless Chromium; the full run was drift-flagged.
- Correctness spec passes for `gyral-ws` (52/52 total).
