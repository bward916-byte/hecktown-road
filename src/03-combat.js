/* =====================================================================
   COMBAT CORE (M1)
   ===================================================================== */
const enemies = [], projs = [], beams = [], shards = [], summons = [];
const MAXPROJ = 400, MAXENEMY = 120;
const bucks = { n: 0, total: 0 };
const waveState = { n: 0, alive: 0, cd: 2.5, spawned: 0, toSpawn: 0, rifts: [] };
const shop = { open: false, sel: 0, near: false };
let COFFEE = { x: 1180, y: 440 }; // machine by the entrance
let CHECKPOINT = { x: 1140, y: 440 };

/* ---------- spatial hash ---------- */
const HASH = { cell: 128, map: new Map() };
function hashKey(cx, cy) { return cx * 73856 + cy; }
function rebuildHash() {
  HASH.map.clear();
  for (const e of enemies) { if (e.dead) continue; const k = hashKey((e.x / HASH.cell) | 0, (e.y / HASH.cell) | 0); let a = HASH.map.get(k); if (!a) { a = []; HASH.map.set(k, a); } a.push(e); }
}
function forEnemiesNear(x, y, r, fn) {
  const c = HASH.cell, x0 = ((x - r) / c) | 0, x1 = ((x + r) / c) | 0, y0 = ((y - r) / c) | 0, y1 = ((y + r) / c) | 0;
  for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) { const a = HASH.map.get(hashKey(cx, cy)); if (a) for (const e of a) if (!e.dead) fn(e); }
}
function nearestEnemy(x, y, r, pred) {
  let best = null, bd = r * r, coc = null, cd = r * r;
  forEnemiesNear(x, y, r, e => { if (!e.targetable) return; if (pred && !pred(e)) return; const d = (e.x - x) ** 2 + (e.y - 20 - y) ** 2; if (e.d.cocoon) { if (d < cd) { cd = d; coc = e; } return; } if (d < bd) { bd = d; best = e; } });
  return best || coc;
}
function biggestEnemy(x, y, r) {
  let best = null, bh = -1;
  forEnemiesNear(x, y, r, e => { if (!e.targetable) return; if (e.d.cocoon && best) return; if ((e.x - x) ** 2 + (e.y - y) ** 2 > r * r) return; if (e.hp > bh) { bh = e.hp; best = e; } });
  return best;
}

/* ---------- enemy defs ---------- */
const ENEMY = {
  flicker:   { hp: 3,  w: 18, h: 18, speed: 130, hop: 1, dmg: 1, shards: 2, color: [120, 230, 255] },
  jitter:    { hp: 4,  w: 14, h: 34, speed: 230, zig: 1, dmg: 1, shards: 3, color: [255, 120, 220] },
  lag:       { hp: 14, w: 40, h: 30, speed: 45,  sticky: 1, dmg: 1, shards: 5, color: [140, 255, 120] },
  packet:    { hp: 6,  w: 24, h: 24, speed: 110, split: 1, dmg: 1, shards: 3, color: [255, 200, 90] },
  firewall:  { hp: 16, w: 30, h: 40, speed: 70,  shield: 1, dmg: 1, shards: 6, color: [255, 90, 70] },
  ghost:     { hp: 5,  w: 26, h: 26, speed: 120, ghost: 1, dmg: 1, shards: 4, color: [200, 200, 255] },
  beetle:    { hp: 40, w: 62, h: 34, speed: 90,  armor: 1, charge: 1, dmg: 2, shards: 12, color: [255, 150, 60] },
};
function spawnEnemy(type, x, y) {
  if (enemies.length >= MAXENEMY) return null;
  const d = ENEMY[type];
  const e = { type, d, x, y, vx: 0, vy: 0, w: d.w, h: d.h, hp: d.hp, maxHp: d.hp, facing: 1, onGround: false, wall: 0, t: rnd(0, 6), hit: 0, stun: 0, slow: 0, weak: 0, dead: false, targetable: !d.ghost, revealed: 0, chargeT: 0, born: 0.4, hopCd: rnd(0.2, 0.8), zigT: 0, seen: false };
  enemies.push(e); return e;
}
function damageEnemy(e, dmg, fromX, src) {
  if (e.dead || e.born > 0) return false;
  if (e.d.boss && !e.targetable) return false;
  if (e.d.shield && fromX !== undefined) { const front = Math.sign(fromX - e.x) === e.facing; if (front) { spark(e.x + e.facing * e.w / 2, e.y - e.h / 2, [255, 120, 100], 3); e.hit = 0.06; return false; } }
  if (e.d.armor) dmg = Math.max(1, dmg - e.d.armor);
  if (e.d.cocoon) dmg *= 3; // webs are fragile
  if (e.weak > 0) dmg *= 1.5;
  e.hp -= dmg; e.hit = 0.12;
  if (fromX !== undefined) e.vx += Math.sign(e.x - fromX) * 60;
  spark(e.x, e.y - e.h / 2, e.d.color, 3);
  if (e.hp <= 0) killEnemy(e);
  return true;
}
function killEnemy(e) {
  e.dead = true; sfx(e.d.boss ? 'boss' : 'kill');
  if (e.d.boss) { onBossDead(e); }
  else waveState.alive--;
  for (let i = 0; i < (e.d.boss ? 60 : 10); i++) spawn({ k: 'glitch', x: e.x + rnd(-e.w / 2, e.w / 2), y: e.y - rnd(0, e.h), vx: rnd(-120, 120), vy: rnd(-160, 40), life: rnd(0.3, 0.6), t: 0, c: e.d.color });
  for (let i = 0; i < e.d.shards; i++) shards.push({ x: e.x, y: e.y - e.h / 2, vx: rnd(-140, 140), vy: rnd(-260, -80), t: 0, v: e.d.beetle ? 2 : 1 });
  if (e.d.split) for (let i = 0; i < 3; i++) { const f = spawnEnemy('flicker', e.x + (i - 1) * 14, e.y); if (f) { f.vy = -300; f.vx = (i - 1) * 120; f.born = 0.2; waveState.alive++; } }
  shake = Math.max(shake, e.d.beetle ? 0.35 : 0.06);
}
function spark(x, y, c, n) { for (let i = 0; i < n; i++) spawn({ k: 'spark', x, y, vx: rnd(-160, 160), vy: rnd(-160, 160), life: rnd(0.15, 0.35), t: 0, c }); }

