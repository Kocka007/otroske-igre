# Preizkusi

Igre same nimajo knjižnic in ne potrebujejo gradnje – preizkusi pa uporabljajo
[Playwright](https://playwright.dev), zato živijo v svoji mapi in v repozitoriju
niso del nobene igre.

## Namestitev

```bash
cd preizkusi
npm install
npx playwright install webkit chromium
```

V WebKitu (pogon Safarija na iPadu) so na Linuxu potrebne še sistemske knjižnice:

```bash
sudo npx playwright install-deps webkit
```

## Zagon

```bash
./pozeni.sh                  # vsi preizkusi, privzeto v WebKitu
PW_POGON=chromium ./pozeni.sh
node test-logika.js          # posamezen preizkus
```

Preizkusi odprejo igre naravnost z diska (`file://`), tako kot otrok doma –
strežnika ni treba zaganjati.

## Kaj preverja katera datoteka

| Datoteka | Kaj preverja |
|---|---|
| `test-posodobitev.js` | ali nameščena aplikacija ob zagonu res dobi novo različico. Zažene krajevni strežnik z istimi glavami kot GitHub Pages (`max-age=600` + `ETag`), namesti service worker, »objavi« novo različico in preveri, da jo prvi naslednji zagon res naloži – tudi v okvirju z igro – da se star predpomnilnik počisti in da brez omrežja postreže **novo**, ne stare kopije |
| `test-zbirka.js` | pravila, ki veljajo za vse igre: vsaka je vpisana v `index.html`, `sw.js` in `README.md`, ima svoj `*.md` s poglavjem »Kako je preizkušeno«, se odpre z diska brez zahtevkov na omrežje, je v slovenščini; `sw.js` ne navaja neobstoječih datotek; pisava z Google Fonts ima rezervni sklad in je v `ASSETS` |
| `test-logika.js` | Globko: vseh 25 iger na vseh petih stopnjah – veljavnost vprašanj, dovolj različnih možnosti, cilji na zemljevidu dovolj veliki za otroški prst, pike znotraj zemljevida in brez prekrivanja |
| `test-igranje.js` | Globko: bot odigra cel krog vsake igre v vsakem področju (28 krogov), pravilno in narobe |
| `test-tap.js` | Globko: pravi tapi in vlečenje – tap zadene državo in piko, vlečenje ne šteje kot odgovor, gumbi za približevanje |
| `test-kviz.js` | Vseved: zbirka vseh vprašanj (podvojitve, možnosti, zahtevnost, pokritost stopenj) in vseh šest načinov od začetka do zaključnega zaslona |
| `test-kviz2.js` | Vseved: pravila lestvice in pomoči, štoparica hitrega ognja, ponovljivost izziva dneva, prehod med načini |
| `test-matko.js` | Matko: vsi načini na domačem zaslonu se odprejo, postavijo nalogo in sprejmejo odgovor; krog se odigra do zaključnega zaslona. Bot dela isto kot otrok – tapka po gumbih in bere zaslon |
| `test-matko-racuni.js` | Matko: **pravilnost računov**. Iz `matematika.html` izlušči čisti del kode z generatorji (mimo ovoja IIFE, igre ne spreminja), nato vsak izpisan račun razčleni in preveri z lastno, neodvisno formulo v Node.js. Podpisa, ki ga ne zna preveriti, ne preskoči – javi ga kot napako |
| `test-olly.js` | Olly: vse igre v vseh področjih in na vseh stopnjah – veljavnost vprašanj, možnosti, sestavljanke besed in stavkov; bot odigra krog vsake igre; brez govora se slušne igre ne ponudijo |
| `test-barvica.js` | Barvica: vse slike na vseh stopnjah – gradnja, polja na platnu, rast števila polj s stopnjo; barvanje in razveljavitev; predlagane barve za način po številkah |
| `test-kito.js` | Kito: vsi nivoji – sestava, prosto izhodišče, izhod ali duhovi, ponovljivost ob istem semenu; bot odigra 900 korakov fizike v vsakem nivoju |

Nastavitve prek okolja: `PW_POGON` (`webkit` ali `chromium`),
`NA_STOPNJO` (koliko vprašanj na igro in stopnjo v `test-logika.js`, `test-olly.js` in
`test-matko-racuni.js` – privzeto 120, za temeljit pregled 800),
`PRAVILNO` (delež pravilnih odgovorov bota v `test-igranje.js`, privzeto 1),
`NA_NACIN` (koliko nalog na način v `test-matko.js`, privzeto 2),
`KORAKOV` (koliko korakov fizike na nivo v `test-kito.js`, privzeto 900).
