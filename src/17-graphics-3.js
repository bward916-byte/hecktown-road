
/* =====================================================================
   GRAPHICS III (M15)
   ===================================================================== */
drawScoreHUD = function () { }; // score removed

/* ---------- 1. foliage that sways (dynamic canopy + grass over the baked trees) ---------- */
const canopies = [];
const _drawOak = drawOak; drawOak = function (g, x, y, s) { _drawOak(g, x, y, s); canopies.push({ x, y: y - 160 * s, r: 60 * s, col: '#5c8f4f' }); };
const _drawMaple = drawMaple; drawMaple = function (g, x, y, s, col) { _drawMaple(g, x, y, s, col); canopies.push({ x, y: y - 120 * s, r: 42 * s, col }); };
const _drawPeach = drawPeachTree; drawPeachTree = function (g, x, y, s) { _drawPeach(g, x, y, s); canopies.push({ x, y: y - 100 * s, r: 36 * s, col: '#5b8e49' }); };
const _drawFir = drawFir; drawFir = function (g, x, y, s) { _drawFir(g, x, y, s); canopies.push({ x, y: y - 120 * s, r: 30 * s, col: '#255a3a', fir: true }); };
const _drawPalm = drawPalm; drawPalm = function (g, x, y, s) { _drawPalm(g, x, y, s); canopies.push({ x: x + 14 * s, y: y - 142 * s, r: 30 * s, col: '#4f8f4a', palm: true }); };
function drawSway() {
  const wind = windX() + (hazard.wind || 0) * 0.15; const cx = camera.x;
  for (const c of canopies) { if (c.x < cx - 100 || c.x > cx + W + 100) continue; const ph = c.x * 0.01; const dx = Math.sin(gameTime * 1.3 + ph) * wind * 0.06 + Math.sin(gameTime * 3.1 + ph) * 1.5; ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = lighten(c.col, 0.18); if (c.palm) { for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(c.x + dx * (1 + k * 0.3) + Math.cos(k * 1.6) * c.r, c.y + Math.sin(k * 1.6) * c.r * 0.3, c.r * 0.9, c.r * 0.18, k * 1.6 + dx * 0.02, 0, Math.PI * 2); ctx.fill(); } } else if (c.fir) { ctx.beginPath(); ctx.moveTo(c.x - c.r + dx * 0.4, c.y + c.r); ctx.lineTo(c.x + c.r + dx * 0.4, c.y + c.r); ctx.lineTo(c.x + dx, c.y - c.r); ctx.closePath(); ctx.fill(); } else { for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(c.x + dx * (0.6 + k * 0.4) + Math.cos(k * 2.1) * c.r * 0.5, c.y + Math.sin(k * 2.1) * c.r * 0.4, c.r * 0.5, 0, Math.PI * 2); ctx.fill(); } } ctx.restore(); }
  // grass tufts along the ground line
  if (WORLD.def && !WORLD.def.indoor) { ctx.strokeStyle = 'rgba(120,170,90,.55)'; ctx.lineWidth = 2; const gy = WORLD.groundY; for (let x = Math.floor(cx / 18) * 18; x < cx + W; x += 18) { if ((x * 7919) % 100 > 45) continue; const hh = 6 + (x * 13) % 8; const lean = Math.sin(gameTime * 2.2 + x * 0.05) * 3 + wind * 0.08; ctx.beginPath(); ctx.moveTo(x, gy); ctx.quadraticCurveTo(x + lean * 0.5, gy - hh * 0.6, x + lean, gy - hh); ctx.stroke(); } }
}

