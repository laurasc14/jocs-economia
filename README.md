# Corbatera Coop Lab · Economia

Gamificació d'**Economia · 4t ESO** (Corbatera Institut Escola, curs 2026–2027) dins de la situació d'aprenentatge «Crea la teva cooperativa».
Cada alumne crea el seu **carnet de soci/a** amb el nom de la cooperativa del seu equip, i resol missions **pas a pas**. Tot el procés (respostes, intents fallits, pistes) queda registrat en un **diari de procés** que es descarrega com a informe.

**App:** <https://laurasc14.github.io/jocs-economia/>

## Contingut

| Nivell | Tema | Estat |
| --- | --- | --- |
| **1 · Per què existeix la cooperativa?** | Economia i escassetat | **Fet** |
| **2 · Constituïm la cooperativa** | Empresa i cooperativa | **Fet** |
| **3 · Els números de la cooperativa** | Costos, benefici i punt mort | **Fet** |
| 4 · Sortim al mercat | Oferta, demanda i preu | Properament |
| 5 · Viure del teu sou | Nòmina i pressupost | Properament |

Nivell 1:

| Fase | Missió | Sabers |
| --- | --- | --- |
| 1 | Necessitats i béns | Necessitats, béns i serveis, béns lliures |
| 2 | Triar és renunciar | Escassetat i cost d'oportunitat |
| 3 | Què, com i per a qui | Les tres preguntes bàsiques |
| 4 | Els factors de producció | Terra, treball, capital, iniciativa i remuneracions |
| 5 | Qui és qui al flux circular | Agents econòmics i mercats |
| 6 | Caça l'error | Errors típics del tema |
| BOSS | Assemblea final | Un exercici de cada fase, sense pistes |

Nivell 2:

| Fase | Missió | Sabers |
| --- | --- | --- |
| 1 | De quin sector ets? | Sectors primari, secundari i terciari |
| 2 | Quina forma jurídica? | Autònom, SL, SA, cooperativa i responsabilitat |
| 3 | Un soci, un vot | Gestió democràtica i majoria |
| 4 | Repartim els excedents | Fons de reserva i retorn segons l'activitat |
| 5 | Els principis cooperatius | Principis de les cooperatives |
| 6 | Caça l'error | Errors típics del tema |
| BOSS | Assemblea final | Un exercici de cada fase, sense pistes |

Nivell 3:

| Fase | Missió | Sabers |
| --- | --- | --- |
| 1 | Fixos o variables? | Costos fixos i variables |
| 2 | Quant costa produir? | Cost variable unitari i cost total |
| 3 | Guanyem o perdem? | Ingressos i benefici |
| 4 | El punt mort | Marge unitari i punt mort |
| 5 | No oblidis l'IVA | Tipus d'IVA, quota i preu final |
| 6 | Caça l'error | Errors típics amb costos i punt mort |
| BOSS | Assemblea final | Un exercici de cada fase, sense pistes |

## Estudi (teoria)

`estudi.html` és l'apartat de teoria del trimestre (temes 1 a 5): definicions, fórmules, exemples resolts, errors típics i esquemes, amb índex, cercador i opció d'imprimir o desar en PDF.

- Al mapa hi ha una targeta **Estudi** a dalt de tot.
- Dins de cada missió, el «Recorda» té un enllaç **Teoria completa d'aquest tema →**.
- Cada apartat té botons **Practica-ho** que obren la missió corresponent (`index.html#jugar=N3M4`). Si està bloquejada, l'app ho avisa.
- `repas-teoria.html` («Posa't a prova», a la secció A classe) té preguntes de comprovació, targetes i reptes per tema.

## Com funciona

- **Carnet de soci/a:** nom de l'alumne, nom de la cooperativa (equip), logotip i color. El color del carnet tenyeix tota l'app.
- **Pas a pas:** cada exercici està dividit en passos. Fins que un pas no és correcte no apareix el següent, i els passos resolts queden escrits com un procediment.
- **Nombres personalitzats:** es generen a partir del nom de l'alumne; cada partida nova té nombres nous.
- **XP:** 10 XP per pas a la primera; −3 per cada intent fallit (mínim 3); amb pista, màxim 5; si es mostra la solució (després de 3 intents), 0 XP. Compta la millor partida.
- **Rangs:** Aspirant (0) → Soci/a en prova (150) → Soci/a (400) → Tresorer/a (750) → Coordinador/a (1.100) → Presidència (1.500 XP).
- **Boss (Assemblea final):** sense pistes; cal un 60 % dels XP.
- **Desbloqueig:** les fases s'obren en ordre. Per obrir totes les fases d'un nivell fet a classe, afegeix-lo a `var ENTRENAMENT = [];` a `js/app.js` (per exemple, `['N3']`).
- **Diari i informe:** el botó *Descarrega l'informe* genera un HTML amb el resum i el procés de cada exercici (intents fallits ratllats). Es pot desar com a PDF. L'alumnat el penja a Classroom.

### Mode docent

`https://laurasc14.github.io/jocs-economia/?docent` obre totes les missions i mostra la Lliga i la Borsa.

### Enllaç directe a una missió

`index.html#jugar=N3M4` obre la fase 4 del nivell 3 (si està desbloquejada).

### On es guarda el progrés

Al navegador de cada ordinador (`localStorage`). Si diversos alumnes comparteixen ordinador, cadascú entra amb el seu carnet. Si s'esborra el navegador o es canvia d'ordinador, el progrés es perd: cal descarregar l'informe en acabar cada sessió.

## A classe

Des del mapa s'accedeix a: Posa't a prova (`repas-teoria.html`), Entrenament lliure (`exercicis-calcul.html`), Calculadora de la cooperativa, Kit del pitch, El mercat del pa, La caixa de la cooperativa (escape room), La vida en daus i Qui vol ser ric?

Eines de la professora (no surten al mapa de l'alumnat): `lliga-cooperativa.html` i `borsa-classe.html`.

## Estructura

```
index.html        l'app (carnet, mapa, missions, diari)
estudi.html       apartat d'estudi: teoria dels temes 1 a 5
css/estil.css     estil de l'app
css/estudi.css    estil de l'apartat d'estudi (i de la versió impresa)
js/util.js        utilitats: atzar amb llavor, format, lectura de respostes
js/nivell1.js     missions del Nivell 1
js/nivell2.js     missions del Nivell 2
js/nivell3.js     missions del Nivell 3
js/app.js         motor: carnet, mapa, passos, XP, rangs, diari i informe
*.html            jocs i eines de classe
```

Per afegir un nivell nou n'hi ha prou de crear `js/nivellN.js` amb el mateix format (`CE.NIVELLS.push({...})`) i enllaçar-lo a `index.html` abans d'`app.js`.

---

Docent: Laura · Corbatera Institut Escola
