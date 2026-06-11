import { describe, it, expect } from 'vitest';
import { WelcomeCard } from '../src/WelcomeCard.js';
import { WelcomeCardError } from '../src/errors.js';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
const GIF_MAGIC = Buffer.from('GIF89a', 'ascii');

describe('WelcomeCard builder', () => {
  it('chains setters and renders a PNG', async () => {
    const buf = await new WelcomeCard()
      .setUsername('Quit')
      .setSubtitle('Welcome!')
      .setMemberCount(1234)
      .setTheme('dark')
      .toPNG();
    expect(buf.subarray(0, 4).equals(PNG_MAGIC)).toBe(true);
  });

  it('renders a GIF with animations', async () => {
    const buf = await new WelcomeCard()
      .setUsername('Quit')
      .setAnimations(['text', 'avatar'])
      .toGIF();
    expect(buf.subarray(0, 6).equals(GIF_MAGIC)).toBe(true);
  });

  it('renders a GIF with background animation without throwing', async () => {
    const buf = await new WelcomeCard()
      .setUsername('Quit')
      .setAnimations(['background'])
      .toGIF();
    expect(buf.subarray(0, 6).equals(GIF_MAGIC)).toBe(true);
    expect(buf.length).toBeGreaterThan(5000);
  });

  it('throws WelcomeCardError when username is missing on toPNG', async () => {
    await expect(new WelcomeCard().toPNG()).rejects.toBeInstanceOf(WelcomeCardError);
  });

  it('throws WelcomeCardError on unknown preset', () => {
    // @ts-expect-error testing invalid runtime value
    expect(() => new WelcomeCard().setPreset('bogus')).toThrow(WelcomeCardError);
  });

  it('renders a GIF with ring animation', async () => {
    const buf = await new WelcomeCard()
      .setUsername('Quit')
      .setRingColor('#ff0000')
      .setAnimations(['ring'])
      .toGIF();
    expect(buf.subarray(0, 6).equals(GIF_MAGIC)).toBe(true);
  });

  it('renders a GIF with slide and bounce animations', async () => {
    const buf = await new WelcomeCard()
      .setUsername('Quit')
      .setAnimations(['slide', 'bounce'])
      .toGIF();
    expect(buf.subarray(0, 6).equals(GIF_MAGIC)).toBe(true);
  });

  it('accepts a Buffer as background', async () => {
    const buf = await new WelcomeCard()
      .setUsername('Quit')
      .setBackground(Buffer.alloc(0))
      .toPNG();
    expect(buf.subarray(0, 4).equals(PNG_MAGIC)).toBe(true);
  });
});
