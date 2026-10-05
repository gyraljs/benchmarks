# gyral-benchmarks

A reproducible benchmark of [Gyral](https://gyral.dev) against React, Preact, Vue, Svelte,
Solid and Lit. The same six apps are written in every framework, each following that
framework's official documentation, and checked by one shared correctness spec. Then:

- **Bundle size** of every app: minified, gzip and brotli, plus the framework's floor (an app
  that renders one paragraph).
- **Runtime**: the nine js-framework-benchmark operations on a keyed table, with in-page
  warm-up, under 4x CPU throttling, 15 interleaved runs each.
- **Memory**: JS heap of the table app after load, with 1,000 rows, and after clearing.
- **Startup**: a todo app on a cold cache with a throttled network and CPU, until the first
  todo can be added.

Results: [`results/`](results/) (one folder per run, with every sample in `results.json`).
How each number is measured, and the limits of the method:
[docs/methodology.md](docs/methodology.md). The apps and per-framework choices:
[docs/apps.md](docs/apps.md).

## Run it

```sh
pnpm install
pnpm exec playwright install chromium
pnpm check           # typecheck, lint, format, build, correctness tests
pnpm bench --quick   # a few samples, to try the harness (results/quick/)
pnpm bench           # the full run, about an hour (results/<date>/)
```

`--only=gyral,react` limits any of `build` and `bench` to some frameworks.

## Ground rules

- Every framework's current npm release, pinned exactly; Vite 8 production builds with each
  framework's official plugin and otherwise identical settings.
- No UI, state or form libraries. Shared code (row data, a fake search API, validation rules)
  is the same for everyone, so the comparison is about the frameworks.
- Results are reported as measured, including where Gyral loses.

Gyral is MIT-licensed; this repository is MIT as well. © 2026 Mike Zupper.
