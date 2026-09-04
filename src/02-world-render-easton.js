/* ---------------- world: Easton HQ exterior ---------------- */
const WORLD = { id: 'easton', width: 4200, groundY: 440, location: 'Easton, Pennsylvania — Phillips Pet HQ' };
// solids: [x, y, w, h, oneWay]
let SOLIDS = [];
const EASTON_SOLIDS = [
  [0, WORLD.groundY, WORLD.width, 200, 0],
  // dock platform
  [1720, 392, 720, 48, 0],
  // dock steps
  [1680, 416, 40, 24, 0],
  // crates near entrance
  [620, 404, 36, 36, 0], [656, 404, 36, 36, 0], [638, 368, 36, 36, 0],
  // pallet stacks by dock
  [1500, 412, 60, 28, 0], [1500, 384, 60, 28, 0], [1440, 412, 60, 28, 0],
  // trailer (backed to dock)
  [2470, 288, 420, 92, 0],
  // trailer roof one-way ledge helper
  [2890, 328, 64, 54, 0], // cab body (ground passes under)
  // picnic table
  [3250, 414, 90, 6, 1],
  // rocks / hill steps at far right
  [3600, 410, 80, 30, 0], [3680, 380, 80, 60, 0], [3760, 350, 120, 90, 0],
  // lamp post crossbar (one-way)
  [1180, 330, 60, 6, 1],
  // HQ awning (one-way)
  [880, 340, 220, 8, 1],
];

// light sources: {x,y,r,color,base,night} — 'night' = only when dark
let LIGHTS = [];
const EASTON_LIGHTS = [
  { x: 1215, y: 300, r: 300, color: [255, 210, 140], night: 1, cone: 1 },   // lamp post
  { x: 1810, y: 330, r: 240, color: [255, 200, 120], night: 1, cone: 1 },   // dock lamp 1
  { x: 2090, y: 330, r: 240, color: [255, 200, 120], night: 1, cone: 1 },   // dock lamp 2
  { x: 2370, y: 330, r: 240, color: [255, 200, 120], night: 1, cone: 1 },   // dock lamp 3
  { x: 990, y: 380, r: 190, color: [255, 225, 170], night: 1 },    // entrance door
  { x: 990, y: 250, r: 300, color: [242, 181, 68], night: 1, glow: 1 },     // sign
  { x: 760, y: 300, r: 90, color: [200, 220, 255], night: 1 },     // window
  { x: 1120, y: 300, r: 90, color: [200, 220, 255], night: 1 },    // window
  { x: 2910, y: 380, r: 90, color: [255, 240, 200], night: 1 },    // cab headlight
  { x: 3300, y: 330, r: 200, color: [255, 200, 120], night: 1, cone: 1 },   // picnic lamp
];

