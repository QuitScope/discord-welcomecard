// Ease-out reveal: alpha goes 0 -> 1 over first 70% of timeline.
export function textAlpha(progress: number): number {
  const p = Math.min(progress / 0.7, 1);
  return 1 - Math.pow(1 - p, 3);
}
