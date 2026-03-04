/**
 * PDF Template Loader — Client-Side
 *
 * Fetches the SF-86 PDF template from /public and caches the ArrayBuffer
 * in memory so subsequent calls don't re-fetch.
 */

let _cache: ArrayBuffer | null = null;
let _promise: Promise<ArrayBuffer> | null = null;

/**
 * Load the SF-86 PDF template bytes. Cached after first fetch.
 * @param templatePath - Path relative to public/ (default: "/sf861.pdf")
 */
export async function loadTemplate(templatePath = '/sf861.pdf'): Promise<ArrayBuffer> {
  if (_cache) return _cache;
  if (_promise) return _promise;

  _promise = fetch(templatePath).then(async (res) => {
    if (!res.ok) throw new Error(`Failed to load PDF template: ${res.status}`);
    const buf = await res.arrayBuffer();
    _cache = buf;
    return buf;
  });

  return _promise;
}

/** Clear the cached template (useful for testing). */
export function clearTemplateCache(): void {
  _cache = null;
  _promise = null;
}
