
/* =====================================================================
   ANDREW, SCORE, DECOR (M14)
   ===================================================================== */

/* ---------- Andrew: Head of IT Support, runs the RFC meetings ---------- */
ROSTER.push({ name: 'Andrew', role: 'Head of IT Support', perk: 'RFC', skin: '#eec2a0', hair: '#3a2c22', style: 'short', shirt: '#8a4a5a', pants: '#2b2f3a', acc: 'headset' });
WEAPONS.Andrew = { name: 'Ticket Queue', kind: 'homing', cd: 0.6, dmg: 3, range: 440, speed: 400, color: [255, 235, 160] };
SUPERS.Andrew = { name: 'CHANGE FREEZE', desc: 'every machine on screen freezes for five seconds', kind: 'freeze' };
T3.Andrew = 'tickets escalate: a second ticket auto-files on hit';
FLAVOR.Andrew = ['Andrew: "Change freeze started at midnight. A+ did not file an RFC. Everything it\'s doing is unauthorized, and I have the board to prove it."', 'Andrew: "Head of IT Support. If it\'s broken, it\'s a ticket. If it\'s a beetle, it\'s a P1."', 'Andrew: "Thursday RFC meeting stands. Even tonight. Especially tonight."'];
VIGNETTES.Andrew = [['Andrew', 'I filed an RFC for this.'], ['hero', 'For fighting the beetle?'], ['Andrew', 'Emergency change. Approved 11:58. Backout plan: run.']];
RESCUE_ORDER.push('Andrew');
const _rescuePlan = rescuePlan;
rescuePlan = function () { const list = RESCUE_ORDER.filter(n => n !== hero.name); const plan = { easton: [list[0]] }; DC_ORDER.forEach((id, i) => { plan[id] = list[i + 1]; }); for (let i = DC_ORDER.length + 1; i < list.length; i++) if (list[i] !== 'Andrew') plan.easton.push(list[i]); return plan; };
// Andrew holds the help desk in Easton (like Rianan holds the war room) and joins for the finale
const _placeTeammates2 = placeTeammates;
placeTeammates = function () {
  _placeTeammates2();
  if (hero.name !== 'Andrew' && !crew.some(f => f.hero.name === 'Andrew') && !story.met.has('Andrew')) addNPC({ hero: heroByName('Andrew'), look: heroByName('Andrew'), x: 720, y: 440, facing: 1, onTalk: (n) => { if (story.cutoverKey) say(n, 'Andrew: "Emergency RFC approved. I\'m coming. Backout plan is you."', [{ label: 'Join us', fn: () => { story.met.add('Andrew'); joinCrew(heroByName('Andrew')); } }, { label: 'Hold the desk', fn: null }]); else { story.talked = story.talked || {}; const v = (story.talked.Andrew = (story.talked.Andrew || 0) + 1); say(n, v === 1 ? 'Andrew: "Head of IT Support. Every ticket tonight comes to me. Bring the team home and I\'ll bring the board."' : FLAVOR.Andrew[(v - 2) % FLAVOR.Andrew.length]); } } });
};
// CHANGE FREEZE super
const _useSuper2 = useSuper;
useSuper = function () {
  if (!superReady()) return false;
  if (superOf(hero).kind !== 'freeze') return _useSuper2();
  superState.meter = 0; superState.kind = 'freeze'; superState.active = 5; sfx('boss'); shake = Math.max(shake, 0.25); banner('ANDREW  ·  CHANGE FREEZE  ·  no unauthorized changes', 3);
  forEnemiesNear(player.x, player.y, 900, e => { e.stun = Math.max(e.stun, 5); e.frozen = 5; if (e.d.boss) { e.pt = Math.max(e.pt, 5); e.vx = 0; } });
  aplusSay('RFC DENIED. …WHO DENIED IT.', 4); return true;
};
const _drawEnemy2 = drawEnemy;
drawEnemy = function (c, e) { _drawEnemy2(c, e); if (e.frozen > 0) { e.frozen -= 1 / 60; c.save(); c.translate(e.x, e.y); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(180,220,255,.8)'; c.lineWidth = 1.5; c.strokeRect(-e.w / 2 - 4, -e.h - 4, e.w + 8, e.h + 8); c.fillStyle = 'rgba(180,220,255,.9)'; c.font = 'bold 8px monospace'; c.textAlign = 'center'; c.fillText('FROZEN', 0, -e.h - 8); c.restore(); c.textAlign = 'left'; } };
// L3: tickets escalate (a second homing ticket on hit)
const _damageEnemy3 = damageEnemy;
damageEnemy = function (e, dmg, fromX, src) { const ok = _damageEnemy3(e, dmg, fromX, src); if (ok && shooterName === 'Andrew' && SKILL.Andrew >= 3 && Math.random() < 0.5 && projs.length < 380) { const nx = nearestEnemy(e.x, e.y - e.h / 2, 260, q => q !== e); if (nx) projs.push({ k: 'homing', x: e.x, y: e.y - e.h / 2, vx: rnd(-120, 120), vy: -220, target: nx, spd: 420, dmg: dmg * 0.6, t: 0, life: 3, c: WEAPONS.Andrew.color, w: WEAPONS.Andrew, hero: 'Andrew' }); } return ok; };
// title grid: 13 cards
(function () { const s = document.createElement('style'); s.textContent = '#grid { grid-template-columns: repeat(7, auto) !important; }'; document.head && document.head.appendChild(s); })();
// RFC board: quick prop in Easton (E → tonight's change record)
function rfcBoardText() { const n = DC_ORDER.filter(id => restored[id]).length; return 'RFC BOARD  ·  ' + (n ? n + ' emergency change' + (n === 1 ? '' : 's') + ' approved tonight' : 'change freeze in effect') + '  ·  next meeting: Thursday'; }

/* ---------- Greg has worked in every department ---------- */
FLAVOR.Greg.push('Greg: "I\'ve worked in every department here. Receiving, Sales, Accounting, the dock, HR for one afternoon. They all still email me."', 'Greg: "Customer Care, 1997. Best year. Nobody could see me but the calls got answered."');
GHOST_REMARKS.push('Didn\'t he work in Accounting?', 'I think he used to run the dock.');

/* ---------- score, quietly ---------- */
function scoreNow() { const dcs = DC_ORDER.filter(id => restored[id]).length * 5; const rescues = Math.min(10, [...story.met].filter(n => n !== 'Rianan' && n !== 'Andrew' && n !== hero.name).length) * 3; const pages = Math.min(18, ledger.found.size); const queen = restored.easton ? 7 : 0; return Math.min(100, dcs + rescues + pages + queen); } // 45 + 30 + 18 + 7
function drawScoreHUD() { if (!story.turnDone || demo.active || photo.active) return; const s = scoreNow(); ctx.save(); ctx.globalAlpha = 0.55; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = '#b9c5d6'; ctx.fillText(s + ' / 100', W - 22, ledger.found.size ? 110 : 110); ctx.restore(); ctx.textAlign = 'left'; }

/* ---------- decoration: static props baked into each world, plus three quick ones ---------- */
function drawProps(g, id) {
  const gy = WORLD.groundY; const P = {
    bench: (x) => { g.fillStyle = '#5a3a24'; g.fillRect(x - 24, gy - 18, 48, 5); g.fillRect(x - 24, gy - 30, 48, 4); g.fillStyle = '#2c3038'; g.fillRect(x - 20, gy - 18, 3, 18); g.fillRect(x + 17, gy - 18, 3, 18); g.fillRect(x - 20, gy - 30, 3, 12); g.fillRect(x + 17, gy - 30, 3, 12); },
    can: (x) => { g.fillStyle = '#4a5560'; rr(g, x - 9, gy - 26, 18, 26, 3); g.fill(); g.fillStyle = '#2c3038'; g.fillRect(x - 10, gy - 28, 20, 4); },
    hydrant: (x) => { g.fillStyle = '#c0392b'; rr(g, x - 6, gy - 22, 12, 22, 3); g.fill(); g.fillRect(x - 10, gy - 14, 20, 4); g.beginPath(); g.arc(x, gy - 22, 6, Math.PI, 0); g.fill(); },
    cone: (x) => { g.fillStyle = '#ff8a3a'; g.beginPath(); g.moveTo(x - 8, gy); g.lineTo(x + 8, gy); g.lineTo(x + 2, gy - 22); g.lineTo(x - 2, gy - 22); g.closePath(); g.fill(); g.fillStyle = '#fff'; g.fillRect(x - 5, gy - 12, 10, 3); },
    rack: (x) => { g.strokeStyle = '#9aa0a8'; g.lineWidth = 3; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(x + k * 14, gy - 8, 8, Math.PI, 0); g.stroke(); } },
    planter: (x) => { g.fillStyle = '#7a5a3a'; rr(g, x - 16, gy - 14, 32, 14, 3); g.fill(); g.fillStyle = '#3f6a3a'; g.beginPath(); g.arc(x - 6, gy - 18, 8, 0, Math.PI * 2); g.arc(x + 6, gy - 20, 9, 0, Math.PI * 2); g.fill(); g.fillStyle = '#e06a8a'; g.fillRect(x - 8, gy - 22, 3, 3); g.fillRect(x + 5, gy - 26, 3, 3); },
    mailbox: (x) => { g.fillStyle = '#2c3038'; g.fillRect(x - 2, gy - 28, 4, 28); g.fillStyle = '#3c5fa6'; rr(g, x - 10, gy - 40, 20, 14, 5); g.fill(); },
    flag: (x) => { g.fillStyle = '#c8c8d0'; g.fillRect(x, gy - 140, 3, 140); g.fillStyle = '#c0392b'; g.fillRect(x + 3, gy - 138, 30, 6); g.fillStyle = '#fff'; g.fillRect(x + 3, gy - 132, 30, 6); g.fillStyle = '#3c5fa6'; g.fillRect(x + 3, gy - 138, 14, 12); },
    sign: (x, t) => { g.fillStyle = '#2c3038'; g.fillRect(x - 2, gy - 60, 4, 60); g.fillStyle = '#243447'; rr(g, x - 34, gy - 84, 68, 26, 4); g.fill(); g.fillStyle = '#f6ecd8'; g.font = 'bold 8px system-ui'; g.textAlign = 'center'; g.fillText(t, x, gy - 68); },
    pallets: (x) => { for (let k = 0; k < 3; k++) drawPallet(g, x, gy - 28 - k * 28); },
    wire: (x0, x1) => { g.strokeStyle = 'rgba(20,20,30,.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, 250); g.quadraticCurveTo((x0 + x1) / 2, 275, x1, 250); g.stroke(); g.fillStyle = '#1b1b1f'; for (let k = 0; k < 5; k++) { const t = 0.2 + k * 0.15; const bx = x0 + (x1 - x0) * t, by = 250 + 25 * 4 * t * (1 - t) - 5; g.beginPath(); g.ellipse(bx, by, 4, 3, 0, 0, Math.PI * 2); g.fill(); g.fillRect(bx - 1, by - 6, 2, 4); } },
    puddle: (x) => { g.fillStyle = 'rgba(120,150,190,.3)'; g.beginPath(); g.ellipse(x, gy + 4, 40, 4, 0, 0, Math.PI * 2); g.fill(); },
    vending: (x) => { g.fillStyle = '#243447'; rr(g, x - 16, gy - 60, 32, 60, 4); g.fill(); g.fillStyle = '#7fd0ff'; g.fillRect(x - 12, gy - 54, 20, 34); g.fillStyle = '#e63946'; g.fillRect(x - 10, gy - 50, 6, 6); g.fillStyle = '#f2b544'; g.fillRect(x - 2, gy - 50, 6, 6); g.fillStyle = '#7fe0a0'; g.fillRect(x - 10, gy - 40, 6, 6); g.fillStyle = '#1b1b1f'; g.fillRect(x - 12, gy - 14, 20, 8); },
    fountain: (x) => { g.fillStyle = '#8a94a0'; rr(g, x - 8, gy - 34, 16, 34, 3); g.fill(); g.fillStyle = '#c8c8d0'; g.fillRect(x - 10, gy - 36, 20, 4); g.fillStyle = '#7fd0ff'; g.fillRect(x - 2, gy - 40, 2, 4); },
    board: (x) => { g.fillStyle = '#2c3038'; g.fillRect(x - 2, gy - 50, 4, 50); g.fillStyle = '#7a5a3a'; rr(g, x - 30, gy - 90, 60, 42, 3); g.fill(); g.fillStyle = '#e8dcc0'; g.fillRect(x - 26, gy - 86, 22, 16); g.fillRect(x, gy - 86, 24, 12); g.fillRect(x - 24, gy - 66, 30, 12); g.fillStyle = '#c0392b'; g.fillRect(x - 27, gy - 87, 3, 3); g.fillRect(x + 2, gy - 87, 3, 3); },
  };
  const sets = {
    easton: [['flag', 480], ['bench', 1290], ['can', 1330], ['hydrant', 200], ['planter', 1440], ['mailbox', 130], ['cone', 1700], ['cone', 1712], ['pallets', 1580], ['wire', 300, 700], ['sign', 3480, 'KOI POND →'], ['vending', 850], ['fountain', 1250], ['board', 1400], ['puddle', 3000]],
    taunton: [['bench', 700], ['can', 740], ['hydrant', 400], ['rack', 1360], ['cone', 1500], ['pallets', 1450], ['wire', 100, 500], ['sign', 3200, 'JETTY →'], ['planter', 1250], ['vending', 820], ['fountain', 1300], ['board', 1220]],
    spartanburg: [['bench', 880], ['can', 920], ['cone', 2450], ['cone', 2464], ['pallets', 1660], ['planter', 1220], ['sign', 700, 'PEACH STAND'], ['hydrant', 2600], ['vending', 1040], ['fountain', 1160], ['board', 960]],
    generic: [['bench', 880], ['can', 920], ['hydrant', 2600], ['cone', 2450], ['pallets', 1660], ['planter', 1220], ['rack', 800], ['wire', 200, 600], ['vending', 1040], ['fountain', 1160], ['board', 960]],
    prologue: [['bench', 800]],
  };
  const list = sets[id] || sets.generic; for (const [k, ...a] of list) if (P[k]) P[k](...a);
}
const _loadWorld5 = loadWorld;
loadWorld = function (id, at) {
  _loadWorld5(id, at);
  if (['show', 'past'].includes(id)) return;
  const g = LAYERS.play.getContext('2d'); drawProps(g, id);
  // quick props (E): vending machine, fountain, bulletin board
  quickProps.length = 0;
  const sx = ({ easton: [850, 1250, 1400], taunton: [820, 1300, 1220] })[id] || [1040, 1160, 960];
  if (!['prologue'].includes(id)) { quickProps.push({ x: sx[0], kind: 'vending' }, { x: sx[1], kind: 'fountain' }, { x: sx[2], kind: 'board' }); }
};
const quickProps = [];
function updateQuickProps() {
  if (talk.open || shop.open) return;
  for (const q of quickProps) { const near = Math.abs(player.x - q.x) < 30 && player.onGround; q.near = near; if (near && edge.use && !nearScan() && !nearPackage() && !WORLD.nearNPC && !(q.cd > 0)) { q.cd = 4; if (q.kind === 'vending') { bucks.n += 1; sfx('shard'); banner('Clunk. A snack, and a shard someone left in the tray.', 1.6); } if (q.kind === 'fountain') { player.hp = Math.min(player.maxHp, player.hp + 1); sfx('ui'); banner('Refreshing.', 1); } if (q.kind === 'board') { banner(rfcBoardText(), 3); sfx('ui'); } } if (q.cd > 0) q.cd -= 1 / 60; }
}
function drawQuickProps() { for (const q of quickProps) if (q.near) { const y = groundYAt(q.x); ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, q.x - 30, y - 104, 60, 16, 5); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 9px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText({ vending: 'E · SNACK', fountain: 'E · SIP', board: 'E · RFC BOARD' }[q.kind], q.x, y - 92); ctx.textAlign = 'left'; } }
const _updateAplus2 = updateAplus; updateAplus = function (dt) { _updateAplus2(dt); updateQuickProps(); };
const _drawStoryFront = drawStoryFront; drawStoryFront = function () { _drawStoryFront(); drawQuickProps(); };
const _drawLedgerHUD = drawLedgerHUD; drawLedgerHUD = function () { _drawLedgerHUD(); drawScoreHUD(); };
