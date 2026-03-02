'use client';

import { useCallback, useState } from 'react';
import { useStore } from 'jotai';
import { fieldValueAtomFamily } from '@/lib/state/atoms/field-atoms';
import type { FieldValue } from '@/lib/state/atoms/field-atoms';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { evaluateShowWhen } from '@/lib/conditional/expression-evaluator';

type ExportStatus = 'idle' | 'exporting' | 'error';

/**
 * Hook that collects all field values from the Jotai store and POSTs
 * them to /api/pdf/export to download a filled SF-86 PDF.
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
      const values: Record<string, FieldValue> = {};
      const allKeys = registry.getAllSemanticKeys();

      for (const key of allKeys) {
        const field = registry.getBySemanticKey(key);
        // Skip hidden conditional fields
        if (field?.dependsOn) {
          const parentValue = store.get(fieldValueAtomFamily(field.dependsOn));
          if (!evaluateShowWhen(field.showWhen, parentValue)) continue;
        }
        const value = store.get(fieldValueAtomFamily(key));
        if (value !== null && value !== undefined && value !== '') {
          values[key] = value;
        }
      }

      // POST to the export endpoint
      const response = await fetch('/api/pdf/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Export failed' }));
        throw new Error(err.error || `Export failed (${response.status})`);
      }

      // Download the PDF
      const blob = await response.blob();
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
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [store, registry]);

  return { exportPdf, status };
}
