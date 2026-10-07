/* Corbatera Coop Lab · nivells = fases de la SA «Res no es llença» (1a avaluació) i projecte «Quant costa viure pel teu compte?» (2a avaluació) */
(function () {
  function bank(id) { for (var i = 0; i < CE.BANC.length; i++) if (CE.BANC[i].id === id) return CE.BANC[i]; throw new Error('Banc ' + id); }
  function m(bankId, misId) {
    var b = bank(bankId), x = b.missions.filter(function (y) { return y.id === misId; })[0];
    if (!x) throw new Error('Missió ' + bankId + '/' + misId);
    var c = {}; for (var k in x) c[k] = x[k]; return c;
  }
  function nivell(id, num, titol, tema, fita, teoria, list) {
    var ms = list.map(function (p, i) { var c = m(p[0], p[1]); c.id = 'M' + (i + 1); return c; });
    CE.NIVELLS.push({ id: id, num: num, titol: titol, tema: tema, fita: fita, teoria: teoria, missions: ms });
  }

  nivell('N1', 1, 'El problema', 'Fase 1 · U1 · Escassetat, decisions i mirades econòmiques', 'Fita 1 · 13/10', 'estudi.html#u1', [
    ['NOU', 'ESC'],   // 1 Escassetat o repartiment?
    ['N1', 'M2'],     // 2 Triar és renunciar (cost d'oportunitat)
    ['NOU', 'IRR'],   // 3 Diners que no tornen (costos irrecuperables)
    ['NOU', 'MAR'],   // 4 Pensar al marge (anàlisi marginal i incentius)
    ['NOU', 'PNM'],   // 5 Positiu o normatiu? Micro o macro?
    ['N1', 'M3'],     // 6 Què, com i per a qui
    ['N1', 'M4'],     // 7 Factors de producció
    ['NOU', 'PLU'],   // 8 Economies plurals, drets i deures
    ['NOU', 'DAD'],   // 9 Dades amb font (Fita 1, criteri 3.1)
    ['N1', 'M6']      // 10 Caça l'error
  ]);

  nivell('N2', 2, 'El mercat', 'Fase 2 · U2 · Productivitat, preus i mercat', 'Fita 2 · 10/11', 'estudi.html#u2', [
    ['NOU', 'PRO'],   // 1 La fàbrica de la cooperativa (productivitat)
    ['NOU', 'SOS'],   // 2 Produir sense malbaratar (sostenibilitat)
    ['N4', 'M1'],     // 3 Les lleis del mercat
    ['N4', 'M2'],     // 4 Llegeix la taula
    ['N4', 'M3'],     // 5 Troba l'equilibri
    ['N4', 'M4'],     // 6 Es mou la demanda o l'oferta?
    ['N1', 'M5'],     // 7 Qui és qui al flux circular
    ['NOU', 'ENQ'],   // 8 De l'enquesta a la demanda
    ['N4', 'M6']      // 9 Caça l'error
  ]);

  nivell('N3', 3, 'El pla', 'Fase 3 · U3 · Comptes, forma jurídica i responsabilitat', 'Dossier 27/11 · Pitch 01/12', 'estudi.html#u3', [
    ['N3', 'M1'],     // 1 Fixos o variables?
    ['N3', 'M3'],     // 2 Guanyem o perdem?
    ['N3', 'M4'],     // 3 El punt mort
    ['NOU', 'ESE'],   // 4 Tres escenaris
    ['N2', 'M2'],     // 5 Quina forma jurídica?
    ['N2', 'M3'],     // 6 Un soci, un vot
    ['N2', 'M5'],     // 7 Els principis cooperatius
    ['NOU', 'ORG'],   // 8 Qui fa què a l'empresa
    ['NOU', 'RSC'],   // 9 Verd de veritat o de màrqueting?
    ['NOU', 'CU3']    // 10 Caça l'error
  ]);

  // 2a avaluació · Projecte «Quant costa viure pel teu compte?» (pressupost mensual, nòmina i imprevist)
  nivell('N4', 4, 'Quant costa viure pel teu compte?', '2a avaluació · Necessitats, nòmina, pressupost i imprevistos', 'Projecte del 2n trimestre · des del 15/12', 'estudi-2.html#u4', [
    ['VIU', 'NEC'],   // 1 Necessitat o desig? (llista de despeses d'una llar, S26)
    ['VIU', 'NOM'],   // 2 Llegeix la nòmina
    ['VIU', 'PAR'],   // 3 Les paraules de la nòmina
    ['VIU', 'FIX'],   // 4 Fixes o variables?
    ['VIU', 'PRE'],   // 5 Quadra el pressupost
    ['VIU', 'REG'],   // 6 La regla 50/30/20
    ['VIU', 'IMP'],   // 7 Imprevistos i deute
    ['VIU', 'TER'],   // 8 Al comptat o a terminis?
    ['VIU', 'CAC']    // 9 Caça l'error
  ]);
})();
