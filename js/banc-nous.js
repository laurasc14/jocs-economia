/* Missions noves alineades amb la SA «Res no es llença» */
(function () {
  var f = CE.f, eur = CE.eur, r2 = CE.r2;
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function classify(r, pool, n, opts, qfn, hint) {
    return CE.shuffle(r, pool).slice(0, n).map(function (it) {
      return { q: qfn(it), type: 'choice', opts: opts, ans: it[1], hint: hint, line: '«' + it[0] + '» → ' + opts[it[1]].toLowerCase() };
    });
  }
  function caca(r, ctx, bugs, ok, who) {
    var b = CE.pick(r, bugs), oks = CE.shuffle(r, ok).filter(function (t) { return t.slice(0, 14) !== b[0].slice(0, 14); }).slice(0, 2);
    var lines = CE.shuffle(r, [[b[0], true], [oks[0], false], [oks[1], false]]);
    var wrong = lines.findIndex(function (l) { return l[1]; });
    var corr = CE.shuffle(r, b[1].map(function (t, i) { return [t, i === 0]; }));
    return {
      intro: who + ' de la cooperativa <b>' + CE.esc(ctx.coop) + '</b> ha escrit aquestes frases, però una és falsa:<ol class="bugs">' + lines.map(function (l) { return '<li>' + l[0] + '</li>'; }).join('') + '</ol>',
      steps: [
        { q: 'Quina frase és falsa?', type: 'choice', opts: ['Frase 1', 'Frase 2', 'Frase 3'], ans: wrong, hint: 'Rellegeix el «Recorda».', line: 'La frase falsa és la ' + (wrong + 1) },
        { q: "Com s'hauria de corregir?", type: 'choice', opts: corr.map(function (c) { return c[0]; }), ans: corr.findIndex(function (c) { return c[1]; }), hint: "Tria la frase certa que contradiu l'error.", line: 'Correcció: ' + b[1][0] }
      ] };
  }

  CE.BANC.push({ id: 'NOU', missions: [

    /* ---------- U1 ---------- */
    { id: 'ESC', titol: 'Escassetat o repartiment?', sabers: "Escassetat, repartiment i qui queda fora del mercat",
      recorda: "<b>Escassetat:</b> no hi ha prou recursos per a tothom. <b>Problema de repartiment:</b> n'hi ha prou, però no arriben a tothom perquè no tenen diners, propietat o accés. A <i>L'illa de les flors</i>, els tomàquets sobren, però hi ha persones que no en poden menjar.",
      gen: function (r, ctx) {
        var pool = [
          ['Una sequera fa que no hi hagi prou aigua per regar tots els camps.', 0],
          ['Els supermercats llencen fruita bona mentre hi ha famílies que no en poden comprar.', 1],
          ['Els tomàquets que sobren se\'ls mengen els porcs abans que algunes persones de l\'illa.', 1],
          ['Una plaga destrueix la meitat de la collita de blat del país.', 0],
          ['Hi ha pisos buits, però molta gent no pot pagar un lloguer.', 1],
          ['Al poble només hi ha un metge per a 5.000 habitants.', 0]
        ];
        var steps = classify(r, pool, 3, ['Escassetat', 'Repartiment'], function (it) { return '«' + it[0] + '» És un problema d\'escassetat o de repartiment?'; }, 'Pregunta\'t: hi ha prou recurs per a tothom? Si n\'hi ha prou però no arriba a tothom, és repartiment.');
        var p = CE.prod(r, ctx), preu = CE.int(r, 3, 6);
        var max = []; for (var i = 0; i < 7; i++) max.push(CE.int(r, 1, 9));
        if (max.every(function (m) { return m >= preu; })) max[0] = preu - 2;
        var fora = max.filter(function (m) { return m < preu; }).length;
        steps.push({ q: 'La cooperativa ven ' + p.pl + ' a <b>' + eur(preu) + '</b>. Set veïns pagarien com a màxim: ' + max.map(function (m) { return eur(m); }).join(', ') + '. Quantes persones queden <b>fora del mercat</b>?', type: 'num', ans: fora, unit: 'persones', hint: 'Compta les persones que pagarien menys del preu.', line: 'Pagarien menys de ' + eur(preu) + ': ' + fora + ' persones queden fora' });
        steps.push({ q: 'Per què queden fora?', type: 'choice', opts: ['Perquè no tenen prou diners per pagar el preu', 'Perquè no hi ha prou producte', 'Perquè no el necessiten'], ans: 0, hint: 'Hi ha producte per a tothom?', line: 'Queden fora per falta de diners, no per falta de producte' });
        return { intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> vol entendre per què es llencen coses mentre hi ha persones que no en tenen.', steps: steps };
      } },

    { id: 'IRR', titol: 'Diners que no tornen', sabers: 'Costos irrecuperables',
      recorda: "Un <b>cost irrecuperable</b> és un diner (o temps) que ja has gastat i que no pots recuperar, decideixis el que decideixis. Per decidir bé, <b>no s'ha de tenir en compte</b>: només compten els costos i beneficis que encara depenen de la decisió.",
      gen: function (r, ctx) {
        var S = CE.int(r, 4, 9) * 10, ia = CE.int(r, 12, 20) * 10, ca = CE.int(r, 2, 6) * 10, q = CE.int(r, 10, 25), m = CE.pick(r, [2, 3, 4]);
        var A = ia - ca, B = q * m; if (A === B) B += m;
        var p = CE.prod(r, ctx);
        return {
          intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> va pagar fa un mes <b>' + eur(S) + '</b> per una parada a la fira del dissabte. No els tornaran els diners. Ara poden: <b>A)</b> anar a la fira, on vendrien ' + eur(ia) + ' de ' + p.pl + ' i gastarien ' + eur(ca) + ' en transport i material, o <b>B)</b> quedar-se a l\'institut i vendre ' + q + ' unitats amb un marge de ' + eur(m) + ' cadascuna.',
          steps: [
            { q: 'Els ' + eur(S) + ' de la parada són…', type: 'choice', opts: ['Un cost irrecuperable', "Un cost d'oportunitat", 'Un ingrés'], ans: 0, hint: 'Ja estan pagats i no es poden recuperar.', line: eur(S) + ' de la parada → cost irrecuperable' },
            { q: 'Quin benefici els dona anar a la fira (opció A), <b>sense</b> comptar la parada?', type: 'num', ans: A, unit: '€', hint: 'Vendes − despeses que encara han de fer.', line: 'A: ' + f(ia) + ' − ' + f(ca) + ' = ' + eur(A) },
            { q: 'Quin benefici els dona quedar-se (opció B)?', type: 'num', ans: B, unit: '€', hint: 'Unitats × marge.', line: 'B: ' + q + ' × ' + f(m) + ' = ' + eur(B) },
            { q: 'Què els convé fer?', type: 'choice', opts: ['Anar a la fira (A)', "Quedar-se a l'institut (B)"], ans: A > B ? 0 : 1, hint: 'Compara A i B. La parada ja està pagada igualment.', line: (A > B ? 'A > B → anar a la fira' : 'B > A → quedar-se a l\'institut') },
            { q: 'Un soci diu: «Hem d\'anar a la fira sí o sí, perquè si no hi anem perdrem els ' + eur(S) + '». Té raó?', type: 'choice', opts: ['Sí, si no hi van perden aquests diners', 'No: aquests diners ja estan perduts facin el que facin'], ans: 1, hint: 'Els diners de la parada es recuperen si hi van?', line: 'El cost irrecuperable no ha de decidir res' }
          ] };
      } },

    { id: 'MAR', titol: 'Pensar al marge', sabers: 'Anàlisi marginal i incentius',
      recorda: "<b>Anàlisi marginal:</b> decidir pensant en què guanyes i què et costa <b>una unitat més</b> (una hora, un producte…). Val la pena continuar mentre el benefici marginal sigui igual o més gran que el cost marginal. Un <b>incentiu</b> és una recompensa (o un càstig) que fa canviar el comportament de les persones.",
      gen: function (r, ctx) {
        var marg = [CE.int(r, 45, 60), 0, 0, 0, 0];
        for (var i = 1; i < 5; i++) marg[i] = marg[i - 1] - CE.int(r, 6, 14);
        var c = CE.int(r, 15, 30);
        if (marg.some(function (x) { return x === c; })) c += 1;
        var tot = [], s = 0; marg.forEach(function (x) { s += x; tot.push(s); });
        var best = 0; marg.forEach(function (x, i) { if (x >= c) best = i + 1; });
        var inc = CE.pick(r, [
          ['Volen que els veïns portin la fruita que llencen.', ['Donar un pot de melmelada per cada 5 kg de fruita portada', 'Penjar un cartell amb el nom de la cooperativa', 'Pujar el preu de la melmelada']],
          ['Volen que la gent retorni els pots buits.', ['Descomptar 0,50 € al proper pot per cada pot retornat', 'Fer els pots més bonics', 'Vendre els pots més cars']],
          ['Volen que els alumnes portin roba vella per reciclar.', ['Donar un punt de la Lliga per cada peça portada', 'Explicar què és el reciclatge', 'Tancar la parada abans']]
        ]);
        var opts = CE.shuffle(r, inc[1].map(function (t, i) { return [t, i === 0]; }));
        return {
          intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> decideix quantes hores obre la parada el dissabte. Cada hora oberta costa <b>' + eur(c) + '</b> (llum i lloguer). Vendes acumulades:' +
            '<table class="tbl"><tr><th>Hores obertes</th>' + tot.map(function (_, i) { return '<td>' + (i + 1) + '</td>'; }).join('') + '</tr><tr><th>Vendes totals</th>' + tot.map(function (t) { return '<td>' + eur(t) + '</td>'; }).join('') + '</tr></table>',
          steps: [
            { q: 'Quants euros <b>més</b> es venen gràcies a la <b>3a hora</b>?', type: 'num', ans: marg[2], unit: '€', hint: 'Vendes amb 3 hores − vendes amb 2 hores.', line: '3a hora: ' + f(tot[2]) + ' − ' + f(tot[1]) + ' = ' + eur(marg[2]) },
            { q: 'I gràcies a la <b>5a hora</b>?', type: 'num', ans: marg[4], unit: '€', hint: 'Vendes amb 5 hores − vendes amb 4 hores.', line: '5a hora: ' + f(tot[4]) + ' − ' + f(tot[3]) + ' = ' + eur(marg[4]) },
            { q: 'Quantes hores val la pena obrir, com a màxim?', type: 'num', ans: best, unit: 'hores', hint: 'Obre una hora més només si el que es ven de més és igual o més que ' + eur(c) + '.', line: 'Vendes de cada hora: ' + marg.map(function (x) { return f(x); }).join(', ') + ' → obrir ' + best + ' hores' },
            { q: inc[0] + ' Quin és un bon <b>incentiu</b>?', type: 'choice', opts: opts.map(function (o) { return o[0]; }), ans: opts.findIndex(function (o) { return o[1]; }), hint: 'Un incentiu dona una recompensa a qui fa el que es vol aconseguir.', line: 'Incentiu: ' + inc[1][0].charAt(0).toLowerCase() + inc[1][0].slice(1) }
          ] };
      } },

    { id: 'PNM', titol: 'Positiu o normatiu? Micro o macro?', sabers: 'Economia positiva i normativa, microeconomia i macroeconomia',
      recorda: "<b>Positiu:</b> descriu fets que es poden comprovar amb dades. <b>Normatiu:</b> expressa una opinió o el que hauria de ser (sovint diu «hauria», «cal», «és injust»). <b>Micro:</b> decisions de famílies, empreses o mercats concrets. <b>Macro:</b> l'economia d'un país en conjunt (atur, inflació, PIB).",
      gen: function (r, ctx) {
        var pn = [
          ['A Catalunya es llencen milers de tones d\'aliments cada any.', 0], ['El govern hauria de multar els supermercats que llencen menjar.', 1],
          ['El preu del tomàquet ha pujat aquest mes.', 0], ['És injust que es llenci menjar mentre hi ha gent que passa gana.', 1],
          ['La cooperativa ha venut 40 pots aquesta setmana.', 0], ['Les botigues haurien de vendre la fruita lletja més barata.', 1]
        ];
        var mm = [
          ['La cooperativa decideix el preu de les seves bosses.', 0], ["L'atur juvenil a Espanya ha baixat aquest any.", 1],
          ['Una família decideix si compra roba nova o de segona mà.', 0], ['La inflació fa que pugin els preus de tot el país.', 1],
          ['El PIB de Catalunya ha crescut.', 1], ['Una botiga del barri abaixa el preu de les maduixes.', 0]
        ];
        var steps = classify(r, pn, 2, ['Positiu', 'Normatiu'], function (it) { return '«' + it[0] + '» És positiu o normatiu?'; }, 'Es pot comprovar amb dades (positiu) o és una opinió sobre el que hauria de ser (normatiu)?')
          .concat(classify(r, mm, 2, ['Micro', 'Macro'], function (it) { return '«' + it[0] + '» És micro o macro?'; }, 'Parla d\'una família, empresa o mercat concret (micro) o de tot el país (macro)?'));
        return { intro: 'Per a l\'informe del problema, la cooperativa <b>' + CE.esc(ctx.coop) + '</b> ha recollit aquestes frases. Classifica-les.', steps: steps };
      } },

    { id: 'PLU', titol: 'Economies plurals, drets i deures', sabers: 'Economia circular, ecològica, feminista i social; drets i deures',
      recorda: "<b>Circular:</b> reutilitzar, reparar i reciclar perquè res no es llenci. <b>Ecològica:</b> l'economia depèn dels límits del planeta. <b>Feminista i de les cures:</b> compta el treball de cures (cuinar, cuidar) encara que no es pagui ni surti al PIB. <b>Social i solidària:</b> posa les persones per davant del benefici, com les cooperatives.",
      gen: function (r, ctx) {
        var mir = [
          ['Una botiga repara mòbils vells perquè no es llencin.', 0], ['Un taller transforma roba vella en bosses noves.', 0],
          ['Un estudi calcula quanta aigua es gasta per fabricar uns texans.', 1], ['Es proposa no pescar més peix del que el mar pot regenerar.', 1],
          ['Un informe diu que cuinar i cuidar la família és treball, encara que no surti al PIB.', 2], ['Una empresa dona permisos perquè els treballadors cuidin els fills.', 2],
          ['Una cooperativa dona feina a persones en risc d\'exclusió.', 3], ['Un banc ètic només presta diners a projectes socials.', 3]
        ];
        var dd = [
          ['Rebre informació clara del preu i de la composició d\'un producte.', 0], ['Pagar els impostos que et toquen.', 1],
          ['Poder reclamar si un producte surt defectuós.', 0], ['Consumir de manera responsable i no malbaratar.', 1]
        ];
        var steps = classify(r, mir, 3, ['Circular', 'Ecològica', 'Feminista i de les cures', 'Social i solidària'], function (it) { return '«' + it[0] + '» Quina mirada econòmica hi encaixa més?'; }, 'Reutilitzar (circular), límits del planeta (ecològica), cures (feminista) o persones per davant del benefici (social)?')
          .concat(classify(r, dd, 1, ['Dret', 'Deure'], function (it) { return '«' + it[0] + '» És un dret o un deure de les persones consumidores?'; }, 'És una cosa que pots exigir (dret) o una obligació teva (deure)?'));
        steps.push({ q: 'Cuinar el sopar a casa compta al PIB?', type: 'choice', opts: ['Sí', 'No'], ans: 1, hint: 'El PIB només compta el que es compra i es ven.', line: 'Cuinar a casa no compta al PIB, però és treball (economia de les cures)' });
        return { intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> busca quina mirada econòmica encaixa amb el projecte «Res no es llença».', steps: steps };
      } },

    { id: 'DAD', titol: 'Dades amb font', sabers: 'Cercar, seleccionar i contrastar informació',
      recorda: "Una dada ben citada diu <b>què</b> (la xifra), <b>qui</b> la publica (l'organisme) i <b>quan</b> (l'any). Les fonts més fiables són organismes oficials i estudis amb metodologia (Idescat, INE, Agència de Residus de Catalunya, Eurostat). Si dues dades no coincideixen, mira si són d'anys, territoris o definicions diferents. <i>Les xifres d'aquests exercicis són d'exemple.</i>",
      gen: function (r, ctx) {
        var tema = CE.pick(r, [['menjar que es llença', 'kg', 'Agència de Residus de Catalunya'], ['roba que es llença', 'kg', 'Agència de Residus de Catalunya'], ['aparells electrònics que es llencen', 'kg', 'Eurostat']]);
        var fonts = CE.shuffle(r, [[tema[2] + ' (informe del 2024)', true], ['Un vídeo viral sense cap font', false], ['Un blog anònim', false], ['Un comentari en un fòrum', false]].slice(0, 3));
        var falta = CE.pick(r, [
          ['«Cada persona llença uns 30 kg de ' + tema[0].split(' ')[0] + ' l\'any.» Font: ' + tema[2] + '.', 1, "Falta l'any"],
          ['«Cada persona llença uns 30 kg de ' + tema[0].split(' ')[0] + ' l\'any.» (2023)', 0, "Falta l'organisme"]
        ]);
        var why = CE.pick(r, [
          ['Font A (2018): 35 kg per persona. Font B (2024): 28 kg per persona.', 0],
          ['Font A, Catalunya: 30 kg per persona. Font B, tot Europa: 40 kg per persona.', 1],
          ['Font A, només les llars: 25 kg per persona. Font B, tota la cadena (camp, botigues i llars): 60 kg per persona.', 2]
        ]);
        var kg = CE.int(r, 20, 40), mem = CE.int(r, 3, 5);
        var tot = CE.int(r, 4, 12) * 50, pct = CE.pick(r, [10, 20, 25, 40, 50]), rec = tot * pct / 100;
        return {
          intro: 'La persona del rol de Dades de la cooperativa <b>' + CE.esc(ctx.coop) + '</b> busca dues dades sobre <b>' + tema[0] + '</b> per al llenç ① de la Fita 1.',
          steps: [
            { q: 'Quina font és més fiable?', type: 'choice', opts: fonts.map(function (x) { return x[0]; }), ans: fonts.findIndex(function (x) { return x[1]; }), hint: 'Busca un organisme oficial que digui l\'any.', line: 'Font fiable: ' + tema[2] },
            { q: 'Què li falta a aquesta cita? ' + falta[0], type: 'choice', opts: ["L'organisme", "L'any", 'La xifra'], ans: falta[1], hint: 'Una cita completa té xifra, organisme i any.', line: falta[2] },
            { q: 'Dues fonts no coincideixen. ' + why[0] + ' Quina és la causa més probable?', type: 'choice', opts: ["Són d'anys diferents", 'Són de territoris diferents', 'Mesuren coses diferents'], ans: why[1], hint: 'Fixa\'t en què canvia entre la font A i la B.', line: ['Anys diferents', 'Territoris diferents', 'Definicions diferents'][why[1]] + ': no vol dir que una s\'equivoqui' },
            { q: 'Una font diu que cada persona llença ' + kg + ' kg l\'any. Quants kg llençaria una llar de <b>' + mem + '</b> persones?', type: 'num', ans: kg * mem, unit: 'kg', hint: 'Multiplica la dada per persona pel nombre de persones.', line: kg + ' × ' + mem + ' = ' + (kg * mem) + ' kg l\'any' },
            { q: 'Al barri es llencen ' + tot + ' kg al mes i la cooperativa en recupera ' + rec + ' kg. Quin <b>percentatge</b> recupera?', type: 'num', ans: pct, unit: '%', hint: 'Recuperat ÷ total × 100.', line: rec + ' ÷ ' + tot + ' × 100 = ' + pct + ' %' }
          ] };
      } },

    /* ---------- U2 ---------- */
    { id: 'PRO', titol: 'La fàbrica de la cooperativa', sabers: 'Productivitat i divisió del treball',
      recorda: "<b>Productivitat = producció ÷ factor utilitzat</b> (per exemple, unitats per persona o per hora). La <b>divisió del treball</b>, que cadascú s'especialitzi en una tasca, sol fer augmentar la productivitat.",
      gen: function (r, ctx) {
        var n = CE.int(r, 3, 4), p1 = CE.pick(r, [4, 8, 12]), pct = CE.pick(r, [25, 50, 75, 100]), p2 = p1 * (1 + pct / 100);
        var H = CE.int(r, 2, 5), k = CE.int(r, 6, 15), Q = H * k;
        var p = CE.prod(r, ctx);
        return {
          intro: 'Les ' + n + ' persones de la cooperativa <b>' + CE.esc(ctx.coop) + '</b> fan ' + p.pl + ' durant 20 minuts. <b>Ronda 1:</b> cadascú ho fa tot i en fan <b>' + (p1 * n) + '</b>. <b>Ronda 2:</b> es reparteixen les tasques i en fan <b>' + (p2 * n) + '</b>.',
          steps: [
            { q: 'Quina és la productivitat de la ronda 1 (unitats per persona)?', type: 'num', ans: p1, unit: 'u./persona', hint: 'Producció ÷ persones.', line: 'Ronda 1: ' + (p1 * n) + ' ÷ ' + n + ' = ' + p1 + ' unitats per persona' },
            { q: 'I la de la ronda 2?', type: 'num', ans: p2, unit: 'u./persona', hint: 'Producció ÷ persones.', line: 'Ronda 2: ' + (p2 * n) + ' ÷ ' + n + ' = ' + p2 + ' unitats per persona' },
            { q: 'En quin <b>percentatge</b> ha augmentat la productivitat?', type: 'num', ans: pct, unit: '%', hint: '(nova − antiga) ÷ antiga × 100.', line: '(' + p2 + ' − ' + p1 + ') ÷ ' + p1 + ' × 100 = ' + pct + ' %' },
            { q: 'Per què ha augmentat?', type: 'choice', opts: ["Perquè cadascú s'ha especialitzat en una tasca", 'Perquè han treballat menys persones', 'Perquè el material era més car'], ans: 0, hint: 'Què ha canviat entre les dues rondes?', line: 'Ha augmentat per la divisió del treball' },
            { q: 'Un dissabte, en ' + H + ' hores, la cooperativa fa ' + Q + ' unitats. Quina és la productivitat per hora?', type: 'num', ans: k, unit: 'u./hora', hint: 'Producció ÷ hores.', line: Q + ' ÷ ' + H + ' = ' + k + ' unitats per hora' }
          ] };
      } },

    { id: 'SOS', titol: 'Produir sense malbaratar', sabers: 'Recursos renovables i no renovables, desenvolupament sostenible',
      recorda: "<b>Renovables:</b> es regeneren (sol, vent, fusta d'un bosc gestionat). <b>No renovables:</b> s'esgoten (petroli, gas, minerals). <b>Desenvolupament sostenible:</b> satisfer les necessitats d'avui sense posar en perill les de les generacions futures.",
      gen: function (r, ctx) {
        var rec = [['l\'energia solar', 0], ['el petroli', 1], ['el cotó', 0], ['el coure dels cables', 1], ['el vent', 0], ['el gas natural', 1], ["la fusta d'un bosc gestionat", 0], ['el liti de les bateries', 1]];
        var sos = [
          ["Duplicar els hivernacles encara que s'esgoti l'aqüífer del poble.", 1], ['Fer melmelada amb fruita que es llençaria.', 0],
          ['Comprar tela nova cada setmana i llençar-ne els retalls.', 1], ['Reparar carregadors en lloc de comprar-ne de nous.', 0],
          ['Regar els horts amb aigua de pluja recollida.', 0], ['Imprimir tots els cartells en paper nou i en color cada setmana.', 1]
        ];
        var steps = CE.shuffle(r, rec).slice(0, 3).map(function (it) { return { q: '<b>' + cap(it[0]) + '</b> és un recurs…', type: 'choice', opts: ['Renovable', 'No renovable'], ans: it[1], hint: 'Es regenera de manera natural o s\'acaba?', line: cap(it[0]) + ' → ' + (it[1] ? 'no renovable' : 'renovable') }; })
          .concat(classify(r, sos, 2, ['Sostenible', 'No sostenible'], function (it) { return '«' + it[0] + '» És una decisió sostenible?'; }, 'Pensa si es podria continuar fent sempre sense esgotar recursos ni generar residus.'));
        return { intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> vol produir sense malbaratar recursos.', steps: steps };
      } },

    { id: 'ENQ', titol: "De l'enquesta a la demanda", sabers: 'Tabular una enquesta, demanda i preu justificat',
      recorda: "A l'enquesta pregunteu: «Quant pagaries com a màxim?». A cada preu, la <b>quantitat demandada</b> és el nombre de persones que pagarien <b>aquest preu o més</b>. <b>Ingressos previstos = preu × quantitat demandada.</b>",
      gen: function (r, ctx) {
        var preus = [2, 3, 4, 5, 6], cnt, qd, ing, best, tries = 0;
        do {
          cnt = preus.map(function () { return CE.int(r, 2, 7); });
          qd = preus.map(function (p, i) { return cnt.slice(i).reduce(function (a, b) { return a + b; }, 0); });
          ing = preus.map(function (p, i) { return p * qd[i]; });
          var mx = Math.max.apply(null, ing); best = ing.indexOf(mx);
          tries++;
        } while (ing.filter(function (x) { return x === Math.max.apply(null, ing); }).length > 1 && tries < 50);
        var total = qd[0], a = CE.int(r, 2, 4), b = a - 1;
        var p = CE.prod(r, ctx);
        return {
          intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> ha fet una enquesta sobre el seu producte (' + p.pl + ') amb la pregunta «Quant pagaries com a màxim?». Respostes:' +
            '<table class="tbl"><tr><th>Preu màxim</th>' + preus.map(function (x) { return '<td>' + eur(x) + '</td>'; }).join('') + '</tr><tr><th>Persones</th>' + cnt.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr></table>',
          steps: [
            { q: 'Quantes persones han respost l\'enquesta?', type: 'num', ans: total, unit: 'persones', hint: 'Suma totes les respostes.', line: 'Total = ' + cnt.join(' + ') + ' = ' + total + ' persones' },
            { q: 'Si el preu és de <b>' + eur(preus[a]) + '</b>, quantes persones el comprarien?', type: 'num', ans: qd[a], unit: 'persones', hint: 'Suma els que pagarien ' + eur(preus[a]) + ' o més.', line: 'A ' + eur(preus[a]) + ': ' + cnt.slice(a).join(' + ') + ' = ' + qd[a] },
            { q: 'I si el preu és de <b>' + eur(preus[b]) + '</b>?', type: 'num', ans: qd[b], unit: 'persones', hint: 'Suma els que pagarien ' + eur(preus[b]) + ' o més.', line: 'A ' + eur(preus[b]) + ': ' + cnt.slice(b).join(' + ') + ' = ' + qd[b] },
            { q: 'Quins ingressos tindrien amb un preu de ' + eur(preus[a]) + '?', type: 'num', ans: ing[a], unit: '€', hint: 'Preu × quantitat demandada.', line: 'Ingressos = ' + f(preus[a]) + ' × ' + qd[a] + ' = ' + eur(ing[a]) },
            { q: 'Quin preu donaria <b>més ingressos</b>?', type: 'choice', opts: preus.map(function (x) { return eur(x); }), ans: best, hint: 'Calcula preu × quantitat demandada per a cada preu.', line: 'Ingressos: ' + preus.map(function (x, i) { return f(x) + ' € → ' + f(ing[i]); }).join(' · ') + ' → millor ' + eur(preus[best]) }
          ] };
      } },

    /* ---------- U3 ---------- */
    { id: 'ESE', titol: 'Tres escenaris', sabers: 'Pla de viabilitat: escenari pessimista, realista i optimista',
      recorda: "Un pla de viabilitat calcula el resultat en tres <b>escenaris</b>: <b>pessimista</b> (es ven poc), <b>realista</b> (el més probable) i <b>optimista</b> (es ven molt). <b>Benefici = preu × quantitat − (CF + CVu × quantitat).</b>",
      gen: function (r, ctx) {
        var m = CE.pick(r, [2, 2.5, 3, 4, 5]), pm = CE.int(r, 15, 40), cf = r2(m * pm), cvu = CE.pick(r, [1, 1.5, 2, 2.5]), pr = r2(cvu + m);
        var qp = pm + (r() < 0.6 ? -CE.int(r, 3, 10) : CE.int(r, 2, 6)), qr = pm + CE.int(r, 5, 15), qo = qr + CE.int(r, 10, 25);
        var B = function (q) { return r2(pr * q - cf - cvu * q); };
        var p = CE.prod(r, ctx);
        var loss = B(qp) < 0;
        return {
          intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> ven ' + p.pl + ' a ' + eur(pr) + '. Cost per unitat: ' + eur(cvu) + '. Costos fixos: ' + eur(cf) + '. Escenaris de vendes: <b>pessimista ' + qp + '</b>, <b>realista ' + qr + '</b> i <b>optimista ' + qo + '</b> unitats.',
          steps: [
            { q: 'Quin és el resultat de l\'escenari <b>pessimista</b>? (signe menys si són pèrdues)', type: 'num', ans: B(qp), unit: '€', hint: 'Ingressos − cost total, amb ' + qp + ' unitats.', line: 'Pessimista: ' + f(pr) + ' × ' + qp + ' − (' + f(cf) + ' + ' + f(cvu) + ' × ' + qp + ') = ' + eur(B(qp)) },
            { q: 'I el de l\'escenari <b>realista</b>?', type: 'num', ans: B(qr), unit: '€', hint: 'El mateix càlcul amb ' + qr + ' unitats.', line: 'Realista: ' + eur(B(qr)) },
            { q: 'I el de l\'escenari <b>optimista</b>?', type: 'num', ans: B(qo), unit: '€', hint: 'El mateix càlcul amb ' + qo + ' unitats.', line: 'Optimista: ' + eur(B(qo)) },
            { q: 'Quin és el <b>punt mort</b>?', type: 'num', ans: pm, unit: 'u.', hint: 'CF ÷ (preu − CVu).', line: 'Punt mort = ' + f(cf) + ' ÷ ' + f(m) + ' = ' + pm + ' unitats' },
            { q: 'Quina conclusió de viabilitat és correcta?', type: 'choice', opts: ['És viable fins i tot en l\'escenari pessimista', 'És viable en el realista i l\'optimista, però el pessimista dona pèrdues', 'No és viable en cap escenari'], ans: loss ? 1 : 0, hint: 'Mira el signe del resultat de cada escenari.', line: loss ? 'Pessimista amb pèrdues; realista i optimista amb benefici' : 'Tots tres escenaris donen benefici' }
          ] };
      } },

    { id: 'ORG', titol: "Qui fa què a l'empresa", sabers: "Elements de l'empresa, organigrama i rols",
      recorda: "Elements de l'empresa: <b>persones</b> (socis i treballadors), <b>capital</b> (diners i béns), <b>organització</b> (qui fa què: l'organigrama) i <b>entorn</b> (clients, proveïdors, competència, sector públic). A les vostres cooperatives hi ha quatre rols: Coordinació, Dades, Tresoreria i Comunicació.",
      gen: function (r, ctx) {
        var rols = ['Coordinació', 'Dades', 'Tresoreria', 'Comunicació'];
        var tasks = [
          ['Calcula el punt mort i porta els comptes.', 2], ['Busca quant menjar es llença a Catalunya i en revisa la font.', 1],
          ['Vigila el temps i que tothom participi a la reunió.', 0], ['Prepara la presentació i parla amb l\'altra cooperativa.', 3],
          ['Omple el diari de sessions del full de ruta.', 0], ["Fa el gràfic amb els resultats de l'enquesta.", 1],
          ['Calcula el preu a partir dels costos.', 2], ['Parla amb la docent quan hi ha un dubte de l\'equip.', 3]
        ];
        var elem = [['Les persones sòcies de la cooperativa', 0], ['Els diners que aporta cada persona sòcia', 1], ['El repartiment de rols i tasques', 2], ['Els proveïdors de tela i les altres botigues del barri', 3], ['Les eines i el material de treball', 1], ['Els clients que compren a la parada', 3]];
        var steps = classify(r, tasks, 3, rols, function (it) { return '«' + it[0] + '» Quin rol ho fa?'; }, 'Rellegeix què fa cada rol al «Recorda».')
          .concat(classify(r, elem, 2, ['Persones', 'Capital', 'Organització', 'Entorn'], function (it) { return '«' + it[0] + '» Quin element de l\'empresa és?'; }, 'Són persones, diners o béns, la manera d\'organitzar-se o el que hi ha fora de l\'empresa?'));
        return { intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> prepara el seu organigrama per al dossier.', steps: steps };
      } },

    { id: 'RSC', titol: 'Verd de veritat o de màrqueting?', sabers: 'Responsabilitat social corporativa i rentat verd',
      recorda: "La <b>responsabilitat social corporativa (RSC)</b> són els compromisos d'una empresa amb les persones i el planeta més enllà del que demana la llei. El <b>rentat verd</b> és presentar-se com a ecològic sense fets que ho demostrin. Un bon compromís és <b>mesurable</b>: diu què, quant i quan.",
      gen: function (r, ctx) {
        var msg = [
          ['«Som 100 % naturals i respectuosos amb el planeta», sense cap dada.', 1], ['«El 80 % de la nostra tela és roba reciclada», certificat per una entitat externa.', 0],
          ['«Eco-friendly» en lletres verdes en una ampolla de plàstic d\'un sol ús.', 1], ['«Aquest any hem reduït un 30 % els residus», amb les dades publicades a la web.', 0],
          ['La foto d\'un bosc a l\'anunci d\'una empresa de cotxes de gasolina.', 1], ['«Reutilitzem 9 de cada 10 pots que ens retornen», amb un recompte setmanal.', 0]
        ];
        var comp = CE.pick(r, [
          ['Reutilitzarem com a mínim 50 pots aquest trimestre.', 'Serem molt sostenibles.', 'Cuidarem el planeta.'],
          ['Donarem el 10 % del benefici a un projecte del barri abans de juny.', 'Ajudarem tant com puguem.', 'Serem una empresa solidària.'],
          ['Farem servir només roba reciclada en el 100 % de les bosses a partir de gener.', 'Intentarem contaminar menys.', 'Ens importa el medi ambient.']
        ]);
        var opts = CE.shuffle(r, comp.map(function (t, i) { return [t, i === 0]; }));
        var steps = classify(r, msg, 3, ['Verd de veritat', 'Rentat verd'], function (it) { return it[0] + ' És verd de veritat o rentat verd?'; }, 'Hi ha dades o proves que ho demostrin?');
        steps.push({ q: 'Quin d\'aquests compromisos és <b>mesurable</b>?', type: 'choice', opts: opts.map(function (o) { return o[0]; }), ans: opts.findIndex(function (o) { return o[1]; }), hint: 'Busca el que diu què, quant i quan.', line: 'Compromís mesurable: «' + comp[0] + '»' });
        return { intro: 'La cooperativa <b>' + CE.esc(ctx.coop) + '</b> vol ser responsable i no fer rentat verd. Analitza aquests missatges.', steps: steps };
      } },

    { id: 'CU3', titol: "Caça l'error", sabers: 'Errors típics de la fase 3',
      recorda: 'Errors habituals: oblidar els costos fixos, restar en lloc de dividir al punt mort, pensar que a la cooperativa vota més qui posa més diners o creure que una frase verda sense dades és RSC.',
      gen: function (r, ctx) {
        return caca(r, ctx, [
          ['A la cooperativa, qui aporta més capital té més vots.', ['Cada persona sòcia té un vot, independentment del capital.', 'Només vota el president.', 'Vota qui treballa més hores.']],
          ['El punt mort es calcula restant el marge als costos fixos.', ['El punt mort es calcula dividint els costos fixos entre el marge unitari.', 'El punt mort és el preu de venda.', 'El punt mort és igual als costos variables.']],
          ['Un autònom només respon dels deutes amb els diners del negoci.', ['Respon també amb els seus béns personals: responsabilitat il·limitada.', 'Els deutes els paga Hisenda.', 'No pot tenir deutes.']],
          ['Posar «eco» a l\'etiqueta ja és responsabilitat social.', ['La RSC necessita compromisos mesurables i fets que ho demostrin.', 'La RSC és obligatòria per llei.', 'La RSC només són donacions.']],
          ['Si el pessimista dona pèrdues, el projecte segur que no és viable.', ['Cal mirar els tres escenaris i el punt mort abans de decidir.', 'Només compta l\'escenari optimista.', 'Els escenaris no serveixen per decidir.']]
        ], ['El cost total inclou els costos fixos i els variables.', 'Per constituir una cooperativa catalana calen 3.000 € de capital.', 'Un compromís mesurable diu què, quant i quan.', 'Per sobre del punt mort hi ha benefici.', 'A la cooperativa, cada persona sòcia té un vot.'], 'La tresorera');
      } }
  ] });
})();
