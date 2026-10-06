// node scripts/pack-gyral-next.mjs [gyral checkout]: packs @gyral/core and @gyral/time from a
// Gyral checkout (default ../gyral-next, the `next` worktree) into vendor-next/, the tarballs
// frameworks/gyral-next installs. Then run `pnpm install` (the lockfile records their hashes).
//
// The packs get the version 0.3.0-next (and @gyral/time depends on that version), so the root
// overrides can tell them from the published 0.2.0 that frameworks/gyral measures. The commit
// they came from is recorded in vendor-next/SOURCE.json.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { ROOT } from './lib/config.mjs';

const VERSION = '0.3.0-next';
const gyral = resolve(process.argv[2] ?? join(ROOT, '..', 'gyral-next'));
const out = join(ROOT, 'vendor-next');

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8' }).trim();

function pack(name) {
  const work = mkdtempSync(join(tmpdir(), `pack-${name}-`));
  run('pnpm', ['pack', '--pack-destination', work], join(gyral, 'packages', name));
  const tgz = run('sh', ['-c', 'ls *.tgz'], work);
  run('tar', ['xzf', tgz], work);
  const manifest = join(work, 'package', 'package.json');
  const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
  pkg.version = VERSION;
  if (pkg.dependencies?.['@gyral/core'] !== undefined) pkg.dependencies['@gyral/core'] = VERSION;
  writeFileSync(manifest, `${JSON.stringify(pkg, null, 2)}\n`);
  const target = join(out, `gyral-${name}-next.tgz`);
  run('tar', ['czf', 'out.tgz', 'package'], work);
  copyFileSync(join(work, 'out.tgz'), target);
  rmSync(work, { recursive: true, force: true });
  console.log(`packed ${target}`);
}

pack('core');
pack('time');
const source = {
  checkout: relative(ROOT, gyral),
  branch: run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], gyral),
  commit: run('git', ['rev-parse', 'HEAD'], gyral),
  dirty: run('git', ['status', '--porcelain'], gyral) !== '',
  packed: new Date().toISOString(),
  version: VERSION,
};
writeFileSync(join(out, 'SOURCE.json'), `${JSON.stringify(source, null, 2)}\n`);
console.log(`${source.branch} ${source.commit}${source.dirty ? ' (dirty)' : ''}`);
console.log('Now run `pnpm install` to refresh the lockfile.');
