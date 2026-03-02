// ---------------------------------------------------------------------------
// SF-86 Sync Engine -- Client-to-Server Section Sync
// ---------------------------------------------------------------------------
//
// Drains the `pendingSync` IndexedDB store and pushes changes to the server
// via a caller-supplied `syncFn`.  Designed for offline-first operation:
//
//   1. User edits fields -> auto-save writes to IndexedDB + enqueues sync
//   2. SyncEngine periodically (or on demand) drains the queue
//   3. Failed syncs are retried with exponential backoff (max 3 attempts)
//   4. Permanently failed entries remain in the queue for manual retry
//
// The engine emits status changes via the standard EventTarget API so the
// UI can show sync indicators without polling.
// ---------------------------------------------------------------------------

import {
  getPendingSyncs,
  removePendingSync,
  incrementSyncRetry,
} from './indexeddb-client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Current state of the sync engine. */
export type SyncStatus = 'idle' | 'syncing' | 'error';

/** Function signature the engine calls to push one section to the server. */
export type SyncFunction = (
  submissionId: string,
  sectionKey: string,
  data: Record<string, unknown>,
) => Promise<void>;

/** Detail payload attached to every `statuschange` event. */
export interface SyncStatusEventDetail {
  status: SyncStatus;
  /** Number of entries still in the pending queue. */
  pendingCount: number;
  /** Human-readable description of the last error, if any. */
  lastError: string | null;
}

// ---------------------------------------------------------------------------
// Custom event type
// ---------------------------------------------------------------------------

/**
 * Typed event emitted whenever the sync status changes.
 *
 * Listen with:
 * ```ts
 * engine.addEventListener('statuschange', (e) => {
 *   console.log(e.detail.status, e.detail.pendingCount);
 * });
 * ```
 */
export class SyncStatusEvent extends Event {
  readonly detail: SyncStatusEventDetail;

  constructor(detail: SyncStatusEventDetail) {
    super('statuschange');
    this.detail = detail;
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_INTERVAL_MS = 30_000; // 30 seconds
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1_000; // 1s, 2s, 4s exponential

// ---------------------------------------------------------------------------
// SyncEngine
// ---------------------------------------------------------------------------

export class SyncEngine extends EventTarget {
  private readonly syncFn: SyncFunction;
  private readonly intervalMs: number;

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private _status: SyncStatus = 'idle';
  private _lastError: string | null = null;
  private _isSyncing = false;

  constructor(syncFn: SyncFunction, intervalMs = DEFAULT_INTERVAL_MS) {
    super();
    this.syncFn = syncFn;
    this.intervalMs = intervalMs;
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /** Current sync status. */
  get status(): SyncStatus {
    return this._status;
  }

  /** Human-readable description of the last error, or `null`. */
  get lastError(): string | null {
    return this._lastError;
  }

  /**
   * Start the periodic sync timer.
   *
   * Safe to call multiple times -- subsequent calls are no-ops if the
   * timer is already running.  An immediate sync is triggered on start.
   */
  startSync(): void {
    if (this.intervalId !== null) return;

    this.intervalId = setInterval(() => {
      void this.syncNow();
    }, this.intervalMs);

    // Kick off an immediate sync so the user does not wait a full interval.
    void this.syncNow();
  }

  /** Stop the periodic sync timer. */
  stopSync(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Immediately drain all pending sync entries.
   *
   * Re-entrant safe: if a sync is already in progress, the call returns
   * without queuing another.
   */
  async syncNow(): Promise<void> {
    if (this._isSyncing) return;
    this._isSyncing = true;

    try {
      this.setStatus('syncing');

      const pending = await getPendingSyncs();

      if (pending.length === 0) {
        this.setStatus('idle');
        return;
      }

      let hadError = false;

      for (const entry of pending) {
        try {
          await this.syncFn(entry.submissionId, entry.sectionKey, entry.data);
          await removePendingSync(entry.id);
        } catch (err) {
          hadError = true;
          const message =
            err instanceof Error ? err.message : 'Unknown sync error';
          this._lastError = message;
          console.error(
            `[SyncEngine] Failed to sync ${entry.submissionId}:${entry.sectionKey} ` +
              `(attempt ${entry.retryCount + 1}/${MAX_RETRIES}): ${message}`,
          );

          if (entry.retryCount + 1 >= MAX_RETRIES) {
            // Leave the entry in the queue but stop retrying automatically.
            // The UI can surface this and offer a manual retry.
            console.warn(
              `[SyncEngine] Max retries reached for pending sync id=${entry.id}. ` +
                `Entry will remain in queue for manual retry.`,
            );
          } else {
            await incrementSyncRetry(entry.id);
            // Apply exponential backoff by sleeping before the next entry.
            const backoff = BASE_BACKOFF_MS * Math.pow(2, entry.retryCount);
            await sleep(backoff);
          }
        }
      }

      // Re-check remaining count for the status event.
      const remaining = await getPendingSyncs();
      this.setStatus(hadError ? 'error' : 'idle', remaining.length);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected sync engine error';
      this._lastError = message;
      console.error(`[SyncEngine] Unexpected error: ${message}`);
      this.setStatus('error');
    } finally {
      this._isSyncing = false;
    }
  }

  /**
   * Sync a specific section immediately, bypassing the queue.
   *
   * This is a convenience for "save and sync now" flows.  The data is
   * sent directly via `syncFn` -- it does NOT read from or write to
   * the `pendingSync` store.  If the call fails, the caller is
   * responsible for handling the error (the auto-save hook already
   * enqueues a pending sync as a safety net).
   */
  async syncSection(
    submissionId: string,
    sectionKey: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    await this.syncFn(submissionId, sectionKey, data);
  }

  // -----------------------------------------------------------------------
  // Internals
  // -----------------------------------------------------------------------

  private setStatus(status: SyncStatus, pendingCount?: number): void {
    this._status = status;
    if (status !== 'error') {
      this._lastError = null;
    }

    this.dispatchEvent(
      new SyncStatusEvent({
        status,
        pendingCount: pendingCount ?? 0,
        lastError: this._lastError,
      }),
    );
  }
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
