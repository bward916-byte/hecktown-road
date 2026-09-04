/* =====================================================================
   ACT 2 — Plant City FL, Lansing MI, Billings MT, Portland OR (M6)
   Generic DC builder + generic challenge steps + four bosses
   ===================================================================== */
restored.plantcity = false; restored.lansing = false; restored.billings = false; restored.portland = false;

/* ---------- regional far layers ---------- */
function farFlorida() {
  { const w = 1400, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 222, w, h - 222); for (let i = 0; i < 9; i++) { const px = 120 + i * 150; g.fillRect(px, 170, 4, 52); for (let k = 0; k < 6; k++) { g.save(); g.translate(px + 2, 170); g.rotate(k / 6 * Math.PI * 2); g.fillRect(0, -2, 26, 4); g.restore(); } } g.fillRect(700, 150, 4, 72); g.fillRect(690, 130, 24, 22); LAYERS.ridge = c; }
  { const w = 1600, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 246, w, h - 246); for (let x = 0; x < w; x += 22) { for (let r = 0; r < 3; r++) g.fillRect(x + r * 2, 236 - r * 8 + (x % 3), 12, 3); } g.fillRect(300, 206, 60, 40); g.beginPath(); g.moveTo(294, 208); g.lineTo(330, 186); g.lineTo(366, 208); g.closePath(); g.fill(); LAYERS.hills = c; }
  { const w = 1200, h = 340, c = mkCanvas(w, h), g = c.getContext('2d'); for (let i = 0; i < 14; i++) { const tx = i * 88 + (i % 3) * 10, th = 120 + (i * 43) % 70; g.fillStyle = i % 2 ? '#2b5a3a' : '#224a30'; g.beginPath(); g.moveTo(tx - 6, h); g.quadraticCurveTo(tx, h - th * 0.6, tx + 4, h - th); g.lineTo(tx + 8, h - th); g.quadraticCurveTo(tx + 6, h - th * 0.6, tx + 10, h); g.fill(); for (let k = 0; k < 7; k++) { g.save(); g.translate(tx + 6, h - th); g.rotate(k / 7 * Math.PI * 2 + 0.3); g.beginPath(); g.ellipse(22, 0, 26, 6, 0, 0, Math.PI * 2); g.fill(); g.restore(); } } LAYERS.trees = c; }
}
function farMichigan() {
  { const w = 1400, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 216, w, h - 216); g.fillRect(940, 160, 30, 56); g.beginPath(); g.arc(955, 158, 20, Math.PI, 0); g.fill(); g.fillRect(952, 126, 6, 14); LAYERS.ridge = c; }
  { const w = 1600, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 20) g.lineTo(x, 242 + Math.sin(x * 0.005) * 12); g.lineTo(w, h); g.closePath(); g.fill(); for (let i = 0; i < 24; i++) { const tx = (i * 67) % w; g.fillRect(tx - 1, 222, 3, 20); g.beginPath(); g.arc(tx, 216, 12, 0, Math.PI * 2); g.fill(); } g.fillRect(420, 200, 50, 42); g.fillRect(440, 180, 14, 20); LAYERS.hills = c; }
  { const w = 1200, h = 340, c = mkCanvas(w, h), g = c.getContext('2d'); for (let i = 0; i < 16; i++) { const tx = i * 76 + (i % 3) * 12, th = 110 + (i * 37) % 60; g.fillStyle = i % 3 === 0 ? '#5a3a24' : i % 3 === 1 ? '#8a4a2a' : '#a8632c'; g.fillRect(tx - 3, h - th * 0.5, 6, th * 0.5); for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(tx + Math.sin(i + k) * 10, h - th + k * th * 0.18, 30 - k * 3, 0, Math.PI * 2); g.fill(); } } LAYERS.trees = c; }
}
function farMontana() {
  { const w = 1400, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.beginPath(); g.moveTo(0, h); g.lineTo(0, 190); for (let x = 0; x <= w; x += 60) { g.lineTo(x, 150 + (x * 7919 % 40)); g.lineTo(x + 40, 150 + (x * 7919 % 40)); g.lineTo(x + 60, 190); } g.lineTo(w, h); g.closePath(); g.fill(); LAYERS.ridge = c; }
  { const w = 1600, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 244, w, h - 244); for (let x = 0; x < w; x += 9) if ((x * 31) % 7 < 2) g.fillRect(x, 238, 2, 6); for (let i = 0; i < 4; i++) { g.fillRect(900 + i * 30, 190 - i * 10, 8, 54 + i * 10); } g.fillRect(880, 230, 140, 14); LAYERS.hills = c; }
  { const w = 1200, h = 340, c = mkCanvas(w, h), g = c.getContext('2d'); for (let i = 0; i < 10; i++) { const tx = i * 120 + (i % 3) * 14; g.fillStyle = i % 2 ? '#4a4a3a' : '#3a3a2e'; g.beginPath(); g.arc(tx, h - 20, 22 + (i % 3) * 6, Math.PI, 0); g.fill(); g.fillRect(tx - 24, h - 20, 48, 20); } LAYERS.trees = c; }
}
function farOregon() {
  { const w = 1400, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.beginPath(); g.moveTo(0, h); g.lineTo(0, 210); g.lineTo(560, 210); g.lineTo(700, 96); g.lineTo(840, 210); g.lineTo(w, 210); g.lineTo(w, h); g.closePath(); g.fill(); LAYERS.ridge = c; }
  { const w = 1600, h = 300, c = mkCanvas(w, h), g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 246, w, h - 246); g.fillRect(400, 196, 6, 50); g.fillRect(700, 196, 6, 50); g.beginPath(); g.moveTo(380, 200); g.quadraticCurveTo(553, 140, 726, 200); g.lineTo(726, 206); g.quadraticCurveTo(553, 150, 380, 206); g.closePath(); g.fill(); for (let x = 390; x < 720; x += 24) g.fillRect(x, 200, 2, 40); g.fillRect(380, 240, 350, 4); LAYERS.hills = c; }
  { const w = 1200, h = 340, c = mkCanvas(w, h), g = c.getContext('2d'); for (let i = 0; i < 20; i++) { const tx = i * 60 + (i % 3) * 8, th = 150 + (i * 41) % 90; g.fillStyle = i % 2 ? '#1f3a2c' : '#183024'; g.fillRect(tx - 2, h - th * 0.3, 4, th * 0.3); for (let k = 0; k < 7; k++) { const ww = 22 - k * 2.6; g.beginPath(); g.moveTo(tx - ww, h - th * 0.3 - k * th * 0.1); g.lineTo(tx + ww, h - th * 0.3 - k * th * 0.1); g.lineTo(tx, h - th * 0.3 - (k + 1.8) * th * 0.1); g.closePath(); g.fill(); } } LAYERS.trees = c; }
}

