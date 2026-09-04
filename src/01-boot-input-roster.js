'use strict';
/* =====================================================================
   HECKTOWN ROAD — A Phillips Pet Adventure
   M2: the pack — trail-following squad, leader swap, cocoon rescues (on top of M1 combat + M0 world)
   Single file. No assets. Everything drawn at runtime.
   ===================================================================== */

/* ---------------- boot ---------------- */
const W = 960, H = 540;
const canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
const mainCtx = ctx;
const shadowInfo = { dir: 0, len: 0 }; // cast-shadow direction (+1 right) and length, set per frame
let scale = 1, dpr = 1;
function resize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  scale = Math.min(vw / W, vh / H);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.style.width = Math.floor(W * scale) + 'px';
  canvas.style.height = Math.floor(H * scale) + 'px';
  canvas.width = Math.floor(W * scale * dpr);
  canvas.height = Math.floor(H * scale * dpr);
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 120));
resize();

const DEV = /[?&]dev=1/.test(location.search);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + Math.random() * (b - a);
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function rgb(c) { return 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')'; }
function rgba(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')'; }
function shade(h, k) { const c = hex(h); return rgb([c[0] * k, c[1] * k, c[2] * k]); }
function lighten(h, k) { const c = hex(h); return rgb([c[0] + (255 - c[0]) * k, c[1] + (255 - c[1]) * k, c[2] + (255 - c[2]) * k]); }
function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
function mix(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}

/* ---------------- input ---------------- */
const keys = {};
const tk = { left: 0, right: 0, jump: 0, dash: 0, weather: 0, time: 0, use: 0, swap: 0, nip: 0, sup: 0 };
const prev = { jump: 0, dash: 0, weather: 0, time: 0, use: 0, swap: 0, nip: 0, sup: 0 };
const edge = { jump: 0, dash: 0, weather: 0, time: 0, use: 0, swap: 0, nip: 0, sup: 0 };
let tapSwap = -2; // portrait tapped this frame (-2 none)
const uiTaps = []; // {x,y,w,h,fn} registered each frame by HUD draws
let pendingTaps = [];
window.addEventListener('keydown', e => { keys[e.code] = 1; if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.code] = 0; });
window.addEventListener('blur', () => { for (const k in keys) keys[k] = 0; });

const touch = { stick: null, sx: 0, sy: 0, dx: 0, btn: {} };
const BTN = [
  { id: 'jump', x: W - 72, y: H - 76, r: 42, label: 'JUMP' },
  { id: 'dash', x: W - 168, y: H - 52, r: 34, label: 'DASH' },
  { id: 'use', x: W - 150, y: H - 142, r: 36, label: 'USE' },
  { id: 'sup', x: W - 246, y: H - 120, r: 32, label: 'SUPER', when: () => typeof superReady === 'function' && superReady() },
  { id: 'nip', x: W - 60, y: H - 168, r: 28, label: 'NIP', when: () => typeof catnip !== 'undefined' && catnip.n > 0 },
  { id: 'weather', x: W - 46, y: 46, r: 20, label: 'Q' },
  { id: 'time', x: W - 96, y: 46, r: 20, label: 'T' },
];
function tpos(t) { const r = canvas.getBoundingClientRect(); return { x: (t.clientX - r.left) / scale, y: (t.clientY - r.top) / scale }; }
function onTouch(e) {
  e.preventDefault();
  if (e.type === 'touchstart' && typeof packUI !== 'undefined') { for (const t of e.changedTouches) { const p = tpos(t); let hitUI = false; for (const r of uiTaps) if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) { pendingTaps.push(r.fn); hitUI = true; } if (hitUI) continue; for (const r of packUI.rects) if (p.x >= r.x - 4 && p.x <= r.x + r.w + 4 && p.y >= r.y - 6 && p.y <= r.y + r.h + 6) tapSwap = r.i; } }
  const active = {};
  let stickFound = false;
  for (const t of e.touches) {
    const p = tpos(t);
    let hit = null;
    for (const b of BTN) if ((!b.when || b.when()) && (p.x - b.x) ** 2 + (p.y - b.y) ** 2 < (b.r + 14) ** 2) hit = b.id;
    if (hit) { active[hit] = 1; continue; }
    if (p.x < W * 0.5) {
      if (touch.stick === null || touch.stick === t.identifier) {
        if (touch.stick === null) { touch.stick = t.identifier; touch.sx = p.x; touch.sy = p.y; }
        touch.dx = clamp((p.x - touch.sx) / 40, -1, 1);
        stickFound = true;
      }
    }
  }
  if (!stickFound) { touch.stick = null; touch.dx = 0; }
  touch.btn = active;
  touch.used = true;
}
canvas.addEventListener('touchstart', onTouch, { passive: false });
canvas.addEventListener('touchmove', onTouch, { passive: false });
canvas.addEventListener('touchend', onTouch, { passive: false });
canvas.addEventListener('touchcancel', onTouch, { passive: false });

