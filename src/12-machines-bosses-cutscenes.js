/* =====================================================================
   A+'S MACHINES — robot spies, wreck deaths, boss presentation, demo cutscenes
   ===================================================================== */
const ROBOT_NAMES = { flicker: 'SCOUT', jitter: 'RUNNER', lag: 'HAULER', packet: 'COURIER', firewall: 'SHIELD UNIT', ghost: 'CLOAKER', beetle: 'CRAWLER' };
const STEEL = '#3a3f4a', PLATE = '#6a7280', DARK = '#1c2028', LED = [120, 255, 140];
function ledColor(e) { return e.hit > 0 ? '#fff' : rgb(LED); }
function bolt(g, x, y) { g.fillStyle = '#9aa0a8'; g.beginPath(); g.arc(x, y, 1.4, 0, Math.PI * 2); g.fill(); }
let decalFlip = 1;
function aplusDecal(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s * decalFlip, s); g.fillStyle = DARK; rr(g, -7, -4, 14, 8, 1.5); g.fill(); g.fillStyle = rgb(LED); g.font = 'bold 6px monospace'; g.textAlign = 'center'; g.fillText('A+', 0, 2.5); g.restore(); }

// Override the enemy renderer with mechanical designs (behaviour untouched)
drawEnemy = function (c, e) {
  c.save(); c.translate(e.x, e.y);
  if (e.d.ghost) c.globalAlpha = 0.08 + e.revealed * 0.9;
  if (e.born > 0) { c.globalAlpha *= 1 - e.born / 0.4; c.scale(1, 1 - e.born); }
  c.scale(e.facing, 1); decalFlip = e.facing;
  const g = c, w = e.w, h = e.h, t = e.t, led = ledColor(e);
  const hitFlash = e.hit > 0;
  // contact shadow
  g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(0, 1, w / 2 + 2, 3.5, 0, 0, Math.PI * 2); g.fill();
  const body = (fill) => { const gr = g.createLinearGradient(0, -h, 0, 0); gr.addColorStop(0, hitFlash ? '#fff' : lighten(fill, 0.22)); gr.addColorStop(1, hitFlash ? '#fff' : shade(fill, 0.7)); return gr; };
  if (e.type === 'flicker') { // SCOUT: hovering lens drone
    const hov = e.onGround ? 0 : 0; const rot = t * 40;
    g.fillStyle = body(STEEL); g.beginPath(); g.ellipse(0, -h / 2, w / 2, h / 2 - 1, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = DARK; g.lineWidth = 1.5; g.stroke();
    g.fillStyle = PLATE; g.fillRect(-w / 2 + 2, -h / 2 - 2, w - 4, 3); // seam plate
    g.fillStyle = '#9aa0a8'; g.fillRect(-1, -h - 6, 2, 7); g.fillStyle = led; g.beginPath(); g.arc(0, -h - 7, 2, 0, Math.PI * 2); g.fill(); // antenna
    g.fillStyle = DARK; g.beginPath(); g.arc(4, -h / 2, 5, 0, Math.PI * 2); g.fill(); g.fillStyle = led; g.beginPath(); g.arc(4.5, -h / 2, 2.8, 0, Math.PI * 2); g.fill(); g.fillStyle = '#fff'; g.fillRect(3.5, -h / 2 - 1.5, 1, 1); // lens
    g.strokeStyle = '#9aa0a8'; g.lineWidth = 1.5; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 5, -2); g.lineTo(s * 8, 1); g.stroke(); } // landing skids
    g.fillStyle = 'rgba(200,210,220,.5)'; g.save(); g.translate(0, -h - 1); g.scale(Math.abs(Math.cos(rot)) * 0.9 + 0.1, 1); g.fillRect(-9, -1, 18, 2); g.restore(); // rotor blur
  }
  else if (e.type === 'jitter') { // RUNNER: spindly biped
    const legA = Math.sin(t * 18) * 0.7;
    g.strokeStyle = PLATE; g.lineWidth = 2.5; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 3, -h * 0.35); g.lineTo(s * 3 + Math.sin(legA * s) * 7, -h * 0.15); g.lineTo(s * 3 + Math.sin(legA * s) * 10, 0); g.stroke(); }
    g.fillStyle = body(STEEL); rr(g, -6, -h * 0.72, 12, h * 0.4, 3); g.fill(); g.strokeStyle = DARK; g.lineWidth = 1; g.stroke();
    g.fillStyle = body('#4a5060'); rr(g, -7, -h, 14, h * 0.26, 3); g.fill(); g.stroke();
    g.fillStyle = DARK; g.fillRect(-5, -h + 4, 10, 3); g.fillStyle = led; g.fillRect(-4, -h + 4.5, 8, 2); // visor
    g.strokeStyle = PLATE; g.lineWidth = 2; g.beginPath(); g.moveTo(6, -h * 0.6); g.lineTo(12, -h * 0.5 + Math.sin(t * 18) * 4); g.stroke(); // arm
    bolt(g, -4, -h * 0.55); bolt(g, 4, -h * 0.55);
  }
  else if (e.type === 'lag') { // HAULER: tracked unit that leaks oil
    g.fillStyle = DARK; rr(g, -w / 2, -12, w, 12, 6); g.fill(); g.strokeStyle = '#9aa0a8'; g.lineWidth = 1; for (let x = -w / 2 + 4; x < w / 2; x += 6) { g.beginPath(); g.moveTo(x + (t * 30 % 6), -12); g.lineTo(x + (t * 30 % 6), 0); g.stroke(); } // tread
    g.fillStyle = body('#4a4e58'); rr(g, -w / 2 + 4, -h, w - 8, h - 12, 5); g.fill(); g.strokeStyle = DARK; g.stroke();
    g.fillStyle = PLATE; g.fillRect(-w / 2 + 6, -h + 4, w - 12, 4);
    g.fillStyle = DARK; rr(g, 2, -h + 8, 12, 8, 2); g.fill(); g.fillStyle = led; g.fillRect(4, -h + 10, 8, 4); // sensor
    g.fillStyle = '#c8c8d0'; g.fillRect(-w / 2 + 6, -h - 5, 6, 5); g.fillStyle = '#7fe0a0'; g.fillRect(-w / 2 + 7, -h - 4, 4, 3); // stack light
    g.fillStyle = 'rgba(30,30,40,.6)'; g.beginPath(); g.ellipse(-w / 2 + 6, -2, 8, 2.5, 0, 0, Math.PI * 2); g.fill(); // oil
    aplusDecal(g, -6, -h / 2 + 2, 1);
  }
  else if (e.type === 'packet') { // COURIER: box bot with a hatch
    g.fillStyle = body('#5a6070'); rr(g, -w / 2, -h, w, h, 3); g.fill(); g.strokeStyle = DARK; g.lineWidth = 1.5; g.stroke();
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.moveTo(0, -h); g.lineTo(0, 0); g.stroke();
    g.fillStyle = DARK; rr(g, -w / 2 + 3, -h + 3, w - 6, 7, 2); g.fill(); g.fillStyle = led; g.fillRect(-w / 2 + 5, -h + 5, 4, 3); g.fillRect(-w / 2 + 11, -h + 5, 4, 3);
    for (const [bx, by] of [[-w / 2 + 2, -2], [w / 2 - 2, -2], [-w / 2 + 2, -h + 2], [w / 2 - 2, -h + 2]]) bolt(g, bx, by);
    g.fillStyle = PLATE; g.fillRect(-4, 0, 3, 3); g.fillRect(1, 0, 3, 3); // little wheels
    aplusDecal(g, 0, -h / 4, 0.9);
  }
  else if (e.type === 'firewall') { // SHIELD UNIT: plated front
    g.fillStyle = body(STEEL); rr(g, -w / 2 + 6, -h, w - 12, h, 4); g.fill(); g.strokeStyle = DARK; g.lineWidth = 1.5; g.stroke();
    g.fillStyle = DARK; g.fillRect(-4, -h + 6, 10, 5); g.fillStyle = led; g.fillRect(-2, -h + 7, 6, 3);
    g.strokeStyle = PLATE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-8, -h * 0.5); g.lineTo(-14, -h * 0.5 + Math.sin(t * 8) * 4); g.lineTo(-14, 0); g.stroke();
    // riot plate on the front
    const pg = g.createLinearGradient(w / 2 - 4, 0, w / 2 + 10, 0); pg.addColorStop(0, hitFlash ? '#fff' : '#8a94a0'); pg.addColorStop(1, hitFlash ? '#fff' : '#5a6270');
    g.fillStyle = pg; rr(g, w / 2 - 4, -h - 4, 14, h + 8, 3); g.fill(); g.strokeStyle = DARK; g.stroke();
    g.fillStyle = rgba(LED, 0.85); g.fillRect(w / 2 + 2, -h + 2, 2, h - 4); for (let yy = -h; yy < 0; yy += 9) bolt(g, w / 2 - 1, yy + 4);
    aplusDecal(g, w / 2 + 3, -h / 2, 0.8);
  }
  else if (e.type === 'ghost') { // CLOAKER: shimmering outline
    g.strokeStyle = rgba(LED, 0.5 + 0.4 * Math.sin(t * 9)); g.lineWidth = 1.5; g.setLineDash([3, 3]); rr(g, -w / 2, -h, w, h, 4); g.stroke(); g.setLineDash([]);
    g.fillStyle = 'rgba(120,140,160,.25)'; rr(g, -w / 2, -h, w, h, 4); g.fill();
    g.fillStyle = led; g.beginPath(); g.arc(4, -h + 8, 2.5, 0, Math.PI * 2); g.fill();
    for (let k = 0; k < 3; k++) { const y = -h + ((t * 30 + k * 9) % h); g.fillStyle = rgba(LED, 0.25); g.fillRect(-w / 2, y, w, 1); }
  }
  else if (e.type === 'beetle') { // CRAWLER: armored six-legged bot
    g.strokeStyle = PLATE; g.lineWidth = 3; for (let k = 0; k < 3; k++) { const la = Math.sin(t * 14 + k) * 5; g.beginPath(); g.moveTo(-w * 0.3 + k * w * 0.3, -6); g.lineTo(-w * 0.3 + k * w * 0.3 - 6 + la, 2); g.stroke(); }
    g.fillStyle = body('#4a4e58'); g.beginPath(); g.ellipse(0, -h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = DARK; g.lineWidth = 2; g.stroke();
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -h); g.lineTo(0, 0); g.moveTo(-w * 0.3, -h * 0.9); g.lineTo(-w * 0.3, -h * 0.1); g.moveTo(w * 0.3, -h * 0.9); g.lineTo(w * 0.3, -h * 0.1); g.stroke();
    for (const [bx, by] of [[-w * 0.15, -h * 0.75], [w * 0.15, -h * 0.75], [-w * 0.15, -h * 0.25], [w * 0.15, -h * 0.25]]) bolt(g, bx, by);
    g.fillStyle = body('#3a3f4a'); g.beginPath(); g.arc(w / 2 + 4, -h / 2, 9, 0, Math.PI * 2); g.fill(); g.strokeStyle = DARK; g.stroke();
    g.strokeStyle = PLATE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(w / 2 + 10, -h / 2 - 4); g.lineTo(w / 2 + 22, -h / 2 - 10); g.moveTo(w / 2 + 10, -h / 2 + 4); g.lineTo(w / 2 + 22, -h / 2 + 10); g.stroke(); // claw
    g.fillStyle = e.charging > 0 ? '#fff' : led; g.fillRect(w / 2 + 6, -h / 2 - 3, 4, 4);
    aplusDecal(g, 0, -h / 2, 1.1);
  }
  if (e.maxHp >= 14 && e.hp < e.maxHp) { g.scale(e.facing, 1); g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(-16, -e.h - 12, 32, 4); g.fillStyle = rgb(LED); g.fillRect(-16, -e.h - 12, 32 * e.hp / e.maxHp, 4); }
  c.restore();
};

