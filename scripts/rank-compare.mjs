// node scripts/rank-compare.mjs <out.md> <old results dir> <new results dir>
// Compares runtime rankings between two runs (e.g. frame timing vs trace timing on the same
// builds): per operation, each framework's median and rank in both runs, and the geometric
// mean of slowdown. Rank changes are marked.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { OPERATIONS } from './lib/runtime.mjs';
import { geometricSlowdown } from './lib/stats.mjs';

const [out, oldDir, newDir] = process.argv.slice(2);
if (out === undefined || oldDir === undefined || newDir === undefined) {
  console.error('usage: node scripts/rank-compare.mjs <out.md> <old dir> <new dir>');
  process.exit(1);
}
const load = (dir) => JSON.parse(readFileSync(join(dir, 'results.json'), 'utf8'));
const runs = { old: load(oldDir), new: load(newDir) };
const fws = runs.new.meta.frameworks.filter((fw) => runs.old.meta.frameworks.includes(fw));

/** `{ fw: rank }` by median for one operation (1 = fastest). */
function ranks(run, op) {
  const sorted = [...fws].sort((a, b) => run.runtime[a][op].median - run.runtime[b][op].median);
  return Object.fromEntries(sorted.map((fw, i) => [fw, i + 1]));
}

const row = (cells) => `| ${cells.join(' | ')} |`;
const lines = [
  '# Ranking: frame timing vs trace timing',
  '',
  `- old: \`${oldDir}\` (timing: ${runs.old.meta.settings.timing ?? 'frame'})`,
  `- new: \`${newDir}\` (timing: ${runs.new.meta.settings.timing ?? 'frame'})`,
  '',
  'Cells: median ms (rank) old → new. ⇄ marks a rank change.',
  '',
  row(['Operation', ...fws]),
  row(['---', ...fws.map(() => '---:')]),
];
let changes = 0;
for (const op of OPERATIONS) {
  const ro = ranks(runs.old, op.key);
  const rn = ranks(runs.new, op.key);
  lines.push(
    row([
      op.name,
      ...fws.map((fw) => {
        const moved = ro[fw] !== rn[fw];
        if (moved) changes++;
        const o = runs.old.runtime[fw][op.key].median.toFixed(1);
        const n = runs.new.runtime[fw][op.key].median.toFixed(1);
        return `${o} (${ro[fw]}) → ${n} (${rn[fw]})${moved ? ' ⇄' : ''}`;
      }),
    ]),
  );
}
const byOp = (run) =>
  Object.fromEntries(
    OPERATIONS.map((op) => [
      op.key,
      Object.fromEntries(fws.map((fw) => [fw, run.runtime[fw][op.key]])),
    ]),
  );
const gm = (run) => Object.fromEntries(fws.map((fw) => [fw, geometricSlowdown(byOp(run), fw)]));
const go = gm(runs.old);
const gn = gm(runs.new);
const order = (g) => [...fws].sort((a, b) => g[a] - g[b]);
lines.push(
  row([
    'geometric mean of slowdown',
    ...fws.map((fw) => `${go[fw].toFixed(2)} → ${gn[fw].toFixed(2)}`),
  ]),
  '',
  `Overall order old: ${order(go).join(' < ')}`,
  `Overall order new: ${order(gn).join(' < ')}`,
  '',
  `${changes} per-operation rank changes.`,
  '',
);
writeFileSync(out, lines.join('\n'));
console.log(`wrote ${out}`);
