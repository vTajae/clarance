// ---------------------------------------------------------------------------
// Conditional Expression Evaluator — Restricted DSL (no eval())
// ---------------------------------------------------------------------------
//
// Supports:
//   === 'value'        Strict equality
//   !== 'value'        Strict inequality
//   !== null           Not-null check (field has any value)
//   === null           Null check (field is empty)
//   in ['a','b','c']   Value is one of a set
//   notIn ['a','b']    Value is NOT in the set
//   includes('x')      String contains substring
//   !includes('x')     String does NOT contain substring
//
// Fail-closed: unrecognised expressions return `false` (field hidden).
// ---------------------------------------------------------------------------

import type { FieldValue } from '@/lib/state/atoms/field-atoms';

/**
 * Evaluate a `showWhen` expression against the current value of the
 * parent (dependsOn) field.
 *
 * @param expression  The showWhen DSL string from field-registry.json
 * @param value       Current value of the parent field
 * @returns `true` if the dependent field should be visible
 */
export function evaluateShowWhen(
  expression: string | undefined,
  value: FieldValue,
): boolean {
  if (!expression) return true;

  const trimmed = expression.trim();

  // --- Null checks ----------------------------------------------------------
  if (trimmed === '!== null' || trimmed === '!= null') {
    return value !== null && value !== undefined && value !== '';
  }
  if (trimmed === '=== null' || trimmed === '== null') {
    return value === null || value === undefined || value === '';
  }

  // --- Strict equality: === 'value' -----------------------------------------
  const eqMatch = trimmed.match(/^===\s*['"](.+?)['"]$/);
  if (eqMatch) {
    return normalise(value) === normalise(eqMatch[1]);
  }

  // --- Strict inequality: !== 'value' ---------------------------------------
  const neqMatch = trimmed.match(/^!==\s*['"](.+?)['"]$/);
  if (neqMatch) {
    return normalise(value) !== normalise(neqMatch[1]);
  }

  // --- Set membership: in ['a','b','c'] -------------------------------------
  const inMatch = trimmed.match(/^in\s*\[(.+)\]$/);
  if (inMatch) {
    const items = parseStringList(inMatch[1]);
    return items.includes(normalise(value));
  }

  // --- Set exclusion: notIn ['a','b'] ---------------------------------------
  const notInMatch = trimmed.match(/^notIn\s*\[(.+)\]$/);
  if (notInMatch) {
    const items = parseStringList(notInMatch[1]);
    return !items.includes(normalise(value));
  }

  // --- Substring check: includes('x') --------------------------------------
  const inclMatch = trimmed.match(/^includes\(\s*['"](.+?)['"]\s*\)$/);
  if (inclMatch) {
    const str = String(value ?? '');
    return str.toLowerCase().includes(inclMatch[1].toLowerCase());
  }

  // --- Negative substring: !includes('x') ----------------------------------
  const notInclMatch = trimmed.match(/^!includes\(\s*['"](.+?)['"]\s*\)$/);
  if (notInclMatch) {
    const str = String(value ?? '');
    return !str.toLowerCase().includes(notInclMatch[1].toLowerCase());
  }

  // --- Fallback: fail-closed ------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[expression-evaluator] Unrecognised showWhen expression: "${expression}"`,
    );
  }
  return false;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Normalise a field value to a lowercase trimmed string for comparison. */
function normalise(value: FieldValue): string {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase();
}

/** Parse a comma-separated list of quoted strings: 'a','b' → ['a','b']. */
function parseStringList(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, '').trim().toLowerCase());
}
