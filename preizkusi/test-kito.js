/* Kito – preizkus nivojev: sestava, izhodišče, fizika in ponovljivost. */
const { odpri, preizkus, izpisi } = require('./skupno');

const KORAKOV = Number(process.env.KORAKOV || 900);   /* 900 korakov = 15 sekund igre */

(async () => {
  const { brskalnik, stran, napake, dnevnik, pogon } = await odpri('kito.html');
  console.log('Pogon: ' + pogon);
  const preizkusi = [];

  /* --- vsak nivo se sestavi --- */
  const nivoji = await stran.evaluate(() => {
    const out = { nivoji: [], napakeSestave: [], stStopenj: STOPNJE.length,
                  P: typeof P !== 'undefined' ? P : null, sir: SIR, vis: VIS };
    for (let i = 0; i < STOPNJE.length; i++){
      const st = STOPNJE[i];
      let s;
      try { s = sestaviNivo(st); }
      catch (e){ out.napakeSestave.push(st.id + ': ' + e.message); continue; }
      const tipi = {};
      for (const o of s.objekti) tipi[o.tip] = (tipi[o.tip] || 0) + 1;
      out.nivoji.push({
        idx: i, id: st.id, ime: st.ime, st: st.st, bonus: !!st.bonus, biom: st.biom,
        w: st.w, h: st.h, seme: st.seme,
        uvod: st.uvod || '', glagol: st.glagol || '',
        namigov: (st.namigi || []).length,
        zacetek: s.zacetek, stObjektov: s.objekti.length, tipi,
        imaIzhod: !!tipi.izhod, imaDuha: !!tipi.duh,
        lik: st.lik || null
      });
    }
    return out;
  });

  const t1 = preizkus('vsak nivo se sestavi');
  t1.trdi(nivoji.napakeSestave.length === 0,
    'napake pri sestavi: ' + nivoji.napakeSestave.slice(0, 5).join(' | '));
  t1.enako(nivoji.nivoji.length, nivoji.stStopenj, 'sestavili se niso vsi nivoji');
  t1.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 3).join(' | '));
  for (const n of nivoji.nivoji){
    const kje = n.id + ' »' + n.ime + '«: ';
    t1.trdi(n.ime && n.ime.trim().length > 0, kje + 'nivo nima imena');
    t1.trdi(n.w > 0 && n.h > 0, kje + 'nivo nima velikosti');
    t1.trdi(n.stObjektov > 0, kje + 'nivo je prazen');
    t1.trdi(!!n.zacetek, kje + 'nivo nima izhodišča');
  }
  const idji = nivoji.nivoji.map(n => n.id);
  t1.enako(new Set(idji).size, idji.length, 'podvojen id nivoja');
  preizkusi.push(t1);

  /* --- vsak nivo se da končati --- */
  const t2 = preizkus('vsak nivo ima izhod');
  for (const n of nivoji.nivoji){
    const kje = n.id + ' »' + n.ime + '«: ';
    /* Nivo se konča ob izhodu ali ko so pobrani vsi duhovi. */
    t2.trdi(n.imaIzhod || n.imaDuha, kje + 'nivo nima ne izhoda ne duhov – ni ga mogoče končati');
  }
  preizkusi.push(t2);

  /* --- Kito se ne rodi v steni ali izven karte --- */
  const t3 = preizkus('izhodišče je prosto in na karti');
  const lege = await stran.evaluate(() => {
    const out = [];
    for (let i = 0; i < STOPNJE.length; i++){
      const st = STOPNJE[i];
      const s = sestaviNivo(st);
      const oblika = st.lik || (st.st >= 6 ? 'odrasel' : 'mladic');
      const L = LIKI[oblika];
      const z = s.zacetek;
      out.push({
        id: st.id, oblika,
        vSteni: vTrdnem(s.karta, z.x - L.w / 2, z.y - L.h, L.w, L.h),
        x: z.x, y: z.y, sirKarte: st.w * P, visKarte: st.h * P
      });
    }
    return out;
  });
  for (const l of lege){
    const kje = l.id + ': ';
    t3.trdi(!l.vSteni, kje + 'Kito (' + l.oblika + ') se rodi v steni – takoj bi se zataknil');
    t3.trdi(l.x >= 0 && l.x <= l.sirKarte && l.y >= 0 && l.y <= l.visKarte,
      kje + 'izhodišče je izven karte');
  }
  preizkusi.push(t3);

  /* --- svet teče in ostane pri sebi --- */
  const t4 = preizkus('svet teče brez napake');
  for (const n of nivoji.nivoji){
    const kje = n.id + ' »' + n.ime + '«: ';
    const izid = await stran.evaluate(([idx, korakov]) => {
      try {
        const st = STOPNJE[idx];
        /* Bot teče desno in občasno skoči, kot bi tapkal otrok, ki še ne pozna nivoja.
           Padec v prepad je del igre, zato igramo z življenji in preverimo, da svet
           padec ujame: Kita oživi pri zadnji točki ali pošteno konča nivo. */
        const sv = new Svet(st, { tezavnost: 'zgodba', nesmrtnost: false,
                                  oblika: st.lik || (st.st >= 6 ? 'odrasel' : 'mladic'),
                                  hroscev: 0, zivljenja: 5 });
        const v = { levo:0, desno:1, gor:0, dol:0, skok:0, napad:0, rjov:0 };
        const dno = st.h * P + 400;
        let najvecX = sv.igralec.x, zunajDna = 0, najvecZunajDna = 0;
        for (let i = 0; i < korakov; i++){
          v.skok = (i % 24 < 3) ? 1 : 0;
          sv.korak(v);
          if (!isFinite(sv.igralec.x) || !isFinite(sv.igralec.y))
            return { napaka: 'lega ni število v ' + i + '. koraku' };
          if (sv.igralec.x > najvecX) najvecX = sv.igralec.x;
          if (sv.igralec.y > dno){
            zunajDna++;
            if (zunajDna > najvecZunajDna) najvecZunajDna = zunajDna;
          } else zunajDna = 0;
          if (sv.stanje === 'zmaga' || sv.stanje === 'konec') break;
        }
        return { x: sv.igralec.x, y: sv.igralec.y, najvecX, zacetnaX: sv.zacetek ? sv.zacetek.x : null,
                 stanje: sv.stanje, najvecZunajDna, zivljenja: sv.zivljenja,
                 objektov: sv.objekti.length };
      } catch (e){ return { napaka: e.message }; }
    }, [n.idx, KORAKOV]);
    if (izid.napaka){ t4.trdi(false, kje + 'svet se je sesul: ' + izid.napaka); continue; }
    t4.trdi(isFinite(izid.x) && isFinite(izid.y), kje + 'lega ni število');
    /* Svet mora padec ujeti – ne sme pustiti Kita v neskončnem padanju. */
    t4.trdi(izid.najvecZunajDna < 240,
      kje + 'Kito je pod karto padal ' + izid.najvecZunajDna + ' korakov, ne da bi ga svet ujel');
    t4.trdi(izid.najvecX > (izid.zacetnaX || 0), kje + 'Kito se v ' + KORAKOV + ' korakih ni premaknil naprej');
    t4.trdi(['igra', 'zmaga', 'konec', 'preobrazba', 'izbira'].indexOf(izid.stanje) >= 0,
      kje + 'neznano stanje sveta: ' + izid.stanje);
  }
  preizkusi.push(t4);

  /* --- isto seme da isti nivo --- */
  const t5 = preizkus('nivo je ponovljiv');
  const ponovljivost = await stran.evaluate(() => {
    const out = [];
    for (let i = 0; i < STOPNJE.length; i++){
      const st = STOPNJE[i];
      const a = sestaviNivo(st), b = sestaviNivo(st);
      out.push({
        id: st.id,
        enakaKarta: JSON.stringify(a.karta.p || a.karta) === JSON.stringify(b.karta.p || b.karta),
        enakiObjekti: a.objekti.length === b.objekti.length &&
          a.objekti.every((o, k) => o.tip === b.objekti[k].tip && o.x === b.objekti[k].x && o.y === b.objekti[k].y),
        enakZacetek: a.zacetek.x === b.zacetek.x && a.zacetek.y === b.zacetek.y
      });
    }
    return out;
  });
  for (const p of ponovljivost){
    t5.trdi(p.enakaKarta, p.id + ': karta se ob dveh sestavah razlikuje');
    t5.trdi(p.enakiObjekti, p.id + ': objekti se ob dveh sestavah razlikujejo');
    t5.trdi(p.enakZacetek, p.id + ': izhodišče se ob dveh sestavah razlikuje');
  }
  preizkusi.push(t5);

  /* --- zgodba je napisana --- */
  const t6 = preizkus('vsak nivo ima zgodbo');
  let zNamigi = 0;
  for (const n of nivoji.nivoji){
    const kje = n.id + ': ';
    t6.trdi(n.uvod.trim().length > 10, kje + 'nivo nima uvoda v zgodbo');
    t6.trdi(n.biom && n.biom.length > 0, kje + 'nivo nima bioma');
    if (n.namigov > 0) zNamigi++;
  }
  /* Namigi so izbirni – zahtevamo le, da jih ima kakšen nivo, sicer bi bila
     naprava za namige mrtva koda. */
  t6.trdi(zNamigi > 0, 'noben nivo nima namigov');
  preizkusi.push(t6);

  /* --- vgrajeni samopreizkus, ki teče ob zagonu igre --- */
  const t7 = preizkus('vgrajeni samopreizkus je zadovoljen');
  const izpisi_ = dnevnik.filter(v => /KITO/i.test(v.besedilo) || /preizkus/i.test(v.besedilo));
  const opozorila = izpisi_.filter(v => v.vrsta === 'warning' || /napake/i.test(v.besedilo));
  t7.trdi(izpisi_.length > 0, 'igra ob zagonu ni izpisala izida samopreizkusa');
  t7.trdi(opozorila.length === 0,
    'vgrajeni samopreizkus je javil napake: ' + opozorila.map(v => v.besedilo).join(' | '));
  if (izpisi_.length) console.log('Vgrajeni samopreizkus: ' + izpisi_[0].besedilo);
  preizkusi.push(t7);

  /* --- izris mora ostati znotraj proračuna sličice --- */
  const t8 = preizkus('izris je dovolj hiter');
  const hitrost = await stran.evaluate(() => {
    const out = [];
    for (const i of [0, 2, 5, 7, 8]){
      zacniNivo(i);
      for (let n = 0; n < 120; n++){ V.desno = 1; sv.korak(V); }
      const t0 = performance.now(), N = 150;
      for (let n = 0; n < N; n++){ sv.korak(V); narisiPrizor(sv, nast, 0.5); }
      out.push({ id: STOPNJE[i].id, ms: (performance.now() - t0) / N });
    }
    return { out, nad: NAD, platno: document.getElementById('platno').width + '×' +
             document.getElementById('platno').height };
  });
  /* Pri 60 sličicah na sekundo je na voljo 16,7 ms; tu merimo v programskem
     izrisu brez grafične kartice, zato je meja postavljena na 14 ms. */
  for (const h of hitrost.out)
    t8.trdi(h.ms < 14, 'nivo ' + h.id + ': izris traja ' + h.ms.toFixed(1) +
      ' ms na sličico (meja 14 ms) pri platnu ' + hitrost.platno);
  preizkusi.push(t8);

  await brskalnik.close();
  console.log('Platno: ' + hitrost.platno + ' (nadvzorčenje ' + hitrost.nad + '×), izris ' +
    hitrost.out.map(h => h.ms.toFixed(1)).join(' / ') + ' ms na sličico');
  const glavnih = nivoji.nivoji.filter(n => !n.bonus).length;
  console.log('Nivojev: ' + nivoji.nivoji.length + ' (' + glavnih + ' glavnih, ' +
    (nivoji.nivoji.length - glavnih) + ' dodatnih), po ' + KORAKOV + ' korakov igre na nivo; ' +
    'nivojev z namigi: ' + nivoji.nivoji.filter(n => n.namigov > 0).length);
  process.exit(izpisi('Kito – nivoji', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
