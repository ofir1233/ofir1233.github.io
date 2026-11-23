// FYI case study: the 3D phone and its stage. This is the source; the page loads the built file work/fyi-3d.js.
// Build (three and esbuild installed anywhere, NODE_PATH pointing at their node_modules):
//   esbuild work/fyi-3d.src.js --bundle --minify --format=iife --global-name=FYI3D --target=es2020 --outfile=work/fyi-3d.js
import {
  Shape, Group, Mesh, Scene, Color, Clock, Vector3, Object3D,
  MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, MeshDepthMaterial, ShadowMaterial, RGBADepthPacking,
  ExtrudeGeometry, ShapeGeometry, CylinderGeometry, BoxGeometry, PlaneGeometry,
  WebGLRenderer, PerspectiveCamera, DirectionalLight, PMREMGenerator, TextureLoader, InstancedMesh, Matrix4, Quaternion, Euler,
  SRGBColorSpace, ACESFilmicToneMapping, PCFSoftShadowMap, DoubleSide, MathUtils, LinearFilter, LinearMipmapLinearFilter,
  Plane, NoBlending, CanvasTexture, RepeatWrapping, CapsuleGeometry,
} from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// the device, in millimetres: one world unit is one millimetre
export const W = 70.6, H = 146.6, D = 8.3, R = 12.4, BEV = 1.1;
export const SW = 64.8, PT = SW / 390, SH = 844 * PT; // the glass shows a 390 x 844 point screen
export const rad = MathUtils.degToRad, clamp = MathUtils.clamp, lerp = MathUtils.lerp;
export const ease = t => t * t * (3 - 2 * t);               // smoothstep
export const easeOut = t => 1 - Math.pow(1 - t, 3);
export const span = (t, a, b) => clamp((t - a) / (b - a), 0, 1);

function rr(w, h, r) {
  const s = new Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

const UNIT = new PlaneGeometry(1, 1);
const loader = new TextureLoader();
let GEO = null;
function geo() {
  if (GEO) return GEO;
  const body = new ExtrudeGeometry(rr(W - 2 * BEV, H - 2 * BEV, R - BEV), { depth: D - 2 * BEV, bevelEnabled: true, bevelThickness: BEV, bevelSize: BEV, bevelSegments: 8, curveSegments: 28 }); body.center();
  return GEO = {
    body, plate: new ShapeGeometry(rr(W - 2 * BEV + .3, H - 2 * BEV + .3, R - BEV + .15), 28),
    bump: new ExtrudeGeometry(rr(35, 35, 10.5), { depth: .7, bevelEnabled: true, bevelThickness: .5, bevelSize: .5, bevelSegments: 5, curveSegments: 20 }),
    ring: new CylinderGeometry(7.6, 7.6, 1.5, 48), cap: new CylinderGeometry(6.2, 6.2, .3, 48), eye: new CylinderGeometry(2.6, 2.6, .1, 32),
    hole: new ShapeGeometry(rr(SW, SH, 56 * PT), 24),
    face: new ShapeGeometry(rr(W - .06, D - .06, BEV), 8), // what you see when the phone is cut across
    port: new CapsuleGeometry(1.3, 6.4, 6, 16), dot: new CylinderGeometry(.62, .62, .3, 14),
  };
}

// natural titanium, black glass, frosted back
const TI = 0x9d9a94;
function mats(o = {}) {
  return {
    band: new MeshPhysicalMaterial({ color: o.band ?? TI, metalness: 1, roughness: .34, clearcoat: .25, clearcoatRoughness: .4 }),
    glass: new MeshPhysicalMaterial({ color: 0x030304, metalness: 0, roughness: .08, clearcoat: 1, clearcoatRoughness: .05, reflectivity: .5, envMapIntensity: .3 }),
    back: new MeshPhysicalMaterial({ color: o.back ?? 0xb9b6b0, metalness: .25, roughness: .5, clearcoat: .2, clearcoatRoughness: .6, sheen: .4, sheenColor: new Color(o.sheen ?? 0xe8e4dc) }),
    lens: new MeshPhysicalMaterial({ color: 0x06070a, metalness: .2, roughness: .05, clearcoat: 1, clearcoatRoughness: .02 }),
    eye: new MeshPhysicalMaterial({ color: 0x0a0d18, metalness: .6, roughness: .12, clearcoat: 1 }),
    dark: new MeshStandardMaterial({ color: 0x0b0b0d, metalness: .4, roughness: .5 }),
    seam: new MeshStandardMaterial({ color: 0x6f6c67, metalness: .2, roughness: .7 }),
  };
}
// the bottom edge: port, two rows of speaker holes, two antenna lines
function bottomEdge(M) {
  const G = geo(), g = new Group(), y = -H / 2;
  const port = new Mesh(G.port, M.dark); port.rotation.z = Math.PI / 2; port.scale.set(1, 1, .5); port.position.set(0, y + .55, 0); g.add(port);
  for (let i = 0; i < 5; i++) [-1, 1].forEach(sd => { const d = new Mesh(G.dot, M.dark); d.position.set(sd * (11.5 + i * 2.5), y - .02, 0); g.add(d); });
  [-1, 1].forEach(sd => { const a = new Mesh(new BoxGeometry(.5, .16, D - .5), M.seam); a.position.set(sd * 24.5, y, 0); g.add(a); });
  return g;
}
const BTNS = [[W / 2 + .25, 20, 17], [-W / 2 - .25, 46, 6], [-W / 2 - .25, 31, 10.5], [-W / 2 - .25, 17, 10.5]];
const holeMat = () => new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, blending: NoBlending, depthWrite: true });

