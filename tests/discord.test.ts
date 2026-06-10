import { describe, it, expect } from 'vitest';
import { AttachmentBuilder } from 'discord.js';
import { toAttachment } from '../src/discord.js';

describe('toAttachment', () => {
  it('wraps a buffer in a discord.js AttachmentBuilder with the given name', () => {
    const buf = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const att = toAttachment(buf, 'welcome.png');
    expect(att).toBeInstanceOf(AttachmentBuilder);
    expect(att.name).toBe('welcome.png');
  });

  it('defaults the filename to welcome.png', () => {
    const att = toAttachment(Buffer.from([0x47]));
    expect(att.name).toBe('welcome.png');
  });
});
