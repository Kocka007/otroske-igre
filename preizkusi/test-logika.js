/* Globko – preizkus logike: vse igre na vseh stopnjah, brez odpiranja zaslonov. */
const { odpri, preizkus, izpisi } = require('./skupno');

const NA_STOPNJO = Number(process.env.NA_STOPNJO || 45);

(async () => {
  const { brskalnik, stran, napake } = await odpri('geografija.html');

  const podatki = await stran.evaluate(({ naStopnjo }) => {
    /* Vprašanja generiramo v strani, ker so generatorji odvisni od projekcije in obrisov. */
    const izhod = { igre: [], obseg: {}, meje: {}, napakeGen: [] };
    for (const k in ZEMLJEVIDI) izhod.obseg[k] = { w: ZEMLJEVIDI[k].w, h: ZEMLJEVIDI[k].h };
    const sloOkvir = okvirDrzave('slovenija', 'Slovenia');
    izhod.sloOkvir = sloOkvir;

    for (const pod of PODROCJA){
      for (const gid of pod.igre){
        const g = IGRE[gid];
        for (let st = 1; st <= g.stopnje; st++){
          const vzorci = [];
          for (let i = 0; i < naStopnjo; i++){
            let q;
            try { q = g.gen(st, pod); }
            catch (e){ izhod.napakeGen.push(pod.id + '/' + gid + ' st' + st + ': ' + e.message); continue; }
            if (!q){ izhod.napakeGen.push(pod.id + '/' + gid + ' st' + st + ': brez vprašanja'); continue; }
            const v = { tip:q.tip, v:q.v, pod:q.pod, a:q.a, kljuc:q.kljuc, ucim:q.ucim, zn:q.zn };
            if (q.tip === 'izbira'){
              /* zastave nimajo besedila – takrat je risba sama tista, ki jo je treba ločiti */
              v.opts = q.opts.map(o => (o.txt ? String(o.txt) : (o.svg ? 'svg:' + o.svg : '?')));
              v.imaSvg = q.opts.some(o => !!o.svg);
              v.slika = !!q.slika;
            } else if (q.tip === 'zemljevid'){
              v.karta = q.karta; v.cilj = q.cilj; v.zive = q.zive;
              v.jeNaKarti = !!ZEMLJEVIDI[q.karta].d[q.cilj];
              const o = okvirDrzave(q.karta, q.cilj);
              v.okvir = o ? { w:o.w, h:o.h, cx:o.cx, cy:o.cy } : null;
            } else if (q.tip === 'tocke'){
              v.karta = q.karta;
              /* Igra zemljevid Slovenije približa (pokazi(okvir, 1.12)), šele nato nariše pike;
                 polmer pike je max(4, sirinaPogleda/42) – zato ga izracunamo z isto sirino. */
              const z = ZEMLJEVIDI[q.karta];
              let sirinaPogleda = z.w;
              if (q.karta === 'slovenija' && sloOkvir){
                sirinaPogleda = Math.max(z.w * 0.12,
                  Math.min(z.w, Math.max(sloOkvir.w, sloOkvir.h * z.w / z.h) * 1.12));
              }
              v.r = Math.max(4, sirinaPogleda / 42);
              v.tocke = q.tocke.map(t => {
                const m = vZemljevid(z, t.p[0], t.p[1]);
                return { n:t.n, x:m[0], y:m[1] };
              });
            }
            vzorci.push(v);
          }
          izhod.igre.push({ pod:pod.id, gid, nm:g.nm, st, vzorci });
        }
      }
    }
    return izhod;
  }, { naStopnjo: NA_STOPNJO });

  const stVprasanj = podatki.igre.reduce((a, i) => a + i.vzorci.length, 0);

  /* --- 1. sploh se generira --- */
  const t1 = preizkus('generatorji ne mečejo napak');
  t1.trdi(podatki.napakeGen.length === 0, 'napake generatorjev: ' + podatki.napakeGen.slice(0, 5).join(' | '));
  t1.trdi(stVprasanj >= 25 * 5 * NA_STOPNJO * 0.9,
    'premalo generiranih vprašanj: ' + stVprasanj);
  t1.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 3).join(' | '));

  /* --- 2. oblika vprašanja --- */
  const t2 = preizkus('vsako vprašanje je veljavno');
  for (const i of podatki.igre){
    const kje = i.pod + '/' + i.gid + ' st' + i.st + ': ';
    t2.trdi(i.vzorci.length > 0, kje + 'nobenega vprašanja');
    for (const q of i.vzorci){
      t2.trdi(['izbira','zemljevid','tocke'].indexOf(q.tip) >= 0, kje + 'neznana vrsta ' + q.tip);
      t2.trdi(typeof q.v === 'string' && q.v.trim().length >= 5, kje + 'prekratko vprašanje: ' + q.v);
      t2.trdi(typeof q.kljuc === 'string' && q.kljuc.length > 0, kje + 'brez ključa: ' + q.v);
      t2.trdi(typeof q.ucim === 'string' && q.ucim.length > 0, kje + 'brez »ucim« (ponovi napake ne bo delal): ' + q.v);
    }
  }

  /* --- 3. možnosti izbire --- */
  const t3 = preizkus('možnosti so smiselne in različne');
  for (const i of podatki.igre){
    const kje = i.pod + '/' + i.gid + ' st' + i.st + ': ';
    const najmanj = [2, 3, 3, 4, 4][i.st - 1];
    for (const q of i.vzorci.filter(x => x.tip === 'izbira')){
      t3.trdi(q.opts.length >= 2, kje + 'manj kot dve možnosti: ' + q.v);
      /* Vprašanja tipa da/ne imajo po naravi le dve možnosti (tudi kadar pridejo skozi »Ponovi napake«). */
      const stalne = /^eu:/.test(q.kljuc || '');
      if (!stalne) t3.trdi(q.opts.length >= Math.min(najmanj, 3),
        kje + 'na stopnji ' + i.st + ' le ' + q.opts.length + ' možnosti: ' + q.v);
      t3.trdi(new Set(q.opts).size === q.opts.length, kje + 'podvojena možnost pri: ' + q.v + ' → ' + q.opts.join(' / '));
      t3.trdi(Number.isInteger(q.a) && q.a >= 0 && q.a < q.opts.length,
        kje + 'pravilen odgovor je izven seznama: ' + q.v);
      if (!q.imaSvg) t3.trdi(q.opts.every(o => o && o.trim().length > 0), kje + 'prazna možnost pri: ' + q.v);
    }
  }

  /* --- 4. zemljevid: cilj obstaja in je dovolj velik za otroški prst --- */
  const t4 = preizkus('cilji na zemljevidu so dosegljivi');
  for (const i of podatki.igre){
    const kje = i.pod + '/' + i.gid + ' st' + i.st + ': ';
    for (const q of i.vzorci.filter(x => x.tip === 'zemljevid')){
      t4.trdi(q.jeNaKarti, kje + 'cilj ' + q.cilj + ' ga ni na zemljevidu ' + q.karta);
      t4.trdi(q.okvir && q.okvir.w * q.okvir.h >= (q.karta === 'svet' ? 55 : 90),
        kje + 'cilj ' + q.cilj + ' je premajhen za tap (' +
        (q.okvir ? (q.okvir.w * q.okvir.h).toFixed(1) : '?') + ')');
      if (q.zive){
        t4.trdi(q.zive.indexOf(q.cilj) >= 0, kje + 'cilj ' + q.cilj + ' ni med osvetljenimi');
        t4.trdi(new Set(q.zive).size === q.zive.length, kje + 'podvojena osvetljena država');
        /* »Ponovi napake« namenoma vprasa vsaj po tretji stopnji, zato tam stopnja ni merilo */
        if (i.gid !== 'ponovi')
          t4.enako(q.zive.length, [4, 6, 8, 12, 0][i.st - 1], kje + 'število osvetljenih držav');
      } else {
        if (i.gid !== 'ponovi') t4.enako(i.st, 5, kje + 'brez osvetljenih držav sme biti le peta stopnja');
      }
    }
  }

  /* --- 5. pike: znotraj zemljevida, različne, slovenske znotraj Slovenije --- */
  const t5 = preizkus('pike ležijo na zemljevidu');
  const so = podatki.sloOkvir;
  const prekrivanja = []; let skupajParov = 0;
  for (const i of podatki.igre){
    const kje = i.pod + '/' + i.gid + ' st' + i.st + ': ';
    for (const q of i.vzorci.filter(x => x.tip === 'tocke')){
      const o = podatki.obseg[q.karta];
      t5.trdi(q.tocke.length >= 2, kje + 'premalo pik: ' + q.v);
      /* Razmikanje pik ne sme zmanjšati števila možnosti, ki jih otrok dobi na tej stopnji. */
      if (i.gid !== 'ponovi')
        t5.enako(q.tocke.length, [2, 3, 3, 4, 4][i.st - 1],
          kje + 'število pik na stopnji ' + i.st + ' pri: ' + q.v);
      t5.trdi(new Set(q.tocke.map(t => t.n)).size === q.tocke.length, kje + 'podvojena pika pri: ' + q.v);
      t5.trdi(Number.isInteger(q.a) && q.a >= 0 && q.a < q.tocke.length, kje + 'prava pika je izven seznama: ' + q.v);
      for (const t of q.tocke){
        t5.trdi(t.x >= 0 && t.x <= o.w && t.y >= 0 && t.y <= o.h,
          kje + 'pika ' + t.n + ' pade izven zemljevida ' + q.karta + ' (' + t.x.toFixed(1) + ',' + t.y.toFixed(1) + ')');
        if (q.karta === 'slovenija' && so){
          const rob = 2;
          t5.trdi(t.x >= so.x - rob && t.x <= so.x + so.w + rob && t.y >= so.y - rob && t.y <= so.y + so.h + rob,
            kje + 'pika ' + t.n + ' pade izven obrisa Slovenije');
        }
      }
      /* Pike se rišejo po vrsti, poznejša je zgoraj. Če poznejša pika pokrije središče prave,
         tap na pravo mesto zadene napačno piko – tako vprašanje je nerešljivo. */
      const prava = q.tocke[q.a];
      for (let b = q.a + 1; b < q.tocke.length; b++){
        const d = Math.hypot(prava.x - q.tocke[b].x, prava.y - q.tocke[b].y);
        t5.trdi(d >= q.r,
          kje + 'pika ' + q.tocke[b].n + ' pokrije središče prave pike ' + prava.n +
          ' (razdalja ' + d.toFixed(1) + ', polmer ' + q.r.toFixed(1) + ') – vprašanje je nerešljivo');
      }
      /* Milejše: katerikoli par, ki se prekriva, otroka zmede. */
      for (let a = 0; a < q.tocke.length; a++) for (let b = a + 1; b < q.tocke.length; b++){
        const d = Math.hypot(q.tocke[a].x - q.tocke[b].x, q.tocke[a].y - q.tocke[b].y);
        if (d < q.r) prekrivanja.push(i.gid + ' st' + i.st + ': ' + q.tocke[a].n + ' + ' + q.tocke[b].n +
          ' (' + d.toFixed(1) + ' < ' + q.r.toFixed(1) + ')');
        skupajParov++;
      }
    }
  }

  /* --- 6. pokritost: vsaka od 25 iger je res prišla na vrsto --- */
  const t6 = preizkus('vseh 25 iger je preizkušenih');
  const preizkusene = new Set(podatki.igre.map(i => i.gid));
  const vse = await stran.evaluate(() => Object.keys(IGRE));
  for (const gid of vse) t6.trdi(preizkusene.has(gid), 'igra ' + gid + ' ni bila preizkušena');
  t6.enako(vse.length, 25, 'število iger v zbirki');

  await brskalnik.close();
  console.log('Preizkušenih vprašanj: ' + stVprasanj);
  if (prekrivanja.length){
    const skupine = {};
    for (const x of prekrivanja){ const k = x.split(': ')[1]; skupine[k] = (skupine[k] || 0) + 1; }
    const vrste = Object.keys(skupine).sort((a, b) => skupine[b] - skupine[a]);
    console.log('\nPrekrivajoči se pari pik: ' + prekrivanja.length + ' od ' + skupajParov +
      ' (' + (prekrivanja.length / skupajParov * 100).toFixed(1) + ' %), ' + vrste.length + ' različnih parov:');
    for (const v of vrste.slice(0, 20)) console.log('   ' + skupine[v] + '× ' + v);
  }
  process.exit(izpisi('Globko – logika', [t1, t2, t3, t4, t5, t6]) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
