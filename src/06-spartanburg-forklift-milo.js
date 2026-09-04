/* =====================================================================
   SPARTANBURG, SC — storm, forklift, Peach Pit, Milo (M5)
   ===================================================================== */
restored.spartanburg = false;
function bakeSpartanburgFar() {
  // Blue Ridge foothills, far
  { const w = 1400, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.beginPath(); g.moveTo(0, h);
    for (let x = 0; x <= w; x += 40) g.lineTo(x, 176 + Math.sin(x * 0.009) * 30 + Math.sin(x * 0.027) * 12); g.lineTo(w, h); g.closePath(); g.fill();
    // the Peachoid (water tower shaped like a peach) on the horizon
    g.fillRect(1000, 168, 8, 50); g.beginPath(); g.arc(1004, 160, 22, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(1012, 140, 10, 4, -0.6, 0, Math.PI * 2); g.fill();
    LAYERS.ridge = c; }
  // orchard rows on rolling red clay
  { const w = 1600, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.beginPath(); g.moveTo(0, h);
    for (let x = 0; x <= w; x += 20) g.lineTo(x, 238 + Math.sin(x * 0.006) * 18); g.lineTo(w, h); g.closePath(); g.fill();
    for (let i = 0; i < 40; i++) { const tx = (i * 41) % w, ty = 238 + Math.sin(tx * 0.006) * 18; g.fillRect(tx - 1, ty - 14, 3, 14); g.beginPath(); g.arc(tx, ty - 18, 9, 0, Math.PI * 2); g.fill(); }
    g.fillRect(500, 200, 40, 40); g.beginPath(); g.moveTo(494, 202); g.lineTo(520, 184); g.lineTo(546, 202); g.closePath(); g.fill(); // packing shed
    LAYERS.hills = c; }
  // pines + big oaks
  { const w = 1200, h = 340, c = mkCanvas(w, h), g = c.getContext('2d');
    for (let i = 0; i < 16; i++) { const tx = i * 76 + (i % 3) * 12, th = 110 + (i * 37) % 60; g.fillStyle = i % 2 ? '#2b4a2a' : '#223d23'; g.fillRect(tx - 3, h - th * 0.5, 6, th * 0.5); if (i % 3 === 0) { for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(tx + Math.sin(i + k) * 10, h - th + k * th * 0.18, 30 - k * 3, 0, Math.PI * 2); g.fill(); } } else { for (let k = 0; k < 5; k++) { const ww = 24 - k * 4; g.beginPath(); g.moveTo(tx - ww, h - th * 0.5 - k * th * 0.12); g.lineTo(tx + ww, h - th * 0.5 - k * th * 0.12); g.lineTo(tx, h - th * 0.5 - (k + 1.6) * th * 0.12); g.closePath(); g.fill(); } } }
    LAYERS.trees = c; }
}
function drawPeachTree(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#5a3a24'; g.beginPath(); g.moveTo(-7, 0); g.quadraticCurveTo(-3, -40, -5, -70); g.lineTo(5, -70); g.quadraticCurveTo(3, -40, 7, 0); g.closePath(); g.fill();
  for (const [cx, cy, r, col] of [[0, -100, 36, '#4f7f3f'], [-30, -88, 26, '#5b8e49'], [30, -90, 28, '#5b8e49'], [0, -120, 22, '#6a9c55']]) { const fg = g.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r); fg.addColorStop(0, lighten(col, 0.22)); fg.addColorStop(0.7, col); fg.addColorStop(1, shade(col, 0.66)); g.fillStyle = fg; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#f28c5a'; for (const [px, py] of [[-20, -84], [12, -96], [28, -78], [-4, -112], [-32, -104]]) { g.beginPath(); g.arc(px, py, 5, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
function drawSpartanburgPlay(g) {
  const gy = WORLD.groundY;
  const gg = g.createLinearGradient(0, gy, 0, H); gg.addColorStop(0, '#7a8f48'); gg.addColorStop(0.06, '#6a7d3d'); gg.addColorStop(0.1, '#9a4f36'); gg.addColorStop(1, '#5a2e22'); // red clay
  g.fillStyle = gg; g.fillRect(0, gy, WORLD.width, H - gy);
  g.fillStyle = '#4d4f57'; g.fillRect(1100, gy, 1500, H - gy); g.fillStyle = '#e9d27a'; for (let x = 1120; x < 2580; x += 70) g.fillRect(x, gy + 26, 30, 3);
  g.strokeStyle = '#8fa554'; g.lineWidth = 2; for (let x = 0; x < WORLD.width; x += 15) { if (x > 1100 && x < 2600) continue; const hh = 5 + (x * 7) % 8; g.beginPath(); g.moveTo(x, gy); g.lineTo(x + 2, gy - hh); g.stroke(); }
  // puddles (storm)
  g.fillStyle = 'rgba(120,150,190,.35)'; for (const [px, pw] of [[400, 90], [900, 60], [2800, 120], [3300, 70]]) { g.beginPath(); g.ellipse(px, gy + 4, pw, 5, 0, 0, Math.PI * 2); g.fill(); }
  // the DC: brick office + white metal warehouse, "SPARTANBURG, SC"
  { const x = 1140, y = 236, w = 460, h = 204; const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#b56a4a'); gr.addColorStop(1, '#8a4a34'); g.fillStyle = gr; g.fillRect(x, y, w, h);
    g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1; for (let yy = y + 8; yy < y + h; yy += 8) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); }
    g.fillStyle = '#5e3a2c'; g.fillRect(x, y, w, 8);
    for (let i = 0; i < 5; i++) { const wx = x + 30 + i * 86; g.fillStyle = '#243447'; rr(g, wx, y + 34, 44, 40, 3); g.fill(); g.fillStyle = 'rgba(200,220,255,.18)'; g.fillRect(wx + 3, y + 37, 18, 34); }
    g.fillStyle = '#1e2c3d'; rr(g, x + 190, y + 80, 100, 124, 5); g.fill(); g.fillStyle = '#f2b544'; g.fillRect(x + 238, y + 84, 6, 116);
    g.fillStyle = '#243447'; rr(g, x + 110, y + 6, 240, 40, 6); g.fill(); g.fillStyle = '#f2b544'; g.font = 'bold 22px Georgia, serif'; g.textAlign = 'center'; g.fillText('PHILLIPS', x + 230, y + 34);
    g.fillStyle = '#e6d7bd'; g.font = '10px system-ui, sans-serif'; g.fillText('SPARTANBURG, SC', x + 230, y + 60); }
  { const x = 1600, y = 226, w = 1000, h = 214; const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#e2e4e6'); gr.addColorStop(1, '#aeb4ba'); g.fillStyle = gr; g.fillRect(x, y, w, h); g.fillStyle = '#7a8088'; g.fillRect(x, y, w, 8);
    g.strokeStyle = 'rgba(0,0,0,.07)'; g.lineWidth = 2; for (let xx = x; xx < x + w; xx += 12) { g.beginPath(); g.moveTo(xx, y + 8); g.lineTo(xx, y + h); g.stroke(); }
    for (let i = 0; i < 2; i++) { const dx = x + 160 + i * 320; g.fillStyle = '#3a4048'; g.fillRect(dx, 300, 100, 92); g.fillStyle = '#4b525b'; for (let k = 0; k < 5; k++) g.fillRect(dx + 2, 302 + k * 18, 96, 16); g.fillStyle = '#2c3038'; rr(g, dx + 36, 318, 28, 10, 3); g.fill(); }
    g.fillStyle = '#5a5e66'; g.fillRect(1720, 392, 600, 48); g.fillStyle = '#e9d27a'; g.fillRect(1720, 392, 600, 4); g.fillRect(1680, 416, 40, 24);
    g.fillStyle = '#e9d27a'; for (let xx = 1720; xx < 2320; xx += 20) g.fillRect(xx, 436, 10, 4); }
  // alley between office and warehouse: a dumpster and a dim lamp
  g.fillStyle = '#1a2230'; g.fillRect(1600, 236, 0, 0); g.fillStyle = '#2f5f3f'; rr(g, 1604, 392, 60, 48, 4); g.fill(); g.fillStyle = '#244a30'; g.fillRect(1604, 392, 60, 8);
  g.fillStyle = '#2c3038'; g.fillRect(1590, 260, 4, 30); g.fillStyle = '#1e2127'; rr(g, 1582, 254, 20, 10, 3); g.fill();
  // peach trees everywhere else
  for (const [tx, s] of [[200, 1.1], [520, 0.9], [760, 1.0], [2760, 1.0], [3050, 0.9], [3320, 1.2], [3900, 1.0], [4150, 0.9]]) drawPeachTree(g, tx, gy, s);
  // foothill steps at the far right
  g.fillStyle = '#7a6a4a'; g.beginPath(); g.moveTo(3560, gy); g.lineTo(3600, gy - 30); g.lineTo(3680, gy - 30); g.lineTo(3680, gy - 60); g.lineTo(3760, gy - 60); g.lineTo(3760, gy - 90); g.lineTo(3880, gy - 90); g.lineTo(3880, gy); g.closePath(); g.fill();
  g.fillStyle = '#8fa554'; g.fillRect(3600, gy - 32, 80, 4); g.fillRect(3680, gy - 62, 80, 4); g.fillRect(3760, gy - 92, 120, 4);
  // truck
  drawTrailer(g, WORLD.truckX, 288, WORLD.groundY);
  // sign
  g.fillStyle = '#2c3038'; g.fillRect(120, 380, 4, 60); g.fillStyle = '#1e6e3a'; rr(g, 40, 364, 164, 30, 4); g.fill(); g.fillStyle = '#fff'; g.font = 'bold 12px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('SPARTANBURG  ·  I-85', 122, 384);
}
WORLD_DEFS.spartanburg = {
  id: 'spartanburg', name: 'Spartanburg, SC', location: 'Spartanburg, South Carolina — Phillips DC', width: 4300, groundY: 440, truckX: 3960 - 420,
  solids: () => [[0, 440, 4300, 200, 0], [1720, 392, 600, 48, 0], [1680, 416, 40, 24, 0], [3540, 288, 420, 92, 0], [3960, 328, 64, 54, 0], [3600, 410, 80, 30, 0], [3680, 380, 80, 60, 0], [3760, 350, 120, 90, 0]],
  lights: () => [{ x: 1370, y: 290, r: 260, color: [242, 181, 68], night: 1, glow: 1 }, { x: 1380, y: 380, r: 190, color: [255, 225, 170], night: 1 }, { x: 1592, y: 258, r: 160, color: [255, 200, 120], night: 1, cone: 1 }, { x: 1810, y: 330, r: 240, color: [255, 200, 120], night: 1, cone: 1 }, { x: 2130, y: 330, r: 240, color: [255, 200, 120], night: 1, cone: 1 }, { x: 3540 + 448, y: 380, r: 90, color: [255, 240, 200], night: 1 }],
  far: bakeSpartanburgFar, play: drawSpartanburgPlay,
  coffee: { x: 1100, y: 440 }, checkpoint: { x: 1060, y: 440 }, spawn: { x: 260, y: 440 }, weather: 2, setup: setupSpartanburg,
  door: { x: 2640, x0: 2680, x1: 3500, boss: 'peachpit', name: 'PEACH PIT', minCrew: 1 },
  driveTo: 'easton', driveLabel: 'DRIVE HOME', driveHours: 12, driveRequires: () => restored.spartanburg ? null : 'The DC is still dark. Clear the boss stage first.',
};
// Taunton now leads on to Spartanburg
WORLD_DEFS.taunton.driveTo = 'spartanburg'; WORLD_DEFS.taunton.driveLabel = 'DRIVE TO SPARTANBURG'; WORLD_DEFS.taunton.driveHours = 13;
WORLD_DEFS.taunton.driveRequires = () => restored.taunton ? null : 'The DC is still dark. Clear the boss stage first.';

