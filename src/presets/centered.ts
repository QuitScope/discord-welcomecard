import { CARD_WIDTH, CARD_HEIGHT } from '../constants.js';
import type { CardOptions, MemberCountPosition } from '../types.js';
import { DEFAULT_FONT_FAMILY } from '../assets/fonts/register.js';

const EDGE_PAD = 24;
const TOP_BASELINE = 36; // baseline y for top-anchored text

export function resolvePosition(
  position: MemberCountPosition | undefined,
  width: number,
  height: number,
): { x: number; y: number; align: 'left' | 'center' | 'right' } {
  const pos = position === undefined || position === 'corner' ? 'bottom-right' : position;
  const [v, h] = pos === 'center' ? ['center', 'center'] : pos.split('-');
  return {
    x: h === 'left' ? EDGE_PAD : h === 'center' ? width / 2 : width - EDGE_PAD,
    y: v === 'top' ? TOP_BASELINE : v === 'center' ? height / 2 : height - EDGE_PAD,
    align: h as 'left' | 'center' | 'right',
  };
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
  const bgColor =
    typeof opts.background === 'string' && opts.background.startsWith('#')
      ? opts.background
      : opts.theme === 'dark'
        ? '#1e1e2e'
        : '#eff1f5';
  const textColor = opts.font.color ?? (opts.theme === 'dark' ? '#ffffff' : '#11111b');
  const family = opts.font.family ?? DEFAULT_FONT_FAMILY;

  const avatarSize = 120;
  const avatarY = 50;

  return {
    width,
    height,
    backgroundColor: bgColor,
    background:
      typeof opts.background === 'string' && opts.background.startsWith('#')
        ? undefined
        : opts.background,
    avatar: {
      x: width / 2 - avatarSize / 2,
      y: avatarY,
      size: avatarSize,
      ringColor: accent,
      source: opts.avatar,
    },
    username: {
      text: opts.username ?? '',
      x: width / 2,
      y: avatarY + avatarSize + 60,
      size: opts.font.size ?? 44,
      color: textColor,
      family,
      align: 'center',
    },
    subtitle: opts.subtitle
      ? {
          text: opts.subtitle,
          x: width / 2,
          y: avatarY + avatarSize + 105,
          size: 24,
          color: textColor,
          family,
          align: 'center',
        }
      : undefined,
    memberCount:
      opts.memberCount !== undefined
        ? {
            text: `MEMBER #${opts.memberCount}`,
            ...resolvePosition(opts.memberCountPosition, width, height),
            size: 16,
            color: textColor,
            family,
          }
        : undefined,
  };
}
