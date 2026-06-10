import { centeredLayout } from './centered.js';
import type { CardOptions } from '../types.js';
import type { LayoutResult } from './centered.js';

export function neonLayout(opts: CardOptions): LayoutResult {
  const base = centeredLayout(opts);
  return {
    ...base,
    backgroundColor: opts.background?.startsWith('#') ? opts.background : '#0b0b1a',
    avatar: { ...base.avatar, ringColor: '#00ffd5' },
    username: { ...base.username, color: opts.font.color ?? '#00ffd5' },
  };
}
