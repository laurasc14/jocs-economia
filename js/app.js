/* Corbatera Eco Lab · motor de l'app */
(function () {
  // Nivells que ja s'han fet a classe: totes les seves fases queden obertes
  var ENTRENAMENT = [];

  // Pla del trimestre: els nivells que encara no estan fets surten com a «properament»
  var PLA = [
    { id: 'N1', num: 1, titol: 'El problema', tema: 'Fase 1 · U1', fita: 'Fita 1 · 13/10', aval: 1 },
    { id: 'N2', num: 2, titol: 'El mercat', tema: 'Fase 2 · U2', fita: 'Fita 2 · 10/11', aval: 1 },
    { id: 'N3', num: 3, titol: 'El pla', tema: 'Fase 3 · U3', fita: 'Dossier 27/11 · Pitch 01/12', aval: 1 },
    { id: 'N4', num: 4, titol: 'Quant costa viure pel teu compte?', tema: 'Necessitats, nòmina, pressupost i imprevistos', fita: 'Projecte · des del 8/01', aval: 2 }
  ];
  // 2a avaluació tancada fins que comenci el projecte (posa-ho a true el 8/01)
  var MOSTRA_AVAL2 = false;
  var MOSTRA_AVAL3 = false;
  var OBERTES = { 1: true, 2: MOSTRA_AVAL2, 3: MOSTRA_AVAL3 };
  var AVALS = {
    1: { nom: '1a avaluació', em: '🐝', titol: 'La cooperativa', sub: 'SA «Res no es llença. De l\'illa de les flors a la nostra cooperativa» · Prova competencial: 04/12', tancada: '' },
    2: { nom: '2a avaluació', em: '🏠', titol: 'Quant costa viure pel teu compte?', sub: 'Feina, nòmina, pressupost i imprevistos · Prova: 16/03', tancada: "S'obrirà quan comenci el projecte, el 8 de gener." },
    3: { nom: '3a avaluació', em: '🧭', titol: 'Properament', sub: '', tancada: "S'obrirà quan comenci la 3a avaluació." }
  };
  function avalDe(u) { return (u && u.aval) || 1; }
  var RUTES = [['A', 'Aliments'], ['B', 'Tèxtil'], ['C', 'Aparells']];
  var RANGS = {
    1: [[0, 'Aspirant'], [150, 'Soci/a en prova'], [400, 'Soci/a'], [750, 'Tresorer/a'], [1100, 'Coordinador/a'], [1500, 'Presidència']],
    2: [[0, 'Estudiant'], [150, 'En pràctiques'], [400, 'Contracte temporal'], [750, 'Contracte indefinit'], [1100, 'Independitzat/da'], [1500, 'Expert/a en finances']]
  };
  var FEINES = ['Dependent/a de supermercat', 'Cambrer/a', 'Auxiliar administratiu/va', 'Cuiner/a', 'Mecànic/a de vehicles', 'Tècnic/a en cures auxiliars d\'infermeria', 'Electricista', 'Tècnic/a informàtic/a'];
  var EMOJIS2 = ['🏠', '🔑', '🧑‍🍳', '🔧', '💡', '🛒', '💼', '🩺', '💻', '🚲'];
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
  function rang(xp, av) { var RG = RANGS[av || 1] || RANGS[1]; var r = RG[0], next = null; for (var i = 0; i < RG.length; i++) { if (xp >= RG[i][0]) { r = RG[i]; next = RG[i + 1] || null; } } return { nom: r[1], min: r[0], next: next }; }
  function nivell(id) { for (var i = 0; i < CE.NIVELLS.length; i++) if (CE.NIVELLS[i].id === id) return CE.NIVELLS[i]; return null; }
  function obert(id) { // el nivell és d'una avaluació oberta?
    if (DOCENT) return true;
    var p = PLA.filter(function (x) { return x.id === id; })[0];
    return !p || !!OBERTES[p.aval];
  }
  function bossNom(nv) { return avalNivell(nv.id) === 2 ? 'El primer mes pel teu compte' : 'Assemblea final'; }
  function avalNivell(id) { var p = PLA.filter(function (x) { return x.id === id; })[0]; return p ? p.aval : 1; }
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

  /* ---------- Inici: tria l'avaluació ---------- */
  function viewHome() {
    applyTheme(null); location.hash = '';
    app.innerHTML =
      '<header class="hero"><div class="brand">📊 Corbatera Eco Lab</div><h1>Economia Bàsica</h1>' +
      '<p>4t ESO · Corbatera Institut Escola · Curs 2026–2027</p></header>' +
      (DOCENT ? '<p class="docent">Mode docent: totes les avaluacions obertes.</p>' : '') +
      '<h2 class="tria">Tria l\'avaluació</h2><div class="avals">' + [1, 2, 3].map(function (av) {
        var A = AVALS[av], ok = OBERTES[av] || DOCENT;
        return '<button class="aval-card a' + av + '" data-av="' + av + '"' + (ok ? '' : ' disabled') + '>' +
          '<span class="em3">' + (ok ? A.em : '🔒') + '</span><small>' + A.nom + '</small><b>' + A.titol + '</b>' +
          '<span class="sub">' + (ok ? A.sub : A.tancada) + '</span></button>';
      }).join('') + '</div>' +
      '<footer class="foot">Corbatera Eco Lab · Economia Bàsica 4t ESO · Corbatera Institut Escola · Curs 2026–2027</footer>';
    app.querySelectorAll('[data-av]').forEach(function (b) { b.onclick = function () { viewLogin(+b.dataset.av); }; });
  }

  /* ---------- Carnet (1a: soci/a de la cooperativa · 2a: carta de vida) ---------- */
  function viewLogin(av) {
    applyTheme(null);
    var ids = Object.keys(S.users).filter(function (id) { return avalDe(S.users[id]) === av; });
    var A = AVALS[av], v2 = av === 2;
    var EM = v2 ? EMOJIS2 : EMOJIS;
    app.innerHTML =
      '<header class="bar"><button class="ghost" id="home">← Avaluacions</button><div class="brand">' + A.em + ' ' + A.nom + '</div></header>' +
      '<header class="hero a' + av + '"><div class="brand">' + A.nom + '</div><h1>' + (v2 ? 'Quant costa viure pel teu compte?' : 'Crea la teva cooperativa') + '</h1>' +
      '<p>' + (v2 ? 'Tens 23 anys i te\'n vas a viure pel teu compte. Comença amb la teva carta de vida.' : 'SA «Res no es llença» · Economia Bàsica 4t ESO · Corbatera Institut Escola') + '</p></header>' +
      (ids.length ? '<section class="card"><h2>Ja tens ' + (v2 ? 'carta de vida' : 'carnet') + '?</h2><div class="who">' + ids.map(function (id) {
        var u = S.users[id]; return '<button class="who-b" data-u="' + id + '" style="--c:' + u.color + '"><span class="em">' + u.emoji + '</span><span><b>' + esc(u.nom) + '</b><small>' + esc(v2 ? u.feina : u.coop) + '</small></span></button>';
      }).join('') + '</div></section>' : '') +
      '<section class="card"><h2>' + (v2 ? (ids.length ? 'Nova carta de vida' : 'La teva carta de vida') : (ids.length ? 'Nou carnet de soci/a' : 'El teu carnet de soci/a')) + '</h2>' +
      (v2 ? '<p class="note">Escriu el teu nom i tria la feina de la carta de vida que t\'ha tocat a classe.</p>' : '<p class="note">Cada equip és una cooperativa. Escriu el nom de la teva i tria com serà el vostre logotip.</p>') +
      '<label class="fld">El teu nom<input id="fNom" maxlength="30" placeholder="El teu nom o «Alumne 3»" autocomplete="off"></label>' +
      (v2 ? '<label class="fld">La feina de la teva carta de vida<select id="fFeina">' + FEINES.map(function (f) { return '<option>' + f + '</option>'; }).join('') + '<option>Encara no ho sé</option></select></label>'
        : '<label class="fld">Nom de la cooperativa<input id="fCoop" maxlength="40" placeholder="Com es diu el vostre equip?" autocomplete="off"></label>' +
          '<div class="fld">Ruta del projecte<div class="chips" id="fRuta">' + RUTES.map(function (x, i) { return '<button class="chip-r" data-r="' + x[0] + '" aria-pressed="' + (i === 0) + '">' + x[0] + ' · ' + x[1] + '</button>'; }).join('') + '</div></div>') +
      '<div class="fld">' + (v2 ? 'Icona' : 'Logotip') + '<div class="chips" id="fEm">' + EM.map(function (e, i) { return '<button class="chip-e" data-e="' + e + '" aria-pressed="' + (i === 0) + '">' + e + '</button>'; }).join('') + '</div></div>' +
      '<div class="fld">Color<div class="chips" id="fCol">' + COLORS.map(function (c, i) { return '<button class="chip-c" data-c="' + c + '" style="background:' + c + '" aria-pressed="' + (i === 0) + '" aria-label="Color ' + (i + 1) + '"></button>'; }).join('') + '</div></div>' +
      '<p class="note">Fes servir sempre el mateix nom: els teus exercicis i el teu progrés hi van lligats.</p>' +
      '<button class="main" id="fGo">' + (v2 ? 'Comença' : 'Crea el meu carnet') + '</button><p class="err" id="fErr"></p></section>';
    var em = EM[0], col = COLORS[0], ruta = 'A';
    document.getElementById('home').onclick = viewHome;
    app.querySelectorAll('.chip-r').forEach(function (b) { b.onclick = function () { ruta = b.dataset.r; app.querySelectorAll('.chip-r').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }; });
    app.querySelectorAll('[data-u]').forEach(function (b) { b.onclick = function () { S.cur = b.dataset.u; save(); viewMap(); }; });
    app.querySelectorAll('.chip-e').forEach(function (b) { b.onclick = function () { em = b.dataset.e; app.querySelectorAll('.chip-e').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }; });
    app.querySelectorAll('.chip-c').forEach(function (b) { b.onclick = function () { col = b.dataset.c; app.querySelectorAll('.chip-c').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); applyTheme({ color: col }); }; });
    document.getElementById('fGo').onclick = function () {
      var nom = document.getElementById('fNom').value.trim(), id, err = document.getElementById('fErr');
      if (v2) {
        var feina = document.getElementById('fFeina').value;
        if (!nom) { err.textContent = 'Escriu el teu nom.'; return; }
        id = (nom + '|vida').toLowerCase();
        if (!S.users[id]) S.users[id] = { aval: 2, nom: nom, feina: feina, emoji: em, color: col, best: {}, plays: {}, diari: [], creat: new Date().toISOString() };
      } else {
        var coop = document.getElementById('fCoop').value.trim();
        if (!nom || !coop) { err.textContent = 'Escriu el teu nom i el de la cooperativa.'; return; }
        id = (nom + '|' + coop).toLowerCase();
        if (!S.users[id]) S.users[id] = { aval: 1, nom: nom, coop: coop, ruta: ruta, emoji: em, color: col, best: {}, plays: {}, diari: [], creat: new Date().toISOString() };
      }
      S.cur = id; save(); viewMap();
    };
  }

  /* ---------- Mapa de l'avaluació ---------- */
  function viewMap() {
    var u = me(); if (!u) return viewHome();
    var av = avalDe(u), A = AVALS[av], v2 = av === 2;
    applyTheme(u); location.hash = '';
    var xp = totalXP(u), rg = rang(xp, av);
    var pct = rg.next ? Math.round((xp - rg.min) / (rg.next[0] - rg.min) * 100) : 100;
    var h = '<header class="bar"><button class="ghost" id="out">← Avaluacions</button><div class="brand">' + A.em + ' ' + A.nom + '</div></header>' +
      '<section class="carnet' + (v2 ? ' vida' : '') + '"><div class="logo">' + u.emoji + '</div><div class="cinfo"><small>' + (v2 ? 'Carta de vida' : 'Cooperativa') + '</small><h1>' + esc(v2 ? u.nom : u.coop) + '</h1>' +
      '<p>' + (v2 ? 'Feina: <b>' + esc(u.feina || '') + '</b>' : 'Soci/a: <b>' + esc(u.nom) + '</b>' + (u.ruta ? ' · Ruta ' + u.ruta + ' · ' + RUTES.filter(function (x) { return x[0] === u.ruta; })[0][1] : '')) + ' · Rang: <b>' + rg.nom + '</b></p>' +
      '<div class="xpbar"><i style="width:' + pct + '%"></i></div><small>' + xp + ' XP' + (rg.next ? ' · ' + (rg.next[0] - xp) + ' XP per a ' + rg.next[1] : ' · Rang màxim!') + '</small></div></section>' +
      (DOCENT ? '<p class="docent">Mode docent: totes les missions obertes.</p>' : '') +
      (v2 && (OBERTES[2] || DOCENT) ? vidaResum(u) : '');
    function classeHTML() {
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
        '<span class="tag">BOSS</span><b>' + bossNom(nv) + '</b><small>Un exercici de cada fase, sense pistes. Cal un 60 %.</small>' +
        '<span class="st">' + (bb !== undefined ? (bossPassed(u, nv) ? '🏆 ' : '') + bb + '/' + bossMax(nv) + ' XP' : bOk ? 'Desafia' : '🔒 Supera totes les fases') + '</span></button>';
      return s + '</div></section>';
    }
    h += '<section class="panel a' + av + '">';
    h += '<header class="aval"><h2>' + A.titol + '</h2>' + (A.sub ? '<p>' + A.sub + '</p>' : '') + '</header>';
    if (!OBERTES[av] && !DOCENT) {
      h += '<p class="tancada">🔒 ' + A.tancada + '</p>';
    } else {
      if (av === 1) h += '<a class="study" href="estudi.html"><span>📚</span><div><b>Estudi</b><small>La teoria de les tres unitats: definicions, exemples resolts i errors típics</small></div></a>';
      if (av === 2) h += '<a class="study" href="estudi-2.html"><span>📚</span><div><b>Estudi</b><small>La teoria de les 3 fases: els meus diners, la feina i la nòmina, viure pel meu compte</small></div></a>';
      PLA.filter(function (p) { return p.aval === av; }).forEach(function (p) { h += levelHTML(p); });
      h += classeHTML();
    }
    h += '</section>';
    h += '<section class="level"><div class="lhead"><span class="lnum">Diari</span><h2>El meu diari de procés</h2><small>' + u.diari.length + ' missions registrades</small></div>' +
      '<p class="note">Descarrega l\'informe al final de cada sessió i penja\'l a Classroom. Si canvies d\'ordinador o s\'esborra el navegador, el progrés es perd.</p>' +
      '<div class="row"><button class="main" id="rep">Descarrega l\'informe</button></div></section>';
    if (DOCENT) h += '<section class="level"><div class="lhead"><span class="lnum">Professora</span><h2>Eines de seguiment</h2></div><div class="missions">' +
      '<a class="mis link" href="lliga-cooperativa.html"><span class="em2">🐝</span><b>Lliga de la cooperativa</b></a><a class="mis link" href="borsa-classe.html"><span class="em2">📈</span><b>Borsa de la classe</b></a></div></section>';
    h += '<footer class="foot">Corbatera Eco Lab · Economia Bàsica 4t ESO · Corbatera Institut Escola · Curs 2026–2027</footer>';
    app.innerHTML = h;
    document.getElementById('out').onclick = function () { S.cur = null; save(); viewHome(); };
    document.getElementById('rep').onclick = report;
    var tb = document.getElementById('tauler'); if (tb) tb.onclick = viewTauler;
    app.querySelectorAll('[data-go]').forEach(function (b) { b.onclick = function () { var p = b.dataset.go.split(':'); start(p[0], p[1]); }; });
  }

  /* ---------- 2a avaluació · La meva vida en números ---------- */
  // Sou brut anual aproximat de cada carta de vida (el mateix que l'annex A del Quadern 1)
  var SOUS = { 'Dependent/a de supermercat': 17300, 'Cambrer/a': 18200, 'Auxiliar administratiu/va': 19500, 'Cuiner/a': 20500, 'Mecànic/a de vehicles': 21000, 'Tècnic/a en cures auxiliars d\'infermeria': 21500, 'Electricista': 22800, 'Tècnic/a informàtic/a': 25000 };
  var PARTIDES = [['hab', 'Habitatge (pis o habitació)', 'N'], ['subm', 'Llum, aigua i gas', 'N'], ['xarxa', 'Internet i mòbil', 'N'], ['menjar', 'Menjar', 'N'], ['transp', 'Transport', 'N'], ['oci', 'Oci', 'D'], ['roba', 'Roba i altres', 'D']];
  var IMPREV = [['El mòbil cau i la pantalla es trenca', -180], ['Visita al dentista: un empast', -120], ['Multa per aparcar malament', -90], ['S\'espatlla la rentadora (la teva part)', -130], ['Casament d\'una amiga: regal i roba', -150], ['Factura de la llum d\'hivern més alta', -60], ['Et roben la bicicleta', -250], ['Viatge urgent per veure la família', -140], ['Hisenda et torna diners de l\'IRPF', 200], ['Vens roba que no fas servir', 40], ['Hores extres a la feina', 120]];
  function irpfPct(b) { return b <= 18000 ? 4 : b <= 22000 ? 8 : b <= 26000 ? 11 : 14; }
  function vida(u) {
    if (!u.vida) u.vida = { brut: SOUS[u.feina] || 0, teo: {}, real: {}, imp: [] };
    return u.vida;
  }
  function calcVida(u) {
    var v = vida(u), r2 = CE.r2, c = { brut: +v.brut || 0 };
    c.mes = r2(c.brut / 14); c.ss = r2(c.mes * 0.065); c.ir = irpfPct(c.brut); c.irpf = r2(c.mes * c.ir / 100); c.net = r2(c.mes - c.ss - c.irpf);
    c.teT = 0; c.reT = 0; c.N = 0; c.D = 0; c.teN = 0; c.teD = 0; c.hab = 0; c.teHab = 0; c.nReal = 0;
    PARTIDES.forEach(function (p) {
      var t = +v.teo[p[0]] || 0, hasR = v.real[p[0]] !== undefined && v.real[p[0]] !== '', re = hasR ? +v.real[p[0]] || 0 : t;
      if (hasR) c.nReal++;
      c.teT += t; c.reT += re;
      if (p[2] === 'N') { c.N += re; c.teN += t; } else { c.D += re; c.teD += t; }
      if (p[0] === 'hab' || p[0] === 'subm') { c.hab += re; c.teHab += t; }
    });
    c.usaReal = c.nReal > 0;
    c.gasto = c.usaReal ? c.reT : c.teT;
    c.saldoTe = r2(c.net - c.teT); c.saldo = r2(c.net - c.gasto);
    c.imp = v.imp.reduce(function (a, x) { return a + x[1]; }, 0); c.despresImp = r2(c.saldo + c.imp);
    var pc = function (x) { return c.net ? Math.round(x / c.net * 1000) / 10 : 0; };
    c.pHab = pc(c.hab); c.pN = pc(c.N); c.pD = pc(c.D); c.pE = pc(Math.max(c.saldo, 0));
    c.fons = c.teN || c.N ? (c.usaReal ? c.N : c.teN) * 3 : 0; c.mesosFons = c.saldo > 0 && c.fons ? Math.ceil(c.fons / c.saldo) : null;
    return c;
  }
  var eurV = function (x) { return CE.eur(CE.r2(x)); };
  function estat(saldo) { return saldo >= 0 ? '<span class="st-ok">✅ Superàvit</span>' : '<span class="st-bad">⚠️ Dèficit</span>'; }
  function vidaResum(u) {
    var c = calcVida(u), buit = !c.teT;
    return '<section class="vida-sum"><div class="lhead"><span class="lnum">La meva vida en números</span><small>' + (c.usaReal ? 'Amb els preus reals de la Fita 5' : 'Pressupost teòric') + '</small></div>' +
      '<div class="tiles"><div class="tile"><small>Tinc (sou net al mes)</small><b>' + eurV(c.net) + '</b></div>' +
      '<div class="tile"><small>Gasto</small><b>' + (buit ? '—' : eurV(c.gasto)) + '</b></div>' +
      '<div class="tile"><small>Em queda</small><b>' + (buit ? '—' : eurV(c.saldo)) + '</b>' + (buit ? '<span class="st-muted">Omple el pressupost</span>' : estat(c.saldo)) + '</div></div>' +
      '<div class="row"><button class="main" id="tauler">' + (buit ? 'Fes el meu pressupost' : 'Obre el meu tauler') + '</button></div></section>';
  }
  function meter(lbl, val, ref, sobre) { // sobre=true: passar la referència és dolent
    var w = Math.max(0, Math.min(val, 100)), dolent = sobre ? val > ref : val < ref;
    return '<div class="meter"><div class="mlab"><span>' + lbl + '</span><b>' + CE.f(val, val % 1 ? 1 : 0) + ' %</b></div>' +
      '<div class="mbar" role="img" aria-label="' + lbl + ': ' + CE.f(val, 1) + ' %, referència ' + ref + ' %"><i style="width:' + w + '%"></i><em style="left:' + ref + '%" title="Referència: ' + ref + ' %"></em></div>' +
      '<small class="mref">' + (dolent ? '⚠️ ' : '✔ ') + (sobre ? 'Recomanat: com a màxim ' : 'Recomanat: com a mínim ') + ref + ' %</small></div>';
  }
  function viewTauler() {
    var u = me(), v = vida(u); save();
    var h = '<header class="bar"><button class="ghost" id="back">← Mapa</button><div class="brand">🏠 La meva vida en números</div></header>' +
      '<section class="card"><h2>Els meus ingressos</h2><p class="note">Carta de vida: <b>' + esc(u.feina || '') + '</b>. Si a la Fita 4 has trobat una oferta real amb un altre sou, canvia\'l aquí.</p>' +
      '<label class="fld">Sou brut anual (14 pagues)<input id="vBrut" inputmode="decimal" value="' + (v.brut || '') + '"></label>' +
      '<div class="nom" id="vNom"></div></section>' +
      '<section class="card"><h2>El meu pressupost del mes</h2><p class="note">Primer posa el que creus que gastaràs (Quadern 3, V12.9). Després de la Fita 5, afegeix els preus reals de la classe i mira la diferència.</p>' +
      '<div class="vtwrap"><table class="vtable"><thead><tr><th>Partida</th><th>Tipus</th><th>El que em pensava</th><th>Real (Fita 5)</th><th>Diferència</th></tr></thead><tbody>' +
      PARTIDES.map(function (p) {
        return '<tr><td>' + p[1] + '</td><td>' + (p[2] === 'N' ? 'Necessitat' : 'Desig') + '</td>' +
          '<td><input data-t="teo" data-k="' + p[0] + '" inputmode="decimal" value="' + (v.teo[p[0]] !== undefined ? v.teo[p[0]] : '') + '" aria-label="' + p[1] + ', el que em pensava"></td>' +
          '<td><input data-t="real" data-k="' + p[0] + '" inputmode="decimal" value="' + (v.real[p[0]] !== undefined ? v.real[p[0]] : '') + '" aria-label="' + p[1] + ', preu real"></td>' +
          '<td class="dif" id="d_' + p[0] + '"></td></tr>';
      }).join('') + '</tbody><tfoot><tr><th>Total</th><th></th><th id="tTe"></th><th id="tRe"></th><th id="tDi"></th></tr></tfoot></table></div></section>' +
      '<section class="card"><h2>Com quedo?</h2><div class="tiles" id="vTiles"></div><div class="meters" id="vMeters"></div></section>' +
      '<section class="card"><h2>Imprevistos</h2><p class="note">Afegeix els imprevistos de La vida en daus o els que et passin. Són despeses d\'un sol cop: es resten del que et queda aquest mes.</p>' +
      '<div class="chips imp">' + IMPREV.map(function (x, i) { return '<button class="chip-i" data-i="' + i + '">' + (x[1] > 0 ? '+' : '−') + CE.f(Math.abs(x[1])) + ' € · ' + x[0] + '</button>'; }).join('') + '</div>' +
      '<div class="row"><input id="iT" placeholder="Un altre imprevist" aria-label="Descripció de l\'imprevist"><input id="iA" inputmode="decimal" placeholder="Import (−120)" aria-label="Import"><button class="ghost" id="iAdd">Afegeix</button></div>' +
      '<ul class="implist" id="iList"></ul><div class="tiles" id="iTiles"></div></section>';
    app.innerHTML = h;
    function num(x) { var n = CE.parse(x); return n === null ? '' : n; }
    function paint() {
      var c = calcVida(u);
      document.getElementById('vNom').innerHTML = c.brut ? 'Brut mensual: ' + CE.f(c.brut) + ' ÷ 14 = <b>' + eurV(c.mes) + '</b> · Seguretat Social (6,5 %): ' + eurV(c.ss) + ' · IRPF (' + c.ir + ' %): ' + eurV(c.irpf) + ' · <b>Net: ' + eurV(c.net) + '</b>' : 'Escriu el teu sou brut anual.';
      PARTIDES.forEach(function (p) {
        var t = v.teo[p[0]], r = v.real[p[0]], el = document.getElementById('d_' + p[0]);
        el.textContent = (t !== undefined && t !== '' && r !== undefined && r !== '') ? ((r - t) > 0 ? '+' : '') + eurV(r - t) : '';
      });
      document.getElementById('tTe').textContent = eurV(c.teT);
      document.getElementById('tRe').textContent = c.usaReal ? eurV(c.reT) : '—';
      document.getElementById('tDi').textContent = c.usaReal ? ((c.reT - c.teT) > 0 ? '+' : '') + eurV(c.reT - c.teT) : '';
      document.getElementById('vTiles').innerHTML =
        '<div class="tile"><small>Tinc (sou net)</small><b>' + eurV(c.net) + '</b></div>' +
        '<div class="tile"><small>Gasto ' + (c.usaReal ? '(real)' : '(el que em pensava)') + '</small><b>' + eurV(c.gasto) + '</b></div>' +
        '<div class="tile"><small>Em queda</small><b>' + eurV(c.saldo) + '</b>' + estat(c.saldo) + '</div>' +
        (c.usaReal ? '<div class="tile"><small>Em pensava que em quedaria</small><b>' + eurV(c.saldoTe) + '</b></div>' : '');
      document.getElementById('vMeters').innerHTML = c.net ? meter('Habitatge (lloguer i subministraments)', c.pHab, 35, true) + meter('Necessitats', c.pN, 50, true) + meter('Desitjos', c.pD, 30, true) + meter('Estalvi', c.pE, 20, false) : '';
      document.getElementById('iList').innerHTML = v.imp.map(function (x, i) { return '<li><span>' + esc(x[0]) + '</span><b>' + (x[1] > 0 ? '+' : '') + eurV(x[1]) + '</b><button class="ghost del" data-del="' + i + '" aria-label="Treu">✕</button></li>'; }).join('');
      document.getElementById('iTiles').innerHTML = (v.imp.length ? '<div class="tile"><small>Aquest mes, després dels imprevistos</small><b>' + eurV(c.despresImp) + '</b>' + estat(c.despresImp) + '</div>' : '') +
        '<div class="tile"><small>Fons d\'emergència (3 mesos de necessitats)</small><b>' + (c.fons ? eurV(c.fons) : '—') + '</b><span class="st-muted">' + (c.mesosFons ? 'Hi arribes en ' + c.mesosFons + ' mesos estalviant el que et queda' : c.fons ? 'Amb dèficit no pots estalviar: retalla abans' : 'Omple el pressupost') + '</span></div>';
      app.querySelectorAll('[data-del]').forEach(function (b) { b.onclick = function () { v.imp.splice(+b.dataset.del, 1); save(); paint(); }; });
    }
    document.getElementById('back').onclick = viewMap;
    document.getElementById('vBrut').oninput = function (e) { v.brut = num(e.target.value); save(); paint(); };
    app.querySelectorAll('.vtable input').forEach(function (inp) {
      inp.oninput = function () { var val = num(inp.value); if (val === '') delete v[inp.dataset.t][inp.dataset.k]; else v[inp.dataset.t][inp.dataset.k] = val; save(); paint(); };
    });
    app.querySelectorAll('[data-i]').forEach(function (b) { b.onclick = function () { v.imp.push(IMPREV[+b.dataset.i].slice()); save(); paint(); }; });
    document.getElementById('iAdd').onclick = function () {
      var t = document.getElementById('iT').value.trim(), a = num(document.getElementById('iA').value);
      if (!t || a === '') return; v.imp.push([t, a]); document.getElementById('iT').value = ''; document.getElementById('iA').value = ''; save(); paint();
    };
    paint(); scrollTo(0, 0);
  }
  function vidaInforme(u) {
    var c = calcVida(u), v = vida(u);
    return '<h2>La meva vida en números</h2><p>Feina: <b>' + esc(u.feina || '') + '</b> · Brut anual ' + eurV(c.brut) + ' · Net mensual <b>' + eurV(c.net) + '</b></p>' +
      '<table><tr><th>Partida</th><th>El que em pensava</th><th>Real (Fita 5)</th></tr>' + PARTIDES.map(function (p) { return '<tr><td>' + p[1] + '</td><td>' + (v.teo[p[0]] !== undefined ? eurV(v.teo[p[0]]) : '—') + '</td><td>' + (v.real[p[0]] !== undefined ? eurV(v.real[p[0]]) : '—') + '</td></tr>'; }).join('') +
      '<tr><th>Total</th><th>' + eurV(c.teT) + '</th><th>' + (c.usaReal ? eurV(c.reT) : '—') + '</th></tr></table>' +
      '<p>Em queda: <b>' + eurV(c.saldo) + '</b> (' + (c.saldo >= 0 ? 'superàvit' : 'dèficit') + ') · Habitatge ' + CE.f(c.pHab, 1) + ' % · Necessitats ' + CE.f(c.pN, 1) + ' % · Desitjos ' + CE.f(c.pD, 1) + ' % · Estalvi ' + CE.f(c.pE, 1) + ' %</p>' +
      (v.imp.length ? '<p>Imprevistos: ' + v.imp.map(function (x) { return esc(x[0]) + ' (' + eurV(x[1]) + ')'; }).join(' · ') + ' → després dels imprevistos: <b>' + eurV(c.despresImp) + '</b></p>' : '');
  }

  /* ---------- Missió pas a pas ---------- */
  var R = null; // partida en curs
  function start(nid, which) {
    var u = me(), nv = nivell(nid), isBoss = which === 'BOSS';
    var key = nid + '-' + (isBoss ? 'BOSS' : nv.missions[+which].id);
    u.plays[key] = (u.plays[key] || 0) + 1; save();
    var seed = u.nom.toLowerCase() + '|' + key + '|' + u.plays[key];
    var ctx = { coop: u.coop || '', ruta: u.ruta, nom: u.nom, feina: u.feina };
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
    var head = '<header class="bar"><button class="ghost" id="back">← Mapa</button><div class="brand">' + (R.boss ? 'BOSS · ' + bossNom(nv) : 'Nivell ' + nv.num + ' · FASE ' + (R.mi + 1)) + '</div><span class="xpnow">' + R.xp + ' XP</span></header>';
    var h = head + '<section class="card mission"><h1>' + (R.boss ? bossNom(nv) + ' · nivell ' + nv.num : esc(m.titol)) + '</h1>';
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
    u.diari.push({ d: new Date().toISOString(), key: R.key, titol: R.boss ? 'Nivell ' + R.nv.num + ' · ' + bossNom(R.nv) + ' (BOSS)' : 'Nivell ' + R.nv.num + ' · Fase ' + (R.mi + 1) + ': ' + R.nv.missions[R.mi].titol, xp: R.xp, max: R.max, passos: R.log });
    save();
    var passBoss = R.boss && R.xp >= Math.ceil(R.max * 0.6);
    var nextOk = !R.boss && R.mi + 1 < R.nv.missions.length;
    app.innerHTML = '<header class="bar"><div class="brand">📊 Corbatera Eco Lab</div></header><section class="card result">' +
      '<div class="big">' + R.xp + ' / ' + R.max + ' XP</div>' +
      '<h1>' + (R.boss ? (passBoss ? '🏆 ' + bossNom(R.nv) + ': superat!' : 'Encara no: cal un 60 %') : 'Missió completada!') + '</h1>' +
      '<p>' + (better && prev !== undefined ? 'Has millorat la teva millor partida (' + prev + ' XP).' : prev !== undefined ? 'La teva millor partida continua sent de ' + prev + ' XP.' : 'Ja la tens al diari de procés.') + '</p>' +
      '<div class="proc">' + R.log.map(function (l) { return '<div class="pl">' + (l.shown ? '👀 ' : l.wrong.length ? '✓ ' : '⭐ ') + l.line + ' <small>(' + l.xp + ' XP)</small></div>'; }).join('') + '</div>' +
      '<div class="row center"><button class="ghost" id="again">Torna-hi amb números nous</button>' + (nextOk ? '<button class="main" id="next">Fase següent</button>' : '') + '<button class="main" id="map">Mapa</button></div></section>';
    document.getElementById('again').onclick = function () { start(R.nv.id, R.boss ? 'BOSS' : String(R.mi)); };
    document.getElementById('map').onclick = viewMap;
    var nb = document.getElementById('next'); if (nb) nb.onclick = function () { start(R.nv.id, String(R.mi + 1)); };
  }

  /* ---------- Informe ---------- */
  function report() {
    var u = me(), av = avalDe(u), xp = totalXP(u), rg = rang(xp, av);
    var rows = '';
    CE.NIVELLS.filter(function (nv) { return obert(nv.id) && avalNivell(nv.id) === av; }).forEach(function (nv) {
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
      '<h1>Informe de procés · Corbatera Eco Lab</h1><p><b>' + esc(u.nom) + '</b> · ' + (av === 2 ? 'Carta de vida: <b>' + esc(u.feina || '') : 'Cooperativa <b>' + esc(u.coop)) + '</b> · ' + new Date().toLocaleDateString('ca-ES') + '</p>' +
      '<div class="k"><div>XP total: <b>' + xp + '</b></div><div>Rang: <b>' + rg.nom + '</b></div><div>Passos fets: <b>' + steps + '</b></div><div>A la primera: <b>' + first + '</b></div><div>Pistes: <b>' + hints + '</b></div><div>Solucions mostrades: <b>' + sols + '</b></div></div>' +
      '<table><tr><th>Missió</th><th>Millor XP</th><th>Partides</th></tr>' + rows + '</table>' + (av === 2 ? vidaInforme(u) : '') + '<h2>Procés de cada exercici</h2>' + (proc || '<p>Encara no hi ha cap missió feta.</p>') +
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
    if (nv && (!obert(nv.id) || avalNivell(nv.id) !== avalDe(me()))) { viewMap(); alert('Aquesta missió és d\'una altra avaluació. Torna a «Avaluacions» i entra-hi.'); }
    else if (nv) {
      var idx = m[2] === 'BOSS' ? 'BOSS' : String(nv.missions.findIndex(function (x) { return x.id === m[2]; }));
      var okk = idx === 'BOSS' ? bossUnlocked(me(), nv) : unlocked(me(), nv, +idx);
      if (okk && idx !== '-1') { start(nv.id, idx); } else { viewMap(); alert('Aquesta missió encara està bloquejada. Fes primer les fases anteriors.'); }
    } else viewMap();
  } else if (me()) viewMap(); else viewHome();
})();
