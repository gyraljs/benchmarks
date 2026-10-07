// pnpm typecheck: each framework with its own checker (tsc, vue-tsc, svelte-check).
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { ROOT } from './lib/config.mjs';

const CHECKS = [
  ['.', 'tsc', ['-p', 'tsconfig.json']],
  ...[
    'gyral',
    'gyral-noeffect',
    'gyral-twotrack',
    'gyral-pipewise',
    'gyral-combo',
    'gyral-next',
    'lit',
    'react',
    'preact',
    'solid',
  ].map((fw) => [`frameworks/${fw}`, 'tsc', ['-p', 'tsconfig.json']]),
  ['frameworks/vue', 'vue-tsc', ['-p', 'tsconfig.json']],
  ['frameworks/svelte', 'svelte-check', ['--tsconfig', './tsconfig.json', '--fail-on-warnings']],
];

let failed = false;
for (const [dir, bin, args] of CHECKS) {
  const result = spawnSync('pnpm', ['exec', bin, ...args], {
    cwd: join(ROOT, dir),
    stdio: 'inherit',
  });
  console.log(`${result.status === 0 ? 'ok  ' : 'FAIL'} ${bin} ${dir}`);
  if (result.status !== 0) failed = true;
}
process.exit(failed ? 1 : 0);
