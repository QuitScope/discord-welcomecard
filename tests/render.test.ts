import { describe, it, expect } from 'vitest';
import { createCanvas } from '@napi-rs/canvas';
import { loadImageOrFallback } from '../src/assets/loadImage.js';
import { renderPNG } from '../src/render/toPNG.js';
import { DEFAULT_OPTIONS } from '../src/constants.js';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

describe('renderPNG', () => {
  it('returns a valid PNG buffer', async () => {
    const buf = await renderPNG({
      ...DEFAULT_OPTIONS,
      username: 'Quit',
      subtitle: 'Welcome!',
      memberCount: 7,
    });
    expect(buf.subarray(0, 4).equals(PNG_MAGIC)).toBe(true);
    expect(buf.length).toBeGreaterThan(1000);
  });
});

describe('loadImageOrFallback', () => {
  it('returns a drawable image from a PNG buffer', async () => {
    const canvas = createCanvas(10, 10);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 10, 10);
    const buf = canvas.toBuffer('image/png');

    const img = await loadImageOrFallback(buf, '#000');
    expect(img.width).toBe(10);
    expect(img.height).toBe(10);
  });

  it('returns a solid fallback image when source is undefined', async () => {
    const img = await loadImageOrFallback(undefined, '#123456', 64, 64);
    expect(img.width).toBe(64);
    expect(img.height).toBe(64);
  });

  it('falls back when a URL fails to load', async () => {
    const img = await loadImageOrFallback('https://invalid.invalid/none.png', '#123456', 64, 64);
    expect(img.width).toBe(64);
    expect(img.height).toBe(64);
  });
});
