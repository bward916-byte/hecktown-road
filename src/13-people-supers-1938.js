/* =====================================================================
   PEOPLE, SUPERS, BREAKPOINTS, 1938 CINEMA (M11)
   ===================================================================== */

/* ---------- who these people are ---------- */
(function bios() {
  const set = (n, o) => { const r = ROSTER.find(x => x.name === n); if (r) Object.assign(r, o); };
  set('Aaron', { role: 'Infrastructure Manager', face: 'short-beard' });
  set('Bret', { role: 'Hardware & Infrastructure' });
  set('Greg', { role: 'Number Scientist', mono: true, face: 'beard-goatee', skin: '#bdbdbd', hair: '#5c5c5c', shirt: '#7a7a7a', pants: '#3c3c3c', acc: 'cardigan', style: 'short' });
  WEAPONS.Greg.color = [225, 225, 235]; WEAPONS.Greg.name = 'Dashboard Drones';
  set('Ash', { role: 'Salesforce Genius' });
})();
const FLAVOR = {
  Aaron: ['Aaron: "Racks are humming, switches are green. Where do you need me?"', 'Aaron: "I trimmed the beard for the launch. Nobody noticed. Good."'],
  Bret: ['Bret: "Baby boy finally sleeps through the night — I can give you the whole shift."', 'Bret: "Is Biscuit coming? Biscuit\'s coming. Good. Dogs first, hardware second."', 'Bret: "If it has a power supply, I can fix it. If it has firmware, I can fix it faster."'],
  Rianan: ['Rianan: "That alley cat has a business plan. I respect it. I also want to pet it."', 'Rianan: "Every cat in this county is now my responsibility. Fine."'],
  Greg: ['Greg Schreiner: "Number scientist. Thirty-some years on this floor. I was here before the green screens and I\'ll be here after. Some of us never clock out."', 'Greg: "Three-dimensional data models. I can see the whole network from here. It\'s ugly. We\'ll fix it."', 'Greg: "Give me a fact table and a quiet room and I will kick data ass."', 'Greg: "You\'re wondering about the color. Don\'t. I\'ve been here long enough that the building stopped rendering me."'],
  Ash: ['Ash: "Salesforce is talking to me again. It apologized. We\'re fine."', 'Ash: "Call me Ash. And yes, the flow will hold."'],
  Dave: ['Dave: "Forty years of green screens and this is the first one that talked back."'],
  Umesh: ['Umesh: "Every 850 in the queue is mine again. It can keep the 997s."'],
  John: ['John: "The scheduler\'s clean. Nothing runs at midnight tonight unless we say so."'],
  Ryan: ['Ryan: "Pipeline\'s green. Whatever you\'re about to do, I can ship it."'],
  'Brian S': ['Brian S: "Admin console\'s ours. It changed the wallpaper. Petty."'],
  'Brian W': ['Brian W: "The database is fine. The database is always fine. It\'s everything around it."'],
  Jose: ['Jose: "Two schemas, one warehouse. I drew the diagram. It has a dragon on it now."'],
};
const _teammateTalk2 = teammateTalk;
teammateTalk = function (n) {
  const ch = n.hero;
  if (ch.name === 'Greg' && !story.gregIntro) { story.gregIntro = true; say(n, FLAVOR.Greg[0], [{ label: 'Go on', fn: () => _teammateTalk2(n) }]); return; }
  story.talked = story.talked || {}; const visits = (story.talked[ch.name] = (story.talked[ch.name] || 0) + 1);
  if (!n.held && story.turnDone && FLAVOR[ch.name] && visits > 1 && crew.length >= CREW_MAX - 1 && !crew.some(f => f.hero === ch)) { const L = FLAVOR[ch.name]; say(n, L[(visits - 2) % L.length], [{ label: 'Swap in', fn: () => _teammateTalk2(n) }, { label: 'Later', fn: null }]); return; }
  _teammateTalk2(n);
};

