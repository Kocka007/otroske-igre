/* Matko – neodvisno preverjanje pravilnosti računov.

   Igra je zavita v (function(){ … })(), zato do generatorjev iz strani ni dostopa.
   Namesto spreminjanja igre iz datoteke izluščimo samo čisti del kode (od ovoja do
   konca seznama GEN) in ga poženemo v svojem obsegu – igre se ne dotaknemo.

   Vsak generator izpiše nalogo tudi v obliki »podpisa« (q.line), npr. »7 × 8 = 56«.
   Ta preizkus podpis razčleni in ga preveri z lastnim, neodvisnim računom v Node.js.
   Če podpisa ne zna razčleniti, to javi kot napako – tiho preskakovanje ni dovoljeno. */

const { odpri, preizkus, izpisi, REPO } = require('./skupno');
const { kodaGeneratorjev } = require('./izvleci');

const NA_STOPNJO = Number(process.env.NA_STOPNJO || 120);

/* ------------------------------------------------------------------ orodja */
const MINUS = '−';                       /* pravi minus, ne vezaj */
const st = s => Number(String(s).replace(/−/g, '-').replace(/\s/g, '').replace(',', '.'));
const priblizno = (a, b) => Math.abs(a - b) < 1e-9;

/* Slovenska imena števil – zapisana tu, ne vzeta iz igre. */
const IMENA = ['nič','ena','dve','tri','štiri','pet','šest','sedem','osem','devet','deset',
  'enajst','dvanajst','trinajst','štirinajst','petnajst','šestnajst','sedemnajst','osemnajst',
  'devetnajst','dvajset'];

/* Pretvorbe enot – lastna tabela. */
const ENOTE = {
  'm→cm':100, 'cm→mm':10, 'km→m':1000, 'm→mm':1000, 'dm→cm':10, 'm→dm':10,
  'kg→g':1000, 't→kg':1000, 'kg→dag':100, 'dag→g':10,
  'l→dl':10, 'l→ml':1000, 'dl→ml':100, 'l→cl':100,
  'h→min':60, 'min→s':60, 'dan→h':24, 'teden→dan':7, 'leto→mesec':12, 'h→s':3600
};

function preveriEnoto(a, ea, b, eb){
  const naprej = ENOTE[ea + '→' + eb];
  if (naprej !== undefined) return priblizno(a * naprej, b);
  const nazaj = ENOTE[eb + '→' + ea];
  if (nazaj !== undefined) return priblizno(a, b * nazaj);
  return null;                                /* pretvorbe ne poznamo */
}

