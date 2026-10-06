// metrics.mjs — the measured properties of the hypercube vs the flat chain it replaces.
// Pure + deterministic: same kernel in, same numbers out. This is what the live page re-derives
// in the browser and what CI re-computes on the runner, so the claim can never drift from the code.
//
// No mutable min/max/compare branches (Math.min/max/reduce instead) and no CLI guard — both were
// unkillable by any test, so they are structured out rather than baselined. `diameter === DIM`
// already proves "every pair is within DIM hops", so a separate always-true flag is redundant.

import { N, DIM, hops, chainHops, neighbors } from './hypercube.mjs';

export function metrics() {
  const degrees = [], hc = [], ch = [];
  for (let a = 0; a < N; a++) {
    degrees.push(neighbors(a).length);
    for (let b = 0; b < N; b++) { hc.push(hops(a, b)); ch.push(chainHops(a, b)); }
  }
  const sum = (arr) => arr.reduce((s, x) => s + x, 0);
  const round = (x) => Math.round(x * 1000) / 1000;
  const pairs = N * N;
  return {
    nodes: N,
    dim: DIM,
    minDegree: Math.min(...degrees),
    maxDegree: Math.max(...degrees),
    diameter: Math.max(...hc),          // === DIM ⟺ every pair is within DIM hops
    avgHops: round(sum(hc) / pairs),
    chainDiameter: Math.max(...ch),
    chainAvgHops: round(sum(ch) / pairs),
  };
}
