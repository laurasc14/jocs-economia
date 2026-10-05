/* Nivell 4 · Sortim al mercat (oferta, demanda i preu) */
(function () {
  var f = CE.f, eur = CE.eur;

  // Mercat lineal amb equilibri en un preu enter: Qd = a − b·P, Qs = c + d·P
  function mercat(r) {
    var b = CE.int(r, 2, 6), d = CE.int(r, 2, 6), P = CE.int(r, 6, 12), Q = CE.int(r, 30, 70, 2);
    return { b: b, d: d, P: P, Q: Q, qd: function (p) { return Q + b * (P - p); }, qs: function (p) { return Q - d * (P - p); } };
  }
  function taula(m, preus, qdf) {
    qdf = qdf || m.qd;
    return '<table class="tbl"><tr><th>Preu</th>' + preus.map(function (p) { return '<td>' + eur(p) + '</td>'; }).join('') + '</tr>' +
      '<tr><th>Quantitat demandada</th>' + preus.map(function (p) { return '<td>' + qdf(p) + '</td>'; }).join('') + '</tr>' +
      '<tr><th>Quantitat oferta</th>' + preus.map(function (p) { return '<td>' + m.qs(p) + '</td>'; }).join('') + '</tr></table>';
  }
  function preus(m, k) { var a = []; for (var p = m.P - k; p <= m.P + k; p++) a.push(p); return a; }

  CE.BANC.push({
    id: 'N4', num: 4, titol: 'Sortim al mercat', tema: 'Oferta, demanda i preu',
    teoria: 'estudi.html#t4',
    missions: [

      { id: 'M1', titol: 'Les lleis del mercat', sabers: "Llei de la demanda i llei de l'oferta",
        recorda: "<b>Llei de la demanda:</b> si el preu puja, la quantitat demandada baixa. <b>Llei de l'oferta:</b> si el preu puja, la quantitat oferta augmenta.",
        gen: function (r, ctx) {
          var p = CE.prod(r, ctx), p0 = CE.int(r, 5, 10), up = r() < 0.5, p1 = up ? p0 + CE.int(r, 1, 3) : p0 - CE.int(r, 1, 3);
          var opts = ['Augmenta', 'Disminueix', 'No canvia'];
          var dem = up ? 1 : 0, ofe = up ? 0 : 1;
          var s2 = CE.pick(r, [['les entrades de cinema', 1], ['les maduixes', 1], ['els bitllets d\'avió', 1]]);
          var up2 = r() < 0.5;
          return {
            intro: 'Al mercat del dissabte, el preu de cada ' + p.sg + ' passa de ' + eur(p0) + ' a ' + eur(p1) + '. La cooperativa <b>' + CE.esc(ctx.coop) + '</b> i les altres parades hi estan atentes.',
            steps: [
              { q: 'Què passa amb la <b>quantitat que volen comprar</b> els clients?', type: 'choice', opts: opts, ans: dem, hint: 'Pensa com a client: si una cosa ' + (up ? "s'encareix" : "s'abarateix") + ', en compres més o menys?', line: 'Preu ' + (up ? 'puja' : 'baixa') + ' → quantitat demandada ' + opts[dem].toLowerCase() },
              { q: 'Què passa amb la <b>quantitat que volen vendre</b> les parades?', type: 'choice', opts: opts, ans: ofe, hint: 'Pensa com a venedor: si pots vendre més ' + (up ? 'car' : 'barat') + ', et surt més o menys a compte produir?', line: 'Preu ' + (up ? 'puja' : 'baixa') + ' → quantitat oferta ' + opts[ofe].toLowerCase() },
              { q: 'El preu de ' + s2[0] + ' ' + (up2 ? 'puja molt' : 'baixa molt') + '. Què fa la <b>quantitat demandada</b>?', type: 'choice', opts: opts, ans: up2 ? 1 : 0, hint: 'És la mateixa llei de la demanda.', line: cap(s2[0]) + ': preu ' + (up2 ? 'puja' : 'baixa') + ' → quantitat demandada ' + (up2 ? 'disminueix' : 'augmenta') },
              { q: 'Com és la corba de demanda en un gràfic preu-quantitat?', type: 'choice', opts: ['Baixa cap a la dreta', 'Puja cap a la dreta', 'És horitzontal'], ans: 0, hint: 'Com més alt és el preu, menys quantitat.', line: 'Demanda: pendent negatiu, baixa cap a la dreta' }
            ] };
        } },

      { id: 'M2', titol: 'Llegeix la taula', sabers: "Quantitat demandada, oferta i excessos",
        recorda: "Si al preu de mercat la quantitat oferta és més gran que la demandada, hi ha <b>excés d'oferta</b> (sobra producte). Si és més petita, hi ha <b>excés de demanda</b> (falta producte).",
        gen: function (r, ctx) {
          var m = mercat(r), pr = preus(m, 3), p = CE.pick(r, pr.filter(function (x) { return x !== m.P; }));
          var qd = m.qd(p), qs = m.qs(p), exO = qs > qd;
          var prod = CE.prod(r, ctx);
          return {
            intro: 'Aquesta és la taula del mercat de ' + prod.pl + ' al barri on ven la cooperativa <b>' + CE.esc(ctx.coop) + '</b>. Les quantitats són unitats per setmana.' + taula(m, pr),
            steps: [
              { q: 'Si el preu és de <b>' + eur(p) + '</b>, quantes unitats volen comprar els clients?', type: 'num', ans: qd, unit: 'u.', hint: 'Busca la columna de ' + eur(p) + ' i mira la fila de la quantitat demandada.', line: 'A ' + eur(p) + ': quantitat demandada = ' + qd },
              { q: 'I quantes en volen vendre les parades a aquest preu?', type: 'num', ans: qs, unit: 'u.', hint: 'La mateixa columna, fila de la quantitat oferta.', line: 'A ' + eur(p) + ': quantitat oferta = ' + qs },
              { q: 'Què hi ha en aquest mercat a ' + eur(p) + '?', type: 'choice', opts: ["Excés d'oferta", 'Excés de demanda', 'Equilibri'], ans: exO ? 0 : 1, hint: 'Compara les dues quantitats: sobra o falta producte?', line: qs + (exO ? ' > ' : ' < ') + qd + ' → ' + (exO ? "excés d'oferta" : 'excés de demanda') },
              { q: 'De quantes unitats és aquest excés?', type: 'num', ans: Math.abs(qs - qd), unit: 'u.', hint: 'Resta la quantitat més petita de la més gran.', line: 'Excés = ' + Math.max(qs, qd) + ' − ' + Math.min(qs, qd) + ' = ' + Math.abs(qs - qd) + ' unitats' }
            ] };
        } },

      { id: 'M3', titol: "Troba l'equilibri", sabers: "Preu i quantitat d'equilibri",
        recorda: "El <b>preu d'equilibri</b> és aquell en què la quantitat demandada és igual a la quantitat oferta. Per sota, el preu tendeix a pujar; per sobre, a baixar.",
        gen: function (r, ctx) {
          var m = mercat(r), pr = preus(m, 3), low = m.P - CE.int(r, 1, 3);
          var prod = CE.prod(r, ctx);
          return {
            intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> vol saber a quin preu es vendran ' + prod.pl + ' al mercat. Quantitats en unitats per setmana:' + taula(m, CE.shuffle(r, pr).sort(function (a, b) { return a - b; })),
            steps: [
              { q: "Quin és el <b>preu d'equilibri</b>?", type: 'num', ans: m.P, unit: '€', hint: 'Busca la columna on les dues quantitats són iguals.', line: 'A ' + eur(m.P) + ': demandada = oferta = ' + m.Q },
              { q: "Quina és la <b>quantitat d'equilibri</b>?", type: 'num', ans: m.Q, unit: 'u.', hint: 'És la quantitat que coincideix en aquella columna.', line: "Quantitat d'equilibri = " + m.Q + ' unitats' },
              { q: 'Una parada ven a ' + eur(low) + '. Què passarà amb el preu?', type: 'choice', opts: ['Tendirà a pujar', 'Tendirà a baixar', 'Es quedarà igual'], ans: 0, hint: "Mira si a aquest preu falta o sobra producte.", line: 'A ' + eur(low) + ' hi ha excés de demanda (' + m.qd(low) + ' > ' + m.qs(low) + ') → el preu puja' }
            ] };
        } },

      { id: 'M4', titol: 'Es mou la demanda o l\'oferta?', sabers: 'Desplaçaments de les corbes',
        recorda: "Si el canvi afecta els <b>compradors</b> (renda, gustos, modes, festes), es desplaça la <b>demanda</b>. Si afecta els <b>productors</b> (costos, tecnologia, clima), es desplaça l'<b>oferta</b>.",
        gen: function (r, ctx) {
          var ev = [
            ['Arriba la festa major i tothom vol comprar més coses al mercat.', 0, 0, 0],
            ['Una influencer posa de moda les bosses de roba pintades.', 0, 0, 0],
            ['Moltes famílies del barri tenen menys diners aquest mes.', 0, 1, 1],
            ['La tela per fer bosses s\'encareix molt.', 1, 1, 0],
            ['Una màquina nova permet produir el doble amb el mateix cost.', 1, 0, 1],
            ['Una pedregada fa malbé la collita de maduixes.', 1, 1, 0],
            ['S\'obren cinc parades noves que venen el mateix producte.', 1, 0, 1],
            ['Surt un estudi que diu que un producte és dolent per a la salut.', 0, 1, 1]
          ];
          var two = CE.shuffle(r, ev).slice(0, 2), e = two[0], e2 = two[1];
          var oc = ['Demanda', 'Oferta'], od = ['Augmenta', 'Disminueix'], op = ['Puja', 'Baixa'];
          return {
            intro: 'Notícies que afecten el mercat on ven la cooperativa <b>' + CE.esc(ctx.coop) + '</b>:<ol class="bugs"><li>' + e[0] + '</li><li>' + e2[0] + '</li></ol>',
            steps: [
              { q: 'Notícia 1: quina corba es desplaça?', type: 'choice', opts: oc, ans: e[1], hint: 'Afecta els que compren o els que produeixen?', line: 'Notícia 1 → es desplaça la ' + oc[e[1]].toLowerCase() },
              { q: 'Notícia 1: la ' + oc[e[1]].toLowerCase() + ' augmenta o disminueix?', type: 'choice', opts: od, ans: e[2], hint: 'A cada preu, ara es vol comprar (o vendre) més o menys?', line: oc[e[1]] + ' ' + od[e[2]].toLowerCase() },
              { q: 'Notícia 1: què passa amb el preu d\'equilibri?', type: 'choice', opts: op, ans: e[3], hint: 'Més demanda o menys oferta fan pujar el preu; menys demanda o més oferta el fan baixar.', line: "Preu d'equilibri → " + op[e[3]].toLowerCase() },
              { q: 'Notícia 2: quina corba es desplaça?', type: 'choice', opts: oc, ans: e2[1], hint: 'Afecta els que compren o els que produeixen?', line: 'Notícia 2 → es desplaça la ' + oc[e2[1]].toLowerCase() + ' (' + od[e2[2]].toLowerCase() + ', preu ' + op[e2[3]].toLowerCase() + ')' }
            ] };
        } },

      { id: 'M5', titol: 'El nou equilibri', sabers: "Canvi d'equilibri després d'un desplaçament",
        recorda: "Quan la demanda augmenta, a cada preu es vol comprar més. El nou equilibri té un <b>preu més alt</b> i una <b>quantitat més gran</b>.",
        gen: function (r, ctx) {
          var m = mercat(r), step = m.b + m.d, k = step * CE.int(r, 1, 2), shift = k / step;
          var qd2 = function (p) { return m.qd(p) + k; };
          var pr = []; for (var p = m.P - 2; p <= m.P + 2 + shift; p++) pr.push(p);
          return {
            intro: 'S\'acosta Nadal i a cada preu la gent vol comprar <b>' + k + ' unitats més</b> que abans. Aquesta és la nova taula del mercat on ven la cooperativa <b>' + CE.esc(ctx.coop) + '</b>:' + taula(m, pr, qd2) +
              '<p class="note">Abans de Nadal, el preu d\'equilibri era de ' + eur(m.P) + ' i es venien ' + m.Q + ' unitats.</p>',
            steps: [
              { q: "Quin és el <b>nou preu d'equilibri</b>?", type: 'num', ans: m.P + shift, unit: '€', hint: 'Busca la columna on ara coincideixen les dues quantitats.', line: "Nou preu d'equilibri = " + eur(m.P + shift) },
              { q: 'Quina és la <b>nova quantitat d\'equilibri</b>?', type: 'num', ans: m.qs(m.P + shift), unit: 'u.', hint: 'Mira la quantitat d\'aquella columna.', line: 'Nova quantitat = ' + m.qs(m.P + shift) + ' unitats' },
              { q: 'Comparat amb abans de Nadal, el preu…', type: 'choice', opts: ['Ha pujat', 'Ha baixat', 'És igual'], ans: 0, hint: 'Compara ' + eur(m.P) + ' amb el nou preu.', line: eur(m.P) + ' → ' + eur(m.P + shift) + ': el preu ha pujat' },
              { q: 'Quantes unitats més es venen ara que abans?', type: 'num', ans: m.qs(m.P + shift) - m.Q, unit: 'u.', hint: 'Nova quantitat − quantitat d\'abans.', line: m.qs(m.P + shift) + ' − ' + m.Q + ' = ' + (m.qs(m.P + shift) - m.Q) + ' unitats més' }
            ] };
        } },

      { id: 'M6', titol: "Caça l'error", sabers: 'Errors típics del tema',
        recorda: 'Errors habituals: confondre quina corba es mou, pensar que si el preu puja la gent compra més, o dir que hi ha excés de demanda quan sobra producte.',
        gen: function (r, ctx) {
          var bugs = [
            ['Si el preu de les bosses puja, la gent en vol comprar més.', ['Si el preu puja, la quantitat demandada baixa.', 'El preu no afecta la demanda.', "Si el preu puja, l'oferta baixa."]],
            ["Quan sobra producte a la parada hi ha excés de demanda.", ["Quan sobra producte hi ha excés d'oferta.", 'Quan sobra producte hi ha equilibri.', 'Quan sobra producte el preu puja.']],
            ["Si la farina s'encareix, es desplaça la demanda de pa.", ["S'encareix un cost de producció: es desplaça l'oferta.", 'No es desplaça cap corba.', 'Es desplacen les dues corbes cap amunt.']],
            ["Al preu d'equilibri sempre sobra una mica de producte.", ["Al preu d'equilibri la quantitat demandada és igual a l'oferta.", "Al preu d'equilibri falta producte.", "El preu d'equilibri és el més alt possible."]],
            ['Si hi ha excés de demanda, el preu tendeix a baixar.', ['Si falta producte, el preu tendeix a pujar.', 'El preu no canvia mai.', "L'excés de demanda fa baixar l'oferta."]]
          ];
          var ok = ['Un mercat pot ser físic o virtual.', "L'oferta puja cap a la dreta.", 'Una moda pot fer augmentar la demanda.', 'Una millora tecnològica pot fer augmentar l\'oferta.', "Al punt on es creuen les corbes hi ha l'equilibri."];
          var b = CE.pick(r, bugs), oks = CE.shuffle(r, ok).slice(0, 2);
          var lines = CE.shuffle(r, [[b[0], true], [oks[0], false], [oks[1], false]]);
          var wrong = lines.findIndex(function (l) { return l[1]; });
          var corr = CE.shuffle(r, b[1].map(function (t, i) { return [t, i === 0]; }));
          return {
            intro: 'Un soci de la cooperativa <b>' + CE.esc(ctx.coop) + '</b> ha preparat aquestes frases per al pitch, però una és falsa:<ol class="bugs">' + lines.map(function (l) { return '<li>' + l[0] + '</li>'; }).join('') + '</ol>',
            steps: [
              { q: 'Quina frase és falsa?', type: 'choice', opts: ['Frase 1', 'Frase 2', 'Frase 3'], ans: wrong, hint: 'Rellegeix el «Recorda».', line: 'La frase falsa és la ' + (wrong + 1) },
              { q: "Com s'hauria de corregir?", type: 'choice', opts: corr.map(function (c) { return c[0]; }), ans: corr.findIndex(function (c) { return c[1]; }), hint: "Tria la frase certa que contradiu l'error.", line: 'Correcció: ' + b[1][0] }
            ] };
        } }
    ]
  });
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
})();
