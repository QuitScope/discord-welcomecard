// Sine-based vertical oscillation: returns -1..1 (one full cycle per loop).
// Negative = upward, positive = downward. drawFrame multiplies by pixel amplitude.
export function avatarBounce(progress: number): number {
  return Math.sin(progress * Math.PI * 2);
}
