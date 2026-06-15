# Portfolio — Dorian Bellet

Personal portfolio for **Dorian Bellet** — student developer (BUT Informatique,
IUT d'Orsay) and speedcuber. A single-page site with a "Kinetic Solve" dark
theme: an interactive Three.js cube, smooth scrolling, scroll-driven reveals,
a live solve timer, and a faint Chinese-ink backdrop.

**Live:** https://dorianspeedcubing.github.io/portfolio/

Built by **Jimmy ([wFuxi66](https://github.com/wFuxi66))** for Dorian Bellet.

## Tech stack

- Vanilla JavaScript + [Vite](https://vitejs.dev/)
- [GSAP](https://gsap.com/) + ScrollTrigger (animation / parallax)
- [Lenis](https://lenis.darkroom.engineering/) (smooth scroll)
- [Three.js](https://threejs.org/) (hero cube)
- [Vitest](https://vitest.dev/) (unit tests)
- [sharp](https://sharp.pixelplumbing.com/) (build-time image pipeline)

## Development

```bash
npm install
npm run dev        # local dev server
npm test           # run the unit tests
npm run build      # production build to dist/
npm run preview    # serve the built site locally
```

### Build-time asset scripts

```bash
npm run optimize:media   # compress source media
npm run ink:process      # recolor ink art to white-on-transparent (see scripts/)
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes `dist/` to GitHub Pages (Pages source must be set to
"GitHub Actions").

## License

Source code: [MIT](./LICENSE) © Jimmy (wFuxi66).

The personal content (texts, photos, video, CV, name, branding of Dorian
Bellet) is © Dorian Bellet, all rights reserved. The decorative ink images
under `public/media/ink/` come from third-party stock sources — see
[`public/media/ink/CREDITS.md`](./public/media/ink/CREDITS.md).
