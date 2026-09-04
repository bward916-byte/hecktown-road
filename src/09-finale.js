/* =====================================================================
   FINALE — Easton, 11:59. The Warehouse Beetle Queen. (M8)
   ===================================================================== */
restored.easton = false;
story.ending = 0; // 0 none, 1 rolling
const finale = { active: false, everyone: [], phase: 0 };
const EASTON_DOOR = { x: 1640, x0: 1700, x1: 2440, boss: 'queen', name: 'BEETLE QUEEN', minCrew: 1, key: true };

function setupFinaleDoor() {
  if (!story.cutoverKey || restored.easton) return;
  WORLD_DEFS.easton.door = EASTON_DOOR; EASTON_DOOR.t = 0;
  setObjectives([{ text: '11:59 PM  ·  A+ is in the home warehouse. Bring the Cutover Key to the dock door.', check: () => stage.active, target: () => ({ x: EASTON_DOOR.x, y: 440, label: 'DOCK DOOR' }), tip: 'Everyone on call joins the floor when you go in. Rianan too — ask her.' }, { text: 'Finish the cutover before midnight', check: () => restored.easton }]);
  hour = 23.92; timeAuto = false; weather = 0;
}
WORLD_DEFS.easton.steps = [{ type: 'deliver', name: 'One last order out the door', time: 40, label: 'GO LIVE' }, { type: 'scan', name: 'Verify the cutover', time: 30, n: 3 }, { type: 'boss', name: 'Boss' }];
const _setupEaston = setupEaston;
setupEaston = function () { WORLD_DEFS.easton.door = null; _setupEaston(); setupFinaleDoor(); };
WORLD_DEFS.easton.setup = setupEaston;

// when the finale stage starts, everyone on call joins the field as independent fighters
const _startStage2 = startStage;
startStage = function (d) {
  _startStage2(d);
  if (!stage.active || d !== EASTON_DOOR) return;
  finale.active = true; finale.everyone.length = 0;
  for (const n of npcs.slice()) { if (!n.hero) continue; finale.everyone.push({ hero: n.hero, x: d.x0 + 60 + finale.everyone.length * 40, y: groundYAt(d.x0 + 60), vx: 0, vy: 0, w: 22, h: 52, facing: 1, onGround: true, wall: 0, run: 0, t: rnd(0, 5), moving: false, wcd: rnd(0, 0.8), state: 'idle', wander: 0, extra: true }); npcs.splice(npcs.indexOf(n), 1); }
  restoredBanner.t = 4; restoredBanner.text = 'EVERYONE\'S HERE  ·  ' + (finale.everyone.length + crewAll().length) + ' on the floor';
};
const _failStage = failStage;
failStage = function (reason) { const was = finale.active; _failStage(reason); if (was) { for (const f of finale.everyone) { f.x = stage.door.x0 + 60 + rnd(0, 200); f.y = groundYAt(f.x); f.vx = 0; } } };
function updateEveryone(dt) { if (!finale.active) return; for (const f of finale.everyone) { updateCrewMember(f, dt); if (player.dead <= 0) updateShooter(f, dt, false); } }
function drawEveryone(night) { if (!finale.active) return; for (const f of finale.everyone) { drawHero(ctx, f.hero, f.x, f.y, f.facing, { t: f.t, run: f.run, moving: f.moving, air: !f.onGround }, nearestLight(f.x, f.y - 30, night)); drawShooterExtras(f, weaponOf(f.hero)); } }

