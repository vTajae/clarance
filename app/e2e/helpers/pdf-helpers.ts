/**
 * PDF service integration helpers for E2E tests.
 *
 * Handles health checks, PDF export via Python service, and field extraction.
 */

import type { APIRequestContext } from '@playwright/test';
import { loadRegistry } from './test-fixtures';
import { uiToPdf } from '../../src/lib/field-registry/value-transformers';
import type { FieldDefinition } from '../../src/lib/field-registry/types';

const PDF_SERVICE = process.env.PDF_SERVICE_URL ?? 'http://localhost:8001';

/** Check if the PDF service is reachable. */
export async function checkPdfServiceHealth(request: APIRequestContext): Promise<boolean> {
  try {
    const resp = await request.get(`${PDF_SERVICE}/health`, { timeout: 5_000 });
    return resp.ok();
  } catch {
    return false;
  }
}

/**
 * Export a filled PDF by converting semantic key → UI value to
 * PDF field name → PDF value, then calling the Python service directly.
 */
export async function exportPdf(
  request: APIRequestContext,
  values: Record<string, unknown>,
): Promise<Buffer> {
  // Build semantic key → field definition map
  const registry = loadRegistry();
  const bySemanticKey = new Map<string, FieldDefinition>();
  for (const f of registry) bySemanticKey.set(f.semanticKey, f);

  // Convert semantic keys → PDF field names with PDF-formatted values
  const pdfFieldValues: Record<string, string> = {};
  for (const [key, uiValue] of Object.entries(values)) {
    if (uiValue === '' || uiValue == null) continue;
    const field = bySemanticKey.get(key);
    if (!field) continue;
    const pdfValue = uiToPdf(field, uiValue);
    if (pdfValue !== '') {
      pdfFieldValues[field.pdfFieldName] = pdfValue;
    }
  }

  return fillPdfDirect(request, pdfFieldValues);
}

/**
 * Extract field values from a PDF via the Python service.
 * Returns { pdfFieldName → pdfValue } map.
 */
export async function extractFields(
  request: APIRequestContext,
  pdfBuffer: Buffer,
): Promise<Record<string, string>> {
  const resp = await request.post(`${PDF_SERVICE}/extract-fields`, {
    multipart: {
      file: {
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: pdfBuffer,
      },
    },
    timeout: 120_000,
  });
  if (!resp.ok()) {
    const text = await resp.text();
    throw new Error(`Extract failed (${resp.status()}): ${text}`);
  }
  const body = await resp.json();
  return body.fields as Record<string, string>;
}

/**
 * Fill a PDF directly via the Python service (bypassing Next.js).
 * Accepts { pdfFieldName → pdfValue } map.
 */
export async function fillPdfDirect(
  request: APIRequestContext,
  fieldValues: Record<string, string>,
): Promise<Buffer> {
  const resp = await request.post(`${PDF_SERVICE}/fill-pdf`, {
    data: {
      template_path: 'sf861.pdf',
      field_values: fieldValues,
    },
    timeout: 120_000,
  });
  if (!resp.ok()) {
    const text = await resp.text();
    throw new Error(`Fill failed (${resp.status()}): ${text}`);
  }
  return Buffer.from(await resp.body());
}
