/* Olly – preizkus nalog: vse igre v vseh področjih, na vseh stopnjah, in odigrani krogi. */
const { odpri, preizkus, izpisi } = require('./skupno');

const NA_STOPNJO = Number(process.env.NA_STOPNJO || 25);

(async () => {
  const { brskalnik, stran, napake, pogon } = await odpri('anglescina.html');
  console.log('Pogon: ' + pogon);
  const preizkusi = [];

  const podatki = await stran.evaluate(({ naStopnjo }) => {
    const izhod = { igre: [], napakeGen: [], stGAMES: Object.keys(GAMES).length,
                    stAREAS: AREAS.length, stBesed: WORDS.length };
    for (const area of AREAS){
      for (const gid of area.games){
        const g = GAMES[gid];
        for (let st = 1; st <= g.steps; st++){
          const vzorci = [];
          for (let i = 0; i < naStopnjo; i++){
            let q;
            try { q = g.gen(st, area); }
            catch (e){ izhod.napakeGen.push(area.id + '/' + gid + ' st' + st + ': ' + e.message); continue; }
            if (!q){ izhod.napakeGen.push(area.id + '/' + gid + ' st' + st + ': brez vprašanja'); continue; }
            vzorci.push({
              kind: q.kind, task: q.task, key: q.key, hint: q.hint,
              opts: q.opts ? q.opts.map(String) : null, a: q.a,
              letters: q.letters ? q.letters.slice() : null,
              tiles: q.tiles ? q.tiles.slice() : null,
              answer: q.answer, en: q.en, sl: q.qsl, emo: q.emo,
              sent: q.sent, read: q.read ? q.read.length : 0,
              say: q.say, listen: !!q.listen
            });
          }
          izhod.igre.push({ area: area.id, areaNm: area.nm, gid, nm: g.nm, st, steps: g.steps, vzorci });
        }
      }
    }
    return izhod;
  }, { naStopnjo: NA_STOPNJO });

  const skupaj = podatki.igre.reduce((a, i) => a + i.vzorci.length, 0);

  const t1 = preizkus('generatorji ne mečejo napak');
  t1.trdi(podatki.napakeGen.length === 0, 'napake generatorjev: ' + podatki.napakeGen.slice(0, 5).join(' | '));
  t1.trdi(skupaj > 0, 'nobenega vprašanja');
  t1.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 3).join(' | '));
  preizkusi.push(t1);

  const t2 = preizkus('vsako vprašanje je veljavno');
  for (const i of podatki.igre){
    const kje = i.area + '/' + i.gid + ' st' + i.st + ': ';
    t2.trdi(i.vzorci.length > 0, kje + 'brez vprašanj');
    for (const q of i.vzorci){
      t2.trdi(['choice', 'spell', 'order'].indexOf(q.kind) >= 0, kje + 'neznana vrsta ' + q.kind);
      t2.trdi(typeof q.task === 'string' && q.task.trim().length > 4, kje + 'prazno navodilo');
      t2.trdi(typeof q.key === 'string' && q.key.length > 0, kje + 'brez ključa pri: ' + q.task);
      /* otrok mora imeti kaj brati, gledati ali slišati – pri igri »Poslušaj«
         je vsebina prav izgovorjena beseda, zato tam šteje q.say */
      t2.trdi(!!(q.en || q.emo || q.sl || q.sent || q.read || q.letters || q.tiles || q.say),
        kje + 'vprašanje ne ponudi ničesar: ' + q.task);
      if (q.listen) t2.trdi(!!q.say && String(q.say).trim().length > 0,
        kje + 'slušno vprašanje nima besede za izgovor: ' + q.task);
    }
  }
  preizkusi.push(t2);

  const t3 = preizkus('možnosti so različne in pravilna je med njimi');
  for (const i of podatki.igre){
    const kje = i.area + '/' + i.gid + ' st' + i.st + ': ';
    const najmanj = [2, 3, 3, 4, 4, 4, 4, 4][i.st - 1] || 4;
    for (const q of i.vzorci.filter(x => x.kind === 'choice')){
      t3.trdi(q.opts && q.opts.length >= 2, kje + 'manj kot dve možnosti pri: ' + q.task);
      if (!q.opts) continue;
      t3.trdi(q.opts.length >= Math.min(najmanj, 3),
        kje + 'na stopnji ' + i.st + ' le ' + q.opts.length + ' možnosti pri: ' + q.task);
      t3.trdi(new Set(q.opts).size === q.opts.length,
        kje + 'podvojena možnost pri: ' + q.task + ' → ' + q.opts.join(' / '));
      t3.trdi(q.opts.every(o => o.trim().length > 0), kje + 'prazna možnost pri: ' + q.task);
      t3.trdi(Number.isInteger(q.a) && q.a >= 0 && q.a < q.opts.length,
        kje + 'pravilen odgovor je izven seznama pri: ' + q.task);
    }
  }
  preizkusi.push(t3);

  const t4 = preizkus('sestavljanke se dajo sestaviti');
  for (const i of podatki.igre){
    const kje = i.area + '/' + i.gid + ' st' + i.st + ': ';
    for (const q of i.vzorci.filter(x => x.kind === 'spell')){
      t4.trdi(typeof q.answer === 'string' && q.answer.length > 0, kje + 'sestavljanka brez rešitve');
      t4.trdi(Array.isArray(q.letters) && q.letters.length >= q.answer.length,
        kje + 'premalo črk za besedo »' + q.answer + '«');
      /* vsaka črka rešitve mora biti med ponujenimi */
      if (Array.isArray(q.letters)){
        const na_voljo = q.letters.slice();
        let manjka = '';
        for (const c of q.answer.split('')){
          const k = na_voljo.indexOf(c);
          if (k < 0) manjka += c; else na_voljo.splice(k, 1);
        }
        t4.trdi(manjka === '', kje + 'za besedo »' + q.answer + '« manjkajo črke: ' + manjka);
      }
    }
    for (const q of i.vzorci.filter(x => x.kind === 'order')){
      t4.trdi(typeof q.answer === 'string' && q.answer.length > 0, kje + 'stavek brez rešitve');
      if (Array.isArray(q.tiles)){
        const pravilne = q.answer.split(' ').slice().sort().join('|');
        t4.trdi(q.tiles.slice().sort().join('|') === pravilne,
          kje + 'ploščice se ne ujemajo s stavkom »' + q.answer + '«: ' + q.tiles.join(' '));
      }
    }
  }
  preizkusi.push(t4);

  /* --- bot odigra cel krog vsake igre v vsakem področju --- */
  const t5 = preizkus('bot odigra krog vsake igre v vsakem področju');
  const krogi = await stran.evaluate(() => {
    const out = [];
    for (const area of AREAS){
      for (const gid of area.games){
        try {
          startRound(area, gid);
          for (let i = 0; i < ROUND; i++){
            const q = cur.q;
            if (!q){ out.push({ area: area.id, gid, napaka: 'brez vprašanja v ' + i + '. koraku' }); break; }
            if (q.kind === 'choice') answerChoice(q.a);
            else grade(true, q.answer);
            cur.i++; cur.answered = false;
            if (cur.i < ROUND) nextQuestion();
          }
          out.push({ area: area.id, gid, i: cur.i, ok: cur.ok });
        } catch (e){
          out.push({ area: area.id, gid, napaka: e.message });
        }
      }
    }
    return out;
  });
  for (const k of krogi){
    const kje = k.area + '/' + k.gid + ' – ';
    if (k.napaka){ t5.trdi(false, kje + 'krog se je sesul: ' + k.napaka); continue; }
    t5.enako(k.i, 10, kje + 'krog ni odigran do konca');
    t5.enako(k.ok, 10, kje + 'vsi odgovori pravilni, a rezultat ni poln');
  }
  preizkusi.push(t5);

  /* --- igre, ki potrebujejo govor, se na napravi brez govora ne ponudijo --- */
  const t5b = preizkus('brez govora se slušne igre ne ponudijo');
  const brezGovora = await stran.evaluate(() => {
    const naVoljo = 'speechSynthesis' in window;
    const out = { naVoljo, ponujene: {}, glasovne: [] };
    for (const gid in GAMES) if (GAMES[gid].voice) out.glasovne.push(gid);
    for (const area of AREAS)
      out.ponujene[area.id] = area.games.filter(gid =>
        !(GAMES[gid].voice && !('speechSynthesis' in window)));
    return out;
  });
  t5b.trdi(brezGovora.glasovne.length > 0, 'nobena igra ni označena kot glasovna');
  for (const id in brezGovora.ponujene){
    const ponujene = brezGovora.ponujene[id];
    for (const gid of brezGovora.glasovne){
      const jeZraven = ponujene.indexOf(gid) >= 0;
      t5b.enako(jeZraven, brezGovora.naVoljo,
        'področje ' + id + ': igra ' + gid + ' je ponujena, čeprav govor ' +
        (brezGovora.naVoljo ? 'je' : 'ni') + ' na voljo');
    }
  }
  preizkusi.push(t5b);

  const t6 = preizkus('vse igre in področja so pokriti');
  const preizkusene = new Set(podatki.igre.map(i => i.gid));
  const vse = await stran.evaluate(() => Object.keys(GAMES));
  for (const gid of vse) t6.trdi(preizkusene.has(gid), 'igra ' + gid + ' ni bila preizkušena');
  t6.enako(new Set(podatki.igre.map(i => i.area)).size, podatki.stAREAS, 'število preizkušenih področij');
  preizkusi.push(t6);

  const t7 = preizkus('napredek se shrani');
  const shranjeno = await stran.evaluate(() => { save(); return JSON.parse(localStorage.getItem('olly_anglescina_v1') || 'null'); });
  t7.trdi(shranjeno, 'v localStorage ni ničesar');
  if (shranjeno) t7.trdi(shranjeno.stars > 0, 'zvezdice se niso seštele');
  preizkusi.push(t7);

  await brskalnik.close();
  console.log('Besed v zbirki: ' + podatki.stBesed + ', iger: ' + podatki.stGAMES +
    ', področij: ' + podatki.stAREAS + ', preizkušenih vprašanj: ' + skupaj +
    ', odigranih krogov: ' + krogi.filter(k => !k.napaka).length);
  process.exit(izpisi('Olly – naloge', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
