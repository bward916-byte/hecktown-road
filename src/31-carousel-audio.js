/* =====================================================================
   COVERFLOW + AUDIO ENGINE (M29)
   ===================================================================== */

/* ---------- coverflow carousel: neighbours visible, smooth, draggable ---------- */
(function () {
  const old = document.getElementById('carousel'); if (!old || !old.parentNode) return;
  const st = document.createElement('style'); st.textContent = `
  #carousel { display:none !important; }
  #flow { position:relative; width: min(920px, 96vw); height: 236px; margin: 4px auto 0; overflow:hidden; pointer-events:auto; touch-action: pan-y; user-select:none; }
  #flow .fc { position:absolute; left:50%; top:8px; width: min(520px, 74vw); margin-left: calc(min(520px, 74vw) / -2); background:rgba(16,26,46,.78); border:1.5px solid rgba(242,181,68,.4); border-radius:16px; padding:12px 16px; display:grid; grid-template-columns: 110px 1fr; gap:12px; text-align:left; color:#f6ecd8; font-family: system-ui, -apple-system, sans-serif; transition: transform .38s cubic-bezier(.22,.9,.3,1), opacity .38s, filter .38s; will-change: transform; cursor:pointer; box-sizing:border-box; }
  #flow.drag .fc { transition: none; }
  #flow .fc canvas { width:110px; height:110px; border-radius:14px; }
  #flow .n { font: bold 21px Georgia, serif; color:#f2b544; } #flow .r { font-size:12px; color:#b9c5d6; margin-top:2px; }
  #flow .w { font-size:12px; margin-top:7px; } #flow .w b { color:#f6ecd8; } #flow .dot { display:inline-block; width:9px; height:9px; border-radius:50%; margin-right:5px; vertical-align:middle; }
  #flow .s { font-size:11px; color:#b9c5d6; margin-top:4px; } #flow .bio { font: italic 12px Georgia, serif; color:#e6d7bd; margin-top:5px; }
  #flow .stats { display:grid; grid-template-columns: 52px 1fr; gap:3px 8px; margin-top:7px; font-size:10px; color:#b9c5d6; align-items:center; }
  #flow .bar { height:6px; background:rgba(255,255,255,.12); border-radius:3px; overflow:hidden; } #flow .bar i { display:block; height:100%; border-radius:3px; }
  #flowArrows { display:flex; justify-content:center; gap:14px; margin-top:4px; pointer-events:auto; } #flowArrows button { width:40px; height:40px; border-radius:50%; border:1.5px solid rgba(242,181,68,.5); background:rgba(242,181,68,.08); color:#f2b544; font:bold 18px system-ui; cursor:pointer; }
  @media (max-height: 520px) { #flow { height: 150px; } #flow .fc { grid-template-columns: 76px 1fr; padding:8px 12px; top:4px; } #flow .fc canvas { width:76px; height:76px; } #flow .n { font-size:16px; } #flow .bio { display:none; } #flow .stats { margin-top:4px; } #flow .s { display:none; } }`;
  document.head && document.head.appendChild(st);
  const flow = document.createElement('div'); flow.id = 'flow'; old.parentNode.insertBefore(flow, old);
  const arrows = document.createElement('div'); arrows.id = 'flowArrows'; const prev = document.createElement('button'); prev.textContent = '‹'; const next = document.createElement('button'); next.textContent = '›'; arrows.appendChild(prev); arrows.appendChild(next); const dots = document.getElementById('dots'); old.parentNode.insertBefore(arrows, dots || old);
  const cards = [];
  function cardHtml(ch) { const w = WEAPONS[ch.name] || {}; const sup = SUPERS[ch.name] || {}; const s = heroStats(ch); return '<div class="n">' + ch.name + '</div><div class="r">' + ch.role + '</div><div class="w"><span class="dot" style="background:' + (w.color ? rgb(w.color) : '#fff') + '"></span><b>' + (w.name || '') + '</b> — ' + (WKIND[w.kind] || '') + '</div><div class="s"><b style="color:#f2b544">SUPER · ' + (sup.name || '') + '</b> — ' + (sup.desc || '') + (T3[ch.name] ? '<br><b style="color:#7fe0ff">L3</b> — ' + T3[ch.name] : '') + '</div><div class="bio">' + (BIOS[ch.name] || '') + '</div><div class="stats">' + [['power', s.power, '#ff8a5a'], ['range', s.range, '#7fe0ff'], ['rate', s.rate, '#f2b544'], ['support', s.support, '#7fe0a0']].map(([k, v, c]) => '<span>' + k + '</span><div class="bar"><i style="width:' + Math.round(v * 100) + '%;background:' + c + '"></i></div>').join('') + '</div>'; }
  function build() { flow.innerHTML = ''; cards.length = 0; ROSTER.forEach((ch, i) => { const c = document.createElement('div'); c.className = 'fc'; const pc = document.createElement('canvas'); pc.width = 220; pc.height = 220; try { pc.getContext('2d').drawImage(portraitFor(ch), 0, 0, 220, 220); } catch (e) { } const info = document.createElement('div'); info.innerHTML = cardHtml(ch); c.appendChild(pc); c.appendChild(info); c.addEventListener('click', () => { if (i === titleSel.i) { if (!running) startGame(i); } else layout(i); }); flow.appendChild(c); cards.push(c); }); layout(titleSel.i); }
  let dragDx = 0;
  function layout(sel, dx) { titleSel.i = (sel + ROSTER.length) % ROSTER.length; dx = dx || 0; const cw = Math.min(520, window.innerWidth * 0.74); cards.forEach((c, i) => { let d = i - titleSel.i; if (d > ROSTER.length / 2) d -= ROSTER.length; if (d < -ROSTER.length / 2) d += ROSTER.length; const off = d * (cw * 0.62) + dx; const sc = d === 0 ? 1 : 0.78; const vis = Math.abs(d) <= 2; c.style.transform = 'translateX(' + off + 'px) scale(' + sc + ')'; c.style.opacity = vis ? (d === 0 ? 1 : 0.45) : 0; c.style.filter = d === 0 ? 'none' : 'saturate(.6) blur(.4px)'; c.style.zIndex = 10 - Math.abs(d); c.style.pointerEvents = vis ? 'auto' : 'none'; }); const dd = document.getElementById('dots'); if (dd) dd.innerHTML = ROSTER.map((r, k) => '<i class="' + (k === titleSel.i ? 'on' : '') + '"></i>').join(''); }
  let sx = null; flow.addEventListener('touchstart', e => { sx = e.touches[0].clientX; flow.classList.add('drag'); }, { passive: true });
  flow.addEventListener('touchmove', e => { if (sx === null) return; layout(titleSel.i, e.touches[0].clientX - sx); }, { passive: true });
  flow.addEventListener('touchend', e => { flow.classList.remove('drag'); if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) layout(titleSel.i + (dx < 0 ? 1 : -1)); else layout(titleSel.i); }, { passive: true });
  prev.addEventListener('click', () => layout(titleSel.i - 1)); next.addEventListener('click', () => layout(titleSel.i + 1));
  window.addEventListener('keydown', e => { if (running) return; if (e.code === 'ArrowLeft') layout(titleSel.i - 1); if (e.code === 'ArrowRight') layout(titleSel.i + 1); });
  window.addEventListener('resize', () => layout(titleSel.i));
  const _bt2 = buildTitle; buildTitle = function () { _bt2(); build(); };
})();

