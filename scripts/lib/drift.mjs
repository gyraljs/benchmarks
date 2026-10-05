// Machine-state probes. A fixed CPU workload is timed before, between and after the runtime
// operations; if its speed moves by more than DRIFT_LIMIT the run is flagged (the 2026-10-05
// A/B/C runs drifted 10-15% between sessions). Load average and CPU frequency are recorded too.
import { readFileSync, readdirSync } from 'node:fs';
import { cpus, loadavg } from 'node:os';

export const DRIFT_LIMIT = 0.05;

/** A deterministic integer workload; returns the median of 5 timings in ms (after 2 warm-ups). */
export function calibrate() {
  const times = [];
  for (let r = -2; r < 5; r++) {
    const t0 = performance.now();
    let x = 0x9e3779b9;
    for (let i = 0; i < 20_000_000; i++) x = (Math.imul(x ^ (x >>> 15), 0x2c1b3c6d) + i) | 0;
    if (r >= 0) times.push(performance.now() - t0);
    if (x === 42) console.log('');
  }
  times.sort((a, b) => a - b);
  return Math.round(times[2] * 100) / 100;
}

/** Mean current CPU frequency in MHz from sysfs (Linux), or null. */
function cpuMHz() {
  try {
    const base = '/sys/devices/system/cpu';
    const khz = readdirSync(base)
      .filter((d) => /^cpu\d+$/.test(d))
      .map((d) => Number(readFileSync(`${base}/${d}/cpufreq/scaling_cur_freq`, 'utf8')));
    return Math.round(khz.reduce((s, k) => s + k, 0) / khz.length / 1000);
  } catch {
    return null;
  }
}

/** One probe: `{ at, label, calibrationMs, load1, cpuMHz }`. */
export function probe(label) {
  return {
    at: new Date().toISOString(),
    label,
    calibrationMs: calibrate(),
    load1: Math.round(loadavg()[0] * 100) / 100,
    cpuMHz: cpuMHz(),
  };
}

/**
 * Summary of a run's probes: spread of the calibration time, peak load, and `flagged` when the
 * spread exceeds the limit or the 1-minute load average exceeded half the cores.
 */
export function driftSummary(probes) {
  const ms = probes.map((p) => p.calibrationMs);
  const spread = (Math.max(...ms) - Math.min(...ms)) / Math.min(...ms);
  const maxLoad1 = Math.max(...probes.map((p) => p.load1));
  // Other work on the machine competes with Chromium even when the calibration core is idle.
  const busy = maxLoad1 > cpus().length / 2;
  return {
    limit: DRIFT_LIMIT,
    spread: Math.round(spread * 1000) / 1000,
    maxLoad1,
    busy,
    flagged: spread > DRIFT_LIMIT || busy,
  };
}