/* ---------- the Queen ---------- */
ENEMY.queen = { hp: 900, w: 180, h: 110, speed: 0, dmg: 2, shards: 0, boss: 1, color: [255, 150, 60], beetle: 1 };
function updateQueen(e, dt) {
  e.pt -= dt; e.alpha = 1; const dx = player.x - e.x;
  const phase = e.hp > e.maxHp * 0.66 ? 1 : e.hp > e.maxHp * 0.33 ? 2 : 3;
  if (phase !== finale.phase) { finale.phase = phase; restoredBanner.t = 3; restoredBanner.text = phase === 2 ? 'SHE\'S CLIMBING THE RACKS' : phase === 3 ? 'SHE\'S IN THE DOCK  ·  everything you\'ve got' : 'THE QUEEN'; shake = Math.max(shake, 0.4); if (phase === 2) for (let i = 0; i < 4; i++) { const f = spawnEnemy('beetle', arena.x0 + 100 + i * 220, groundYAt(arena.x0)); if (f) waveState.alive++; } }
  if (!e.mode) { e.mode = 'stalk'; e.pt = 2; e.facing = 1; }
  const spd = phase === 3 ? 1.4 : phase === 2 ? 1.15 : 1;
  if (e.mode === 'stalk') { e.targetable = true; e.vx += clamp(Math.sign(dx) * 60 * spd - e.vx, -300 * dt, 300 * dt); e.facing = Math.sign(dx) || e.facing; if (e.pt <= 0) { const r = Math.random(); e.mode = r < 0.4 ? 'roll' : r < 0.75 ? 'charge' : 'spit'; e.pt = e.mode === 'roll' ? 1.2 : e.mode === 'charge' ? 0.8 : 1.6; e.spat = 0; } }
  else if (e.mode === 'roll') { e.targetable = true; if (e.pt < 0.9 && !e.rolled) { e.rolled = true; for (let k = -1; k <= 1; k += 2) { const f = spawnEnemy('lag', e.x + k * 100, e.y); if (f) { f.vx = k * 380; f.vy = -200; f.hp = 6; waveState.alive++; } } shake = Math.max(shake, 0.15); } if (e.pt <= 0) { e.mode = 'stalk'; e.pt = 1.6 / spd; e.rolled = false; } }
  else if (e.mode === 'charge') { e.targetable = false; if (e.pt > 0.3) { e.vx *= 0.8; } else { e.vx = e.facing * 560 * spd; } if (e.wall || e.pt < -0.7) { e.mode = 'stun'; e.pt = 1.8; e.vx = 0; shake = Math.max(shake, 0.35); puff(e.x + e.facing * 80, e.y, 16); } }
  else if (e.mode === 'stun') { e.targetable = true; e.weak = 0.2; if (e.pt <= 0) { e.mode = 'stalk'; e.pt = 1.4 / spd; } }
  else if (e.mode === 'spit') { e.targetable = true; if (e.spat < 3 + phase && e.pt < 1.4 - e.spat * 0.3) { e.spat++; const T = 0.9; bossProjs.push({ x: e.x + e.facing * 70, y: e.y - 70, vx: dx / T + rnd(-90, 90), vy: -0.5 * G * T - 40, t: 0, r: 7, water: 0, glitch: 1 }); } if (e.pt <= 0) { e.mode = 'stalk'; e.pt = 1.2 / spd; } }
  e.vy += G * dt; if (e.vy > 900) e.vy = 900; moveBody(e, dt, e.w / 2); e.x = clamp(e.x, arena.x0 + e.w / 2, arena.x1 - e.w / 2);
  if (player.inv <= 0 && player.dead <= 0) { const ox = Math.abs(e.x - player.x) < (e.w + player.w) / 2 - 10, oy = player.y > e.y - e.h && player.y - player.h < e.y; if (ox && oy && player.dashT <= 0) hurtPlayer(e.mode === 'charge' ? 2 : 1, e.x); }
  if (Math.random() < dt * 6) spawn({ k: 'glitch', x: e.x + rnd(-80, 80), y: e.y - rnd(0, 100), vx: rnd(-40, 40), vy: rnd(-60, 0), life: 0.5, t: 0, c: e.d.color });
}
function drawQueen(c, e) {
  c.save(); c.translate(e.x, e.y); c.scale(e.facing, 1);
  const w = e.w, h = e.h, stun = e.mode === 'stun', charge = e.mode === 'charge';
  glitchDraw(c, e, (g, tint) => {
    const base = tint ? rgb(tint) : '#2a1a10', edge = tint ? rgb(tint) : (e.hit > 0 ? '#fff' : rgb(e.d.color));
    // legs
    g.strokeStyle = edge; g.lineWidth = 4; for (let k = 0; k < 4; k++) { const la = Math.sin(e.t * 12 + k * 1.5) * 8; g.beginPath(); g.moveTo(-w * 0.35 + k * w * 0.22, -20); g.lineTo(-w * 0.35 + k * w * 0.22 - 16 + la, 0); g.stroke(); }
    // shell — old monitors and shrink wrap
    g.fillStyle = base; g.beginPath(); g.ellipse(0, -h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = edge; g.lineWidth = 3; g.stroke();
    if (!tint) { g.strokeStyle = 'rgba(255,150,60,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -h); g.lineTo(0, 0); g.stroke(); for (const k of [-0.33, 0.33]) { g.beginPath(); g.moveTo(k * w, -h * 0.92); g.lineTo(k * w, -h * 0.08); g.stroke(); }
      for (const [mx, my] of [[-50, -70], [10, -84], [50, -60]]) { g.fillStyle = '#d8d0c0'; rr(g, mx - 16, my - 12, 32, 26, 3); g.fill(); g.fillStyle = '#7fe0a0'; g.fillRect(mx - 13, my - 9, 26, 17); g.fillStyle = '#142014'; g.font = 'bold 6px monospace'; g.textAlign = 'left'; g.fillText('OK', mx - 11, my); g.fillText('OK', mx - 11, my + 6); }
      g.strokeStyle = 'rgba(220,240,255,.45)'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(-w / 2 + 10, -h * 0.2 - k * 14); g.lineTo(w / 2 - 10, -h * 0.35 - k * 14); g.stroke(); } }
    // head + mandibles
    g.fillStyle = tint ? base : '#1c1208'; g.beginPath(); g.arc(w / 2 + 12, -h / 2, 26, 0, Math.PI * 2); g.fill(); g.strokeStyle = edge; g.lineWidth = 3; g.stroke();
    g.beginPath(); g.moveTo(w / 2 + 30, -h / 2 - 14); g.lineTo(w / 2 + 64, -h / 2 - 30); g.moveTo(w / 2 + 30, -h / 2 + 14); g.lineTo(w / 2 + 64, -h / 2 + 30); g.lineWidth = 5; g.stroke();
    if (!tint) { g.fillStyle = charge ? '#fff' : stun ? '#7fe0a0' : edge; g.fillRect(w / 2 + 18, -h / 2 - 10, 8, 8); g.fillRect(w / 2 + 18, -h / 2 + 2, 8, 8); if (stun) { g.fillStyle = '#fff'; g.font = 'bold 14px Georgia'; g.textAlign = 'center'; for (let k = 0; k < 3; k++) g.fillText('✦', w / 2 + 12 + Math.cos(e.t * 6 + k * 2.1) * 30, -h / 2 - 40 + Math.sin(e.t * 6 + k * 2.1) * 8); } }
  });
  c.restore();
}

