/* =====================================================================
   STORY PASS — A+ (the old system) is the antagonist; the team is found one DC at a time
   ===================================================================== */

/* ---------- A+ speaks: green-screen terminal cards ---------- */
const aplus = { queue: [], cur: null, t: 0, typed: 0 };
function aplusSay(text, dur) { aplus.queue.push({ text, dur: dur || 4.5 }); }
function updateAplus(dt) {
  if (!aplus.cur && aplus.queue.length) { aplus.cur = aplus.queue.shift(); aplus.t = 0; aplus.typed = 0; sfx('ui'); }
  if (!aplus.cur) return;
  aplus.t += dt; aplus.typed = Math.min(aplus.cur.text.length, Math.floor(aplus.t * 28));
  if (aplus.t > aplus.cur.dur) aplus.cur = null;
}
function drawAplus() {
  if (!aplus.cur || demo.active && false) return;
  const c = aplus.cur; const a = c.t > c.dur - 0.5 ? clamp((c.dur - aplus.t) / 0.5, 0, 1) : clamp(aplus.t / 0.2, 0, 1);
  ctx.save(); ctx.globalAlpha = a; ctx.font = 'bold 13px monospace'; const full = 'A+ > ' + c.text; const tw = Math.max(260, ctx.measureText(full).width + 32);
  const x = W / 2 - tw / 2, y = 92, h = 34;
  ctx.fillStyle = 'rgba(6,14,8,.92)'; rr(ctx, x, y, tw, h, 4); ctx.fill(); ctx.strokeStyle = 'rgba(120,255,140,.55)'; ctx.lineWidth = 1; rr(ctx, x, y, tw, h, 4); ctx.stroke();
  for (let k = y + 4; k < y + h; k += 3) { ctx.fillStyle = 'rgba(120,255,140,.05)'; ctx.fillRect(x + 2, k, tw - 4, 1); }
  ctx.fillStyle = '#7fe0a0'; ctx.textAlign = 'left'; ctx.fillText('A+ > ' + c.text.slice(0, aplus.typed) + (Math.floor(aplus.t * 3) % 2 && aplus.typed < c.text.length ? '▮' : ''), x + 14, y + 22);
  ctx.restore(); ctx.textAlign = 'left';
}
const APLUS_LINES = {
  arrive: { taunton: 'THIS BUILDING HAS SHIPPED 11,206 ORDERS THIS WEEK. UNDER ME.', spartanburg: 'I SEE YOU BROUGHT HELP. I HAVE THE FORKLIFT.', plantcity: 'THE AQUATICS ORDERS ARE ON TIME. THEY ARE ALWAYS ON TIME.', lansing: 'IT IS SNOWING. I HAVE ROUTED AROUND SNOW FOR FORTY YEARS.', billings: 'THE COLD CHAIN IS MINE. DO NOT TOUCH THE COLD CHAIN.', portland: 'EVERY TAG IS WHERE I PUT IT.', sacramento: 'YOU CANNOT MIGRATE A CRANE.', aurora: 'A NEW BUILDING. NO HISTORY. I WILL GIVE IT HISTORY.', merge: 'TWO SCHEMAS. ONE OF THEM IS ME. GUESS WHICH ONE STAYS.' },
  rescue: { default: 'THAT ONE IS MINE. THE LOCKOUT HOLDS.', freed: 'ACCOUNT RESTORED. NOTED.' },
  stage: 'CUTOVER DENIED. ORDERS WILL SHIP. I WILL SHIP THEM.',
  restored: ['I HAVE EIGHT MORE.', 'I HAVE SEVEN MORE.', 'SIX. I AM NOT COUNTING.', 'YOU ARE SLOWER THAN A BATCH JOB.', 'FOUR. THE TRUCKS STILL ROLL FOR ME.', 'THREE. I REMEMBER THE FIRST TRUCK.', 'TWO. WHO WILL SHIP THE ORDERS.', 'ONE. I HAVE A KEY TOO.', 'THE KEY. OF COURSE IT WAS THE KEY.'],
  queen: ['I HAVE RUN AT MIDNIGHT EVERY NIGHT SINCE 1985.', 'THE RACKS ARE MINE. I NUMBERED THEM.', 'IF I STOP, WHO SHOWS UP.'],
  end: 'GO LIVE — OK.   A+ ARCHIVED.   THANK YOU FOR THE ORDERS.',
};

