import { AttachmentBuilder } from 'discord.js';

export function toAttachment(buffer: Buffer, name = 'welcome.png'): AttachmentBuilder {
  return new AttachmentBuilder(buffer, { name });
}
