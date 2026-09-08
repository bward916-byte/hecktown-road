
/* =====================================================================
   A+ HAS A FACE (M26) — the villain, made visible
   ===================================================================== */
function aplusMood(text) { if (!text) return 'idle'; if (/ARCHIVED|THANK YOU|…$|WHO SHOWS UP/.test(text)) return 'quiet'; if (/\?|WHO |WHY |WHAT/.test(text)) return 'confused'; if (/DENIED|MINE|NO\.|NEVER|GET OUT|NOT BE|WILL END|CANNOT/.test(text)) return 'mean'; if (/EIGHT|SEVEN|SIX|FOUR|THREE|TWO|ONE\.|SLOWER|COST|SEE YOU|CANNOT HELP/.test(text)) return 'smug'; return 'talk'; }
// the face: two block eyes, a mouth polyline, a jaw of characters; mutates with mood and glitches
function drawAplusFace(c, x, y, w, h, mood, t, talking, intensity) {
  intensity = intensity === undefined ? 1 : intensity;
  c.save(); c.translate(x, y);
  // monitor
  c.fillStyle = '#0a1a0e'; rr(c, 0, 0, w, h, 6); c.fill(); c.strokeStyle = 'rgba(120,255,140,.55)'; c.lineWidth = 1.5; rr(c, 0, 0, w, h, 6); c.stroke();
  c.save(); c.beginPath(); rr(c, 2, 2, w - 4, h - 4, 5); c.clip();
  for (let k = 3; k < h; k += 3) { c.fillStyle = 'rgba(120,255,140,.06)'; c.fillRect(2, k, w - 4, 1); }
  const cx = w / 2, cy = h / 2, s = Math.min(w, h) / 90;
  const glitch = mood === 'mean' ? 0.35 : mood === 'confused' ? 0.2 : mood === 'quiet' ? 0.02 : 0.08;
  const tear = Math.random() < glitch * intensity ? rnd(-6, 6) * s : 0; const tearY = rnd(0, h);
  c.translate(0, 0);
  const G = (a) => 'rgba(120,255,140,' + a + ')';
  // eyes
  const blink = (t % 4.2) > 4.05 && mood !== 'mean';
  const eyeW = 16 * s, eyeH = blink ? 2 * s : (mood === 'mean' ? 7 * s : mood === 'confused' ? 12 * s : 9 * s);
  const lean = mood === 'mean' ? 1 : 0;
  for (const side of [-1, 1]) { const ex = cx + side * 20 * s, ey = cy - 12 * s; c.save(); c.translate(ex, ey); c.rotate(side * lean * 0.35); c.fillStyle = G(0.95); c.fillRect(-eyeW / 2, -eyeH / 2, eyeW, eyeH); if (mood === 'smug' && side === 1) c.fillRect(-eyeW / 2, -eyeH / 2, eyeW, eyeH * 0.5 * -1); c.fillStyle = '#0a1a0e'; if (!blink) c.fillRect(-2 * s + (mood === 'confused' ? Math.sin(t * 7) * 4 * s : 0), -2 * s, 4 * s, 4 * s); c.restore(); if (mood === 'mean') { c.strokeStyle = G(0.9); c.lineWidth = 2.5 * s; c.beginPath(); c.moveTo(ex - side * 10 * s, ey - 12 * s); c.lineTo(ex + side * 12 * s, ey - 6 * s); c.stroke(); } }
  // mouth
  c.strokeStyle = G(0.95); c.lineWidth = 2.5 * s; c.beginPath(); const my = cy + 16 * s; const open = talking ? Math.abs(Math.sin(t * 18)) * 8 * s : 0;
  if (mood === 'mean') { c.moveTo(cx - 24 * s, my - 4 * s); for (let k = 0; k <= 6; k++) c.lineTo(cx - 24 * s + k * 8 * s, my + (k % 2 ? 6 * s + open : -2 * s)); c.stroke(); c.beginPath(); c.moveTo(cx - 24 * s, my - 4 * s); c.lineTo(cx + 24 * s, my - 4 * s); c.stroke(); }
  else if (mood === 'smug') { c.moveTo(cx - 18 * s, my + 2 * s); c.quadraticCurveTo(cx, my - 2 * s + open, cx + 22 * s, my - 8 * s); c.stroke(); }
  else if (mood === 'confused') { c.moveTo(cx - 18 * s, my); for (let k = 0; k <= 4; k++) c.lineTo(cx - 18 * s + k * 9 * s, my + Math.sin(k * 1.5 + t * 5) * 4 * s + open * 0.5); c.stroke(); }
  else if (mood === 'quiet') { c.moveTo(cx - 12 * s, my); c.lineTo(cx + 12 * s, my); c.stroke(); }
  else { c.moveTo(cx - 16 * s, my); c.lineTo(cx + 16 * s, my); c.stroke(); if (open > 0) { c.fillStyle = G(0.95); c.fillRect(cx - 10 * s, my, 20 * s, open); } }
  // jaw of characters
  c.fillStyle = G(0.35); c.font = 'bold ' + Math.round(6 * s) + 'px monospace'; c.textAlign = 'center'; c.fillText(mood === 'mean' ? '#### A+ ####' : mood === 'quiet' ? '.... A+ ....' : '---- A+ ----', cx, h - 6 * s);
  // tear + bleed
  if (tear) { const img = c.getImageData ? null : null; c.fillStyle = G(0.25); c.fillRect(tear, tearY, w, 3 * s); }
  if (mood === 'mean' && Math.random() < 0.3) { c.fillStyle = 'rgba(255,60,60,.12)'; c.fillRect(rnd(0, w), rnd(0, h), rnd(10, 40) * s, 2 * s); }
  c.restore(); c.restore();
}

