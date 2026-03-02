'use client';

// ---------------------------------------------------------------------------
// SF-86 Sync Engine Hook — Drains IndexedDB pendingSync to Server
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import {
  SyncEngine,
  type SyncStatus,
  type SyncStatusEventDetail,
} from '@/lib/persistence/sync-engine';

/**
 * Instantiates and manages a SyncEngine that pushes pending IndexedDB
 * changes to the server via PUT /api/form/[submissionId]/section/[key].
 *
 * Starts the periodic sync on mount, stops on unmount.
 *
 * @returns Current sync status and manual trigger.
 */
export function useSyncEngine(): {
  syncStatus: SyncStatus;
  pendingCount: number;
  lastError: string | null;
  syncNow: () => Promise<void>;
} {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingCount, setPendingCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const engineRef = useRef<SyncEngine | null>(null);

  useEffect(() => {
    const engine = new SyncEngine(async (submissionId, sectionKey, data) => {
      const res = await fetch(
        `/api/form/${submissionId}/section/${sectionKey}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body.error || `Server sync failed (${res.status})`;
        const err = new Error(msg);
        // Mark 4xx errors as non-retryable (submission not found, auth failed, etc.)
        if (res.status >= 400 && res.status < 500) {
          (err as Error & { nonRetryable: boolean }).nonRetryable = true;
        }
        throw err;
      }
    });

    const handleStatus = (e: Event) => {
      const detail = (e as unknown as { detail: SyncStatusEventDetail }).detail;
      if (detail) {
        setSyncStatus(detail.status);
        setPendingCount(detail.pendingCount);
        setLastError(detail.lastError);
      }
    };

    engine.addEventListener('statuschange', handleStatus);
    engine.startSync();
    engineRef.current = engine;

    return () => {
      engine.stopSync();
      engine.removeEventListener('statuschange', handleStatus);
      engineRef.current = null;
    };
  }, []);

  const syncNow = async () => {
    if (engineRef.current) {
      await engineRef.current.syncNow();
    }
  };

  return { syncStatus, pendingCount, lastError, syncNow };
}
