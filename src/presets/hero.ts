import { centeredLayout, resolvePosition, resolveBackgroundColor } from './centered.js';
import type { CardOptions } from '../types.js';
import type { LayoutResult } from './centered.js';

// Hero: avatar shifted left, text left-aligned beside it.
export function heroLayout(opts: CardOptions): LayoutResult {
  const base = centeredLayout(opts);
  const avatarX = 60;
  const textX = avatarX + base.avatar.size + 40;
  return {
    ...base,
    backgroundColor: resolveBackgroundColor(
      opts.background,
      opts.theme === 'dark' ? '#1b1f2a' : '#e8ecf4',
    ),
    avatar: { ...base.avatar, x: avatarX, y: base.height / 2 - base.avatar.size / 2 },
    username: { ...base.username, x: textX, y: base.height / 2 + 42, align: 'left' },
    subtitle: base.subtitle
      ? { ...base.subtitle, x: textX, y: base.height / 2 - 12, align: 'left' }
      : undefined,
    memberCount: base.memberCount
      ? // hero is asymmetric — default the count to the corner, not bottom-center
        {
          ...base.memberCount,
          ...resolvePosition(opts.memberCountPosition ?? 'bottom-right', base.width, base.height),
        }
      : undefined,
  };
}