/* ---------- Milo the alley cat ---------- */
const MILO = { name: 'Milo', role: 'Alley Cat' };
const catnip = { n: 0, active: 0, cats: [] };
function drawCat(c, x, y, facing, t, hoodie) {
  c.save(); c.translate(x, y); c.scale(facing, 1);
  c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(0, 1, 12, 3, 0, 0, Math.PI * 2); c.fill();
  const body = hoodie ? '#3a3a4a' : '#8a7a6a';
  c.fillStyle = body; rr(c, -12, -16, 22, 12, 6); c.fill();
  c.save(); c.translate(-12, -14); c.rotate(-0.9 + Math.sin(t * 4) * 0.4); c.fillStyle = body; rr(c, -2, -10, 4, 12, 2); c.fill(); c.restore();
  c.fillStyle = hoodie ? '#3a3a4a' : '#8a7a6a'; c.beginPath(); c.arc(10, -18, 7, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.moveTo(5, -23); c.lineTo(4, -30); c.lineTo(9, -25); c.closePath(); c.fill(); c.beginPath(); c.moveTo(12, -24); c.lineTo(15, -31); c.lineTo(16, -23); c.closePath(); c.fill();
  c.fillStyle = '#d8ff4a'; c.fillRect(8, -20, 2, 2); c.fillRect(13, -20, 2, 2);
  c.fillStyle = '#e88'; c.fillRect(10, -16, 2, 1.5);
  for (const s of [-1, 1]) c.fillRect(-8 + (s > 0 ? 12 : 0) + Math.sin(t * 16 + s) * 2, -6, 3, 6);
  c.restore();
}
function addMilo(x, hasAlley) {
  const m = addNPC({ look: Object.assign({ skin: '#8a7a6a', hair: '#3a3a4a', style: 'hoodie', shirt: '#3a3a4a', pants: '#2b2f3a', acc: 'none' }, MILO), x, y: groundYAt(x), facing: -1, cat: true });
  m.onTalk = (n) => {
    const lines = hasAlley ? 'Milo: "Psst. You want the good stuff? Organic. Locally grown. Twenty shards a bag."' : 'Milo: "You again. Same deal — twenty shards. Don\'t tell the dog."';
    say(n, lines, [{ label: 'Buy Meowijuana ($20)', fn: () => { if (bucks.n >= 20) { bucks.n -= 20; catnip.n++; banner('Meowijuana ×' + catnip.n + '  ·  press X to throw', 3); } else { say(n, 'Milo: "Twenty. Shards. Come back when you\'ve got \'em."'); } } }, { label: 'What is it?', fn: () => say(n, 'Milo: "It\'s catnip, man. Throw a bag and every cat in the county comes running. The Static hates it."') }, { label: 'No thanks', fn: null }]);
  };
  return m;
}
function throwCatnip() {
  if (catnip.n <= 0 || catnip.active > 0) return;
  catnip.n--; catnip.active = 7; catnip.cats.length = 0;
  for (let i = 0; i < 12; i++) { const side = i % 2 ? -1 : 1; catnip.cats.push({ x: player.x - side * (W / 2 + 60 + i * 30), y: groundYAt(player.x), vx: side * rnd(360, 520), t: rnd(0, 5), tick: 0 }); }
  banner('MEOWIJUANA!', 1.5); dog.grr = 7;
  spawn({ k: 'flash', x: player.x, y: player.y - 30, life: 0.3, t: 0, c: [216, 255, 74] });
}
function updateCatnip(dt) {
  if (dog.grr > 0) dog.grr -= dt;
  if (catnip.active <= 0) return;
  catnip.active -= dt;
  for (const c of catnip.cats) {
    c.x += c.vx * dt; c.t += dt; c.y = groundYAt(c.x); c.tick -= dt;
    if (c.tick <= 0) { c.tick = 0.2; forEnemiesNear(c.x, c.y - 10, 40, e => { if (Math.abs(e.x - c.x) < 30 && e.y > c.y - 40) damageEnemy(e, 3, c.x - c.vx); }); }
    if (Math.abs(c.x - player.x) > W) c.vx *= -1;
  }
}
function drawCats() { if (catnip.active <= 0) return; for (const c of catnip.cats) drawCat(ctx, c.x, c.y, Math.sign(c.vx), c.t, false); }

/* ---------- forklift ---------- */
const forklift = { present: false, x: 0, y: 440, vx: 0, vy: 0, w: 70, h: 40, facing: 1, mounted: false, forksUp: false, pallet: null, wall: 0, onGround: true, t: 0, rams: 0, horn: 0 };
const liftPallets = []; // {x, y(bottom), carried}
function placeForklift(x) { forklift.present = true; forklift.x = x; forklift.y = groundYAt(x); forklift.vx = 0; forklift.mounted = false; forklift.forksUp = false; forklift.pallet = null; forklift.rams = 0; }
function forkFront() { return forklift.x + forklift.facing * 44; }
function forkY() { return forklift.y + (forklift.forksUp ? -76 : -6); }
function rebuildPalletSolids() { SOLIDS = WORLD.def.solids().concat(liftPallets.filter(p => !p.carried).map(p => [p.x - 30, p.y - 14, 60, 14, 1])); }
function updateForklift(dt) {
  if (!forklift.present) return;
  forklift.t += dt; if (forklift.horn > 0) forklift.horn -= dt;
  const nearF = Math.abs(player.x - forklift.x) < 60 && Math.abs(player.y - forklift.y) < 40;
  forklift.near = nearF && !forklift.mounted;
  if (!forklift.mounted) {
    if (nearF && edge.use && !player.carry && !talk.open && !nearPackage() && !nearScan() && !WORLD.nearNPC) { forklift.mounted = true; player.vx = 0; }
    forklift.vx *= 0.9;
  } else {
    if (edge.use) { forklift.mounted = false; player.x = forklift.x - forklift.facing * 50; player.y = forklift.y; player.vy = -200; }
    const dir = tk.right - tk.left; forklift.vx += clamp(dir * 260 - forklift.vx, -900 * dt, 900 * dt); if (dir) forklift.facing = dir;
    if (edge.jump) { forklift.forksUp = !forklift.forksUp; if (forklift.pallet) { /* carried pallet moves with forks */ } else { tryPickPallet(); } }
    if (edge.dash) { if (forklift.pallet) dropPallet(); else forklift.horn = 0.8; }
    // ramming
    if (Math.abs(forklift.vx) > 120) forEnemiesNear(forkFront(), forklift.y - 20, 60, e => { if (e.d.boss) return; if (Math.abs(e.x - forkFront()) < 34 && e.y > forklift.y - 60 && !e.rammed) { if (damageEnemy(e, 6, forklift.x)) { e.rammed = 0.4; e.vx = forklift.facing * 320; e.vy = -260; forklift.rams++; shake = Math.max(shake, 0.1); } } });
    for (const e of enemies) if (e.rammed > 0) e.rammed -= dt;
  }
  forklift.vy += G * dt; if (forklift.vy > 900) forklift.vy = 900;
  moveBody(forklift, dt, forklift.w / 2);
  if (arena.active) forklift.x = clamp(forklift.x, arena.x0 + 40, arena.x1 - 40);
  if (forklift.mounted) { player.x = forklift.x; player.y = forklift.y; player.vx = 0; player.vy = 0; player.onGround = true; player.facing = forklift.facing; }
  if (forklift.pallet) { forklift.pallet.x = forkFront(); forklift.pallet.y = forkY(); }
}
function tryPickPallet() { for (const p of liftPallets) { if (p.carried) continue; if (Math.abs(p.x - forkFront()) < 44 && Math.abs(p.y - forkY()) < 26) { p.carried = true; forklift.pallet = p; rebuildPalletSolids(); return; } } }
function dropPallet() { const p = forklift.pallet; if (!p) return; p.carried = false; forklift.pallet = null; p.x = forkFront() + forklift.facing * 10; p.y = Math.min(groundYAt(p.x), forkY()); rebuildPalletSolids(); puff(p.x, p.y, 6); }
function drawForklift(c, night) {
  if (!forklift.present) return;
  const f = forklift; c.save(); c.translate(f.x, f.y); c.scale(f.facing, 1);
  c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 2, 40, 5, 0, 0, Math.PI * 2); c.fill();
  // mast
  c.fillStyle = '#2c3038'; c.fillRect(24, -96, 6, 96); c.fillRect(34, -96, 6, 96); c.fillStyle = '#1e2127'; c.fillRect(24, -98, 16, 4);
  // forks (carriage slides)
  const fy = f.forksUp ? -76 : -6; c.fillStyle = '#9aa0a8'; c.fillRect(22, fy - 6, 8, 12); c.fillRect(28, fy, 30, 4); c.fillRect(28, fy + 5, 30, 3);
  // body
  c.fillStyle = '#f2b544'; rr(c, -34, -34, 60, 30, 6); c.fill(); c.fillStyle = '#c8912e'; rr(c, -34, -10, 60, 8, 3); c.fill();
  c.fillStyle = '#243447'; rr(c, -30, -58, 40, 26, 4); c.fill(); // cab frame
  c.fillStyle = '#2c3038'; c.fillRect(-30, -60, 44, 3); c.fillRect(-30, -60, 3, 30); c.fillRect(10, -60, 3, 30);
  c.fillStyle = '#e63946'; c.fillRect(-36, -30, 4, 8); c.fillStyle = f.mounted && Math.floor(f.t * 3) % 2 ? '#ffb020' : '#7a5a10'; c.beginPath(); c.arc(-8, -64, 4, 0, Math.PI * 2); c.fill(); // beacon
  for (const wx of [-22, 10]) { c.fillStyle = '#1b1d22'; c.beginPath(); c.arc(wx, -8, 11, 0, Math.PI * 2); c.fill(); c.fillStyle = '#6a6d75'; c.beginPath(); c.arc(wx, -8, 4, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#9aa0a8'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(wx, -8); c.lineTo(wx + Math.cos(f.x * 0.09) * 9, -8 + Math.sin(f.x * 0.09) * 9); c.stroke(); }
  c.restore();
  if (f.mounted) { c.save(); c.translate(f.x - f.facing * 6, f.y - 22); c.scale(0.8, 0.8); drawHero(c, hero, 0, 0, f.facing, { t: f.t, run: 0, moving: false }, null); c.restore(); }
  if (f.horn > 0) { c.fillStyle = rgba([255, 255, 255], f.horn); c.font = 'bold 14px Georgia, serif'; c.textAlign = 'center'; c.fillText('BEEP BEEP', f.x, f.y - 106); }
  if (f.near) { c.fillStyle = 'rgba(16,26,46,.7)'; rr(c, f.x - 40, f.y - 120, 80, 18, 5); c.fill(); c.fillStyle = '#f2b544'; c.font = 'bold 10px system-ui, sans-serif'; c.textAlign = 'center'; c.fillText('E  ·  FORKLIFT', f.x, f.y - 107); }
  if (f.mounted) { c.fillStyle = 'rgba(16,26,46,.6)'; rr(c, W / 2 - 150, H - 96, 300, 20, 6); c.fill(); }
  for (const p of liftPallets) { c.save(); c.translate(p.x, p.y); drawPallet(c, -30, -28); c.restore(); }
  c.textAlign = 'left';
}
function drawForkliftHUD() { if (forklift.mounted) { ctx.textAlign = 'center'; ctx.font = '11px system-ui, sans-serif'; ctx.fillStyle = 'rgba(16,26,46,.6)'; rr(ctx, W / 2 - 170, H - 100, 340, 22, 6); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.fillText('FORKLIFT  ·  jump: forks up/down  ·  dash: drop / horn  ·  E: hop off  ·  rammed: ' + forklift.rams, W / 2, H - 85); ctx.textAlign = 'left'; } }

/* ---------- Spartanburg setup + stage ---------- */
function setupSpartanburg() {
  addNPC({ look: { name: 'Dot', role: 'Forklift', skin: '#f1c9a5', hair: '#7a6a5c', style: 'cap', shirt: '#f2b544', pants: '#2b2f3a', acc: 'vest' }, x: 2000, y: 392, facing: -1, lines: ['Dot: "Storm knocked the wrapper loose. It\'s back there spinning like it\'s got somewhere to be."', 'Dot: "Forklift\'s yours if you want it. Jump lifts the forks. Don\'t tip it."'] });
  addMilo(1632, true);
  placeForklift(2420); liftPallets.length = 0;
  catnip.active = 0;
  if (restored.spartanburg) { setObjectives([{ text: 'Spartanburg is restored. Drive home from the truck.', check: () => false }]); return; }
  setObjectives([{ text: 'Reach the boss stage door past the dock', check: () => stage.active }, { text: 'Clear the stage', check: () => restored.spartanburg }, { text: 'Drive home from the truck', check: () => false }]);
  addEncounter(700, ['flicker', 'flicker', 'jitter']);
}
const STAGE_STEPS_BY_WORLD = {
  taunton: STAGE_STEPS,
  spartanburg: [
    { name: 'Storm delivery', time: 34 },
    { name: 'Forklift: ram 5 machines', time: 45 },
    { name: 'Boss', time: 0 },
  ],
};
function stageSteps() { return STAGE_STEPS_BY_WORLD[WORLD.id] || STAGE_STEPS; }
function beginStepWorld() {
  const d = stage.door, s = stageSteps()[stage.step];
  if (WORLD.id !== 'spartanburg') return false;
  clearStageEnemies(); packages.length = 0; scanTargets.length = 0; stage.spawnT = 2; stage.timer = s.time; stage.stepT = 0;
  restoredBanner.t = 3; restoredBanner.text = (stage.step + 1) + ' / 3  ·  ' + s.name;
  const dot = npcs.find(n => n.look.name === 'Dot');
  if (stage.step === 0) { stage.pkg = spawnPackage(d.x0 + 30, groundYAt(d.x0 + 30), 'ORCHARD'); stage.delivered = false; if (dot) { dot.x = d.x1 - 60; dot.y = groundYAt(dot.x); dot.acceptsPackage = () => { stage.delivered = true; say(dot, 'Dot: "Dry, mostly. Now grab the lift — there\'s machines in the yard and I want them gone. Crew holds fire around the forklift. House rule."'); }; } forklift.present = false; }
  if (stage.step === 1) { placeForklift(d.x0 + 120); forklift.rams = 0; liftPallets.length = 0; rebuildPalletSolids(); }
  if (stage.step === 2) { forklift.mounted = false; forklift.present = false; const b = spawnBoss(d.boss, d.x1 - 160, groundYAt(d.x1 - 160)); arena.boss = b; if (b) b.tx = clamp(player.x + 320, d.x0 + 60, d.x1 - 60); }
  return true;
}
function updateStageWorld(dt) {
  if (WORLD.id !== 'spartanburg') return false;
  const s = stageSteps()[stage.step]; stage.stepT += dt;
  if (s.time) { stage.timer -= dt; if (stage.timer <= 0) { failStage('Out of time'); return true; } }
  if (stage.step === 0) { stage.spawnT -= dt; if (stage.spawnT <= 0) { stage.spawnT = 5; spawnGroup(player.x, ['flicker', 'flicker']); } if (stage.delivered) { stage.step = 1; grantSkill('challenge'); beginStep(); } }
  else if (stage.step === 1) { stage.spawnT -= dt; if (stage.spawnT <= 0) { stage.spawnT = 1.9; spawnGroup(player.x, ['flicker', 'flicker', 'packet']); } if (forklift.rams >= 5) { stage.step = 2; grantSkill('challenge'); beginStep(); } }
  return true;
}

/* ---------- Peach Pit — a spinning stretch-wrap turntable ---------- */
ENEMY.peachpit = { hp: 210, w: 90, h: 80, speed: 0, dmg: 1, shards: 0, boss: 1, color: [255, 170, 110] };
const bossProjs = [];
function updatePeachPit(e, dt) {
  e.pt -= dt; e.spin = (e.spin || 0) + dt * (e.phase === 'roll' ? 14 : 5);
  e.alpha = 1;
  if (e.phase === 'hide') { e.phase = 'idle'; e.pt = 1.2; }
  if (e.phase === 'idle') { e.targetable = true; e.vx *= 0.85; if (e.pt <= 0) { e.phase = (!e.threwOnce || Math.random() < 0.55) ? 'throw' : 'wind'; e.threwOnce = true; e.pt = e.phase === 'throw' ? 1.5 : 0.9; e.thrown = 0; } }
  else if (e.phase === 'throw') { e.targetable = true; if (e.thrown < 3 && e.pt < 1.2 - e.thrown * 0.4) { e.thrown++; const dx = player.x - e.x; const T = 0.9; bossProjs.push({ x: e.x, y: e.y - 60, vx: dx / T + rnd(-40, 40), vy: -0.5 * G * T - 40, t: 0, r: 8 }); } if (e.pt <= 0) { e.phase = 'idle'; e.pt = 1.0; } }
  else if (e.phase === 'wind') { e.targetable = true; e.facing = Math.sign(player.x - e.x) || 1; if (e.pt <= 0) { e.phase = 'roll'; e.pt = 1.4; e.vx = e.facing * 420; } }
  else if (e.phase === 'roll') { e.targetable = false; if (e.wall || e.pt <= 0) { e.phase = 'dizzy'; e.pt = 2.2; e.vx = 0; shake = Math.max(shake, 0.2); puff(e.x, e.y, 10); } }
  else if (e.phase === 'dizzy') { e.targetable = true; e.weak = 0.2; if (e.pt <= 0) { e.phase = 'idle'; e.pt = 0.6; } }
  const q = Math.ceil(e.hp / e.maxHp * 4); if (q < e.lastQuarter) { e.lastQuarter = q; for (let i = 0; i < 2; i++) { const f = spawnEnemy('jitter', e.x + (i ? 40 : -40), e.y); if (f) { f.vy = -350; waveState.alive++; } } }
  e.vy += G * dt; if (e.vy > 900) e.vy = 900; moveBody(e, dt, e.w / 2);
  e.x = clamp(e.x, arena.x0 + e.w / 2, arena.x1 - e.w / 2);
  if (player.inv <= 0 && player.dead <= 0 && !forklift.mounted) { const ox = Math.abs(e.x - player.x) < (e.w + player.w) / 2 - 6, oy = player.y > e.y - e.h && player.y - player.h < e.y; if (ox && oy && player.dashT <= 0) hurtPlayer(e.phase === 'roll' ? 2 : 1, e.x); }
}
function updateBossProjs(dt) {
  for (let i = bossProjs.length - 1; i >= 0; i--) { const p = bossProjs[i]; p.t += dt; p.vy += G * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    if (player.inv <= 0 && player.dead <= 0 && Math.abs(p.x - player.x) < 16 && p.y > player.y - player.h && p.y < player.y) { hurtPlayer(1, p.x); bossProjs.splice(i, 1); continue; }
    if (p.y >= groundYAt(p.x) || p.t > 4) { for (let k = 0; k < 5; k++) spawn({ k: 'spark', x: p.x, y: p.y, vx: rnd(-120, 120), vy: rnd(-160, 0), life: 0.4, t: 0, c: [255, 170, 110] }); bossProjs.splice(i, 1); } }
}
function drawBossProjs() { for (const p of bossProjs) { if (p.glitch) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,150,60,.9)'; ctx.fillRect(p.x - 6 + Math.sin(p.t * 40) * 3, p.y - 4, 12, 8); ctx.fillStyle = 'rgba(60,220,255,.6)'; ctx.fillRect(p.x - 6 - Math.sin(p.t * 40) * 3, p.y - 2, 12, 4); ctx.restore(); continue; } if (p.water) { ctx.fillStyle = 'rgba(120,200,255,.85)'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 7, 5, Math.atan2(p.vy, p.vx), 0, Math.PI * 2); ctx.fill(); continue; } ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t * 8); ctx.fillStyle = '#f28c5a'; ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#e06a3a'; ctx.beginPath(); ctx.arc(2, 2, p.r * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#5b8e49'; ctx.beginPath(); ctx.ellipse(-3, -p.r, 4, 2, -0.6, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } }
function drawPeachPit(c, e) {
  c.save(); c.translate(e.x, e.y);
  const w = e.w, h = e.h, dizzy = e.phase === 'dizzy', wind = e.phase === 'wind';
  glitchDraw(c, e, (g, tint) => {
    const base = tint ? rgb(tint) : '#2a2230', edge = tint ? rgb(tint) : (e.hit > 0 ? '#fff' : rgb(e.d.color));
    // turntable base
    g.fillStyle = base; g.strokeStyle = edge; g.lineWidth = 2; rr(g, -w / 2, -18, w, 18, 5); g.fill(); g.stroke();
    // the spinning pallet of peach crates wrapped in stretch film
    g.save(); g.translate(0, -18); const sx = Math.cos(e.spin); g.scale(Math.max(0.15, Math.abs(sx)), 1);
    g.fillStyle = tint ? base : '#c9a56a'; g.fillRect(-w / 2 + 6, -12, w - 12, 12);
    g.fillStyle = tint ? base : '#f28c5a'; for (let k = 0; k < 4; k++) { g.fillRect(-w / 2 + 8, -12 - (k + 1) * 14, w - 16, 12); if (!tint) { g.fillStyle = '#e06a3a'; for (let j = 0; j < 5; j++) g.fillRect(-w / 2 + 12 + j * 14, -12 - (k + 1) * 14 + 3, 6, 6); g.fillStyle = '#f28c5a'; } }
    g.strokeStyle = tint ? edge : 'rgba(220,240,255,.55)'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(-w / 2 + 6, -14 - k * 10); g.lineTo(w / 2 - 6, -20 - k * 10); g.stroke(); }
    g.restore();
    // arm / mast
    g.fillStyle = base; g.fillRect(w / 2 - 8, -h - 6, 8, h - 12); g.strokeStyle = edge; g.strokeRect(w / 2 - 8, -h - 6, 8, h - 12);
    if (!tint) { g.fillStyle = wind ? '#ff5a5a' : dizzy ? '#7fe0a0' : edge; g.fillRect(w / 2 - 6, -h - 4, 4, 4); if (dizzy) { g.fillStyle = '#fff'; g.font = 'bold 12px Georgia'; g.textAlign = 'center'; for (let k = 0; k < 3; k++) g.fillText('✦', Math.cos(e.t * 6 + k * 2.1) * 26, -h - 16 + Math.sin(e.t * 6 + k * 2.1) * 6); } }
  });
  c.restore();
}
