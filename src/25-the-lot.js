
/* =====================================================================
   THE LOT (M23) — bigger grounds: employee parking, a guard shack, picnic tables, a koi pond
   ===================================================================== */
const LOT_W = 2000;
const CAR_COLS = ['#c0392b', '#3c5fa6', '#e0a030', '#e6e6e6', '#2f7f4f', '#6b5b8f', '#1b1d22', '#8a4a3a', '#5a9fd0', '#f2b544'];
function drawVehicle(g, x, y, kind, col, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(0, 1, 44, 5, 0, 0, Math.PI * 2); g.fill();
  const win = (wx, wy, ww, wh) => { g.fillStyle = '#243447'; rr(g, wx, wy, ww, wh, 3); g.fill(); g.fillStyle = 'rgba(200,220,255,.35)'; g.fillRect(wx + 2, wy + 2, ww * 0.4, wh - 4); };
  const wheel = (wx) => { g.fillStyle = '#1b1d22'; g.beginPath(); g.arc(wx, -8, 9, 0, Math.PI * 2); g.fill(); g.fillStyle = '#8a8f98'; g.beginPath(); g.arc(wx, -8, 4, 0, Math.PI * 2); g.fill(); };
  if (kind === 'sedan') { g.fillStyle = col; rr(g, -40, -28, 80, 20, 6); g.fill(); rr(g, -24, -44, 46, 20, 8); g.fill(); win(-20, -42, 18, 14); win(2, -42, 18, 14); wheel(-24); wheel(24); }
  else if (kind === 'suv') { g.fillStyle = col; rr(g, -42, -30, 84, 22, 6); g.fill(); rr(g, -34, -52, 66, 24, 7); g.fill(); win(-30, -50, 20, 18); win(-6, -50, 16, 18); win(12, -50, 16, 18); wheel(-26); wheel(26); }
  else if (kind === 'pickup') { g.fillStyle = col; rr(g, -44, -28, 88, 20, 5); g.fill(); rr(g, -40, -50, 40, 24, 6); g.fill(); win(-36, -48, 14, 18); win(-18, -48, 14, 18); g.fillStyle = shade(col, 0.8); g.fillRect(-2, -30, 44, 4); wheel(-26); wheel(28); }
  else if (kind === 'van') { g.fillStyle = col; rr(g, -44, -54, 88, 46, 8); g.fill(); win(-38, -50, 18, 16); win(-14, -50, 20, 16); win(10, -50, 20, 16); wheel(-26); wheel(28); }
  else if (kind === 'rv') { g.fillStyle = '#f2f2ee'; rr(g, -60, -62, 120, 54, 8); g.fill(); g.fillStyle = '#243447'; rr(g, -56, -58, 22, 18, 3); g.fill(); rr(g, -28, -56, 24, 16, 3); g.fill(); rr(g, 2, -56, 24, 16, 3); g.fill(); rr(g, 32, -56, 24, 16, 3); g.fill(); g.fillStyle = '#8a8f98'; g.fillRect(-60, -34, 120, 4); g.fillStyle = '#5a6a7a'; g.fillRect(-20, -66, 40, 4); wheel(-36); wheel(34); g.fillStyle = '#1b1d22'; g.font = 'bold 6px system-ui'; g.textAlign = 'center'; g.fillText('PLATEAU', 30, -38); }
  else if (kind === 'tractor') { g.fillStyle = '#f26a1b'; rr(g, -24, -40, 48, 22, 4); g.fill(); rr(g, -12, -58, 22, 20, 3); g.fill(); g.fillStyle = '#243447'; rr(g, -8, -56, 14, 12, 2); g.fill(); g.fillStyle = '#1b1d22'; g.beginPath(); g.arc(18, -14, 14, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(-18, -8, 8, 0, Math.PI * 2); g.fill(); g.fillStyle = '#8a8f98'; g.beginPath(); g.arc(18, -14, 6, 0, Math.PI * 2); g.fill(); g.fillStyle = '#f26a1b'; g.fillRect(-40, -34, 18, 6); g.fillStyle = '#1b1d22'; g.font = 'bold 5px system-ui'; g.textAlign = 'center'; g.fillText('L2502', 0, -28); }
  else if (kind === 'utv') { g.fillStyle = col; rr(g, -34, -28, 68, 18, 5); g.fill(); g.strokeStyle = '#1b1d22'; g.lineWidth = 3; g.beginPath(); g.moveTo(-26, -28); g.lineTo(-22, -52); g.lineTo(18, -52); g.lineTo(22, -28); g.stroke(); g.fillStyle = '#243447'; rr(g, -30, -50, 14, 12, 2); g.fill(); g.fillStyle = shade(col, 0.8); g.fillRect(-2, -30, 32, 4); wheel(-22); wheel(22); }
  g.restore();
}
function drawLot(g, x0, id) {
  const gy = WORLD.groundY, x1 = x0 + LOT_W;
  // asphalt with a fade from the yard, a back fence, and a row of light poles
  const ag = g.createLinearGradient(x0, 0, x0 + 200, 0); ag.addColorStop(0, 'rgba(58,60,68,0)'); ag.addColorStop(1, '#3a3c44'); g.fillStyle = ag; g.fillRect(x0, gy, 200, H - gy); g.fillStyle = '#3a3c44'; g.fillRect(x0 + 200, gy, LOT_W - 200, H - gy);
  g.fillStyle = 'rgba(255,255,255,.4)'; for (let x = x0 + 140; x < x1 - 300; x += 110) g.fillRect(x, gy + 20, 2, 60); g.fillRect(x0 + 120, gy + 84, x1 - 400 - x0, 3);
  g.fillStyle = '#5a6068'; for (let x = x0 + 100; x < x1; x += 28) g.fillRect(x, gy - 46, 2, 46); g.fillRect(x0 + 100, gy - 46, x1 - x0 - 100, 3); g.fillRect(x0 + 100, gy - 20, x1 - x0 - 100, 2); // chain-link
  for (let x = x0 + 300; x < x1 - 200; x += 420) { g.fillStyle = '#2c3038'; g.fillRect(x - 3, gy - 150, 6, 150); g.fillRect(x - 18, gy - 154, 36, 6); g.fillStyle = '#e9d27a'; g.fillRect(x - 14, gy - 160, 28, 6); }
  // guard shack + barrier arm + sign
  g.fillStyle = '#e8e8ec'; rr(g, x0 + 30, gy - 70, 60, 70, 4); g.fill(); g.fillStyle = '#243447'; rr(g, x0 + 40, gy - 60, 40, 24, 3); g.fill(); g.fillStyle = '#c0392b'; g.fillRect(x0 + 24, gy - 78, 72, 8); g.fillStyle = '#2c3038'; g.fillRect(x0 + 100, gy - 40, 6, 40); g.fillStyle = '#fff'; g.fillRect(x0 + 106, gy - 40, 90, 6); g.fillStyle = '#c0392b'; for (let k = 0; k < 4; k++) g.fillRect(x0 + 114 + k * 22, gy - 40, 11, 6);
  g.fillStyle = '#243447'; rr(g, x0 + 130, gy - 120, 150, 30, 5); g.fill(); g.fillStyle = '#f6ecd8'; g.font = 'bold 11px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('EMPLOYEE PARKING', x0 + 205, gy - 100); g.fillStyle = '#2c3038'; g.fillRect(x0 + 203, gy - 90, 4, 90);
  // vehicles: a back row (smaller, behind), then the front row
  const seed = hashName(id); const kinds = ['sedan', 'suv', 'pickup', 'van', 'sedan', 'pickup', 'suv', 'sedan'];
  for (let i = 0; i < 12; i++) { const x = x0 + 260 + i * 118 + ((seed + i) % 3) * 6; if (x > x1 - 380) break; drawVehicle(g, x, gy - 36, kinds[(seed + i) % kinds.length], CAR_COLS[(seed * 7 + i) % CAR_COLS.length], 0.72); }
  for (let i = 0; i < 12; i++) { const x = x0 + 240 + i * 126; if (x > x1 - 360) break; const k = (seed * 3 + i) % 9; const kind = k === 4 ? 'utv' : k === 7 ? 'tractor' : kinds[(seed + i * 5) % kinds.length]; drawVehicle(g, x, gy, kind, CAR_COLS[(seed + i * 3) % CAR_COLS.length], 1); }
  if (id === 'easton') drawVehicle(g, x1 - 300, gy, 'rv', '#fff', 1.05);
  // picnic area at the end, and in Easton the koi pond the sign has been pointing at
  const px = x1 - 180; g.fillStyle = '#6f8f4a'; g.fillRect(x1 - 240, gy, 240, H - gy); for (let k = 0; k < 2; k++) { const tx = px - 60 + k * 90; g.fillStyle = '#7a5a3a'; g.fillRect(tx - 30, gy - 30, 60, 5); g.fillRect(tx - 36, gy - 16, 72, 4); g.fillRect(tx - 8, gy - 30, 4, 30); g.fillRect(tx + 4, gy - 30, 4, 30); }
  g.fillStyle = '#c8c8d0'; rr(g, x1 - 110, gy - 40, 20, 40, 3); g.fill(); g.fillStyle = '#7a5a3a'; g.fillRect(x1 - 108, gy - 42, 16, 3); // grill
  if (id === 'easton') { g.fillStyle = '#5a7a3a'; g.beginPath(); g.ellipse(x1 - 60, gy + 40, 130, 26, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#31506a'; g.beginPath(); g.ellipse(x1 - 60, gy + 40, 118, 20, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#243447'; rr(g, x1 - 220, gy - 60, 70, 18, 4); g.fill(); g.fillStyle = '#f6ecd8'; g.font = 'bold 8px system-ui'; g.fillText('KOI POND', x1 - 185, gy - 47); g.fillStyle = '#2c3038'; g.fillRect(x1 - 187, gy - 42, 3, 42); }
  g.textAlign = 'left';
}
WORLD_DEFS.easton.water = (WORLD_DEFS.easton.water || []).concat([{ x0: 4200 + LOT_W - 178, x1: 4200 + LOT_W + 58, y: 462 }]);
const koi = []; for (let i = 0; i < 6; i++) koi.push({ a: rnd(0, 6), r: rnd(20, 90), sp: rnd(0.3, 0.7), col: ['#f26a1b', '#f6ecd8', '#f2b544', '#c0392b'][i % 4] });
function drawKoi() { if (WORLD.id !== 'easton') return; const cx0 = WORLD.def.lotX + LOT_W - 60, cy0 = WORLD.groundY + 40; for (const k of koi) { k.a += k.sp / 60; const x = cx0 + Math.cos(k.a) * k.r, y = cy0 + Math.sin(k.a) * k.r * 0.16; if (Math.abs(x - camera.x - W / 2) > W) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k.a + Math.PI / 2); ctx.fillStyle = k.col; ctx.beginPath(); ctx.ellipse(0, 0, 3, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-3, 6); ctx.lineTo(0, 11); ctx.lineTo(3, 6); ctx.closePath(); ctx.fill(); ctx.restore(); } }
// a car cruising the lot lane
const lotCar = { x: 0, dir: 1, col: '#5a9fd0', kind: 'sedan', t: 0 };
function updateLotCar(dt) { const lx = WORLD.def && WORLD.def.lotX; if (!lx) return; if (!lotCar.on) { lotCar.on = true; lotCar.x = lx + 300; } lotCar.x += lotCar.dir * 45 * dt; if (lotCar.x > lx + LOT_W - 420) lotCar.dir = -1; if (lotCar.x < lx + 240) lotCar.dir = 1; }
function drawLotCar() { const lx = WORLD.def && WORLD.def.lotX; if (!lx || !lotCar.on) return; if (Math.abs(lotCar.x - camera.x - W / 2) > W) return; ctx.save(); if (lotCar.dir < 0) { ctx.translate(lotCar.x * 2, 0); ctx.scale(-1, 1); } drawVehicle(ctx, lotCar.x, WORLD.groundY + 62, lotCar.kind, lotCar.col, 0.9); ctx.restore(); }

/* ---------- apply to every yard world ---------- */
for (const id of ['easton', 'taunton', 'spartanburg', 'plantcity', 'lansing', 'billings', 'portland', 'sacramento', 'aurora']) {
  const def = WORLD_DEFS[id]; if (!def || def.lotX) continue; const lotX = def.width; def.lotX = lotX; def.width = lotX + LOT_W;
  const solids = def.solids; def.solids = () => solids().concat([[lotX, 440, LOT_W, 200, 0]]);
  const lights = def.lights; def.lights = () => lights().concat([1, 2, 3].map(k => ({ x: lotX + 300 + (k - 1) * 420, y: 440 - 150, r: 240, color: [255, 235, 190], night: 1, cone: 1 })));
  const play = def.play; def.play = (g) => { play(g); drawLot(g, lotX, id); };
  def.breakpoints = (def.breakpoints || (id === 'easton' ? [1140, 2620, 3560] : [1060, 2560, 3480])).concat([lotX + 1000]);
}
// ledger spots and the far-right ledger page positions stay; Chuck keeps his hill. Easton's bucks/koi/pond reflections wire in below.
const _updateAplus9 = updateAplus; updateAplus = function (dt) { _updateAplus9(dt); updateLotCar(dt); };
const _drawStoryLayer7 = drawStoryLayer; drawStoryLayer = function (night) { _drawStoryLayer7(night); drawKoi(); drawLotCar(); };
const _loadWorld17 = loadWorld; loadWorld = function (id, at) { _loadWorld17(id, at); lotCar.on = false; if (WORLD.def && WORLD.def.lotX && (!demo.active || demo.tour)) { const lx = WORLD.def.lotX; if (!npcs.some(n => n.look && n.look.name === 'Gate')) addNPC({ look: { name: 'Frank', role: 'Nights · gate', skin: '#e8b48e', hair: '#8e8e8e', style: 'cap', shirt: '#4a5060', pants: '#2b2f3a', acc: 'keys' }, x: lx + 60, y: 440, facing: 1, lines: ['Frank: "Employee lot. Badge in, badge out. The RV at the end is not mine and I have questions."', 'Frank: "Nobody parks in the far row. Nobody knows why. I know why."'] }); } };
const _minimapNames = null;
