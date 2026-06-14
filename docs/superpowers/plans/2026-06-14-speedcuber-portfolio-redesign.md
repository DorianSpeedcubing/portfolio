# Speedcuber Portfolio v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rebuild Dorian Bellet's single-file portfolio into a premium, responsive,
editorial long-scroll site (Vite + Three.js + GSAP + Lenis) with a speedcubing PB
dashboard and STAR project case studies.

**Architecture:** Static content authored in semantic `index.html`; JS modules in `src/lib`
progressively enhance (cube, smooth scroll, reveals, scramble, timer, lightbox, magnetic).
Vite bundles to optimized static output. Art direction: editorial bone canvas + dark cube
bands. See spec: `docs/superpowers/specs/2026-06-14-speedcuber-portfolio-redesign-design.md`.

**Tech Stack:** Vite, Three.js (r128 port), GSAP + ScrollTrigger, Lenis, vanilla ES modules,
inline-SVG sparklines.

**Verification model:** Each task ends with a build/serve + visual check + commit. Pure-logic
modules (timer, scramble) get Vitest unit tests.

---

## File structure

```
dweez/
  index.html                 # all content + mount points
  vite.config.js
  package.json
  .gitignore
  public/media/              # optimized images + Solve.mp4 + poster
  public/cv/                 # placeholder CV (TODO)
  public/favicon.svg
  src/main.js                # boot: import styles, init modules
  src/styles/tokens.css      # palette, type scale, spacing
  src/styles/base.css        # reset, typography, layout primitives
  src/styles/sections.css    # per-section styles
  src/lib/cube.js            # ported Three.js cube + cursor reactivity
  src/lib/scroll.js          # Lenis + ScrollTrigger, reveals, parallax, nav tracking
  src/lib/scramble.js        # scramble→solve text effect (+ test)
  src/lib/timer.js           # spacebar WCA timer (+ test)
  src/lib/magnetic.js        # magnetic buttons + cursor cube tilt
  src/lib/lightbox.js        # photo lightbox
  src/data/pb.js             # PB dashboard data (placeholder) + palmarès (real) + sparkline util
```

---

## Phase 0 — Scaffold & tooling

### Task 0.1: Git + project init
- [ ] `git init`; create `.gitignore` (`node_modules`, `dist`, `.DS_Store`, `*.local`).
- [ ] `npm init -y`; install: `npm i three@0.128 gsap lenis` and `npm i -D vite vitest`.
- [ ] Add scripts to `package.json`: `"dev":"vite"`, `"build":"vite build"`, `"preview":"vite preview"`, `"test":"vitest run"`.
- [ ] Create `vite.config.js` (root `.`, base `./` for portable static hosting).
- [ ] Commit: `chore: scaffold vite project`.

### Task 0.2: Media assets
- [ ] Create `public/media/`; copy the 4 images + `Solve.mp4` in. Resize/compress: `IMG_20260509_192136.jpg` (1.2M) and `Z52_8504.jpg` (612K) to max 2000px, quality ~80. Keep originals out of bundle.
- [ ] Generate a poster frame from `Solve.mp4` → `public/media/solve-poster.jpg` (ffmpeg first-frame; if ffmpeg absent, use a still).
- [ ] Rename to web-friendly: `hero-golden.jpg` (194015), `sky-cube.jpg` (194102), `vista.jpg` (192136), `comp.jpg` (Z52), `solve.mp4`, `solve-poster.jpg`.
- [ ] Placeholder `public/cv/dorian-bellet-cv.pdf` (tiny placeholder, TODO note).
- [ ] Commit: `chore: add optimized media assets`.

### Task 0.3: Design tokens + base styles + boot
- [ ] `src/styles/tokens.css`: CSS vars — palette from spec (`--canvas #F4F1EA`, `--ink #0B0B0B`, `--ink-soft #3A3A38`, `--dark #070707`, `--on-dark #F4F1EA`, `--signature #E01818`, cube spectrum `--c-r/--c-o/--c-w/--c-y/--c-g/--c-b`), fluid type scale (clamp-based), spacing scale, max-width, easing vars.
- [ ] Fonts: `@import` Google Fonts (Instrument Serif, Space Grotesk, JetBrains Mono) with `preconnect` in `index.html`; font-family vars `--font-serif/--font-grotesk/--font-mono`.
- [ ] `src/styles/base.css`: reset, `html{scroll-behavior:auto}` (Lenis owns scroll), body bg `--canvas` color `--ink`, font smoothing, `.container` grid, hairline rule helper, `.section`, section-number label style, `.sr-only`, skip-link, `:focus-visible` ring (signature), `prefers-reduced-motion` block.
- [ ] `src/styles/sections.css`: empty stub for now.
- [ ] `src/main.js`: `import './styles/tokens.css'; import './styles/base.css'; import './styles/sections.css';` and a DOMContentLoaded boot stub.
- [ ] `index.html`: semantic skeleton — `<head>` meta (title, description, lang=fr, viewport, OG/Twitter, theme-color, favicon), `<body>` with skip-link, `<header>` nav placeholder, `<main>` empty, `<script type="module" src="/src/main.js">`.
- [ ] **Verify:** `npm run dev` → styled bone page, fonts load, no console errors.
- [ ] Commit: `feat: design tokens, base styles, html skeleton`.

