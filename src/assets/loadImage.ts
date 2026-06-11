import { loadImage, createCanvas, type Image } from '@napi-rs/canvas';

const MAX_CACHE = 256;

function boundedSet<K>(map: Map<K, Image>, key: K, value: Image): void {
  if (map.size >= MAX_CACHE) {
    map.delete(map.keys().next().value!);
  }
  map.set(key, value);
}

// Cache so GIF rendering (N frames) fetches each URL/Buffer only once.
const cache = new Map<string | Buffer, Image>();
const solidCache = new Map<string, Image>();

async function solidImage(color: string, w: number, h: number): Promise<Image> {
  const key = `${color}:${w}x${h}`;
  const hit = solidCache.get(key);
  if (hit) return hit;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  const img = await loadImage(canvas.toBuffer('image/png'));
  boundedSet(solidCache, key, img);
  return img;
}

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
    boundedSet(cache, source, img);
    return img;
  } catch {
    return solidImage(fallbackColor, w, h);
  }
}
