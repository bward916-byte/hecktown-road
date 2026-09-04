/* =====================================================================
   THE CREW (v3) — independent teammates, skills, meet-ups, story beats
   ===================================================================== */
const crew = []; // your 2 teammates (crew cap 3 incl. you)
const CREW_MAX = 3;
const SKILL = {}; // hero name -> level
function skillOf(ch) { return SKILL[ch.name] || 0; }
function rateMul(sh) { const b = sh && sh.buff > 0 ? 0.85 : 1; return b / (1 + skillOf(sh.hero) * 0.10); }
function rangeMul(sh) { return 1 + skillOf(sh.hero) * 0.08; }
function extraCount(sh) { return Math.floor(skillOf(sh.hero) / 3); }
const story = { weaponsOnline: false, turnDone: false, met: new Set() };
const PORTRAITS = {};
function portraitFor(ch) { if (!PORTRAITS[ch.name]) { const c = mkCanvas(80, 80); const g = c.getContext('2d'); g.scale(2, 2); drawPortrait(g, ch, 40); PORTRAITS[ch.name] = c; } return PORTRAITS[ch.name]; }
function crewAll() { return [player].concat(crew); }
const packUI = { banner: 0, bannerText: '', rects: [] };
function banner(text, t) { packUI.banner = t || 2.5; packUI.bannerText = text; }

/* ---- objectives ---- */
const quest = { list: [], idx: 0, flash: 0 };
function setObjectives(list) { quest.list = list; quest.idx = 0; quest.flash = 2; if (list[0] && list[0].onStart) list[0].onStart(); }
function currentObjective() { return quest.list[quest.idx] || null; }
function updateQuest(dt) {
  if (quest.flash > 0) quest.flash -= dt;
  const o = currentObjective(); if (!o) return;
  if (o.check && o.check()) { if (o.onDone) o.onDone(); quest.idx++; quest.flash = 2; const n = currentObjective(); if (n && n.onStart) n.onStart(); }
}

