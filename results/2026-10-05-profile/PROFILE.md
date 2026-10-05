# Where Gyral's and Lit's table time goes (2026-10-05)

Bead gyral-1kq. Builds: Gyral from the `exp/lit330-effect4` branch (Effect 4.0.1, vendor/
tarballs), Lit 3.3.3 with lit-html pinned to 3.3.0 (the leak fix), Svelte and Solid as light-DOM
references. Method: [docs/profile.md](../../docs/profile.md). Every timed run held the machine
lock (`flock /tmp/gyral-bench.lock`) and waited for a 1-minute load ≤ 3 before each sample.

- `variants-final.{md,json}`: trace timing, CPU 4x, 10 runs after 2 warm-ups, interleaved.
  Drift spread 4.2%, peak load 2.7: **not flagged**. A first run of the same variants was
  flagged (load 11 from Chromium runs outside the lock) and was deleted, not used.
- `nodes.{md,json}`: DOM nodes per row, every framework.
- `cpu.{md,json}`: V8 CPU profiles (100 µs sampling), 7 samples per operation after a warm-up,
  on unminified one-file-per-module builds so samples map to lit-html, @gyral/core, effect or
  the app.

## Starting point

The trace run on these builds put Gyral and Lit about 1.3x slower than the fastest framework,
with script time close to Solid's: the gap was style+layout and paint. Lit and Gyral are the
only two that render inside a shadow root, so that was the first suspect.

## (d) DOM nodes per row: the cause

| app | shadow root | elements | text | whitespace-only text | comments | total |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Svelte, Solid, React, Preact, Vue | no | 6 | 3 | 0 | 0 | **9** |
| Lit, Gyral (benchmark apps) | yes | 6 | 3 | 12 | 4 | **25** |
| Lit / Gyral, compact template | either | 6 | 3 | 0 | 4 | **13** |

Lit and Gyral rows carry **2.8x the DOM nodes** of every other framework. 12 of the extra 16
are whitespace-only text nodes: lit-html keeps a template's indentation and line breaks as
text, while JSX, Svelte and Vue drop whitespace between tags at compile time. The other 4 are
lit-html's part markers (comments), which are how it finds bindings.

## (a, b, c, d) Timing the variants

Median ms, trace timing (`variants-final.md` has p90 and the full breakdown).

| variant | create 1k | replace 1k | update 10th | select | swap | create 10k | clear 1k |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| lit (benchmark app) | 266.1 | 306.2 | 76.6 | 15.2 | 39.4 | 2825.8 | 36.8 |
| lit shadow | 267.1 | 299.8 | 77.0 | 14.7 | 39.1 | 2805.2 | 36.5 |
| lit light | 266.2 | 301.0 | 75.9 | 15.2 | 39.5 | 2788.0 | 36.4 |
| lit shadow compact | 236.0 | 261.2 | 76.6 | 17.2 | 32.7 | 2465.9 | 27.9 |
| lit light compact | 240.3 | 263.2 | 73.1 | 17.9 | 32.9 | 2443.1 | 28.1 |
| gyral shadow | 263.1 | 311.5 | 79.3 | 15.3 | 40.2 | 2833.5 | 37.6 |
| gyral light (`shadow: false`) | 260.6 | 307.1 | 78.2 | 15.6 | 37.1 | 2808.6 | 37.6 |
| **gyral light compact** | **229.0** | **261.6** | 74.3 | 13.2 | 34.4 | **2423.1** | 29.8 |
| svelte | 217.1 | 247.1 | 72.4 | 13.4 | 26.9 | 2164.3 | 22.8 |
| solid | 237.8 | 262.6 | 72.0 | 7.3 | 31.6 | 2333.5 | 24.4 |

Breakdown for create 10,000 rows (median ms):

| variant | script | style+layout | paint |
| --- | ---: | ---: | ---: |
| gyral shadow | 590.2 | 1818.1 | 410.0 |
| gyral light compact | 415.2 | 1668.0 | 317.5 |
| svelte | 273.4 | 1585.5 | 308.0 |
| solid | 422.5 | 1597.6 | 306.3 |

With CSS (same rules adopted in the shadow root vs a document stylesheet in light DOM):

| variant | create 1k | update 10th | select | swap | create 10k |
| --- | ---: | ---: | ---: | ---: | ---: |
| lit shadow css | 259.9 | 96.2 | 10.5 | 40.4 | 2795.3 |
| lit light css | 258.6 | 96.7 | 10.2 | 41.7 | 2790.9 |

### Findings

1. **Shadow DOM costs nothing measurable here** (high confidence). Shadow vs light differs by
   less than the run-to-run spread for Lit and Gyral on every operation, with and without CSS.
   Gyral's `shadow: false` alone changes nothing.
