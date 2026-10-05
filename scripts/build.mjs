// pnpm build [--only=gyral,react]: a production Vite build of every app for every framework,
// each with its framework's own vite.config.ts and otherwise identical Vite defaults.
// Output: dist/<framework>/<app>/.
import { join } from 'node:path';
import { build } from 'vite';
import { APPS, DIST, ROOT, selectedFrameworks } from './lib/config.mjs';

for (const fw of selectedFrameworks()) {
  for (const app of APPS) {
    await build({
      configFile: join(ROOT, 'frameworks', fw, 'vite.config.ts'),
      root: join(ROOT, 'frameworks', fw, 'apps', app),
      base: './',
      logLevel: 'warn',
      build: { outDir: join(DIST, fw, app), emptyOutDir: true, reportCompressedSize: false },
    });
    console.log(`built ${fw}/${app}`);
  }
}
