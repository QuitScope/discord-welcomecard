import type { CardOptions } from '../types.js';
import { PRESETS, type LayoutResult } from '../presets/index.js';
import { WelcomeCardError } from '../errors.js';

export function layout(opts: CardOptions): LayoutResult {
  const fn = PRESETS[opts.preset];
  if (!fn) {
    throw new WelcomeCardError(
      `Unknown preset "${opts.preset}". Allowed: ${Object.keys(PRESETS).join(', ')}`,
    );
  }
  return fn(opts);
}
