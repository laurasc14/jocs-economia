/* Corbatera Coop Lab · motor de l'app */
(function () {
  // Nivells que ja s'han fet a classe: totes les seves fases queden obertes
  var ENTRENAMENT = [];

  // Pla del trimestre: els nivells que encara no estan fets surten com a «properament»
  var PLA = [
    { id: 'N1', num: 1, titol: 'El problema', tema: 'Fase 1 · U1', fita: 'Fita 1 · 13/10', aval: 1 },
    { id: 'N2', num: 2, titol: 'El mercat', tema: 'Fase 2 · U2', fita: 'Fita 2 · 10/11', aval: 1 },
    { id: 'N3', num: 3, titol: 'El pla', tema: 'Fase 3 · U3', fita: 'Dossier 27/11 · Pitch 01/12', aval: 1 },
    { id: 'N4', num: 4, titol: 'Quant costa viure pel teu compte?', tema: 'Necessitats, nòmina, pressupost i imprevistos', fita: 'Projecte · des del 15/12', aval: 2 }
  ];
  // 2a avaluació amagada fins que comenci (posa-ho a true el 15/12)
  var MOSTRA_AVAL2 = false;
  var MOSTRA_AVAL3 = false;
  var OBERTES = { 1: true, 2: MOSTRA_AVAL2, 3: MOSTRA_AVAL3 };
  var AVALS = {
    1: ['1a avaluació', 'SA «Res no es llença. De l\'illa de les flors a la nostra cooperativa» · Prova competencial: 04/12', ''],
    2: ['2a avaluació', 'Projecte «Quant costa viure pel teu compte?» · Pressupost mensual, nòmina i imprevist', "S'obrirà quan comenci la 2a avaluació, a partir del 15/12."],
    3: ['3a avaluació', '', "S'obrirà quan comenci la 3a avaluació."]
  };
  var avalSel = null;
  function avalPerDefecte() {
    var avui = new Date().toISOString().slice(0, 10);
    if (OBERTES[3] && avui >= '2027-03-22') return 3;
    if (OBERTES[2] && avui >= '2026-12-15') return 2;
    return 1;
  }
  var RUTES = [['A', 'Aliments'], ['B', 'Tèxtil'], ['C', 'Aparells']];
  var RANGS = [[0, 'Aspirant'], [150, 'Soci/a en prova'], [400, 'Soci/a'], [750, 'Tresorer/a'], [1100, 'Coordinador/a'], [1500, 'Presidència']];
  var EMOJIS = ['🐝', '🌱', '🧵', '🍪', '🕯️', '🎨', '🚲', '☀️', '📚', '🎧'];
  var COLORS = ['#0F766E', '#B45309', '#7C3AED', '#BE123C', '#1D4ED8', '#15803D'];
  var CLASSE = [
    ['repas-teoria.html', '🎯', 'Posa\'t a prova', 'Preguntes de comprovació, targetes i reptes per unitat', 1],
    ['exercicis-calcul.html', '✏️', 'Entrenament lliure', 'Cost d\'oportunitat, productivitat, enquesta, costos, punt mort i escenaris', 1],
    ['calculadora-cooperativa.html', '🧾', 'Calculadora de la cooperativa', 'Els números reals del vostre producte', 1],
    ['kit-pitch.html', '🎤', 'Kit del pitch', 'Temporitzador, guió i rúbrica', 1],
    ['mercat-del-pa.html', '🥖', 'El mercat del pa', 'Joc: oferta, demanda i preu', 1],
    ['escape-room-cooperativa.html', '🔐', 'La caixa de la cooperativa', 'Escape room per equips', 1],
    ['qui-vol-ser-ric-economia.html', '💰', 'Qui vol ser ric?', 'Repàs de la prova', 1],
    ['vida-en-daus.html', '🎲', 'La vida en daus', 'Nòmina, pressupost i imprevistos', 2]
  ];
  var KEY = 'coop-lab-v2';
  var DOCENT = /[?&]docent\b/.test(location.search);
  var app = document.getElementById('app');
  var S = { users: {}, cur: null };
  try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.users) S = s; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function me() { return S.users[S.cur] || null; }
  var esc = CE.esc;

  /* ---------- XP i rangs ---------- */
  function totalXP(u) { var t = 0; for (var k in u.best) t += u.best[k]; return t; }
  function rang(xp) { var r = RANGS[0], next = null; for (var i = 0; i < RANGS.length; i++) { if (xp >= RANGS[i][0]) { r = RANGS[i]; next = RANGS[i + 1] || null; } } return { nom: r[1], min: r[0], next: next }; }
  function nivell(id) { for (var i = 0; i < CE.NIVELLS.length; i++) if (CE.NIVELLS[i].id === id) return CE.NIVELLS[i]; return null; }
  function obert(id) { // el nivell és d'una avaluació oberta?
    if (DOCENT) return true;
    var p = PLA.filter(function (x) { return x.id === id; })[0];
    return !p || !!OBERTES[p.aval];
  }
  function maxXP(nv, mi) { // XP màxim d'una missió (10 per pas)
    var r = CE.rng('max'); return nv.missions[mi].gen(r, { coop: '' }).steps.length * 10;
  }
  function bossMax(nv) { return nv.missions.length * 10; }
  function done(u, key) { return u.best[key] !== undefined; }
  function unlocked(u, nv, mi) {
    if (DOCENT || ENTRENAMENT.indexOf(nv.id) >= 0 || mi === 0) return true;
    return done(u, nv.id + '-' + nv.missions[mi - 1].id);
  }
  function bossUnlocked(u, nv) {
    if (DOCENT) return true;
    return nv.missions.every(function (m) { return done(u, nv.id + '-' + m.id); });
  }
  function bossPassed(u, nv) { var b = u.best[nv.id + '-BOSS']; return b !== undefined && b >= Math.ceil(bossMax(nv) * 0.6); }

  function applyTheme(u) { document.documentElement.style.setProperty('--coop', u ? u.color : COLORS[0]); }

  /* ---------- Carnet de soci/a ---------- */
  function viewLogin() {
    applyTheme(null);
    var ids = Object.keys(S.users);
    app.innerHTML =
      '<header class="hero"><div class="brand">🐝 Corbatera Coop Lab</div><h1>Crea la teva cooperativa</h1>' +
      '<p>SA «Res no es llença» · Economia Bàsica 4t ESO · Corbatera Institut Escola</p></header>' +
      (ids.length ? '<section class="card"><h2>Ja tens carnet?</h2><div class="who">' + ids.map(function (id) {
        var u = S.users[id]; return '<button class="who-b" data-u="' + id + '" style="--c:' + u.color + '"><span class="em">' + u.emoji + '</span><span><b>' + esc(u.nom) + '</b><small>' + esc(u.coop) + '</small></span></button>';
      }).join('') + '</div></section>' : '') +
      '<section class="card"><h2>' + (ids.length ? 'Nou carnet de soci/a' : 'El teu carnet de soci/a') + '</h2>' +
      '<p class="note">Cada equip és una cooperativa. Escriu el nom de la teva i tria com serà el vostre logotip.</p>' +
      '<label class="fld">El teu nom<input id="fNom" maxlength="30" placeholder="El teu nom o «Alumne 3»" autocomplete="off"></label>' +
      '<label class="fld">Nom de la cooperativa<input id="fCoop" maxlength="40" placeholder="Com es diu el vostre equip?" autocomplete="off"></label>' +
      '<div class="fld">Ruta del projecte<div class="chips" id="fRuta">' + RUTES.map(function (x, i) { return '<button class="chip-r" data-r="' + x[0] + '" aria-pressed="' + (i === 0) + '">' + x[0] + ' · ' + x[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="fld">Logotip<div class="chips" id="fEm">' + EMOJIS.map(function (e, i) { return '<button class="chip-e" data-e="' + e + '" aria-pressed="' + (i === 0) + '">' + e + '</button>'; }).join('') + '</div></div>' +
      '<div class="fld">Color<div class="chips" id="fCol">' + COLORS.map(function (c, i) { return '<button class="chip-c" data-c="' + c + '" style="background:' + c + '" aria-pressed="' + (i === 0) + '" aria-label="Color ' + (i + 1) + '"></button>'; }).join('') + '</div></div>' +
      '<p class="note">Fes servir sempre el mateix nom: els teus exercicis i el teu progrés hi van lligats.</p>' +
      '<button class="main" id="fGo">Crea el meu carnet</button><p class="err" id="fErr"></p></section>';
    var em = EMOJIS[0], col = COLORS[0], ruta = 'A';
    app.querySelectorAll('.chip-r').forEach(function (b) { b.onclick = function () { ruta = b.dataset.r; app.querySelectorAll('.chip-r').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }; });
    app.querySelectorAll('[data-u]').forEach(function (b) { b.onclick = function () { S.cur = b.dataset.u; save(); viewMap(); }; });
    app.querySelectorAll('.chip-e').forEach(function (b) { b.onclick = function () { em = b.dataset.e; app.querySelectorAll('.chip-e').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }; });
    app.querySelectorAll('.chip-c').forEach(function (b) { b.onclick = function () { col = b.dataset.c; app.querySelectorAll('.chip-c').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); applyTheme({ color: col }); }; });
    document.getElementById('fGo').onclick = function () {
      var nom = document.getElementById('fNom').value.trim(), coop = document.getElementById('fCoop').value.trim();
      if (!nom || !coop) { document.getElementById('fErr').textContent = 'Escriu el teu nom i el de la cooperativa.'; return; }
      var id = (nom + '|' + coop).toLowerCase();
      if (!S.users[id]) S.users[id] = { nom: nom, coop: coop, ruta: ruta, emoji: em, color: col, best: {}, plays: {}, diari: [], creat: new Date().toISOString() };
      S.cur = id; save(); viewMap();
    };
  }

  /* ---------- Mapa ---------- */
  function viewMap() {
    var u = me(); if (!u) return viewLogin();
    applyTheme(u); location.hash = '';
    var xp = totalXP(u), rg = rang(xp);
    var pct = rg.next ? Math.round((xp - rg.min) / (rg.next[0] - rg.min) * 100) : 100;
    var h = '<header class="bar"><div class="brand">🐝 Corbatera Coop Lab</div><button class="ghost" id="out">Canvia de soci/a</button></header>' +
      '<section class="carnet"><div class="logo">' + u.emoji + '</div><div class="cinfo"><small>Cooperativa</small><h1>' + esc(u.coop) + '</h1>' +
      '<p>Soci/a: <b>' + esc(u.nom) + '</b>' + (u.ruta ? ' · Ruta ' + u.ruta + ' · ' + RUTES.filter(function (x) { return x[0] === u.ruta; })[0][1] : '') + ' · Rang: <b>' + rg.nom + '</b></p>' +
      '<div class="xpbar"><i style="width:' + pct + '%"></i></div><small>' + xp + ' XP' + (rg.next ? ' · ' + (rg.next[0] - xp) + ' XP per a ' + rg.next[1] : ' · Rang màxim!') + '</small></div></section>' +
      (DOCENT ? '<p class="docent">Mode docent: totes les missions obertes.</p>' : '');
    var sel = avalSel || avalPerDefecte();
    function classeHTML(av) {
      var l = CLASSE.filter(function (c) { return c[4] === av; });
      if (!l.length) return '';
      return '<section class="level"><div class="lhead"><span class="lnum">A classe</span><h2>Eines i jocs</h2></div><div class="missions">' +
        l.map(function (c) { return '<a class="mis link" href="' + c[0] + '"><span class="em2">' + c[1] + '</span><b>' + c[2] + '</b><small>' + c[3] + '</small></a>'; }).join('') + '</div></section>';
    }
    function levelHTML(p) {
      var nv = nivell(p.id), s = '';
      s += '<section class="level' + (nv ? '' : ' soon') + '"><div class="lhead"><span class="lnum">Nivell ' + p.num + '</span><h2>' + p.titol + '</h2><small>' + p.tema + '</small><span class="fita">🏁 ' + p.fita + '</span></div>';
      if (!nv) return s + '<p class="note">Properament.</p></section>';
      s += '<div class="missions">';
      nv.missions.forEach(function (m, i) {
        var key = nv.id + '-' + m.id, ok = unlocked(u, nv, i), b = u.best[key], mx = maxXP(nv, i);
        s += '<button class="mis' + (b !== undefined ? ' done' : '') + '" ' + (ok ? 'data-go="' + nv.id + ':' + i + '"' : 'disabled') + '>' +
          '<span class="tag">FASE ' + (i + 1) + '</span><b>' + m.titol + '</b><small>' + m.sabers + '</small>' +
          '<span class="st">' + (b !== undefined ? '⭐ ' + b + '/' + mx + ' XP' : ok ? 'Comença' : '🔒') + '</span></button>';
      });
      var bk = nv.id + '-BOSS', bb = u.best[bk], bOk = bossUnlocked(u, nv);
      s += '<button class="mis boss' + (bossPassed(u, nv) ? ' done' : '') + '" ' + (bOk ? 'data-go="' + nv.id + ':BOSS"' : 'disabled') + '>' +
        '<span class="tag">BOSS</span><b>Assemblea final</b><small>Un exercici de cada fase, sense pistes. Cal un 60 %.</small>' +
        '<span class="st">' + (bb !== undefined ? (bossPassed(u, nv) ? '🏆 ' : '') + bb + '/' + bossMax(nv) + ' XP' : bOk ? 'Desafia' : '🔒 Supera totes les fases') + '</span></button>';
      return s + '</div></section>';
    }
    h += '<nav class="tabs-aval" role="tablist" aria-label="Avaluacions">' + [1, 2, 3].map(function (av) {
      return '<button role="tab" class="tab-aval a' + av + '" data-aval="' + av + '" aria-selected="' + (sel === av) + '">' + AVALS[av][0] + (OBERTES[av] || DOCENT ? '' : ' 🔒') + '</button>';
    }).join('') + '</nav>';
    h += '<section class="panel a' + sel + '" role="tabpanel">';
    h += '<header class="aval"><h2>' + AVALS[sel][0] + '</h2>' + (AVALS[sel][1] ? '<p>' + AVALS[sel][1] + '</p>' : '') + '</header>';
    if (!OBERTES[sel] && !DOCENT) {
      h += '<p class="tancada">🔒 ' + AVALS[sel][2] + '</p>';
    } else {
      if (sel === 1) h += '<a class="study" href="estudi.html"><span>📚</span><div><b>Estudi</b><small>La teoria de les tres unitats: definicions, exemples resolts i errors típics</small></div></a>';
      if (sel === 2) h += '<a class="study" href="estudi-2.html"><span>📚</span><div><b>Estudi</b><small>La teoria del projecte: necessitats, nòmina, pressupost, estalvi i deute</small></div></a>';
      PLA.filter(function (p) { return p.aval === sel; }).forEach(function (p) { h += levelHTML(p); });
      h += classeHTML(sel);
    }
    h += '</section>';
    h += '<section class="level"><div class="lhead"><span class="lnum">Diari</span><h2>El meu diari de procés</h2><small>' + u.diari.length + ' missions registrades</small></div>' +
      '<p class="note">Descarrega l\'informe al final de cada sessió i penja\'l a Classroom. Si canvies d\'ordinador o s\'esborra el navegador, el progrés es perd.</p>' +
      '<div class="row"><button class="main" id="rep">Descarrega l\'informe</button></div></section>';
    if (DOCENT) h += '<section class="level"><div class="lhead"><span class="lnum">Professora</span><h2>Eines de seguiment</h2></div><div class="missions">' +
      '<a class="mis link" href="lliga-cooperativa.html"><span class="em2">🐝</span><b>Lliga de la cooperativa</b></a><a class="mis link" href="borsa-classe.html"><span class="em2">📈</span><b>Borsa de la classe</b></a></div></section>';
    h += '<footer class="foot">Corbatera Coop Lab · Economia Bàsica 4t ESO · Corbatera Institut Escola · Curs 2026–2027</footer>';
    app.innerHTML = h;
    document.getElementById('out').onclick = function () { S.cur = null; save(); viewLogin(); };
    document.getElementById('rep').onclick = report;
    app.querySelectorAll('[data-go]').forEach(function (b) { b.onclick = function () { var p = b.dataset.go.split(':'); start(p[0], p[1]); }; });
    app.querySelectorAll('[data-aval]').forEach(function (b) { b.onclick = function () { avalSel = +b.dataset.aval; var y = scrollY; viewMap(); scrollTo(0, y); }; });
  }

  /* ---------- Missió pas a pas ---------- */
  var R = null; // partida en curs
  function start(nid, which) {
    var u = me(), nv = nivell(nid), isBoss = which === 'BOSS';
    var key = nid + '-' + (isBoss ? 'BOSS' : nv.missions[+which].id);
    u.plays[key] = (u.plays[key] || 0) + 1; save();
    var seed = u.nom.toLowerCase() + '|' + key + '|' + u.plays[key];
    var ctx = { coop: u.coop, ruta: u.ruta };
    var items;
    if (isBoss) {
      items = nv.missions.map(function (m, i) { var g = m.gen(CE.rng(seed + '|' + i), ctx); return { titol: m.titol, intro: g.intro, steps: [g.steps[g.steps.length - 1]] }; });
    } else {
      var m = nv.missions[+which], g = m.gen(CE.rng(seed), ctx);
      items = [{ titol: m.titol, intro: g.intro, steps: g.steps }];
    }
    R = { nv: nv, mi: isBoss ? -1 : +which, boss: isBoss, key: key, items: items, ii: 0, si: 0, fails: 0, hint: false, shown: false, xp: 0, max: 0, log: [], wrong: [] };
    items.forEach(function (it) { R.max += it.steps.length * 10; });
    viewMission();
  }
  function stepNow() { return R.items[R.ii].steps[R.si]; }
  function viewMission() {
    var nv = R.nv, it = R.items[R.ii], m = R.boss ? null : nv.missions[R.mi];
    var head = '<header class="bar"><button class="ghost" id="back">← Mapa</button><div class="brand">' + (R.boss ? 'BOSS · Assemblea final' : 'Nivell ' + nv.num + ' · FASE ' + (R.mi + 1)) + '</div><span class="xpnow">' + R.xp + ' XP</span></header>';
    var h = head + '<section class="card mission"><h1>' + (R.boss ? 'Assemblea final del nivell ' + nv.num : esc(m.titol)) + '</h1>';
    if (R.boss) h += '<p class="note">Exercici ' + (R.ii + 1) + ' de ' + R.items.length + ' · ' + it.titol + ' · Sense pistes</p>';
    else h += '<details class="recorda"><summary>Recorda</summary><p>' + m.recorda + '</p><a href="' + nv.teoria + '">Teoria completa d\'aquest tema →</a></details>';
    h += '<div class="intro">' + it.intro + '</div><div class="proc" id="proc">' +
      it.steps.slice(0, R.si).map(function (s) { return '<div class="pl">✓ ' + s.line + '</div>'; }).join('') + '</div>';
    var s = stepNow();
    h += '<div class="step"><div class="q">' + s.q + '</div>';
    if (s.type === 'choice') h += '<div class="opts">' + s.opts.map(function (o, k) { return '<button class="opt" data-k="' + k + '">' + o + '</button>'; }).join('') + '</div>';
    else h += '<div class="ans"><input id="inp" inputmode="decimal" autocomplete="off" aria-label="Resposta"><span class="unit">' + (s.unit || '') + '</span><button class="main" id="chk">Comprova</button></div>';
    h += '<div class="fb" id="fb" aria-live="polite"></div><div class="row">' + (R.boss ? '' : '<button class="ghost" id="hint">Pista</button>') + '</div></div></section>';
    app.innerHTML = h;
    document.getElementById('back').onclick = function () { if (confirm('Si surts ara, aquesta partida no es guardarà. Vols tornar al mapa?')) viewMap(); };
    if (s.type === 'choice') app.querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { answer(+b.dataset.k, b); }; });
    else {
      var inp = document.getElementById('inp');
      document.getElementById('chk').onclick = function () { answer(CE.parse(inp.value)); };
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') answer(CE.parse(inp.value)); });
      setTimeout(function () { inp.focus(); }, 0);
    }
    var hb = document.getElementById('hint');
    if (hb) hb.onclick = function () { R.hint = true; hb.disabled = true; var fb = document.getElementById('fb'); fb.className = 'fb hint'; fb.innerHTML = '💡 ' + s.hint; };
  }
  function answer(v, btn) {
    var s = stepNow(), fb = document.getElementById('fb');
    if (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) { fb.className = 'fb no'; fb.textContent = 'Escriu un número.'; return; }
    var ok = s.type === 'choice' ? v === s.ans : Math.abs(v - s.ans) <= (s.tol || 0.011);
    if (ok) return stepDone(false);
    R.fails++; R.wrong.push(s.type === 'choice' ? s.opts[v] : CE.f(v));
    if (btn) { btn.classList.add('bad'); btn.disabled = true; }
    if (R.fails >= 3) {
      fb.className = 'fb no'; fb.innerHTML = 'Tres intents fallits. Mira la solució i continua.';
      var row = fb.nextElementSibling; row.innerHTML = '<button class="ghost" id="sol">Mostra la solució</button>';
      document.getElementById('sol').onclick = function () { stepDone(true); };
      app.querySelectorAll('.opt, #chk, #inp').forEach(function (x) { x.disabled = true; });
    } else {
      fb.className = 'fb no'; fb.textContent = R.fails === 1 ? 'No és correcte. Revisa el càlcul i torna-ho a provar.' : 'Encara no.' + (R.boss ? '' : ' Pots demanar una pista.');
      var inp = document.getElementById('inp'); if (inp) inp.select();
    }
  }
  function stepDone(shown) {
    var s = stepNow();
    var pts = shown ? 0 : Math.max(3, 10 - 3 * R.fails);
    if (R.hint && !shown) pts = Math.min(pts, 5);
    R.xp += pts;
    R.log.push({ q: s.q.replace(/<[^>]+>/g, ''), wrong: R.wrong.slice(), hint: R.hint, shown: shown, line: s.line, xp: pts });
    R.fails = 0; R.hint = false; R.wrong = [];
    R.si++;
    if (R.si >= R.items[R.ii].steps.length) { R.ii++; R.si = 0; }
    if (R.ii >= R.items.length) return finish();
    viewMission();
  }
  function finish() {
    var u = me(), prev = u.best[R.key], better = prev === undefined || R.xp > prev;
    if (better) u.best[R.key] = R.xp;
    u.diari.push({ d: new Date().toISOString(), key: R.key, titol: R.boss ? 'Nivell ' + R.nv.num + ' · Assemblea final (BOSS)' : 'Nivell ' + R.nv.num + ' · Fase ' + (R.mi + 1) + ': ' + R.nv.missions[R.mi].titol, xp: R.xp, max: R.max, passos: R.log });
    save();
    var passBoss = R.boss && R.xp >= Math.ceil(R.max * 0.6);
    var nextOk = !R.boss && R.mi + 1 < R.nv.missions.length;
    app.innerHTML = '<header class="bar"><div class="brand">🐝 Corbatera Coop Lab</div></header><section class="card result">' +
      '<div class="big">' + R.xp + ' / ' + R.max + ' XP</div>' +
      '<h1>' + (R.boss ? (passBoss ? '🏆 Assemblea superada!' : 'Encara no: cal un 60 %') : 'Missió completada!') + '</h1>' +
      '<p>' + (better && prev !== undefined ? 'Has millorat la teva millor partida (' + prev + ' XP).' : prev !== undefined ? 'La teva millor partida continua sent de ' + prev + ' XP.' : 'Ja la tens al diari de procés.') + '</p>' +
      '<div class="proc">' + R.log.map(function (l) { return '<div class="pl">' + (l.shown ? '👀 ' : l.wrong.length ? '✓ ' : '⭐ ') + l.line + ' <small>(' + l.xp + ' XP)</small></div>'; }).join('') + '</div>' +
      '<div class="row center"><button class="ghost" id="again">Torna-hi amb números nous</button>' + (nextOk ? '<button class="main" id="next">Fase següent</button>' : '') + '<button class="main" id="map">Mapa</button></div></section>';
    document.getElementById('again').onclick = function () { start(R.nv.id, R.boss ? 'BOSS' : String(R.mi)); };
    document.getElementById('map').onclick = viewMap;
    var nb = document.getElementById('next'); if (nb) nb.onclick = function () { start(R.nv.id, String(R.mi + 1)); };
  }

  /* ---------- Informe ---------- */
  function report() {
    var u = me(), xp = totalXP(u), rg = rang(xp);
    var rows = '';
    CE.NIVELLS.filter(function (nv) { return obert(nv.id); }).forEach(function (nv) {
      nv.missions.forEach(function (m, i) { var k = nv.id + '-' + m.id; rows += '<tr><td>Nivell ' + nv.num + ' · Fase ' + (i + 1) + ': ' + m.titol + '</td><td>' + (u.best[k] !== undefined ? u.best[k] + ' / ' + maxXP(nv, i) : '—') + '</td><td>' + (u.plays[k] || 0) + '</td></tr>'; });
      var bk = nv.id + '-BOSS'; rows += '<tr><td><b>Nivell ' + nv.num + ' · BOSS</b></td><td>' + (u.best[bk] !== undefined ? u.best[bk] + ' / ' + bossMax(nv) + (bossPassed(u, nv) ? ' ✔' : '') : '—') + '</td><td>' + (u.plays[bk] || 0) + '</td></tr>';
    });
    var steps = 0, first = 0, hints = 0, sols = 0;
    u.diari.forEach(function (d) { d.passos.forEach(function (p) { steps++; if (!p.wrong.length && !p.hint && !p.shown) first++; if (p.hint) hints++; if (p.shown) sols++; }); });
    var proc = u.diari.map(function (d) {
      return '<h3>' + esc(d.titol) + ' <small>' + new Date(d.d).toLocaleString('ca-ES') + ' · ' + d.xp + '/' + d.max + ' XP</small></h3><ol>' +
        d.passos.map(function (p) { return '<li><b>' + esc(p.q) + '</b><br>' + (p.wrong.length ? p.wrong.map(function (w) { return '<s>' + esc(w) + '</s>'; }).join(' ') + ' → ' : '') + p.line + (p.hint ? ' <i>(amb pista)</i>' : '') + (p.shown ? ' <i>(solució mostrada)</i>' : '') + '</li>'; }).join('') + '</ol>';
    }).join('');
    var html = '<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Informe · ' + esc(u.nom) + '</title>' +
      '<style>body{font:15px/1.5 system-ui,sans-serif;max-width:820px;margin:2rem auto;padding:0 1rem;color:#1b2a24}h1{margin:0}table{border-collapse:collapse;width:100%;margin:1rem 0}td,th{border:1px solid #ccd;padding:.35rem .5rem;text-align:left}s{color:#c0392b}h3{margin:1.4rem 0 .3rem}h3 small{font-weight:400;color:#667}.k{display:flex;gap:1.5rem;flex-wrap:wrap}.k div{background:#eef4f1;border-radius:8px;padding:.5rem .8rem}@media print{body{margin:0}}</style></head><body>' +
      '<h1>Informe de procés · Corbatera Coop Lab</h1><p><b>' + esc(u.nom) + '</b> · Cooperativa <b>' + esc(u.coop) + '</b> · ' + new Date().toLocaleDateString('ca-ES') + '</p>' +
      '<div class="k"><div>XP total: <b>' + xp + '</b></div><div>Rang: <b>' + rg.nom + '</b></div><div>Passos fets: <b>' + steps + '</b></div><div>A la primera: <b>' + first + '</b></div><div>Pistes: <b>' + hints + '</b></div><div>Solucions mostrades: <b>' + sols + '</b></div></div>' +
      '<table><tr><th>Missió</th><th>Millor XP</th><th>Partides</th></tr>' + rows + '</table><h2>Procés de cada exercici</h2>' + (proc || '<p>Encara no hi ha cap missió feta.</p>') +
      '<p style="color:#667;margin-top:2rem">Per desar-lo en PDF: obre aquest arxiu i fes Imprimeix → Desa com a PDF.</p></body></html>';
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = 'informe-economia-' + u.nom.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.html';
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- Inici ---------- */
  var m = location.hash.match(/jugar=(N\d)(M\d|BOSS)/);
  if (me() && m) {
    var nv = nivell(m[1]);
    if (nv && !obert(nv.id)) { viewMap(); alert('Aquesta avaluació encara no està oberta.'); }
    else if (nv) {
      var idx = m[2] === 'BOSS' ? 'BOSS' : String(nv.missions.findIndex(function (x) { return x.id === m[2]; }));
      var okk = idx === 'BOSS' ? bossUnlocked(me(), nv) : unlocked(me(), nv, +idx);
      if (okk && idx !== '-1') { start(nv.id, idx); } else { viewMap(); alert('Aquesta missió encara està bloquejada. Fes primer les fases anteriors.'); }
    } else viewMap();
  } else if (me()) viewMap(); else viewLogin();
})();
