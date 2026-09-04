
/* =====================================================================
   THE WIDER COMPANY (M13) — titles, bios, Pam & Melissa, the cast, Frank, the dog, Chuck
   ===================================================================== */
(function titles() {
  const set = (n, o) => { const r = ROSTER.find(x => x.name === n); if (r) Object.assign(r, o); };
  set('Rianan', { role: 'SVP of IT' }); set('Aaron', { role: 'Sr. Director, Infrastructure' }); set('Bret', { role: 'Infrastructure Engineer' });
  set('Brian S', { role: 'Director, Enterprise Systems' }); set('Brian W', { role: 'Web Developer' }); set('Umesh', { role: 'Tech Lead, OMS' });
  set('John', { role: 'Engineering Lead' }); set('Ryan', { role: 'Dev Manager' });
})();
// bios
FLAVOR.Aaron.push('Aaron: "Class IV rapids on Saturday. Cutover night is easier. The river doesn\'t have a backup plan either."', 'Aaron: "Whitewater rule: pick your line early, commit, keep paddling. Same as a network migration."');
FLAVOR['Brian S'].push('Brian S: "I build pinball machines. Real ones. Wood, wire, flippers. This is just a very large one with worse lighting."', 'Brian S: "World-ranked. I don\'t like to bring it up. I\'m bringing it up."');
FLAVOR.John.push('John: "Old-school RPG. Not the elves — the report program generator. I write the batch jobs that write the reports that run this place."', 'John: "Every midnight job in this building, I wrote or inherited. Tonight none of them run without me."');
FLAVOR.Umesh.push('Umesh: "OMS is the order\'s whole life: entered, allocated, picked, shipped, invoiced. A+ wanted to skip a step. I don\'t skip steps."');
FLAVOR.Dave.push('Dave: "There are tunnels under this building. Old ones. I have never once been down there and I know exactly what\'s in them."');
FLAVOR.Greg.push('Greg: "The basement readings are unusual again. They were unusual in 1994. I logged it. Nobody read the log."');
VIGNETTES.Aaron = [['Aaron', 'You know what this is like? A river.'], ['hero', 'A river.'], ['Aaron', 'Pick your line early. Commit. Keep paddling. Class IV, easy.'], ['hero', 'This is a warehouse.'], ['Aaron', 'Keep paddling.']];
VIGNETTES['Brian S'] = [['Brian S', 'This whole building is a pinball machine.'], ['hero', 'How so?'], ['Brian S', 'Bumpers, ramps, a ball that won\'t stay where you put it, and one guy who\'s world-ranked.'], ['hero', 'Is that guy you?'], ['Brian S', 'MULTIBALL.']];
VIGNETTES.John = [['John', 'I checked the scheduler.'], ['hero', 'And?'], ['John', 'Forty years of RPG. The report program generator, not the elves.'], ['hero', 'I know which one.'], ['John', 'Nothing runs at midnight tonight unless we say so.']];
// Brian S's super becomes MULTIBALL: six pinballs that bounce around the arena
SUPERS['Brian S'] = { name: 'MULTIBALL', desc: 'six pinballs bounce through everything', kind: 'pinball' };
SUPERS.Aaron = { name: 'WHITEWATER', desc: 'a river of darts at everything', kind: 'burst' };
const _useSuper = useSuper;
useSuper = function () {
  if (!superReady()) return false;
  if (superOf(hero).kind !== 'pinball') return _useSuper();
  superState.meter = 0; superState.kind = 'pinball'; superState.active = 7; sfx('boss'); shake = Math.max(shake, 0.3); banner('BRIAN S  ·  MULTIBALL', 2.5);
  for (let k = 0; k < 6; k++) projs.push({ k: 'ball', x: player.x, y: player.y - 40, vx: (k % 2 ? 1 : -1) * rnd(260, 420), vy: -rnd(300, 620), dmg: 6, t: 0, life: 7, c: [230, 230, 240], hero: 'Brian S', pierce: 999, hitSet: new Set(), bounces: 0 });
  return true;
};
// pinball physics + visuals
const _updateProjs3 = updateProjs;
updateProjs = function (dt) {
  for (const p of projs) if (p.k === 'ball') { p.t += dt; p.vy += G * 0.9 * dt; p.x += p.vx * dt; p.y += p.vy * dt; const gy = groundYAt(p.x); if (p.y >= gy) { p.y = gy; p.vy = -Math.abs(p.vy) * 0.92 - 60; p.vx *= 0.98; p.bounces++; sfx('ui'); } if (p.y < 60) { p.y = 60; p.vy = Math.abs(p.vy); } const lo = arena.active ? arena.x0 + 10 : 10, hi = arena.active ? arena.x1 - 10 : WORLD.width - 10; if (p.x < lo) { p.x = lo; p.vx = Math.abs(p.vx); } if (p.x > hi) { p.x = hi; p.vx = -Math.abs(p.vx); } forEnemiesNear(p.x, p.y, 40, e => { if (e.born > 0) return; if (Math.abs(e.x - p.x) < e.w / 2 + 10 && p.y > e.y - e.h - 10 && p.y < e.y + 10 && !p.hitSet.has(e)) { p.hitSet.add(e); shooterName = 'Brian S'; damageEnemy(e, p.dmg, p.x - p.vx); p.vx = -p.vx * 0.9; p.vy = -Math.abs(p.vy) * 0.6 - 200; spark(p.x, p.y, [255, 240, 200], 6); setTimeout(() => p.hitSet.delete(e), 400); } }); }
  const balls = projs.filter(p => p.k === 'ball'); for (const b of balls) projs.splice(projs.indexOf(b), 1);
  _updateProjs3(dt);
  for (const b of balls) if (b.t < b.life) projs.push(b);
};
const _renderCombatFront = renderCombatFront;
renderCombatFront = function (night) {
  _renderCombatFront(night);
  ctx.save(); ctx.translate(-camera.x, -camera.y);
  for (const p of projs) if (p.k === 'ball') { const g = ctx.createRadialGradient(p.x - 3, p.y - 3, 1, p.x, p.y, 9); g.addColorStop(0, '#fff'); g.addColorStop(0.5, '#c8c8d0'); g.addColorStop(1, '#5a5a66'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(p.x - p.vx * 0.02, p.y - p.vy * 0.02, 5, 3, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
};

/* ---------- Pam & Melissa: Item Maintenance, inseparable ---------- */
const PAM = { name: 'Pam', role: 'Item Maintenance', skin: '#f1c9a5', hair: '#6a4a3a', style: 'bun', shirt: '#7a5a8a', pants: '#2b2f3a', acc: 'lanyard' };
const MELISSA = { name: 'Melissa', role: 'Item Maintenance', skin: '#e8b48e', hair: '#2a1e18', style: 'ponytail', shirt: '#3f7f8f', pants: '#2b2f3a', acc: 'lanyard' };
const PAIR_LINES = [['Pam', 'Pam: "Melissa and I keep the catalog perfect. A+ changed 400 SKUs to STATIC at 11:53. We noticed at 11:53."'], ['Melissa', 'Melissa: "Pam and I have fixed it twice already. It keeps changing them back. Rude."'], ['Pam', 'Pam: "We stay late together. We came in early together. We\'re going to outlast it together."'], ['Melissa', 'Melissa: "If you see Pam, I\'m right behind her. I\'m always right behind her."']];
function addPair(x, y) {
  const p = addNPC({ look: PAM, x, y: y || groundYAt(x), facing: -1, lines: [PAIR_LINES[0][1], PAIR_LINES[2][1]] });
  const m = addNPC({ look: MELISSA, x: x + 34, y: y || groundYAt(x + 34), facing: -1, lines: [PAIR_LINES[1][1], PAIR_LINES[3][1]] });
  p.pairWith = m; m.pairWith = p; p.pairT = rnd(2, 6); return [p, m];
}
function updatePairs(dt) {
  for (const n of npcs) { if (!n.pairWith || !npcs.includes(n.pairWith) || n.look !== PAM) continue; n.pairT -= dt; const nearPlayer = Math.abs(player.x - n.x) < 130; if (nearPlayer) { n.walkTo2 = undefined; n.facing = player.x < n.x ? -1 : 1; } else if (n.pairT <= 0) { n.pairT = rnd(3, 7); n.walkTo2 = clamp(n.x + rnd(-120, 120), 200, WORLD.width - 200); } if (n.walkTo2 !== undefined) { const d = n.walkTo2 - n.x; if (Math.abs(d) > 3) { n.x += Math.sign(d) * 50 * dt; n.facing = Math.sign(d); n.y = groundYAt(n.x); } else n.walkTo2 = undefined; } const m = n.pairWith; const want = n.x + n.facing * -34; m.x += (want - m.x) * Math.min(1, dt * 4); m.facing = n.facing; m.y = groundYAt(m.x); if (Math.random() < dt * 0.15) { const B = [['Pam', 'Catalog\'s perfect again. For now.'], ['Melissa', 'Right behind you, Pam.'], ['Pam', 'We noticed at 11:53.'], ['Melissa', 'It changed them back. Rude.'], ['Pam', 'Staying late. Together. Obviously.']]; const L = B[(Math.random() * B.length) | 0]; const who = L[0] === 'Pam' ? n : m; who.bubble = L[1]; who.bubbleT = 3.2; } }
}

/* ---------- Frank, the office dog, Chuck ---------- */
const FRANK = { name: 'Frank', role: 'Nights · since 1995', skin: '#e8b48e', hair: '#8e8e8e', style: 'cap', shirt: '#4a5060', pants: '#2b2f3a', acc: 'keys' };
function addFrank(x) { return addNPC({ look: FRANK, x, y: groundYAt(x), facing: -1, lines: ['Frank: "Nights since 1995. I know every corner of this building, including the corners it doesn\'t have anymore."', 'Frank: "Something\'s been moving pallets at midnight for weeks. I figured it was Greg. It was not Greg."', 'Frank: "There\'s a door in the Legacy Archive that was bricked over in \'91. Bricks are gone. Just saying."'] }); }
const officeDog = { present: false, x: 0, t: 0 };
function placeOfficeDog(x) { officeDog.present = true; officeDog.x = x; officeDog.t = 0; }
function drawOfficeDog(night) {
  if (!officeDog.present) return; officeDog.t += 1 / 60; const x = officeDog.x, y = groundYAt(x);
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(0, 1, 22, 4, 0, 0, Math.PI * 2); ctx.fill();
  const b = Math.sin(officeDog.t * 1.5) * 1.5; ctx.fillStyle = '#8a7a6a'; ctx.beginPath(); ctx.ellipse(0, -9 - b * 0.3, 22, 9 + b, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(18, -12, 8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#5a4a3a'; ctx.beginPath(); ctx.ellipse(22, -6, 5, 3, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(12, -22, 5, 9); ctx.fillStyle = '#1b1b1f'; ctx.fillRect(24, -12, 2, 1.5); ctx.restore();
  if (Math.floor(officeDog.t) % 3 === 0) { ctx.fillStyle = 'rgba(246,236,216,.8)'; ctx.font = 'italic 12px Georgia, serif'; ctx.fillText('z', x + 26 + Math.sin(officeDog.t * 2) * 3, y - 28 - (officeDog.t % 1) * 12); ctx.font = 'italic 9px Georgia, serif'; ctx.fillText('z', x + 32, y - 40 - (officeDog.t % 1) * 8); }
  if (Math.abs(player.x - x) < 50) { ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, x - 44, y - 62, 88, 16, 5); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.font = 'bold 9px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('THE OFFICE DOG  ·  asleep', x, y - 50); ctx.textAlign = 'left'; }
}
const chuck = { present: false, x: 0, t: 0, up: 0 };
function placeChuck(x) { chuck.present = true; chuck.x = x; chuck.t = 0; }
function drawChuck() {
  if (!chuck.present) return; chuck.t += 1 / 60; const x = chuck.x, y = groundYAt(x);
  const near = Math.abs(player.x - x) < 160; chuck.up += ((near ? 0 : 1) - chuck.up) * 0.06;
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(-20, -40, 40, 40); ctx.clip(); ctx.translate(0, (1 - chuck.up) * 30);
  ctx.fillStyle = '#7a5a3a'; ctx.beginPath(); ctx.ellipse(0, -14, 10, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(0, -28, 8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#5a3a24'; ctx.fillRect(-6, -37, 3, 4); ctx.fillRect(3, -37, 3, 4); ctx.fillStyle = '#1b1b1f'; ctx.fillRect(-4, -30, 2, 2); ctx.fillRect(2, -30, 2, 2); ctx.fillStyle = '#fbf6ee'; ctx.fillRect(-2, -25, 2, 3); ctx.fillRect(0.5, -25, 2, 3); ctx.restore(); ctx.restore();
  if (near) { ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, x - 40, y - 62, 80, 16, 5); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.font = 'bold 9px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('CHUCK  ·  groundhog', x, y - 50); ctx.textAlign = 'left'; }
}

/* ---------- Central Pet delegation (roles only) at the Merge ---------- */
const DELEGATE = (role, i) => ({ name: 'Central Pet', role, skin: ['#f1c9a5', '#c48a62', '#d9a77c', '#8a5a3a'][i], hair: ['#3a2c22', '#1a1410', '#8e8e8e', '#5a3a22'][i], style: ['short', 'bun', 'short', 'wavy'][i], shirt: '#2f7f4f', pants: '#2b2f3a', acc: 'lanyard' });
function addDelegation(x) { const roles = ['Integration Lead', 'Data Lead', 'Ops Lead', 'Sales Lead']; roles.forEach((r, i) => addNPC({ look: DELEGATE(r, i), x: x + i * 36, y: groundYAt(x), facing: -1, lines: [['Central Pet ' + r + ': "Two networks, one map. We brought the green shirts and the coffee. You brought the crew."', 'Central Pet ' + r + ': "Our system talks to yours as of tonight. The thing in the yard disagrees."', 'Central Pet ' + r + ': "Same promise on our side of the fence. Show up."', 'Central Pet ' + r + ': "The Sales Lead wants to meet Jessica. The Data Lead wants to meet Pam and Melissa. Everyone wants to meet the dog."'][i]] })); }

/* ---------- the cast at the Show, and around Easton ---------- */
const CAST = [
  ['Nick', 'CEO', { skin: '#f1c9a5', hair: '#6a5a4a', style: 'short', shirt: '#243447', pants: '#2b2f3a', acc: 'lanyard' }, 'Nick: "First cutover on the job and it went like this. Good team. Good dog."'],
  ['Jessica', 'Chief Sales & Marketing', { skin: '#e8b48e', hair: '#a8632c', style: 'wavy', shirt: '#c25a3a', pants: '#2b2f3a', acc: 'none' }, 'Jessica: "Seventy-five brands on the floor and every one of them asked about the beetle."'],
  ['Kim', 'Accounting', { skin: '#f0c7a3', hair: '#3a2c22', style: 'bun', shirt: '#6b5b8f', pants: '#2b2f3a', acc: 'glasses' }, 'Kim: "Our financial systems have run since the mainframe days. Tonight was the first night they ran scared."'],
  ['Ashley', 'Finance', { skin: '#c48a62', hair: '#1a1410', style: 'ponytail', shirt: '#3f7f8f', pants: '#2b2f3a', acc: 'none' }, 'Ashley: "I priced the damage. Forty bags of chow in 1985 dollars. A+ has receipts."'],
  ['Jennifer', 'Marketing', { skin: '#f1c9a5', hair: '#8a4a2a', style: 'wavy', shirt: '#e0a030', pants: '#2b2f3a', acc: 'none' }, 'Jennifer: "There are tunnels under the warehouse. I\'ve said this for years. Frank backs me up."'],
  ['Josh', 'Customer Care', { skin: '#d9a77c', hair: '#2a1e18', style: 'short', shirt: '#2f6f9f', pants: '#2b2f3a', acc: 'headset' }, 'Josh: "A thousand calls a day and tonight every one of them was \'is the site up?\' It\'s up."'],
  ['Stephanie', 'Customer Care', { skin: '#f0c7a3', hair: '#5a3a22', style: 'ponytail', shirt: '#2f6f9f', pants: '#2b2f3a', acc: 'headset' }, 'Stephanie: "Customer Care held the phones all night. We\'d like it noted."'],
  ['Wendy', 'Customer Care', { skin: '#e8b48e', hair: '#1a1410', style: 'bun', shirt: '#2f6f9f', pants: '#2b2f3a', acc: 'headset' }, 'Wendy: "Every call is a relationship. Even the ones about beetles."'],
  ['Michelle', 'Customer Care', { skin: '#c9906a', hair: '#3a2c22', style: 'wavy', shirt: '#2f6f9f', pants: '#2b2f3a', acc: 'headset' }, 'Michelle: "Family-owned since 1938. We say it on every call. Tonight it was true in a new way."'],
  ['Jenna', 'Customer Care', { skin: '#f1c9a5', hair: '#a8632c', style: 'short', shirt: '#2f6f9f', pants: '#2b2f3a', acc: 'headset' }, 'Jenna: "Eleven DCs, all back. I checked the map so many times it asked me to stop."'],
  ['Marc', 'Inside Sales', { skin: '#eec2a0', hair: '#5a3a22', style: 'short', shirt: '#5a5f7a', pants: '#2b2f3a', acc: 'lanyard' }, 'Marc: "From aquatics to nutrition, everything shipped. I sold a beetle repellent I don\'t think exists."'],
  ['Michael', 'Inside Sales', { skin: '#b9825a', hair: '#151210', style: 'short', shirt: '#5a5f7a', pants: '#2b2f3a', acc: 'lanyard' }, 'Michael: "Groomers, vets, retailers, coast to coast. All of them got their orders. Even the ones A+ tried to keep."'],
  ['Kaler', 'Inside Sales', { skin: '#f0c7a3', hair: '#7a6a5c', style: 'wavy', shirt: '#5a5f7a', pants: '#2b2f3a', acc: 'lanyard' }, 'Kaler: "One store at a time since 1938. Tonight it was one DC at a time."'],
];
function addCast(startX, gap, names) { let i = 0; for (const [n, role, look, line] of CAST) { if (names && !names.includes(n)) continue; const c = addNPC({ look: Object.assign({ name: n, role }, look), x: startX + i * gap, y: groundYAt(startX + i * gap), facing: i % 2 ? 1 : -1, lines: [line] }); if (role === 'Inside Sales' || role === 'Customer Care') c.phone = rnd(2, 12); i++; } }
function updatePhones(dt) { for (const n of npcs) { if (n.phone === undefined) continue; n.phone -= dt; if (n.phone <= 0) { n.phone = rnd(6, 16); n.bubble = '📞 ' + ['Phillips, this is ' + n.look.name + '.', 'Yes, the site is up.', 'It\'s up. It\'s been up.', 'No, that\'s a beetle.'][(Math.random() * 4) | 0]; n.bubbleT = 3; } } }

/* ---------- placement hooks ---------- */
const _setupEaston2 = setupEaston;
setupEaston = function () {
  _setupEaston2();
  placeOfficeDog(1118); placeChuck(3960);
  if (story.turnDone) { addPair(1560, 412); addFrank(2360); }
  if (story.ending) { addCast(300, 60, ['Nick', 'Jessica', 'Kim', 'Ashley', 'Jennifer']); addCast(3050, 70, ['Josh', 'Marc']); }
  const rosa = npcs.find(n => n.look && n.look.name === 'Rosa'); if (rosa && rosa.lines) rosa.lines.push('Rosa: "Bacon Fest weekend the trucks still rolled. Peace Candle lit, canal mules walking, and us on the dock. That\'s Easton."', 'Rosa: "Chuck\'s up on the hill again. He only comes out when somebody\'s about to make a bad call."');
};
WORLD_DEFS.easton.setup = setupEaston;
const _mergeSetup = WORLD_DEFS.merge.setup;
WORLD_DEFS.merge.setup = function () { _mergeSetup(); addDelegation(560); addPair(1000, 440); };
const _showSetup = WORLD_DEFS.show.setup;
WORLD_DEFS.show.setup = function () { _showSetup(); addCast(2650, 58); addPair(3050, 440); addFrank(3350); placeOfficeDog(3800); };
const _loadWorld4 = loadWorld; loadWorld = function (id, at) { officeDog.present = false; chuck.present = false; _loadWorld4(id, at); };
const _updateAplus = updateAplus; updateAplus = function (dt) { _updateAplus(dt); updatePairs(dt); updatePhones(dt); };
const _drawStoryLayer = drawStoryLayer; drawStoryLayer = function (night) { drawOfficeDog(night); drawChuck(); _drawStoryLayer(night); };
// Bret goes straight for the dog
const _vBret = VIGNETTES.Bret; VIGNETTES.Bret = _vBret.concat([['Bret', 'Is that the office dog? Asleep? Hold on.'], ['hero', 'Bret.'], ['Bret', 'Two dogs at home, a baby, and now this guy. I\'m fine. I\'m great.']]);
