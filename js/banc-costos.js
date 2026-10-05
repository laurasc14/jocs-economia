/* Nivell 3 · Els números de la cooperativa (costos, benefici, punt mort, IVA) */
(function () {
  var f = CE.f, eur = CE.eur, r2 = CE.r2;

  CE.BANC.push({
    id: 'N3', num: 3, titol: 'Els números de la cooperativa', tema: 'Costos, benefici i punt mort',
    teoria: 'estudi.html#t3',
    missions: [

      { id: 'M1', titol: 'Fixos o variables?', sabers: 'Costos fixos i variables',
        recorda: '<b>Cost fix:</b> es paga igual encara que no fabriquis res (lloguer, assegurança, web). <b>Cost variable:</b> augmenta com més unitats fas (material, embalatge).',
        gen: function (r, ctx) {
          var p = CE.prod(r, ctx);
          var fixos = CE.shuffle(r, [['el lloguer de la parada', CE.int(r, 40, 90, 5)], ["l'assegurança", CE.int(r, 15, 40, 5)], ['la quota de la botiga web', CE.int(r, 10, 25, 5)], ['els cartells', CE.int(r, 15, 35, 5)]]).slice(0, 3);
          var vars = CE.shuffle(r, [['el material de cada ' + p.sg, 2], ["l'etiqueta de cada " + p.sg, 0.5], ["l'embalatge de cada " + p.sg, 0.3]]).slice(0, 2);
          var preg = CE.shuffle(r, fixos.slice(0, 2).map(function (x) { return [x, 0]; }).concat(vars.map(function (x) { return [x, 1]; })));
          var cf = fixos.reduce(function (a, x) { return a + x[1]; }, 0);
          var steps = preg.map(function (pr) {
            return { q: 'Classifica aquest cost: <b>' + pr[0][0] + '</b>.', type: 'choice', opts: ['Fix', 'Variable'], ans: pr[1],
              hint: pr[1] === 0 ? "Pregunta't: si aquest mes no fem cap " + p.sg + ", l'hem de pagar igualment?" : 'Pregunta\'t: si fem el doble de ' + p.pl + ', aquest cost també es duplica?',
              line: pr[0][0].charAt(0).toUpperCase() + pr[0][0].slice(1) + ' → cost ' + (pr[1] === 0 ? 'fix' : 'variable') };
          });
          steps.push({ q: 'Quin és el <b>total de costos fixos</b> del mes?', type: 'num', ans: cf, unit: '€',
            hint: 'Suma només els costos que no depenen de quantes unitats feu.',
            line: 'CF = ' + fixos.map(function (x) { return f(x[1]); }).join(' + ') + ' = ' + eur(cf) });
          return {
            intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> fa ' + p.pl + '. Aquests són alguns costos del mes: ' +
              fixos.map(function (x) { return x[0] + ' (' + eur(x[1]) + ' al mes)'; }).join(', ') + ', ' +
              vars.map(function (x) { return x[0] + ' (' + eur(x[1]) + ')'; }).join(' i ') + '.',
            steps: steps };
        } },

      { id: 'M2', titol: 'Quant costa produir?', sabers: 'Cost variable unitari i cost total',
        recorda: '<b>CVu</b> = el que costa fer una unitat. <b>Cost total = CF + CVu × quantitat.</b>',
        gen: function (r, ctx) {
          var p = CE.prod(r, ctx);
          var a = CE.pick(r, [1, 1.5, 2, 2.5, 3]), b = CE.pick(r, [0.2, 0.3, 0.5]), c = CE.pick(r, [0.5, 1]);
          var cvu = r2(a + b + c), cf = CE.int(r, 60, 250, 10), q = CE.int(r, 20, 120, 5);
          var cv = r2(cvu * q), ct = r2(cf + cv);
          return {
            intro: 'Per fer cada ' + p.sg + ', <b>' + CE.esc(ctx.coop) + '</b> gasta ' + eur(a) + ' de material principal, ' + eur(b) + " d'etiqueta i " + eur(c) +
              ' d\'embalatge. Els costos fixos del mes són de ' + eur(cf) + ' i aquest mes en volen fer <b>' + q + '</b>.',
            steps: [
              { q: 'Quin és el <b>cost variable unitari</b> (CVu)?', type: 'num', ans: cvu, unit: '€', hint: 'Suma tot el que costa fer una sola unitat.', line: 'CVu = ' + f(a) + ' + ' + f(b) + ' + ' + f(c) + ' = ' + eur(cvu) },
              { q: 'Quant sumen els <b>costos variables</b> de les ' + q + ' unitats?', type: 'num', ans: cv, unit: '€', hint: 'Multiplica el CVu per la quantitat.', line: 'CV = ' + f(cvu) + ' × ' + q + ' = ' + eur(cv) },
              { q: 'Quin és el <b>cost total</b> del mes?', type: 'num', ans: ct, unit: '€', hint: 'Cost total = costos fixos + costos variables.', line: 'CT = ' + f(cf) + ' + ' + f(cv) + ' = ' + eur(ct) }
            ] };
        } },

      { id: 'M3', titol: 'Guanyem o perdem?', sabers: 'Ingressos i benefici',
        recorda: '<b>Ingressos = preu × quantitat venuda.</b> <b>Benefici = ingressos − cost total.</b> Si surt negatiu, són pèrdues.',
        gen: function (r, ctx) {
          var p = CE.prod(r, ctx);
          var cvu = CE.pick(r, [1.5, 2, 2.5, 3, 4]), pr = r2(cvu + CE.pick(r, [1.5, 2, 3, 4])), cf = CE.int(r, 80, 300, 10), q = CE.int(r, 15, 90, 5);
          var I = r2(pr * q), ct = r2(cf + cvu * q), B = r2(I - ct);
          return {
            intro: '<b>' + CE.esc(ctx.coop) + '</b> ha venut <b>' + q + ' ' + p.pl + '</b> a ' + eur(pr) + ' cada un. Els costos fixos són de ' + eur(cf) + ' i el cost variable unitari, de ' + eur(cvu) + '.',
            steps: [
              { q: 'Quins són els <b>ingressos</b>?', type: 'num', ans: I, unit: '€', hint: 'Preu × quantitat venuda.', line: 'I = ' + f(pr) + ' × ' + q + ' = ' + eur(I) },
              { q: 'Quin és el <b>cost total</b>?', type: 'num', ans: ct, unit: '€', hint: 'CF + CVu × quantitat.', line: 'CT = ' + f(cf) + ' + ' + f(cvu) + ' × ' + q + ' = ' + eur(ct) },
              { q: 'Quin és el <b>resultat</b>? Si són pèrdues, escriu-lo amb signe menys.', type: 'num', ans: B, unit: '€', hint: 'Ingressos − cost total.', line: 'B = ' + f(I) + ' − ' + f(ct) + ' = ' + eur(B) },
              { q: 'Llavors, la cooperativa té…', type: 'choice', opts: ['Benefici', 'Pèrdues'], ans: B >= 0 ? 0 : 1, hint: 'Mira el signe del resultat.', line: B >= 0 ? 'Resultat positiu: benefici' : 'Resultat negatiu: pèrdues' }
            ] };
        } },

      { id: 'M4', titol: 'El punt mort', sabers: 'Marge unitari i punt mort',
        recorda: '<b>Marge unitari = preu − CVu.</b> <b>Punt mort = CF ÷ marge unitari.</b> Per sota, pèrdues; per sobre, benefici.',
        gen: function (r, ctx) {
          var p = CE.prod(r, ctx);
          var m = CE.pick(r, [2, 2.5, 3, 4, 5, 6]), pm = CE.int(r, 12, 60, 2), cf = r2(m * pm), cvu = CE.pick(r, [1, 1.5, 2, 3]), pr = r2(cvu + m);
          var test = r() < 0.5 ? pm - CE.int(r, 2, 8) : pm + CE.int(r, 2, 8);
          return {
            intro: '<b>' + CE.esc(ctx.coop) + '</b> ven ' + p.pl + ' a ' + eur(pr) + '. Cada ' + p.sg + ' costa ' + eur(cvu) + ' de fer i els costos fixos són de ' + eur(cf) + '.',
            steps: [
              { q: 'Quin és el <b>marge unitari</b>?', type: 'num', ans: m, unit: '€', hint: 'Preu − cost variable unitari.', line: 'Marge = ' + f(pr) + ' − ' + f(cvu) + ' = ' + eur(m) },
              { q: 'Quin és el <b>punt mort</b>?', type: 'num', ans: pm, unit: 'u.', hint: 'Divideix els costos fixos entre el marge unitari.', line: 'PM = ' + f(cf) + ' ÷ ' + f(m) + ' = ' + pm + ' unitats' },
              { q: 'Si en venen <b>' + test + '</b>, què passa?', type: 'choice', opts: ['Tenen benefici', 'Tenen pèrdues'], ans: test > pm ? 0 : 1, hint: 'Compara ' + test + ' amb el punt mort.', line: test + (test > pm ? ' > ' : ' < ') + pm + ' → ' + (test > pm ? 'benefici' : 'pèrdues') }
            ] };
        } },

      { id: 'M5', titol: "No oblidis l'IVA", sabers: "Tipus d'IVA, quota i preu final",
        recorda: "IVA general <b>21 %</b>, reduït <b>10 %</b> (hostaleria, transport), superreduït <b>4 %</b> (pa, llet, llibres). <b>Preu final = preu × (1 + tipus).</b>",
        gen: function (r, ctx) {
          var it = CE.pick(r, [['una motxilla', 21], ['uns auriculars', 21], ['una samarreta', 21], ['un sopar de restaurant', 10], ['un bitllet de tren', 10], ['una barra de pa', 4], ['un llibre', 4]]);
          var base = it[1] === 4 ? CE.int(r, 2, 25) : CE.int(r, 10, 120, 5);
          var quota = r2(base * it[1] / 100), fin = r2(base + quota);
          return {
            intro: 'Un proveïdor de la cooperativa <b>' + CE.esc(ctx.coop) + '</b> ven <b>' + it[0] + '</b> a ' + eur(base) + ' sense IVA.',
            steps: [
              { q: "Quin tipus d'IVA s'hi aplica?", type: 'choice', opts: ['21 %', '10 %', '4 %'], ans: [21, 10, 4].indexOf(it[1]), hint: 'Els productes bàsics porten el 4 %; hostaleria i transport, el 10 %; la resta, el 21 %.', line: 'IVA de ' + it[0] + ': ' + it[1] + ' %' },
              { q: "Quants euros d'IVA es paguen (la <b>quota</b>)?", type: 'num', ans: quota, unit: '€', hint: 'Preu sense IVA × tipus ÷ 100.', line: 'Quota = ' + f(base) + ' × ' + it[1] + ' % = ' + eur(quota) },
              { q: 'Quin és el <b>preu final</b>?', type: 'num', ans: fin, unit: '€', hint: 'Preu sense IVA + quota.', line: 'Preu final = ' + f(base) + ' + ' + f(quota) + ' = ' + eur(fin) }
            ] };
        } },

      { id: 'M6', titol: "Caça l'error", sabers: 'Errors típics amb costos i punt mort',
        recorda: 'Errors habituals: oblidar els costos fixos en el cost total o restar en lloc de dividir al punt mort.',
        gen: function (r, ctx) {
          var cf = CE.int(r, 100, 300, 20), cvu = CE.pick(r, [2, 3, 4]), pr = cvu + CE.pick(r, [2, 4, 5]), q = CE.int(r, 20, 60, 5);
          var m = pr - cvu, ctOk = cf + cvu * q, I = pr * q;
          var tipus = CE.int(r, 0, 1), lines, wrong, ok, what;
          if (tipus === 0) {
            lines = ['Ingressos = ' + f(pr) + ' × ' + q + ' = ' + eur(I), 'Cost total = ' + f(cvu) + ' × ' + q + ' = ' + eur(cvu * q), 'Benefici = ' + f(I) + ' − ' + f(cvu * q) + ' = ' + eur(I - cvu * q)];
            wrong = 1; ok = I - ctOk; what = 'el <b>benefici correcte</b>';
          } else if (tipus === 1) {
            lines = ['Marge unitari = ' + f(pr) + ' − ' + f(cvu) + ' = ' + eur(m), 'Punt mort = ' + f(cf) + ' − ' + f(m) + ' = ' + f(cf - m) + ' unitats', 'Cal vendre ' + f(cf - m) + ' unitats per no perdre diners'];
            wrong = 1; ok = r2(cf / m); what = 'el <b>punt mort correcte</b> (en unitats)';
          } else {
            var base = pr * 10;
            lines = ['Preu sense IVA = ' + eur(base), 'IVA = 21 %', 'Preu final = ' + f(base) + ' + 21 = ' + eur(base + 21)];
            wrong = 2; ok = r2(base * 1.21); what = 'el <b>preu final correcte</b>';
          }
          return {
            intro: 'Un soci de la cooperativa <b>' + CE.esc(ctx.coop) + '</b> ha fet aquests càlculs' + (tipus === 0 ? ' (costos fixos: ' + eur(cf) + ')' : tipus === 1 ? ' (costos fixos: ' + eur(cf) + ')' : '') + ', però s\'ha equivocat en una línia:' +
              '<ol class="bugs">' + lines.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ol>',
            steps: [
              { q: 'Quina línia té l\'error?', type: 'choice', opts: ['Línia 1', 'Línia 2', 'Línia 3'], ans: wrong, hint: 'Comprova cada línia amb la fórmula que toca.', line: 'L\'error és a la línia ' + (wrong + 1) },
              { q: 'Calcula ' + what + '.', type: 'num', ans: ok, unit: tipus === 1 ? 'u.' : '€', hint: tipus === 0 ? 'El cost total ha d\'incloure els costos fixos.' : tipus === 1 ? 'El punt mort es calcula dividint, no restant.' : 'Multiplica el preu per 1,21.', line: 'Correcció: ' + (tipus === 1 ? f(ok) + ' unitats' : eur(ok)) }
            ] };
        } }
    ]
  });
})();
