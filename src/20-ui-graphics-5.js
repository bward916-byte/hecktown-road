
/* =====================================================================
   UI / GRAPHICS V (M18)
   ===================================================================== */

/* ---------- 1. declutter ---------- */
BTN.forEach(b => { if (b.id === 'weather' || b.id === 'time') b.when = () => DEV; });
function topBusy() { return !!aplus.cur || (stage.active && stage.step === 2); }
const _drawMinimap = drawMinimap; drawMinimap = function () { if (stage.active || aplus.cur || talk.open) return; _drawMinimap(); };
// the tip card yields to the A+ card and the status banner; the status banner pauses under an A+ card instead of vanishing
const _tipFor = tipFor; tipFor = function (o) { if (aplus.cur || restoredBanner.t > 0 || stage.active) return null; return _tipFor(o); };
const _drawStageHUD2 = drawStageHUD; drawStageHUD = function () { if (aplus.cur && restoredBanner.t > 0) { const keep = restoredBanner.t; restoredBanner.t = 0; _drawStageHUD2(); restoredBanner.t = keep; return; } _drawStageHUD2(); };
const _drawCrewHUD2 = drawCrewHUD; drawCrewHUD = function () { if (packUI.banner > 0 && (aplus.cur || restoredBanner.t > 0)) { const keep = packUI.banner; packUI.banner = 0; _drawCrewHUD2(); packUI.banner = keep; return; } _drawCrewHUD2(); };

/* ---------- 2. bigger world text ---------- */
(function () { const b = document.createElement('style'); b.textContent = ''; })();
// patch the small-font world labels: NPC plates and prompts render larger through a font interceptor
const SMALL_FONT_BUMP = { 'bold 9px system-ui, sans-serif': 'bold 11px system-ui, sans-serif', 'bold 10px system-ui, sans-serif': 'bold 12px system-ui, sans-serif', 'bold 9px monospace': 'bold 11px monospace', 'bold 8px system-ui, sans-serif': 'bold 10px system-ui, sans-serif', 'bold 7px monospace': 'bold 9px monospace' };
(function () { try { const desc = Object.getOwnPropertyDescriptor(mainCtx, 'font'); if (!desc || !desc.set) return; Object.defineProperty(mainCtx, 'font', { get() { return desc.get.call(this); }, set(v) { desc.set.call(this, SMALL_FONT_BUMP[v] || v); } }); } catch (e) { } })();

/* ---------- 3. safe-area padding ---------- */
(function () { const s = document.createElement('style'); s.textContent = '#stage { padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); box-sizing: border-box; }'; document.head && document.head.appendChild(s); try { const ro = () => resize(); window.addEventListener('resize', ro); } catch (e) { } })();

/* ---------- 4. smart camera: pull back in boss fights ---------- */
const bossZoom = { z: 1 };
const _render3 = render;
render = function () {
  const want = (stage.active && stage.step === 2 && arena.boss && !arena.boss.dead) ? 0.9 : 1; bossZoom.z += (want - bossZoom.z) * 0.06;
  if (Math.abs(bossZoom.z - 1) < 0.005 || mode !== 'world') { _render3(); return; }
  ctx.save(); ctx.fillStyle = '#0a0d16'; ctx.fillRect(0, 0, W, H); ctx.translate(W / 2, H / 2); ctx.scale(bossZoom.z, bossZoom.z); ctx.translate(-W / 2, -H / 2); _render3(); ctx.restore();
};

/* ---------- 5. hit-stop ---------- */
const hitstop = { t: 0, pulse: 0 };
const _damageEnemy5 = damageEnemy;
damageEnemy = function (e, dmg, fromX, src) { const before = e.hp; const ok = _damageEnemy5(e, dmg, fromX, src); if (ok && e.d.boss && (dmg >= 8 || superState.active > 0 || before - e.hp >= 12)) { hitstop.t = 0.05; hitstop.pulse = 0.12; } return ok; };
const _update2 = update; update = function (dt) { if (hitstop.t > 0) { hitstop.t -= dt; return; } if (hitstop.pulse > 0) hitstop.pulse -= dt; _update2(dt); };
const _render4 = render; render = function () { if (hitstop.pulse > 0 && mode === 'world') { const z = 1 + 0.03 * (hitstop.pulse / 0.12); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); _render4(); ctx.restore(); return; } _render4(); };

