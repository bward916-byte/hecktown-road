/* =====================================================================
   ACT 3 — West Sacramento CA, Aurora CO, The Merge (M7)
   ===================================================================== */
restored.sacramento = false; restored.aurora = false; restored.merge = false;
story.cutoverKey = false;

function farDelta() {
  { const w = 1400, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 214, w, h - 214); for (let i = 0; i < 4; i++) { const px = 300 + i * 260; g.fillRect(px, 120, 8, 94); g.fillRect(px - 60, 120, 150, 6); g.fillRect(px + 84, 126, 4, 40); g.fillRect(px - 40, 126, 4, 30); } LAYERS.ridge = c; }
  { const w = 1600, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 250, w, h - 250); for (let x = 0; x < w; x += 8) if ((x * 31) % 9 < 3) g.fillRect(x, 244, 2, 6); g.fillRect(600, 232, 120, 18); g.fillRect(640, 216, 20, 16); LAYERS.hills = c; }
  { const w = 1200, h = 340, c = mkCanvas(w, h), g = c.getContext('2d'); for (let i = 0; i < 12; i++) { const tx = i * 100 + (i % 3) * 14, th = 100 + (i * 43) % 60; g.fillStyle = i % 2 ? '#6a6a3a' : '#5a5a30'; g.fillRect(tx - 3, h - th * 0.5, 6, th * 0.5); for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(tx + Math.sin(i + k) * 12, h - th + k * th * 0.2, 34 - k * 4, 16, 0, 0, Math.PI * 2); g.fill(); } } LAYERS.trees = c; }
}
function farFrontRange() {
  { const w = 1400, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.beginPath(); g.moveTo(0, h); g.lineTo(0, 200); for (let x = 0; x <= w; x += 70) { g.lineTo(x + 35, 96 + (x * 7919 % 60)); g.lineTo(x + 70, 190); } g.lineTo(w, h); g.closePath(); g.fill(); LAYERS.ridge = c; }
  { const w = 1600, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 248, w, h - 248); for (let x = 0; x < w; x += 12) if ((x * 31) % 11 < 4) g.fillRect(x, 242, 2, 6); g.fillRect(900, 212, 100, 36); g.fillRect(1010, 222, 60, 26); LAYERS.hills = c; }
  { const w = 1200, h = 340, c = mkCanvas(w, h), g = c.getContext('2d'); for (let i = 0; i < 12; i++) { const tx = i * 100 + (i % 3) * 14, th = 90 + (i * 43) % 50; g.fillStyle = i % 2 ? '#3a4a3a' : '#2e3e2e'; for (let k = 0; k < 5; k++) { const ww = 18 - k * 2.4; g.beginPath(); g.moveTo(tx - ww, h - k * th * 0.12); g.lineTo(tx + ww, h - k * th * 0.12); g.lineTo(tx, h - (k + 1.8) * th * 0.12); g.closePath(); g.fill(); } } LAYERS.trees = c; }
}
function drawCranes(g, gy) { for (const x of [2700, 3150]) { g.fillStyle = '#c0392b'; g.fillRect(x, 120, 10, gy - 120); g.fillRect(x + 60, 120, 10, gy - 120); g.fillRect(x - 80, 120, 230, 12); g.fillStyle = '#2c3038'; g.fillRect(x + 20, 120, 30, 30); g.fillRect(x + 32, 132, 3, 60); g.fillStyle = '#e9d27a'; g.fillRect(x + 20, 190, 28, 8); } g.fillStyle = '#31506a'; g.fillRect(0, gy + 30, 1000, H); g.fillStyle = 'rgba(255,220,150,.35)'; for (let x = 0; x < 1000; x += 38) g.fillRect(x, gy + 34 + (x % 3) * 3, 20, 2); }
function drawTiltUp(g, gy) { g.fillStyle = '#d8dde4'; g.fillRect(2700, 200, 700, gy - 200); g.fillStyle = '#c0c6cc'; for (let x = 2700; x < 3400; x += 70) g.fillRect(x, 200, 3, gy - 200); g.fillStyle = '#243447'; rr(g, 2900, 180, 300, 44, 6); g.fill(); g.fillStyle = '#f2b544'; g.font = 'bold 24px Georgia, serif'; g.textAlign = 'center'; g.fillText('PHILLIPS', 3050, 212); g.fillStyle = '#e6d7bd'; g.font = '9px system-ui'; g.fillText('AURORA, CO  ·  NEW', 3050, 236); for (const [x, w] of [[300, 180], [700, 120], [4000, 200]]) drawSnowbank(g, x, gy, w); }
function drawMerge(g, gy) { g.fillStyle = '#8a6a4a'; g.fillRect(2700, 220, 700, gy - 220); g.fillStyle = 'rgba(0,0,0,.1)'; for (let y = 228; y < gy; y += 10) g.fillRect(2700, y, 700, 2); g.fillStyle = '#3a5a8a'; rr(g, 2820, 196, 460, 44, 4); g.fill(); g.fillStyle = '#e6d7bd'; g.font = 'bold 20px Georgia, serif'; g.textAlign = 'center'; g.fillText('CENTRAL PET DISTRIBUTION', 3050, 224); g.save(); g.translate(3050, 236); g.rotate(-0.04); g.fillStyle = '#243447'; rr(g, -120, -16, 240, 32, 4); g.fill(); g.fillStyle = '#f2b544'; g.font = 'bold 18px Georgia, serif'; g.fillText('PHILLIPS', 0, 7); g.fillStyle = '#c9a56a'; g.fillRect(-124, -12, 14, 8); g.fillRect(110, 6, 14, 8); g.restore(); for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#c9a56a' : '#b8b0a0'; g.fillRect(2760 + i * 90, gy - 36, 60, 36); g.fillStyle = '#243447'; g.font = 'bold 7px system-ui'; g.fillText(i % 2 ? 'PHILLIPS' : 'CENTRAL', 2790 + i * 90, gy - 16); } }

WORLD_DEFS.sacramento = makeDC({
  id: 'sacramento', name: 'West Sacramento, CA', location: 'West Sacramento, California — Phillips DC', weather: 0, hour: 18.9, hours: 42, miles: 2780,
  far: farDelta, boss: 'crane', bossName: 'THE CRANE',
  art: { ground: ['#c8b878', '#b8a868', '#8a7a58', '#4a3e30'], grass: '#d8c878', office: ['#e8d8b8', '#b8a888'], wall: ['#e0e0d8', '#a8a8a0'], trim: '#7a7060', rock: '#a89868', sign: 'WEST SACRAMENTO, CA', road: 'W. SACRAMENTO  ·  I-80', before: (g, gy) => drawCranes(g, gy), after: () => {} },
  npc: { name: 'Grace', role: 'Shelter Director' }, lines: ['Grace: "Six dogs, one van, no power in the kennel. Walk them to me — slowly — and keep the machines off them."'],
  steps: [{ type: 'escort', name: 'Rescue run: walk the shelter dogs to Grace', time: 60, n: 4 }, { type: 'deliver', name: 'Humane org order', time: 30, label: 'SHELTER' }, { type: 'boss', name: 'Boss' }],
  hazard: 'none', encounter: ['flicker', 'ghost', 'ghost'],
});
WORLD_DEFS.sacramento.water = [{ x0: 0, x1: 1000, y: 470 }];
WORLD_DEFS.aurora = makeDC({
  id: 'aurora', name: 'Aurora, CO', location: 'Aurora, Colorado — Phillips DC (new, 155,250 sq ft)', weather: 3, hour: 5.4, hours: 26, miles: 1700,
  far: farFrontRange, boss: 'gate', bossName: 'GO-LIVE GATE',
  art: { ground: ['#e8ecf6', '#d8def0', '#6a6a70', '#3a3a44'], grass: '#c9d2e8', office: ['#e8e8ec', '#c0c4cc'], wall: ['#f0f0f4', '#c8ccd4'], trim: '#8a9098', rock: '#8a8a94', sign: 'AURORA, CO', road: 'AURORA  ·  E-470', before: (g, gy) => drawTiltUp(g, gy), after: () => {} },
  npc: { name: 'Marcus', role: 'Move Lead' }, lines: ['Marcus: "We moved this whole DC in four days. Not losing it on night one. Hold the door."'],
  steps: [{ type: 'deliver', name: 'First order out of the new building', time: 30, label: 'FIRST' }, { type: 'scan', name: 'Scan the new racks', time: 26, n: 3 }, { type: 'boss', name: 'Boss' }],
  hazard: 'none', encounter: ['jitter', 'flicker', 'flicker'],
});
WORLD_DEFS.merge = makeDC({
  id: 'merge', name: 'The Merge', location: 'Central Pet legacy DC — systems mid-migration', weather: 1, hour: 2.5, hours: 8, miles: 420,
  far: bakeEastonFar, boss: 'golem', bossName: 'SCHEMA GOLEM',
  art: { ground: ['#6f8f4a', '#5c7a3c', '#6b5a44', '#3f3529'], grass: '#7fa354', office: ['#c8c0b0', '#9a9284'], wall: ['#b8c0c8', '#8a929a'], trim: '#5e6870', rock: '#5a6a44', sign: 'MERGE  ·  CENTRAL + PHILLIPS', road: 'LEGACY DC  ·  MERGE', before: (g, gy) => drawMerge(g, gy), after: () => {} },
  npc: { name: 'Wei', role: 'Data Migration' }, lines: ['Wei: "Two data models, one warehouse, and a thing made of both schemas walking the floor. Only people who speak both can hurt it — EDI, Salesforce, iSeries, or the Architect."'],
  steps: [{ type: 'scan', name: 'Map the fields: scan in posted order', time: 34, n: 3, ordered: true }, { type: 'valves', name: 'Cut over: switch the feeds in order', time: 40, n: 3 }, { type: 'boss', name: 'Boss' }],
  hazard: 'none', encounter: ['packet', 'packet', 'ghost'],
});
WORLD_DEFS.merge.door.roles = ['Umesh', 'Ash', 'Dave', 'Jose']; WORLD_DEFS.merge.door.rolesNeeded = 2;
const ACT3 = ['sacramento', 'aurora'];
WORLD_DEFS.easton.driveOptions = () => [{ label: 'Taunton, MA', to: 'taunton' }].concat(restored.taunton ? [{ label: 'Spartanburg, SC', to: 'spartanburg' }] : []).concat(restored.spartanburg ? ACT2.map(id => ({ label: WORLD_DEFS[id].name + (restored[id] ? ' ✓' : ''), to: id })) : []).concat(ACT2.every(id => restored[id]) ? ACT3.map(id => ({ label: WORLD_DEFS[id].name + (restored[id] ? ' ✓' : ''), to: id })) : []).concat(ACT3.every(id => restored[id]) ? [{ label: 'The Merge' + (restored.merge ? ' ✓' : ''), to: 'merge' }] : []);

/* ---------- escort: shelter dogs ---------- */
const animals = [];
const DOG_COLORS = ['#c98a4a', '#5a4a3a', '#e8e0d0', '#8a8a8a', '#a86a3a', '#3a3a3a'];
function spawnAnimals(x, n) { animals.length = 0; for (let i = 0; i < n; i++) animals.push({ x: x + i * 26, y: groundYAt(x), vx: 0, vy: 0, w: 22, h: 24, facing: 1, onGround: true, wall: 0, run: 0, t: rnd(0, 5), earA: 0, moving: false, col: DOG_COLORS[i % DOG_COLORS.length], scared: 0 }); }
function updateAnimals(dt) {
  for (const a of animals) {
    a.t += dt; if (a.scared > 0) a.scared -= dt;
    const dx = player.x - a.x; const want = Math.abs(dx) > 60 ? Math.sign(dx) * Math.min(260, 60 + Math.abs(dx)) : 0;
    a.vx += clamp(want - a.vx, -1400 * dt, 1400 * dt); if (want) a.facing = Math.sign(want);
    if (a.onGround && a.wall && want) a.vy = -520;
    // Static scares them backwards
    forEnemiesNear(a.x, a.y - 12, 40, e => { if (e.d.boss) return; if (Math.abs(e.x - a.x) < 28 && a.scared <= 0) { a.scared = 1.2; a.vx = -Math.sign(e.x - a.x + 0.01) * 260; a.vy = -260; } });
    a.vy += G * dt; if (a.vy > 900) a.vy = 900; moveBody(a, dt, 11);
    if (arena.active) a.x = clamp(a.x, arena.x0 + 12, arena.x1 - 12);
    a.moving = Math.abs(a.vx) > 20; if (a.moving) a.run = (a.run + dt * 5) % 1;
    a.earA = a.scared > 0 ? -0.6 : (a.moving ? 0.2 : 0);
  }
}
function drawAnimals(night) { for (const a of animals) { drawBiscuit(ctx, a, nearestLight(a.x, a.y - 14, night)); if (a.scared > 0) { ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, a.x - 10, a.y - 52, 20, 14, 4); ctx.fill(); ctx.fillStyle = '#ff8a5a'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'; ctx.fillText('!', a.x, a.y - 41); ctx.textAlign = 'left'; } } }

/* ---------- generic step extensions ---------- */
const _beginStepGeneric = beginStepGeneric;
beginStepGeneric = function () {
  const def = WORLD.def; if (!def.steps) return false;
  const s = def.steps[stage.step]; const d = stage.door;
  const r = _beginStepGeneric(); animals.length = 0; stage.breaches = 0;
  if (s.type === 'escort') { spawnAnimals(d.x0 + 60, s.n); const npc = npcs.find(n => !n.hero && !n.cat); if (npc) { npc.x = d.x1 - 60; npc.y = groundYAt(npc.x); } }
  return r;
};
const _updateStageGeneric = updateStageGeneric;
updateStageGeneric = function (dt) {
  const def = WORLD.def; if (!def.steps) return false;
  const s = def.steps[stage.step];
  if (s.type === 'escort') {
    stage.stepT += dt; stage.timer -= dt; if (stage.timer <= 0) { failStage('Out of time'); return true; }
    stage.spawnT -= dt; if (stage.spawnT <= 0) { stage.spawnT = 5; spawnGroup(player.x, ['flicker', 'jitter']); }
    updateAnimals(dt);
    const npc = npcs.find(n => !n.hero && !n.cat); const home = animals.filter(a => npc && Math.abs(a.x - npc.x) < 90).length;
    stage.progress = home;
    if (home >= animals.length) { stage.step++; grantSkill('challenge'); beginStep(); }
    return true;
  }
  return _updateStageGeneric(dt);
};

/* ---------- role-locked door (The Merge) ---------- */
const _startStage = startStage;
startStage = function (d) {
  if (d.roles) { const have = crewAll().filter(m => d.roles.includes(m.hero.name)).length; if (have < d.rolesNeeded) { player.x = d.x - 32; player.vx = -120; restoredBanner.t = 3.5; restoredBanner.text = 'The golem only fears people who speak both schemas: bring ' + d.rolesNeeded + ' of ' + d.roles.join(', '); return; } }
  _startStage(d);
};

/* ---------- Act 3 bosses ---------- */
ENEMY.crane = { hp: 240, w: 70, h: 40, speed: 0, dmg: 2, shards: 0, boss: 1, color: [255, 210, 120] };
ENEMY.gate = { hp: 60, w: 60, h: 120, speed: 0, dmg: 0, shards: 0, boss: 1, color: [120, 255, 140] };
ENEMY.golem = { hp: 320, w: 80, h: 110, speed: 0, dmg: 1, shards: 0, boss: 1, color: [200, 160, 255] };
const containers = [];
function updateAct3Boss(e, dt) {
  e.pt -= dt; e.alpha = 1; const dx = player.x - e.x;
  if (e.type === 'crane') { // hook rides the gantry; drops containers on a telegraphed spot; hook is targetable when lowered
    if (!e.mode) { e.mode = 'ride'; e.pt = 1.6; e.hy = -260; e.hookX = e.x; }
    if (e.mode === 'ride') { e.targetable = false; e.hookX += (player.x - e.hookX) * Math.min(1, dt * 2); e.hookX = clamp(e.hookX, arena.x0 + 60, arena.x1 - 60); e.hy += (-260 - e.hy) * dt * 3; if (e.pt <= 0) { e.mode = 'tell'; e.pt = 0.9; e.dropX = e.hookX; } }
    else if (e.mode === 'tell') { e.targetable = false; if (e.pt <= 0) { e.mode = 'drop'; e.pt = 0.6; containers.push({ x: e.dropX, y: -200, vy: 0, t: 0, solid: false }); } }
    else if (e.mode === 'drop') { if (e.pt <= 0) { e.mode = 'low'; e.pt = 3.4; } }
    else if (e.mode === 'low') { e.targetable = true; e.hy += (-70 - e.hy) * dt * 6; if (e.pt <= 0) { e.mode = 'ride'; e.pt = 1.2; } }
    e.x = e.hookX; e.y = WORLD.groundY + e.hy + 40;
    for (let i = containers.length - 1; i >= 0; i--) { const c = containers[i]; c.t += dt; if (!c.solid) { c.vy += G * 1.4 * dt; c.y += c.vy * dt; const gy = groundYAt(c.x); if (c.y >= gy) { c.y = gy; c.solid = true; shake = Math.max(shake, 0.3); puff(c.x, gy, 14); if (player.inv <= 0 && player.dead <= 0 && Math.abs(player.x - c.x) < 46 && player.y > gy - 60) hurtPlayer(2, c.x + 1); SOLIDS = WORLD.def.solids().concat(containers.filter(k => k.solid).map(k => [k.x - 40, k.y - 48, 80, 48, 0])); } } else if (c.t > 9) { containers.splice(i, 1); SOLIDS = WORLD.def.solids().concat(containers.filter(k => k.solid).map(k => [k.x - 40, k.y - 48, 80, 48, 0])); } }
    const q = Math.ceil(e.hp / e.maxHp * 4); if (q < e.lastQuarter) { e.lastQuarter = q; for (let i = 0; i < 2; i++) { const f = spawnEnemy('ghost', e.x + rnd(-60, 60), groundYAt(e.x)); if (f) waveState.alive++; } }
    if (e.targetable && player.inv <= 0 && player.dead <= 0 && Math.abs(e.x - player.x) < 36 && player.y > e.y - 20 && player.y - player.h < e.y + 20 && player.dashT <= 0) hurtPlayer(1, e.x);
  }
  if (e.type === 'gate') { // hold the door: Static march at the gate; breaches cost gate HP; survive the clock
    e.targetable = false; if (!e.mode) { e.mode = 'hold'; e.clock = 55; e.spawnT = 1; e.x = arena.x1 - 60; }
    e.y = groundYAt(e.x); e.clock -= dt; e.spawnT -= dt;
    if (e.spawnT <= 0) { e.spawnT = clamp(2.6 - (55 - e.clock) * 0.03, 1.1, 2.6); const kinds = ['flicker', 'flicker', 'jitter', 'packet', 'lag', 'firewall']; const t = kinds[(Math.random() * Math.min(kinds.length, 2 + ((55 - e.clock) / 10 | 0))) | 0]; const sx = arena.x0 + 30; const f = spawnEnemy(t, sx, groundYAt(sx) - 2); if (f) { f.goalX = e.x - 20; waveState.alive++; waveState.rifts.push({ x: sx, y: f.y - 20, t: 0, c: f.d.color }); } }
    for (const f of enemies) if (f.goalX !== undefined && !f.dead && Math.abs(f.x - f.goalX) < 26) { f.dead = true; waveState.alive--; e.hp -= 12; stage.breaches = (stage.breaches || 0) + 1; shake = Math.max(shake, 0.2); spark(e.x, e.y - 60, [255, 90, 90], 10); }
    if (e.hp <= 0) { failStage('The gate fell'); return; }
    if (e.clock <= 0) { e.hp = 0; e.dead = true; killEnemy(e); }
  }
  if (e.type === 'golem') { // slow stomper; only the schema-speakers' weapons hurt it
    e.targetable = true; if (!e.mode) { e.mode = 'walk'; e.pt = 2.2; }
    if (e.mode === 'walk') { e.vx += clamp(Math.sign(dx) * 70 - e.vx, -300 * dt, 300 * dt); e.facing = Math.sign(dx) || e.facing; if (e.pt <= 0) { e.mode = 'stomp'; e.pt = 1.1; e.vx = 0; } }
    else { if (e.pt < 0.5 && !e.stomped) { e.stomped = true; shake = Math.max(shake, 0.25); summons.push({ k: 'slam', x: e.x, y: e.y, R: 220, t: 0, life: 0.6, c: [200, 160, 255] }); if (player.onGround && player.inv <= 0 && player.dead <= 0 && Math.abs(player.x - e.x) < 220) hurtPlayer(1, e.x); } if (e.pt <= 0) { e.mode = 'walk'; e.pt = 2.4; e.stomped = false; } }
    const q = Math.ceil(e.hp / e.maxHp * 4); if (q < e.lastQuarter) { e.lastQuarter = q; for (let i = 0; i < 2; i++) { const f = spawnEnemy('packet', e.x + rnd(-60, 60), e.y); if (f) { f.vy = -350; waveState.alive++; } } }
    e.vy += G * dt; if (e.vy > 900) e.vy = 900; moveBody(e, dt, e.w / 2); e.x = clamp(e.x, arena.x0 + e.w / 2, arena.x1 - e.w / 2);
    if (player.inv <= 0 && player.dead <= 0) { const ox = Math.abs(e.x - player.x) < (e.w + player.w) / 2 - 6, oy = player.y > e.y - e.h && player.y - player.h < e.y; if (ox && oy && player.dashT <= 0) hurtPlayer(1, e.x); }
  }
}
// golem damage gate: only role heroes' shots count
const _damageEnemy = damageEnemy;
damageEnemy = function (e, dmg, fromX, src) {
  if (e.type === 'golem' && !WORLD_DEFS.merge.door.roles.includes(shooterName)) { spark(e.x, e.y - e.h / 2, [120, 120, 140], 2); e.hit = 0.05; return false; }
  return _damageEnemy(e, dmg, fromX, src);
};
function drawAct3Boss(c, e) {
  c.save(); c.translate(e.x, e.y);
  glitchDraw(c, e, (g, tint) => {
    const base = tint ? rgb(tint) : '#1c2230', edge = tint ? rgb(tint) : (e.hit > 0 ? '#fff' : rgb(e.d.color));
    g.fillStyle = base; g.strokeStyle = edge; g.lineWidth = 2;
    if (e.type === 'crane') { g.strokeStyle = tint ? edge : '#c8c8d0'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -H); g.lineTo(0, -30); g.stroke(); g.fillStyle = base; g.strokeStyle = edge; g.lineWidth = 2; rr(g, -16, -32, 32, 26, 4); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-14, -6); g.quadraticCurveTo(0, 30, 14, -6); g.lineWidth = 6; g.stroke(); if (!tint) { g.fillStyle = e.mode === 'low' ? '#7fe0a0' : e.mode === 'tell' ? '#ff5a5a' : edge; g.fillRect(-4, -26, 8, 8); } }
    if (e.type === 'gate') { g.fillStyle = tint ? base : '#243447'; rr(g, -30, -120, 60, 120, 6); g.fill(); g.stroke(); if (!tint) { for (let k = 0; k < 6; k++) { g.fillStyle = k < Math.round(6 * e.hp / e.maxHp) ? '#7fe0a0' : '#3a4048'; g.fillRect(-22, -110 + k * 18, 44, 12); } g.fillStyle = '#f2b544'; g.font = 'bold 9px system-ui'; g.textAlign = 'center'; g.fillText('GO LIVE', 0, -126); g.fillStyle = '#fff'; g.font = 'bold 12px monospace'; g.fillText(Math.max(0, Math.ceil(e.clock || 0)) + 's', 0, -136); } }
    if (e.type === 'golem') { g.scale(e.facing, 1); g.fillStyle = tint ? base : '#3a3a5a'; rr(g, -30, -110, 60, 70, 10); g.fill(); g.stroke(); rr(g, -22, -40, 18, 40, 5); g.fill(); g.stroke(); rr(g, 4, -40, 18, 40, 5); g.fill(); g.stroke(); rr(g, -40, -100, 12, 50, 5); g.fill(); g.stroke(); rr(g, 28, -100, 12, 50, 5); g.fill(); g.stroke(); if (!tint) { g.fillStyle = '#c9a56a'; g.font = 'bold 7px monospace'; g.textAlign = 'center'; for (let k = 0; k < 4; k++) g.fillText(k % 2 ? 'ODHED' : 'ORDER__C', 0, -96 + k * 14); g.fillStyle = e.mode === 'stomp' ? '#ff5a5a' : edge; g.fillRect(-10, -104, 6, 6); g.fillRect(4, -104, 6, 6); } }
  });
  c.restore();
}
function drawContainers() { for (const c of containers) { ctx.save(); ctx.translate(c.x, c.y); if (!c.solid) { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, groundYAt(c.x) - c.y, 40, 6, 0, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#c0392b'; rr(ctx, -40, -48, 80, 48, 3); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.15)'; for (let x = -36; x < 40; x += 8) ctx.fillRect(x, -46, 2, 44); ctx.fillStyle = '#fff'; ctx.font = 'bold 8px system-ui'; ctx.textAlign = 'center'; ctx.fillText('PHILLIPS', 0, -20); ctx.restore(); } ctx.textAlign = 'left'; }
