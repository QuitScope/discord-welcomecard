import type { CardOptions } from './types.js';

export const CARD_WIDTH = 840;
export const CARD_HEIGHT = 420; // 2:1 banner

export const GIF_FRAMES = 30;
export const GIF_DELAY_MS = 50; // ~20fps
export const GIF_SCALE = 0.5; // GIFs render at half size to stay under Discord upload limits

export const DEFAULT_OPTIONS: CardOptions = {
  preset: 'centered',
  theme: 'dark',
  font: {},
  animations: [],
};
