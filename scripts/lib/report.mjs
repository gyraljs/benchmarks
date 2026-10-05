// Turns results.json into results.md.
import { APPS } from './config.mjs';
import { OPERATIONS } from './runtime.mjs';
import { geometricSlowdown } from './stats.mjs';

const kib = (bytes) => (bytes / 1024).toFixed(1);
const row = (cells) => `| ${cells.join(' | ')} |`;
const header = (cells) => [row(cells), row(cells.map((_, i) => (i === 0 ? '---' : '---:')))];

function sizeTable(results, metric, kind) {
  const fws = results.meta.frameworks;
  return [
    ...header(['App', ...fws]),
    ...APPS.map((app) => row([app, ...fws.map((fw) => kib(results.sizes[fw][app][kind][metric]))])),
  ];
}

function runtimeTable(results) {
  const fws = results.meta.frameworks;
  const lines = header(['Operation (median / p90, ms)', ...fws]);
  for (const op of OPERATIONS) {
    const best = Math.min(...fws.map((fw) => results.runtime[fw][op.key].median));
    lines.push(
      row([
        op.name,
        ...fws.map((fw) => {
          const s = results.runtime[fw][op.key];
          const cell = `${s.median.toFixed(1)} / ${s.p90.toFixed(1)}`;
          return s.median === best ? `**${cell}**` : cell;
        }),
      ]),
    );
  }
  const byOp = Object.fromEntries(
    OPERATIONS.map((op) => [
      op.key,
      Object.fromEntries(fws.map((fw) => [fw, results.runtime[fw][op.key]])),
    ]),
  );
  lines.push(
    row([
      'geometric mean of slowdown vs fastest',
      ...fws.map((fw) => geometricSlowdown(byOp, fw).toFixed(2)),
    ]),
  );
  return lines;
}

function memoryTable(results) {
  const fws = results.meta.frameworks;
  const label = {
    ready: 'after load',
    after1k: 'after creating 1,000 rows',
    afterClear: 'after clearing them',
  };
  return [
    ...header(['JS heap (MB, median)', ...fws]),
    ...Object.keys(label).map((k) =>
      row([label[k], ...fws.map((fw) => results.memory[fw][k].median.toFixed(2))]),
    ),
  ];
}

function startupTable(results) {
  const fws = results.meta.frameworks;
  return [
    ...header(['Todo app startup (median / p90, ms)', ...fws]),
    row([
      'input rendered',
      ...fws.map((fw) => {
        const s = results.startup[fw].rendered;
        return `${s.median.toFixed(0)} / ${s.p90.toFixed(0)}`;
      }),
    ]),
    row([
      'first todo added (interactive)',
      ...fws.map((fw) => {
        const s = results.startup[fw].interactive;
        return `${s.median.toFixed(0)} / ${s.p90.toFixed(0)}`;
      }),
    ]),
  ];
}

export function markdown(results) {
  const m = results.meta;
  const versions = Object.entries(m.versions)
    .map(
      ([fw, pkgs]) =>
        `- **${fw}**: ${Object.entries(pkgs)
          .map(([n, v]) => `${n} ${v}`)
          .join(', ')}`,
    )
    .join('\n');
  return `# Benchmark results, ${m.date}

${m.quick ? '> **Quick run** (few samples): for checking the harness, not for conclusions.\n' : ''}
- Machine: ${m.machine.cpu} (${m.machine.cores} cores), ${m.machine.memoryGiB} GiB RAM, ${m.machine.os}
- Browser: Chromium ${m.browser} (Playwright ${m.playwright}), headless
- Node ${m.node}, Vite ${m.vite}; commit ${m.commit}
- Runtime: ${m.settings.runs} runs after ${m.settings.warmup} warm-up per operation, CPU throttled ${m.settings.cpu}x
- Memory: ${m.settings.memoryRuns} runs. Startup: ${m.settings.startupRuns} runs, CPU ${m.settings.cpu}x, ${m.settings.network}

Framework versions:

${versions}

Method and caveats: [docs/methodology.md](../../docs/methodology.md).

## Bundle size: JavaScript, gzip level 9 (KiB)

${sizeTable(results, 'gzip', 'js').join('\n')}

## Bundle size: JavaScript, brotli quality 11 (KiB)

${sizeTable(results, 'brotli', 'js').join('\n')}

## Bundle size: JavaScript, minified (KiB)

${sizeTable(results, 'min', 'js').join('\n')}

## Bundle size: everything served (HTML + CSS + JS), gzip (KiB)

${sizeTable(results, 'gzip', 'total').join('\n')}

## Runtime: keyed table app (lower is better; fastest in bold)

${runtimeTable(results).join('\n')}

## Memory: keyed table app

${memoryTable(results).join('\n')}

## Startup: todo app, cold cache, throttled network and CPU

${startupTable(results).join('\n')}
`;
}
