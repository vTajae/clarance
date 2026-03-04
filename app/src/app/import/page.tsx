'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveSectionData } from '@/lib/persistence/indexeddb-client';
import { useRegistry } from '@/lib/field-registry/use-registry';
import { pdfToUi } from '@/lib/field-registry/value-transformers';
import { extractFields } from '@/lib/pdf/pdf-ops';

export default function ImportPage() {
  const router = useRouter();
  const registry = useRegistry();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    mapped: number;
    total: number;
  } | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected && selected.type === 'application/pdf') {
        setFile(selected);
        setError(null);
      } else {
        setError('Please select a PDF file.');
      }
    },
    [],
  );

  const handleImport = useCallback(async () => {
    if (!file) return;

    setStatus('uploading');
    setError(null);

    try {
      // Read file as ArrayBuffer and extract fields client-side
      const arrayBuffer = await file.arrayBuffer();
      const pdfFields = await extractFields(arrayBuffer);

      // Map PDF field names → semantic keys using the registry
      const mappedValues: Record<string, unknown> = {};
      let mappedCount = 0;
      let totalExtracted = 0;

      for (const [pdfFieldName, pdfValue] of Object.entries(pdfFields)) {
        if (!pdfValue) continue;
        totalExtracted++;

        const fieldDef = registry.getByPdfFieldName(pdfFieldName);
        if (fieldDef) {
          const uiValue = pdfToUi(fieldDef, pdfValue);

          // Skip unchecked checkboxes
          if (
            (fieldDef.uiFieldType === 'checkbox' || fieldDef.uiFieldType === 'branch') &&
            uiValue === false
          ) {
            continue;
          }

          mappedValues[fieldDef.semanticKey] = uiValue;
          mappedCount++;
        }
      }

      setStats({ mapped: mappedCount, total: totalExtracted });

      // Create a new submission
      const submissionId = uuidv4();

      // Group extracted values by section and save to IndexedDB
      const valuesBySection = new Map<string, Record<string, unknown>>();

      for (const [semanticKey, value] of Object.entries(mappedValues)) {
        const fieldDef = registry.getBySemanticKey(semanticKey);
        if (!fieldDef) continue;

        const section = fieldDef.section;
        let sectionData = valuesBySection.get(section);
        if (!sectionData) {
          sectionData = {};
          valuesBySection.set(section, sectionData);
        }
        sectionData[semanticKey] = value;
      }

      // Save each section to IndexedDB
      for (const [sectionKey, sectionData] of valuesBySection) {
        await saveSectionData(submissionId, sectionKey, sectionData);
      }

      setStatus('success');

      // Redirect to the first section after a brief delay
      setTimeout(() => {
        router.push(`/${submissionId}/identification/section1`);
      }, 1000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Import failed');
    }
  }, [file, router, registry]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Import from PDF</h1>
        <p className="mt-2 text-sm text-gray-500">
          Upload an existing SF-86 PDF to extract its values into the web form.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="pdfFile"
              className="block text-sm font-medium text-gray-700"
            >
              SF-86 PDF File
            </label>
            <input
              id="pdfFile"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleImport}
            disabled={!file || status === 'uploading'}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {status === 'uploading' ? 'Importing...' : 'Import PDF'}
          </button>

          {status === 'success' && stats && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3">
              <p className="text-sm text-green-700 font-medium">
                PDF imported successfully!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Mapped {stats.mapped} of {stats.total} extracted fields.
                Redirecting to form...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