function runTaps() { const t = pendingTaps; pendingTaps = []; for (const fn of t) fn(); }
function syncInput() {
  let gp = null; if (!syncInput.noGp) { try { gp = (navigator.getGamepads && navigator.getGamepads()[0]) || null; } catch (e) { syncInput.noGp = true; gp = null; } }
  let gx = 0, gjump = 0, gdash = 0;
  if (gp) { gx = Math.abs(gp.axes[0]) > 0.2 ? gp.axes[0] : 0; if (gp.buttons[14].pressed) gx = -1; if (gp.buttons[15].pressed) gx = 1; gjump = gp.buttons[0].pressed ? 1 : 0; gdash = (gp.buttons[2].pressed || gp.buttons[1].pressed) ? 1 : 0; }
  tk.left = (keys.ArrowLeft || keys.KeyA || touch.dx < -0.25 || gx < -0.25) ? 1 : 0;
  tk.right = (keys.ArrowRight || keys.KeyD || touch.dx > 0.25 || gx > 0.25) ? 1 : 0;
  tk.jump = (keys.Space || keys.ArrowUp || keys.KeyW || touch.btn.jump || gjump) ? 1 : 0;
  tk.dash = (keys.ShiftLeft || keys.ShiftRight || keys.KeyK || touch.btn.dash || gdash) ? 1 : 0;
  tk.weather = (keys.KeyQ || touch.btn.weather) ? 1 : 0;
  tk.time = (keys.KeyT || touch.btn.time) ? 1 : 0;
  tk.use = (keys.KeyE || keys.Enter || touch.btn.use || (gp && gp.buttons[3].pressed)) ? 1 : 0;
  tk.swap = (keys.KeyC || keys.Tab || (gp && gp.buttons[5].pressed)) ? 1 : 0;
  tk.nip = (keys.KeyX || touch.btn.nip || (gp && gp.buttons[4].pressed)) ? 1 : 0;
  tk.sup = (keys.KeyV || touch.btn.sup || (gp && gp.buttons[6].pressed)) ? 1 : 0;
  for (const k in edge) { edge[k] = tk[k] && !prev[k] ? 1 : 0; prev[k] = tk[k]; }
}