// ---- pre-rendered layers ----
const LAYERS = {};
function bakeEastonFar() {
  // Far ridge: Blue Mountain silhouette, with Peace Candle tower
  {
    const w = 1400, h = 300, c = mkCanvas(w, h), g = c.getContext('2d');
    g.fillStyle = '#000'; g.beginPath(); g.moveTo(0, h);
    let x = 0; let y = 200;
    const pts = [];
    while (x <= w) { pts.push([x, y]); x += 60; y = 190 + Math.sin(x * 0.013) * 22 + Math.sin(x * 0.041) * 8; }
    for (const p of pts) g.lineTo(p[0], p[1]);
    g.lineTo(w, h); g.closePath(); g.fill();
    // candle tower silhouette (Easton's Peace Candle, abstracted)
    g.fillRect(900, 120, 10, 90); g.beginPath(); g.moveTo(896, 122); g.lineTo(914, 122); g.lineTo(905, 100); g.closePath(); g.fill();
    LAYERS.ridge = c;
  }
  // Farm hills
  {
    const w = 1600, h = 300, c = mkCanvas(w, h), g = c.getContext('2d');
    g.fillStyle = '#000';
    g.beginPath(); g.moveTo(0, h);
    for (let x = 0; x <= w; x += 20) g.lineTo(x, 235 + Math.sin(x * 0.007) * 26 + Math.sin(x * 0.021) * 10);
    g.lineTo(w, h); g.closePath(); g.fill();
    // silo + barn
    g.fillRect(380, 200, 26, 60); g.beginPath(); g.arc(393, 200, 13, Math.PI, 0); g.fill();
    g.fillRect(420, 222, 60, 38); g.beginPath(); g.moveTo(414, 224); g.lineTo(450, 204); g.lineTo(486, 224); g.closePath(); g.fill();
    // fence line
    for (let x = 700; x < 1200; x += 24) g.fillRect(x, 246, 3, 12);
    g.fillRect(700, 250, 500, 2);
    // tree clumps
    for (let i = 0; i < 18; i++) { const tx = (i * 97 + 40) % w, ty = 250 + Math.sin(tx * 0.007) * 10; g.beginPath(); g.arc(tx, ty - 8, 12 + (i % 3) * 4, 0, Math.PI * 2); g.fill(); }
    LAYERS.hills = c;
  }
  // Tree line (near-back)
  {
    const w = 1200, h = 340, c = mkCanvas(w, h), g = c.getContext('2d');
    for (let i = 0; i < 16; i++) {
      const tx = i * 78 + (i % 2) * 20, th = 90 + (i * 37) % 60, tw = 34 + (i * 13) % 20;
      g.fillStyle = i % 2 ? '#2f4d2e' : '#274126';
      g.fillRect(tx - 3, h - th * 0.55, 6, th * 0.55);
      for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(tx + Math.sin(i + k) * 8, h - th + k * (th * 0.2), tw - k * 3, 0, Math.PI * 2); g.fill(); }
    }
    LAYERS.trees = c;
  }
}
function drawEastonPlay(g) {
  {
    // ground
    const gg = g.createLinearGradient(0, WORLD.groundY, 0, H); gg.addColorStop(0, '#6f8f4a'); gg.addColorStop(0.08, '#5c7a3c'); gg.addColorStop(0.12, '#6b5a44'); gg.addColorStop(1, '#3f3529');
    g.fillStyle = gg; g.fillRect(0, WORLD.groundY, WORLD.width, H - WORLD.groundY);
    // parking apron in front of dock
    g.fillStyle = '#4d4f57'; g.fillRect(1400, WORLD.groundY, 1600, H - WORLD.groundY);
    g.fillStyle = '#e9d27a'; for (let x = 1420; x < 2980; x += 70) g.fillRect(x, WORLD.groundY + 26, 30, 3);
    // grass tufts
    g.strokeStyle = '#7fa354'; g.lineWidth = 2;
    for (let x = 0; x < WORLD.width; x += 17) { if (x > 1400 && x < 3000) continue; const hh = 4 + (x * 7) % 6; g.beginPath(); g.moveTo(x, WORLD.groundY); g.lineTo(x + 2, WORLD.groundY - hh); g.stroke(); }
    // HQ building (3747 Hecktown Road)
    drawHQ(g);
    // dock + warehouse wing
    drawDock(g);
    // trailer + cab
    drawTrailer(g, 2470, 288, WORLD.groundY);
    // crates and pallets
    drawCrate(g, 620, 404); drawCrate(g, 656, 404); drawCrate(g, 638, 368);
    drawPallet(g, 1500, 412); drawPallet(g, 1500, 384); drawPallet(g, 1440, 412);
    // lamp post
    g.fillStyle = '#2c3038'; g.fillRect(1212, 300, 6, 140); g.fillRect(1180, 330, 60, 6); g.fillStyle = '#1e2127'; rr(g, 1200, 288, 30, 14, 4); g.fill();
    // picnic table + lamp
    g.fillStyle = '#7a5a3a'; g.fillRect(3250, 414, 90, 6); g.fillRect(3262, 420, 6, 20); g.fillRect(3322, 420, 6, 20); g.fillRect(3240, 428, 110, 4);
    g.fillStyle = '#2c3038'; g.fillRect(3298, 330, 5, 110); rr(g, 3288, 320, 26, 12, 4); g.fill();
    // rocks / hillside at right
    g.fillStyle = '#5a6a44'; g.beginPath(); g.moveTo(3560, 440); g.lineTo(3600, 410); g.lineTo(3680, 410); g.lineTo(3680, 380); g.lineTo(3760, 380); g.lineTo(3760, 350); g.lineTo(3880, 350); g.lineTo(3880, 440); g.closePath(); g.fill();
    g.fillStyle = '#7fa354'; g.fillRect(3600, 408, 80, 4); g.fillRect(3680, 378, 80, 4); g.fillRect(3760, 348, 120, 4);
    // big oaks in play layer
    drawOak(g, 300, WORLD.groundY, 1.1); drawOak(g, 3480, WORLD.groundY, 1.3); drawOak(g, 4050, WORLD.groundY, 1.0);
    // road sign
    g.fillStyle = '#2c3038'; g.fillRect(120, 380, 4, 60); g.fillStyle = '#1e6e3a'; rr(g, 60, 364, 124, 30, 4); g.fill();
    g.fillStyle = '#fff'; g.font = 'bold 12px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('HECKTOWN RD', 122, 384);
  }
}
function bakeShared() {
  // Foreground grass (bottom edge) — sparse so it never hides the player
  {
    const w = 1400, h = 60, c = mkCanvas(w, h), g = c.getContext('2d');
    for (let x = 0; x < w; x += 6) { if ((x * 7919) % 100 > 55) continue; const hh = 18 + Math.sin(x * 0.3) * 6 + (x * 13) % 16; g.fillStyle = (x % 12) ? '#1d2e1a' : '#2a4224'; g.beginPath(); g.moveTo(x, h); g.quadraticCurveTo(x + 2, h - hh * 0.6, x + 5 + Math.sin(x) * 3, h - hh); g.lineTo(x + 6, h); g.fill(); }
    LAYERS.fgGrass = c;
  }
  // Foreground hanging branch (top-left), drawn once per 3 tiles
  {
    const w = 1400, h = 46, c = mkCanvas(w, h), g = c.getContext('2d');
    g.fillStyle = '#223a1e'; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(140, 22, 300, 4); g.lineTo(300, 0); g.closePath(); g.fill();
    for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? '#223a1e' : '#2c4a26'; g.beginPath(); g.ellipse(20 + i * 22, 12 + Math.sin(i) * 7, 13, 7, 0.6 + i * 0.1, 0, Math.PI * 2); g.fill(); }
    LAYERS.fgBranch = c;
  }
  // Clouds (white, tinted at draw time)
  {
    const w = 1800, h = 200, c = mkCanvas(w, h), g = c.getContext('2d');
    const puffs = [[120, 90, 60], [190, 80, 80], [270, 95, 55], [230, 120, 40], [700, 60, 45], [760, 50, 60], [830, 62, 50], [1200, 100, 70], [1290, 85, 90], [1390, 100, 65], [1330, 130, 50], [1650, 70, 40], [1700, 65, 48]];
    for (const [px, py, r] of puffs) { const rg = g.createRadialGradient(px, py, r * 0.2, px, py, r); rg.addColorStop(0, 'rgba(255,255,255,.95)'); rg.addColorStop(0.7, 'rgba(255,255,255,.7)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.beginPath(); g.arc(px, py, r, 0, Math.PI * 2); g.fill(); }
    // flat undersides
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,1)'; g.fillRect(0, 150, 400, 60); g.fillRect(650, 112, 260, 90); g.fillRect(1150, 175, 400, 40); g.fillRect(1600, 110, 200, 90);
    LAYERS.clouds = c;
  }
  // paper grain
  {
    const c = mkCanvas(W, H), g = c.getContext('2d');
    const img = g.createImageData(W, H); const d = img.data;
    for (let i = 0; i < d.length; i += 4) { const v = 225 + Math.random() * 30; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    g.putImageData(img, 0, 0);
    LAYERS.grain = c;
  }
}

function dressGround(g) { // pebbles, cracks, and a contact-shadow band along the ground line
  const gy = WORLD.groundY; if (WORLD.def && WORLD.def.indoor) return;
  const gg = g.createLinearGradient(0, gy - 14, 0, gy + 2); gg.addColorStop(0, 'rgba(0,0,0,0)'); gg.addColorStop(1, 'rgba(0,0,0,.22)'); g.fillStyle = gg; g.fillRect(0, gy - 14, WORLD.width, 16);
  for (let i = 0; i < WORLD.width / 6; i++) { const x = (i * 7919) % WORLD.width, y = gy + 6 + (i * 31) % 34; const s = 1 + (i % 3); g.fillStyle = i % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(x, y, s * 1.6, s * 0.9, 0, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1; for (let i = 0; i < WORLD.width / 260; i++) { const x = (i * 5479) % WORLD.width; g.beginPath(); g.moveTo(x, gy + 8); g.lineTo(x + 12, gy + 20 + (i % 3) * 6); g.lineTo(x + 6, gy + 34); g.stroke(); }
  const top = g.createLinearGradient(0, gy, 0, gy + 5); top.addColorStop(0, 'rgba(255,255,255,.18)'); top.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = top; g.fillRect(0, gy, WORLD.width, 5);
}
function drawHQ(g) {
  const x = 560, y = 236, w = 800, h = 204;
  g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + 8, y + 8, w, h); // drop shadow
  const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#c9b9a0'); gr.addColorStop(1, '#9c8a72');
  g.fillStyle = gr; g.fillRect(x, y, w, h);
  g.fillStyle = 'rgba(255,255,255,.10)'; g.fillRect(x, y + 10, w, 6);
  g.fillStyle = '#7d6c58'; g.fillRect(x, y, w, 10); // parapet
  g.fillStyle = '#5e5044'; g.fillRect(x, y + 10, w, 4);
  // brick base
  g.fillStyle = '#a8503a'; g.fillRect(x, y + h - 70, w, 70);
  g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1;
  for (let yy = y + h - 70; yy < y + h; yy += 8) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); }
  // windows (two floors)
  for (let i = 0; i < 9; i++) {
    const wx = x + 40 + i * 82; if (wx > 900 && wx < 1100) continue;
    for (const wy of [y + 30, y + 92]) {
      g.fillStyle = '#243447'; rr(g, wx, wy, 44, 40, 3); g.fill();
      { const wg = g.createLinearGradient(wx, wy, wx + 44, wy + 40); wg.addColorStop(0, 'rgba(200,220,255,.30)'); wg.addColorStop(0.5, 'rgba(200,220,255,.06)'); wg.addColorStop(1, 'rgba(255,255,255,.14)'); g.fillStyle = wg; g.fillRect(wx + 2, wy + 2, 40, 36); }
      g.fillStyle = 'rgba(200,220,255,.18)'; g.fillRect(wx + 3, wy + 3, 18, 34);
      g.fillStyle = '#5e5044'; g.fillRect(wx + 21, wy, 2, 40);
    }
  }
  // entrance: glass vestibule + awning
  g.fillStyle = '#1e2c3d'; rr(g, 900, y + 60, 180, 144, 6); g.fill();
  g.fillStyle = 'rgba(200,220,255,.12)'; g.fillRect(906, y + 66, 80, 132); g.fillRect(994, y + 66, 80, 132);
  g.fillStyle = '#f2b544'; g.fillRect(984, y + 66, 8, 132); // door frame accent
  g.fillStyle = '#7a3b2a'; g.fillRect(880, 340, 220, 8); g.fillStyle = '#5e2e22'; g.fillRect(880, 348, 220, 3);
  // sign
  g.fillStyle = '#243447'; rr(g, 830, y - 6, 320, 46, 6); g.fill();
  g.fillStyle = '#f2b544'; g.font = 'bold 30px Georgia, serif'; g.textAlign = 'center'; g.fillText('PHILLIPS', 990, y + 28);
  g.fillStyle = '#e6d7bd'; g.font = '11px system-ui, sans-serif'; g.fillText('PET FOOD & SUPPLIES', 990, y + 52);
  g.fillStyle = '#c9b9a0'; g.font = 'bold 10px system-ui, sans-serif'; g.fillText('3747', 990, y + h - 14);
  // rooftop HVAC units
  g.fillStyle = '#8d8d95'; rr(g, 640, y - 24, 60, 24, 3); g.fill(); rr(g, 1180, y - 24, 60, 24, 3); g.fill();
  g.fillStyle = '#6a6a72'; g.fillRect(650, y - 20, 40, 3); g.fillRect(1190, y - 20, 40, 3);
  // flag pole
  g.fillStyle = '#c8c8d0'; g.fillRect(500, 250, 3, 190);
  g.fillStyle = '#3c5fa6'; g.fillRect(503, 252, 34, 20); g.fillStyle = '#c0392b'; g.fillRect(503, 272, 34, 6);
  // shrubs
  g.fillStyle = '#3f6a3a'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(700 + i * 40, 436, 16, 0, Math.PI * 2); g.fill(); }
  for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(1130 + i * 40, 436, 16, 0, Math.PI * 2); g.fill(); }
}

function drawDock(g) {
  // warehouse wing behind dock
  const x = 1400, y = 226, w = 1700, h = 214;
  g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x + 8, y + 8, w, h);
  const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#b7c0c8'); gr.addColorStop(1, '#8a949e');
  g.fillStyle = gr; g.fillRect(x, y, w, h);
  g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x, y + 8, w, 5);
  g.fillStyle = '#6e7880'; g.fillRect(x, y, w, 8);
  // corrugated lines
  g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 2;
  for (let xx = x; xx < x + w; xx += 12) { g.beginPath(); g.moveTo(xx, y + 8); g.lineTo(xx, y + h); g.stroke(); }
  // "WAREHOUSE" letters
  g.fillStyle = '#243447'; g.font = 'bold 28px Georgia, serif'; g.textAlign = 'center'; g.fillText('DISTRIBUTION', 2100, 270);
  g.fillStyle = '#5b6670'; g.font = '12px system-ui, sans-serif'; g.fillText('EASTON, PA', 2100, 288);
  // skylights
  for (let i = 0; i < 6; i++) { g.fillStyle = '#cfe6f7'; g.fillRect(x + 120 + i * 260, y + 20, 80, 14); }
  // dock platform
  g.fillStyle = '#5a5e66'; g.fillRect(1720, 392, 720, 48);
  g.fillStyle = '#e9d27a'; g.fillRect(1720, 392, 720, 4);
  g.fillStyle = '#2c3038'; for (let i = 0; i < 3; i++) g.fillRect(1740 + i * 240, 396, 6, 44);
  // dock doors + bumpers + lamps
  for (let i = 0; i < 3; i++) {
    const dx = 1760 + i * 280;
    g.fillStyle = '#3a4048'; g.fillRect(dx, 300, 100, 92);
    g.fillStyle = '#4b525b'; for (let k = 0; k < 5; k++) g.fillRect(dx + 2, 302 + k * 18, 96, 16);
    g.fillStyle = '#2b2f36'; g.fillRect(dx - 6, 380, 8, 12); g.fillRect(dx + 98, 380, 8, 12);
    g.fillStyle = '#f2b544'; g.font = 'bold 14px system-ui, sans-serif'; g.fillText(String(i + 1), dx + 50, 292);
    g.fillStyle = '#2c3038'; rr(g, dx + 36, 318, 28, 10, 3); g.fill();
  }
  // steps
  g.fillStyle = '#5a5e66'; g.fillRect(1680, 416, 40, 24); g.fillStyle = '#e9d27a'; g.fillRect(1680, 416, 40, 3);
  // yellow safety stripe
  g.fillStyle = '#e9d27a'; for (let xx = 1720; xx < 2440; xx += 20) g.fillRect(xx, 436, 10, 4);
}