/* ---------- 6. machines squash on hit and skid ---------- */
const _drawEnemy4 = drawEnemy;
drawEnemy = function (c, e) {
  if (e.hit > 0 && !e.d.boss) { if (!e.skidded) { e.skidded = true; puff(e.x, e.y, 3); } c.save(); c.translate(e.x, e.y); const k = e.hit / 0.12; c.scale(1 + 0.18 * k, 1 - 0.16 * k); c.translate(-e.x, -e.y); _drawEnemy4(c, e); c.restore(); return; }
  e.skidded = false; _drawEnemy4(c, e);
};

/* ---------- 7. dash speed lines ---------- */
const _drawStoryFront5 = drawStoryFront;
drawStoryFront = function () {
  _drawStoryFront5();
  if (player.dashT > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(weaponOf(hero).color, 0.5); ctx.lineWidth = 2; for (let k = 0; k < 5; k++) { const y = player.y - 12 - k * 9 + Math.sin(gameTime * 40 + k) * 2; ctx.beginPath(); ctx.moveTo(player.x - player.facing * (18 + k * 6), y); ctx.lineTo(player.x - player.facing * (60 + k * 14), y); ctx.stroke(); } ctx.restore(); }
  // 8. off-screen machine indicators during fights
  if (story.weaponsOnline && (waveState.alive > 0)) { ctx.save(); ctx.translate(camera.x, camera.y); for (const e of enemies) { if (e.dead || e.d.boss || e.d.cocoon) continue; const sx = e.x - camera.x; if (sx > -20 && sx < W + 20) continue; const right = sx >= W; const ex = right ? W - 14 : 14, ey = clamp(e.y - camera.y - 20, 110, H - 130); ctx.fillStyle = rgba([255, 90, 60], 0.55 + 0.3 * Math.sin(gameTime * 8)); ctx.beginPath(); ctx.moveTo(ex + (right ? 6 : -6), ey); ctx.lineTo(ex - (right ? 6 : -6), ey - 6); ctx.lineTo(ex - (right ? 6 : -6), ey + 6); ctx.closePath(); ctx.fill(); } ctx.restore(); }
};

/* ---------- 9. painted skies per world ---------- */
const CLOUD_STYLE = { spartanburg: 'thunder', portland: 'thunder', taunton: 'mackerel', sacramento: 'mackerel', aurora: 'lenticular', billings: 'lenticular', lansing: 'low', plantcity: 'cumulus' };
function bakeClouds(style) {
  const w = 1800, h = 200, c = mkCanvas(w, h), g = c.getContext('2d');
  const puff = (px, py, r, a) => { const rg = g.createRadialGradient(px, py, r * 0.2, px, py, r); rg.addColorStop(0, 'rgba(255,255,255,' + a + ')'); rg.addColorStop(0.7, 'rgba(255,255,255,' + (a * 0.7) + ')'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.beginPath(); g.arc(px, py, r, 0, Math.PI * 2); g.fill(); };
  if (style === 'thunder') { for (const [x, y] of [[300, 120], [900, 110], [1500, 130]]) { for (let k = 0; k < 6; k++) puff(x + k * 26 - 60, y - k * 18, 60 - k * 5, 0.9); puff(x + 40, y + 20, 90, 0.8); } g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,1)'; g.fillRect(0, 165, w, 40); }
  else if (style === 'mackerel') { for (let r = 0; r < 4; r++) for (let x = 0; x < w; x += 70) puff(x + (r % 2) * 35, 40 + r * 32, 26, 0.55); }
  else if (style === 'lenticular') { for (const [x, y] of [[400, 70], [1100, 90], [1600, 60]]) { g.fillStyle = 'rgba(255,255,255,.85)'; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(x, y + k * 16, 220 - k * 40, 14 - k * 3, 0, 0, Math.PI * 2); g.fill(); } } }
  else if (style === 'low') { for (let x = 0; x < w; x += 120) puff(x, 150, 90, 0.5); g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,1)'; g.fillRect(0, 175, w, 40); }
  else { const puffs = [[120, 90, 60], [190, 80, 80], [270, 95, 55], [230, 120, 40], [700, 60, 45], [760, 50, 60], [830, 62, 50], [1200, 100, 70], [1290, 85, 90], [1390, 100, 65], [1330, 130, 50], [1650, 70, 40], [1700, 65, 48]]; for (const [px, py, r] of puffs) puff(px, py, r, 0.95); g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,1)'; g.fillRect(0, 150, 400, 60); g.fillRect(650, 112, 260, 90); g.fillRect(1150, 175, 400, 40); g.fillRect(1600, 110, 200, 90); }
  return c;
}
const cloudCache = {};
const _loadWorld9 = loadWorld;
loadWorld = function (id, at) { _loadWorld9(id, at); const st = CLOUD_STYLE[id] || 'cumulus'; if (!cloudCache[st]) cloudCache[st] = bakeClouds(st); LAYERS.clouds = cloudCache[st]; LAYERS.fgWorld = bakeForeground(id); };

