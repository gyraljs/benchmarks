# Notes: trace-based run on the experiment builds (2026-10-05)

- **Timing:** trace-based (the default from commit `11c7161`), see
  [docs/methodology.md](../../docs/methodology.md#trace-based-timing-default-since-2026-10-05).
  Validated in [../2026-10-05-timing-validation/VALIDATION.md](../2026-10-05-timing-validation/VALIDATION.md):
  a known busy loop measures within ±2 ms at CPU 1x and 4x.
- **Builds:** identical to run C ([../2026-10-05-lit-html-3.3.0-effect4/](../2026-10-05-lit-html-3.3.0-effect4/)):
  Gyral from the local experiment branch (`vendor/`, Effect 4.0.1) and lit-html pinned to 3.3.0
  for Lit and Gyral. Not the published Gyral 0.1.0.
- **Machine:** calibration spread 2.9% over the run, max 1-minute load 3.22 on 12 cores: not
  flagged. Run C (frame timing) was taken in an earlier session and is not directly comparable
  in milliseconds; compare rankings, which are within-run.
- **Gyral 0.1.0 from npm was not re-run** with trace timing: the workspace overrides point
  every `@gyral/*` import at the experiment tarballs, so a second Gyral install would need its
  own package and scoped overrides. Its frame-timed results remain in `../2026-10-05/` and
  `../2026-10-05-lit-html-3.3.0/`.

## Ranking against the frame-timed run C

[RANKING.md](RANKING.md) (`node scripts/rank-compare.mjs`) lists every operation. 36 of 63
per-operation ranks changed; most are frameworks within a few percent of each other swapping
places. The changes with a cause:

- **Select row:** the frame end point missed the repaint of the selected row for the fastest
  frameworks (Solid 1.5 ms, Vue 2.9, Svelte 4.8 in run C). The trace includes it (about 6.5 ms
  of paint for every framework at 4x), so the order now follows script time plus waiting for
  the frame: Solid 8.1, Svelte 12.5, React 13.2, Lit 14.1, Gyral 14.6, Vue 16.6, Preact 26.8.
  Preact is last because its table re-renders every row (no `memo`, see docs/apps.md): 19 ms
  of script.
- **Swap rows:** Vue, Svelte and Solid now lead (26–31 ms) ahead of Lit and Gyral (37–38 ms).
  The breakdown shows why: Lit and Gyral spend about 14.5 ms in style+layout and 18.5 ms in
  paint, against about 12 and 11 ms for Vue, Svelte, Solid and Preact. (React's swap is
  pathological in every run: about 216 ms, 139 of it style+layout.)
- **Overall (geometric mean):** Svelte 1.05, Solid 1.07, Vue 1.19, Lit 1.31, **Gyral 1.33**,
  Preact 1.40, React 1.54. Gyral moved from 1.61 to 1.33 and is now ahead of Preact and React;
  Svelte overtook Solid.

## What the breakdown says about Gyral

- **Script time is competitive.** Gyral's script time is close to Solid's on most operations
  (create 1,000: 51.4 vs 48.1 ms; replace: 86.9 vs 70.5; update every 10th: 4.9 vs 3.0) and
  equal to Lit's. Intents, messages and the Effect 4 interpreter add little.
- **The gap is rendering work in the browser.** Lit and Gyral spend more time in style+layout
  and paint than the other five on the operations that change many rows: create 1,000 rows
  168 ms style+layout vs 151–154; create 10,000 1,877 vs 1,592–1,716 ms style+layout and 434 vs
  314–330 ms paint. Lit and Gyral are the two implementations rendered inside a shadow root
  (the others render to the light DOM), so shadow-DOM style scoping and Lit's comment markers
  are the first suspects. That is a question for profiling (Gyral bead gyral-1kq), not a
  conclusion of this run.
- **Clear 1,000 rows** (38.5 ms vs Svelte 24.0) is mostly script (33.8 ms): Lit's removal of
  1,000 parts.

## Other metrics in this run

Startup and memory use unchanged methods: todo app interactive Gyral 528 ms vs Lit 410, Solid
409, Preact 406, Svelte 453, Vue 509, React 747; JS heap after load Gyral 1.36 MB (Lit 1.20).
Todo app JS gzip: Gyral 25.8 KiB (Vue 25.0, Svelte 14.2, Lit 7.3).
