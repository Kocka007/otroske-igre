/* Otroške igre – service worker.
   Poskrbi, da igre delujejo tudi brez interneta, ko so nameščene
   na začetni zaslon. Nova različica pride do otroka ob prvem odprtju s povezavo. */
const CACHE = 'otroske-igre-v16';
const ASSETS = [
  './',
  './index.html',
  './anglescina.html',
  './pobarvanka.html',
  './matematika.html',
  './kito.html',
  './geografija.html',
  './kviz.html',
  './igre.webmanifest',
  './olly-icon-180.png',
  './olly-icon-192.png',
  './olly-icon-512.png',
  './olly-icon-maskable-512.png',
  './matko-icon-180.png',
  './matko-icon-192.png',
  './matko-icon-512.png',
  './matko-icon-maskable-512.png',
  './igre-icon-180.png',
  './igre-icon-192.png',
  './igre-icon-512.png',
  './igre-icon-maskable-512.png',
  './barvica-icon-192.png',
  './kito-icon-192.png',
  './kito-icon-180.png',
  './globko-icon-192.png',
  './globko-icon-180.png',
  './vseved-icon-192.png',
  './vseved-icon-180.png',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap'
];

/* Datoteke jemljemo naravnost z omrežja, mimo brskalnikovega predpomnilnika.
   GitHub Pages jih namreč postreže s `Cache-Control: max-age=600`, zato bi
   navadni add() lahko shranil do deset minut staro kopijo – in ta bi potem
   ostala v igri do naslednje posodobitve. */
const svezZahtevek = u => new Request(u, { cache: 'reload' });

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // vsako datoteko shranimo posebej, da manjkajoča ne prepreči namestitve
    await Promise.all(ASSETS.map(u => c.add(svezZahtevek(u)).catch(() => c.add(u).catch(() => {}))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Same aplikacije (HTML): najprej z omrežja, da otrok vedno dobi zadnjo različico;
  // če interneta ni, jih postrežemo iz predpomnilnika.
  if (req.mode === 'navigate' || req.destination === 'document'){
    e.respondWith((async () => {
      try {
        /* Tudi tu mimo predpomnilnika HTTP, sicer bi otrok ob zagonu lahko
           dobil stran, ki jo je brskalnik shranil pred manj kot desetimi minutami.
           Zahtevka za krmarjenje ni mogoče preoblikovati, zato ga sestavimo znova. */
        const res = await fetch(req.url, { cache: 'reload', credentials: 'same-origin' })
          .catch(() => fetch(req));
        if (res && res.ok){
          const c = await caches.open(CACHE);
          c.put(req, res.clone());
        }
        return res;
      } catch (err) {
        const hit = await caches.match(req, { ignoreSearch: true }) ||
                    await caches.match('./index.html');
        if (hit) return hit;
        throw err;
      }
    })());
    return;
  }

  // Ikone in pisave: najprej iz predpomnilnika, ker se ne spreminjajo.
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')){
      const c = await caches.open(CACHE);
      c.put(req, res.clone());
    }
    return res;
  })());
});