let shooterName = '';
function updateEnemy(e, dt) {
  e.t += dt; if (e.hit > 0) e.hit -= dt; if (e.born > 0) e.born -= dt; if (e.stun > 0) e.stun -= dt; if (e.slow > 0) e.slow -= dt; if (e.weak > 0) e.weak -= dt;
  if (e.d.cocoon) return;
  const tgtX = e.goalX !== undefined ? e.goalX : player.x;
  const dx = tgtX - e.x, dist = Math.abs(dx);
  const sp = e.d.speed * (e.slow > 0 ? 0.5 : 1) * (e.stun > 0 ? 0 : 1);
  if (e.d.ghost) { e.revealed = dist < 110 ? 1 : Math.max(0, e.revealed - dt * 2); e.targetable = e.revealed > 0.05; }
  if (e.stun <= 0 && e.born <= 0) {
    if (e.d.charge) {
      e.chargeT -= dt;
      if (e.chargeT <= 0 && dist < 380 && e.onGround) { e.chargeT = 2.8; e.charging = 1.1; e.facing = Math.sign(dx) || 1; }
      if (e.charging > 0) { e.charging -= dt; e.vx = e.facing * 380; if (e.wall) { e.charging = 0; e.stun = 0.9; shake = Math.max(shake, 0.15); } }
      else { e.vx += clamp(Math.sign(dx) * sp - e.vx, -600 * dt, 600 * dt); if (Math.abs(e.vx) > 5) e.facing = Math.sign(e.vx); }
    } else if (e.d.zig) {
      e.zigT -= dt; if (e.zigT <= 0) { e.zigT = rnd(0.25, 0.6); e.zigDir = Math.random() < 0.7 ? Math.sign(dx) : -Math.sign(dx); }
      e.vx += clamp((e.zigDir || 1) * sp - e.vx, -1600 * dt, 1600 * dt); e.facing = Math.sign(e.vx) || e.facing;
      if (e.onGround && Math.random() < dt * 1.5) e.vy = -420;
    } else {
      e.vx += clamp(Math.sign(dx) * sp - e.vx, -700 * dt, 700 * dt); if (Math.abs(e.vx) > 5) e.facing = Math.sign(e.vx);
      if (e.d.hop && e.onGround) { e.hopCd -= dt; if (e.hopCd <= 0) { e.hopCd = rnd(0.4, 0.9); e.vy = -rnd(260, 380); } }
      if (e.onGround && e.wall && !e.d.sticky) e.vy = -440;
    }
  } else e.vx *= 0.9;
  e.vy += G * dt; if (e.vy > 900) e.vy = 900;
  moveBody(e, dt, e.w / 2);
  if (e.d.sticky && e.onGround && Math.random() < dt * 4) spawn({ k: 'goo', x: e.x + rnd(-e.w / 2, e.w / 2), y: e.y, life: 3.5, t: 0 });
  // contact damage
  if (player.inv <= 0 && player.dead <= 0 && e.born <= 0) {
    const ox = Math.abs(e.x - player.x) < (e.w + player.w) / 2 - 2, oy = player.y > e.y - e.h && player.y - player.h < e.y;
    if (ox && oy) {
      if (player.dashT > 0) return; // dash i-frames
      hurtPlayer(e.d.dmg, e.x);
    }
  }
}
function hurtPlayer(n, fromX) {
  sfx('hurt'); player.hp -= n; player.inv = 1.1; player.vx = Math.sign(player.x - fromX) * 260; player.vy = -280; shake = Math.max(shake, 0.25);
  spark(player.x, player.y - 26, [255, 90, 90], 8);
  if (player.hp <= 0) { player.hp = 0; player.dead = 1.6; }
}
function respawn() {
  if (stage.active) { failStage('Signal lost'); return; }
  player.hp = player.maxHp; player.inv = 2; player.x = CHECKPOINT.x; player.y = CHECKPOINT.y; player.vx = 0; player.vy = 0;
  for (let i = enemies.length - 1; i >= 0; i--) if (!enemies[i].d.cocoon) { enemies[i].dead = true; enemies.splice(i, 1); }
  projs.length = 0; beams.length = 0; summons.length = 0; for (const f of crew) { f.x = player.x - 30; f.y = player.y; f.vx = 0; }
  waveState.alive = 0; waveState.toSpawn = 0; waveState.cd = 3; waveState.n = Math.max(0, waveState.n - 1);
  dog.x = player.x - 60; dog.y = player.y;
}

/* ---------- waves & rifts ---------- */
const WAVE_TABLE = [
  ['flicker', 'flicker', 'flicker', 'flicker'],
  ['flicker', 'flicker', 'flicker', 'jitter', 'jitter'],
  ['flicker', 'flicker', 'packet', 'packet', 'jitter', 'lag'],
  ['flicker', 'flicker', 'flicker', 'ghost', 'ghost', 'firewall', 'jitter'],
  ['packet', 'packet', 'lag', 'lag', 'firewall', 'jitter', 'jitter', 'flicker'],
  ['beetle', 'flicker', 'flicker', 'flicker', 'ghost', 'packet'],
];
function waveList(n) { n = Math.max(0, n); const base = WAVE_TABLE[Math.min(n, WAVE_TABLE.length - 1)].slice(); const extra = Math.max(0, n - WAVE_TABLE.length + 1); for (let i = 0; i < extra * 2; i++) base.push(['flicker', 'jitter', 'packet', 'ghost', 'firewall', 'lag'][i % 6]); if (n >= 8 && n % 3 === 2) base.push('beetle'); return base; }
function updateWaves(dt) {
  if (waveState.toSpawn > 0) {
    waveState.cd -= dt;
    if (waveState.cd <= 0) {
      waveState.cd = 0.35;
      const type = waveState.queue.shift(); waveState.toSpawn--;
      const side = Math.random() < 0.5 ? -1 : 1;
      let x = clamp(player.x + side * rnd(360, 520), 40, WORLD.width - 40);
      if (arena.active) x = clamp(x, arena.x0 + 30, arena.x1 - 30);
      const e = spawnEnemy(type, x, groundYAt(x) - 2);
      if (e) { waveState.alive++; waveState.rifts.push({ x, y: e.y - 20, t: 0, c: e.d.color }); }
    }
  } else if (waveState.alive <= 0 && !waveState.paused) {
    waveState.cd -= dt;
    if (waveState.cd <= 0) { waveState.n++; waveState.queue = waveList(waveState.n - 1); waveState.toSpawn = waveState.queue.length; waveState.cd = 0.2; waveState.banner = 2.2; }
  }
  if (waveState.banner > 0) waveState.banner -= dt;
  for (let i = waveState.rifts.length - 1; i >= 0; i--) { const r = waveState.rifts[i]; r.t += dt; if (r.t > 0.7) waveState.rifts.splice(i, 1); }
}