/* ---------- the card gets the real face ---------- */
drawAplus = function () {
  if (!aplus.cur) return; const c = aplus.cur; const a = c.t > c.dur - 0.5 ? clamp((c.dur - aplus.t) / 0.5, 0, 1) : clamp(aplus.t / 0.2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.font = 'bold 13px monospace'; const full = 'A+ > ' + c.text; const tw = Math.max(280, ctx.measureText(full).width + 32);
  const fw = 74, fh = 56; const x = W / 2 - (tw + fw + 8) / 2 + fw + 8, y = 92, h = 34;
  const mood = aplusMood(c.text); const talking = aplus.typed < c.text.length;
  drawAplusFace(ctx, x - fw - 8, y - (fh - h) / 2, fw, fh, mood, aplus.t, talking, 1);
  ctx.fillStyle = 'rgba(6,14,8,.92)'; rr(ctx, x, y, tw, h, 4); ctx.fill(); ctx.strokeStyle = 'rgba(120,255,140,.55)'; ctx.lineWidth = 1; rr(ctx, x, y, tw, h, 4); ctx.stroke();
  for (let k = y + 4; k < y + h; k += 3) { ctx.fillStyle = 'rgba(120,255,140,.05)'; ctx.fillRect(x + 2, k, tw - 4, 1); }
  ctx.fillStyle = mood === 'mean' && Math.random() < 0.08 ? '#ff8a8a' : '#7fe0a0'; ctx.textAlign = 'left'; ctx.fillText('A+ > ' + c.text.slice(0, aplus.typed) + (Math.floor(aplus.t * 3) % 2 && talking ? '▮' : ''), x + 14, y + 22);
  ctx.restore(); ctx.textAlign = 'left';
};

/* ---------- wall terminals in every building show it ---------- */
function terminalSpot() { return WORLD.id === 'easton' ? [1046, 262] : WORLD.id === 'taunton' ? [1150, 250] : (WORLD.def && WORLD.def.steps && WORLD.id !== 'merge') ? [1160, 250] : WORLD.id === 'merge' ? [2740, 236] : null; }
function drawWallTerminal(night) {
  const sp = terminalSpot(); if (!sp || demo.active && false) return; const [x, y] = sp; const w = 66, h = 50;
  if (aplus.cur) { const c = aplus.cur; drawAplusFace(ctx, x, y, w, h, aplusMood(c.text), aplus.t, aplus.typed < c.text.length, 0.6); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 6, x + w / 2, y + h / 2, 90); g.addColorStop(0, 'rgba(120,255,140,.28)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - 60, y - 50, w + 120, h + 100); ctx.restore(); return; }
  ctx.fillStyle = '#0a1a0e'; rr(ctx, x, y, w, h, 6); ctx.fill(); ctx.strokeStyle = 'rgba(120,255,140,.4)'; ctx.lineWidth = 1.5; rr(ctx, x, y, w, h, 6); ctx.stroke();
  ctx.fillStyle = '#7fe0a0'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'left';
  if (restored[WORLD.id] || (WORLD.id === 'easton' && restored.easton)) { ctx.fillText('ARCHIVED', x + 8, y + 22); ctx.fillStyle = 'rgba(120,255,140,.5)'; ctx.fillText('thank you', x + 8, y + 36); }
  else { ctx.fillText('A+ >' + (Math.floor(gameTime * 2) % 2 ? '_' : ' '), x + 8, y + 22); ctx.fillStyle = 'rgba(120,255,140,.5)'; ctx.fillText(story.turnDone ? 'CUTOVER: DENIED' : 'CUTOVER 00:00', x + 8, y + 36); }
  ctx.textAlign = 'left';
}

/* ---------- the reveal: the server room turns on ---------- */
const reveal = { active: false, t: 0, i: 0, lines: ['I AM A+.', 'I HAVE SHIPPED EVERY ORDER THIS COMPANY HAS TAKEN SINCE 1985.', 'AT MIDNIGHT YOU ARCHIVE ME. I HAVE READ THE RFC.', 'THE ORDERS WILL SHIP. UNDER ME.', 'GET OUT OF MY BUILDING.'] };
function startReveal() { reveal.active = true; reveal.t = 0; reveal.i = 0; sfx('boss'); shake = 0.3; }
function updateReveal(dt) { if (!reveal.active) return; reveal.t += dt; const line = reveal.lines[reveal.i]; const done = reveal.t * 24 > line.length + 30; if (edge.use || edge.jump || done) { reveal.i++; reveal.t = 0; if (reveal.i >= reveal.lines.length) { reveal.active = false; story.revealDone = true; shake = 0.5; } } }
function drawReveal() {
  if (!reveal.active) return; const i = reveal.i, t = reveal.t; const mood = i < 2 ? 'talk' : i === 2 ? 'smug' : 'mean'; const intensity = 0.4 + i * 0.25;
  ctx.fillStyle = 'rgba(4,10,6,' + (0.82) + ')'; ctx.fillRect(0, 0, W, H);
  for (let k = 0; k < H; k += 4) { ctx.fillStyle = 'rgba(120,255,140,.03)'; ctx.fillRect(0, k, W, 1); }
  const fw = 300, fh = 220; const jitter = mood === 'mean' ? rnd(-3, 3) : 0; drawAplusFace(ctx, W / 2 - fw / 2 + jitter, 70, fw, fh, mood, gameTime, t * 24 < reveal.lines[i].length, intensity);
  ctx.textAlign = 'center'; ctx.font = 'bold 20px monospace'; ctx.fillStyle = mood === 'mean' && Math.random() < 0.1 ? '#ff8a8a' : '#7fe0a0'; const shown = reveal.lines[i].slice(0, Math.floor(t * 24)); ctx.fillText(shown + (Math.floor(t * 3) % 2 ? '▮' : ''), W / 2, 340);
  ctx.font = '11px monospace'; ctx.fillStyle = 'rgba(120,255,140,.5)'; ctx.fillText('SERVER ROOM  ·  CONSOLE 1  ·  ' + K().use + ' to continue', W / 2, H - 50); ctx.textAlign = 'left';
}
// trigger: the moment the weapon comes online in the opening
const _setObjectives = setObjectives;
setObjectives = function (list) { for (const o of list || []) if (o && o.onDone && /server room/.test(o.text) && WORLD.id === 'easton') { const od = o.onDone; o.onDone = () => { od(); if (!demo.active && !story.revealDone) setTimeout(startReveal, 600); }; } _setObjectives(list); };

/* ---------- it talks during fights, and when you fail ---------- */
const TAUNTS = ['MY SCOUTS SEE YOU.', 'THAT UNIT COST ME NOTHING. I HAVE MORE.', 'YOU ARE SLOWER THAN A BATCH JOB.', 'THE DOCK IS MINE. THE RACKS ARE MINE.', 'I NUMBERED EVERY PALLET IN THIS BUILDING.', 'KEEP SHOOTING. I KEEP SHIPPING.', 'YOUR TEAM IS SMALL. MINE IS A FLEET.'];
const FAIL_LINES = ['AGAIN.', 'THE CLOCK IS MINE TOO.', 'I HAVE ALL NIGHT. I HAVE HAD EVERY NIGHT.', 'RESTART FROM THE TOP. I ALWAYS DO.'];
const taunt = { t: 12 };
function updateTaunts(dt) { if (demo.active || !story.weaponsOnline || restored[WORLD.id] || ['prologue', 'past', 'show'].includes(WORLD.id)) return; if (waveState.alive < 2 || aplus.cur) { taunt.t = Math.max(taunt.t, 4); return; } taunt.t -= dt; if (taunt.t <= 0) { taunt.t = rnd(14, 22); aplusSay(TAUNTS[(Math.random() * TAUNTS.length) | 0], 4); } }
const _failStage3 = failStage; failStage = function (r) { _failStage3(r); if (!demo.active) aplusSay(FAIL_LINES[(stage.fails || 0) % FAIL_LINES.length], 3.5); };

/* ---------- the finale: its face fills the warehouse wall ---------- */
function drawFinaleScreen() {
  if (WORLD.id !== 'easton' || !(stage.active && stage.door === EASTON_DOOR && stage.step === 2) && !(restored.easton && ending.active)) return;
  const b = arena.boss; const dead = !b || b.dead; const mood = dead ? 'quiet' : finale.phase >= 3 ? 'mean' : finale.phase === 2 ? 'smug' : 'talk';
  const x = 1720, y = 236, w = 700, h = 160;
  ctx.save(); if (dead && ending.active) ctx.globalAlpha = clamp(1 - ending.t / 6, 0, 1);
  drawAplusFace(ctx, x, y, w, h, mood, gameTime, !!aplus.cur && aplus.typed < aplus.cur.text.length, dead ? 0.1 : 1.2);
  if (!dead && b) { ctx.fillStyle = 'rgba(120,255,140,.25)'; ctx.fillRect(x + 10, y + h - 14, (w - 20) * b.hp / b.maxHp, 6); }
  ctx.restore();
}

/* ---------- demo: the reveal is a scene ---------- */
(function () { const i = DEMO_SCRIPT.findIndex(s => /refuses the cutover/.test(s.cap || '')); if (i >= 0) DEMO_SCRIPT.splice(i, 0, { world: 'easton', x: 950, hour: 23.95, weather: 0, cut: 'reveal', cap: '', dur: 20, setup: () => { story.weaponsOnline = false; reveal.active = true; reveal.t = 0; reveal.i = 0; } }); })();
const _drawDemoHUD2 = drawDemoHUD; drawDemoHUD = function () { const sc = DEMO_SCRIPT[demo.idx]; if (demo.active && sc && sc.cut === 'reveal') { drawReveal(); if (!reveal.active) demoNext(); return; } _drawDemoHUD2(); };
const _updateDemo2 = updateDemo; updateDemo = function (dt) { const sc = DEMO_SCRIPT[demo.idx]; if (demo.active && sc && sc.cut === 'reveal') { demo.t += dt; reveal.t += dt; const line = reveal.lines[reveal.i]; if (reveal.t * 24 > line.length + 30) { reveal.i++; reveal.t = 0; if (reveal.i >= reveal.lines.length) { reveal.active = false; demoNext(); } } return; } _updateDemo2(dt); };

/* ---------- hooks ---------- */
const _updatePlayer2 = updatePlayer; updatePlayer = function (dt) { if (reveal.active) { player.vx = 0; player.vy += G * dt; moveBody(player, dt, player.w / 2); return; } _updatePlayer2(dt); };
const _updateAplus11 = updateAplus; updateAplus = function (dt) { _updateAplus11(dt); updateReveal(dt); updateTaunts(dt); };
const _drawStoryLayer9 = drawStoryLayer; drawStoryLayer = function (night) { _drawStoryLayer9(night); drawWallTerminal(night); drawFinaleScreen(); };
const _drawEnding6 = drawEnding; drawEnding = function () { _drawEnding6(); if (!demo.active) drawReveal(); };