function drawTrailer(g, x, y, gy) {
  gy = gy === undefined ? y + 138 : gy; // ground the wheels rest on
  const wy = gy - 20; // axle height
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(x + 240, gy, 260, 8, 0, 0, Math.PI * 2); g.fill();
  const gr = g.createLinearGradient(0, y, 0, y + 92); gr.addColorStop(0, '#f4f2ec'); gr.addColorStop(1, '#cfcac0');
  g.fillStyle = gr; rr(g, x, y, 420, 92, 5); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 1; for (let xx = x + 10; xx < x + 420; xx += 10) { g.beginPath(); g.moveTo(xx, y + 2); g.lineTo(xx, y + 90); g.stroke(); }
  g.fillStyle = '#243447'; g.font = 'bold 26px Georgia, serif'; g.textAlign = 'center'; g.fillText('PHILLIPS', x + 210, y + 44);
  g.fillStyle = '#f2b544'; g.fillRect(x + 90, y + 52, 240, 4);
  g.fillStyle = '#5b6670'; g.font = '10px system-ui, sans-serif'; g.fillText('PET FOOD & SUPPLIES  •  SINCE 1938', x + 210, y + 70);
  // chassis: frame rail under the box, tandem axles at the REAR (left), landing gear near the kingpin
  g.fillStyle = '#2c3038'; g.fillRect(x + 20, y + 92, 390, 8); g.fillRect(x + 48, y + 92, 110, wy - (y + 92)); g.fillRect(x + 330, y + 100, 6, wy - y - 100 + 16); g.fillRect(x + 322, wy + 14, 22, 4);
  for (const wx of [x + 72, x + 118]) { g.fillStyle = '#1b1d22'; g.beginPath(); g.arc(wx, wy, 20, 0, Math.PI * 2); g.fill(); g.fillStyle = '#6a6d75'; g.beginPath(); g.arc(wx, wy, 9, 0, Math.PI * 2); g.fill(); }
  // rear roll-up door
  g.fillStyle = '#e0dcd2'; g.fillRect(x + 2, y + 6, 10, 80); g.fillStyle = 'rgba(0,0,0,.15)'; for (let k = 0; k < 8; k++) g.fillRect(x + 2, y + 8 + k * 10, 10, 1);
  // cab
  const cx = x + 420;
  g.fillStyle = '#c0392b'; rr(g, cx, y + 40, 64, 52, 6); g.fill(); rr(g, cx + 20, y + 4, 44, 44, 6); g.fill();
  g.fillStyle = '#243447'; rr(g, cx + 30, y + 12, 28, 24, 3); g.fill();
  g.fillStyle = '#2c3038'; g.fillRect(cx + 4, y + 92, 76, wy - (y + 92)); // cab frame down to the axle
  g.fillStyle = '#1b1d22'; g.beginPath(); g.arc(cx + 24, wy, 20, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(cx + 66, wy, 20, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#6a6d75'; g.beginPath(); g.arc(cx + 24, wy, 9, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(cx + 66, wy, 9, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff3c4'; g.fillRect(cx + 58, y + 70, 8, 8);
  g.fillStyle = '#8d8d95'; g.fillRect(cx + 8, y - 12, 4, 54); // exhaust stack
}
function drawCrate(g, x, y) {
  g.fillStyle = '#b07a3e'; g.fillRect(x, y, 36, 36); g.fillStyle = '#8a5c2c'; g.fillRect(x, y, 36, 4); g.fillRect(x, y + 32, 36, 4); g.fillRect(x, y, 4, 36); g.fillRect(x + 32, y, 4, 36);
  g.strokeStyle = '#8a5c2c'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 4, y + 4); g.lineTo(x + 32, y + 32); g.moveTo(x + 32, y + 4); g.lineTo(x + 4, y + 32); g.stroke();
}
function drawPallet(g, x, y) {
  g.fillStyle = '#e9e1cf'; g.fillRect(x + 4, y, 52, 20); g.fillStyle = '#f2b544'; g.fillRect(x + 8, y + 6, 20, 8);
  g.fillStyle = '#c9a56a'; g.fillRect(x, y + 20, 60, 8); g.fillStyle = '#9c7a44'; g.fillRect(x + 6, y + 22, 8, 6); g.fillRect(x + 26, y + 22, 8, 6); g.fillRect(x + 46, y + 22, 8, 6);
}
function drawOak(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  { const tg = g.createLinearGradient(-12, 0, 12, 0); tg.addColorStop(0, '#3a2a1c'); tg.addColorStop(0.5, '#5a4230'); tg.addColorStop(1, '#3a2a1c'); g.fillStyle = tg; } g.beginPath(); g.moveTo(-12, 0); g.quadraticCurveTo(-6, -60, -10, -110); g.lineTo(10, -110); g.quadraticCurveTo(6, -60, 12, 0); g.closePath(); g.fill();
  g.strokeStyle = '#4a3624'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, -100); g.lineTo(-40, -140); g.moveTo(0, -105); g.lineTo(44, -150); g.stroke();
  const cl = [['#3f6a3a', 0, -160, 60], ['#4c7c44', -45, -140, 44], ['#4c7c44', 48, -150, 46], ['#5c8f4f', -10, -190, 42], ['#5c8f4f', 30, -185, 36]];
  for (const [col, cx, cy, r] of cl) { const fg = g.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r); fg.addColorStop(0, lighten(col, 0.22)); fg.addColorStop(0.7, col); fg.addColorStop(1, shade(col, 0.68)); g.fillStyle = fg; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.ellipse(0, -120, 70, 14, 0, 0, Math.PI); g.fill();
  g.restore();
}

/* ---------------- entities ---------------- */
const player = { x: 420, y: WORLD.groundY, vx: 0, vy: 0, w: 22, h: 52, facing: 1, onGround: false, wall: 0, coyote: 0, buffer: 0, dashT: 0, dashCd: 0, run: 0, t: 0, squash: 1, stretch: 1, moving: false, landed: 0, hp: 3, maxHp: 3, inv: 0, dead: 0 };
const dog = { x: 360, y: WORLD.groundY, vx: 0, vy: 0, facing: 1, onGround: false, run: 0, t: 0, earA: 0, earV: 0, moving: false, sitT: 0 };
const camera = { x: 0, y: 0, look: 0 };
const G = 2400, RUN = 300, JUMP = -760, DASH = 720;
let hour = 18.5, timeAuto = true, weather = 0; // 0 clear, 1 fog, 2 rain, 3 snow
const WEATHER = ['Clear', 'Fog', 'Rain', 'Snow'];
let hero = ROSTER[0];
let running = false;
let shake = 0;
let mode = 'world'; // 'world' | 'drive'
const restored = { taunton: false };
let flash = 0; // hud fade

function solidsAt() { return SOLIDS; }
function moveBody(b, dt, half) {
  // horizontal
  b.x += b.vx * dt;
  b.wall = 0;
  for (const s of SOLIDS) {
    if (s[4]) continue;
    const l = b.x - half, r = b.x + half, top = b.y - b.h, bot = b.y;
    if (r > s[0] && l < s[0] + s[2] && bot > s[1] + 1 && top < s[1] + s[3]) {
      if (b.vx > 0) { b.x = s[0] - half; b.wall = 1; } else if (b.vx < 0) { b.x = s[0] + s[2] + half; b.wall = -1; }
      b.vx = 0;
    }
  }
  b.x = clamp(b.x, half, WORLD.width - half);
  // vertical
  const prevBot = b.y;
  b.y += b.vy * dt;
  b.onGround = false;
  for (const s of SOLIDS) {
    const l = b.x - half, r = b.x + half, top = b.y - b.h, bot = b.y;
    if (r <= s[0] || l >= s[0] + s[2]) continue;
    if (b.vy >= 0 && bot >= s[1] && prevBot <= s[1] + 0.01 && top < s[1]) { b.y = s[1]; b.vy = 0; b.onGround = true; }
    else if (!s[4] && b.vy < 0 && top < s[1] + s[3] && bot > s[1] + s[3] && prevBot - b.h >= s[1] + s[3] - 0.01) { b.y = s[1] + s[3] + b.h; b.vy = 0; }
  }
}