// one phone: a titanium band with bevelled edges, black glass in front, frosted glass and the camera plate behind
export function makePhone(o = {}) {
  const G = geo(), g = new Group(), M = mats(o);
  const body = new Mesh(G.body, M.band); body.castShadow = true; g.add(body);
  const front = new Mesh(G.plate, M.glass); front.position.z = D / 2 + .02; g.add(front);
  const back = new Mesh(G.plate, M.back); back.rotation.y = Math.PI; back.position.z = -D / 2 - .02; g.add(back);
  if (!o.lite) {
    // camera plate (top left when you look at the back) and its three lenses
    const cx = W / 2 - 5.2 - 17.5, cy = H / 2 - 5.2 - 17.5;
    const bump = new Mesh(G.bump, M.back); bump.rotation.y = Math.PI; bump.position.set(cx, cy, -D / 2); bump.castShadow = true; g.add(bump);
    [[8.6, 8.6], [8.6, -8.6], [-8.2, 0]].forEach(([dx, dy]) => {
      const ring = new Mesh(G.ring, M.band); ring.rotation.x = Math.PI / 2; ring.position.set(cx + dx, cy + dy, -D / 2 - 1.7); g.add(ring);
      const cap = new Mesh(G.cap, M.lens); cap.rotation.x = Math.PI / 2; cap.position.set(cx + dx, cy + dy, -D / 2 - 2.5); g.add(cap);
      const eye = new Mesh(G.eye, M.eye); eye.rotation.x = Math.PI / 2; eye.position.set(cx + dx, cy + dy, -D / 2 - 2.68); g.add(eye);
    });
    BTNS.forEach(([x, y, h]) => { const b = new Mesh(new BoxGeometry(1.1, h, 3), M.band); b.position.set(x, y, 0); g.add(b); });
    g.add(bottomEdge(M));
  }
  // the glass over the screen is a hole in the canvas: the live HTML screen sits under the canvas and shows through it,
  // so anything in front of the phone is drawn over the screen and anything behind is hidden by it
  const hole = new Mesh(G.hole, holeMat()); hole.position.z = D / 2 + .06; hole.visible = false; hole.renderOrder = -1; g.add(hole);
  g.userData = { band: M.band, glass: M.glass, back: M.back, body, hole, M };
  return g;
}

