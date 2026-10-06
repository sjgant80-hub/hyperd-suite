// suite.mjs — the hyper-geometry capstone: re-derive each organ's headline claim from its OWN vendored
// kernel, in one place, and report whether the whole upgrade still holds. "Run it all as one system."
//
// Pure, deterministic, never throws: each organ's kernel is itself witnessed; this only combines them.

import { metrics } from './vendor/metrics.mjs';
import { organCoords, kappa, nearest } from './vendor/fold.mjs';
import { forge } from './vendor/pattern.mjs';
import { breed } from './vendor/breed.mjs';
import { signalDomain, andDomain } from './fixtures.mjs';

/** Re-derive the four organ claims. Each entry: { id, organ, claim, value, holds, url }. */
export function suite() {
  const organs = [];

  // #2 hypercube-mesh — any organ reaches any other in at most DIM hops
  const m = metrics();
  organs.push({
    id: 'hypercube-mesh', organ: 'Hypercube mesh', claim: 'any organ reaches any other in ≤ 4 hops',
    value: `diameter ${m.diameter} (flat chain ${m.chainDiameter})`, holds: m.diameter === 4,
    url: 'https://sjgant80-hub.github.io/hypercube-mesh/',
  });

  // #3 fold-coords — retrieval IS argmax coupling (one metric)
  const C = organCoords();
  const all = Object.values(C);
  const nr = nearest(C['crystal'], all);
  const maxK = Math.max(...all.map((v) => kappa(C['crystal'], v)));
  const unified = nr.score === maxK;
  organs.push({
    id: 'fold-coords', organ: 'Fold coordinates', claim: 'coupling = retrieval = consensus (one metric)',
    value: `retrieval == argmax coupling: ${unified}`, holds: unified === true,
    url: 'https://sjgant80-hub.github.io/fold-coords/',
  });

  // #5 pattern-forge (find) — a pattern survives only if it generalises on held-out
  const f = forge(signalDomain(), { holdoutFrac: 1 / 3, bar: 0.75 });
  const sigBA = f.survivors.find((s) => s.feature === 0)?.testBA;   // optional chaining guards a missing survivor
  const generalises = sigBA === 1;
  organs.push({
    id: 'pattern-forge-find', organ: 'Pattern forge · find', claim: 'a pattern survives only if it generalises (held-out)',
    value: `signal held-out BA ${sigBA ?? 0}`, holds: generalises,
    url: 'https://sjgant80-hub.github.io/pattern-forge/',
  });

  // #5 pattern-forge (improve) — breeding beats any single feature on held-out
  const b = breed(andDomain(), { generations: 3, keep: 8, maxTerms: 3 });
  organs.push({
    id: 'pattern-forge-breed', organ: 'Pattern forge · improve', claim: 'breeding beats any single feature on held-out',
    value: `${b.singleBestTestBA} → ${b.champion?.testBA ?? 0}`, holds: b.improvedHeldOut === true,
    url: 'https://sjgant80-hub.github.io/pattern-forge/',
  });

  return { organs, allHold: organs.every((o) => o.holds), count: organs.length };
}
