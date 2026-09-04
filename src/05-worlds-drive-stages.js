/* =====================================================================
   WORLDS, THE DRIVE, BOSS STAGES (v3)
   ===================================================================== */
const arena = { active: false, x0: 0, x1: 0, boss: null };
const restoredBanner = { t: 0, text: '' };
const stage = { active: false, door: null, step: 0, timer: 0, fails: 0, spawnT: 0, t: 0 };
/* ---------- Taunton, MA — coastal New England, fog ---------- */
function bakeTauntonFar() {
  // sea horizon + far shoreline with a lighthouse and a church steeple
  { const w = 1400, h = 300, c = mkCanvas(w, h), g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 214, w, h - 214);
    // low headland
    g.beginPath(); g.moveTo(0, 214); for (let x = 0; x <= 560; x += 40) g.lineTo(x, 214 - Math.sin(x * 0.012) * 14 - 8); g.lineTo(560, 214); g.closePath(); g.fill();
    // lighthouse on the headland
    g.fillRect(300, 150, 12, 62); g.beginPath(); g.moveTo(296, 150); g.lineTo(316, 150); g.lineTo(306, 138); g.closePath(); g.fill(); g.fillRect(302, 144, 8, 6);
    // steeple far right
    g.fillRect(1050, 176, 20, 40); g.beginPath(); g.moveTo(1048, 176); g.lineTo(1072, 176); g.lineTo(1060, 130); g.closePath(); g.fill();
    LAYERS.ridge = c; }
  // salt marsh flats with a water tower and scrub
  { const w = 1600, h = 300, c = mkCanvas(w, h), g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 246, w, h - 246);
    for (let x = 0; x < w; x += 6) { const hh = 6 + (x * 7919) % 9; if ((x * 31) % 5 < 2) g.fillRect(x, 246 - hh, 2, hh); }
    // water tower
    g.fillRect(900, 150, 4, 96); g.fillRect(934, 150, 4, 96); g.fillRect(896, 120, 46, 34); g.beginPath(); g.moveTo(892, 120); g.lineTo(946, 120); g.lineTo(919, 100); g.closePath(); g.fill(); g.fillRect(908, 170, 22, 3); g.fillRect(908, 205, 22, 3);
    // clam shack
    g.fillRect(400, 224, 50, 22); g.beginPath(); g.moveTo(396, 226); g.lineTo(425, 208); g.lineTo(454, 226); g.closePath(); g.fill();
    // dock pilings
    for (let x = 600; x < 760; x += 16) g.fillRect(x, 232, 3, 14);
    g.fillRect(600, 232, 160, 3);
    LAYERS.hills = c; }
  // pine + scrub tree line
  { const w = 1200, h = 340, c = mkCanvas(w, h), g = c.getContext('2d');
    for (let i = 0; i < 18; i++) { const tx = i * 68 + (i % 3) * 14, th = 100 + (i * 41) % 70; g.fillStyle = i % 2 ? '#213a2c' : '#1a3126'; g.fillRect(tx - 2, h - th * 0.4, 4, th * 0.4); for (let k = 0; k < 5; k++) { const ww = 26 - k * 4 + (i % 2) * 4; g.beginPath(); g.moveTo(tx - ww, h - th * 0.4 - k * th * 0.14); g.lineTo(tx + ww, h - th * 0.4 - k * th * 0.14); g.lineTo(tx, h - th * 0.4 - (k + 1.6) * th * 0.14); g.closePath(); g.fill(); } }
    LAYERS.trees = c; }
}
function drawTauntonPlay(g) {
  const gy = WORLD.groundY;
  // sandy ground with marsh grass, gravel apron at the DC
  const gg = g.createLinearGradient(0, gy, 0, H); gg.addColorStop(0, '#8f9a6a'); gg.addColorStop(0.07, '#7a865a'); gg.addColorStop(0.12, '#6b6250'); gg.addColorStop(1, '#3b382e');
  g.fillStyle = gg; g.fillRect(0, gy, WORLD.width, H - gy);
  g.fillStyle = '#5a5c60'; g.fillRect(900, gy, 1500, H - gy); g.fillStyle = '#e9d27a'; for (let x = 920; x < 2380; x += 70) g.fillRect(x, gy + 26, 30, 3);
  // marsh water inlet (visual, with a boardwalk over it)
  g.fillStyle = '#31506a'; g.fillRect(2480, gy + 2, 360, H - gy); g.fillStyle = 'rgba(200,230,255,.18)'; for (let x = 2490; x < 2830; x += 34) g.fillRect(x, gy + 10 + (x % 3) * 4, 18, 2);
  g.fillStyle = '#7a5a3a'; for (let x = 2480; x < 2840; x += 24) g.fillRect(x, gy - 6, 20, 6); g.fillStyle = '#4a3624'; for (let x = 2490; x < 2840; x += 60) g.fillRect(x, gy, 5, 30);
  // marsh grass tufts
  g.strokeStyle = '#a4b072'; g.lineWidth = 2; for (let x = 0; x < WORLD.width; x += 13) { if (x > 900 && x < 2400) continue; if (x > 2470 && x < 2850) continue; const hh = 6 + (x * 7) % 10; g.beginPath(); g.moveTo(x, gy); g.lineTo(x + 3 - (x % 5), gy - hh); g.stroke(); }
  // the DC: white clapboard office + grey warehouse wing, "TAUNTON, MA"
  { const x = 940, y = 236, w = 480, h = 204; const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#e9e6dc'); gr.addColorStop(1, '#bdb7a8'); g.fillStyle = gr; g.fillRect(x, y, w, h);
    g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 1; for (let yy = y + 10; yy < y + h; yy += 9) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); }
    g.fillStyle = '#6e6a60'; g.fillRect(x, y, w, 8); g.fillStyle = '#2f4f6f'; g.fillRect(x, y + h - 60, w, 60);
    for (let i = 0; i < 5; i++) { const wx = x + 30 + i * 90; g.fillStyle = '#243447'; rr(g, wx, y + 34, 44, 40, 3); g.fill(); g.fillStyle = 'rgba(200,220,255,.18)'; g.fillRect(wx + 3, y + 37, 18, 34); g.fillStyle = '#6e6a60'; g.fillRect(wx + 21, y + 34, 2, 40); }
    g.fillStyle = '#1e2c3d'; rr(g, x + 200, y + 80, 100, 124, 5); g.fill(); g.fillStyle = '#f2b544'; g.fillRect(x + 248, y + 84, 6, 116);
    g.fillStyle = '#243447'; rr(g, x + 120, y + 6, 240, 40, 6); g.fill(); g.fillStyle = '#f2b544'; g.font = 'bold 22px Georgia, serif'; g.textAlign = 'center'; g.fillText('PHILLIPS', x + 240, y + 34);
    g.fillStyle = '#e6d7bd'; g.font = '10px system-ui, sans-serif'; g.fillText('TAUNTON, MA', x + 240, y + 60); }
  { const x = 1420, y = 226, w = 980, h = 214; const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#a9b3bb'); gr.addColorStop(1, '#7e8890'); g.fillStyle = gr; g.fillRect(x, y, w, h); g.fillStyle = '#5e6870'; g.fillRect(x, y, w, 8);
    g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 2; for (let xx = x; xx < x + w; xx += 12) { g.beginPath(); g.moveTo(xx, y + 8); g.lineTo(xx, y + h); g.stroke(); }
    for (let i = 0; i < 2; i++) { const dx = x + 140 + i * 300; g.fillStyle = '#3a4048'; g.fillRect(dx, 300, 100, 92); g.fillStyle = '#4b525b'; for (let k = 0; k < 5; k++) g.fillRect(dx + 2, 302 + k * 18, 96, 16); g.fillStyle = '#2c3038'; rr(g, dx + 36, 318, 28, 10, 3); g.fill(); }
    g.fillStyle = '#5a5e66'; g.fillRect(1520, 392, 560, 48); g.fillStyle = '#e9d27a'; g.fillRect(1520, 392, 560, 4); g.fillRect(1480, 416, 40, 24);
    g.fillStyle = '#e9d27a'; for (let xx = 1520; xx < 2080; xx += 20) g.fillRect(xx, 436, 10, 4); }
  // lighthouse-style grain silo (the local landmark by the DC)
  { const x = 2960; g.fillStyle = '#d9d4c6'; g.fillRect(x - 26, 110, 52, 330); g.fillStyle = '#c0392b'; for (let yy = 130; yy < 440; yy += 60) g.fillRect(x - 26, yy, 52, 24); g.fillStyle = '#2c3038'; g.fillRect(x - 30, 98, 60, 14); g.fillStyle = '#243447'; g.fillRect(x - 14, 78, 28, 22); g.fillStyle = '#e9d27a'; g.fillRect(x - 10, 82, 20, 14); g.beginPath(); g.moveTo(x - 18, 78); g.lineTo(x + 18, 78); g.lineTo(x, 60); g.closePath(); g.fillStyle = '#2c3038'; g.fill(); }
  // rocks + jetty at the far end
  g.fillStyle = '#6a6f6a'; g.beginPath(); g.moveTo(3320, gy); g.lineTo(3360, gy - 28); g.lineTo(3440, gy - 30); g.lineTo(3520, gy - 58); g.lineTo(3600, gy - 60); g.lineTo(3600, gy); g.closePath(); g.fill();
  // truck (drive home) parked at the far right
  drawTrailer(g, WORLD.truckX, 288, WORLD.groundY);
  // sign
  g.fillStyle = '#2c3038'; g.fillRect(120, 380, 4, 60); g.fillStyle = '#1e6e3a'; rr(g, 50, 364, 144, 30, 4); g.fill(); g.fillStyle = '#fff'; g.font = 'bold 12px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('TAUNTON  ·  RTE 140', 122, 384);
  // scrub oaks
  drawOak(g, 520, gy, 0.9); drawOak(g, 2300, gy, 1.0); drawOak(g, 3200, gy, 0.8);
  // picnic + lamp near the office
  g.fillStyle = '#2c3038'; g.fillRect(760, 300, 6, 140); g.fillRect(728, 330, 60, 6); g.fillStyle = '#1e2127'; rr(g, 748, 288, 30, 14, 4); g.fill();
}