2. **Scoped styles cost nothing extra** (high confidence). The same CSS in an adopted shadow
   stylesheet and in a document stylesheet time the same. CSS makes "update every 10th" slower
   (≈ 96 vs 77 ms, more style work) for both equally.
3. **Whitespace text nodes are the main cost** (high confidence). Removing them (compact
   templates, same 6 elements and 3 texts) cuts create 1k by 11–13%, replace by 13–16%, swap by
   about 15%, create 10k by 12–14% and clear by 21–24%, through less script (fewer nodes to
   clone and insert), less style+layout and less paint. **Compact Gyral is at Solid's level**:
   faster on create 1k (229 vs 238), equal on replace (262 vs 263), within 4% on create 10k,
   and behind on clear (+5 ms), swap (+3 ms) and select.
4. **What remains vs Svelte** (medium confidence): about 140 ms more script and 80 ms more
   style+layout on create 10k, and +7 ms on clear. Candidates are lit-html's 4 comment markers
   per row and its template-instance work; not isolated in this run.
5. **Select** is 13–18 ms for Lit and Gyral vs 7 ms for Solid, but script is only 2–3 ms; the
   rest is idle time before the frame (low confidence on why: likely when Lit's microtask
   update lands relative to the frame).

## (e) CPU profiles: what the JavaScript is

JS self time by module, median of 7, CPU 4x (`cpu.md` has the top functions):

| operation | | app | gyral core | effect | lit-html | native DOM | gc |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| create 1k | gyral | 1.1 | 0.4 | 0 | 14.4 | 55.9 | 11.9 |
| | lit | 0.7 | — | — | 18.3 | 52.3 | 13.8 |
| update 10th | gyral | 0.4 | 0.9 | 0 | 5.2 | 0.9 | 0 |
| | lit | 0.4 | — | — | 5.2 | 0.8 | 0 |
| select | gyral | 0.5 | 1.1 | 0 | 4.3 | 0.5 | 0 |
| | lit | 0.4 | — | — | 4.2 | 0.9 | 0 |
| swap | gyral | 0.5 | 0.9 | 0 | 3.6 | 2.4 | 0 |
| | lit | 0.8 | — | — | 4.1 | 2.1 | 0 |

- **Gyral's own layer costs about 1 ms or less per operation** (intent parsing, dispatch,
  update, view call), and **Effect never runs**: the table issues no commands. MVI is not where
  the time goes (high confidence).
- **Most JS time is native DOM work that lit-html calls**: create 1k is led by `importNode`
  (25.7 ms), `insertBefore` (15.0), `setAttribute` (5.6), `nextNode` (3.2),
  `createTextNode` (2.5) and `createComment` (1.5). Cloning and walking more nodes per row costs directly here, which is
  why the whitespace nodes show up in script time too.
- The "program" bucket (style, layout, paint outside JS) is 259–267 ms of create 1k for both.
- The profiles were taken twice; the first pass ran without the load gate (a script bug) and
  was replaced by this gated pass. The two agreed within about 5 ms per bucket (largest: gc
  on create 1k, 16 → 12 ms) except "program" on update 10th (Gyral 104 → 113 ms), which is
  renderer time, not JS. No conclusion changed.
- Caveat: the benchmark's own polling helper (`holds`) appears as ≈ 1 ms of native time.

## Top 3 optimisation candidates

1. **Strip whitespace between tags in `html` templates at build time** (Gyral-side, no API
   change). Expected: the compact numbers above, **11–24% faster on DOM-heavy operations**,
   putting Gyral level with Solid on create and replace. Route: a Vite transform in
   `gyralVitePreset()` (an html-literal minifier, or `@lit-labs/compiler`), tested against
   whitespace-sensitive markup (`<pre>`, inline text between elements). Measure the real
   transform: it may collapse whitespace to one space rather than remove it, which keeps some
   text nodes. Until then, document it as the cause and recommend compact row templates for
   large lists.
2. **Measure `@lit-labs/compiler` (precompiled templates)** for the remaining script gap to
   Svelte (≈ 140 ms on create 10k): it skips template preparation at runtime. Expected: small
   to moderate (under 10%), low confidence. The 4 comment markers per row are part of
   lit-html's design; changing that is an upstream question (it fits the Lit conversation in
   gyral-m8c), not a Gyral one.
3. **Investigate select's idle time** (13–18 ms vs Solid's 7 ms with 2–3 ms of script): check
   whether Gyral and Lit update in a microtask that misses the current frame. Expected: up to
   about 7 ms on single-row interactions, which users notice more than bulk operations.

**Not recommended:** light DOM for big lists, and Gyral runtime changes for table speed. Shadow
DOM, scoped styles, Gyral's dispatch and Effect each measured at or near zero cost here.
