'use client';

import { useCallback, useState } from 'react';
import { useStore } from 'jotai';
import { fieldValueAtomFamily } from '@/lib/state/atoms/field-atoms';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { uiToPdf } from '@/lib/field-registry/value-transformers';
import { evaluateShowWhen } from '@/lib/conditional/expression-evaluator';
import { fillPdf } from '@/lib/pdf/pdf-ops';
import { loadTemplate } from '@/lib/pdf/template-loader';

type ExportStatus = 'idle' | 'exporting' | 'error';

/**
 * Hook that collects all field values from the Jotai store and fills
 * the SF-86 PDF entirely client-side using pdf-lib.
 */
export function useExportPdf() {
  const store = useStore();
  const registry = useRegistry();
  const [status, setStatus] = useState<ExportStatus>('idle');

  const exportPdf = useCallback(async () => {
    setStatus('exporting');

    try {
      if (!registry || registry.getAllSemanticKeys().length === 0) {
        throw new Error('Field registry not loaded');
      }

      // Collect all non-null field values, skipping hidden conditional fields
      // and transform UI values → PDF values
      const pdfFieldValues: Record<string, string> = {};
      const allKeys = registry.getAllSemanticKeys();

      for (const key of allKeys) {
        const field = registry.getBySemanticKey(key);
        if (!field) continue;

        // Skip hidden conditional fields
        if (field.dependsOn) {
          const parentValue = store.get(fieldValueAtomFamily(field.dependsOn));
          if (!evaluateShowWhen(field.showWhen, parentValue)) continue;
        }

        const value = store.get(fieldValueAtomFamily(key));
        if (value === null || value === undefined || value === '') continue;

        // Transform UI value to PDF value
        const pdfValue = uiToPdf(field, value);
        if (pdfValue !== '') {
          pdfFieldValues[field.pdfFieldName] = pdfValue;
        }
      }

      // Load template and fill client-side
      const templateBytes = await loadTemplate();
      const filledPdf = await fillPdf(templateBytes, pdfFieldValues);

      // Trigger browser download
      const blob = new Blob([filledPdf as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sf86-filled.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('idle');
    } catch (err) {
      console.error('PDF export error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [store, registry]);

  return { exportPdf, status };
}
