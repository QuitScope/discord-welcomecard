// Ease-in-out: text slides up from below into position over 80% of the timeline.
// Returns 0 (off-screen below) → 1 (final position).
export function textSlide(progress: number): number {
  const p = Math.min(progress / 0.8, 1);
  return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
}