/* ---------- weapons ---------- */
// targeting: 'near' | 'big'.  kind: 'dart' | 'homing' | 'lob' | 'chain' | 'beam' | 'ring' | 'slam' | 'trap' | 'turret' | 'orbit' | 'trigger' | 'lines'
const WEAPONS = {
  'Rianan':     { name: 'Rally',           kind: 'rally',   cd: 6.0, dmg: 0, range: 240, color: [242, 181, 68] },
  'Aaron':      { name: 'Packet Cannon',   kind: 'dart',    cd: 0.3, dmg: 2, range: 420, speed: 720, pierce: 1, color: [90, 230, 255] },
  'Bret':       { name: 'Grounding Hammer', kind: 'slam',   cd: 1.5, dmg: 5, range: 150, stun: 1.0, color: [245, 245, 255] },
  'Brian S':    { name: 'Override Lance',  kind: 'beam',    cd: 1.3, dmg: 8, range: 340, dur: 0.45, targeting: 'big', color: [255, 90, 220] },
  'Brian W':    { name: 'Query Burst',     kind: 'chain',   cd: 0.95, dmg: 3, range: 300, hops: 3, hopR: 140, color: [170, 210, 255] },
  'Umesh':      { name: 'Handshake',       kind: 'homing',  cd: 0.7, dmg: 4, range: 460, speed: 360, color: [255, 250, 235] },
  'Dave':       { name: 'Green Screen',    kind: 'lines',   cd: 0.65, dmg: 2, range: 380, speed: 640, color: [120, 255, 140] },
  'John':       { name: 'Batch Job',       kind: 'lob',     cd: 1.9, dmg: 7, range: 330, aoe: 95, color: [255, 150, 60] },
  'Greg':       { name: 'Dashboard Drones', kind: 'orbit',  cd: 0.55, dmg: 2, range: 380, speed: 620, drones: 2, color: [190, 120, 255] },
  'Ryan':       { name: 'Sprint Blades',   kind: 'blades',  cd: 0.18, dmg: 2, range: 52, color: [220, 225, 235] },
  'Jose':       { name: 'Blueprint Turret', kind: 'turret', cd: 4.5, dmg: 2, range: 360, life: 6, fireCd: 0.32, color: [90, 160, 255] },
  'Ash':    { name: 'Apex Trigger',    kind: 'trigger', cd: 0.22, dmg: 4, range: 230, color: [110, 170, 255] },
};
function weaponOf(h) { return WEAPONS[h.name]; }

// A shooter is any entity with {x,y,hero,wcd,facing}. The player is one; followers (M2) will be too.
function shooterPos(sh) { return { x: sh.x, y: sh.y - 30 }; }
function updateShooter(sh, dt, isLeader) {
  const w = weaponOf(sh.hero); if (!w) return;
  if (!story.weaponsOnline) return;
  shooterName = sh.hero.name;
  sh.wcd = (sh.wcd || 0) - dt;
  const mul = isLeader ? 1.5 : 1;
  const p = shooterPos(sh); const range = w.range * rangeMul(sh);
  // persistent things
  if (w.kind === 'orbit') { if (!sh.drones) sh.drones = [{ a: 0, cd: 0 }, { a: Math.PI, cd: 0.27 }]; for (const d of sh.drones) { d.a += dt * 2.2; d.x = p.x + Math.cos(d.a) * 42; d.y = p.y - 10 + Math.sin(d.a) * 18; d.cd -= dt; if (d.cd <= 0) { const t = nearestEnemy(d.x, d.y, range); if (t) { d.cd = w.cd * rateMul(sh); fireDart(d.x, d.y, t, w, mul, 0); } } } return; }
  if (w.kind === 'blades') { if (!sh.bladeA) sh.bladeA = 0; sh.bladeA += dt * 9; const bb = sh.bladeBoost > 0 ? 2 : 1; if (sh.wcd <= 0) { let hitAny = false; forEnemiesNear(p.x, p.y, 70 * bb, e => { if ((e.x - p.x) ** 2 + (e.y - e.h / 2 - p.y) ** 2 < (w.range * rangeMul(sh) * bb + e.w / 2) ** 2) { damageEnemy(e, w.dmg * mul); hitAny = true; } }); sh.wcd = w.cd * rateMul(sh); if (hitAny) shake = Math.max(shake, 0.02); } return; }
  if (w.kind === 'trigger') { // event-driven: strikes enemies the moment they enter range
    if (!sh.seen) sh.seen = new Set();
    if (sh.wcd > 0) return;
    let struck = null; forEnemiesNear(p.x, p.y, range, e => { if (struck) return; if (!e.targetable) return; if ((e.x - p.x) ** 2 + (e.y - p.y) ** 2 > range * range) { sh.seen.delete(e); return; } if (!sh.seen.has(e)) struck = e; });
    if (struck) { sh.seen.add(struck); sh.wcd = w.cd * rateMul(sh); beams.push({ x1: p.x, y1: p.y - 200, x2: struck.x, y2: struck.y - struck.h / 2, t: 0, life: 0.22, c: w.color, bolt: 1 }); damageEnemy(struck, w.dmg * mul, p.x); for (let k = 0; k <= extraCount(sh); k++) { const nx = nearestEnemy(struck.x, struck.y, 90, e => e !== struck && !sh.seen.has(e)); if (nx) { sh.seen.add(nx); beams.push({ x1: struck.x, y1: struck.y - 40, x2: nx.x, y2: nx.y - nx.h / 2, t: 0, life: 0.18, c: w.color, bolt: 1 }); damageEnemy(nx, w.dmg * mul * 0.6, p.x); } } }
    // forget enemies that left/died
    for (const e of sh.seen) if (e.dead) sh.seen.delete(e);
    return;
  }
  if (sh.wcd > 0) return;
  const target = w.targeting === 'big' ? biggestEnemy(p.x, p.y, range) : nearestEnemy(p.x, p.y, range);
  if (w.kind === 'rally') { if (!target) return; sh.wcd = w.cd * rateMul(sh); for (const m of crewAll()) m.buff = 5; summons.push({ k: 'rally', x: sh.x, y: sh.y, r: 10, R: w.range, t: 0, life: 1.6, c: w.color }); return; }
  if (!target) return;
  sh.wcd = w.cd * rateMul(sh);
  sh.target = target;
  sh.recoil = 0.12;
  switch (w.kind) {
    case 'dart': for (let k = 0; k <= extraCount(sh); k++) fireDart(p.x, p.y, target, w, mul, (k - extraCount(sh) / 2) * 0.12); break;
    case 'homing': for (let k = 0; k <= extraCount(sh); k++) projs.push({ k: 'homing', x: p.x, y: p.y, vx: -sh.facing * 120 + (k - 1) * 60, vy: -220 - k * 40, target, spd: w.speed, dmg: w.dmg * mul, t: 0, life: 3.5, c: w.color, w, hero: shooterName }); break;
    case 'lob': for (let k = 0; k <= extraCount(sh); k++) { const dx = target.x - p.x, dy = (target.y - 10) - p.y; const T = 0.75 + k * 0.1; projs.push({ k: 'lob', x: p.x, y: p.y, vx: dx / T, vy: dy / T - 0.5 * G * T, dmg: w.dmg * mul, aoe: w.aoe, t: 0, life: 3, c: w.color, w, hero: shooterName }); } break;
    case 'lines': { const dx = target.x - p.x, dy = (target.y - target.h / 2) - p.y, L = Math.hypot(dx, dy) || 1; for (let k = -1 - extraCount(sh); k <= 1 + extraCount(sh); k++) { const a = Math.atan2(dy, dx) + k * 0.16; projs.push({ k: 'line', x: p.x, y: p.y, vx: Math.cos(a) * w.speed, vy: Math.sin(a) * w.speed, dmg: w.dmg * mul, t: 0, life: 0.8, c: w.color, pierce: 1, w, hero: shooterName }); } break; }
    case 'chain': { let cur = target, from = p, hit = new Set(); for (let h = 0; h <= w.hops + extraCount(sh) && cur; h++) { beams.push({ x1: from.x, y1: from.y - (from === p ? 0 : cur.h / 2), x2: cur.x, y2: cur.y - cur.h / 2, t: 0, life: 0.2, c: w.color, bolt: 1 }); damageEnemy(cur, w.dmg * mul * (h === 0 ? 1 : 0.8), p.x); hit.add(cur); from = cur; const c2 = cur; cur = nearestEnemy(cur.x, cur.y - cur.h / 2, w.hopR, e => !hit.has(e) && e !== c2); } break; }
    case 'beam': beams.push({ src: sh, target, t: 0, life: w.dur, c: w.color, dmg: w.dmg * mul, tick: 0, lance: 1, hero: shooterName }); break;
    case 'ring': { const R = range; let any = false; forEnemiesNear(p.x, p.y, R, e => { if ((e.x - p.x) ** 2 + (e.y - p.y) ** 2 < R * R) { damageEnemy(e, w.dmg * mul, p.x); any = true; } }); summons.push({ k: 'ring', x: p.x, y: p.y, r: 10, R, t: 0, life: 0.55, c: w.color }); if (!any) sh.wcd = 0.6; break; }
    case 'slam': { const R = range; forEnemiesNear(p.x, p.y, R, e => { if (Math.abs(e.x - p.x) < R && Math.abs(e.y - p.y) < 80) { damageEnemy(e, w.dmg * mul, p.x); e.stun = Math.max(e.stun, w.stun); } }); summons.push({ k: 'slam', x: p.x, y: sh.y, R, t: 0, life: 0.5, c: w.color }); shake = Math.max(shake, 0.18); puff(sh.x, sh.y, 10); break; }
    case 'trap': summons.push({ k: 'trap', x: target.x, y: groundYAt(target.x), w: 120 + extraCount(sh) * 30, h: 70, t: 0, life: w.life, c: w.color, dmg: w.dmg * mul, tick: 0, hero: sh.hero }); break;
    case 'turret': summons.push({ k: 'turret', x: sh.x + sh.facing * 30, y: groundYAt(sh.x + sh.facing * 30), t: 0, life: w.life + extraCount(sh), c: w.color, cd: 0, w, mul, facing: sh.facing, hero: sh.hero }); break;
  }
}
function fireDart(x, y, target, w, mul, spread) {
  if (projs.length >= MAXPROJ) return;
  const dx = target.x - x, dy = (target.y - target.h / 2) - y; const a = Math.atan2(dy, dx) + (spread || 0);
  projs.push({ k: 'dart', x, y, vx: Math.cos(a) * w.speed, vy: Math.sin(a) * w.speed, dmg: w.dmg * mul, t: 0, life: 1.2, c: w.color, pierce: w.pierce || 0, w, hero: shooterName });
  spawn({ k: 'flash', x, y, life: 0.08, t: 0, c: w.color });
}

