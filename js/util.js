/* Corbatera Coop Lab · utilitats */
var CE = window.CE || {};
window.CE = CE;
CE.NIVELLS = [];

// Atzar amb llavor: el mateix nom i la mateixa partida donen els mateixos números
CE.rng = function (seedStr) {
  var h = 1779033703 ^ seedStr.length;
  for (var i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  var a = (h ^= h >>> 16) >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
CE.int = function (r, a, b, step) { step = step || 1; var n = Math.floor((b - a) / step) + 1; return a + Math.floor(r() * n) * step; };
CE.pick = function (r, arr) { return arr[Math.floor(r() * arr.length)]; };
CE.shuffle = function (r, arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
CE.r2 = function (x) { return Math.round(x * 100) / 100; };

// Format català: 1.234,50
CE.f = function (x, dec) {
  if (dec === undefined) dec = Math.round(x * 100) % 100 === 0 ? 0 : 2;
  return Number(x).toLocaleString('ca-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec });
};
CE.eur = function (x) { return (x < 0 ? '−' : '') + CE.f(Math.abs(x)) + ' €'; };

// Llegeix la resposta: accepta comes, punts de milers, € i signe menys
CE.parse = function (v) {
  v = String(v).trim().replace(/\s|€|%|u\.?$/g, '').replace(/^[−–]/, '-');
  if (v.indexOf(',') >= 0) v = v.replace(/\./g, '').replace(',', '.');
  else if (/^\-?\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, '');
  var n = parseFloat(v);
  return isNaN(n) ? null : n;
};
CE.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

// Productes d'exemple per als enunciats
CE.PRODUCTES = [
  { pl: 'bosses de roba', sg: 'bossa' }, { pl: 'samarretes', sg: 'samarreta' },
  { pl: 'paquets de galetes', sg: 'paquet' }, { pl: 'polseres', sg: 'polsera' },
  { pl: 'espelmes', sg: 'espelma' }, { pl: 'tasses pintades', sg: 'tassa' },
  { pl: 'clauers', sg: 'clauer' }, { pl: 'punts de llibre', sg: 'punt de llibre' }
];