/* ---- wrecks: shot machines split open, show their insides, then fly apart ---- */
const wrecks = [];
function addWreck(e) { wrecks.push({ x: e.x, y: e.y, w: e.w, h: e.h, type: e.type, t: 0, facing: e.facing, big: !!e.d.boss }); }
function updateWrecks(dt) {
  for (let i = wrecks.length - 1; i >= 0; i--) {
    const k = wrecks[i]; k.t += dt;
    if (k.t < 0.9 && Math.random() < dt * 20) spawn({ k: 'spark', x: k.x + rnd(-k.w / 3, k.w / 3), y: k.y - rnd(0, k.h), vx: rnd(-120, 120), vy: rnd(-160, 40), life: 0.3, t: 0, c: [255, 220, 120] });
    if (k.t > 0.9 && !k.burst) { k.burst = true; const n = k.big ? 26 : 8; for (let j = 0; j < n; j++) spawn({ k: 'part', x: k.x + rnd(-k.w / 3, k.w / 3), y: k.y - rnd(0, k.h), vx: rnd(-260, 260), vy: rnd(-380, -80), life: rnd(0.9, 1.6), t: 0, kind: j % 4, rot: rnd(0, 6), vr: rnd(-8, 8) }); puff(k.x, k.y, k.big ? 24 : 6); if (k.big) shake = Math.max(shake, 0.45); }
    if (k.t > 1.1) wrecks.splice(i, 1);
  }
}
function drawInsides(g, w, h) {
  // exposed chassis: frame, circuit board, gear, wires
  g.fillStyle = '#23262e'; rr(g, -w / 2 + 3, -h + 3, w - 6, h - 6, 3); g.fill();
  g.fillStyle = '#1f5a3a'; rr(g, -w / 2 + 6, -h * 0.7, w * 0.45, h * 0.35, 1); g.fill(); g.fillStyle = '#7fe0a0'; for (let k = 0; k < 4; k++) g.fillRect(-w / 2 + 8 + k * (w * 0.1), -h * 0.62, 2, 2);
  g.strokeStyle = '#c8c8d0'; g.lineWidth = 1.2; g.beginPath(); g.arc(w * 0.2, -h * 0.5, Math.min(w, h) * 0.18, 0, Math.PI * 2); g.stroke(); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; g.beginPath(); g.moveTo(w * 0.2 + Math.cos(a) * Math.min(w, h) * 0.18, -h * 0.5 + Math.sin(a) * Math.min(w, h) * 0.18); g.lineTo(w * 0.2 + Math.cos(a) * Math.min(w, h) * 0.26, -h * 0.5 + Math.sin(a) * Math.min(w, h) * 0.26); g.stroke(); }
  for (const [col, y] of [['#c0392b', -h * 0.3], ['#e9d27a', -h * 0.24], ['#3f8fd0', -h * 0.18]]) { g.strokeStyle = col; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-w / 2 + 6, y); g.quadraticCurveTo(0, y + 6, w / 2 - 6, y - 4); g.stroke(); }
}
function drawWrecks() {
  for (const k of wrecks) {
    ctx.save(); ctx.translate(k.x, k.y); ctx.scale(k.facing, 1);
    const open = clamp(k.t / 0.35, 0, 1); const w = k.w, h = k.h;
    drawInsides(ctx, w, h);
    // two shell halves swinging open
    ctx.save(); ctx.translate(-w / 2, -h / 2); ctx.rotate(-open * 0.9); ctx.fillStyle = STEEL; rr(ctx, 0, -h / 2, w / 2, h, 4); ctx.fill(); ctx.strokeStyle = DARK; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(w / 2, -h / 2); ctx.rotate(open * 0.9); ctx.fillStyle = STEEL; rr(ctx, -w / 2, -h / 2, w / 2, h, 4); ctx.fill(); ctx.strokeStyle = DARK; ctx.stroke(); ctx.restore();
    ctx.fillStyle = rgba(LED, 0.9 * (1 - k.t)); ctx.fillRect(-3, -h / 2 - 3, 6, 6); // dying LED
    ctx.restore();
  }
}
function drawPartParticle(p) {
  const a = 1 - p.t / p.life; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot + p.t * p.vr); ctx.globalAlpha = a;
  if (p.kind === 0) { ctx.strokeStyle = '#c8c8d0'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.stroke(); for (let k = 0; k < 5; k++) { const an = k / 5 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(an) * 4, Math.sin(an) * 4); ctx.lineTo(Math.cos(an) * 6, Math.sin(an) * 6); ctx.stroke(); } } // gear
  else if (p.kind === 1) { ctx.strokeStyle = '#9aa0a8'; ctx.lineWidth = 1.5; ctx.beginPath(); for (let k = 0; k < 8; k++) ctx.lineTo(-6 + k * 1.7, (k % 2 ? -3 : 3)); ctx.stroke(); } // spring
  else if (p.kind === 2) { ctx.fillStyle = '#1f5a3a'; ctx.fillRect(-5, -3, 10, 6); ctx.fillStyle = '#7fe0a0'; ctx.fillRect(-3, -1, 2, 2); ctx.fillRect(1, -1, 2, 2); } // board
  else { ctx.fillStyle = STEEL; ctx.fillRect(-5, -4, 10, 8); ctx.fillStyle = '#9aa0a8'; ctx.fillRect(-3, -2, 2, 2); } // plate
  ctx.restore();
}
const _killEnemy = killEnemy;
killEnemy = function (e) { if (!e.d.cocoon) addWreck(e); _killEnemy(e); };

