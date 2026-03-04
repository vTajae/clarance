#!/usr/bin/env node
/**
 * Pre-render PDF pages as static PNGs.
 *
 * Uses the existing Python PDF service (must be running) to render each page
 * of the SF-86 PDF template as a PNG image. Output goes to public/pdf-pages/.
 *
 * Usage:
 *   node scripts/pre-render-pages.mjs [--service-url http://localhost:8001] [--dpi 150] [--version sf861]
 *
 * The SF-86 has 127 pages (0-indexed: 0-126).
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : defaultVal;
}

const SERVICE_URL = getArg('service-url', 'http://localhost:8001');
const DPI = getArg('dpi', '150');
const VERSION = getArg('version', 'sf861');
const TOTAL_PAGES = parseInt(getArg('pages', '127'), 10);

const outDir = join(process.cwd(), 'public', 'pdf-pages', VERSION);
mkdirSync(outDir, { recursive: true });

console.log(`Rendering ${TOTAL_PAGES} pages at ${DPI} DPI from ${SERVICE_URL}...`);
console.log(`Output: ${outDir}`);

let success = 0;
let failed = 0;

for (let page = 0; page < TOTAL_PAGES; page++) {
  try {
    const url = `${SERVICE_URL}/render-page/${VERSION}/${page}?dpi=${DPI}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`  Page ${page}: HTTP ${res.status}`);
      failed++;
      continue;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const outPath = join(outDir, `page-${page}.png`);
    writeFileSync(outPath, buf);
    success++;

    if ((page + 1) % 10 === 0 || page === TOTAL_PAGES - 1) {
      console.log(`  ${page + 1}/${TOTAL_PAGES} pages rendered`);
    }
  } catch (err) {
    console.error(`  Page ${page}: ${err.message}`);
    failed++;
  }
}

console.log(`\nDone: ${success} pages rendered, ${failed} failed.`);
if (failed > 0) process.exit(1);
