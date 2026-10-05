// pnpm bench [--quick] [--only=gyral,react] [--label=name] [--timing=trace|frame]
//            [--runtime-only] [--strict-drift]
// Builds every app, measures bundle sizes, then runtime, memory and startup in Chromium, and
// writes results/<date>/results.json + results.md (results/quick/ for --quick runs;
// results/<date>-<label>/ for a labelled variant run, e.g. with a dependency pinned).
// Runtime timing is trace-based by default; --timing=frame uses the older in-page end point.
// Machine state is probed between operations; --strict-drift exits 1 if it drifted.
import { execSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { cpus, platform, release, totalmem } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { frameworkVersions, ROOT, selectedFrameworks } from './lib/config.mjs';
import { driftSummary, probe } from './lib/drift.mjs';
import { memory } from './lib/memory.mjs';
import { markdown } from './lib/report.mjs';
import { runtime } from './lib/runtime.mjs';
import { NETWORK, startup } from './lib/startup.mjs';
import { startServer } from './serve.mjs';
import { sizes } from './sizes.mjs';

const quick = process.argv.includes('--quick');
const label = process.argv.find((a) => a.startsWith('--label='))?.slice('--label='.length);
const frameworks = selectedFrameworks();
const timing = process.argv.includes('--timing=frame') ? 'frame' : 'trace';
const runtimeOnly = process.argv.includes('--runtime-only');
const probes = [probe('start')];
const CPU = 4;
const settings = quick
  ? { warmup: 1, runs: 3, memoryRuns: 1, startupRuns: 2, startupWarmup: 0, cpu: CPU }
  : { warmup: 5, runs: 15, memoryRuns: 5, startupRuns: 15, startupWarmup: 1, cpu: CPU };
const log = (line) => console.log(line);
class SkipRest extends Error {}

const only = process.argv.filter((a) => a.startsWith('--only='));
const built = spawnSync('node', ['scripts/build.mjs', ...only], { cwd: ROOT, stdio: 'inherit' });
if (built.status !== 0) process.exit(1);

/** Short commit, with `-dirty` when the working tree has uncommitted changes. */
function commit() {
  const sha = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
  const dirty = execSync('git status --porcelain', { cwd: ROOT }).toString().trim() !== '';
  return dirty ? `${sha}-dirty` : sha;
}

const date = new Date().toISOString().slice(0, 10);
const pkgVersion = (dir, name) =>
  JSON.parse(readFileSync(join(ROOT, dir, 'node_modules', name, 'package.json'), 'utf8')).version;
const server = await startServer();
const browser = await chromium.launch();
const results = {
  meta: {
    date,
    quick,
    label: label ?? null,
    frameworks,
    commit: commit(),
    machine: {
      cpu: cpus()[0]?.model ?? 'unknown',
      cores: cpus().length,
      memoryGiB: Math.round(totalmem() / 1024 ** 3),
      os: `${platform()} ${release()}`,
    },
    browser: browser.version(),
    playwright: pkgVersion('.', '@playwright/test'),
    node: process.version,
    vite: pkgVersion('.', 'vite'),
    versions: Object.fromEntries(
      Object.entries(frameworkVersions()).filter(([fw]) => frameworks.includes(fw)),
    ),
    settings: {
      ...settings,
      timing,
      network: `network ${NETWORK.latency} ms RTT, ${(NETWORK.downloadThroughput * 8) / 1024 / 1024} Mbit/s down`,
    },
  },
  sizes: sizes(frameworks),
};

try {
  log(`runtime (table app, ${timing} timing)`);
  results.runtime = await runtime(browser, server.url, frameworks, {
    ...settings,
    timing,
    log,
    afterOperation: (op) => {
      probes.push(probe(op.key));
    },
  });
  if (runtimeOnly) throw new SkipRest();
  log('memory (table app)');
  results.memory = {};
  for (const fw of frameworks) {
    results.memory[fw] = await memory(browser, server.url, fw, { runs: settings.memoryRuns, log });
  }
  log('startup (todo app)');
  results.startup = await startup(browser, server.url, frameworks, {
    runs: settings.startupRuns,
    warmup: settings.startupWarmup,
    cpu: settings.cpu,
    log,
  });
} catch (e) {
  if (!(e instanceof SkipRest)) throw e;
} finally {
  await browser.close();
  await server.close();
}
probes.push(probe('end'));
results.meta.drift = { ...driftSummary(probes), probes };

const dir = join(
  ROOT,
  'results',
  quick ? 'quick' : label === undefined ? date : `${date}-${label}`,
);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'results.json'), `${JSON.stringify(results, null, 2)}\n`);
writeFileSync(join(dir, 'results.md'), markdown(results));
log(`wrote ${join(dir, 'results.md')}`);
const { spread, flagged, limit } = results.meta.drift;
log(
  `machine drift: ${(spread * 100).toFixed(1)}% (limit ${limit * 100}%)${flagged ? ' FLAGGED' : ''}`,
);
if (flagged && process.argv.includes('--strict-drift')) process.exit(1);