const WORLD_DEFS = {
  easton: {
    id: 'easton', name: 'Easton, PA', location: 'Easton, Pennsylvania — Phillips Pet HQ', width: 4200, groundY: 440, truckX: 2470,
    solids: () => EASTON_SOLIDS, lights: () => EASTON_LIGHTS, far: bakeEastonFar, play: drawEastonPlay,
    coffee: { x: 1180, y: 440 }, checkpoint: { x: 1140, y: 440 }, spawn: { x: 300, y: 440 }, weather: 0, hour: 23.85, setup: setupEaston,
    driveTo: 'taunton', driveLabel: 'DRIVE OUT', driveHours: 4.5, driveRequires: () => story.turnDone ? null : 'Finish your shift first — something is wrong in the server room.',
    driveOptions: () => [{ label: 'Taunton, MA', to: 'taunton' }].concat(restored.taunton ? [{ label: 'Spartanburg, SC', to: 'spartanburg' }] : []),
  },
  taunton: {
    id: 'taunton', name: 'Taunton, MA', location: 'Taunton, Massachusetts — Phillips DC', width: 3800, groundY: 440, truckX: 3340,
    solids: () => [[0, 440, 3800, 200, 0], [1520, 392, 560, 48, 0], [1480, 416, 40, 24, 0], [2480, 434, 360, 6, 1], [3340, 288, 420, 92, 0], [3760, 328, 64, 54, 0], [3360, 412, 80, 28, 0], [3440, 410, 80, 30, 0], [3520, 382, 80, 58, 0], [728, 330, 60, 6, 1], [1140, 316, 100, 8, 1]],
    lights: () => [{ x: 760, y: 300, r: 300, color: [255, 210, 140], night: 1, cone: 1 }, { x: 1180, y: 290, r: 260, color: [242, 181, 68], night: 1, glow: 1 }, { x: 1190, y: 380, r: 190, color: [255, 225, 170], night: 1 }, { x: 1610, y: 330, r: 240, color: [255, 200, 120], night: 1, cone: 1 }, { x: 1910, y: 330, r: 240, color: [255, 200, 120], night: 1, cone: 1 }, { x: 2980, y: 92, r: 340, color: [255, 250, 210], night: 1, glow: 1 }, { x: 3340 + 448, y: 380, r: 90, color: [255, 240, 200], night: 1 }],
    far: bakeTauntonFar, play: drawTauntonPlay,
    coffee: { x: 900, y: 440 }, checkpoint: { x: 860, y: 440 }, spawn: { x: 260, y: 440 }, weather: 1, setup: setupTaunton,
    door: { x: 2440, x0: 2480, x1: 3300, boss: 'fogserver', name: 'FOG SERVER', minCrew: 1 }, water: [{ x0: 2480, x1: 2840, y: 442 }],
    driveTo: 'easton', driveLabel: 'DRIVE HOME', driveHours: 4.5, driveRequires: () => restored.taunton ? null : 'The DC is still dark. Clear the boss stage first.',
  },
};
function loadWorld(id, spawnAt) {
  const def = WORLD_DEFS[id];
  WORLD.id = def.id; WORLD.name = def.name; WORLD.location = def.location; WORLD.width = def.width; WORLD.groundY = def.groundY; WORLD.truckX = def.truckX; WORLD.def = def;
  SOLIDS = def.solids(); LIGHTS = def.lights(); COFFEE = def.coffee; CHECKPOINT = def.checkpoint;
  def.far();
  { const c = mkCanvas(WORLD.width, H), g = c.getContext('2d'); def.play(g); dressGround(g); LAYERS.play = c; }
  for (const e of enemies) e.dead = true; enemies.length = 0; projs.length = 0; beams.length = 0; summons.length = 0; shards.length = 0;
  waveState.alive = 0; waveState.n = 0; waveState.toSpawn = 0; waveState.cd = 3; waveState.paused = true; waveState.rifts.length = 0; waveState.banner = 0;
  arena.active = false; arena.boss = null; stage.active = false; stage.door = null;
  npcs.length = 0; packages.length = 0; scanTargets.length = 0; encounters.length = 0; talk.open = false; shop.open = false; player.carry = null;
  forklift.present = false; forklift.mounted = false; liftPallets.length = 0; catnip.active = 0; bossProjs.length = 0; valves.length = 0; hazard.windT = 0; containers.length = 0; animals.length = 0; finale.active = false; finale.everyone.length = 0; finale.phase = 0; wrecks.length = 0; bossIntro.t = 0;
  const sp = spawnAt || def.spawn;
  player.x = sp.x; player.y = sp.y; player.vx = 0; player.vy = 0; player.dead = 0; player.inv = 0.6;
  dog.x = sp.x - 60; dog.y = sp.y; dog.vx = 0; dog.vy = 0;
  for (const f of crew) { f.x = sp.x - 40; f.y = sp.y; f.vx = 0; f.vy = 0; }
  camera.x = clamp(sp.x - W / 2, 0, WORLD.width - W); camera.y = 0;
  for (const f of fireflies) f.x = rnd(0, WORLD.width);
  weather = def.weather; if (def.hour !== undefined && !restored[id] && !story.visited?.[id]) { hour = def.hour; }
  (story.visited = story.visited || {})[id] = true;
  mode = 'world';
  if (def.setup) def.setup();
  placeLedger();
}