/* ---- guide: target arrows + control tips ---- */
const guide = { t: 0 };
function K() { const tc = touch.used; return { move: tc ? 'drag the left side of the screen' : '← →  (or A / D)', jump: tc ? 'JUMP button' : 'SPACE', dash: tc ? 'DASH button' : 'SHIFT', use: tc ? 'USE button' : 'E', nip: tc ? 'NIP button' : 'X', swap: tc ? 'tap a portrait' : 'C' }; }
function tipFor(o) { if (!o || !o.tip) return null; const k = K(); return o.tip.replace(/\{(\w+)\}/g, (m, key) => k[key] || m); }
function drawGuide() {
  guide.t += 1 / 60;
  const o = currentObjective(); if (!o || demo.active) return;
  const tg = o.target ? o.target() : null;
  if (tg && tg.x !== undefined) {
    const sx = tg.x - camera.x, sy = (tg.y === undefined ? groundYAt(tg.x) : tg.y) - camera.y;
    const bob = Math.sin(guide.t * 5) * 6;
    if (sx > 30 && sx < W - 30) {
      // arrow above the target
      ctx.save(); ctx.translate(sx, sy - 96 + bob);
      ctx.fillStyle = '#f2b544'; ctx.strokeStyle = '#7a3b2a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 22); ctx.lineTo(-14, 4); ctx.lineTo(-6, 4); ctx.lineTo(-6, -14); ctx.lineTo(6, -14); ctx.lineTo(6, 4); ctx.lineTo(14, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (tg.label) { ctx.font = 'bold 11px system-ui, sans-serif'; const tw = ctx.measureText(tg.label).width + 16; ctx.fillStyle = 'rgba(16,26,46,.8)'; rr(ctx, -tw / 2, -36, tw, 18, 5); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.textAlign = 'center'; ctx.fillText(tg.label, 0, -23); }
      ctx.restore();
    } else {
      // edge chevron pointing off-screen
      const right = sx >= W - 30; const ex = right ? W - 40 : 40; const ey = clamp(sy - 40, 120, H - 120);
      ctx.save(); ctx.translate(ex, ey); ctx.fillStyle = 'rgba(16,26,46,.75)'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f2b544'; ctx.beginPath(); const d = right ? 1 : -1; ctx.moveTo(d * 12, 0); ctx.lineTo(-d * 6, -10); ctx.lineTo(-d * 6, 10); ctx.closePath(); ctx.fill();
      if (tg.label) { ctx.font = 'bold 10px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#f6ecd8'; ctx.fillText(tg.label + '  ·  ' + Math.round(Math.abs(tg.x - player.x) / 10) * 10 + 'm', 0, 38); }
      ctx.restore();
    }
  }
  const tip = tipFor(o);
  if (tip) { const y = packUI.banner > 0 ? 212 : 186; ctx.font = '12px system-ui, sans-serif'; const tw = ctx.measureText(tip).width + 28; ctx.fillStyle = 'rgba(16,26,46,.72)'; rr(ctx, W / 2 - tw / 2, y - 16, tw, 24, 8); ctx.fill(); ctx.strokeStyle = 'rgba(242,181,68,.45)'; ctx.lineWidth = 1; rr(ctx, W / 2 - tw / 2, y - 16, tw, 24, 8); ctx.stroke(); ctx.fillStyle = '#f6ecd8'; ctx.textAlign = 'center'; ctx.fillText(tip, W / 2, y + 1); }
  // first steps: animated move arrows beside the hero until they move
  if (o.moveHint && !o.moved) { if (Math.abs(player.vx) > 40) o.moved = true; const px = player.x - camera.x, py = player.y - camera.y - 30; const w = 0.5 + 0.5 * Math.sin(guide.t * 6); ctx.fillStyle = rgba([242, 181, 68], 0.5 + 0.5 * w); ctx.font = 'bold 22px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('◀', px - 46 - w * 6, py); ctx.fillText('▶', px + 46 + w * 6, py); }
  ctx.textAlign = 'left';
}
/* ---- packages (carry & deliver) ---- */
const packages = [];
function spawnPackage(x, y, label) { const p = { x, y, vy: 0, carried: false, label: label || 'KIBBLE' }; packages.push(p); return p; }
function updatePackages(dt) {
  for (const p of packages) {
    if (p.carried) { p.x = player.x + player.facing * 14; p.y = player.y - 30; continue; }
    p.vy += G * dt; p.y += p.vy * dt; const gy = groundYAt(p.x); if (p.y > gy) { p.y = gy; p.vy = 0; }
  }
}
function drawPackage(c, p) { c.save(); c.translate(p.x, p.y); c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(0, 1, 14, 3, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#c9a56a'; rr(c, -13, -22, 26, 22, 3); c.fill(); c.fillStyle = '#e9e1cf'; c.fillRect(-13, -14, 26, 5); c.fillStyle = '#f2b544'; c.fillRect(-9, -20, 10, 4); c.fillStyle = '#243447'; c.font = 'bold 6px system-ui'; c.textAlign = 'center'; c.fillText(p.label, 0, -5); c.restore(); }

/* ---- scannable pallets ---- */
const scanTargets = [];
function addScan(x, y, sku) { const s = { x, y, sku, done: false, t: rnd(0, 6) }; scanTargets.push(s); return s; }
function drawScanTarget(c, s) {
  c.save(); c.translate(s.x, s.y);
  drawPallet(c, -30, -28);
  c.fillStyle = s.done ? '#7fe0a0' : '#f2b544'; rr(c, -18, -46, 36, 14, 3); c.fill();
  c.fillStyle = '#141826'; for (let k = 0; k < 12; k++) c.fillRect(-15 + k * 2.6, -44, (k % 3 === 0) ? 1.5 : 0.8, 8);
  c.fillStyle = 'rgba(16,26,46,.7)'; rr(c, -30, -70, 60, 16, 5); c.fill(); c.fillStyle = s.done ? '#7fe0a0' : '#f6ecd8'; c.font = 'bold 9px monospace'; c.textAlign = 'center'; c.fillText(s.done ? 'OK ' + s.sku : s.sku, 0, -58);
  if (!s.done) { c.strokeStyle = rgba([242, 181, 68], 0.5 + 0.5 * Math.sin(s.t * 5)); c.lineWidth = 1.5; c.strokeRect(-20, -48, 40, 18); }
  c.restore();
}

/* ---- NPCs ---- */
const npcs = [];
function addNPC(o) { o.t = rnd(0, 6); o.line = 0; if (!o.facing) o.facing = -1; npcs.push(o); return o; }
const NPC_LOOKS = {
  rosa: { name: 'Rosa', role: 'Dock Lead', skin: '#c48a62', hair: '#1a1410', style: 'cap', shirt: '#f2b544', pants: '#2b2f3a', acc: 'vest' },
  sal: { name: 'Sal', role: 'Receiving', skin: '#eec2a0', hair: '#5a3a22', style: 'beard', shirt: '#f2b544', pants: '#3a3d47', acc: 'vest' },
};
function drawNPC(c, n, night) {
  const lit = nearestLight(n.x, n.y - 30, night);
  drawHero(c, n.look, n.x, n.y, n.facing, { t: n.t, run: 0, moving: false }, lit);
  const label = n.hero ? n.hero.name.toUpperCase() + '  ·  ' + n.hero.role : n.look.name.toUpperCase();
  c.save(); c.translate(n.x, n.y - 74); c.font = 'bold 9px system-ui, sans-serif'; const tw = c.measureText(label).width + 16; c.fillStyle = 'rgba(16,26,46,.7)'; rr(c, -tw / 2, -8, tw, 16, 5); c.fill(); c.fillStyle = n.hero ? '#f2b544' : '#f6ecd8'; c.textAlign = 'center'; c.fillText(label, 0, 4); c.restore();
}
const talk = { open: false, npc: null, text: '', t: 0, options: null, sel: 0 };
function say(npc, text, options) { talk.open = true; talk.npc = npc; talk.text = text; talk.t = 0; talk.options = options || null; talk.sel = 0; talk.lh = 1; talk.rh = 1; }
function nearNPC() { let best = null, bd = 60; for (const n of npcs) { const d = Math.abs(n.x - player.x); if (d < bd && Math.abs(n.y - player.y) < 40) { bd = d; best = n; } } return best; }
function updateTalk(dt) {
  talk.t += dt; talk.justClosed = false;
  if (talk.open) {
    if (talk.options) {
      if (tk.left && !talk.lh) talk.sel = (talk.sel + talk.options.length - 1) % talk.options.length; talk.lh = tk.left;
      if (tk.right && !talk.rh) talk.sel = (talk.sel + 1) % talk.options.length; talk.rh = tk.right;
      if ((edge.use || edge.jump) && talk.t > 0.2) { const o = talk.options[talk.sel]; talk.open = false; talk.justClosed = true; if (o.fn) o.fn(); }
    } else if ((edge.use || edge.jump) && talk.t > 0.2) { talk.open = false; talk.justClosed = true; }
    return;
  }
  const n = nearNPC(); WORLD.nearNPC = n;
  if (n && edge.use && !shop.near && !(player.carry && n.acceptsPackage) && !(nearPackage() && !player.carry) && !nearScan()) { n.facing = player.x < n.x ? -1 : 1; if (n.onTalk) n.onTalk(n); else { say(n, n.lines[n.line % n.lines.length]); n.line++; } }
}
function joinCrew(ch) {
  const n = npcs.find(q => q.hero === ch); if (!n || crew.length >= CREW_MAX - 1) return false;
  crew.push({ hero: ch, x: n.x, y: n.y, vx: 0, vy: 0, w: 22, h: 52, facing: n.facing || 1, onGround: true, wall: 0, run: 0, t: rnd(0, 5), moving: false, wcd: rnd(0, 0.5), state: 'idle', wander: 0 });
  npcs.splice(npcs.indexOf(n), 1); story.met.add(ch.name); sfx('join');
  banner(ch.name + ' joined your crew  ·  ' + weaponOf(ch).name, 3);
  for (let k = 0; k < 18; k++) spawn({ k: 'spark', x: n.x + rnd(-16, 16), y: n.y - rnd(0, 52), vx: rnd(-160, 160), vy: rnd(-220, 40), life: rnd(0.4, 0.8), t: 0, c: [242, 181, 68] });
  return true;
}
function leaveCrew(i) {
  const f = crew[i]; if (!f) return; crew.splice(i, 1);
  addNPC({ hero: f.hero, look: f.hero, x: f.x, y: groundYAt(f.x), facing: f.facing, onTalk: teammateTalk });
}
function teammateTalk(n) {
  const ch = n.hero;
  if (!story.turnDone) { say(n, ch.name + ': "Something\'s off with the batch job tonight. Check the server room — I\'ll be here."'); return; }
  if (crew.length < CREW_MAX - 1) say(n, ch.name + ': "Crew\'s forming? Count me in — ' + weaponOf(ch).name + ' is charged."', [{ label: 'Join us', fn: () => joinCrew(ch) }, { label: 'Not yet', fn: null }]);
  else say(n, ch.name + ': "Three\'s a crew. Want me to take someone\'s spot?"', crew.map((f, i) => ({ label: 'Swap ' + f.hero.name, fn: () => { leaveCrew(i); joinCrew(ch); } })).concat([{ label: 'No thanks', fn: null }]));
}

/* ---- encounters (mini battles at fixed spots) ---- */
const encounters = [];
function addEncounter(x, list, r) { encounters.push({ x, list, done: false, r: r || 220 }); }
function spawnGroup(x, list) {
  let k = 0; for (const type of list) { const side = k % 2 ? -1 : 1; const sx = clamp(x + side * rnd(160, 300), 30, WORLD.width - 30); const e = spawnEnemy(type, sx, groundYAt(sx) - 2); if (e) { waveState.alive++; waveState.rifts.push({ x: sx, y: e.y - 20, t: 0, c: e.d.color }); } k++; }
}
function updateEncounters(dt) {
  if (!story.weaponsOnline) return;
  for (const en of encounters) { if (en.done || Math.abs(player.x - en.x) > en.r) continue; en.done = true; spawnGroup(en.x, en.list); banner('Machines!', 1.4); shake = Math.max(shake, 0.08); }
}

/* ---- independent crew AI ---- */
function updateCrewMember(f, dt) {
  f.t += dt; if (f.buff > 0) f.buff -= dt;
  const w = weaponOf(f.hero); const range = w.range * rangeMul(f);
  const melee = w.kind === 'blades' || w.kind === 'slam' || w.kind === 'rally';
  const tgt = story.weaponsOnline ? nearestEnemy(f.x, f.y - 30, 560) : null;
  let want = 0, jump = false;
  if (tgt) {
    f.state = 'fight';
    const dx = tgt.x - f.x, dist = Math.abs(dx);
    const ideal = melee ? 34 : clamp(range * 0.62, 120, 330);
    if (dist > ideal + 30) want = Math.sign(dx);
    else if (!melee && dist < ideal - 70) want = -Math.sign(dx);
    if (want === 0) f.facing = Math.sign(dx) || f.facing;
    if (tgt.y < f.y - 50 && dist < 120 && f.onGround) jump = true;
  } else {
    const dx = player.x - f.x; const leash = 150;
    if (Math.abs(dx) > leash) { f.state = 'regroup'; want = Math.sign(dx); }
    else { f.state = 'idle'; f.wander -= dt; if (f.wander <= 0) { f.wander = rnd(1.5, 4); f.wantDir = Math.random() < 0.5 ? 0 : (Math.random() < 0.5 ? -1 : 1); } want = f.wantDir && Math.abs(dx) < leash - 40 ? f.wantDir * 0.4 : 0; }
    if (player.y < f.y - 60 && Math.abs(dx) < 140 && f.onGround) jump = true;
  }
  if (arena.active) { if (f.x < arena.x0 + 20) want = 1; if (f.x > arena.x1 - 20) want = -1; }
  f.vx += clamp(want * 250 - f.vx, -2200 * dt, 2200 * dt);
  if (want) f.facing = Math.sign(want);
  if ((jump || (f.wall && want)) && f.onGround) f.vy = -640;
  f.vy += G * dt; if (f.vy > 900) f.vy = 900;
  moveBody(f, dt, 11);
  if (arena.active) f.x = clamp(f.x, arena.x0 + 12, arena.x1 - 12);
  if (Math.abs(player.x - f.x) > 900) { f.x = player.x - player.facing * 40; f.y = player.y; f.vy = 0; }
  f.moving = Math.abs(f.vx) > 20;
  if (f.moving && f.onGround) f.run = (f.run + dt * (Math.abs(f.vx) / 62)) % 1; else if (!f.moving) f.run = 0;
}
function crewHoldsFire() { return stage.active && WORLD.id === 'spartanburg' && stage.step === 1; } // no shooting around the forklift
function updateCrew(dt) { for (const f of crew) { updateCrewMember(f, dt); if (player.dead <= 0 && !crewHoldsFire()) updateShooter(f, dt, false); } if (player.buff > 0) player.buff -= dt; }

/* ---- leader swap ---- */
const SHOOTER_FIELDS = ['hero', 'wcd', 'drones', 'bladeA', 'seen', 'target', 'recoil', 'buff'];
function swapLeader(i) {
  const f = crew[i]; if (!f) return;
  const tmp = {}; for (const k of SHOOTER_FIELDS) { tmp[k] = player[k]; player[k] = f[k]; f[k] = tmp[k]; }
  const px = player.x, py = player.y, pf = player.facing; player.x = f.x; player.y = f.y; player.facing = f.facing; f.x = px; f.y = py; f.facing = pf; f.vx = 0; f.vy = 0;
  player.vx = 0; player.vy = 0; hero = player.hero; player.inv = Math.max(player.inv, 0.3);
  banner(hero.name + ' takes point', 1.4);
  spawn({ k: 'flash', x: player.x, y: player.y - 30, life: 0.25, t: 0, c: weaponOf(hero).color });
}
function cycleLeader() { if (crew.length) swapLeader(0); }

/* ---- render ---- */
function drawCrew(night) {
  for (const f of crew) { drawHero(ctx, f.hero, f.x, f.y, f.facing, { t: f.t, run: f.run, moving: f.moving, air: !f.onGround }, nearestLight(f.x, f.y - 30, night)); drawShooterExtras(f, weaponOf(f.hero)); }
}
function drawShooterExtras(sh, w) {
  if (!w) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  if (w.kind === 'orbit' && sh.drones) for (const d of sh.drones) { ctx.fillStyle = rgb(w.color); ctx.beginPath(); ctx.arc(d.x, d.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(d.x - 2, d.y - 1, 4, 2); ctx.strokeStyle = rgba(w.color, 0.4); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(d.x, d.y, 9, gameTime * 6, gameTime * 6 + 2); ctx.stroke(); }
  if (w.kind === 'blades' && story.weaponsOnline) { const p = shooterPos(sh); const bb = sh.bladeBoost > 0 ? 2 : 1; const n = (2 + extraCount(sh)) * bb; for (let k = 0; k < n; k++) { const an = (sh.bladeA || 0) + k * Math.PI * 2 / n; const bx = p.x + Math.cos(an) * 46 * bb, by = p.y + Math.sin(an) * 30 * bb; ctx.save(); ctx.translate(bx, by); ctx.rotate(an + Math.PI / 2); ctx.fillStyle = rgb(w.color); ctx.beginPath(); ctx.moveTo(-3, -12); ctx.lineTo(3, -12); ctx.lineTo(1, 12); ctx.lineTo(-1, 12); ctx.closePath(); ctx.fill(); ctx.restore(); } ctx.strokeStyle = rgba(w.color, 0.25); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(p.x, p.y, 46, 30, 0, 0, Math.PI * 2); ctx.stroke(); }
  if (sh.buff > 0) { const p = shooterPos(sh); ctx.strokeStyle = rgba([242, 181, 68], 0.18 * Math.min(1, sh.buff)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(p.x, p.y + 30, 24, 6, 0, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
}
function drawStoryLayer(night) {
  for (const s of scanTargets) drawScanTarget(ctx, s);
  for (const n of npcs) drawNPC(ctx, n, night);
  for (const p of packages) if (!p.carried) drawPackage(ctx, p);
}
function nearPackage() { for (const p of packages) if (!p.carried && Math.abs(p.x - player.x) < 34 && Math.abs(p.y - player.y) < 40) return p; return null; }
function nearScan() { for (const s of scanTargets) if (!s.done && Math.abs(s.x - player.x) < 40 && Math.abs(s.y - player.y) < 50) return s; return null; }
function drawStoryFront() {
  for (const p of packages) if (p.carried) drawPackage(ctx, p);
  ctx.font = 'bold 10px system-ui, sans-serif'; ctx.textAlign = 'center';
  const prompt = (x, y, txt) => { const tw = ctx.measureText(txt).width + 16; ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, x - tw / 2, y - 13, tw, 18, 5); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.fillText(txt, x, y); };
  const n = WORLD.nearNPC; if (n && !talk.open && !shop.near) prompt(n.x, n.y - 87, player.carry && n.acceptsPackage ? 'E  ·  HAND OVER' : 'E  ·  TALK');
  const pk = nearPackage(); if (pk && !player.carry) prompt(pk.x, pk.y - 31, 'E  ·  PICK UP');
  const sc = nearScan(); if (sc) prompt(sc.x, sc.y - 79, 'E  ·  SCAN');
  ctx.textAlign = 'left';
}
function updateStoryInteract() {
  if (talk.open || shop.open) return;
  if (!edge.use) return;
  if (stage.active && stage.grace && gameTime < stage.grace) return;
  if (player.carry) { const n = nearNPC(); if (n && n.acceptsPackage) { n.acceptsPackage(player.carry); packages.splice(packages.indexOf(player.carry), 1); player.carry = null; return; } }
  const sc = nearScan(); if (sc) { sfx('scan'); sc.done = true; sc.seq = (stage.seq = (stage.seq || 0) + 1); spawn({ k: 'flash', x: sc.x, y: sc.y - 40, life: 0.3, t: 0, c: [242, 181, 68] }); banner('Scanned ' + sc.sku, 1.2); return; }
  const pk = nearPackage(); if (pk && !player.carry) { pk.carried = true; player.carry = pk; }
}
function drawCrewHUD() {
  packUI.rects.length = 0;
  const members = crewAll(); const sz = 34, gap = 6; const n = CREW_MAX; const total = n * sz + (n - 1) * gap; let x = W / 2 - total / 2; const y = H - 52;
  ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, x - 8, y - 6, total + 16, sz + 12, 10); ctx.fill();
  for (let i = 0; i < n; i++) {
    const m = members[i];
    if (!m) { ctx.strokeStyle = 'rgba(246,236,216,.2)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; rr(ctx, x, y, sz, sz, 7); ctx.stroke(); ctx.setLineDash([]); x += sz + gap; continue; }
    const ch = m.hero || hero, isLeader = i === 0;
    ctx.save(); rr(ctx, x, y, sz, sz, 7); ctx.clip(); ctx.drawImage(portraitFor(ch), x, y, sz, sz); ctx.restore();
    ctx.strokeStyle = isLeader ? '#f2b544' : 'rgba(246,236,216,.3)'; ctx.lineWidth = isLeader ? 2.5 : 1; rr(ctx, x, y, sz, sz, 7); ctx.stroke();
    ctx.fillStyle = rgb(weaponOf(ch).color); ctx.beginPath(); ctx.arc(x + sz - 5, y + 5, 3, 0, Math.PI * 2); ctx.fill();
    const lv = skillOf(ch); if (lv) { ctx.fillStyle = 'rgba(16,26,46,.85)'; rr(ctx, x - 3, y + sz - 12, 22, 12, 4); ctx.fill(); ctx.fillStyle = '#7fe0a0'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'left'; ctx.fillText('L' + lv, x + 1, y + sz - 3); }
    if (!isLeader) packUI.rects.push({ x, y, w: sz, h: sz, i: i - 1 });
    x += sz + gap;
  }
  if (crew.length) { ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = 'rgba(246,236,216,.55)'; ctx.textAlign = 'center'; ctx.fillText('tap a portrait or press C to take point', W / 2, H - 6); }
  if (packUI.banner > 0) { const a = Math.min(1, packUI.banner); ctx.textAlign = 'center'; ctx.font = 'bold 18px Georgia, serif'; ctx.fillStyle = rgba([242, 181, 68], a); ctx.fillText(packUI.bannerText, W / 2, 186); }
  drawGuide();
  const o = currentObjective(); if (o) { ctx.textAlign = 'left'; ctx.font = 'bold 12px system-ui, sans-serif'; const tw = ctx.measureText(o.text).width; const pulse = quest.flash > 0 ? 0.6 + 0.4 * Math.sin(gameTime * 12) : 1; ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, 14, 48, tw + 34, 24, 8); ctx.fill(); ctx.fillStyle = rgba([242, 181, 68], pulse); ctx.beginPath(); ctx.arc(28, 60, 4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.fillText(o.text, 40, 64); }
  if (talk.open) {
    const boxW = Math.min(W - 80, 640), bx = W / 2 - boxW / 2, by = H - 190, bh = talk.options ? 108 : 84;
    ctx.fillStyle = 'rgba(16,26,46,.92)'; rr(ctx, bx, by, boxW, bh, 12); ctx.fill(); ctx.strokeStyle = 'rgba(242,181,68,.5)'; ctx.lineWidth = 1.5; rr(ctx, bx, by, boxW, bh, 12); ctx.stroke();
    const n = talk.npc; if (n) { ctx.save(); rr(ctx, bx + 12, by + 12, 64, 64, 10); ctx.clip(); ctx.drawImage(portraitFor(n.look), bx + 12, by + 12, 64, 64); const typing = talk.t * 40 < talk.text.length; if (typing && Math.floor(talk.t * 9) % 2) { ctx.fillStyle = '#3a1a1a'; ctx.beginPath(); ctx.ellipse(bx + 12 + 64 * 0.62, by + 12 + 64 * 0.45, 3.2, 2.2, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); ctx.fillStyle = 'rgba(242,181,68,.9)'; ctx.font = 'bold 9px system-ui, sans-serif'; ctx.textAlign = 'center'; const nm = (n.hero ? n.hero.name : n.look.name).toUpperCase(); rr(ctx, bx + 12, by + 70, 64, 12, 3); ctx.fill(); ctx.fillStyle = '#16223a'; ctx.fillText(nm, bx + 44, by + 79); ctx.textAlign = 'left'; }
    ctx.fillStyle = '#f6ecd8'; ctx.font = '13px system-ui, sans-serif'; ctx.textAlign = 'left';
    const shown = talk.text.slice(0, Math.ceil(talk.t * 40)); const words = shown.split(' '); let line = '', ly = by + 28; const maxW = boxW - 110;
    for (const wd of words) { const test = line + wd + ' '; if (ctx.measureText(test).width > maxW) { ctx.fillText(line, bx + 88, ly); line = wd + ' '; ly += 17; } else line = test; } ctx.fillText(line, bx + 88, ly);
    if (talk.options) { let ox = bx + 88; talk.options.forEach((o, i) => { ctx.font = 'bold 12px system-ui, sans-serif'; const w = ctx.measureText(o.label).width + 20; ctx.fillStyle = i === talk.sel ? 'rgba(242,181,68,.25)' : 'rgba(255,255,255,.06)'; rr(ctx, ox, by + bh - 34, w, 24, 6); ctx.fill(); ctx.strokeStyle = i === talk.sel ? '#f2b544' : 'rgba(246,236,216,.2)'; ctx.lineWidth = 1; rr(ctx, ox, by + bh - 34, w, 24, 6); ctx.stroke(); ctx.fillStyle = '#f6ecd8'; ctx.fillText(o.label, ox + 10, by + bh - 18); uiTaps.push({ x: ox - 4, y: by + bh - 40, w: w + 8, h: 36, fn: () => { talk.open = false; talk.justClosed = true; if (o.fn) o.fn(); } }); ox += w + 8; }); }
    else { ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = 'rgba(246,236,216,.5)'; ctx.textAlign = 'right'; ctx.fillText('tap or E to continue', bx + boxW - 12, by + bh - 8); uiTaps.push({ x: bx, y: by, w: boxW, h: bh, fn: () => { if (talk.t > 0.2) { talk.open = false; talk.justClosed = true; } } }); }
  }
  ctx.textAlign = 'left';
}
