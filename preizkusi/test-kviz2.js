/* Vseved – preizkus pravil: lestvica, pomoči, štoparica, izziv dneva, prehodi med načini. */
const { odpri, preizkus, izpisi } = require('./skupno');

const klikni = (stran, izbirnik) => stran.evaluate(s => {
  const g = document.querySelector(s); if (!g) return false; g.click(); return true;
}, izbirnik);

const stanjeKroga = stran => stran.evaluate(() => tek ? {
  i: tek.i, ok: tek.ok, konec: tek.konec, a: tek.sest ? tek.sest.a : null,
  stOpts: tek.sest ? tek.sest.opts.length : 0, v: tek.sest ? tek.sest.q.v : null,
  pomoc: Object.assign({}, tek.pomoc), znaki: tek.znaki.slice()
} : null);

async function zacniNacin(stran, nacin, kat){
  await stran.evaluate(() => narisiDomov());
  await klikni(stran, '[data-nacin="' + nacin + '"]');
  const dnevni = await stran.evaluate(n => !!NACINI[n].dnevni, nacin);
  if (!dnevni){
    await stran.waitForSelector('#scrPodrocja:not([hidden]) [data-kat]');
    await klikni(stran, '[data-kat="' + (kat || '') + '"]');
  }
  await stran.waitForSelector('#scrIgra:not([hidden]) #opts');
}

/* odgovori pravilno (prav=true) ali napačno in po potrebi klikne Naprej */
async function odgovori(stran, prav, naprej){
  const st = await stanjeKroga(stran);
  const i = prav ? st.a : (st.a + 1) % st.stOpts;
  await stran.evaluate(i => document.querySelector('#opts .opt[data-i="' + i + '"]').click(), i);
  if (naprej !== false){
    await stran.waitForSelector('#naprej', { timeout: 4000 }).catch(() => {});
    await klikni(stran, '#naprej');
  }
  return st;
}

