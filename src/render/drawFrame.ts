import type { SKRSContext2D } from '@napi-rs/canvas';
import type { LayoutResult, TextBox } from '../presets/index.js';
import { loadImageOrFallback } from '../assets/loadImage.js';

export interface FrameState {
  textAlpha: number; // 0..1 reveal for text
  avatarGlow: number; // 0..1 glow intensity
  backgroundShift: number; // 0..1 gradient phase
}

export const STATIC_FRAME: FrameState = { textAlpha: 1, avatarGlow: 1, backgroundShift: 0 };

function drawText(ctx: SKRSContext2D, box: TextBox, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = box.color;
  ctx.textAlign = box.align;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${box.size}px ${box.family}`;
  ctx.fillText(box.text, box.x, box.y);
  ctx.restore();
}

export async function drawFrame(
  ctx: SKRSContext2D,
  l: LayoutResult,
  state: FrameState,
): Promise<void> {
  // background
  ctx.fillStyle = l.backgroundColor;
  ctx.fillRect(0, 0, l.width, l.height);
  if (l.background !== undefined) {
    const bg = await loadImageOrFallback(l.background, l.backgroundColor, l.width, l.height);
    ctx.drawImage(bg, 0, 0, l.width, l.height);
  }
  if (state.backgroundShift > 0) {
    // diagonal sheen sliding across the card; phase 0..1 loops with the GIF
    const x = (state.backgroundShift * 2 - 1) * l.width * 2;
    const g = ctx.createLinearGradient(x, 0, x + l.width, l.height);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.10)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, l.width, l.height);
  }

  // avatar (circular) with glow ring
  const { x, y, size, ringColor } = l.avatar;
  const cx = x + size / 2;
  const cy = y + size / 2;
  ctx.save();
  ctx.shadowColor = ringColor;
  ctx.shadowBlur = 10 + state.avatarGlow * 25;
  ctx.lineWidth = 6;
  ctx.strokeStyle = ringColor;
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2 + 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const avatarImg = await loadImageOrFallback(l.avatar.source, ringColor, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatarImg, x, y, size, size);
  ctx.restore();

  // text
  drawText(ctx, l.username, state.textAlpha);
  if (l.subtitle) drawText(ctx, l.subtitle, state.textAlpha);
  if (l.memberCount) drawText(ctx, l.memberCount, state.textAlpha);
}