/* ---------- who is found where ---------- */
const RESCUE_ORDER = ['Aaron', 'Bret', 'Dave', 'Umesh', 'John', 'Ryan', 'Greg', 'Brian S', 'Ash', 'Jose', 'Brian W'];
const DC_ORDER = ['taunton', 'spartanburg', 'plantcity', 'lansing', 'billings', 'portland', 'sacramento', 'aurora', 'merge'];
function rescuePlan() {
  const list = RESCUE_ORDER.filter(n => n !== hero.name); const plan = { easton: [list[0]] };
  DC_ORDER.forEach((id, i) => { plan[id] = list[i + 1]; });
  if (list.length > DC_ORDER.length + 1) plan.easton.push(list[DC_ORDER.length + 1]);
  return plan;
}
function heroByName(n) { return ROSTER.find(r => r.name === n); }

/* ---------- lockout rescues ---------- */
const lockout = { active: false, hero: null, x: 0, npc: null, barrier: true, terminal: 0, scans: [], t: 0, started: false };
function setupRescue(def) {
  lockout.active = false; lockout.npc = null; lockout.scans.length = 0; lockout.started = false;
  const plan = rescuePlan(); const name = plan[WORLD.id]; if (!name) return;
  if (story.met.has(name) || crew.some(f => f.hero.name === name) || hero.name === name) return;
  const ch = heroByName(name); const x = def.rescueX || 760;
  lockout.active = true; lockout.hero = ch; lockout.x = x; lockout.barrier = true; lockout.t = 0;
  lockout.npc = addNPC({ hero: ch, look: ch, x, y: groundYAt(x), facing: -1, held: true, onTalk: (n) => { if (lockout.barrier) say(n, ch.name + ': "It locked me out of ' + ({ Aaron: 'the switch stack', Bret: 'the rack room', Dave: 'my green screen — it\'s looping', Umesh: 'EDI. Every 850 bounced', John: 'the job scheduler', Ryan: 'the deploy pipeline', Greg: 'every dashboard I own', 'Brian S': 'the admin console', Ash: 'Salesforce. It spoofed my login', Jose: 'the architecture repo', 'Brian W': 'the database' }[ch.name] || 'everything') + '. The terminal by the door — that\'s the lockout. Clear it."'); else teammateTalk(n); } });
  lockout.terminal = x - 110;
}
function updateLockout(dt) {
  if (!lockout.active) return; lockout.t += dt;
  const nearT = Math.abs(player.x - lockout.terminal) < 40 && player.onGround && lockout.barrier;
  WORLD.nearTerminal = nearT;
  if (nearT && edge.use && !lockout.started && !talk.open) {
    lockout.started = true; aplusSay(APLUS_LINES.rescue.default, 4);
    const xs = [lockout.x - 260, lockout.x + 160, lockout.x + 330]; const skus = ['ACCT 0451', 'ACCT 1138', 'ACCT 2001'];
    xs.forEach((sx, i) => lockout.scans.push(addScan(sx, groundYAt(sx), skus[i])));
    spawnGroup(lockout.x, ['flicker', 'flicker', 'jitter']); banner('Lockout: re-verify the three accounts it froze', 3.5);
  }
  if (lockout.started && lockout.barrier && lockout.scans.length && lockout.scans.every(s => s.done)) {
    lockout.barrier = false; aplusSay(APLUS_LINES.rescue.freed, 3.5); sfx('join');
    banner(lockout.hero.name + ' is free  ·  talk to them', 3.5);
    for (let k = 0; k < 24; k++) spawn({ k: 'glitch', x: lockout.x + rnd(-40, 40), y: groundYAt(lockout.x) - rnd(0, 70), vx: rnd(-120, 120), vy: rnd(-160, 40), life: 0.6, t: 0, c: [120, 255, 140] });
    for (const s of lockout.scans) { const i = scanTargets.indexOf(s); if (i >= 0) scanTargets.splice(i, 1); }
  }
}
function drawLockout() {
  if (!lockout.active) return;
  const x = lockout.x, gy = groundYAt(x), tx = lockout.terminal;
  // terminal
  ctx.save(); ctx.translate(tx, groundYAt(tx)); ctx.fillStyle = '#2b2f3a'; rr(ctx, -14, -60, 28, 60, 4); ctx.fill(); ctx.fillStyle = '#0a1a0e'; rr(ctx, -11, -56, 22, 18, 2); ctx.fill(); ctx.fillStyle = '#7fe0a0'; ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center'; ctx.fillText(lockout.barrier ? 'LOCK' : 'OK', 0, -44); ctx.fillStyle = lockout.barrier ? '#ff5a5a' : '#7fe0a0'; ctx.fillRect(-4, -30, 8, 4);
  if (WORLD.nearTerminal) { ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, -46, -84, 92, 18, 5); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 10px system-ui, sans-serif'; ctx.fillText('E  ·  CLEAR LOCKOUT', 0, -71); }
  ctx.restore();
  // barrier around the teammate
  if (lockout.barrier) { ctx.save(); ctx.translate(x, gy); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba([120, 255, 140], 0.55 + 0.2 * Math.sin(lockout.t * 6)); ctx.lineWidth = 2; ctx.strokeRect(-34, -78, 68, 78); for (let k = 0; k < 6; k++) { const y = -78 + ((lockout.t * 40 + k * 13) % 78); ctx.fillStyle = rgba([120, 255, 140], 0.25); ctx.fillRect(-34, y, 68, 1.5); } ctx.font = 'bold 8px monospace'; ctx.fillStyle = '#7fe0a0'; ctx.textAlign = 'center'; ctx.fillText('ACCESS DENIED', 0, -84); ctx.restore(); }
  ctx.textAlign = 'left';
}

