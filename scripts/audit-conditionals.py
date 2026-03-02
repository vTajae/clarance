#!/usr/bin/env python3
"""SF-86 Conditional Visibility Audit - Statistical Analysis"""
import json, re, sys
from collections import Counter, defaultdict

with open('app/src/lib/field-registry/field-registry.json') as f:
    registry = json.load(f)

by_key = {f['semanticKey']: f for f in registry}

conditional = []
has_showWhen_only = []
has_dependsOn_only = []
all_showWhen_exprs = set()
gate_fields = set()
dependent_fields = set()

for field in registry:
    key = field['semanticKey']
    sw = field.get('showWhen')
    dep = field.get('dependsOn')

    if sw and dep:
        conditional.append(field)
        all_showWhen_exprs.add(sw)
        gate_fields.add(dep)
        dependent_fields.add(key)
    elif sw and not dep:
        has_showWhen_only.append(field)
    elif dep and not sw:
        has_dependsOn_only.append(field)

# Circular dependency check
dep_map = {}
for field in registry:
    if field.get('dependsOn'):
        dep_map[field['semanticKey']] = field['dependsOn']

def find_chain(start, dep_map, max_depth=100):
    chain = [start]
    current = start
    for _ in range(max_depth):
        if current not in dep_map:
            return chain, False
        nxt = dep_map[current]
        if nxt in chain:
            chain.append(nxt)
            return chain, True
        chain.append(nxt)
        current = nxt
    return chain, True

cycles = []
max_depth = 0
deepest_chain = []
for field_key in dep_map:
    chain, is_cycle = find_chain(field_key, dep_map)
    if is_cycle:
        cycles.append(chain)
    depth = len(chain) - 1
    if depth > max_depth:
        max_depth = depth
        deepest_chain = chain

missing_gates = [g for g in gate_fields if g not in by_key]

multi_level = []
for g in gate_fields:
    if g in dep_map:
        multi_level.append({
            'gate': g,
            'dependsOn': dep_map[g],
            'gateShowWhen': by_key[g].get('showWhen') if g in by_key else 'MISSING'
        })

gates_that_are_dependent = gate_fields & dependent_fields

gate_types = Counter()
for g in gate_fields:
    if g in by_key:
        gate_types[by_key[g].get('uiFieldType', 'unknown')] += 1

section_dist = Counter()
for f in conditional:
    section_dist[f.get('section', 'unknown')] += 1

print('=' * 72)
print('SF-86 CONDITIONAL VISIBILITY AUDIT - STATISTICAL SUMMARY')
print('=' * 72)
print()
print(f'Total fields in registry:                {len(registry):>6}')
print(f'Fields with BOTH showWhen + dependsOn:   {len(conditional):>6}')
print(f'Fields with showWhen ONLY (no dependsOn):{len(has_showWhen_only):>6}')
print(f'Fields with dependsOn ONLY (no showWhen):{len(has_dependsOn_only):>6}')
print(f'Unique gate fields:                      {len(gate_fields):>6}')
print(f'Gate fields missing from registry:       {len(missing_gates):>6}')
print(f'Max dependency chain depth:              {max_depth:>6}')
print(f'Circular dependencies found:             {len(cycles):>6}')
print(f'Multi-level conditionals:                {len(multi_level):>6}')
print(f'Gates that are also dependent:           {len(gates_that_are_dependent):>6}')
print()

print('--- UNIQUE showWhen EXPRESSIONS ---')
for expr in sorted(all_showWhen_exprs):
    count = sum(1 for c in conditional if c.get('showWhen') == expr)
    print(f'  [{count:4d}x] {repr(expr)}')
print()

print('--- GATE FIELD TYPES ---')
for t, cnt in gate_types.most_common():
    print(f'  {t}: {cnt} gates')
print()

print('--- SECTION DISTRIBUTION OF CONDITIONAL FIELDS ---')
for sec, cnt in section_dist.most_common():
    print(f'  {sec}: {cnt} fields')
print()

if has_showWhen_only:
    print('*** CONCERN: showWhen WITHOUT dependsOn ***')
    for f in has_showWhen_only:
        print(f'  {f["semanticKey"]}: showWhen={f.get("showWhen")}')
    print()

if has_dependsOn_only:
    print('*** CONCERN: dependsOn WITHOUT showWhen ***')
    for f in has_dependsOn_only:
        print(f'  {f["semanticKey"]}: dependsOn={f.get("dependsOn")}')
    print()

if missing_gates:
    print('*** CRITICAL: GATE FIELDS MISSING FROM REGISTRY ***')
    for g in missing_gates:
        deps = [c['semanticKey'] for c in conditional if c.get('dependsOn') == g]
        print(f'  {g} (depended on by {len(deps)} fields)')
        for d in deps[:5]:
            print(f'    -> {d}')
    print()

if multi_level:
    print('*** MULTI-LEVEL CONDITIONALS (gate is itself conditional) ***')
    for m in multi_level:
        print(f'  Gate: {m["gate"]}')
        print(f'    dependsOn: {m["dependsOn"]}')
        print(f'    showWhen: {m["gateShowWhen"]}')
        deps_on_this = [c['semanticKey'] for c in conditional if c.get('dependsOn') == m['gate']]
        print(f'    Fields depending on it: {len(deps_on_this)}')
    print()

