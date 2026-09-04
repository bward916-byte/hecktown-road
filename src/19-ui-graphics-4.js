
/* =====================================================================
   UI / GRAPHICS IV (M17)
   ===================================================================== */

/* ---------- 1. one HUD card: portrait, name, signal, super ring, shards ---------- */
drawSuperHUD = function () { };
function drawHudCard() {
  if (demo.active && false) return;
  const x = 14, y = H - 96, w = 296, h = 82;
  ctx.fillStyle = 'rgba(16,26,46,.72)'; rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.strokeStyle = 'rgba(242,181,68,.25)'; ctx.lineWidth = 1; rr(ctx, x, y, w, h, 12); ctx.stroke();
  // portrait with the super ring around it
  const px = x + 12, py = y + 11, ps = 60; ctx.save(); rr(ctx, px, py, ps, ps, 10); ctx.clip(); ctx.drawImage(portraitFor(hero), px, py, ps, ps); ctx.restore();
  if (story.weaponsOnline) { const m = clamp(superState.meter / 100, 0, 1); const ready = superReady(); ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(px + ps / 2, py + ps / 2, ps / 2 + 5, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = ready ? rgba([242, 181, 68], 0.75 + 0.25 * Math.sin(gameTime * 8)) : rgb(weaponOf(hero).color); ctx.beginPath(); ctx.arc(px + ps / 2, py + ps / 2, ps / 2 + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * m); ctx.stroke(); if (ready) { ctx.fillStyle = '#f2b544'; ctx.font = 'bold 9px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText('SUPER READY  ·  ' + K().sup, x + 188, y + 78); } }
  // name + role
  ctx.textAlign = 'left'; ctx.font = 'bold 15px Georgia, serif'; ctx.fillStyle = '#f2b544'; ctx.fillText(hero.name, x + 86, y + 26);
  ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = '#b9c5d6'; ctx.fillText(hero.role, x + 86, y + 40);
  // signal bars
  for (let i = 0; i < player.maxHp; i++) { const hh = 8 + i * 4; ctx.fillStyle = i < player.hp ? '#7fe0ff' : 'rgba(255,255,255,.15)'; ctx.fillRect(x + 88 + i * 10, y + 66 - hh, 7, hh); }
  // shards + weapon
  ctx.font = 'bold 12px system-ui, sans-serif'; ctx.fillStyle = '#f2b544'; ctx.fillText('$' + bucks.n, x + 128, y + 66);
  if (story.weaponsOnline) { const wp = weaponOf(hero); ctx.fillStyle = rgb(wp.color); ctx.beginPath(); ctx.arc(x + 180, y + 62, 3, 0, Math.PI * 2); ctx.fill(); ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = '#f6ecd8'; ctx.fillText(wp.name + (skillOf(hero) ? '  L' + skillOf(hero) : ''), x + 188, y + 66); }
  if (catnip.n > 0 || laser.n > 0) { ctx.font = '9px system-ui, sans-serif'; ctx.fillStyle = '#d8ff4a'; ctx.fillText((catnip.n ? 'nip ×' + catnip.n + '  ' : '') + (laser.n ? 'laser ×' + laser.n : ''), x + 86, y + 78); }
  if (superState.active > 0 && superState.kind) { ctx.fillStyle = rgba([242, 181, 68], 0.9); ctx.font = 'bold 9px system-ui, sans-serif'; ctx.fillText(superOf(hero).name + ' ' + Math.ceil(superState.active) + 's', x + 188, y + 78); }
}

/* ---------- 2. objective chip gets a progress pip ---------- */
function objectiveProgress() {
  if (stage.active && stage.door) { const s = stageStepsOf(WORLD.def)[stage.step]; if (!s) return null; if (s.type === 'scan') { const d = scanTargets.filter(t => t.done).length; return { txt: d + '/' + scanTargets.length + ' scans', f: scanTargets.length ? d / scanTargets.length : 0 }; } if (s.type === 'multi') return { txt: (stage.progress || 0) + '/' + s.n + ' sacks', f: (stage.progress || 0) / s.n }; if (s.type === 'valves') { const d = valves.filter(v => v.open).length; return { txt: d + '/' + valves.length + ' valves', f: valves.length ? d / valves.length : 0 }; } if (s.type === 'escort') return { txt: (stage.progress || 0) + '/' + animals.length + ' dogs', f: animals.length ? (stage.progress || 0) / animals.length : 0 }; if (s.type === 'deliver') return { txt: player.carry ? 'carrying' : 'find the package', f: player.carry ? 0.5 : 0 }; if (WORLD.id === 'spartanburg' && stage.step === 1) return { txt: forklift.rams + '/5 rammed', f: forklift.rams / 5 }; if (s.time) return { txt: Math.ceil(stage.timer) + 's', f: clamp(stage.timer / s.time, 0, 1) }; }
  if (lockout.active && lockout.barrier && lockout.started) { const d = lockout.scans.filter(s => s.done).length; return { txt: d + '/3 accounts', f: d / 3 }; }
  if (skuQuest.active) { const d = skuQuest.targets.filter(t => t.done).length; return { txt: d + '/3 pallets', f: d / 3 }; }
  if (WORLD.id === 'easton' && !story.turnDone && scanTargets.length) { const d = scanTargets.filter(t => t.done).length; if (d < scanTargets.length) return { txt: d + '/' + scanTargets.length + ' scans', f: d / scanTargets.length }; }
  return null;
}
function drawObjectiveProgress() { const o = currentObjective(); if (!o || demo.active) return; const p = objectiveProgress(); if (!p) return; ctx.font = 'bold 12px system-ui, sans-serif'; const tw = ctx.measureText(o.text).width; const x = 14 + tw + 34 + 8, y = 48; ctx.font = 'bold 10px system-ui, sans-serif'; const pw = ctx.measureText(p.txt).width + 60; ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, x, y, pw, 24, 8); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(x + 8, y + 10, 40, 4); ctx.fillStyle = '#7fe0ff'; ctx.fillRect(x + 8, y + 10, 40 * clamp(p.f, 0, 1), 4); ctx.fillStyle = '#f6ecd8'; ctx.textAlign = 'left'; ctx.fillText(p.txt, x + 54, y + 16); }

/* ---------- 3. boss bar polish + damage numbers ---------- */
function drawBossBarExtras() {
  if (!stage.active || stage.step !== 2) return; const b = arena.boss; if (!b || b.dead) return;
  const x = W / 2 - 150, y = 138; ctx.fillStyle = '#ff5a5a'; ctx.fillRect(x + 300 * 0.3 - 1, y - 3, 2, 14); // enrage tick
  for (let k = 1; k < 10; k++) { ctx.fillStyle = 'rgba(16,26,46,.6)'; ctx.fillRect(x + 30 * k, y, 1, 8); }
  ctx.save(); ctx.translate(W / 2 - 176, 146); aplusDecal(ctx, 0, 0, 1.2); ctx.restore();
  if (b.enraged) { ctx.fillStyle = rgba([255, 90, 60], 0.8 + 0.2 * Math.sin(gameTime * 10)); ctx.font = 'bold 9px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText('ENRAGED', x + 306, y + 8); }
}
const _damageEnemy4 = damageEnemy;
damageEnemy = function (e, dmg, fromX, src) { const ok = _damageEnemy4(e, dmg, fromX, src); if (ok && (superState.active > 0 || e.d.boss)) spawn({ k: 'dmg', x: e.x + rnd(-8, 8), y: e.y - e.h - 6, vy: -50, life: 0.8, t: 0, v: Math.round(dmg), c: superState.active > 0 ? [242, 181, 68] : [255, 255, 255] }); if (ok && !e.d.boss) { spark(e.x, e.y - e.h / 2, e.d.color, Math.min(6, Math.ceil(dmg / 2))); if (dmg >= 6) shake = Math.max(shake, 0.05); } return ok; };
const _updateParts = updateParts; updateParts = function (dt) { for (const p of parts) if (p.k === 'dmg') { p.y += p.vy * dt; p.t += dt; if (p.t > p.life) p.t = 99; } _updateParts(dt); };
function drawDmgNums() { for (const p of parts) if (p.k === 'dmg') { const a = 1 - p.t / p.life; ctx.font = 'bold ' + (p.v >= 10 ? 14 : 11) + 'px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = rgba([0, 0, 0], a * 0.6); ctx.fillText(p.v, p.x + 1, p.y + 1); ctx.fillStyle = rgba(p.c, a); ctx.fillText(p.v, p.x, p.y); } ctx.textAlign = 'left'; }

/* ---------- 4. minimap strip ---------- */
function drawMinimap() {
  if (demo.active || photo.active || mode !== 'world' || WORLD.id === 'show') return;
  const x0 = 14, x1 = W - 14, y = 82; const sx = (wx) => x0 + (x1 - x0) * clamp(wx / WORLD.width, 0, 1);
  ctx.fillStyle = 'rgba(16,26,46,.5)'; rr(ctx, x0 - 4, y - 8, x1 - x0 + 8, 14, 7); ctx.fill(); ctx.fillStyle = 'rgba(246,236,216,.25)'; ctx.fillRect(x0, y - 1, x1 - x0, 2);
  const mark = (wx, col, glyph) => { const x = sx(wx); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill(); if (glyph) { ctx.font = 'bold 7px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = col; ctx.fillText(glyph, x, y - 4); } };
  for (const b of breakpoints.list) mark(b.x, breakpoints.hit.has(b.x) ? '#ff8a8a' : 'rgba(246,236,216,.5)');
  for (const p of ledger.pages) mark(p.x, '#f2b544', '◆');
  if (WORLD.truckX > 0) mark(WORLD.truckX + 450, '#f6ecd8', 'T');
  if (lockout.active && lockout.barrier) mark(lockout.x, '#7fe0a0', 'L');
  if (WORLD.def && WORLD.def.door && !restored[WORLD.id]) mark(WORLD.def.door.x, '#ff8a5a', 'D');
  for (const n of npcs) if (n.hero && !n.held) mark(n.x, '#7fd0ff');
  for (const e of enemies) if (!e.dead && !e.d.boss) mark(e.x, rgba(LED, 0.7));
  const px = sx(player.x); ctx.fillStyle = '#f2b544'; ctx.beginPath(); ctx.moveTo(px, y - 5); ctx.lineTo(px - 4, y + 3); ctx.lineTo(px + 4, y + 3); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(246,236,216,.35)'; ctx.fillRect(sx(camera.x), y + 4, sx(camera.x + W) - sx(camera.x), 1); ctx.textAlign = 'left';
}

/* ---------- 5. touch buttons: glyphs, press animation, opacity ---------- */
const touchAlpha = { v: 0.6 };
try { const s = localStorage.getItem('hr_touch'); if (s) touchAlpha.v = clamp(parseFloat(s) || 0.6, 0.2, 1); } catch (e) { }
function drawTouchButton(b) {
  const on = touch.btn[b.id]; const r = b.r * (on ? 0.92 : 1);
  ctx.fillStyle = on ? 'rgba(242,181,68,.75)' : 'rgba(16,26,46,.55)'; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(246,236,216,.6)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.save(); ctx.translate(b.x, b.y); ctx.strokeStyle = '#f6ecd8'; ctx.fillStyle = '#f6ecd8'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  if (b.id === 'jump') { ctx.beginPath(); ctx.moveTo(-10, 6); ctx.lineTo(0, -10); ctx.lineTo(10, 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-6, 12); ctx.lineTo(6, 12); ctx.stroke(); }
  else if (b.id === 'dash') { for (const dx of [-8, 0, 8]) { ctx.beginPath(); ctx.moveTo(dx - 4, -8); ctx.lineTo(dx + 4, 0); ctx.lineTo(dx - 4, 8); ctx.stroke(); } }
  else if (b.id === 'use') { ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill(); }
  else if (b.id === 'sup') { ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2 - Math.PI / 2; const rr2 = k % 2 ? 5 : 11; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fill(); }
  else if (b.id === 'nip') { ctx.beginPath(); ctx.arc(0, 2, 7, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-7, -2); ctx.lineTo(-6, -11); ctx.lineTo(-1, -5); ctx.closePath(); ctx.moveTo(7, -2); ctx.lineTo(6, -11); ctx.lineTo(1, -5); ctx.closePath(); ctx.fill(); }
  else { ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(b.label, 0, 4); }
  ctx.restore(); ctx.textAlign = 'left';
}
const _drawOptions2 = drawOptions;
drawOptions = function () { _drawOptions2(); if (!options.open) return; const y = 120 + options.rows.length * 30 + 120; ctx.textAlign = 'center'; ctx.font = '12px system-ui, sans-serif'; ctx.fillStyle = '#f6ecd8'; ctx.fillText('Touch buttons opacity', W / 2, y + 16); const bx = W / 2 - 100; for (const [dx, lbl, dv] of [[0, '−', -0.1], [160, '+', 0.1]]) { ctx.fillStyle = 'rgba(255,255,255,.08)'; rr(ctx, bx + dx, y, 40, 26, 6); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 16px system-ui, sans-serif'; ctx.fillText(lbl, bx + dx + 20, y + 18); uiTaps.push({ x: bx + dx - 6, y: y - 6, w: 52, h: 38, fn: () => { touchAlpha.v = clamp(Math.round((touchAlpha.v + dv) * 10) / 10, 0.2, 1); try { localStorage.setItem('hr_touch', touchAlpha.v); } catch (e) { } } }); } ctx.font = '12px system-ui, sans-serif'; ctx.fillStyle = '#b9c5d6'; ctx.fillText(Math.round(touchAlpha.v * 100) + '%', W / 2, y + 18); ctx.textAlign = 'left'; };

/* ---------- 7. the route menu is a map ---------- */
const routeMap = { open: false, opts: [] };
const MAP_PINS = { easton: [820, 200], taunton: [890, 150], spartanburg: [780, 300], plantcity: [800, 400], lansing: [660, 190], billings: [330, 150], portland: [120, 130], sacramento: [110, 260], aurora: [400, 260], merge: [560, 330], show: [870, 230], photo: [830, 120] };
const _say = say;
say = function (npc, text, options) { _say(npc, text, options); routeMap.open = !npc && /^Where to\?/.test(text) && !!options; routeMap.opts = options || []; };
function drawRouteMap() {
  if (!routeMap.open || !talk.open) { routeMap.open = routeMap.open && talk.open; return; }
  ctx.fillStyle = 'rgba(6,14,8,.9)'; ctx.fillRect(0, 0, W, H - 200);
  ctx.strokeStyle = 'rgba(120,255,140,.2)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H - 200); ctx.stroke(); } for (let y = 0; y < H - 200; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#7fe0a0'; ctx.textAlign = 'left'; ctx.fillText('ROUTE  ·  pick a destination', 40, 40);
  const opts = talk.options || []; opts.forEach((o, i) => { const key = Object.keys(WORLD_DEFS).find(k => WORLD_DEFS[k].name === o.label.replace(' ✓', '')) || (o.label === 'The Merge' ? 'merge' : /Buying Show/.test(o.label) ? 'show' : /photo/.test(o.label) ? 'photo' : null); if (!key || !MAP_PINS[key]) return; const [x, y] = MAP_PINS[key]; const sel = i === talk.sel; const done = /✓/.test(o.label); ctx.strokeStyle = 'rgba(120,255,140,.35)'; ctx.beginPath(); ctx.moveTo(820, 200); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = done ? '#7fe0a0' : sel ? '#f2b544' : '#ff8a8a'; ctx.beginPath(); ctx.arc(x, y, sel ? 9 : 6, 0, Math.PI * 2); ctx.fill(); if (sel) { ctx.strokeStyle = 'rgba(242,181,68,.6)'; ctx.beginPath(); ctx.arc(x, y, 14 + Math.sin(gameTime * 5) * 2, 0, Math.PI * 2); ctx.stroke(); } ctx.fillStyle = sel ? '#f6ecd8' : '#c8f0d0'; ctx.font = (sel ? 'bold ' : '') + '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(o.label.toUpperCase(), x, y + 22); uiTaps.push({ x: x - 40, y: y - 20, w: 80, h: 50, fn: () => { talk.open = false; talk.justClosed = true; routeMap.open = false; if (o.fn) o.fn(); } }); });
  ctx.fillStyle = '#7fe0a0'; ctx.beginPath(); ctx.arc(820, 200, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#c8f0d0'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText('EASTON · HOME', 820, 178); ctx.textAlign = 'left';
}

/* ---------- 9. back of house: an interior behind every stage ---------- */
function drawInterior() {
  if (!stage.active || !arena.active) return; const x0 = arena.x0, x1 = arena.x1, cx = camera.x, cy = camera.y;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - cx, 0, x1 - x0, WORLD.groundY - cy); ctx.clip();
  const g = ctx.createLinearGradient(0, 0, 0, WORLD.groundY - cy); g.addColorStop(0, '#0e1218'); g.addColorStop(1, '#1c2230'); ctx.fillStyle = g; ctx.fillRect(x0 - cx, 0, x1 - x0, WORLD.groundY - cy);
  for (let d = 3; d >= 1; d--) { const par = 0.35 + d * 0.2, alpha = 0.25 + d * 0.15, scale = 0.5 + d * 0.18; const off = (-cx * par) % 220; for (let x = off - 220; x < W + 220; x += 220) { const y = WORLD.groundY - cy - 190 * scale; ctx.fillStyle = 'rgba(40,48,62,' + alpha + ')'; ctx.fillRect(x, y, 14 * scale, 190 * scale); ctx.fillRect(x + 160 * scale, y, 14 * scale, 190 * scale); for (let s = 0; s < 4; s++) { ctx.fillRect(x, y + s * 48 * scale, 174 * scale, 5 * scale); ctx.fillStyle = 'rgba(201,165,106,' + (alpha * 0.8) + ')'; ctx.fillRect(x + 20 * scale, y + s * 48 * scale - 26 * scale, 50 * scale, 24 * scale); ctx.fillRect(x + 90 * scale, y + s * 48 * scale - 26 * scale, 50 * scale, 24 * scale); ctx.fillStyle = 'rgba(40,48,62,' + alpha + ')'; } } }
  // sweeping forklift light
  const lx = x0 - cx + ((gameTime * 90) % (x1 - x0)); const lg = ctx.createRadialGradient(lx, WORLD.groundY - cy - 40, 5, lx, WORLD.groundY - cy - 40, 220); lg.addColorStop(0, 'rgba(255,220,160,.22)'); lg.addColorStop(1, 'rgba(255,220,160,0)'); ctx.fillStyle = lg; ctx.fillRect(lx - 220, 0, 440, WORLD.groundY - cy);
  for (let x = Math.floor((x0 - cx) / 120) * 120; x < W; x += 120) { ctx.fillStyle = 'rgba(255,240,210,.08)'; ctx.fillRect(x, 60, 40, 8); }
  ctx.restore();
}

/* ---------- 11. time-of-day ambience ---------- */
const ambience = { birdT: 0, cricketT: 0 };
function updateAmbience(dt) {
  const night = nightness(hour); if (!audio.started || !audio.on || !audio.ctx || WORLD.def && WORLD.def.indoor) return;
  ambience.birdT -= dt; ambience.cricketT -= dt;
  if (hour > 5.2 && hour < 9 && ambience.birdT <= 0) { ambience.birdT = rnd(1.5, 4); try { const c = audio.ctx, t = c.currentTime; for (let k = 0; k < 3; k++) { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(2200 + Math.random() * 800, t + k * 0.09); o.frequency.exponentialRampToValueAtTime(3200 + Math.random() * 600, t + k * 0.09 + 0.05); o.connect(g); g.connect(audio.master); g.gain.setValueAtTime(0.0001, t + k * 0.09); g.gain.exponentialRampToValueAtTime(0.03, t + k * 0.09 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.09 + 0.08); o.start(t + k * 0.09); o.stop(t + k * 0.09 + 0.1); } } catch (e) { } }
  if (night > 0.35 && ambience.cricketT <= 0 && weather !== 2 && weather !== 3) { ambience.cricketT = rnd(0.6, 1.6); try { const c = audio.ctx, t = c.currentTime; const o = c.createOscillator(), g = c.createGain(); o.type = 'square'; o.frequency.value = 4200; const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 28; lg.gain.value = 0.018; lfo.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(audio.master); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.02, t + 0.05); g.gain.linearRampToValueAtTime(0.0001, t + 0.5); o.start(t); lfo.start(t); o.stop(t + 0.55); lfo.stop(t + 0.55); } catch (e) { } }
}
function drawDawnMist() { if (!(hour > 5.5 && hour < 8.5) || WORLD.def && WORLD.def.indoor) return; const a = 0.35 * (1 - Math.abs(hour - 6.5) / 2); if (a <= 0) return; const gy = WORLD.groundY - camera.y; const g = ctx.createLinearGradient(0, gy - 90, 0, gy); g.addColorStop(0, 'rgba(230,236,255,0)'); g.addColorStop(1, 'rgba(230,236,255,' + a + ')'); ctx.fillStyle = g; ctx.fillRect(0, gy - 90, W, 90); }

/* ---------- 12. boss death cinematic ---------- */
const cine = { t: 0, x: 0, y: 0 };
const _onBossDead5 = onBossDead; onBossDead = function (e) { cine.t = 2; cine.x = e.x; cine.y = e.y - e.h / 2; _onBossDead5(e); };
const _loadWorld8 = loadWorld; loadWorld = function (id, at) { cine.t = 0; _loadWorld8(id, at); };
const _update = update; update = function (dt) { if (cine.t > 0) { cine.t -= dt; dt *= 0.35; } _update(dt); };
const _render2 = render;
render = function () {
  if (cine.t > 0 && mode === 'world') { const p = clamp(cine.t / 2, 0, 1); const z = 1 + 0.18 * Math.sin(p * Math.PI); const fx = cine.x - camera.x, fy = cine.y - camera.y; ctx.save(); ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy); _render2(); ctx.restore(); ctx.fillStyle = 'rgba(0,0,0,' + (0.25 * Math.sin(p * Math.PI)) + ')'; ctx.fillRect(0, 0, W, 40); ctx.fillRect(0, H - 40, W, 40); return; }
  _render2();
};

/* ---------- 13. weapon VFX: muzzle flashes and tracers ---------- */
const _fireDart2 = fireDart; fireDart = function (x, y, target, w, mul, spread) { _fireDart2(x, y, target, w, mul, spread); spawn({ k: 'flash', x, y, life: 0.12, t: 0, c: w.color }); spawn({ k: 'flash', x, y, life: 0.06, t: 0, c: [255, 255, 255] }); };

/* ---------- 14. drive upgrade: dust, DC signs, dashboard clock ---------- */
const _renderDrive = renderDrive;
renderDrive = function () {
  _renderDrive();
  // wheel dust
  if (drive.hop === 0) for (let k = 0; k < 2; k++) { ctx.fillStyle = 'rgba(200,190,170,' + (0.25 - k * 0.08) + ')'; ctx.beginPath(); ctx.arc(120 + 72 - 20 - k * 18 - (drive.t * 80 % 18), 392 + k * 3, 5 + k * 3, 0, Math.PI * 2); ctx.fill(); }
  // dashboard
  const hh = Math.floor(hour) % 12 || 12, mm = Math.floor((hour % 1) * 60), ap = hour >= 12 ? 'PM' : 'AM';
  ctx.fillStyle = 'rgba(16,26,46,.75)'; rr(ctx, W - 190, 14, 176, 46, 10); ctx.fill(); ctx.fillStyle = '#7fe0a0'; ctx.font = 'bold 20px monospace'; ctx.textAlign = 'right'; ctx.fillText(hh + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap, W - 28, 40); ctx.font = '9px monospace'; ctx.fillStyle = '#b9c5d6'; ctx.fillText(story.turnDone ? 'CUTOVER AT MIDNIGHT' : 'DASH', W - 28, 54); ctx.textAlign = 'left';
  // a DC-specific sign every so often
  const per = 900, off = (-drive.x * 1.2) % per; const label = (WORLD_DEFS[drive.to] ? WORLD_DEFS[drive.to].name.toUpperCase() : '') + '  ' + Math.max(0, Math.round(drive.miles * (1 - drive.t / drive.dur))); ctx.fillStyle = '#2e6b8f'; rr(ctx, off + 700, 300, 150, 40, 4); ctx.fill(); ctx.fillStyle = '#2c3038'; ctx.fillRect(off + 770, 340, 6, 40); ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(label, off + 775, 318); ctx.font = '9px system-ui'; ctx.fillText('PHILLIPS PET  ·  DC', off + 775, 332); ctx.textAlign = 'left';
};

/* ---------- 15. weather on the lens ---------- */
const lens = { drops: [], flakes: [] };
for (let i = 0; i < 26; i++) lens.drops.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(2, 5), v: rnd(20, 60), ph: rnd(0, 6) });
for (let i = 0; i < 18; i++) lens.flakes.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(3, 7) });
function drawLensWeather() {
  if (wmix.rain > 0.2 && WORLD.def && !WORLD.def.indoor && mode === 'world') { ctx.save(); ctx.globalCompositeOperation = 'screen'; for (const d of lens.drops) { d.y += d.v / 60; if (d.y > H + 10) { d.y = -10; d.x = rnd(0, W); } const g = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.3, 0, d.x, d.y, d.r); g.addColorStop(0, 'rgba(255,255,255,' + (0.35 * wmix.rain) + ')'); g.addColorStop(1, 'rgba(200,220,255,' + (0.08 * wmix.rain) + ')'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r, d.r * 1.4, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
  if (wmix.snow > 0.2 && mode === 'world') { for (const f of lens.flakes) { const edge = Math.min(f.x, W - f.x, f.y, H - f.y); if (edge > 90) continue; ctx.fillStyle = 'rgba(245,248,255,' + (0.5 * wmix.snow * (1 - edge / 90)) + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); } }
}

/* ---------- 16. reflective show floor ---------- */
WORLD_DEFS.show.water = [{ x0: 0, x1: 4000, y: 442 }];
const _drawWaterReflections = drawWaterReflections;
drawWaterReflections = function (cx, cy, night, sk) {
  if (WORLD.id !== 'show') { _drawWaterReflections(cx, cy, night, sk); return; }
  ctx.save(); ctx.beginPath(); ctx.rect(0, 442 - cy, W, H); ctx.clip();
  const flip = (fn, ax) => { ctx.save(); ctx.translate(ax - cx, 442 - cy); ctx.scale(1, -0.5); ctx.globalAlpha = 0.22; fn(); ctx.restore(); };
  flip(() => drawHero(ctx, hero, 0, 0, player.facing, { t: player.t, run: player.run, moving: player.moving }, null), player.x);
  for (const f of crew) flip(() => drawHero(ctx, f.hero, 0, 0, f.facing, { t: f.t, run: f.run, moving: f.moving }, null), f.x);
  for (const n of npcs) if (Math.abs(n.x - cx - W / 2) < W) flip(() => drawHero(ctx, n.look, 0, 0, n.facing, { t: n.t, run: 0, moving: false }, null), n.x);
  // booth lights mirrored
  for (let i = 0; i < 10; i++) { const x = 900 + i * 300 + 100 - cx; const g = ctx.createLinearGradient(0, 442 - cy, 0, 520 - cy); g.addColorStop(0, 'rgba(255,230,190,.18)'); g.addColorStop(1, 'rgba(255,230,190,0)'); ctx.fillStyle = g; ctx.fillRect(x - 90, 442 - cy, 180, 80); }
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(150,160,190,.25)'; ctx.fillRect(0, 442 - cy, W, H); ctx.restore();
};

/* ---------- 17. title screen redesign ---------- */
(function titleRedesign() {
  const s = document.createElement('style'); s.textContent = `
  #grid { display:flex !important; flex-wrap:nowrap !important; gap:10px !important; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory; padding:8px 12px; max-width:92vw; -webkit-overflow-scrolling:touch; scrollbar-width:thin; }
  .card { flex:0 0 auto; scroll-snap-align:center; width: clamp(96px, 16vmin, 132px) !important; }
  .card .n { font-size: clamp(11px, 1.9vmin, 14px); }
  .card .bio { min-height:3em; }
  #truckRow { position:relative; height:54px; width:92vw; max-width:900px; overflow:hidden; margin: 2px auto 0; }
  #truckRow canvas { position:absolute; left:0; top:0; height:54px; animation: truckRun 14s linear infinite; }
  @keyframes truckRun { from { transform: translateX(-260px); } to { transform: translateX(100vw); } }
  #btnRow { display:flex; gap:10px; justify-content:center; margin-top:8px; flex-wrap:wrap; }
  #newBtn { padding: 8px 22px; font:bold 13px system-ui,-apple-system,sans-serif; letter-spacing:.12em; color:#16223a; background:#f2b544; border:1.5px solid #f2b544; border-radius:8px; cursor:pointer; }
  #demoBtn, #contBtn { margin:0 !important; }
  #title .promise { margin-bottom: 4px; }`;
  document.head && document.head.appendChild(s);
  const grid = document.getElementById('grid'); const demoBtn = document.getElementById('demoBtn'); if (!grid || !demoBtn || !demoBtn.parentNode) return;
  // truck banner
  const row = document.createElement('div'); row.id = 'truckRow'; const tc = document.createElement('canvas'); tc.width = 600; tc.height = 60; row.appendChild(tc);
  try { const g = tc.getContext('2d'); g.scale(0.36, 0.36); drawTrailer(g, 20, 20, 158); } catch (e) { }
  grid.parentNode.insertBefore(row, grid);
  // button row
  const btnRow = document.createElement('div'); btnRow.id = 'btnRow'; const nb = document.createElement('button'); nb.id = 'newBtn'; nb.textContent = '▶ NEW GAME'; nb.addEventListener('click', () => { const sel = titleSel.i; startGame(sel); });
  demoBtn.parentNode.insertBefore(btnRow, demoBtn); btnRow.appendChild(nb); const cb = document.getElementById('contBtn'); if (cb) btnRow.appendChild(cb); btnRow.appendChild(demoBtn);
  const kidRow = document.getElementById('kidRow'); if (kidRow) btnRow.parentNode.insertBefore(kidRow, btnRow);
})();
const titleSel = { i: 4 };
const _buildTitle2 = buildTitle; buildTitle = function () { _buildTitle2(); const grid = document.getElementById('grid'); if (!grid) return; Array.from(grid.children).forEach((card, i) => { if (!card.addEventListener) return; card.addEventListener('mouseenter', () => { titleSel.i = i; }); card.addEventListener('touchstart', () => { titleSel.i = i; }, { passive: true }); }); };

/* ---------- hooks ---------- */
const _drawHUD = drawHUD; drawHUD = function (night) { _drawHUD(night); drawHudCard(); drawMinimap(); drawObjectiveProgress(); };
const _drawStageHUD = drawStageHUD; drawStageHUD = function () { _drawStageHUD(); drawBossBarExtras(); };
const _drawCrewHUD = drawCrewHUD; drawCrewHUD = function () { _drawCrewHUD(); drawRouteMap(); };
const _drawStoryFront4 = drawStoryFront; drawStoryFront = function () { _drawStoryFront4(); drawDmgNums(); };
const _drawStoryLayer3 = drawStoryLayer; drawStoryLayer = function (night) { ctx.save(); ctx.translate(camera.x, camera.y); drawInterior(); ctx.restore(); _drawStoryLayer3(night); };
const _drawLedgerHUD3 = drawLedgerHUD; drawLedgerHUD = function () { drawDawnMist(); drawLensWeather(); _drawLedgerHUD3(); };
const _updateAplus4 = updateAplus; updateAplus = function (dt) { _updateAplus4(dt); updateAmbience(dt); };
