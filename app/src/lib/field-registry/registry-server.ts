// ---------------------------------------------------------------------------
// Server-side registry access (no 'use client' directive)
// ---------------------------------------------------------------------------

import type { FieldDefinition } from './types';
import { FieldRegistry, loadRegistry } from './registry-loader';
import registryData from './field-registry.json';

let _registry: FieldRegistry | null = null;

/**
 * Returns the FieldRegistry singleton for server-side use.
 * Loads from the static JSON import (bundled into the server).
 */
export function getRegistrySync(): FieldRegistry {
  if (!_registry) {
    _registry = loadRegistry(registryData as unknown as FieldDefinition[]);
  }
  return _registry;
}
