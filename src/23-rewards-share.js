
/* =====================================================================
   REWARDS & SHARE (M21)
   ===================================================================== */

/* ---------- Ledger completion: the 1938 portal becomes a place you can revisit ---------- */
const _driveOpts2 = WORLD_DEFS.easton.driveOptions;
WORLD_DEFS.easton.driveOptions = () => _driveOpts2().concat(ledger.found.size >= LEDGER.length ? [{ label: '1938 (the Ledger is complete)', to: 'past' }] : []);
MAP_PINS.past = [700, 420];
const _startDrive2 = startDrive; startDrive = function (to) { if (to === 'past') { talk.open = false; openPortal(player.x + 120, 'past'); banner('The Ledger is complete. A+ never closed the door.', 3); return; } _startDrive2(to); };
// a bonus fight in the yard: waves of machines, the Founder keeps score
const _pastSetup = WORLD_DEFS.past.setup;
WORLD_DEFS.past.setup = function () { _pastSetup(); if (demo.active) return; story.yardWave = 0; setObjectives([{ text: '1938  ·  the yard. Waves come through the door. The Founder is counting.', check: () => false }]); setTimeout(() => { }, 0); };
const yardFight = { t: 4, wave: 0 };
function updateYardFight(dt) {
  if (WORLD.id !== 'past' || demo.active) return; yardFight.t -= dt;
  if (waveState.alive <= 0 && yardFight.t <= 0) { yardFight.wave++; story.yardWave = yardFight.wave; yardFight.t = 3; const kinds = ['flicker', 'flicker', 'jitter']; if (yardFight.wave > 2) kinds.push('packet', 'firewall'); if (yardFight.wave > 4) kinds.push('lag', 'beetle', 'ghost'); spawnGroup(1400, kinds); banner('1938  ·  wave ' + yardFight.wave, 1.5); const f = npcs.find(n => n.look && n.look.name === 'The Founder'); if (f) { f.bubble = ['That\'s ' + yardFight.wave + '.', 'Keep counting.', 'Rain or no rain.', 'Machines in my yard.'][yardFight.wave % 4]; f.bubbleT = 2.5; } if (yardFight.wave === 5) grantSkill('challenge'); }
}
WORLD_DEFS.past.driveTo = 'easton'; WORLD_DEFS.past.driveLabel = 'BACK TO TONIGHT'; WORLD_DEFS.past.driveHours = 0; WORLD_DEFS.past.driveRequires = () => null; WORLD_DEFS.past.miles = 88; WORLD_DEFS.past.truckX = 2200;
const _loadWorld15 = loadWorld; loadWorld = function (id, at) { _loadWorld15(id, at); if (id === 'past') { yardFight.t = 4; yardFight.wave = 0; } };
const _updateAplus7 = updateAplus; updateAplus = function (dt) { _updateAplus7(dt); updateYardFight(dt); };

/* ---------- speedrun clock: hidden until the credits, shown on the photo ---------- */
const run = { t: 0, frozen: null };
const _update3 = update; update = function (dt) { _update3(dt); if (running && !demo.active && story.turnDone && !restored.easton && !photo.active && !ending.active) run.t += dt; };
const _startEnding2 = startEnding; startEnding = function () { if (run.frozen === null) run.frozen = run.t; _startEnding2(); };
function fmtRun(s) { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60; return (h ? h + ':' : '') + (m < 10 && h ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec; }
const _drawPhotoHUD = drawPhotoHUD; drawPhotoHUD = function () { _drawPhotoHUD(); if (!photo.active || run.frozen === null) return; ctx.fillStyle = 'rgba(16,26,46,.7)'; rr(ctx, 40, 40, 200, 30, 8); ctx.fill(); ctx.fillStyle = '#f2b544'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.fillText('CUTOVER TIME  ' + fmtRun(run.frozen), 52, 60); };
// saved with the game
const _saveGame = saveGame; saveGame = function () { _saveGame(); try { const s = JSON.parse(localStorage.getItem('hr_save_v1') || 'null'); if (s) { s.run = run.t; localStorage.setItem('hr_save_v1', JSON.stringify(s)); } } catch (e) { } };
const _continueGame = continueGame; continueGame = function () { const ok = _continueGame(); if (ok) { try { const s = JSON.parse(localStorage.getItem('hr_save_v1') || 'null'); if (s && s.run) run.t = s.run; } catch (e) { } } return ok; };

/* ---------- per-hero ending lines ---------- */
const HERO_ENDINGS = { Rianan: 'Rianan let the war room go dark for the first time all night, and went to find the cat.', Aaron: 'Aaron was on the river by seven. Class IV. He picked his line early.', Bret: 'Bret was home before the baby woke up. The dogs met him at the door.', 'Brian S': 'Brian S went home and built a new machine. The backglass is a beetle.', 'Brian W': 'Brian W drove west to check on the cactus. The database was fine.', Umesh: 'Umesh watched the first 850 of the morning post cleanly, then closed the laptop.', Dave: 'Dave turned off a green screen that had been on since 1994. Then turned it back on. Just in case.', John: 'John rewrote the midnight job so it only runs when someone asks. Nobody has asked yet.', Greg: 'Greg was seen in Accounting on Monday. And Receiving. And 1938.', Ryan: 'Ryan shipped the fix from the parking lot. Pipeline\'s green.', Jose: 'Jose finished the diagram. The dragon has a name now. It\'s A+.', Ash: 'Ash built a flow that thanks you when an order ships. It has already thanked her twice.', Andrew: 'Andrew closed 11 emergency RFCs and opened the Thursday meeting on time. It stands.' };
const _drawEnding4 = drawEnding; drawEnding = function () { _drawEnding4(); if (!ending.active) return; const t = ending.t; if (t < 18 || t > 32) return; const a = clamp((t - 18) / 1.2, 0, 1) * clamp((32 - t) / 1.2, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.font = 'italic 14px Georgia, serif'; ctx.fillStyle = '#f6ecd8'; const line = HERO_ENDINGS[hero.name] || ''; const words = line.split(' '); let l = '', ly = H - 96; const lines = []; for (const w of words) { const tt = l + w + ' '; if (ctx.measureText(tt).width > 640) { lines.push(l.trim()); l = w + ' '; } else l = tt; } lines.push(l.trim()); lines.forEach((s, i) => ctx.fillText(s, W / 2, ly + i * 18)); ctx.restore(); ctx.textAlign = 'left'; };
