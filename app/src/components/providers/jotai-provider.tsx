"use client";

import { Provider, createStore } from "jotai";
import type { ReactNode } from "react";
import { fieldValueAtomFamily } from "@/lib/state/atoms/field-atoms";

const store = createStore();

// Expose store + atom family for E2E testing (dev mode only)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__JOTAI_STORE__ = store;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__FIELD_VALUE_ATOM_FAMILY__ = fieldValueAtomFamily;
}

export function JotaiProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
