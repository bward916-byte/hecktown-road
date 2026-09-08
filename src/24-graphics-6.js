
/* =====================================================================
   GRAPHICS VI (M22)
   ===================================================================== */
const BUILDINGS = () => WORLD.id === 'easton' ? [[560, 236, 840, 204], [1400, 226, 1700, 214]] : WORLD.id === 'taunton' ? [[940, 236, 480, 204], [1420, 226, 900, 214]] : (WORLD.def && WORLD.def.steps && WORLD.id !== 'merge') ? [[1140, 236, 460, 204], [1600, 226, 1000, 214]] : WORLD.id === 'merge' ? [[2700, 220, 700, 220]] : [];
function sunInfo() { const up = hour > 5.8 && hour < 18.6; const a = ((hour - 6) / 12.6) * Math.PI; return { up, a, dir: Math.cos(a), low: 1 - Math.abs(Math.sin(a)) }; }

/* 1. building shadows */
function drawBuildingShadows() { const s = sunInfo(); if (!s.up || WORLD.def.indoor) return; const gy = WORLD.groundY; const len = 40 + s.low * 260; const dir = -Math.sign(s.dir || 1); ctx.fillStyle = 'rgba(0,0,0,' + (0.12 + s.low * 0.08) + ')'; for (const [x, y, w, h] of BUILDINGS()) { const ex = dir > 0 ? x + w : x; ctx.beginPath(); ctx.moveTo(ex, gy); ctx.lineTo(ex + dir * len, gy); ctx.lineTo(ex + dir * len, gy + 60); ctx.lineTo(ex, gy + 60); ctx.closePath(); ctx.fill(); } }

/* 2. fog bands between the layers */
function drawFogBands() { if (wmix.fog < 0.05 || WORLD.def.indoor) return; const gy = WORLD.groundY - camera.y; for (let k = 0; k < 3; k++) { const par = 0.5 + k * 0.25; const off = (-camera.x * par + gameTime * 8 * (k + 1)) % 600; const y = gy - 120 + k * 40; ctx.fillStyle = 'rgba(225,232,240,' + (0.10 * wmix.fog) + ')'; for (let x = off - 600; x < W + 600; x += 600) { ctx.beginPath(); ctx.ellipse(x + 300, y, 320, 22 + k * 8, 0, 0, Math.PI * 2); ctx.fill(); } } }

