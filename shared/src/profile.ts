// Shared by the profiling variants (docs/profile.md): the options a variant is built with, read
// from the page URL so one build serves every combination, and the one table stylesheet used
// by the "with CSS" variants (the same rules in a shadow root or in the document).

export interface VariantOptions {
  /** Render into a shadow root (Lit and Gyral's default) or the element's light DOM. */
  readonly shadow: boolean;
  /** Templates without whitespace text nodes between tags (`compact`) or indented as usual. */
  readonly compact: boolean;
  /** Apply TABLE_CSS: adopted in the shadow root, or as a document stylesheet in light DOM. */
  readonly css: boolean;
}

/** `?shadow=0&compact=1&css=1`; defaults are the benchmark's own app (shadow, indented, no CSS). */
export function variantOptions(search: string = location.search): VariantOptions {
  const q = new URLSearchParams(search);
  return {
    shadow: q.get('shadow') !== '0',
    compact: q.get('compact') === '1',
    css: q.get('css') === '1',
  };
}

export const TABLE_CSS = `
  table { border-collapse: collapse; inline-size: 100%; font: 14px/1.4 system-ui, sans-serif; }
  td { padding: 4px 8px; border-block-start: 1px solid #ddd; vertical-align: middle; }
  td.col-id { inline-size: 6em; color: #555; }
  tr.danger { background: #f2dede; }
  button.lbl { all: unset; color: #0645ad; cursor: pointer; }
  button.remove { border: 1px solid #ccc; border-radius: 3px; background: #fafafa; padding: 0 6px; }
  menu { display: flex; gap: 4px; padding: 0; list-style: none; }
`;

/** Light-DOM variants with CSS: the stylesheet goes into the document, once. */
export function adoptDocumentCss(options: VariantOptions): void {
  if (options.shadow || !options.css) return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(TABLE_CSS);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}