/* ---- crew of three before any boss ---- */
for (const id of Object.keys(WORLD_DEFS)) if (WORLD_DEFS[id].door) WORLD_DEFS[id].door.minCrew = 2;
EASTON_DOOR.minCrew = 2;
const _startStage4 = startStage;
startStage = function (d) {
  if (crew.length < 2) { player.x = d.x - 32; player.vx = -120; restoredBanner.t = 3; restoredBanner.text = 'Boss stage — bring a crew of three. Free the teammate here, or bring more from Easton.'; return; }
  _startStage4(d);
};
const _updateDoors = updateDoors;
updateDoors = function (dt) {
  // the base door check bounces solo heroes with its own text; route everything through startStage's rule instead
  _updateDoors(dt);
};

/* ---- boss presentation: intro card, telegraph, A+ badge, wreck death ---- */
const bossIntro = { t: 0, name: '', sub: '' };
const BOSS_SUBS = { fogserver: 'the receiving rack, running blind', peachpit: 'the stretch wrapper, on its own schedule', drainpipe: 'the aquatics drain, pressurized', snowdrift: 'the yard plow, unmanned', gale: 'the wind turbine, over-revved', hydra: 'three sort belts, one controller', crane: 'the port gantry, on remote', gate: 'the go-live gate, contested', golem: 'two schemas, one body', queen: 'the midnight batch job, made flesh' };
const _spawnBoss = spawnBoss;
spawnBoss = function (type, x, y) { const e = _spawnBoss(type, x, y); if (e && !demo.active) { bossIntro.t = 3.2; bossIntro.name = (WORLD.def.door && WORLD.def.door.name) || type.toUpperCase(); bossIntro.sub = 'A+ seized ' + (BOSS_SUBS[type] || 'this machine'); shake = Math.max(shake, 0.3); } return e; };
function bossTelegraph(e) { const m = e.mode || e.phase; return ['tell', 'wind', 'charge', 'drop', 'spin'].includes(m) || (e.type === 'queen' && (m === 'charge' || (m === 'spit' && e.spat < 1))); }
const _drawBoss = drawBoss;
drawBoss = function (c, e) {
  _drawBoss(c, e);
  if (e.alpha !== undefined && e.alpha < 0.3) return;
  c.save(); c.translate(e.x, e.y - e.h - 18); decalFlip = 1;
  // A+ badge: it owns this machine
  aplusDecal(c, 0, 0, 1.3);
  if (bossTelegraph(e) && !e.dead) { const p = 0.6 + 0.4 * Math.sin(gameTime * 20); c.fillStyle = rgba([255, 90, 60], p); c.font = 'bold 22px Georgia, serif'; c.textAlign = 'center'; c.fillText('!', 0, -14); }
  c.restore(); c.textAlign = 'left';
};
function drawBossIntro() {
  if (bossIntro.t <= 0) return; bossIntro.t -= 1 / 60; const a = clamp(bossIntro.t > 2.6 ? (3.2 - bossIntro.t) / 0.6 : bossIntro.t < 0.6 ? bossIntro.t / 0.6 : 1, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(16,26,46,.55)'; ctx.fillRect(0, 300, W, 90);
  ctx.fillStyle = 'rgba(255,90,60,.9)'; ctx.fillRect(0, 300, W, 3); ctx.fillRect(0, 387, W, 3);
  ctx.textAlign = 'center'; ctx.font = 'bold 34px Georgia, serif'; ctx.fillStyle = '#f6ecd8'; ctx.fillText(bossIntro.name, W / 2, 344);
  ctx.font = 'italic 14px Georgia, serif'; ctx.fillStyle = '#ff8a5a'; ctx.fillText(bossIntro.sub, W / 2, 372); ctx.restore(); ctx.textAlign = 'left';
}

/* ---- demo: story hints and cutscenes ---- */
const cutscene = { map: null };
function drawMapCutscene(t) {
  ctx.fillStyle = 'rgba(6,14,8,.975)'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(120,255,140,.25)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#7fe0a0'; ctx.textAlign = 'left'; ctx.fillText('PHILLIPS NETWORK  ·  WAR ROOM  ·  23:5' + Math.min(9, 2 + Math.floor(t)), 40, 60);
  const pins = [['Easton', 820, 200], ['Taunton', 890, 150], ['Spartanburg', 780, 300], ['Plant City', 800, 400], ['Lansing', 660, 190], ['Billings', 330, 150], ['Portland', 120, 130], ['W. Sacramento', 110, 260], ['Aurora', 400, 260]];
  ctx.strokeStyle = 'rgba(120,255,140,.35)'; ctx.lineWidth = 1.5; for (const [, x, y] of pins) { ctx.beginPath(); ctx.moveTo(820, 200); ctx.lineTo(x, y); ctx.stroke(); }
  pins.forEach(([n, x, y], i) => { const red = t > 1.2 + i * 0.55; ctx.fillStyle = red ? '#ff5a5a' : '#7fe0a0'; ctx.beginPath(); ctx.arc(x, y, red ? 7 + Math.sin(t * 8) * 1.5 : 5, 0, Math.PI * 2); ctx.fill(); if (red) { ctx.strokeStyle = 'rgba(255,90,90,.5)'; ctx.beginPath(); ctx.arc(x, y, 14 + (t * 30 % 12), 0, Math.PI * 2); ctx.stroke(); } ctx.fillStyle = red ? '#ff8a8a' : '#c8f0d0'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(n.toUpperCase() + (red ? '  OFFLINE' : ''), x, y + 22); });
  ctx.textAlign = 'left';
}
