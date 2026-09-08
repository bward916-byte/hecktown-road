/* =====================================================================
   GREG, A NORMAL PERSON (M27) — the ghost is retired; the joke lives in 1938
   ===================================================================== */
(function () { const g = ROSTER.find(r => r.name === 'Greg'); if (g) { delete g.mono; g.skin = '#e8b48e'; g.hair = '#5a4a3a'; g.shirt = '#5b6b8f'; g.pants = '#2b2f3a'; g.acc = 'cardigan'; g.style = 'short'; } WEAPONS.Greg.color = [150, 190, 255]; })();
for (const k in PORTRAITS) delete PORTRAITS[k];
// the wandering ghost is gone
updateGregGhost = function () { gregGhost.active = false; };
drawGregGhost = function () { };
// lines that referenced the gray
FLAVOR.Greg = ['Greg Schreiner: "Number scientist. Thirty-some years on this floor. I\'ve worked in every department — Receiving, Sales, Accounting, the dock, HR for one afternoon."', 'Greg: "Three-dimensional data models. I can see the whole network from here. It\'s ugly. We\'ll fix it."', 'Greg: "Give me a fact table and a quiet room and I will kick data ass."', 'Greg: "The basement readings are unusual again. They were unusual in 1994. I logged it. Nobody read the log."'];
BIOS.Greg = 'Number scientist. Every department. Since… a while.';
HERO_ENDINGS.Greg = 'Greg was seen in Accounting on Monday. And Receiving. He says it\'s always been like that.';
RETURN_LINES.Greg = 'I\'ve worked here too, once. Every department has a chair with my name on it.';
(function () { const i = CAST.findIndex(c => c[0] === 'Tina'); })();
BACK_NPCS.forEach(n => { if (n[0] === 'Tina') n[4] = ['Tina: "Eleven to two. The robots don\'t eat, so business is steady."', 'Tina: "Greg comes by. Says he\'s been coming by since before I opened. I opened in 2019."']; });
// the demo show caption
(function () { const s = DEMO_SCRIPT.find(x => /Greg Schreiner, number scientist/.test(x.cap || '')); if (s) s.cap = 'The Buying Show. Everyone you brought home. Milo has a permit. Greg has been at every one of these, including the ones before he was born.'; })();
// the 1938 joke: Greg, in the yard, in 1938, unbothered
const _setupPrologue2 = setupPrologue;
setupPrologue = function () {
  _setupPrologue2(); const g = ROSTER.find(r => r.name === 'Greg'); if (!g) return;
  const n = addNPC({ hero: null, look: Object.assign({}, g, { name: 'Greg', role: 'Number Scientist' }), x: 760, y: 440, facing: -1, lines: [] });
  n.onTalk = (q) => { story.gregJoke = (story.gregJoke || 0) + 1; const L = ['Greg: "Oh — hey. Don\'t mind me. I\'ve always worked here."', 'Greg: "Feed store, warehouse, whatever it is this year. Same company. I do the numbers."', 'Greg: "Thirty-some years. Give or take eighty-eight."', 'Greg: "Tell the boss the oats are counted. Forty sacks. Well, thirty-nine now."']; say(q, L[(story.gregJoke - 1) % L.length]); };
  n.bubble = 'Don\'t mind me.'; n.bubbleT = 5;
  // the Founder notices him, once
  const f = npcs.find(z => z.look && z.look.name === 'The Founder'); if (f && f.lines) f.lines.push('"That fellow by the porch says he works here. I never hired him. The oats are counted, though."');
};
WORLD_DEFS.prologue.setup = setupPrologue;
// demo: he's there in the 1938 scenes too, quietly
(function () { for (const s of DEMO_SCRIPT) if (s.setup2 && /gregGhost/.test(String(s.setup2))) s.setup2 = () => { }; })();
