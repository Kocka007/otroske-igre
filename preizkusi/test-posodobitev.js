/* Zbirka – ali nameščena aplikacija ob zagonu res dobi novo različico?

   Service worker deluje samo prek http(s), zato preizkus zažene majhen krajevni
   strežnik, ki streže kopijo zbirke. Kopijo zato, ker med preizkusom »objavimo«
   novo različico – v repozitoriju ne spremenimo ničesar.

   Strežnik posnema GitHub Pages: pošilja `Cache-Control: max-age=600` in `ETag`.
   Prav ta glava je past: brez nje bi preizkus mimogrede prikril, da bi service
   worker lahko shranil do deset minut staro kopijo. */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { preizkus, izpisi, REPO } = require('./skupno');
const pw = require('playwright');

const cakaj = ms => new Promise(r => setTimeout(r, ms));
const VRSTE = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
                '.json':'application/json', '.webmanifest':'application/manifest+json',
                '.png':'image/png' };

function postaviKopijo(){
  const mapa = fs.mkdtempSync(path.join(os.tmpdir(), 'igre-posodobitev-'));
  for (const f of fs.readdirSync(REPO)){
    if (!/\.(html|js|png|webmanifest)$/.test(f)) continue;
    fs.copyFileSync(path.join(REPO, f), path.join(mapa, f));
  }
  return mapa;
}

function zazeniStreznik(mapa){
  return new Promise(resolve => {
    const s = http.createServer((zahteva, odgovor) => {
      let ime = decodeURIComponent(zahteva.url.split('?')[0]);
      if (ime === '/') ime = '/index.html';
      const pot = path.join(mapa, path.normalize(ime).replace(/^([.][.][/\\])+/, ''));
      fs.readFile(pot, (napaka, vsebina) => {
        if (napaka){ odgovor.writeHead(404); odgovor.end('ni'); return; }
        const oznaka = '"' + crypto.createHash('sha1').update(vsebina).digest('hex').slice(0, 16) + '"';
        if (zahteva.headers['if-none-match'] === oznaka){ odgovor.writeHead(304); odgovor.end(); return; }
        odgovor.writeHead(200, {
          'Content-Type': VRSTE[path.extname(pot)] || 'application/octet-stream',
          'Cache-Control': 'max-age=600',        /* kot GitHub Pages */
          'ETag': oznaka
        });
        odgovor.end(vsebina);
      });
    });
    s.listen(0, '127.0.0.1', () => resolve({ s, vrata: s.address().port }));
  });
}

/* »Objavi« novo različico: zamenja naslov strani in dvigne CACHE v sw.js. */
function objavi(mapa, oznaka, razlicica){
  for (const f of ['index.html', 'kito.html', 'kviz.html'])
    fs.writeFileSync(path.join(mapa, f),
      fs.readFileSync(path.join(mapa, f), 'utf8').replace(/<title>[^<]*/, '<title>' + oznaka));
  fs.writeFileSync(path.join(mapa, 'sw.js'),
    fs.readFileSync(path.join(mapa, 'sw.js'), 'utf8')
      .replace(/otroske-igre-v[\w.-]+/, 'otroske-igre-' + razlicica));
}

const naslovOkvirja = async (stran, datoteka) => {
  await stran.evaluate(d => new Promise(r => {
    const f = document.getElementById('frame'); f.onload = r; f.src = d;
  }), datoteka);
  const okvir = stran.frames().find(f => f.url().indexOf(datoteka) > 0);
  return okvir ? okvir.title() : null;
};

(async () => {
  const mapa = postaviKopijo();
  const { s, vrata } = await zazeniStreznik(mapa);
  const U = 'http://127.0.0.1:' + vrata + '/';
  const preizkusi = [];
  /* Service worker teče le v Chromovem pogonu Playwrighta zanesljivo brez zaslona;
     mehanizem je del standarda in enak v Safariju. */
  const brskalnik = await pw.chromium.launch();
  const kontekst = await brskalnik.newContext();
  const stran = await kontekst.newPage();
  const napake = [];
  stran.on('pageerror', e => napake.push(String(e)));

  try {
    /* --- 1. namestitev --- */
    const t1 = preizkus('service worker se namesti in prevzame nadzor');
    objavi(mapa, 'PRVA', 'v1');
    await stran.goto(U + 'index.html');
    await stran.waitForFunction(() => navigator.serviceWorker.controller !== null, { timeout: 20000 })
      .catch(() => {});
    await cakaj(600);
    t1.trdi(await stran.evaluate(() => !!navigator.serviceWorker.controller),
      'service worker ni prevzel nadzora');
    t1.enako(await stran.title(), 'PRVA', 'ob prvem obisku se ne pokaže objavljena različica');
    t1.enako(await naslovOkvirja(stran, 'kito.html'), 'PRVA', 'igra v okvirju ni prava različica');
    preizkusi.push(t1);

    /* --- 2. nova različica ob prvem zagonu --- */
    const t2 = preizkus('nova različica pride do otroka ob prvem zagonu');
    await cakaj(1200);
    objavi(mapa, 'DRUGA', 'v2');
    await stran.goto(U + 'index.html');
    await cakaj(1200);
    t2.enako(await stran.title(), 'DRUGA',
      'ob prvem zagonu po objavi se še vedno naloži stara stran');
    t2.enako(await naslovOkvirja(stran, 'kito.html'), 'DRUGA',
      'igra v okvirju je ostala stara');
    t2.enako(await naslovOkvirja(stran, 'kviz.html'), 'DRUGA',
      'druga igra v okvirju je ostala stara');
    preizkusi.push(t2);

    /* --- 3. pospravljanje --- */
    const t3 = preizkus('star predpomnilnik se počisti');
    await stran.goto(U + 'index.html');
    await cakaj(1500);
    const kljuci = await stran.evaluate(() => caches.keys());
    t3.enako(kljuci.length, 1, 'ostalo je več predpomnilnikov: ' + kljuci.join(', '));
    preizkusi.push(t3);

    /* --- 4. brez interneta --- */
    const t4 = preizkus('brez interneta igre še vedno delujejo');
    await kontekst.setOffline(true);
    await stran.goto(U + 'index.html').catch(() => {});
    const besedilo = await stran.evaluate(() => document.body.innerText.trim().length).catch(() => 0);
    t4.trdi(besedilo > 200, 'domača stran se brez omrežja ne odpre (' + besedilo + ' znakov)');
    const igra = await stran.evaluate(async () => {
      try {
        const r = await fetch('kito.html'); const t = await r.text();
        return { dolzina: t.length, naslov: (t.match(/<title>([^<]*)/) || [])[1] };
      } catch (e){ return { napaka: String(e) }; }
    });
    t4.trdi(igra.dolzina > 50000, 'igre brez omrežja ni: ' + JSON.stringify(igra));
    /* Tu se pozna, ali service worker ob namestitvi jemlje datoteke mimo
       predpomnilnika HTTP – sicer bi shranil staro kopijo. */
    t4.enako(igra.naslov, 'DRUGA', 'brez omrežja se postreže stara kopija');
    preizkusi.push(t4);

    const tN = preizkus('brez napak v konzoli');
    tN.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 3).join(' | '));
    preizkusi.push(tN);
  } finally {
    await brskalnik.close();
    s.close();
    fs.rmSync(mapa, { recursive: true, force: true });
  }

  console.log('Preizkušeno na krajevnem strežniku z glavami GitHub Pages (max-age=600 + ETag)');
  process.exit(izpisi('Zbirka – posodabljanje nameščene aplikacije', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
