# gyral-benchmarks

A reproducible benchmark of [Gyral](https://gyral.dev) against React, Preact, Vue, Svelte,
Solid and Lit. The same six apps are written in every framework, each following that
framework's official documentation, and checked by one shared correctness spec. Then:

- **Bundle size** of every app: minified, gzip and brotli, plus the framework's floor (an app
  that renders one paragraph).
- **Runtime**: the nine js-framework-benchmark operations on a keyed table, with in-page
  warm-up, under 4x CPU throttling, 15 interleaved runs each, timed from Chrome performance
  traces with a script / style+layout / paint breakdown.
- **Memory**: JS heap of the table app after load, with 1,000 rows, and after clearing.
- **Startup**: a todo app on a cold cache with a throttled network and CPU, until the first
  todo can be added.

## Results, 2026-10-07: Gyral 0.3.0

Full tables: [results/2026-10-07-full/results.md](results/2026-10-07-full/results.md); noise
analysis and notes: [NOTES.md](results/2026-10-07-full/NOTES.md). Every sample is in
`results.json`. Headline numbers, Gyral 0.3.0 and the published Gyral 0.2.0 against the current
releases of the others, all measured in one run:

|                                                    | Solid | Preact |  Lit | Svelte | **Gyral 0.3.0** | Gyral 0.2.0 |  Vue | React |
| -------------------------------------------------- | ----: | -----: | ---: | -----: | --------------: | ----------: | ---: | ----: |
| JS, gzip KiB: floor (framework alone)              |   3.7 |    4.7 |  5.8 |    9.0 |        **11.6** |        11.9 | 23.0 |  66.1 |
| JS, gzip KiB: todo app                             |   6.6 |    6.1 |  7.3 |   14.2 |        **13.6** |        13.6 | 25.0 |  66.6 |
| Todo app interactive, cold, throttled (ms, median) |   405 |    396 |  407 |    447 |         **423** |         443 |  502 |   735 |
| Table runtime, geometric mean vs fastest           |  1.08 |   1.38 | 1.31 |   1.07 |        **1.03** |        1.21 | 1.20 |  1.55 |
| Same, without select row                           |  1.10 |   1.25 | 1.27 |   1.02 |        **1.03** |        1.13 | 1.11 |  1.53 |
| JS heap after load (MB)                            |  1.13 |   1.17 | 1.20 |   1.19 |        **1.18** |        1.26 | 1.32 |  1.55 |

