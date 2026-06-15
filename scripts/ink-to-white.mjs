// Asset pipeline: recolor source ink/watercolor art into white-on-transparent
// PNG + WebP for the decorative backdrop. Run with `npm run ink:process`.
// Sources live in ink-src/ (git-ignored); outputs in public/media/ink/.
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { inkAlpha } from './ink-pixels.mjs';

const root = resolve(import.meta.dirname, '..');
const srcDir = resolve(root, 'ink-src');
const out = resolve(root, 'public/media/ink');
mkdirSync(out, { recursive: true });

// source file -> output name + tuned floor/gain (tuned during brainstorming)
const jobs = [
  { src: 'dragon-smoke.png', name: 'dragon-smoke', floor: 62, gain: 1.5 },
  { src: 'clouds.jpg',       name: 'clouds',       floor: 18, gain: 1.9 },
  { src: 'bamboo.jpg',       name: 'bamboo',       floor: 18, gain: 1.9 },
  { src: 'flower.jpg',       name: 'flower',       floor: 18, gain: 1.9 },
  { src: 'smoke.jpg',        name: 'smoke',        floor: 60, gain: 1.5 },
  { src: 'inkwave.jpg',      name: 'inkwave',      floor: 60, gain: 1.6 },
  { src: 'swirl.jpg',        name: 'swirl',        floor: 60, gain: 1.6 },
];

for (const job of jobs) {
  const src = resolve(srcDir, job.src);
  if (!existsSync(src)) { console.warn('skip (missing):', job.src); continue; }
  const { data, info } = await sharp(src)
    .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
    .ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const buf = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels], g = data[i * channels + 1],
          b = data[i * channels + 2], oa = data[i * channels + 3];
    buf[i * 4] = 244; buf[i * 4 + 1] = 242; buf[i * 4 + 2] = 236; // --c-w #f4f2ec
    buf[i * 4 + 3] = inkAlpha(r, g, b, oa, job);
  }
  const base = sharp(buf, { raw: { width, height, channels: 4 } });
  await base.clone().png({ compressionLevel: 9 }).toFile(resolve(out, `${job.name}.png`));
  await base.clone().webp({ quality: 82, alphaQuality: 90 }).toFile(resolve(out, `${job.name}.webp`));
  console.log('wrote', job.name, '(png + webp)');
}
