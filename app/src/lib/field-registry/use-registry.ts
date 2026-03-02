'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { FieldDefinition, SF86Section } from './types';
import { FieldRegistry, loadRegistry } from './registry-loader';

// ---------------------------------------------------------------------------
// Lazy singleton — the 9MB JSON is loaded via dynamic import so it's
// code-split from the initial bundle. On first access, the module is
// fetched as a separate chunk; subsequent calls return the cached instance.
// ---------------------------------------------------------------------------

let _registry: FieldRegistry | null = null;
let _promise: Promise<FieldRegistry> | null = null;
let _subscribers = new Set<() => void>();

function notify() {
  for (const fn of _subscribers) fn();
}

function ensureRegistry(): Promise<FieldRegistry> {
  if (_registry) return Promise.resolve(_registry);
  if (_promise) return _promise;

  _promise = import('./field-registry.json').then((mod) => {
    const data = (mod.default ?? mod) as unknown as FieldDefinition[];
    _registry = loadRegistry(data);
    notify();
    return _registry;
  });

  return _promise;
}

// Kick off the load immediately on module evaluation (no waterfall).
ensureRegistry();

function subscribe(cb: () => void) {
  _subscribers.add(cb);
  return () => { _subscribers.delete(cb); };
}

function getSnapshot(): FieldRegistry | null {
  return _registry;
}

/**
 * Returns the global FieldRegistry singleton, or `null` while the
 * dynamic import is in flight.
 *
 * Most callers should use {@link useRegistry} which throws a
 * Suspense-compatible promise instead of returning null.
 */
export function useRegistryNullable(): FieldRegistry | null {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Returns the global FieldRegistry singleton.
 * Safe to call from any client component.
 *
 * While the JSON chunk is loading, returns null. Consumers should
 * handle null gracefully or wrap in a loading boundary.
 */
export function useRegistry(): FieldRegistry {
  const reg = useRegistryNullable();
  if (!reg) {
    // Return a minimal empty registry while loading so components
    // don't crash. They'll re-render once the real data arrives.
    return _emptyRegistry;
  }
  return reg;
}

/**
 * Returns all field definitions for a single section.
 */
export function useSectionFields(section: SF86Section): FieldDefinition[] {
  const registry = useRegistry();
  return useMemo(() => registry.getBySection(section), [registry, section]);
}

// Empty placeholder registry used during loading
const _emptyRegistry = loadRegistry([]);