/* ---------- Easton: the solo adventure ---------- */
function placeTeammates() {
  // everyone not in your crew is at work somewhere on campus, on call
  const spots = [[250, null, -1], [700, null, 1], [1340, null, -1], [1900, 392, -1], [2200, 392, 1], [2650, 300, -1], [3080, null, -1], [3400, null, 1], [3700, 380, -1], [3830, 350, -1], [4080, null, -1], [1000, 340, 1]];
  let i = 0;
  for (const ch of ROSTER) {
    if (ch === hero || crew.some(f => f.hero === ch)) continue;
    const [x, yy, fc] = spots[i % spots.length]; i++;
    addNPC({ hero: ch, look: ch, x, y: yy === null ? groundYAt(x) : yy, facing: fc, onTalk: teammateTalk });
  }
}
function setupEaston() {
  placeTeammates();
  const rosa = addNPC({ look: NPC_LOOKS.rosa, x: 2090, y: 392, facing: -1, lines: ['Rosa: "Bay 2\'s waiting on that kibble. Also — the scanner\'s been acting up all night."', 'Rosa: "Trucks roll at dawn whether the system\'s up or not."'] });
  if (story.turnDone) { addMilo(3480, false); setObjectives([{ text: 'Meet teammates to form a crew, then drive out from the truck', check: () => false }]); addEncounter(3050, ['flicker', 'flicker', 'flicker', 'jitter']); addEncounter(3750, ['packet', 'flicker', 'flicker']); return; }
  story.weaponsOnline = false;
  const pkg = spawnPackage(1470, 440, 'BAY 2');
  const scans = [addScan(1800, 392, 'SKU 11938'), addScan(2000, 392, 'SKU 20415'), addScan(2300, 392, 'SKU 37471')];
  let delivered = false; rosa.acceptsPackage = (p) => { delivered = true; say(rosa, 'Rosa: "That\'s the one. Now do me a favor — scan the three tagged pallets. The system keeps throwing errors on them."'); };
  let serverFight = false;
  setObjectives([
    { text: 'Clock in at the front door', check: () => Math.abs(player.x - 990) < 40 && player.onGround, moveHint: true, tip: 'Move: {move}   ·   Jump: {jump}   ·   Dash: {dash}', target: () => ({ x: 990, y: 440, label: 'FRONT DOOR' }), onDone: () => banner('11:52 PM  ·  the new site goes live at midnight', 3) },
    { text: 'Grab the package by the pallets and bring it to Rosa at bay 2', check: () => delivered, tip: 'Pick up and hand over with {use}. The dock has steps by bay 1.', target: () => player.carry ? { x: rosa.x, y: rosa.y, label: 'ROSA · BAY 2' } : { x: pkg.x, y: pkg.y, label: 'PACKAGE' } },
    { text: 'Scan the three tagged pallets on the dock', check: () => scans.every(s => s.done), tip: 'Stand by a tagged pallet and press {use} to scan', target: () => { const s = scans.find(q => !q.done); return s ? { x: s.x, y: s.y, label: s.sku } : null; }, onDone: () => { aplusSay('SCAN REJECTED. CUTOVER NOT AUTHORIZED.', 4.5); banner('Something is wrong in the server room.', 4); } },
    { text: 'Get to the server room (front door)', check: () => Math.abs(player.x - 990) < 50 && player.onGround, target: () => ({ x: 990, y: 440, label: 'SERVER ROOM' }), onDone: () => { story.weaponsOnline = true; serverFight = true; spawnGroup(990, ['flicker', 'flicker', 'flicker']); aplusSay('CUTOVER DENIED. ORDERS WILL SHIP. I WILL SHIP THEM.', 5); banner(weaponOf(hero).name + ' online', 3); shake = 0.3; } },
    { text: 'Clear the machines', check: () => serverFight && waveState.alive <= 0, tip: 'Your weapon aims and fires by itself. You move, jump, and dash — dashing through machines is safe.', target: () => { const e = nearestEnemy(player.x, player.y - 30, 2000); return e ? { x: e.x, y: e.y, label: 'STATIC' } : null; }, onDone: () => { story.turnDone = true; aplusSay('I HAVE LOCKED THE OTHERS OUT. THEY WERE IN MY WAY.', 5); banner('A+ is fighting the cutover. Every DC is going dark. Get the team back.', 4.5); addEncounter(3050, ['flicker', 'flicker', 'flicker', 'jitter']); addEncounter(3750, ['packet', 'flicker', 'flicker']); } },
    { text: 'Find who\'s still on campus and form a crew', check: () => crew.length >= 1, tip: 'Walk up to a teammate and press {use}. Crews are three; {swap} to take point.', target: () => { let best = null, bd = 1e9; for (const n of npcs) if (n.hero) { const d = Math.abs(n.x - player.x); if (d < bd) { bd = d; best = n; } } return best ? { x: best.x, y: best.y, label: best.hero.name.toUpperCase() } : null; }, onDone: () => banner('Crews are three. Swap anyone in at a meet-up.', 3) },
    { text: 'Drive out from the truck when you\'re ready', check: () => false, tip: 'The coffee machine by the door refills your signal. Meet more teammates, or press {use} at the truck cab.', target: () => ({ x: WORLD.truckX + 450, y: 440, label: 'THE TRUCK' }) },
  ]);
}

