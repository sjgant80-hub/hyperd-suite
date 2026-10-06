// fixtures.mjs — demo DATA for the capstone (not kernel logic, so not mutation-gated).
// The same two synthetic domains pattern-forge uses: a single-feature signal, and a conjunction.
export const signalDomain = () => {
  const c = [];
  for (let i = 0; i < 30; i++) c.push({ x: [i % 10, (i * 7) % 10, (i * 3 + 1) % 10], y: i % 10 >= 5 ? 1 : 0 });
  return c;
};
export const andDomain = () => {
  const c = [];
  for (let i = 0; i < 100; i++) c.push({ x: [i % 10, Math.floor(i / 10), (i * 7) % 10], y: (i % 10 >= 5 && Math.floor(i / 10) >= 5) ? 1 : 0 });
  return c;
};
