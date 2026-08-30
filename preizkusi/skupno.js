/* Skupna pomagala za preizkuse zbirke otroških iger. */
const path = require('path');
const pw = require('playwright');

const REPO = path.resolve(__dirname, '..');   /* korenska mapa zbirke */
const url = ime => 'file://' + path.join(REPO, ime);

/* Pogon: privzeto WebKit (pogon Safarija na iPadu), s PW_POGON=chromium drugače.
   WebKit potrebuje sistemske knjižnice: `sudo npx playwright install-deps webkit`. */
function pogon(ime){
  const n = ime || process.env.PW_POGON || 'webkit';
  if (!pw[n]) throw new Error('neznan pogon: ' + n);
  return { ime: n, tip: pw[n] };
}

async function odpri(datoteka, opt){
  opt = opt || {};
  const p = pogon(opt.pogon);
  const brskalnik = await p.tip.launch();
  const kontekst = await brskalnik.newContext({
    viewport: opt.viewport || { width: 820, height: 1180 },   /* iPad pokončno */
    hasTouch: !!opt.dotik, isMobile: false
  });
  const stran = await kontekst.newPage();
  const napake = [];
  const dnevnik = [];                 /* vse, kar igra izpiše v konzolo */
  stran.on('pageerror', e => napake.push(String(e)));
  stran.on('console', m => {
    dnevnik.push({ vrsta: m.type(), besedilo: m.text() });
    if (m.type() === 'error') napake.push('console: ' + m.text());
  });
  /* zahtevke poslušamo že pred nalaganjem, sicer bi nam ušlo vse iz glave dokumenta */
  const zahtevki = [];
  stran.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) zahtevki.push(r.url()); });
  await stran.goto(url(datoteka));
  await stran.waitForFunction(() => document.readyState === 'complete');
  return { brskalnik, kontekst, stran, napake, dnevnik, zahtevki, pogon: p.ime };
}

/* Preprost zbiralnik trditev. */
function preizkus(naslov){
  const nap = [];
  let stTrditev = 0;
  const t = {
    naslov,
    trdi(pogoj, sporocilo){
      stTrditev++;
      if (!pogoj){ nap.push(sporocilo); }
      return !!pogoj;
    },
    enako(a, b, sporocilo){
      return t.trdi(a === b, sporocilo + ' (dobil ' + JSON.stringify(a) + ', pričakoval ' + JSON.stringify(b) + ')');
    },
    napake: nap,
    povzetek(){
      const prvih = nap.slice(0, 15);
      if (!nap.length) return '  ✅ ' + naslov + ' – ' + stTrditev + ' preverb';
      return '  ❌ ' + naslov + ' – ' + nap.length + ' napak od ' + stTrditev + ' preverb\n' +
        prvih.map(s => '     · ' + s).join('\n') +
        (nap.length > prvih.length ? '\n     · … in še ' + (nap.length - prvih.length) : '');
    }
  };
  return t;
}

function izpisi(naslov, preizkusi){
  console.log('\n=== ' + naslov + ' ===');
  let slabo = 0;
  for (const p of preizkusi){ console.log(p.povzetek()); slabo += p.napake.length; }
  console.log(slabo ? '\nSKUPAJ: ' + slabo + ' napak ❌' : '\nSKUPAJ: vse v redu ✅');
  return slabo;
}

module.exports = { odpri, preizkus, izpisi, url, REPO };