(async () => {
  const { brskalnik, stran, napake, pogon } = await odpri('kviz.html');
  console.log('Pogon: ' + pogon);
  const preizkusi = [];

  /* --- 1. lestvica: napaka konča vzpon --- */
  const t1 = preizkus('lestvica – napaka konča vzpon');
  await stran.evaluate(() => { localStorage.clear(); STANJE = Object.assign({}, SVEZE, { st:{}, gor:{}, dol:{}, stat:{}, slabo:{}, rek:{}, izziv:{} }); });
  await zacniNacin(stran, 'lestvica');
  for (let i = 0; i < 2; i++) await odgovori(stran, true);
  let st = await stanjeKroga(stran);
  t1.enako(st.i, 2, 'po dveh pravilnih mora biti igralec na tretji stopnički');
  await odgovori(stran, false, false);
  const pred = await stran.evaluate(() => document.getElementById('naprej').textContent);
  t1.trdi(pred.indexOf('Zaključi') >= 0, 'po napaki mora gumb ponuditi »Zaključi«, dobil: ' + pred);
  await klikni(stran, '#naprej');
  await stran.waitForSelector('#spet', { timeout: 4000 });
  st = await stanjeKroga(stran);
  t1.trdi(st.konec, 'napačen odgovor ni končal vzpona');
  t1.enako(st.i, 2, 'vzpon se je končal na napačni stopnički');
  preizkusi.push(t1);

  /* --- 2. lestvica: varna stopnička se shrani --- */
  const t2 = preizkus('lestvica – varni stopnički 4 in 8');
  await stran.evaluate(() => { STANJE.rek = {}; shrani(); });
  await zacniNacin(stran, 'lestvica');
  for (let i = 0; i < 5; i++) await odgovori(stran, true);   /* mimo 4. stopničke */
  await odgovori(stran, false, false);
  await klikni(stran, '#naprej');
  await stran.waitForSelector('#spet', { timeout: 4000 });
  const rek = await stran.evaluate(() => STANJE.rek.lestvica);
  t2.enako(rek, 5, 'dosežena stopnička ni bila shranjena');
  const podnaslov = await stran.evaluate(() => document.querySelector('#scrIgra .konec').textContent);
  t2.trdi(podnaslov.indexOf('4') >= 0, 'zaključni zaslon ne omeni zadnje varne stopničke 4, besedilo: ' + podnaslov.slice(0, 80));
  preizkusi.push(t2);

  /* --- 3. pomoči --- */
  const t3 = preizkus('lestvica – tri pomoči');
  await zacniNacin(stran, 'lestvica');
  const prej = await stanjeKroga(stran);
  t3.enako(prej.stOpts, 4, 'na prvi stopnički morajo biti štiri možnosti');
  t3.trdi(await klikni(stran, '[data-pomoc="pol"]'), 'gumba 50 : 50 ni');
  const poPol = await stran.evaluate(() => ({
    skriti: document.querySelectorAll('#opts .opt.skrit').length,
    pravSkrit: document.querySelector('#opts .opt[data-i="' + tek.sest.a + '"]').classList.contains('skrit'),
    onemogocen: document.querySelector('[data-pomoc="pol"]').disabled,
    zeUporabljena: tek.pomoc.pol
  }));
  t3.enako(poPol.skriti, 2, '50 : 50 mora skriti natanko dva napačna odgovora');
  t3.trdi(!poPol.pravSkrit, '50 : 50 je skril pravilen odgovor');
  t3.trdi(poPol.onemogocen, 'gumb 50 : 50 po uporabi ni onemogočen');
  t3.trdi(!poPol.zeUporabljena, 'pomoč 50 : 50 se ni porabila');

  t3.trdi(await klikni(stran, '[data-pomoc="namig"]'), 'gumba za namig ni');
  const namig = await stran.evaluate(() => document.getElementById('odziv').textContent);
  t3.trdi(namig.indexOf('💡') >= 0 && namig.length > 10, 'namig se ni izpisal: ' + namig);

  const predZamenjavo = await stanjeKroga(stran);
  t3.trdi(await klikni(stran, '[data-pomoc="zamenjaj"]'), 'gumba za zamenjavo ni');
  const poZam = await stanjeKroga(stran);
  t3.trdi(poZam.v !== predZamenjavo.v, 'zamenjava ni prinesla drugega vprašanja');
  t3.enako(poZam.i, predZamenjavo.i, 'zamenjava ne sme premakniti stopničke');
  t3.trdi(!poZam.pomoc.zamenjaj, 'zamenjava se ni porabila');
  preizkusi.push(t3);

  /* --- 4. hitri ogenj: štoparica res konča krog --- */
  const t4 = preizkus('hitri ogenj – štoparica konča krog');
  await zacniNacin(stran, 'hitri');
  const cas = await stran.evaluate(() => NACINI.hitri.cas);
  /* uro prevrtimo: začetek premaknemo tako, da ostane le še sekunda */
  await stran.evaluate(c => { tek.zacetek = Date.now() - (c - 1) * 1000; }, cas);
  const zacetnoI = (await stanjeKroga(stran)).i;
  await stran.waitForSelector('#spet', { timeout: 8000 });
  const k4 = await stanjeKroga(stran);
  t4.trdi(k4.konec, 'iztek časa ni končal kroga');
  t4.trdi(zacetnoI >= 0, 'krog se sploh ni začel');
  const teceSe = await stran.evaluate(() => ura !== null);
  t4.trdi(!teceSe, 'štoparica po koncu kroga še vedno teče');
  preizkusi.push(t4);

  /* --- 5. izziv dneva je za vse enak in ni odvisen od napredka --- */
  const t5 = preizkus('izziv dneva je ponovljiv');
  async function izzivVprasanja(){
    await zacniNacin(stran, 'izziv');
    const v = [];
    for (let i = 0; i < 10; i++){
      v.push((await stanjeKroga(stran)).v);
      await odgovori(stran, true);
    }
    await stran.waitForSelector('#spet', { timeout: 4000 });
    return v;
  }
  const prvi = await izzivVprasanja();
  const drugi = await izzivVprasanja();
  t5.enako(drugi.join('|'), prvi.join('|'), 'izziv dneva je drugič izbral druga vprašanja');
  t5.enako(new Set(prvi).size, 10, 'izziv dneva ponovi isto vprašanje znotraj kroga');
  /* napredek ne sme vplivati */
  await stran.evaluate(() => { STANJE.st = { narava:3, telo:3, vesolje:3, znanost:3, zgodovina:3, geo:3,
    sport:3, kultura:3, jezik:3, logika:3, vsakdan:3, slo:3 }; STANJE.slabo = { }; shrani(); });
  const tretji = await izzivVprasanja();
  t5.enako(tretji.join('|'), prvi.join('|'), 'izziv dneva se je spremenil, ko se je spremenil napredek');
  /* drug datum mora dati drugačen izbor */
  const drugDan = await stran.evaluate(() => {
    const r = nakljucnik(seme('2030-1-1'));
    const videni = {}, v = [];
    for (let i = 0; i < 10; i++){ const q = izberiVprasanje(null, 2, videni, r); videni[q.v] = 1; v.push(q.v); }
    return v;
  });
  t5.trdi(drugDan.join('|') !== prvi.join('|'), 'drug dan bi moral prinesti drug izziv');
  preizkusi.push(t5);

  /* --- 6. prehod iz hitrega ognja v drug način --- */
  const t6 = preizkus('hitri ogenj ne posega v naslednji krog');
  await zacniNacin(stran, 'hitri');
  /* odgovorimo in takoj (še preden se sproži samodejni skok) začnemo drug način */
  await odgovori(stran, true, false);
  await zacniNacin(stran, 'drzi');
  const zacetek = await stanjeKroga(stran);
  await new Promise(r => setTimeout(r, 1200));   /* čas, v katerem bi se sprožil zaostali skok */
  const po = await stanjeKroga(stran);
  t6.enako(po.i, zacetek.i,
    'zaostali samodejni skok iz hitrega ognja je prestavil vprašanje v novem krogu ' +
    '(iz ' + zacetek.i + ' v ' + po.i + ')');
  t6.trdi(po.v === zacetek.v, 'novemu krogu se je vprašanje zamenjalo samo od sebe');
  preizkusi.push(t6);

  const tN = preizkus('brez napak v konzoli');
  tN.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 5).join(' | '));
  preizkusi.push(tN);

  await brskalnik.close();
  process.exit(izpisi('Vseved – pravila', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
