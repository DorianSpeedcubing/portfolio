// One-off asset pipeline: optimize source photos into public/media as webp + jpg.
// Re-run with `npm run optimize:media` whenever new source photos are added.
import sharp from 'sharp';
import { existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcDir = resolve(root, 'media-src');
const out = resolve(root, 'public/media');
mkdirSync(out, { recursive: true });

// source -> { name, maxW } (heights derive from aspect)
const jobs = [
  { src: 'IMG_20260509_194015.jpg', name: 'hero-golden', maxW: 1500 },
  { src: 'IMG_20260509_194102.jpg', name: 'sky-cube', maxW: 1700 },
  { src: 'IMG_20260509_192136.jpg', name: 'vista', maxW: 1500 },
  { src: 'Z52_8504.jpg', name: 'comp', maxW: 1900 },
];

for (const job of jobs) {
  const src = resolve(srcDir, job.src);
  if (!existsSync(src)) { console.warn('skip (missing):', job.src); continue; }
  const base = sharp(src).rotate().resize({ width: job.maxW, withoutEnlargement: true });
  await base.clone().webp({ quality: 80 }).toFile(resolve(out, `${job.name}.webp`));
  await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(resolve(out, `${job.name}.jpg`));
  console.log('wrote', job.name, '(webp + jpg)');
}

// Social share image (OG) — 1200x630 crop of the golden-hour hero.
await sharp(resolve(srcDir, 'IMG_20260509_194015.jpg'))
  .rotate()
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(resolve(out, 'og.jpg'));
console.log('wrote og.jpg');

// Video: copy through (no transcode tool available). comp.jpg doubles as poster.
const vid = resolve(srcDir, 'Solve.mp4');
if (existsSync(vid)) { copyFileSync(vid, resolve(out, 'solve.mp4')); console.log('copied solve.mp4'); }
