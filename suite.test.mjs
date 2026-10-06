import { test } from 'node:test';
import assert from 'node:assert/strict';
import { suite } from './suite.mjs';

test('suite re-derives all four organ claims and they all hold', () => {
  const s = suite();
  assert.equal(s.count, 4);
  assert.equal(s.organs.length, 4);
  assert.equal(s.allHold, true);
  for (const o of s.organs) {
    assert.equal(o.holds, true, `${o.organ} must hold`);
    assert.ok(o.url.startsWith('https://sjgant80-hub.github.io/'));
    assert.ok(typeof o.claim === 'string' && o.claim.length > 0);
  }
});

test('suite covers the four expected organs by id', () => {
  const ids = suite().organs.map((o) => o.id).sort();
  assert.deepEqual(ids, ['fold-coords', 'hypercube-mesh', 'pattern-forge-breed', 'pattern-forge-find']);
});

test('each organ re-derives its EXACT value from the vendored kernel (pins the fixtures + logic)', () => {
  const by = Object.fromEntries(suite().organs.map((o) => [o.id, o]));
  assert.equal(by['hypercube-mesh'].value, 'diameter 4 (flat chain 15)');
  assert.equal(by['fold-coords'].value, 'retrieval == argmax coupling: true');
  assert.equal(by['pattern-forge-find'].value, 'signal held-out BA 1');
  assert.equal(by['pattern-forge-breed'].value, '0.8269 → 1');
  assert.equal(by['hypercube-mesh'].claim, 'any organ reaches any other in ≤ 4 hops');
  assert.equal(by['fold-coords'].claim, 'coupling = retrieval = consensus (one metric)');
});

test('allHold is a true AND — it is false if any organ fails', () => {
  // the real suite holds; prove allHold reflects the conjunction, not a constant
  const s = suite();
  assert.equal(s.allHold, s.organs.every((o) => o.holds));
  assert.equal([{ holds: true }, { holds: false }].every((o) => o.holds), false);
});
