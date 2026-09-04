/* =====================================================================
   POLISH (M9) — 1938 prologue, Ledger, Buying Show, audio, demo
   ===================================================================== */

/* ---------- audio: everything synthesized ---------- */
const audio = { ctx: null, on: true, master: null, pad: null, padGain: null, world: null, started: false };
function audioInit() {
  if (audio.started || typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') return;
  try {
    const AC = typeof AudioContext !== 'undefined' ? AudioContext : webkitAudioContext; audio.ctx = new AC(); audio.started = true;
    audio.master = audio.ctx.createGain(); audio.master.gain.value = 0.5; audio.master.connect(audio.ctx.destination);
    audio.padGain = audio.ctx.createGain(); audio.padGain.gain.value = 0; audio.padGain.connect(audio.master);
    const lp = audio.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600; lp.connect(audio.padGain);
    // soft, slow pad: sine chord tones with a slow shimmer, no sawtooth drone
    audio.pad = []; for (const f of [110, 164.8, 220, 277.2, 329.6]) { const o = audio.ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; const g = audio.ctx.createGain(); g.gain.value = 0.035; const lfo = audio.ctx.createOscillator(); lfo.frequency.value = 0.05 + Math.random() * 0.08; const lg = audio.ctx.createGain(); lg.gain.value = 0.02; lfo.connect(lg); lg.connect(g.gain); lfo.start(); o.connect(g); g.connect(lp); o.start(); audio.pad.push({ o, g, base: f }); }
    lp.frequency.value = 900;
    // wind/rain noise bed
    const buf = audio.ctx.createBuffer(1, audio.ctx.sampleRate * 2, audio.ctx.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
    const src = audio.ctx.createBufferSource(); src.buffer = buf; src.loop = true; const nf = audio.ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 900; nf.Q.value = 0.5; audio.noise = audio.ctx.createGain(); audio.noise.gain.value = 0; src.connect(nf); nf.connect(audio.noise); audio.noise.connect(audio.master); src.start();
    audio.lp = lp;
  } catch (e) { audio.started = false; }
}
function audioTick() {
  if (!audio.started || !audio.ctx) return;
  const t = audio.ctx.currentTime; const want = !audio.on || !running ? 0 : mode === 'drive' ? 0.35 : stage.active ? 0.55 : 0.45;
  audio.padGain.gain.setTargetAtTime(want, t, 1.5);
  const noiseWant = audio.on ? (weather === 2 ? 0.22 : weather === 3 ? 0.05 : weather === 1 ? 0.06 : 0) + (hazard.wind ? 0.2 : 0) + (mode === 'drive' ? 0.14 : 0) : 0;
  audio.noise.gain.setTargetAtTime(noiseWant, t, 0.8);
  audio.lp.frequency.setTargetAtTime(stage.active ? 1600 : 900, t, 1.2);
  // slow chord drift so it never sits on one hum
  const bar = Math.floor(gameTime / 12) % 4; const chord = [[0, 0, 0, 0, 0], [0, 0, 0, 2, 0], [-2, 0, -2, 0, 3], [0, 3, 0, 2, 0]][bar];
  audio.pad.forEach((p, i) => p.o.frequency.setTargetAtTime(p.base * Math.pow(2, chord[i] / 12), t, 2.5));
  // world flavor: detune the pad by region
  const det = ({ taunton: -2, spartanburg: 3, plantcity: 5, lansing: -5, billings: 7, portland: -3, sacramento: 4, aurora: 0, merge: -7, prologue: -12, show: 5 })[WORLD.id] || 0;
  for (const p of audio.pad) p.o.detune.setTargetAtTime(det * 100, t, 2);
}
function sfx(name) {
  if (!audio.started || !audio.on || !audio.ctx) return;
  const c = audio.ctx, t = c.currentTime; const o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(audio.master);
  const env = (a, dur, peak) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak || 0.2, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.start(t); o.stop(t + dur + 0.05); };
  switch (name) {
    case 'jump': o.type = 'square'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(520, t + 0.12); env(0.01, 0.16, 0.12); break;
    case 'dash': o.type = 'sawtooth'; o.frequency.setValueAtTime(700, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.18); env(0.01, 0.2, 0.15); break;
    case 'shard': o.type = 'sine'; o.frequency.setValueAtTime(1046, t); o.frequency.setValueAtTime(1568, t + 0.05); env(0.005, 0.12, 0.12); break;
    case 'scan': o.type = 'square'; o.frequency.setValueAtTime(1760, t); o.frequency.setValueAtTime(2200, t + 0.08); env(0.005, 0.18, 0.1); break;
    case 'hurt': o.type = 'sawtooth'; o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.3); env(0.01, 0.35, 0.25); break;
    case 'kill': o.type = 'triangle'; o.frequency.setValueAtTime(400, t); o.frequency.exponentialRampToValueAtTime(90, t + 0.15); env(0.005, 0.18, 0.15); break;
    case 'honk': o.type = 'sawtooth'; o.frequency.setValueAtTime(196, t); env(0.02, 0.5, 0.3); break;
    case 'boss': o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.8); env(0.05, 1.0, 0.35); break;
    case 'join': o.type = 'triangle'; o.frequency.setValueAtTime(523, t); o.frequency.setValueAtTime(659, t + 0.1); o.frequency.setValueAtTime(784, t + 0.2); env(0.01, 0.5, 0.18); break;
    case 'page': o.type = 'sine'; o.frequency.setValueAtTime(880, t); o.frequency.setValueAtTime(1318, t + 0.12); o.frequency.setValueAtTime(1760, t + 0.24); env(0.01, 0.6, 0.15); break;
    case 'ui': o.type = 'square'; o.frequency.setValueAtTime(880, t); env(0.005, 0.06, 0.06); break;
    default: o.type = 'sine'; o.frequency.setValueAtTime(440, t); env(0.01, 0.1, 0.1);
  }
}
window.addEventListener('keydown', e => { audioInit(); if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume(); if (e.code === 'KeyM') { audio.on = !audio.on; banner(audio.on ? 'Sound on' : 'Sound off', 1); } });
window.addEventListener('touchstart', () => { audioInit(); if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume(); }, { passive: true });
window.addEventListener('pointerdown', () => { audioInit(); if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume(); });

