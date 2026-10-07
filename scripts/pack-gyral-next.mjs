// node scripts/pack-gyral-next.mjs [gyral checkout]: packs @gyral/core and @gyral/time from a
// Gyral checkout (default ../gyral) into vendor-next/, the tarballs
// the `gyral-next` variant (frameworks/gyral-next) installs. Then set the root override
// `@gyral/time@<version>>@gyral/core` to the version printed below and run `pnpm install` (the
// lockfile records the tarballs' hashes).
//
// vendor-next/ currently holds Gyral's own 0.3.0 release packs, copied unchanged
// (vendor-next/SOURCE.json); this script is for measuring an unreleased Gyral checkout. The packs
// get the checkout's version plus `-local` (and @gyral/time depends on that version), so reports
// can't mistake them for a release and the root overrides can tell them from the published
// 0.2.0 that frameworks/gyral measures. The commit they came from is recorded in SOURCE.json.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { ROOT } from './lib/config.mjs';

const gyral = resolve(process.argv[2] ?? join(ROOT, '..', 'gyral'));
const out = join(ROOT, 'vendor-next');
const coreManifest = join(gyral, 'packages', 'core', 'package.json');
const VERSION = `${JSON.parse(readFileSync(coreManifest, 'utf8')).version}-local`;

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
console.log(`Now set "@gyral/time@${VERSION}>@gyral/core" in the root pnpm.overrides`);
console.log('(in place of the current @gyral/time@…>@gyral/core key) and run `pnpm install`.');
