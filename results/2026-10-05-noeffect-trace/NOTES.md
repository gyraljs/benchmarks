# Notes: Gyral with and without Effect (gyral-das, 2026-10-05)

- **Builds:** `gyral` = Gyral branch `exp/lit330-effect4` (Effect 4.0.1, `vendor/`);
  `gyral-noeffect` = Gyral branch `exp/no-effect` (`b8332de`, `vendor-noeffect/`), same app
  sources. lit-html 3.3.0 for Lit and both Gyral builds. Trace timing, N=15, CPU 4x.
- **Commit `-dirty`:** the main run's tree had the then-untracked `scripts/compare-noeffect.mjs`
  (committed afterwards, no effect on the apps); the confirming run's tree had the main run's
  uncommitted results directory.
- **Main run flagged:** calibration spread 8.6% (limit 5%), max load 11.0: other work on the
  machine during the run. Frameworks are interleaved per round, so within-run comparisons
  hold; don't compare these milliseconds with other runs. Sizes and memory are deterministic.
- **Confirming run** (`../2026-10-05-noeffect-trace-confirm/`, runtime only, Gyral ×2 + Lit):
  spread 4.0% (within limit), flagged on load 9.75. Geometric mean vs Lit across the nine
  table operations: Gyral (Effect 4) 1.012, Gyral (no Effect) 0.999. Script time per op is
  within noise between the two Gyral builds.
- **Conclusion:** removing Effect changes size, startup and memory, not rendering speed.