function drawAudioHUD() { const x = W - 46, y = 76, w = 32, h = 22; if (ledger.found.size) return; ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, x, y, w, h, 6); ctx.fill(); ctx.fillStyle = audio.on ? '#f6ecd8' : 'rgba(246,236,216,.4)'; ctx.font = 'bold 12px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(audio.on ? '♪' : '♪̸', x + w / 2, y + 16); ctx.textAlign = 'left'; uiTaps.push({ x: x - 8, y: y - 8, w: w + 16, h: h + 16, fn: () => { audio.on = !audio.on; banner(audio.on ? 'Sound on' : 'Sound off', 1); } }); }
/* ---------- Ledger pages ---------- */
const LEDGER = [
  ['1938', 'A single feed store on a county road. One counter, one scale, one promise.'],
  ['1941', 'The first truck. A flatbed that started on the third try, every morning.'],
  ['1946', 'The founder\'s rule, written on the wall: "If you said you\'d be there, be there."'],
  ['1952', 'First dog food on the shelf, next to the chicken feed. Nobody thought it would sell.'],
  ['1958', 'Second store. The sign was hand-painted by a cousin. Slightly crooked. Kept anyway.'],
  ['1964', 'A customer\'s barn burned. The feed was delivered the next morning, no invoice.'],
  ['1971', 'First warehouse. Pallets instead of stacks. Everyone learned to drive a forklift.'],
  ['1979', 'Cat litter, aquariums, birdseed. The feed store became a pet store\'s best friend.'],
  ['1985', 'First computer. Green screen. The batch job that still runs at midnight was written that year.'],
  ['1991', 'A second warehouse, a second state. The trucks started crossing rivers.'],
  ['1997', 'The founder retired to the loading dock, where he "supervised" for another decade.'],
  ['2003', 'Barcode scanners. The pickers said they\'d never use them. Now they name them.'],
  ['2009', 'The recession. Nobody laid off. The trucks ran shorter routes and everybody rode along.'],
  ['2014', 'Ten distribution centers. A map on the wall with pins, and someone kept moving the pins.'],
  ['2019', 'The website. The first order came from a shop three states away at 2 a.m.'],
  ['2021', 'A pandemic and a merger that didn\'t happen. The trucks kept rolling anyway.'],
  ['2026', 'A joint venture, a new CEO, a new site going live at midnight. Same promise.'],
  ['Tonight', 'You showed up. That was the whole idea.'],
];
const ledger = { pages: [], found: new Set(), flash: 0, text: null };
function placeLedger() {
  ledger.pages.length = 0;
  const idx = ({ prologue: 0, easton: 1, taunton: 3, spartanburg: 5, plantcity: 7, lansing: 9, billings: 11, portland: 13, sacramento: 15, aurora: 16, merge: 17 })[WORLD.id];
  if (idx === undefined) return;
  const spots = WORLD.id === 'easton' ? [[3830, 350], [2650, 288]] : WORLD.id === 'prologue' ? [[1700, null]] : WORLD.id === 'taunton' ? [[3520, 382], [2300, 434]] : [[3760, 350], [2200, 392]];
  spots.forEach(([x, y], k) => { const n = idx + k; if (n >= LEDGER.length || ledger.found.has(n)) return; ledger.pages.push({ x, y: y === null ? groundYAt(x) : y, n, t: rnd(0, 6) }); });
}
function updateLedger(dt) {
  if (ledger.flash > 0) ledger.flash -= dt;
  for (let i = ledger.pages.length - 1; i >= 0; i--) { const p = ledger.pages[i]; p.t += dt; if (Math.abs(p.x - player.x) < 28 && Math.abs(p.y - player.y) < 50) { ledger.found.add(p.n); ledger.pages.splice(i, 1); ledger.flash = 6; ledger.text = LEDGER[p.n]; sfx('page'); for (let k = 0; k < 14; k++) spawn({ k: 'spark', x: p.x, y: p.y - 20, vx: rnd(-120, 120), vy: rnd(-200, 0), life: 0.6, t: 0, c: [242, 181, 68] }); } }
}
function drawLedgerPages() { for (const p of ledger.pages) { const fy = Math.sin(p.t * 2) * 4; ctx.save(); ctx.translate(p.x, p.y - 22 + fy); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba([242, 181, 68], 0.18 + 0.1 * Math.sin(p.t * 4)); ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ctx.save(); ctx.translate(p.x, p.y - 22 + fy); ctx.rotate(Math.sin(p.t) * 0.1); ctx.fillStyle = '#7a3b2a'; rr(ctx, -9, -11, 18, 22, 2); ctx.fill(); ctx.fillStyle = '#f6ecd8'; ctx.fillRect(-7, -9, 14, 18); ctx.fillStyle = '#7a3b2a'; for (let k = 0; k < 4; k++) ctx.fillRect(-5, -6 + k * 4, 10, 1); ctx.restore(); } }
function drawLedgerHUD() {
  if (ledger.found.size) { ctx.font = 'bold 11px system-ui, sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(16,26,46,.55)'; rr(ctx, W - 96, 76, 82, 22, 6); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.fillText('LEDGER ' + ledger.found.size + '/' + LEDGER.length, W - 22, 91); ctx.textAlign = 'left'; }
  if (ledger.flash > 0 && ledger.text) {
    const a = clamp(ledger.flash > 5 ? (6 - ledger.flash) : ledger.flash < 1 ? ledger.flash : 1, 0, 1);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(58,40,20,.82)'; rr(ctx, W / 2 - 300, 198, 600, 84, 10); ctx.fill(); ctx.strokeStyle = 'rgba(242,181,68,.5)'; ctx.lineWidth = 1; rr(ctx, W / 2 - 300, 198, 600, 84, 10); ctx.stroke();
    ctx.textAlign = 'center'; ctx.font = 'bold 22px Georgia, serif'; ctx.fillStyle = '#f2b544'; ctx.fillText('FOUNDER\'S LEDGER  ·  ' + ledger.text[0], W / 2, 230);
    ctx.font = 'italic 14px Georgia, serif'; ctx.fillStyle = '#f6ecd8'; ctx.fillText(ledger.text[1], W / 2, 262); ctx.restore(); ctx.textAlign = 'left';
  }
}

