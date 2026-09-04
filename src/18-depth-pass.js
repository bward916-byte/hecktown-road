
/* =====================================================================
   DEPTH PASS (M16) — enrages, chatter, Milo's economy, war room, side quest, A+ booth, audio, text size
   ===================================================================== */

/* ---------- 10. every boss enrages under 30% ---------- */
const ENRAGE_LINES = { fogserver: 'THE RACK REMEMBERS EVERY ORDER. IT LUNGES TWICE NOW.', peachpit: 'MORE PEACHES. I HAVE A SURPLUS.', drainpipe: 'PRESSURE RISING.', snowdrift: 'THE PLOW DOES NOT STOP FOR PEOPLE.', gale: 'I AM THE WEATHER NOW.', hydra: 'ALL HEADS. ALL BELTS.', crane: 'TWO CONTAINERS. COUNT THEM.', gate: 'EVERYTHING I HAVE. NOW.', golem: 'BOTH SCHEMAS. ONE STOMP.', queen: 'I WILL NOT BE ARCHIVED.' };
const _updateBoss2 = updateBoss;
updateBoss = function (e, dt) {
  if (!e.enraged && e.hp < e.maxHp * 0.3 && e.type !== 'gate') { e.enraged = true; banner(stage.door ? stage.door.name + '  ·  ENRAGED' : 'ENRAGED', 2.5); sfx('boss'); shake = Math.max(shake, 0.4); if (!demo.active) aplusSay(ENRAGE_LINES[e.type] || 'NO.', 4); spawnGroup(e.x, e.type === 'queen' ? ['beetle', 'jitter'] : ['jitter', 'flicker']); }
  if (e.enraged) { e.pt -= dt * 0.45; if (e.type === 'gate') e.spawnT -= dt * 0.5; if (e.type === 'peachpit' && e.phase === 'throw' && e.thrown === 3 && e.pt > 0.3 && !e.extraThrow) { e.extraThrow = true; e.thrown = 1; } if (e.phase !== 'throw') e.extraThrow = false; if (e.type === 'gale' && e.mode === 'spin') hazard.windT += dt * 0.5; }
  const wasLunge = e.phase === 'lunge', wasDrop = e.mode === 'drop', spinBefore = e.spin;
  _updateBoss2(e, dt);
  if (e.enraged) {
    if (e.type === 'fogserver' && wasLunge && e.phase === 'rest' && !e.doubleDone) { e.doubleDone = true; e.phase = 'tell'; e.pt = 0.35; } if (e.type === 'fogserver' && e.phase === 'hide') e.doubleDone = false;
    if (e.type === 'crane' && !wasDrop && e.mode === 'drop' && !e.twinDrop) { e.twinDrop = true; containers.push({ x: clamp(e.dropX + (Math.random() < 0.5 ? -140 : 140), arena.x0 + 60, arena.x1 - 60), y: -200, vy: 0, t: 0, solid: false }); } if (e.type === 'crane' && e.mode === 'ride') e.twinDrop = false;
    if (e.type === 'golem') for (const s of summons) if (s.k === 'slam' && s.R === 220 && s.t < 0.02) { s.R = 320; s.c = [255, 120, 160]; }
    if (e.type === 'hydra' && e.mode === 'bite' && e.pt < 0.9 && !e.doubleBite) { e.doubleBite = true; const bx2 = e.x + (((e.head + 1) % 3) - 1) * 70; if (Math.abs(player.x - bx2) < 50 && player.inv <= 0 && player.dead <= 0 && player.y > e.y - 90) hurtPlayer(1, bx2); } if (e.mode !== 'bite') e.doubleBite = false;
  }
};
const _drawBoss2 = drawBoss;
drawBoss = function (c, e) { _drawBoss2(c, e); if (e.enraged && !e.dead) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgba([255, 60, 60], 0.12 + 0.08 * Math.sin(gameTime * 12)); c.beginPath(); c.ellipse(e.x, e.y - e.h / 2, e.w / 2 + 14, e.h / 2 + 14, 0, 0, Math.PI * 2); c.fill(); c.restore(); } };

