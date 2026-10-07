# Gyral 0.3 (`gyral-next`): flush-timing spike and first numbers, 2026-10-06

Gyral beads gyral-g1r.8 (flush-timing spike) and gyral-g1r.16 (benchmark variant). The Gyral
side of the decision is recorded in Gyral's `docs/design-docs/view/04-scheduler.md` ("Frame
lane", "The spike").

- `frameworks/gyral-next`: the six apps on Gyral 0.3's own view layer (no Lit), from tarballs
  packed from Gyral branch `next-spike` (`scripts/pack-gyral-next.mjs`, `vendor-next/SOURCE.json`
  has the commit). Never published; the packs are versioned `0.3.0-next`.
- Machine: the usual Linux desktop, headless Chromium (Playwright 1.63), shared with other work
  during the day (load average 2–11): compare within a run only.

Files here:

| File                                  | What                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `results.json`, `results.md`          | `pnpm bench --label=gyral-next-spike --only=gyral,gyral-next,lit,solid,svelte` |
| `flush.json`, `flush.md`              | Flush strategies, one interleaved session (`scripts/compare-flush.mjs`)       |
| `flush-switch.patch`                  | The temporary Gyral switch `compare-flush.mjs` needs (in no Gyral commit)     |
| `traces/*-timelines.txt`              | `scripts/trace-timeline.mjs` output: main-thread timelines per sample         |
| `traces/frame-modes.py`, `…modes.txt` | Select row: was a frame already due when the click ran?                       |
| `stream/`                             | The bursty-source test (app, runner, outputs); temporary, not a benchmark app |

## 1. First numbers: Gyral 0.3 vs 0.2.0, Lit, Solid, Svelte

`results.md`, 15 runs per operation, interleaved. **Drift flagged** (calibration spread 78%,
1-minute load up to 23.8 from other work on the machine): read it within the run only, and
treat differences under ~5% as noise. The gyral-next pack is Gyral `next-spike` 784bd2f
(view layer, element base and scheduler, with the frame lane; no server renderer yet).

| Table, median ms                 | Gyral 0.2.0 | **gyral-next** |    Lit |  Solid | Svelte |
| -------------------------------- | ----------: | -------------: | -----: | -----: | -----: |
| create 1,000 rows                |       244.9 |          245.9 |  280.4 |  245.9 |  236.6 |
| replace 1,000 rows               |       302.9 |          300.7 |  357.5 |  308.3 |  274.4 |
| update every 10th row            |        91.4 |           91.3 |   98.9 |   84.1 |   87.5 |
| select row                       |        14.3 |           15.2 |   13.5 |   17.2 |   16.9 |
| swap rows                        |        46.3 |           36.3 |   48.8 |   40.0 |   34.2 |
| remove row                       |        55.2 |           52.1 |   60.5 |   58.1 |   50.8 |
| create 10,000 rows               |      5262.4 |         5336.1 | 6016.2 | 5298.6 | 5007.0 |
| append 1,000 rows                |       321.8 |          303.4 |  354.4 |  320.8 |  290.2 |
| clear 1,000 rows                 |        29.1 |           23.3 |   36.9 |   25.2 |   23.8 |
| **geometric mean vs fastest**    |    **1.12** |       **1.06** |   1.24 |   1.11 |   1.03 |
| JS gzip KiB: floor               |        11.9 |           12.3 |    5.8 |    3.7 |    9.0 |
| JS gzip KiB: counter             |        12.0 |           12.4 |    5.8 |    4.3 |    9.9 |
| JS gzip KiB: todo                |        13.6 |           13.0 |    7.3 |    6.6 |   14.2 |
| Todo interactive, cold (ms)      |         660 |            608 |    598 |    593 |    651 |
| JS heap after load / 1k rows (MB) |  1.26 / 2.05 |    1.20 / 2.16 | 1.20 / 1.98 | 1.13 / 3.12 | 1.19 / 2.48 |