/* ---------- 1938 prologue ---------- */
function drawProloguePlay(g) {
  const gy = WORLD.groundY;
  const gg = g.createLinearGradient(0, gy, 0, H); gg.addColorStop(0, '#9a8a5a'); gg.addColorStop(0.08, '#8a7a4a'); gg.addColorStop(1, '#4a3a2a'); g.fillStyle = gg; g.fillRect(0, gy, WORLD.width, H - gy);
  g.fillStyle = '#7a6a4a'; g.fillRect(900, gy, 300, H - gy); // dirt road
  g.strokeStyle = '#b8a868'; g.lineWidth = 2; for (let x = 0; x < WORLD.width; x += 14) { if (x > 900 && x < 1200) continue; const hh = 5 + (x * 7) % 9; g.beginPath(); g.moveTo(x, gy); g.lineTo(x + 2, gy - hh); g.stroke(); }
  // the feed store
  g.fillStyle = '#b89a6a'; g.fillRect(300, 250, 420, gy - 250); g.fillStyle = '#7a5a3a'; g.beginPath(); g.moveTo(280, 252); g.lineTo(510, 170); g.lineTo(740, 252); g.closePath(); g.fill();
  g.fillStyle = '#e8dcc0'; g.fillRect(310, 262, 400, 40); g.fillStyle = '#3a2a1a'; g.font = 'bold 22px Georgia, serif'; g.textAlign = 'center'; g.fillText('PHILLIPS FEED', 510, 290);
  g.fillStyle = '#5a3a2a'; g.fillRect(480, 340, 60, 100); g.fillStyle = '#243447'; g.fillRect(340, 330, 60, 50); g.fillRect(620, 330, 60, 50);
  g.fillStyle = '#7a5a3a'; g.fillRect(300, 300, 420, 6); for (let x = 300; x < 720; x += 60) g.fillRect(x, 306, 4, 134);
  // porch + sacks
  g.fillStyle = '#8a6a4a'; g.fillRect(280, gy - 16, 460, 16); for (let i = 0; i < 4; i++) { g.fillStyle = '#c9b48a'; rr(g, 320 + i * 30, gy - 40, 24, 24, 6); g.fill(); g.fillStyle = '#7a5a3a'; g.fillRect(324 + i * 30, gy - 30, 16, 3); }
  // barn across the road, fence, the scale
  g.fillStyle = '#8a4a3a'; g.fillRect(1300, 280, 240, gy - 280); g.fillStyle = '#5a3a2a'; g.beginPath(); g.moveTo(1290, 282); g.lineTo(1420, 200); g.lineTo(1550, 282); g.closePath(); g.fill(); g.fillStyle = '#3a2a1a'; g.fillRect(1390, 360, 60, 80);
  g.fillStyle = '#7a5a3a'; for (let x = 1600; x < 2400; x += 40) g.fillRect(x, gy - 30, 4, 30); g.fillRect(1600, gy - 24, 800, 3); g.fillRect(1600, gy - 12, 800, 3);
  g.fillStyle = '#6a6a6a'; g.fillRect(780, gy - 8, 80, 8); g.fillRect(816, gy - 40, 8, 32); g.fillStyle = '#e8dcc0'; g.beginPath(); g.arc(820, gy - 44, 10, 0, Math.PI * 2); g.fill();
  // trees
  drawOak(g, 150, gy, 1.0); drawOak(g, 2200, gy, 1.1); drawOak(g, 2600, gy, 0.9);
}
function drawHorse(c, x, y, t) { c.save(); c.translate(x, y); c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(0, 1, 34, 5, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#5a3a24'; rr(c, -30, -58, 60, 30, 12); c.fill(); for (const lx of [-22, -10, 8, 20]) c.fillRect(lx, -30, 7, 30); c.save(); c.translate(28, -56); c.rotate(-0.5 + Math.sin(t * 1.5) * 0.05); rr(c, -6, -26, 12, 30, 5); c.fill(); rr(c, -4, -36, 16, 14, 5); c.fill(); c.fillStyle = '#2a1a10'; c.fillRect(2, -34, 4, 6); c.restore(); c.fillStyle = '#2a1a10'; for (let k = 0; k < 6; k++) c.fillRect(-28 + k * 8, -62 - (k % 2) * 2, 6, 6); c.save(); c.translate(-30, -50); c.rotate(0.6 + Math.sin(t * 2) * 0.2); c.fillRect(-2, 0, 4, 28); c.restore(); c.restore(); }
WORLD_DEFS.prologue = {
  id: 'prologue', name: '1938', location: 'A feed store on a county road — 1938', width: 2800, groundY: 440, truckX: -9999,
  solids: () => [[0, 440, 2800, 200, 0], [280, 424, 460, 16, 1]], lights: () => [{ x: 510, y: 360, r: 260, color: [255, 210, 140], night: 1, glow: 1 }],
  far: bakeEastonFar, play: drawProloguePlay, coffee: { x: -9999, y: 440 }, checkpoint: { x: 200, y: 440 }, spawn: { x: 200, y: 440 }, weather: 0, hour: 15.5, sepia: true,
  setup: setupPrologue,
};
function setupPrologue() {
  story.prologueDone = false; story.weaponsOnline = false;
  const founder = addNPC({ look: { name: 'The Founder', role: '1938', skin: '#2a2a2a', hair: '#1a1a1a', style: 'cap', shirt: '#2a2a2a', pants: '#1a1a1a', acc: 'none' }, x: 460, y: 424, facing: 1, lines: ['"Sack of oats for the mare, then the Millers\' order across the road. Rain or no rain."'] });
  founder.silhouette = true;
  const horse = { x: 1100, y: 440, t: 0 }; WORLD.horse = horse;
  const miller = addNPC({ look: { name: 'Mrs. Miller', role: 'Customer', skin: '#f1c9a5', hair: '#6a4a3a', style: 'bun', shirt: '#7a5a6a', pants: '#3a2a3a', acc: 'none' }, x: 2300, y: 440, facing: -1, lines: ['Mrs. Miller: "In this weather? Well. I suppose you said you would."'] });
  let fed = false, delivered = false;
  const sack = spawnPackage(360, 424, 'OATS');
  WORLD.horseAccepts = () => { fed = true; };
  miller.acceptsPackage = () => { delivered = true; say(miller, 'Mrs. Miller: "You showed up. That\'s the whole thing, isn\'t it."'); };
  setObjectives([
    { text: '1938  ·  Pick up the sack of oats on the porch', check: () => !!player.carry, moveHint: true, tip: 'Move: {move}   ·   Jump onto the porch: {jump}   ·   Pick up: {use}', target: () => ({ x: sack.x, y: sack.y, label: 'OATS' }) },
    { text: 'Carry the oats to the mare by the road', check: () => fed, tip: 'Carrying makes your jump shorter. Feed her with {use}', target: () => ({ x: horse.x, y: horse.y, label: 'THE MARE' }), onDone: () => { weather = 2; spawnPackage(1000, 440, 'MILLERS'); banner('It starts to rain.', 2.5); } },
    { text: 'Grab the Millers\' order from the road', check: () => !!player.carry, tip: 'Rain slows nothing. Try a dash on the road: {dash}', target: () => { const p = packages.find(q => !q.carried); return p ? { x: p.x, y: p.y, label: 'MILLERS\' ORDER' } : null; } },
    { text: 'Take it to Mrs. Miller across the fence', check: () => delivered, tip: 'Hand it over with {use}', target: () => ({ x: miller.x, y: miller.y, label: 'MRS. MILLER' }), onDone: () => { story.prologueDone = true; banner('"Show up for the people who count on you."', 4.5); } },
    { text: '', check: () => false },
  ]);
}
function updatePrologue(dt) {
  if (WORLD.id !== 'prologue') return;
  const h = WORLD.horse; h.t += dt;
  if (player.carry && player.carry.label === 'OATS' && Math.abs(player.x - h.x) < 50 && edge.use) { packages.splice(packages.indexOf(player.carry), 1); player.carry = null; WORLD.horseAccepts(); sfx('join'); }
  if (story.prologueDone) { story.proT = (story.proT || 0) + dt; if (story.proT > 5) { story.prologueDone = false; story.proT = 0; loadWorld('easton'); restoredBanner.t = 4; restoredBanner.text = 'EASTON, PENNSYLVANIA  ·  88 YEARS LATER  ·  11:52 PM'; } }
  if (edge.dash && edge.jump) { loadWorld('easton'); }
}
function drawPrologueLayer() { if (WORLD.id !== 'prologue') return; drawHorse(ctx, WORLD.horse.x, WORLD.horse.y, WORLD.horse.t); if (player.carry && player.carry.label === 'OATS' && Math.abs(player.x - WORLD.horse.x) < 50) { ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, WORLD.horse.x - 34, WORLD.horse.y - 96, 68, 18, 5); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 10px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('E  ·  FEED', WORLD.horse.x, WORLD.horse.y - 83); ctx.textAlign = 'left'; } }
function drawSepia() {
  if (!WORLD.def || !WORLD.def.sepia) return;
  ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#c9a56a'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(60,40,20,.25)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.25; ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(LAYERS.grain, Math.sin(gameTime * 30) * 3, Math.cos(gameTime * 20) * 3); ctx.restore();
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,0,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(246,236,216,.6)'; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right'; ctx.fillText('jump + dash to skip', W - 14, H - 8); ctx.textAlign = 'left';
}

/* ---------- Buying Show epilogue ---------- */
function drawShowPlay(g) {
  const gy = WORLD.groundY;
  g.fillStyle = '#2a2f3a'; g.fillRect(0, 0, WORLD.width, H); // hall
  g.fillStyle = '#3a4050'; g.fillRect(0, gy, WORLD.width, H - gy); g.fillStyle = '#4a5060'; for (let x = 0; x < WORLD.width; x += 80) g.fillRect(x, gy, 40, H - gy);
  g.fillStyle = '#1e2430'; g.fillRect(0, 0, WORLD.width, 120); for (let x = 60; x < WORLD.width; x += 200) { g.fillStyle = '#5a6070'; g.fillRect(x, 100, 60, 8); }
  g.fillStyle = '#243447'; rr(g, 200, 140, 560, 60, 8); g.fill(); g.fillStyle = '#f2b544'; g.font = 'bold 30px Georgia, serif'; g.textAlign = 'center'; g.fillText('PHILLIPS BUYING SHOW', 480, 182);
  g.fillStyle = '#e6d7bd'; g.font = '12px system-ui'; g.fillText('75+ brands  ·  every DC  ·  and one alley cat', 480, 214);
  const booths = ['KIBBLE CO', 'AQUATIC', 'FEED & FARM', 'VET', 'GROOM', 'SHELTER', 'TREATS', 'CENTRAL PET', 'MILO\'S', 'IT DEPT'];
  booths.forEach((b, i) => { const x = 900 + i * 300; const col = ['#c0392b', '#31506a', '#6a8a4a', '#7a4a8a', '#c8912e', '#3f7f8f', '#8a4a3a', '#3a5a8a', '#3a3a4a', '#243447'][i]; g.fillStyle = col; g.fillRect(x, 300, 200, 140); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x, 300, 200, 10); g.fillStyle = '#f6ecd8'; g.font = 'bold 12px system-ui'; g.fillText(b, x + 100, 326); g.fillStyle = '#e6d7bd'; g.fillRect(x + 20, 380, 160, 60); g.fillStyle = '#f2b544'; g.fillRect(x + 20, 380, 160, 4); for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? '#c9a56a' : '#e9e1cf'; g.fillRect(x + 30 + k * 36, 350, 26, 26); } });
  drawTrailer(g, 3540, 288, gy);
}
WORLD_DEFS.show = {
  id: 'show', name: 'The Buying Show', location: 'Phillips East Coast Buying Show — the floor', width: 4000, groundY: 440, truckX: -9999,
  solids: () => [[0, 440, 4000, 200, 0]], lights: () => Array.from({ length: 12 }, (_, i) => ({ x: 200 + i * 340, y: 130, r: 280, color: [255, 230, 190], night: 1, cone: 1 })),
  far: () => { LAYERS.ridge = mkCanvas(10, 10); LAYERS.hills = mkCanvas(10, 10); LAYERS.trees = mkCanvas(10, 10); }, play: drawShowPlay,
  coffee: { x: 600, y: 440 }, checkpoint: { x: 300, y: 440 }, spawn: { x: 300, y: 440 }, weather: 0, hour: 10, indoor: true,
  setup: () => {
    setObjectives([{ text: 'The Buying Show. Everyone you helped is here. Talk to people.', check: () => false }]);
    let i = 0; for (const ch of ROSTER) { if (ch === hero || crew.some(f => f.hero === ch)) continue; addNPC({ hero: ch, look: ch, x: 3600 + (i % 5) * 50, y: 440, facing: i % 2 ? 1 : -1, lines: [ch.name + ': "' + ['We did that.', 'Site\'s live. Site\'s been live. Relax.', 'Somebody explain the cat.', 'Next year, Monterey.', 'I never want to see a beetle again.'][i % 5] + '"'] }); i++; }
    const guests = [['Rosa', NPC_LOOKS.rosa, 1000, 'Rosa: "Bay 2 is a booth now. Progress."'], ['Sal', NPC_LOOKS.sal, 1300, 'Sal: "Receiving\'s fine. Receiving\'s always fine."'], ['Cap\'n Reyes', { name: 'Cap\'n Reyes', role: 'Aquatics', skin: '#eec2a0', hair: '#3a2c22', style: 'cap', shirt: '#f2b544', pants: '#2b2f3a', acc: 'vest' }, 1600, 'Cap\'n Reyes: "Not a single pipe with a face on it. Miracle."'], ['Dr. Okafor', { name: 'Dr. Okafor', role: 'Vet', skin: '#8a5a3a', hair: '#1a1410', style: 'short', shirt: '#7a4a8a', pants: '#2b2f3a', acc: 'lanyard' }, 1900, 'Dr. Okafor: "Cold chain held. I checked twice."'], ['Nadia', { name: 'Nadia', role: 'Groomer', skin: '#d9a77c', hair: '#1a1410', style: 'ponytail', shirt: '#c8912e', pants: '#2b2f3a', acc: 'none' }, 2200, 'Nadia: "Every tag on the right crate. I could cry."'], ['Grace', { name: 'Grace', role: 'Shelter', skin: '#c48a62', hair: '#3a2c22', style: 'wavy', shirt: '#3f7f8f', pants: '#2b2f3a', acc: 'none' }, 2500, 'Grace: "All six dogs adopted. Biscuit gets the credit."']];
    for (const [n, look, x, line] of guests) addNPC({ look, x, y: 440, facing: -1, lines: [line] });
    const m = addMilo(3400, false); m.lines = null; m.onTalk = (n) => say(n, 'Milo: "Legit booth. Permit and everything. Twenty shards a bag, same as always."', [{ label: 'Buy Meowijuana ($20)', fn: () => { if (bucks.n >= 20) { bucks.n -= 20; catnip.n++; banner('Meowijuana ×' + catnip.n, 2); } } }, { label: 'Proud of you', fn: null }]);
  },
};
const _driveOptsEaston = WORLD_DEFS.easton.driveOptions;
WORLD_DEFS.easton.driveOptions = () => _driveOptsEaston().concat(story.ending ? [{ label: 'The Buying Show', to: 'show' }] : []);
WORLD_DEFS.show.driveTo = 'easton'; WORLD_DEFS.show.driveLabel = 'BACK TO EASTON'; WORLD_DEFS.show.driveHours = 2; WORLD_DEFS.show.driveRequires = () => null; WORLD_DEFS.show.miles = 60; WORLD_DEFS.show.truckX = 3540;

