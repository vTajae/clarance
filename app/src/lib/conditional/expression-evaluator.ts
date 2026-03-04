// ---------------------------------------------------------------------------
// Conditional Expression Evaluator — Restricted DSL (safe, no code execution)
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
// ValueMap resolution:
//   Radio fields store numeric valueMap values (e.g. "2" for "YES").
//   showWhen expressions use label text (e.g. === 'YES').
//   When parentValueMap is provided, comparisons resolve bidirectionally:
//   value "2" matches literal "YES" if valueMap["YES"] === "2".
//
// Fail-closed: unrecognised expressions return `false` (field hidden).
// ---------------------------------------------------------------------------

import type { FieldValue } from '@/lib/state/atoms/field-atoms';

/**
 * Evaluate a `showWhen` expression against the current value of the
 * parent (dependsOn) field.
 *
 * @param expression      The showWhen DSL string from field-registry.json
 * @param value           Current value of the parent field
 * @param parentValueMap  Optional valueMap from the parent field definition.
 *                        Enables bidirectional matching: stored numeric values
 *                        (e.g. "2") match expression labels (e.g. "YES").
 * @returns `true` if the dependent field should be visible
 */
export function evaluateShowWhen(
  expression: string | undefined,
  value: FieldValue,
  parentValueMap?: Record<string, string>,
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
    return matchesValue(value, eqMatch[1], parentValueMap);
  }

  // --- Strict inequality: !== 'value' ---------------------------------------
  const neqMatch = trimmed.match(/^!==\s*['"](.+?)['"]$/);
  if (neqMatch) {
    return !matchesValue(value, neqMatch[1], parentValueMap);
  }

  // --- Set membership: in ['a','b','c'] -------------------------------------
  const inMatch = trimmed.match(/^in\s*\[(.+)\]$/);
  if (inMatch) {
    const items = parseStringList(inMatch[1]);
    return matchesAny(value, items, parentValueMap);
  }

  // --- Set exclusion: notIn ['a','b'] ---------------------------------------
  const notInMatch = trimmed.match(/^notIn\s*\[(.+)\]$/);
  if (notInMatch) {
    const items = parseStringList(notInMatch[1]);
    return !matchesAny(value, items, parentValueMap);
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

/**
 * Check if a stored value matches an expression literal, resolving through
 * the parent field's valueMap when available.
 *
 * Handles the radio mismatch: value="2" matches literal="YES" when
 * valueMap={"YES":"2","NO":"1"}.
 */
function matchesValue(
  actualValue: FieldValue,
  expressionLiteral: string,
  valueMap?: Record<string, string>,
): boolean {
  const normActual = normalise(actualValue);
  const normLiteral = normalise(expressionLiteral);

  // Direct match (works for non-radio fields and numeric expressions)
  if (normActual === normLiteral) return true;

  // No valueMap → no further resolution possible
  if (!valueMap) return false;

  // Forward: expression says "YES", valueMap["YES"] = "2", actual is "2"
  for (const [label, mapped] of Object.entries(valueMap)) {
    if (normalise(label) === normLiteral && normalise(mapped) === normActual) {
      return true;
    }
  }

  // Reverse: actual is a label like "YES", expression is numeric "2"
  for (const [label, mapped] of Object.entries(valueMap)) {
    if (normalise(label) === normActual && normalise(mapped) === normLiteral) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a stored value matches ANY item in a set, resolving through
 * the parent field's valueMap when available.
 */
function matchesAny(
  actualValue: FieldValue,
  items: string[],
  valueMap?: Record<string, string>,
): boolean {
  for (const item of items) {
    if (matchesValue(actualValue, item, valueMap)) return true;
  }
  return false;
}
