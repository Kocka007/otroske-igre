/* Globko – preizkus igranja: bot odigra cel krog vsake igre v vsakem področju. */
const { odpri, preizkus, izpisi } = require('./skupno');

/* Bot vedno odgovori pravilno; s PRAVILNO=0.5 polovico zgreši (za preverjanje razlag). */
const DELEZ_PRAVILNIH = Number(process.env.PRAVILNO === undefined ? 1 : process.env.PRAVILNO);

async function odigrajKrog(stran, t, podId, gid, kje){
  await stran.click('[data-pod="' + podId + '"]');
  await stran.waitForSelector('[data-igra="' + gid + '"]');
  await stran.click('[data-igra="' + gid + '"]');
  await stran.waitForSelector('#scrIgra:not([hidden]) .q');

  for (let korak = 0; korak < 10; korak++) {
    const st = await stran.evaluate(() => ({
      i: tek.i, tip: tek.q.tip, a: tek.q.a, cilj: tek.q.cilj,
      v: tek.q.v, stOpts: tek.q.opts ? tek.q.opts.length : 0,
      stTock: tek.q.tocke ? tek.q.tocke.length : 0,
      stZivih: tek.q.zive ? tek.q.zive.length : null,
      zap: tek.q.zap ? tek.q.zap.slice() : null
    }));
    t.enako(st.i, korak, kje + 'števec vprašanj');
    t.trdi(st.v && st.v.length > 4, kje + 'prazno vprašanje v ' + korak + '. koraku');

    const zadene = Math.random() < DELEZ_PRAVILNIH;

    if (st.tip === 'izbira') {
      const gumbi = await stran.$$('#opts .opt');
      t.enako(gumbi.length, st.stOpts, kje + 'število izrisanih gumbov');
      const i = zadene ? st.a : (st.a + 1) % st.stOpts;
      await gumbi[i].click();
    } else if (st.tip === 'zemljevid') {
      const vidne = await stran.evaluate(() => document.querySelectorAll('#karta .dz').length);
      t.trdi(vidne > 10, kje + 'zemljevid ni izrisan (' + vidne + ' obrisov)');
      if (st.stZivih !== null) {
        const zivih = await stran.evaluate(() => document.querySelectorAll('#karta .dz.igra').length);
        t.enako(zivih, st.stZivih, kje + 'število osvetljenih držav na zemljevidu');
      }
      /* odgovor sprožimo skozi isto pot kot tap – naTap() */
      await stran.evaluate(z => {
        const id = z.zadene ? z.cilj
          : (Array.from(document.querySelectorAll('#karta .dz'))
              .map(p => p.dataset.id).filter(x => x !== z.cilj)[0]);
        document.querySelector('#karta .dz[data-id="' + id + '"]').dispatchEvent(
          new MouseEvent('click', { bubbles: true }));
      }, { zadene, cilj: st.cilj });
    } else if (st.tip === 'sosede') {
      const zivih = await stran.evaluate(() => document.querySelectorAll('#karta .dz.igra').length);
      t.enako(zivih, st.stZivih, kje + 'število osvetljenih držav pri zaporedju sosed');
      t.trdi(st.zap && st.zap.length >= 2, kje + 'zaporedje sosed je prekratko');
      const tapni = id => stran.evaluate(i => document.querySelector('#karta .dz[data-id="' + i + '"]')
        .dispatchEvent(new MouseEvent('click', { bubbles: true })), id);
      if (zadene) {
        for (let s = 0; s < st.zap.length; s++) {
          await tapni(st.zap[s]);
          if (s + 1 < st.zap.length) {
            const korak = await stran.evaluate(() => tek.korak);
            t.enako(korak, s + 1, kje + 'števec najdenih sosed po ' + (s + 1) + '. tapu');
            t.trdi(!(await stran.evaluate(() => tek.odgovorjeno)),
              kje + 'krog se je zaključil, preden so bile najdene vse sosede');
          }
        }
      } else {
        const napacna = await stran.evaluate(z => Array.from(document.querySelectorAll('#karta .dz.igra'))
          .map(p => p.dataset.id).filter(x => z.indexOf(x) < 0)[0], st.zap);
        t.trdi(!!napacna, kje + 'na zemljevidu ni osvetljene države, ki ne bi bila soseda');
        await tapni(napacna);
      }
    } else {
      const pike = await stran.$$('#karta .tocka');
      t.enako(pike.length, st.stTock, kje + 'število izrisanih pik');
      const i = zadene ? st.a : (st.a + 1) % st.stTock;
      await stran.evaluate(i => document.querySelector('#karta .tocka[data-i="' + i + '"]')
        .dispatchEvent(new MouseEvent('click', { bubbles: true })), i);
    }

    /* po odgovoru mora biti odziv in gumb naprej */
    await stran.waitForSelector('#odziv #naprej', { timeout: 4000 }).catch(() => {});
    const po = await stran.evaluate(() => ({
      odgovorjeno: tek.odgovorjeno,
      odziv: (document.getElementById('odziv') || {}).textContent || '',
      naprej: !!document.getElementById('naprej'),
      znak: tek.znaki[tek.i]
    }));
    t.trdi(po.odgovorjeno, kje + 'odgovor ni bil zabeležen v ' + korak + '. koraku');
    t.trdi(po.odziv.trim().length > 3, kje + 'prazen odziv v ' + korak + '. koraku');
    t.enako(po.znak, zadene ? 1 : 0, kje + 'ocena odgovora v ' + korak + '. koraku');
    t.trdi(po.naprej, kje + 'ni gumba Naprej v ' + korak + '. koraku');
    await stran.click('#naprej');
  }

  /* zaključni zaslon */
  await stran.waitForSelector('#spet', { timeout: 4000 });
  const konec = await stran.evaluate(() => ({
    besedilo: document.querySelector('#scrIgra .konec') ? document.querySelector('#scrIgra .konec').textContent : '',
    ok: tek.ok, i: tek.i, spet: !!document.getElementById('spet'),
    nazaj: !!document.getElementById('nazajIgre2') || !!document.getElementById('nazajIgre')
  }));
  t.enako(konec.i, 10, kje + 'krog ni odigran do konca');
  t.trdi(konec.besedilo.length > 5, kje + 'prazen zaključni zaslon');
  t.trdi(konec.spet, kje + 'manjka gumb »Še enkrat«');
  if (DELEZ_PRAVILNIH === 1) t.enako(konec.ok, 10, kje + 'vseh deset pravilnih ni prineslo 10 točk');

  await stran.click('#nazajIgre2, #nazajIgre').catch(async () => {
    await stran.evaluate(() => narisiPodrocja());
  });
  await stran.evaluate(() => narisiPodrocja());
  await stran.waitForSelector('#scrPodrocja:not([hidden])');
}

