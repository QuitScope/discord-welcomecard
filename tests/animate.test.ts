import { describe, it, expect } from 'vitest';
import { frameStateFor } from '../src/animate/index.js';
import { renderGIF } from '../src/render/toGIF.js';
import { DEFAULT_OPTIONS } from '../src/constants.js';

const GIF_MAGIC = Buffer.from('GIF89a', 'ascii');

describe('frameStateFor', () => {
  it('ramps text alpha from ~0 to 1 when text animation is on', () => {
    const start = frameStateFor(['text'], 0);
    const end = frameStateFor(['text'], 1);
    expect(start.textAlpha).toBeLessThan(0.2);
    expect(end.textAlpha).toBeCloseTo(1, 1);
  });

  it('keeps text fully visible when text animation is off', () => {
    expect(frameStateFor([], 0).textAlpha).toBe(1);
  });

  it('oscillates avatar glow when avatar animation is on', () => {
    const a = frameStateFor(['avatar'], 0.25).avatarGlow;
    const b = frameStateFor(['avatar'], 0.75).avatarGlow;
    expect(a).not.toBeCloseTo(b, 2);
  });
});

describe('renderGIF', () => {
  it('returns a valid animated GIF buffer', async () => {
    const buf = await renderGIF({
      ...DEFAULT_OPTIONS,
      username: 'Quit',
      animations: ['background', 'text', 'avatar'],
    });
    expect(buf.subarray(0, 6).equals(GIF_MAGIC)).toBe(true);
    expect(buf.length).toBeGreaterThan(1000);
  });
});
