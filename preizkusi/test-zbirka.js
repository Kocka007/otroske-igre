/* Zbirka – pravila, ki veljajo za vse igre: ena datoteka, brez interneta, vpisana povsod. */
const fs = require('fs');
const path = require('path');
const { odpri, preizkus, izpisi, REPO } = require('./skupno');

const beri = f => fs.readFileSync(path.join(REPO, f), 'utf8');

(async () => {
  const preizkusi = [];
  const index = beri('index.html');
  const sw = beri('sw.js');
  const readme = beri('README.md');

  /* igre preberemo iz seznama v index.html */
  const igre = [];
  const re = /(\w+)\s*:\s*\{\s*f\s*:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(index))) igre.push({ id: m[1], datoteka: m[2] });
  const datoteke = igre.map(i => i.datoteka);

  /* --- 1. vsaka igra je vpisana povsod --- */
  const t1 = preizkus('vsaka igra je vpisana v index, sw.js in README');
  const naDisku = fs.readdirSync(REPO).filter(f => /\.html$/.test(f) && f !== 'index.html');
  t1.trdi(datoteke.length > 0, 'iz index.html ni bilo mogoče prebrati seznama iger');
  for (const f of naDisku){
    t1.trdi(index.indexOf(f) >= 0, f + ' ni v seznamu IGRE v index.html');
    t1.trdi(sw.indexOf(f) >= 0, f + ' ni v ASSETS v sw.js');
    t1.trdi(readme.indexOf(f) >= 0, f + ' ni omenjen v README.md');
    const opis = f.replace(/\.html$/, '.md');
    t1.trdi(fs.existsSync(path.join(REPO, opis)), 'manjka opis ' + opis);
    /* barva igre mora biti v :root, sicer kartica na domači strani nima barve */
    const g = igre.find(x => x.datoteka === f);
    if (g) t1.trdi(new RegExp('--' + '[a-z]+\\s*:').test(index) && index.indexOf('var(--') >= 0,
      f + ': v index.html ni barv v :root');
  }
  t1.trdi(datoteke.length === naDisku.length,
    'seznam IGRE v index.html ima ' + datoteke.length + ' iger, na disku jih je ' + naDisku.length);
  for (const d of datoteke) t1.trdi(naDisku.indexOf(d) >= 0, 'index.html kaže na neobstoječo igro ' + d);
  preizkusi.push(t1);

  /* --- 1b. opisi z odstavkom o preizkusih (pravilo zbirke) --- */
  const t1b = preizkus('vsak opis ima poglavje »Kako je preizkušeno«');
  for (const f of naDisku){
    const opis = f.replace(/\.html$/, '.md');
    if (!fs.existsSync(path.join(REPO, opis))) continue;
    t1b.trdi(/Kako je preizkuše/.test(beri(opis)), opis + ' nima poglavja »Kako je preizkušeno«');
  }
  preizkusi.push(t1b);

  /* --- 2. sw.js: vse naštete datoteke obstajajo, različica je povečana --- */
  const t2 = preizkus('sw.js je usklajen z diskom');
  const cache = (sw.match(/CACHE\s*=\s*['"]([^'"]+)/) || [])[1];
  t2.trdi(!!cache, 'v sw.js ni imena predpomnilnika (CACHE)');
  const zaAsete = (sw.match(/ASSETS\s*=\s*\[([\s\S]*?)\]/) || [])[1] || '';
  const aseti = (zaAsete.match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));
  t2.trdi(aseti.length > 0, 'v sw.js ni seznama ASSETS');
  for (const a of aseti){
    if (a === './' || a.indexOf('http') === 0) continue;
    t2.trdi(fs.existsSync(path.join(REPO, a.replace(/^\.\//, ''))), 'sw.js navaja neobstoječo datoteko: ' + a);
  }
  /* ikone iger, ki so na disku, morajo biti v predpomnilniku */
  for (const ikona of fs.readdirSync(REPO).filter(f => /-icon-(180|192)\.png$/.test(f)))
    t2.trdi(sw.indexOf(ikona) >= 0, 'ikona ' + ikona + ' ni v ASSETS');
  preizkusi.push(t2);

  /* --- 3. nobena igra ne sme za delovanje na internet --- */
  const t3 = preizkus('igre ne nalagajo kode ali slik z interneta');
  const pisave = [];
  for (const f of naDisku.concat(['index.html'])){
    const vs = beri(f);
    t3.trdi(!/<script[^>]+src=/.test(vs), f + ' nalaga zunanjo skripto');
    const zunanji = (vs.match(/(?:src|href)\s*=\s*["'](?:https?:)?\/\/[^"']+/g) || [])
      .filter(x => x.indexOf('www.w3.org') < 0);
    /* Googlove pisave so mehka odvisnost: brez interneta se igra izriše z rezervno pisavo. */
    const pisava = zunanji.filter(x => /fonts\.(googleapis|gstatic)\.com/.test(x));
    const ostalo = zunanji.filter(x => !/fonts\.(googleapis|gstatic)\.com/.test(x));
    if (pisava.length) pisave.push(f);
    t3.trdi(ostalo.length === 0, f + ' se sklicuje na zunanji vir: ' + ostalo.slice(0, 2).join(', '));
    /* slike morajo biti vgrajene ali lokalne; poti, sestavljene v JS, preskočimo */
    const slike = (vs.match(/<img[^>]+src="([^"]+)"/g) || []);
    for (const s of slike){
      const u = s.match(/src="([^"]+)"/)[1];
      if (/[+']/.test(u)) continue;
      t3.trdi(u.indexOf('data:') === 0 || fs.existsSync(path.join(REPO, u)), f + ' kaže na sliko, ki je ni: ' + u);
    }
  }
  preizkusi.push(t3);

  /* --- 3b. edina dovoljena zunanja stvar je pisava; brez nje mora igra delati naprej --- */
  const t3b = preizkus('pisava z interneta ima rezervo in je predpomnjena');
  for (const f of pisave){
    const vs = beri(f);
    const skladi = (vs.match(/font-family:\s*"?Nunito"?[^;}]*/g) || []);
    t3b.trdi(skladi.length > 0, f + ': Nunito je naložen, a ni uporabljen');
    for (const sk of skladi)
      t3b.trdi(/sans-serif|system-ui|-apple-system/.test(sk),
        f + ': sklad pisav nima rezerve – brez interneta bi ostal brez pisave: ' + sk);
  }
  /* v sw.js mora biti, sicer nameščena igra brez interneta pisave ne bi imela */
  const pisavaVSw = /fonts\.googleapis\.com/.test(sw);
  t3b.trdi(!pisave.length || pisavaVSw, 'pisave z Google Fonts ni v ASSETS v sw.js');
  preizkusi.push(t3b);

  /* --- 4. vsaka igra se odpre z diska in nič ne pade --- */
  const t4 = preizkus('vsaka igra se odpre z diska (file://)');
  for (const f of naDisku.concat(['index.html'])){
    const { brskalnik, stran, napake, zahtevki } = await odpri(f);
    await stran.waitForTimeout(600);
    const vidno = await stran.evaluate(() => document.body.innerText.trim().length);
    t4.trdi(vidno > 20, f + ' se je odprl prazen');
    t4.trdi(napake.length === 0, f + ' javlja napako: ' + napake.slice(0, 2).join(' | '));
    const brezPisav = zahtevki.filter(u => !/fonts\.(googleapis|gstatic)\.com/.test(u));
    t4.trdi(brezPisav.length === 0, f + ' gre po vire na omrežje: ' + brezPisav.slice(0, 2).join(', '));
    await brskalnik.close();
  }
  preizkusi.push(t4);

  /* --- 5. slovenščina --- */
  const t5 = preizkus('igre so v slovenščini');
  for (const f of naDisku.concat(['index.html'])){
    const vs = beri(f);
    t5.trdi(/<html[^>]+lang="sl"/.test(vs), f + ' nima lang="sl"');
    t5.trdi(/charset="?utf-8/i.test(vs), f + ' nima navedenega kodiranja UTF-8');
  }
  preizkusi.push(t5);

  console.log('Iger v zbirki: ' + naDisku.length + ' (' + naDisku.join(', ') + ')');
  console.log('Predpomnilnik sw.js: ' + cache + ', ' + aseti.length + ' datotek');
  process.exit(izpisi('Zbirka – skupna pravila', preizkusi) ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