/* ---------- generic DC play layer ---------- */
function drawDC(g, o) {
  const gy = WORLD.groundY;
  const gg = g.createLinearGradient(0, gy, 0, H); gg.addColorStop(0, o.ground[0]); gg.addColorStop(0.07, o.ground[1]); gg.addColorStop(0.12, o.ground[2]); gg.addColorStop(1, o.ground[3]);
  g.fillStyle = gg; g.fillRect(0, gy, WORLD.width, H - gy);
  g.fillStyle = '#4d4f57'; g.fillRect(1100, gy, 1500, H - gy); g.fillStyle = '#e9d27a'; for (let x = 1120; x < 2580; x += 70) g.fillRect(x, gy + 26, 30, 3);
  g.strokeStyle = o.grass; g.lineWidth = 2; for (let x = 0; x < WORLD.width; x += 15) { if (x > 1100 && x < 2600) continue; const hh = 5 + (x * 7) % 8; g.beginPath(); g.moveTo(x, gy); g.lineTo(x + 2, gy - hh); g.stroke(); }
  if (o.before) o.before(g, gy);
  // office
  { const x = 1140, y = 236, w = 460, h = 204; g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x + 8, y + 8, w, h); const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, o.office[0]); gr.addColorStop(1, o.office[1]); g.fillStyle = gr; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(255,255,255,.10)'; g.fillRect(x, y + 8, w, 5);
    g.fillStyle = o.trim; g.fillRect(x, y, w, 8);
    for (let i = 0; i < 5; i++) { const wx = x + 30 + i * 86; g.fillStyle = '#243447'; rr(g, wx, y + 34, 44, 40, 3); g.fill(); const wg = g.createLinearGradient(wx, y + 34, wx + 44, y + 74); wg.addColorStop(0, 'rgba(200,220,255,.30)'); wg.addColorStop(0.5, 'rgba(200,220,255,.06)'); wg.addColorStop(1, 'rgba(255,255,255,.14)'); g.fillStyle = wg; g.fillRect(wx + 2, y + 36, 40, 36); g.fillStyle = 'rgba(200,220,255,.18)'; g.fillRect(wx + 3, y + 37, 18, 34); }
    g.fillStyle = '#1e2c3d'; rr(g, x + 190, y + 80, 100, 124, 5); g.fill(); g.fillStyle = '#f2b544'; g.fillRect(x + 238, y + 84, 6, 116);
    g.fillStyle = '#243447'; rr(g, x + 110, y + 6, 240, 40, 6); g.fill(); g.fillStyle = '#f2b544'; g.font = 'bold 22px Georgia, serif'; g.textAlign = 'center'; g.fillText('PHILLIPS', x + 230, y + 34);
    g.fillStyle = '#e6d7bd'; g.font = '10px system-ui, sans-serif'; g.fillText(o.sign, x + 230, y + 60); }
  // warehouse wing + dock
  { const x = 1600, y = 226, w = 1000, h = 214; g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x + 8, y + 8, w, h); const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, o.wall[0]); gr.addColorStop(1, o.wall[1]); g.fillStyle = gr; g.fillRect(x, y, w, h); g.fillStyle = o.trim; g.fillRect(x, y, w, 8); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x, y + 8, w, 5);
    g.strokeStyle = 'rgba(0,0,0,.07)'; g.lineWidth = 2; for (let xx = x; xx < x + w; xx += 12) { g.beginPath(); g.moveTo(xx, y + 8); g.lineTo(xx, y + h); g.stroke(); }
    for (let i = 0; i < 2; i++) { const dx = x + 160 + i * 320; g.fillStyle = '#3a4048'; g.fillRect(dx, 300, 100, 92); g.fillStyle = '#4b525b'; for (let k = 0; k < 5; k++) g.fillRect(dx + 2, 302 + k * 18, 96, 16); g.fillStyle = '#2c3038'; rr(g, dx + 36, 318, 28, 10, 3); g.fill(); }
    g.fillStyle = '#5a5e66'; g.fillRect(1720, 392, 600, 48); g.fillStyle = '#e9d27a'; g.fillRect(1720, 392, 600, 4); g.fillRect(1680, 416, 40, 24);
    g.fillStyle = '#e9d27a'; for (let xx = 1720; xx < 2320; xx += 20) g.fillRect(xx, 436, 10, 4); }
  // alley lamp + dumpster (Milo's spot)
  g.fillStyle = '#2f5f3f'; rr(g, 1604, 392, 60, 48, 4); g.fill(); g.fillStyle = '#2c3038'; g.fillRect(1590, 260, 4, 30); g.fillStyle = '#1e2127'; rr(g, 1582, 254, 20, 10, 3); g.fill();
  // right-side hill steps
  g.fillStyle = o.rock; g.beginPath(); g.moveTo(3560, gy); g.lineTo(3600, gy - 30); g.lineTo(3680, gy - 30); g.lineTo(3680, gy - 60); g.lineTo(3760, gy - 60); g.lineTo(3760, gy - 90); g.lineTo(3880, gy - 90); g.lineTo(3880, gy); g.closePath(); g.fill();
  g.fillStyle = o.grass; g.fillRect(3600, gy - 32, 80, 4); g.fillRect(3680, gy - 62, 80, 4); g.fillRect(3760, gy - 92, 120, 4);
  if (o.after) o.after(g, gy);
  drawTrailer(g, WORLD.truckX, 288, WORLD.groundY);
  g.fillStyle = '#2c3038'; g.fillRect(120, 380, 4, 60); g.fillStyle = '#1e6e3a'; rr(g, 40, 364, 164, 30, 4); g.fill(); g.fillStyle = '#fff'; g.font = 'bold 12px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(o.road, 122, 384);
}
const DC_SOLIDS = () => [[0, 440, 4300, 200, 0], [1720, 392, 600, 48, 0], [1680, 416, 40, 24, 0], [3540, 288, 420, 92, 0], [3960, 328, 64, 54, 0], [3600, 410, 80, 30, 0], [3680, 380, 80, 60, 0], [3760, 350, 120, 90, 0]];
const DC_LIGHTS = () => [{ x: 1370, y: 290, r: 260, color: [242, 181, 68], night: 1, glow: 1 }, { x: 1380, y: 380, r: 190, color: [255, 225, 170], night: 1 }, { x: 1592, y: 258, r: 160, color: [255, 200, 120], night: 1, cone: 1 }, { x: 1810, y: 330, r: 240, color: [255, 200, 120], night: 1, cone: 1 }, { x: 2130, y: 330, r: 240, color: [255, 200, 120], night: 1, cone: 1 }, { x: 3540 + 448, y: 380, r: 90, color: [255, 240, 200], night: 1 }];