function updatePlayer(dt) {
  const p = player;
  p.t += dt;
  if (p.inv > 0) p.inv -= dt;
  if (p.dead > 0) { p.dead -= dt; p.vx = 0; p.vy = 0; if (p.dead <= 0) respawn(); return; }
  if (shop.open || talk.open) { p.vx = 0; p.vy += G * dt; moveBody(p, dt, p.w / 2); return; }
  if (forklift.mounted) { p.moving = false; p.run = 0; return; }
  const dir = tk.right - tk.left;
  const dashing = p.dashT > 0;
  if (!dashing) {
    const target = dir * RUN;
    const acc = hazard.ice && p.onGround ? 700 : p.onGround ? 2600 : 1800;
    if (dir) { p.vx += clamp(target - p.vx, -acc * dt, acc * dt); p.facing = dir; }
    else p.vx += clamp(-p.vx, -acc * 0.8 * dt, acc * 0.8 * dt);
    p.vy += G * dt;
    if (p.vy > 900) p.vy = 900;
  }
  // coyote / buffer
  if (p.onGround) p.coyote = 0.1; else p.coyote -= dt;
  if (edge.jump) p.buffer = 0.12; else p.buffer -= dt;
  // wall slide
  const wallSlide = !p.onGround && p.wall && dir === p.wall && p.vy > 0;
  if (wallSlide && p.vy > 140) p.vy = 140;
  if (p.buffer > 0) {
    if (p.coyote > 0) { sfx('jump'); p.vy = p.carry ? JUMP * 0.82 : JUMP; p.coyote = 0; p.buffer = 0; p.stretch = 1.18; p.squash = 0.86; puff(p.x, p.y, 6); }
    else if (wallSlide || (!p.onGround && p.wall)) { p.vy = -640; p.vx = -p.wall * 340; p.facing = -p.wall; p.buffer = 0; p.stretch = 1.15; p.squash = 0.9; puff(p.x + p.wall * 10, p.y - 20, 5); }
  }
  // variable jump
  if (!tk.jump && p.vy < -300) p.vy = -300;
  // dash
  if (p.dashCd > 0) p.dashCd -= dt;
  if (edge.dash && p.dashCd <= 0 && !dashing) { sfx('dash'); p.dashT = 0.16; p.dashCd = 0.55; p.vx = p.facing * DASH; p.vy = 0; p.stretch = 0.8; p.squash = 1.25; }
  if (dashing) { p.dashT -= dt; p.vy = 0; if (p.t % 0.03 < dt) trail(p.x, p.y, p.facing); if (p.dashT <= 0) p.vx = p.facing * RUN; }
  const wasGround = p.onGround;
  moveBody(p, dt, p.w / 2);
  if (p.onGround && !wasGround) { p.squash = 1.25; p.stretch = 0.78; p.landed = 0.15; puff(p.x, p.y, 8); }
  p.squash += (1 - p.squash) * Math.min(1, dt * 14); p.stretch += (1 - p.stretch) * Math.min(1, dt * 14);
  p.moving = Math.abs(p.vx) > 20;
  if (p.moving && p.onGround) p.run = (p.run + dt * (Math.abs(p.vx) / 62)) % 1; else if (!p.moving) p.run = 0;
  if (p.moving && p.onGround && p.t % 0.16 < dt && weather !== 2) puff(p.x - p.facing * 8, p.y, 1);
}

function updateDog(dt) {
  const d = dog; d.t += dt;
  const dx = player.x - d.x;
  const want = Math.abs(dx) > 70 ? Math.sign(dx) * Math.min(340, 120 + Math.abs(dx) * 1.6) : 0;
  d.vx += clamp(want - d.vx, -2200 * dt, 2200 * dt);
  if (want) d.facing = Math.sign(want);
  d.vy += G * dt;
  // jump if blocked or player is above and near
  if (d.onGround && ((d.wall && want) || (player.y < d.y - 40 && Math.abs(dx) < 120 && player.onGround))) { d.vy = -640; }
  if (d.onGround && Math.abs(dx) > 260 && want) d.vy = -520; // catch-up hop
  d.h = 24;
  moveBody(d, dt, 12);
  // teleport if hopelessly far
  if (Math.abs(dx) > 900) { d.x = player.x - player.facing * 60; d.y = player.y; d.vy = 0; }
  d.moving = Math.abs(d.vx) > 30;
  if (d.moving) d.run = (d.run + dt * (Math.abs(d.vx) / 50)) % 1;
  // ear spring
  const targetEar = clamp(-d.vy / 900, -0.6, 0.6) + (d.moving ? 0.25 : 0);
  d.earV += (targetEar - d.earA) * 60 * dt; d.earV *= 0.86; d.earA += d.earV * dt * 10;
}

/* ---------------- particles & weather ---------------- */
const parts = []; const MAXP = 900;
function spawn(o) { if (parts.length < MAXP) parts.push(o); }
function puff(x, y, n) { for (let i = 0; i < n; i++) spawn({ k: 'puff', x: x + rnd(-8, 8), y: y - rnd(0, 4), vx: rnd(-40, 40), vy: rnd(-50, -10), life: rnd(0.3, 0.6), t: 0, r: rnd(2, 5) }); }
function trail(x, y, f) { spawn({ k: 'trail', x, y, life: 0.25, t: 0, f }); }
const fireflies = []; for (let i = 0; i < 40; i++) fireflies.push({ x: rnd(0, WORLD.width), y: rnd(250, 430), ph: rnd(0, 10), sp: rnd(0.5, 1.5) });
let fogBands = []; for (let i = 0; i < 6; i++) fogBands.push({ y: 300 + i * 30, sp: rnd(6, 18), ph: rnd(0, 100), h: rnd(40, 80) });
let snowAcc = 0;
function updateWeather(dt, tNow) {
  // steam from rooftop HVAC always
  if (WORLD.id === 'easton' && tNow % 0.09 < dt) for (const sx of [670, 1210]) spawn({ k: 'steam', x: sx + rnd(-10, 10), y: 212, vx: rnd(-6, 6) + windX() * 0.2, vy: rnd(-26, -16), life: rnd(1.6, 2.6), t: 0, r: rnd(6, 10) });
  if (tNow % 0.5 < dt) spawn({ k: 'steam', x: WORLD.truckX + 448 + rnd(-2, 2), y: 288, vx: windX() * 0.2, vy: rnd(-30, -20), life: 1.6, t: 0, r: 5 }); // exhaust
  if (weather === 2 && Math.random() < dt * 0.08) shake = Math.max(shake, 0.12); // thunder
  if (weather === 2) { for (let i = 0; i < 6; i++) spawn({ k: 'rain', x: camera.x + rnd(-100, W + 100), y: camera.y - 20, vx: windX() * 0.6 - 60, vy: rnd(900, 1100), life: 1, t: 0 }); }
  if (weather === 3) { for (let i = 0; i < 2; i++) spawn({ k: 'snow', x: camera.x + rnd(-100, W + 100), y: -10, vx: windX() * 0.15, vy: rnd(40, 90), life: 9, t: 0, r: rnd(1.5, 3.5), ph: rnd(0, 6) }); snowAcc = Math.min(1, snowAcc + dt * 0.02); }
  else snowAcc = Math.max(0, snowAcc - dt * 0.03);
}
function windX() { return Math.sin(gameTime * 0.4) * 30 + 20; }
const lightning = { t: 0, x: 0, seg: [] };
function updateLightning(dt) {
  if (lightning.t > 0) lightning.t -= dt;
  if (weather === 2 && lightning.t <= 0 && Math.random() < dt * 0.09) { lightning.t = 0.35; lightning.x = rnd(80, W - 80); lightning.seg.length = 0; let x = lightning.x, y = 0; while (y < 330) { const nx = x + rnd(-40, 40), ny = y + rnd(24, 60); lightning.seg.push([x, y, nx, ny]); if (Math.random() < 0.35) lightning.seg.push([x, y, x + rnd(-70, 70), y + rnd(30, 70)]); x = nx; y = ny; } shake = Math.max(shake, 0.18); }
}
function drawLightningBolt() {
  const a = Math.min(1, lightning.t * 4); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba([220, 230, 255], a); ctx.lineWidth = 4; ctx.beginPath(); for (const [x1, y1, x2, y2] of lightning.seg) { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); } ctx.stroke();
  ctx.strokeStyle = rgba([255, 255, 255], a); ctx.lineWidth = 1.5; ctx.stroke();
  const gl = ctx.createRadialGradient(lightning.x, 120, 10, lightning.x, 120, 420); gl.addColorStop(0, rgba([200, 215, 255], a * 0.35)); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function drawWaterReflections(cx, cy, night, sk) {
  const ws = WORLD.def && WORLD.def.water; if (!ws) return;
  for (const w of ws) {
    const x0 = w.x0 - cx, x1 = w.x1 - cx; if (x1 < 0 || x0 > W) continue;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, w.y - cy, x1 - x0, H); ctx.clip();
    // sky glint
    ctx.globalCompositeOperation = 'screen'; const sg = ctx.createLinearGradient(0, w.y - cy, 0, w.y - cy + 60); sg.addColorStop(0, rgba(sk.hor, 0.35)); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.fillRect(x0, w.y - cy, x1 - x0, 60);
    // light shimmer streaks
    for (const L of LIGHTS) { const lx = L.x - cx; if (lx < x0 - 200 || lx > x1 + 200) continue; for (let k = 0; k < 6; k++) { const yy = w.y - cy + 6 + k * 9; const wob = Math.sin(gameTime * 3 + k * 1.7 + L.x) * 8; ctx.fillStyle = rgba(L.color, (night * 0.28 + 0.06) * (1 - k / 7)); ctx.fillRect(lx - 16 + wob, yy, 32 - k * 3, 2); } }
    // flipped actors, faded
    ctx.globalCompositeOperation = 'source-over';
    const flip = (draw, ax, ay) => { ctx.save(); ctx.translate(ax - cx, w.y - cy); ctx.scale(1, -0.55); ctx.globalAlpha = 0.28; draw(); ctx.restore(); };
    flip(() => drawHero(ctx, hero, 0, 0, player.facing, { t: player.t, run: player.run, moving: player.moving, air: !player.onGround }, null), player.x, player.y);
    for (const f of crew) flip(() => drawHero(ctx, f.hero, 0, 0, f.facing, { t: f.t, run: f.run, moving: f.moving, air: !f.onGround }, null), f.x, f.y);
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(120,150,190,.35)'; ctx.fillRect(x0, w.y - cy, x1 - x0, H);
    ctx.restore();
  }
}
function updateAmbient(dt) {
  updateLightning(dt);
  if (perf.low) return;
  const night = nightness(hour); const id = WORLD.id;
  if (night > 0.35 && Math.random() < dt * 14) { const L = LIGHTS.filter(l => l.cone && Math.abs(l.x - camera.x - W / 2) < W); if (L.length) { const l = L[(Math.random() * L.length) | 0]; spawn({ k: 'mote', x: l.x + rnd(-l.r * 0.3, l.r * 0.3), y: l.y + rnd(20, 110), vx: rnd(-6, 6), vy: rnd(-8, 4), life: rnd(2, 4), t: 0, c: l.color }); } }
  const leafy = ({ easton: 1, lansing: 1, spartanburg: 1, taunton: 0.5, merge: 1 })[id] || 0;
  if (leafy && weather !== 2 && Math.random() < dt * 1.6 * leafy) spawn({ k: 'leaf', x: camera.x + rnd(-100, W + 100), y: camera.y + rnd(-40, 200), vx: windX() * 0.8, vy: rnd(30, 60), life: 8, t: 0, ph: rnd(0, 6), col: id === 'lansing' ? ['#c8632c', '#e0a030', '#b8402c'][(Math.random() * 3) | 0] : ['#7fa354', '#a8b04a', '#c8912e'][(Math.random() * 3) | 0] });
  if ((id === 'sacramento' || id === 'plantcity' || id === 'billings') && night < 0.5 && Math.random() < dt * 6) spawn({ k: 'mote', x: camera.x + rnd(0, W), y: camera.y + rnd(150, 430), vx: windX() * 0.3, vy: rnd(-6, 6), life: rnd(2, 5), t: 0, c: [255, 240, 180] });
}
function updateParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.t += dt;
    if (p.k === 'puff' || p.k === 'steam' || p.k === 'mote') { p.x += p.vx * dt; p.y += p.vy * dt; if (p.k === 'steam') { p.r += dt * 6; p.vx += (windX() * 0.3 - p.vx) * dt; } if (p.k === 'mote') { p.x += Math.sin(p.t * 2 + p.life) * 6 * dt; } }
    else if (p.k === 'part') { p.vy += G * dt; p.x += p.vx * dt; p.y += p.vy * dt; const gy = groundYAt(p.x); if (p.y >= gy) { p.y = gy; p.vy *= -0.35; p.vx *= 0.6; } }
    else if (p.k === 'leaf') { p.x += (p.vx + Math.sin(p.t * 1.7 + p.ph) * 40) * dt; p.y += (p.vy + Math.cos(p.t * 2.1 + p.ph) * 20) * dt; if (p.y >= groundYAt(p.x) - 2) p.t = 99; }
    else if (p.k === 'rain') { p.x += p.vx * dt; p.y += p.vy * dt; if (p.y >= groundYAt(p.x)) { p.t = 9; if (Math.random() < 0.35) spawn({ k: 'ring', x: p.x, y: groundYAt(p.x), life: 0.35, t: 0 }); } }
    else if (p.k === 'snow') { p.x += (p.vx + Math.sin(p.t * 1.5 + p.ph) * 18) * dt; p.y += p.vy * dt; if (p.y >= groundYAt(p.x) - 2) p.t = 99; }
    if (p.t >= p.life) parts.splice(i, 1);
  }
}
function groundYAt(x) { let y = WORLD.groundY; for (const s of SOLIDS) if (x > s[0] && x < s[0] + s[2] && s[1] < y && !s[4]) y = s[1]; return y; }