/* ---------- 10. foreground occluders per world ---------- */
function bakeForeground(id) {
  const w = 1400, h = 120, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#141a14';
  if (id === 'taunton') { g.fillRect(0, 60, w, 6); g.fillRect(0, 90, w, 6); for (let x = 20; x < w; x += 110) g.fillRect(x, 40, 8, 80); } // fence rails
  else if (id === 'plantcity') { for (let x = 100; x < w; x += 500) for (let k = 0; k < 5; k++) { g.save(); g.translate(x, 0); g.rotate(-0.4 + k * 0.35); g.beginPath(); g.ellipse(70, 0, 80, 12, 0, 0, Math.PI * 2); g.fill(); g.restore(); } } // palm fronds from above
  else if (id === 'portland') { for (let x = 60; x < w; x += 420) { g.beginPath(); g.moveTo(x - 60, 120); g.lineTo(x, 0); g.lineTo(x + 60, 120); g.closePath(); g.fill(); } } // fir tips
  else if (id === 'lansing' || id === 'aurora') { for (let x = 0; x < w; x += 160) drawSnowbank(g, x, 120, 140); }
  else if (id === 'sacramento') { g.fillRect(0, 70, w, 5); for (let x = 40; x < w; x += 90) g.fillRect(x, 50, 6, 70); } // dock rail
  else if (id === 'billings') { for (let x = 30; x < w; x += 300) { g.beginPath(); g.arc(x, 130, 40, Math.PI, 0); g.fill(); } } // rock humps
  else if (id === 'spartanburg') { for (let x = 90; x < w; x += 380) for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + k * 24, 110 - (k % 2) * 8, 16, 0, Math.PI * 2); g.fill(); g.fillStyle = '#c96a3a'; g.beginPath(); g.arc(x + k * 24 + 6, 104 - (k % 2) * 8, 4, 0, Math.PI * 2); g.fill(); g.fillStyle = '#141a14'; } } // peach branches
  else return null;
  return c;
}
const _drawStoryFront6 = drawStoryFront;
drawStoryFront = function () { _drawStoryFront6(); if (!LAYERS.fgWorld || demo.active && false) return; ctx.save(); ctx.translate(camera.x, camera.y); ctx.globalAlpha = (WORLD.id === 'plantcity' || WORLD.id === 'portland') ? 0.55 : 0.85; const w = LAYERS.fgWorld.width; let fx = (-camera.x * 1.3) % w; if (fx > 0) fx -= w; const y = (WORLD.id === 'plantcity' || WORLD.id === 'portland') ? -camera.y * 0.5 - 20 : H - 120 - camera.y * 0.3; for (let k = 0; k < 3; k++) ctx.drawImage(LAYERS.fgWorld, fx + k * w, y); ctx.restore(); };