/* ---------- ending ---------- */
const ending = { t: 0, active: false };
function startEnding() { ending.active = true; ending.t = 0; hour = 0.0; timeAuto = true; weather = 0; }
function updateEnding(dt) { if (!ending.active) return; ending.t += dt; if (ending.t > 34 && (edge.jump || edge.use)) { ending.active = false; restoredBanner.t = 3; restoredBanner.text = 'Thanks for playing  ·  keep exploring the network'; } }
function drawEnding() {
  if (!ending.active) return; const t = ending.t;
  const a = clamp(t / 1.5, 0, 1) * (t > 32 ? clamp(1 - (t - 32) / 2, 0, 1) : 1);
  ctx.fillStyle = rgba([16, 26, 46], 0.55 * a); ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  const lines = [
    [0, 'GO LIVE — OK', 'bold 40px Georgia, serif', '#7fe0a0'],
    [2.5, '12:00 AM  ·  the new site is live', 'italic 16px Georgia, serif', '#f6ecd8'],
    [4, 'A+ ARCHIVED.  Forty years of midnights. Thank you for the orders.', '13px monospace', '#7fe0a0'],
    [6, 'Every DC is back on the network.', '14px system-ui, sans-serif', '#b9c5d6'],
    [8, 'Easton · Taunton · Spartanburg · Plant City · Lansing · Billings · Portland · West Sacramento · Aurora', '12px system-ui, sans-serif', '#b9c5d6'],
    [11, 'Founded in 1938 as a single feed store,', '14px system-ui, sans-serif', '#f6ecd8'],
    [12.5, 'on one promise: show up for the people who count on you.', '14px system-ui, sans-serif', '#f6ecd8'],
    [16, 'The trucks roll at dawn.', 'italic 18px Georgia, serif', '#f2b544'],
    [20, 'HECKTOWN ROAD', 'bold 34px Georgia, serif', '#f2b544'],
    [22, 'the Phillips IT team', '13px system-ui, sans-serif', '#b9c5d6'],
    [23, ROSTER.map(r => r.name).join('  ·  '), '11px system-ui, sans-serif', '#b9c5d6'],
    [26, 'Biscuit, as himself.   Milo, allegedly.', '12px system-ui, sans-serif', '#b9c5d6'],
    [29, 'Any resemblance to actual batch jobs is unfortunately intentional.', 'italic 11px Georgia, serif', '#8f9db3'],
    [32, 'press jump to keep playing', '12px system-ui, sans-serif', '#f6ecd8'],
  ];
  let y = 120;
  for (const [at, txt, font, col] of lines) { if (t < at) break; const la = clamp((t - at) / 1.2, 0, 1) * a; ctx.font = font; ctx.fillStyle = rgba(hex(col), la); ctx.fillText(txt, W / 2, y); y += parseInt(font.match(/(\d+)px/)[1]) + 14; }
  ctx.textAlign = 'left';
}
const _onBossDead = onBossDead;
onBossDead = function (e) {
  _onBossDead(e);
  if (e.type === 'queen') { finale.active = false; for (const f of finale.everyone) addNPC({ hero: f.hero, look: f.hero, x: f.x, y: groundYAt(f.x), facing: f.facing, onTalk: teammateTalk }); finale.everyone.length = 0; story.ending = 1; startEnding(); setObjectives([{ text: 'The site is live. Keep exploring the network, or take the team to the Buying Show.', check: () => false }]); }
};
