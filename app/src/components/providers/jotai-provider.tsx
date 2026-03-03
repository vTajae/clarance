"use client";

import { Provider, createStore } from "jotai";
import { useEffect, type ReactNode } from "react";
import { fieldValueAtomFamily, fieldMetaAtom } from "@/lib/state/atoms/field-atoms";
import { useRegistryNullable } from "@/lib/field-registry/use-registry";

const store = createStore();

// Expose store + atom family for E2E testing (dev mode only)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__JOTAI_STORE__ = store;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__FIELD_VALUE_ATOM_FAMILY__ = fieldValueAtomFamily;
}

/**
 * Bridges the FieldRegistry singleton into the Jotai store so that
 * derived atoms (sectionFieldsAtom, completionAtoms, auto-save) can
 * reactively depend on it.
 */
function RegistryBridge() {
  const registry = useRegistryNullable();
  useEffect(() => {
    if (registry) {
      store.set(fieldMetaAtom, registry);
    }
  }, [registry]);
  return null;
}

export function JotaiProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <RegistryBridge />
      {children}
    </Provider>
  );
}
