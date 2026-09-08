/* =====================================================================
   LIFE PASS (M19) — Biscuit, the cat, formations, boss entrances, layer cache + preload
   ===================================================================== */

/* ---------- 17. layer cache + preload at the title ---------- */
const layerCache = {};
const _loadWorld11 = loadWorld;
loadWorld = function (id, at) {
  _loadWorld11(id, at);
  // everything painted onto the layers by later modules (props, signage, softened far layers, clouds, fg) is now final for this world — keep it
  if (!layerCache[id]) layerCache[id] = { play: LAYERS.play, ridge: LAYERS.ridge, hills: LAYERS.hills, trees: LAYERS.trees, clouds: LAYERS.clouds, fgWorld: LAYERS.fgWorld };
};
const preload = { list: ['easton', 'taunton', 'spartanburg', 'plantcity', 'lansing', 'billings', 'portland', 'sacramento', 'aurora', 'merge', 'show'], i: 0, t: 1.5, done: false };
function preloadTick(dt) {
  if (preload.done || running) return; preload.t -= dt; if (preload.t > 0) return; preload.t = 0.5;
  const id = preload.list[preload.i++]; if (!id) { preload.done = true; return; }
  if (layerCache[id]) return;
  const keepWorld = WORLD.id, keepX = titleBg.x; loadWorld(id, { x: 300, y: 440 }); loadWorld(keepWorld, { x: 300, y: 440 }); titleBg.x = keepX; camera.x = clamp(keepX, 0, WORLD.width - W); setObjectives([]); transition.t = 0;
}
const _titleTick2 = titleTick; titleTick = function (dt) { _titleTick2(dt); preloadTick(dt); };

