/* Vseved – preizkus zbirke vprašanj in vseh šestih načinov igre. */
const { odpri, preizkus, izpisi } = require('./skupno');

async function odigrajNacin(stran, t, nacin, kje, kat){
  await stran.evaluate(() => narisiDomov());
  await stran.click('[data-nacin="' + nacin + '"]');
  const dnevni = await stran.evaluate(n => !!NACINI[n].dnevni, nacin);
  if (!dnevni){
    await stran.waitForSelector('#scrPodrocja:not([hidden]) [data-kat]');
    await stran.click('[data-kat="' + (kat || '') + '"]');
  }
  await stran.waitForSelector('#scrIgra:not([hidden]) #opts');

  const n = await stran.evaluate(x => NACINI[x], nacin);
  const najvec = n.cas ? 200 : n.st;

  for (let korak = 0; korak < najvec; korak++){
    const konec = await stran.evaluate(() => !tek || tek.konec);
    if (konec) break;
    const st = await stran.evaluate(() => ({
      i: tek.i, a: tek.sest.a, stOpts: tek.sest.opts.length,
      v: tek.sest.q.v, kat: tek.sest.q.k, drzi: tek.sest.drzi
    }));
    t.trdi(st.v && st.v.trim().length > 4, kje + 'prazno vprašanje v ' + korak + '. koraku');
    t.trdi(st.stOpts >= 2, kje + 'manj kot dve možnosti');
    const stGumbov = await stran.evaluate(() => document.querySelectorAll('#opts .opt').length);
    t.enako(stGumbov, st.stOpts, kje + 'število izrisanih gumbov');

    if (n.hitro){
      /* Hitri ogenj sam skoči na naslednje vprašanje, zato gumba ne smemo držati v roki. */
      const kliknil = await stran.evaluate(a => {
        const g = document.querySelector('#opts .opt[data-i="' + a + '"]');
        if (!g) return false;
        g.click(); return true;
      }, st.a);
      t.trdi(kliknil, kje + 'gumba ni bilo več na zaslonu');
      await stran.waitForFunction(i => !tek || tek.konec || tek.i > i, st.i, { timeout: 3000 }).catch(() => {});
      continue;
    }
    /* Klik sprožimo v strani: gumbi se ob vsakem vprašanju na novo izrišejo, zato jih
       ni varno držati v roki – dogodek pa je pravi in gre skozi isti poslušalec kot tap. */
    const kliknil = await stran.evaluate(a => {
      const g = document.querySelector('#opts .opt[data-i="' + a + '"]');
      if (!g) return false;
      g.click(); return true;
    }, st.a);
    t.trdi(kliknil, kje + 'gumba ni bilo več na zaslonu');
    await stran.waitForSelector('#naprej', { timeout: 4000 });
    const po = await stran.evaluate(() => ({
      znak: tek.znaki[tek.i], odziv: document.getElementById('odziv').textContent
    }));
    t.enako(po.znak, 1, kje + 'pravilen odgovor ni bil ocenjen kot pravilen');
    t.trdi(po.odziv.indexOf('Točno') >= 0, kje + 'brez potrditve v odzivu');
    await stran.click('#naprej');
  }

  await stran.waitForSelector('#spet', { timeout: 70000 });
  const k = await stran.evaluate(() => ({
    ok: tek.ok, konec: tek.konec,
    besedilo: document.querySelector('#scrIgra .konec').textContent
  }));
  t.trdi(k.konec, kje + 'krog se ni zaključil');
  t.trdi(k.besedilo.length > 5, kje + 'prazen zaključni zaslon');
  if (!n.cas) t.enako(k.ok, n.st, kje + 'vsi odgovori pravilni, a rezultat ni poln');
  return k;
}