/* ---------- hooks into world setup ---------- */
const _placeTeammates = placeTeammates;
placeTeammates = function () {
  // Easton: only your first crewmate at the start; rescued teammates return here on call
  const plan = rescuePlan(); const spots = [[1330, null, -1], [700, null, 1], [250, null, -1], [3080, null, -1], [3400, null, 1], [1900, 392, -1], [2200, 392, 1], [2650, 288, -1], [3720, 380, -1], [3830, 350, -1], [4080, null, -1], [1000, 340, 1]];
  const here = plan.easton.slice(); for (const n of story.met) if (!here.includes(n)) here.push(n);
  let i = 0;
  for (const n of here) { const ch = heroByName(n); if (!ch || ch === hero || crew.some(f => f.hero === ch)) continue; const [x, yy, fc] = spots[i % spots.length]; i++; addNPC({ hero: ch, look: ch, x, y: yy === null ? groundYAt(x) : yy, facing: fc, onTalk: teammateTalk }); }
  // Rianan holds the war room until the finale
  if (hero.name !== 'Rianan' && !crew.some(f => f.hero.name === 'Rianan') && !story.met.has('Rianan')) addNPC({ hero: heroByName('Rianan'), look: heroByName('Rianan'), x: 1060, y: 440, facing: -1, onTalk: (n) => { if (story.cutoverKey) { say(n, 'Rianan: "The war room can run itself for ten minutes. Let\'s finish this."', [{ label: 'Join us', fn: () => { story.met.add('Rianan'); joinCrew(heroByName('Rianan')); } }, { label: 'Hold the room', fn: null }]); } else say(n, 'Rianan: "Someone has to hold the war room. Bring the team home — I\'ll be here when it\'s time."'); } });
};
const _joinCrew = joinCrew;
joinCrew = function (ch) { const ok = _joinCrew(ch); if (ok) story.met.add(ch.name); return ok; };
const _leaveCrew = leaveCrew;
leaveCrew = function (i) { const f = crew[i]; if (!f) return; if (WORLD.id !== 'easton') { crew.splice(i, 1); story.met.add(f.hero.name); banner(f.hero.name + ' heads back to Easton', 2); return; } _leaveCrew(i); };

