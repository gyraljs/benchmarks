import { expect, test } from '@playwright/test';
import { analyzeTrace, TRACE_CATEGORIES, type TraceEvent } from '../scripts/lib/trace.mjs';

// The trace-based timing (scripts/lib/trace.mjs): unit checks on hand-made traces, then one
// end-to-end accuracy check against a click handler that busy-waits a known time.

const ev = (name: string, ts: number, dur: number, type?: string): TraceEvent => ({
  name,
  ph: 'X',
  ts: ts * 1000,
  dur: dur * 1000,
  pid: 1,
  tid: 1,
  ...(type === undefined ? {} : { args: { data: { type } } }),
});

test.describe('analyzeTrace', () => {
  test('click to the commit after the last work', () => {
    const t = analyzeTrace([
      ev('EventDispatch', 0, 10, 'click'),
      ev('FunctionCall', 0, 10),
      ev('Commit', 12, 1), // an earlier frame, before the timer below
      ev('TimerFire', 20, 5),
      ev('UpdateLayoutTree', 26, 2),
      ev('Layout', 28, 4),
      ev('Paint', 33, 3),
      ev('Commit', 36, 1),
      ev('Commit', 60, 1), // later, unrelated frame
    ]);
    expect(t.total).toBe(37);
    expect(t.script).toBe(15);
    expect(t.styleLayout).toBe(6);
    expect(t.paint).toBe(5);
    expect(t.idle).toBe(11);
    expect(t.commits).toBe(2);
  });

  test('ignores other threads and overlapping events count once', () => {
    const other = { ...ev('Layout', 5, 100), tid: 2 };
    const t = analyzeTrace([
      ev('EventDispatch', 0, 8, 'click'),
      ev('FunctionCall', 1, 6),
      ev('RunMicrotasks', 2, 4),
      other,
      ev('Commit', 10, 1),
    ]);
    expect(t.total).toBe(11);
    expect(t.script).toBe(8);
  });

  test('needs exactly one click and a commit', () => {
    expect(() => analyzeTrace([ev('Commit', 1, 1)])).toThrow(/exactly one click/);
    expect(() => analyzeTrace([ev('EventDispatch', 0, 1, 'click')])).toThrow(/no Commit/);
  });
});

test('measures a 20 ms click handler within ±2 ms', async ({ browser, page }) => {
  await page.setContent(`<button id="go">go</button><p id="out">0</p><script>
    document.getElementById('go').addEventListener('click', () => {
      const until = performance.now() + 20;
      while (performance.now() < until);
      document.getElementById('out').textContent = '1';
    });
  </script>`);
  const box = await page.locator('#go').boundingBox();
  expect(box).not.toBeNull();
  await browser.startTracing(page, { categories: TRACE_CATEGORIES });
  await page.mouse.click((box?.x ?? 0) + 5, (box?.y ?? 0) + 5);
  await expect(page.locator('#out')).toHaveText('1');
  await page.waitForTimeout(100);
  const trace = JSON.parse((await browser.stopTracing()).toString()) as {
    traceEvents: TraceEvent[];
  };
  const t = analyzeTrace(trace.traceEvents);
  expect(Math.abs(t.script - 20)).toBeLessThanOrEqual(2);
  expect(t.total).toBeGreaterThanOrEqual(t.script);
});