/* facial hair on drawHero: short beard + mustache */
const _drawHero = drawHero;
drawHero = function (c, ch, x, y, facing, pose, lit) {
  if (ch.mono) { c.save(); c.globalCompositeOperation = 'lighter'; const gg = c.createRadialGradient(x, y - 28, 6, x, y - 28, 46); gg.addColorStop(0, 'rgba(235,235,245,.16)'); gg.addColorStop(1, 'rgba(235,235,245,0)'); c.fillStyle = gg; c.fillRect(x - 50, y - 80, 100, 90); c.restore(); c.save(); c.globalAlpha *= 0.93; _drawHero(c, ch, x, y, facing, pose, lit ? { i: lit.i, color: [230, 230, 240], side: lit.side } : null); c.restore(); }
  else _drawHero(c, ch, x, y, facing, pose, lit);
  if (!ch.face) return;
  const sq = pose.squash || 1, st = pose.stretch || 1, big = pose.big || 1;
  c.save(); c.translate(x, y); c.scale(facing * sq * big, st * big);
  const bob = pose.moving && !pose.air ? Math.abs(Math.sin((pose.run || 0) * Math.PI * 2)) * 2 : 0; c.translate(0, -bob);
  const legLen = 18, torsoY = -legLen - 22 + (pose.moving ? 0 : Math.sin((pose.t || 0) * 2) * 0.8), hy = torsoY - 12;
  if (ch.face === 'beard-goatee') { c.fillStyle = shade(ch.hair, 1.1); c.beginPath(); c.moveTo(-11, hy + 1); c.quadraticCurveTo(-8, hy + 15, 0, hy + 17); c.quadraticCurveTo(10, hy + 15, 13, hy + 4); c.lineTo(13, hy + 1); c.quadraticCurveTo(8, hy + 8, 0, hy + 9); c.quadraticCurveTo(-7, hy + 8, -11, hy + 1); c.closePath(); c.fill(); c.fillStyle = shade(ch.hair, 0.8); c.beginPath(); c.moveTo(3, hy + 8); c.quadraticCurveTo(6, hy + 19, 9, hy + 8); c.closePath(); c.fill(); c.fillRect(2, hy + 1.5, 9, 2); }
  if (ch.face === 'short-beard') { c.fillStyle = shade(ch.hair, 1.05); c.beginPath(); c.moveTo(-6, hy + 2); c.quadraticCurveTo(0, hy + 13, 12, hy + 6); c.lineTo(12, hy + 2); c.quadraticCurveTo(4, hy + 9, -6, hy + 2); c.closePath(); c.fill(); c.fillRect(2, hy + 1.5, 9, 2); }
  c.restore();
};