/* ---------------- time of day & palette ---------------- */
// keyframes: hour → { top, horizon, ambient(rgb 0..255), sun }
const SKY = [
  { h: 0,  top: hex('#101a38'), hor: hex('#243258'), amb: [152, 160, 200], haze: hex('#243258') },
  { h: 5,  top: hex('#1f2648'), hor: hex('#7d5a6c'), amb: [170, 148, 165], haze: hex('#7d5a6c') },
  { h: 7,  top: hex('#5f8fc4'), hor: hex('#f4c48a'), amb: [235, 225, 210], haze: hex('#f4c48a') },
  { h: 12, top: hex('#4d90d8'), hor: hex('#cfe6f7'), amb: [255, 255, 255], haze: hex('#cfe6f7') },
  { h: 17, top: hex('#3a6ea5'), hor: hex('#f2b544'), amb: [255, 242, 218], haze: hex('#f2b544') },
  { h: 19, top: hex('#2a2f5c'), hor: hex('#e0684a'), amb: [228, 190, 190], haze: hex('#e0684a') },
  { h: 21, top: hex('#141d3e'), hor: hex('#324066'), amb: [156, 164, 204], haze: hex('#324066') },
  { h: 24, top: hex('#101a38'), hor: hex('#243258'), amb: [152, 160, 200], haze: hex('#243258') },
];
function skyAt(hour) {
  hour = ((hour % 24) + 24) % 24;
  let a = SKY[0], b = SKY[1];
  for (let i = 0; i < SKY.length - 1; i++) if (hour >= SKY[i].h && hour <= SKY[i + 1].h) { a = SKY[i]; b = SKY[i + 1]; break; }
  const t = (hour - a.h) / (b.h - a.h);
  const e = t * t * (3 - 2 * t);
  return { top: mix(a.top, b.top, e), hor: mix(a.hor, b.hor, e), amb: mix(a.amb, b.amb, e), haze: mix(a.haze, b.haze, e) };
}
function nightness(hour) { const a = skyAt(hour).amb; return 1 - clamp((a[0] + a[1] + a[2]) / 3 / 255, 0, 1); }

/* ---------------- roster ---------------- */
// Full Phillips IT roster. Each has a look and a traversal perk (perk text only in M0).
const ROSTER = [
  { name: 'Rianan', role: 'IT Department Head', perk: 'Rally', skin: '#f1c9a5', hair: '#3b2418', style: 'ponytail', shirt: '#2f6f9f', pants: '#2b2f3a', acc: 'headset' },
  { name: 'Aaron', role: 'Network Specialist', perk: 'Trace', skin: '#d9a77c', hair: '#1f1a17', style: 'hoodie', shirt: '#4a4f6b', pants: '#1f2330', acc: 'cable' },
  { name: 'Bret', role: 'Infrastructure Manager', perk: 'Ground', skin: '#e8b48e', hair: '#5a3a22', style: 'cap', shirt: '#7a4a2a', pants: '#3a3d47', acc: 'belt' },
  { name: 'Brian S', role: 'IT Manager', perk: 'Override', skin: '#f0c7a3', hair: '#7a6a5c', style: 'short', shirt: '#3d6b52', pants: '#2b2f3a', acc: 'lanyard' },
  { name: 'Brian W', role: 'Developer', perk: 'Query', skin: '#efc39d', hair: '#4a3626', style: 'short', shirt: '#5a5f7a', pants: '#26293a', acc: 'glasses' },
  { name: 'Umesh', role: 'EDI Specialist', perk: 'Handshake', skin: '#b9825a', hair: '#151210', style: 'short', shirt: '#9a5a3a', pants: '#2b2f3a', acc: 'vest' },
  { name: 'Dave', role: 'iSeries Guru', perk: 'Green Screen', skin: '#eec2a0', hair: '#8e8e8e', style: 'beard', shirt: '#8a4a3a', pants: '#3a3d47', acc: 'flannel' },
  { name: 'John', role: 'iSeries Manager', perk: 'Batch', skin: '#e9bb95', hair: '#3a2c22', style: 'short', shirt: '#2f5f8f', pants: '#2b2f3a', acc: 'keys' },
  { name: 'Greg', role: 'BI Wizard', perk: 'Dashboard', skin: '#f1c9a5', hair: '#a8632c', style: 'wavy', shirt: '#6b5b8f', pants: '#2b2f3a', acc: 'cardigan' },
  { name: 'Ryan', role: 'Dev Manager', perk: 'Sprint', skin: '#e4b58f', hair: '#2a1e18', style: 'short', shirt: '#c25a3a', pants: '#26293a', acc: 'backpack' },
  { name: 'Jose', role: 'System Architect', perk: 'Blueprint', skin: '#c9906a', hair: '#1a1410', style: 'swept', shirt: '#2f7f8f', pants: '#2b2f3a', acc: 'plans' },
  { name: 'Ash', role: 'Salesforce Engineer', perk: 'Flow', skin: '#c48a62', hair: '#1a1410', style: 'bun', shirt: '#4a6fd8', pants: '#26293a', acc: 'cloud' },
];