- **Runtime:** gyral-next has the lower script time on every operation (create 1k 35.4 vs
  42.8 ms, replace 59.8 vs 74.5, create 10k 907 vs 1065, clear 19.0 vs 24.0) and wins clearly
  on swap (−22%), clear (−20%) and append (−6%). Create 1k (+0.4%), create 10k (+1.4%, with a
  much tighter p90: 5508 vs 6206) and select (+0.8 ms, frame-quantized, see 2) are within this
  run's noise; their script is lower, the difference is style/layout/paint. Geomean 1.06 vs
  1.12 (0.2.0), below ADR 0018's 1.20 target. A clean-machine run is still needed for the
  Phase 8 "no operation slower" gate.
- **Size:** 0.3 is *larger* at the floor (12.3 vs 11.9 KiB gzip; the frame lane is 0.14 of
  that) and smaller only in apps that use lists and forms (todo −0.6, search −0.4, table −0.4).
  ADR 0018's target is ≤ 8 KiB. A source-map breakdown of the floor bundle (34.2 KB min):
  the whole runtime ships whatever the app uses: element 2.8 KB, child parts 2.3, intent 2.2,
  attribute parts 2.2, host model 1.9, scheduler 1.9, command interpreter 1.8, props 1.7,
  list reconciliation (list, rows, reorder, place) 4.6, instance + plan 2.8, store scope and
  binding 2.1, invokers shim 0.8, islands 0.6, focus 0.4. Nothing of that is tree-shaken for a
  one-paragraph app (Gyral bead gyral-g1r.18, the size pass).
- **Startup:** todo interactive 608 ms vs 660 for 0.2.0, level with Lit and Solid.

## 2. Select row: where the idle time comes from

`traces/select-timelines.txt` (12 samples each of Gyral 0.2.0, gyral-next, Lit, Solid, Svelte,
Vue), `traces/frame-modes.txt`, and `scripts/trace-timeline.mjs` with extra categories
(top-level tasks, compositor frames).

- The "13–18 ms idle" quoted for 0.2.0 is total minus script. The 0.2.0 release run's select
  row is 16.7 ms: script 2.8, paint 6.0, **idle 6.5** (Solid 7.6 = 0.9 + 5.6 + 1.0).
- **All of Gyral's work is inside the click's task**, in every sample: the click's
  `EventDispatch` runs Gyral's capture listener on the shadow root (0.1–1 ms at 4x), then the
  microtask checkpoint inside that dispatch runs the flush (2–4 ms), then nothing: no timer, no
  animation-frame callback, no further task from Gyral, no view-transition work, no custom
  states, no focus command. The only task between the click and the frame is the harness's
  own DOM poll (~1 ms).