Gyral 0.3.0 is the `gyral-next` column in the results files: Gyral's 0.3.0 release packs from
`vendor-next/`, tagged on GitHub but not yet on npm ([below](#gyral-030-gyral-next)).

What the numbers say:

- **Runtime: Gyral 0.3.0 has the lowest geometric mean in this run, by a small margin** (1.03;
  Svelte 1.07, Solid 1.08). It is fastest at update every 10th row, remove and clear; Svelte is
  fastest at create, replace, create 10,000 and append. Without select row, Svelte (1.02) and
  Gyral 0.3.0 (1.03) change places. Against 0.2.0 in the same run, no operation is slower: seven
  are faster beyond noise (bootstrap interval and Mann–Whitney test, in the notes; six of eight
  without select), and script time is lower on every operation.
- **Select row is frame-aligned: don't read its −49% against 0.2.0 as a speedup.** Samples are
  bimodal (about 7–10 ms or 15–20 ms), depending on whether a frame was already due when the
  click landed; 12 of 15 Gyral 0.3.0 samples fell in the fast mode, 3 of 15 for 0.2.0, and the
  split moves between runs for every framework. See
  [the methodology's limits](docs/methodology.md#limits).
- **Size is still Gyral's weak point.** The 0.3.0 floor is 11.6 KiB gzip counting every chunk
  the build emits (0.2.0: 11.9; Lit 5.8, Svelte 9.0). 0.3.0's builds also emit two lazily
  imported chunks (hydration for server-rendered pages, an invoker-commands shim) that a
  client-only page in Chromium did not fetch; the entry chunk alone is 8.6 KiB (computed
  separately, not by the harness). Counting all chunks, the search (+1.0 KiB) and table
  (+0.2 KiB) apps are larger than with 0.2.0.
- **Startup:** the todo app is interactive at 423 ms, 20 ms sooner than with 0.2.0, 16–18 ms
  behind Lit and Solid and 27 ms behind Preact.
- **Memory:** 0.3.0 starts with a smaller heap than 0.2.0 (1.18 vs 1.26 MB) but holds 1,000 rows
  in slightly more (2.13 vs 2.05 MB); of the other frameworks, only Lit (1.98) holds them in
  less.
- **Where Gyral 0.3.0 loses:** Svelte is faster at five of the nine operations (create,
  replace, swap, create 10,000, append) and leads without select row; Vue is faster at swap.
  Solid, Preact and Lit ship far less JavaScript and are interactive sooner.

The 2026-10-06 final run (0.3.0-next.6, whose built code is identical to 0.3.0) gave the same
ranking: every geomean within 0.02, identical sizes and memory
([comparison in the notes](results/2026-10-07-full/NOTES.md#compared-with-the-2026-10-06-final-run)).

Caveats for this run:

- **Machine:** drift was not flagged (calibration spread 4.1%, limit 5%; 1-minute load 1.3–2.1
  on 12 cores), but the CPU governor was `powersave` (2.4–4.0 GHz between operations).
  Interleaving spreads that over every framework. Two earlier attempts were stopped and
  discarded when another repository's browser tests ran outside the benchmark lock. Compare
  frameworks within this run, not absolute numbers across runs.
- **lit-html is pinned to 3.3.0** for Lit and Gyral 0.2.0 (root `pnpm.overrides`), not the
  current 3.3.3, whose `repeat` leaves an empty comment node behind for every removed item
  ([lit/lit#5010](https://github.com/lit/lit/issues/5010)); in the 2026-10-05 run that made
  "clear 1,000 rows" take about 3.7 s for Lit and Gyral 0.1.0. Gyral 0.3.0 does not use Lit.
- **Gyral 0.3.0 comes from release tarballs, not npm,** until it is published.
- Runtime is timed from Chrome performance traces, like js-framework-benchmark
  ([methodology](docs/methodology.md#trace-based-timing-default-since-2026-10-05)); operations
  shorter than a frame include waiting for the frame that paints them.

Earlier runs, each comparable only within itself:

- [2026-10-06, Gyral 0.3 final](results/2026-10-06-gyral-0.3-final/NOTES.md): the speed gate
  for Gyral 0.3 (0.3.0-next.6 vs 0.2.0), the previous headline.
- [2026-10-05](results/2026-10-05/results.md): Gyral 0.1.0 on Effect 3 (floor 49.3 KiB gzip),
  lit-html 3.3.3, the older in-page end point, which often missed the repaint of operations
  shorter than a frame. Gyral's runtime tracked Lit's.
- [2026-10-05, trace-based](results/2026-10-05-lit-html-3.3.0-effect4-trace/NOTES.md): Gyral
  experiment builds (Effect 4, lit-html 3.3.0), the first run with trace timing.
- [2026-10-06, Gyral 0.2.0 confirmation](results/2026-10-06-release-0.2.0-a3/CONFIRMATION.md)
  and [the Gyral 0.3 spike](results/2026-10-06-gyral-next-spike/NOTES.md) (a flagged run, under
  load).

How each number is measured, and the limits of the method:
[docs/methodology.md](docs/methodology.md). The apps and per-framework choices:
[docs/apps.md](docs/apps.md).

## Run it

```sh
pnpm install
pnpm exec playwright install chromium
pnpm check           # typecheck, lint, format, build, correctness tests
pnpm bench --quick   # a few samples, to try the harness (results/quick/)
pnpm bench           # the full run (results/<date>/); ~25 min for the eight compared frameworks
```

`--only=gyral,react` limits any of `build` and `bench` to some frameworks. Without it they
cover every `frameworks/` package, including the Gyral experiment variants (`gyral-noeffect`,
`-twotrack`, `-pipewise`, `-combo`); headline runs use
`--only=gyral,gyral-next,lit,solid,svelte,vue,preact,react`. `--label=<name>` writes to
`results/<date>-<name>/`.

### Gyral 0.3.0 (`gyral-next`)

`frameworks/gyral-next` is the same six apps on Gyral 0.3's own view layer (no Lit). It
installs `@gyral/core` and `@gyral/time` from tarballs in `vendor-next/`, not from npm, so 0.3
could be measured against the published 0.2.0 (`frameworks/gyral`) in the same run before it
was published. They are now Gyral's 0.3.0 release packs (tag `v0.3.0`, commit e79abd6), copied
unchanged from `../gyral-tarballs/`; `vendor-next/SOURCE.json` records where they came from.

**Naming.** The framework id stays `gyral-next`: the directory, `--only=`, the harness lists and
every committed results file use it, and renaming it would make old and new results disagree.
Hand-written reports call it Gyral 0.3.0; the generated `results.md` lists the installed version
under "Framework versions". The tarballs keep their names
(`vendor-next/gyral-{core,time}-next.tgz`) for the same reason: they are the `gyral-next`
slot, whatever version is in them.

To measure an unreleased Gyral (for example a checkout of its `next` branch):

```sh
node scripts/pack-gyral-next.mjs ../gyral-next   # packs as <version>-local, records the commit
# set "@gyral/time@<version>-local>@gyral/core" in the root pnpm.overrides, as the script prints
pnpm install                                     # the lockfile records the new tarballs
pnpm bench --only=gyral,gyral-next,lit
```

Tarballs Gyral packed itself (`gyral-core-<version>.tgz`, `gyral-time-<version>.tgz`) can be
copied unchanged over `vendor-next/gyral-core-next.tgz` and `gyral-time-next.tgz` instead (as
for 0.3.0); then set that version in the `@gyral/time@<version>>@gyral/core` override, so
`@gyral/time` gets the same core.

**Once 0.3.0 is on npm** (planned, not done yet):

1. Check that npm's 0.3.0 is what was measured: unpack `npm pack @gyral/core@0.3.0` and
   `@gyral/time@0.3.0` and diff them against the tarballs in `vendor-next/`.
2. Move `frameworks/gyral` to 0.3.0, since the ground rules measure every framework's current
   npm release: bring over the `gyral-next` app sources (the 0.3 API: `each`, module-level
   `intents<Msg>()`, form-state attributes), pin `@gyral/core` and `@gyral/time` to `0.3.0`,
   drop `lit` from its dependencies and update `docs/apps.md`. The root overrides that pin
   `@gyral/core`/`@gyral/time` to 0.2.0 also keep the 0.2-era variants (`gyral-noeffect`,
   `-twotrack`, `-pipewise`, `-combo`) on 0.2.0, so scope them to those variants, or retire the
   variants, instead of changing them globally.
3. Remove `gyral-next`: `frameworks/gyral-next`, `vendor-next/`, `scripts/pack-gyral-next.mjs`
   (back in git history when a later pre-release needs measuring), the three `gyral-next`
   overrides, and its entries in `scripts/lib/config.mjs`, `scripts/typecheck.mjs`,
   `tests/apps.spec.ts`, `docs/apps.md` and `AGENTS.md`. Committed results keep the
   `gyral-next` id; they are never edited.
4. `pnpm check`, then a full `pnpm bench` of every framework as the new headline run, since
   `frameworks/gyral` changed. 0.2.0 vs 0.3.0 stays documented by the 2026-10-06 and 2026-10-07
   runs.

## Ground rules

- Every framework's current npm release, pinned exactly; Vite 8 production builds with each
  framework's official plugin and otherwise identical settings. Two exceptions, both stated
  with the results: lit-html is pinned to 3.3.0 for Lit and Gyral 0.2.0 (see above), and Gyral
  0.3.0 comes from its release tarballs until it is on npm.
- No UI, state or form libraries. Shared code (row data, a fake search API, validation rules)
  is the same for everyone, so the comparison is about the frameworks.
- Results are reported as measured, including where Gyral loses.

Gyral is MIT-licensed; this repository is MIT as well. © 2026 Mike Zupper.