/* ---------- Taunton: the first boss stage ---------- */
function setupTaunton() {
  const sal = addNPC({ look: NPC_LOOKS.sal, x: 3250, y: 440, facing: -1, lines: ['Sal: "Receiving\'s dead. The rack in the back keeps vanishing into the fog and coming out swinging."'] });
  stage.sal = sal;
  if (restored.taunton) { setObjectives([{ text: 'Taunton is restored. Drive home from the truck.', check: () => false }]); return; }
  setObjectives([{ text: 'Reach the boss stage door past the dock', check: () => stage.active }, { text: 'Clear the stage', check: () => restored.taunton }, { text: 'Drive home from the truck', check: () => false }]);
}
const STAGE_STEPS = [
  { name: 'Delivery under pressure', time: 32 },
  { name: 'Scan sequence', time: 26 },
  { name: 'Boss', time: 0 },
];
function updateDoors(dt) {
  const def = WORLD.def; const cabX = WORLD.truckX + 450;
  const nearTruck = Math.abs(player.x - cabX) < 60 && player.onGround && !stage.active;
  WORLD.nearTruck = nearTruck;
  if (nearTruck && edge.use && !shop.open && !talk.open && !talk.justClosed) {
    const why = def.driveRequires ? def.driveRequires() : null;
    if (why) { restoredBanner.t = 2.5; restoredBanner.text = why; }
    else if (def.driveOptions) { const opts = def.driveOptions().map(o => ({ label: o.label, fn: () => startDrive(o.to) })).concat([{ label: 'Stay', fn: null }]); say(null, 'Where to? The network map shows ' + (opts.length - 1) + ' route' + (opts.length === 2 ? '' : 's') + ' open.', opts); }
    else startDrive(def.driveTo);
    return;
  }
  const d = def.door; if (!d) return;
  d.t = (d.t || 0) + dt;
  if (stage.active) { updateStage(dt); return; }
  if (restored[WORLD.id]) return;
  if (player.x > d.x - 30 && player.x < d.x + 10 && player.onGround) {
    if (crew.length < d.minCrew) { player.x = d.x - 32; player.vx = -120; restoredBanner.t = 3; restoredBanner.text = 'Boss stage — bring a crew of three. Free the teammate here, or bring more from Easton.'; return; }
    startStage(d);
  }
}
function startStage(d) {
  stage.active = true; stage.door = d; stage.step = 0; stage.t = 0; stage.fails = 0;
  arena.active = true; arena.x0 = d.x0; arena.x1 = d.x1; arena.door = d; arena.boss = null;
  player.x = d.x0 + 40; player.y = groundYAt(player.x); player.vy = 0; player.vx = 0; player.carry = null; for (const f of crew) { f.x = player.x - 20 - 20 * Math.random(); f.y = player.y; f.vy = 0; }
  beginStep();
}
function clearStageEnemies() { for (let i = enemies.length - 1; i >= 0; i--) { enemies[i].dead = true; enemies.splice(i, 1); } waveState.alive = 0; projs.length = 0; summons.length = 0; beams.length = 0; }
function beginStep() {
  if (beginStepGeneric()) return;
  if (beginStepWorld()) return;
  const d = stage.door, s = STAGE_STEPS[stage.step];
  clearStageEnemies(); packages.length = 0; scanTargets.length = 0; stage.spawnT = 2; stage.timer = s.time; stage.stepT = 0;
  restoredBanner.t = 3; restoredBanner.text = (stage.step + 1) + ' / 3  ·  ' + s.name;
  if (stage.step === 0) { stage.pkg = spawnPackage(d.x0 + 30, groundYAt(d.x0 + 30), 'RECV'); stage.delivered = false; stage.sal.x = d.x1 - 60; stage.sal.y = groundYAt(stage.sal.x); stage.sal.acceptsPackage = () => { stage.delivered = true; say(stage.sal, 'Sal: "Got it. Now the scans — and watch the fog."'); }; }
  if (stage.step === 1) { stage.scans = [addScan(d.x0 + 170, groundYAt(d.x0 + 170), 'SKU 02781'), addScan(d.x0 + 430, groundYAt(d.x0 + 430), 'SKU 51810'), addScan(d.x0 + 690, groundYAt(d.x0 + 690), 'SKU 10234')]; }
  if (stage.step === 2) { const b = spawnBoss(d.boss, d.x1 - 160, groundYAt(d.x1 - 160)); arena.boss = b; if (b) b.tx = clamp(player.x + 320, d.x0 + 60, d.x1 - 60); if (d.boss === 'fogserver') weather = 1; }
}
function failStage(reason) {
  stage.fails++; stage.step = 0;
  player.x = stage.door.x0 + 40; player.y = groundYAt(player.x); player.vx = 0; player.vy = 0; player.hp = player.maxHp; player.inv = 1.5; player.dead = 0; player.carry = null;
  for (const f of crew) { f.x = player.x - 20; f.y = player.y; f.vx = 0; f.vy = 0; }
  beginStep();
  restoredBanner.t = 3.5; restoredBanner.text = reason + '  ·  stage restarts from the top';
}
function updateStage(dt) {
  if (updateStageGeneric(dt)) return;
  if (updateStageWorld(dt)) return;
  const s = STAGE_STEPS[stage.step]; stage.stepT += dt;
  if (s.time) { stage.timer -= dt; if (stage.timer <= 0) { failStage('Out of time'); return; } }
  // harassment spawns during challenges
  if (stage.step < 2) { stage.spawnT -= dt; if (stage.spawnT <= 0) { stage.spawnT = stage.step === 0 ? 5 : 4; spawnGroup(player.x, stage.step === 0 ? ['flicker', 'flicker'] : ['jitter', 'flicker']); } }
  if (stage.step === 0 && stage.delivered) { stage.step = 1; grantSkill('challenge'); beginStep(); return; }
  if (stage.step === 1 && stage.scans.every(x => x.done)) { stage.step = 2; grantSkill('challenge'); beginStep(); return; }
}
function grantSkill(kind) { for (const m of crewAll()) SKILL[m.hero.name] = skillOf(m.hero) + 1; banner('Crew skill up  ·  everyone +1', 2.5); }
function onBossDead(e) {
  arena.active = false; stage.active = false; forklift.mounted = false; forklift.present = false; bossProjs.length = 0;
  waveState.paused = true;
  restored[WORLD.id] = true; if (WORLD.id === 'merge') { story.cutoverKey = true; }
  grantSkill('boss');
  containers.length = 0; SOLIDS = WORLD.def.solids();
  restoredBanner.t = 4.5; restoredBanner.text = WORLD.name.toUpperCase() + ' RESTORED  ·  ' + WORLD.def.driveLabel.toLowerCase() + ' from the truck';
  bucks.n += 40; bucks.total += 40;
  for (let i = 0; i < 30; i++) shards.push({ x: e.x, y: e.y - 30, vx: rnd(-300, 300), vy: rnd(-400, -100), t: 0, v: 1 });
  if (WORLD.id === 'taunton') weather = 0;
}
function drawDoors() {
  const d = WORLD.def.door;
  if (d) {
    const done = restored[WORLD.id];
    ctx.save(); ctx.translate(d.x, groundYAt(d.x));
    const a = done ? 0.35 : 0.85 + 0.15 * Math.sin((d.t || 0) * 4);
    ctx.fillStyle = '#243447'; rr(ctx, -30, -120, 12, 120, 3); ctx.fill(); rr(ctx, 18, -120, 12, 120, 3); ctx.fill();
    if (!done) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const fg = ctx.createLinearGradient(-18, 0, 18, 0); fg.addColorStop(0, rgba([200, 130, 255], 0.05)); fg.addColorStop(0.5, rgba([200, 130, 255], 0.35 * a)); fg.addColorStop(1, rgba([200, 130, 255], 0.05)); ctx.fillStyle = fg; ctx.fillRect(-18, -116, 36, 116); for (let k = 0; k < 5; k++) { const y = -116 + (((d.t || 0) * 50 + k * 23) % 116); ctx.fillStyle = rgba([60, 220, 255], 0.35); ctx.fillRect(-18, y, 36, 1.5); } ctx.restore(); }
    else { ctx.fillStyle = rgba([120, 255, 140], 0.9); ctx.beginPath(); ctx.arc(-24, -126, 4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(24, -126, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = 'rgba(16,26,46,.75)'; rr(ctx, -66, -150, 132, 22, 6); ctx.fill(); ctx.fillStyle = done ? '#7fe0a0' : '#f2b544'; ctx.font = 'bold 10px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(done ? 'CLEARED' : 'BOSS STAGE  ·  ' + d.name, 0, -135);
    ctx.restore();
  }
  if (WORLD.nearTruck) { const cabX = WORLD.truckX + 450; ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, cabX - 70, 250, 140, 20, 6); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('E  ·  ' + WORLD.def.driveLabel, cabX, 264); }
  ctx.textAlign = 'left';
}
function drawStageHUD() {
  if (restoredBanner.t > 0 && demo.active) restoredBanner.t -= 1 / 60;
  else if (restoredBanner.t > 0) { restoredBanner.t -= 1 / 60; const a = Math.min(1, restoredBanner.t); ctx.textAlign = 'center'; ctx.font = 'bold 20px Georgia, serif'; const tw = ctx.measureText(restoredBanner.text).width; ctx.fillStyle = 'rgba(16,26,46,.6)'; rr(ctx, W / 2 - tw / 2 - 16, 92, tw + 32, 32, 8); ctx.fill(); ctx.fillStyle = rgba([242, 181, 68], a); ctx.fillText(restoredBanner.text, W / 2, 115); }
  if (stage.active) {
    const s = stageStepsOf(WORLD.def)[stage.step];
    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(16,26,46,.6)'; rr(ctx, W / 2 - 160, 132, 320, 30, 8); ctx.fill();
    if (stage.step < 2) { ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(W / 2 - 150, 138, 300, 8); ctx.fillStyle = stage.timer < 8 ? '#ff8a5a' : '#7fe0ff'; ctx.fillRect(W / 2 - 150, 138, 300 * clamp(stage.timer / s.time, 0, 1), 8); ctx.fillStyle = '#f6ecd8'; ctx.font = 'bold 10px system-ui, sans-serif'; ctx.fillText((stage.step + 1) + '/3  ' + s.name + '  ·  ' + Math.ceil(stage.timer) + 's', W / 2, 157); }
    else { const b = arena.boss; if (b && !b.dead) { ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(W / 2 - 150, 138, 300, 8); ctx.fillStyle = b.targetable ? '#ff8a5a' : 'rgba(255,138,90,.4)'; ctx.fillRect(W / 2 - 150, 138, 300 * b.hp / b.maxHp, 8); ctx.fillStyle = '#f6ecd8'; ctx.font = 'bold 10px system-ui, sans-serif'; ctx.fillText('3/3  ' + stage.door.name + (b.targetable ? '' : '  ·  ' + (({ fogserver: 'hiding in the fog', peachpit: 'rolling', drainpipe: 'down the drain', snowdrift: 'charging', gale: 'blades spinning', hydra: 'heads down', crane: 'hook is up', gate: 'hold the door  ·  breaches ' + (stage.breaches || 0) })[b.type] || 'out of reach')), W / 2, 157); } }
    if (stage.fails) { ctx.font = '10px system-ui, sans-serif'; ctx.fillStyle = 'rgba(246,236,216,.6)'; ctx.fillText('attempt ' + (stage.fails + 1), W / 2, 174); }
  }
  ctx.textAlign = 'left';
}
/* ---------- the drive ---------- */
const drive = { t: 0, dur: 24, from: null, to: null, x: 0, hop: 0, vy: 0, cargo: 100, obs: [], next: 1, honk: 0, done: false, hits: 0, msgs: [] };
function startDrive(toId) {
  const def = WORLD.def; talk.open = false;
  drive.t = 0; drive.from = WORLD.id; drive.to = toId; drive.x = 0; drive.hop = 0; drive.vy = 0; drive.cargo = 100; drive.obs.length = 0; drive.next = 1.2; drive.honk = 0; drive.done = false; drive.hits = 0; drive.startHour = hour; drive.hours = def.driveHours;
  drive.label = WORLD_DEFS[toId].name; drive.miles = toId === 'easton' ? (def.miles || ({ taunton: 300, spartanburg: 640 })[def.id] || 300) : (WORLD_DEFS[toId].miles || ({ taunton: 300, spartanburg: 640 })[toId] || 300); drive.wheel = 0;
  drive.farFrom = { ridge: LAYERS.ridge, hills: LAYERS.hills, trees: LAYERS.trees };
  WORLD_DEFS[toId].far(); drive.farTo = { ridge: LAYERS.ridge, hills: LAYERS.hills, trees: LAYERS.trees };
  mode = 'drive'; timeAuto = false;
}
const DRIVE_SPEED = 430;
function updateDrive(dt) {
  drive.t += dt; drive.x += DRIVE_SPEED * dt; drive.wheel += dt * 14;
  hour = ((drive.startHour + drive.hours * Math.min(1, drive.t / drive.dur)) % 24 + 24) % 24;
  // hop
  if (edge.jump && drive.hop === 0) { drive.vy = -560; drive.hop = 0.01; }
  if (drive.hop > 0) { drive.vy += 1900 * dt; drive.hop += drive.vy * dt; if (drive.hop >= 0) { drive.hop = 0; drive.vy = 0; shake = Math.max(shake, 0.08); puff(0, 0, 0); } }
  if (drive.honk > 0) drive.honk -= dt;
  if (edge.dash && drive.honk <= 0) { drive.honk = 0.9; sfx('honk'); for (const o of drive.obs) if (o.k === 'flicker' && o.x - drive.x > 0 && o.x - drive.x < 340) o.scatter = 1; }
  // spawn obstacles ahead
  drive.next -= dt;
  if (drive.next <= 0 && drive.t < drive.dur - 3) { drive.next = rnd(0.9, 1.7) - Math.min(0.5, drive.t * 0.015); const r = Math.random(); drive.obs.push({ k: r < 0.4 ? 'flicker' : r < 0.7 ? 'pothole' : 'crate', x: drive.x + W + 120, hit: false, t: 0, scatter: 0 }); }
  for (let i = drive.obs.length - 1; i >= 0; i--) {
    const o = drive.obs[i]; o.t += dt; if (o.scatter > 0) { o.scatter += dt * 3; if (o.scatter > 2) { drive.obs.splice(i, 1); continue; } }
    const rel = o.x - drive.x; if (rel < -200) { drive.obs.splice(i, 1); continue; }
    if (!o.hit && o.scatter === 0 && rel > 170 && rel < 300 && drive.hop === 0) { o.hit = true; drive.cargo = Math.max(0, drive.cargo - 14); drive.hits++; shake = Math.max(shake, 0.25); bucks.n = Math.max(0, bucks.n - 2); drive.msgs.push({ t: 0, s: o.k === 'flicker' ? 'A+ scout on the road!' : o.k === 'pothole' ? 'Pothole. Cargo shifted.' : 'Crate on the shoulder.' }); }
  }
  for (let i = drive.msgs.length - 1; i >= 0; i--) { drive.msgs[i].t += dt; if (drive.msgs[i].t > 1.4) drive.msgs.splice(i, 1); }
  if (shake > 0) shake -= dt;
  if (drive.t >= drive.dur && !drive.done) { drive.done = true; loadWorld(drive.to); timeAuto = true; restoredBanner.t = 3; restoredBanner.text = WORLD.name.toUpperCase() + '  ·  ' + (drive.cargo >= 80 ? 'cargo intact' : drive.cargo >= 40 ? 'cargo a little shaken' : 'cargo took a beating'); }
}
function renderDrive() {
  const sk = skyAt(hour), night = nightness(hour); const prog = Math.min(1, drive.t / drive.dur);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgb(sk.top)); g.addColorStop(0.5, rgb(mix(sk.top, sk.hor, 0.45))); g.addColorStop(0.8, rgb(sk.hor)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (night > 0.35) { ctx.fillStyle = rgba([255, 255, 255], (night - 0.35)); for (let i = 0; i < 60; i++) ctx.fillRect((i * 137.5 + 20 - drive.x * 0.01) % W, (i * 71.3) % (H * 0.45), 1.5, 1.5); }
  const camSave = camera.x; camera.x = drive.x;
  drawTiled(LAYERS.clouds, 0.06, 20, mix(sk.hor, [255, 255, 255], 0.55 - night * 0.5), 0.8 - night * 0.45, gameTime * 4);
  // crossfade far layers from → to
  const A = drive.farFrom, B = drive.farTo, fade = clamp((prog - 0.3) / 0.4, 0, 1);
  const tintR = mix(sk.haze, sk.top, 0.42), tintH = mix(sk.haze, [64, 96, 62], 0.6 + night * 0.28);
  if (fade < 1) { drawTiled(A.ridge, 0.12, 30, tintR, 1 - fade); drawTiled(A.hills, 0.28, 90, tintH, 1 - fade); }
  if (fade > 0) { drawTiled(B.ridge, 0.12, 30, tintR, fade); drawTiled(B.hills, 0.28, 90, tintH, fade); }
  { const hz = ctx.createLinearGradient(0, 150, 0, 330); hz.addColorStop(0, rgba(sk.haze, 0)); hz.addColorStop(1, rgba(sk.haze, 0.35)); ctx.fillStyle = hz; ctx.fillRect(0, 150, W, 180); }
  if (fade < 1) drawTiled(A.trees, 0.55, 110, null, 1 - fade); if (fade > 0) drawTiled(B.trees, 0.55, 110, null, fade);
  camera.x = camSave;
  // road
  const ry = 400; ctx.fillStyle = '#4a4d55'; ctx.fillRect(0, ry, W, H - ry); ctx.fillStyle = '#3a3d44'; ctx.fillRect(0, ry, W, 6);
  ctx.fillStyle = '#e9d27a'; const off = (-drive.x * 1.2) % 90; for (let x = off - 90; x < W; x += 90) ctx.fillRect(x, ry + 44, 48, 4);
  ctx.fillStyle = '#9aa0a8'; const goff = (-drive.x * 1.2) % 60; for (let x = goff - 60; x < W; x += 60) ctx.fillRect(x, ry - 22, 4, 22); ctx.fillRect(0, ry - 24, W, 4);
  // mile markers
  const mk = (-drive.x * 1.2) % 700; ctx.fillStyle = '#1e6e3a'; rr(ctx, mk + 500, ry - 80, 110, 34, 4); ctx.fill(); ctx.fillStyle = '#2c3038'; ctx.fillRect(mk + 553, ry - 46, 4, 24); ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(drive.label.toUpperCase().split(',')[0], mk + 555, ry - 64); ctx.fillText(Math.max(0, Math.round(drive.miles * (1 - prog))) + ' mi', mk + 555, ry - 52);
  // obstacles
  for (const o of drive.obs) {
    const x = o.x - drive.x + 0; // screen: truck is at ~200..640, obstacles approach from right
    if (o.k === 'pothole') { ctx.fillStyle = '#23252b'; ctx.beginPath(); ctx.ellipse(x + 240, ry + 8, 40, 9, 0, 0, Math.PI * 2); ctx.fill(); }
    else if (o.k === 'crate') { drawCrate(ctx, x + 220, ry - 30); }
    else if (o.k === 'flicker') { const s = o.scatter; const e = { t: o.t, hit: 0, w: 18, h: 18, onGround: true, type: 'flicker', facing: -1, d: ENEMY.flicker }; ctx.save(); ctx.translate(x + 240 - s * 80, ry + 2 - Math.abs(Math.sin(o.t * 12)) * 12 - s * 60); ctx.globalAlpha = 1 - s / 2; ctx.scale(-1, 1); drawEnemy(ctx, Object.assign(e, { x: 0, y: 0 })); ctx.restore(); }
  }
  // truck
  const ty = 270 + drive.hop + Math.sin(drive.t * 22) * (drive.hop === 0 ? 1.2 : 0);
  ctx.save(); ctx.translate(0, ty - 270);
  drawTrailer(ctx, 120, 270, ry);
  // spinning wheel hubs
  ctx.strokeStyle = '#9aa0a8'; ctx.lineWidth = 2; for (const wx of [120 + 72, 120 + 118, 120 + 420 + 24, 120 + 420 + 66]) { for (let k = 0; k < 4; k++) { const a = drive.wheel + k * Math.PI / 2; ctx.beginPath(); ctx.moveTo(wx, ry - 20); ctx.lineTo(wx + Math.cos(a) * 14, ry - 20 + Math.sin(a) * 14); ctx.stroke(); } }
  // crew ride in the back with the door rolled up; hero drives, Biscuit rides shotgun (both clipped into the cab window)
  { const dx = 120 + 4, dy = 270 + 8, dw = 54, dh = 76; ctx.fillStyle = '#141826'; ctx.fillRect(dx, dy, dw, dh); ctx.fillStyle = '#243447'; ctx.fillRect(dx, dy + dh - 12, dw, 12); ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, dh); ctx.clip(); crew.forEach((f, i) => { ctx.save(); ctx.translate(dx + 16 + i * 22, dy + dh - 4); ctx.scale(0.62, 0.62); drawHero(ctx, f.hero, 0, 0, i % 2 ? 1 : -1, { t: gameTime + i, run: 0, moving: false }, null); ctx.restore(); }); ctx.restore(); }
  { const wx = 120 + 420 + 30, wy2 = 270 + 12, ww = 28, wh = 24; ctx.save(); ctx.beginPath(); rr(ctx, wx, wy2, ww, wh, 3); ctx.clip(); ctx.fillStyle = '#1c2a3a'; ctx.fillRect(wx, wy2, ww, wh); ctx.save(); ctx.translate(wx + 16, wy2 + 46); ctx.scale(0.6, 0.6); drawHero(ctx, hero, 0, 0, 1, { t: gameTime, run: 0, moving: false }, null); ctx.restore(); ctx.save(); ctx.translate(wx + 4, wy2 + 26); ctx.scale(0.55, 0.55); drawBiscuit(ctx, { x: 0, y: 0, facing: 1, moving: false, run: 0, t: gameTime, earA: -0.4 + Math.sin(gameTime * 8) * 0.2 }, null); ctx.restore(); ctx.restore(); }
  // headlights at night
  if (night > 0.2) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const hg = ctx.createLinearGradient(600, 350, 900, 350); hg.addColorStop(0, rgba([255, 240, 200], night * 0.45)); hg.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(600, 342); ctx.lineTo(960, 300); ctx.lineTo(960, 396); ctx.lineTo(600, 356); ctx.closePath(); ctx.fill(); ctx.restore(); }
  if (drive.honk > 0) { ctx.fillStyle = rgba([255, 255, 255], drive.honk); ctx.font = 'bold 22px Georgia, serif'; ctx.textAlign = 'left'; ctx.fillText('HONK!', 610, 270 - Math.sin(drive.honk * 10) * 6); }
  ctx.restore();
  // exhaust puffs
  ctx.fillStyle = 'rgba(200,200,210,.25)'; for (let k = 0; k < 4; k++) ctx.beginPath(), ctx.arc(552 - k * 14 - (drive.t * 60 % 14), 250 - k * 8 + drive.hop, 4 + k * 2, 0, Math.PI * 2), ctx.fill();
  // rain/snow not modelled on the drive; keep grain + vignette
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.5, W / 2, H / 2, H); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,10,30,.28)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.35; ctx.drawImage(LAYERS.grain, 0, 0); ctx.restore();
  // HUD
  ctx.textAlign = 'left'; ctx.font = 'bold 14px Georgia, serif'; ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, 14, 14, 380, 30, 8); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.fillText('ON THE ROAD', 26, 34); ctx.font = '12px system-ui, sans-serif'; ctx.fillStyle = '#f6ecd8'; ctx.fillText('to ' + drive.label + '   ·   jump to hop, dash to honk', 156, 34);
  ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, 14, 50, 200, 22, 6); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.font = '11px system-ui, sans-serif'; ctx.fillText('CARGO', 24, 65); ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(74, 56, 128, 10); ctx.fillStyle = drive.cargo > 50 ? '#7fe0ff' : '#ff8a5a'; ctx.fillRect(74, 56, 128 * drive.cargo / 100, 10);
  ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(14, H - 22, W - 28, 6); ctx.fillStyle = '#f2b544'; ctx.fillRect(14, H - 22, (W - 28) * prog, 6);
  drive.msgs.forEach((m, i) => { ctx.textAlign = 'center'; ctx.font = 'bold 14px system-ui, sans-serif'; ctx.fillStyle = rgba([255, 200, 120], 1 - m.t / 1.4); ctx.fillText(m.s, W / 2, 120 + i * 18 - m.t * 20); });
  ctx.textAlign = 'left';
}