(async () => {
  const { brskalnik, stran, napake, pogon } = await odpri('kviz.html');
  console.log('Pogon: ' + pogon);
  const preizkusi = [];

  const zbirka = await stran.evaluate(() => ({
    vprasanja: VPRASANJA, podrocja: PODROCJA.map(p => p.id), nacini: Object.keys(NACINI)
  }));

  /* --- 1. oblika vsakega vprašanja --- */
  const t1 = preizkus('vsako vprašanje je veljavno');
  const vidVprasanj = {};
  for (const q of zbirka.vprasanja){
    const kje = '»' + String(q.v).slice(0, 48) + '«: ';
    t1.trdi(zbirka.podrocja.indexOf(q.k) >= 0, kje + 'neznano področje ' + q.k);
    t1.trdi([1, 2, 3].indexOf(q.t) >= 0, kje + 'neveljavna zahtevnost ' + q.t);
    t1.trdi(typeof q.v === 'string' && q.v.trim().length >= 8, kje + 'prekratko vprašanje');
    t1.trdi(/[?»]$/.test(String(q.v).trim()), kje + 'vprašanje se ne konča z vprašajem');
    t1.trdi(typeof q.o === 'string' && q.o.trim().length > 0, kje + 'prazen pravilen odgovor');
    t1.trdi(Array.isArray(q.n) && q.n.length === 3, kje + 'nima natanko treh napačnih odgovorov');
    if (Array.isArray(q.n)){
      t1.trdi(new Set(q.n).size === q.n.length, kje + 'podvojen napačen odgovor: ' + q.n.join(' / '));
      t1.trdi(q.n.indexOf(q.o) < 0, kje + 'pravilen odgovor je tudi med napačnimi');
      t1.trdi(q.n.every(x => typeof x === 'string' && x.trim().length > 0), kje + 'prazen napačen odgovor');
    }
    t1.trdi(!vidVprasanj[q.v], kje + 'podvojeno vprašanje');
    vidVprasanj[q.v] = 1;
  }
  preizkusi.push(t1);

  /* --- 2. razlage --- */
  const t2 = preizkus('vprašanja imajo razlago');
  const brezRazlage = zbirka.vprasanja.filter(q => !q.zn || !q.zn.trim());
  t2.trdi(brezRazlage.length === 0,
    brezRazlage.length + ' vprašanj brez razlage, npr.: ' + brezRazlage.slice(0, 3).map(q => q.v).join(' | '));
  preizkusi.push(t2);

  /* --- 3. pokritost področij in stopenj --- */
  const t3 = preizkus('vsako področje pokriva vse tri stopnje');
  const po = {};
  for (const q of zbirka.vprasanja){
    po[q.k] = po[q.k] || { 1:0, 2:0, 3:0, skupaj:0 };
    po[q.k][q.t]++; po[q.k].skupaj++;
  }
  const tabela = [];
  for (const k of zbirka.podrocja){
    const s = po[k] || { 1:0, 2:0, 3:0, skupaj:0 };
    tabela.push('  ' + k.padEnd(10) + ' skupaj ' + String(s.skupaj).padStart(3) +
      '  (lahko ' + s[1] + ', srednje ' + s[2] + ', težko ' + s[3] + ')');
    /* zaloga() zahteva vsaj 4 vprašanja v dovoljenem pasu, sicer pade nazaj na vse področje */
    t3.trdi(s[1] >= 4, 'področje ' + k + ': premalo lahkih vprašanj (' + s[1] + ', potrebna vsaj 4)');
    t3.trdi(s[2] >= 4, 'področje ' + k + ': premalo srednjih vprašanj (' + s[2] + ', potrebna vsaj 4)');
    t3.trdi(s[3] >= 4, 'področje ' + k + ': premalo težkih vprašanj (' + s[3] + ', potrebna vsaj 4)');
    /* najdaljši način ima 12 vprašanj; področje mora zdržati krog brez ponavljanja */
    t3.trdi(s.skupaj >= 12, 'področje ' + k + ': manj kot 12 vprašanj (' + s.skupaj + ') – krog se bo ponavljal');
  }
  preizkusi.push(t3);

  /* --- 4. vseh šest načinov se odigra --- */
  const t4 = preizkus('vseh šest načinov se odigra do konca');
  for (const nacin of zbirka.nacini){
    const nm = await stran.evaluate(n => NACINI[n].nm, nacin);
    try { await odigrajNacin(stran, t4, nacin, nacin + ' »' + nm + '« – '); }
    catch (e){ t4.trdi(false, nacin + ' – krog se je sesul: ' + e.message.split('\n')[0]); }
  }
  t4.enako(zbirka.nacini.length, 6, 'število načinov igre');
  preizkusi.push(t4);

  /* --- 5. igra po posameznem področju --- */
  const t5 = preizkus('klasični kviz deluje v vsakem področju');
  for (const k of zbirka.podrocja){
    try { await odigrajNacin(stran, t5, 'kviz', 'področje ' + k + ' – ', k); }
    catch (e){ t5.trdi(false, 'področje ' + k + ' – krog se je sesul: ' + e.message.split('\n')[0]); }
  }
  preizkusi.push(t5);

  /* --- 6. področja so pravilno opisana in imajo barvo v vmesniku --- */
  const t6 = preizkus('vsako področje ima ime, emoji in barvo');
  const podatki = await stran.evaluate(() => PODROCJA);
  t6.trdi(podatki.length >= 14, 'manj kot štirinajst področij (' + podatki.length + ')');
  const vidId = {};
  for (const p of podatki){
    t6.trdi(!!p.nm && p.nm.length > 2, 'področje ' + p.id + ' nima imena');
    t6.trdi(!!p.emo, 'področje ' + p.id + ' nima emojija');
    t6.trdi(/^#[0-9a-f]{6}$/i.test(p.c || ''), 'področje ' + p.id + ' nima veljavne barve: ' + p.c);
    t6.trdi(!vidId[p.id], 'podvojen id področja: ' + p.id);
    vidId[p.id] = 1;
  }
  await stran.evaluate(() => { narisiDomov(); narisiPodrocja('kviz'); });
  await stran.waitForSelector('#scrPodrocja:not([hidden]) [data-kat]');
  const cipi = await stran.evaluate(() => Array.from(document.querySelectorAll('.chip[data-kat]'))
    .filter(c => c.dataset.kat)
    .map(c => ({ kat: c.dataset.kat, c: c.style.getPropertyValue('--c').trim() })));
  t6.enako(cipi.length, podatki.length, 'število izrisanih čipov področij');
  for (const c of cipi) t6.trdi(!!c.c, 'čip področja ' + c.kat + ' nima barve v spremenljivki --c');
  preizkusi.push(t6);

  /* --- 7. maskota in prehod med zasloni --- */
  const t7 = preizkus('maskota in prehod med zasloni');
  const masko = await stran.evaluate(() => {
    narisiDomov();
    const m = document.querySelector('.masko');
    if (!m) return null;
    const nastr = ['pozdrav', 'veselo', 'zamisljeno', 'zalostno'].map(n => {
      m.dataset.nastr = n;
      const u = m.querySelector('.u-' + n);
      return u ? getComputedStyle(u).display : 'brez';
    });
    /* velika maskota v uvodni kartici mora imeti oblaček z repkom tik ob sebi */
    const uvod = document.querySelector('#scrDomov .uvod');
    const velika = uvod && uvod.querySelector('.masko');
    const oblacek = uvod && uvod.querySelector('.oblacek');
    return {
      nastr,
      stMasko: document.querySelectorAll('.masko').length,
      sirinaVelike: velika ? velika.getBoundingClientRect().width : 0,
      oblacekVUvodu: !!oblacek,
      besedilo: oblacek ? oblacek.textContent.trim() : '',
      repek: oblacek ? getComputedStyle(oblacek, '::after').borderRightColor : '',
      krogIkone: (() => {
        const e = document.querySelector('.nacin .emo');
        if (!e) return null;
        const st = getComputedStyle(e);
        return { r: st.borderTopLeftRadius, w: parseFloat(st.width) };
      })()
    };
  });
  t7.trdi(!!masko, 'maskote (SVG .masko) ni na strani');
  if (masko){
    t7.trdi(masko.nastr.every(d => d === 'block'),
      'vsa štiri razpoloženja maskote se ne izrišejo: ' + masko.nastr.join(', '));
    t7.trdi(masko.stMasko >= 2, 'na domačem zaslonu morata biti maskota v glavi in velika v uvodni kartici');
    t7.trdi(masko.sirinaVelike >= 72,
      'velika maskota mora meriti vsaj 72 px, meri ' + Math.round(masko.sirinaVelike));
    t7.trdi(masko.oblacekVUvodu, 'oblaček ni ob maskoti v uvodni kartici');
    t7.trdi(masko.besedilo.length > 5, 'oblaček je prazen: »' + masko.besedilo + '«');
    t7.trdi(!!masko.repek && masko.repek !== 'rgba(0, 0, 0, 0)',
      'oblaček nima repka proti maskoti');
    t7.trdi(masko.krogIkone && parseFloat(masko.krogIkone.r) >= masko.krogIkone.w / 2 - 1,
      'ikona načina igre ni v krogu: ' + JSON.stringify(masko.krogIkone));
  }
  /* na zaslonu z vprašanjem se maskota odzove na odgovor */
  await stran.evaluate(() => { narisiDomov(); });
  await stran.click('[data-nacin="kviz"]');
  await stran.waitForSelector('#scrPodrocja:not([hidden]) [data-kat]');
  await stran.click('[data-kat=""]');
  await stran.waitForSelector('#scrIgra:not([hidden]) #opts');
  const vIgri = await stran.evaluate(() => ({
    masko: !!document.querySelector('#scrIgra .uvod .masko'),
    oblacek: (document.querySelector('#scrIgra .uvod .oblacek') || {}).textContent || ''
  }));
  t7.trdi(vIgri.masko, 'na zaslonu z vprašanjem ni maskote');
  t7.trdi(vIgri.oblacek.trim().length > 3, 'maskota med vprašanjem nima stavka v oblačku');
  await stran.evaluate(() => document.querySelector('#opts .opt[data-i="' + tek.sest.a + '"]').click());
  await stran.waitForSelector('#naprej');
  const poPravilnem = await stran.evaluate(() => ({
    nastr: document.querySelector('#scrIgra .uvod .masko').dataset.nastr,
    oblacek: document.querySelector('#scrIgra .uvod .oblacek').textContent
  }));
  t7.enako(poPravilnem.nastr, 'veselo', 'maskota se ob pravilnem odgovoru ne razveseli');
  t7.trdi(poPravilnem.oblacek.trim().length > 3, 'maskota ob odgovoru nič ne reče');
  /* prehod sme biti samo vizualen: hidden mora veljati takoj ob preklopu */
  const takoj = await stran.evaluate(() => {
    narisiDomov();
    const prej = { igra: scrIgra.hidden, domov: scrDomov.hidden };
    pokaziZaslon(scrIgra);
    return { prej, po: { igra: scrIgra.hidden, domov: scrDomov.hidden } };
  });
  t7.trdi(takoj.prej.igra && !takoj.prej.domov, 'domači zaslon se ni prikazal');
  t7.trdi(!takoj.po.igra && takoj.po.domov, 'hidden se ob prehodu ne preklopi takoj');
  preizkusi.push(t7);

  const tN = preizkus('brez napak v konzoli');
  tN.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 5).join(' | '));
  preizkusi.push(tN);

  await brskalnik.close();
  console.log('Vprašanj v zbirki: ' + zbirka.vprasanja.length);
  console.log(tabela.join('\n'));
  process.exit(izpisi('Vseved – zbirka in načini', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