---

## Phase 1 — Cube (ported, hero-scoped, cursor-reactive)

### Task 1.1: Port cube to module
**Files:** Create `src/lib/cube.js`; modify `index.html` (hero canvas), `src/main.js`.
- [ ] Move the existing Three.js cube logic (lines 391–630 of old `index.html`) into `export function initCube(canvas, { dark = true } = {})`. Keep: stickerless MoYu materials, scramble→solve loop, studio env, lighting. Drop the project-hover `setHighlight` highlight coupling (return a small API instead).
- [ ] Add **cursor reactivity:** track normalized pointer; in `animate`, ease `cubeGroup.rotation` target toward a small offset (`±0.18 rad`) based on pointer; keep the idle tumble. Expose `api = { setPointer(x,y), pause(), resume() }`. Disable pointer effect when `matchMedia('(pointer: coarse)')` or reduced-motion.
- [ ] IntersectionObserver: `pause()` when hero canvas offscreen, `resume()` when visible (battery/perf).
- [ ] Use `import * as THREE from 'three'` (bundled, not CDN).
- [ ] In `main.js`, init on `#cube` canvas.
- [ ] **Verify:** cube renders on dark hero zone, auto-solves, tilts toward cursor, pauses offscreen.
- [ ] Commit: `feat(cube): port three.js cube to module with cursor reactivity`.

---

## Phase 2 — Layout shell, nav, smooth scroll

### Task 2.1: Smooth scroll + scroll utilities
**Files:** Create `src/lib/scroll.js`; modify `src/main.js`.
- [ ] `initScroll()`: create Lenis, RAF loop, register `gsap.registerPlugin(ScrollTrigger)`, wire `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker` → `lenis.raf`.
- [ ] Export `reveal(selector, opts)` — GSAP from `{y:24, opacity:0}` staggered, fast (`duration:0.55, ease:'power3.out'`), `ScrollTrigger start:'top 82%'`. Skip entirely under reduced-motion (set final state).
- [ ] Export `parallax(selector)` — `yPercent` shift on scroll for `.divider img`.
- [ ] Export `initNav()` — anchor clicks → `lenis.scrollTo`; ScrollTrigger per section to toggle `.is-active` on matching nav link; update `--progress` on a top scroll bar.
- [ ] **Verify:** smooth scroll, nav active state tracks sections, progress bar fills.
- [ ] Commit: `feat(scroll): lenis smooth scroll, reveals, nav tracking`.

### Task 2.2: Header / nav / chrome markup + styles
**Files:** modify `index.html`, `src/styles/sections.css`.
- [ ] Sticky `<header>`: DB wordmark mark (small), nav links (`Profil · Parcours · Stack · Projets · Speedcube · Ambitions · Contact`), status pill (`● Disponible · 20 avr → 10 juil 2026`), top scroll-progress bar element.
- [ ] Responsive: nav collapses to a compact menu under ~720px.
- [ ] **Verify:** header sticky, responsive, active tracking works end-to-end.
- [ ] Commit: `feat(nav): sticky header, status pill, progress bar`.

---

## Phase 3 — Hero

### Task 3.1: Hero section
**Files:** modify `index.html`, `src/styles/sections.css`.
- [ ] Split hero: left editorial column on bone — eyebrow (`Portfolio · 2026`), big serif/grotesk display "Dorian Bellet", role line "Développeur · Speedcuber", one-line pitch (from content), CTAs `Me contacter` (signature) + `↓ Télécharger le CV`, status. Right/overlay: dark zone with `<canvas id="cube">`.
- [ ] Giant faint `DB` wordmark backdrop motif.
- [ ] Magnetic class hooks on CTAs (wired Phase 7).
- [ ] **Verify:** hero composition correct desktop + mobile (stacks; cube above/below type).
- [ ] Commit: `feat(hero): editorial split hero with live cube`.

---

## Phase 4 — Content sections (light)

> Content source = the user-provided FR copy (verbatim). Each task: markup + styles + GSAP reveal + visual check + commit.