/* ---------- 6. Biscuit has a life ---------- */
const dogAI = { state: 'follow', t: 0, target: null, bark: 0, idleT: 0 };
const _updateDog = updateDog;
updateDog = function (dt) {
  _updateDog(dt);
  if (photo.active || demo.active && false) return;
  dogAI.t -= dt; dogAI.bark -= dt;
  const moving = Math.abs(player.vx) > 20; dogAI.idleT = moving ? 0 : dogAI.idleT + dt;
  const near = nearestEnemy(dog.x, dog.y - 14, 260);
  if (near && !near.d.boss && Math.abs(near.x - dog.x) > 70) { // bark from a distance
    dogAI.state = 'bark'; dog.vx *= 0.5; dog.facing = Math.sign(near.x - dog.x) || dog.facing; if (dogAI.bark <= 0) { dogAI.bark = rnd(1.2, 2.4); dog.grr = 0.8; sfx('kill'); dog.bubble = ['woof!', 'GRR', 'woof woof'][(Math.random() * 3) | 0]; dog.bubbleT = 1; } return;
  }
  if (chuck.present && chuck.up > 0.6 && Math.abs(chuck.x - dog.x) < 320 && Math.abs(player.x - dog.x) < 500) { // chase Chuck
    dogAI.state = 'chase'; dog.vx += clamp(Math.sign(chuck.x - dog.x) * 300 - dog.vx, -900 * dt, 900 * dt); dog.facing = Math.sign(dog.vx) || dog.facing; if (Math.abs(chuck.x - dog.x) < 60) { chuck.up = 0; if (!dogAI.chuckSaid) { dogAI.chuckSaid = true; dog.bubble = '…nearly.'; dog.bubbleT = 1.5; } } return;
  }
  dogAI.chuckSaid = false;
  if (dogAI.idleT > 6 && Math.abs(player.x - dog.x) < 120 && dog.onGround) { dogAI.state = 'curl'; dog.vx = 0; return; }
  if (!moving && dogAI.t <= 0 && dog.onGround) { // sniff the nearest prop
    dogAI.t = rnd(4, 9); const props = quickProps.filter(q => Math.abs(q.x - dog.x) < 160); const b = breakpoints.list.filter(q => Math.abs(q.x - dog.x) < 160); const tgt = props[0] ? props[0].x : (b[0] ? b[0].x : null);
    if (tgt !== null) { dogAI.state = 'sniff'; dogAI.target = tgt; dogAI.sniffT = 2.2; }
  }
  if (dogAI.state === 'sniff' && dogAI.target !== null) { const d = dogAI.target - dog.x; if (Math.abs(d) > 20) dog.vx += clamp(Math.sign(d) * 120 - dog.vx, -700 * dt, 700 * dt); else { dog.vx = 0; dogAI.sniffT -= dt; if (dogAI.sniffT < 1.8 && !dog.bubbleT) { dog.bubble = 'sniff sniff'; dog.bubbleT = 1.2; } if (dogAI.sniffT <= 0) { dogAI.state = 'follow'; dogAI.target = null; } } dog.facing = Math.sign(dog.vx) || dog.facing; return; }
  dogAI.state = 'follow';
};
const _drawBiscuit = drawBiscuit;
drawBiscuit = function (c, d, lit) {
  const isDog = d === dog;
  if (isDog && (dogAI.state === 'curl' || photo.active)) { // curled up / sitting
    c.save(); c.translate(d.x, d.y); c.scale(d.facing, 1); c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.ellipse(0, 1, 18, 4, 0, 0, Math.PI * 2); c.fill();
    const col = d.col || '#c98a4a';
    if (photo.active) { c.fillStyle = col; rr(c, -12, -22, 22, 22, 8); c.fill(); c.beginPath(); c.arc(12, -30, 9, 0, Math.PI * 2); c.fill(); c.fillStyle = '#8c5a2b'; rr(c, 14, -28, 9, 7, 3); c.fill(); c.fillStyle = '#1b1b1f'; c.beginPath(); c.arc(21, -27, 1.5, 0, Math.PI * 2); c.fill(); c.fillStyle = col; c.fillRect(-9, -6, 5, 6); c.fillRect(2, -6, 5, 6); c.save(); c.translate(-12, -14); c.rotate(-1.2 + Math.sin(d.t * 8) * 0.3); c.fillRect(-2, -12, 4, 14); c.restore(); }
    else { c.fillStyle = col; c.beginPath(); c.ellipse(0, -9, 20, 9, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(-12, -11, 8, 0, Math.PI * 2); c.fill(); c.fillStyle = '#8c5a2b'; c.beginPath(); c.arc(-17, -7, 4, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#1b1b1f'; c.lineWidth = 1; c.beginPath(); c.moveTo(-15, -12); c.lineTo(-11, -12); c.stroke(); if (Math.floor(d.t) % 3 === 0) { c.scale(d.facing, 1); c.fillStyle = 'rgba(246,236,216,.8)'; c.font = 'italic 10px Georgia, serif'; c.fillText('z', 14, -26 - (d.t % 1) * 10); } }
    c.restore(); return;
  }
  _drawBiscuit(c, d, lit);
  if (isDog && d.bubbleT > 0) { d.bubbleT -= 1 / 60; c.save(); c.globalAlpha = Math.min(1, d.bubbleT); c.font = 'italic 10px Georgia, serif'; const tw = c.measureText(d.bubble).width + 14; c.fillStyle = 'rgba(246,236,216,.9)'; rr(c, d.x - tw / 2, d.y - 56, tw, 18, 6); c.fill(); c.fillStyle = '#243447'; c.textAlign = 'center'; c.fillText(d.bubble, d.x, d.y - 43); c.restore(); c.textAlign = 'left'; }
};

/* ---------- 7. the cat that stayed ---------- */
const petCat = { present: false, x: 0, y: 440, t: 0, dir: 1, onRoof: false };
const _updateVignette = updateVignette;
updateVignette = function (dt) { const had = !!vignette.cat; _updateVignette(dt); if (had && !vignette.cat) { story.petCat = true; petCat.present = true; petCat.x = player.x + 60; } };
function updatePetCat(dt) {
  if (!petCat.present) return; petCat.t += dt;
  const owner = crew.find(f => f.hero.name === 'Rianan') || player;
  const truckRoof = WORLD.truckX > 0 && Math.abs(player.x - (WORLD.truckX + 300)) < 260;
  if (truckRoof) { petCat.onRoof = true; const tx = WORLD.truckX + 300; petCat.x += (tx - petCat.x) * Math.min(1, dt * 3); petCat.y = 288; return; }
  petCat.onRoof = false; const d = owner.x - 40 * owner.facing - petCat.x; if (Math.abs(d) > 30) { petCat.x += Math.sign(d) * Math.min(Math.abs(d), 150 * dt); petCat.dir = Math.sign(d); } petCat.y = groundYAt(petCat.x);
}
function drawPetCat() { if (!petCat.present) return; drawCat(ctx, petCat.x, petCat.y, petCat.dir, petCat.t, Math.abs(player.x - petCat.x) < 80 || petCat.onRoof); }
const _loadWorld12 = loadWorld; loadWorld = function (id, at) { _loadWorld12(id, at); petCat.present = !!story.petCat && id === 'easton'; if (petCat.present) { petCat.x = player.x + 50; petCat.y = groundYAt(petCat.x); } };

/* ---------- 10. formations and drop-pods ---------- */
const pods = [];
const _spawnGroup = spawnGroup;
spawnGroup = function (x, kinds) {
  const packets = kinds.filter(k => k === 'packet'), rest = kinds.filter(k => k !== 'packet');
  for (let i = 0; i < packets.length; i++) { pods.push({ x: x + rnd(-200, 200), y: -120, vy: 0, t: 0, kind: 'packet' }); waveState.alive++; }
  const before = enemies.length; _spawnGroup(x, rest); const born = enemies.slice(before);
  // scouts fly in a V; shield units line up in a wall
  const scouts = born.filter(e => e.type === 'flicker'); if (scouts.length >= 3) scouts.forEach((e, i) => { e.form = { lead: scouts[0], off: (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 34, up: Math.ceil(i / 2) * 14 }; });
  const shields = born.filter(e => e.type === 'firewall'); if (shields.length >= 2) shields.forEach((e, i) => { e.x = shields[0].x + i * 44; e.wall = 1; });
};
function updatePods(dt) {
  for (let i = pods.length - 1; i >= 0; i--) { const p = pods[i]; p.t += dt; p.vy += G * 0.9 * dt; p.y += p.vy * dt; const gy = groundYAt(p.x); if (p.y >= gy) { p.y = gy; if (!p.landed) { p.landed = true; p.open = 0; shake = Math.max(shake, 0.2); puff(p.x, gy, 10); sfx('kill'); } p.open += dt; if (p.open > 0.6) { const e = spawnEnemy(p.kind, p.x, gy); if (e) e.born = 0.3; pods.splice(i, 1); } } }
}
function drawPods() { for (const p of pods) { ctx.save(); ctx.translate(p.x, p.y); const o = p.open || 0; ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 1, 18, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = STEEL; ctx.save(); ctx.translate(-10, -14); ctx.rotate(-o * 1.6); rr(ctx, -10, -18, 20, 32, 6); ctx.fill(); ctx.restore(); ctx.save(); ctx.translate(10, -14); ctx.rotate(o * 1.6); rr(ctx, -10, -18, 20, 32, 6); ctx.fill(); ctx.restore(); if (!p.landed) { ctx.fillStyle = rgba(LED, 0.8); ctx.fillRect(-2, -36, 4, 4); ctx.fillStyle = 'rgba(255,200,120,.6)'; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.lineTo(0, 24 + Math.random() * 10); ctx.closePath(); ctx.fill(); } if (o > 0) { ctx.fillStyle = rgba(LED, 0.35 * Math.min(1, o * 2)); ctx.beginPath(); ctx.arc(0, -14, 14, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); } }
const _updateEnemy = updateEnemy;
updateEnemy = function (e, dt) {
  _updateEnemy(e, dt);
  if (e.form && !e.dead && e.form.lead && !e.form.lead.dead && e.form.lead !== e && Math.abs(player.x - e.x) > 260) { const tx = e.form.lead.x + e.form.off; e.x += (tx - e.x) * Math.min(1, dt * 3); e.y = Math.min(e.y, e.form.lead.y - e.form.up); }
};

/* ---------- 11. boss entrances ---------- */
const bossEntry = { t: 0, type: null, x: 0 };
const _spawnBoss3 = spawnBoss;
spawnBoss = function (type, x, y) {
  const e = _spawnBoss3(type, x, y); if (!e) return e; bossEntry.t = 1.3; bossEntry.type = type; bossEntry.x = e.x; bossEntry.y = e.y;
  if (type === 'snowdrift') { for (let k = 0; k < 30; k++) spawn({ k: 'snow', x: e.x + rnd(-90, 90), y: e.y - rnd(0, 80), vx: rnd(-300, 300), vy: rnd(-400, -60), life: 1.2, t: 0 }); shake = 0.5; }
  if (type === 'drainpipe') { for (let k = 0; k < 40; k++) spawn({ k: 'spark', x: e.x + rnd(-40, 40), y: e.y, vx: rnd(-80, 80), vy: rnd(-520, -200), life: 1, t: 0, c: [140, 200, 255] }); shake = 0.4; }
  if (type === 'peachpit') { e.x = arena.x1 - 40; e.vx = -400; }
  if (['fogserver', 'gate', 'queen', 'golem'].includes(type)) e.entryT = type === 'golem' ? 1.1 : 0.9;
  return e;
};
const _updateBoss3 = updateBoss;
updateBoss = function (e, dt) { _updateBoss3(e, dt); if (e.entryT > 0) { e.entryT -= dt; e.targetable = false; e.alpha = Math.min(e.alpha === undefined ? 1 : e.alpha, 1 - e.entryT / 1.2); } };
function drawBossEntry() {
  if (bossEntry.t <= 0) return; bossEntry.t -= 1 / 60; const p = 1 - bossEntry.t / 1.3; const x = bossEntry.x, y = bossEntry.y;
  ctx.save();
  if (bossEntry.type === 'golem') { for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + p * 2; const r = (1 - p) * 220; ctx.fillStyle = k % 2 ? '#c9a56a' : '#b8b0a0'; ctx.save(); ctx.translate(x + Math.cos(a) * r, y - 50 + Math.sin(a) * r * 0.5); ctx.rotate(a); ctx.fillRect(-14, -10, 28, 20); ctx.restore(); } }
  if (bossEntry.type === 'fogserver') { ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba([200, 210, 230], 0.12 * (1 - p)); ctx.beginPath(); ctx.arc(x + Math.cos(p * 5 + k) * 60 * (1 - p), y - 40 + Math.sin(p * 4 + k) * 30, 50 + k * 10, 0, Math.PI * 2); ctx.fill(); } }
  if (bossEntry.type === 'crane') { ctx.strokeStyle = '#c8c8d0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, -H); ctx.lineTo(x, y - 300 + p * 260); ctx.stroke(); }
  if (bossEntry.type === 'queen') { ctx.fillStyle = 'rgba(0,0,0,' + (0.6 * (1 - p)) + ')'; ctx.fillRect(x - 90, y - 120, 180, 120); for (let k = 0; k < 3; k++) { ctx.fillStyle = rgba([255, 150, 60], (1 - p) * 0.9); ctx.fillRect(x - 30 + k * 30, y - 70 + Math.sin(k) * 10, 6, 6); } }
  if (bossEntry.type === 'hydra') { for (let k = 0; k < 3; k++) { ctx.fillStyle = '#2c3038'; ctx.fillRect(x - 100 + k * 70, y - 40 * p, 40, 40 * p); } }
  ctx.restore();
}

/* ---------- hooks ---------- */
const _updateAplus5 = updateAplus; updateAplus = function (dt) { _updateAplus5(dt); updatePods(dt); updatePetCat(dt); };
const _drawStoryLayer4 = drawStoryLayer; drawStoryLayer = function (night) { _drawStoryLayer4(night); drawPods(); drawBossEntry(); drawPetCat(); };
