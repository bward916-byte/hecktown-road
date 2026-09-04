
/* =====================================================================
   SAVE, UNLOCKS, VIGNETTES, PHOTO, OPTIONS (M12)
   ===================================================================== */

/* ---------- key binding + input device tracking ---------- */
const DEFAULT_BINDS = { left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'], jump: ['Space', 'ArrowUp', 'KeyW'], dash: ['ShiftLeft', 'ShiftRight', 'KeyK'], use: ['KeyE', 'Enter'], swap: ['KeyC', 'Tab'], nip: ['KeyX'], sup: ['KeyV'], weather: ['KeyQ'], time: ['KeyT'], mute: ['KeyM'], options: ['Escape', 'KeyO'] };
const binds = JSON.parse(JSON.stringify(DEFAULT_BINDS));
const input = { device: 'keyboard', gpName: '' };
try { const s = localStorage.getItem('hr_binds'); if (s) Object.assign(binds, JSON.parse(s)); } catch (e) { }
function saveBinds() { try { localStorage.setItem('hr_binds', JSON.stringify(binds)); } catch (e) { } }
function pressed(action) { for (const k of binds[action] || []) if (keys[k]) return 1; return 0; }
function keyLabel(code) { const arrows = { ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓' }; if (arrows[code]) return arrows[code]; return code.replace('Key', '').replace('ShiftLeft', 'SHIFT').replace('ShiftRight', 'R-SHIFT').replace('Space', 'SPACE').replace('Enter', 'ENTER').replace('Escape', 'ESC').replace('Tab', 'TAB').toUpperCase(); }
const GP_LABELS = { jump: 'A', dash: 'X', use: 'Y', swap: 'RB', nip: 'LB', sup: 'LT', left: 'stick / D-pad', right: 'stick / D-pad' };
// swap in the remappable input reader
syncInput = function () {
  let gp = null; if (!syncInput.noGp) { try { gp = (navigator.getGamepads && navigator.getGamepads()[0]) || null; } catch (e) { syncInput.noGp = true; } }
  let gx = 0, gjump = 0, gdash = 0, guse = 0, gswap = 0, gnip = 0, gsup = 0;
  if (gp) { gx = Math.abs(gp.axes[0]) > 0.2 ? gp.axes[0] : 0; if (gp.buttons[14] && gp.buttons[14].pressed) gx = -1; if (gp.buttons[15] && gp.buttons[15].pressed) gx = 1; const b = i => gp.buttons[i] && gp.buttons[i].pressed ? 1 : 0; gjump = b(0); gdash = b(2) || b(1); guse = b(3); gswap = b(5); gnip = b(4); gsup = b(6); if (gx || gjump || gdash || guse) { input.device = 'gamepad'; input.gpName = gp.id.slice(0, 24); } }
  const anyKey = Object.keys(keys).some(k => keys[k]); if (anyKey) input.device = 'keyboard';
  tk.left = (pressed('left') || touch.dx < -0.25 || gx < -0.25) ? 1 : 0;
  tk.right = (pressed('right') || touch.dx > 0.25 || gx > 0.25) ? 1 : 0;
  tk.jump = (pressed('jump') || touch.btn.jump || gjump) ? 1 : 0;
  tk.dash = (pressed('dash') || touch.btn.dash || gdash) ? 1 : 0;
  tk.weather = (pressed('weather') || touch.btn.weather) ? 1 : 0;
  tk.time = (pressed('time') || touch.btn.time) ? 1 : 0;
  tk.use = (pressed('use') || touch.btn.use || guse) ? 1 : 0;
  tk.swap = (pressed('swap') || gswap) ? 1 : 0;
  tk.nip = (pressed('nip') || touch.btn.nip || gnip) ? 1 : 0;
  tk.sup = (pressed('sup') || touch.btn.sup || gsup) ? 1 : 0;
  for (const k in edge) { edge[k] = tk[k] && !prev[k] ? 1 : 0; prev[k] = tk[k]; }
};
// prompts follow the device
K = function () { const tc = input.device === 'touch' || touch.used && input.device !== 'gamepad' && input.device !== 'keyboard'; const g = input.device === 'gamepad'; const kb = a => keyLabel(binds[a][0]); return { move: tc ? 'drag the left side of the screen' : g ? 'left stick' : kb('left') + ' / ' + kb('right'), jump: tc ? 'JUMP button' : g ? GP_LABELS.jump : kb('jump'), dash: tc ? 'DASH button' : g ? GP_LABELS.dash : kb('dash'), use: tc ? 'USE button' : g ? GP_LABELS.use : kb('use'), nip: tc ? 'NIP button' : g ? GP_LABELS.nip : kb('nip'), swap: tc ? 'tap a portrait' : g ? GP_LABELS.swap : kb('swap'), sup: tc ? 'SUPER button' : g ? GP_LABELS.sup : kb('sup') }; };
canvas.addEventListener('touchstart', () => { input.device = 'touch'; }, { passive: true });

/* ---------- options overlay (Esc / O): rebind keys ---------- */
const options = { open: false, sel: 0, listening: false, rows: ['left', 'right', 'jump', 'dash', 'use', 'swap', 'sup', 'nip', 'weather', 'time', 'mute'] };
window.addEventListener('keydown', e => {
  if (options.listening) { e.preventDefault(); const a = options.rows[options.sel]; binds[a] = [e.code].concat(DEFAULT_BINDS[a].filter(k => k !== e.code)); options.listening = false; saveBinds(); sfx('ui'); return; }
  if ((binds.options || []).includes(e.code) && running && !demo.active) { options.open = !options.open; sfx('ui'); e.preventDefault(); }
});
function updateOptions() {
  if (!options.open) return;
  if (edge.jump && !options.listening) { options.listening = true; }
  if (tk.left && !options.lh) options.sel = (options.sel + options.rows.length - 1) % options.rows.length; options.lh = tk.left;
  if (tk.right && !options.rh) options.sel = (options.sel + 1) % options.rows.length; options.rh = tk.right;
}
function drawOptions() {
  if (!options.open) return;
  ctx.fillStyle = 'rgba(16,26,46,.85)'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.font = 'bold 26px Georgia, serif'; ctx.fillStyle = '#f2b544'; ctx.fillText('OPTIONS', W / 2, 70);
  ctx.font = '12px system-ui, sans-serif'; ctx.fillStyle = '#b9c5d6'; ctx.fillText('Keyboard: tap a row, then press the new key   ·   ' + (input.gpName ? 'Gamepad: ' + input.gpName : 'No gamepad detected') + '   ·   ' + keyLabel(binds.options[0]) + ' closes', W / 2, 94);
  drawCloseButton(() => { options.open = false; options.listening = false; });
  const x0 = W / 2 - 300, y0 = 120, rh = 30;
  options.rows.forEach((a, i) => { const y = y0 + i * rh; const sel = i === options.sel; ctx.fillStyle = sel ? 'rgba(242,181,68,.16)' : 'rgba(255,255,255,.04)'; rr(ctx, x0, y, 600, rh - 4, 6); ctx.fill(); ctx.textAlign = 'left'; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.fillStyle = '#f6ecd8'; ctx.fillText(a.toUpperCase(), x0 + 14, y + 18); ctx.textAlign = 'right'; ctx.fillStyle = sel && options.listening ? '#7fe0a0' : '#f2b544'; ctx.fillText(sel && options.listening ? 'press a key…' : binds[a].map(keyLabel).join('  /  ') + (GP_LABELS[a] ? '     🎮 ' + GP_LABELS[a] : ''), x0 + 586, y + 18); uiTaps.push({ x: x0, y, w: 600, h: rh - 4, fn: () => { options.sel = i; options.listening = true; } }); });
  ctx.textAlign = 'center'; ctx.font = '11px system-ui, sans-serif'; ctx.fillStyle = 'rgba(246,236,216,.6)'; ctx.fillText('Low graphics: ' + (perf.low ? 'ON' : 'off') + ' (auto when the phone struggles)  ·  tap to toggle', W / 2, y0 + options.rows.length * rh + 22);
  uiTaps.push({ x: W / 2 - 200, y: y0 + options.rows.length * rh + 6, w: 400, h: 24, fn: () => { perf.low = !perf.low; perf.manual = true; } });
  uiTaps.push({ x: W / 2 - 120, y: y0 + options.rows.length * rh + 40, w: 240, h: 26, fn: () => { Object.assign(binds, JSON.parse(JSON.stringify(DEFAULT_BINDS))); saveBinds(); } });
  ctx.fillStyle = 'rgba(255,255,255,.06)'; rr(ctx, W / 2 - 120, y0 + options.rows.length * rh + 40, 240, 26, 6); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.fillText('Reset to defaults', W / 2, y0 + options.rows.length * rh + 58);
  ctx.textAlign = 'left';
}

/* ---------- performance guard ---------- */
const perf = { low: false, manual: false, acc: 0, n: 0, told: false };
function perfTick(dt) { if (perf.manual) return; perf.acc += dt; perf.n++; if (perf.n >= 90) { const avg = perf.acc / perf.n; perf.acc = 0; perf.n = 0; if (!perf.low && avg > 0.021) { perf.low = true; if (!perf.told) { perf.told = true; banner('Low graphics on (this device was dropping frames)', 3); } } else if (perf.low && avg < 0.014) perf.low = false; } }

/* ---------- save / continue ---------- */
const SAVE_KEY = 'hr_save_v1';
function saveGame() {
  if (demo.active || WORLD.id === 'prologue' || WORLD.id === 'past' || !story.turnDone) return;
  try { const s = { hero: hero.name, world: WORLD.id, x: Math.round(player.x), crew: crew.map(f => f.hero.name), skill: SKILL, met: [...story.met], story: { turnDone: story.turnDone, weaponsOnline: story.weaponsOnline, cutoverKey: story.cutoverKey, ending: story.ending, gregIntro: story.gregIntro, visited: story.visited || {}, vig: [...(story.vig || [])] }, restored, bucks: bucks.n, catnip: catnip.n, ledger: [...ledger.found], hour, t: Date.now() }; localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { }
}
function loadSaveData() { try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
function continueGame() {
  const s = loadSaveData(); if (!s) return false;
  const idx = ROSTER.findIndex(r => r.name === s.hero); startGame(Math.max(0, idx), true);
  for (const k in s.skill) SKILL[k] = s.skill[k]; for (const n of s.met) story.met.add(n); Object.assign(story, s.story); story.vig = new Set(s.story.vig || []); for (const k in s.restored) restored[k] = s.restored[k];
  bucks.n = s.bucks || 0; catnip.n = s.catnip || 0; for (const n of s.ledger || []) ledger.found.add(n);
  crew.length = 0; loadWorld(s.world || 'easton', { x: s.x || 300, y: 440 }); hour = s.hour || hour;
  for (const n of s.crew || []) { const ch = ROSTER.find(r => r.name === n); if (!ch) continue; const q = npcs.find(z => z.hero === ch); if (q) npcs.splice(npcs.indexOf(q), 1); crew.push({ hero: ch, x: player.x - 30 - crew.length * 24, y: player.y, vx: 0, vy: 0, w: 22, h: 52, facing: 1, onGround: true, wall: 0, run: 0, t: rnd(0, 5), moving: false, wcd: rnd(0, 0.5), state: 'idle', wander: 0 }); }
  restoredBanner.t = 3; restoredBanner.text = 'Welcome back  ·  ' + WORLD.name; return true;
}
(function titleContinue() {
  const s = loadSaveData(); const db = document.getElementById('demoBtn'); if (!s || !db) return;
  const b = document.createElement('button'); b.id = 'contBtn'; b.textContent = '▶ CONTINUE  ·  ' + s.hero + '  ·  ' + (WORLD_DEFS[s.world] ? WORLD_DEFS[s.world].name : s.world) + '  ·  ' + Object.keys(s.restored).filter(k => s.restored[k]).length + ' DCs restored';
  b.style.cssText = db.style.cssText; b.className = ''; b.setAttribute('style', 'margin:10px 8px 0 0;padding:8px 22px;font:bold 13px system-ui,-apple-system,sans-serif;letter-spacing:.12em;color:#16223a;background:#f2b544;border:1.5px solid #f2b544;border-radius:8px;cursor:pointer;');
  db.parentNode.insertBefore(b, db); b.addEventListener('click', () => continueGame());
})();
// autosave hooks
const _loadWorld3 = loadWorld; loadWorld = function (id, at) { _loadWorld3(id, at); saveGame(); };
const _onBossDead3 = onBossDead; onBossDead = function (e) { _onBossDead3(e); saveGame(); };
const _joinCrew2 = joinCrew; joinCrew = function (ch) { const ok = _joinCrew2(ch); if (ok) { saveGame(); scheduleVignette(ch); } return ok; };
const _updateBreakpoints = updateBreakpoints; updateBreakpoints = function () { const n = breakpoints.hit.size; _updateBreakpoints(); if (breakpoints.hit.size !== n) saveGame(); };

/* ---------- tier-3 weapon unlocks: the weapon changes, not just the numbers ---------- */
const T3 = { Aaron: 'darts ricochet to a second target', Umesh: 'envelopes burst on impact', John: 'bombs split into three', Dave: 'lines pierce everything', 'Brian W': 'chains jump three more times', 'Brian S': 'the lance splits to a second target', Jose: 'turrets fire twin shots', Ash: 'bolts fork twice', Greg: 'a third drone', Ryan: 'a third blade, wider', Bret: 'the slam leaves a stun field', Rianan: 'the field also heals' };
function tier3(sh) { return skillOf(sh.hero) >= 3; }
const _grantSkill = grantSkill;
grantSkill = function (kind) { const before = crewAll().map(m => skillOf(m.hero)); _grantSkill(kind); crewAll().forEach((m, i) => { if (before[i] < 3 && skillOf(m.hero) >= 3 && T3[m.hero.name]) banner(m.hero.name + ' L3  ·  ' + T3[m.hero.name], 3.5); }); };
// projectile behaviours at L3
const _updateProjs = updateProjs;
updateProjs = function (dt) {
  _updateProjs(dt);
  // ricochet darts / bursting envelopes are handled by tagging at fire time; here we apply per-hit effects recorded on the projectile
};
const _fireDart = fireDart;
fireDart = function (x, y, target, w, mul, spread) { _fireDart(x, y, target, w, mul, spread); const p = projs[projs.length - 1]; if (p && p.k === 'dart' && p.hero === 'Aaron' && SKILL.Aaron >= 3) { p.ricochet = 1; p.pierce = Math.max(p.pierce, 1); } if (p && p.k === 'dart' && p.hero === 'Jose' && SKILL.Jose >= 3 && !p.twin) { projs.push(Object.assign({}, p, { twin: 1, vy: p.vy - 40 })); } };
const _damageEnemy2 = damageEnemy;
damageEnemy = function (e, dmg, fromX, src) {
  const ok = _damageEnemy2(e, dmg, fromX, src);
  if (!ok) return ok;
  // find the projectile that just hit (last one within 12px) for ricochet / burst
  const hitter = projs.find(p => Math.abs(p.x - e.x) < e.w / 2 + 8 && p.y > e.y - e.h - 8 && p.y < e.y + 8 && !p.used);
  if (hitter) {
    if (hitter.ricochet && !hitter.bounced) { hitter.bounced = 1; const nx = nearestEnemy(e.x, e.y - e.h / 2, 220, q => q !== e); if (nx) { const dx = nx.x - hitter.x, dy = nx.y - nx.h / 2 - hitter.y, L = Math.hypot(dx, dy) || 1; hitter.vx = dx / L * 700; hitter.vy = dy / L * 700; hitter.t = 0; hitter.pierce = 1; hitter.hitSet = new Set([e]); spark(hitter.x, hitter.y, hitter.c, 4); } }
    if (hitter.k === 'homing' && hitter.hero === 'Umesh' && SKILL.Umesh >= 3 && !hitter.burst) { hitter.burst = 1; forEnemiesNear(e.x, e.y, 70, q => { if (q !== e) { shooterName = 'Umesh'; _damageEnemy2(q, dmg * 0.6, e.x); } }); summons.push({ k: 'boom', x: e.x, y: e.y - e.h / 2, R: 70, t: 0, life: 0.3, c: hitter.c }); }
  }
  return ok;
};
// bombs split, chains jump further, lances split, bolts fork, drones/blades/slam/field
const _updateShooter = updateShooter;
updateShooter = function (sh, dt, isLeader) {
  const w = weaponOf(sh.hero); const before = projs.length, beamsBefore = beams.length, sumBefore = summons.length;
  const t3 = tier3(sh);
  if (w && t3) { if (w.kind === 'chain' && !w._t3) { } if (w.kind === 'orbit' && sh.drones && sh.drones.length === 2 && superState.kind !== 'drones') sh.drones.push({ a: Math.PI * 0.66, cd: 0.2 }); }
  _updateShooter(sh, dt, isLeader);
  if (!w || !t3) return;
  if (w.kind === 'lob') for (let i = before; i < projs.length; i++) if (projs[i].k === 'lob') projs[i].cluster = 1;
  if (w.kind === 'lines') for (let i = before; i < projs.length; i++) projs[i].pierce = 5;
  if (w.kind === 'beam') for (let i = beamsBefore; i < beams.length; i++) { const b = beams[i]; if (b.lance && !b.split) { b.split = 1; const p = shooterPos(sh); const second = nearestEnemy(p.x, p.y, w.range * rangeMul(sh), q => q !== b.target); if (second) beams.push({ src: sh, target: second, t: 0, life: b.life, c: b.c, dmg: b.dmg * 0.6, tick: 0, lance: 1, hero: b.hero, split: 1 }); } }
  if (w.kind === 'trigger') for (let i = beamsBefore; i < beams.length; i++) { const b = beams[i]; if (b.bolt && !b.forked) { b.forked = 1; const tgt = nearestEnemy(b.x2, b.y2, 120, q => Math.abs(q.x - b.x2) > 2); if (tgt) { beams.push({ x1: b.x2, y1: b.y2, x2: tgt.x, y2: tgt.y - tgt.h / 2, t: 0, life: 0.18, c: b.c, bolt: 1, forked: 1 }); shooterName = sh.hero.name; damageEnemy(tgt, w.dmg * 0.5, b.x2); } } }
  if (w.kind === 'chain') for (let i = beamsBefore; i < beams.length; i++) { const b = beams[i]; if (b.bolt && !b.extra && i === beams.length - 1) { let last = nearestEnemy(b.x2, b.y2, 5); let from = { x: b.x2, y: b.y2 }; const hit = new Set(); for (let h = 0; h < 3; h++) { const nx = nearestEnemy(from.x, from.y, 160, q => !hit.has(q) && (!last || q !== last)); if (!nx) break; hit.add(nx); beams.push({ x1: from.x, y1: from.y, x2: nx.x, y2: nx.y - nx.h / 2, t: 0, life: 0.2, c: b.c, bolt: 1, extra: 1 }); shooterName = sh.hero.name; damageEnemy(nx, w.dmg * 0.7, from.x); from = { x: nx.x, y: nx.y - nx.h / 2 }; last = nx; } } }
  if (w.kind === 'slam') for (let i = sumBefore; i < summons.length; i++) if (summons[i].k === 'slam' && !summons[i].field) { summons[i].field = 1; summons.push({ k: 'trap', x: sh.x, y: sh.y, w: 240, h: 60, t: 0, life: 2.2, c: w.color, dmg: 0, tick: 99, hero: sh.hero, stunField: 1 }); }
  if (w.kind === 'rally') for (let i = sumBefore; i < summons.length; i++) if (summons[i].k === 'rally' && !summons[i].healed) { summons[i].healed = 1; for (const m of crewAll()) if (m === player) player.hp = Math.min(player.maxHp, player.hp + 1); }
  if (w.kind === 'blades') { sh.bladeExtra = 1; }
};
// cluster bombs + stun field behaviours
const _updateProjs2 = updateProjs;
updateProjs = function (dt) {
  const lobs = projs.filter(p => p.k === 'lob' && p.cluster).map(p => ({ p, x: p.x, y: p.y }));
  _updateProjs2(dt);
  for (const rec of lobs) if (!projs.includes(rec.p) && !rec.p.spawnedCluster) { rec.p.spawnedCluster = 1; for (let k = -1; k <= 1; k++) projs.push({ k: 'lob', x: rec.x, y: rec.y - 10, vx: k * 160 + rnd(-30, 30), vy: -340, dmg: rec.p.dmg * 0.4, aoe: 60, t: 0, life: 2, c: rec.p.c, w: rec.p.w, hero: rec.p.hero }); }
  for (const s of summons) if (s.stunField) forEnemiesNear(s.x, s.y, s.w, e => { if (Math.abs(e.x - s.x) < s.w / 2 && e.y > s.y - 70) e.stun = Math.max(e.stun, 0.3); });
};

/* ---------- vignettes: one personal beat per teammate after they join ---------- */
const VIGNETTES = {
  Bret: [['Bret', 'Hang on — one sec.'], ['Bret', '…he\'s asleep. Look at that face.'], ['hero', 'Is that the baby?'], ['Bret', 'That\'s the baby. Okay. Okay, let\'s go.']],
  Rianan: [['Rianan', 'Wait. Is that a cat?'], ['Rianan', 'Come here. Come here, buddy. Who\'s a good — yes. Yes you are.'], ['hero', 'We\'re kind of in a hurry.'], ['Rianan', 'The cat is now on the crew.']],
  Greg: [['hero', 'Greg… what year do you think it is?'], ['Greg', 'Fiscal.'], ['hero', 'That\'s not—'], ['Greg', 'Fiscal.']],
  Aaron: [['Aaron', 'Give me thirty seconds with this switch stack.'], ['Aaron', '…there. Everything\'s green again.'], ['hero', 'Also your beard\'s still perfect.'], ['Aaron', 'I know.']],
  Ash: [['Ash', 'Salesforce just DM\'d me an apology.'], ['hero', 'Salesforce can\'t DM you.'], ['Ash', 'It can now. I built a flow for it.']],
  Dave: [['Dave', 'Green screen\'s back. Forty years and it finally blinked first.'], ['hero', 'Did you win?'], ['Dave', 'Nobody wins against a green screen. You just outlast it.']],
  Umesh: [['Umesh', 'Every 850 in the queue, back where it belongs.'], ['hero', 'And the 997s?'], ['Umesh', 'It can keep the 997s. Nobody wants the 997s.']],
  John: [['John', 'I looked at the scheduler.'], ['hero', 'And?'], ['John', 'Nothing runs at midnight tonight unless we say so. I made sure.']],
  Ryan: [['Ryan', 'Pipeline\'s green.'], ['hero', 'You checked already?'], ['Ryan', 'I check while I walk. It\'s a condition.']],
  'Brian S': [['Brian S', 'It changed the admin console wallpaper to a picture of itself.'], ['hero', 'That\'s… actually kind of sad.'], ['Brian S', 'I changed it back to the dog.']],
  'Brian W': [['Brian W', 'The database is fine.'], ['hero', 'It\'s always fine.'], ['Brian W', 'It\'s everything around it that isn\'t.']],
  Jose: [['Jose', 'I redrew the architecture diagram.'], ['hero', 'Better?'], ['Jose', 'It has a dragon on it now. Morale is up.']],
};
const vignette = { queue: [], t: 0, cur: null, cat: null };
function scheduleVignette(ch) { story.vig = story.vig || new Set(); if (story.vig.has(ch.name) || !VIGNETTES[ch.name] || demo.active) return; story.vig.add(ch.name); vignette.queue.push({ who: ch.name, lines: VIGNETTES[ch.name], i: -1, t: 3 }); }
function updateVignette(dt) {
  if (!vignette.cur) { if (vignette.queue.length && !stage.active && !talk.open) vignette.cur = vignette.queue.shift(); else return; }
  const v = vignette.cur; v.t -= dt;
  if (v.t <= 0) { v.i++; if (v.i >= v.lines.length) { vignette.cur = null; if (vignette.cat) { vignette.cat = null; } return; }
    const [who, text] = v.lines[v.i]; const target = who === 'hero' ? player : crew.find(f => f.hero.name === who);
    if (!target) { vignette.cur = null; return; }
    target.bubble = text; target.bubbleT = 3.2; v.t = 3.4;
    if (who === 'Bret' && v.i === 0) target.prop = 'phone'; if (who === 'Rianan' && v.i === 0) { vignette.cat = { x: target.x + 90, t: 0, dir: -1 }; }
    if (who === 'Aaron' && v.i === 0) target.prop = 'cable';
  }
  if (vignette.cat) { vignette.cat.t += dt; const owner = crew.find(f => f.hero.name === 'Rianan'); if (owner && Math.abs(vignette.cat.x - owner.x) > 26) vignette.cat.x += Math.sign(owner.x - vignette.cat.x) * 40 * dt; }
}
function drawVignetteBits() {
  for (const m of crewAll()) { if (m.bubbleT > 0) { m.bubbleT -= 1 / 60; const a = Math.min(1, m.bubbleT); ctx.save(); ctx.globalAlpha = a; ctx.font = 'italic 11px Georgia, serif'; const tw = ctx.measureText(m.bubble).width + 18; const bx = m.x - tw / 2, by = m.y - 96; ctx.fillStyle = 'rgba(246,236,216,.92)'; rr(ctx, bx, by, tw, 22, 8); ctx.fill(); ctx.beginPath(); ctx.moveTo(m.x - 5, by + 22); ctx.lineTo(m.x + 5, by + 22); ctx.lineTo(m.x, by + 30); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#243447'; ctx.textAlign = 'center'; ctx.fillText(m.bubble, m.x, by + 15); ctx.restore(); } if (m.bubbleT <= 0) m.prop = null;
    if (m.prop === 'phone') { ctx.save(); ctx.translate(m.x + m.facing * 12, m.y - 34); ctx.fillStyle = '#1b1b1f'; rr(ctx, -4, -7, 8, 14, 2); ctx.fill(); ctx.fillStyle = '#9ad8ff'; ctx.fillRect(-3, -6, 6, 11); ctx.restore(); } }
  if (vignette.cat) drawCat(ctx, vignette.cat.x, groundYAt(vignette.cat.x), vignette.cat.dir, vignette.cat.t, false);
  ctx.textAlign = 'left';
}

/* ---------- A+ gets one soft beat ---------- */
const _onBossDead4 = onBossDead;
onBossDead = function (e) {
  _onBossDead4(e);
  if (WORLD.id === 'merge' && !demo.active && !story.aplusBeat) { story.aplusBeat = true; setTimeout(() => { }, 0); ledger.flash = 9; ledger.text = ['A+  ·  1985', 'The first order I ever shipped was forty bags of chow to a store that closed in 1991. I still have the record. I have all of them.']; aplusSay('I KEPT EVERY ORDER. THAT WAS THE JOB.', 6); }
};

/* ---------- team photo ---------- */
const photo = { active: false, t: 0, flash: 0, taken: false };
function startPhoto() { loadWorld('easton', { x: 2000, y: 392 }); photo.active = true; photo.t = 0; photo.taken = false; hour = 6.4; timeAuto = false; weather = 0; setObjectives([{ text: 'Team photo on the dock. Press ' + K().use + ' to take it.', check: () => false }]); for (let i = enemies.length - 1; i >= 0; i--) enemies.splice(i, 1); npcs.length = 0; crew.length = 0; }
function updatePhoto(dt) { if (!photo.active) return; photo.t += dt; player.x = 2090; player.y = 392; player.vx = 0; if (photo.flash > 0) photo.flash -= dt; if (edge.use && !photo.taken) { photo.taken = true; photo.flash = 1; sfx('scan'); setTimeout(downloadPhoto, 80); } if (edge.dash && photo.taken) { photo.active = false; loadWorld('easton'); } }
function drawPhotoLineup(night) {
  if (!photo.active) return;
  const y = 392; let x = 1780;
  ROSTER.forEach((ch, i) => { if (ch === hero) return; const bob = Math.sin(photo.t * 2 + i) * 1.5; drawHero(ctx, ch, x, y - bob, i % 2 ? -1 : 1, { t: photo.t + i, run: 0, moving: false }, nearestLight(x, y - 30, night)); x += 46; });
  drawBiscuit(ctx, { x: 2140, y, facing: -1, moving: false, run: 0, t: photo.t, earA: 0 }, nearestLight(2140, y - 14, night));
  drawCat(ctx, 2170, y, -1, photo.t, true);
  drawHero(ctx, BLAINE, 2230, y, -1, { t: photo.t, run: 0, moving: false }, nearestLight(2230, y - 30, night));
}
function drawPhotoHUD() {
  if (!photo.active) return;
  if (photo.flash > 0) { ctx.fillStyle = rgba([255, 255, 255], photo.flash); ctx.fillRect(0, 0, W, H); }
  ctx.strokeStyle = 'rgba(246,236,216,.7)'; ctx.lineWidth = 6; ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, W / 2 - 220, H - 70, 440, 40, 8); ctx.fill(); ctx.textAlign = 'center'; ctx.font = 'bold 16px Georgia, serif'; ctx.fillStyle = '#f2b544'; ctx.fillText('PHILLIPS IT  ·  GO LIVE  ·  2026', W / 2, H - 46);
  ctx.font = '11px system-ui, sans-serif'; ctx.fillStyle = '#b9c5d6'; ctx.fillText(photo.taken ? 'saved  ·  dash to leave' : K().use + ' to take the photo', W / 2, H - 34); ctx.textAlign = 'left';
}
function downloadPhoto() { try { const url = canvas.toDataURL('image/png'); const a = document.createElement('a'); a.href = url; a.download = 'hecktown-road-team.png'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { } }
const _drivePhoto = WORLD_DEFS.easton.driveOptions;
WORLD_DEFS.easton.driveOptions = () => _drivePhoto().concat(story.ending ? [{ label: 'Team photo (dock)', to: 'photo' }] : []);
const _startDrive = startDrive; startDrive = function (to) { if (to === 'photo') { talk.open = false; startPhoto(); return; } _startDrive(to); };
const _updateEnding = updateEnding; updateEnding = function (dt) { const was = ending.active; _updateEnding(dt); if (was && !ending.active && !photo.active && !demo.active) { startPhoto(); } };