/* ---------- supers ---------- */
const superState = { meter: 0, active: 0, kind: null, bombT: 0 };
const SUPERS = {
  John: { name: 'BIG BATCH', desc: 'grows huge and throws super bombs', kind: 'grow' },
  Rianan: { name: 'ALL HANDS', desc: 'crew fires twice as fast and heals', kind: 'field' },
  Aaron: { name: 'PACKET STORM', desc: 'a spray of darts at everything', kind: 'burst' },
  Bret: { name: 'RACK QUAKE', desc: 'slams the floor, stuns everything', kind: 'quake' },
  'Brian S': { name: 'FULL OVERRIDE', desc: 'lances every machine in sight', kind: 'burst' },
  'Brian W': { name: 'QUERY CASCADE', desc: 'chain lightning through everything', kind: 'burst' },
  Umesh: { name: 'HANDSHAKE SWARM', desc: 'a swarm of homing envelopes', kind: 'burst' },
  Dave: { name: 'GREEN SCREEN WALL', desc: 'a wall of phosphor lines', kind: 'burst' },
  Greg: { name: 'DRONE SQUADRON', desc: 'six drones for ten seconds', kind: 'drones' },
  Ryan: { name: 'BLADE STORM', desc: 'blades double and spin wide', kind: 'blades' },
  Jose: { name: 'TURRET LINE', desc: 'drops three turrets', kind: 'turrets' },
  Ash: { name: 'APEX STORM', desc: 'a bolt on every machine', kind: 'burst' },
};
function superOf(ch) { return SUPERS[ch.name] || SUPERS.Aaron; }
function superReady() { return superState.meter >= 100 && superState.active <= 0 && story.weaponsOnline; }
function useSuper() {
  if (!superReady()) return false;
  const s = superOf(hero); superState.meter = 0; superState.kind = s.kind; sfx('boss'); shake = Math.max(shake, 0.35);
  banner(hero.name.toUpperCase() + '  ·  ' + s.name, 2.5); spawn({ k: 'flash', x: player.x, y: player.y - 30, life: 0.5, t: 0, c: weaponOf(hero).color });
  const p = shooterPos(player); const w = weaponOf(hero);
  if (s.kind === 'grow') { superState.active = 9; player.big = 1.6; player.hp = Math.min(player.maxHp + 2, player.hp + 2); superState.bombT = 0; }
  else if (s.kind === 'field') { superState.active = 8; for (const m of crewAll()) { m.buff = 8; } player.hp = player.maxHp; for (let k = 0; k < 40; k++) spawn({ k: 'spark', x: p.x + rnd(-120, 120), y: p.y + rnd(-60, 60), vx: rnd(-60, 60), vy: rnd(-140, -20), life: 0.9, t: 0, c: [242, 181, 68] }); summons.push({ k: 'rally', x: player.x, y: player.y, r: 10, R: 420, t: 0, life: 2.2, c: [242, 181, 68] }); }
  else if (s.kind === 'quake') { superState.active = 0.5; forEnemiesNear(p.x, p.y, 700, e => { if (Math.abs(e.x - p.x) < 700) { e.lastShooter = hero.name; shooterName = hero.name; damageEnemy(e, 14, p.x); e.stun = Math.max(e.stun, 2.5); e.vy = -300; } }); summons.push({ k: 'slam', x: player.x, y: player.y, R: 700, t: 0, life: 0.9, c: [245, 245, 255] }); shake = 0.7; }
  else if (s.kind === 'drones') { superState.active = 10; player.drones = []; for (let k = 0; k < 6; k++) player.drones.push({ a: k / 6 * Math.PI * 2, cd: k * 0.1 }); }
  else if (s.kind === 'blades') { superState.active = 8; player.bladeBoost = 8; }
  else if (s.kind === 'turrets') { superState.active = 0.5; for (let k = -1; k <= 1; k++) { const tx = player.x + k * 90; summons.push({ k: 'turret', x: tx, y: groundYAt(tx), t: 0, life: 12, c: w.color, cd: k * 0.1, w: Object.assign({}, WEAPONS.Jose, { range: 520, dmg: 3 }), mul: 1.5, facing: player.facing, hero }); } }
  else { // burst: hit everything in sight with the hero's own signature
    superState.active = 0.6; let n = 0; shooterName = hero.name;
    forEnemiesNear(p.x, p.y, 640, e => { if (n++ > 40) return; if (!e.targetable && !e.d.boss) e.revealed = 1; e.lastShooter = hero.name; beams.push({ x1: p.x, y1: p.y - 10, x2: e.x, y2: e.y - e.h / 2, t: 0, life: 0.45, c: w.color, bolt: 1 }); damageEnemy(e, w.dmg * 4, p.x); if (w.kind === 'homing') for (let k = 0; k < 2; k++) projs.push({ k: 'homing', x: p.x, y: p.y, vx: rnd(-300, 300), vy: rnd(-400, -100), target: e, spd: 420, dmg: w.dmg * 1.5, t: 0, life: 3, c: w.color, w, hero: hero.name }); if (w.kind === 'dart' || w.kind === 'lines') for (let k = 0; k < 3; k++) fireDart(p.x, p.y, e, w, 1.5, (k - 1) * 0.15); });
    if (n === 0) superState.meter = 60;
  }
  return true;
}
function updateSuper(dt) {
  if (superState.active > 0) {
    superState.active -= dt;
    if (superState.kind === 'grow') { superState.bombT -= dt; if (superState.bombT <= 0) { superState.bombT = 0.9; const t = nearestEnemy(player.x, player.y - 40, 520); if (t) { const dx = t.x - player.x, dy = (t.y - 10) - (player.y - 60); const T = 0.8; projs.push({ k: 'lob', x: player.x, y: player.y - 60, vx: dx / T, vy: dy / T - 0.5 * G * T, dmg: 24, aoe: 180, t: 0, life: 3, c: [255, 150, 60], w: WEAPONS.John, hero: 'John', big: 1 }); sfx('dash'); } } }
    if (superState.active <= 0) { player.big = 1; if (superState.kind === 'drones') player.drones = null; player.bladeBoost = 0; superState.kind = null; }
  }
  if (player.bladeBoost > 0) player.bladeBoost -= dt;
}
const _killEnemy2 = killEnemy;
killEnemy = function (e) { _killEnemy2(e); if (superState.active <= 0) superState.meter = Math.min(100, superState.meter + (e.d.boss ? 40 : e.d.beetle ? 20 : 8)); if (superState.meter >= 100 && !superState.told) { superState.told = true; banner('SUPER ready  ·  ' + (touch.used ? 'SUPER button' : 'V'), 3); } };
function drawSuperHUD() {
  if (!story.weaponsOnline) return;
  const x = 14, y = H - 84; ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, x, y, 120, 8, 4); ctx.fill();
  const ready = superReady(); ctx.fillStyle = ready ? rgba([242, 181, 68], 0.7 + 0.3 * Math.sin(gameTime * 8)) : rgb(weaponOf(hero).color); rr(ctx, x, y, 120 * clamp(superState.meter / 100, 0, 1), 8, 4); ctx.fill();
  ctx.font = 'bold 9px system-ui, sans-serif'; ctx.fillStyle = ready ? '#f2b544' : 'rgba(246,236,216,.55)'; ctx.fillText(ready ? superOf(hero).name + '  ·  ' + (touch.used ? 'SUPER' : 'V') : 'SUPER', x + 126, y + 8);
  if (superState.active > 0 && superState.kind) { ctx.fillStyle = rgba([242, 181, 68], 0.9); ctx.fillText(superOf(hero).name + ' ' + Math.ceil(superState.active) + 's', x, y - 4); }
}

