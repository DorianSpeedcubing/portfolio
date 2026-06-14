import * as THREE from 'three';

/**
 * MoYu-style stickerless speedcube. Continuously tumbles AND speed-solves
 * (scramble -> inspect -> solve loop) with bursty, human-like timing.
 * Hero-scoped: sized to its canvas, cursor-reactive tilt, pauses offscreen.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {{ setPointer(x:number,y:number):void, pause():void, resume():void, dispose():void }}
 */
export function initCube(canvas) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  const rect = () => canvas.getBoundingClientRect();
  let w = rect().width || canvas.clientWidth || 600;
  let h = rect().height || canvas.clientHeight || 600;

  const BASE_Z = 8.4;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0, BASE_Z);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
  renderer.setSize(w, h, false);
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Soft studio environment for glossy reflections.
  const ec = document.createElement('canvas'); ec.width = 16; ec.height = 64;
  const eg = ec.getContext('2d');
  const grd = eg.createLinearGradient(0, 0, 0, 64);
  grd.addColorStop(0, '#5a5a5a'); grd.addColorStop(0.45, '#1c1c1c'); grd.addColorStop(1, '#000000');
  eg.fillStyle = grd; eg.fillRect(0, 0, 16, 64);
  const envTex = new THREE.CanvasTexture(ec); envTex.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer); pmrem.compileEquirectangularShader();
  scene.environment = pmrem.fromEquirectangular(envTex).texture;

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(6, 9, 8); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.42); fill.position.set(-6, 2, 5); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.55); rim.position.set(-4, -5, -6); scene.add(rim);

  // tiltGroup carries cursor-reactive tilt; cubeGroup carries the idle tumble.
  const tiltGroup = new THREE.Group();
  scene.add(tiltGroup);
  const cubeGroup = new THREE.Group();
  cubeGroup.rotation.set(-0.42, -0.6, 0);
  tiltGroup.add(cubeGroup);
  const pivot = new THREE.Group();
  cubeGroup.add(pivot);

  const C = { R: 0xff3b46, O: 0xff8a1e, W: 0xf4f2ec, Y: 0xffd23f, G: 0x25e08a, B: 0x4d7bff, K: 0x0c0c12 };
  const size = 1, gap = 0.05, step = size + gap;
  const cubies = [];

  const roundedRect = (wd, rad) => {
    const s = new THREE.Shape();
    const x = -wd / 2, y = -wd / 2;
    s.moveTo(x + rad, y);
    s.lineTo(x + wd - rad, y); s.quadraticCurveTo(x + wd, y, x + wd, y + rad);
    s.lineTo(x + wd, y + wd - rad); s.quadraticCurveTo(x + wd, y + wd, x + wd - rad, y + wd);
    s.lineTo(x + rad, y + wd); s.quadraticCurveTo(x, y + wd, x, y + wd - rad);
    s.lineTo(x, y + rad); s.quadraticCurveTo(x, y, x + rad, y);
    return s;
  };
  const tileGeo = new THREE.ExtrudeGeometry(roundedRect(0.9, 0.17), {
    depth: 0.04, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4, steps: 1, curveSegments: 10,
  });
  tileGeo.translate(0, 0, -0.04);

  const stk = (cubie, axis, sign, color) => {
    const m = new THREE.MeshPhysicalMaterial({
      color, roughness: 0.3, metalness: 0.0, clearcoat: 0.9, clearcoatRoughness: 0.22, envMapIntensity: 1.0,
    });
    const mesh = new THREE.Mesh(tileGeo, m);
    const off = size / 2;
    if (axis === 'x') { mesh.position.x = sign * off; mesh.rotation.y = sign > 0 ? Math.PI / 2 : -Math.PI / 2; }
    if (axis === 'y') { mesh.position.y = sign * off; mesh.rotation.x = sign > 0 ? -Math.PI / 2 : Math.PI / 2; }
    if (axis === 'z') { mesh.position.z = sign * off; if (sign < 0) mesh.rotation.y = Math.PI; }
    cubie.add(mesh);
  };

  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    const cubie = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: C.K, roughness: 0.62, metalness: 0.12 });
    cubie.add(new THREE.Mesh(new THREE.BoxGeometry(size, size, size), bodyMat));
    if (x === 1) stk(cubie, 'x', 1, C.R);
    if (x === -1) stk(cubie, 'x', -1, C.O);
    if (y === 1) stk(cubie, 'y', 1, C.W);
    if (y === -1) stk(cubie, 'y', -1, C.Y);
    if (z === 1) stk(cubie, 'z', 1, C.G);
    if (z === -1) stk(cubie, 'z', -1, C.B);
    cubie.position.set(x * step, y * step, z * step);
    cubie.userData.logical = { x, y, z };
    cubeGroup.add(cubie);
    cubies.push(cubie);
  }

  // --- Move engine ---
  const AX = ['x', 'y', 'z'];
  const rnd = (a) => a[Math.floor(Math.random() * a.length)];
  const randomMove = () => ({ axis: rnd(AX), layer: rnd([-1, 1]), dir: rnd([1, -1]) });
  const inv = (m) => ({ axis: m.axis, layer: m.layer, dir: -m.dir });

  const speedProfiles = [
    { base: 52, jitter: 26, lookChance: 0.05, lookMin: 110, lookMax: 230 },
    { base: 84, jitter: 36, lookChance: 0.09, lookMin: 150, lookMax: 340 },
    { base: 150, jitter: 72, lookChance: 0.13, lookMin: 200, lookMax: 460 },
  ];

  let queue = [];
  const buildCycle = () => {
    const items = [];
    const sLen = 16 + Math.floor(Math.random() * 9);
    const scramble = [];
    for (let i = 0; i < sLen; i++) { const m = randomMove(); m.dur = 58 + Math.random() * 42; scramble.push(m); items.push(m); }
    items.push({ pause: 500 + Math.random() * 1000 });
    const prof = speedProfiles[Math.floor(Math.random() * speedProfiles.length)];
    scramble.slice().reverse().map(inv).forEach((m) => {
      m.dur = prof.base + Math.random() * prof.jitter;
      items.push(m);
      if (Math.random() < prof.lookChance) items.push({ pause: prof.lookMin + Math.random() * (prof.lookMax - prof.lookMin) });
    });
    items.push({ pause: 1300 + Math.random() * 2200 });
    queue = items;
  };

  let current = null;
  let vt = 0, waitVt = 700;
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const startMove = (m) => {
    pivot.rotation.set(0, 0, 0);
    pivot.position.set(0, 0, 0);
    cubeGroup.updateMatrixWorld(true);
    const sel = cubies.filter((c) => Math.round(c.userData.logical[m.axis]) === m.layer);
    sel.forEach((c) => pivot.attach(c));
    current = { m, sel, target: m.dir * Math.PI / 2, start: vt, dur: m.dur };
  };

  const finishMove = () => {
    const { m, sel, target } = current;
    pivot.rotation[m.axis] = target;
    pivot.updateMatrixWorld(true);
    const a = m.dir * Math.PI / 2;
    const cos = Math.round(Math.cos(a)), sin = Math.round(Math.sin(a));
    sel.forEach((c) => {
      cubeGroup.attach(c);
      let { x: lx, y: ly, z: lz } = c.userData.logical;
      if (m.axis === 'x') { const ny = ly * cos - lz * sin, nz = ly * sin + lz * cos; ly = ny; lz = nz; }
      if (m.axis === 'y') { const nx = lx * cos + lz * sin, nz2 = -lx * sin + lz * cos; lx = nx; lz = nz2; }
      if (m.axis === 'z') { const nx2 = lx * cos - ly * sin, ny2 = lx * sin + ly * cos; lx = nx2; ly = ny2; }
      lx = Math.round(lx); ly = Math.round(ly); lz = Math.round(lz);
      c.userData.logical = { x: lx, y: ly, z: lz };
      c.position.set(lx * step, ly * step, lz * step);
    });
    pivot.rotation.set(0, 0, 0);
    current = null;
    waitVt = vt + 4;
  };

  const advance = () => {
    if (queue.length === 0) buildCycle();
    const item = queue.shift();
    if (item.pause) { waitVt = vt + item.pause; return; }
    startMove(item);
  };

  // --- Cursor-reactive tilt ---
  let tiltTX = 0, tiltTY = 0;

  // --- Loop / lifecycle ---
  let running = true;
  let last = performance.now();
  let raf = 0;

  const animate = () => {
    raf = requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min(now - last, 50); last = now;
    if (!running) return;

    vt += dt;
    cubeGroup.rotation.x += 0.00010 * dt;
    cubeGroup.rotation.y += 0.00021 * dt;

    tiltGroup.rotation.x += (tiltTY - tiltGroup.rotation.x) * 0.06;
    tiltGroup.rotation.y += (tiltTX - tiltGroup.rotation.y) * 0.06;

    if (current) {
      const t = Math.min(1, (vt - current.start) / current.dur);
      pivot.rotation[current.m.axis] = current.target * easeInOut(t);
      if (t >= 1) finishMove();
    } else if (vt >= waitVt) {
      advance();
    }
    renderer.render(scene, camera);
  };
  animate();
  requestAnimationFrame(() => canvas.classList.add('is-ready'));

  const onResize = () => {
    const r = rect();
    w = r.width || canvas.clientWidth; h = r.height || canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize, { passive: true });
  // ResizeObserver catches the initial layout (CSS-injection timing) + container resizes.
  const ro = new ResizeObserver(onResize);
  ro.observe(canvas);

  // Pause when the cube scrolls offscreen (battery / perf).
  const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; last = performance.now(); }, { threshold: 0.01 });
  io.observe(canvas);

  return {
    setPointer(x, y) {
      if (reduced || coarse) return;
      tiltTX = x * 0.22;   // yaw from horizontal pointer
      tiltTY = y * 0.16;   // pitch from vertical pointer
    },
    pause() { running = false; },
    resume() { running = true; last = performance.now(); },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      io.disconnect();
      ro.disconnect();
      renderer.dispose();
    },
  };
}
