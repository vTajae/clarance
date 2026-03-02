import { readdirSync, readFileSync } from 'fs';

const dir = 'scripts/section-proofs';
const files = readdirSync(dir).filter(f => f !== '_combined-report.json' && f.endsWith('.json'));
let totalFields = 0, totalMatches = 0, totalMismatches = 0, totalMissing = 0, totalRadio = 0;
let totalCondTests = 0, totalCondPassed = 0, totalCondFailed = 0;
let pass = 0, fail = 0;
const rows = [];

for (const f of files.sort()) {
  const p = JSON.parse(readFileSync(dir + '/' + f, 'utf-8'));
  totalFields += p.fieldCount || 0;
  totalMatches += p.roundTrip?.matches || 0;
  totalMismatches += p.roundTrip?.mismatches || 0;
  totalMissing += p.roundTrip?.missing || 0;
  totalRadio += p.roundTrip?.radioSkips || 0;
  totalCondTests += p.conditionalLogic?.totalTests || 0;
  totalCondPassed += p.conditionalLogic?.passed || 0;
  totalCondFailed += p.conditionalLogic?.failed || 0;
  if (p.overallSuccess) pass++; else fail++;
  const nonRadio = p.fieldCount - (p.roundTrip?.radioSkips || 0);
  const rt = p.roundTrip?.matches !== undefined ? `${p.roundTrip.matches}/${nonRadio}` : 'ERR';
  const cl = p.conditionalLogic?.totalTests ? `${p.conditionalLogic.passed}/${p.conditionalLogic.totalTests}` : '-';
  rows.push(`  ${p.overallSuccess ? '\u2705' : '\u274c'} ${p.section.padEnd(13)} ${String(p.fieldCount).padStart(6)}   RT:${rt.padStart(10)}  CL:${cl.padStart(8)}`);
}

console.log(`SECTIONS: ${pass} PASS / ${fail} FAIL (of ${files.length})`);
console.log(`FIELDS:   ${totalFields} total`);
console.log(`RT MATCH: ${totalMatches}/${totalFields - totalRadio} (${totalMismatches} mismatches, ${totalMissing} missing, ${totalRadio} radio skips)`);
console.log(`COND:     ${totalCondPassed}/${totalCondTests} expression tests passed, ${totalCondFailed} failed`);
console.log('');
rows.forEach(r => console.log(r));