// Draws a character. (c, x, y) = feet center. facing ±1. pose: {run:0..1, air:bool, squash, stretch, dash}
function drawHero(c, ch, x, y, facing, pose, lit) {
  const run = pose.run || 0, t = pose.t || 0;
  const sq = pose.squash || 1, st = pose.stretch || 1;
  c.save();
  c.translate(x, y);
  const bigS = (pose.big || 1) * (ch.kid ? 0.72 : 1); c.scale(facing * sq * bigS, st * bigS);
  if (pose.moving && !pose.air) c.rotate(0.06); // lean into the run
  if (pose.hurt) c.rotate(-0.25);
  if (pose.dead) { c.translate(0, -6); c.rotate(-Math.PI / 2 * Math.min(1, pose.dead)); }
  const legA = pose.air ? 0.35 : Math.sin(run * Math.PI * 2) * (pose.moving ? 0.8 : 0);
  const bob = pose.moving && !pose.air ? Math.abs(Math.sin(run * Math.PI * 2)) * 2 : 0;
  const breathe = pose.moving ? 0 : Math.sin(t * 2) * 0.8;
  // shadow: contact blob + cast shadow (direction from the sun / nearest light)
  c.fillStyle = 'rgba(0,0,0,0.22)'; c.beginPath(); c.ellipse(0, 1, 16, 4, 0, 0, Math.PI * 2); c.fill();
  if (shadowInfo.len > 0 && !pose.air) { const sd = shadowInfo.dir * facing, L = shadowInfo.len; c.fillStyle = 'rgba(0,0,0,0.14)'; c.beginPath(); c.ellipse(sd * L * 0.5, 0, L * 0.5 + 10, 3.5, 0, 0, Math.PI * 2); c.fill(); }
  c.translate(0, -bob);
  // legs
  const legLen = 18;
  for (const s of [-1, 1]) {
    c.save();
    c.translate(s * 5, -legLen);
    const swing = s * legA; c.rotate(swing);
    // thigh
    c.fillStyle = ch.pants; rr(c, -4, 0, 8, legLen * 0.55 + 2, 4); c.fill(); c.fillStyle = 'rgba(0,0,0,.18)'; rr(c, 0, 0, 4, legLen * 0.55 + 2, 3); c.fill();
    // knee bends on the back-swing and in the air
    const bend = pose.air ? 0.9 : Math.max(0, -swing) * 1.4 + (pose.moving ? 0.15 : 0);
    c.translate(0, legLen * 0.55); c.rotate(bend * (facing > 0 ? 1 : 1));
    c.fillStyle = ch.pants; rr(c, -3.5, -1, 7, legLen * 0.5 + 2, 3.5); c.fill();
    c.fillStyle = '#151820'; rr(c, -4.5, legLen * 0.5 - 3, 11, 6, 3); c.fill(); c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(-3.5, legLen * 0.5 - 2, 8, 1.5); // shoe
    c.restore();
  }
  // torso
  const torsoY = -legLen - 22 + breathe;
  { const tg = c.createLinearGradient(-11, torsoY, 11, torsoY + 24); tg.addColorStop(0, lighten(ch.shirt, 0.18)); tg.addColorStop(0.55, ch.shirt); tg.addColorStop(1, shade(ch.shirt, 0.72)); c.fillStyle = tg; rr(c, -11, torsoY, 22, 24, 7); c.fill(); c.strokeStyle = 'rgba(20,16,30,.35)'; c.lineWidth = 1; c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,.10)'; rr(c, -8, torsoY + 2, 8, 6, 3); c.fill(); // collar highlight
  // accessory on torso
  if (ch.acc === 'vest') { c.fillStyle = '#e9c46a'; rr(c, -11, torsoY, 22, 14, 6); c.fill(); }
  if (ch.acc === 'flannel') { c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1; for (let i = -8; i <= 8; i += 5) { c.beginPath(); c.moveTo(i, torsoY); c.lineTo(i, torsoY + 24); c.stroke(); } }
  if (ch.acc === 'lanyard') { c.strokeStyle = '#e63946'; c.lineWidth = 2; c.beginPath(); c.moveTo(-4, torsoY + 2); c.lineTo(0, torsoY + 14); c.lineTo(4, torsoY + 2); c.stroke(); c.fillStyle = '#fff'; c.fillRect(-2, torsoY + 13, 4, 5); }
  if (ch.acc === 'cardigan') { c.fillStyle = 'rgba(255,255,255,.14)'; rr(c, -11, torsoY, 9, 24, 5); c.fill(); rr(c, 2, torsoY, 9, 24, 5); c.fill(); }
  if (ch.acc === 'backpack') { c.fillStyle = '#3a3a3a'; rr(c, -17, torsoY + 2, 8, 18, 4); c.fill(); }
  if (ch.acc === 'belt') { c.fillStyle = '#6b4a2a'; c.fillRect(-11, torsoY + 20, 22, 4); c.fillStyle = '#d0d0d0'; c.fillRect(2, torsoY + 19, 5, 6); }
  // arms
  const armA = pose.air ? -0.9 : Math.sin(run * Math.PI * 2 + Math.PI) * (pose.moving ? 0.7 : 0.05);
  for (const s of [-1, 1]) {
    c.save(); c.translate(s * 10, torsoY + 4); const aSw = s * armA * (s === 1 ? 1 : -1); c.rotate(pose.hurt ? -0.9 : aSw);
    c.fillStyle = s > 0 ? shade(ch.shirt, 0.8) : ch.shirt; rr(c, -3, 0, 6, 9, 3); c.fill(); c.strokeStyle = 'rgba(20,16,30,.3)'; c.lineWidth = 1; c.stroke();
    // forearm bends at the elbow while running
    c.translate(0, 9); c.rotate(pose.moving && !pose.air ? -0.7 : (pose.air ? -0.4 : 0));
    c.fillStyle = s > 0 ? shade(ch.shirt, 0.8) : ch.shirt; rr(c, -2.6, -1, 5.2, 9, 2.6); c.fill(); c.stroke();
    c.fillStyle = ch.skin; c.beginPath(); c.arc(0, 9, 3.5, 0, Math.PI * 2); c.fill();
    c.restore();
  }
  if (ch.acc === 'cable') { c.strokeStyle = '#e9c46a'; c.lineWidth = 2; c.beginPath(); c.arc(-12, torsoY + 12, 6, 0, Math.PI * 2); c.stroke(); }
  if (ch.acc === 'plans') { c.fillStyle = '#e8e2d0'; c.save(); c.translate(12, torsoY + 10); c.rotate(-0.5); rr(c, -3, -10, 6, 20, 3); c.fill(); c.restore(); }
  if (ch.acc === 'tablet') { c.fillStyle = '#1b1b1f'; c.save(); c.translate(12, torsoY + 12); c.rotate(-0.2); rr(c, -6, -8, 12, 16, 2); c.fill(); c.fillStyle = '#7fd0a0'; rr(c, -5, -7, 10, 13, 1); c.fill(); c.restore(); }
  if (ch.acc === 'cloud') { c.fillStyle = '#cfe6ff'; c.beginPath(); c.arc(-3, torsoY + 10, 4, 0, Math.PI * 2); c.arc(1, torsoY + 8, 5, 0, Math.PI * 2); c.arc(5, torsoY + 10, 4, 0, Math.PI * 2); c.fill(); c.fillRect(-4, torsoY + 10, 10, 4); }
  if (ch.acc === 'keys') { c.fillStyle = '#d8d8d8'; c.beginPath(); c.arc(9, torsoY + 22, 2.5, 0, Math.PI * 2); c.fill(); c.fillRect(8, torsoY + 24, 2, 5); }
  // head
  const hy = torsoY - 12;
  { const hg = c.createRadialGradient(-4, hy - 5, 2, 0, hy, 14); hg.addColorStop(0, lighten(ch.skin, 0.16)); hg.addColorStop(1, shade(ch.skin, 0.82)); c.fillStyle = hg; c.beginPath(); c.arc(0, hy, 13, 0, Math.PI * 2); c.fill(); c.strokeStyle = 'rgba(40,20,20,.28)'; c.lineWidth = 1; c.stroke(); }
  c.fillStyle = shade(ch.skin, 0.9); c.beginPath(); c.arc(-12, hy + 1, 3, 0, Math.PI * 2); c.fill(); // ear
  // hair
  c.fillStyle = ch.hair;
  if (ch.style === 'hoodie') { c.fillStyle = ch.shirt; c.beginPath(); c.arc(0, hy - 1, 15, Math.PI, Math.PI * 2); c.fill(); c.fillRect(-15, hy - 1, 30, 6); c.fillStyle = ch.hair; c.beginPath(); c.arc(0, hy - 4, 10, Math.PI, Math.PI * 2); c.fill(); }
  else if (ch.style === 'cap') { c.beginPath(); c.arc(0, hy - 2, 13, Math.PI, Math.PI * 2); c.fill(); c.fillStyle = '#2f4f6f'; c.beginPath(); c.arc(0, hy - 3, 14, Math.PI, Math.PI * 2); c.fill(); c.fillRect(0, hy - 4, 20, 4); }
  else if (ch.style === 'ponytail') {
    c.beginPath(); c.arc(0, hy - 2, 14, Math.PI * 0.95, Math.PI * 2.05); c.fill();
    const sw = Math.sin(t * 7 + run * 6) * (pose.moving ? 6 : 2) - (pose.air ? 6 : 0);
    c.beginPath(); c.moveTo(-10, hy - 4); c.quadraticCurveTo(-26, hy + 2 + sw, -20, hy + 22 + sw); c.quadraticCurveTo(-14, hy + 8, -8, hy + 2); c.fill();
    c.fillStyle = '#f2b544'; c.beginPath(); c.arc(-12, hy - 1, 3, 0, Math.PI * 2); c.fill();
  }
  else if (ch.style === 'bun') { c.beginPath(); c.arc(0, hy - 2, 14, Math.PI * 0.95, Math.PI * 2.05); c.fill(); c.beginPath(); c.arc(-9, hy - 12, 6, 0, Math.PI * 2); c.fill(); c.fillStyle = '#f2b544'; c.beginPath(); c.arc(-9, hy - 12, 2, 0, Math.PI * 2); c.fill(); c.fillStyle = ch.hair; }
  else if (ch.style === 'beard') { c.beginPath(); c.arc(0, hy - 3, 13, Math.PI, Math.PI * 2); c.fill(); c.beginPath(); c.arc(0, hy + 6, 10, 0, Math.PI); c.fill(); c.fillStyle = ch.skin; c.fillRect(-5, hy + 2, 10, 3); }
  else if (ch.style === 'wavy') { c.beginPath(); c.arc(0, hy - 3, 14, Math.PI, Math.PI * 2); c.fill(); for (let i = -10; i <= 10; i += 5) { c.beginPath(); c.arc(i, hy - 5, 4, 0, Math.PI * 2); c.fill(); } }
  else if (ch.style === 'swept') { c.beginPath(); c.moveTo(-13, hy - 2); c.quadraticCurveTo(-4, hy - 20, 16, hy - 8); c.lineTo(13, hy - 1); c.quadraticCurveTo(0, hy - 8, -13, hy - 2); c.fill(); }
  else { c.beginPath(); c.arc(0, hy - 3, 13, Math.PI, Math.PI * 2); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.14)'; c.beginPath(); c.ellipse(-4, hy - 11, 5, 2, -0.4, 0, Math.PI * 2); c.fill(); // hair sheen
  // face
  const blink = ((t * 0.37 + (ch.name ? ch.name.length : 0)) % 4) > 3.85;
  if (blink) { c.strokeStyle = shade(ch.skin, 0.6); c.lineWidth = 1.2; c.beginPath(); c.moveTo(1.5, hy - 1); c.lineTo(6.5, hy - 1); c.moveTo(7.5, hy - 1); c.lineTo(12.5, hy - 1); c.stroke(); }
  else {
  c.fillStyle = '#fbf6ee'; c.beginPath(); c.ellipse(4, hy - 1, 2.6, 2.2, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(9.5, hy - 1, 2.6, 2.2, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#1b1b1f';
  c.beginPath(); c.arc(4.6, hy - 0.8, 1.5, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.arc(10.1, hy - 0.8, 1.5, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#fff'; c.fillRect(4.6, hy - 1.8, 0.9, 0.9); c.fillRect(10.1, hy - 1.8, 0.9, 0.9);
  }
  c.strokeStyle = shade(ch.hair, 0.9); c.lineWidth = 1.2; c.beginPath(); c.moveTo(1.5, hy - 5); c.lineTo(6.5, hy - 6); c.moveTo(7.5, hy - 6); c.lineTo(12.5, hy - 5); c.stroke();
  if (!ch.mono) { c.fillStyle = 'rgba(230,120,120,.18)'; c.beginPath(); c.arc(1.5, hy + 3, 2.2, 0, Math.PI * 2); c.fill(); }
  c.strokeStyle = ch.mono ? '#4a4a4a' : '#7a3b2a'; c.lineWidth = 1.2; c.beginPath(); c.arc(6.5, hy + 3, 3.5, 0.15, Math.PI - 0.15); c.stroke();
  if (ch.acc === 'glasses') { c.strokeStyle = '#333'; c.lineWidth = 1.2; c.strokeRect(1, hy - 4, 6, 5); c.strokeRect(8, hy - 4, 6, 5); }
  if (ch.acc === 'headset') { c.strokeStyle = '#222'; c.lineWidth = 2; c.beginPath(); c.arc(0, hy - 2, 14, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.fillStyle = '#222'; c.beginPath(); c.arc(12, hy + 1, 3, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#222'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(13, hy + 3); c.lineTo(11, hy + 9); c.stroke(); }
  // rim light on lit side
  if (lit) {
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.28 * lit.i;
    c.strokeStyle = rgb(lit.color); c.lineWidth = 2.2;
    c.beginPath(); c.arc(0, hy, 12, -Math.PI * 0.9 * lit.side, -Math.PI * 0.35 * lit.side, lit.side < 0); c.stroke();
    c.beginPath(); c.moveTo(lit.side * 10, torsoY + 2); c.lineTo(lit.side * 10, torsoY + 20); c.stroke();
    c.restore();
  }
  c.restore();
}

// Portrait used on the title cards
function drawPortrait(c, ch, size) {
  const s = size / 96;
  c.save(); c.scale(s, s);
  const g = c.createLinearGradient(0, 0, 0, 96); g.addColorStop(0, '#2a3c5c'); g.addColorStop(1, '#16223a');
  c.fillStyle = g; rr(c, 0, 0, 96, 96, 10); c.fill();
  // warm key light blob behind head
  const rg = c.createRadialGradient(48, 40, 4, 48, 40, 50); rg.addColorStop(0, ch.mono ? 'rgba(235,235,245,.35)' : 'rgba(242,181,68,.35)'); rg.addColorStop(1, 'rgba(242,181,68,0)');
  c.fillStyle = rg; c.fillRect(0, 0, 96, 96);
  c.save(); c.translate(48, 126); c.scale(1.7, 1.7);
  drawHero(c, ch, 0, 0, 1, { t: 0, run: 0, moving: false }, { i: 1, color: [242, 181, 68], side: 1 });
  c.restore();
  c.restore();
}

/* ---------------- Biscuit ---------------- */
function drawBiscuit(c, d, lit) {
  c.save(); c.translate(d.x, d.y); c.scale(d.facing, 1);
  const bob = d.moving ? Math.abs(Math.sin(d.run * Math.PI * 2)) * 2 : 0;
  c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(0, 1, 16, 3.5, 0, 0, Math.PI * 2); c.fill();
  c.translate(0, -bob);
  const legA = d.moving ? Math.sin(d.run * Math.PI * 2) * 0.7 : 0;
  const col = d.col || '#c98a4a'; const dark = d.col ? d.col : '#8c5a2b';
  c.fillStyle = d.col || '#b97a3f';
  for (const [sx, ph] of [[-9, 0], [7, Math.PI], [-6, Math.PI], [10, 0]]) { c.save(); c.translate(sx, -11); c.rotate(legA * Math.cos(ph)); rr(c, -2.5, 0, 5, 12, 2.5); c.fill(); c.restore(); }
  // body
  { const bg = c.createLinearGradient(0, -24, 0, -8); bg.addColorStop(0, lighten(col, 0.18)); bg.addColorStop(1, shade(col, 0.78)); c.fillStyle = bg; rr(c, -15, -22, 30, 14, 7); c.fill(); c.strokeStyle = 'rgba(40,20,10,.3)'; c.lineWidth = 1; c.stroke(); }
  // tail
  const wag = Math.sin(d.t * (d.moving ? 18 : 6)) * 0.6;
  c.save(); c.translate(-15, -20); c.rotate(-0.8 + wag); c.fillStyle = col; rr(c, -2, -12, 4, 14, 2); c.fill(); c.restore();
  // head
  c.fillStyle = col; c.beginPath(); c.arc(14, -24, 9, 0, Math.PI * 2); c.fill();
  c.fillStyle = dark; rr(c, 16, -22, 9, 7, 3); c.fill(); // muzzle
  c.fillStyle = '#1b1b1f'; c.beginPath(); c.arc(24, -21, 2, 0, Math.PI * 2); c.fill(); // nose
  c.fillStyle = '#fbf6ee'; c.beginPath(); c.arc(15, -27, 2.2, 0, Math.PI * 2); c.fill(); c.fillStyle = '#1b1b1f'; c.beginPath(); c.arc(15.4, -26.8, 1.4, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff'; c.fillRect(15.4, -27.8, 0.8, 0.8); // eye
  // ears (spring)
  c.fillStyle = dark;
  c.save(); c.translate(9, -31); c.rotate(-0.3 + d.earA); rr(c, -3, 0, 6, 12, 3); c.fill(); c.restore();
  // collar + tag
  c.fillStyle = '#c0392b'; rr(c, 6, -19, 8, 3, 1.5); c.fill();
  c.fillStyle = '#f2b544'; c.beginPath(); c.arc(11, -14, 2, 0, Math.PI * 2); c.fill();
  if (lit) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.25 * lit.i; c.strokeStyle = rgb(lit.color); c.lineWidth = 2; c.beginPath(); c.moveTo(-12, -22); c.lineTo(12, -22); c.stroke(); c.restore(); }
  c.restore();
}