// the same phone cut across into n slabs; each can rise on its own. At rest it is the whole phone.
export function makeCut(n = 30, o = {}) {
  const G = geo(), g = new Group(), M = mats(o), list = [], h = H / n;
  // wet paint: what the phone is made of inside
  const paint = o.paint || new MeshPhysicalMaterial({ color: o.map ? (o.tint ?? 0xff5fa8) : 0xff2d8f, map: o.map || null, roughness: .38, metalness: 0, clearcoat: .5, clearcoatRoughness: .3, side: DoubleSide, emissive: 0xff2d8f, emissiveIntensity: .1 });
  const colG = new BoxGeometry(1, 1, 1);
  const bar = new MeshBasicMaterial({ color: 0xff2d8f, toneMapped: false });
  const half = y => { const d = Math.min(y + H / 2, H / 2 - y); if (d >= R) return W / 2; return W / 2 - (R - Math.sqrt(Math.max(0, R * R - (R - d) * (R - d)))); };
  const face = y => { const f = new Mesh(G.face, paint); f.receiveShadow = true; f.rotation.x = Math.PI / 2; f.scale.x = Math.max(.02, half(y) * 2 / W); f.position.y = y; return f; };
  for (let i = 0; i < n; i++) {
    const y0 = -H / 2 + i * h, y1 = y0 + h, s = new Group();
    const lp = [new Plane(new Vector3(0, 1, 0), -y0), new Plane(new Vector3(0, -1, 0), y1)], wp = [new Plane(), new Plane()];
    const clip = m => { const c = m.clone(); c.clippingPlanes = wp; c.clipShadows = true; return c; };
    const band = clip(M.band);
    const body = new Mesh(G.body, band); body.castShadow = true; s.add(body);
    const gl = clip(M.glass); gl.envMapIntensity = .06; gl.clearcoat = .5; gl.roughness = .16;
    const front = new Mesh(G.plate, gl); front.position.z = D / 2 + .02; front.receiveShadow = true; s.add(front);
    const back = new Mesh(G.plate, clip(M.back)); back.rotation.y = Math.PI; back.position.z = -D / 2 - .02; s.add(back);
    BTNS.forEach(([x, y, bh]) => { if (y + bh / 2 > y0 && y - bh / 2 < y1) { const b = new Mesh(new BoxGeometry(1.1, bh, 3), band); b.position.set(x, y, 0); s.add(b); } });
    if (i > 0) s.add(face(y0 + .012));
    if (i < n - 1) s.add(face(y1 - .012));
    if (i === 0) s.add(bottomEdge(M));
    // the slab's piece of screen: one bar of the note
    const b = new Mesh(UNIT, bar); b.position.set(0, (y0 + y1) / 2, D / 2 + .07); b.scale.set(10, h * .46, 1); b.visible = i > 0 && i < n - 1; s.add(b);
    // under a risen slab: a column of the same paint, down to the table
    const col = new Mesh(colG, paint); col.castShadow = true; col.receiveShadow = true; col.visible = false; col.scale.set(half((y0 + y1) / 2) * 2 - .1, h - .04, 1); col.position.y = (y0 + y1) / 2; s.add(col);
    g.add(s); list.push({ g: s, lp, wp, bar: b, col, y: (y0 + y1) / 2 });
  }
  g.userData = {
    slabs: list, n, h, paint,
    // z: how far the slab has risen; v: 0..1, the length of its bar on the glass
    set(i, z, v) { const s = list[i]; s.g.position.z = z; s.col.visible = z > .05; s.col.scale.z = Math.max(.001, z); s.col.position.z = -D / 2 - z / 2; if (v != null) s.bar.scale.x = Math.max(.6, v * (SW - 12)); },
    // the cut is kept by clipping planes in world space: call after the phone has moved
    update() { g.updateWorldMatrix(true, true); for (const s of list) { s.wp[0].copy(s.lp[0]).applyMatrix4(s.g.matrixWorld); s.wp[1].copy(s.lp[1]).applyMatrix4(s.g.matrixWorld); } },
  };
  return g;
}

