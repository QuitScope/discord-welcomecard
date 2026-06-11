import { CARD_WIDTH, CARD_HEIGHT } from '../constants.js';
import type { CardOptions, MemberCountPosition } from '../types.js';
import { DEFAULT_FONT_FAMILY } from '../assets/fonts/register.js';

const EDGE_PAD = 24;
const TOP_BASELINE = 36; // baseline y for top-anchored text

export function isHexBackground(background: string | undefined): background is string {
  return typeof background === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(background);
}

export function resolveBackgroundColor(background: string | undefined, fallback: string): string {
  return isHexBackground(background) ? background : fallback;
}

export function resolvePosition(
  position: MemberCountPosition | undefined,
  width: number,
  height: number,
): { x: number; y: number; align: 'left' | 'center' | 'right' } {
  const pos = position === undefined || position === 'corner' ? 'bottom-right' : position;
  const x = { left: EDGE_PAD, center: width / 2, right: width - EDGE_PAD } as const;
  const y = { top: TOP_BASELINE, center: height / 2, bottom: height - EDGE_PAD } as const;
  switch (pos) {
    case 'top-left':      return { x: x.left,   y: y.top,    align: 'left'   };
    case 'top-center':    return { x: x.center,  y: y.top,    align: 'center' };
    case 'top-right':     return { x: x.right,   y: y.top,    align: 'right'  };
    case 'center-left':   return { x: x.left,   y: y.center, align: 'left'   };
    case 'center':        return { x: x.center,  y: y.center, align: 'center' };
    case 'center-right':  return { x: x.right,   y: y.center, align: 'right'  };
    case 'bottom-left':   return { x: x.left,   y: y.bottom, align: 'left'   };
    case 'bottom-center': return { x: x.center,  y: y.bottom, align: 'center' };
    case 'bottom-right':  return { x: x.right,   y: y.bottom, align: 'right'  };
    default: {
      const _exhausted: never = pos;
      throw new Error(`Unhandled memberCountPosition: "${_exhausted as string}"`);
    }
  }
}

export interface TextBox {
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  family: string;
  align: 'left' | 'center' | 'right';
}

export interface LayoutResult {
  width: number;
  height: number;
  backgroundColor: string;
  background?: string | Buffer;
  avatar: { x: number; y: number; size: number; ringColor: string; source?: string | Buffer };
  username: TextBox;
  subtitle?: TextBox;
  memberCount?: TextBox;
}

export function centeredLayout(opts: CardOptions): LayoutResult {
  const width = CARD_WIDTH;
  const height = CARD_HEIGHT;
  const accent = opts.theme === 'dark' ? '#89b4fa' : '#1e66f5';
  const bgColor = resolveBackgroundColor(
    opts.background,
    opts.theme === 'dark' ? '#1e1e2e' : '#eff1f5',
  );
  const textColor = opts.font.color ?? (opts.theme === 'dark' ? '#ffffff' : '#11111b');
  const usernameColor = opts.font.usernameColor ?? textColor;
  const family = opts.font.family ?? DEFAULT_FONT_FAMILY;

  const avatarSize = 170;
  const avatarY = 56;

  return {
    width,
    height,
    backgroundColor: bgColor,
    background: isHexBackground(opts.background) ? undefined : opts.background,
    avatar: {
      x: width / 2 - avatarSize / 2,
      y: avatarY,
      size: avatarSize,
      ringColor: opts.ringColor ?? accent,
      source: opts.avatar,
    },
    username: {
      text: opts.username ?? '',
      x: width / 2,
      y: avatarY + avatarSize + 66,
      size: opts.font.size ?? 56,
      color: usernameColor,
      family,
      align: 'center',
    },
    subtitle: opts.subtitle
      ? {
          text: opts.subtitle,
          x: width / 2,
          y: avatarY + avatarSize + 122,
          size: opts.font.subtitleSize ?? Math.round((opts.font.size ?? 56) * 0.61),
          color: textColor,
          family,
          align: 'center',
        }
      : undefined,
    memberCount:
      opts.memberCount !== undefined
        ? {
            text: `MEMBER #${opts.memberCount}`,
            // centered preset: everything centered by default, count included
            ...resolvePosition(opts.memberCountPosition ?? 'bottom-center', width, height),
            size: 20,
            color: textColor,
            family,
          }
        : undefined,
  };
}