/* ---------- 11. NPC variety: builds and hats ---------- */
function hashName(n) { let h = 0; for (const ch of n) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
const _drawHero4 = drawHero;
drawHero = function (c, ch, x, y, facing, pose, lit) {
  const isHero = ROSTER.includes(ch); const hh = hashName(ch.name || '');
  let build = 1; if (!isHero) build = ch.kid ? 1 : [0.94, 1, 1.06][hh % 3];
  if (build !== 1) { c.save(); c.translate(x, y); c.scale(build, build); c.translate(-x, -y); }
  _drawHero4(c, ch, x, y, facing, pose, lit);
  if (!isHero && !ch.kid && !ch.cat && !['The Founder', 'A+', 'Blaine', 'Milo', 'Mrs. Miller', 'Kid'].includes(ch.name)) {
    const hat = ['none', 'beanie', 'hardhat', 'none', 'cap2', 'none'][hh % 6];
    if (hat !== 'none') { c.save(); c.translate(x, y); c.scale(facing * (pose.big || 1), pose.big || 1); const hy = -18 - 22 - 12; if (hat === 'beanie') { c.fillStyle = ['#c0392b', '#3c5fa6', '#6b5b8f'][hh % 3]; c.beginPath(); c.arc(0, hy - 5, 13, Math.PI, 0); c.fill(); c.fillRect(-13, hy - 6, 26, 5); } else if (hat === 'hardhat') { c.fillStyle = '#f2b544'; c.beginPath(); c.arc(0, hy - 4, 14, Math.PI, 0); c.fill(); c.fillRect(-16, hy - 5, 32, 3); } else { c.fillStyle = '#2f4f6f'; c.beginPath(); c.arc(0, hy - 3, 14, Math.PI, Math.PI * 2); c.fill(); c.fillRect(0, hy - 4, 20, 4); } c.restore(); }
    // badge
    c.save(); c.translate(x, y); c.scale(facing, 1); c.fillStyle = '#fff'; c.fillRect(-9, -18 - 22 + 6, 4, 5); c.fillStyle = '#c0392b'; c.fillRect(-9, -18 - 22 + 6, 4, 1.5); c.restore();
  }
  if (build !== 1) c.restore();
};

/* ---------- 12. portrait pass ---------- */
const EXPR = { Rianan: { brow: -0.15, smile: 1.1 }, Aaron: { brow: 0, smile: 0.7 }, Bret: { brow: 0.1, smile: 1.2 }, 'Brian S': { brow: -0.2, smile: 0.9 }, 'Brian W': { brow: 0, smile: 0.8 }, Umesh: { brow: 0.05, smile: 1 }, Dave: { brow: 0.15, smile: 0.6 }, John: { brow: 0, smile: 0.7 }, Greg: { brow: 0.2, smile: 0.4 }, Ryan: { brow: -0.1, smile: 1.1 }, Jose: { brow: 0, smile: 1 }, Ash: { brow: -0.1, smile: 1.2 }, Andrew: { brow: 0.1, smile: 0.9 } };
const _drawPortrait = drawPortrait;
drawPortrait = function (c, ch, size) {
  const s = size / 96; c.save(); c.scale(s, s);
  const w = WEAPONS[ch.name]; const col = w ? w.color : [242, 181, 68];
  const g = c.createLinearGradient(0, 0, 0, 96); g.addColorStop(0, ch.mono ? '#3a3a44' : rgb(mix(col, [30, 40, 70], 0.7))); g.addColorStop(1, '#16223a'); c.fillStyle = g; rr(c, 0, 0, 96, 96, 10); c.fill();
  const rg = c.createRadialGradient(48, 40, 4, 48, 40, 52); rg.addColorStop(0, ch.mono ? 'rgba(235,235,245,.35)' : rgba(col, 0.35)); rg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = rg; c.fillRect(0, 0, 96, 96);
  // weapon motif behind the head
  c.save(); c.globalAlpha = 0.18; c.strokeStyle = rgb(col); c.lineWidth = 3; c.beginPath(); c.arc(48, 44, 30, 0, Math.PI * 2); c.stroke(); c.restore();
  c.save(); c.translate(48, 126); c.scale(1.7, 1.7); drawHero(c, ch, 0, 0, 1, { t: 0, run: 0, moving: false }, { i: 1, color: ch.mono ? [230, 230, 240] : [242, 181, 68], side: 1 }); c.restore();
  // expression: brow tilt and smile size drawn over the base face
  const e = EXPR[ch.name]; if (e) { c.save(); c.translate(48, 126); c.scale(1.7, 1.7); const hy = -52; c.strokeStyle = shade(ch.hair, 0.9); c.lineWidth = 1.3; c.beginPath(); c.moveTo(1.5, hy - 5 + e.brow * 3); c.lineTo(6.5, hy - 6 - e.brow * 2); c.moveTo(7.5, hy - 6 - e.brow * 2); c.lineTo(12.5, hy - 5 + e.brow * 3); c.stroke(); c.strokeStyle = ch.mono ? '#4a4a4a' : '#7a3b2a'; c.lineWidth = 1.3; c.beginPath(); c.arc(6.5, hy + 3, 3.5 * e.smile, 0.15, Math.PI - 0.15); c.stroke(); c.restore(); }
  // name ribbon
  c.fillStyle = 'rgba(16,26,46,.75)'; c.fillRect(0, 82, 96, 14); c.fillStyle = rgb(col); c.fillRect(0, 82, 96, 1.5);
  c.restore();
};
for (const k in PORTRAITS) delete PORTRAITS[k];

/* ---------- 13. signage ---------- */
function paintSignage(g, id) {
  const gy = WORLD.groundY;
  if (id === 'easton') { // roof sign, dock plates, safety stripes
    g.fillStyle = '#243447'; rr(g, 2000, 200, 200, 26, 4); g.fill(); g.fillStyle = '#f6ecd8'; g.font = 'bold 12px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('EASTON DISTRIBUTION CENTER', 2100, 218);
    for (let i = 0; i < 3; i++) { const dx = 1760 + i * 280; g.fillStyle = '#e9d27a'; rr(g, dx + 34, 274, 32, 20, 3); g.fill(); g.fillStyle = '#243447'; g.font = 'bold 14px system-ui, sans-serif'; g.fillText(String(i + 1), dx + 50, 289); }
    for (let x = 1720; x < 2440; x += 24) { g.fillStyle = (x / 24) % 2 ? '#e9d27a' : '#1b1d22'; g.fillRect(x, 392, 24, 4); }
  } else if (WORLD.def && WORLD.def.steps && id !== 'merge') {
    g.fillStyle = '#243447'; rr(g, 1980, 190, 240, 26, 4); g.fill(); g.fillStyle = '#f6ecd8'; g.font = 'bold 11px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText((WORLD.name || '').toUpperCase() + '  ·  DISTRIBUTION CENTER', 2100, 208);
    for (let i = 0; i < 2; i++) { const dx = 1760 + i * 320; g.fillStyle = '#e9d27a'; rr(g, dx + 34, 274, 32, 20, 3); g.fill(); g.fillStyle = '#243447'; g.font = 'bold 14px system-ui, sans-serif'; g.fillText(String(i + 1), dx + 50, 289); }
    for (let x = 1720; x < 2320; x += 24) { g.fillStyle = (x / 24) % 2 ? '#e9d27a' : '#1b1d22'; g.fillRect(x, 392, 24, 4); }
  } else if (id === 'taunton') { for (let i = 0; i < 2; i++) { const dx = 1560 + i * 300; g.fillStyle = '#e9d27a'; rr(g, dx + 34, 274, 32, 20, 3); g.fill(); g.fillStyle = '#243447'; g.font = 'bold 14px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(String(i + 1), dx + 50, 289); } for (let x = 1520; x < 2080; x += 24) { g.fillStyle = (x / 24) % 2 ? '#e9d27a' : '#1b1d22'; g.fillRect(x, 392, 24, 4); } }
  g.textAlign = 'left';
}
const _loadWorld10 = loadWorld; loadWorld = function (id, at) { _loadWorld10(id, at); if (!['prologue', 'past', 'show'].includes(id)) paintSignage(LAYERS.play.getContext('2d'), id); };
// crisper trailer wordmark
const _drawTrailer = drawTrailer; drawTrailer = function (g, x, y, gy) { _drawTrailer(g, x, y, gy); g.save(); g.font = 'bold 26px Georgia, serif'; g.textAlign = 'center'; g.lineWidth = 1; g.strokeStyle = 'rgba(255,255,255,.35)'; g.strokeText('PHILLIPS', x + 210, y + 44); g.fillStyle = '#c0392b'; g.fillRect(x + 90, y + 56, 240, 1.5); g.restore(); g.textAlign = 'left'; };

/* ---------- 14. comic-panel chapter cards ---------- */
function drawPanelCard(sc, t) {
  const a = clamp(t / 0.8, 0, 1) * (t > sc.dur - 0.8 ? clamp((sc.dur - t) / 0.8, 0, 1) : 1);
  ctx.fillStyle = 'rgba(8,10,18,' + (0.94 * a) + ')'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.font = 'bold 34px Georgia, serif'; ctx.fillStyle = '#f2b544'; ctx.fillText(sc.title, W / 2, 84);
  const panels = sc.panels || []; const pw = 260, ph = 190, gap = 24, x0 = W / 2 - (panels.length * pw + (panels.length - 1) * gap) / 2;
  panels.forEach((p, i) => { const x = x0 + i * (pw + gap), y = 120; const show = t > 0.6 + i * 0.9; if (!show) return; ctx.fillStyle = '#f6ecd8'; rr(ctx, x - 4, y - 4, pw + 8, ph + 8, 6); ctx.fill(); ctx.fillStyle = p.bg || '#c9a56a'; ctx.fillRect(x, y, pw, ph); ctx.save(); ctx.beginPath(); ctx.rect(x, y, pw, ph); ctx.clip(); ctx.translate(x + pw / 2, y + ph / 2); ctx.scale(2.4, 2.4); drawLedgerIcon(0, 0, p.icon || 0); ctx.restore(); ctx.fillStyle = 'rgba(16,26,46,.8)'; ctx.fillRect(x, y + ph - 40, pw, 40); ctx.fillStyle = '#f6ecd8'; ctx.font = 'italic 12px Georgia, serif'; ctx.fillText(p.cap, x + pw / 2, y + ph - 16); });
  ctx.font = 'italic 14px Georgia, serif'; ctx.fillStyle = '#b9c5d6'; ctx.fillText(sc.sub || '', W / 2, H - 60); ctx.restore(); ctx.textAlign = 'left';
}
const _drawCardCutscene = drawCardCutscene; drawCardCutscene = function (sc, t) { if (sc.panels) { drawPanelCard(sc, t); return; } _drawCardCutscene(sc, t); };
(function () { const byTitle = t => DEMO_SCRIPT.find(s => s.cut === 'card' && s.title === t); const a = byTitle('1938'); if (a) { a.panels = [{ icon: 1, cap: 'One feed store. Germansville, PA.', bg: '#a88a5e' }, { icon: 4, cap: 'Purina chows for the farmers.', bg: '#c9a56a' }, { icon: 0, cap: 'And a promise, made in the rain.', bg: '#8a7a5a' }]; a.dur = 10; } const b = byTitle('TONIGHT'); if (b) { b.panels = [{ icon: 5, cap: '11:52 PM. The cutover.', bg: '#243447' }, { icon: 2, cap: 'A+ has run the orders since 1985.', bg: '#1f5a3a' }, { icon: 3, cap: 'Nine DCs. One team. Get them back.', bg: '#2f4f6f' }]; b.dur = 10; } })();

/* ---------- 15. A+ has a face ---------- */
function aplusFace(text) { if (/ARCHIVED|THANK YOU|…$/.test(text)) return '[ _ ]'; if (/\?|WHO |WHY /.test(text)) return '[o_O]'; if (/DENIED|MINE|NO\./.test(text)) return '[¬_¬]'; return '[•_•]'; }
const _drawAplus = drawAplus;
drawAplus = function () { _drawAplus(); if (!aplus.cur) return; const c = aplus.cur; const a = c.t > c.dur - 0.5 ? clamp((c.dur - aplus.t) / 0.5, 0, 1) : clamp(aplus.t / 0.2, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.font = 'bold 13px monospace'; const full = 'A+ > ' + c.text; const tw = Math.max(260, ctx.measureText(full).width + 32); const x = W / 2 - tw / 2; ctx.fillStyle = 'rgba(6,14,8,.92)'; rr(ctx, x - 58, 92, 52, 34, 4); ctx.fill(); ctx.strokeStyle = 'rgba(120,255,140,.55)'; ctx.lineWidth = 1; rr(ctx, x - 58, 92, 52, 34, 4); ctx.stroke(); ctx.fillStyle = '#7fe0a0'; ctx.textAlign = 'center'; ctx.fillText(aplusFace(c.text), x - 32, 114); ctx.restore(); ctx.textAlign = 'left'; };

/* ---------- 16. ending montage ---------- */
const montage = { active: false, t: 0, i: 0, items: [] };
function startMontage() { const plan = rescuePlan(); montage.items = DC_ORDER.map(id => ({ name: WORLD_DEFS[id].name, who: plan[id], line: ({ taunton: 'Fog lifted.', spartanburg: 'The wrapper stopped spinning.', plantcity: 'Pipes are pipes again.', lansing: 'Plow parked.', billings: 'Blades still.', portland: 'Every tag on the right crate.', sacramento: 'Six dogs adopted.', aurora: 'Night one, held.', merge: 'Two schemas. One map.' })[id] })); montage.active = true; montage.t = 0; montage.i = 0; }
function updateMontage(dt) { if (!montage.active) return; montage.t += dt; if (montage.t > 1.7 || edge.jump || edge.use) { montage.t = 0; montage.i++; } if (montage.i >= montage.items.length) { montage.active = false; startPhoto(); } }
function drawMontage() { if (!montage.active) return; const it = montage.items[montage.i]; if (!it) return; const a = clamp(montage.t / 0.3, 0, 1) * clamp((1.7 - montage.t) / 0.3, 0, 1); ctx.fillStyle = '#0a0d16'; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.globalAlpha = a; const ch = heroByName(it.who); if (ch) { ctx.save(); rr(ctx, W / 2 - 60, 150, 120, 120, 14); ctx.clip(); ctx.drawImage(portraitFor(ch), W / 2 - 60, 150, 120, 120); ctx.restore(); } ctx.textAlign = 'center'; ctx.font = 'bold 30px Georgia, serif'; ctx.fillStyle = '#f2b544'; ctx.fillText(it.name, W / 2, 320); ctx.font = 'italic 16px Georgia, serif'; ctx.fillStyle = '#f6ecd8'; ctx.fillText((ch ? ch.name + '  ·  ' : '') + it.line, W / 2, 352); ctx.font = '11px system-ui, sans-serif'; ctx.fillStyle = 'rgba(246,236,216,.5)'; ctx.fillText((montage.i + 1) + ' / ' + montage.items.length, W / 2, H - 40); ctx.restore(); ctx.textAlign = 'left'; }
const _startEnding = startEnding; startEnding = function () { montage.done = false; _startEnding(); };
const _updateEnding2 = updateEnding; updateEnding = function (dt) { const was = ending.active; _updateEnding2(dt); if (was && !ending.active && photo.active && !demo.active && !montage.done) { montage.done = true; photo.active = false; startMontage(); } updateMontage(dt); };
const _drawEnding2 = drawEnding; drawEnding = function () { _drawEnding2(); drawMontage(); };