/* ---------- 2. windows reflect the sky and light room by room ---------- */
function windowRects() {
  const id = WORLD.id, out = [];
  if (id === 'easton') { for (let i = 0; i < 9; i++) { const wx = 600 + i * 82; if (wx > 900 && wx < 1100) continue; out.push([wx, 266, 44, 40], [wx, 328, 44, 40]); } }
  else if (id === 'taunton') { for (let i = 0; i < 5; i++) out.push([970 + i * 90, 270, 44, 40]); }
  else if (id === 'spartanburg') { for (let i = 0; i < 5; i++) out.push([1170 + i * 86, 270, 44, 40]); }
  else if (WORLD.def && WORLD.def.steps && id !== 'merge') { for (let i = 0; i < 5; i++) out.push([1170 + i * 86, 270, 44, 40]); }
  return out;
}
let winCache = { id: null, rects: [], lit: [] };
function drawWindows(sk, night) {
  if (winCache.id !== WORLD.id) { winCache = { id: WORLD.id, rects: windowRects(), lit: windowRects().map((r, i) => ((i * 7919) % 10) / 10) }; }
  if (!winCache.rects.length) return;
  const cx = camera.x, cy = camera.y; const sunUp = hour > 5.5 && hour < 18.8;
  for (let i = 0; i < winCache.rects.length; i++) {
    const [x, y, w, h] = winCache.rects[i]; const sx = x - cx, sy = y - cy; if (sx < -60 || sx > W + 60) continue;
    ctx.save(); ctx.beginPath(); rr(ctx, sx + 2, sy + 2, w - 4, h - 4, 2); ctx.clip();
    // sky reflection
    const g = ctx.createLinearGradient(sx, sy, sx + w, sy + h); g.addColorStop(0, rgba(mix(sk.top, [255, 255, 255], 0.2), 0.55 * (1 - night * 0.7))); g.addColorStop(1, rgba(sk.hor, 0.35 * (1 - night * 0.7))); ctx.fillStyle = g; ctx.fillRect(sx, sy, w, h);
    if (sunUp) { const sunA = ((hour - 6) / 12) * Math.PI; const gx = sx + w * (0.2 + 0.6 * (1 - Math.cos(sunA)) / 2); const sg = ctx.createRadialGradient(gx, sy + h * 0.3, 1, gx, sy + h * 0.3, 18); sg.addColorStop(0, rgba([255, 245, 220], 0.7 * (1 - night))); sg.addColorStop(1, 'rgba(255,245,220,0)'); ctx.fillStyle = sg; ctx.fillRect(sx, sy, w, h); }
    // room lights at night, each room its own schedule; A+'s green flicker where it still holds the DC
    if (night > 0.2) { const on = winCache.lit[i] < 0.65 + Math.sin(gameTime * 0.1 + i) * 0.1; if (on) { ctx.fillStyle = rgba([255, 230, 170], 0.42 * night); ctx.fillRect(sx, sy, w, h); } if (!restored[WORLD.id] && WORLD.id !== 'easton' && Math.sin(gameTime * 9 + i * 1.7) > 0.93) { ctx.fillStyle = rgba(LED, 0.35 * night); ctx.fillRect(sx, sy, w, h); } }
    ctx.restore();
  }
}

/* ---------- 3. shadows thrown onto the wall behind you by the nearest lamp ---------- */
function drawWallShadows(night) {
  if (night < 0.3) return;
  const wall = WORLD.id === 'easton' ? [560, 1400, 236] : (WORLD.id === 'taunton' ? [940, 1420, 236] : [1140, 1600, 236]);
  for (const m of crewAll()) {
    if (m.x < wall[0] - 40 || m.x > wall[1] + 40) continue; const L = nearestLight(m.x, m.y - 30, night); if (!L || L.i < 0.2) continue;
    ctx.save(); ctx.globalAlpha = 0.16 * night; ctx.globalCompositeOperation = 'multiply'; ctx.translate(m.x - L.side * 18, m.y - 6); ctx.transform(1, 0, -L.side * 0.35, 1.15, 0, 0);
    drawHero(ctx, m.hero || hero, 0, 0, m.facing || 1, { t: m.t || 0, run: m.run || 0, moving: !!m.moving }, null); ctx.restore();
  }
}

/* ---------- 4. depth of field: far layers softened ---------- */
function softenLayer(c) { const t = mkCanvas(c.width, c.height), g = t.getContext('2d'); g.globalAlpha = 1 / 5; for (const [dx, dy] of [[0, 0], [-2, 0], [2, 0], [0, -2], [0, 2]]) g.drawImage(c, dx, dy); return t; }
const _loadWorld6 = loadWorld;
loadWorld = function (id, at) { canopies.length = 0; _loadWorld6(id, at); if (LAYERS.ridge && LAYERS.ridge.width > 20) { LAYERS.ridge = softenLayer(LAYERS.ridge); LAYERS.hills = softenLayer(LAYERS.hills); } winCache.id = null; transition.t = 0.7; };

