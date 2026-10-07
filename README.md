# Corbatera Coop Lab · Economia Bàsica

Gamificació d'**Economia Bàsica · 4t ESO** (Corbatera Institut Escola, curs 2026–2027), feta a partir de la programació de la 1a avaluació: SA **«Res no es llença. De l'illa de les flors a la nostra cooperativa»**.
Cada alumne crea el seu **carnet de soci/a** amb el nom de la seva cooperativa i la ruta del projecte (A · Aliments, B · Tèxtil, C · Aparells), i resol missions **pas a pas**. Els enunciats fan servir el nom de la cooperativa i productes de la seva ruta. Tot el procés queda registrat en un **diari** que es descarrega com a informe.

**App:** <https://laurasc14.github.io/jocs-economia/>

## Inici: tria l'avaluació

En entrar, l'app mostra tres targetes: **1a**, **2a** i **3a avaluació**. Cada avaluació té el seu perfil:

- **1a · La cooperativa:** carnet de soci/a (nom, cooperativa, ruta, logotip i color).
- **2a · Quant costa viure pel teu compte?:** carta de vida (nom i feina de la carta que ha tocat a classe). Rangs: Estudiant → En pràctiques → Contracte temporal → Contracte indefinit → Independitzat/da → Expert/a en finances.
- **3a:** properament.

Les avaluacions que encara no han començat surten amb 🔒. Per obrir-les, canvia `var MOSTRA_AVAL2 = false;` o `var MOSTRA_AVAL3 = false;` a `true` a `js/app.js` (la 2a, el 8/01). En mode docent (`?docent`) es veuen totes. El botó **← Avaluacions** torna a la pantalla d'inici. L'informe només inclou els nivells de l'avaluació del perfil.

## 2a avaluació · La meva vida en números

Al mapa de la 2a avaluació hi ha un resum (tinc · gasto · em queda) i el botó **Obre el meu tauler**:

- **Ingressos:** el sou brut surt de la carta de vida (es pot canviar pel de l'oferta real de la Fita 4) i l'app calcula SS, IRPF (taula simplificada del quadern) i net.
- **Pressupost:** set partides amb dues columnes, «el que em pensava» (V9.4) i «real» (Fita 5), i la diferència.
- **Com quedo?:** saldo (superàvit o dèficit) i barres d'habitatge (35 %) i regla 50/30/20.
- **Imprevistos:** les cartes de La vida en daus o d'altres; saldo després dels imprevistos i fons d'emergència (3 mesos de necessitats).

Tot es guarda al navegador i surt a l'informe. Les missions continuen fent servir dades inventades (números nous a cada partida).

## Nivells = fases del projecte

| Nivell | Fase i unitat | Fita | Missions |
| --- | --- | --- | --- |
| 1 · El problema | Fase 1 · U1 | Fita 1 · 13/10 | Escassetat o repartiment · Cost d'oportunitat · Costos irrecuperables · Pensar al marge i incentius · Positiu/normatiu i micro/macro · Què, com i per a qui · Factors de producció · Economies plurals, drets i deures · Dades amb font · Caça l'error · BOSS |
| 2 · El mercat | Fase 2 · U2 | Fita 2 · 10/11 | Productivitat i divisió del treball · Recursos i sostenibilitat · Lleis del mercat · Llegeix la taula · Troba l'equilibri · Desplaçaments · Flux circular · De l'enquesta a la demanda · Caça l'error · BOSS |
| 3 · El pla | Fase 3 · U3 | Dossier 27/11 · Pitch 01/12 | Costos fixos i variables · Benefici · Punt mort · Tres escenaris · Formes jurídiques · Un soci, un vot · Principis cooperatius · Elements de l'empresa i organigrama · RSC i rentat verd · Caça l'error · BOSS |
| 4 · Quant costa viure pel teu compte? | 2a avaluació · U4 | Projecte · des del 8/01 | Necessitat o desig? · Llegeix la nòmina · Les paraules de la nòmina · Fixes o variables? · Quadra el pressupost · La regla 50/30/20 · Imprevistos i deute · Al comptat o a terminis? · Caça l'error · BOSS |

El nivell 4 està tancat per a l'alumnat fins que posis `var MOSTRA_AVAL2 = true;` a `js/app.js` (el 8/01). El BOSS d'aquest nivell es diu «El primer mes pel teu compte». Amb `?docent` ja es pot provar.

## Estudi (teoria)

`estudi.html` té la teoria de les tres unitats de la 1a avaluació i `estudi-2.html`, la de la 2a (unitat 4: necessitats i desitjos, nòmina, despeses fixes i variables, pressupost, regla 50/30/20, imprevistos i deute, al comptat o a terminis), en l'ordre de les fases: definicions, fórmules, exemples resolts (com «Espelmes Corbatera»), errors típics i esquemes. Té índex, cercador i opció d'imprimir o desar en PDF. Cada apartat té botons **Practica-ho** que obren la missió corresponent (`index.html#jugar=N3M4`).

## Com funciona

- **Pas a pas:** cada exercici està dividit en passos; els passos resolts queden escrits com un procediment.
- **Nombres personalitzats:** es generen a partir del nom de l'alumne; cada partida té nombres nous.
- **XP:** 10 per pas a la primera; −3 per intent fallit (mínim 3); amb pista, màxim 5; amb la solució (després de 3 intents), 0. Compta la millor partida.
- **Rangs:** Aspirant → Soci/a en prova → Soci/a → Tresorer/a → Coordinador/a → Presidència.
- **Boss (Assemblea final):** un exercici de cada fase, sense pistes; cal un 60 %.
- **Desbloqueig:** les missions s'obren en ordre. Per obrir-les totes d'un nivell treballat a classe, afegeix-lo a `var ENTRENAMENT = [];` de `js/app.js` (per exemple, `['N1']`).
- **Informe:** el botó *Descarrega l'informe* genera un HTML amb el resum i el procés (intents fallits ratllats) per penjar a Classroom.
- **Mode docent:** `?docent` obre totes les missions i mostra la Lliga i la Borsa.
- **Progrés:** es guarda al navegador de cada ordinador. Cal descarregar l'informe en acabar cada sessió.

## A classe

1a avaluació: Posa't a prova (`repas-teoria.html`, per unitats), Entrenament lliure (`exercicis-calcul.html`), Calculadora de la cooperativa (punt mort i tres escenaris), Kit del pitch (5 minuts i consell assessor), El mercat del pa, La caixa de la cooperativa (escape room) i Qui vol ser ric?
2a avaluació (amagat de moment): La vida en daus.
Eines de la professora (només amb `?docent`): `lliga-cooperativa.html` i `borsa-classe.html`.

## Estructura

```
index.html            l'app (carnet, mapa, missions, diari)
estudi.html           teoria de les unitats 1, 2 i 3 (1a avaluació)
estudi-2.html         teoria de la unitat 4 (2a avaluació)
css/estil.css         estil de l'app
css/estudi.css        estil de l'estudi (i de la versió impresa)
js/util.js            utilitats: atzar amb llavor, format, productes per ruta
js/banc-*.js          banc de missions (cada missió és un generador pas a pas; banc-viure.js = 2a avaluació)
js/fases.js           quines missions formen cada nivell i en quin ordre
js/app.js             motor: carnet, mapa, passos, XP, rangs, diari i informe
*.html                jocs i eines de classe
```

Per canviar l'ordre de les missions o moure'n una d'un nivell a un altre, només cal editar `js/fases.js`.

---

Docent: Laura Solé Català · Corbatera Institut Escola