/* ---------- audio engine: sequenced themes, layered SFX, reverb ---------- */
const AE = { ready: false, bus: null, verb: null, comp: null, mode: 'none', parts: {}, step: 0, t: 0, bpm: 108, level: 0.9 };
function aeInit() {
  if (AE.ready || !audio.started || !audio.ctx) return; const c = audio.ctx;
  try {
    AE.comp = c.createDynamicsCompressor(); AE.comp.threshold.value = -18; AE.comp.ratio.value = 4; AE.comp.connect(c.destination);
    audio.master.disconnect(); audio.master.connect(AE.comp);
    // reverb: exponentially decaying noise impulse
    const len = c.sampleRate * 1.8, buf = c.createBuffer(2, len, c.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4); }
    AE.verb = c.createConvolver(); AE.verb.buffer = buf; const vg = c.createGain(); vg.gain.value = 0.22; AE.verb.connect(vg); vg.connect(AE.comp); AE.verbIn = AE.verb;
    AE.bus = {}; for (const n of ['bass', 'lead', 'arp', 'kick', 'hat', 'snare', 'pad']) { const g = c.createGain(); g.gain.value = 0; g.connect(audio.master); g.connect(AE.verb); AE.bus[n] = g; }
    AE.ready = true;
  } catch (e) { }
}
const SCALE = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];
const THEMES = {
  title: { bpm: 108, root: 220, chords: [[0, 4, 7], [-3, 0, 4], [-5, -1, 2], [-7, -3, 0]], lead: [0, 2, 4, 7, 4, 2, 0, -1, 0, 2, 4, 7, 9, 7, 4, 2], bass: [0, 0, 7, 0, -3, -3, 4, -3, -5, -5, 2, -5, -7, -7, 0, -7], arp: [0, 4, 7, 12], kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], gains: { bass: 0.12, lead: 0.09, arp: 0.05, kick: 0.25, hat: 0.05, snare: 0.12, pad: 0.03 } },
  calm: { bpm: 84, root: 220, chords: [[0, 4, 7], [-3, 0, 4], [-5, -1, 2], [-3, 0, 4]], lead: [null, null, 4, null, null, 7, null, null, null, 4, null, null, 2, null, null, null], bass: [0, null, null, null, -3, null, null, null, -5, null, null, null, -3, null, null, null], arp: [0, 7, 12, 7], kick: [], hat: [], snare: [], gains: { bass: 0.08, lead: 0.05, arp: 0.035, kick: 0, hat: 0, snare: 0, pad: 0.05 } },
  battle: { bpm: 132, root: 196, chords: [[0, 3, 7], [0, 3, 7], [-2, 1, 5], [-4, -1, 3]], lead: [0, null, 3, null, 5, 3, null, 0, null, 7, null, 5, 3, null, 0, null], bass: [0, 0, 0, 3, 0, 0, 5, 0, -2, -2, -2, 1, -4, -4, 3, -4], arp: [0, 3, 7, 10], kick: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0], hat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1], gains: { bass: 0.14, lead: 0.07, arp: 0.05, kick: 0.3, hat: 0.05, snare: 0.14, pad: 0.02 } },
  boss: { bpm: 144, root: 174.6, chords: [[0, 3, 6], [0, 3, 6], [-1, 2, 6], [-3, 0, 3]], lead: [0, 0, null, 1, 0, null, 3, null, 0, 0, null, 6, 5, null, 3, 1], bass: [0, 0, 0, 0, 0, 1, 0, 0, -1, -1, -1, -1, -3, -3, 0, 1], arp: [0, 3, 6, 9], kick: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1], hat: [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1], snare: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0], gains: { bass: 0.16, lead: 0.08, arp: 0.06, kick: 0.32, hat: 0.06, snare: 0.16, pad: 0.03 } },
  oldtime: { bpm: 96, root: 261.6, chords: [[0, 4, 7], [0, 4, 7], [-5, -1, 2], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0], [0, 4, 7], [-5, -1, 2]], lead: [4, null, 4, 7, null, 4, 2, null, 0, null, 2, 4, null, 2, 0, null], bass: [0, null, 4, null, 7, null, 4, null, -5, null, -1, null, 2, null, -1, null], arp: [4, 7, 12], kick: [], hat: [], snare: [], gains: { bass: 0.09, lead: 0.07, arp: 0.03, kick: 0, hat: 0, snare: 0, pad: 0.02 }, waltz: true },
  credits: { bpm: 92, root: 220, chords: [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]], lead: [0, null, 2, null, 4, null, 7, null, 9, null, 7, null, 4, null, 2, null], bass: [0, null, null, null, -5, null, null, null, -3, null, null, null, -7, null, null, null], arp: [0, 4, 7, 12, 16], kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], snare: [], gains: { bass: 0.1, lead: 0.09, arp: 0.06, kick: 0.15, hat: 0.03, snare: 0, pad: 0.05 } },
};
function aeMode() { if (!running) return 'title'; if (ending.active || photo.active) return 'credits'; if (WORLD.id === 'prologue' || WORLD.id === 'past') return 'oldtime'; if (stage.active && stage.step === 2 && arena.boss && !arena.boss.dead) return 'boss'; if (waveState.alive > 0 && story.weaponsOnline) return 'battle'; return 'calm'; }
function note(c, t, freq, type, gain, dur, bus, filt) { const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = freq; let dest = bus; if (filt) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filt; f.Q.value = 1.2; f.connect(bus); dest = f; } o.connect(g); g.connect(dest); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.start(t); o.stop(t + dur + 0.02); }
function drum(c, t, kind, bus, gain) { if (kind === 'kick') { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); o.connect(g); g.connect(bus); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22); o.start(t); o.stop(t + 0.25); return; } const len = c.sampleRate * (kind === 'hat' ? 0.05 : 0.16), buf = c.createBuffer(1, len, c.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len); const s = c.createBufferSource(); s.buffer = buf; const f = c.createBiquadFilter(); f.type = kind === 'hat' ? 'highpass' : 'bandpass'; f.frequency.value = kind === 'hat' ? 7000 : 1800; const g = c.createGain(); g.gain.value = gain; s.connect(f); f.connect(g); g.connect(bus); s.start(t); }
function aeTick(dt) {
  if (!audio.started || !audio.ctx) return; aeInit(); if (!AE.ready) return; const c = audio.ctx, now = c.currentTime;
  const mode = audio.on ? aeMode() : 'none'; if (mode !== AE.mode) { AE.mode = mode; AE.step = 0; }
  const th = THEMES[mode]; const tgt = th ? th.gains : { bass: 0, lead: 0, arp: 0, kick: 0, hat: 0, snare: 0, pad: 0 };
  for (const n in AE.bus) AE.bus[n].gain.setTargetAtTime((tgt[n] || 0) * AE.level, now, n === 'pad' ? 1.5 : 0.4);
  if (!th) return; AE.t -= dt; if (AE.t > 0) return; const stepLen = 60 / th.bpm / (th.waltz ? 3 : 4) * (th.waltz ? 1 : 1); AE.t += stepLen; const st = AE.step++; const i = st % 16; const bar = Math.floor(st / 16) % th.chords.length; const chord = th.chords[bar]; const t = now + 0.02; const rootF = th.root;
  const f = (semi) => rootF * Math.pow(2, semi / 12);
  if (th.bass[i] !== null && th.bass[i] !== undefined) note(c, t, f(chord[0] + th.bass[i] - 12), 'triangle', 1, stepLen * 0.9, AE.bus.bass, 500);
  if (th.lead[i] !== null && th.lead[i] !== undefined && !(mode === 'calm' && Math.random() < 0.5)) note(c, t, f(chord[0] + SCALE[Math.max(0, th.lead[i]) % SCALE.length] + (th.lead[i] < 0 ? -1 : 0)), mode === 'boss' || mode === 'battle' ? 'sawtooth' : 'square', 1, stepLen * 1.6, AE.bus.lead, mode === 'oldtime' ? 1400 : 2200);
  if (i % 2 === 0) note(c, t, f(chord[0] + th.arp[(st / 2 | 0) % th.arp.length] + 12), 'sine', 1, stepLen * 1.2, AE.bus.arp);
  if (i === 0) for (const semi of chord) note(c, t, f(semi), 'triangle', 0.5, stepLen * 16, AE.bus.pad, 700);
  if (th.kick[i]) drum(c, t, 'kick', AE.bus.kick, 1); if (th.hat[i]) drum(c, t, 'hat', AE.bus.hat, 1); if (th.snare[i]) drum(c, t, 'snare', AE.bus.snare, 1);
}
// retire the old single-line theme and the pad
musicTick = function () { };
const _audioTick = audioTick; audioTick = function () { _audioTick(); if (audio.started && audio.padGain) audio.padGain.gain.setTargetAtTime(0, audio.ctx.currentTime, 1); aeTick(1 / 60); };

