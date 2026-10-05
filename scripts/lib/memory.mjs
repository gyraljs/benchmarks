// JS heap of the table app: after load, after creating 1,000 rows, and after clearing them.
// Measured with CDP (Performance.getMetrics → JSHeapUsedSize) after a forced GC. This is the
// JavaScript heap only; DOM nodes owned by the renderer are not included.
import { openTable } from './runtime.mjs';
import { summarize } from './stats.mjs';

async function heap(cdp) {
  await cdp.send('HeapProfiler.collectGarbage');
  const { metrics } = await cdp.send('Performance.getMetrics');
  const used = metrics.find((m) => m.name === 'JSHeapUsedSize');
  return used.value / (1024 * 1024);
}

export async function memory(browser, baseUrl, fw, { runs, log }) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const ready = [];
  const after1k = [];
  const afterClear = [];
  try {
    for (let i = 0; i < runs; i++) {
      const page = await openTable(context, `${baseUrl}/${fw}/table/`);
      const cdp = await context.newCDPSession(page);
      await cdp.send('Performance.enable');
      ready.push(await heap(cdp));
      await page.evaluate(() => window.__bench.measure({ sel: '#run' }, { count: 1000 }));
      after1k.push(await heap(cdp));
      await page.evaluate(() => window.__bench.measure({ sel: '#clear' }, { count: 0 }));
      afterClear.push(await heap(cdp));
      await cdp.detach();
      await page.close();
    }
  } finally {
    await context.close();
  }
  const out = {
    ready: summarize(ready),
    after1k: summarize(after1k),
    afterClear: summarize(afterClear),
  };
  log(`  ${fw} memory: ready ${out.ready.median} MB, 1k rows ${out.after1k.median} MB`);
  return out;
}