### Task 4.1: 01 — Profil
- [ ] Section `01 — profil`: présentation paragraph(s), Coordonnées block (Adresse 21 rue André Maginot Orsay; Email; Téléphone; LinkedIn). Photo `vista.jpg` framed.
- [ ] Reveal + commit: `feat(profil): presentation + coordonnees`.

### Task 4.2: Divider A (parallax photo)
- [ ] Full-bleed `hero-golden.jpg` with parallax + one big editorial line about precision/solving.
- [ ] Commit: `feat: parallax photo divider A`.

### Task 4.3: 02 — Parcours (timeline)
- [ ] Vertical dated timeline with facelet markers. Entries: BUT Informatique (2024—en cours), Bac Général — Lycée Peter Pan, Madagascar (2024, mention Bien), **Stagiaire — USTS · automatisation n8n (image & vidéo)** `current` [TODO dates/detail], Stage recherché (20 avr→10 juil 2026), Stage agricole — Granada (été 2025).
- [ ] Reveal + commit: `feat(parcours): formation & experiences timeline`.

### Task 4.4: 03 — Stack & compétences
- [ ] Groups: Langages (Python, Java, C++, HTML/CSS, SQL); Outils (Linux, Git, GitHub, GitLab, VS Code, IntelliJ, MySQL, Docker, n8n); Langues (FR C2, EN B1); Soft skills (Motivé, Organisé, Adaptabilité, Travail collaboratif). A 3×3 "skill face" cube-grid motif for headline skills, spectrum-colored.
- [ ] Reveal + commit: `feat(stack): competences with cube-face motif`.

### Task 4.5: 05 — Ambitions & centres d'intérêt
- [ ] Vision timeline (court 0–1 an / moyen 1–3 ans / long 3 ans+). Interests: Rubik's cube (anchor link → Speedcube band), Développement, Piano.
- [ ] Reveal + commit: `feat(ambitions): vision + interests`.

### Task 4.6: 06 — Contact + footer
- [ ] Coordonnées; animated `contact.sh` terminal block (mono, typewriter on reveal) with the provided `stage.txt` content; CV download (placeholder); LinkedIn. Footer: Dorian Bellet · BUT Informatique · IUT Orsay · 2026 · LinkedIn.
- [ ] Reveal + commit: `feat(contact): contact section + terminal + footer`.

---

## Phase 5 — Projets (STAR case studies)

### Task 5.1: Expandable project cards
**Files:** modify `index.html`, `src/styles/sections.css`, `src/main.js`.
- [ ] 4 project cards (`<article>` + `<button aria-expanded>`): TD/TP (Java, SQL, HTML/CSS, GitLab · déc. 2025), Site divertissement (HTML, CSS, Git · déc. 2024), Jeu C++ (C++, Game dev · oct. 2024), Roulette Python (Python · juil. 2023). Each detail panel: Situation/Tâche/Action/Résultat (verbatim copy), cube-colored tags, GitHub link [TODO url].
- [ ] JS toggle: `aria-expanded`, GSAP height/opacity expand; no-JS = open.
- [ ] **Verify:** expand/collapse works, keyboard accessible.
- [ ] Commit: `feat(projets): STAR case-study cards`.

---

## Phase 6 — Speedcube band (flagship, dark)

### Task 6.1: PB data + sparkline util
**Files:** Create `src/data/pb.js`.
- [ ] Export `EVENTS` array: `{event:'3×3', color:'--c-r', single:'TODO', ao5:'TODO', trend:[...12 placeholder ms]}` for 3×3, 2×2, OH, Pyraminx, Skewb (all times TODO placeholders).
- [ ] Export `PALMARES`: `[{title:'Compétition de Lille', date:'Juin 2025'}, {title:'Compétition de Madrid', date:'Juillet 2025'}]` (real).
- [ ] Export `sparklinePath(values, w, h)` — returns SVG polyline points string. (Unit-tested in 7.x.)
- [ ] Commit: `feat(data): pb events, palmares, sparkline util`.

### Task 6.2: Speedcube band UI
**Files:** modify `index.html`, `src/styles/sections.css`, `src/main.js`.
- [ ] Dark band: heading (scramble target), stat row ("7 ans de cube · 2 victoires"), event cards grid (each: event, spectrum bar, single/Ao5 in mono tabular, inline SVG sparkline), Palmarès strip, WCA profile link [TODO], `comp.jpg` photo, `solve.mp4` muted `loop autoplay playsinline` + poster.
- [ ] Render cards from `pb.js`.
- [ ] **Verify:** band renders dark, video loops, sparklines draw.
- [ ] Commit: `feat(speedcube): PB dashboard band with video`.

---

## Phase 7 — Nice-to-haves (+ unit tests)

