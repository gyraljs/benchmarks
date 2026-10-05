// pnpm bench [--quick] [--only=gyral,react]
// Builds every app, measures bundle sizes, then runtime, memory and startup in Chromium, and
// writes results/<date>/results.json + results.md (results/quick/ for --quick runs).
import { execSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { cpus, platform, release, totalmem } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { frameworkVersions, ROOT, selectedFrameworks } from './lib/config.mjs';
import { memory } from './lib/memory.mjs';
import { markdown } from './lib/report.mjs';
import { runtime } from './lib/runtime.mjs';
import { NETWORK, startup } from './lib/startup.mjs';
import { startServer } from './serve.mjs';
import { sizes } from './sizes.mjs';

const quick = process.argv.includes('--quick');
const frameworks = selectedFrameworks();
const CPU = 4;
const settings = quick
  ? { warmup: 1, runs: 3, memoryRuns: 1, startupRuns: 2, startupWarmup: 0, cpu: CPU }
  : { warmup: 5, runs: 15, memoryRuns: 5, startupRuns: 15, startupWarmup: 1, cpu: CPU };
const log = (line) => console.log(line);

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
      network: `network ${NETWORK.latency} ms RTT, ${(NETWORK.downloadThroughput * 8) / 1024 / 1024} Mbit/s down`,
    },
  },
  sizes: sizes(frameworks),
};

try {
  log('runtime (table app)');
  results.runtime = await runtime(browser, server.url, frameworks, { ...settings, log });
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
} finally {
  await browser.close();
  await server.close();
}

const dir = join(ROOT, 'results', quick ? 'quick' : date);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'results.json'), `${JSON.stringify(results, null, 2)}\n`);
writeFileSync(join(dir, 'results.md'), markdown(results));
log(`wrote ${join(dir, 'results.md')}`);
