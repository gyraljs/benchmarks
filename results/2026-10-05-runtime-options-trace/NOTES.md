# Notes: Gyral runtime options (2026-10-05)

- **Builds** (same app sources; lit-html 3.3.0 for Lit and every Gyral build; trace timing,
  N=15, CPU 4x, one session, frameworks interleaved per round):
  - `gyral`: Gyral branch `exp/lit330-effect4`, Effect 4.0.1 (`vendor/`).
  - `gyral-noeffect`: Gyral branch `exp/no-effect` `b8332de`, hand-written runtime
    (`vendor-noeffect/`).
  - `gyral-twotrack`: Gyral branch `exp/two-track` `965b95e`, the no-Effect runtime rebuilt
    on two-track 0.1.0 (`vendor-twotrack/`, local tarball: two-track is not on npm). Its
    version is recorded here, not in `results.json`: the harness reads versions through
    `require`, and two-track's `exports` has only an `import` condition.
- **Flagged:** calibration spread 5.9% (limit 5%), max load 4.69 (other agents building).
  Compare within this run only. Sizes and memory are deterministic.
- **Correctness spec:** passes for every variant (57 tests, including gyral-twotrack).
- **Reading:** the three Gyral runtimes render the table at the same speed as Lit (geometric
  means 1.33 / 1.37 / 1.33 vs Lit 1.32; per-op differences are within the p90 spread).
  two-track costs about 0.3 KiB gzip over the hand-written runtime and ~7 ms of startup
  (within noise of the no-Effect build's 433 ms).
