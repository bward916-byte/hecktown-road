
/* =====================================================================
   LIFE PASS II (M20)
   ===================================================================== */

/* ---------- 1. living skies ---------- */
const sky = { flock: null, plane: { x: -100, t: 0 }, hawk: { a: 0 } };
function updateSkyLife(dt) {
  if (WORLD.def && WORLD.def.indoor) return; const night = nightness(hour);
  if (!sky.flock && hour > 5.5 && hour < 8.5 && Math.random() < dt * 0.3) sky.flock = { x: camera.x - 200, y: rnd(60, 140), n: 7 + (Math.random() * 6 | 0), t: 0, kind: WORLD.id === 'taunton' ? 'geese' : 'birds' };
  if (sky.flock) { sky.flock.t += dt; sky.flock.x += (sky.flock.kind === 'geese' ? 55 : 80) * dt; if (sky.flock.x > camera.x + W + 300) sky.flock = null; }
  const late = hour > 20 || hour < 5; if (late) { sky.plane.t += dt; sky.plane.x += 28 * dt; if (sky.plane.x > W + 100) sky.plane.x = -100 - rnd(0, 900); } else sky.plane.x = -100;
  if (WORLD.id === 'billings') sky.hawk.a += dt * 0.35;
}
function drawSkyLife() {
  if (WORLD.def && WORLD.def.indoor) return; const night = nightness(hour);
  if (sky.flock) { const f = sky.flock; ctx.strokeStyle = 'rgba(20,20,30,.7)'; ctx.lineWidth = 1.5; for (let i = 0; i < f.n; i++) { const k = Math.ceil(i / 2), side = i % 2 ? 1 : -1; const bx = f.x - camera.x * 0.2 - k * 14, by = f.y + side * k * 7 + Math.sin(f.t * 6 + i) * 2; const fl = Math.sin(f.t * 9 + i) * 3; ctx.beginPath(); ctx.moveTo(bx - 5, by + fl); ctx.lineTo(bx, by); ctx.lineTo(bx + 5, by + fl); ctx.stroke(); } if (f.kind === 'geese' && Math.floor(f.t) % 3 === 0 && f.t % 1 < 0.4) { ctx.fillStyle = 'rgba(246,236,216,.5)'; ctx.font = 'italic 9px Georgia, serif'; ctx.fillText('honk', f.x - camera.x * 0.2 + 10, f.y - 10); } }
  if ((hour > 20 || hour < 5) && sky.plane.x > -100) { const px = sky.plane.x, py = 70; ctx.fillStyle = 'rgba(255,255,255,' + (Math.floor(sky.plane.t * 2) % 2 ? 0.9 : 0.2) + ')'; ctx.fillRect(px, py, 2, 2); ctx.fillStyle = 'rgba(255,80,80,' + (Math.floor(sky.plane.t * 2 + 1) % 2 ? 0.9 : 0.2) + ')'; ctx.fillRect(px + 8, py + 1, 2, 2); }
  if (WORLD.id === 'billings' && night < 0.6) { const hx = W * 0.6 + Math.cos(sky.hawk.a) * 120, hy = 110 + Math.sin(sky.hawk.a * 2) * 20; ctx.strokeStyle = 'rgba(30,25,20,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx - 12, hy + 3); ctx.quadraticCurveTo(hx - 6, hy - 3, hx, hy); ctx.quadraticCurveTo(hx + 6, hy - 3, hx + 12, hy + 3); ctx.stroke(); }
}

/* ---------- 2. traffic on the road behind the yard ---------- */
const traffic = { cars: [] };
function updateTraffic(dt) {
  if (WORLD.id === 'easton' || (WORLD.def && WORLD.def.steps && WORLD.id !== 'merge')) { if (traffic.cars.length < 3 && Math.random() < dt * 0.25) traffic.cars.push({ x: Math.random() < 0.5 ? -80 : WORLD.width * 0.35 + 80, dir: Math.random() < 0.5 ? 1 : -1, v: rnd(70, 120), bus: Math.random() < 0.18 && hour > 6.5 && hour < 16, col: ['#c0392b', '#3c5fa6', '#e0a030', '#e6e6e6', '#2f7f4f'][(Math.random() * 5) | 0] }); for (let i = traffic.cars.length - 1; i >= 0; i--) { const c = traffic.cars[i]; c.x += c.dir * c.v * dt; if (c.x < -120 || c.x > WORLD.width * 0.35 + 120) traffic.cars.splice(i, 1); } } else traffic.cars.length = 0;
}
function drawTraffic(night) {
  if (!traffic.cars.length) return; const y = 300; const par = 0.35;
  for (const c of traffic.cars) { const sx = c.x - camera.x * par; if (sx < -100 || sx > W + 100) continue; ctx.save(); ctx.translate(sx, y - camera.y * 0.2); ctx.scale(c.dir * 0.42, 0.42); if (c.bus) { ctx.fillStyle = '#f2b544'; rr(ctx, -50, -34, 100, 30, 6); ctx.fill(); ctx.fillStyle = '#243447'; for (let k = 0; k < 4; k++) ctx.fillRect(-40 + k * 22, -28, 14, 10); } else { ctx.fillStyle = c.col; rr(ctx, -30, -20, 60, 14, 5); ctx.fill(); rr(ctx, -16, -32, 30, 14, 5); ctx.fill(); ctx.fillStyle = '#243447'; ctx.fillRect(-12, -30, 22, 9); } ctx.fillStyle = '#1b1d22'; ctx.beginPath(); ctx.arc(-18, -4, 6, 0, Math.PI * 2); ctx.arc(18, -4, 6, 0, Math.PI * 2); ctx.fill(); if (night > 0.3) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(30, -12, 130, -12); g.addColorStop(0, rgba([255, 240, 200], 0.5 * night)); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(30, -16); ctx.lineTo(130, -30); ctx.lineTo(130, 4); ctx.lineTo(30, -8); ctx.closePath(); ctx.fill(); ctx.fillStyle = rgba([255, 60, 60], 0.8 * night); ctx.fillRect(-32, -16, 4, 5); } ctx.restore(); }
}

