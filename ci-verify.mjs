// ci-verify.mjs — re-derive the suite verdict on the runner and prove it matches predictions.json.
import { suite } from './suite.mjs';
import { readFileSync } from 'node:fs';

export function derive() { const s = suite(); return { count: s.count, allHold: s.allHold }; }

if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('ci-verify.mjs')) {
  const preds = JSON.parse(readFileSync(new URL('./predictions.json', import.meta.url), 'utf8'));
  const m = derive();
  let fail = 0;
  for (const [k, v] of Object.entries(preds.expected)) if (m[k] !== v) { console.error(`MISMATCH ${k}: expected ${v}, got ${m[k]}`); fail++; }
  const holds = (e) => { const { count, allHold } = m; try { return !!eval(e); } catch { return false; } };
  for (const c of preds.claims) if (!holds(c.check)) { console.error(`CLAIM FAIL ${c.id}: ${c.check}`); fail++; }
  if (fail) { console.error(`\n${fail} mismatch(es).`); process.exit(1); }
  console.log('✓ suite re-derives: all four organs hold. count', m.count, 'allHold', m.allHold);
}
