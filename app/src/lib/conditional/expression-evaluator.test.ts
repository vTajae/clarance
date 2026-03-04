import { describe, it, expect } from 'vitest';
import { evaluateShowWhen } from './expression-evaluator';

// ---------------------------------------------------------------------------
// 1. No expression / undefined / empty string -> always visible
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — no expression', () => {
  it('returns true when expression is undefined', () => {
    expect(evaluateShowWhen(undefined, 'anything')).toBe(true);
  });

  it('returns true when expression is an empty string', () => {
    expect(evaluateShowWhen('', 'anything')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Null checks: === null, == null, !== null, != null
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — null checks', () => {
  it('=== null returns true for null value', () => {
    expect(evaluateShowWhen('=== null', null)).toBe(true);
  });

  it('=== null returns true for empty string (treated as null)', () => {
    expect(evaluateShowWhen('=== null', '')).toBe(true);
  });

  it('== null returns true for null value', () => {
    expect(evaluateShowWhen('== null', null)).toBe(true);
  });

  it('=== null returns false for a non-empty string', () => {
    expect(evaluateShowWhen('=== null', 'hello')).toBe(false);
  });

  it('!== null returns true for a non-empty string', () => {
    expect(evaluateShowWhen('!== null', 'hello')).toBe(true);
  });

  it('!= null returns true for a non-empty string', () => {
    expect(evaluateShowWhen('!= null', 'hello')).toBe(true);
  });

  it('!== null returns false for null value', () => {
    expect(evaluateShowWhen('!== null', null)).toBe(false);
  });

  it('!== null returns false for empty string (treated as null)', () => {
    expect(evaluateShowWhen('!== null', '')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 3. Strict equality: === 'value' (case-insensitive, trimmed)
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — strict equality', () => {
  it("=== 'YES' matches 'YES' exactly", () => {
    expect(evaluateShowWhen("=== 'YES'", 'YES')).toBe(true);
  });

  it("=== 'YES' matches 'yes' (case-insensitive)", () => {
    expect(evaluateShowWhen("=== 'YES'", 'yes')).toBe(true);
  });

  it("=== 'YES' matches '  YES  ' (trimmed)", () => {
    expect(evaluateShowWhen("=== 'YES'", '  YES  ')).toBe(true);
  });

  it("=== 'YES' does not match 'NO'", () => {
    expect(evaluateShowWhen("=== 'YES'", 'NO')).toBe(false);
  });

  it("=== 'YES' does not match null (normalises to '')", () => {
    expect(evaluateShowWhen("=== 'YES'", null)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. Strict inequality: !== 'value' (normalised comparison)
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — strict inequality', () => {
  it("!== 'NO' returns true for 'YES'", () => {
    expect(evaluateShowWhen("!== 'NO'", 'YES')).toBe(true);
  });

  it("!== 'NO' returns false for 'NO'", () => {
    expect(evaluateShowWhen("!== 'NO'", 'NO')).toBe(false);
  });

  it("!== 'NO' returns false for 'no' (case-insensitive)", () => {
    expect(evaluateShowWhen("!== 'NO'", 'no')).toBe(false);
  });

  it("!== 'NO' returns true for null (normalises to '')", () => {
    expect(evaluateShowWhen("!== 'NO'", null)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. Set membership: in ['YES','NO']
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — set membership', () => {
  it("in ['YES','NO'] matches 'yes' (case-insensitive)", () => {
    expect(evaluateShowWhen("in ['YES','NO']", 'yes')).toBe(true);
  });

  it("in ['YES','NO'] does not match 'MAYBE'", () => {
    expect(evaluateShowWhen("in ['YES','NO']", 'MAYBE')).toBe(false);
  });

  it("in ['YES','NO'] does not match null (normalises to '')", () => {
    expect(evaluateShowWhen("in ['YES','NO']", null)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 6. Set exclusion: notIn ['a','b']
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — set exclusion', () => {
  it("notIn ['a','b'] returns true for 'c'", () => {
    expect(evaluateShowWhen("notIn ['a','b']", 'c')).toBe(true);
  });

  it("notIn ['a','b'] returns false for 'a'", () => {
    expect(evaluateShowWhen("notIn ['a','b']", 'a')).toBe(false);
  });

  it("notIn ['a','b'] returns false for 'A' (case-insensitive)", () => {
    expect(evaluateShowWhen("notIn ['a','b']", 'A')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 7. Substring: includes('test')
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — substring includes', () => {
  it("includes('test') matches 'testing'", () => {
    expect(evaluateShowWhen("includes('test')", 'testing')).toBe(true);
  });

  it("includes('test') matches 'TESTING' (case-insensitive)", () => {
    expect(evaluateShowWhen("includes('test')", 'TESTING')).toBe(true);
  });

  it("includes('test') does not match 'other'", () => {
    expect(evaluateShowWhen("includes('test')", 'other')).toBe(false);
  });

  it("includes('test') does not match null", () => {
    expect(evaluateShowWhen("includes('test')", null)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 8. Negative substring: !includes('test')
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — negative substring', () => {
  it("!includes('test') returns false for 'testing'", () => {
    expect(evaluateShowWhen("!includes('test')", 'testing')).toBe(false);
  });

  it("!includes('test') returns true for 'other'", () => {
    expect(evaluateShowWhen("!includes('test')", 'other')).toBe(true);
  });

  it("!includes('test') returns true for null (empty string has no substring)", () => {
    expect(evaluateShowWhen("!includes('test')", null)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 9. Fail-closed: unrecognised expression returns false
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — fail-closed', () => {
  it("unrecognised expression '> 5' returns false", () => {
    expect(evaluateShowWhen('> 5', 'anything')).toBe(false);
  });

  it("unrecognised expression 'foobar' returns false", () => {
    expect(evaluateShowWhen('foobar', 'anything')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 10. Edge cases
// ---------------------------------------------------------------------------
describe('evaluateShowWhen — edge cases', () => {
  it('handles extra leading/trailing whitespace in expression', () => {
    expect(evaluateShowWhen("   === 'YES'   ", 'yes')).toBe(true);
  });

  it('handles double quotes in expression', () => {
    expect(evaluateShowWhen('=== "YES"', 'yes')).toBe(true);
  });

  it('handles boolean value true (normalised to "true")', () => {
    expect(evaluateShowWhen("=== 'true'", true)).toBe(true);
  });

  it('handles boolean value false (normalised to "false")', () => {
    expect(evaluateShowWhen("=== 'false'", false)).toBe(true);
  });

  it('handles number value (normalised to string)', () => {
    expect(evaluateShowWhen("=== '42'", 42)).toBe(true);
  });

  it("number value does not match unrelated string", () => {
    expect(evaluateShowWhen("=== 'hello'", 42)).toBe(false);
  });
});