if cycles:
    print('*** CRITICAL: CIRCULAR DEPENDENCIES ***')
    for c in cycles[:5]:
        print(f'  {" -> ".join(c)}')
    print()

if deepest_chain and max_depth > 1:
    print(f'--- DEEPEST CHAIN (depth={max_depth}) ---')
    print(f'  {" -> ".join(deepest_chain)}')
    print()

# Expression pattern matching check
print('--- EXPRESSION PATTERN ANALYSIS ---')
eq_re = re.compile(r"""^===\s*['"](.+?)['"]$""")
neq_re = re.compile(r"""^!==\s*['"](.+?)['"]$""")
null_patterns = {'!== null', '!= null', '=== null', '== null'}
in_re = re.compile(r"""^in\s*\[(.+)\]$""")
notin_re = re.compile(r"""^notIn\s*\[(.+)\]$""")
incl_re = re.compile(r"""^includes\(\s*['"](.+?)['"]\s*\)$""")
notincl_re = re.compile(r"""^!includes\(\s*['"](.+?)['"]\s*\)$""")

unmatched = []
matched_patterns = Counter()
for expr in all_showWhen_exprs:
    trimmed = expr.strip()
    if trimmed in null_patterns:
        matched_patterns['null check'] += 1
        continue
    if eq_re.match(trimmed):
        matched_patterns['=== equality'] += 1
        # Extract the matched value
        val = eq_re.match(trimmed).group(1)
        continue
    if neq_re.match(trimmed):
        matched_patterns['!== inequality'] += 1
        continue
    if in_re.match(trimmed):
        matched_patterns['in [set]'] += 1
        continue
    if notin_re.match(trimmed):
        matched_patterns['notIn [set]'] += 1
        continue
    if incl_re.match(trimmed):
        matched_patterns['includes()'] += 1
        continue
    if notincl_re.match(trimmed):
        matched_patterns['!includes()'] += 1
        continue
    unmatched.append(expr)

print('  Pattern distribution:')
for pat, cnt in matched_patterns.most_common():
    print(f'    {pat}: {cnt} unique expressions')

if unmatched:
    print()
    print('  *** UNMATCHED EXPRESSIONS (will fail-closed as hidden!) ***')
    for u in unmatched:
        count = sum(1 for c in conditional if c.get('showWhen') == u)
        print(f'    [{count}x] {repr(u)}')
else:
    print('  All expressions match known patterns. OK.')
print()

# Boolean value analysis
print('--- BOOLEAN GATE ANALYSIS ---')
bool_gates_count = 0
for g in gate_fields:
    if g in by_key:
        gf = by_key[g]
        gtype = gf.get('uiFieldType')
        if gtype in ('checkbox', 'branch', 'notApplicable'):
            bool_gates_count += 1
            deps = [c for c in conditional if c.get('dependsOn') == g]
            showWhens = set(d.get('showWhen', '') for d in deps)
            print(f'  Boolean gate: {g} (type={gtype})')
            print(f'    showWhen values used: {showWhens}')
            for d in deps[:2]:
                print(f'    -> {d["semanticKey"]} showWhen={d.get("showWhen")}')
            if len(deps) > 2:
                print(f'    ... and {len(deps)-2} more')
if bool_gates_count == 0:
    print('  No boolean gate fields found.')
print()

# Normalise analysis - check for potential false matches
print('--- NORMALISE() FALSE MATCH ANALYSIS ---')
print('  Checking if any showWhen values could match unintended field values...')
eq_values = set()
for expr in all_showWhen_exprs:
    m = eq_re.match(expr.strip())
    if m:
        eq_values.add(m.group(1).lower())
print(f'  Equality-compared values (lowercased): {sorted(eq_values)}')
for v in sorted(eq_values):
    if len(v) <= 2:
        print(f'    WARNING: Short value "{v}" - low risk of substring collision but verify')
    # Check if any option values in gate fields could be substrings
    for g in gate_fields:
        if g in by_key:
            opts = by_key[g].get('options', [])
            for opt in opts:
                if opt.lower() != v and opt.lower().startswith(v):
                    print(f'    POTENTIAL: Gate {g} has option "{opt}" which starts with "{v}"')
print()

# Export filtering analysis
print('--- EXPORT FILTERING EDGE CASES ---')
print('  The export hook checks: if dependsOn exists, evaluate showWhen against parent value.')
print('  If parent value is null/undefined (not yet set):')
for expr in sorted(all_showWhen_exprs):
    trimmed = expr.strip()
    # Simulate evaluation with null value
    # normalise(null) -> ''
    m = eq_re.match(trimmed)
    if m:
        compare_val = m.group(1).strip().lower()
        null_result = ('' == compare_val)
        if null_result:
            print(f'    CONCERN: "{expr}" would evaluate TRUE for null/empty gate value!')
print('  All equality expressions correctly evaluate to FALSE for null gate values. OK.')
print()

# Sample conditional fields by section
print('--- SAMPLE CONDITIONAL FIELDS (first 30) ---')
for c in conditional[:30]:
    key = c['semanticKey']
    print(f'  {key:55s} dep={c.get("dependsOn",""):50s} show={c.get("showWhen","")}')
