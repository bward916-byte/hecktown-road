/* =====================================================================
   HERO CAROUSEL (M28) — one character at a time, with stats
   ===================================================================== */
const WKIND = { dart: 'Fires darts at the nearest machine', homing: 'Homing envelopes that chase their target', lob: 'Lobs bombs with splash damage', lines: 'Green-screen lines that pierce', chain: 'Chain lightning that jumps between machines', beam: 'A lance that locks on and burns', turret: 'Drops turrets that fire on their own', trigger: 'Bolts that strike from above', orbit: 'Drones that orbit and shoot', blades: 'Spinning blades around you', slam: 'Ground slams that stun in a radius', rally: 'A field that speeds up the whole crew' };
function heroStats(ch) { const w = WEAPONS[ch.name] || {}; const dps = w.dmg && w.cd ? (w.dmg / w.cd) * (w.count || 1) : (w.dmg || 2) * 2; return { power: clamp(dps / 10, 0.15, 1), range: clamp((w.range || 200) / 520, 0.15, 1), rate: clamp(1 - (w.cd || 1) / 3.2, 0.15, 1), support: ['rally', 'turret', 'orbit', 'slam'].includes(w.kind) ? 0.9 : ['homing', 'chain'].includes(w.kind) ? 0.55 : 0.3 }; }
(function () {
  const grid = document.getElementById('grid'); if (!grid || !grid.parentNode) return;
  const st = document.createElement('style'); st.textContent = `
  #grid { display:none !important; }
  #carousel { display:flex; align-items:center; gap:10px; pointer-events:auto; margin: 4px auto 0; max-width: 92vw; }
  #carousel .arrow { width:44px; height:44px; border-radius:50%; border:1.5px solid rgba(242,181,68,.5); background:rgba(242,181,68,.08); color:#f2b544; font:bold 20px system-ui; cursor:pointer; flex:0 0 auto; }
  #heroCard { width: min(560px, 78vw); background:rgba(16,26,46,.72); border:1.5px solid rgba(242,181,68,.4); border-radius:16px; padding:12px 16px; display:grid; grid-template-columns: 120px 1fr; gap:12px; text-align:left; color:#f6ecd8; font-family: system-ui, -apple-system, sans-serif; touch-action: pan-y; user-select:none; }
  #heroCard canvas { width:120px; height:120px; border-radius:14px; }
  #heroCard .n { font: bold 22px Georgia, serif; color:#f2b544; }
  #heroCard .r { font-size:12px; color:#b9c5d6; margin-top:2px; }
  #heroCard .w { font-size:12px; margin-top:8px; } #heroCard .w b { color:#f6ecd8; } #heroCard .w .dot { display:inline-block; width:9px; height:9px; border-radius:50%; margin-right:5px; vertical-align:middle; }
  #heroCard .s { font-size:11px; color:#b9c5d6; margin-top:4px; }
  #heroCard .bio { font: italic 12px Georgia, serif; color:#e6d7bd; margin-top:6px; }
  #heroCard .stats { display:grid; grid-template-columns: 52px 1fr; gap:3px 8px; margin-top:8px; font-size:10px; color:#b9c5d6; align-items:center; }
  #heroCard .bar { height:6px; background:rgba(255,255,255,.12); border-radius:3px; overflow:hidden; } #heroCard .bar i { display:block; height:100%; border-radius:3px; }
  #dots { display:flex; gap:5px; justify-content:center; margin-top:6px; } #dots i { width:6px; height:6px; border-radius:50%; background:rgba(246,236,216,.3); } #dots i.on { background:#f2b544; }
  @media (max-height: 520px) { #heroCard { grid-template-columns: 84px 1fr; padding:8px 12px; } #heroCard canvas { width:84px; height:84px; } #heroCard .n { font-size:17px; } #heroCard .bio { display:none; } #heroCard .stats { margin-top:4px; } #carousel .arrow { width:36px; height:36px; font-size:16px; } }`;
  document.head && document.head.appendChild(st);
  const wrap = document.createElement('div'); wrap.id = 'carousel';
  const prev = document.createElement('button'); prev.className = 'arrow'; prev.textContent = '‹'; const next = document.createElement('button'); next.className = 'arrow'; next.textContent = '›';
  const card = document.createElement('div'); card.id = 'heroCard'; const pc = document.createElement('canvas'); pc.width = 240; pc.height = 240; const info = document.createElement('div');
  card.appendChild(pc); card.appendChild(info); wrap.appendChild(prev); wrap.appendChild(card); wrap.appendChild(next);
  const dots = document.createElement('div'); dots.id = 'dots';
  grid.parentNode.insertBefore(wrap, grid); grid.parentNode.insertBefore(dots, grid.nextSibling);
  function show(i) {
    titleSel.i = (i + ROSTER.length) % ROSTER.length; const ch = ROSTER[titleSel.i]; const w = WEAPONS[ch.name] || {}; const sup = SUPERS[ch.name] || {}; const s = heroStats(ch);
    try { const g = pc.getContext('2d'); g.clearRect(0, 0, 240, 240); g.drawImage(portraitFor(ch), 0, 0, 240, 240); } catch (e) { }
    info.innerHTML = '<div class="n">' + ch.name + '</div><div class="r">' + ch.role + '</div>' +
      '<div class="w"><span class="dot" style="background:' + (w.color ? rgb(w.color) : '#fff') + '"></span><b>' + (w.name || '') + '</b> — ' + (WKIND[w.kind] || '') + '</div>' +
      '<div class="s"><b style="color:#f2b544">SUPER · ' + (sup.name || '') + '</b> — ' + (sup.desc || '') + (T3[ch.name] ? '<br><b style="color:#7fe0ff">L3</b> — ' + T3[ch.name] : '') + '</div>' +
      '<div class="bio">' + (BIOS[ch.name] || '') + '</div>' +
      '<div class="stats">' + [['power', s.power, '#ff8a5a'], ['range', s.range, '#7fe0ff'], ['rate', s.rate, '#f2b544'], ['support', s.support, '#7fe0a0']].map(([k, v, c]) => '<span>' + k + '</span><div class="bar"><i style="width:' + Math.round(v * 100) + '%;background:' + c + '"></i></div>').join('') + '</div>';
    dots.innerHTML = ROSTER.map((r, k) => '<i class="' + (k === titleSel.i ? 'on' : '') + '"></i>').join('');
  }
  prev.addEventListener('click', () => show(titleSel.i - 1)); next.addEventListener('click', () => show(titleSel.i + 1));
  let sx = null; card.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true }); card.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(titleSel.i + (dx < 0 ? 1 : -1)); sx = null; }, { passive: true });
  card.addEventListener('click', () => { if (typeof startGame === 'function' && !running) startGame(titleSel.i); });
  window.addEventListener('keydown', e => { if (running) return; if (e.code === 'ArrowLeft') show(titleSel.i - 1); if (e.code === 'ArrowRight') show(titleSel.i + 1); if (e.code === 'Enter') startGame(titleSel.i); });
  const _bt = buildTitle; buildTitle = function () { _bt(); show(titleSel.i); };
})();
