import { createCanvas } from '@napi-rs/canvas';
import * as gifencMod from 'gifenc';
// gifenc ships dual CJS/ESM with inconsistent interop — named exports may live on the
// namespace (vite/bundlers) or behind .default (node CJS-ESM interop). Pick whichever has them.
type Gifenc = typeof import('gifenc');
const { GIFEncoder, quantize, applyPalette } =
  'GIFEncoder' in gifencMod ? (gifencMod as Gifenc) : (gifencMod as { default: Gifenc }).default;
import '../assets/fonts/register.js';
import type { CardOptions } from '../types.js';
import { GIF_FRAMES, GIF_DELAY_MS, GIF_SCALE } from '../constants.js';
import { layout } from './layout.js';
import { drawFrame } from './drawFrame.js';
import { frameStateFor } from '../animate/index.js';

export async function renderGIF(opts: CardOptions): Promise<Buffer> {
  const l = layout(opts);
  // draw at full size, encode at half size: smaller files, under Discord limits
  const canvas = createCanvas(l.width, l.height);
  const ctx = canvas.getContext('2d');
  const gw = Math.round(l.width * GIF_SCALE);
  const gh = Math.round(l.height * GIF_SCALE);
  const out = createCanvas(gw, gh);
  const outCtx = out.getContext('2d');
  const enc = GIFEncoder();

  const frames = opts.animations.length === 0 ? 1 : GIF_FRAMES;
  // one shared palette for all frames: stable colors (no flicker), faster encode
  let palette: number[][] | undefined;
  for (let i = 0; i < frames; i++) {
    const progress = frames === 1 ? 0 : i / frames;
    const state = frameStateFor(opts.animations, progress);
    await drawFrame(ctx, l, state);
    outCtx.drawImage(canvas, 0, 0, gw, gh);
    const { data } = outCtx.getImageData(0, 0, gw, gh);
    palette ??= quantize(data, 256);
    const index = applyPalette(data, palette);
    enc.writeFrame(index, gw, gh, { palette, delay: GIF_DELAY_MS });
  }
  enc.finish();
  return Buffer.from(enc.bytes());
}