function updateProjs(dt) {
  for (let i = projs.length - 1; i >= 0; i--) {
    const p = projs[i]; p.t += dt; p.px = p.x; p.py = p.y; shooterName = p.hero || '';
    if (p.k === 'homing') { if (p.target && !p.target.dead) { const tx = p.target.x, ty = p.target.y - p.target.h / 2; const dx = tx - p.x, dy = ty - p.y, L = Math.hypot(dx, dy) || 1; p.vx += (dx / L * p.spd - p.vx) * Math.min(1, dt * 4); p.vy += (dy / L * p.spd - p.vy) * Math.min(1, dt * 4); } else { const t = nearestEnemy(p.x, p.y, 400); if (t) p.target = t; } if (p.t % 0.05 < dt) spawn({ k: 'trailp', x: p.x, y: p.y, life: 0.3, t: 0, c: p.c, r: 2 }); }
    if (p.k === 'lob') { p.vy += G * dt; if (p.t % 0.04 < dt) spawn({ k: 'trailp', x: p.x, y: p.y, life: 0.25, t: 0, c: p.c, r: 3 }); }
    if (p.k === 'dart' && p.t % 0.03 < dt) spawn({ k: 'trailp', x: p.x, y: p.y, life: 0.15, t: 0, c: p.c, r: 1.5 });
    p.x += p.vx * dt; p.y += p.vy * dt;
    let die = p.t > p.life;
    // world hit
    if (p.y >= groundYAt(p.x) || p.x < 0 || p.x > WORLD.width) die = true;
    for (const s of SOLIDS) { if (s[4]) continue; if (p.x > s[0] && p.x < s[0] + s[2] && p.y > s[1] && p.y < s[1] + s[3]) { die = true; break; } }
    // enemy hit
    if (!die || p.k === 'lob') {
      let hit = null;
      forEnemiesNear(p.x, p.y, 60, e => { if (hit || e.born > 0) return; if (Math.abs(e.x - p.x) < e.w / 2 + 6 && p.y > e.y - e.h - 6 && p.y < e.y + 6) hit = e; });
      if (hit) {
        hit.lastShooter = shooterName;
        if (p.k === 'lob') die = true;
        else { const ok = damageEnemy(hit, p.dmg, p.px); if (ok || true) { if (p.pierce > 0 && !(p.hitSet && p.hitSet.has(hit))) { p.pierce--; (p.hitSet = p.hitSet || new Set()).add(hit); } else if (!(p.hitSet && p.hitSet.has(hit))) die = true; } }
      }
    }
    if (die) {
      if (p.k === 'lob') { const R = p.aoe; forEnemiesNear(p.x, p.y, R, e => { if ((e.x - p.x) ** 2 + (e.y - e.h / 2 - p.y) ** 2 < R * R) { e.lastShooter = shooterName; damageEnemy(e, p.dmg, p.x); } }); summons.push({ k: 'boom', x: p.x, y: p.y, R, t: 0, life: 0.4, c: p.c }); shake = Math.max(shake, 0.14); }
      else spark(p.x, p.y, p.c, 2);
      projs.splice(i, 1);
    }
  }
  for (let i = beams.length - 1; i >= 0; i--) {
    const b = beams[i]; b.t += dt;
    if (b.lance) { const s = shooterPos(b.src); if (!b.target.dead) { b.x1 = s.x; b.y1 = s.y; b.x2 = b.target.x; b.y2 = b.target.y - b.target.h / 2; b.tick -= dt; if (b.tick <= 0) { b.tick = 0.1; b.target.lastShooter = b.hero; damageEnemy(b.target, b.dmg * 0.25, s.x); } } else b.t = 99; }
    if (b.t > b.life) beams.splice(i, 1);
  }
  for (let i = summons.length - 1; i >= 0; i--) {
    const s = summons[i]; s.t += dt;
    if (s.k === 'trap') { s.tick -= dt; forEnemiesNear(s.x, s.y, s.w, e => { if (Math.abs(e.x - s.x) < s.w / 2 && e.y > s.y - s.h - 10 && e.y <= s.y + 4) { e.slow = 0.2; e.weak = 0.2; if (s.tick <= 0) { e.lastShooter = s.hero ? s.hero.name : ''; damageEnemy(e, s.dmg); } } }); if (s.tick <= 0) s.tick = 0.5; }
    if (s.k === 'turret') { s.cd -= dt; if (s.cd <= 0) { const t = nearestEnemy(s.x, s.y - 20, s.w.range * rangeMul(s)); if (t) { s.cd = s.w.fireCd * rateMul(s); shooterName = s.hero ? s.hero.name : ''; s.facing = Math.sign(t.x - s.x) || s.facing; fireDart(s.x, s.y - 22, t, { speed: 600, dmg: s.w.dmg, color: s.c, pierce: 0 }, s.mul, 0); } } }
    if (s.t > s.life) summons.splice(i, 1);
  }
  // shards
  for (let i = shards.length - 1; i >= 0; i--) {
    const s = shards[i]; s.t += dt;
    if (s.t > 0.45) { const dx = player.x - s.x, dy = player.y - 26 - s.y, L = Math.hypot(dx, dy) || 1; const pull = 900 + s.t * 600; s.vx += (dx / L * pull - s.vx) * Math.min(1, dt * 6); s.vy += (dy / L * pull - s.vy) * Math.min(1, dt * 6); if (L < 22) { bucks.n += s.v; bucks.total += s.v; shards.splice(i, 1); if (gameTime - (bucks.sfxT || 0) > 0.06) { bucks.sfxT = gameTime; sfx('shard'); } spawn({ k: 'coin', x: player.x, y: player.y - 56, life: 0.5, t: 0, v: s.v }); continue; } }
    else { s.vy += G * 0.6 * dt; const gy = groundYAt(s.x); if (s.y > gy - 4) { s.y = gy - 4; s.vy *= -0.4; s.vx *= 0.8; } }
    s.x += s.vx * dt; s.y += s.vy * dt;
    if (s.t > 12) shards.splice(i, 1);
  }
}