### Task 7.1: Scramble→solve text (TDD)
**Files:** Create `src/lib/scramble.js`, `src/lib/scramble.test.js`.
- [ ] Test: `scrambleText('SOLVE', 0)` returns original; a mid-progress frame has same length; final frame equals target. Test reduced-motion path returns final immediately.
- [ ] Implement `scramble(el, {chars, duration})` using rAF, revealing chars left→right while scrambling the rest with mono glyph set; ScrollTrigger-triggered. Reduced-motion → set final text.
- [ ] Run `npm test` (pass). Apply to hero name + section headings.
- [ ] Commit: `feat(scramble): scramble-to-solve text effect`.

### Task 7.2: Spacebar WCA timer (TDD)
**Files:** Create `src/lib/timer.js`, `src/lib/timer.test.js`.
- [ ] Test `formatTime(ms)`: `formatTime(6420)==='6.42'`, `formatTime(72530)==='1:12.53'`, `formatTime(0)==='0.00'`.
- [ ] Implement state machine: idle → (hold space) inspecting (15s countdown) → ready (release) running → (space) stopped; renders into Speedcube band timer element; on-screen hint "Maintenez Espace". Ignore when focus in input. Reduced-motion still works (no flashing).
- [ ] Run `npm test` (pass).
- [ ] **Verify:** hold/release/stop produces a formatted time.
- [ ] Commit: `feat(timer): spacebar WCA solve timer`.

### Task 7.3: Photo lightbox
**Files:** Create `src/lib/lightbox.js`.
- [ ] Click `[data-lightbox]` images → overlay (focus trap, Esc close, ←/→ navigate, backdrop click). GSAP fade/scale.
- [ ] Wire to `vista.jpg`, `hero-golden.jpg`, `sky-cube.jpg`, `comp.jpg`.
- [ ] **Verify:** open/close/navigate, keyboard.
- [ ] Commit: `feat(lightbox): photo gallery lightbox`.

### Task 7.4: Magnetic buttons + cursor cube tilt
**Files:** Create `src/lib/magnetic.js`; modify `main.js`.
- [ ] `magnetic('[data-magnetic]')` — translate element toward cursor within radius, spring back on leave (GSAP quickTo). Disable on touch/reduced-motion.
- [ ] Feed global pointer to `cube.api.setPointer`.
- [ ] **Verify:** CTAs pull toward cursor; cube tilts with pointer.
- [ ] Commit: `feat(magnetic): magnetic buttons + cursor-reactive cube`.

---

## Phase 8 — Responsive, a11y, perf, SEO, final polish

### Task 8.1: Responsive + reduced-motion pass
- [ ] Audit each section ≤720px and ≤480px: hero stacks, timeline single-column, PB cards wrap, nav compact, dividers shorter. Cube: cap `devicePixelRatio` to 1.5 and reduce geometry segments on small screens.
- [ ] Verify `prefers-reduced-motion`: no scramble/parallax/magnetic; cube calm; all content reachable.
- [ ] Commit: `style: responsive + reduced-motion polish`.

### Task 8.2: SEO, favicon, OG, perf
- [ ] `favicon.svg` (3×3 facelet motif, spectrum). `public/media/og.jpg` (use `hero-golden.jpg` crop). Fill OG/Twitter meta. `theme-color`.
- [ ] `loading="lazy"` + width/height on below-fold media; video `preload="metadata"`.
- [ ] `npm run build`; `npm run preview`; run Lighthouse — address obvious wins; target ≥90 perf/a11y/best-practices/SEO desktop.
- [ ] Commit: `chore: seo, favicon, og, perf pass`.

### Task 8.3: Final verification + cleanup
- [ ] Remove the old monolithic root `index.html` content fully superseded (the new one is authoritative). Ensure original media files (root-level `IMG_*`, `Z52_*`, `Solve.mp4`) are moved (not duplicated) and root is clean.
- [ ] Full walkthrough; fix stragglers. Commit: `chore: final cleanup`.

---

## Self-review notes
- **Spec coverage:** stack ✓(0,1,2), art direction/tokens ✓(0.3), all sections ✓(3,4,5,6), PB dashboard ✓(6), STAR ✓(5), 4 nice-to-haves ✓(7), responsive/a11y/SEO/perf ✓(8), placeholders catalogued (USTS, PB times, WCA, CV, GitHub urls) ✓.
- **Naming consistency:** `cube.api.setPointer`, `reveal`, `parallax`, `initNav`, `formatTime`, `sparklinePath`, `scramble`, `magnetic` — referenced consistently.
- **Progressive enhancement:** content in HTML, JS enhances; no-JS fallbacks for cube (static dark zone), projects (open), terminal (static), scramble (final text).