/* ---------------- lighting helpers ---------------- */
const lightBuf = mkCanvas(W / 2, H / 2), lctx = lightBuf.getContext('2d');
const bloomA = mkCanvas(W / 4, H / 4), bloomB = mkCanvas(W / 4, H / 4), bctxA = bloomA.getContext('2d'), bctxB = bloomB.getContext('2d');
function blurPass(src, dst, r) { const g = dst.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, dst.width, dst.height); g.globalAlpha = 1 / 9; for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) g.drawImage(src, dx * r, dy * r); g.globalAlpha = 1; }
function nearestLight(x, y, night) {
  let best = null, bd = 1e9;
  for (const L of LIGHTS) { const d = (L.x - x) ** 2 + (L.y - y) ** 2; if (d < bd && d < (L.r * 1.2) ** 2) { bd = d; best = L; } }
  if (!best || night < 0.3) return { i: 1 - night, color: [255, 230, 190], side: 1 };
  return { i: night, color: best.color, side: best.x > x ? 1 : -1 };
}

/* ---------------- camera ---------------- */
function updateCamera(dt) {
  camera.look += (player.facing * 90 - camera.look) * Math.min(1, dt * 2.5);
  let tx = clamp(player.x + camera.look - W / 2, 0, WORLD.width - W);
  if (arena.active) { const aw = arena.x1 - arena.x0 + 80; tx = aw <= W ? clamp((arena.x0 + arena.x1) / 2 - W / 2, 0, WORLD.width - W) : clamp(player.x + camera.look * 0.5 - W / 2, arena.x0 - 40, arena.x1 + 40 - W); }
  const ty = clamp(player.y - H * 0.68, -60, 0);
  camera.x += (tx - camera.x) * Math.min(1, dt * 6);
  camera.y += (ty - camera.y) * Math.min(1, dt * 3);
  if (shake > 0) { shake -= dt; camera.x += Math.sin(gameTime * 90) * shake * 60; camera.y += Math.cos(gameTime * 70) * shake * 40; }
}

/* ---------------- update ---------------- */
let gameTime = 0;
function update(dt) {
  gameTime += dt;
  updateDemo(dt);
  syncInput(); runTaps(); audioTick();
  if (options.open) { updateOptions(); return; }
  updateVignette(dt); updatePhoto(dt);
  if (edge.weather) { weather = (weather + 1) % 4; flash = 2; }
  if (edge.time) { hour = Math.round(hour / 3) * 3 + 3; timeAuto = false; flash = 2; }
  if (timeAuto) hour += dt / 15; // one hour per 15 s
  hour = ((hour % 24) + 24) % 24;
  if (mode === 'drive') { updateDrive(dt); if (flash > 0) flash -= dt; return; }
  updatePlayer(dt);
  if (arena.active) { player.x = clamp(player.x, arena.x0 + 12, arena.x1 - 12); }
  updateDog(dt);
  updateCombat(dt);
  updateCamera(dt);
  updateWeather(dt, gameTime);
  updateAmbient(dt);
  updateParts(dt);
  if (flash > 0) flash -= dt;
}