/* 3. light shafts in the warehouse */
const _drawInterior = drawInterior; drawInterior = function () { _drawInterior(); if (!stage.active || !arena.active) return; ctx.save(); ctx.beginPath(); ctx.rect(arena.x0 - camera.x, 0, arena.x1 - arena.x0, WORLD.groundY - camera.y); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; for (let x = Math.floor((arena.x0 - camera.x) / 120) * 120; x < W; x += 120) { const g = ctx.createLinearGradient(x + 20, 60, x - 60, WORLD.groundY - camera.y); g.addColorStop(0, 'rgba(255,240,210,.16)'); g.addColorStop(1, 'rgba(255,240,210,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x + 40, 60); ctx.lineTo(x - 40, WORLD.groundY - camera.y); ctx.lineTo(x - 100, WORLD.groundY - camera.y); ctx.closePath(); ctx.fill(); } ctx.restore(); if (Math.random() < 0.5) spawn({ k: 'mote', x: arena.x0 + rnd(0, arena.x1 - arena.x0), y: rnd(120, 400), vx: rnd(-4, 4), vy: rnd(-6, 2), life: rnd(2, 4), t: 0, c: [255, 240, 210] }); };

/* 4. per-world grade */
const GRADE = { taunton: [90, 160, 170], spartanburg: [230, 170, 90], plantcity: [230, 150, 110], lansing: [120, 150, 200], billings: [200, 190, 150], portland: [110, 140, 130], sacramento: [240, 170, 130], aurora: [150, 170, 220], merge: [170, 140, 200], easton: [230, 200, 150] };
function drawGrade() { const g = GRADE[WORLD.id]; if (!g || WORLD.def.sepia || WORLD.def.mono) return; ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = rgba(g, 0.10); ctx.fillRect(0, 0, W, H); ctx.restore(); }

/* 5. golden-hour rim */
const _drawHero6 = drawHero;
drawHero = function (c, ch, x, y, facing, pose, lit) { _drawHero6(c, ch, x, y, facing, pose, lit); const s = sunInfo(); if (!s.up || s.low < 0.55 || WORLD.def.indoor || WORLD.def.mono || c !== ctx) return; const side = Math.sign(s.dir || 1); c.save(); c.translate(x, y); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba([255, 200, 120], 0.35 * (s.low - 0.5) * 2); c.lineWidth = 1.5; c.beginPath(); c.arc(side * 2, -52, 12.5, side > 0 ? -1.2 : Math.PI - 0.6, side > 0 ? 0.6 : Math.PI + 1.2); c.stroke(); c.beginPath(); c.moveTo(side * 10, -40); c.lineTo(side * 11, -20); c.stroke(); c.restore(); };

/* 6. emissive signage */
function drawEmissiveSigns(night) { if (night < 0.15) return; const on = hour > 18.4 || hour < 6.2; if (!on) return; const flick = (hour > 18.4 && hour < 18.7) ? (Math.sin(gameTime * 40) > 0.3 ? 1 : 0.2) : 1; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const signs = WORLD.id === 'easton' ? [[1150, 236, 240, 46, [242, 181, 68]]] : WORLD.id === 'taunton' ? [[1050, 242, 240, 40, [242, 181, 68]]] : (WORLD.def.steps && WORLD.id !== 'merge') ? [[1250, 242, 240, 40, [242, 181, 68]]] : [];
  if (WORLD.id === 'spartanburg') signs.push([666, WORLD.groundY - 84, 68, 26, [255, 120, 160]]);
  for (const [x, y, w, h, col] of signs) { const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 4, x + w / 2, y + h / 2, w * 0.7); g.addColorStop(0, rgba(col, 0.28 * night * flick)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - w * 0.4, y - h, w * 1.8, h * 3); }
  const dockPlates = WORLD.id === 'easton' ? [1794, 2074, 2354] : WORLD.id === 'taunton' ? [1594, 1894] : (WORLD.def.steps && WORLD.id !== 'merge') ? [1794, 2114] : []; for (const px of dockPlates) { ctx.fillStyle = rgba([255, 230, 120], 0.35 * night * flick); ctx.fillRect(px - 2, 272, 36, 24); }
  ctx.restore(); }

/* 7. ground decals + 8. material texture (baked once) */
function bakeDecals(g, id) {
  if (['prologue', 'past', 'show'].includes(id)) return; const gy = WORLD.groundY;
  const docks = WORLD.id === 'easton' ? [1760, 2040, 2320] : WORLD.id === 'taunton' ? [1560, 1860] : (WORLD.def.steps && WORLD.id !== 'merge') ? [1760, 2080] : [];
  for (const dx of docks) { g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 3; for (const off of [-30, 30]) { g.beginPath(); g.moveTo(dx + 50 + off, gy + 8); g.quadraticCurveTo(dx + 50 + off + 12, gy + 40, dx + 50 + off + 6, gy + 80); g.stroke(); } g.fillStyle = 'rgba(20,20,30,.22)'; g.beginPath(); g.ellipse(dx + 60, gy + 30, 22, 8, 0.3, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,.35)'; for (let x = 1450; x < 3100; x += 90) g.fillRect(x, gy + 46, 2, 40); // lot lines
  g.fillStyle = 'rgba(200,200,200,.35)'; g.fillRect(0, gy + 88, WORLD.width, 3); // curb
  for (const [x, y, w, h] of BUILDINGS()) { g.save(); g.globalAlpha = 0.08; g.strokeStyle = '#000'; g.lineWidth = 1; if (y === 236) { for (let yy = y + 6; yy < y + h; yy += 8) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); for (let xx = x + ((yy / 8) % 2) * 12; xx < x + w; xx += 24) g.fillRect(xx, yy - 8, 1, 8); } } else { for (let xx = x + 4; xx < x + w; xx += 6) { g.beginPath(); g.moveTo(xx, y + 8); g.lineTo(xx, y + h); g.stroke(); } } g.restore(); }
}
const _loadWorld16 = loadWorld; loadWorld = function (id, at) { _loadWorld16(id, at); if (layerCache[id] && !layerCache[id].decals) { bakeDecals(LAYERS.play.getContext('2d'), id); layerCache[id].decals = true; } };

/* 9. animated water */
function drawWaterMotion() { const ws = WORLD.def.water; if (!ws || WORLD.id === 'show') return; for (const w of ws) { for (let k = 0; k < 4; k++) { const y = w.y + 4 + k * 10; ctx.strokeStyle = 'rgba(220,235,255,' + (0.35 - k * 0.07) + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let x = w.x0; x <= w.x1; x += 12) { const yy = y + Math.sin(x * 0.05 + gameTime * 2.2 + k) * 2; if (x === w.x0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke(); } const s = sunInfo(); if (s.up) for (let i = 0; i < 12; i++) { const x = w.x0 + ((i * 7919) % (w.x1 - w.x0)); const tw = Math.sin(gameTime * 6 + i * 1.7); if (tw > 0.7) { ctx.fillStyle = 'rgba(255,255,240,.8)'; ctx.fillRect(x, w.y + 6 + (i % 4) * 9, 2, 2); } } } }

/* 10. rain on surfaces */
function updateRainSurfaces(dt) { if (wmix.rain < 0.3 || WORLD.def.indoor) return; const docks = WORLD.id === 'easton' ? [[1720, 2320, 392]] : WORLD.id === 'taunton' ? [[1520, 2080, 392]] : (WORLD.def.steps && WORLD.id !== 'merge') ? [[1720, 2320, 392]] : []; if (WORLD.truckX > 0) docks.push([WORLD.truckX, WORLD.truckX + 420, 288]); for (const [x0, x1, y] of docks) if (Math.random() < dt * 18 * wmix.rain && Math.abs((x0 + x1) / 2 - camera.x - W / 2) < W) spawn({ k: 'ring', x: x0 + rnd(0, x1 - x0), y, life: 0.4, t: 0 }); if (Math.random() < dt * 6 * wmix.rain) { const dx = WORLD.truckX > 0 && Math.random() < 0.5 ? WORLD.truckX + rnd(0, 420) : (docks[0] ? docks[0][0] + rnd(0, 600) : camera.x + rnd(0, W)); const dy = WORLD.truckX > 0 && dx > WORLD.truckX && dx < WORLD.truckX + 420 ? 380 : 400; spawn({ k: 'drip', x: dx, y: dy, vy: 0, life: 1, t: 0 }); } }
const _updateParts2 = updateParts; updateParts = function (dt) { for (const p of parts) { if (p.k === 'ring') p.t += dt; if (p.k === 'drip') { p.vy += G * dt; p.y += p.vy * dt; p.t += dt; if (p.y >= groundYAt(p.x)) { p.t = 99; spawn({ k: 'ring', x: p.x, y: groundYAt(p.x), life: 0.3, t: 0 }); } } } _updateParts2(dt); };
function drawRainSurfaces() { for (const p of parts) { if (p.k === 'ring') { const a = 1 - p.t / p.life; ctx.strokeStyle = 'rgba(220,235,255,' + (0.5 * a) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(p.x, p.y, 3 + 10 * (1 - a), 1 + 3 * (1 - a), 0, 0, Math.PI * 2); ctx.stroke(); } else if (p.k === 'drip') { ctx.fillStyle = 'rgba(200,220,255,.8)'; ctx.fillRect(p.x, p.y, 1.5, 4); } } }

/* 11. snow piles that build */
function drawSnowPiles() { if (snowAcc < 0.1) return; const gy = WORLD.groundY; for (const [x, y, w, h] of BUILDINGS()) { for (const ex of [x, x + w]) { const dir = ex === x ? -1 : 1; const hgt = 6 + snowAcc * 26; ctx.fillStyle = '#f2f5ff'; ctx.beginPath(); ctx.moveTo(ex, gy); ctx.lineTo(ex, gy - hgt); ctx.quadraticCurveTo(ex + dir * hgt * 1.2, gy - hgt * 0.7, ex + dir * hgt * 2.6, gy); ctx.closePath(); ctx.fill(); } } for (const q of quickProps) { const hgt = 3 + snowAcc * 10; ctx.fillStyle = '#f2f5ff'; ctx.beginPath(); ctx.ellipse(q.x, gy - (q.kind === 'vending' ? 60 : q.kind === 'board' ? 90 : 36), 16, hgt * 0.5, 0, Math.PI, 0); ctx.fill(); } }

/* 12. weapon trails + 13. shockwaves */
const _renderCombatFront2 = renderCombatFront;
renderCombatFront = function (night) {
  _renderCombatFront2(night);
  ctx.save(); ctx.translate(-camera.x, -camera.y); ctx.globalCompositeOperation = 'lighter';
  for (const p of projs) { if (p.k === 'dart' && p.px !== undefined) { ctx.strokeStyle = rgba(p.c, 0.5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x - p.vx * 0.04, p.y - p.vy * 0.04); ctx.lineTo(p.x, p.y); ctx.stroke(); } else if (p.k === 'homing') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.t * 20) * 0.35); ctx.fillStyle = rgba(p.c, 0.35); ctx.fillRect(-7, -2, 14, 4); ctx.restore(); } else if (p.k === 'lob') { for (let k = 1; k <= 2; k++) { ctx.strokeStyle = rgba(p.c, 0.18 / k); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, (p.big ? 18 : 9) + k * 5 + Math.sin(gameTime * 30 + k) * 2, 0, Math.PI * 2); ctx.stroke(); } } }
  for (const b of beams) if (b.bolt && b.x1 !== undefined) { ctx.strokeStyle = rgba(b.c, 0.5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(b.x1, b.y1); for (let k = 1; k < 6; k++) { const t = k / 6; ctx.lineTo(b.x1 + (b.x2 - b.x1) * t + rnd(-6, 6), b.y1 + (b.y2 - b.y1) * t + rnd(-6, 6)); } ctx.lineTo(b.x2, b.y2); ctx.stroke(); }
  for (const p of parts) if (p.k === 'shock') { const a = 1 - p.t / p.life; ctx.strokeStyle = rgba(p.c, a * 0.8); ctx.lineWidth = 2 + p.big * 2; ctx.beginPath(); ctx.arc(p.x, p.y, p.R * (1 - a * a), 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
  ctx.save(); ctx.translate(-camera.x, -camera.y); for (const p of parts) if (p.k === 'crack') { const a = 1 - p.t / p.life; ctx.strokeStyle = 'rgba(20,20,30,' + (0.6 * a) + ')'; ctx.lineWidth = 1.5; for (let k = 0; k < 6; k++) { const an = k / 6 * Math.PI * 2 + p.seed; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + Math.cos(an) * 30, p.y + Math.sin(an) * 6); ctx.lineTo(p.x + Math.cos(an + 0.3) * 48, p.y + Math.sin(an + 0.3) * 9); ctx.stroke(); } } ctx.restore();
};
const _damageEnemy6 = damageEnemy; damageEnemy = function (e, dmg, fromX, src) { const ok = _damageEnemy6(e, dmg, fromX, src); if (ok && dmg >= 6) spawn({ k: 'shock', x: e.x, y: e.y - e.h / 2, R: 20 + dmg * 3, life: 0.35, t: 0, c: [255, 255, 255], big: dmg >= 12 ? 1 : 0 }); return ok; };
const _updateShooter2 = updateShooter; updateShooter = function (sh, dt, isLeader) { const before = summons.length; _updateShooter2(sh, dt, isLeader); for (let i = before; i < summons.length; i++) if (summons[i].k === 'slam') spawn({ k: 'crack', x: summons[i].x, y: summons[i].y, life: 3, t: 0, seed: rnd(0, 6) }); };
const _updateParts3 = updateParts; updateParts = function (dt) { for (const p of parts) if (p.k === 'shock' || p.k === 'crack') p.t += dt; _updateParts3(dt); };

/* 14. dialog focus */
const _render5 = render;
render = function () { if (talk.open && talk.npc && mode === 'world' && !demo.active) { const z = 1.04; const fx = talk.npc.x - camera.x, fy = talk.npc.y - 40 - camera.y; ctx.save(); ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy); _render5(); ctx.restore(); const vg = ctx.createRadialGradient(fx, fy, 120, fx, fy, 700); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,10,30,.35)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, H * 0 + 0, 0); ctx.fillRect(0, 0, W, H - 200); return; } _render5(); };