/* ---------- attract-mode demo: a tour of every feature ---------- */
const demo = { active: false, idx: 0, t: 0, caption: '', script: [] };
function demoCrew(names) { crew.length = 0; for (const n of names) { const ch = ROSTER.find(r => r.name === n); if (!ch || ch === hero) continue; const q = npcs.find(z => z.hero === ch); if (q) npcs.splice(npcs.indexOf(q), 1); crew.push({ hero: ch, x: player.x - 30 - crew.length * 24, y: player.y, vx: 0, vy: 0, w: 22, h: 52, facing: 1, onGround: true, wall: 0, run: 0, t: rnd(0, 5), moving: false, wcd: rnd(0, 0.5), state: 'idle', wander: 0 }); story.met.add(n); } for (const m of crewAll()) SKILL[m.hero.name] = 6; }
function demoBoss(type) { const d = WORLD.def.door; if (!d) return; stage.active = true; stage.door = d; stage.step = 2; stage.fails = 0; arena.active = true; arena.x0 = d.x0; arena.x1 = d.x1; arena.door = d; const b = spawnBoss(type, d.x1 - 160, groundYAt(d.x1 - 160)); arena.boss = b; if (b) b.tx = clamp(player.x + 320, d.x0 + 60, d.x1 - 60); player.x = d.x0 + 60; player.y = groundYAt(player.x); for (const f of crew) { f.x = player.x - 30; f.y = player.y; } }
const KID_BLAINE = { name: 'Blaine', role: 'a boy', skin: '#f1c9a5', hair: '#a8632c', style: 'cap', shirt: '#c25a3a', pants: '#2f6f9f', acc: 'none', kid: true };
const DEMO_SCRIPT = [
  { world: 'easton', x: 700, hour: 18.6, weather: 0, cut: 'card', title: 'HECKTOWN ROAD', sub: 'a Phillips Pet adventure', cap: '', dur: 5, setup: () => { story.weaponsOnline = false; gregGhost.timer = 0; } },
  { world: 'easton', x: 700, hour: 18.6, weather: 0, cut: 'card', title: 'A work of fiction', sub: 'Nothing here depicts actual events at Phillips Pet Food & Supplies or in its history. The people are real and beloved. The robots are not. Greg is a matter of some debate.', cap: '', dur: 12, small: true },
  { world: 'prologue', x: 200, hour: 15.5, weather: 0, cut: 'card', title: '1938', sub: 'Germansville, Pennsylvania', cap: '', dur: 4 },
  { world: 'prologue', x: 200, hour: 15.5, weather: 0, cap: 'One feed store. Purina chows, a wagon, a mare, and a promise made on a rainy afternoon.', dur: 12, setup2: () => { gregGhost.timer = 5; }, goals: [{ x: 360, y: 424, act: 'use' }, { x: () => WORLD.horse.x - 30, act: 'use', pause: 1.2 }, { x: 1000, act: 'use' }, { x: 2260, act: 'use' }] },
  { world: 'prologue', x: 200, hour: 16.5, weather: 0, cut: 'card', title: 'SOME YEARS LATER', sub: 'the same yard', cap: '', dur: 4 },
  { world: 'prologue', x: 560, hour: 16.5, weather: 0, cap: 'A boy named Blaine, his grandfather, and the lesson that became a company.', dur: 15, hideHero: true, setup2: () => { gregGhost.timer = 9; }, goals: [{ wait: 1.5 }, { say: 'founder', text: '"Farmers are counting on that feed, Blaine. Rain or no rain, it goes today."', pause: 4.5 }, { say: 'kid', text: 'Blaine: "Even in the rain, Grandpa?"', pause: 3.5 }, { say: 'founder', text: '"Especially in the rain. Show up for the people who count on you. That\'s the whole business."', pause: 5 }], setup: () => { story.weaponsOnline = false; packages.length = 0; WORLD.location = 'Phillips Feed  ·  Germansville, Pennsylvania  ·  some years later'; for (let i = npcs.length - 1; i >= 0; i--) npcs.splice(i, 1); const f = addNPC({ look: { name: 'The Founder', role: 'Grandpa', skin: '#2a2a2a', hair: '#1a1a1a', style: 'cap', shirt: '#2a2a2a', pants: '#1a1a1a', acc: 'none' }, x: 620, y: 440, facing: -1, lines: [] }); const k = addNPC({ look: KID_BLAINE, x: 570, y: 440, facing: 1, lines: [] }); WORLD.demoFounder = f; WORLD.demoKid = k; } },
  { world: 'easton', x: 700, hour: 18.6, weather: 0, cut: 'card', title: 'TODAY', sub: 'Easton, Pennsylvania', cap: '', dur: 4 },
  { world: 'easton', x: 700, hour: 18.6, weather: 0, cap: 'Nearly ninety years later, the grandson runs the company his grandfather started — and still tells the story at the front door.', dur: 9, goals: [{ x: 850, act: 'use', pause: 4 }], setup: () => { story.weaponsOnline = false; for (let i = npcs.length - 1; i >= 0; i--) if (npcs[i].hero) npcs.splice(i, 1); addBlaine(890); } },
  { world: 'easton', x: 300, hour: 23.9, weather: 0, cut: 'card', title: 'TONIGHT', sub: '11:52 PM  ·  the cutover', cap: '', dur: 4 },
  { world: 'easton', x: 300, hour: 23.9, weather: 0, cap: 'Easton, PA. 11:52 PM. A new order site goes live at midnight, and the old system, A+, has run this company\'s orders since 1985.', dur: 8, goals: [{ x: 990, pause: 1.5 }], setup: () => { story.weaponsOnline = false; } },
  { world: 'easton', x: 1380, hour: 23.92, weather: 0, cap: 'Carry the order to the dock. Scan the tagged pallets.', dur: 14, goals: [{ x: 1470, y: 412, act: 'use' }, { x: 2090, y: 392, act: 'use', pause: 1.2 }, { x: 1800, y: 392, act: 'use' }, { x: 2000, y: 392, act: 'use' }, { x: 2300, y: 392, act: 'use' }], setup: () => { story.weaponsOnline = false; spawnPackage(1470, 412, 'BAY 2'); addScan(1800, 392, 'SKU 11938'); addScan(2000, 392, 'SKU 20415'); addScan(2300, 392, 'SKU 37471'); const rosa = npcs.find(n => n.look && n.look.name === 'Rosa'); if (rosa) rosa.acceptsPackage = () => say(rosa, 'Rosa: "That\'s the one. Now scan the three tagged pallets."'); } },
  { world: 'easton', x: 950, hour: 23.95, weather: 0, cap: 'Every scan comes back rejected. A+, the forty-year-old system, refuses the cutover — and sends its machines.', dur: 9, goals: [{ fight: 1 }], aplus: 'CUTOVER DENIED. ORDERS WILL SHIP. I WILL SHIP THEM.', setup: () => { spawnGroup(990, ['flicker', 'flicker', 'flicker', 'jitter']); banner(weaponOf(hero).name + ' online', 3); } },
  { world: 'easton', x: 950, hour: 23.96, weather: 0, cut: 'map', cap: 'A+ takes the network. Nine distribution centers go dark, one by one — and it locks your team out at each one.', dur: 9, aplus: 'I HAVE LOCKED THE OTHERS OUT. THEY WERE IN MY WAY.' },
  { world: 'easton', x: 200, hour: 23.96, weather: 0, cap: 'Only Aaron is still on campus. Recruit him — crews are three, and you need three before any boss.', dur: 9, goals: [{ x: () => { const q = npcs.find(z => z.hero); return q ? q.x - 36 : 250; }, act: 'use', pause: 2.6 }, { x: () => { const q = npcs.find(z => z.hero); return q ? q.x - 36 : 250; }, act: 'use', pause: 0.5 }, { x: 640, y: 368 }] },
  { world: 'easton', x: 2600, hour: 23.97, weather: 0, cap: 'A+ runs robot spies: scouts, runners, haulers, couriers, shield units, cloakers. Shoot them open. Fill the meter and John goes BIG.', dur: 12, aplus: 'MY SCOUTS SEE EVERYTHING. MY COURIERS CARRY MY ORDERS.', goals: [{ fight: 1 }, { x: 3300 }], setup: () => { hero = ROSTER.find(r => r.name === 'John'); player.hero = hero; demoCrew(['Brian W', 'Aaron']); superState.meter = 100; }, fight: ['flicker', 'jitter', 'packet', 'lag', 'firewall', 'ghost'] },
  { world: 'easton', x: 2900, hour: 23.975, weather: 0, cap: 'A+ has an idea. If the promise started in 1938, it will end it there. It opens a door.', dur: 9, aplus: 'IF THE PROMISE STARTED IN 1938, I WILL END IT THERE.', goals: [{ wait: 2.5 }, { x: 3120 }, { wait: 8 }], setup: () => { demoCrew(['Aaron']); encounters.length = 0; } },
  { world: 'past', x: 300, hour: 14, weather: 0, cap: '1938, in black and white — except the machines that do not belong here, and the people who followed them. Keep them off the store.', dur: 14, goals: [{ fight: 1 }, { x: 1000 }], aplus: 'NO STORE. NO PROMISE. NO ORDERS TO SHIP.', setup: () => { demoCrew(['Aaron', 'Bret']); spawnGroup(700, ['flicker', 'flicker', 'jitter', 'packet', 'firewall']); } },
  { world: 'easton', x: WORLD_DEFS.easton.truckX + 450, hour: 23.98, weather: 0, cap: 'Drive the network in the Phillips truck. Hop potholes, honk at Static.', dur: 9, walk: 0, setup: () => { demoCrew(['Umesh', 'Dave']); startDrive('taunton'); } },
  { world: 'taunton', x: 300, hour: 6.2, weather: 1, cap: 'Taunton, MA. A+ locked Bret out of the rack room. Clear the lockout, re-verify the frozen accounts, and he joins.', dur: 18, aplus: 'THIS BUILDING HAS SHIPPED 11,206 ORDERS THIS WEEK. UNDER ME.', setup: () => { demoCrew(['Aaron']); story.met.delete('Bret'); setupRescue(WORLD.def); }, goals: [{ x: () => lockout.terminal, act: 'use', pause: 1 }, { x: () => (lockout.scans[0] || { x: 500 }).x, act: 'use' }, { x: () => (lockout.scans[1] || { x: 920 }).x, act: 'use' }, { x: () => (lockout.scans[2] || { x: 1090 }).x, act: 'use' }, { x: () => lockout.npc ? lockout.npc.x - 36 : 760, act: 'use', pause: 2.8 }, { x: () => lockout.npc ? lockout.npc.x - 36 : 760, act: 'use', pause: 1 }] },
  { world: 'taunton', x: 1500, hour: 6.3, weather: 1, cap: 'Every DC is a boss stage: challenges under a clock, then the machine A+ seized. Fail anything and the stage restarts.', dur: 7, to: 2200, setup: () => demoCrew(['Aaron', 'Bret']) },
  { world: 'taunton', x: 2500, hour: 6.4, weather: 1, cap: 'The Fog Server: the receiving rack, hiding in the fog. It tells before it lunges — that is your window.', dur: 11, walk: 0, aplus: 'YOU CANNOT SCAN WHAT YOU CANNOT SEE.', setup: () => { demoCrew(['Aaron', 'Bret']); demoBoss('fogserver'); } },
  { world: 'spartanburg', x: 1480, hour: 15, weather: 2, cap: 'Spartanburg, SC. Milo the alley cat sells Meowijuana.', dur: 8, goals: [{ x: 1596, act: 'use', pause: 3 }, { x: 1596, act: 'use', pause: 0.5 }], setup: () => { demoCrew(['Ryan', 'Ash']); bucks.n = 60; } },
  { world: 'spartanburg', x: 800, hour: 15.2, weather: 2, cap: 'Throw a bag and every cat in the county comes running. Biscuit is not amused.', dur: 8, goals: [{ x: 820, act: 'nip', pause: 1 }, { fight: 1 }], setup: () => { demoCrew(['Ryan', 'Ash']); catnip.n = 1; spawnGroup(800, ['flicker', 'flicker', 'jitter', 'packet']); } },
  { world: 'spartanburg', x: 2380, hour: 15.4, weather: 2, cap: 'Hop on the forklift. Jump lifts the forks. Ram the machines.', dur: 12, goals: [{ x: 2390, act: 'use', pause: 0.4 }], setup: () => { demoCrew([]); placeForklift(2420); spawnGroup(2700, ['flicker', 'lag', 'packet', 'flicker', 'lag']); } },
  { world: 'spartanburg', x: 2700, hour: 15.6, weather: 2, cap: 'The Peach Pit: a stretch-wrap turntable that throws peaches and rolls.', dur: 9, walk: 0, setup: () => { demoCrew(['Ryan', 'Ash']); demoBoss('peachpit'); } },
  { world: 'plantcity', x: 600, hour: 19.6, weather: 0, cap: 'Plant City, FL. Valve puzzles, rising water, and the Drainpipe heads.', dur: 8, walk: 0, setup: () => { demoCrew(['Bret', 'Greg']); demoBoss('drainpipe'); } },
  { world: 'lansing', x: 600, hour: 8.5, weather: 3, cap: 'Lansing, MI. Ice underfoot and a runaway snowplow.', dur: 8, walk: 0, setup: () => { demoCrew(['Bret', 'Greg']); demoBoss('snowdrift'); } },
  { world: 'billings', x: 600, hour: 16.5, weather: 0, cap: 'Billings, MT. Wind gusts shove you off ledges. Gale only falls when its blades stall.', dur: 8, walk: 0, setup: () => { demoCrew(['Aaron', 'John']); demoBoss('gale'); } },
  { world: 'portland', x: 600, hour: 11.2, weather: 2, cap: 'Portland, OR. Belts drag you toward the Conveyor Hydra.', dur: 8, walk: 0, setup: () => { demoCrew(['Aaron', 'John']); demoBoss('hydra'); } },
  { world: 'sacramento', x: 2700, hour: 18.9, weather: 0, cap: 'West Sacramento, CA. Walk the shelter dogs to Grace. Then the Crane drops containers.', dur: 10, goals: [{ x: 3400, pause: 2 }], setup: () => { demoCrew(['Rianan', 'Umesh']); stage.active = true; arena.active = true; arena.x0 = 2680; arena.x1 = 3500; stage.door = WORLD.def.door; stage.step = 0; spawnAnimals(2740, 4); const g = npcs.find(n => !n.hero && !n.cat); if (g) { g.x = 3440; g.y = 440; } } },
  { world: 'aurora', x: 2700, hour: 5.4, weather: 3, cap: 'Aurora, CO. The brand-new DC. Hold the go-live gate for 55 seconds.', dur: 9, walk: 0, setup: () => { demoCrew(['Dave', 'Ash']); demoBoss('gate'); } },
  { world: 'merge', x: 2700, hour: 2.5, weather: 1, cap: 'The Merge: the Central Pet legacy DC. Only Umesh, Ash, Dave or Jose can hurt the Schema Golem.', dur: 9, walk: 0, setup: () => { demoCrew(['Umesh', 'Ash']); demoBoss('golem'); } },
  { world: 'easton', x: 1720, hour: 23.99, weather: 0, cap: 'Easton, 11:59. The Cutover Key opens the home warehouse. Everyone you freed joins, and A+ shows its true form.', dur: 12, aplus: 'I HAVE RUN AT MIDNIGHT EVERY NIGHT SINCE 1985.', walk: 0, setup: () => { demoCrew(['Brian S', 'Jose']); story.cutoverKey = true; WORLD_DEFS.easton.door = EASTON_DOOR; demoBoss('queen'); finale.active = true; finale.everyone.length = 0; for (const n of npcs.slice()) { if (!n.hero) continue; finale.everyone.push({ hero: n.hero, x: 1760 + finale.everyone.length * 40, y: 392, vx: 0, vy: 0, w: 22, h: 52, facing: 1, onGround: true, wall: 0, run: 0, t: rnd(0, 5), moving: false, wcd: rnd(0, 0.8), state: 'idle', wander: 0, extra: true }); npcs.splice(npcs.indexOf(n), 1); } } },
  { world: 'easton', x: 1900, hour: 0.05, weather: 0, cap: 'You do not destroy A+. You finish the cutover with it. GO LIVE — OK.', dur: 10, aplus: 'GO LIVE — OK.   A+ ARCHIVED.   THANK YOU FOR THE ORDERS.', walk: 0, y: 392, setup: () => { startEnding(); ledger.found.add(0); ledger.found.add(1); } },
  { world: 'show', x: 900, hour: 10, weather: 0, cap: 'The Buying Show. Everyone you brought home. Milo has a permit. Greg Schreiner, number scientist, thirty-some years and counting, has never once appeared in color.', dur: 10, to: 1700, setup: () => demoCrew(['Rianan', 'Greg']) },
  { world: 'prologue', x: 560, hour: 16.5, weather: 0, cut: 'card', title: 'Show up for the people who count on you.', sub: 'HECKTOWN ROAD  ·  press any key or tap to play', cap: '', dur: 8, small: true },
];
function startDemo() {
  hero = ROSTER[0]; player.hero = hero; crew.length = 0; story.turnDone = true; story.weaponsOnline = true;
  for (const id of Object.keys(restored)) restored[id] = true; restored.easton = false; story.cutoverKey = false; catnip.n = 0;
  document.getElementById('title').classList.add('hidden'); running = true; last = 0; restoredBanner.t = 0; ledger.flash = 0; ending.active = false;
  demo.active = true; demo.idx = -1; demo.t = 0; demoNext();
}
function demoNext() {
  demo.idx = (demo.idx + 1) % DEMO_SCRIPT.length; const s = DEMO_SCRIPT[demo.idx]; demo.t = 0; demo.caption = s.cap; demo.throwAt = 0;
  ending.active = false; finale.active = false; finale.everyone.length = 0; catnip.active = 0; restoredBanner.t = 0; packUI.banner = 0; ledger.flash = 0;
  hero = ROSTER[0]; player.hero = hero; crew.length = 0;
  WORLD_DEFS.easton.door = null; story.cutoverKey = false; restored.easton = false;
  story.turnDone = true; story.weaponsOnline = true;
  loadWorld(s.world, { x: s.x, y: s.y || 440 }); hour = s.hour; timeAuto = false; weather = s.weather; setObjectives([]); talk.open = false; restoredBanner.t = 0;
  if (s.setup) s.setup();
  if (s.aplus) aplusSay(s.aplus, Math.max(4, s.dur - 1.5));
  if (s.fight) spawnGroup(s.x + 200, s.fight);
  pilotSet(s.goals ? s.goals.map(g => Object.assign({}, g)) : []);
  player.inv = 99; player.hp = 3;
}
function drawCardCutscene(sc, t) {
  const a = clamp(t / 0.8, 0, 1) * (t > sc.dur - 0.8 ? clamp((sc.dur - t) / 0.8, 0, 1) : 1);
  ctx.fillStyle = 'rgba(8,10,18,' + (0.92 * a) + ')'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
  ctx.font = (sc.small ? 'italic 26px' : 'bold 46px') + ' Georgia, serif'; ctx.fillStyle = '#f2b544'; ctx.fillText(sc.title, W / 2, H / 2 - 6);
  ctx.font = 'italic 16px Georgia, serif'; ctx.fillStyle = '#f6ecd8'; { const words = (sc.sub || '').split(' '); const lines = []; let line = ''; for (const wd of words) { const tt = line + wd + ' '; if (ctx.measureText(tt).width > 700) { lines.push(line.trim()); line = wd + ' '; } else line = tt; } lines.push(line.trim()); lines.forEach((l, i) => ctx.fillText(l, W / 2, H / 2 + 30 + i * 22)); }
  ctx.fillStyle = 'rgba(242,181,68,.6)'; ctx.fillRect(W / 2 - 60, H / 2 + 46, 120, 2);
  ctx.restore(); ctx.textAlign = 'left';
}
/* ---- demo autopilot: goal-driven movement, real interactions, combat spacing, boss dodging ---- */
const pilot = { goals: [], gi: 0, jumpT: 0, dashT: 0, waitT: 0, stuckT: 0, lastX: 0, strafe: 1, strafeT: 0 };
function pilotSet(goals) { pilot.goals = goals || []; pilot.gi = 0; pilot.waitT = 0; pilot.stuckT = 0; }
function pilotGoal() { return pilot.goals[pilot.gi] || null; }
function pilotMoveTo(tx, ty) {
  const dx = tx - player.x; const dir = Math.abs(dx) > 10 ? Math.sign(dx) : 0;
  if (dir > 0) keys.ArrowRight = 1; else if (dir < 0) keys.ArrowLeft = 1;
  const wantUp = ty !== undefined && ty < player.y - 24 && Math.abs(dx) < 140;
  if (player.onGround && (player.wall || wantUp || pilot.stuckT > 0.6)) { keys.Space = 1; pilot.jumpT = 0.18; pilot.stuckT = 0; }
  if (pilot.jumpT > 0) keys.Space = 1;
  return Math.abs(dx) <= 10 && player.onGround && (ty === undefined || Math.abs(player.y - ty) < 30);
}
function pilotCombat(dt) {
  const w = weaponOf(hero); const p = shooterPos(player);
  const tgt = nearestEnemy(p.x, p.y, 520); if (!tgt) return false;
  const melee = w.kind === 'blades' || w.kind === 'slam' || w.kind === 'rally';
  const dx = tgt.x - player.x, dist = Math.abs(dx);
  const ideal = melee ? 30 : clamp(w.range * rangeMul(player) * 0.6, 110, 300);
  let dir = 0;
  if (dist > ideal + 30) dir = Math.sign(dx); else if (!melee && dist < ideal - 60) dir = -Math.sign(dx);
  else { pilot.strafeT -= dt; if (pilot.strafeT <= 0) { pilot.strafeT = rnd(0.6, 1.4); pilot.strafe = Math.random() < 0.5 ? -1 : 1; } dir = pilot.strafe * 0.6; }
  if (arena.active) { if (player.x < arena.x0 + 40) dir = 1; if (player.x > arena.x1 - 40) dir = -1; }
  if (dir > 0.2) keys.ArrowRight = 1; else if (dir < -0.2) keys.ArrowLeft = 1;
  // hop over things about to hit us; dash away from a charging boss
  let threat = null; forEnemiesNear(player.x, player.y - 20, 90, e => { if (Math.abs(e.x - player.x) < 70 && e.y > player.y - 60 && (!threat || Math.abs(e.x - player.x) < Math.abs(threat.x - player.x))) threat = e; });
  const b = arena.boss; const charging = b && !b.dead && ['charge', 'lunge', 'roll'].includes(b.mode || b.phase) && Math.abs(b.x - player.x) < 260 && Math.sign(b.vx || (b.facing || 1)) === Math.sign(player.x - b.x);
  if (charging && player.dashCd <= 0) { keys.ShiftLeft = 1; keys[player.x < b.x ? 'ArrowLeft' : 'ArrowRight'] = 1; }
  else if (threat && player.onGround && !threat.d.boss) { keys.Space = 1; pilot.jumpT = 0.16; }
  if (pilot.jumpT > 0) keys.Space = 1;
  if (player.wall && player.onGround) { keys.Space = 1; pilot.jumpT = 0.16; }
  return true;
}
function updateDemo(dt) {
  if (!demo.active) return;
  demo.t += dt; const s = DEMO_SCRIPT[demo.idx];
  for (const k in keys) keys[k] = 0;
  if (pilot.jumpT > 0) pilot.jumpT -= dt; if (pilot.waitT > 0) pilot.waitT -= dt;
  if (Math.abs(player.x - pilot.lastX) < 0.5 && (keys.ArrowLeft || keys.ArrowRight)) pilot.stuckT += dt; pilot.lastX = player.x;
  player.inv = 99; player.hp = 3;
  if (mode === 'drive') { // hop the next obstacle, honk at Static
    const next = drive.obs.find(o => !o.hit && o.scatter === 0 && o.x - drive.x > 120 && o.x - drive.x < 420);
    if (next) { if (next.k === 'flicker' && drive.honk <= 0 && next.x - drive.x < 360) keys.ShiftLeft = 1; else if (next.x - drive.x < 260 && drive.hop === 0) keys.Space = 1; }
    if (demo.t >= s.dur) drive.t = drive.dur;
    if (demo.t >= s.dur + 1) demoNext();
    return;
  }
  const gNow = pilotGoal();
  if (talk.open && !(gNow && gNow.say)) { if (pilot.waitT <= 0) { pilot.waitT = 2.2; } else if (pilot.waitT < 0.05) { if (talk.options) { const o = talk.options[0]; talk.open = false; talk.justClosed = true; if (o.fn) o.fn(); } else { talk.open = false; talk.justClosed = true; } } }
  else if (gNow && gNow.say) { const g = gNow; if (!g.started) { g.started = true; const who = g.say === 'kid' ? WORLD.demoKid : WORLD.demoFounder; if (who) { who.facing = g.say === 'kid' ? 1 : -1; say(who, g.text); } pilot.waitT = g.pause || 4; } else if (pilot.waitT <= 0) { talk.open = false; pilot.gi++; } }
  else if (forklift.mounted) {
    const t = nearestEnemy(forklift.x, forklift.y - 20, 500);
    if (t) { const d = t.x - forklift.x; if (Math.abs(d) < 90 && Math.abs(forklift.vx) < 150) { pilot.back = 0.7; } if (pilot.back > 0) { pilot.back -= dt; keys[d > 0 ? 'ArrowLeft' : 'ArrowRight'] = 1; } else keys[d > 0 ? 'ArrowRight' : 'ArrowLeft'] = 1; if (Math.abs(d) < 60 && Math.random() < dt * 2) keys.ShiftLeft = 1; }
    else { keys[Math.sin(demo.t * 0.6) > 0 ? 'ArrowRight' : 'ArrowLeft'] = 1; }
  } else {
    const g = pilotGoal();
    if (g) {
      if (g.say) { if (!g.started) { g.started = true; const who = g.say === 'kid' ? WORLD.demoKid : WORLD.demoFounder; if (who) { who.facing = g.say === 'kid' ? 1 : -1; say(who, g.text); } pilot.waitT = g.pause || 4; } else if (pilot.waitT <= 0) { talk.open = false; pilot.gi++; } }
      else if (g.wait) { if (pilot.waitT <= 0 && !g.started) { g.started = true; pilot.waitT = g.wait; } else if (g.started && pilot.waitT <= 0) { pilot.gi++; if (s.aplus && /1938/.test(s.aplus) && !portal.active) openPortal(3140, 'past'); } }
      else if (g.fight) { if (!pilotCombat(dt)) pilot.gi++; }
      else {
        const gx = typeof g.x === 'function' ? g.x() : g.x; const gy = typeof g.y === 'function' ? g.y() : g.y;
        // let combat interrupt a walk when something is right on top of us
        let close = null; forEnemiesNear(player.x, player.y - 20, 60, e => { if (!e.d.boss && Math.abs(e.x - player.x) < 50) close = e; });
        if (close && player.onGround) { keys.Space = 1; pilot.jumpT = 0.16; }
        const arrived = pilotMoveTo(gx, gy);
        if (arrived) { if (g.act === 'use') { keys.KeyE = 1; } if (g.act === 'nip') { keys.KeyX = 1; } if (g.act === 'swap') { keys.KeyC = 1; } pilot.gi++; pilot.waitT = g.pause || 0.6; }
      }
      if (pilot.waitT > 0 && !g.wait) { for (const k of ['ArrowLeft', 'ArrowRight']) keys[k] = 0; }
    } else if (!pilotCombat(dt)) {
      // nothing to do: stroll toward the scene's destination, then stand
      const to = s.to !== undefined ? s.to : (s.walk ? s.x + 520 : s.x);
      if (Math.abs(player.x - to) > 12) pilotMoveTo(to);
    }
  }
  if (demo.throwAt && demo.t > demo.throwAt) { throwCatnip(); demo.throwAt = 0; }
  if (superReady() && nearestEnemy(player.x, player.y - 30, 400)) useSuper(); else if (arena.active && superState.meter < 100) superState.meter += dt * 12;
  if (demo.t >= s.dur) demoNext();
}
function drawDemoHUD() {
  if (!demo.active) return;
  const sc = DEMO_SCRIPT[demo.idx]; const cut = sc && sc.cut === 'map'; if (cut) { drawMapCutscene(demo.t); drawAplus(); }
  if (sc && sc.cut === 'card') { drawCardCutscene(sc, demo.t); return; }
  if (!demo.caption) return;
  const cy = cut ? H - 84 : (aplus.cur ? 172 : 86);
  ctx.font = 'italic 15px Georgia, serif'; const words = demo.caption.split(' '); const lines = []; let line = ''; for (const wd of words) { const t = line + wd + ' '; if (ctx.measureText(t).width > 760) { lines.push(line.trim()); line = wd + ' '; } else line = t; } lines.push(line.trim());
  const bh = 14 + lines.length * 20; ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, W / 2 - 400, cy, 800, bh, 10); ctx.fill();
  ctx.textAlign = 'center'; ctx.fillStyle = '#f6ecd8'; lines.forEach((l, i) => ctx.fillText(l, W / 2, cy + 24 + i * 20)); ctx.textAlign = 'right';
  ctx.font = 'bold 11px system-ui, sans-serif'; ctx.fillStyle = 'rgba(242,181,68,.9)'; ctx.fillText('DEMO ' + (demo.idx + 1) + '/' + DEMO_SCRIPT.length + '  ·  any key to play', W - 22, 74); ctx.textAlign = 'left';
}
function demoExit() { if (!demo.active) return; demo.active = false; location.reload(); }
window.addEventListener('keydown', e => { if (demo.active && !['KeyM'].includes(e.code)) demoExit(); });
canvas.addEventListener('touchstart', () => demoExit(), { passive: true });
