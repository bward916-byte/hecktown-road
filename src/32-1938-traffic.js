/* =====================================================================
   1938 ON THE MOVE (M30) — an old farm truck, a horse-drawn wagon, and a Model A passing through
   ===================================================================== */
function drawOldTruck(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(0, 1, 70, 6, 0, 0, Math.PI * 2); g.fill();
  // wooden bed with sacks
  g.fillStyle = '#6a4a2a'; g.fillRect(-70, -40, 84, 24); g.fillStyle = '#4a3020'; for (let k = 0; k < 6; k++) g.fillRect(-68 + k * 14, -40, 2, 24); for (const sx of [-58, -40, -22]) drawFeedSack(g, sx, -40);
  // cab: rounded, upright, split windshield
  g.fillStyle = '#1f3a2a'; rr(g, 12, -66, 46, 50, 8); g.fill(); g.fillStyle = '#243447'; rr(g, 18, -60, 16, 16, 2); g.fill(); rr(g, 38, -60, 16, 16, 2); g.fill(); g.fillStyle = 'rgba(200,220,255,.3)'; g.fillRect(20, -58, 5, 12);
  // hood + radiator
  g.fillStyle = '#1f3a2a'; rr(g, 56, -44, 36, 28, 6); g.fill(); g.fillStyle = '#8a8f98'; rr(g, 88, -46, 8, 30, 2); g.fill(); g.fillStyle = '#c8c8d0'; g.fillRect(90, -30, 2, 10);
  // fenders + running board
  g.fillStyle = '#141a14'; g.beginPath(); g.arc(78, -12, 18, Math.PI, 0); g.fill(); g.beginPath(); g.arc(-44, -14, 20, Math.PI, 0); g.fill(); g.fillRect(-10, -18, 60, 5);
  // spoke wheels
  for (const [wx, r] of [[-44, 16], [78, 14]]) { g.fillStyle = '#1b1d22'; g.beginPath(); g.arc(wx, -2, r, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#c9c5bb'; g.lineWidth = 1.5; for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI; g.beginPath(); g.moveTo(wx + Math.cos(a) * (r - 3), -2 + Math.sin(a) * (r - 3)); g.lineTo(wx - Math.cos(a) * (r - 3), -2 - Math.sin(a) * (r - 3)); g.stroke(); } g.fillStyle = '#8a8f98'; g.beginPath(); g.arc(wx, -2, 3, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#e8dcc0'; g.fillRect(-60, -28, 30, 8); g.fillStyle = '#3a2a1a'; g.font = 'bold 5px Georgia'; g.textAlign = 'center'; g.fillText('PHILLIPS FEED', -45, -22); g.textAlign = 'left'; g.restore(); }
function drawModelA(g, x, y, s, dir) { g.save(); g.translate(x, y); g.scale(dir * s, s); g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(0, 1, 48, 5, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1b1d22'; rr(g, -44, -40, 62, 26, 6); g.fill(); rr(g, -34, -62, 40, 26, 7); g.fill(); g.fillStyle = '#243447'; rr(g, -28, -58, 12, 14, 2); g.fill(); rr(g, -12, -58, 14, 14, 2); g.fill(); g.fillStyle = '#2a2a2a'; rr(g, 16, -36, 26, 22, 5); g.fill(); g.fillStyle = '#8a8f98'; g.fillRect(40, -38, 5, 24); g.fillStyle = '#141a14'; g.beginPath(); g.arc(28, -12, 14, Math.PI, 0); g.fill(); g.beginPath(); g.arc(-30, -12, 14, Math.PI, 0); g.fill();
  for (const wx of [-30, 28]) { g.fillStyle = '#1b1d22'; g.beginPath(); g.arc(wx, -2, 12, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#c9c5bb'; g.lineWidth = 1.2; for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI; g.beginPath(); g.moveTo(wx + Math.cos(a) * 9, -2 + Math.sin(a) * 9); g.lineTo(wx - Math.cos(a) * 9, -2 - Math.sin(a) * 9); g.stroke(); } }
  g.fillStyle = '#e9d27a'; g.beginPath(); g.arc(44, -28, 3, 0, Math.PI * 2); g.fill(); g.restore(); }
const OLD_DRIVER = { name: 'Driver', role: '1938', skin: '#e8b48e', hair: '#5a4a3a', style: 'cap', shirt: '#6a4a2a', pants: '#3a2a1a', acc: 'none' };
const old = { car: { on: false, x: 0, dir: -1, t: 0, next: 12 }, wagon: { on: false, x: 0, dir: 1, t: 0, next: 26 } };
function updateOldTraffic(dt) {
  if (WORLD.id !== 'prologue' && WORLD.id !== 'past') { old.car.on = old.wagon.on = false; return; }
  for (const k of ['car', 'wagon']) { const o = old[k]; if (!o.on) { o.next -= dt; if (o.next <= 0) { o.on = true; o.dir = Math.random() < 0.5 ? 1 : -1; o.x = o.dir > 0 ? -160 : WORLD.width + 160; o.t = 0; } continue; } o.t += dt; o.x += o.dir * (k === 'car' ? 150 : 48) * dt; if (o.x < -260 || o.x > WORLD.width + 260) { o.on = false; o.next = k === 'car' ? rnd(18, 32) : rnd(30, 50); } }
  if (old.car.on && Math.abs(old.car.x - player.x) < 700 && Math.floor(old.car.t * 6) % 3 === 0 && audio.started && audio.on && (fireGate.chug || 0) < gameTime - 0.28) { fireGate.chug = gameTime; layered([{ type: 'square', f: 70, dur: 0.08, gain: 0.05 }, { noise: 1, f: 400, dur: 0.05, gain: 0.03 }]); }
}
function drawOldTraffic() {
  if (WORLD.id !== 'prologue' && WORLD.id !== 'past') return; const gy = WORLD.groundY;
  const w = old.wagon; if (w.on && Math.abs(w.x - camera.x - W / 2) < W + 200) { ctx.save(); if (w.dir < 0) { ctx.translate(w.x * 2, 0); ctx.scale(-1, 1); } drawWagon(ctx, w.x - 110, gy); ctx.restore(); drawHorse(ctx, w.x + (w.dir > 0 ? 10 : -10), gy, w.t); ctx.strokeStyle = '#5a3a24'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w.x - w.dir * 50, gy - 46); ctx.lineTo(w.x, gy - 40); ctx.stroke(); drawHero(ctx, OLD_DRIVER, w.x - w.dir * 120, gy - 46, w.dir, { t: w.t, run: 0, moving: false }, null); }
  const c = old.car; if (c.on && Math.abs(c.x - camera.x - W / 2) < W + 200) { drawModelA(ctx, c.x, gy, 1, c.dir); if (Math.random() < 0.5) spawn({ k: 'puff', x: c.x - c.dir * 46, y: gy - 6, vx: -c.dir * 30, vy: -20, life: 0.6, t: 0, r: 4 }); }
}
// the farm truck is parked by the barn, always
const _drawProloguePlay2 = drawProloguePlay; drawProloguePlay = function (g) { _drawProloguePlay2(g); drawOldTruck(g, 1860, WORLD.groundY, 1); };
WORLD_DEFS.prologue.play = drawProloguePlay; WORLD_DEFS.past.play = drawProloguePlay; // the defs captured the original function; re-point them at the wrapped one (hay bales, wagon, sign, truck)
const _updateAplus12 = updateAplus; updateAplus = function (dt) { _updateAplus12(dt); updateOldTraffic(dt); };
const _drawStoryLayer10 = drawStoryLayer; drawStoryLayer = function (night) { _drawStoryLayer10(night); drawOldTraffic(); };
const _loadWorld19 = loadWorld; loadWorld = function (id, at) { _loadWorld19(id, at); old.car.on = old.wagon.on = false; old.car.next = 6; old.wagon.next = 14; };