/* ---------- layered SFX ---------- */
function layered(spec) { if (!audio.started || !audio.on || !audio.ctx) return; const c = audio.ctx, t = c.currentTime; try { for (const s of spec) { if (s.noise) { const len = c.sampleRate * s.dur, buf = c.createBuffer(1, len, c.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len); const src = c.createBufferSource(); src.buffer = buf; const f = c.createBiquadFilter(); f.type = s.type || 'bandpass'; f.frequency.value = s.f; f.Q.value = s.q || 1; const g = c.createGain(); g.gain.value = s.gain; src.connect(f); f.connect(g); g.connect(audio.master); if (AE.verb && s.verb) g.connect(AE.verb); src.start(t + (s.at || 0)); } else { const o = c.createOscillator(), g = c.createGain(); o.type = s.type || 'sine'; o.frequency.setValueAtTime(s.f, t + (s.at || 0)); if (s.to) o.frequency.exponentialRampToValueAtTime(s.to, t + (s.at || 0) + s.dur); o.connect(g); g.connect(audio.master); if (AE.verb && s.verb) g.connect(AE.verb); g.gain.setValueAtTime(0.0001, t + (s.at || 0)); g.gain.exponentialRampToValueAtTime(s.gain, t + (s.at || 0) + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + (s.at || 0) + s.dur); o.start(t + (s.at || 0)); o.stop(t + (s.at || 0) + s.dur + 0.03); } } } catch (e) { } }
const _sfx = sfx;
sfx = function (name) {
  switch (name) {
    case 'jump': layered([{ type: 'square', f: 240, to: 560, dur: 0.13, gain: 0.08 }, { noise: 1, f: 1200, dur: 0.05, gain: 0.05 }]); return;
    case 'dash': layered([{ type: 'sawtooth', f: 800, to: 140, dur: 0.18, gain: 0.1 }, { noise: 1, type: 'highpass', f: 3000, dur: 0.16, gain: 0.08 }]); return;
    case 'hurt': layered([{ type: 'sawtooth', f: 180, to: 55, dur: 0.32, gain: 0.22, verb: 1 }, { noise: 1, f: 700, dur: 0.12, gain: 0.12 }, { type: 'sine', f: 60, dur: 0.2, gain: 0.25 }]); return;
    case 'kill': layered([{ noise: 1, f: 900, dur: 0.16, gain: 0.16, verb: 1 }, { type: 'triangle', f: 420, to: 80, dur: 0.16, gain: 0.12 }, { noise: 1, type: 'highpass', f: 4000, dur: 0.22, gain: 0.06, at: 0.05 }]); return;
    case 'shard': layered([{ type: 'sine', f: 1046, dur: 0.08, gain: 0.08 }, { type: 'sine', f: 1568, dur: 0.12, gain: 0.07, at: 0.05, verb: 1 }]); return;
    case 'scan': layered([{ type: 'square', f: 1760, dur: 0.07, gain: 0.07 }, { type: 'square', f: 2350, dur: 0.12, gain: 0.07, at: 0.08 }]); return;
    case 'boss': layered([{ type: 'sawtooth', f: 110, to: 50, dur: 0.9, gain: 0.3, verb: 1 }, { type: 'sawtooth', f: 165, to: 75, dur: 0.9, gain: 0.18, verb: 1 }, { noise: 1, f: 300, dur: 0.6, gain: 0.2, verb: 1 }, { type: 'sine', f: 40, dur: 1.0, gain: 0.3 }]); return;
    case 'join': layered([{ type: 'triangle', f: 523, dur: 0.14, gain: 0.12 }, { type: 'triangle', f: 659, dur: 0.14, gain: 0.12, at: 0.12 }, { type: 'triangle', f: 784, dur: 0.4, gain: 0.14, at: 0.24, verb: 1 }]); return;
    case 'page': layered([{ type: 'sine', f: 880, dur: 0.12, gain: 0.1 }, { type: 'sine', f: 1318, dur: 0.14, gain: 0.1, at: 0.12 }, { type: 'sine', f: 1760, dur: 0.6, gain: 0.12, at: 0.24, verb: 1 }, { noise: 1, type: 'highpass', f: 5000, dur: 0.3, gain: 0.04 }]); return;
    case 'ui': layered([{ type: 'square', f: 900, dur: 0.05, gain: 0.05 }]); return;
    case 'honk': layered([{ type: 'sawtooth', f: 196, dur: 0.5, gain: 0.22, verb: 1 }, { type: 'sawtooth', f: 247, dur: 0.5, gain: 0.16, verb: 1 }]); return;
  }
  _sfx(name);
};
// weapon-specific fire sounds
const FIRE_SFX = { dart: [{ type: 'square', f: 1400, to: 500, dur: 0.06, gain: 0.05 }], homing: [{ noise: 1, type: 'highpass', f: 2500, dur: 0.14, gain: 0.05 }, { type: 'sine', f: 600, to: 900, dur: 0.12, gain: 0.03 }], lob: [{ type: 'sine', f: 180, to: 90, dur: 0.16, gain: 0.12 }, { noise: 1, f: 500, dur: 0.08, gain: 0.05 }], lines: [{ type: 'square', f: 2200, dur: 0.04, gain: 0.04 }, { type: 'square', f: 2600, dur: 0.04, gain: 0.04, at: 0.04 }], chain: [{ noise: 1, type: 'highpass', f: 3500, dur: 0.12, gain: 0.1 }, { type: 'sawtooth', f: 1200, to: 300, dur: 0.1, gain: 0.05 }], beam: [{ type: 'sawtooth', f: 220, dur: 0.3, gain: 0.04 }], turret: [{ type: 'square', f: 700, to: 300, dur: 0.08, gain: 0.05 }], trigger: [{ noise: 1, type: 'highpass', f: 4000, dur: 0.1, gain: 0.08 }, { type: 'triangle', f: 1800, to: 400, dur: 0.12, gain: 0.05 }], orbit: [{ type: 'square', f: 1100, to: 700, dur: 0.05, gain: 0.03 }], blades: [{ noise: 1, f: 1800, dur: 0.06, gain: 0.03 }], slam: [{ type: 'sine', f: 90, to: 30, dur: 0.4, gain: 0.3, verb: 1 }, { noise: 1, f: 200, dur: 0.25, gain: 0.15 }], rally: [{ type: 'triangle', f: 440, dur: 0.2, gain: 0.05 }, { type: 'triangle', f: 660, dur: 0.3, gain: 0.05, at: 0.1, verb: 1 }] };
const fireGate = {};
const _updateShooter3 = updateShooter; updateShooter = function (sh, dt, isLeader) { const w = weaponOf(sh.hero); const before = projs.length + beams.length + summons.length; _updateShooter3(sh, dt, isLeader); if (!w || !audio.started || !audio.on) return; const fired = projs.length + beams.length + summons.length > before; if (!fired) return; const k = w.kind; const now = gameTime; if ((fireGate[k] || 0) > now - (k === 'blades' || k === 'beam' ? 0.5 : 0.08)) return; fireGate[k] = now; if (FIRE_SFX[k]) layered(FIRE_SFX[k].map(s => Object.assign({}, s, { gain: s.gain * (Math.abs(sh.x - player.x) < 400 ? 1 : 0.4) }))); };
const _damageEnemy7 = damageEnemy; damageEnemy = function (e, dmg, fromX, src) { const ok = _damageEnemy7(e, dmg, fromX, src); if (ok && audio.started && audio.on && (fireGate.hit || 0) < gameTime - 0.05) { fireGate.hit = gameTime; layered([{ noise: 1, f: e.d.boss ? 400 : 1200, dur: e.d.boss ? 0.14 : 0.06, gain: e.d.boss ? 0.12 : 0.05 }, { type: 'square', f: e.d.boss ? 160 : 500, to: e.d.boss ? 70 : 200, dur: 0.06, gain: e.d.boss ? 0.1 : 0.04 }]); } return ok; };
