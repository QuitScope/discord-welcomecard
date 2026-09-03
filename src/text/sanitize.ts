// Discord usernames often use pseudo-fonts (𝙈𝙖𝙧𝙡𝙤𝙬), ornaments (☙) and emoji
// that the bundled Poppins font has no glyphs for, so they render as tofu boxes.
// sanitizeText folds those down to letters the font can actually draw.

// Symbols kept because they read fine and show up in real handles.
const ALLOWED_SYMBOLS = new Set([
  '+', '-', '=', '<', '>', '~', '$', '#', '%', '&', '@', '*', '/', '\\', '^', '|', '_',
]);

// Emoji, regional-indicator pairs, ZWJ + control/format chars (\p{Cf} covers ZWJ;
// variation selectors are \p{M} and get dropped by the zalgo pass below).
const PICTOGRAPHIC =
  /[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Cc}\p{Cf}]/gu;

/**
 * Fold fancy Unicode in a display string down to what the card font can render:
 * NFKC/NFC normalization, then strip emoji/pictographs, then drop symbols outside
 * a small whitelist, then flatten zalgo to one combining mark per base character.
 * Returns the trimmed original if sanitizing would leave nothing.
 */
export function sanitizeText(input: string): string {
  const original = input.trim();

  let s = input.normalize('NFKC').normalize('NFC');
  s = s.replace(PICTOGRAPHIC, '');
  s = [...s].filter((ch) => !/\p{S}/u.test(ch) || ALLOWED_SYMBOLS.has(ch)).join('');

  let out = '';
  let marks = 0;
  for (const ch of s) {
    if (/\p{M}/u.test(ch)) {
      if (marks < 1) {
        out += ch;
        marks++;
      }
    } else {
      out += ch;
      marks = 0;
    }
  }

  out = out.replace(/\s+/g, ' ').trim();
  return out === '' ? original : out;
}
