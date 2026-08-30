/* Matko – preizkus skozi vmesnik. Igra je zavita v IIFE, zato do generatorjev
   ni dostopa; bot zato dela isto kot otrok: tapka po gumbih in bere zaslon. */
const { odpri, preizkus, izpisi } = require('./skupno');

const NA_NACIN = Number(process.env.NA_NACIN || 2);   /* vprašanj na način */

/* Prebere, kaj je na zaslonu z nalogo. */
const zaslon = stran => stran.evaluate(() => {
  const c = document.querySelectorAll('#inputArea [data-c]');
  const k = document.querySelectorAll('#inputArea [data-k]');
  return {
    naslov: (document.getElementById('modeTitle') || {}).textContent || '',
    task: (document.getElementById('qtask') || {}).textContent || '',
    qbig: (document.getElementById('qbig') || {}).textContent || '',
    izbire: Array.from(c).map(b => b.dataset.c),
    pad: Array.from(k).map(b => b.dataset.k),
    pike: document.querySelectorAll('#dots .dot').length,
    ok: document.querySelectorAll('#dots .dot.ok').length,
    no: document.querySelectorAll('#dots .dot.no').length,
    /* Matko skriva zaslone z razredom hide, ne z atributom hidden */
    igra: !document.getElementById('scr-game').classList.contains('hide'),
    konec: !document.getElementById('scr-done').classList.contains('hide')
  };
});

