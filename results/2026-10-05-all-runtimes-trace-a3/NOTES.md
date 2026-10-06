# Notes: all Gyral runtime options (2026-10-05, attempt 3)

- **Builds** (same app sources; lit-html 3.3.0 for Lit and every Gyral build; trace timing,
  N=15, CPU 4x, one session, frameworks interleaved per round):
  - `gyral`: Gyral `exp/lit330-effect4`, Effect 4.0.1 (`vendor/`).
  - `gyral-noeffect`: `exp/no-effect` `b8332de`, hand-written runtime (`vendor-noeffect/`).
  - `gyral-twotrack`: `exp/two-track` `965b95e`, two-track 0.1.0 (`vendor-twotrack/`).
  - `gyral-pipewise`: `exp/pipewise` `25916fe`, lanes on pipewise 1.0.0 (`vendor-pipewise/`).
  - `gyral-combo`: `exp/combo` `a24ed6a`, pipewise lanes + two-track driver runs
    (`vendor-combo/`).
- **Attempts:** three full sessions were run under `/tmp/gyral-bench.lock`, each starting
  only when the 1-minute load was at most 3. Attempt 1 was flagged (load peaked at 6.0),
  attempt 2 was flagged (calibration spread 5.8%, likely CPU frequency scaling); **attempt 3
  is the reported run: spread 4.9% (limit 5%), max load 2.71, not flagged.** The flagged
  runs are kept in `../2026-10-05-all-runtimes-trace-a1/` and `-a2/` for reference; they show
  the same ordering.
- **Commit `5e6c2bb-dirty`:** the only uncommitted file at run time was
  `scripts/compare-all-runtimes.mjs` (report generator, not used by the run).
- **Correctness spec:** passes for every variant (70 tests).
- **Reading:** all five Gyral runtimes render the table at Lit's speed (geometric means
  1.34-1.36 vs Lit 1.34; script time per op within noise). They differ only in size and
  startup, where the runtime is loaded and parsed.
