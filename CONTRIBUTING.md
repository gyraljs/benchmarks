# Contributing

Corrections are the most useful contribution. If an implementation here is not how its
framework's documentation says to write it, or a measurement is wrong, please open an issue or
a pull request. The [README](README.md#conventions) has the ground rules and the commands; this
file has the procedures.

## Before you open a pull request

- Run `pnpm check`. It is the gate: typecheck (tsc, vue-tsc, svelte-check), ESLint, Prettier,
  production builds and the correctness spec against every build.
- Keep files at 300 lines or fewer, and don't use `any`.
- If a change affects one framework only, say why in [docs/apps.md](docs/apps.md), with a link
  to the documentation it follows.
- Don't edit committed results. A change that would move a number needs a new run (below).

## Fairness rules

1. **Each implementation follows its framework's official documentation.** Use the idioms the
   docs recommend for the job (keyed lists, memoisation for large lists where the docs suggest
   it, cleanup for effects), and nothing the docs don't.
2. **Don't tune one framework.** No change whose purpose is to move one framework's result, and
   no skipping a documented best practice in another.
3. **Same inputs for everyone.** Row data, the fake search API and the signup validation rules
   live in `shared/src` and are used unchanged by every framework. No UI, state or form
   libraries.
4. **Current npm releases, pinned exactly**, built by Vite 8 with each framework's official
   plugin and otherwise identical settings. Nothing is vendored or packed locally. The
   exceptions are stated in the README and with every result: lit-html pinned to 3.3.0 for Lit,
   and the `gyral-0.3.0` slot, which keeps the previous Gyral release next to the current one.
5. **Report results as measured,** including where Gyral loses. Context from elsewhere (for
   example a spike in Gyral's own repository) may be cited as context, never as a result of
   this repository.

## Add a framework

1. Create `frameworks/<name>/` with a `package.json` (name `@bench/<name>`, exact versions,
   `@bench/shared` as `workspace:*`), a `tsconfig.json` and a `vite.config.ts` that uses the
   framework's official Vite plugin with its defaults.
2. Write all six apps in `frameworks/<name>/apps/<app>/` (`index.html` plus the entry module),
   meeting the DOM contract in [docs/apps.md](docs/apps.md). The ids and classes there are what
   the tests and the benchmark click.
3. Register the framework in `scripts/lib/config.mjs` (`FRAMEWORKS`, and its packages in
   `MAIN_PACKAGES` so results record their versions), `scripts/typecheck.mjs` and the
   `FRAMEWORKS` list in `tests/apps.spec.ts`.
4. Add a row to the per-framework table in `docs/apps.md`: how it renders and which list, state
   and async idioms it uses.
5. `pnpm install`, then `pnpm check`.

## Add an app

1. Add its name to `APPS` in `scripts/lib/config.mjs`.
2. Implement it in every framework, under `frameworks/<name>/apps/<app>/`. Put any logic that
   isn't framework code (data, validation, a fake server) in `shared/src`.
3. Describe it and its DOM contract in `docs/apps.md`, and add its tests to
   `tests/apps.spec.ts`. Every implementation must pass them.
4. `pnpm check`. Size is measured for every app automatically. Runtime and memory use the
   `table` app and startup the `todo` app (`scripts/lib/`), so a new app needs harness code
   only if it gets a measurement of its own.

## Run and commit a benchmark

1. Commit your changes first. `results.md` records the commit, with `-dirty` if the tree had
   uncommitted changes, and a dirty run can't be reproduced.
2. Make the machine quiet: close other browsers and test suites, and wait until the 1-minute
   load average is low (the headline run waited for two quiet minutes below 2.5). On a shared
   machine, hold the lock: `flock /tmp/gyral-bench.lock pnpm bench …`.
3. Run `pnpm bench`, or `pnpm bench --label=<name>` for a variant run. Read the
   "Machine during the run" line in `results.md`. A flagged run (see
   [the methodology](docs/methodology.md#machine-state)) can be compared within itself only;
   for a headline, discard it and run again. `--strict-drift` makes the command fail instead.
4. Write a `NOTES.md` in the run's folder when the run needs interpretation: what was measured
   and why, the exact command, the machine state, and any significance tests.
5. Commit the whole folder as one commit, with a subject such as
   `results: <what was measured> vs <what>`. `results.json` is the record; `results.md` can be
   regenerated from it with `pnpm report results/<run>`.

To compare two runs' rankings per operation:
`node scripts/rank-compare.mjs <out.md> results/<old> results/<new>`. Numbers from different
runs are comparable only when the builds and the machine state are comparable; the notes of
[2026-10-07](results/2026-10-07-full/NOTES.md#compared-with-the-2026-10-06-final-run) show
how that was checked.

Commit subjects in this repository start with what they touch: `results:`, `experiment:`
(a variant framework or a comparison script), `harness:`, `docs:`, or `feat(bench):` for new
harness features.

## Compare Gyral releases (`gyral-0.3.0`)

`frameworks/gyral` is the current Gyral release. `frameworks/gyral-0.3.0` keeps the previous
release, Gyral 0.3.0 from npm, with the app sources measured on 2026-10-07, so every run shows
what the newest release changed. Both install `@gyral/core` and `@gyral/time` from npm, pinned
exactly; this repository installs no vendored or locally packed Gyral.

**Ids in older results.** Runs up to 2026-10-07 have no `gyral-0.3.0` column: there,
`gyral-next` is Gyral 0.3.0 (its release packs, identical to npm's 0.3.0 apart from a trailing
newline in `package.json`), and `gyral` is Gyral 0.2.0. Every `results.md` lists the installed
versions under "Framework versions". Committed results keep their ids; they are never edited.

When Gyral releases again:

1. Copy `frameworks/gyral` to `frameworks/gyral-<its current version>` (package name
   `@bench/gyral-<version>`), and remove the older comparison slot unless it is still needed.
2. Move `frameworks/gyral` to the new release: exact versions in `package.json`, app changes
   the release's migration guide asks for, and its row in [docs/apps.md](docs/apps.md).
3. Update the slot lists in `scripts/lib/config.mjs`, `scripts/typecheck.mjs` and
   `tests/apps.spec.ts`, then `pnpm install`, `pnpm check` and a full run.

A release that only adds to the current one, like 0.3.2 through 0.3.6 after 0.3.1, needs step 2 alone:
`frameworks/gyral` moves to it and the comparison slot (`gyral-0.3.0`) stays.

To measure a Gyral pre-release, publish it to npm under a dist-tag (for example `next`) and pin
its exact version in a slot. The earlier workflow that packed an unreleased checkout into
`vendor-next/` (`scripts/pack-gyral-next.mjs`) is in git history (commit 72ee36a).