/* ---------- regional dressing ---------- */
function drawPalm(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#7a6a4a'; g.beginPath(); g.moveTo(-6, 0); g.quadraticCurveTo(0, -80, 10, -140); g.lineTo(18, -140); g.quadraticCurveTo(6, -80, 8, 0); g.closePath(); g.fill(); for (let k = 0; k < 8; k++) { g.save(); g.translate(14, -142); g.rotate(k / 8 * Math.PI * 2 + 0.2); g.fillStyle = k % 2 ? '#4f8f4a' : '#3f7a3c'; g.beginPath(); g.ellipse(30, 0, 34, 7, 0, 0, Math.PI * 2); g.fill(); g.restore(); } g.restore(); }
function drawMaple(g, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#4a3624'; g.fillRect(-6, -90, 12, 90); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(2, -90, 4, 90); for (const [cx, cy, r] of [[0, -120, 40], [-34, -104, 28], [34, -108, 30], [0, -150, 26]]) { const fg = g.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r); fg.addColorStop(0, lighten(col, 0.25)); fg.addColorStop(0.7, col); fg.addColorStop(1, shade(col, 0.66)); g.fillStyle = fg; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill(); } g.restore(); }
function drawFir(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#3a2a1c'; g.fillRect(-4, -60, 8, 60); for (let k = 0; k < 6; k++) { const ww = 44 - k * 6; const fg = g.createLinearGradient(-ww, 0, ww, 0); fg.addColorStop(0, '#2e6a44'); fg.addColorStop(0.5, k % 2 ? '#1f4a30' : '#255a3a'); fg.addColorStop(1, '#143222'); g.fillStyle = fg; g.beginPath(); g.moveTo(-ww, -60 - k * 24); g.lineTo(ww, -60 - k * 24); g.lineTo(0, -100 - k * 24); g.closePath(); g.fill(); } g.restore(); }
function drawSnowbank(g, x, y, w) { g.fillStyle = '#eef2ff'; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + w / 2, y - 26, x + w, y); g.closePath(); g.fill(); g.fillStyle = 'rgba(180,200,240,.5)'; g.fillRect(x + 4, y - 3, w - 8, 3); }

/* ---------- world defs ---------- */
function makeDC(o) {
  return {
    id: o.id, name: o.name, location: o.location, width: 4300, groundY: 440, truckX: 3540,
    solids: DC_SOLIDS, lights: DC_LIGHTS, far: o.far, play: g => drawDC(g, o.art),
    coffee: { x: 1100, y: 440 }, checkpoint: { x: 1060, y: 440 }, spawn: { x: 260, y: 440 }, weather: o.weather, hour: o.hour,
    setup: () => setupGeneric(o),
    door: { x: 2640, x0: 2680, x1: 3500, boss: o.boss, name: o.bossName, minCrew: 1 },
    driveTo: 'easton', driveLabel: 'DRIVE HOME', driveHours: o.hours, driveRequires: () => restored[o.id] ? null : 'The DC is still dark. Clear the boss stage first.',
    steps: o.steps, hazard: o.hazard, miles: o.miles,
  };
}
function setupGeneric(o) {
  addNPC({ look: Object.assign({ skin: '#eec2a0', hair: '#3a2c22', style: 'cap', shirt: '#f2b544', pants: '#2b2f3a', acc: 'vest' }, o.npc), x: 2000, y: 392, facing: -1, lines: o.lines });
  addMilo(1632, false);
  if (o.forklift) placeForklift(2420);
  if (restored[o.id]) { setObjectives([{ text: o.name + ' is restored. Drive home from the truck.', check: () => false }]); return; }
  setObjectives([{ text: 'Reach the boss stage door past the dock', check: () => stage.active }, { text: 'Clear the stage', check: () => restored[o.id] }, { text: 'Drive home from the truck', check: () => false }]);
  addEncounter(700, o.encounter || ['flicker', 'flicker', 'jitter']);
  addEncounter(3200, o.encounter2 || ['packet', 'ghost']);
}

WORLD_DEFS.plantcity = makeDC({
  id: 'plantcity', name: 'Plant City, FL', location: 'Plant City, Florida — Phillips DC', weather: 0, hour: 19.6, hours: 14, miles: 1030,
  far: farFlorida, boss: 'drainpipe', bossName: 'DRAINPIPE',
  art: { ground: ['#7f9a5a', '#6a8a4a', '#8a7a5a', '#4a3e30'], grass: '#a9c46a', office: ['#f2e6d0', '#cdbf9e'], wall: ['#e8f0e8', '#b4c2b4'], trim: '#7a8a80', rock: '#8a8060', sign: 'PLANT CITY, FL', road: 'PLANT CITY  ·  I-4',
    before: (g, gy) => { g.fillStyle = '#7a3a3a'; for (let x = 200; x < 1000; x += 70) { for (let r = 0; r < 3; r++) { g.fillStyle = '#4f7f3f'; g.fillRect(x, gy - 14 + r * 4, 40, 4); g.fillStyle = '#d63a3a'; g.fillRect(x + 6 + r * 10, gy - 16 + r * 4, 4, 4); } } },
    after: (g, gy) => { for (const [x, s] of [[300, 1.0], [900, 0.9], [2800, 1.1], [3200, 0.9], [4100, 1.0]]) drawPalm(g, x, gy, s); g.fillStyle = '#2c3038'; g.fillRect(2760, 250, 6, 190); g.fillStyle = '#c0392b'; g.fillRect(2740, 236, 46, 20); g.fillStyle = '#fff'; g.font = 'bold 8px system-ui'; g.textAlign = 'center'; g.fillText('BERRY', 2763, 249); } },
  npc: { name: 'Cap\'n Reyes', role: 'Aquatics' }, lines: ['Cap\'n Reyes: "Tanks are draining backwards. The pipes are alive — there\'s a head in every drain."'],
  steps: [{ type: 'valves', name: 'Flow: open the valves in order', time: 40, n: 3 }, { type: 'deliver', name: 'Rush the aquatics order', time: 30, label: 'AQUA' }, { type: 'boss', name: 'Boss' }],
  hazard: 'water', encounter: ['flicker', 'flicker', 'ghost'],
});
WORLD_DEFS.lansing = makeDC({
  id: 'lansing', name: 'Lansing, MI', location: 'Lansing, Michigan — Phillips DC', weather: 3, hour: 8.5, hours: 11, miles: 660,
  far: farMichigan, boss: 'snowdrift', bossName: 'SNOWDRIFT',
  art: { ground: ['#e8ecf6', '#d8def0', '#7a7a80', '#3a3a44'], grass: '#c9d2e8', office: ['#c9b9a0', '#9c8a72'], wall: ['#d8dde4', '#a2a8b0'], trim: '#6e7880', rock: '#8a8a94', sign: 'LANSING, MI', road: 'LANSING  ·  US-127',
    before: (g, gy) => { for (const [x, w] of [[220, 160], [620, 120], [2760, 200], [3100, 140], [4050, 160]]) drawSnowbank(g, x, gy, w); },
    after: (g, gy) => { drawMaple(g, 400, gy, 1.0, '#c8632c'); drawMaple(g, 820, gy, 0.9, '#e0a030'); drawMaple(g, 2900, gy, 1.1, '#b8402c'); drawMaple(g, 3300, gy, 0.9, '#c8632c'); drawMaple(g, 4150, gy, 1.0, '#e0a030'); g.fillStyle = '#6a3a2a'; g.fillRect(2300, 396, 60, 44); g.fillStyle = '#e9d27a'; g.fillRect(2306, 402, 48, 6); g.font = 'bold 7px system-ui'; g.fillStyle = '#243447'; g.textAlign = 'center'; g.fillText('FEED', 2330, 420); } },
  npc: { name: 'Bea', role: 'Feed & Farm' }, lines: ['Bea: "Sacks are on the scale side. The plow\'s been circling the yard since the snow started — nobody\'s driving it."'],
  steps: [{ type: 'multi', name: 'Weight: three sacks to the scale', time: 45, n: 3, label: 'FEED' }, { type: 'scan', name: 'Scan the feed lot', time: 26, n: 3 }, { type: 'boss', name: 'Boss' }],
  hazard: 'ice', encounter: ['flicker', 'lag', 'flicker'],
});
WORLD_DEFS.billings = makeDC({
  id: 'billings', name: 'Billings, MT', location: 'Billings, Montana — Phillips DC', weather: 0, hour: 16.5, hours: 30, miles: 1900,
  far: farMontana, boss: 'gale', bossName: 'GALE',
  art: { ground: ['#b8a878', '#a89868', '#8a6a48', '#4a3a2a'], grass: '#c8b878', office: ['#d9c9a8', '#a89878'], wall: ['#e0d8c8', '#a8a090'], trim: '#7a7060', rock: '#b8886a', sign: 'BILLINGS, MT', road: 'BILLINGS  ·  I-90',
    before: (g, gy) => { g.fillStyle = '#b8886a'; g.beginPath(); g.moveTo(0, 240); g.lineTo(0, gy); g.lineTo(700, gy); g.lineTo(700, 300); g.lineTo(600, 280); g.lineTo(500, 240); g.lineTo(300, 230); g.closePath(); g.fill(); g.fillStyle = 'rgba(0,0,0,.12)'; for (let yy = 250; yy < gy; yy += 22) g.fillRect(0, yy, 620 - (yy - 250) * 0.6, 4); },
    after: (g, gy) => { for (const x of [900, 2800, 3200, 4100]) { g.fillStyle = '#4a4a3a'; g.beginPath(); g.arc(x, gy - 10, 22, Math.PI, 0); g.fill(); g.fillRect(x - 22, gy - 10, 44, 10); } g.fillStyle = '#c8c8d0'; g.fillRect(2450, 200, 6, 240); for (let k = 0; k < 3; k++) { g.save(); g.translate(2453, 200); g.rotate(k / 3 * Math.PI * 2); g.fillRect(-3, -70, 6, 70); g.restore(); } } },
  npc: { name: 'Dr. Okafor', role: 'Vet Supply' }, lines: ['Dr. Okafor: "Vaccines are in the cold room and the wind\'s tearing the bay doors off. Move fast, stay low."'],
  steps: [{ type: 'deliver', name: 'Cold chain: deliver before it thaws', time: 22, label: 'VET' }, { type: 'scan', name: 'Scan the cold room', time: 24, n: 3 }, { type: 'boss', name: 'Boss' }],
  hazard: 'wind', encounter: ['jitter', 'jitter', 'flicker'],
});
WORLD_DEFS.portland = makeDC({
  id: 'portland', name: 'Portland, OR', location: 'Portland, Oregon — Phillips DC', weather: 2, hour: 11.2, hours: 40, miles: 2800,
  far: farOregon, boss: 'hydra', bossName: 'CONVEYOR HYDRA',
  art: { ground: ['#5a7a4a', '#4a6a3a', '#5a5a52', '#2e2e2a'], grass: '#7fa354', office: ['#b8a890', '#8a7a60'], wall: ['#c8d0d8', '#8a949e'], trim: '#5e6870', rock: '#6a6a60', sign: 'PORTLAND, OR', road: 'PORTLAND  ·  I-5',
    before: (g, gy) => { g.fillStyle = 'rgba(120,150,190,.35)'; for (const [px, pw] of [[300, 90], [800, 70], [2900, 110], [3300, 80], [4000, 90]]) { g.beginPath(); g.ellipse(px, gy + 4, pw, 5, 0, 0, Math.PI * 2); g.fill(); } g.fillStyle = '#4a6a3a'; for (let x = 0; x < 1100; x += 40) { g.beginPath(); g.arc(x, gy + 2, 14, Math.PI, 0); g.fill(); } },
    after: (g, gy) => { for (const [x, s] of [[260, 1.1], [560, 0.9], [900, 1.0], [2780, 1.2], [3150, 1.0], [3380, 0.9], [4120, 1.1]]) drawFir(g, x, gy, s); g.fillStyle = '#7a4a3a'; g.fillRect(2350, 396, 70, 44); g.fillStyle = '#e9d27a'; g.font = 'bold 7px system-ui'; g.textAlign = 'center'; g.fillText('GROOM', 2385, 420); } },
  npc: { name: 'Nadia', role: 'Groomer Supply' }, lines: ['Nadia: "Three belts, three heads, and every tag on the wrong crate. It rained inside. Don\'t ask."'],
  steps: [{ type: 'scan', name: 'Sort: scan tags in the posted order', time: 30, n: 3, ordered: true }, { type: 'deliver', name: 'Groomer rush order', time: 30, label: 'GROOM' }, { type: 'boss', name: 'Boss' }],
  hazard: 'belts', encounter: ['packet', 'packet', 'flicker'],
});
WORLD_DEFS.portland.water = [{ x0: 210, x1: 390, y: 444 }, { x0: 2790, x1: 3010, y: 444 }, { x0: 3220, x1: 3380, y: 444 }, { x0: 3910, x1: 4090, y: 444 }];
const ACT2 = ['plantcity', 'lansing', 'billings', 'portland'];
WORLD_DEFS.easton.driveOptions = () => [{ label: 'Taunton, MA', to: 'taunton' }].concat(restored.taunton ? [{ label: 'Spartanburg, SC', to: 'spartanburg' }] : []).concat(restored.spartanburg ? ACT2.map(id => ({ label: WORLD_DEFS[id].name + (restored[id] ? ' ✓' : ''), to: id })) : []);

/* ---------- generic challenge steps ---------- */
function stageStepsOf(def) { return def.steps || STAGE_STEPS_BY_WORLD[def.id] || STAGE_STEPS; }
function beginStepGeneric() {
  const def = WORLD.def; if (!def.steps) return false;
  const d = stage.door, s = def.steps[stage.step];
  clearStageEnemies(); packages.length = 0; scanTargets.length = 0; valves.length = 0; stage.seq = 0; stage.grace = gameTime + 0.35; stage.spawnT = 2.5; stage.timer = s.time || 0; stage.stepT = 0; stage.progress = 0; stage.delivered = false;
  restoredBanner.t = 3; restoredBanner.text = (stage.step + 1) + ' / 3  ·  ' + s.name;
  const npc = npcs.find(n => !n.hero && !n.cat);
  if (npc) { npc.x = d.x1 - 60; npc.y = groundYAt(npc.x); }
  if (s.type === 'deliver') { spawnPackage(d.x0 + 30, groundYAt(d.x0 + 30), s.label); if (npc) npc.acceptsPackage = () => { stage.delivered = true; }; }
  if (s.type === 'multi') { for (let i = 0; i < s.n; i++) spawnPackage(d.x0 + 30 + i * 60, groundYAt(d.x0 + 30), s.label); if (npc) npc.acceptsPackage = () => { stage.progress++; if (stage.progress >= s.n) stage.delivered = true; else say(npc, npc.look.name + ': "' + stage.progress + ' of ' + s.n + '. Keep them coming."'); }; }
  if (s.type === 'scan') { const xs = [d.x0 + 170, d.x0 + 430, d.x0 + 690]; const skus = ['SKU 02781', 'SKU 51810', 'SKU 10234']; const order = [0, 1, 2]; if (s.ordered) order.sort(() => Math.random() - 0.5); stage.order = order.map(i => skus[i]); xs.forEach((x, i) => addScan(x, groundYAt(x), skus[i])); if (s.ordered) restoredBanner.text += '   →   ' + stage.order.map(k => k.slice(4)).join(' · '); }
  if (s.type === 'valves') { const xs = [d.x0 + 150, d.x0 + 400, d.x0 + 650]; const order = [0, 1, 2].sort(() => Math.random() - 0.5); stage.order = order; xs.forEach((x, i) => valves.push({ x, y: groundYAt(x), i, open: false, t: rnd(0, 6) })); restoredBanner.text += '   →   ' + order.map(i => 'V' + (i + 1)).join(' · '); }
  if (s.type === 'boss') { forklift.mounted = false; forklift.present = false; const b = spawnBoss(d.boss, d.x1 - 160, groundYAt(d.x1 - 160)); arena.boss = b; if (b) b.tx = clamp(player.x + 320, d.x0 + 60, d.x1 - 60); }
  return true;
}
function updateStageGeneric(dt) {
  const def = WORLD.def; if (!def.steps) return false;
  const s = def.steps[stage.step]; stage.stepT += dt;
  if (s.time) { stage.timer -= dt; if (stage.timer <= 0) { failStage('Out of time'); return true; } }
  if (s.type !== 'boss') { stage.spawnT -= dt; if (stage.spawnT <= 0) { stage.spawnT = 4.5; spawnGroup(player.x, stage.step === 0 ? ['flicker', 'flicker'] : ['jitter', 'flicker']); } }
  let done = false;
  if (s.type === 'deliver' || s.type === 'multi') done = stage.delivered;
  if (s.type === 'scan') { if (s.ordered) { const doneList = scanTargets.filter(x => x.done).sort((a, b) => a.seq - b.seq); for (let i = 0; i < doneList.length; i++) if (doneList[i].sku !== stage.order[i]) { failStage('Wrong order'); return true; } } done = scanTargets.every(x => x.done); }
  if (s.type === 'valves') done = valves.every(v => v.open);
  if (done) { stage.step++; grantSkill('challenge'); beginStep(); }
  return true;
}
// valves (Flow puzzle)
const valves = [];
function nearValve() { for (const v of valves) if (!v.open && Math.abs(v.x - player.x) < 34 && Math.abs(v.y - player.y) < 40) return v; return null; }
function updateValves() {
  const v = nearValve(); WORLD.nearValve = v;
  if (v && edge.use && !talk.open && !(stage.grace && gameTime < stage.grace)) {
    const nextIdx = stage.order[valves.filter(x => x.open).length];
    if (v.i === nextIdx) { v.open = true; spawn({ k: 'flash', x: v.x, y: v.y - 30, life: 0.3, t: 0, c: [120, 220, 255] }); for (let k = 0; k < 8; k++) spawn({ k: 'ring', x: v.x + rnd(-10, 10), y: v.y - 10, life: 0.5, t: 0 }); banner('V' + (v.i + 1) + ' open', 1); }
    else failStage('Wrong valve');
  }
}
function drawValves() {
  for (const v of valves) { v.t += 1 / 60; ctx.save(); ctx.translate(v.x, v.y); ctx.fillStyle = '#4a5560'; ctx.fillRect(-14, -30, 28, 30); ctx.fillStyle = '#31506a'; ctx.fillRect(-40, -18, 80, 8); ctx.save(); ctx.translate(0, -34); ctx.rotate(v.open ? v.t * 3 : 0); ctx.strokeStyle = v.open ? '#7fe0ff' : '#c0392b'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke(); ctx.restore(); ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, -16, -66, 32, 16, 5); ctx.fill(); ctx.fillStyle = v.open ? '#7fe0a0' : '#f6ecd8'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center'; ctx.fillText('V' + (v.i + 1), 0, -54); if (WORLD.nearValve === v) { ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, -30, -86, 60, 16, 5); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.fillText('E · TURN', 0, -74); } ctx.restore(); }
  ctx.textAlign = 'left';
}

/* ---------- hazards ---------- */
const hazard = { wind: 0, windT: 0, water: 0, ice: false, belts: [] };
function updateHazards(dt) {
  const hz = WORLD.def.hazard; hazard.ice = false; hazard.wind = 0; hazard.water = 0;
  if (!stage.active && !arena.active) return;
  if (hz === 'wind') { hazard.windT += dt; const g = Math.sin(hazard.windT * 0.9); hazard.wind = g > 0.55 ? (Math.sin(hazard.windT * 0.25) > 0 ? 1 : -1) * 520 * (g - 0.55) / 0.45 : 0; if (!forklift.mounted) player.vx += hazard.wind * dt * (player.onGround ? 1.2 : 2.2); for (const f of crew) f.vx += hazard.wind * dt * 0.8; if (hazard.wind && Math.random() < dt * 30) spawn({ k: 'puff', x: camera.x + rnd(0, W), y: camera.y + rnd(200, 430), vx: hazard.wind * 0.8, vy: rnd(-20, 20), life: 0.5, t: 0, r: 1.5 }); }
  if (hz === 'ice') { hazard.ice = true; }
  if (hz === 'water' && stage.step === 2) { hazard.water = 26 + Math.sin(gameTime * 0.5) * 20; if (player.y > WORLD.groundY - hazard.water + 20) player.vx *= 0.9; }
  if (hz === 'belts' && stage.step === 2) { const cx = (arena.x0 + arena.x1) / 2; const dir = Math.sin(gameTime * 0.4) > 0 ? 1 : -1; if (player.onGround && Math.abs(player.x - cx) < 260) player.x += dir * 70 * dt; }
}
function drawHazards() {
  const hz = WORLD.def.hazard; if (!stage.active) return;
  if (hz === 'water' && hazard.water > 0) { const y = WORLD.groundY - hazard.water; ctx.fillStyle = 'rgba(60,140,200,.45)'; ctx.fillRect(arena.x0 - camera.x, y - camera.y, arena.x1 - arena.x0, hazard.water + 60); ctx.fillStyle = 'rgba(200,240,255,.5)'; for (let x = arena.x0; x < arena.x1; x += 40) ctx.fillRect(x - camera.x + Math.sin(gameTime * 3 + x) * 6, y - camera.y, 18, 2); }
  if (hz === 'belts' && stage.step === 2) { const cx = (arena.x0 + arena.x1) / 2, dir = Math.sin(gameTime * 0.4) > 0 ? 1 : -1; ctx.fillStyle = '#2c3038'; ctx.fillRect(cx - 260 - camera.x, WORLD.groundY - 6 - camera.y, 520, 6); ctx.fillStyle = '#e9d27a'; const off = (gameTime * dir * 70) % 40; for (let x = -260; x < 260; x += 40) ctx.fillRect(cx + x + off - camera.x, WORLD.groundY - 5 - camera.y, 14, 3); }
  if (hz === 'wind' && Math.abs(hazard.wind) > 50) { ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1.5; for (let k = 0; k < 6; k++) { const y = 200 + k * 40 + Math.sin(gameTime * 4 + k) * 8; const x = ((gameTime * hazard.wind * 1.5 + k * 200) % (W + 200)) - 100; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - hazard.wind * 0.12, y + 2); ctx.stroke(); } }
  if (hz === 'ice' && arena.active) { ctx.fillStyle = 'rgba(200,230,255,.18)'; ctx.fillRect(arena.x0 - camera.x, WORLD.groundY - 4 - camera.y, arena.x1 - arena.x0, 4); }
}

/* ---------- bosses ---------- */
ENEMY.drainpipe = { hp: 240, w: 60, h: 90, speed: 0, dmg: 1, shards: 0, boss: 1, color: [110, 200, 230] };
ENEMY.snowdrift = { hp: 250, w: 96, h: 70, speed: 0, dmg: 2, shards: 0, boss: 1, color: [220, 235, 255] };
ENEMY.gale = { hp: 260, w: 70, h: 130, speed: 0, dmg: 1, shards: 0, boss: 1, color: [200, 230, 255] };
ENEMY.hydra = { hp: 280, w: 110, h: 90, speed: 0, dmg: 1, shards: 0, boss: 1, color: [255, 120, 220] };
function updateAct2Boss(e, dt) {
  e.pt -= dt; e.alpha = 1; const dx = player.x - e.x;
  const adds = (types) => { const q = Math.ceil(e.hp / e.maxHp * 4); if (q < e.lastQuarter) { e.lastQuarter = q; for (const t of types) { const f = spawnEnemy(t, e.x + rnd(-40, 40), e.y); if (f) { f.vy = -350; waveState.alive++; } } } };
  if (e.type === 'drainpipe') { // heads pop up from drains; only the raised head is targetable
    if (!e.heads) { e.heads = [arena.x0 + 180, (arena.x0 + arena.x1) / 2, arena.x1 - 180]; e.phase = 'down'; e.pt = 0.8; e.rise = 0; }
    if (e.phase === 'down') { e.targetable = false; e.rise = Math.max(0, e.rise - dt * 3); if (e.pt <= 0) { e.x = e.heads[(Math.random() * 3) | 0]; e.phase = 'up'; e.pt = 2.4; e.spat = 0; } }
    else if (e.phase === 'up') { e.rise = Math.min(1, e.rise + dt * 4); e.targetable = e.rise > 0.6; e.facing = Math.sign(dx) || 1; if (e.spat < 2 && e.pt < 1.8 - e.spat * 0.7) { e.spat++; const T = 0.8; bossProjs.push({ x: e.x, y: e.y - 70, vx: dx / T + rnd(-30, 30), vy: -0.5 * G * T - 60, t: 0, r: 6, water: 1 }); } if (e.pt <= 0) { e.phase = 'down'; e.pt = 0.9; } }
    adds(['flicker', 'flicker']); e.y = groundYAt(e.x);
  }
  if (e.type === 'snowdrift') { // a runaway plow: charges pushing a snow wall, then reverses (vulnerable while backing)
    if (!e.mode) { e.mode = 'charge'; e.facing = Math.sign(dx) || 1; e.pt = 2.4; }
    if (e.mode === 'charge') { e.targetable = false; e.vx = e.facing * 300; if (e.wall || e.pt <= 0) { e.mode = 'back'; e.pt = 2.0; e.vx = 0; shake = Math.max(shake, 0.15); puff(e.x + e.facing * 50, e.y, 12); } }
    else { e.targetable = true; e.weak = 0.2; e.vx = -e.facing * 90; if (e.pt <= 0) { e.mode = 'charge'; e.facing = Math.sign(dx) || 1; e.pt = 2.4; } }
    if (Math.abs(e.vx) > 200 && Math.random() < dt * 40) spawn({ k: 'snow', x: e.x + e.facing * 50 + rnd(-10, 10), y: e.y - rnd(0, 40), vx: e.facing * rnd(100, 260), vy: rnd(-200, -60), life: 0.8, t: 0, r: rnd(1.5, 3) });
    adds(['lag']);
    e.vy += G * dt; if (e.vy > 900) e.vy = 900; moveBody(e, dt, e.w / 2); e.x = clamp(e.x, arena.x0 + e.w / 2, arena.x1 - e.w / 2);
  }
  if (e.type === 'gale') { // a wind turbine: gusts push you off ledges; targetable when the blades stall
    if (!e.mode) { e.mode = 'spin'; e.pt = 3; e.blade = 0; }
    if (e.mode === 'spin') { e.targetable = false; e.blade += dt * 9; hazard.windT += dt * 0.6; if (e.pt <= 0) { e.mode = 'stall'; e.pt = 2.4; } }
    else { e.targetable = true; e.blade += dt * 0.6; if (e.pt <= 0) { e.mode = 'spin'; e.pt = 3; } }
    adds(['jitter', 'jitter']); e.y = groundYAt(e.x);
  }
  if (e.type === 'hydra') { // three belt heads; the biting head is targetable
    if (!e.mode) { e.mode = 'idle'; e.pt = 1.0; e.head = 0; }
    if (e.mode === 'idle') { e.targetable = false; if (e.pt <= 0) { e.mode = 'bite'; e.pt = 1.4; e.head = (e.head + 1) % 3; e.bx = e.x + (e.head - 1) * 70; } }
    else { e.targetable = true; if (e.pt < 0.9 && !e.bit) { e.bit = true; if (Math.abs(player.x - e.bx) < 50 && player.inv <= 0 && player.dead <= 0 && player.y > e.y - 90) hurtPlayer(1, e.bx); } if (e.pt <= 0) { e.mode = 'idle'; e.pt = 0.8; e.bit = false; } }
    adds(['packet']); e.y = groundYAt(e.x);
  }
  if (e.type !== 'snowdrift' && e.type !== 'gale' && player.inv <= 0 && player.dead <= 0 && e.targetable && e.type !== 'hydra') { const ox = Math.abs(e.x - player.x) < (e.w + player.w) / 2 - 6, oy = player.y > e.y - e.h && player.y - player.h < e.y; if (ox && oy && player.dashT <= 0) hurtPlayer(1, e.x); }
  if (e.type === 'snowdrift' && player.inv <= 0 && player.dead <= 0) { const ox = Math.abs(e.x + e.facing * 30 - player.x) < 60, oy = player.y > e.y - 50; if (ox && oy && Math.abs(e.vx) > 200 && player.dashT <= 0) hurtPlayer(2, e.x); }
}
function drawAct2Boss(c, e) {
  c.save(); c.translate(e.x, e.y);
  glitchDraw(c, e, (g, tint) => {
    const base = tint ? rgb(tint) : '#1c2230', edge = tint ? rgb(tint) : (e.hit > 0 ? '#fff' : rgb(e.d.color));
    g.fillStyle = base; g.strokeStyle = edge; g.lineWidth = 2;
    if (e.type === 'drainpipe') { const r = e.rise || 0; g.fillStyle = '#2c3038'; rr(g, -34, -10, 68, 10, 3); g.fill(); g.save(); g.beginPath(); g.rect(-40, -200, 80, 190); g.clip(); g.translate(0, (1 - r) * 90); g.fillStyle = base; rr(g, -18, -90, 36, 90, 8); g.fill(); g.stroke(); g.fillStyle = tint ? base : '#31506a'; g.beginPath(); g.arc(0, -90, 24, 0, Math.PI * 2); g.fill(); g.stroke(); if (!tint) { g.fillStyle = edge; g.fillRect(-10, -96, 5, 5); g.fillRect(5, -96, 5, 5); g.fillStyle = '#7fe0ff'; g.beginPath(); g.arc(0, -78, 7, 0, Math.PI); g.fill(); } g.restore(); }
    if (e.type === 'snowdrift') { g.scale(e.facing, 1); g.fillStyle = tint ? base : '#e9d27a'; rr(g, -44, -50, 70, 40, 6); g.fill(); g.stroke(); g.fillStyle = tint ? base : '#243447'; rr(g, -36, -70, 40, 24, 4); g.fill(); g.fillStyle = tint ? base : '#c0392b'; g.beginPath(); g.moveTo(26, -10); g.lineTo(58, -46); g.lineTo(58, -8); g.closePath(); g.fill(); g.stroke(); g.fillStyle = tint ? base : '#eef2ff'; g.beginPath(); g.moveTo(30, -8); g.quadraticCurveTo(60, -60, 96, -8); g.closePath(); g.fill(); for (const wx of [-30, 6]) { g.fillStyle = '#1b1d22'; g.beginPath(); g.arc(wx, -10, 12, 0, Math.PI * 2); g.fill(); } if (!tint) { g.fillStyle = e.mode === 'back' ? '#7fe0a0' : '#ff5a5a'; g.fillRect(-30, -66, 5, 5); g.fillRect(-10, -66, 5, 5); } }
    if (e.type === 'gale') { g.fillStyle = tint ? base : '#c8c8d0'; g.fillRect(-6, -110, 12, 110); g.fillStyle = base; g.beginPath(); g.arc(0, -110, 12, 0, Math.PI * 2); g.fill(); g.stroke(); for (let k = 0; k < 3; k++) { g.save(); g.translate(0, -110); g.rotate((e.blade || 0) + k / 3 * Math.PI * 2); g.fillStyle = tint ? base : '#e8e8f0'; g.fillRect(-4, -78, 8, 78); g.strokeRect(-4, -78, 8, 78); g.restore(); } if (!tint) { g.fillStyle = e.mode === 'stall' ? '#7fe0a0' : '#ff5a5a'; g.fillRect(-3, -113, 6, 6); } }
    if (e.type === 'hydra') { g.fillStyle = '#2c3038'; g.fillRect(-120, -10, 240, 10); g.fillStyle = '#e9d27a'; for (let x = -116; x < 120; x += 24) g.fillRect(x + ((gameTime * 60) % 24), -9, 10, 3); for (let k = 0; k < 3; k++) { const hx = (k - 1) * 70; const active = e.mode === 'bite' && e.head === k; g.save(); g.translate(hx, -10); g.fillStyle = base; g.strokeStyle = edge; rr(g, -14, -80, 28, 80, 8); g.fill(); g.stroke(); g.fillStyle = tint ? base : (active ? '#ff5a8a' : '#31506a'); g.beginPath(); g.ellipse(0, -84, 22, 14, 0, 0, Math.PI * 2); g.fill(); g.stroke(); if (!tint) { g.fillStyle = '#fff'; g.fillRect(-8, -90, 4, 4); g.fillRect(4, -90, 4, 4); if (active) { g.fillStyle = '#fff'; for (let t = -14; t <= 14; t += 7) { g.beginPath(); g.moveTo(t, -74); g.lineTo(t + 3, -66); g.lineTo(t + 6, -74); g.fill(); } } } g.restore(); } }
  });
  c.restore();
}