/* ---------- 5. weather that arrives instead of switching ---------- */
const wmix = { fog: 0, rain: 0, snow: 0 };
function updateWeatherMix(dt) { const k = Math.min(1, dt * 0.35); wmix.fog += ((weather === 1 ? 1 : 0) - wmix.fog) * k; wmix.rain += ((weather === 2 ? 1 : 0) - wmix.rain) * k; wmix.snow += ((weather === 3 ? 1 : 0) - wmix.snow) * k; }
const _updateWeather = updateWeather;
updateWeather = function (dt, tNow) { updateWeatherMix(dt); if (transition.t > 0) transition.t -= dt; if (mode !== 'drive') updateYard(dt); const w = weather; if (w === 2 && Math.random() > wmix.rain) weather = 0; if (w === 3 && Math.random() > wmix.snow) weather = 0; _updateWeather(dt, tNow); weather = w; };

/* ---------- 6. boss arenas get set dressing ---------- */
function drawArenaDressing() {
  if (!stage.active || !stage.door) return; const b = stage.door.boss, x0 = arena.x0, x1 = arena.x1, gy = WORLD.groundY;
  ctx.save();
  if (b === 'fogserver') { for (let k = 0; k < 6; k++) { const x = x0 + 80 + k * 130; ctx.fillStyle = '#1e2430'; rr(ctx, x, gy - 110, 46, 110, 4); ctx.fill(); for (let r = 0; r < 6; r++) { ctx.fillStyle = '#243447'; ctx.fillRect(x + 4, gy - 104 + r * 17, 38, 12); ctx.fillStyle = Math.sin(gameTime * 6 + k + r) > 0.6 ? '#7fe0a0' : '#2f4f6f'; ctx.fillRect(x + 36, gy - 101 + r * 17, 3, 3); } } }
  if (b === 'peachpit') { for (let k = 0; k < 8; k++) { const x = x0 + 60 + k * 100, h = 26 + (k % 3) * 26; for (let s = 0; s < h / 26; s++) { ctx.fillStyle = '#c9a56a'; ctx.fillRect(x, gy - 26 * (s + 1), 40, 24); ctx.fillStyle = '#f28c5a'; for (let j = 0; j < 3; j++) ctx.fillRect(x + 4 + j * 12, gy - 26 * (s + 1) + 6, 8, 8); } } ctx.strokeStyle = 'rgba(220,240,255,.4)'; ctx.lineWidth = 2; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x0, gy - 20 - k * 20); ctx.lineTo(x1, gy - 30 - k * 20); ctx.stroke(); } }
  if (b === 'drainpipe') { for (let k = 0; k < 5; k++) { const x = x0 + 100 + k * 150; ctx.fillStyle = '#2c3038'; rr(ctx, x - 30, gy - 6, 60, 6, 2); ctx.fill(); ctx.fillStyle = '#141826'; for (let j = 0; j < 6; j++) ctx.fillRect(x - 26 + j * 9, gy - 4, 4, 3); } ctx.strokeStyle = '#31506a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, gy - 130); ctx.lineTo(x1, gy - 130); ctx.stroke(); for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(x0 + 60 + k * 130, gy - 130); ctx.lineTo(x0 + 60 + k * 130, gy - 90); ctx.stroke(); } }
  if (b === 'snowdrift') { for (let k = 0; k < 7; k++) drawSnowbank(ctx, x0 + 20 + k * 110, gy, 90 + (k % 2) * 40); }
  if (b === 'gale') { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5; for (let k = 0; k < 8; k++) { const y = gy - 40 - k * 28; const off = (gameTime * 420 + k * 90) % (x1 - x0); ctx.beginPath(); ctx.moveTo(x0 + off, y); ctx.lineTo(x0 + off + 70, y + 2); ctx.stroke(); } for (let k = 0; k < 3; k++) { ctx.fillStyle = '#c8c8d0'; ctx.fillRect(x0 + 120 + k * 260, gy - 90, 4, 90); } }
  if (b === 'hydra') { for (let k = 0; k < 3; k++) { const x = x0 + 60 + k * 240; ctx.fillStyle = '#2c3038'; ctx.fillRect(x, gy - 26, 180, 8); ctx.fillStyle = '#e9d27a'; for (let j = 0; j < 8; j++) ctx.fillRect(x + ((gameTime * 40 + j * 24) % 180), gy - 25, 10, 3); ctx.fillStyle = '#c9a56a'; ctx.fillRect(x + ((gameTime * 40 + 40) % 180), gy - 46, 24, 20); } }
  if (b === 'crane') { for (let k = 0; k < 4; k++) { for (let s = 0; s < 1 + (k % 2); s++) { ctx.fillStyle = ['#c0392b', '#3c5fa6', '#e0a030', '#2f7f4f'][(k + s) % 4]; rr(ctx, x0 + 40 + k * 190, gy - 48 * (s + 1), 80, 46, 3); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.15)'; for (let j = 0; j < 8; j++) ctx.fillRect(x0 + 44 + k * 190 + j * 9, gy - 48 * (s + 1) + 2, 2, 42); } } }
  if (b === 'gate') { for (let k = 0; k < 6; k++) { const x = x0 + 40 + k * 130; ctx.strokeStyle = 'rgba(120,255,140,.25)'; ctx.lineWidth = 1.5; ctx.strokeRect(x, gy - 110, 60, 110); for (let r = 1; r < 4; r++) { ctx.beginPath(); ctx.moveTo(x, gy - r * 28); ctx.lineTo(x + 60, gy - r * 28); ctx.stroke(); } } }
  if (b === 'golem') { for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? '#c9a56a' : '#b8b0a0'; ctx.fillRect(x0 + 40 + k * 100, gy - 30, 50, 30); ctx.fillStyle = '#243447'; ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.fillText(k % 2 ? 'PHILLIPS' : 'CENTRAL', x0 + 65 + k * 100, gy - 12); } }
  if (b === 'queen') { for (let k = 0; k < 5; k++) { const x = x0 + 80 + k * 170; ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.ellipse(x, gy - 14, 22, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = rgba([255, 150, 60], 0.5 + 0.4 * Math.sin(gameTime * 3 + k)); ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = 'rgba(255,150,60,.6)'; ctx.fillRect(x - 3, gy - 18, 6, 4); } }
  ctx.restore(); ctx.textAlign = 'left';
}

/* ---------- 7. damage states before the wreck ---------- */
const _drawEnemy3 = drawEnemy;
drawEnemy = function (c, e) {
  _drawEnemy3(c, e);
  if (e.d.boss || e.d.cocoon || e.hp >= e.maxHp * 0.5) return;
  c.save(); c.translate(e.x, e.y); c.scale(e.facing, 1);
  const bad = e.hp < e.maxHp * 0.25;
  c.fillStyle = PLATE; c.save(); c.translate(-e.w / 2 + 4, -e.h * 0.5); c.rotate(0.6 + Math.sin(e.t * 7) * 0.15); c.fillRect(-4, 0, 8, e.h * 0.35); c.restore(); // hanging plate
  if (Math.sin(e.t * (bad ? 40 : 14)) > 0.7) { c.fillStyle = rgb(LED); c.fillRect(-2, -e.h - 4, 4, 3); }
  c.restore();
  if (Math.random() < (bad ? 0.35 : 0.12)) spawn({ k: 'spark', x: e.x + rnd(-e.w / 3, e.w / 3), y: e.y - rnd(0, e.h), vx: rnd(-90, 90), vy: rnd(-120, 20), life: 0.25, t: 0, c: [255, 220, 120] });
  if (bad && Math.random() < 0.08) spawn({ k: 'steam', x: e.x, y: e.y - e.h, vx: rnd(-6, 6), vy: -30, life: 0.8, t: 0, r: 4 });
};

/* ---------- 8. idle gestures ---------- */
const IDLE = { Bret: 'phone', Aaron: 'headset', Greg: 'count', Rianan: 'cat', Ash: 'cloud', Dave: 'terminal', John: 'clipboard', Umesh: 'envelope', Ryan: 'watch', Jose: 'plans', 'Brian S': 'pinball', 'Brian W': 'cactus', Andrew: 'ticket' };
const _drawHero2 = drawHero;
drawHero = function (c, ch, x, y, facing, pose, lit) {
  const idle = !pose.moving && !pose.air && !pose.big && !photo.active;
  if (idle) { pose = Object.assign({}, pose); pose.squash = (pose.squash || 1) * (1 + Math.sin((pose.t || 0) * 1.1 + x * 0.01) * 0.012); }
  _drawHero2(c, ch, x, y, facing, pose, lit);
  if (!idle || !IDLE[ch.name] || demo.active && false) return;
  const cycle = ((pose.t || 0) + x * 0.01) % 9; if (cycle > 1.6) return; // a 1.6-second gesture every 9 seconds
  c.save(); c.translate(x, y); c.scale(facing, 1); const k = IDLE[ch.name];
  c.fillStyle = '#1b1b1f';
  if (k === 'phone') { rr(c, 8, -36, 7, 12, 2); c.fill(); c.fillStyle = '#9ad8ff'; c.fillRect(9, -35, 5, 9); }
  else if (k === 'headset') { c.strokeStyle = '#222'; c.lineWidth = 2; c.beginPath(); c.arc(11, -53, 4, 0, Math.PI * 2); c.stroke(); }
  else if (k === 'count') { c.fillStyle = '#bdbdbd'; for (let f = 0; f < 3; f++) c.fillRect(10 + f * 3, -40 - (Math.floor(cycle * 3) > f ? 4 : 0), 2, 5); }
  else if (k === 'cat') { c.font = '10px system-ui'; c.fillStyle = '#f6ecd8'; c.fillText('♥', 12, -58); }
  else if (k === 'cloud') { c.fillStyle = '#cfe6ff'; c.beginPath(); c.arc(12, -44, 4, 0, Math.PI * 2); c.arc(17, -46, 5, 0, Math.PI * 2); c.fill(); }
  else if (k === 'terminal') { c.fillStyle = '#0a1a0e'; rr(c, 8, -40, 12, 9, 1); c.fill(); c.fillStyle = '#7fe0a0'; c.fillRect(10, -38, 6, 1); c.fillRect(10, -35, 4, 1); }
  else if (k === 'clipboard') { c.fillStyle = '#c9a56a'; rr(c, 8, -40, 9, 12, 1); c.fill(); c.fillStyle = '#fff'; c.fillRect(9, -38, 7, 9); }
  else if (k === 'envelope') { c.fillStyle = '#fff'; rr(c, 8, -38, 12, 8, 1); c.fill(); c.strokeStyle = '#c9a56a'; c.lineWidth = 1; c.beginPath(); c.moveTo(8, -38); c.lineTo(14, -33); c.lineTo(20, -38); c.stroke(); }
  else if (k === 'watch') { c.fillStyle = '#1b1b1f'; c.beginPath(); c.arc(11, -36, 3, 0, Math.PI * 2); c.fill(); c.fillStyle = '#7fe0a0'; c.fillRect(10, -37, 2, 2); }
  else if (k === 'plans') { c.fillStyle = '#e8e2d0'; c.save(); c.translate(12, -40); c.rotate(-0.4); rr(c, -2, -8, 4, 16, 2); c.fill(); c.restore(); }
  else if (k === 'pinball') { c.fillStyle = '#c8c8d0'; c.beginPath(); c.arc(12, -40 + Math.sin(cycle * 12) * 4, 3, 0, Math.PI * 2); c.fill(); }
  else if (k === 'cactus') { c.fillStyle = '#4f8f4a'; rr(c, 10, -46, 4, 12, 2); c.fill(); rr(c, 7, -42, 3, 5, 1.5); c.fill(); rr(c, 14, -40, 3, 5, 1.5); c.fill(); c.fillStyle = '#c9a56a'; c.fillRect(9, -34, 6, 3); }
  else if (k === 'ticket') { c.fillStyle = '#fff8d0'; rr(c, 8, -38, 12, 7, 1); c.fill(); c.fillStyle = '#c0392b'; c.fillRect(9, -37, 3, 5); }
  c.restore();
};

/* ---------- 9. dock activity: roll-up doors cycle, a yard forklift beeps past ---------- */
const yard = { fork: { x: 0, dir: 1, t: 0, beep: 0 }, doors: [0, 0, 0] };
function dockDoors() { return WORLD.id === 'easton' ? [[1760, 300], [2040, 300], [2320, 300]] : (WORLD.def && WORLD.def.steps && !['merge'].includes(WORLD.id)) ? [[1760, 300], [2080, 300]] : WORLD.id === 'taunton' ? [[1560, 300], [1860, 300]] : []; }
function updateYard(dt) {
  const f = yard.fork; f.t += dt; if (!f.started) { f.started = true; f.x = 1500 + rnd(0, 800); }
  if (WORLD.def && WORLD.def.steps || WORLD.id === 'easton' || WORLD.id === 'taunton') { f.x += f.dir * 55 * dt; if (f.x > 2500) f.dir = -1; if (f.x < 1450) f.dir = 1; f.beep -= dt; if (f.beep <= 0) f.beep = rnd(3, 7); }
  yard.doors = dockDoors().map((d, i) => 0.5 + 0.5 * Math.sin(gameTime * 0.25 + i * 2.1));
}
function drawYard(night) {
  const doors = dockDoors(); if (!doors.length) return;
  doors.forEach(([x, y], i) => { const open = yard.doors[i] > 0.6 ? Math.min(1, (yard.doors[i] - 0.6) / 0.25) : 0; if (open <= 0) return; ctx.fillStyle = '#0e131a'; ctx.fillRect(x + 2, y + 2 + 88 * (1 - open) * 0, 96, 88 * open); ctx.fillStyle = 'rgba(255,220,160,' + (0.18 * open) + ')'; ctx.fillRect(x + 2, y + 2, 96, 88 * open); ctx.fillStyle = '#c9a56a'; if (open > 0.7) { ctx.fillRect(x + 20, y + 60, 26, 28); ctx.fillRect(x + 54, y + 60, 26, 28); } });
  const f = yard.fork; if (!f.started) return; if (f.x < camera.x - 100 || f.x > camera.x + W + 100) return;
  ctx.save(); ctx.translate(f.x, 392 - 2); ctx.scale(f.dir * 0.55, 0.55); ctx.globalAlpha = 0.85;
  ctx.fillStyle = '#2c3038'; ctx.fillRect(24, -96, 6, 96); ctx.fillStyle = '#9aa0a8'; ctx.fillRect(28, -6, 30, 4); ctx.fillStyle = '#f2b544'; rr(ctx, -34, -34, 60, 30, 6); ctx.fill(); ctx.fillStyle = '#243447'; rr(ctx, -30, -58, 40, 26, 4); ctx.fill(); for (const wx of [-22, 10]) { ctx.fillStyle = '#1b1d22'; ctx.beginPath(); ctx.arc(wx, -8, 11, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = Math.floor(f.t * 3) % 2 ? '#ffb020' : '#7a5a10'; ctx.beginPath(); ctx.arc(-8, -64, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  if (f.beep > 6.5 || (f.beep < 0.3)) { ctx.fillStyle = 'rgba(16,26,46,.6)'; rr(ctx, f.x - 18, 392 - 70, 36, 14, 4); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 8px system-ui'; ctx.textAlign = 'center'; ctx.fillText('beep', f.x, 392 - 60); ctx.textAlign = 'left'; }
}

/* ---------- 10. transitions ---------- */
const transition = { t: 0 };
function drawTransition() { if (transition.t <= 0) return; const p = clamp(transition.t / 0.7, 0, 1); const r = (1 - p) * Math.hypot(W, H) * 0.6; ctx.save(); ctx.fillStyle = '#0a0d16'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(W / 2, H * 0.55, r, 0, Math.PI * 2, true); ctx.fill('evenodd'); ctx.restore(); }
const _failStage2 = failStage; failStage = function (r) { _failStage2(r); transition.t = 0.5; };

/* ---------- 11. title backdrop: 1938 → Easton, slow pan, dissolve ---------- */
const titleBg = { t: 0, world: 'prologue', x: 200, fade: 0 };
function titleTick(dt) {
  if (running) return;
  titleBg.t += dt; const per = 14; const phase = titleBg.t % (per * 2); const want = phase < per ? 'prologue' : 'easton';
  if (want !== titleBg.world) { titleBg.world = want; loadWorld(want, { x: want === 'prologue' ? 240 : 300, y: 440 }); hour = want === 'prologue' ? 15.5 : 18.6; timeAuto = false; titleBg.x = want === 'prologue' ? 200 : 300; setObjectives([]); }
  titleBg.x += 22 * dt; camera.x = clamp(titleBg.x, 0, WORLD.width - W); camera.y = 0; player.x = camera.x + W / 2; player.y = 440; player.inv = 99;
  const edge = Math.min(phase, per - phase); titleBg.fade = clamp(1 - edge / 1.2, 0, 1);
  gameTime += dt; updateAmbient(dt); updateParts(dt); updateWeather(dt, gameTime); if (WORLD.id === 'prologue') updateGregGhost(dt);
}
const _frame = frame;
frame = function (ts) {
  if (!running) { requestAnimationFrame(frame); if (!frame.last) frame.last = ts; const dt = Math.min(0.1, (ts - frame.last) / 1000); frame.last = ts; titleTick(dt); render(); if (titleBg.fade > 0) { ctx.fillStyle = 'rgba(16,26,46,' + titleBg.fade * 0.85 + ')'; ctx.fillRect(0, 0, W, H); } return; }
  _frame(ts);
};

/* ---------- 12. richer portrait cards ---------- */
const BIOS = { Rianan: 'SVP of IT. Holds the war room. Cat person.', Aaron: 'Infrastructure. Whitewater on weekends. The beard is perfect.', Bret: 'Hardware and infrastructure. New baby boy. Two dogs.', 'Brian S': 'Enterprise Systems. Builds pinball machines. World-ranked.', 'Brian W': 'Web developer. Grows cactus in the desert.', Umesh: 'OMS. Every 850 in the queue is his.', Dave: 'iSeries. Forty years of green screens.', John: 'Engineering lead. Old-school RPG — the batch kind.', Greg: 'Number scientist. Every department. Never in color.', Ryan: 'Dev manager. Checks the pipeline while he walks.', Jose: 'System architect. The diagram has a dragon now.', Ash: 'Salesforce genius. Built a flow for apologies.', Andrew: 'Head of IT Support. Runs the RFC meeting. Thursday stands.' };
function applyBios() {
  const s = document.createElement('style'); s.textContent = '.card { width: clamp(78px, 13.5vmin, 118px) !important; } .card .bio { font-size: clamp(7px, 1.25vmin, 9.5px); color:#8f9db3; line-height:1.2; margin-top:3px; min-height: 2.4em; } .card .w { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:4px; vertical-align:middle; }'; document.head && document.head.appendChild(s);
  const grid = document.getElementById('grid'); if (!grid) return;
  Array.from(grid.children).forEach((card, i) => { const ch = ROSTER[i]; if (!ch || !card.querySelector) return; const r = card.querySelector('.r'); if (r) { const w = weaponOf(ch); r.innerHTML = '<span class="w" style="background:' + (w ? rgb(w.color) : '#fff') + '"></span>' + (w ? w.name : ''); } const b = document.createElement('div'); b.className = 'bio'; b.textContent = BIOS[ch.name] || ch.role; card.appendChild(b); });
}
const _buildTitle = buildTitle; buildTitle = function () { _buildTitle(); try { applyBios(); } catch (e) { } };

/* ---------- 13. illustrated ledger cards ---------- */
function drawLedgerIcon(x, y, n) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#f2b544'; ctx.fillStyle = '#f2b544'; ctx.lineWidth = 1.5;
  const k = n % 6;
  if (k === 0) { ctx.fillRect(-16, -8, 22, 12); ctx.fillRect(6, -4, 10, 8); ctx.beginPath(); ctx.arc(-9, 6, 3.5, 0, Math.PI * 2); ctx.arc(9, 6, 3.5, 0, Math.PI * 2); ctx.fill(); } // truck
  else if (k === 1) { ctx.beginPath(); ctx.moveTo(-14, 10); ctx.lineTo(-14, -4); ctx.lineTo(0, -14); ctx.lineTo(14, -4); ctx.lineTo(14, 10); ctx.closePath(); ctx.stroke(); ctx.fillRect(-4, 0, 8, 10); } // store
  else if (k === 2) { rr(ctx, -12, -8, 24, 18, 3); ctx.fill(); ctx.fillStyle = '#7a3b2a'; ctx.fillRect(-9, -5, 18, 10); ctx.fillStyle = '#f2b544'; ctx.fillRect(-7, -3, 8, 1.5); ctx.fillRect(-7, 0, 5, 1.5); } // green screen
  else if (k === 3) { ctx.strokeRect(-14, -10, 28, 20); for (const [px, py] of [[-8, -4], [2, 2], [8, -6], [-2, 6]]) { ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill(); } } // map pins
  else if (k === 4) { rr(ctx, -10, -12, 20, 24, 4); ctx.fill(); ctx.fillStyle = '#7a3b2a'; ctx.fillRect(-7, -9, 14, 3); ctx.fillRect(-7, -3, 14, 3); ctx.fillRect(-7, 3, 10, 3); } // feed sack
  else { ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -7); ctx.moveTo(0, 0); ctx.lineTo(5, 3); ctx.stroke(); } // clock
  ctx.restore();
}
const _drawLedgerHUD2 = drawLedgerHUD;
drawLedgerHUD = function () { _drawLedgerHUD2(); if (ledger.flash > 0 && ledger.text) { const a = clamp(ledger.flash > 5 ? (6 - ledger.flash) : ledger.flash < 1 ? ledger.flash : 1, 0, 1); ctx.save(); ctx.globalAlpha = a; const n = LEDGER.findIndex(l => l[0] === ledger.text[0]); ctx.fillStyle = 'rgba(0,0,0,.25)'; rr(ctx, W / 2 - 292, 206, 52, 68, 6); ctx.fill(); drawLedgerIcon(W / 2 - 266, 240, n < 0 ? 0 : n); ctx.restore(); } };

/* ---------- 14. weather on characters ---------- */
const _drawHero3 = drawHero;
drawHero = function (c, ch, x, y, facing, pose, lit) {
  _drawHero3(c, ch, x, y, facing, pose, lit);
  if (WORLD.def && WORLD.def.indoor) return;
  const legLen = 18, torsoY = -legLen - 22, hy = torsoY - 12;
  if (snowAcc > 0.15 || wmix.snow > 0.3) { c.save(); c.translate(x, y); c.scale(facing, 1); c.fillStyle = 'rgba(240,245,255,' + (0.85 * Math.max(snowAcc, wmix.snow * 0.6)) + ')'; c.beginPath(); c.ellipse(-6, torsoY + 1, 6, 2.5, 0, 0, Math.PI * 2); c.ellipse(6, torsoY + 1, 6, 2.5, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(0, hy - 13, 11, 2.5, 0, 0, Math.PI * 2); c.fill(); c.restore(); }
  if (wmix.rain > 0.3) { c.save(); c.translate(x, y); c.scale(facing, 1); c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(200,220,255,' + (0.22 * wmix.rain) + ')'; rr(c, -9, torsoY + 2, 6, 20, 3); c.fill(); c.beginPath(); c.arc(-5, hy - 4, 5, Math.PI, Math.PI * 1.8); c.fill(); c.restore(); }
};

/* ---------- 15. A+ is in the world: flickering terminals, a scanline sweep at the Merge, eyes in the dark ---------- */
function drawAplusPresence(night) {
  if (restored[WORLD.id] || ['prologue', 'show', 'past'].includes(WORLD.id)) return;
  const cx = camera.x, cy = camera.y;
  if (WORLD.id === 'merge') { const y = (gameTime * 60) % (H + 40) - 20; ctx.fillStyle = rgba(LED, 0.08); ctx.fillRect(0, y, W, 6); ctx.fillStyle = rgba(LED, 0.03); ctx.fillRect(0, y - 30, W, 60); }
  if (night > 0.4) { for (let k = 0; k < 4; k++) { const ex = Math.floor(cx / 600) * 600 + k * 600 + ((k * 7919) % 400); const gy = groundYAt(ex); const blink = Math.sin(gameTime * 1.7 + k * 2.3) > 0.85; if (!blink) { const L = nearestLight(ex, gy - 20, night); if (L.i > 0.6 && night < 0.7) continue; ctx.fillStyle = rgba(LED, 0.75 * night); ctx.fillRect(ex - cx - 4, gy - 14 - cy, 3, 2); ctx.fillRect(ex - cx + 2, gy - 14 - cy, 3, 2); } } }
  // lockout terminal + RFC board flicker
  if (lockout.active && lockout.barrier && Math.sin(gameTime * 13) > 0.8) { ctx.fillStyle = rgba(LED, 0.35); ctx.fillRect(lockout.terminal - cx - 11, groundYAt(lockout.terminal) - 56 - cy, 22, 18); }
}

/* ---------- hooks ---------- */
const _render = render;
render = function () {
  _render();
  drawTransition();
};
// insert world-space passes: after the play layer (yard, arena dressing, windows, wall shadows) and after actors (sway, presence)
const _drawStoryLayer2 = drawStoryLayer;
drawStoryLayer = function (night) { const sk = skyAt(hour); drawYard(night); drawArenaDressing(); ctx.save(); ctx.translate(camera.x, camera.y); drawWindows(sk, night); ctx.restore(); drawWallShadows(night); _drawStoryLayer2(night); };
const _drawStoryFront2 = drawStoryFront;
drawStoryFront = function () { _drawStoryFront2(); drawSway(); ctx.save(); ctx.translate(camera.x, camera.y); drawAplusPresence(nightness(hour)); ctx.restore(); };
