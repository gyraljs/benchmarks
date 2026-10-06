// TEMPORARY spike driver (not committed): bursty source under each flush strategy.
import { chromium } from '@playwright/test';
import { startServer } from './serve.mjs';

const STRATS = (process.env.STRATS ?? 'microtask,raf,task').split(',');
const SOURCES = [
  { name: '60/s (1 per 16 ms)', q: 'every=16&burst=1' },
  { name: '250/s (1 per 4 ms)', q: 'every=4&burst=1' },
  { name: '2000/s (8 per 4 ms)', q: 'every=4&burst=8' },
];
const CPU = Number(process.env.CPU ?? 4);
const SECONDS = 3;
const server = await startServer();
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const rows = [];
try {
  for (let round = 0; round < 3; round++) {
    for (const src of SOURCES) {
      for (const strat of STRATS) {
        const page = await ctx.newPage();
        const flush = strat === 'microtask' ? '' : strat === 'lane' ? '&lane=frame' : `&gyral-flush=${strat}`;
        await page.goto(`${server.url}/spike-stream/?${src.q}${flush}`);
        await page.waitForFunction(() => document.querySelector('spike-stream')?.shadowRoot?.querySelector('#start') != null);
        const cdp = await ctx.newCDPSession(page);
        await cdp.send('Performance.enable');
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
        await page.evaluate(() => {
          const w = window;
          w.__frames = 0; w.__maxGap = 0; let last = 0;
          const loop = (t) => { if (last) w.__maxGap = Math.max(w.__maxGap, t - last); last = t; w.__frames++; requestAnimationFrame(loop); };
          requestAnimationFrame(loop);
          document.querySelector('spike-stream').shadowRoot.querySelector('#start').click();
        });
        await new Promise((r) => setTimeout(r, 300));
        const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
        const p0 = await page.evaluate(() => ({ f: window.__frames, r: window.__renders, t: window.__ticks(), now: performance.now() }));
        await page.evaluate(() => { window.__maxGap = 0; });
        await new Promise((r) => setTimeout(r, SECONDS * 1000));
        const p1 = await page.evaluate(() => ({ f: window.__frames, r: window.__renders, t: window.__ticks(), now: performance.now(), gap: window.__maxGap }));
        const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
        const secs = (p1.now - p0.now) / 1000;
        rows.push({ src: src.name, strat, round, fps: (p1.f - p0.f) / secs, ticks: (p1.t - p0.t) / secs, renders: (p1.r - p0.r) / secs, script: (m1.ScriptDuration - m0.ScriptDuration) / secs, task: (m1.TaskDuration - m0.TaskDuration) / secs, gap: p1.gap });
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
        await page.close();
      }
    }
  }
} finally {
  await ctx.close(); await browser.close(); await server.close();
}
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
console.log(`CPU ${CPU}x, ${SECONDS} s windows, median of 3 rounds`);
console.log('| source | flush | msgs/s handled | renders/s | frames/s | worst frame gap ms | main-thread busy % | script % |');
for (const src of SOURCES) for (const strat of STRATS) {
  const r = rows.filter((x) => x.src === src.name && x.strat === strat);
  console.log(`| ${src.name} | ${strat} | ${med(r.map((x) => x.ticks)).toFixed(0)} | ${med(r.map((x) => x.renders)).toFixed(0)} | ${med(r.map((x) => x.fps)).toFixed(1)} | ${med(r.map((x) => x.gap)).toFixed(0)} | ${(med(r.map((x) => x.task)) * 100).toFixed(0)} | ${(med(r.map((x) => x.script)) * 100).toFixed(0)} |`);
}