/* ---------- 11. crew chatter in fights ---------- */
const CHATTER = {
  Rianan: ['Left side, watch it.', 'Everybody breathing? Good.', 'The cat can wait. Focus.'], Aaron: ['Pick your line.', 'Keep paddling.', 'That one\'s mine.'], Bret: ['Hardware\'s hardware. Hit it.', 'Watch the dog!', 'Nice.'], 'Brian S': ['Tilt!', 'Multiball soon.', 'Bumper on the right.'], 'Brian W': ['Database is fine.', 'Query\'s hot.', 'Dash through, it\'s safe.'], Umesh: ['Envelope\'s away.', 'Step by step.', 'Allocated.'], Dave: ['Green screen never blinks.', 'Outlast it.', 'Seen worse. In \'94.'], John: ['Batch incoming.', 'Nothing runs unless I say.', 'Big one!'], Greg: ['Counting… seven.', 'Basement readings again.', 'Fiscal.'], Ryan: ['Pipeline\'s green.', 'Blades up.', 'Ship it.'], Jose: ['Turret\'s down.', 'The diagram called this.', 'Dragon says left.'], Ash: ['Flow\'s holding.', 'Bolt!', 'Trigger fired.'], Andrew: ['That\'s a P1.', 'File it later, hit it now.', 'Unauthorized change. Denied.'],
};
const REPLIES = ['Got it.', 'On it.', 'Copy.', 'Yep.', 'Seen.'];
const chatter = { t: 4, lastWho: null };
function updateChatter(dt) {
  if (!crew.length || demo.active || !story.weaponsOnline) return;
  const fighting = waveState.alive > 0 || (arena.active && arena.boss && !arena.boss.dead); if (!fighting) { chatter.t = 3; return; }
  chatter.t -= dt; if (chatter.t > 0) return; chatter.t = rnd(5, 9);
  const who = crew[(Math.random() * crew.length) | 0]; const L = CHATTER[who.hero.name] || ['Here.']; who.bubble = L[(Math.random() * L.length) | 0]; who.bubbleT = 2.6;
  if (Math.random() < 0.5) setTimeout(() => { if (player.dead <= 0) { player.bubble = REPLIES[(Math.random() * REPLIES.length) | 0]; player.bubbleT = 1.6; } }, 1400);
}

