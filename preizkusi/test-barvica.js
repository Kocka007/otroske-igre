/* Barvica – preizkus slik: vse slike na vseh stopnjah, barvanje in razveljavitev. */
const { odpri, preizkus, izpisi } = require('./skupno');

(async () => {
  const { brskalnik, stran, napake, pogon } = await odpri('pobarvanka.html');
  console.log('Pogon: ' + pogon);
  const preizkusi = [];

  /* --- vse slike se sestavijo na vseh svojih stopnjah --- */
  const podatki = await stran.evaluate(() => {
    const izhod = { slike: [], napakeGradnje: [], teme: TEME.map(t => t.id),
                    stStopenj: STOPNJE.length, stOrodij: ORODJA.length,
                    stNacinov: NACINI.length, stSlik: SLIKE.length };
    for (const s of SLIKE){
      const stopnje = [];
      for (const lv of s.stopnje){
        let sl;
        try { sl = s.gradi(lv); }
        catch (e){ izhod.napakeGradnje.push(s.id + ' lv' + lv + ': ' + e.message); continue; }
        if (!sl){ izhod.napakeGradnje.push(s.id + ' lv' + lv + ': brez slike'); continue; }
        const polja = sl.R.map(function(o){
          const b = pribBBox(o.s);
          return { x:b[0], y:b[1], w:b[2], h:b[3], c:o.c, sym:o.sym };
        });
        stopnje.push({ lv, w: sl.w, h: sl.h, polja, stCrt: (sl.L || []).length });
      }
      izhod.slike.push({ id: s.id, nm: s.nm, tema: s.tema, stopnje });
    }
    return izhod;
  });

  const t1 = preizkus('vse slike se sestavijo');
  t1.trdi(podatki.napakeGradnje.length === 0,
    'napake pri gradnji: ' + podatki.napakeGradnje.slice(0, 5).join(' | '));
  t1.trdi(podatki.stSlik > 0, 'v zbirki ni slik');
  t1.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 3).join(' | '));
  const idji = podatki.slike.map(s => s.id);
  t1.enako(new Set(idji).size, idji.length, 'podvojen id slike');
  for (const s of podatki.slike){
    t1.trdi(s.nm && s.nm.trim().length > 0, s.id + ': slika nima imena');
    t1.trdi(podatki.teme.indexOf(s.tema) >= 0, s.id + ': neznana tema ' + s.tema);
    t1.trdi(s.stopnje.length > 0, s.id + ': brez stopenj');
  }
  preizkusi.push(t1);

  /* --- polja so smiselna: dovolj velika za prst in znotraj platna --- */
  const t2 = preizkus('polja so dovolj velika in na platnu');
  for (const s of podatki.slike){
    for (const st of s.stopnje){
      const kje = s.id + ' lv' + st.lv + ': ';
      t2.trdi(st.w > 0 && st.h > 0, kje + 'platno nima velikosti');
      t2.trdi(st.polja.length >= 2, kje + 'manj kot dve polji');
      let velikih = 0;
      for (const p of st.polja){
        /* Polje sme gledati čez rob – obrezano je s clipPath – ne sme pa biti povsem
           zunaj: takega otrok ne vidi in ne more tapniti, slika pa nikoli ni končana. */
        t2.trdi(p.x < st.w && p.y < st.h && p.x + p.w > 0 && p.y + p.h > 0,
          kje + 'polje leži povsem zunaj platna (' +
          [p.x, p.y, p.w, p.h].map(v => v.toFixed(0)).join(',') + ' na ' + st.w + '×' + st.h + ')');
        if (p.w * p.h >= st.w * st.h * 0.01) velikih++;
      }
      /* Drobnost je pri pobarvanki namen (mandale, vzorci), zato velikosti ne
         predpisujemo – zahtevamo le, da ima slika vsaj eno polje, ki ga otrok
         zadene brez približevanja. */
      t2.trdi(velikih >= 1, kje + 'nobeno polje ni večje od stotine platna');
    }
  }
  preizkusi.push(t2);

  /* --- višja stopnja pomeni več dela, ne manj --- */
  const t3 = preizkus('višja stopnja ima več polj');
  for (const s of podatki.slike){
    for (let i = 1; i < s.stopnje.length; i++){
      const prej = s.stopnje[i-1], zdaj = s.stopnje[i];
      t3.trdi(zdaj.polja.length > prej.polja.length,
        s.id + ': stopnja ' + zdaj.lv + ' ima ' + zdaj.polja.length +
        ' polj, stopnja ' + prej.lv + ' pa ' + prej.polja.length);
    }
  }
  preizkusi.push(t3);

  /* --- vsaka tema ima kaj pokazati --- */
  const t4 = preizkus('vsaka tema ima slike');
  for (const t of podatki.teme){
    if (t === 'vse') continue;
    const koliko = podatki.slike.filter(s => s.tema === t).length;
    t4.trdi(koliko > 0, 'tema ' + t + ' nima nobene slike');
  }
  preizkusi.push(t4);

  /* --- barvanje res pobarva, razveljavitev res vrne --- */
  const t5 = preizkus('barvanje in razveljavitev delujeta');
  const vzorec = podatki.slike.filter((s, i) => i % 7 === 0).slice(0, 12);
  for (const s of vzorec){
    const lv = s.stopnje[0].lv;
    const izid = await stran.evaluate(([id, lv]) => {
      S.nacin = 'tap'; S.barva = '#e63946';
      odpri(id, lv);
      if (!P || !P.sl.R.length) return { napaka: 'slika se ni odprla' };
      const prej = P.barve.slice();
      pobarvaj(0);
      const poBarvanju = P.barve.slice();
      razveljavi();
      const poRazveljavitvi = P.barve.slice();
      return {
        stPolj: P.sl.R.length,
        barvaPrej: prej[0] || null,
        barvaPo: poBarvanju[0] || null,
        barvaNazaj: poRazveljavitvi[0] || null,
        sklad: P.sklad.length
      };
    }, [s.id, lv]);
    const kje = s.id + ' lv' + lv + ': ';
    if (izid.napaka){ t5.trdi(false, kje + izid.napaka); continue; }
    t5.enako(izid.barvaPo, '#e63946', kje + 'tap ni pobarval polja');
    t5.enako(izid.barvaNazaj, izid.barvaPrej, kje + 'razveljavitev ni vrnila prejšnjega stanja');
    t5.enako(izid.sklad, 0, kje + 'sklad razveljavitev se ni izpraznil');
  }
  preizkusi.push(t5);

  /* --- način »po številkah« potrebuje predlagane barve --- */
  const t6 = preizkus('način po številkah ima predlagane barve');
  const stev = await stran.evaluate(() => {
    let brez = [], skupaj = 0;
    for (const s of SLIKE){
      const sl = s.gradi(s.stopnje[s.stopnje.length - 1]);
      skupaj++;
      if (!barveSlike(sl).length) brez.push(s.id);
    }
    return { brez, skupaj };
  });
  t6.trdi(stev.brez.length === 0,
    stev.brez.length + ' od ' + stev.skupaj + ' slik nima predlaganih barv, npr.: ' +
    stev.brez.slice(0, 5).join(', '));
  preizkusi.push(t6);

  const t7 = preizkus('napredek se shrani');
  const shranjeno = await stran.evaluate(() => {
    shrani();
    return JSON.parse(localStorage.getItem(LS) || 'null');
  });
  t7.trdi(shranjeno, 'v localStorage ni ničesar');
  if (shranjeno) t7.trdi(!!shranjeno.trenutna, 'trenutna slika se ni shranila');
  preizkusi.push(t7);

  await brskalnik.close();
  const stStopenj = podatki.slike.reduce((a, s) => a + s.stopnje.length, 0);
  const stPolj = podatki.slike.reduce((a, s) => a + s.stopnje.reduce((b, x) => b + x.polja.length, 0), 0);
  console.log('Slik: ' + podatki.stSlik + ' v ' + (podatki.teme.length - 1) + ' temah, ' +
    stStopenj + ' različic, skupaj ' + stPolj + ' polj; orodij ' + podatki.stOrodij +
    ', načinov ' + podatki.stNacinov);
  process.exit(izpisi('Barvica – slike', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
