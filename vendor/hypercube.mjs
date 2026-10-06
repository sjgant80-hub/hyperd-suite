// hypercube.mjs — the estate's 4D hypercube interconnect (hyper-geometry upgrade #2).
//
// 16 nodes (2^4), each node a 4-bit address (0..15). Two nodes are ADJACENT iff their
// addresses differ in exactly ONE bit. Consequences, all provable here:
//   · every node has exactly DIM (=4) neighbours (regular degree, no bottleneck),
//   · any node reaches any other in at most DIM (=4) hops (the Hamming distance = the diameter),
//   · routing is deterministic bit-fixing: flip the differing bits low→high.
// Compare the flat meshes the estate used before: a CHAIN of 16 has diameter 15 (slow, fragile);
// a STAR has diameter 2 but one centre carries every message (a single point of failure).
// The hypercube is the real HPC answer: short, uniform, no bottleneck. Real binary n-cube math.
//
// Pure + deterministic + never throws on garbage (invalid input returns a safe empty/-1 value).

export const DIM = 4;          // four dimensions
export const N = 1 << DIM;     // 16 nodes

const okNode = (x) => Number.isInteger(x) && x >= 0 && x < N;

/** number of 1-bits (popcount); non-ints / negatives → 0, never throws */
export function popcount(x) {
  if (!Number.isInteger(x) || x < 0) return 0;
  let c = 0, v = x >>> 0;
  while (v) { v &= v - 1; c++; }
  return c;
}

/** hop distance between two nodes = Hamming distance of their addresses; invalid → -1 */
export function hops(a, b) {
  if (!okNode(a) || !okNode(b)) return -1;
  return popcount(a ^ b);
}

/** the DIM neighbours of a node (flip each bit), ascending; invalid → [] */
export function neighbors(node) {
  if (!okNode(node)) return [];
  const out = [];
  for (let bit = 0; bit < DIM; bit++) out.push(node ^ (1 << bit));
  return out.sort((x, y) => x - y);
}

/** deterministic bit-fixing route a→b: fix differing bits low→high.
 *  Returns the node sequence [a, …, b]; length-1 == hops(a,b) ≤ DIM. Invalid → [] */
export function route(a, b) {
  if (!okNode(a) || !okNode(b)) return [];
  const path = [a];
  let cur = a;
  const diff = a ^ b;
  for (let bit = 0; bit < DIM; bit++) {
    if (diff & (1 << bit)) { cur ^= (1 << bit); path.push(cur); }
  }
  return path;
}

/** every consecutive pair in a path is a single-bit flip (a real hypercube edge)? */
export function isValidPath(path) {
  if (!Array.isArray(path) || path.length === 0) return false;
  for (const n of path) if (!okNode(n)) return false;
  for (let i = 1; i < path.length; i++) if (popcount(path[i - 1] ^ path[i]) !== 1) return false;
  return true;
}

/** the diameter: the largest hop-count over ALL pairs (= DIM for a d-cube) */
export function diameter() {
  let max = 0;
  for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) {
    const h = hops(a, b);
    if (h > max) max = h;
  }
  return max;
}

/** worst-case hops on a flat CHAIN of N nodes (0-1-2-…-15): |a-b|; the thing we beat */
export function chainHops(a, b) {
  if (!okNode(a) || !okNode(b)) return -1;
  return Math.abs(a - b);
}

// ── the estate's organs mapped onto the 16 vertices — "connect it all as one system" ──
export const ORGANS = [
  'crystal', 'fall-remember', 'the-dreamer', 'octa-verify',
  'sentinel', 'wisp', 'kar-foldcycle', 'highd-recall',
  'seed-library', 'fall-spore', 'couple-gate', 'mesh-governance',
  'tetra', 'light', 'acg-assessor', 'witness',
];

/** organ name at a vertex; invalid → null */
export function organAt(node) { return okNode(node) ? ORGANS[node] : null; }

/** vertex index of an organ by name; unknown → -1 */
export function organIndex(name) {
  const i = ORGANS.indexOf(name);
  return i;
}

/** route between two organs by NAME → the organ-name path; unknown organ → [].
 *  No explicit guard needed: organIndex returns -1 for an unknown name, and route()
 *  rejects any out-of-range endpoint with [], so an unknown organ falls straight through to []. */
export function organRoute(fromName, toName) {
  return route(organIndex(fromName), organIndex(toName)).map((n) => ORGANS[n]);
}
