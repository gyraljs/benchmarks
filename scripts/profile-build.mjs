// pnpm profile:build — builds the profiling variants (docs/profile.md):
//   dist/p-<fw>/table/  production build, minified like the benchmark apps (timing runs);
//   dist/u-<fw>/table/  not minified, one output file per source module (CPU profiles, so
//                       samples can be attributed to lit-html, @gyral/core, effect or the app).
// The variant (shadow/light, compact, css) is picked by the page URL, so one build serves all.
import { join } from 'node:path';
import { build } from 'vite';
import { DIST, ROOT } from './lib/config.mjs';

export const PROFILED = ['lit', 'gyral'];

for (const fw of PROFILED) {
  const root = join(ROOT, 'frameworks', fw, 'profile', 'table');
  const configFile = join(ROOT, 'frameworks', fw, 'vite.config.ts');
  await build({
    configFile,
    root,
    base: './',
    logLevel: 'warn',
    build: {
      outDir: join(DIST, `p-${fw}`, 'table'),
      emptyOutDir: true,
      reportCompressedSize: false,
    },
  });
  await build({
    configFile,
    root,
    base: './',
    logLevel: 'warn',
    build: {
      outDir: join(DIST, `u-${fw}`, 'table'),
      emptyOutDir: true,
      reportCompressedSize: false,
      minify: false,
      rollupOptions: { preserveEntrySignatures: 'strict', output: { preserveModules: true } },
    },
  });
  console.log(`built p-${fw}/table and u-${fw}/table`);
}