/* 15. boss spotlights */
function drawSpotlights() { if (!stage.active || stage.step !== 2 || !arena.boss || arena.boss.dead) return; const n = 3; const on = bossIntro.t > 0 ? Math.floor((3.2 - bossIntro.t) / 0.5) : n; ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < Math.min(n, on); k++) { const sx = arena.x0 + (k + 0.5) * (arena.x1 - arena.x0) / n; const tx = bossIntro.t > 0 ? sx : arena.boss.x; const g = ctx.createLinearGradient(sx, 0, tx, WORLD.groundY); g.addColorStop(0, 'rgba(255,240,210,.22)'); g.addColorStop(1, 'rgba(255,240,210,.02)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx - 12, 0); ctx.lineTo(sx + 12, 0); ctx.lineTo(tx + 70, WORLD.groundY); ctx.lineTo(tx - 70, WORLD.groundY); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(sx - 6, 0, 12, 6); } ctx.restore(); }

/* 16. near-ground parallax strip */
let nearStrip = null;
function bakeNear() { const w = 1200, h = 40, c = mkCanvas(w, h), g = c.getContext('2d'); for (let i = 0; i < 90; i++) { const x = (i * 7919) % w, y = 18 + (i * 31) % 18; g.fillStyle = i % 3 ? 'rgba(90,80,60,.9)' : 'rgba(120,110,80,.9)'; g.beginPath(); g.ellipse(x, y, 3 + (i % 3), 2 + (i % 2), 0, 0, Math.PI * 2); g.fill(); } g.strokeStyle = 'rgba(100,140,70,.9)'; g.lineWidth = 2; for (let x = 0; x < w; x += 14) { g.beginPath(); g.moveTo(x, 40); g.quadraticCurveTo(x + 3, 24, x + 6, 10 + (x % 5) * 3); g.stroke(); } return c; }
function drawNearStrip() { if (WORLD.def.indoor || WORLD.def.sepia) return; if (!nearStrip) nearStrip = bakeNear(); const w = nearStrip.width; let fx = (-camera.x * 1.05) % w; if (fx > 0) fx -= w; const y = WORLD.groundY - camera.y + 60; for (let k = 0; k < 3; k++) ctx.drawImage(nearStrip, fx + k * w, y); }

/* 18. cab interior on the drive */
const _renderDrive3 = renderDrive; renderDrive = function () { _renderDrive3(); const night = nightness(hour); const wx = 120 + 420 + 30, wy = 270 + 12 + drive.hop; if (night > 0.3) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(wx + 14, wy + 20, 2, wx + 14, wy + 20, 22); g.addColorStop(0, rgba([120, 200, 255], 0.35 * night)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(wx - 10, wy - 10, 50, 44); ctx.restore(); } if (weather === 2) { ctx.save(); ctx.translate(wx + 14, wy + 26); ctx.rotate(Math.sin(gameTime * 6) * 0.9 - 0.3); ctx.strokeStyle = '#1b1b1f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -22); ctx.stroke(); ctx.restore(); } };

/* 19. distant dock activity */
const farDock = { x: 0, dir: 1 };
function drawFarDocks(night) { if (!(WORLD.id === 'easton' || (WORLD.def.steps && WORLD.id !== 'merge'))) return; farDock.x += farDock.dir * 0.3; if (farDock.x > 40) farDock.dir = -1; if (farDock.x < 0) farDock.dir = 1; const par = 0.45; const bx = 2600 - camera.x * par, by = 330 - camera.y * 0.25; ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = '#243447'; for (let k = 0; k < 3; k++) { const x = bx + k * 150 + (k === 1 ? farDock.x : 0); ctx.fillRect(x, by - 34, 90, 30); ctx.fillStyle = '#c0392b'; ctx.fillRect(x + 90, by - 24, 18, 20); ctx.fillStyle = '#1b1d22'; ctx.beginPath(); ctx.arc(x + 20, by - 2, 5, 0, Math.PI * 2); ctx.arc(x + 100, by - 2, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#243447'; } ctx.fillStyle = '#f2b544'; const fx = bx + 320 + Math.sin(gameTime * 0.7) * 60; ctx.fillRect(fx, by - 14, 16, 12); ctx.restore(); }

/* 20. title letters drop in; credits ribbon */
(function () { const h1 = document.querySelector && document.querySelector('#title h1'); if (!h1 || !h1.textContent) return; const txt = h1.textContent; h1.textContent = ''; [...txt].forEach((ch, i) => { const s = document.createElement('span'); s.textContent = ch === ' ' ? '\u00a0' : ch; s.style.cssText = 'display:inline-block;animation:dropIn .6s cubic-bezier(.2,1.4,.4,1) both;animation-delay:' + (i * 0.06) + 's'; h1.appendChild(s); }); const st = document.createElement('style'); st.textContent = '@keyframes dropIn { from { transform: translateY(-40px); opacity:0 } to { transform: translateY(0); opacity:1 } }'; document.head && document.head.appendChild(st); })();
const RIBBON = ['Rianan', 'Aaron', 'Bret', 'Brian S', 'Brian W', 'Umesh', 'Dave', 'John', 'Greg Schreiner', 'Ryan', 'Jose', 'Ash', 'Andrew', 'Pam', 'Melissa', 'Nick', 'Jessica', 'Kim', 'Ashley', 'Jennifer', 'Josh', 'Stephanie', 'Wendy', 'Michelle', 'Jenna', 'Marc', 'Michael', 'Kaler', 'Frank', 'Rosa', 'Sal', 'Dot', 'Cap\'n Reyes', 'Dr. Okafor', 'Nadia', 'Grace', 'Marcus', 'Wei', 'Blaine', 'Chuck', 'the office dog', 'Biscuit', 'Milo'];
const _drawEnding5 = drawEnding; drawEnding = function () { _drawEnding5(); if (!ending.active) return; ctx.save(); ctx.font = '12px system-ui, sans-serif'; ctx.fillStyle = 'rgba(246,236,216,.75)'; ctx.textAlign = 'left'; const line = RIBBON.join('   ·   ') + '   ·   '; const tw = ctx.measureText(line).width; let x = -((ending.t * 60) % tw); ctx.fillText(line + line, x, H - 14); ctx.restore(); };

/* fix: heat shimmer sampled the backing store in logical pixels */
drawHeat = function () { if (!['spartanburg', 'plantcity', 'billings', 'sacramento'].includes(WORLD.id) || hour < 10 || hour > 17 || weather === 2) return; const k = scale * dpr; const gy = WORLD.groundY - camera.y; ctx.save(); ctx.globalAlpha = 0.07; for (let i = 0; i < 6; i++) { const y = gy - 6 - i * 9 + Math.sin(gameTime * 3 + i) * 2; ctx.drawImage(canvas, 0, y * k, W * k, 6 * k, Math.sin(gameTime * 5 + i * 1.3) * 2, y, W, 6); } ctx.restore(); };

/* hooks */
const _drawStoryLayer6 = drawStoryLayer; drawStoryLayer = function (night) { drawBuildingShadows(); drawSnowPiles(); drawWaterMotion(); drawRainSurfaces(); _drawStoryLayer6(night); drawSpotlights(); ctx.save(); ctx.translate(camera.x, camera.y); drawFogBands(); drawFarDocks(night); ctx.restore(); };
const _drawStoryFront7 = drawStoryFront; drawStoryFront = function () { _drawStoryFront7(); ctx.save(); ctx.translate(camera.x, camera.y); drawNearStrip(); ctx.restore(); };
const _drawEmissive2 = drawEmissive; drawEmissive = function (cx, cy, night) { _drawEmissive2(cx, cy, night); ctx.save(); ctx.translate(-cx, -cy); drawEmissiveSigns(night); ctx.restore(); };
const _updateAplus8 = updateAplus; updateAplus = function (dt) { _updateAplus8(dt); updateRainSurfaces(dt); };
const _drawLedgerHUD5 = drawLedgerHUD; drawLedgerHUD = function () { drawGrade(); _drawLedgerHUD5(); };