function drawCloseButton(fn) { const x = W - 64, y = 14, w = 50, h = 30; ctx.fillStyle = 'rgba(255,255,255,.08)'; rr(ctx, x, y, w, h, 8); ctx.fill(); ctx.strokeStyle = 'rgba(242,181,68,.6)'; ctx.lineWidth = 1.5; rr(ctx, x, y, w, h, 8); ctx.stroke(); ctx.fillStyle = '#f6ecd8'; ctx.font = 'bold 14px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('✕', x + w / 2, y + 20); uiTaps.push({ x: x - 10, y: y - 10, w: w + 20, h: h + 20, fn }); }
/* ---------- coffee machine shop ---------- */
const SHOP_ITEMS = [
  { id: 'heal', name: 'Refill', desc: 'Restore all signal', base: 15 },
];
function itemCost(it) { return it.base; }
function updateShop(dt) {
  shop.near = Math.abs(player.x - COFFEE.x) < 40 && Math.abs(player.y - COFFEE.y) < 30 && !nearScan() && !(nearPackage() && !player.carry) && !(player.carry && nearNPC() && nearNPC().acceptsPackage);
  if (!shop.open) { if (shop.near && edge.use) { shop.open = true; shop.sel = 0; } return; }
  if (edge.jump || (edge.use && !shop.near)) { shop.open = false; return; }
  if (edge.weather) shop.sel = (shop.sel + 1) % SHOP_ITEMS.length; // Q cycles selection while open
  if (tk.left && !shop.lh) { shop.sel = (shop.sel + SHOP_ITEMS.length - 1) % SHOP_ITEMS.length; } shop.lh = tk.left;
  if (tk.right && !shop.rh) { shop.sel = (shop.sel + 1) % SHOP_ITEMS.length; } shop.rh = tk.right;
  if (edge.use) buyItem(SHOP_ITEMS[shop.sel]);
}
function buyItem(it) {
  const cost = itemCost(it); if (bucks.n < cost) { shop.flash = 0.5; return false; }
  if (it.id === 'heal') { if (player.hp >= player.maxHp) return false; player.hp = player.maxHp; }
  bucks.n -= cost; shop.bought = 0.6; spawn({ k: 'coin', x: player.x, y: player.y - 60, life: 0.6, t: 0, v: -cost }); return true;
}

/* ---------- master update ---------- */
function updateCombat(dt) {
  if (shop.bought > 0) shop.bought -= dt; if (shop.flash > 0) shop.flash -= dt;
  updateShop(dt);
  updateTalk(dt);
  updateStoryInteract();
  updateDoors(dt);
  updateQuest(dt);
  updatePackages(dt);
  updateEncounters(dt);
  updatePrologue(dt);
  updateAplus(dt);
  updateLockout(dt);
  updateWrecks(dt);
  updateSuper(dt); updateBreakpoints(); updatePortal(dt); updateGregGhost(dt);
  if (shop.open || talk.open) return;
  rebuildHash();
  updateWaves(dt);
  for (const e of enemies) if (!e.dead) { if (e.d.boss) updateBoss(e, dt); else updateEnemy(e, dt); }
  for (let i = enemies.length - 1; i >= 0; i--) if (enemies[i].dead) enemies.splice(i, 1);
  rebuildHash();
  player.hero = hero;
  if (edge.sup) useSuper();
  if (edge.swap) cycleLeader();
  if (tapSwap >= 0) swapLeader(tapSwap); tapSwap = -2;
  updateForklift(dt);
  updateValves();
  updateHazards(dt);
  if (edge.nip) throwCatnip();
  updateCatnip(dt);
  updateBossProjs(dt);
  updateCrew(dt); updateEveryone(dt); updateEnding(dt); updateLedger(dt);
  if (player.dead <= 0 && !forklift.mounted) updateShooter(player, dt, true);
  if (packUI.banner > 0) packUI.banner -= dt;
  if (player.recoil > 0) player.recoil -= dt;
  updateProjs(dt);
}

/* ---------- rendering ---------- */
function glitchDraw(c, e, fn) {
  const j = e.hit > 0 ? 3 : 1; const ox = Math.sin(e.t * 40) * j, oy = Math.cos(e.t * 33) * j * 0.5;
  c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.45;
  c.save(); c.translate(-3 + ox, oy); fn(c, [255, 60, 90]); c.restore();
  c.save(); c.translate(3 - ox, -oy); fn(c, [60, 220, 255]); c.restore();
  c.restore();
  c.save(); c.translate(ox * 0.3, 0); fn(c, null); c.restore();
}
function drawEnemy(c, e) {
  c.save(); c.translate(e.x, e.y);
  if (e.d.ghost) c.globalAlpha = 0.08 + e.revealed * 0.9;
  if (e.born > 0) { c.globalAlpha *= 1 - e.born / 0.4; c.scale(1, 1 - e.born); }
  c.scale(e.facing, 1);
  const col = e.hit > 0 ? [255, 255, 255] : e.d.color;
  glitchDraw(c, e, (g, tint) => {
    const base = tint ? rgb(tint) : '#141826', edge = tint ? rgb(tint) : rgb(col);
    g.fillStyle = base; g.strokeStyle = edge; g.lineWidth = 2;
    const w = e.w, h = e.h;
    if (e.type === 'flicker') { const sq = e.onGround ? 1 : 0.8; g.beginPath(); g.ellipse(0, -h / 2, w / 2, h / 2 * sq, 0, 0, Math.PI * 2); g.fill(); g.stroke(); if (!tint) { g.fillStyle = edge; g.fillRect(3, -h / 2 - 3, 4, 4); g.fillRect(-7, -h / 2 - 3, 4, 4); for (let k = -1; k <= 1; k++) g.fillRect(k * 6 - 1, -3, 2, 3); } }
    else if (e.type === 'jitter') { g.beginPath(); g.moveTo(0, 0); g.lineTo(-6, -h * 0.35); g.lineTo(4, -h * 0.5); g.lineTo(-3, -h * 0.7); g.lineTo(5, -h); g.lineTo(9, -h * 0.75); g.lineTo(2, -h * 0.55); g.lineTo(8, -h * 0.35); g.lineTo(2, 0); g.closePath(); g.fill(); g.stroke(); if (!tint) { g.fillStyle = edge; g.fillRect(3, -h * 0.9, 3, 3); } }
    else if (e.type === 'lag') { const wob = Math.sin(e.t * 3) * 3; g.beginPath(); g.moveTo(-w / 2, 0); g.quadraticCurveTo(-w / 2 - 4, -h + wob, 0, -h); g.quadraticCurveTo(w / 2 + 4, -h - wob, w / 2, 0); g.closePath(); g.fill(); g.stroke(); if (!tint) { g.fillStyle = edge; g.fillRect(-8, -h * 0.6, 5, 5); g.fillRect(4, -h * 0.6, 5, 5); g.fillStyle = 'rgba(140,255,120,.5)'; g.fillRect(-w / 2 + 4, -3, w - 8, 3); } }
    else if (e.type === 'packet') { rr(g, -w / 2, -h, w, h, 4); g.fill(); g.stroke(); if (!tint) { g.strokeStyle = edge; g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.moveTo(0, -h); g.lineTo(0, 0); g.stroke(); g.fillStyle = edge; g.fillRect(4, -h + 5, 4, 4); } }
    else if (e.type === 'firewall') { g.fillStyle = tint ? base : '#3a1a1a'; rr(g, -w / 2, -h, w, h, 3); g.fill(); g.strokeStyle = edge; g.stroke(); if (!tint) { g.strokeStyle = 'rgba(255,120,100,.6)'; g.lineWidth = 1; for (let yy = -h + 6; yy < 0; yy += 8) { g.beginPath(); g.moveTo(-w / 2, yy); g.lineTo(w / 2, yy); g.stroke(); } g.fillStyle = edge; g.fillRect(2, -h + 8, 4, 4); g.fillRect(9, -h + 8, 4, 4); const sg = g.createLinearGradient(w / 2, 0, w / 2 + 12, 0); sg.addColorStop(0, 'rgba(255,120,80,.7)'); sg.addColorStop(1, 'rgba(255,120,80,0)'); g.fillStyle = sg; g.fillRect(w / 2, -h - 4, 12, h + 8); g.fillStyle = '#ff8a5a'; g.fillRect(w / 2, -h - 4, 3, h + 8); } }
    else if (e.type === 'ghost') { rr(g, -w / 2, -h, w, h, 3); g.fill(); g.stroke(); if (!tint) { g.fillStyle = '#e8e8f0'; g.fillRect(-w / 2 + 4, -h + 4, w - 8, 10); g.fillStyle = '#141826'; for (let k = 0; k < 8; k++) g.fillRect(-w / 2 + 5 + k * 2.2, -h + 5, (k % 3 === 0) ? 1.4 : 0.8, 8); g.fillStyle = edge; g.fillRect(2, -8, 3, 3); g.fillRect(-6, -8, 3, 3); } }
    else if (e.type === 'beetle') { g.fillStyle = tint ? base : '#2a1a10'; g.beginPath(); g.ellipse(0, -h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = edge; g.stroke(); if (!tint) { g.strokeStyle = 'rgba(255,150,60,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -h); g.lineTo(0, 0); g.moveTo(-w * 0.3, -h * 0.9); g.lineTo(-w * 0.3, -h * 0.1); g.moveTo(w * 0.3, -h * 0.9); g.lineTo(w * 0.3, -h * 0.1); g.stroke(); g.fillStyle = tint ? base : '#1c1208'; g.beginPath(); g.arc(w / 2 + 4, -h / 2, 9, 0, Math.PI * 2); g.fill(); g.strokeStyle = edge; g.lineWidth = 2; g.beginPath(); g.moveTo(w / 2 + 10, -h / 2 - 4); g.lineTo(w / 2 + 22, -h / 2 - 10); g.moveTo(w / 2 + 10, -h / 2 + 4); g.lineTo(w / 2 + 22, -h / 2 + 10); g.stroke(); g.fillStyle = e.charging > 0 ? '#fff' : edge; g.fillRect(w / 2 + 6, -h / 2 - 3, 3, 3); for (let k = 0; k < 3; k++) { const la = Math.sin(e.t * 14 + k) * 4; g.beginPath(); g.moveTo(-w * 0.3 + k * w * 0.3, -6); g.lineTo(-w * 0.3 + k * w * 0.3 - 4 + la, 2); g.stroke(); } } }
  });
  // hp pip for big ones
  if (e.maxHp >= 14 && e.hp < e.maxHp) { c.scale(e.facing, 1); c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(-16, -e.h - 12, 32, 4); c.fillStyle = rgb(e.d.color); c.fillRect(-16, -e.h - 12, 32 * e.hp / e.maxHp, 4); }
  c.restore();
}
function renderCombatBack(night) {
  // rifts
  for (const r of waveState.rifts) { const a = 1 - r.t / 0.7; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(r.c, a); ctx.lineWidth = 2; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(r.x + rnd(-14, 14), r.y - 40 * a); ctx.lineTo(r.x + rnd(-14, 14), r.y + 30 * a); ctx.stroke(); } ctx.restore(); }
  // summons behind actors
  for (const s of summons) {
    if (s.k === 'trap') { const a = 1 - s.t / s.life; ctx.save(); ctx.globalAlpha = 0.5 * Math.min(1, a * 3); ctx.strokeStyle = rgb(s.c); ctx.lineWidth = 1; ctx.strokeRect(s.x - s.w / 2, s.y - s.h, s.w, s.h); for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(s.x - s.w / 2, s.y - s.h * k / 4); ctx.lineTo(s.x + s.w / 2, s.y - s.h * k / 4); ctx.stroke(); } for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.moveTo(s.x - s.w / 2 + s.w * k / 5, s.y - s.h); ctx.lineTo(s.x - s.w / 2 + s.w * k / 5, s.y); ctx.stroke(); } ctx.fillStyle = rgba(s.c, 0.12); ctx.fillRect(s.x - s.w / 2, s.y - s.h, s.w, s.h); ctx.font = 'bold 9px monospace'; ctx.fillStyle = rgb(s.c); ctx.fillText('Σ', s.x - s.w / 2 + 3, s.y - s.h + 10); ctx.restore(); }
    if (s.k === 'turret') { ctx.save(); ctx.translate(s.x, s.y); ctx.fillStyle = '#243447'; rr(ctx, -10, -16, 20, 16, 3); ctx.fill(); ctx.fillStyle = rgb(s.c); ctx.fillRect(-8, -14, 16, 2); ctx.fillStyle = '#4a5f7a'; rr(ctx, -6, -28, 12, 13, 3); ctx.fill(); ctx.fillStyle = rgb(s.c); ctx.fillRect(s.facing > 0 ? 4 : -16, -24, 12, 4); ctx.globalAlpha = 0.6; ctx.strokeStyle = rgb(s.c); ctx.lineWidth = 1; ctx.strokeRect(-14, -34, 28, 36); ctx.restore(); }
  }
  drawDoors();
  drawWrecks();
  for (const e of enemies) if (!e.dead) { if (e.d.boss) drawBoss(ctx, e); else drawEnemy(ctx, e); }
  // coffee machine
  ctx.save(); ctx.translate(COFFEE.x, COFFEE.y); ctx.fillStyle = '#2b2f3a'; rr(ctx, -14, -54, 28, 54, 4); ctx.fill(); ctx.fillStyle = '#c0392b'; rr(ctx, -11, -50, 22, 14, 3); ctx.fill(); ctx.fillStyle = '#e9d27a'; ctx.fillRect(-6, -30, 12, 8); ctx.fillStyle = '#f6ecd8'; ctx.fillRect(-4, -20, 8, 10); ctx.fillStyle = night > 0.3 ? rgba([120, 255, 140], 0.9) : '#3f8f4a'; ctx.fillRect(4, -44, 3, 3);
  if (shop.near && !shop.open) { ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, -44, -84, 88, 20, 6); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('E  ·  COFFEE', 0, -70); }
  ctx.restore();
}
function renderCombatFront(night) {
  // target reticle
  const t = player.target; if (t && !t.dead && t.targetable) { const a = 0.5 + 0.3 * Math.sin(gameTime * 10); ctx.save(); ctx.strokeStyle = rgba(weaponOf(hero).color, a); ctx.lineWidth = 1.5; const r = t.w / 2 + 8; for (let k = 0; k < 4; k++) { const an = k * Math.PI / 2 + gameTime * 2; ctx.beginPath(); ctx.arc(t.x, t.y - t.h / 2, r, an, an + 0.6); ctx.stroke(); } ctx.restore(); }
  // projectiles
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const p of projs) {
    ctx.strokeStyle = rgb(p.c); ctx.fillStyle = rgb(p.c);
    if (p.k === 'dart') { ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.018, p.y - p.vy * 0.018); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill(); }
    else if (p.k === 'line') { ctx.lineWidth = 2; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.045, p.y - p.vy * 0.045); ctx.stroke(); ctx.globalAlpha = 1; }
    else if (p.k === 'homing') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx)); ctx.fillStyle = '#fff'; rr(ctx, -7, -5, 14, 10, 2); ctx.fill(); ctx.strokeStyle = '#c9a56a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-7, -5); ctx.lineTo(0, 1); ctx.lineTo(7, -5); ctx.stroke(); ctx.restore(); }
    else if (p.k === 'lob') { ctx.beginPath(); ctx.arc(p.x, p.y, p.big ? 14 : 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x - 2, p.y - 2, 2, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = rgba(p.c, 0.6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.x, p.y, 9 + Math.sin(p.t * 20) * 2, 0, Math.PI * 2); ctx.stroke(); }
  }
  for (const b of beams) {
    const a = 1 - b.t / b.life;
    if (b.bolt) { ctx.strokeStyle = rgba(b.c, a); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(b.x1, b.y1); const segs = 6; for (let k = 1; k <= segs; k++) { const f = k / segs; ctx.lineTo(lerp(b.x1, b.x2, f) + (k < segs ? rnd(-9, 9) : 0), lerp(b.y1, b.y2, f) + (k < segs ? rnd(-9, 9) : 0)); } ctx.stroke(); ctx.strokeStyle = rgba([255, 255, 255], a * 0.8); ctx.lineWidth = 1; ctx.stroke(); }
    if (b.lance && b.x1 !== undefined) { ctx.strokeStyle = rgba(b.c, 0.85 * a + 0.15); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke(); ctx.strokeStyle = rgba([255, 255, 255], 0.9); ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = rgba(b.c, 0.7); ctx.beginPath(); ctx.arc(b.x2, b.y2, 8 + Math.sin(gameTime * 30) * 3, 0, Math.PI * 2); ctx.fill(); }
  }
  for (const s of summons) {
    const a = 1 - s.t / s.life;
    if (s.k === 'rally') { const r = lerp(10, s.R, 1 - a * a * a); ctx.strokeStyle = rgba(s.c, a * 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(s.x, s.y - 4, r, r * 0.22, 0, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = rgba(s.c, a * 0.06); ctx.fill(); }
    if (s.k === 'slam') { const r = lerp(0, s.R, 1 - a * a); ctx.strokeStyle = rgba(s.c, a); ctx.lineWidth = 6 * a; ctx.beginPath(); ctx.ellipse(s.x, s.y, r, 10, 0, 0, Math.PI * 2); ctx.stroke(); }
    if (s.k === 'boom') { const r = lerp(10, s.R, 1 - a * a); const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r); g.addColorStop(0, rgba([255, 255, 220], a)); g.addColorStop(0.5, rgba(s.c, a * 0.6)); g.addColorStop(1, rgba(s.c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore(); drawShooterExtras(player, weaponOf(hero)); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // shards
  for (const s of shards) { ctx.fillStyle = s.v > 1 ? '#ffd44a' : '#7fe0ff'; ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.t * 6); ctx.fillRect(-3, -3, 6, 6); ctx.restore(); }
  // combat particles
  for (const p of parts) {
    const a = 1 - p.t / p.life;
    if (p.k === 'spark') { ctx.fillStyle = rgba(p.c, a); ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); }
    else if (p.k === 'glitch') { ctx.fillStyle = rgba(p.c, a); ctx.fillRect(p.x, p.y, 5 + Math.sin(p.t * 40) * 3, 2); }
    else if (p.k === 'trailp') { ctx.fillStyle = rgba(p.c, a * 0.7); ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a + 0.5, 0, Math.PI * 2); ctx.fill(); }
    else if (p.k === 'flash') { ctx.fillStyle = rgba(p.c, a); ctx.beginPath(); ctx.arc(p.x, p.y, 8 * a, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore();
  // non-additive particles
  for (const p of parts) {
    const a = 1 - p.t / p.life;
    if (p.k === 'part') drawPartParticle(p);
    else if (p.k === 'goo') { ctx.fillStyle = rgba([140, 255, 120], 0.35 * a); ctx.beginPath(); ctx.ellipse(p.x, p.y, 8, 2.5, 0, 0, Math.PI * 2); ctx.fill(); }
    else if (p.k === 'coin') { ctx.font = 'bold 12px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = p.v > 0 ? rgba([255, 212, 74], a) : rgba([255, 120, 120], a); ctx.fillText((p.v > 0 ? '+' : '') + p.v, p.x, p.y - (1 - a) * 30); }
  }
}
function drawCombatHUD() {
  ctx.textAlign = 'left';
  // weapon chip
  const w = weaponOf(hero); if (w && story.weaponsOnline) { ctx.font = '11px system-ui, sans-serif'; const lbl = w.name; const tw = ctx.measureText(lbl).width; ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, W / 2 - tw / 2 - 12, 14, tw + 24, 24, 8); ctx.fill(); ctx.fillStyle = rgb(w.color); ctx.beginPath(); ctx.arc(W / 2 - tw / 2 - 2, 26, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.fillText(lbl, W / 2 - tw / 2 + 6, 30); }
  // wave
  if (waveState.alive > 0) { ctx.textAlign = 'right'; ctx.font = '11px system-ui, sans-serif'; ctx.fillStyle = 'rgba(246,236,216,.6)'; ctx.fillText(waveState.alive + ' machine' + (waveState.alive === 1 ? '' : 's'), W - 14, H - 162); }
  if (false && waveState.banner > 0) { const a = Math.min(1, waveState.banner); ctx.textAlign = 'center'; ctx.font = 'bold 34px Georgia, serif'; ctx.fillStyle = rgba([242, 181, 68], a); ctx.fillText('WAVE ' + waveState.n, W / 2, H * 0.35); ctx.font = 'italic 13px Georgia, serif'; ctx.fillStyle = rgba([246, 236, 216], a); ctx.fillText(waveState.n === 1 ? 'The batch job is awake.' : waveList(waveState.n - 1).includes('beetle') ? 'Something big is in the racks.' : 'Static incoming.', W / 2, H * 0.35 + 22); }
  if (player.dead > 0) { ctx.fillStyle = 'rgba(16,26,46,.6)'; ctx.fillRect(0, 0, W, H); ctx.textAlign = 'center'; ctx.font = 'bold 30px Georgia, serif'; ctx.fillStyle = '#7fe0ff'; ctx.fillText('SIGNAL LOST', W / 2, H / 2 - 8); ctx.font = '13px system-ui, sans-serif'; ctx.fillStyle = '#b9c5d6'; ctx.fillText('Rebooting at the coffee machine…', W / 2, H / 2 + 18); }
  if (shop.open) {
    ctx.fillStyle = 'rgba(16,26,46,.72)'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.font = 'bold 26px Georgia, serif'; ctx.fillStyle = '#f2b544'; ctx.fillText('BREAK ROOM', W / 2, 110);
    drawCloseButton(() => { shop.open = false; });
    ctx.font = '12px system-ui, sans-serif'; ctx.fillStyle = '#b9c5d6'; ctx.fillText('$' + bucks.n + ' in shards   ·   tap or E to buy   ·   ✕ or Jump to leave', W / 2, 134);
    ctx.fillStyle = '#f6ecd8'; ctx.font = 'bold 13px Georgia, serif'; ctx.fillText('Skills are earned on boss stages', W / 2, 360); ctx.font = '11px system-ui, sans-serif'; ctx.fillStyle = '#b9c5d6'; ctx.fillText(ROSTER.filter(r => skillOf(r)).map(r => r.name + ' L' + skillOf(r)).join('   ·   ') || 'No one has leveled yet', W / 2, 380);
    const cw = 190, gap = 16, x0 = W / 2 - (SHOP_ITEMS.length * cw + (SHOP_ITEMS.length - 1) * gap) / 2;
    SHOP_ITEMS.forEach((it, i) => {
      const x = x0 + i * (cw + gap), y = 170, sel = i === shop.sel, cost = itemCost(it), can = bucks.n >= cost && !(it.id === 'heal' && player.hp >= player.maxHp);
      ctx.fillStyle = sel ? 'rgba(242,181,68,.16)' : 'rgba(255,255,255,.05)'; rr(ctx, x, y, cw, 150, 12); ctx.fill();
      ctx.strokeStyle = sel ? '#f2b544' : 'rgba(242,181,68,.3)'; ctx.lineWidth = sel ? 2 : 1; ctx.stroke();
      ctx.fillStyle = '#f6ecd8'; ctx.font = 'bold 16px Georgia, serif'; ctx.fillText(it.name, x + cw / 2, y + 40);
      ctx.fillStyle = '#b9c5d6'; ctx.font = '12px system-ui, sans-serif'; ctx.fillText(it.desc, x + cw / 2, y + 64);
      ctx.fillStyle = can ? '#f2b544' : 'rgba(255,120,120,.9)'; ctx.font = 'bold 15px system-ui, sans-serif'; ctx.fillText('$' + cost, x + cw / 2, y + 122);
      uiTaps.push({ x, y, w: cw, h: 150, fn: () => { if (shop.sel === i) buyItem(it); else shop.sel = i; } });
    });
    if (shop.flash > 0) { ctx.fillStyle = rgba([255, 120, 120], shop.flash); ctx.font = 'bold 13px system-ui, sans-serif'; ctx.fillText('Not enough shards', W / 2, 350); }
    if (shop.bought > 0) { ctx.fillStyle = rgba([120, 255, 140], shop.bought); ctx.font = 'bold 13px system-ui, sans-serif'; ctx.fillText('Brewed.', W / 2, 350); }
  }
  drawStageHUD();
  ctx.textAlign = 'left';
}