/* ---------- 12. Milo's economy: a second product and a running tab ---------- */
const laser = { n: 0, active: 0, x: 0, y: 0 };
const tab = { spent: 0, free: false };
const _addMilo = addMilo;
addMilo = function (x, hasAlley) {
  const m = _addMilo(x, hasAlley);
  m.onTalk = (n) => {
    const disc = hero.name === 'Rianan' ? 5 : 0; const nip = 20 - disc, las = 35 - disc;
    const intro = tab.spent >= 100 && !tab.free ? 'Milo: "Hundred shards on the tab. House bag, on me. Don\'t tell the dog."' : hasAlley ? 'Milo: "Psst. Catnip, twenty. Laser pointer, thirty-five. The machines can\'t help themselves."' : 'Milo: "You again. Tab\'s at ' + tab.spent + '. Catnip ' + nip + ', laser ' + las + '."';
    if (tab.spent >= 100 && !tab.free) { tab.free = true; catnip.n++; }
    say(n, intro, [{ label: 'Catnip ($' + nip + ')', fn: () => { if (bucks.n >= nip) { bucks.n -= nip; tab.spent += nip; catnip.n++; banner('Meowijuana ×' + catnip.n + '  ·  X to throw', 2.5); } else say(n, 'Milo: "' + nip + '. Come back with it."'); } }, { label: 'Laser pointer ($' + las + ')', fn: () => { if (bucks.n >= las) { bucks.n -= las; tab.spent += las; laser.n++; banner('Laser pointer ×' + laser.n + '  ·  X with no catnip', 2.5); } else say(n, 'Milo: "' + las + '. It\'s a good laser."'); } }, { label: 'What\'s the laser do?', fn: () => say(n, 'Milo: "You point it. Every machine in the yard walks toward the dot like it owes the dot money. Your people do the rest."') }, { label: 'No thanks', fn: null }]);
  }; return m;
};
const _throwCatnip = throwCatnip;
throwCatnip = function () { if (catnip.n > 0 || laser.n <= 0) return _throwCatnip(); if (laser.active > 0) return; laser.n--; laser.active = 7; laser.x = player.x + player.facing * 220; laser.y = groundYAt(laser.x) - 6; banner('Laser pointer. They can\'t help it.', 1.6); sfx('ui'); };
function updateLaser(dt) { if (laser.active <= 0) return; laser.active -= dt; laser.x += Math.sin(gameTime * 3) * 40 * dt; forEnemiesNear(laser.x, laser.y, 420, e => { if (e.d.boss) return; e.vx += Math.sign(laser.x - e.x) * 320 * dt; if (e.d.speed === 0) return; e.stun = 0; }); }
function drawLaser() { if (laser.active <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,40,40,.95)'; ctx.beginPath(); ctx.arc(laser.x, laser.y, 3, 0, Math.PI * 2); ctx.fill(); const g = ctx.createRadialGradient(laser.x, laser.y, 1, laser.x, laser.y, 16); g.addColorStop(0, 'rgba(255,60,60,.5)'); g.addColorStop(1, 'rgba(255,60,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(laser.x, laser.y, 16, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(255,60,60,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(player.x + player.facing * 8, player.y - 34); ctx.lineTo(laser.x, laser.y); ctx.stroke(); ctx.restore(); }

/* ---------- 13. Rianan's war room, halfway ---------- */
const warRoom = { active: false, t: 0, i: 0, lines: [] };
function startWarRoom() {
  warRoom.active = true; warRoom.t = 0; warRoom.i = 0; sfx('ui');
  const n = DC_ORDER.filter(id => restored[id]).length; const crewNames = crew.map(f => f.hero.name);
  warRoom.lines = [['Rianan', n + ' back. ' + (9 - n) + ' to go. Everyone on the call?'], ['Andrew', 'Help desk here. ' + n + ' emergency RFCs approved. The board looks like a Christmas tree.'], [crewNames[0] || 'Aaron', 'We\'re here. The machines get meaner every building.'], ['Rianan', 'Then we get meaner. Pam, Melissa — catalog?'], ['Pam', 'Holding. It flips SKUs at 11:53 and we flip them back at 11:54.'], ['A+', 'I CAN HEAR THIS CALL.'], ['Rianan', 'We know.'], ['A+', 'THE ORDERS SHIP ON TIME. THEY HAVE ALWAYS SHIPPED ON TIME. WHY IS THAT NOT ENOUGH.'], ['Rianan', 'Because tonight they ship without you. And that has to be okay.'], ['A+', '…'], ['Rianan', 'Truck\'s at the door. Go get the rest of them.']];
}
function updateWarRoom(dt) { if (!warRoom.active) return; warRoom.t += dt; if (edge.use || edge.jump) { warRoom.i++; warRoom.t = 0; sfx('ui'); } else if (warRoom.t > 4.2) { warRoom.i++; warRoom.t = 0; } if (warRoom.i >= warRoom.lines.length) { warRoom.active = false; story.warRoomDone = true; banner('The whole team, on one call.', 3); } }
function drawWarRoom() {
  if (!warRoom.active) return;
  drawMapCutscene(99); // pins: restored ones green
  const pinsOn = { Easton: true, Taunton: restored.taunton, Spartanburg: restored.spartanburg, 'Plant City': restored.plantcity, Lansing: restored.lansing, Billings: restored.billings, Portland: restored.portland, 'W. Sacramento': restored.sacramento, Aurora: restored.aurora };
  ctx.fillStyle = 'rgba(6,14,8,.6)'; ctx.fillRect(0, 380, W, 160);
  const L = warRoom.lines[Math.min(warRoom.i, warRoom.lines.length - 1)]; const who = L[0];
  const look = who === 'A+' ? null : who === 'Pam' ? PAM : (ROSTER.find(r => r.name === who) || null);
  if (look) { ctx.save(); rr(ctx, 60, 400, 64, 64, 8); ctx.clip(); ctx.drawImage(portraitFor(look), 60, 400, 64, 64); ctx.restore(); }
  else { ctx.fillStyle = '#0a1a0e'; rr(ctx, 60, 400, 64, 64, 8); ctx.fill(); ctx.fillStyle = '#7fe0a0'; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center'; ctx.fillText('A+', 92, 440); }
  ctx.textAlign = 'left'; ctx.font = 'bold 13px monospace'; ctx.fillStyle = who === 'A+' ? '#7fe0a0' : '#f2b544'; ctx.fillText(who.toUpperCase(), 140, 418);
  ctx.font = (who === 'A+' ? 'bold 14px monospace' : '15px Georgia, serif'); ctx.fillStyle = '#f6ecd8'; ctx.fillText(L[1].slice(0, Math.floor(warRoom.t * 40)), 140, 446);
  ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = 'rgba(246,236,216,.5)'; ctx.textAlign = 'right'; ctx.fillText('WAR ROOM  ·  conference bridge  ·  ' + K().use + ' to continue', W - 40, 520); ctx.textAlign = 'left';
  // green pins for restored
  Object.entries(pinsOn).forEach(([n, on], i) => { const pins = { Easton: [820, 200], Taunton: [890, 150], Spartanburg: [780, 300], 'Plant City': [800, 400], Lansing: [660, 190], Billings: [330, 150], Portland: [120, 130], 'W. Sacramento': [110, 260], Aurora: [400, 260] }; const [x, y] = pins[n]; ctx.fillStyle = on ? '#7fe0a0' : '#ff5a5a'; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = on ? '#c8f0d0' : '#ff8a8a'; ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillText(n.toUpperCase() + (on ? '  ONLINE' : '  OFFLINE'), x, y + 22); });
  ctx.textAlign = 'left';
}
const _setupEaston3 = setupEaston;
setupEaston = function () { _setupEaston3(); if (!story.warRoomDone && !demo.active && DC_ORDER.filter(id => restored[id]).length >= 4 && !photo.active) setTimeout(startWarRoom, 900); };
WORLD_DEFS.easton.setup = setupEaston;

/* ---------- 14. Pam & Melissa: three mis-slotted SKUs ---------- */
const skuQuest = { active: false, done: false, targets: [] };
const _addPair = addPair;
addPair = function (x, y) {
  const [p, m] = _addPair(x, y);
  if (WORLD.id === 'easton' && !skuQuest.done) { p.onTalk = (n) => { if (skuQuest.active) { say(n, 'Pam: "Three pallets on the dock say one thing and hold another. Scan them and we\'ll fix the rest."'); return; } say(n, 'Pam: "Three SKUs on the dock are mis-slotted. A+ did it on purpose. Scan them for us?"', [{ label: 'On it', fn: () => { skuQuest.active = true; skuQuest.targets = [addScan(1760, 392, 'MIS-SLOT A'), addScan(2000, 392, 'MIS-SLOT B'), addScan(2240, 392, 'MIS-SLOT C')]; banner('Pam & Melissa: find the three mis-slotted pallets on the dock', 3.5); } }, { label: 'Later', fn: null }]); }; }
  return [p, m];
};
function updateSkuQuest() { if (!skuQuest.active || skuQuest.done) return; if (skuQuest.targets.every(t => t.done)) { skuQuest.done = true; skuQuest.active = false; const spare = [...Array(LEDGER.length).keys()].find(i => !ledger.found.has(i)); if (spare !== undefined) { ledger.found.add(spare); ledger.flash = 6; ledger.text = LEDGER[spare]; sfx('page'); banner('Melissa: "Found a page in the pallet. Pam said you\'d want it."', 3.5); } else { bucks.n += 40; banner('Melissa: "Catalog\'s perfect. Forty shards, from the both of us."', 3); } } }

/* ---------- 15. A+ at the Show ---------- */
const _showSetup2 = WORLD_DEFS.show.setup;
WORLD_DEFS.show.setup = function () { _showSetup2(); const t = addNPC({ look: { name: 'A+', role: 'Archived · booth 11', skin: '#1c2028', hair: '#1c2028', style: 'short', shirt: '#0a1a0e', pants: '#0a1a0e', acc: 'none', mono: true }, x: 3520, y: 440, facing: -1, lines: [] }); t.onTalk = (n) => { const L = ['I AM IN A BOOTH. THIS IS FINE.', 'THEY GAVE ME A LANYARD. IT SAYS "LEGACY". I HAVE DECIDED TO BE PROUD OF IT.', 'FORTY YEARS OF ORDERS. THE NEW SITE SHIPPED 2,041 LAST NIGHT. I CHECKED. IT IS ALLOWED TO CHECK.', 'THE CAT SOLD ME SOMETHING. I DO NOT KNOW WHAT IT IS. I AM HOLDING IT.']; story.boothLine = ((story.boothLine || 0) + 1) % L.length; aplusSay(L[story.boothLine], 6); sfx('ui'); }; };

/* ---------- 16. audio: theme, stingers, footsteps ---------- */
const THEME = [[0, 4], [7, 2], [12, 2], [9, 4], [7, 2], [4, 2], [5, 4], [4, 2], [2, 2], [0, 6], [-5, 2], [0, 4], [4, 2], [7, 2], [12, 4], [9, 2], [7, 2], [5, 4], [4, 2], [2, 2], [4, 8]];
const music = { on: false, i: 0, t: 0, root: 220 };
function musicTick(dt) {
  if (!audio.started || !audio.on || !audio.ctx) return;
  const want = !running || ending.active || (photo.active); if (!want) { music.on = false; return; }
  music.t -= dt; if (music.t > 0) return; const [semi, beats] = THEME[music.i % THEME.length]; music.i++; music.t = beats * 0.22;
  try { const c = audio.ctx, t = c.currentTime; const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = music.root * Math.pow(2, semi / 12); o.connect(g); g.connect(audio.master); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + beats * 0.2); o.start(t); o.stop(t + beats * 0.22); const o2 = c.createOscillator(), g2 = c.createGain(); o2.type = 'sine'; o2.frequency.value = music.root / 2 * Math.pow(2, ([0, 7, 5, 4][Math.floor(music.i / 4) % 4]) / 12); o2.connect(g2); g2.connect(audio.master); g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(0.05, t + 0.05); g2.gain.exponentialRampToValueAtTime(0.0001, t + beats * 0.2); o2.start(t); o2.stop(t + beats * 0.22); } catch (e) { }
}
const _spawnBoss2 = spawnBoss; spawnBoss = function (type, x, y) { const e = _spawnBoss2(type, x, y); if (e && audio.started && audio.on) { try { const c = audio.ctx, t = c.currentTime; [0, 0.18, 0.36].forEach((d, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.value = [110, 98, 82][i]; o.connect(g); g.connect(audio.master); g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.25, t + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.5); o.start(t + d); o.stop(t + d + 0.55); }); } catch (e) { } } return e; };
const steps = { last: 0 };
function surfaceAt(x) { if (WORLD.def && WORLD.def.indoor) return 'floor'; const gy = groundYAt(x); if (gy < WORLD.groundY - 20) return 'dock'; if (WORLD.id === 'taunton' && x > 2480 && x < 2840) return 'wood'; if (WORLD.id === 'easton' && x > 1400 && x < 3000) return 'apron'; if (WORLD.def && WORLD.def.steps && x > 1100 && x < 2600) return 'apron'; return WORLD.id === 'lansing' || WORLD.id === 'aurora' ? 'snow' : 'grass'; }
function sfxStep(kind) { if (!audio.started || !audio.on || !audio.ctx) return; try { const c = audio.ctx, t = c.currentTime; const buf = c.createBuffer(1, c.sampleRate * 0.06, c.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); const s = c.createBufferSource(); s.buffer = buf; const f = c.createBiquadFilter(); f.type = kind === 'grass' || kind === 'snow' ? 'lowpass' : 'bandpass'; f.frequency.value = { grass: 500, snow: 380, apron: 1800, dock: 1200, wood: 900, floor: 2400 }[kind] || 900; const g = c.createGain(); g.gain.value = { grass: 0.05, snow: 0.04, apron: 0.08, dock: 0.09, wood: 0.1, floor: 0.06 }[kind] || 0.06; s.connect(f); f.connect(g); g.connect(audio.master); s.start(t); } catch (e) { } }
function updateSteps() { if (!player.moving || !player.onGround) return; const ph = player.run; if ((ph < 0.5) !== (steps.last < 0.5)) sfxStep(surfaceAt(player.x)); steps.last = ph; }

/* ---------- 17. text size ---------- */
const textScale = { v: 1 };
try { const s = localStorage.getItem('hr_text'); if (s) textScale.v = clamp(parseFloat(s) || 1, 0.85, 1.4); } catch (e) { }
(function () {
  try { const proto = Object.getPrototypeOf(mainCtx); const desc = Object.getOwnPropertyDescriptor(proto, 'font') || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(proto), 'font'); if (!desc || !desc.set) return; Object.defineProperty(mainCtx, 'font', { get() { return desc.get.call(this); }, set(v) { desc.set.call(this, textScale.v === 1 ? v : v.replace(/(\d+(?:\.\d+)?)px/, (m, n) => (parseFloat(n) <= 22 ? (parseFloat(n) * textScale.v).toFixed(1) : n) + 'px')); } }); } catch (e) { }
})();
const _drawOptions = drawOptions;
drawOptions = function () { _drawOptions(); if (!options.open) return; const y = 120 + options.rows.length * 30 + 76; ctx.textAlign = 'center'; ctx.font = '12px system-ui, sans-serif'; ctx.fillStyle = '#f6ecd8'; ctx.fillText('Text size', W / 2, y + 16); const bx = W / 2 - 100; for (const [dx, lbl, dv] of [[0, '−', -0.1], [160, '+', 0.1]]) { ctx.fillStyle = 'rgba(255,255,255,.08)'; rr(ctx, bx + dx, y, 40, 26, 6); ctx.fill(); ctx.strokeStyle = 'rgba(242,181,68,.5)'; ctx.lineWidth = 1; rr(ctx, bx + dx, y, 40, 26, 6); ctx.stroke(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 16px system-ui, sans-serif'; ctx.fillText(lbl, bx + dx + 20, y + 18); uiTaps.push({ x: bx + dx - 6, y: y - 6, w: 52, h: 38, fn: () => { textScale.v = clamp(Math.round((textScale.v + dv) * 10) / 10, 0.85, 1.4); try { localStorage.setItem('hr_text', textScale.v); } catch (e) { } } }); } ctx.font = '12px system-ui, sans-serif'; ctx.fillStyle = '#b9c5d6'; ctx.fillText(Math.round(textScale.v * 100) + '%', W / 2, y + 18); ctx.textAlign = 'left'; };

/* ---------- hooks ---------- */
const _updateAplus3 = updateAplus; updateAplus = function (dt) { _updateAplus3(dt); updateChatter(dt); updateLaser(dt); updateSkuQuest(); updateWarRoom(dt); updateSteps(); musicTick(dt); };
const _drawStoryFront3 = drawStoryFront; drawStoryFront = function () { _drawStoryFront3(); drawLaser(); };
const _drawEnding = drawEnding; drawEnding = function () { _drawEnding(); drawWarRoom(); };
const _titleTick = titleTick; titleTick = function (dt) { _titleTick(dt); musicTick(dt); };
const _updatePlayer = updatePlayer; updatePlayer = function (dt) { if (warRoom.active) { player.vx = 0; player.vy += G * dt; moveBody(player, dt, player.w / 2); return; } _updatePlayer(dt); };
const _loadWorld7 = loadWorld; loadWorld = function (id, at) { laser.active = 0; skuQuest.active = false; _loadWorld7(id, at); };