// painted slabs on the page: the note going on past the phone. set(i, x, y, z, w, d, h) in millimetres.
export function slabs(n, o = {}) {
  const mat = o.material || new MeshStandardMaterial({ color: o.color ?? 0xff2d8f, roughness: .5, metalness: 0, emissive: o.color ?? 0xff2d8f, emissiveIntensity: o.glow ?? .14, map: o.map || null, alphaMap: o.alphaMap || null, alphaTest: o.alphaMap ? .5 : 0, transparent: !!o.transparent, opacity: o.opacity ?? 1 });
  const im = new InstancedMesh(new BoxGeometry(1, 1, 1), mat, n); im.castShadow = o.shadow !== false; im.receiveShadow = !!o.receive;
  const m = new Matrix4(), q = new Quaternion(), p = new Vector3(), s = new Vector3();
  im.userData.set = (i, x, y, z, w, d, h) => { p.set(x, y, z + h / 2); s.set(w, d, Math.max(.001, h)); m.compose(p, q, s); im.setMatrixAt(i, m); };
  im.userData.done = () => { im.instanceMatrix.needsUpdate = true; };
  return im;
}

export function texture(url, stage, o = {}) { const t = loader.load(url, () => { if (stage) { stage.dirty = true; stage.start(); } }); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; if (o.repeat) { t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(o.repeat[0], o.repeat[1]); } return t; }

// a field of printer's dots as an alpha map: full at one end, gone at the other
export function halftone(cols = 24, rows = 12) {
  const c = document.createElement('canvas'), u = 32; c.width = cols * u; c.height = rows * u;
  const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = '#fff';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const t = j / (rows - 1), r = u * .74 * Math.sqrt(Math.max(0, t)); x.beginPath(); x.arc((i + (j % 2 ? .5 : 0)) * u + u / 2, j * u + u / 2, r, 0, 7); x.fill(); }
  const t = new CanvasTexture(c); t.wrapS = RepeatWrapping; t.anisotropy = 8; return t;
}

// puts a live HTML element (390 points wide) on a phone's glass
export function mountScreen(phone, el) {
  const old = phone.userData.screen; if (old) { phone.remove(old); if (old.element !== el) old.element.remove(); }
  const o = new CSS3DObject(el);
  o.scale.setScalar(PT); o.position.z = D / 2 + .08;
  phone.add(o); phone.userData.screen = o; phone.userData.screenEl = el; el.classList.add('f3-flat');
  if (phone.userData.hole) phone.userData.hole.visible = true;
  return o;
}
// any flat HTML element as a sheet in the same space; mmPerPx says how large one of its CSS pixels is
// With o.w, o.h and o.r (CSS pixels) it also cuts its own hole in the canvas, so it can float in front of 3D things.
export function sheet(el, mmPerPx = PT, o = {}) {
  const c = new CSS3DObject(el); c.scale.setScalar(mmPerPx); el.classList.add('f3-flat');
  if (!o.w) return c;
  const g = new Group(); g.add(c);
  const hole = new Mesh(new ShapeGeometry(rr(o.w * mmPerPx, o.h * mmPerPx, (o.r || 0) * mmPerPx), 12), new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, blending: NoBlending, depthWrite: true }));
  hole.renderOrder = -1; g.add(hole); g.userData = { css: c, hole };
  return g;
}

// a painted picture as a real sheet: it takes light softly and throws a shadow shaped by its own outline
export function picture(url, wmm, o = {}) {
  const tex = loader.load(url, t => { const im = t.image; m.scale.set(wmm, wmm * im.height / im.width, 1); if (o.onload) o.onload(m); if (o.stage) { o.stage.dirty = true; o.stage.start(); } });
  tex.colorSpace = SRGBColorSpace; tex.anisotropy = 8; tex.minFilter = LinearMipmapLinearFilter; tex.magFilter = LinearFilter;
  const mat = new MeshBasicMaterial({ map: tex, transparent: true, side: DoubleSide, alphaTest: o.alphaTest ?? .02, toneMapped: false, depthWrite: !o.soft });
  const m = new Mesh(UNIT, mat); m.scale.set(wmm, wmm * (o.ratio ?? 1), 1);
  if (o.shadow !== false) { m.castShadow = true; m.customDepthMaterial = new MeshDepthMaterial({ depthPacking: RGBADepthPacking, map: tex, alphaTest: .5 }); }
  return m;
}

