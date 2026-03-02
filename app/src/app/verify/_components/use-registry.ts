// ---------------------------------------------------------------------------
// Hook: Lazy-load the 9 MB field-registry.json
// ---------------------------------------------------------------------------

'use client';

import { useState, useEffect } from 'react';
import type { EditableField } from './types';

interface UseRegistryReturn {
  fields: EditableField[];
  loading: boolean;
  error: string | null;
}

export function useRegistry(): UseRegistryReturn {
  const [fields, setFields] = useState<EditableField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Dynamic import so the 9 MB file doesn't block initial page load
        const mod = await import('@/lib/field-registry/field-registry.json');
        const data = (mod.default ?? mod) as EditableField[];
        if (!cancelled) {
          setFields(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load field registry',
          );
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { fields, loading, error };
}
