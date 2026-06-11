import { describe, it, expect } from 'vitest';
import { layout } from '../src/render/layout.js';
import { DEFAULT_OPTIONS } from '../src/constants.js';
import { PRESETS } from '../src/presets/index.js';

describe('all presets', () => {
  it('hero preset respects theme=light and uses a light background', () => {
    const l = PRESETS['hero']({
      ...DEFAULT_OPTIONS,
      preset: 'hero',
      theme: 'light',
      username: 'Quit',
    });
    expect(l.backgroundColor.toLowerCase()).not.toBe('#1b1f2a');
  });

  for (const name of ['centered', 'neon', 'minimal', 'hero'] as const) {
    it(`${name} returns a valid layout with positioned avatar and username`, () => {
      const l = PRESETS[name]({
        ...DEFAULT_OPTIONS,
        preset: name,
        username: 'Quit',
        subtitle: 'Hi',
      });
      expect(l.width).toBeGreaterThan(0);
      expect(l.height).toBeGreaterThan(0);
      expect(l.avatar.size).toBeGreaterThan(0);
      expect(l.username.text).toBe('Quit');
      expect(l.backgroundColor).toMatch(/^#/);
    });
  }
});

describe('member count position', () => {
  const make = (memberCountPosition?: import('../src/types.js').MemberCountPosition) =>
    layout({
      ...DEFAULT_OPTIONS,
      username: 'Quit',
      subtitle: 'Welcome!',
      memberCount: 1234,
      memberCountPosition,
    });

  it('renders no member count when none is set', () => {
    const l = layout({ ...DEFAULT_OPTIONS, username: 'Quit' });
    expect(l.memberCount).toBeUndefined();
  });

  it('defaults to bottom-center in the centered preset', () => {
    const l = make();
    expect(l.memberCount?.align).toBe('center');
    expect(l.memberCount?.x).toBe(l.width / 2);
    expect(l.memberCount?.y).toBe(l.height - 24);
  });

  it('defaults to the bottom-right corner in the hero preset', () => {
    const l = layout({
      ...DEFAULT_OPTIONS,
      preset: 'hero',
      username: 'Quit',
      memberCount: 1234,
    });
    expect(l.memberCount?.align).toBe('right');
    expect(l.memberCount?.x).toBe(l.width - 24);
    expect(l.memberCount?.y).toBe(l.height - 24);
  });

  it('treats corner as an alias for bottom-right', () => {
    const l = make('corner');
    expect(l.memberCount?.align).toBe('right');
    expect(l.memberCount?.x).toBe(l.width - 24);
    expect(l.memberCount?.y).toBe(l.height - 24);
  });

  it('places center in the middle of the card', () => {
    const l = make('center');
    expect(l.memberCount?.x).toBe(l.width / 2);
    expect(l.memberCount?.y).toBe(l.height / 2);
    expect(l.memberCount?.align).toBe('center');
  });

  it('places bottom-center at the bottom middle', () => {
    const l = make('bottom-center');
    expect(l.memberCount?.x).toBe(l.width / 2);
    expect(l.memberCount?.y).toBe(l.height - 24);
    expect(l.memberCount?.align).toBe('center');
  });

  it('places top-left at the top left edge', () => {
    const l = make('top-left');
    expect(l.memberCount?.x).toBe(24);
    expect(l.memberCount?.y).toBeLessThan(60);
    expect(l.memberCount?.align).toBe('left');
  });

  it('places center-right at the middle right edge', () => {
    const l = make('center-right');
    expect(l.memberCount?.x).toBe(l.width - 24);
    expect(l.memberCount?.y).toBe(l.height / 2);
    expect(l.memberCount?.align).toBe('right');
  });

  it('honors the position in the hero preset too', () => {
    const l = layout({
      ...DEFAULT_OPTIONS,
      preset: 'hero',
      username: 'Quit',
      memberCount: 7,
      memberCountPosition: 'top-center',
    });
    expect(l.memberCount?.x).toBe(l.width / 2);
    expect(l.memberCount?.align).toBe('center');
  });
});

describe('layout (centered preset)', () => {
  const result = layout({
    ...DEFAULT_OPTIONS,
    preset: 'centered',
    username: 'Quit',
    subtitle: 'Welcome!',
    memberCount: 1234,
  });

  it('centers the avatar horizontally', () => {
    expect(result.avatar.x + result.avatar.size / 2).toBeCloseTo(result.width / 2, 0);
  });

  it('places username below the avatar', () => {
    expect(result.username.y).toBeGreaterThan(result.avatar.y + result.avatar.size);
  });

  it('resolves a background color for the dark theme', () => {
    expect(result.backgroundColor).toMatch(/^#/);
  });

  it('exposes the member count text', () => {
    expect(result.memberCount?.text).toContain('1234');
  });

  it('throws nothing and keeps subtitle text', () => {
    expect(result.subtitle?.text).toBe('Welcome!');
  });
});

describe('subtitle font size', () => {
  it('uses custom subtitleSize when provided', () => {
    const l = layout({
      ...DEFAULT_OPTIONS,
      username: 'Quit',
      subtitle: 'Welcome!',
      font: { size: 40, subtitleSize: 22 },
    });
    expect(l.subtitle?.size).toBe(22);
  });

  it('defaults subtitle to ~61% of font.size when subtitleSize is not set', () => {
    const l = layout({
      ...DEFAULT_OPTIONS,
      username: 'Quit',
      subtitle: 'Welcome!',
      font: { size: 40 },
    });
    // Math.round(40 * 0.61) = 24
    expect(l.subtitle?.size).toBe(24);
  });
});
