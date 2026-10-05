# How this variant run was made

- Branch `exp/lit330-effect4` of this repo (local, not pushed), harness `33f650f` plus:
  `package.json` `pnpm.overrides` for `lit-html: 3.3.0` and `@gyral/core` / `@gyral/time` →
  `file:vendor/*-exp-effect4.tgz`; `frameworks/gyral/package.json` points at the same
  tarballs; `scripts/lib/config.mjs` records the `effect` version in the metadata.
- Tarballs: `pnpm pack` of `packages/core` and `packages/time` in the Gyral worktree
  `~/git-repos/personal_brand/gyral-exp-effect4` at commit 371855b (Effect 4.0.1, lit-html
  pinned 3.3.0). Version strings still say 0.1.0; the metadata's `effect 4.0.1` tells them apart.
- `pnpm check` passed first (42/42 correctness tests), then
  `pnpm bench --label=lit-html-3.3.0-effect4` (all frameworks, 15 runs, CPU 4x).
