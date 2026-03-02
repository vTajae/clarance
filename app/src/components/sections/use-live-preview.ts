'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'jotai';
import type { FieldDefinition } from '@/lib/field-registry/types';
import { fieldValueAtomFamily } from '@/lib/state/atoms/field-atoms';
import { uiToPdf } from '@/lib/field-registry/value-transformers';

/**
 * Hook that renders a live PDF preview for a given page by:
 * 1. Reading all Jotai field values for the page's fields
 * 2. Transforming them via uiToPdf (semanticKey → pdfFieldName)
 * 3. POSTing to /api/pdf/render-filled-page to get a rendered PNG
 * 4. Returning a blob URL for the rendered page
 *
 * Debounces by 500ms so we don't spam the backend on every keystroke.
 */
export function useLivePreview(
  fields: FieldDefinition[],
  pageNum: number,
  enabled: boolean,
) {
  const store = useStore();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  // Collect current field values and POST for rendering
  const renderPage = useCallback(async () => {
    if (!enabled || fields.length === 0) return;

    // Build pdfFieldName → pdfValue mapping
    const fieldValues: Record<string, string> = {};
    for (const field of fields) {
      const uiValue = store.get(fieldValueAtomFamily(field.semanticKey));
      if (uiValue === null || uiValue === undefined || uiValue === '') continue;
      const pdfValue = uiToPdf(field, uiValue);
      if (pdfValue !== '') {
        fieldValues[field.pdfFieldName] = pdfValue;
      }
    }

    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      // 0-based page for API
      const apiPage = pageNum - 1;
      const resp = await fetch(
        `/api/pdf/render-filled-page/sf861/${apiPage}?dpi=72`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field_values: fieldValues }),
          signal: controller.signal,
        },
      );

      if (!resp.ok) {
        console.error('Live preview error:', resp.status, await resp.text());
        return;
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);

      // Revoke previous blob URL
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
      prevUrlRef.current = url;
      setImageUrl(url);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Live preview fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled, fields, pageNum, store]);

  // Subscribe to field value changes and debounce
  useEffect(() => {
    if (!enabled) {
      // Clean up when disabled
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
      setImageUrl(null);
      return;
    }

    // Initial render
    renderPage();

    // Subscribe to atom changes for all fields on this page
    const unsubs: (() => void)[] = [];
    for (const field of fields) {
      const atom = fieldValueAtomFamily(field.semanticKey);
      const unsub = store.sub(atom, () => {
        // Debounce: clear previous timer, schedule new render
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(renderPage, 500);
      });
      unsubs.push(unsub);
    }

    return () => {
      for (const unsub of unsubs) unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, [enabled, fields, renderPage, store]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, []);

  return { imageUrl, loading };
}
