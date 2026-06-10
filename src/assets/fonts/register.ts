import { GlobalFonts } from '@napi-rs/canvas';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));

// dev/tests run from src/assets/fonts; the published build runs from dist
// with the font copied next to it (tsup publicDir).
const candidates = [
  join(here, 'Poppins-Bold.ttf'),
  join(here, 'assets', 'fonts', 'Poppins-Bold.ttf'),
  join(here, '..', 'src', 'assets', 'fonts', 'Poppins-Bold.ttf'),
];

const fontPath = candidates.find(existsSync);
if (fontPath) {
  GlobalFonts.registerFromPath(fontPath, 'WelcomeCard');
}

export const DEFAULT_FONT_FAMILY = 'WelcomeCard';