/* ---------- 3. time visibly passing ---------- */
function drawWallClock() {
  const spots = { easton: [1100, 250], taunton: [1180, 250], spartanburg: [1380, 250] }; const s = spots[WORLD.id] || (WORLD.def && WORLD.def.steps && WORLD.id !== 'merge' ? [1380, 250] : null); if (!s) return;
  ctx.save(); ctx.translate(s[0], s[1]); ctx.fillStyle = '#f6ecd8'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#243447'; ctx.lineWidth = 2; ctx.stroke();
  const h = (hour % 12) / 12 * Math.PI * 2 - Math.PI / 2, m = (hour % 1) * Math.PI * 2 - Math.PI / 2; ctx.strokeStyle = '#1b1b1f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(h) * 5, Math.sin(h) * 5); ctx.stroke(); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(m) * 8, Math.sin(m) * 8); ctx.stroke(); ctx.restore();
}
function updateSprinklers(dt) { if (hour > 6 && hour < 6.6 && WORLD.id === 'easton' && Math.random() < dt * 30) { const x = 200 + Math.random() * 300; spawn({ k: 'spark', x, y: WORLD.groundY - 4, vx: rnd(-90, 90), vy: rnd(-260, -120), life: 0.7, t: 0, c: [170, 210, 255] }); } }

/* ---------- 4. heat shimmer and breath fog ---------- */
function drawHeat() { if (!['spartanburg', 'plantcity', 'billings', 'sacramento'].includes(WORLD.id) || hour < 10 || hour > 17 || weather === 2) return; const gy = WORLD.groundY - camera.y; ctx.save(); ctx.globalAlpha = 0.07; for (let k = 0; k < 6; k++) { const y = gy - 6 - k * 9 + Math.sin(gameTime * 3 + k) * 2; ctx.drawImage(canvas, 0, y, W, 6, Math.sin(gameTime * 5 + k * 1.3) * 2, y, W, 6); } ctx.restore(); }
function updateBreath(dt) { if (!['lansing', 'aurora'].includes(WORLD.id) && !(weather === 3)) return; for (const m of crewAll()) { m.breathT = (m.breathT || rnd(0, 3)) - dt; if (m.breathT <= 0) { m.breathT = rnd(2.5, 4); spawn({ k: 'steam', x: m.x + (m.facing || 1) * 12, y: m.y - 46, vx: (m.facing || 1) * 12, vy: -14, life: 0.9, t: 0, r: 3 }); } } }