/* Odgovori – tapne prvo možnost ali natipka števko. Kaj je prav, ne vemo. */
async function odgovori(stran, z){
  if (z.izbire.length){
    await stran.evaluate(c => document.querySelector('#inputArea [data-c="' +
      c.replace(/"/g, '\\"') + '"]').click(), z.izbire[0]);
  } else {
    await stran.evaluate(() => {
      const t = document.querySelector('#inputArea [data-k="1"]');
      if (t) t.click();
      const ok = document.querySelector('#inputArea [data-k="ok"]');
      if (ok) ok.click();
    });
  }
  /* Igra sama skoči na naslednjo nalogo po 950 ms (prav) ali 2200 ms (narobe). */
  const odziv = await stran.evaluate(() => {
    const f = document.getElementById('flashBox');
    return f ? f.textContent : '';
  });
  return odziv;
}

/* Domov -> izbrani starostni sklop -> izbrani način. Vsak korak na novo izriše
   domači zaslon, zato gumb poiščemo tik pred klikom. */
async function odpriNacin(stran, band, id){
  await stran.evaluate(() => {
    if (document.getElementById('scr-home').classList.contains('hide')){
      const h = document.getElementById('homeBtn');
      if (h) h.click();
    }
  });
  await stran.waitForSelector('#scr-home:not(.hide)', { timeout: 5000 });
  await stran.evaluate(b => document.querySelector('#bands .band[data-band="' + b + '"]').click(), band);
  const najden = await stran.evaluate(m => {
    const el = document.querySelector('#modes .mode[data-mode="' + m + '"]');
    if (!el) return false;
    el.click(); return true;
  }, id);
  if (!najden) throw new Error('načina ' + id + ' ni v izbranem sklopu');
  await stran.waitForSelector('#scr-game:not(.hide)', { timeout: 5000 });
}

(async () => {
  const { brskalnik, stran, napake, pogon } = await odpri('matematika.html');
  console.log('Pogon: ' + pogon);
  const preizkusi = [];

  /* Klik na starostni sklop na novo izriše domači zaslon, zato je treba gumbe vsakič
     poiskati znova – shranjeni seznam vozlišč po izrisu ne velja več. */
  const sklopi = await stran.evaluate(() =>
    Array.from(document.querySelectorAll('#bands .band')).map(b => b.dataset.band));
  const nacini = [];
  for (const b of sklopi){
    const del = await stran.evaluate(x => {
      document.querySelector('#bands .band[data-band="' + x + '"]').click();
      return Array.from(document.querySelectorAll('#modes .mode')).map(m => ({
        band: x, id: m.dataset.mode, nm: (m.textContent || '').trim().slice(0, 40)
      }));
    }, b);
    nacini.push.apply(nacini, del);
  }

  const t0 = preizkus('domači zaslon ponudi vse načine');
  t0.trdi(nacini.length >= 40, 'na domačem zaslonu je le ' + nacini.length + ' načinov');
  t0.trdi(new Set(nacini.map(n => n.id)).size === nacini.length, 'podvojen način na domačem zaslonu');
  t0.trdi(nacini.every(n => n.nm.length > 0), 'način brez imena');
  preizkusi.push(t0);

  /* --- vsak način se odpre in sprejme odgovore --- */
  const t1 = preizkus('vsak način postavi nalogo in sprejme odgovor');
  const t2 = preizkus('naloge z možnostmi so smiselne');
  let pregledanih = 0, sPadom = 0, zIzbirami = 0;

  for (const n of nacini){
    const kje = n.id + ' »' + n.nm + '« – ';
    try {
      await odpriNacin(stran, n.band, n.id);

      for (let i = 0; i < NA_NACIN; i++){
        const z = await zaslon(stran);
        t1.trdi(z.igra, kje + 'zaslon z nalogo se ni odprl');
        t1.trdi(z.task.trim().length > 0, kje + 'naloga nima naslova');
        t1.trdi(z.qbig.trim().length > 0, kje + 'naloga je prazna');
        t1.enako(z.pike, 10, kje + 'krog nima desetih pik');
        t1.trdi(z.izbire.length > 0 || z.pad.length > 0, kje + 'ni načina za odgovor');

        if (z.izbire.length){
          zIzbirami++;
          t2.trdi(z.izbire.length >= 2, kje + 'manj kot dve možnosti pri: ' + z.task);
          t2.trdi(new Set(z.izbire).size === z.izbire.length,
            kje + 'podvojena možnost: ' + z.izbire.join(' / '));
          t2.trdi(z.izbire.every(c => String(c).trim().length > 0), kje + 'prazna možnost');
        } else {
          sPadom++;
          t1.trdi(z.pad.indexOf('ok') >= 0 && z.pad.indexOf('0') >= 0,
            kje + 'številčnica nima vseh tipk');
        }

        const odziv = await odgovori(stran, z);
        t1.trdi(odziv.trim().length > 0, kje + 'po odgovoru ni odziva');
        /* Kadar je odgovor napačen, igra pove pravilnega – ta mora biti smiseln
           in pri nalogah z možnostmi tudi med ponujenimi. */
        const m = odziv.match(/Pravilno je:\s*(.+)$/);
        if (m){
          const prav = m[1].trim();
          t2.trdi(prav.length > 0, kje + 'napovedani pravilni odgovor je prazen');
          if (z.izbire.length)
            t2.trdi(z.izbire.map(String).indexOf(prav) >= 0,
              kje + 'pravilnega odgovora (' + prav + ') ni med možnostmi: ' + z.izbire.join(' / '));
        }
        pregledanih++;

        const prejPike = z.ok + z.no;
        await stran.waitForFunction(p => {
          const d = document.querySelectorAll('#dots .dot.ok, #dots .dot.no').length;
          return d > p || !document.getElementById('scr-done').classList.contains('hide');
        }, prejPike, { timeout: 6000 });
      }
    } catch (e){
      t1.trdi(false, kje + 'se je sesul: ' + e.message.split('\n')[0]);
    }
  }
  preizkusi.push(t1); preizkusi.push(t2);

  /* --- cel krog do zaključnega zaslona, po en na starostni sklop --- */
  const t3 = preizkus('krog se odigra do zaključnega zaslona');
  for (const b of sklopi){
    const n = nacini.find(x => x.band === b);
    const kje = 'sklop ' + b + ' / ' + n.id + ' – ';
    try {
      await odpriNacin(stran, b, n.id);
      for (let i = 0; i < 10; i++){
        const z = await zaslon(stran);
        if (z.konec) break;
        await odgovori(stran, z);
        await stran.waitForFunction(k => {
          const d = document.querySelectorAll('#dots .dot.ok, #dots .dot.no').length;
          return d > k || !document.getElementById('scr-done').classList.contains('hide');
        }, i, { timeout: 6000 });
      }
      await stran.waitForSelector('#scr-done:not(.hide)', { timeout: 8000 });
      const izid = await stran.evaluate(() => ({
        rezultat: document.getElementById('resScore').textContent,
        pregled: document.querySelectorAll('#resReview div').length,
        spet: !!document.getElementById('againBtn')
      }));
      const m = izid.rezultat.match(/Pravilnih:\s*(\d+)\s*od\s*(\d+)/);
      t3.trdi(!!m, kje + 'zaključni zaslon ne pove rezultata: ' + izid.rezultat);
      if (m) t3.enako(+m[2], 10, kje + 'krog ni imel desetih nalog');
      t3.enako(izid.pregled, 10, kje + 'pregled ne našteje vseh desetih nalog');
      t3.trdi(izid.spet, kje + 'manjka gumb »Še enkrat«');
    } catch (e){
      t3.trdi(false, kje + 'krog se je sesul: ' + e.message.split('\n')[0]);
    }
  }
  preizkusi.push(t3);

  const t4 = preizkus('napredek se shrani in ni napak v konzoli');
  const shranjeno = await stran.evaluate(() => JSON.parse(localStorage.getItem('matko-v1') || 'null'));
  t4.trdi(shranjeno, 'v localStorage ni ničesar');
  if (shranjeno){
    t4.trdi(shranjeno.plays >= sklopi.length, 'odigrani krogi se niso zabeležili');
    t4.trdi(shranjeno.correct + shranjeno.wrong >= pregledanih, 'odgovori se niso šteli');
  }
  t4.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 3).join(' | '));
  preizkusi.push(t4);

  await brskalnik.close();
  console.log('Načinov: ' + nacini.length + ', pregledanih nalog: ' + pregledanih +
    ' (' + zIzbirami + ' z možnostmi, ' + sPadom + ' s številčnico)');
  process.exit(izpisi('Matko – naloge in vmesnik', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
