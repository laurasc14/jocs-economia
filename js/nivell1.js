/* Nivell 1 · Per què existeix la cooperativa? (economia i escassetat) */
(function () {
  var f = CE.f, eur = CE.eur;
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function classify(r, pool, n, opts, qfn, hintfn) {
    return CE.shuffle(r, pool).slice(0, n).map(function (it) {
      return { q: qfn(it), type: 'choice', opts: opts, ans: it[1], hint: hintfn(it), line: cap(it[0]) + ' → ' + opts[it[1]].toLowerCase() };
    });
  }

  CE.NIVELLS.push({
    id: 'N1', num: 1, titol: 'Per què existeix la cooperativa?', tema: 'Economia i escassetat',
    teoria: 'estudi.html#t1',
    missions: [

      { id: 'M1', titol: 'Necessitats i béns', sabers: 'Necessitats, béns i serveis, béns lliures',
        recorda: '<b>Necessitat primària:</b> imprescindible per viure. <b>Secundària:</b> millora la qualitat de vida. <b>Bé:</b> cosa material; <b>servei:</b> activitat. <b>Bé lliure:</b> abundant i sense preu; <b>bé econòmic:</b> escàs i amb preu.',
        gen: function (r, ctx) {
          var nec = [['menjar cada dia', 0], ['tenir un lloc on dormir', 0], ['beure aigua', 0], ['anar al metge quan estàs malalt', 0], ['tenir una consola', 1], ['anar a un concert', 1], ['estrenar unes bambes de marca', 1], ['fer un viatge a París', 1]];
          var bs = [['un entrepà', 0], ['un tall de cabells', 1], ['una samarreta', 0], ['una classe de repàs', 1], ['un bitllet de bus', 1], ['una bossa de roba', 0], ['una reparació del mòbil', 1]];
          var ll = [["l'aire que respirem", 0], ['la llum del sol', 0], ['una ampolla d\'aigua', 1], ['una barra de pa', 1], ['la tela per fer bosses', 1]];
          var steps = classify(r, nec, 2, ['Primària', 'Secundària'], function (it) { return 'Quin tipus de necessitat és <b>' + it[0] + '</b>?'; }, function () { return 'Podries viure sense? Si la resposta és no, és primària.'; });
          steps = steps.concat(classify(r, bs, 1, ['Bé', 'Servei'], function (it) { return '<b>' + cap(it[0]) + '</b> és un bé o un servei?'; }, function () { return 'Es pot tocar i guardar? Llavors és un bé. Si és una activitat que algú fa per tu, és un servei.'; }));
          steps = steps.concat(classify(r, ll, 1, ['Bé lliure', 'Bé econòmic'], function (it) { return '<b>' + cap(it[0]) + '</b> és un bé lliure o econòmic?'; }, function () { return 'Has de pagar per tenir-ho? Llavors és escàs: bé econòmic.'; }));
          return { intro: 'Abans de crear <b>' + CE.esc(ctx.coop) + '</b>, l\'equip analitza quines necessitats tenen les persones i amb què les satisfan.', steps: steps };
        } },

      { id: 'M2', titol: 'Triar és renunciar', sabers: "Escassetat i cost d'oportunitat",
        recorda: "El <b>cost d'oportunitat</b> és el valor de la <b>millor alternativa</b> a què renuncies quan tries una opció. No és la suma de totes les alternatives, només la millor.",
        gen: function (r, ctx) {
          var vals = CE.shuffle(r, [15, 20, 25, 30, 35, 40, 45]);
          var alts = CE.shuffle(r, ['fer de cangur', 'ajudar a la botiga del barri', 'repartir propaganda', 'donar classes de repàs']).slice(0, 3).map(function (n, i) { return [n, vals[i]]; });
          var srt = alts.slice().sort(function (a, b) { return b[1] - a[1]; });
          var best = srt[0], second = srt[1];
          var hores = CE.int(r, 2, 4);
          var opts = alts.map(function (a) { return cap(a[0]); });
          return {
            intro: 'Dissabte al matí (' + hores + ' hores) has d\'estar a la parada de la cooperativa <b>' + CE.esc(ctx.coop) + '</b>, sense cobrar. En lloc d\'això podries: ' + alts.map(function (a) { return a[0] + ' (' + eur(a[1]) + ')'; }).join(', ') + '. Només pots fer una cosa.',
            steps: [
              { q: 'Vas a la parada. Quina és la <b>millor alternativa</b> a què renuncies?', type: 'choice', opts: opts, ans: alts.indexOf(best), hint: 'Busca la que et donaria més diners.', line: 'Millor alternativa: ' + best[0] },
              { q: "Quin és el teu <b>cost d'oportunitat</b> en euros?", type: 'num', ans: best[1], unit: '€', hint: 'Només compta la millor alternativa, no les sumis totes.', line: "Cost d'oportunitat = " + eur(best[1]) },
              { q: 'I si l\'equip et deixa lliure i tries <b>' + best[0] + '</b>, quin seria el cost d\'oportunitat?', type: 'num', ans: second[1], unit: '€', hint: 'Ara la millor alternativa a què renuncies és una altra: la segona millor.', line: 'Si tries ' + best[0] + ': cost d\'oportunitat = ' + eur(second[1]) + ' (' + second[0] + ')' }
            ] };
        } },

      { id: 'M3', titol: 'Què, com i per a qui', sabers: 'Les tres preguntes bàsiques de l\'economia',
        recorda: 'Tota economia ha de decidir <b>què</b> produir (i quant), <b>com</b> produir-ho (amb quins recursos i tècniques) i <b>per a qui</b> (com es reparteix).',
        gen: function (r, ctx) {
          var pool = [['Fem bosses de roba o samarretes?', 0], ['Quantes unitats fem aquest mes?', 0], ['Les pintem a mà o amb plantilles?', 1], ['Comprem una màquina de cosir o les cosim a mà?', 1], ['Ens organitzem en torns o tothom fa de tot?', 1], ['Les venem a alumnes o a famílies del barri?', 2], ['Com repartim els diners que sobrin entre els socis?', 2], ['Fem un preu especial per a qui no s\'ho pot permetre?', 2]];
          var opts = ['Què produir', 'Com produir', 'Per a qui produir'];
          return { intro: 'A la primera reunió de la cooperativa <b>' + CE.esc(ctx.coop) + '</b> surten aquestes preguntes. Classifica cadascuna segons la pregunta bàsica de l\'economia que respon.',
            steps: CE.shuffle(r, pool).slice(0, 4).map(function (it) {
              return { q: '«' + it[0] + '»', type: 'choice', opts: opts, ans: it[1], hint: it[1] === 0 ? 'Parla del producte o de la quantitat?' : 'Pensa si parla del producte, de la manera de fer-lo o de qui el rebrà.', line: '«' + it[0] + '» → ' + opts[it[1]].toLowerCase() };
            }) };
        } },

      { id: 'M4', titol: 'Els factors de producció', sabers: 'Terra, treball, capital i iniciativa empresarial',
        recorda: '<b>Terra:</b> recursos naturals. <b>Treball:</b> esforç de les persones. <b>Capital:</b> màquines, eines, edificis. <b>Iniciativa empresarial:</b> organitzar i assumir riscos. Remuneracions: renda, salari, interès i benefici.',
        gen: function (r, ctx) {
          var pool = [['les hores que l\'equip dedica a pintar', 1], ['la màquina de cosir', 2], ['els pinzells i les plantilles', 2], ["l'aigua per rentar els pinzells", 0], ['el cotó de la tela', 0], ['la idea de crear la cooperativa i assumir el risc', 3], ['el portàtil per portar els comptes', 2], ['les hores a la parada venent', 1]];
          var opts = ['Terra', 'Treball', 'Capital', 'Iniciativa'];
          var steps = CE.shuffle(r, pool).slice(0, 4).map(function (it) {
            return { q: 'Classifica aquest recurs: <b>' + it[0] + '</b>.', type: 'choice', opts: opts, ans: it[1], hint: 'Ve de la natura? És esforç humà? És una eina o màquina? És organitzar i arriscar?', line: cap(it[0]) + ' → ' + opts[it[1]].toLowerCase() };
          });
          var rem = CE.pick(r, [['treball', 'Salari', 1], ['capital', 'Interès', 2], ['terra', 'Renda', 0]]);
          steps.push({ q: 'Quina remuneració rep el factor <b>' + rem[0] + '</b>?', type: 'choice', opts: ['Renda', 'Salari', 'Interès', 'Benefici'], ans: rem[2], hint: 'Terra → renda, treball → salari, capital → interès, iniciativa → benefici.', line: cap(rem[0]) + ' → ' + rem[1].toLowerCase() });
          return { intro: 'Per fer funcionar <b>' + CE.esc(ctx.coop) + '</b> calen recursos. Classifica\'ls.', steps: steps };
        } },

      { id: 'M5', titol: 'Qui és qui al flux circular', sabers: 'Agents econòmics i mercats',
        recorda: '<b>Famílies:</b> consumeixen i ofereixen treball. <b>Empreses:</b> produeixen i contracten. <b>Sector públic:</b> cobra impostos i ofereix serveis públics. Al <b>mercat de béns</b> es compren productes; al <b>mercat de factors</b>, treball i recursos.',
        gen: function (r, ctx) {
          var ag = [['La teva família compra una bossa a la parada.', 0], ['La cooperativa compra tela a un majorista.', 1], ["L'Ajuntament cobra la taxa de la parada del mercat.", 2], ["L'institut públic us deixa l'aula per treballar.", 2], ['Una veïna treballa a la botiga del barri i cobra un sou.', 0], ['La cooperativa ven bosses a les famílies.', 1]];
          var mk = [['Compres una samarreta a la parada.', 0], ['Treballes els caps de setmana i et paguen un sou.', 1], ['Una empresa lloga un local per fer-hi la botiga.', 1], ['Una família compra pa a la fleca.', 0], ['La cooperativa contracta una persona per fer el web.', 1]];
          var a = CE.shuffle(r, ag).slice(0, 2), m = CE.shuffle(r, mk).slice(0, 2);
          var oa = ['Famílies', 'Empreses', 'Sector públic'], om = ['Mercat de béns i serveis', 'Mercat de factors'];
          var steps = a.map(function (it) { return { q: it[0] + ' Qui actua com a protagonista?', type: 'choice', opts: oa, ans: it[1], hint: 'Qui pren la decisió: algú que consumeix, algú que produeix o l\'administració?', line: it[0] + ' → ' + oa[it[1]].toLowerCase() }; })
            .concat(m.map(function (it) { return { q: it[0] + ' En quin mercat passa?', type: 'choice', opts: om, ans: it[1], hint: 'Es compra un producte o es contracta un recurs per produir (treball, local…)?', line: it[0] + ' → ' + om[it[1]].toLowerCase() }; }));
          return { intro: '<b>' + CE.esc(ctx.coop) + '</b> forma part del flux circular de la renda. Identifica els agents i els mercats.', steps: steps };
        } },

      { id: 'M6', titol: "Caça l'error", sabers: 'Errors típics del tema',
        recorda: "Errors habituals: pensar que el cost d'oportunitat són sempre diners, confondre béns lliures i econòmics o pensar que les necessitats tenen límit.",
        gen: function (r, ctx) {
          var bugs = [
            ["El cost d'oportunitat és la suma de totes les alternatives a què renuncies.", ["Només compta la millor alternativa a què renuncies.", 'És el preu del que compres.', 'Només existeix si hi ha diners pel mig.']],
            ["L'aigua embotellada és un bé lliure perquè l'aigua és natural.", ["És un bé econòmic: és escassa i té preu.", 'És un servei.', 'És una necessitat secundària.']],
            ["Les necessitats humanes són limitades: quan en tens prou, no en vols més.", ["Les necessitats són il·limitades; els recursos són limitats.", 'Les necessitats només són primàries.', 'Els recursos són il·limitats.']],
            ['Una màquina de cosir és un factor treball.', ['És capital: una eina que serveix per produir.', 'És terra.', 'És un bé lliure.']],
            ["Si no hi ha diners pel mig, no hi ha cost d'oportunitat.", ["El cost d'oportunitat també pot ser temps, oci o descans.", 'Només hi ha cost si pagues.', "El cost d'oportunitat sempre és zero."]]
          ];
          var ok = [
            "L'escassetat obliga a triar.", 'Un tall de cabells és un servei.', "Les famílies ofereixen treball a les empreses.", "Menjar és una necessitat primària.", "Tota societat ha de decidir què, com i per a qui produir."
          ];
          var b = CE.pick(r, bugs), oks = CE.shuffle(r, ok).slice(0, 2);
          var lines = CE.shuffle(r, [[b[0], true], [oks[0], false], [oks[1], false]]);
          var wrong = lines.findIndex(function (l) { return l[1]; });
          var corr = CE.shuffle(r, b[1].map(function (t, i) { return [t, i === 0]; }));
          return {
            intro: 'Un soci de la cooperativa <b>' + CE.esc(ctx.coop) + '</b> ha escrit aquestes frases per a la presentació, però una és falsa:<ol class="bugs">' + lines.map(function (l) { return '<li>' + l[0] + '</li>'; }).join('') + '</ol>',
            steps: [
              { q: 'Quina frase és falsa?', type: 'choice', opts: ['Frase 1', 'Frase 2', 'Frase 3'], ans: wrong, hint: 'Rellegeix les definicions del «Recorda».', line: 'La frase falsa és la ' + (wrong + 1) },
              { q: 'Com s\'hauria de corregir?', type: 'choice', opts: corr.map(function (c) { return c[0]; }), ans: corr.findIndex(function (c) { return c[1]; }), hint: 'Tria la frase que és certa i que respon a l\'error.', line: 'Correcció: ' + b[1][0] }
            ] };
        } }
    ]
  });
})();
