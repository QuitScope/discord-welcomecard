import type { CardOptions } from '../types.js';
import { PRESETS, type LayoutResult } from '../presets/index.js';
import { WelcomeCardError } from '../errors.js';
import { sanitizeText } from '../text/sanitize.js';

export function layout(opts: CardOptions): LayoutResult {
  const fn = PRESETS[opts.preset];
  if (!fn) {
    throw new WelcomeCardError(
      `Unknown preset "${opts.preset}". Allowed: ${Object.keys(PRESETS).join(', ')}`,
    );
  }

  const clean: CardOptions =
    opts.sanitizeText ?? true
      ? {
          ...opts,
          username: opts.username != null ? sanitizeText(opts.username) : opts.username,
          subtitle: opts.subtitle != null ? sanitizeText(opts.subtitle) : opts.subtitle,
        }
      : opts;

  return fn(clean);
}
