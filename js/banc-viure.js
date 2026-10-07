/* Missions de la 2a avaluació · Projecte «Quant costa viure pel teu compte?» (nòmina, pressupost i imprevistos) */
(function () {
  var f = CE.f, eur = CE.eur, r2 = CE.r2;
  var FEINES = ['dependent/a', 'cambrer/a', 'auxiliar administratiu/va', 'electricista', 'tècnic/a informàtic/a', 'cuiner/a', 'perruquer/a'];
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function de(x) { return x.indexOf('en ') === 0 ? 'd\'' + x : 'de ' + x; }
  function qui(r) { return CE.pick(r, ['la Júlia', 'en Pau', 'la Nora', 'l\'Omar', 'la Clara', 'en Biel', 'la Gisela', 'en Marc']); }

  CE.BANC.push({
    id: 'VIU',
    missions: [

      { id: 'NEC', titol: 'Necessitat o desig?', sabers: 'Necessitats i desitjos en el pressupost d\'una llar',
        recorda: 'Una <b>necessitat</b> és una despesa que no pots evitar per viure i treballar (habitatge, subministraments, menjar bàsic, transport per anar a la feina). Un <b>desig</b> és una despesa que fa la vida més agradable però que pots retallar (plataformes, sopars fora, roba de marca). Al pressupost, primer es cobreixen les necessitats.',
        gen: function (r, ctx) {
          var nec = [['el lloguer de l\'habitació', CE.int(r, 300, 450, 10)], ['la llum i l\'aigua', CE.int(r, 40, 80, 5)], ['la compra bàsica del supermercat', CE.int(r, 180, 260, 10)], ["l'abonament de transport per anar a la feina", CE.pick(r, [20, 25, 40])], ['la tarifa bàsica del mòbil', CE.pick(r, [10, 12, 15])]];
          var des = [['dues plataformes de sèries', CE.pick(r, [18, 22, 25])], ['els sopars fora amb amics', CE.int(r, 40, 100, 10)], ['unes bambes de marca', CE.int(r, 70, 120, 10)], ['les entrades d\'un festival', CE.int(r, 50, 90, 5)], ['un mòbil nou (el vell funciona)', CE.int(r, 250, 400, 50)]];
          var N = CE.shuffle(r, nec).slice(0, 3), D = CE.shuffle(r, des).slice(0, 2);
          var ask = CE.shuffle(r, [[N[0], 0], [N[1], 0], [D[0], 1], [D[1], 1]]).slice(0, 3);
          var opts = ['Necessitat', 'Desig'];
          var tn = N.reduce(function (a, x) { return a + x[1]; }, 0);
          var steps = ask.map(function (it) { return { q: 'Què és <b>' + it[0][0] + '</b>?', type: 'choice', opts: opts, ans: it[1], hint: 'Podria viure i anar a treballar sense aquesta despesa?', line: cap(it[0][0]) + ' → ' + opts[it[1]].toLowerCase() }; });
          steps.push({ q: 'Quant sumen les <b>necessitats</b> de la llista?', type: 'num', ans: tn, unit: '€', hint: 'Suma només les despeses que no pot evitar.', line: 'Necessitats = ' + N.map(function (x) { return f(x[1]); }).join(' + ') + ' = ' + eur(tn) });
          return { intro: cap(qui(r)) + ' té 23 anys i se\'n va a viure pel seu compte. Fa la llista de despeses del primer mes: ' + CE.shuffle(r, N.concat(D)).map(function (x) { return x[0] + ' (' + eur(x[1]) + ')'; }).join(', ') + '.', steps: steps };
        } },

      { id: 'NOM', titol: 'Llegeix la nòmina', sabers: 'Salari brut, deduccions i salari net',
        recorda: '<b>Salari net = salari brut − deduccions.</b> Deduccions: cotitzacions a la Seguretat Social (aprox. 6,5 %) i retenció d\'IRPF (depèn del sou).',
        gen: function (r, ctx) {
          var b = CE.int(r, 1200, 2400, 50), irpf = CE.pick(r, [6, 8, 10, 12, 14]);
          var ss = r2(b * 0.065), ir = r2(b * irpf / 100), ded = r2(ss + ir), net = r2(b - ded);
          return {
            intro: cap(qui(r)) + ' té 23 anys i treballa de ' + CE.pick(r, FEINES) + '. La seva nòmina diu: salari brut <b>' + eur(b) + '</b>, Seguretat Social <b>6,5 %</b> i retenció d\'IRPF <b>' + irpf + ' %</b>.',
            steps: [
              { q: 'Quants euros li descompten de <b>Seguretat Social</b>?', type: 'num', ans: ss, unit: '€', hint: 'Brut × 0,065.', line: 'SS = ' + f(b) + ' × 6,5 % = ' + eur(ss) },
              { q: 'Quants euros li retenen d\'<b>IRPF</b>?', type: 'num', ans: ir, unit: '€', hint: 'Brut × ' + irpf + ' ÷ 100.', line: 'IRPF = ' + f(b) + ' × ' + irpf + ' % = ' + eur(ir) },
              { q: 'Quant sumen les <b>deduccions</b>?', type: 'num', ans: ded, unit: '€', hint: 'Seguretat Social + IRPF.', line: 'Deduccions = ' + f(ss) + ' + ' + f(ir) + ' = ' + eur(ded) },
              { q: 'Quin és el <b>salari net</b>?', type: 'num', ans: net, unit: '€', hint: 'Brut − deduccions.', line: 'Net = ' + f(b) + ' − ' + f(ded) + ' = ' + eur(net) }
            ] };
        } },

      { id: 'PAR', titol: 'Les paraules de la nòmina', sabers: 'Conceptes de la nòmina',
        recorda: '<b>Brut:</b> abans de descomptes. <b>Net:</b> el que cobres. <b>Seguretat Social:</b> pensions, atur i baixes per malaltia. <b>IRPF:</b> avançament de l\'impost sobre la renda. També l\'empresa cotitza per cada treballador.',
        gen: function (r, ctx) {
          var pool = [
            ['Els diners que t\'arriben al compte bancari.', 2], ['El sou total abans de qualsevol descompte.', 1],
            ['Un avançament de l\'impost sobre la renda que es descompta cada mes.', 3], ['Diners per pagar pensions, atur i baixes per malaltia.', 0]
          ];
          var opts = ['Seguretat Social', 'Salari brut', 'Salari net', 'IRPF'];
          var steps = CE.shuffle(r, pool).slice(0, 3).map(function (it) { return { q: '«' + it[0] + '» Què és?', type: 'choice', opts: opts, ans: it[1], hint: 'Rellegeix el «Recorda».', line: '«' + it[0] + '» → ' + opts[it[1]].toLowerCase() }; });
          steps.push({ q: 'Qui cotitza a la Seguretat Social per un treballador?', type: 'choice', opts: ['Només el treballador', "Només l'empresa", "El treballador i l'empresa"], ans: 2, hint: 'Totes dues parts hi aporten.', line: "Cotitzen el treballador i l'empresa" });
          var b = CE.int(r, 14, 22) * 100, n = r2(b * CE.pick(r, [0.82, 0.835, 0.855]));
          steps.push({ q: 'Una nòmina té un brut de ' + eur(b) + ' i un net de ' + eur(n) + '. Quants euros s\'han descomptat?', type: 'num', ans: r2(b - n), unit: '€', hint: 'Brut − net.', line: 'Deduccions = ' + f(b) + ' − ' + f(n) + ' = ' + eur(r2(b - n)) });
          return { intro: 'Un company de pis ha trobat la nòmina de la seva germana i no entén res. Ajuda\'l.', steps: steps };
        } },

      { id: 'FIX', titol: 'Fixes o variables?', sabers: 'Despeses fixes i variables del pressupost',
        recorda: '<b>Despesa fixa:</b> igual cada mes (lloguer, quota del mòbil, assegurança). <b>Despesa variable:</b> canvia segons el que decideixes (oci, roba, menjar fora).',
        gen: function (r, ctx) {
          var fx = [['el lloguer', CE.int(r, 380, 750, 10)], ['la quota del mòbil', CE.pick(r, [12, 15, 20, 30])], ["l'abonament de transport", CE.pick(r, [20, 25, 40])], ["l'assegurança de la moto", CE.pick(r, [25, 30, 35])], ['la quota del gimnàs', CE.pick(r, [25, 30, 40])]];
          var vr = [['els sopars amb amics', CE.int(r, 40, 120, 10)], ['la roba', CE.int(r, 20, 90, 10)], ['les entrades de concerts', CE.int(r, 20, 80, 10)], ['els regals', CE.int(r, 15, 50, 5)]];
          var F = CE.shuffle(r, fx).slice(0, 3), V = CE.shuffle(r, vr).slice(0, 2);
          var ask = CE.shuffle(r, [[F[0], 0], [F[1], 0], [V[0], 1], [V[1], 1]]).slice(0, 3);
          var opts = ['Fixa', 'Variable'];
          var tf = F.reduce(function (a, x) { return a + x[1]; }, 0);
          var steps = ask.map(function (it) { return { q: 'Quin tipus de despesa és <b>' + it[0][0] + '</b>?', type: 'choice', opts: opts, ans: it[1], hint: 'És el mateix import cada mes o depèn del que decideixes?', line: it[0][0].charAt(0).toUpperCase() + it[0][0].slice(1) + ' → despesa ' + opts[it[1]].toLowerCase() }; });
          steps.push({ q: 'Quant sumen les <b>despeses fixes</b> del mes?', type: 'num', ans: tf, unit: '€', hint: 'Suma només les que són iguals cada mes.', line: 'Fixes = ' + F.map(function (x) { return f(x[1]); }).join(' + ') + ' = ' + eur(tf) });
          return { intro: 'Despeses d\'un mes ' + de(qui(r)) + ', 23 anys: ' + CE.shuffle(r, F.concat(V)).map(function (x) { return x[0] + ' (' + eur(x[1]) + ')'; }).join(', ') + '.', steps: steps };
        } },

      { id: 'PRE', titol: 'Quadra el pressupost', sabers: 'Saldo, superàvit, dèficit i pes de l\'habitatge',
        recorda: '<b>Saldo = ingressos − despeses.</b> Positiu: superàvit. Negatiu: dèficit. Es recomana que l\'habitatge (lloguer i subministraments) no passi del <b>30–35 %</b> del sou.',
        gen: function (r, ctx) {
          var net = CE.int(r, 1100, 1900, 50), llo = CE.int(r, 300, 750, 25), sub = CE.int(r, 40, 100, 5), men = CE.int(r, 200, 400, 10), tr = CE.pick(r, [0, 25, 40, 200]), oci = CE.int(r, 40, 250, 10);
          var tot = llo + sub + men + tr + oci, sal = net - tot, hab = llo + sub, pct = Math.round(hab / net * 100);
          return {
            intro: 'Pressupost mensual ' + de(qui(r)) + ', 23 anys. Cobra un salari net de <b>' + eur(net) + '</b>. Despeses: lloguer ' + eur(llo) + ', llum i aigua ' + eur(sub) + ', menjar ' + eur(men) + ', transport ' + eur(tr) + ' i oci ' + eur(oci) + '.',
            steps: [
              { q: 'Quant sumen les <b>despeses</b>?', type: 'num', ans: tot, unit: '€', hint: 'Suma totes les despeses.', line: 'Despeses = ' + [llo, sub, men, tr, oci].map(function (x) { return f(x); }).join(' + ') + ' = ' + eur(tot) },
              { q: 'Quin és el <b>saldo</b> del mes? Si és negatiu, posa el signe menys.', type: 'num', ans: sal, unit: '€', hint: 'Ingressos − despeses.', line: 'Saldo = ' + f(net) + ' − ' + f(tot) + ' = ' + eur(sal) },
              { q: 'Llavors, té…', type: 'choice', opts: ['Superàvit', 'Dèficit'], ans: sal >= 0 ? 0 : 1, hint: 'Mira el signe del saldo.', line: sal >= 0 ? 'Saldo positiu → superàvit' : 'Saldo negatiu → dèficit' },
              { q: 'Quin <b>percentatge del sou</b> se li va en habitatge (lloguer + llum i aigua)? Arrodoneix a les unitats.', type: 'num', ans: pct, tol: 0.6, unit: '%', hint: '(lloguer + llum i aigua) ÷ salari net × 100.', line: 'Habitatge = ' + f(hab) + ' ÷ ' + f(net) + ' × 100 ≈ ' + pct + ' %' },
              { q: 'Compleix la recomanació de no passar del 35 %?', type: 'choice', opts: ['Sí', 'No'], ans: pct <= 35 ? 0 : 1, hint: 'Compara el percentatge amb 35.', line: pct + ' % ' + (pct <= 35 ? '≤' : '>') + ' 35 % → ' + (pct <= 35 ? 'la compleix' : 'no la compleix') }
            ] };
        } },

      { id: 'REG', titol: 'La regla 50/30/20', sabers: 'Repartir el sou net: necessitats, desitjos i estalvi',
        recorda: 'Una manera senzilla de repartir el <b>sou net</b>: <b>50 %</b> per a necessitats, <b>30 %</b> per a desitjos i <b>20 %</b> per a l\'estalvi. És una guia, no una llei: si l\'habitatge és car, cal retallar dels desitjos, no de l\'estalvi.',
        gen: function (r, ctx) {
          var net = CE.int(r, 12, 20) * 100, n50 = r2(net * 0.5), d30 = r2(net * 0.3), e20 = r2(net * 0.2);
          var real = CE.int(r, Math.round(net * 0.42 / 10), Math.round(net * 0.62 / 10)) * 10;
          var dins = real <= n50, resta = net - real;
          return {
            intro: cap(qui(r)) + ' treballa de ' + CE.pick(r, FEINES) + ' i cobra un sou net de <b>' + eur(net) + '</b> al mes. Vol seguir la regla 50/30/20.',
            steps: [
              { q: 'Quant hauria de destinar com a màxim a <b>necessitats</b> (50 %)?', type: 'num', ans: n50, unit: '€', hint: 'Sou net × 0,5.', line: 'Necessitats: ' + f(net) + ' × 50 % = ' + eur(n50) },
              { q: 'I a <b>desitjos</b> (30 %)?', type: 'num', ans: d30, unit: '€', hint: 'Sou net × 0,3.', line: 'Desitjos: ' + f(net) + ' × 30 % = ' + eur(d30) },
              { q: 'Quant hauria d\'<b>estalviar</b> (20 %)?', type: 'num', ans: e20, unit: '€', hint: 'Sou net × 0,2. Comprova que les tres parts sumen el sou.', line: 'Estalvi: ' + f(net) + ' × 20 % = ' + eur(e20) },
              { q: 'Les seves necessitats reals sumen <b>' + eur(real) + '</b>. Compleix la regla?', type: 'choice', opts: ['Sí', 'No'], ans: dins ? 0 : 1, hint: 'Compara-ho amb el 50 % que has calculat.', line: f(real) + (dins ? ' ≤ ' : ' > ') + f(n50) + ' → ' + (dins ? 'la compleix' : 'no la compleix') },
              { q: 'Quants euros li queden per a desitjos i estalvi després de pagar les necessitats?', type: 'num', ans: resta, unit: '€', hint: 'Sou net − necessitats reals.', line: 'Queden ' + f(net) + ' − ' + f(real) + ' = ' + eur(resta) }
            ] };
        } },

      { id: 'IMP', titol: 'Imprevistos i deute', sabers: "Fons d'emergència, estalvi i interessos",
        recorda: "Un <b>fons d'emergència</b> evita haver d'endeutar-se. Si et deutes diners, pagues <b>interessos</b>: amb un 2 % mensual, cada mes el deute es multiplica per 1,02.",
        gen: function (r, ctx) {
          var s = CE.int(r, 40, 150, 10), C = CE.int(r, 200, 600, 25), mesos = Math.ceil(C / s);
          var D = CE.int(r, 2, 8) * 100, d1 = r2(D * 1.02), d2 = r2(d1 * 1.02);
          var cosa = CE.pick(r, ['el portàtil', 'el mòbil', 'la moto', 'la rentadora']);
          return {
            intro: cap(qui(r)) + ' estalvia <b>' + eur(s) + '</b> al mes. Vol tenir un fons d\'emergència de <b>' + eur(C) + '</b>, el que costaria arreglar ' + cosa + '.',
            steps: [
              { q: 'Quants mesos sencers ha d\'estalviar, com a mínim, per arribar-hi?', type: 'num', ans: mesos, unit: 'mesos', hint: 'Divideix i arrodoneix cap amunt: amb un mes de menys no hi arriba.', line: f(C) + ' ÷ ' + f(s) + ' = ' + f(C / s, 2) + ' → ' + mesos + ' mesos' },
              { q: 'Abans de tenir-lo, se li espatlla ' + cosa + ' i ho paga amb una targeta: deu <b>' + eur(D) + '</b> a un 2 % mensual. Quant deurà al cap d\'<b>un mes</b> si no torna res?', type: 'num', ans: d1, unit: '€', hint: 'Multiplica el deute per 1,02.', line: '1 mes: ' + f(D) + ' × 1,02 = ' + eur(d1) },
              { q: 'I al cap de <b>dos mesos</b>?', type: 'num', ans: d2, unit: '€', hint: 'Torna a multiplicar per 1,02 el resultat anterior.', line: '2 mesos: ' + f(d1) + ' × 1,02 = ' + eur(d2) },
              { q: 'Quants euros d\'interessos haurà pagat en aquests dos mesos?', type: 'num', ans: r2(d2 - D), unit: '€', hint: 'Deute final − deute inicial.', line: 'Interessos = ' + f(d2) + ' − ' + f(D) + ' = ' + eur(r2(d2 - D)) }
            ] };
        } },

      { id: 'TER', titol: 'Al comptat o a terminis?', sabers: 'Cost total d\'una compra a terminis',
        recorda: 'Pagar <b>al comptat</b> és pagar-ho tot d\'una vegada. Pagar <b>a terminis</b> és pagar quotes cada mes; sovint inclou interessos o comissions. <b>Cost total a terminis = quota × nombre de quotes.</b> El que pagues de més és el preu de no tenir els diners ara.',
        gen: function (r, ctx) {
          var cosa = CE.pick(r, [['un portàtil', 600, 900, 'lo'], ['una rentadora', 400, 650, 'la'], ['una bicicleta elèctrica', 900, 1400, 'la'], ['un sofà', 500, 800, 'lo']]);
          var P = CE.int(r, cosa[1], cosa[2], 50), n = CE.pick(r, [6, 10, 12]), extra = CE.pick(r, [0.08, 0.1, 0.12, 0.15]);
          var q = Math.ceil(P * (1 + extra) / n), tot = q * n, mes = tot - P, pct = Math.round(mes / P * 100);
          return {
            intro: cap(qui(r)) + ' vol comprar ' + cosa[0] + '. Al comptat costa <b>' + eur(P) + '</b>. La botiga també li ofereix pagar-' + cosa[3] + ' en <b>' + n + ' quotes de ' + eur(q) + '</b>.',
            steps: [
              { q: 'Quant pagarà en total si ho fa <b>a terminis</b>?', type: 'num', ans: tot, unit: '€', hint: 'Quota × nombre de quotes.', line: 'A terminis: ' + f(q) + ' × ' + n + ' = ' + eur(tot) },
              { q: 'Quants euros pagarà <b>de més</b> respecte al preu al comptat?', type: 'num', ans: mes, unit: '€', hint: 'Total a terminis − preu al comptat.', line: 'De més: ' + f(tot) + ' − ' + f(P) + ' = ' + eur(mes) },
              { q: 'Quin <b>percentatge</b> de més és, respecte al preu al comptat? Arrodoneix a les unitats.', type: 'num', ans: pct, tol: 0.6, unit: '%', hint: 'Diners de més ÷ preu al comptat × 100.', line: f(mes) + ' ÷ ' + f(P) + ' × 100 ≈ ' + pct + ' %' },
              { q: 'Si té els diners estalviats i no li calen per a cap imprevist, què li surt més a compte?', type: 'choice', opts: ['Pagar al comptat', 'Pagar a terminis', 'És igual'], ans: 0, hint: 'Amb quina opció paga menys?', line: 'Al comptat paga ' + eur(mes) + ' menys' }
            ] };
        } },

      { id: 'CAC', titol: "Caça l'error", sabers: 'Errors típics de la nòmina i el pressupost',
        recorda: 'Errors habituals: confondre brut i net, pensar que només cotitza el treballador, confondre necessitats i desitjos o creure que pagar a terminis o amb targeta surt gratis.',
        gen: function (r, ctx) {
          var bugs = [
            ['nom', 'El salari net és el que guanyes abans dels descomptes.', ['El salari net és el que cobres després dels descomptes.', 'El net i el brut són el mateix.', 'El net inclou la Seguretat Social.']],
            ['ss', 'A la Seguretat Social només hi cotitza el treballador.', ["Hi cotitzen el treballador i l'empresa.", "Només hi cotitza l'empresa.", "Hi cotitza l'Ajuntament."]],
            ['deu', 'Pagar un imprevist amb la targeta de crèdit no costa res de més.', ['El deute de la targeta es torna amb interessos.', 'La targeta sempre regala diners.', 'Els interessos només es paguen el primer mes.']],
            ['fix', 'El lloguer és una despesa variable perquè el pots canviar de pis.', ['És una despesa fixa: es paga igual cada mes.', 'No és cap despesa.', 'És un ingrés.']],
            ['sal', 'Si les despeses superen els ingressos, hi ha superàvit.', ['Si les despeses superen els ingressos, hi ha dèficit.', 'Hi ha equilibri.', 'Es pot estalviar més.']],
            ['nec', 'Canviar de mòbil cada any, quan el vell funciona, és una necessitat.', ['És un desig: es pot retallar sense deixar de viure i treballar.', 'És una necessitat primària.', 'És una despesa fixa obligatòria.']],
            ['ter', 'Pagar a terminis sempre surt més barat que pagar al comptat.', ['A terminis normalment pagues més, per interessos o comissions.', 'A terminis no es paga res.', 'Al comptat sempre és més car.']],
            ['reg', "Amb la regla 50/30/20, el 50 % del sou va a l'estalvi.", ["El 50 % va a necessitats; l'estalvi és el 20 %.", "El 50 % va a desitjos.", "L'estalvi és el 30 %."]]
          ];
          var ok = [['irpf', "L'IRPF és un avançament de l'impost sobre la renda."], ['deu', "Un fons d'emergència serveix per pagar imprevistos sense endeutar-se."], ['fix', "L'oci és una despesa variable."], ['pre', "Es recomana que l'habitatge no passi del 35 % del sou."], ['nom', "Del salari brut es descompten la Seguretat Social i l'IRPF."], ['nec', 'Al pressupost, primer es cobreixen les necessitats.'], ['reg', "Amb la regla 50/30/20, el 20 % del sou net va a l'estalvi."]];
          var b = CE.pick(r, bugs), oks = CE.shuffle(r, ok.filter(function (o) { return o[0] !== b[0]; })).slice(0, 2);
          var lines = CE.shuffle(r, [[b[1], true], [oks[0][1], false], [oks[1][1], false]]);
          var wrong = lines.findIndex(function (l) { return l[1]; });
          var corr = CE.shuffle(r, b[2].map(function (t, i) { return [t, i === 0]; }));
          return {
            intro: 'Un company de pis ha escrit aquests consells per viure pel teu compte, però un és fals:<ol class="bugs">' + lines.map(function (l) { return '<li>' + l[0] + '</li>'; }).join('') + '</ol>',
            steps: [
              { q: 'Quina frase és falsa?', type: 'choice', opts: ['Frase 1', 'Frase 2', 'Frase 3'], ans: wrong, hint: 'Rellegeix el «Recorda».', line: 'La frase falsa és la ' + (wrong + 1) },
              { q: "Com s'hauria de corregir?", type: 'choice', opts: corr.map(function (c) { return c[0]; }), ans: corr.findIndex(function (c) { return c[1]; }), hint: "Tria la frase certa que contradiu l'error.", line: 'Correcció: ' + b[2][0] }
            ] };
        } }
    ]
  });
})();
