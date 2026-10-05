// Code that runs INSIDE the benchmark page (installed with page.addInitScript). It is plain
// browser JavaScript: no imports, no closures over Node values.

/** Installs `window.__bench` for the keyed table app. */
export function tableHelpers() {
  const root = () => {
    const app = document.getElementById('app');
    const host = app?.firstElementChild;
    return host?.shadowRoot ?? app;
  };
  const tbody = () => root()?.querySelector('#tbody') ?? null;
  const rowAt = (i) => tbody()?.children[i] ?? null;
  const label = (i) => rowAt(i)?.querySelector('.lbl')?.textContent?.trim() ?? '';
  const rowId = (i) => rowAt(i)?.querySelector('.col-id')?.textContent?.trim();

  /** Every key present in `cond` must hold. */
  const holds = (cond) => {
    const body = tbody();
    if (body === null) return false;
    if (cond.count !== undefined && body.children.length !== cond.count) return false;
    if (cond.firstIdNot !== undefined && rowId(0) === cond.firstIdNot) return false;
    if (cond.suffixCount !== undefined) {
      const { rows, n } = cond.suffixCount;
      if (!rows.every((i) => label(i).split('!!!').length - 1 === n)) return false;
    }
    if (cond.selected !== undefined) {
      const row = rowAt(cond.selected);
      if (row === null || !row.classList.contains('danger')) return false;
    }
    if (cond.idAt !== undefined && rowId(cond.idAt[0]) !== cond.idAt[1]) return false;
    return true;
  };

  /**
   * Clicks `target` and resolves with the milliseconds until the DOM satisfies `cond` and the
   * next frame has been rendered (requestAnimationFrame, then a MessageChannel task, which runs
   * after that frame's style, layout and paint).
   */
  const measure = (target, cond) =>
    new Promise((resolve, reject) => {
      const el =
        target.row === undefined
          ? root()?.querySelector(target.sel)
          : rowAt(target.row)?.querySelector(target.sel);
      if (el === null || el === undefined) {
        reject(new Error(`target not found: ${JSON.stringify(target)}`));
        return;
      }
      let done = false;
      let t0 = 0;
      const observer = new MutationObserver(() => check());
      const timeout = setTimeout(() => {
        if (done) return;
        done = true;
        observer.disconnect();
        reject(new Error(`timed out waiting for ${JSON.stringify(cond)}`));
      }, 60000);
      const check = () => {
        if (done || !holds(cond)) return;
        done = true;
        observer.disconnect();
        clearTimeout(timeout);
        requestAnimationFrame(() => {
          const channel = new MessageChannel();
          channel.port1.onmessage = () => resolve(performance.now() - t0);
          channel.port2.postMessage(null);
        });
      };
      observer.observe(root(), {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
      t0 = performance.now();
      el.click();
      check();
    });

  window.__bench = {
    ready: () => (root()?.querySelector('#run') ?? null) !== null,
    rowId,
    measure,
  };
}

/**
 * Installs a startup probe for the todo app: as soon as the input exists it types a todo and
 * submits it, and records when the input first appeared (`rendered`) and when the todo appeared
 * (`interactive`), both in ms since navigation start. Polls once per animation frame.
 */
export function startupProbe() {
  const find = (sel) => {
    const app = document.getElementById('app');
    const host = app?.firstElementChild;
    return (host?.shadowRoot ?? app)?.querySelector(sel) ?? null;
  };
  // Every implementation prevents the default itself; this only stops a reload if a submit
  // ever lands before the app's own handler exists.
  document.addEventListener('submit', (e) => e.preventDefault());
  const probe = { rendered: undefined, interactive: undefined, attempts: 0 };
  window.__startup = probe;
  let sinceTyped = 0;
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  const tick = () => {
    const input = find('#new-todo');
    if (input !== null && probe.rendered === undefined) probe.rendered = performance.now();
    if (find('#todo-list li') !== null) {
      probe.interactive = performance.now();
      return;
    }
    if (input !== null && (probe.attempts === 0 || sinceTyped > 30)) {
      probe.attempts++;
      sinceTyped = 0;
      setValue.call(input, 'first');
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      setTimeout(() => input.form?.requestSubmit(), 0);
    }
    sinceTyped++;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