/* ---------- bosses ---------- */
ENEMY.fogserver = { hp: 130, w: 84, h: 96, speed: 0, dmg: 1, shards: 0, boss: 1, color: [180, 200, 255] };
function spawnBoss(type, x, y) {
  const e = spawnEnemy(type, x, y); if (!e) return null; sfx('boss');
  e.born = 0; e.targetable = false; e.phase = 'hide'; e.pt = 1.2; e.alpha = 0; e.lastQuarter = 4; e.name = type; e.tx = x; return e;
}
function updateBoss(e, dt) {
  e.t += dt; if (e.hit > 0) e.hit -= dt;
  if (e.type === 'peachpit') { updatePeachPit(e, dt); return; }
  if (ENEMY[e.type] && ['drainpipe', 'snowdrift', 'gale', 'hydra'].includes(e.type)) { updateAct2Boss(e, dt); return; }
  if (['crane', 'gate', 'golem'].includes(e.type)) { updateAct3Boss(e, dt); return; }
  if (e.type === 'queen') { updateQueen(e, dt); return; }
  const dx = player.x - e.x;
  if (e.type === 'fogserver') {
    e.pt -= dt;
    const inFog = e.phase === 'hide';
    e.alpha += ((inFog ? 0.08 : 1) - e.alpha) * Math.min(1, dt * 4);
    e.targetable = !inFog;
    if (e.phase === 'hide') { // drift through the fog to a new spot
      e.vx += clamp(Math.sign(e.tx - e.x) * 170 - e.vx, -500 * dt, 500 * dt); if (Math.abs(e.tx - e.x) < 10) e.vx *= 0.8;
      if (e.pt <= 0) { e.phase = 'tell'; e.pt = 0.8; e.vx = 0; e.facing = Math.sign(dx) || 1; }
    } else if (e.phase === 'tell') { e.vx *= 0.8; if (e.pt <= 0) { e.phase = 'lunge'; e.pt = 0.7; e.facing = Math.sign(dx) || 1; e.vx = e.facing * 520; shake = Math.max(shake, 0.1); } }
    else if (e.phase === 'lunge') { if (e.wall) { e.vx = 0; } if (e.pt <= 0) { e.phase = 'rest'; e.pt = 1.6; e.vx = 0; } }
    else if (e.phase === 'rest') { e.vx *= 0.9; if (e.pt <= 0) { e.phase = 'hide'; e.pt = 1.4 + Math.random(); e.tx = clamp(player.x + (Math.random() < 0.5 ? -1 : 1) * rnd(220, 360), arena.x0 + 60, arena.x1 - 60); } }
    // quarter-health adds
    const q = Math.ceil(e.hp / e.maxHp * 4); if (q < e.lastQuarter) { e.lastQuarter = q; for (let i = 0; i < 3; i++) { const f = spawnEnemy('flicker', e.x + (i - 1) * 30, e.y); if (f) { f.vy = -350; waveState.alive++; } } shake = Math.max(shake, 0.15); }
    e.vy += G * dt; if (e.vy > 900) e.vy = 900; moveBody(e, dt, e.w / 2);
    e.x = clamp(e.x, arena.x0 + e.w / 2, arena.x1 - e.w / 2);
    // contact
    if (player.inv <= 0 && player.dead <= 0 && e.phase !== 'hide') { const ox = Math.abs(e.x - player.x) < (e.w + player.w) / 2 - 4, oy = player.y > e.y - e.h && player.y - player.h < e.y; if (ox && oy && player.dashT <= 0) hurtPlayer(e.d.dmg, e.x); }
    // fog wisps
    if (Math.random() < dt * 8) spawn({ k: 'steam', x: e.x + rnd(-40, 40), y: e.y - rnd(0, 90), vx: rnd(-20, 20), vy: rnd(-10, 10), life: 1.2, t: 0, r: rnd(8, 16) });
  }
}
function drawBoss(c, e) {
  if (e.type === 'peachpit') { drawPeachPit(c, e); return; }
  if (['drainpipe', 'snowdrift', 'gale', 'hydra'].includes(e.type)) { drawAct2Boss(c, e); return; }
  if (['crane', 'gate', 'golem'].includes(e.type)) { drawAct3Boss(c, e); return; }
  if (e.type === 'queen') { drawQueen(c, e); return; }
  c.save(); c.translate(e.x, e.y); c.globalAlpha = e.alpha; c.scale(e.facing, 1);
  const w = e.w, h = e.h, tell = e.phase === 'tell';
  glitchDraw(c, e, (g, tint) => {
    const base = tint ? rgb(tint) : '#1a2030', edge = tint ? rgb(tint) : (e.hit > 0 ? '#fff' : rgb(e.d.color));
    // a server rack on stilt legs
    g.fillStyle = base; g.strokeStyle = edge; g.lineWidth = 2;
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 18, -14); g.lineTo(s * 30 + Math.sin(e.t * 12) * 3 * s, 0); g.stroke(); }
    rr(g, -w / 2, -h, w, h - 14, 6); g.fill(); g.stroke();
    if (!tint) {
      for (let k = 0; k < 6; k++) { const y = -h + 8 + k * 13; g.fillStyle = '#243447'; g.fillRect(-w / 2 + 6, y, w - 12, 9); g.fillStyle = tell ? '#ff5a5a' : (k % 2 ? rgb(e.d.color) : '#7fe0a0'); g.fillRect(w / 2 - 14, y + 2, 4, 4); if (((e.t * 6) | 0) % 6 === k) g.fillRect(w / 2 - 22, y + 2, 4, 4); }
      // the "face": two status LEDs
      g.fillStyle = tell ? '#ff5a5a' : '#fff'; g.fillRect(-14, -h + 30, 6, 6); g.fillRect(6, -h + 30, 6, 6);
      // cables trailing
      g.strokeStyle = edge; g.lineWidth = 1.5; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-w / 2 + 10 + k * 8, -14); g.quadraticCurveTo(-w / 2 + k * 8 - 10, 4 + Math.sin(e.t * 5 + k) * 4, -w / 2 + k * 12 - 16, 10); g.stroke(); }
    }
  });
  c.restore();
}
