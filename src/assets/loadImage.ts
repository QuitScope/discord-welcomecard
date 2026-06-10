import { loadImage, createCanvas, type Image } from '@napi-rs/canvas';

async function solidImage(color: string, w: number, h: number): Promise<Image> {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  return loadImage(canvas.toBuffer('image/png'));
}

// Cache so GIF rendering (N frames) fetches each URL/Buffer only once.
const cache = new Map<string | Buffer, Image>();

export async function loadImageOrFallback(
  source: string | Buffer | undefined,
  fallbackColor: string,
  w = 256,
  h = 256,
): Promise<Image> {
  if (source === undefined) return solidImage(fallbackColor, w, h);
  const hit = cache.get(source);
  if (hit) return hit;
  try {
    const img = await loadImage(source);
    cache.set(source, img);
    return img;
  } catch {
    return solidImage(fallbackColor, w, h);
  }
}