/* ---------- 5. puddle splashes, snow footprints ---------- */
const prints = [];
function updateGroundMarks(dt) {
  for (let i = prints.length - 1; i >= 0; i--) { prints[i].t += dt; if (prints[i].t > 6) prints.splice(i, 1); }
  for (const m of crewAll()) { if (!m.onGround || Math.abs(m.vx) < 30) continue; const ph = m.run || 0; m.lastPh = m.lastPh === undefined ? ph : m.lastPh; const stepped = (ph < 0.5) !== (m.lastPh < 0.5); m.lastPh = ph; if (!stepped) continue;
    const water = (WORLD.def && WORLD.def.water || []).find(w => m.x > w.x0 && m.x < w.x1) || (WORLD.id === 'easton' && Math.abs(m.x - 3000) < 40) || (WORLD.id === 'portland' && [300, 2900, 3300, 4000].some(px => Math.abs(m.x - px) < 60));
    if (water && WORLD.id !== 'show') { for (let k = 0; k < 6; k++) spawn({ k: 'spark', x: m.x + rnd(-8, 8), y: m.y, vx: rnd(-90, 90), vy: rnd(-200, -60), life: 0.35, t: 0, c: [170, 200, 240] }); sfxStep('dock'); }
    if (snowAcc > 0.3 || ['lansing', 'aurora'].includes(WORLD.id)) prints.push({ x: m.x + (ph < 0.5 ? -5 : 5), y: groundYAt(m.x), t: 0, f: m.facing || 1 }); }
}
function drawGroundMarks() { for (const p of prints) { ctx.fillStyle = 'rgba(120,130,160,' + (0.35 * (1 - p.t / 6)) + ')'; ctx.beginPath(); ctx.ellipse(p.x, p.y + 1, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill(); } }

/* ---------- 8. Milo animation ---------- */
const _drawCat = drawCat;
drawCat = function (c, x, y, dir, t, hood) {
  const m = npcs.find(n => n.cat && Math.abs(n.x - x) < 1); const near = m && Math.abs(player.x - x) < 140;
  _drawCat(c, x, y, dir, t, near ? true : hood);
  if (!m) return; c.save(); c.translate(x, y); c.scale(dir, 1);
  if (near) { const look = Math.sin(t * 2.5) > 0.6 ? 1 : Math.sin(t * 2.5) < -0.6 ? -1 : 0; c.fillStyle = '#1b1b1f'; c.fillRect(6 + look * 2, -46, 2, 2); c.fillRect(11 + look * 2, -46, 2, 2); }
  else if (Math.floor(t / 4) % 2 === 0) { c.fillStyle = '#7fe0ff'; const n = Math.floor(t * 3) % 4; for (let k = 0; k < n; k++) c.fillRect(16 + k * 4, -24 + Math.sin(t * 6 + k) * 2, 3, 3); c.fillStyle = 'rgba(246,236,216,.7)'; c.font = 'italic 8px Georgia, serif'; c.scale(dir, 1); c.fillText(['…nineteen', '…twenty', '…twenty-one'][Math.floor(t / 2) % 3], dir * 10, -52); }
  c.restore();
};

/* ---------- 9. freed teammates come back to their DC ---------- */
const RETURN_LINES = { Bret: 'Never again. I put a padlock on the rack room. A physical one.', Dave: 'The forklift and I have an understanding now.', Umesh: 'Every 850 accounted for. I counted twice.', John: 'The plow\'s parked. I have the keys.', Ryan: 'Cold room\'s at temp. Pipeline\'s green. I\'m fine.', Greg: 'I\'ve worked here too, once. 1999. Nobody remembers.', 'Brian S': 'That crane would make a great pinball backglass.', Ash: 'The gate\'s a flow now. It approves itself.', Jose: 'One schema. I\'m still drawing the dragon.', 'Brian W': 'The database here is also fine.', Aaron: 'Line picked. Committed. Paddling.' };
const _loadWorld13 = loadWorld;
loadWorld = function (id, at) { _loadWorld13(id, at); if (demo.active || !restored[id] || !DC_ORDER.includes(id)) return; const who = rescuePlan()[id]; if (!who || crew.some(f => f.hero.name === who) || hero.name === who) return; const ch = heroByName(who); if (!ch) return; const x = WORLD_DEFS[id].rescueX || 760; addNPC({ hero: ch, look: ch, x, y: groundYAt(x), facing: -1, onTalk: (n) => say(n, ch.name + ': "' + (RETURN_LINES[who] || 'Good to be back.') + '"', [{ label: 'Join us', fn: () => { if (crew.length < CREW_MAX - 1) joinCrew(ch); else say(n, ch.name + ': "You\'re full. Swap me in at Easton."'); } }, { label: 'Carry on', fn: null }]) }); };

/* ---------- 12. the Cutover Key as an object ---------- */
function drawKeyCard(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#1f5a3a'; rr(c, -12, -8, 24, 16, 3); c.fill(); c.fillStyle = '#7fe0a0'; c.fillRect(-9, -5, 8, 5); c.fillStyle = '#c8f0d0'; c.fillRect(-9, 2, 18, 1.5); c.fillRect(-9, 5, 12, 1.5); c.fillStyle = '#f2b544'; c.fillRect(6, -6, 4, 4); c.restore(); }
const _drawHudCard = drawHudCard; drawHudCard = function () { _drawHudCard(); if (story.cutoverKey && !restored.easton) { drawKeyCard(ctx, 14 + 270, H - 96 + 20, 1); ctx.fillStyle = '#7fe0a0'; ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.fillText('KEY', 14 + 270, H - 96 + 36); ctx.textAlign = 'left'; } };
const _drawHero5 = drawHero; drawHero = function (c, ch, x, y, facing, pose, lit) { _drawHero5(c, ch, x, y, facing, pose, lit); if (ch === hero && story.cutoverKey && !restored.easton && !photo.active && WORLD.id === 'easton') drawKeyCard(c, x + facing * 14, y - 36, 0.5); };

/* ---------- 13. photo mode anywhere (T) ---------- */
const snap = { flash: 0 };
const _syncInput = syncInput; syncInput = function () { _syncInput(); if (edge.time && running && !demo.active && !photo.active) { edge.time = 0; tk.time = 0; snap.flash = 0.8; setTimeout(() => { try { const url = canvas.toDataURL('image/png'); const a = document.createElement('a'); a.href = url; a.download = 'hecktown-road-' + WORLD.id + '.png'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { } }, 60); sfx('scan'); } };
function drawSnap() { if (snap.flash <= 0) return; snap.flash -= 1 / 60; ctx.strokeStyle = 'rgba(246,236,216,' + Math.min(1, snap.flash) + ')'; ctx.lineWidth = 6; ctx.strokeRect(24, 24, W - 48, H - 48); ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0, snap.flash - 0.5) + ')'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, W / 2 - 110, H - 70, 220, 26, 8); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 12px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText('PHILLIPS IT  ·  HECKTOWN ROAD', W / 2, H - 52); ctx.textAlign = 'left'; }

/* ---------- 14. drive cards ---------- */
const DRIVE_CARDS = { taunton: ['Taunton, Massachusetts', 'Fog off the marsh, a lighthouse, and Bret behind a lockout.'], spartanburg: ['Spartanburg, South Carolina', 'Peach country. Dave, a forklift, and an alley cat with a business plan.'], plantcity: ['Plant City, Florida', 'Aquatics ship from here. Umesh is locked out of EDI.'], lansing: ['Lansing, Michigan', 'Snow on the yard. John\'s scheduler is looping.'], billings: ['Billings, Montana', 'The cold chain. Ryan\'s pipeline is red.'], portland: ['Portland, Oregon', 'Rain on the sort belts. Greg\'s dashboards are dark — for once.'], sacramento: ['West Sacramento, California', 'The delta at golden hour. Brian S and a crane.'], aurora: ['Aurora, Colorado', 'The newest building. Ash, and a gate A+ wants shut.'], merge: ['The Merge', 'Two schemas. Jose is somewhere inside both.'], easton: ['Easton, Pennsylvania', 'Home. 3747 Hecktown Road.'], show: ['The Buying Show', 'Everyone you brought home.'] };
const _renderDrive2 = renderDrive; renderDrive = function () { _renderDrive2(); const c = DRIVE_CARDS[drive.to]; if (!c || drive.t > 4) return; const a = clamp(drive.t / 0.6, 0, 1) * clamp((4 - drive.t) / 0.6, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(16,26,46,.8)'; rr(ctx, W / 2 - 260, 80, 520, 74, 10); ctx.fill(); ctx.textAlign = 'center'; ctx.font = 'bold 20px Georgia, serif'; ctx.fillStyle = '#f2b544'; ctx.fillText(c[0], W / 2, 110); ctx.font = 'italic 13px Georgia, serif'; ctx.fillStyle = '#f6ecd8'; ctx.fillText(c[1], W / 2, 136); ctx.restore(); ctx.textAlign = 'left'; };

/* ---------- 15. a real team photo behind the credits (drop team.jpg next to index.html) ---------- */
const teamPhoto = { img: null, ok: false };
try { const im = new Image(); im.onload = () => { teamPhoto.ok = true; }; im.onerror = () => { }; im.src = 'team.jpg'; teamPhoto.img = im; } catch (e) { }
const _drawEnding3 = drawEnding; drawEnding = function () { if (ending.active && teamPhoto.ok) { const t = ending.t; const a = clamp(t / 2, 0, 1) * 0.35; ctx.save(); ctx.globalAlpha = a; const im = teamPhoto.img; const s = Math.max(W / im.width, H / im.height); ctx.drawImage(im, (W - im.width * s) / 2, (H - im.height * s) / 2, im.width * s, im.height * s); ctx.restore(); } _drawEnding3(); };

/* ---------- 16. Lehigh Valley signage ---------- */
const _loadWorld14 = loadWorld;
loadWorld = function (id, at) {
  _loadWorld14(id, at); if (id !== 'easton' || layerCache.easton && layerCache.easton.local) return;
  const g = LAYERS.play.getContext('2d'); const gy = WORLD.groundY;
  // Route 33 shield
  g.fillStyle = '#2c3038'; g.fillRect(3300, gy - 70, 4, 70); g.fillStyle = '#fff'; rr(g, 3284, gy - 96, 36, 30, 4); g.fill(); g.fillStyle = '#1b1b1f'; g.font = 'bold 7px system-ui'; g.textAlign = 'center'; g.fillText('PA', 3302, gy - 86); g.font = 'bold 14px system-ui'; g.fillText('33', 3302, gy - 72);
  // Crayola smokestack on the far ridge is in the far layer; here, the sign at the lot
  g.fillStyle = '#243447'; rr(g, 3560, gy - 84, 90, 24, 4); g.fill(); g.fillStyle = '#f6ecd8'; g.font = 'bold 8px system-ui'; g.fillText('↑ PEACE CANDLE  ·  LIT IN DECEMBER', 3605, gy - 69); g.textAlign = 'left';
  if (layerCache.easton) layerCache.easton.local = true;
};
const _bakeEastonFar = bakeEastonFar; bakeEastonFar = function () { _bakeEastonFar(); try { const g = LAYERS.ridge.getContext('2d'); g.fillStyle = '#000'; g.fillRect(1080, 150, 10, 64); g.fillRect(1076, 146, 18, 6); } catch (e) { } };
// the Peace Candle only glows in December
const _drawEmissive = drawEmissive; drawEmissive = function (cx, cy, night) { const dec = new Date().getMonth() === 11; if (!dec && WORLD.id === 'easton') { const keep = LIGHTS; LIGHTS = LIGHTS.filter(l => !(l.x === 2910 && l.y === 300)); _drawEmissive(cx, cy, night); LIGHTS = keep; return; } _drawEmissive(cx, cy, night); };

/* ---------- hooks ---------- */
const _updateAplus6 = updateAplus; updateAplus = function (dt) { _updateAplus6(dt); updateSkyLife(dt); updateTraffic(dt); updateSprinklers(dt); updateBreath(dt); updateGroundMarks(dt); };
const _drawStoryLayer5 = drawStoryLayer; drawStoryLayer = function (night) { drawGroundMarks(); drawWallClock(); _drawStoryLayer5(night); };
const _drawLedgerHUD4 = drawLedgerHUD; drawLedgerHUD = function () { drawHeat(); _drawLedgerHUD4(); drawSnap(); };
