# How this variant run was made

Purpose: show how much of Lit's and Gyral's "clear" and "replace" times in the main run
(`../2026-10-05/`) come from the lit-html comment-marker leak
([lit/lit#5010](https://github.com/lit/lit/issues/5010),
[lit/lit#5298](https://github.com/lit/lit/issues/5298)), present in lit-html 3.3.1 to 3.3.3.

- Harness: commit `cc346e1` (same harness code as `dc601a6`; it only adds the main results)
  plus one uncommitted change in a separate worktree, which is
  why the results say `cc346e1-dirty`: `package.json` got
  `"pnpm": { "overrides": { "lit-html": "3.3.0" } }`, the last release without the leak.
- `pnpm install`, then `pnpm bench --only=gyral,lit --label=lit-html-3.3.0` with the same
  settings as the main run (15 runs after 5 warm-up, CPU 4x).
- Before the run: the Gyral and Lit correctness tests passed (12/12), and a create+clear cycle
  test showed "clear" staying flat (11–19 ms unthrottled per cycle) instead of growing by about
  85 ms per cycle as it does with lit-html 3.3.3.

Only Gyral and Lit were measured in this run. Compare them with each other, and with the
other frameworks only loosely (different run, same machine, same settings).
