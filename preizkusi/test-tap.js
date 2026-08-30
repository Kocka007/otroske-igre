/* Globko – preizkus dotika: pravi tapi in vlečenje po zemljevidu. */
const { odpri, preizkus, izpisi } = require('./skupno');

/* sredina lika v zaslonskih koordinatah */
async function sredina(stran, izbirnik){
  const el = await stran.$(izbirnik);
  if (!el) return null;
  const b = await el.boundingBox();
  return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height } : null;
}

/* poišče tako vprašanje »Kje leži?«, da je cilj na zaslonu dovolj velik za tap */
async function pripraviZemljevid(stran, podId, gid, najmanj){
  for (let poskus = 0; poskus < 25; poskus++){
    await stran.evaluate(() => narisiPodrocja());
    await stran.click('[data-pod="' + podId + '"]');
    await stran.click('[data-igra="' + gid + '"]');
    await stran.waitForSelector('#karta .dz');
    const cilj = await stran.evaluate(() => tek.q.cilj);
    const b = await sredina(stran, '#karta .dz[data-id="' + cilj + '"]');
    if (b && b.w >= najmanj && b.h >= najmanj) return { cilj, b };
    await stran.evaluate(() => naslednje());
    const c2 = await stran.evaluate(() => tek.q.cilj);
    const b2 = await sredina(stran, '#karta .dz[data-id="' + c2 + '"]');
    if (b2 && b2.w >= najmanj && b2.h >= najmanj) return { cilj: c2, b: b2 };
  }
  return null;
}

(async () => {
  const { brskalnik, stran, napake, pogon } = await odpri('geografija.html', { dotik: true });
  console.log('Pogon: ' + pogon + ' (z dotikom)');
  const preizkusi = [];

  /* --- 1. tap po državi na zemljevidu Evrope --- */
  const t1 = preizkus('tap zadene pravo državo');
  const z = await pripraviZemljevid(stran, 'evropa', 'evrZemljevid', 14);
  if (!t1.trdi(!!z, 'v 25 poskusih ni bilo cilja, večjega od 14 px – zemljevid je pretesen za prst')){
  } else {
    await stran.touchscreen.tap(z.b.x, z.b.y);
    const po = await stran.evaluate(() => ({ odg: tek.odgovorjeno, znak: tek.znaki[tek.i] }));
    t1.trdi(po.odg, 'tap na državo ' + z.cilj + ' ni sprožil odgovora');
    t1.enako(po.znak, 1, 'tap na pravo državo ' + z.cilj + ' ni bil ocenjen kot pravilen');
  }
  preizkusi.push(t1);

  /* --- 2. vlečenje ne šteje kot odgovor --- */
  const t2 = preizkus('vlečenje zemljevida ni odgovor');
  const z2 = await pripraviZemljevid(stran, 'evropa', 'evrZemljevid', 14);
  if (t2.trdi(!!z2, 'ni primernega cilja za vlečenje')){
    const prejVB = await stran.evaluate(() => document.querySelector('#karta svg').getAttribute('viewBox'));
    await stran.touchscreen.tap(z2.b.x, z2.b.y - 0); /* pripravimo koordinate */
    /* ponovno začnemo, ker je tap zgoraj že odgovoril */
    await stran.evaluate(() => { tek.odgovorjeno = false; naslednje(); });
    await stran.waitForSelector('#karta .dz');
    const cilj = await stran.evaluate(() => tek.q.cilj);
    const b = await sredina(stran, '#karta .dz[data-id="' + cilj + '"]');
    const karta = await sredina(stran, '#karta .zem');
    if (t2.trdi(!!b && !!karta, 'zemljevid ni izrisan')){
      const vb0 = await stran.evaluate(() => document.querySelector('#karta svg').getAttribute('viewBox'));
      /* vlečenje čez pravo državo – ne sme veljati kot odgovor */
      await stran.touchscreen.tap(karta.x, karta.y).catch(() => {});
      await stran.evaluate(() => { if (tek.odgovorjeno) naslednje(); });
      const c3 = await stran.evaluate(() => tek.q.cilj);
      const b3 = await sredina(stran, '#karta .dz[data-id="' + c3 + '"]');
      if (b3){
        /* Igra vlečenje bere iz pointer dogodkov (pointerdown/move/up), ki jih miška sproži
           enako kot prst – zato je to ista koda kot pri pravem prstu na iPadu. */
        await stran.mouse.move(b3.x, b3.y);
        await stran.mouse.down();
        for (let i = 1; i <= 8; i++) await stran.mouse.move(b3.x + 90 * i / 8, b3.y + 60 * i / 8);
        await stran.mouse.up();
        const po2 = await stran.evaluate(() => ({
          odg: tek.odgovorjeno,
          vb: document.querySelector('#karta svg').getAttribute('viewBox')
        }));
        t2.trdi(!po2.odg, 'vlečenje čez državo je bilo prešteto kot odgovor');
        t2.trdi(po2.vb !== vb0, 'vlečenje ni premaknilo zemljevida (viewBox se ni spremenil)');
      }
    }
  }
  preizkusi.push(t2);

  /* --- 3. tap na piko na zemljevidu Slovenije --- */
  const t3 = preizkus('tap na piko deluje');
  await stran.evaluate(() => narisiPodrocja());
  await stran.click('[data-pod="slo"]');
  await stran.click('[data-igra="sloMesta"]');
  await stran.waitForSelector('#karta .tocka');
  const a = await stran.evaluate(() => tek.q.a);
  const bp = await sredina(stran, '#karta .tocka[data-i="' + a + '"] circle');
  if (t3.trdi(!!bp, 'prave pike ni na zaslonu')){
    t3.trdi(bp.w >= 20, 'pika je premajhna za otroški prst: ' + bp.w.toFixed(1) + ' px');
    await stran.touchscreen.tap(bp.x, bp.y);
    const po = await stran.evaluate(() => ({ odg: tek.odgovorjeno, znak: tek.znaki[tek.i] }));
    t3.trdi(po.odg, 'tap na piko ni sprožil odgovora');
    t3.enako(po.znak, 1, 'tap na pravo piko ni bil ocenjen kot pravilen');
  }
  preizkusi.push(t3);

  /* --- 4. gumbi za približevanje --- */
  const t4 = preizkus('približevanje deluje');
  await stran.evaluate(() => narisiPodrocja());
  await stran.click('[data-pod="svet"]');
  await stran.click('[data-igra="svetZemljevid"]');
  await stran.waitForSelector('#karta .zem');
  const vbA = await stran.evaluate(() => document.querySelector('#karta svg').getAttribute('viewBox'));
  await stran.click('#karta [data-zoom="1"]');
  const vbB = await stran.evaluate(() => document.querySelector('#karta svg').getAttribute('viewBox'));
  t4.trdi(vbA !== vbB, 'gumb + ni približal zemljevida');
  t4.trdi(!(await stran.evaluate(() => tek.odgovorjeno)), 'gumb + je bil prešteti kot odgovor');
  await stran.click('#karta [data-zoom="0"]');
  const vbC = await stran.evaluate(() => document.querySelector('#karta svg').getAttribute('viewBox'));
  t4.enako(vbC, vbA, 'gumb ⤢ ni vrnil celega zemljevida');
  preizkusi.push(t4);

  const tN = preizkus('brez napak v konzoli');
  tN.trdi(napake.length === 0, 'napake strani: ' + napake.slice(0, 5).join(' | '));
  preizkusi.push(tN);

  await brskalnik.close();
  process.exit(izpisi('Globko – dotik (' + pogon + ')', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