// many small phones from one geometry (the room at the end)
export function crowd(n, o = {}) {
  const G = geo();
  const band = new MeshPhysicalMaterial({ color: 0x2c2c31, metalness: 1, roughness: .35 });
  const bodies = new InstancedMesh(G.body, band, n); bodies.castShadow = true;
  const lit = new InstancedMesh(new ShapeGeometry(rr(SW, SH, 9.3), 10), new MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), n);
  const g = new Group(); g.add(bodies, lit);
  const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(1, 1, 1), off = new Vector3();
  g.userData.set = (i, x, y, z, rx, ry, rz, sc = 1, color) => {
    e.set(rx, ry, rz); q.setFromEuler(e); p.set(x, y, z); s.setScalar(sc); m.compose(p, q, s); bodies.setMatrixAt(i, m);
    off.set(0, 0, (D / 2 + .1) * sc).applyQuaternion(q); p.add(off); m.compose(p, q, s); lit.setMatrixAt(i, m);
    if (color) lit.setColorAt(i, color);
  };
  g.userData.done = () => { bodies.instanceMatrix.needsUpdate = true; lit.instanceMatrix.needsUpdate = true; if (lit.instanceColor) lit.instanceColor.needsUpdate = true; };
  return g;
}

export class Stage {
  constructor(host, o = {}) {
    this.host = host; this.o = o; this.fov = o.fov ?? 22; this.pxPerMm = o.pxPerMm ?? 4;
    const r = this.gl = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, o.maxDpr ?? 2));
    r.outputColorSpace = SRGBColorSpace; r.toneMapping = ACESFilmicToneMapping; r.toneMappingExposure = 1.08;
    r.shadowMap.enabled = true; r.shadowMap.type = PCFSoftShadowMap; r.localClippingEnabled = true; r.setClearColor(0x000000, 0);
    this.css = new CSS3DRenderer();
    r.domElement.className = 'f3-gl'; this.css.domElement.className = 'f3-css';
    host.append(this.css.domElement, r.domElement); // the canvas lies over the HTML layer; screens show through holes in it
    this.scene = new Scene();
    const pm = new PMREMGenerator(r); this.scene.environment = pm.fromScene(new RoomEnvironment(), .03).texture; this.scene.environmentIntensity = .85; pm.dispose();
    this.camera = new PerspectiveCamera(this.fov, 1, 20, 8000);
    // light: a soft key from the upper left front, and the two plates of the brand as rim lights: pink from the left, cyan from the right
    const key = this.key = new DirectionalLight(0xffffff, 1.6); key.position.set(-160, 260, 420); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); const sc = key.shadow.camera; sc.left = -420; sc.right = 420; sc.top = 320; sc.bottom = -320; sc.near = 50; sc.far = 1400; key.shadow.radius = 9; key.shadow.bias = -.0006;
    this.scene.add(key);
    const pink = this.pink = new DirectionalLight(0xff2d8f, o.rim ?? 1.1); pink.position.set(-420, 40, -260); this.scene.add(pink);
    const cyan = this.cyan = new DirectionalLight(0x22cdf0, (o.rim ?? 1.1) * .8); cyan.position.set(420, -60, -240); this.scene.add(cyan);
    // the page itself, a little behind the phone, takes its shadow
    const floor = this.floor = new Mesh(new PlaneGeometry(6000, 6000), new ShadowMaterial({ color: 0x171b20, opacity: .2 }));
    floor.position.z = o.floorZ ?? -46; floor.receiveShadow = true; this.scene.add(floor);
    this.tick = []; this.running = false; this.visible = true; this.clock = new Clock();
    this.resize = this.resize.bind(this); this.frame = this.frame.bind(this);
    if ('ResizeObserver' in window) new ResizeObserver(this.resize).observe(host); else addEventListener('resize', this.resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) this.start(); }, { rootMargin: '200px' }).observe(host);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.start(); });
    this.resize(); this.start();
  }
  // millimetres across and down the stage at the plane of the page (z = 0)
  get mmW() { return this.w / this.pxPerMm; }
  get mmH() { return this.h / this.pxPerMm; }
  resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight; if (!w || !h) return;
    this.w = w; this.h = h;
    this.gl.setSize(w, h, false); this.css.setSize(w, h);
    this.camera.aspect = w / h; this.camera.fov = this.fov;
    // at z = 0 one millimetre covers pxPerMm CSS pixels
    this.camera.position.z = h / (2 * this.pxPerMm * Math.tan(rad(this.fov / 2)));
    this.camera.updateProjectionMatrix(); this.dirty = true; if (this.onresize) this.onresize(); this.start();
  }
  setScale(pxPerMm) { if (pxPerMm !== this.pxPerMm) { this.pxPerMm = pxPerMm; this.resize(); } }
  setLens(fov) { if (fov !== this.fov) { this.fov = fov; this.resize(); } }
  onFrame(f) { this.tick.push(f); this.start(); return this; }
  start() { if (!this.running) { this.running = true; this.clock.getDelta(); requestAnimationFrame(this.frame); } }
  frame() {
    if (!this.visible || document.hidden) { this.running = false; return; }
    const dt = Math.min(this.clock.getDelta(), .05), t = this.clock.elapsedTime;
    let keep = !!this.dirty; this.dirty = false;
    for (const f of this.tick) if (f(dt, t) !== false) keep = true;
    this.gl.render(this.scene, this.camera); this.css.render(this.scene, this.camera);
    if (keep) requestAnimationFrame(this.frame); else this.running = false;
  }
}

