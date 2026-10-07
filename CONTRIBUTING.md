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
   plugin and otherwise identical settings. The exceptions are stated in the README and with
   every result: lit-html pinned to 3.3.0 for Lit and Gyral 0.2.0, and Gyral 0.3.0 installed
   from its release tarballs until it is on npm.
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

## Measure an unreleased Gyral (`gyral-next`)

`frameworks/gyral-next` installs `@gyral/core` and `@gyral/time` from the tarballs in
`vendor-next/` instead of npm, so a Gyral release can be measured against the published one in
the same run before it is on npm. It currently holds Gyral's 0.3.0 release packs (tag
`v0.3.0`, commit e79abd6), copied unchanged; `vendor-next/SOURCE.json` records where they came
from.

**Naming.** The framework id stays `gyral-next`: the directory, `--only=`, the harness lists
and every committed results file use it, and renaming it would make old and new results
disagree. Hand-written reports call it by its version (Gyral 0.3.0); the generated
`results.md` lists the installed version under "Framework versions". The tarballs keep their
names (`vendor-next/gyral-{core,time}-next.tgz`) for the same reason.

To measure a Gyral checkout (for example its `next` branch):

```sh
node scripts/pack-gyral-next.mjs <path to a Gyral checkout>   # packs as <version>-local
# set "@gyral/time@<version>-local>@gyral/core" in the root pnpm.overrides, as the script prints
pnpm install                                                  # the lockfile records the tarballs
pnpm bench --only=gyral,gyral-next,lit
```

The path defaults to a sibling directory, `../gyral-next`. Tarballs Gyral packed itself
(`gyral-core-<version>.tgz`, `gyral-time-<version>.tgz`) can instead be copied unchanged over
`vendor-next/gyral-core-next.tgz` and `gyral-time-next.tgz`, as for 0.3.0; then set that
version in the `@gyral/time@<version>>@gyral/core` override, so `@gyral/time` gets the same
core.

### Once Gyral 0.3.0 is on npm

Planned, not done yet:

1. Check that npm's 0.3.0 is what was measured: unpack `npm pack @gyral/core@0.3.0` and
   `@gyral/time@0.3.0` and diff them against the tarballs in `vendor-next/`.
2. Move `frameworks/gyral` to 0.3.0, since the rules measure every framework's current npm
   release: bring over the `gyral-next` app sources (the 0.3 API: `each`, module-level
   `intents<Msg>()`, form-state attributes), pin `@gyral/core` and `@gyral/time` to `0.3.0`,
   drop `lit` from its dependencies and update `docs/apps.md`. The root overrides that pin
   `@gyral/core`/`@gyral/time` to 0.2.0 also keep the 0.2-era variants (`gyral-noeffect`,
   `-twotrack`, `-pipewise`, `-combo`) on 0.2.0, so scope them to those variants, or retire the
   variants, instead of changing them globally.
3. Remove `gyral-next`: `frameworks/gyral-next`, `vendor-next/`, `scripts/pack-gyral-next.mjs`
   (it stays in git history for the next pre-release), the three `gyral-next` overrides, and its
   entries in `scripts/lib/config.mjs`, `scripts/typecheck.mjs`, `tests/apps.spec.ts`,
   `docs/apps.md` and `AGENTS.md`. Committed results keep the `gyral-next` id; they are never
   edited.
4. `pnpm check`, then a full `pnpm bench` of every framework as the new headline run, since
   `frameworks/gyral` changed. 0.2.0 vs 0.3.0 stays documented by the 2026-10-06 and 2026-10-07
   runs.