/* ---------------- render ---------------- */
function render() {
  uiTaps.length = 0;
  if (mode === 'drive') { renderDrive(); return; }
  const sk = skyAt(hour), night = nightness(hour);
  const cx = camera.x, cy = camera.y;
  // sky
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgb(sk.top)); g.addColorStop(0.4, rgb(mix(sk.top, sk.hor, 0.45))); g.addColorStop(0.72, rgb(sk.hor)); g.addColorStop(1, rgb(mix(sk.hor, [255, 255, 255], 0.2)));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (weather === 2) { const og = ctx.createLinearGradient(0, 0, 0, H * 0.7); og.addColorStop(0, 'rgba(48,56,74,.7)'); og.addColorStop(1, 'rgba(70,80,100,.25)'); ctx.fillStyle = og; ctx.fillRect(0, 0, W, H * 0.7); }
  // stars
  if (night > 0.35) { ctx.fillStyle = rgba([255, 255, 255], (night - 0.35) * 1.2); for (let i = 0; i < 70; i++) { const sx = (i * 137.5 + 20) % W, sy = (i * 71.3) % (H * 0.5); const tw = 0.5 + 0.5 * Math.sin(gameTime * 2 + i); ctx.fillRect(sx - cx * 0.02 % W, sy, 1.5 * tw, 1.5 * tw); } }
  // sun / moon
  const sunA = ((hour - 6) / 12) * Math.PI; // 6→sunrise, 18→sunset
  const sunX = W * 0.5 - Math.cos(sunA) * W * 0.55 - cx * 0.03, sunY = H * 0.62 - Math.sin(sunA) * H * 0.55;
  if (hour > 5.5 && hour < 18.8) { const sg = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 120); sg.addColorStop(0, 'rgba(255,240,200,.95)'); sg.addColorStop(0.15, 'rgba(255,220,150,.55)'); sg.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H); }
  else { const mA = ((hour + 6) % 24 / 12) * Math.PI; const mx = W * 0.5 - Math.cos(mA) * W * 0.5 - cx * 0.03, my = H * 0.6 - Math.sin(mA) * H * 0.5; ctx.fillStyle = '#eef1ff'; ctx.beginPath(); ctx.arc(mx, my, 16, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = rgb(sk.top); ctx.beginPath(); ctx.arc(mx + 7, my - 4, 13, 0, Math.PI * 2); ctx.fill(); }
  // far ridge (atmospheric perspective: silhouette drawn in haze-tinted color)
  // sun rays
  if (night < 0.5 && hour > 5.5 && hour < 18.8) { ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let k = 0; k < 5; k++) { const a = (k - 2) * 0.22 + Math.sin(gameTime * 0.15 + k) * 0.05; const rg = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(Math.PI / 2 + a) * 900, sunY + Math.sin(Math.PI / 2 + a) * 900); rg.addColorStop(0, rgba([255, 230, 170], 0.10 * (1 - night * 2))); rg.addColorStop(1, 'rgba(255,230,170,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(sunX, sunY); ctx.lineTo(sunX + Math.cos(Math.PI / 2 + a - 0.06) * 1200, sunY + Math.sin(Math.PI / 2 + a - 0.06) * 1200); ctx.lineTo(sunX + Math.cos(Math.PI / 2 + a + 0.06) * 1200, sunY + Math.sin(Math.PI / 2 + a + 0.06) * 1200); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  // clouds (painterly, tinted by sky)
  drawTiled(LAYERS.clouds, 0.06, 20 + cy * 0.1 + Math.sin(gameTime * 0.05) * 4, mix(sk.hor, [255, 255, 255], 0.62 - night * 0.5), 0.85 - night * 0.45, gameTime * 4, mix(sk.hor, sk.top, 0.55));
  // birds by day
  if (night < 0.4) { ctx.strokeStyle = rgba([40, 40, 60], 0.7 - night); ctx.lineWidth = 1.5; for (let i = 0; i < 7; i++) { const bx = ((gameTime * 22 + i * 47 - cx * 0.08) % (W + 200)) - 100, by = 70 + Math.sin(i * 1.7) * 26 + Math.sin(gameTime + i) * 4; const fl = Math.sin(gameTime * 9 + i) * 3; ctx.beginPath(); ctx.moveTo(bx - 5, by + fl); ctx.quadraticCurveTo(bx, by - 2, bx + 5, by + fl); ctx.stroke(); } }
  drawTiled(LAYERS.ridge, 0.12, 30 + cy * 0.2, mix(sk.haze, sk.top, 0.42), 1, 0, mix(sk.haze, sk.top, 0.62), night < 0.55 ? mix(sk.hor, [255, 255, 255], 0.35 - night * 0.3) : null);
  // haze veil over the ridge
  { const hz = ctx.createLinearGradient(0, 150, 0, 330); hz.addColorStop(0, rgba(sk.haze, 0)); hz.addColorStop(1, rgba(sk.haze, 0.35)); ctx.fillStyle = hz; ctx.fillRect(0, 150, W, 180); }
  drawTiled(LAYERS.hills, 0.28, 90 + cy * 0.35, mix(sk.haze, [64, 96, 62], 0.6 + night * 0.28), 1, 0, mix(sk.haze, [40, 60, 40], 0.75 + night * 0.2), night < 0.55 ? mix(sk.hor, [180, 210, 140], 0.5 - night * 0.4) : null);
  // candle light at night
  if (WORLD.id === 'easton' && night > 0.3) { const px = (900 - cx * 0.12) % 1400; ctx.fillStyle = rgba([255, 200, 100], night * 0.9); ctx.beginPath(); ctx.arc(px + 5, 130 + cy * 0.2, 3, 0, Math.PI * 2); ctx.fill(); }
  // tree line
  drawTiled(LAYERS.trees, 0.55, 110 + cy * 0.6, null, 1);
  { const hz = ctx.createLinearGradient(0, 240, 0, 450); hz.addColorStop(0, rgba(sk.haze, 0.05)); hz.addColorStop(1, rgba(sk.haze, 0.22 + night * 0.12)); ctx.fillStyle = hz; ctx.fillRect(0, 240, W, 210); }
  // play layer
  ctx.drawImage(LAYERS.play, -cx, -cy);
  // snow accumulation
  if (snowAcc > 0) { ctx.fillStyle = rgba([240, 244, 255], snowAcc * 0.9); for (const s of SOLIDS) { if (s[4]) continue; ctx.fillRect(s[0] - cx, s[1] - cy - 3 * snowAcc, s[2], 3 * snowAcc + 1); } }
  // particles behind actors
  ctx.save(); ctx.translate(-cx, -cy);
  for (const p of parts) if (p.k === 'steam') { ctx.fillStyle = rgba([240, 240, 245], 0.28 * (1 - p.t / p.life)); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
  for (const p of parts) if (p.k === 'leaf') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t * 3 + p.ph); ctx.fillStyle = p.col; ctx.beginPath(); ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  // fireflies
  if (night > 0.3) { for (const f of fireflies) { const a = (Math.sin(gameTime * f.sp + f.ph) + 1) / 2; if (a < 0.2) continue; const fx = f.x + Math.sin(gameTime * 0.6 + f.ph) * 30, fy = f.y + Math.cos(gameTime * 0.4 + f.ph * 2) * 14; ctx.fillStyle = rgba([220, 255, 120], a * night); ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI * 2); ctx.fill(); } }
  drawMonoPass(); // the past: everything so far goes gray; actors below stay in color
  // cast-shadow setup: low sun → long shadows away from the sun; night → short, from the nearest light
  { const sunUp = hour > 5.5 && hour < 18.8; const lowness = sunUp ? 1 - Math.abs(Math.sin(sunA)) : 0; shadowInfo.dir = sunUp ? (sunX < W / 2 ? 1 : -1) : 1; shadowInfo.len = sunUp ? 10 + lowness * 40 : 0; }
  // actors
  renderCombatBack(night);
  drawStoryLayer(night);
  drawBreakpoints();
  drawLockout();
  drawPrologueLayer();
  drawLedgerPages();
  drawValves();
  drawForklift(ctx, night);
  drawPhotoLineup(night);
  drawCrew(night);
  drawEveryone(night);
  drawAnimals(night);
  drawContainers();
  drawCats();
  if (!(demo.active && DEMO_SCRIPT[demo.idx] && DEMO_SCRIPT[demo.idx].hideHero) && !photo.active) drawBiscuit(ctx, dog, nearestLight(dog.x, dog.y - 14, night));
  if (dog.grr > 0) { ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, dog.x - 18, dog.y - 58, 36, 16, 5); ctx.fill(); ctx.fillStyle = '#ff8a5a'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center'; ctx.fillText('grrr', dog.x, dog.y - 46); ctx.textAlign = 'left'; }
  drawBossProjs();
  drawHazards();
  for (const p of parts) if (p.k === 'trail') { ctx.globalAlpha = 0.35 * (1 - p.t / p.life); drawHero(ctx, hero, p.x, p.y, p.f, { t: 0, air: true }, null); ctx.globalAlpha = 1; }
  const hideHero = demo.active && DEMO_SCRIPT[demo.idx] && DEMO_SCRIPT[demo.idx].hideHero;
  if (!hideHero && !forklift.mounted && !(player.inv > 0 && player.inv < 1.15 && Math.floor(gameTime * 20) % 2)) drawHero(ctx, hero, player.x, player.y, player.facing, { t: player.t, run: player.run, moving: player.moving, air: !player.onGround, squash: player.squash, stretch: player.stretch, big: player.big || 1, hurt: player.inv > 0.85 && player.inv < 1.15, dead: player.dead > 0 ? (1.6 - player.dead) * 2 : 0 }, nearestLight(player.x, player.y - 30, night));
  renderCombatFront(night);
  drawPortal();
  drawStoryFront();
  drawBubbles();
  drawVignetteBits();
  // front particles
  for (const p of parts) {
    if (p.k === 'mote') { const a = Math.sin(Math.PI * clamp(p.t / p.life, 0, 1)); ctx.fillStyle = rgba(p.c, 0.35 * a); ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill(); }
    else if (p.k === 'puff') { ctx.fillStyle = rgba([220, 210, 190], 0.5 * (1 - p.t / p.life)); ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + p.t), 0, Math.PI * 2); ctx.fill(); }
    else if (p.k === 'ring') { ctx.strokeStyle = rgba([200, 220, 255], 0.5 * (1 - p.t / p.life)); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(p.x, p.y, 3 + p.t * 20, 1 + p.t * 5, 0, 0, Math.PI * 2); ctx.stroke(); }
  }
  ctx.restore();
  // foreground occluders
  { const w = LAYERS.fgGrass.width; let fx = (-cx * 1.25) % w; if (fx > 0) fx -= w; for (let k = 0; k < 3; k++) ctx.drawImage(LAYERS.fgGrass, fx + k * w, H - 60 - cy * 0.3); }
  { const w = LAYERS.fgBranch.width; let fx = (-cx * 1.3) % (w * 3); if (fx > 0) fx -= w * 3; ctx.drawImage(LAYERS.fgBranch, fx, -6 - cy * 0.5); ctx.drawImage(LAYERS.fgBranch, fx + w * 3, -6 - cy * 0.5); }
  // ---- light buffer (multiply) ----
  lctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
  lctx.globalCompositeOperation = 'source-over';
  lctx.fillStyle = rgb(sk.amb); lctx.fillRect(0, 0, W, H);
  if (night > 0.05) {
    lctx.globalCompositeOperation = 'lighter';
    { const mA = ((hour + 6) % 24 / 12) * Math.PI; const mx = W * 0.5 - Math.cos(mA) * W * 0.5 - cx * 0.03, my = H * 0.6 - Math.sin(mA) * H * 0.5; const mg = lctx.createRadialGradient(mx, my, 40, mx, my, 900); mg.addColorStop(0, rgba([120, 140, 200], night * 0.35)); mg.addColorStop(1, 'rgba(0,0,0,0)'); lctx.fillStyle = mg; lctx.fillRect(0, 0, W, H); }
    for (const L of LIGHTS) {
      const lx = L.x - cx, ly = L.y - cy; if (lx < -L.r || lx > W + L.r) continue;
      const gr = lctx.createRadialGradient(lx, ly, 0, lx, ly, L.r * 1.25); const a = night * 0.95 * (L.x === 2910 ? (0.7 + 0.3 * Math.sin(gameTime * 30)) : 1);
      gr.addColorStop(0, rgba(L.color, a)); gr.addColorStop(0.3, rgba(L.color, a * 0.8)); gr.addColorStop(0.65, rgba(L.color, a * 0.3)); gr.addColorStop(1, rgba(L.color, 0));
      lctx.fillStyle = gr; lctx.fillRect(lx - L.r, ly - L.r, L.r * 2, L.r * 2);
    }
    // Biscuit's tag
    { const lx = dog.x - cx + dog.facing * 11, ly = dog.y - cy - 14; const gr = lctx.createRadialGradient(lx, ly, 0, lx, ly, 60); gr.addColorStop(0, rgba([242, 181, 68], night * 0.7)); gr.addColorStop(1, 'rgba(0,0,0,0)'); lctx.fillStyle = gr; lctx.fillRect(lx - 60, ly - 60, 120, 120); }
    // lightning
    if (weather === 2 && lightning.t > 0) { lctx.fillStyle = rgba([255, 255, 255], 0.9 * Math.min(1, lightning.t * 6)); lctx.fillRect(0, 0, W, H); }
  }
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(lightBuf, 0, 0, W, H); ctx.restore();
  // ---- emissive glow pass (screen) + bloom ----
  if (night > 0.05) drawEmissive(cx, cy, night);
  renderBloom(cx, cy, night);
  // wet sheen on the ground in rain
  if (weather === 2 || snowAcc > 0.3) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const wg = ctx.createLinearGradient(0, WORLD.groundY - cy, 0, WORLD.groundY - cy + 60); wg.addColorStop(0, rgba(sk.hor, weather === 2 ? 0.22 : 0.12)); wg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = wg; ctx.fillRect(0, WORLD.groundY - cy, W, 60); for (const L of LIGHTS) { const lx = L.x - cx; if (lx < -100 || lx > W + 100) continue; const rg = ctx.createLinearGradient(lx, WORLD.groundY - cy, lx, WORLD.groundY - cy + 50); rg.addColorStop(0, rgba(L.color, night * 0.35)); rg.addColorStop(1, rgba(L.color, 0)); ctx.fillStyle = rg; ctx.fillRect(lx - 14, WORLD.groundY - cy, 28, 50); } ctx.restore(); }
  drawWaterReflections(cx, cy, night, sk);
  // ---- weather overlays ----
  ctx.save(); ctx.translate(-cx, -cy);
  for (const p of parts) {
    if (p.k === 'rain') { ctx.strokeStyle = 'rgba(200,220,255,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.012, p.y - 14); ctx.stroke(); }
    else if (p.k === 'snow') { ctx.fillStyle = 'rgba(245,248,255,.85)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore();
  if (weather === 1) { for (const b of fogBands) { const y = b.y - cy; const gr = ctx.createLinearGradient(0, y, 0, y + b.h); gr.addColorStop(0, 'rgba(210,220,230,0)'); gr.addColorStop(0.5, 'rgba(210,220,230,.22)'); gr.addColorStop(1, 'rgba(210,220,230,0)'); ctx.fillStyle = gr; const off = (gameTime * b.sp + b.ph - cx * 0.5) % (W * 2); for (let k = -1; k < 2; k++) ctx.fillRect(off + k * W * 1.3 - W * 0.3, y + Math.sin(gameTime * 0.3 + b.ph) * 6, W * 1.3, b.h); } ctx.fillStyle = 'rgba(200,210,225,.12)'; ctx.fillRect(0, 0, W, H); }
  if (weather === 2) { ctx.fillStyle = 'rgba(40,50,70,.18)'; ctx.fillRect(0, 0, W, H); if (lightning.t > 0) drawLightningBolt(); }
  if (weather === 3) { ctx.fillStyle = 'rgba(220,230,255,.06)'; ctx.fillRect(0, 0, W, H); }
  // sun grade: warm screen wash from the sun at low angles
  if (hour > 5.5 && hour < 18.8) { const low = 1 - Math.abs(Math.sin(sunA)); const sg2 = ctx.createRadialGradient(sunX, sunY, 40, sunX, sunY, W * 0.9); sg2.addColorStop(0, rgba([255, 200, 120], 0.22 * low + 0.04)); sg2.addColorStop(1, 'rgba(255,200,120,0)'); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = sg2; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  // boss / hurt edge pulses
  if (arena.active && arena.boss && !arena.boss.dead) { const a = 0.10 + 0.06 * Math.sin(gameTime * 3); const bg = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.95); bg.addColorStop(0, 'rgba(0,0,0,0)'); bg.addColorStop(1, rgba([255, 90, 60], a)); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); }
  if (player.inv > 0.7 && player.inv <= 1.15 && player.dead <= 0) { const a = clamp((player.inv - 0.7) / 0.4, 0, 1) * 0.45; const hg = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 0.9); hg.addColorStop(0, 'rgba(0,0,0,0)'); hg.addColorStop(1, rgba([255, 60, 60], a)); ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H); }
  // vignette
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.5, W / 2, H / 2, H * 1.0); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,10,30,.20)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  // color grade: warm highlights up top, cool shadows below
  { ctx.save(); const cg = ctx.createLinearGradient(0, 0, 0, H); cg.addColorStop(0, 'rgba(255,205,150,.07)'); cg.addColorStop(0.5, 'rgba(255,205,150,0)'); cg.addColorStop(1, 'rgba(120,150,255,0)'); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H); const cm = ctx.createLinearGradient(0, H * 0.5, 0, H); cm.addColorStop(0, 'rgba(255,255,255,0)'); cm.addColorStop(1, 'rgba(232,238,255,.35)'); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = cm; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  // paper grain
  if (!perf.low) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.35; ctx.drawImage(LAYERS.grain, 0, 0); ctx.restore(); }
  drawSepia();
  ctx.save(); ctx.translate(-cx, -cy); drawGregGhost(night); ctx.restore(); // Greg stays gray even in sepia
  if (photo.active) { drawPhotoHUD(); drawOptions(); return; }
  drawHUD(night);
  drawCombatHUD();
  drawCrewHUD();
  drawForkliftHUD();
  drawSuperHUD();
  drawLedgerHUD();
  drawAudioHUD();
  drawAplus();
  drawBossIntro();
  drawPhotoHUD();
  drawOptions();
  drawEnding();
  drawDemoHUD();
}

