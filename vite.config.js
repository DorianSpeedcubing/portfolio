import { defineConfig } from 'vite';

// Static portfolio. base './' keeps the build portable to any static host
// (Netlify, Vercel, GitHub Pages subpaths, plain file server).
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 900,
  },
});
