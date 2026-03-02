import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { uiToPdf } from '@/lib/field-registry/value-transformers';
import { getRegistrySync } from '@/lib/field-registry/registry-server';

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:8001';

const registry = getRegistrySync();

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { values, templatePath } = body as {
      values: Record<string, unknown>;
      templatePath?: string;
    };

    if (!values || typeof values !== 'object') {
      return NextResponse.json(
        { error: 'values object is required' },
        { status: 400 },
      );
    }

    // Map semantic keys → PDF field names using the registry
    const pdfFieldValues: Record<string, string> = {};
    const overflowData: Record<string, Array<Record<string, string>>> = {};

    for (const [semanticKey, uiValue] of Object.entries(values)) {
      if (uiValue === null || uiValue === undefined || uiValue === '') continue;

      const fieldDef = registry.getBySemanticKey(semanticKey);
      if (!fieldDef) continue;

      // Transform UI value to PDF value (pass raw value — uiToPdf handles all types)
      const pdfValue = uiToPdf(fieldDef, uiValue);
      if (pdfValue !== '') {
        pdfFieldValues[fieldDef.pdfFieldName] = pdfValue;
      }
    }

    // Check if we need continuation pages (overflow entries beyond PDF capacity)
    const hasOverflow = Object.keys(overflowData).length > 0;
    const endpoint = hasOverflow ? '/fill-pdf-with-continuation' : '/fill-pdf';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120_000);

    const response = await fetch(`${PDF_SERVICE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_path: templatePath || 'sf861.pdf',
        field_values: pdfFieldValues,
        ...(hasOverflow ? { overflow_data: overflowData } : {}),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'PDF generation failed' },
        { status: 502 },
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="sf86-filled.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 },
    );
  }
}