function drawEmissive(cx, cy, night) {

    ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (const L of LIGHTS) {
      const lx = L.x - cx, ly = L.y - cy; if (lx < -L.r || lx > W + L.r) continue;
      const rr2 = L.r * (L.glow ? 0.6 : 0.4); const gr = ctx.createRadialGradient(lx, ly, 0, lx, ly, rr2);
      gr.addColorStop(0, rgba(L.color, night * (L.glow ? 0.35 : 0.5))); gr.addColorStop(1, rgba(L.color, 0));
      ctx.fillStyle = gr; ctx.fillRect(lx - rr2, ly - rr2, rr2 * 2, rr2 * 2);
      if (L.cone) { // soft light shaft down to the ground
        const gy = groundYAt(L.x) - cy; const cg = ctx.createLinearGradient(0, ly, 0, gy);
        cg.addColorStop(0, rgba(L.color, night * 0.22)); cg.addColorStop(1, rgba(L.color, night * 0.03));
        ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(lx - 10, ly + 6); ctx.lineTo(lx + 10, ly + 6); ctx.lineTo(lx + L.r * 0.55, gy); ctx.lineTo(lx - L.r * 0.55, gy); ctx.closePath(); ctx.fill();
        const pg = ctx.createRadialGradient(lx, gy, 0, lx, gy, L.r * 0.6); pg.addColorStop(0, rgba(L.color, night * 0.25)); pg.addColorStop(1, rgba(L.color, 0));
        ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(lx, gy, L.r * 0.6, 14, 0, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (WORLD.id === 'easton') {
    // sign letters glow
    ctx.fillStyle = rgba([242, 181, 68], night * 0.9); ctx.font = 'bold 30px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText('PHILLIPS', 990 - cx, 264 - cy);
    // lit windows
    ctx.fillStyle = rgba([255, 230, 170], night * 0.35);
    for (let i = 0; i < 9; i++) { const wx = 600 + i * 82; if (wx > 900 && wx < 1100) continue; if (i % 3 === 1) continue; ctx.fillRect(wx + 3 - cx, 269 - cy, 38, 34); if (i % 2) ctx.fillRect(wx + 3 - cx, 331 - cy, 38, 34); }
    }
    if (WORLD.id === 'taunton') { ctx.fillStyle = rgba([255, 240, 200], night * 0.9); ctx.font = 'bold 22px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText('PHILLIPS', 1180 - cx, 292 - cy); const bl = (gameTime * 0.5) % 1; ctx.fillStyle = rgba([255, 255, 220], night * (bl < 0.5 ? 0.9 : 0.2)); ctx.beginPath(); ctx.arc(2980 - cx, 92 - cy, 7, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
}
function renderBloom(cx, cy, night) {
  if (perf.low) return;
  // draw the bright stuff again into a quarter-res buffer, blur it, screen it back
  const mc = ctx; ctx = bctxA; ctx.setTransform(0.25, 0, 0, 0.25, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
  try {
    if (night > 0.05) drawEmissive(cx, cy, night);
    ctx.save(); ctx.translate(-cx, -cy); ctx.globalCompositeOperation = 'lighter';
    for (const p of projs) { ctx.fillStyle = rgb(p.c); ctx.beginPath(); ctx.arc(p.x, p.y, p.k === 'lob' ? 9 : 5, 0, Math.PI * 2); ctx.fill(); }
    for (const b of beams) { if (b.x1 === undefined) continue; ctx.strokeStyle = rgba(b.c, 0.9); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke(); }
    for (const s of summons) { const a = 1 - s.t / s.life; if (s.k === 'boom') { ctx.fillStyle = rgba(s.c, a); ctx.beginPath(); ctx.arc(s.x, s.y, s.R * (1 - a * a), 0, Math.PI * 2); ctx.fill(); } if (s.k === 'slam' || s.k === 'rally') { ctx.strokeStyle = rgba(s.c, a * 0.8); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(s.x, s.y - (s.k === 'rally' ? 4 : 0), lerp(0, s.R, 1 - a * a), s.k === 'rally' ? s.R * 0.22 : 10, 0, 0, Math.PI * 2); ctx.stroke(); } }
    for (const p of parts) if (p.k === 'spark' || p.k === 'flash' || p.k === 'glitch') { ctx.fillStyle = rgba(p.c, 1 - p.t / p.life); ctx.fillRect(p.x - 3, p.y - 3, 6, 6); }
    for (const e of enemies) if (!e.dead && !e.d.cocoon) { ctx.fillStyle = rgba(e.d.color, e.hit > 0 ? 0.9 : 0.18 * (e.alpha === undefined ? 1 : e.alpha)); ctx.beginPath(); ctx.ellipse(e.x, e.y - e.h / 2, e.w / 2 + 4, e.h / 2 + 4, 0, 0, Math.PI * 2); ctx.fill(); }
    if (night > 0.3) for (const f of fireflies) { const a = (Math.sin(gameTime * f.sp + f.ph) + 1) / 2; if (a < 0.2) continue; ctx.fillStyle = rgba([220, 255, 120], a * night); ctx.beginPath(); ctx.arc(f.x + Math.sin(gameTime * 0.6 + f.ph) * 30, f.y + Math.cos(gameTime * 0.4 + f.ph * 2) * 14, 5, 0, Math.PI * 2); ctx.fill(); }
    for (const s of shards) { ctx.fillStyle = s.v > 1 ? '#ffd44a' : '#7fe0ff'; ctx.fillRect(s.x - 4, s.y - 4, 8, 8); }
    ctx.restore();
  } finally { ctx = mc; }
  blurPass(bloomA, bloomB, 1.5); blurPass(bloomB, bloomA, 3);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.55 + night * 0.25; ctx.imageSmoothingEnabled = true; ctx.drawImage(bloomA, 0, 0, W, H); ctx.restore();
}
function drawTiled(img, par, y, tint, alpha, drift, tint2, rim) {
  const w = img.width; let x = (-camera.x * par - (drift || 0)) % w; if (x > 0) x -= w;
  ctx.save(); ctx.globalAlpha = alpha;
  if (tint) {
    if (!drawTiled.tmp) drawTiled.tmp = mkCanvas(1800, 340);
    const t = drawTiled.tmp, tg = t.getContext('2d');
    tg.clearRect(0, 0, t.width, t.height); tg.globalCompositeOperation = 'source-over'; tg.drawImage(img, 0, 0);
    tg.globalCompositeOperation = 'source-in';
    if (tint2) { const gr = tg.createLinearGradient(0, 0, 0, img.height); gr.addColorStop(0, rgb(tint)); gr.addColorStop(1, rgb(tint2)); tg.fillStyle = gr; } else tg.fillStyle = rgb(tint);
    tg.fillRect(0, 0, t.width, t.height);
    if (rim) { // lit top edge: draw a lighter copy nudged up, then the body on top
      if (!drawTiled.tmp2) drawTiled.tmp2 = mkCanvas(1800, 340);
      const t2 = drawTiled.tmp2, g2 = t2.getContext('2d'); g2.clearRect(0, 0, t2.width, t2.height); g2.globalCompositeOperation = 'source-over'; g2.drawImage(img, 0, 0); g2.globalCompositeOperation = 'source-in'; g2.fillStyle = rgb(rim); g2.fillRect(0, 0, t2.width, t2.height);
      for (let k = 0; k < 3; k++) ctx.drawImage(t2, 0, 0, w, img.height, x + k * w, y - 2, w, img.height);
    }
    for (let k = 0; k < 3; k++) ctx.drawImage(t, 0, 0, w, img.height, x + k * w, y, w, img.height);
  } else for (let k = 0; k < 3; k++) ctx.drawImage(img, x + k * w, y);
  ctx.restore();
}

function drawHUD(night) {
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  // name plate
  // time + weather chip
  const hh = Math.floor(hour), mm = Math.floor((hour % 1) * 60); const ap = hh >= 12 ? 'PM' : 'AM'; const h12 = ((hh + 11) % 12) + 1;
  const label = h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap + '   ' + WEATHER[weather];
  ctx.font = '12px system-ui, sans-serif'; const tw = ctx.measureText(label).width;
  ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, 14, 14, tw + 24, 26, 8); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.fillText(label, 26, 31);
  // location
  ctx.font = 'italic 12px Georgia, serif'; ctx.fillStyle = 'rgba(246,236,216,.7)'; ctx.fillText(WORLD.location, 14 + tw + 50, 31);
  // touch controls
  if (touch.used) {
    ctx.save(); ctx.globalAlpha = typeof touchAlpha !== 'undefined' ? touchAlpha.v : 0.55;
    for (const b of BTN) { if (b.when && !b.when()) continue; if (typeof drawTouchButton === 'function') { drawTouchButton(b); continue; } ctx.fillStyle = touch.btn[b.id] ? 'rgba(242,181,68,.7)' : 'rgba(16,26,46,.5)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(246,236,216,.6)'; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = '#f6ecd8'; ctx.font = 'bold ' + (b.r > 24 ? 12 : 11) + 'px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(b.label, b.x, b.y + 4); }
    if (touch.stick !== null) { ctx.strokeStyle = 'rgba(246,236,216,.5)'; ctx.beginPath(); ctx.arc(touch.sx, touch.sy, 44, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = 'rgba(242,181,68,.6)'; ctx.beginPath(); ctx.arc(touch.sx + touch.dx * 34, touch.sy, 18, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  if (DEV) { ctx.font = '11px monospace'; ctx.fillStyle = '#0f0'; ctx.textAlign = 'left'; ctx.fillText('fps ' + fps.toFixed(0) + '  parts ' + parts.length + '  x ' + player.x.toFixed(0) + ' y ' + player.y.toFixed(0), 14, H - 60); }
}

/* ---------------- main loop ---------------- */
let last = 0, acc = 0, fps = 60; const STEP = 1 / 60;
function frame(ts) {
  requestAnimationFrame(frame);
  if (!running) return;
  if (!last) last = ts;
  let dt = (ts - last) / 1000; last = ts;
  if (dt > 0.1) dt = 0.1;
  fps = fps * 0.95 + (1 / Math.max(dt, 1e-3)) * 0.05; perfTick(dt);
  acc += dt;
  while (acc >= STEP) { update(STEP); acc -= STEP; }
  render();
}

/* ---------------- title wiring ---------------- */
function startGame(idx, skipPrologue) {
  hero = ROSTER[idx]; player.hero = hero; ledger.found.clear(); story.prologueDone = false; demo.active = false;
  crew.length = 0; story.vig = new Set(); story.aplusBeat = false; for (const k in SKILL) delete SKILL[k]; restored.taunton = false; restored.spartanburg = false; for (const k of Object.keys(restored)) restored[k] = false; story.cutoverKey = false; story.ending = 0; ending.active = false; catnip.n = 0; catnip.active = 0; story.weaponsOnline = false; story.turnDone = false; story.visited = {}; story.met.clear(); bucks.n = 0;
  loadWorld(skipPrologue ? 'easton' : 'prologue');
  document.getElementById('title').classList.add('hidden');
  running = true; last = 0;
  flash = 3;
}
function buildTitle() {
  const grid = document.getElementById('grid');
  ROSTER.forEach((ch, i) => {
    const card = document.createElement('button'); card.className = 'card'; card.setAttribute('aria-label', ch.name + ', ' + ch.role);
    const pc = document.createElement('canvas'); pc.width = 96 * 2; pc.height = 96 * 2; const pg = pc.getContext('2d'); pg.scale(2, 2); drawPortrait(pg, ch, 96);
    card.appendChild(pc);
    const n = document.createElement('div'); n.className = 'n'; n.textContent = ch.name; card.appendChild(n);
    const r = document.createElement('div'); r.className = 'r'; r.textContent = ch.role; card.appendChild(r);
    card.addEventListener('click', () => startGame(i));
    grid.appendChild(card);
  });
  const db = document.getElementById('demoBtn'); if (db) db.addEventListener('click', () => startDemo());
  const kc = document.getElementById('kid'); if (kc) { const kg = kc.getContext('2d'); const KID = { name: 'Kid', skin: '#f1c9a5', hair: '#a8632c', style: 'cap', shirt: '#c25a3a', pants: '#2f6f9f', acc: 'none' }; kg.translate(70, 112); kg.scale(1.15, 1.15); drawHero(kg, KID, 0, 0, 1, { t: 0, run: 0, moving: false }, { i: 1, color: [242, 181, 68], side: 1 }); }
}
