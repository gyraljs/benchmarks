// Types for trace.mjs (used by the Playwright specs in tests/).
export interface TraceEvent {
  name: string;
  ph: string;
  ts: number;
  dur?: number;
  pid: number;
  tid: number;
  args?: { data?: { type?: string; id?: number } };
}
export interface TraceTiming {
  total: number;
  script: number;
  styleLayout: number;
  paint: number;
  idle: number;
  commits: number;
  rafDelay: number;
}
export const TRACE_CATEGORIES: string[];
export const CATEGORIES: { script: string[]; styleLayout: string[]; paint: string[] };
export function unionLength(events: TraceEvent[], from: number, to: number): number;
export function analyzeTrace(traceEvents: TraceEvent[]): TraceTiming;