/* ------------------------------------------------ neodvisni razčlenjevalnik */
/* Vrne { ok:true } | { ok:false, zakaj } | null, če vzorca ne prepozna. */
function preveriPodpis(gen, vrstica, odgovor){
  const l = String(vrstica).replace(/^[^\p{L}\p{N}−\-+√½(%]*/u, '').trim();
  /* Število sme imeti pred sabo vezaj ali pravi minus (−), kot ga izpiše igra. */
  const num = '((?:-|\u2212)?\\d+(?:[,.]\\d+)?)';
  let m;

  /* --- pomožno: izračun preprostega izraza brez zaupanja igri --------- */
  function izracunaj(izraz){
    const t = izraz.replace(/−/g, '-').replace(/·|×/g, '*').replace(/\s+/g, '')
                   .replace(/(\d),(\d)/g, '$1.$2');
    if (!/^[-+*/().\d]+$/.test(t)) return null;
    try { return Function('"use strict";return (' + t + ')')(); } catch (e){ return null; }
  }
  const zaokr = x => Math.round(x * 1e6) / 1e6;
  const nsd = (a, b) => b ? nsd(b, a % b) : Math.abs(a);

  /* Kadar je pravilen odgovor primerjalni znak, gre za nalogo »postavi pravi znak«
     in ne za račun – tudi če je znak enačaj in vrstica izgleda kot račun. */
  const jeZnak = ['<', '>', '='].indexOf(String(odgovor)) >= 0;

  /* --- osnovni računi: a ? b = c --------------------------------------- */
  m = jeZnak ? null : l.match(new RegExp('^' + num + '\\s*([+' + MINUS + '×·:*/])\\s*' + num + '\\s*=\\s*' + num + '$'));
  if (m){
    const a = st(m[1]), z = m[2], b = st(m[3]), c = st(m[4]);
    const izid = z === '+' ? a + b : z === MINUS ? a - b
               : (z === '×' || z === '·' || z === '*') ? a * b : a / b;
    if (!priblizno(zaokr(izid), zaokr(c)))
      return { ok:false, zakaj: 'račun ne drži: ' + l + ', pravilno ' + izid };
    const v = st(odgovor);
    if (![a, b, c].some(x => priblizno(zaokr(x), zaokr(v))))
      return { ok:false, zakaj: 'odgovor ' + odgovor + ' ni nobeno od števil v računu ' + l };
    return { ok:true };
  }

  /* --- deljenje z ostankom: 69 : 8 = 8, ost. 5 -------------------------- */
  m = l.match(/^(\d+)\s*:\s*(\d+)\s*=\s*(\d+),\s*ost\.\s*(\d+)$/);
  if (m){
    const a = +m[1], b = +m[2], q = +m[3], r = +m[4];
    if (b === 0) return { ok:false, zakaj: 'deljenje z nič: ' + l };
    if (a !== b * q + r) return { ok:false, zakaj: 'deljenje z ostankom ne drži: ' + l };
    if (r >= b) return { ok:false, zakaj: 'ostanek ni manjši od delitelja: ' + l };
    if (!priblizno(st(odgovor), r)) return { ok:false, zakaj: 'odgovor ni ostanek: ' + l };
    return { ok:true };
  }

  /* --- denar: 💶 20 € − 17 € = 3 € -------------------------------------- */
  m = l.match(new RegExp('^' + num + '\\s*€\\s*([+' + MINUS + '])\\s*' + num + '\\s*€\\s*=\\s*' + num + '\\s*€$'));
  if (m){
    const a = st(m[1]), z = m[2], b = st(m[3]), c = st(m[4]);
    const izid = z === '+' ? a + b : a - b;
    if (!priblizno(izid, c)) return { ok:false, zakaj: 'denar ne drži: ' + l + ', pravilno ' + izid };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }

  /* --- primerjava izrazov: 4 > 0 · 3,6 < 9,8 · 2 + 8 > 2 + 5 ------------
     Le kadar je pravilen odgovor primerjalni znak – sicer bi sem zašla tudi
     razmerja (»20 : 24 = 5 : 6«), ki niso primerjava. */
  m = jeZnak ? l.match(/^([-−\d,.\s+×·:]+?)\s*([<>=])\s*([-−\d,.\s+×·:]+)$/) : null;
  if (m && /\d/.test(m[1]) && /\d/.test(m[3])){
    const a = izracunaj(m[1]), b = izracunaj(m[3]), z = m[2];
    if (a === null || b === null) return { ok:false, zakaj: 'strani primerjave ne znam izračunati: ' + l };
    const drzi = z === '<' ? a < b : z === '>' ? a > b : priblizno(zaokr(a), zaokr(b));
    if (!drzi) return { ok:false, zakaj: 'primerjava ne drži: ' + l + ' (' + a + ' proti ' + b + ')' };
    if (String(odgovor) !== z) return { ok:false, zakaj: 'odgovor ' + odgovor + ' ni znak iz ' + l };
    return { ok:true };
  }

  /* --- primerjava ulomkov: 2/5 > 1/5 ------------------------------------ */
  m = l.match(/^(\d+)\/(\d+)\s*([<>=])\s*(\d+)\/(\d+)$/);
  if (m){
    const a = +m[1] / +m[2], b = +m[4] / +m[5], z = m[3];
    const drzi = z === '<' ? a < b : z === '>' ? a > b : priblizno(zaokr(a), zaokr(b));
    if (!drzi) return { ok:false, zakaj: 'primerjava ulomkov ne drži: ' + l };
    if (String(odgovor) !== z) return { ok:false, zakaj: 'odgovor ni znak: ' + l };
    return { ok:true };
  }

  /* --- računanje z ulomki: 3/8 − 2/8 = 1/8 · 1/3 · 1/2 = 1/6 ------------ */
  m = l.match(new RegExp('^(\\d+)\\/(\\d+)\\s*([+' + MINUS + '·×])\\s*(\\d+)\\/(\\d+)\\s*=\\s*(\\d+)\\/(\\d+)$'));
  if (m){
    const a = +m[1], b = +m[2], z = m[3], c = +m[4], d = +m[5], e = +m[6], f = +m[7];
    if (b === 0 || d === 0 || f === 0) return { ok:false, zakaj: 'imenovalec je nič: ' + l };
    const vred = z === '+' ? a/b + c/d : z === MINUS ? a/b - c/d : (a/b) * (c/d);
    if (!priblizno(zaokr(vred), zaokr(e/f)))
      return { ok:false, zakaj: 'ulomki ne držijo: ' + l + ', pravilno ' + vred };
    if (nsd(e, f) !== 1)
      return { ok:false, zakaj: 'izid ni okrajšan do konca: ' + l };
    if (String(odgovor).replace(/\s/g, '') !== (e + '/' + f))
      return { ok:false, zakaj: 'odgovor ni izid: ' + l + ' (odgovor ' + odgovor + ')' };
    return { ok:true };
  }

  /* --- zaporedje: 0, 2, 4, 6 -------------------------------------------- */
  m = l.match(/^(-?\d+(?:\s*,\s*-?\d+)+)$/);
  if (m){
    const c = m[1].split(',').map(x => st(x));
    if (c.length < 3) return { ok:false, zakaj: 'zaporedje je prekratko: ' + l };
    const d = c[1] - c[0];
    for (let i = 2; i < c.length; i++)
      if (!priblizno(c[i] - c[i-1], d)) return { ok:false, zakaj: 'zaporedje ni enakomerno: ' + l };
    if (!c.some(x => priblizno(x, st(odgovor))))
      return { ok:false, zakaj: 'odgovor ' + odgovor + ' ni člen zaporedja ' + l };
    return { ok:true };
  }

  /* --- pretvorba enot: 5 dan = 120 h ------------------------------------ */
  m = l.match(/^(-?\d+(?:[,.]\d+)?)\s*([a-zA-Zčšž]+)\s*=\s*(-?\d+(?:[,.]\d+)?)\s*([a-zA-Zčšž]+)$/);
  if (m){
    const izid = preveriEnoto(st(m[1]), m[2], st(m[3]), m[4]);
    if (izid === null) return { ok:false, zakaj: 'pretvorbe ne poznam: ' + l };
    if (!izid) return { ok:false, zakaj: 'pretvorba ne drži: ' + l };
    if (!priblizno(st(odgovor), st(m[3]))) return { ok:false, zakaj: 'odgovor ni desna stran: ' + l };
    return { ok:true };
  }

  /* --- odstotki -------------------------------------------------------- */
  m = l.match(new RegExp('^' + num + '\\s*%\\s*od\\s*' + num + '\\s*=\\s*' + num + '$'));
  if (m){
    const p = st(m[1]), n = st(m[2]), c = st(m[3]);
    if (!priblizno(zaokr(p / 100 * n), zaokr(c)))
      return { ok:false, zakaj: 'odstotek ne drži: ' + l + ', pravilno ' + (p/100*n) };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  /* 9 od 20 = 45 % */
  m = l.match(new RegExp('^' + num + '\\s*od\\s*' + num + '\\s*=\\s*' + num + '\\s*%$'));
  if (m){
    const del = st(m[1]), celota = st(m[2]), c = st(m[3]);
    if (celota === 0) return { ok:false, zakaj: 'celota je nič: ' + l };
    if (!priblizno(zaokr(del / celota * 100), zaokr(c)))
      return { ok:false, zakaj: 'delež ne drži: ' + l + ', pravilno ' + (del/celota*100) };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  /* % 250 € + 20 % = 300 € */
  m = l.match(new RegExp('^%\\s*' + num + '\\s*€\\s*([+' + MINUS + '])\\s*' + num + '\\s*%\\s*=\\s*' + num + '\\s*€$'));
  if (m){
    const osn = st(m[1]), z = m[2], p = st(m[3]), c = st(m[4]);
    const prav = z === '+' ? osn * (1 + p/100) : osn * (1 - p/100);
    if (!priblizno(zaokr(prav), zaokr(c)))
      return { ok:false, zakaj: 'sprememba za odstotek ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }

  /* --- del celote: 3/6 od 30 = 15 --------------------------------------- */
  m = l.match(new RegExp('^(\\d+)\\/(\\d+)\\s*od\\s*' + num + '\\s*=\\s*' + num + '$'));
  if (m){
    const c = st(m[4]);
    if (!priblizno(zaokr(+m[1] / +m[2] * st(m[3])), zaokr(c)))
      return { ok:false, zakaj: 'del celote ne drži: ' + l };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }

  /* --- potence in koreni ------------------------------------------------ */
  m = l.match(/^(\d+)([²³])\s*=\s*(-?\d+)$/);
  if (m){
    const e = m[2] === '²' ? 2 : 3, c = +m[3];
    if (Math.pow(+m[1], e) !== c)
      return { ok:false, zakaj: 'potenca ne drži: ' + l + ', pravilno ' + Math.pow(+m[1], e) };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  /* 7² + 9² = 130 · 7² − 2² = 45 */
  m = l.match(new RegExp('^(\\d+)([²³])\\s*([+' + MINUS + '])\\s*(\\d+)([²³])\\s*=\\s*(-?\\d+)$'));
  if (m){
    const a = Math.pow(+m[1], m[2] === '²' ? 2 : 3);
    const b = Math.pow(+m[4], m[5] === '²' ? 2 : 3);
    const prav = m[3] === '+' ? a + b : a - b, c = +m[6];
    if (prav !== c) return { ok:false, zakaj: 'potence ne držijo: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^√(\d+)\s*=\s*(-?\d+)$/);
  if (m){
    const c = +m[2];
    if (c * c !== +m[1]) return { ok:false, zakaj: 'koren ne drži: ' + l + ', ker ' + c + '² = ' + c*c };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  /* √(81 · 9) = 27 */
  m = l.match(/^√\(\s*(\d+)\s*[·×*]\s*(\d+)\s*\)\s*=\s*(-?\d+)$/);
  if (m){
    const zmn = +m[1] * +m[2], c = +m[3];
    if (c * c !== zmn) return { ok:false, zakaj: 'koren zmnožka ne drži: ' + l + ', ker ' + c + '² = ' + c*c };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }

  /* --- enačbe: leva = desna → x = vrednost ------------------------------ */
  m = l.match(new RegExp('^(.+?)\\s*=\\s*(.+?)\\s*(?:→|->)\\s*x\\s*=\\s*' + num + '$'));
  if (m){
    const x = st(m[3]);
    const vstavi = t => t.replace(/−/g, '-').replace(/(\d)\s*x/g, '$1*(' + x + ')')
                         .replace(/(^|[^\d)])x/g, '$1(' + x + ')');
    const a = izracunaj(vstavi(m[1])), b = izracunaj(vstavi(m[2]));
    if (a === null || b === null) return { ok:false, zakaj: 'enačbe ne znam izračunati: ' + l };
    if (!priblizno(zaokr(a), zaokr(b)))
      return { ok:false, zakaj: 'rešitev enačbe ne drži: ' + l + ' (leva ' + a + ', desna ' + b + ')' };
    if (!priblizno(st(odgovor), x)) return { ok:false, zakaj: 'odgovor ni x: ' + l };
    return { ok:true };
  }

  /* --- geometrija ------------------------------------------------------- */
  m = l.match(/^kvadrat a=(\d+)\s*(?:→|->)\s*(obseg|ploščina)\s*(\d+)/);
  if (m){
    const a = +m[1], c = +m[3], prav = m[2] === 'obseg' ? 4 * a : a * a;
    if (prav !== c) return { ok:false, zakaj: m[2] + ' kvadrata ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^pravokotnik (\d+)×(\d+)\s*(?:→|->)\s*(obseg|ploščina)\s*(\d+)/);
  if (m){
    const a = +m[1], b = +m[2], c = +m[4], prav = m[3] === 'obseg' ? 2*(a+b) : a*b;
    if (prav !== c) return { ok:false, zakaj: m[3] + ' pravokotnika ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^trikotnik a=(\d+),\s*v=(\d+)\s*(?:→|->)\s*ploščina\s*(-?\d+(?:[,.]\d+)?)/);
  if (m){
    const prav = +m[1] * +m[2] / 2;
    if (!priblizno(prav, st(m[3])))
      return { ok:false, zakaj: 'ploščina trikotnika ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), st(m[3]))) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^kvader (\d+)×(\d+)×(\d+)\s*(?:→|->)\s*(prostornina|površina)\s*(\d+)/);
  if (m){
    const a = +m[1], b = +m[2], c2 = +m[3], c = +m[5];
    const prav = m[4] === 'prostornina' ? a*b*c2 : 2*(a*b + a*c2 + b*c2);
    if (prav !== c) return { ok:false, zakaj: m[4] + ' kvadra ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^kocka a=(\d+)\s*(?:→|->)\s*(prostornina|površina)\s*(\d+)/);
  if (m){
    const a = +m[1], c = +m[3], prav = m[2] === 'prostornina' ? a*a*a : 6*a*a;
    if (prav !== c) return { ok:false, zakaj: m[2] + ' kocke ne drži: ' + l + ', pravilno ' + prav };
    return { ok:true };
  }
  /* koti 37°+83° → tretji 60° */
  m = l.match(/^koti (\d+)°\+(\d+)°\s*(?:→|->)\s*tretji\s*(\d+)°$/);
  if (m){
    const prav = 180 - +m[1] - +m[2], c = +m[3];
    if (prav !== c) return { ok:false, zakaj: 'vsota kotov ni 180°: ' + l + ', pravilno ' + prav };
    if (prav <= 0) return { ok:false, zakaj: 'tretji kot ni pozitiven: ' + l };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  /* kateti 8, 15 → hipotenuza 17 */
  m = l.match(/^kateti (\d+),\s*(\d+)\s*(?:→|->)\s*hipotenuza\s*(\d+)$/);
  if (m){
    const a = +m[1], b = +m[2], c = +m[3];
    if (a*a + b*b !== c*c)
      return { ok:false, zakaj: 'Pitagorov izrek ne drži: ' + l + ' (' + (a*a+b*b) + ' proti ' + c*c + ')' };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni hipotenuza: ' + l };
    return { ok:true };
  }

  /* --- mestne vrednosti, zaokroževanje, deljivost, praštevila, D -------- */
  m = l.match(/^(\d+)\s*(?:→|->)\s*(\d+)\s*(enic|desetic|stotic|tisočic)$/);
  if (m){
    const n = +m[1], c = +m[2];
    const delitelj = { enic:1, desetic:10, stotic:100, 'tisočic':1000 }[m[3]];
    const prav = Math.floor(n / delitelj) % 10;
    if (prav !== c) return { ok:false, zakaj: 'mestna vrednost ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^(\d+)\s*≈\s*(\d+)$/);
  if (m){
    const n = +m[1], c = +m[2];
    const osnove = [10, 100, 1000].filter(b => c % b === 0 && Math.round(n / b) * b === c);
    if (!osnove.length)
      return { ok:false, zakaj: 'zaokroževanje ne drži: ' + l +
        ' (na 10 bi bilo ' + (Math.round(n/10)*10) + ', na 100 pa ' + (Math.round(n/100)*100) + ')' };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^(\d+) deljivo s (\d+)\s*(?:→|->)\s*(da|ne)$/i);
  if (m){
    const je = +m[1] % +m[2] === 0;
    if (je !== (m[3].toLowerCase() === 'da'))
      return { ok:false, zakaj: 'deljivost ne drži: ' + l + ' (ostanek ' + (+m[1] % +m[2]) + ')' };
    if (String(odgovor).toLowerCase() !== m[3].toLowerCase())
      return { ok:false, zakaj: 'odgovor se ne ujema s podpisom: ' + l };
    return { ok:true };
  }
  m = l.match(/^praštevilo\s*(?:→|->)\s*(\d+)$/);
  if (m){
    const n = +m[1];
    let prasto = n > 1;
    for (let i = 2; i * i <= n; i++) if (n % i === 0){ prasto = false; break; }
    if (!prasto) return { ok:false, zakaj: n + ' ni praštevilo: ' + l };
    if (String(odgovor) !== String(n)) return { ok:false, zakaj: 'odgovor ni praštevilo: ' + l };
    return { ok:true };
  }
  /* v(19, 14) = 266 – najmanjši skupni večkratnik */
  m = l.match(/^v\((\d+),\s*(\d+)\)\s*=\s*(\d+)$/);
  if (m){
    const a2 = +m[1], b2 = +m[2], c = +m[3];
    const prav = a2 / nsd(a2, b2) * b2;
    if (prav !== c) return { ok:false, zakaj: 'najmanjši skupni večkratnik ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^D\((\d+),\s*(\d+)\)\s*=\s*(\d+)$/);
  if (m){
    const prav = nsd(+m[1], +m[2]), c = +m[3];
    if (prav !== c) return { ok:false, zakaj: 'največji skupni delitelj ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }

  /* --- povprečje in mediana --------------------------------------------- */
  m = l.match(/^povprečje\s*\(([^)]+)\)\s*=\s*(-?\d+(?:[,.]\d+)?)$/);
  if (m){
    const c = m[1].split(',').map(x => st(x));
    const prav = c.reduce((a, b) => a + b, 0) / c.length;
    if (!priblizno(zaokr(prav), zaokr(st(m[2]))))
      return { ok:false, zakaj: 'povprečje ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), st(m[2]))) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^mediana\s*\(([^)]+)\)\s*=\s*(-?\d+(?:[,.]\d+)?)$/);
  if (m){
    const c = m[1].split(',').map(x => st(x)).sort((a, b) => a - b);
    const s2 = c.length % 2 ? c[(c.length-1)/2] : (c[c.length/2-1] + c[c.length/2]) / 2;
    if (!priblizno(s2, st(m[2])))
      return { ok:false, zakaj: 'mediana ne drži: ' + l + ', pravilno ' + s2 };
    if (!priblizno(st(odgovor), st(m[2]))) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }

  /* --- sorazmerje in razmerje ------------------------------------------- */
  m = l.match(/^sorazmerje:\s*(\d+)\s*(?:→|->)\s*(\d+)\s*€,\s*(\d+)\s*(?:→|->)\s*(\d+)\s*€$/);
  if (m){
    const a = +m[1], ca = +m[2], b = +m[3], cb = +m[4];
    if (!priblizno(zaokr(ca / a * b), zaokr(cb)))
      return { ok:false, zakaj: 'sorazmerje ne drži: ' + l + ', pravilno ' + (ca/a*b) };
    if (!priblizno(st(odgovor), cb)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }
  m = l.match(/^(\d+)\s*:\s*(\d+)\s*=\s*(\d+)\s*:\s*(\d+)$/);
  if (m){
    const a = +m[1], b = +m[2], c = +m[3], d = +m[4];
    if (a * d !== b * c) return { ok:false, zakaj: 'razmerje ne drži: ' + l };
    if (nsd(c, d) !== 1) return { ok:false, zakaj: 'razmerje ni okrajšano do konca: ' + l };
    if (String(odgovor).replace(/\s/g, '') !== (c + ':' + d))
      return { ok:false, zakaj: 'odgovor ni okrajšano razmerje: ' + l + ' (odgovor ' + odgovor + ')' };
    return { ok:true };
  }
  /* 64 € v razmerju 3:5 → večji del 40 € */
  m = l.match(/^(\d+)\s*€ v razmerju (\d+):(\d+)\s*(?:→|->)\s*večji del\s*(\d+)\s*€$/);
  if (m){
    const celota = +m[1], a = +m[2], b = +m[3], c = +m[4];
    const vecji = Math.max(a, b), prav = celota / (a + b) * vecji;
    if (!priblizno(zaokr(prav), zaokr(c)))
      return { ok:false, zakaj: 'delitev v razmerju ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), c)) return { ok:false, zakaj: 'odgovor ni izid: ' + l };
    return { ok:true };
  }

  /* --- imena števil ----------------------------------------------------- */
  m = l.match(/^(\d+)\s*=\s*([\p{L}]+)$/u);
  if (m){
    const ime = IMENA[+m[1]];
    if (ime === undefined) return { ok:false, zakaj: 'imena za ' + m[1] + ' ne poznam: ' + l };
    if (ime !== m[2]) return { ok:false, zakaj: 'ime števila ne drži: ' + l + ', pravilno »' + ime + '«' };
    if (String(odgovor) !== ime) return { ok:false, zakaj: 'odgovor ni ime števila: ' + l };
    return { ok:true };
  }
  m = l.match(/^([\p{L}]+)\s*=\s*(\d+)$/u);
  if (m){
    const n = IMENA.indexOf(m[1]);
    if (n < 0) return { ok:false, zakaj: 'imena »' + m[1] + '« ne poznam: ' + l };
    if (n !== +m[2]) return { ok:false, zakaj: 'ime števila ne drži: ' + l + ', pravilno ' + n };
    if (String(odgovor) !== String(n)) return { ok:false, zakaj: 'odgovor ni število: ' + l };
    return { ok:true };
  }

  /* --- oblike: romb ima 4 oglišča --------------------------------------- */
  m = l.match(/^([\p{L}á]+) ima (\d+) ogliš/u);
  if (m){
    const OGLISCA = { trikotnik:3, kvadrat:4, pravokotnik:4, romb:4, krog:0, 'ovál':0,
                      petkotnik:5, sestkotnik:6, 'šestkotnik':6 };
    const prav = OGLISCA[m[1]];
    if (prav === undefined) return { ok:false, zakaj: 'oblike »' + m[1] + '« ne poznam: ' + l };
    if (prav !== +m[2]) return { ok:false, zakaj: 'število oglišč ne drži: ' + l + ', pravilno ' + prav };
    if (!priblizno(st(odgovor), +m[2])) return { ok:false, zakaj: 'odgovor ni število oglišč: ' + l };
    return { ok:true };
  }

  /* --- štetje ----------------------------------------------------------- */
  m = l.match(/^Preštej\s+(\S+)\s*(?:→|->)\s*(\d+)$/);
  if (m){
    if (!priblizno(st(odgovor), +m[2])) return { ok:false, zakaj: 'odgovor ni število: ' + l };
    if (+m[2] < 1 || +m[2] > 100) return { ok:false, zakaj: 'število za štetje je izven razuma: ' + l };
    return { ok:true };
  }

  /* --- ura -------------------------------------------------------------- */
  m = l.match(/^ura kaže (\d{1,2}):(\d{2})$/);
  if (m){
    const h = +m[1], mi = +m[2];
    if (h < 1 || h > 12) return { ok:false, zakaj: 'ura je izven 1–12: ' + l };
    if (mi > 59) return { ok:false, zakaj: 'minute so izven 0–59: ' + l };
    if (String(odgovor) !== h + ':' + m[2]) return { ok:false, zakaj: 'odgovor ni ura: ' + l };
    return { ok:true };
  }
  /* 6:20 + 45 min = 7:05 */
  m = l.match(new RegExp('^(\\d{1,2}):(\\d{2})\\s*([+' + MINUS + '])\\s*(\\d+)\\s*min\\s*=\\s*(\\d{1,2}):(\\d{2})$'));
  if (m){
    const zac = +m[1] * 60 + +m[2], d = +m[4] * (m[3] === '+' ? 1 : -1);
    let kon = ((zac + d) % 720 + 720) % 720;
    const kh = Math.floor(kon / 60) === 0 ? 12 : Math.floor(kon / 60), km = kon % 60;
    const pricakovan = kh + ':' + String(km).padStart(2, '0');
    const dobljen = (+m[5]) + ':' + m[6];
    if (pricakovan !== dobljen)
      return { ok:false, zakaj: 'računanje z uro ne drži: ' + l + ', pravilno ' + pricakovan };
    if (String(odgovor) !== dobljen) return { ok:false, zakaj: 'odgovor ni ura: ' + l };
    return { ok:true };
  }

  return null;                                 /* vzorca ne poznamo */
}

/* Vzorci, ki jih ni mogoče preveriti z računom (slika, besedilo, izbira lika). */
const BREZ_RACUNA = [
  /^📖 /,                       /* besedilne naloge in prve besede – zgodba, ne račun */
  /^🔺 poišči /,                /* prepoznavanje oblike na sliki */
  /^🦘 /,                       /* Kenguruček – uganke, ne izpisan račun */
  /^½ pobarvano/,               /* ulomek na sliki */
  /^manjkajoča vrednost pri povprečju/  /* podpis ne navede ostalih vrednosti */
];

(async () => {
  const koda = kodaGeneratorjev(REPO);
  const { brskalnik, stran, napake, pogon } = await odpri('index.html');
  console.log('Pogon: ' + pogon + ' · izluščenih ' + koda.length + ' znakov kode generatorjev');
  const preizkusi = [];

  const podatki = await stran.evaluate(([k, naStopnjo]) => {
    const M = new Function(k + '; return {GEN, MODES};')();
    const izhod = { naloge: [], napakeGen: [], generatorjev: Object.keys(M.GEN).length };
    const videni = {};
    for (const m of M.MODES){
      const gen = m.gen || m.id;
      const lo = m.min || 1, hi = m.max || 9;
      for (let s = lo; s <= hi; s++){
        const kljuc = gen + ':' + s;
        if (videni[kljuc]) continue;
        videni[kljuc] = 1;
        for (let i = 0; i < naStopnjo; i++){
          let q;
          try { q = M.GEN[gen](s); }
          catch (e){ izhod.napakeGen.push(gen + ' st' + s + ': ' + e.message); continue; }
          izhod.naloge.push({ gen, st: s, line: q.line, answer: q.answer,
                              type: q.type, choices: q.choices || null });
        }
      }
    }
    return izhod;
  }, [koda, NA_STOPNJO]);

  const t0 = preizkus('kodo generatorjev je mogoče izluščiti in pognati');
  t0.trdi(podatki.napakeGen.length === 0, 'napake generatorjev: ' + podatki.napakeGen.slice(0, 5).join(' | '));
  t0.trdi(podatki.generatorjev >= 29, 'izluščenih le ' + podatki.generatorjev + ' generatorjev');
  t0.trdi(podatki.naloge.length > 1000, 'premalo generiranih nalog: ' + podatki.naloge.length);
  t0.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 3).join(' | '));
  preizkusi.push(t0);

  /* --- neodvisno preverjanje --- */
  const t1 = preizkus('vsak izpisan račun drži');
  const t2 = preizkus('vsak podpis naloge je razčlenjen');
  const poGen = {};
  let preverjenih = 0, brezRacuna = 0;
  for (const q of podatki.naloge){
    poGen[q.gen] = poGen[q.gen] || { preverjenih: 0, brez: 0, nerazclenjenih: 0 };
    const izid = preveriPodpis(q.gen, q.line, q.answer);
    if (izid === null){
      const golo = String(q.line).replace(/^[^\p{L}\p{N}−\-+√½(%]*/u, '').trim();
      if (BREZ_RACUNA.some(r => r.test(q.line)) || BREZ_RACUNA.some(r => r.test(golo))){
        poGen[q.gen].brez++; brezRacuna++;
      } else {
        poGen[q.gen].nerazclenjenih++;
        t2.trdi(false, q.gen + ' st' + q.st + ': podpisa ne znam preveriti: »' + q.line + '«');
      }
      continue;
    }
    poGen[q.gen].preverjenih++; preverjenih++;
    t1.trdi(izid.ok, q.gen + ' st' + q.st + ': ' + (izid.zakaj || ''));
  }
  preizkusi.push(t1); preizkusi.push(t2);

  /* --- pri nalogah z možnostmi mora biti odgovor med njimi --- */
  const t3 = preizkus('pravilen odgovor je med ponujenimi možnostmi');
  for (const q of podatki.naloge){
    if (!q.choices) continue;
    t3.trdi(q.choices.map(String).indexOf(String(q.answer)) >= 0,
      q.gen + ' st' + q.st + ': odgovora »' + q.answer + '« ni med možnostmi (' + q.choices.join(', ') + ') · ' + q.line);
    t3.trdi(new Set(q.choices.map(String)).size === q.choices.length,
      q.gen + ' st' + q.st + ': podvojena možnost pri ' + q.line);
  }
  preizkusi.push(t3);

  /* --- vsak generator mora biti res pregledan --- */
  const t4 = preizkus('vsak generator je pregledan');
  for (const gen in poGen){
    const p = poGen[gen];
    t4.trdi(p.preverjenih + p.brez > 0, gen + ': nič nalog');
    t4.trdi(p.nerazclenjenih === 0, gen + ': ' + p.nerazclenjenih + ' nerazčlenjenih podpisov');
  }
  t4.enako(Object.keys(poGen).length, podatki.generatorjev, 'niso bili pregledani vsi generatorji');
  preizkusi.push(t4);

  await brskalnik.close();
  console.log('Nalog skupaj: ' + podatki.naloge.length +
    ' · z računom preverjenih: ' + preverjenih +
    ' · brez računa (slika, besedilo, uganka): ' + brezRacuna);
  const vrste = Object.keys(poGen).sort();
  for (const g of vrste)
    console.log('   ' + g.padEnd(11) + ' preverjenih ' + String(poGen[g].preverjenih).padStart(5) +
      ', brez računa ' + String(poGen[g].brez).padStart(5));
  process.exit(izpisi('Matko – pravilnost računov', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
