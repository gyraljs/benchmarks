# Profiling: where a framework's table time goes

The benchmark ranks frameworks; profiling explains a result. It changes one thing at a time in
the keyed table app and times every variant in one interleaved session, then attributes the
JavaScript to modules. First used for Gyral and Lit (bead gyral-1kq,
`results/2026-10-05-profile/PROFILE.md`).

## Variants

`frameworks/{lit,gyral}/profile/table/` is the benchmark's table with three switches read from
the page URL (`shared/src/profile.ts`), so one build serves every combination:

| query       | meaning                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------- |
| `shadow=0`  | render into the element's light DOM (`createRenderRoot` → `this`; Gyral `shadow: false`) |
| `compact=1` | row template without whitespace text between tags (otherwise indented as usual)          |
| `css=1`     | one table stylesheet: adopted in the shadow root, or a document stylesheet in light DOM  |

The indented row templates are `prettier-ignore`d: their whitespace is part of what is
measured. `scripts/lib/variants.mjs` names the variants; `lit (app)` (the benchmark's own app)
is the control, Svelte and Solid are light-DOM references.

## Commands

All of them drive Chromium: run them under the machine lock, one at a time.

| command                                                                            | output                                                                                                                                                        |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm profile:build`                                                               | `dist/p-<fw>/table` (minified, for timing) and `dist/u-<fw>/table` (unminified, one file per module, for CPU profiles); needs `pnpm build` for the references |
| `flock /tmp/gyral-bench.lock pnpm profile:nodes`                                   | DOM nodes per row for every app → `nodes.{md,json}`                                                                                                           |
| `flock /tmp/gyral-bench.lock pnpm profile:run [--ops=a,b] [--label=x] [--quiet=3]` | trace timing of every variant → `variants[-x].{md,json}`                                                                                                      |
| `flock /tmp/gyral-bench.lock pnpm profile:cpu [--n=7]`                             | V8 CPU profiles, self time by module → `cpu.{md,json}`                                                                                                        |

## Method notes

- Timing is the benchmark's trace timing (docs/methodology.md) with the same operation prep
  and 4x CPU throttling, 10 runs after 2 warm-ups. Before every sample the run waits until the
  1-minute load average is ≤ 3 (`--quiet`), because Chromium work outside the lock (other test
  suites, a desktop browser) skews samples even when the lock is held. Drift probes are
  recorded; a flagged run is deleted and re-run, never reported.
- CPU profiles sample every 100 µs. Frames are bucketed by module URL: lit-html (and
  lit-element, reactive-element), @gyral/core, effect, the app, native DOM methods (named
  frames without a URL, such as `importNode`), garbage collection, and `(program)` (the
  renderer outside JS: style, layout, paint). The page's polling helper shows up as about 1 ms
  of native time.
