// pnpm profile:nodes — counts the DOM nodes each table app creates for 1,000 rows (no timing):
// elements, text, whitespace-only text and comments inside <tbody>, plus whether the table is
// in a shadow root. Writes results/<date>-profile/nodes.{json,md}.
// It still drives Chromium, so run it under the machine lock like the timed runs.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { ROOT } from './lib/config.mjs';
import { tableHelpers } from './lib/page.mjs';
import { NODE_COUNT_PAGES } from './lib/variants.mjs';
import { startServer } from './serve.mjs';

const server = await startServer();
const browser = await chromium.launch();
const out = {};
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  for (const [name, path] of Object.entries(NODE_COUNT_PAGES)) {
    const page = await context.newPage();
    await page.addInitScript(tableHelpers);
    await page.goto(`${server.url}/${path}`);
    await page.waitForFunction(() => window.__bench?.ready() === true);
    await page.evaluate(() => {
      const app = document.getElementById('app');
      const root = app?.firstElementChild?.shadowRoot ?? app;
      root?.querySelector('#run')?.click();
    });
    await page.waitForFunction(() => window.__bench.holds({ count: 1000 }));
    out[name] = await page.evaluate(() => {
      const app = document.getElementById('app');
      const shadow = app?.firstElementChild?.shadowRoot ?? null;
      const tbody = (shadow ?? app)?.querySelector('#tbody');
      const counts = { elements: 0, text: 0, whitespace: 0, comments: 0 };
      const walk = document.createTreeWalker(tbody, NodeFilter.SHOW_ALL);
      for (let n = walk.nextNode(); n !== null; n = walk.nextNode()) {
        if (n.nodeType === Node.ELEMENT_NODE) counts.elements++;
        else if (n.nodeType === Node.COMMENT_NODE) counts.comments++;
        else if (n.nodeType === Node.TEXT_NODE) {
          if (n.textContent.trim() === '') counts.whitespace++;
          else counts.text++;
        }
      }
      return { shadow: shadow !== null, rows: tbody.children.length, ...counts };
    });
    await page.close();
  }
  await context.close();
} finally {
  await browser.close();
  await server.close();
}

const date = new Date().toISOString().slice(0, 10);
const dir = join(ROOT, 'results', `${date}-profile`);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'nodes.json'), `${JSON.stringify(out, null, 2)}\n`);
const per = (n, rows) => (n / rows).toFixed(1);
const lines = [
  '# DOM nodes for 1,000 rows (inside <tbody>)',
  '',
  '| app | shadow root | elements/row | text/row | whitespace text/row | comments/row | total/row |',
  '| --- | --- | ---: | ---: | ---: | ---: | ---: |',
  ...Object.entries(out).map(([name, c]) => {
    const total = c.elements + c.text + c.whitespace + c.comments;
    return `| ${name} | ${c.shadow ? 'yes' : 'no'} | ${per(c.elements, c.rows)} | ${per(c.text, c.rows)} | ${per(c.whitespace, c.rows)} | ${per(c.comments, c.rows)} | ${per(total, c.rows)} |`;
  }),
];
writeFileSync(join(dir, 'nodes.md'), `${lines.join('\n')}\n`);
console.log(lines.join('\n'));