/* ---------- breakpoints (checkpoints) ---------- */
const breakpoints = { list: [], hit: new Set() };
function setupBreakpoints() {
  breakpoints.list = (WORLD.def.breakpoints || (WORLD.id === 'easton' ? [1140, 2620, 3560] : ['prologue', 'show'].includes(WORLD.id) ? [] : [1060, 2560, 3480])).map(x => ({ x, y: groundYAt(x) }));
  breakpoints.hit.clear();
}
function updateBreakpoints() {
  for (const b of breakpoints.list) { if (breakpoints.hit.has(b.x)) continue; if (Math.abs(player.x - b.x) < 30 && player.onGround) { breakpoints.hit.add(b.x); CHECKPOINT = { x: b.x, y: b.y }; banner('Breakpoint set', 1.2); sfx('ui'); spawn({ k: 'flash', x: b.x, y: b.y - 40, life: 0.4, t: 0, c: [255, 90, 90] }); } }
}
function drawBreakpoints() {
  for (const b of breakpoints.list) { const on = breakpoints.hit.has(b.x); ctx.save(); ctx.translate(b.x, b.y); ctx.fillStyle = '#2b2f3a'; ctx.fillRect(-3, -52, 6, 52); ctx.fillStyle = on ? '#ff5a5a' : '#3a4048'; ctx.beginPath(); ctx.arc(0, -56, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#243447'; rr(ctx, -22, -78, 44, 14, 4); ctx.fill(); ctx.fillStyle = on ? '#ff8a8a' : 'rgba(246,236,216,.6)'; ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.fillText('BREAKPOINT', 0, -68); ctx.restore(); }
  ctx.textAlign = 'left';
}

/* ---------- 1938: richer feed store ---------- */
function drawHayBale(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); const gr = g.createLinearGradient(0, -28, 0, 0); gr.addColorStop(0, '#e2c777'); gr.addColorStop(1, '#a88a3e'); g.fillStyle = gr; rr(g, -24, -28, 48, 28, 4); g.fill(); g.strokeStyle = 'rgba(80,60,20,.35)'; g.lineWidth = 1; for (let k = -20; k < 24; k += 5) { g.beginPath(); g.moveTo(k, -26); g.lineTo(k + 2, -2); g.stroke(); } g.strokeStyle = '#6a4a2a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-14, -28); g.lineTo(-14, 0); g.moveTo(12, -28); g.lineTo(12, 0); g.stroke(); g.restore(); }
function drawFeedSack(g, x, y) { g.save(); g.translate(x, y); g.fillStyle = '#e8dcc0'; rr(g, -12, -26, 24, 26, 5); g.fill(); g.fillStyle = '#c0392b'; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2 === 0) g.fillRect(-9 + i * 6, -22 + j * 6, 6, 6); g.fillStyle = '#5a3a2a'; g.fillRect(-10, -26, 20, 3); g.restore(); }
function drawWagon(g, x, y) { g.save(); g.translate(x, y); g.fillStyle = '#6a4a2a'; g.fillRect(-60, -46, 120, 26); g.fillStyle = '#4a3020'; g.fillRect(-64, -50, 128, 6); for (const wx of [-40, 40]) { g.fillStyle = '#3a2a1a'; g.beginPath(); g.arc(wx, -10, 16, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#a88a5e'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI; g.beginPath(); g.moveTo(wx + Math.cos(a) * 14, -10 + Math.sin(a) * 14); g.lineTo(wx - Math.cos(a) * 14, -10 - Math.sin(a) * 14); g.stroke(); } } g.fillStyle = '#5a3a2a'; g.fillRect(60, -40, 40, 4); for (const sx of [-40, -14, 12, 38]) drawFeedSack(g, sx, -46); g.restore(); }
const _drawProloguePlay = drawProloguePlay;
drawProloguePlay = function (g) {
  _drawProloguePlay(g); const gy = WORLD.groundY;
  // GERMANSVILLE on the sign, hay in the yard, a wagon by the barn, a stack by the porch
  g.fillStyle = '#e8dcc0'; g.fillRect(310, 262, 400, 40); g.fillStyle = '#3a2a1a'; g.font = 'bold 20px Georgia, serif'; g.textAlign = 'center'; g.fillText('PHILLIPS FEED', 510, 286); g.font = '9px Georgia, serif'; g.fillText('GERMANSVILLE, PA  ·  PURINA CHOWS', 510, 298);
  drawHayBale(g, 860, gy, 1); drawHayBale(g, 908, gy, 1); drawHayBale(g, 884, gy - 28, 1); drawHayBale(g, 1660, gy, 0.9); drawHayBale(g, 1700, gy, 0.9); drawHayBale(g, 2450, gy, 1.1);
  drawWagon(g, 1240, gy);
  for (let i = 0; i < 3; i++) drawFeedSack(g, 250 + i * 26, gy);
  g.fillStyle = '#7a5a3a'; g.fillRect(1540, gy - 60, 6, 60); g.fillStyle = '#e8dcc0'; g.fillRect(1546, gy - 58, 40, 16); g.fillStyle = '#3a2a1a'; g.font = 'bold 7px Georgia'; g.textAlign = 'center'; g.fillText('MILLERS', 1566, gy - 47); g.fillText('→', 1566, gy - 40); // sign to the Millers
};
/* the Founder steps in: the lesson */
const founderScene = { t: 0, said: false };
const _setupPrologue = setupPrologue;
setupPrologue = function () {
  _setupPrologue();
  WORLD.location = 'Phillips Feed  ·  Germansville, Pennsylvania  ·  1938';
  const f = npcs.find(n => n.look && n.look.name === 'The Founder'); if (f) { f.lines = ['"Farmers are counting on that feed. Rain or no rain, it goes today."', '"A store\'s just a building. Showing up is the business."']; f.onTalk = null; }
  founderScene.t = 0; founderScene.said = false;
};
WORLD_DEFS.prologue.setup = setupPrologue;
const _updatePrologue = updatePrologue;
updatePrologue = function (dt) {
  _updatePrologue(dt);
  if (WORLD.id !== 'prologue' && WORLD.id !== 'past') return;
  founderScene.t += dt;
  // the Founder walks out of the store to meet you the first time you carry the sack
  const f = npcs.find(n => n.look && n.look.name === 'The Founder');
  if (f && !founderScene.said && player.carry) { founderScene.said = true; f.walkTo = 560; setTimeout(() => {}, 0); }
  if (f && f.walkTo !== undefined) { const d = f.walkTo - f.x; if (Math.abs(d) > 3) { f.x += Math.sign(d) * 70 * dt; f.facing = Math.sign(d); f.walking = true; } else { f.walking = false; if (!f.spoke) { f.spoke = true; f.facing = player.x < f.x ? -1 : 1; say(f, '"Farmers are counting on that feed. Rain or no rain, it goes today. That\'s the whole business."'); } } }
};

/* ---------- the past: A+ opens a portal to 1938 — grayscale world, colorized machines ---------- */
WORLD_DEFS.past = Object.assign({}, WORLD_DEFS.prologue, { id: 'past', name: '1938', location: 'Germansville, PA  ·  1938  ·  something is wrong with the light', sepia: false, mono: true, hour: 14, weather: 0, setup: () => { setObjectives([{ text: 'A+ followed the promise back to 1938. Keep its machines off the feed store.', check: () => false, tip: 'Protect the store and the mare. Your weapon works here — theirs do too.' }]); addNPC({ look: { name: 'The Founder', role: '1938', skin: '#2a2a2a', hair: '#1a1a1a', style: 'cap', shirt: '#2a2a2a', pants: '#1a1a1a', acc: 'none' }, x: 470, y: 424, facing: 1, lines: ['"Machines. In my yard. Well — are you going to do something about it?"'] }); WORLD.horse = { x: 1100, y: 440, t: 0 }; WORLD.horseAccepts = () => {}; story.weaponsOnline = true; } });
function drawMonoPass() { if (!WORLD.def || !WORLD.def.mono) return; ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#d8d8dc'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
const portal = { t: 0, x: 0, active: false, dest: null };
function openPortal(x, dest) { portal.active = true; portal.t = 0; portal.x = x; portal.dest = dest; sfx('boss'); shake = Math.max(shake, 0.3); }
function updatePortal(dt) { if (!portal.active) return; portal.t += dt; if (portal.t > 3.5 && Math.abs(player.x - portal.x) < 120) { portal.active = false; loadWorld(portal.dest, { x: 300, y: 440 }); restoredBanner.t = 4; restoredBanner.text = '1938  ·  the light is wrong'; } if (portal.t > 30) portal.active = false; }
function drawPortal() {
  if (!portal.active) return; const a = clamp(portal.t / 1.2, 0, 1); const x = portal.x, y = groundYAt(portal.x) - 60; // drawn inside the world-space block
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 5; k++) { const r = (18 + k * 12) * a; ctx.strokeStyle = rgba(k % 2 ? [120, 255, 140] : [200, 130, 255], (0.6 - k * 0.1) * a); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, r * 0.55, r, Math.sin(gameTime * 2 + k) * 0.2, 0, Math.PI * 2); ctx.stroke(); }
  const g = ctx.createRadialGradient(x, y, 0, x, y, 70 * a); g.addColorStop(0, rgba([255, 255, 255], 0.9 * a)); g.addColorStop(0.4, rgba([200, 130, 255], 0.5 * a)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 40 * a, 70 * a, 0, 0, Math.PI * 2); ctx.fill();
  for (let k = 0; k < 8; k++) { const an = gameTime * 3 + k * 0.8; ctx.fillStyle = rgba([120, 255, 140], 0.8 * a); ctx.fillRect(x + Math.cos(an) * 50 * a, y + Math.sin(an) * 80 * a, 3, 3); }
  ctx.restore();
  ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, x - 40, y - 100, 80, 18, 5); ctx.fill(); ctx.fillStyle = '#d7b3ff'; ctx.font = 'bold 10px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('1938  →', x, y - 87); ctx.textAlign = 'left';
}

/* ---------- Blaine cameo (his public words, nothing invented) ---------- */
const BLAINE = { name: 'Blaine', role: 'Executive Chairman', skin: '#f1c9a5', hair: '#8a8a8a', style: 'short', shirt: '#243447', pants: '#2b2f3a', acc: 'lanyard' };
function addBlaine(x) { return addNPC({ look: BLAINE, x, y: groundYAt(x), facing: -1, lines: ['Blaine: "My grandfather opened a single feed store in 1938. His goal was to delight our customers and create a great place to work."', 'Blaine: "Show up for the people who count on you. That was the whole promise. Still is."'] }); }

/* ---------- hooks ---------- */
const _loadWorld2 = loadWorld;
loadWorld = function (id, spawnAt) { _loadWorld2(id, spawnAt); setupBreakpoints(); portal.active = false; superState.active = 0; player.big = 1; if (story.ending && id === 'easton' && !npcs.some(n => n.look && n.look.name === 'Blaine')) addBlaine(880); };
const _respawn = respawn;
respawn = function () { _respawn(); };

/* ---------- Greg haunts 1938 ---------- */
const gregGhost = { active: false, x: 0, dir: 1, t: 0, said: false, timer: 0, look: null };
const GHOST_REMARKS = ['Hmm. That fellow sure is interesting.', 'Does he work here?', 'He was here yesterday, too. And the day before.', 'I don\'t remember hiring him.', 'Grandpa, why is that man gray?', 'He says he counts things. What things?', 'Nice fellow. Never seems to leave.'];
function gregAppears() { const g = ROSTER.find(r => r.name === 'Greg'); if (!g) return; gregGhost.active = true; gregGhost.look = g; gregGhost.dir = Math.random() < 0.5 ? 1 : -1; gregGhost.x = gregGhost.dir > 0 ? camera.x - 60 : camera.x + W + 60; gregGhost.t = 0; gregGhost.said = false; }
function updateGregGhost(dt) {
  const era = WORLD.id === 'prologue' || WORLD.id === 'past'; if (!era) { gregGhost.active = false; return; }
  if (!gregGhost.active) { gregGhost.timer -= dt; if (gregGhost.timer <= 0) { gregGhost.timer = rnd(9, 16); if (Math.random() < 0.75 || demo.active) gregAppears(); } return; }
  gregGhost.t += dt; gregGhost.x += gregGhost.dir * 62 * dt;
  // people notice him
  if (!gregGhost.said) { for (const n of npcs) { if (n.hero) continue; if (Math.abs(n.x - gregGhost.x) < 90) { gregGhost.said = true; n.bubble = n.look.kid ? GHOST_REMARKS[4] : GHOST_REMARKS[(Math.random() * 4) | 0 + (Math.random() < 0.5 ? 0 : 4) % GHOST_REMARKS.length] || GHOST_REMARKS[0]; if (n.bubble === GHOST_REMARKS[4] && !n.look.kid) n.bubble = GHOST_REMARKS[0]; n.bubbleT = 4; break; } } }
  if (gregGhost.x < camera.x - 120 || gregGhost.x > camera.x + W + 120) gregGhost.active = false;
}
function drawGregGhost(night) {
  if (!gregGhost.active) return;
  const g = gregGhost.look; const y = groundYAt(gregGhost.x);
  drawHero(ctx, g, gregGhost.x, y, gregGhost.dir, { t: gregGhost.t, run: (gregGhost.t * 1.2) % 1, moving: true }, nearestLight(gregGhost.x, y - 30, night));
  if (gregGhost.t > 1 && Math.floor(gregGhost.t) % 4 === 0) { ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, gregGhost.x - 44, y - 92, 88, 16, 5); ctx.fill(); ctx.fillStyle = '#e8e8f0'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center'; ctx.fillText('…counting…', gregGhost.x, y - 80); ctx.textAlign = 'left'; }
}
function drawBubbles() {
  for (const n of npcs) { if (!n.bubbleT || n.bubbleT <= 0) continue; n.bubbleT -= 1 / 60; const a = Math.min(1, n.bubbleT); ctx.save(); ctx.globalAlpha = a; ctx.font = 'italic 11px Georgia, serif'; const tw = ctx.measureText(n.bubble).width + 18; const bx = n.x - tw / 2, by = n.y - 118; ctx.fillStyle = 'rgba(246,236,216,.92)'; rr(ctx, bx, by, tw, 22, 8); ctx.fill(); ctx.beginPath(); ctx.moveTo(n.x - 5, by + 22); ctx.lineTo(n.x + 5, by + 22); ctx.lineTo(n.x, by + 30); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#243447'; ctx.textAlign = 'center'; ctx.fillText(n.bubble, n.x, by + 15); ctx.restore(); ctx.textAlign = 'left'; }
}
