import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { pdfToUi } from '@/lib/field-registry/value-transformers';
import { getRegistrySync } from '@/lib/field-registry/registry-server';

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:8001';

const registry = getRegistrySync();

export async function POST(request: NextRequest) {
  const session = await auth();
  // TODO: Remove dev bypass once auth is re-enabled
  if (false && !session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 },
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 },
      );
    }

    const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50 MB
    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: 'PDF file too large (max 50 MB)' },
        { status: 413 },
      );
    }

    // Forward to Python PDF service for field extraction
    const pdfFormData = new FormData();
    pdfFormData.append('file', file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch(`${PDF_SERVICE_URL}/extract-fields`, {
      method: 'POST',
      body: pdfFormData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'PDF processing failed' },
        { status: 502 },
      );
    }

    const extractedData = await response.json();
    const pdfFields: Record<string, string> = extractedData.fields ?? {};

    // Map PDF field names → semantic keys using the registry
    const mappedValues: Record<string, unknown> = {};
    let mappedCount = 0;
    let unmappedCount = 0;
    const unmappedFields: string[] = [];

    for (const [pdfFieldName, pdfValue] of Object.entries(pdfFields)) {
      if (!pdfValue) continue; // skip empty fields

      const fieldDef = registry.getByPdfFieldName(pdfFieldName);
      if (fieldDef) {
        // Transform PDF value to UI value
        const uiValue = pdfToUi(fieldDef, pdfValue);

        // Skip unchecked checkboxes — "Off" converts to false, which is not
        // a meaningful user answer and would bloat form state.
        if (
          (fieldDef.uiFieldType === 'checkbox' || fieldDef.uiFieldType === 'branch') &&
          uiValue === false
        ) {
          continue;
        }

        mappedValues[fieldDef.semanticKey] = uiValue;
        mappedCount++;
      } else {
        unmappedCount++;
        if (unmappedFields.length < 20) {
          unmappedFields.push(pdfFieldName);
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalExtracted: Object.keys(pdfFields).length,
      mappedCount,
      unmappedCount,
      unmappedFields: unmappedFields.length < 20 ? unmappedFields : undefined,
      values: mappedValues,
    });
  } catch (error) {
    console.error('PDF import error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 },
    );
  }
}
