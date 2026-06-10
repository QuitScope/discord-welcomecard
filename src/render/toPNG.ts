import { createCanvas } from '@napi-rs/canvas';
import '../assets/fonts/register.js';
import type { CardOptions } from '../types.js';
import { layout } from './layout.js';
import { drawFrame, STATIC_FRAME } from './drawFrame.js';

export async function renderPNG(opts: CardOptions): Promise<Buffer> {
  const l = layout(opts);
  const canvas = createCanvas(l.width, l.height);
  const ctx = canvas.getContext('2d');
  await drawFrame(ctx, l, STATIC_FRAME);
  return canvas.toBuffer('image/png');
}
