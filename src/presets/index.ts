import type { CardOptions, PresetName } from '../types.js';
import { centeredLayout, type LayoutResult } from './centered.js';
import { neonLayout } from './neon.js';
import { minimalLayout } from './minimal.js';
import { heroLayout } from './hero.js';

export type { LayoutResult, TextBox } from './centered.js';
export type LayoutFn = (opts: CardOptions) => LayoutResult;

export const PRESETS: Record<PresetName, LayoutFn> = {
  centered: centeredLayout,
  neon: neonLayout,
  minimal: minimalLayout,
  hero: heroLayout,
};
