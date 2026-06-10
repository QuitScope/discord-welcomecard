// Pulsing glow 0..1 using a sine wave over the loop.
export function avatarGlow(progress: number): number {
  return (Math.sin(progress * Math.PI * 2) + 1) / 2;
}
