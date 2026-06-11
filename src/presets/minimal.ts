import { centeredLayout, resolveBackgroundColor } from './centered.js';
import type { CardOptions } from '../types.js';
import type { LayoutResult } from './centered.js';

export function minimalLayout(opts: CardOptions): LayoutResult {
  const base = centeredLayout(opts);
  return {
    ...base,
    backgroundColor: resolveBackgroundColor(opts.background, '#ffffff'),
    avatar: { ...base.avatar, ringColor: '#222222' },
    username: { ...base.username, color: opts.font.color ?? '#111111' },
    subtitle: base.subtitle ? { ...base.subtitle, color: '#555555' } : undefined,
  };
}