(async () => {
  const { brskalnik, stran, napake, pogon } = await odpri('geografija.html');
  console.log('Pogon: ' + pogon);

  const podrocja = await stran.evaluate(() => PODROCJA.map(p => ({ id: p.id, nm: p.nm, igre: p.igre })));
  const preizkusi = [];
  let stKrogov = 0;

  for (const pod of podrocja) {
    const t = preizkus('področje ' + pod.nm + ' (' + pod.igre.length + ' iger)');
    for (const gid of pod.igre) {
      const nm = await stran.evaluate(g => IGRE[g].nm, gid);
      try {
        await odigrajKrog(stran, t, pod.id, gid, pod.id + '/' + gid + ' »' + nm + '« – ');
        stKrogov++;
      } catch (e) {
        t.trdi(false, pod.id + '/' + gid + ' – krog se je sesul: ' + e.message.split('\n')[0]);
        await stran.evaluate(() => narisiPodrocja());
      }
    }
    preizkusi.push(t);
  }

  const tN = preizkus('brez napak v konzoli');
  tN.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 5).join(' | '));
  preizkusi.push(tN);

  /* zvezdice in napredek se res shranijo */
  const tS = preizkus('napredek se shrani');
  const shranjeno = await stran.evaluate(() => JSON.parse(localStorage.getItem('globko_geografija_v1') || 'null'));
  tS.trdi(shranjeno, 'v localStorage ni ničesar');
  if (shranjeno) {
    tS.trdi(shranjeno.zvezde > 0, 'zvezdice se niso seštele');
    tS.enako(shranjeno.krogi, stKrogov, 'število odigranih krogov');
    tS.trdi(Object.keys(shranjeno.st).length > 0, 'stopnje iger se niso zabeležile');
  }
  preizkusi.push(tS);

  await brskalnik.close();
  console.log('Odigranih krogov: ' + stKrogov + ' (po 10 vprašanj)');
  process.exit(izpisi('Globko – igranje', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
