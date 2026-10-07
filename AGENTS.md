# AGENTS.md — gyral-benchmarks

A reproducible benchmark of Gyral against React, Preact, Vue, Svelte, Solid and Lit: the same
six apps in every framework, bundle sizes, runtime, memory and startup, plus one correctness
spec for all. This file is a map; the linked docs are the system of record.

## Commands

| Command                                  | What it does                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `pnpm install`                           | Install (pnpm workspace: `shared`, `frameworks/*`)                                                       |
| `pnpm check`                             | **The gate.** typecheck (tsc, vue-tsc, svelte-check) + lint + format + build + correctness tests         |
| `pnpm build [--only=gyral,react]`        | Production Vite build of every app → `dist/<framework>/<app>/`                                           |
| `pnpm sizes`                             | Bundle sizes of the current build                                                                        |
| `pnpm test`                              | The correctness spec against every production build (Playwright)                                         |
| `pnpm bench [--quick] [--only=…]`        | Build, then measure everything → `results/<date>/` (`results/quick/` for `--quick`)                      |
| `pnpm bench --label=<name>`              | Same, into `results/<date>-<name>/`                                                                      |
| `pnpm bench --timing=frame`              | Use the older in-page end point instead of trace timing (comparison runs)                                |
| `pnpm validate:timing`                   | Check the timing method: synthetic busy loop (±2 ms) and both methods on real operations                 |
| `node scripts/rank-compare.mjs`          | Rank changes between two runs (`<out.md> <old dir> <new dir>`)                                           |
| `node scripts/pack-gyral-next.mjs [dir]` | Pack `@gyral/core`/`@gyral/time` from an unreleased Gyral checkout into `vendor-next/` (CONTRIBUTING.md) |
| `node scripts/trace-timeline.mjs`        | Main-thread timeline of one table operation per sample (`--only`, `--ops`, `--runs`, `--out`)            |
| `pnpm profile:*`                         | Profiling variants of the table app: build, nodes, run, cpu ([docs/profile.md](docs/profile.md))         |

First run needs `pnpm exec playwright install chromium`. A full `pnpm bench` of the eight
compared frameworks takes about 25 minutes. Commands that drive Chromium run under the shared
machine lock (`flock /tmp/gyral-bench.lock …`).

## Where things are

| Path                                       | Contents                                                                   |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| [docs/methodology.md](docs/methodology.md) | How each number is measured, and its limits                                |
| [docs/apps.md](docs/apps.md)               | The six apps, their shared DOM contract, per-framework idioms              |
| [docs/profile.md](docs/profile.md)         | Profiling variants: what they change, commands, method notes               |
| [CONTRIBUTING.md](CONTRIBUTING.md)         | Adding a framework or app, committing a run, measuring an unreleased Gyral |
| `shared/src`                               | Shared app code: table data, fake search API, signup validation            |
| `frameworks/<name>`                        | One package per framework: `vite.config.ts`, `apps/<app>/`                 |
| `scripts/`                                 | build, sizes, serve, bench; `scripts/lib/` holds the measurement code      |
| `tests/apps.spec.ts`                       | One behavioural spec for every implementation                              |
| `results/<date>/`                          | Committed results: `results.json` (all samples) and `results.md`           |

## Rules

- **Fairness first.** Each implementation follows its framework's official docs. Don't tune
  one framework (or skip a documented best practice for another) to change a result. If a
  change is needed for one framework, explain it in `docs/apps.md`.
- Every app passes `tests/apps.spec.ts` before it is benchmarked.
- Never edit committed results by hand. Re-run `pnpm bench` and commit the new folder.
- Report results as measured, including where Gyral loses. Cite context (e.g. Gyral's ADR 0015
  runtime spike) as context, never as a measured result of this repo.
- Files ≤ 300 lines; no `any`.