// a damped follower for one number
export class Spring {
  constructor(v = 0, k = 90, c = 19) { this.v = v; this.to = v; this.s = 0; this.k = k; this.c = c; }
  set(v) { this.v = this.to = v; this.s = 0; }
  step(dt) { const a = (this.to - this.v) * this.k - this.s * this.c; this.s += a * dt; this.v += this.s * dt; return Math.abs(this.to - this.v) > 1e-4 || Math.abs(this.s) > 1e-3; }
}

// a pose is x, y, z in millimetres, rx, ry, rz in degrees and a scale; a Rig follows a target pose with springs
const KEYS = ['x', 'y', 'z', 'rx', 'ry', 'rz', 's'];
export class Rig {
  constructor(obj, pose = {}, k = 70, c = 16) { this.obj = obj; this.sp = {}; KEYS.forEach(n => { this.sp[n] = new Spring(pose[n] ?? (n === 's' ? 1 : 0), k, c); }); this.apply(); }
  to(pose) { KEYS.forEach(n => { if (pose[n] != null) this.sp[n].to = pose[n]; }); }
  snap(pose) { KEYS.forEach(n => { if (pose[n] != null) this.sp[n].set(pose[n]); }); this.apply(); }
  step(dt) { let moving = false; KEYS.forEach(n => { if (this.sp[n].step(dt)) moving = true; }); this.apply(); return moving; }
  apply() { const s = this.sp, o = this.obj; o.position.set(s.x.v, s.y.v, s.z.v); o.rotation.set(rad(s.rx.v), rad(s.ry.v), rad(s.rz.v)); o.scale.setScalar(s.s.v); }
}
export const mix = (a, b, t) => { const o = {}; KEYS.forEach(n => { const d = n === 's' ? 1 : 0; o[n] = lerp(a[n] ?? d, b[n] ?? d, t); }); return o; };

export { CSS3DObject, Group, Mesh, Color, Vector3, Object3D, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, BoxGeometry, InstancedMesh, MathUtils, TextureLoader, CanvasTexture, SRGBColorSpace, DoubleSide, RepeatWrapping };
