// Startup of the todo app on a throttled connection and CPU, from a cold cache: when the
// input first renders, and when a typed-and-submitted todo first appears (first input
// handled). A fresh browser context per sample, so nothing is cached.
import { startupProbe } from './page.mjs';
import { shuffled } from './runtime.mjs';
import { summarize } from './stats.mjs';

/** Roughly Chrome DevTools' "Fast 4G" preset at the time of writing. */
export const NETWORK = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
};

async function sample(browser, url, cpu) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  try {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', NETWORK);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
    await page.addInitScript(startupProbe);
    await page.goto(url);
    await page.waitForFunction(() => window.__startup?.interactive !== undefined, undefined, {
      timeout: 60000,
    });
    return await page.evaluate(() => ({ ...window.__startup }));
  } finally {
    await context.close();
  }
}

/** `{ gyral: { rendered, interactive }, ... }`, frameworks interleaved per round. */
export async function startup(browser, baseUrl, frameworks, { runs, warmup, cpu, log }) {
  const url = (fw) => `${baseUrl}/${fw}/todo/`;
  const rendered = Object.fromEntries(frameworks.map((fw) => [fw, []]));
  const interactive = Object.fromEntries(frameworks.map((fw) => [fw, []]));
  for (const fw of frameworks) {
    for (let i = 0; i < warmup; i++) await sample(browser, url(fw), cpu);
  }
  for (let round = 0; round < runs; round++) {
    for (const fw of shuffled(frameworks, round + 101)) {
      const s = await sample(browser, url(fw), cpu);
      rendered[fw].push(s.rendered);
      interactive[fw].push(s.interactive);
    }
  }
  const out = Object.fromEntries(
    frameworks.map((fw) => [
      fw,
      { rendered: summarize(rendered[fw]), interactive: summarize(interactive[fw]) },
    ]),
  );
  log(`  startup: ${frameworks.map((fw) => `${fw} ${out[fw].interactive.median}`).join(', ')}`);
  return out;
}
