// Regenerates the README example images. Run `npm run build` first, then:
//   node scripts/render-examples.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { WelcomeCard } from '../dist/index.js';

// placeholder avatar: gradient circle with an initial
const c = createCanvas(256, 256);
const ctx = c.getContext('2d');
const g = ctx.createLinearGradient(0, 0, 256, 256);
g.addColorStop(0, '#7c3aed');
g.addColorStop(1, '#06b6d4');
ctx.fillStyle = g;
ctx.fillRect(0, 0, 256, 256);
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 140px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Q', 128, 140);
const avatar = c.toBuffer('image/png');

mkdirSync('examples', { recursive: true });

const base = () =>
  new WelcomeCard()
    .setUsername('Quit')
    .setAvatar(avatar)
    .setSubtitle('Welcome to the server!')
    .setMemberCount(1234);

for (const preset of ['centered', 'neon', 'minimal', 'hero']) {
  const png = await base().setPreset(preset).toPNG();
  writeFileSync(`examples/${preset}.png`, png);
  console.log(`examples/${preset}.png`, png.length, 'bytes');
}

const gif = await base().setAnimations(['background', 'text', 'avatar']).toGIF();
writeFileSync('examples/animated.gif', gif);
console.log('examples/animated.gif', gif.length, 'bytes');
