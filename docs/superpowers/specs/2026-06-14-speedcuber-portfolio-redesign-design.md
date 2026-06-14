# Dorian Bellet — Speedcuber/Developer Portfolio v2

**Date:** 2026-06-14
**Status:** Design approved in conversation — awaiting written-spec review
**Owner:** Dorian Bellet (étudiant BUT Informatique, IUT d'Orsay · speedcuber)

---

## 1. Goal

Rebuild the existing single-file `index.html` portfolio into a complete, premium,
award-quality long-scroll site that:

- presents Dorian's full real content (profil, parcours, stack, projets, ambitions, contact),
- keeps the speedcuber/developer identity at the center (the hand-tuned Three.js cube
  is the signature),
- adds two flagship content features (a **speedcubing PB dashboard** and **STAR project
  case studies**),
- feels like a 2025/26 Site-of-the-Year: fluid, optimized, distinctive — not a generic
  dark "dev portfolio".

The current site is a beautiful but information-minimal two-view toggle. v2 becomes a
fully responsive long-scroll narrative.

---

## 2. Tech stack (decided)

**Vite + vanilla ES modules + Three.js + GSAP/ScrollTrigger + Lenis.**

- **No React/R3F.** Rationale: avoids rewriting the already-exquisite hand-tuned cube,
  and no framework/hydration ⇒ genuinely more fluid. Vite still produces optimized,
  code-split, minified static output deployable anywhere (Netlify/Vercel/Pages).
- **Lenis** — smooth scroll (the buttery feel every premium site of the year uses).
- **GSAP + ScrollTrigger** — scroll reveals tuned **fast & precise** (a speedcuber's
  identity), not floaty.
- **Three.js (r128 port)** — the existing cube engine is ported verbatim into a module.
- **Charts** — hand-drawn lightweight inline-SVG sparklines for PB progress. No chart lib.
- **Icons** — inline SVG. No icon font.
- **Fonts** — self-host via Google Fonts/Fontsource with `preconnect` + `display:swap`,
  subset to the glyphs used.

Environment confirmed: Node v22.22.1, npm 9.2.0.

### Progressive enhancement

All textual content is authored directly in semantic HTML (good for SEO, a11y, and
first paint). JavaScript only *enhances*: the cube, smooth scroll, scroll reveals,
scramble text, timer, lightbox, magnetic cursor. The site is fully readable with JS
disabled.

---

## 3. Art direction (decided): "Editorial light + dark cube bands"

A bone editorial canvas for content, with full-black immersive bands for the 3D cube and
solve video. Deliberately breaks the generic dark-dev-portfolio cliché and makes the
cinematic golden-hour photos sing.

### Palette

| Token            | Value     | Use                                            |
|------------------|-----------|------------------------------------------------|
| `--canvas`       | `#F4F1EA` | bone editorial background                      |
| `--ink`          | `#0B0B0B` | primary text                                   |
| `--ink-soft`     | `#3A3A38` | secondary text                                 |
| `--hair`         | `#0B0B0B` @ low alpha | hairline rules                     |
| `--dark`         | `#070707` | immersive cube/video bands                     |
| `--on-dark`      | `#F4F1EA` | text on dark bands                             |
| `--signature`    | `#E01818` | competition red — links, accents, active state |

**Cube-spectrum** (categorical accents only — tech tags, PB event colors, data-viz):
`R #E01818 · O #FF6A00 · W #F4F4F2 · Y #FFD200 · G #12B24A · B #1466DC`.
Red doubles as both the signature and the "R" face — intentional, ties brand to cube.

### Typography (tri-voice)

- **Editorial serif** — *Instrument Serif* — large statements / section intros (the
  "magazine" voice that breaks the dev cliché).
- **Grotesk** — *Space Grotesk* — headings, labels, nav, UI (geometric, technical; echoes
  cube geometry).
- **Mono** — *JetBrains Mono* — data, PB times (tabular), the `contact.sh` terminal, metadata,
  and the scramble→solve effect.

(All three are free webfonts. Final pairing is tunable during build, but this tri-voice is
the intended direction.)

### Layout language

Swiss grid, generous margins, baseline rhythm, hairline rules. Recurring motifs: the giant
**DB wordmark**, the **3×3 facelet grid** as section markers/bullets, section numbers `01—06`,
tabular-mono metadata.

### Motion

Lenis smooth scroll; GSAP ScrollTrigger reveals (fast, precise, staggered); cinematic
light→dark band transitions; cursor-reactive cube tilt + magnetic buttons; scramble→solve
text on key headings. Full `prefers-reduced-motion` fallback: no scramble, simple fades,
cube still auto-solves but calmer; no parallax.

---

## 4. Information architecture (long-scroll)

Top: sticky minimal nav (section list with **active-section tracking**), status pill
(`● Disponible · 20 avr → 10 juil 2026`), thin **scroll-progress** indicator, DB wordmark.

1. **Hero** — split: editorial type (name, role, one-line pitch, CTAs "Me contacter" /
   "↓ Télécharger le CV", status) on bone; the **live 3D cube** on an adjacent dark zone.
   **Cube is hero-scoped** (it does *not* follow the scroll as a fixed background — keeps
   perf high); its *motif* and spectrum recur downpage, and the Speedcube band uses the real
   `Solve.mp4` rather than the WebGL cube.
2. **01 — Profil** — présentation + coordonnées (adresse, email, tél, LinkedIn). Photo
   `IMG_…192136` (contemplative, mountain).
3. **Divider A** — full-bleed parallax photo `IMG_…194015` (golden-hour, holding cube) with
   a single big editorial line on precision/solving.
4. **02 — Parcours** — vertical dated timeline: BUT Informatique (2024–en cours) · Bac
   Général, Madagascar (2024) · **USTS internship — n8n automation, image & vidéo (current,
   TODO dates/detail)** · Stage recherché (20 avr→10 juil 2026) · Stage agricole, Granada
   (été 2025). Facelet markers.
5. **03 — Stack & compétences** — Langages (Python, Java, C++, HTML/CSS, SQL) · Outils
   (Linux, Git, GitHub, GitLab, VS Code, IntelliJ, MySQL, Docker, **n8n**) · Langues (FR C2,
   EN B1) · Soft skills. A "skill face" — a 3×3 cube-face grid motif for the headline skills.
6. **04 — Projets (STAR case studies)** — the 4 projects as a refined grid; each opens a
   smooth expand/detail panel with Situation · Tâche · Action · Résultat, date, cube-colored
   tech tags, and a GitHub link (URLs TODO):
   - Application de gestion TD/TP — Java, SQL, HTML/CSS, GitLab (déc. 2025)
   - Site web divertissement — HTML, CSS, Git (déc. 2024)
   - Jeu vidéo C++ — C++, Game dev (oct. 2024)
   - Jeu à roulette Python — Python (juil. 2023)
7. **Speedcube band (dark, flagship)** — PB dashboard: per-event cards (3×3, 2×2, OH,
   Pyraminx, Skewb) with **single / Ao5** in tabular mono, cube-color accent, and a tiny SVG
   sparkline (times + WCA ID are **placeholder TODO**); **Palmarès** strip for the 2 real
   wins (**Lille · juin 2025**, **Madrid · juil. 2025**); "7 ans" stat; competition photo
   `Z52_8504`; the **Solve.mp4** cinematic muted auto-loop. Spacebar WCA timer easter egg.
8. **Divider B** — full-bleed parallax photo `IMG_…194102` (sky, looking at cube) + big line.
9. **05 — Ambitions & centres d'intérêt** — vision timeline (court / moyen / long terme);
   interests: Rubik's cube (anchors to the Speedcube band), Développement, Piano.
10. **06 — Contact** — coordonnées + the animated `contact.sh` terminal block (mono,
    typewriter) + CV download (placeholder PDF) + LinkedIn.
11. **Footer** — Dorian Bellet · BUT Informatique · IUT Orsay · 2026 · LinkedIn.

---

## 5. Flagship features

### 5.1 Speedcubing PB dashboard
Event cards keyed by cube-spectrum color. Each card: event name, **single** PB, **Ao5**,
a 12-point SVG sparkline (session trend), and a small "evolution" delta. A **Palmarès**
row highlights the two real competition wins. A headline stat band: "7 ans de cube · 2
victoires". WCA profile link. **All numeric times + WCA ID are realistic placeholders,
clearly marked `TODO`** for Dorian to replace; the two wins and "7 ans" are real.

### 5.2 STAR project case studies
The project index becomes interactive cards. Click/expand → detail panel animating open
(GSAP), showing S/T/A/R, date, tech tags (cube-spectrum), GitHub link. Keyboard-accessible
(`<button>` toggles, `aria-expanded`), works without JS as plain expanded content.

---

## 6. Nice-to-haves (all four selected)

- **Scramble→solve text** — key headings shuffle (mono glyphs) like a scramble, then snap
  to the final word on reveal. Respects reduced-motion (renders final text immediately).
- **Spacebar WCA timer** — hold space → inspection countdown → release to start → space to
  stop, formatted like a real solve time. Lives in the Speedcube band; on-screen hint.
- **Cinematic Solve.mp4 + photo lightbox** — muted `loop autoplay playsinline` poster-backed
  video in the Speedcube band; click-to-zoom lightbox gallery for the photos (focus trap,
  Esc to close, arrow keys).
- **Cursor-reactive cube + magnetic buttons** — cube tilts subtly toward the cursor; CTAs /
  nav links have a magnetic pull. Disabled on touch + reduced-motion.

---

## 7. File / module structure

```
dweez/
  index.html               # semantic content + mount points
  vite.config.js
  package.json
  public/
    media/                 # optimized copies of the 4 images + Solve.mp4 (+ poster)
    cv/dorian-bellet-cv.pdf# placeholder TODO
    favicon.svg            # 3×3 facelet motif
    og.jpg                 # social share image
  src/
    main.js                # boot: Lenis + ScrollTrigger + wire modules
    styles/
      tokens.css           # palette, type scale, spacing
      base.css             # reset, typography, layout primitives
      sections.css         # per-section styles
    lib/
      cube.js              # ported Three.js cube (init + cursor reactivity)
      scroll.js            # Lenis + ScrollTrigger setup, reveals, parallax, nav tracking
      scramble.js          # scramble→solve text effect
      timer.js             # spacebar WCA timer
      magnetic.js          # magnetic buttons + cursor cube tilt
      lightbox.js          # photo lightbox
    data/
      pb.js                # PB dashboard data (placeholders) + palmarès (real)
```

Content lives in `index.html`; JS modules enhance designated mount points / `data-*` hooks.

---

## 8. Performance & quality bar

- Responsive **mobile-first**; cube uses lower pixel ratio on mobile, pauses when its
  section is offscreen (IntersectionObserver) to save battery.
- Images: Vite-hashed assets, responsive sizes + `webp`/`avif` where worth it, `loading=lazy`
  below the fold, explicit `width/height` to avoid CLS. Source `IMG_…192136` (1.2M) and
  `Z52_8504` (612K) get compressed/resized.
- Video: `preload="metadata"`, poster frame, muted autoplay loop, only the Speedcube band.
- Code-split heavy libs; defer non-critical JS.
- Semantic landmarks, focus-visible, skip-link, keyboard nav, `prefers-reduced-motion`.
- SEO: title/description, canonical, OpenGraph + Twitter card, `lang="fr"`, favicon.
- Target: Lighthouse ≥ 90 across the board on desktop; smooth 60fps scroll.

---

## 9. Placeholders to be replaced by Dorian (all marked `TODO` in code)

- PB times per event + WCA ID / profile URL.
- USTS internship dates + fuller description.
- CV PDF file.
- GitHub repo URLs for the 4 projects.

Real data used as-is: all provided copy (FR), the 2 competition wins, "7 ans", the 4 photos
+ Solve video.

---

## 10. Verification approach

This is a static visual site, so verification is behavioral, not unit-tested:

- `npm run build` succeeds; `npm run dev` / `vite preview` serves cleanly.
- Manual walk-through of every section at desktop + mobile widths.
- Reduced-motion check (no scramble/parallax; cube calm).
- Keyboard-only pass (nav, project expand, lightbox, timer hint, skip-link).
- Lighthouse run for perf/a11y/SEO.
- Screenshots of key sections for sign-off.

---

## 11. Out of scope (declined / deferred)

- Scroll-triggered "solve on scroll" (declined — cube auto-solves independently).
- Interactive drag-to-scramble cube playground (declined).
- React/R3F migration.
- A CMS / backend — content is static.
- Multi-language (site stays French).
