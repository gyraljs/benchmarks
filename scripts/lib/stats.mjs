// Summary statistics for a list of samples.

export function summarize(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  const n = sorted.length;
  const at = (q) => sorted[Math.min(n - 1, Math.max(0, Math.ceil(q * n) - 1))];
  const mean = sorted.reduce((s, x) => s + x, 0) / n;
  const sd = Math.sqrt(sorted.reduce((s, x) => s + (x - mean) ** 2, 0) / Math.max(1, n - 1));
  const round = (x) => Math.round(x * 100) / 100;
  return {
    n,
    median: round(n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2),
    p90: round(at(0.9)),
    min: round(sorted[0]),
    max: round(sorted[n - 1]),
    mean: round(mean),
    sd: round(sd),
    samples: samples.map(round),
  };
}

/** Geometric mean of (value / best value) across operations: 1.00 = fastest everywhere. */
export function geometricSlowdown(byOp, fw) {
  const ratios = Object.values(byOp).map((perFw) => {
    const best = Math.min(...Object.values(perFw).map((s) => s.median));
    return perFw[fw].median / best;
  });
  return Math.exp(ratios.reduce((s, r) => s + Math.log(r), 0) / ratios.length);
}
