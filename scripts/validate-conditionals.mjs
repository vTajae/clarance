#!/usr/bin/env node
/**
 * validate-conditionals.mjs — Validate dependsOn/showWhen entries in field-registry.json
 *
 * Checks:
 *   1. Every dependsOn points to an existing semanticKey
 *   2. No circular dependencies
 *   3. Every showWhen expression is parseable by the expression evaluator patterns
 *   4. No field depends on itself
 *   5. Gate fields (targets of dependsOn) are radio/checkbox types
 *
 * Usage:
 *   node scripts/validate-conditionals.mjs
 *
 * Exit code 0 on success, 1 on validation errors.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const REGISTRY_PATH = resolve("app/src/lib/field-registry/field-registry.json");

// Supported showWhen expression patterns (must match expression-evaluator.ts)
const VALID_PATTERNS = [
  /^===\s*['"].+['"]$/, // === 'value'
  /^!==\s*['"].+['"]$/, // !== 'value'
  /^!==?\s*null$/, // !== null, != null
  /^===?\s*null$/, // === null, == null
  /^in\s*\[.+\]$/, // in ['a','b']
  /^notIn\s*\[.+\]$/, // notIn ['a','b']
  /^includes\(\s*['"].+['"]\s*\)$/, // includes('x')
  /^!includes\(\s*['"].+['"]\s*\)$/, // !includes('x')
];

function isValidExpression(expr) {
  const trimmed = expr.trim();
  return VALID_PATTERNS.some((p) => p.test(trimmed));
}

function main() {
  const raw = readFileSync(REGISTRY_PATH, "utf-8");
  const data = JSON.parse(raw);

  const allKeys = new Set(data.map((f) => f.semanticKey));
  const errors = [];
  let conditionalCount = 0;
  let gateKeys = new Set();

  for (const field of data) {
    const dep = field.dependsOn;
    const expr = field.showWhen;

    if (!dep && !expr) continue;

    // Both must be present together
    if (dep && !expr) {
      errors.push(
        `${field.semanticKey}: has dependsOn but no showWhen`
      );
      continue;
    }
    if (!dep && expr) {
      errors.push(
        `${field.semanticKey}: has showWhen but no dependsOn`
      );
      continue;
    }

    conditionalCount++;
    gateKeys.add(dep);

    // Check 1: dependsOn exists
    if (!allKeys.has(dep)) {
      errors.push(
        `${field.semanticKey}: dependsOn '${dep}' not found in registry`
      );
    }

    // Check 4: no self-reference
    if (dep === field.semanticKey) {
      errors.push(
        `${field.semanticKey}: depends on itself`
      );
    }

    // Check 3: expression is parseable
    if (!isValidExpression(expr)) {
      errors.push(
        `${field.semanticKey}: unparseable showWhen expression: "${expr}"`
      );
    }
  }

  // Check 2: circular dependencies
  const byKey = new Map(data.map((f) => [f.semanticKey, f]));
  for (const field of data) {
    if (!field.dependsOn) continue;

    const visited = new Set([field.semanticKey]);
    let current = field.dependsOn;

    while (current) {
      if (visited.has(current)) {
        errors.push(
          `Circular dependency: ${field.semanticKey} → ... → ${current}`
        );
        break;
      }
      visited.add(current);
      const parent = byKey.get(current);
      current = parent?.dependsOn ?? null;
    }
  }

  // Check 5: gate fields should be radio or checkbox
  for (const gateKey of gateKeys) {
    const gate = byKey.get(gateKey);
    if (gate && !["radio", "checkbox", "select"].includes(gate.uiFieldType)) {
      errors.push(
        `Gate field ${gateKey} is type '${gate.uiFieldType}' (expected radio/checkbox/select)`
      );
    }
  }

  // Summary
  console.log(`Registry: ${data.length} total fields`);
  console.log(`Conditional fields: ${conditionalCount}`);
  console.log(`Gate fields: ${gateKeys.size}`);

  if (errors.length > 0) {
    console.log(`\n${errors.length} ERRORS:`);
    for (const e of errors) {
      console.log(`  ✗ ${e}`);
    }
    process.exit(1);
  } else {
    console.log(`\n✓ All conditionals valid`);

    // Print per-section breakdown
    const bySection = {};
    for (const field of data) {
      if (field.dependsOn) {
        bySection[field.section] = (bySection[field.section] || 0) + 1;
      }
    }
    console.log(`\nBy section:`);
    for (const [section, count] of Object.entries(bySection).sort()) {
      console.log(`  ${section}: ${count} conditional fields`);
    }
  }
}

main();