- **The idle is frame alignment.** Before the click the page is quiet and Chrome has stopped
  producing frames (`NeedsBeginFrameChanged`). The input restarts them; mouse move, down,
  focus, up and click are dispatched in one task, and the first compositor `BeginFrame` comes
  14–16.7 ms after that task starts. The click handler starts 2–6 ms into it, Gyral finishes
  ~3 ms later, and the main thread waits for the BeginFrame. If a BeginFrame already fell
  inside the input task (frames still running from earlier work), the frame starts 0.05–0.3 ms
  after the task: the "fast" mode. Every framework's samples are bimodal (release run: Solid
  6.9–8.2 or 17.3–20.1 ms, Gyral 8.7–10.1 or 16.7–18.5 ms), and the share of fast samples
  changes between runs (Solid: 11 of 15 in the release run, 3 of 12 in our trace run, where
  its median was 18 ms and Lit's 13).
- **The paint is not the selection.** No app here has CSS, so `class="danger"` changes nothing
  visible and needs no paint. The ~6–8 ms paint, the same for every framework, is the clicked
  button's `:active`/`:focus` change. Proof: with Gyral's flush moved to a later task (below),
  the frame painted 5 ms before the render ran, and no frame followed the render.
- For long operations the BeginFrame passes during the script, so idle is 1–4 ms; their time
  is style, layout and paint, which Chrome partly runs synchronously at the end of the input
  task (hover update) for every framework.
- So select row measures "click → next frame" more than the framework, and no flush timing can
  shorten the idle: the update is in the DOM before the frame in every sample.
  `docs/methodology.md` now says so under Limits.

## 3. Flush strategies

`flush.md`: `scripts/compare-flush.mjs`, one interleaved session, 2 warm-up + 10 samples,
drift 2.8%, with the temporary switch (`flush-switch.patch`, `?gyral-flush=`). Median ms:

| Flush                        | create 1k | update 10th | select |  swap | clear |
| ---------------------------- | --------: | ----------: | -----: | ----: | ----: |
| Gyral 0.2.0                  |     247.6 |        80.9 |   15.8 |  42.4 |  31.0 |
| Lit                          |     282.4 |        83.6 |   14.4 |  46.4 |  43.0 |
| gyral-next, microtask        |     237.9 |        78.5 |   13.4 |  37.1 |  23.5 |
| gyral-next, MessageChannel   |     250.6 |        86.4 |  12.4\* |  47.7 |  32.5 |
| gyral-next, `setTimeout(0)`  |     257.8 |        86.3 |  15.4\* |  48.9 |  31.9 |
| gyral-next, rAF              |     234.4 |        75.7 |   19.7 |  40.7 |  23.6 |

- Microtask is best or tied everywhere the change paints.
- End of task: Chrome runs the frame the click already requested before the posted task, so
  the render misses it and needs another frame (+8 to +20 ms). \*Select looks faster only
  because the render after the measured frame needs no paint (no CSS).
- rAF: waits for the next frame before rendering (+6 ms select, +4 swap), same on long ops.

## 4. Bursty sources and the frame lane

`stream/`: a streaming driver posts ticks as separate `message` tasks into a 1,000-row keyed
table plus a 500-point SVG chart rebuilt on every render; CPU 4x, 3 s windows, median of 3.
`raf-switch-chart.txt` (global rAF switch, moderately loaded machine):

| Source                 | Flush     | Messages/s | Renders/s | Frames/s | Busy | Script |
| ---------------------- | --------- | ---------: | --------: | -------: | ---: | -----: |
| 60/s                   | microtask |         61 |        61 |     59.7 |  76% |     3% |
| 60/s                   | rAF       |         61 |        56 |     59.7 |  75% |     3% |
| 250/s (timer-limited)  | microtask |        116 |       116 |     59.6 |  78% |     5% |
| 250/s (timer-limited)  | rAF       |        117 |        57 |     59.7 |  76% |     4% |
| 2,000/s (8 per 4 ms)   | microtask |        467 |       467 |     55.9 |  99% |    17% |
| 2,000/s (8 per 4 ms)   | rAF       |        812 |        42 |     59.7 |  81% |     8% |

With the shipped lane (`renderOnFrame: ['Ticked']`, `lane-chart.txt`, on a busier machine):
2,000/s → 383 vs 188 messages/s, 40.4 vs 31.2 frames/s, script 9% vs 14%. Without the chart
(`raf-switch-table-only.txt`) the gain is small (827 vs 710 messages/s, script 7% vs 10%):
skipped rows make each render cheap. Decision (Gyral): microtask stays the default;
`renderOnFrame` is the opt-in frame lane.

## 5. Porting notes (0.2 → 0.3 API)

- All six apps passed the correctness spec on the first build, and a development build (dev
  row-purity check and template rules active) logs no warnings.
- Changes: `repeat` → `each` with module-level rows; `live()`/`liveBoolean()` →
  `value=${…}`/`?checked=${…}`. The six apps use no props or styles, so the prop builders and
  `css` (no `unsafeCSS`) are not exercised here (only the 0.2 profiling variant used
  `unsafeCSS`; it was not ported).
- Friction: a pure row can't see `i`, so the table's and todo's rows get their intent names
  through `pick` (`{ select: i.Select, remove: i.Remove, selected }`): a `Picked` interface
  per list, intent names typed as plain `string` inside the row (no check against the message
  union), and one object per row per render, which `samePick` compares on its slow path
  (`getPrototypeOf`, two `Object.keys` arrays per row).
- Packaging: Gyral's packages on `next` still say version 0.2.0, so a plain `pnpm pack`
  collides with the published 0.2.0; `pack-gyral-next.mjs` rewrites the version.