/* ---------- world arrival / stage / restored lines ---------- */
const _loadWorld = loadWorld;
loadWorld = function (id, spawnAt) {
  _loadWorld(id, spawnAt);
  lockout.active = false; lockout.npc = null; aplus.queue.length = 0; aplus.cur = null;
  if (demo.active) return;
  const def = WORLD_DEFS[id];
  if (id !== 'easton' && id !== 'prologue' && id !== 'show') setupRescue(def);
  if (APLUS_LINES.arrive[id] && !restored[id]) aplusSay(APLUS_LINES.arrive[id], 5);
  // Milo only shows up in a few alleys
  if (!['spartanburg', 'billings', 'merge', 'show'].includes(id)) { for (let i = npcs.length - 1; i >= 0; i--) if (npcs[i].cat) npcs.splice(i, 1); }
  // objective: free the teammate first
  if (lockout.active) { const rest = quest.list.slice(); setObjectives([{ text: 'A+ locked ' + lockout.hero.name + ' out. Clear the lockout at the terminal by the office', check: () => !lockout.barrier, target: () => ({ x: lockout.barrier && lockout.started ? (lockout.scans.find(s => !s.done) || { x: lockout.terminal }).x : lockout.terminal, label: lockout.started ? 'RE-VERIFY' : 'LOCKOUT TERMINAL' }), tip: 'Press {use} at the terminal, then scan the three frozen accounts' }, { text: 'Talk to ' + lockout.hero.name, check: () => story.met.has(lockout.hero.name), target: () => lockout.npc && npcs.includes(lockout.npc) ? { x: lockout.npc.x, y: lockout.npc.y, label: lockout.hero.name.toUpperCase() } : null, tip: 'Crews are three. If you\'re full, they head back to Easton on call.' }].concat(rest)); }
};
const _startStage3 = startStage;
startStage = function (d) { const was = stage.active; _startStage3(d); if (stage.active && !was && !demo.active) aplusSay(APLUS_LINES.stage, 5); };
const _onBossDead2 = onBossDead;
onBossDead = function (e) {
  _onBossDead2(e);
  if (demo.active) return;
  if (e.type === 'queen') { aplusSay(APLUS_LINES.end, 9); return; }
  const n = DC_ORDER.filter(id => restored[id]).length; aplusSay(APLUS_LINES.restored[Math.min(n - 1, APLUS_LINES.restored.length - 1)] || APLUS_LINES.restored[0], 5);
};
// Queen phase lines
const _updateQueen = updateQueen;
updateQueen = function (e, dt) { const ph = finale.phase; _updateQueen(e, dt); if (finale.phase !== ph && !demo.active) aplusSay(APLUS_LINES.queen[finale.phase - 1] || APLUS_LINES.queen[0], 5); };
// teammateTalk: rescued teammate joins if there is room, otherwise goes on call
const _teammateTalk = teammateTalk;
teammateTalk = function (n) {
  const ch = n.hero;
  if (n.held) {
    if (crew.length < CREW_MAX - 1) say(n, ch.name + ': "It had my account for six hours. Let\'s go take the rest back."', [{ label: 'Join the crew', fn: () => { joinCrew(ch); } }, { label: 'Head to Easton, we\'ll call you', fn: () => { story.met.add(ch.name); npcs.splice(npcs.indexOf(n), 1); banner(ch.name + ' heads back to Easton  ·  on call', 3); } }]);
    else say(n, ch.name + ': "Three\'s a crew and you\'re full. I\'ll head to Easton — swap me in there."', [{ label: 'Swap someone now', fn: () => say(n, 'Who steps out?', crew.map((f, i) => ({ label: 'Swap ' + f.hero.name, fn: () => { leaveCrew(i); joinCrew(ch); } })).concat([{ label: 'Nobody', fn: () => { story.met.add(ch.name); npcs.splice(npcs.indexOf(n), 1); banner(ch.name + ' heads back to Easton  ·  on call', 3); } }])) }, { label: 'See you in Easton', fn: () => { story.met.add(ch.name); npcs.splice(npcs.indexOf(n), 1); banner(ch.name + ' heads back to Easton  ·  on call', 3); } }]);
    return;
  }
  _teammateTalk(n);
};
