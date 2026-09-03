import { describe, it, expect } from 'vitest';
import { sanitizeText } from '../src/text/sanitize.js';

describe('sanitizeText', () => {
  it('normalizes mathematical alphanumeric symbols to plain letters', () => {
    expect(sanitizeText('𝙈𝙖𝙧𝙡𝙤𝙤𝙬')).toBe('Marloow');
  });

  it('normalizes fraktur letters', () => {
    expect(sanitizeText('𝖐𝖞𝖿')).toBe('kyf');
  });

  it('normalizes circled letters', () => {
    expect(sanitizeText('ⓜⓐⓡ')).toBe('mar');
  });

  it('normalizes fullwidth letters', () => {
    expect(sanitizeText('ＭＡＲ')).toBe('MAR');
  });

  it('strips trailing ornament after normalizing', () => {
    expect(sanitizeText('𝙈𝙖𝙧𝙡𝙤𝙤𝙬☙')).toBe('Marloow');
  });

  it('keeps precomposed accented names intact', () => {
    expect(sanitizeText('Nguyễn')).toBe('Nguyễn');
    expect(sanitizeText('Björn')).toBe('Björn');
    expect(sanitizeText('Zoë')).toBe('Zoë');
  });

  it('flattens zalgo stacks to at most one combining mark per base', () => {
    const zalgo = 'M҉a̸r͜l͝o̢w̡';
    const out = sanitizeText(zalgo);
    expect(out.replace(/\p{M}/gu, '')).toBe('Marlow');
    for (const [, marks] of out.matchAll(/([\p{M}]+)/gu)) {
      expect(marks.length).toBeLessThanOrEqual(1);
    }
  });

  it('strips emoji and pictographs', () => {
    expect(sanitizeText('Quit 🎉🔥')).toBe('Quit');
  });

  it('leaves non-latin scripts untouched', () => {
    expect(sanitizeText('Марлов')).toBe('Марлов');
    expect(sanitizeText('漢字')).toBe('漢字');
  });

  it('leaves plain names unchanged', () => {
    expect(sanitizeText('plain_name')).toBe('plain_name');
    expect(sanitizeText('Quit-Scope 123')).toBe('Quit-Scope 123');
  });

  it('collapses internal whitespace and trims', () => {
    expect(sanitizeText('  a   b  ')).toBe('a b');
  });

  it('falls back to the trimmed original when everything is stripped', () => {
    expect(sanitizeText('☙☙☙')).toBe('☙☙☙');
    expect(sanitizeText('  🎉  ')).toBe('🎉');
  });
});
