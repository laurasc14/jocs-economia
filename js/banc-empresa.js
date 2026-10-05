/* Nivell 2 · Constituïm la cooperativa (empresa i cooperativa) */
(function () {
  var f = CE.f, eur = CE.eur;
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var NOMS = ['Aina', 'Biel', 'Carla', 'Dani', 'Emma', 'Hugo', 'Iris', 'Jan', 'Laia', 'Marc', 'Nora', 'Pau', 'Txell', 'Unai'];

  CE.BANC.push({
    id: 'N2', num: 2, titol: 'Constituïm la cooperativa', tema: 'Empresa i cooperativa',
    teoria: 'estudi.html#t2',
    missions: [

      { id: 'M1', titol: 'De quin sector ets?', sabers: 'Sectors primari, secundari i terciari',
        recorda: '<b>Primari:</b> obté recursos de la natura (agricultura, pesca, ramaderia). <b>Secundari:</b> transforma matèries primeres (indústria, construcció). <b>Terciari:</b> ofereix serveis (comerç, turisme, educació).',
        gen: function (r, ctx) {
          var pool = [['una granja de gallines', 0], ['una cooperativa que cull avellanes', 0], ['una barca de pesca de Cambrils', 0], ['una fàbrica de galetes', 1], ['una empresa que construeix pisos', 1], ['un taller que fa mobles', 1], ['una botiga de roba', 2], ['una acadèmia de repàs', 2], ['un hotel de Salou', 2], ['una empresa de transport', 2]];
          var opts = ['Primari', 'Secundari', 'Terciari'];
          var steps = CE.shuffle(r, pool).slice(0, 4).map(function (it) { return { q: 'A quin sector pertany <b>' + it[0] + '</b>?', type: 'choice', opts: opts, ans: it[1], hint: 'Obté recursos de la natura, els transforma o ofereix un servei?', line: cap(it[0]) + ' → sector ' + opts[it[1]].toLowerCase() }; });
          steps.push({ q: '<b>' + CE.esc(ctx.coop) + '</b> fabrica els seus productes i els ven a la parada. Quin és el sector de l\'activitat de <b>fabricar</b>?', type: 'choice', opts: opts, ans: 1, hint: 'Fabricar és transformar materials en un producte nou.', line: 'Fabricar → sector secundari (vendre seria terciari)' });
          return { intro: 'Abans de constituir-vos, compareu <b>' + CE.esc(ctx.coop) + '</b> amb altres empreses de la zona.', steps: steps };
        } },

      { id: 'M2', titol: 'Quina forma jurídica?', sabers: 'Autònom, SL, SA i cooperativa; responsabilitat',
        recorda: '<b>Autònom/a:</b> una persona, responsabilitat il·limitada. <b>SL:</b> des d\'1 € de capital; els socis responen amb el capital aportat (si és de menys de 3.000 €, fins a 3.000 €). <b>SA:</b> capital mínim de 60.000 €, dividit en accions. <b>Cooperativa catalana:</b> capital mínim de 3.000 €, responsabilitat limitada i un soci, un vot.',
        gen: function (r, ctx) {
          var pool = [
            ['La Marta obre sola una perruqueria i respondrà dels deutes amb els seus béns personals.', 0],
            ['Dos germans creen un taller i volen respondre només amb els diners que hi han posat.', 1],
            ['Una gran empresa de supermercats divideix el capital en milers d\'accions.', 2],
            ['Vint pagesos s\'uneixen per vendre l\'oli junts i decidir-ho tot amb un vot per persona.', 3],
            ['Un fuster treballa pel seu compte, sense socis.', 0],
            ['Cinc amics creen una petita empresa de disseny i no volen arriscar el seu pis si va malament.', 1]
          ];
          var opts = ['Autònom/a', 'Societat limitada', 'Societat anònima', 'Cooperativa'];
          var steps = CE.shuffle(r, pool).slice(0, 3).map(function (it) { return { q: it[0] + ' Quina forma jurídica li va millor?', type: 'choice', opts: opts, ans: it[1], hint: 'Fixa\'t en quantes persones hi ha, com decideixen i fins on arrisquen els seus béns.', line: it[0].split('.')[0] + ' → ' + opts[it[1]].toLowerCase() }; });
          var cap2 = CE.int(r, 3, 6) * 1000, deute = cap2 + CE.int(r, 2, 8) * 1000;
          steps.push({ q: 'Un autònom té un deute de ' + eur(deute) + ' que el negoci no pot pagar. Amb quins diners respon?', type: 'choice', opts: ['Només amb els diners del negoci', 'També amb els seus béns personals', 'Paga l\'Estat'], ans: 1, hint: 'L\'autònom té responsabilitat il·limitada.', line: 'Autònom → responsabilitat il·limitada: respon amb els béns personals' });
          steps.push({ q: 'Una sòcia d\'una SL hi va aportar ' + eur(cap2) + '. L\'empresa tanca amb ' + eur(deute) + ' de deutes. Quants euros, com a màxim, pot perdre ella?', type: 'num', ans: cap2, unit: '€', hint: 'A la SL la responsabilitat està limitada al capital aportat.', line: 'SL → com a màxim perd el capital aportat: ' + eur(cap2) });
          steps.push({ q: 'Quin capital mínim cal per constituir una <b>cooperativa a Catalunya</b>?', type: 'choice', opts: ['1 €', '3.000 €', '60.000 €'], ans: 1, hint: '1 € és el mínim de la SL i 60.000 €, el de la SA.', line: 'Cooperativa catalana: capital mínim de 3.000 € (SL: 1 €; SA: 60.000 €)' });
          return { intro: 'Per constituir la cooperativa <b>' + CE.esc(ctx.coop) + '</b> heu de triar forma jurídica. Primer practiqueu amb altres casos.', steps: steps };
        } },

      { id: 'M3', titol: 'Un soci, un vot', sabers: 'Gestió democràtica de la cooperativa',
        recorda: 'A la cooperativa cada soci té <b>un vot</b>, independentment del capital que hagi aportat. Una proposta s\'aprova per <b>majoria</b>: més vots a favor que en contra.',
        gen: function (r, ctx) {
          var n = CE.int(r, 5, 9), socis = CE.shuffle(r, NOMS).slice(0, n);
          var aport = socis.map(function () { return CE.int(r, 2, 20) * 5; });
          var rich = aport.indexOf(Math.max.apply(null, aport));
          var favor = CE.int(r, 1, n - 1); if (favor * 2 === n) favor++;
          var total = aport.reduce(function (a, b) { return a + b; }, 0);
          return {
            intro: '<b>' + CE.esc(ctx.coop) + '</b> té ' + n + ' socis. Cadascú ha aportat capital: ' + socis.map(function (s, i) { return s + ' ' + eur(aport[i]); }).join(', ') + '. A l\'assemblea es vota si es fa un descompte del 20 % per Nadal.',
            steps: [
              { q: 'Quants vots té <b>' + socis[rich] + '</b>, que ha aportat més capital (' + eur(aport[rich]) + ')?', type: 'num', ans: 1, unit: 'vots', hint: 'A la cooperativa no compta el capital per votar.', line: socis[rich] + ' → 1 vot, com tothom' },
              { q: 'Quants vots hi ha en total a l\'assemblea?', type: 'num', ans: n, unit: 'vots', hint: 'Un per soci.', line: 'Total: ' + n + ' vots' },
              { q: favor + ' socis voten a favor i la resta en contra. S\'aprova el descompte?', type: 'choice', opts: ['Sí', 'No'], ans: favor * 2 > n ? 0 : 1, hint: 'Cal més vots a favor que en contra. En contra: ' + n + ' − ' + favor + '.', line: favor + ' a favor i ' + (n - favor) + ' en contra → ' + (favor * 2 > n ? "s'aprova" : "no s'aprova") },
              { q: 'Si fos una <b>societat anònima</b> amb un vot per cada euro aportat, quants vots tindria ' + socis[rich] + '?', type: 'num', ans: aport[rich], unit: 'vots', hint: 'Un vot per euro: compta els euros que ha aportat.', line: 'En una SA (1 vot/€): ' + aport[rich] + ' vots de ' + total }
            ] };
        } },

      { id: 'M4', titol: 'Repartim els excedents', sabers: 'Excedents, fons de reserva i retorn segons l\'activitat',
        recorda: "A la cooperativa, els diners que sobren (<b>excedents</b>) no es reparteixen segons el capital, sinó segons l'<b>activitat</b> de cada soci (per exemple, les hores treballades). Abans, una part va als <b>fons</b> de la cooperativa.",
        gen: function (r, ctx) {
          var p = CE.pick(r, [2, 4, 6]);
          var socis = CE.shuffle(r, NOMS).slice(0, 3);
          var h = socis.map(function () { return CE.int(r, 4, 15) * 2; });
          var H = h[0] + h[1] + h[2], D = p * H, E = D * 1.25, fons = E - D;
          var k = CE.int(r, 0, 2);
          return {
            intro: 'Aquest trimestre <b>' + CE.esc(ctx.coop) + '</b> ha tingut un excedent de <b>' + eur(E) + '</b>. Els estatuts diuen que el <b>20 %</b> va al fons de reserva i la resta es reparteix segons les hores treballades: ' + socis.map(function (s, i) { return s + ' ' + h[i] + ' h'; }).join(', ') + '.',
            steps: [
              { q: 'Quants euros van al <b>fons de reserva</b>?', type: 'num', ans: fons, unit: '€', hint: 'Calcula el 20 % de l\'excedent.', line: 'Fons = ' + f(E) + ' × 20 % = ' + eur(fons) },
              { q: 'Quants euros es <b>reparteixen</b> entre els socis?', type: 'num', ans: D, unit: '€', hint: 'Excedent − fons.', line: 'A repartir = ' + f(E) + ' − ' + f(fons) + ' = ' + eur(D) },
              { q: 'Quantes hores s\'han treballat en total?', type: 'num', ans: H, unit: 'h', hint: 'Suma les hores dels tres socis.', line: 'Hores totals = ' + h.join(' + ') + ' = ' + H + ' h' },
              { q: 'Quants euros toquen per cada hora treballada?', type: 'num', ans: p, unit: '€/h', hint: 'Divideix el que es reparteix entre les hores totals.', line: 'Per hora = ' + f(D) + ' ÷ ' + H + ' = ' + eur(p) },
              { q: 'Quants euros li toquen a <b>' + socis[k] + '</b>?', type: 'num', ans: p * h[k], unit: '€', hint: 'Multiplica les seves hores pel valor de cada hora.', line: socis[k] + ' = ' + h[k] + ' × ' + f(p) + ' = ' + eur(p * h[k]) }
            ] };
        } },

      { id: 'M5', titol: 'Els principis cooperatius', sabers: 'Principis de les cooperatives',
        recorda: '<b>Adhesió voluntària i oberta</b> · <b>Gestió democràtica</b> (un soci, un vot) · <b>Participació econòmica</b> (excedents segons l\'activitat) · <b>Educació i formació</b> · <b>Compromís amb la comunitat</b>.',
        gen: function (r, ctx) {
          var opts = ['Adhesió voluntària', 'Gestió democràtica', 'Participació econòmica', 'Educació i formació', 'Compromís amb la comunitat'];
          var pool = [
            ['Qualsevol alumne de 4t que ho vulgui pot entrar a la cooperativa.', 0],
            ['Ningú està obligat a quedar-se a la cooperativa si no vol.', 0],
            ['El preu de les bosses es decideix votant a l\'assemblea, una persona un vot.', 1],
            ['El president l\'escullen tots els socis.', 1],
            ['Qui ha treballat més hores rep una part més gran dels excedents.', 2],
            ['Cada soci aporta una petita quantitat de capital per començar.', 2],
            ['Una part dels diners es fa servir per fer un taller de disseny per als socis.', 3],
            ['Els socis veterans ensenyen als nous com funciona la caixa.', 3],
            ['Donen una part del benefici a un projecte del barri.', 4],
            ['Compren la tela a una botiga del poble en lloc d\'una multinacional.', 4]
          ];
          return { intro: 'Aquestes són algunes decisions de la cooperativa <b>' + CE.esc(ctx.coop) + '</b>. Quin principi cooperatiu aplica cadascuna?',
            steps: CE.shuffle(r, pool).slice(0, 4).map(function (it) { return { q: '«' + it[0] + '»', type: 'choice', opts: opts, ans: it[1], hint: 'Parla de qui pot entrar, de com es decideix, dels diners, de formar-se o del barri?', line: '«' + it[0] + '» → ' + opts[it[1]].toLowerCase() }; }) };
        } },

      { id: 'M6', titol: "Caça l'error", sabers: 'Errors típics del tema',
        recorda: 'Errors habituals: pensar que a la cooperativa vota més qui posa més diners, confondre responsabilitat limitada i il·limitada, o pensar que vendre és sector secundari.',
        gen: function (r, ctx) {
          var bugs = [
            ['A la cooperativa, qui aporta més capital té més vots.', ['Cada soci té un vot, independentment del capital.', 'Només vota el president.', 'Vota qui treballa més hores.']],
            ['Un autònom només respon dels deutes amb els diners del negoci.', ['Respon també amb els seus béns personals: responsabilitat il·limitada.', 'Els deutes els paga Hisenda.', 'No pot tenir deutes.']],
            ['Una botiga de roba pertany al sector secundari perquè ven roba.', ['És del sector terciari: ofereix un servei de comerç.', 'És del sector primari.', 'No té sector.']],
            ['Els excedents de la cooperativa es reparteixen segons el capital aportat.', ["Es reparteixen segons l'activitat de cada soci.", 'Se\'ls queda el president.', "Es reparteixen sempre a parts iguals."]],
            ['En una SL els socis responen dels deutes amb tots els seus béns.', ['Només responen amb el capital que han aportat.', 'No responen de res.', 'Responen amb el doble del capital.']]
          ];
          var ok = ['Una fàbrica de galetes és del sector secundari.', 'A la cooperativa, cada soci té un vot.', 'Una SA divideix el capital en accions.', 'Les empreses creen ocupació i paguen impostos.', 'Una granja és del sector primari.'];
          var b = CE.pick(r, bugs), oks = CE.shuffle(r, ok).filter(function (t) { return t.indexOf(b[0].slice(0, 12)) < 0; }).slice(0, 2);
          var lines = CE.shuffle(r, [[b[0], true], [oks[0], false], [oks[1], false]]);
          var wrong = lines.findIndex(function (l) { return l[1]; });
          var corr = CE.shuffle(r, b[1].map(function (t, i) { return [t, i === 0]; }));
          return {
            intro: 'Al dossier de la cooperativa <b>' + CE.esc(ctx.coop) + '</b> hi ha aquestes frases, però una és falsa:<ol class="bugs">' + lines.map(function (l) { return '<li>' + l[0] + '</li>'; }).join('') + '</ol>',
            steps: [
              { q: 'Quina frase és falsa?', type: 'choice', opts: ['Frase 1', 'Frase 2', 'Frase 3'], ans: wrong, hint: 'Rellegeix el «Recorda».', line: 'La frase falsa és la ' + (wrong + 1) },
              { q: "Com s'hauria de corregir?", type: 'choice', opts: corr.map(function (c) { return c[0]; }), ans: corr.findIndex(function (c) { return c[1]; }), hint: 'Tria la frase certa que contradiu l\'error.', line: 'Correcció: ' + b[1][0] }
            ] };
        } }
    ]
  });
})();
