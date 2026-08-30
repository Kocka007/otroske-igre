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
| `test-zbirka.js` | pravila, ki veljajo za vse igre: vsaka je vpisana v `index.html`, `sw.js` in `README.md`, ima svoj `*.md`, se odpre z diska brez zahtevkov na omrežje, je v slovenščini; `sw.js` ne navaja neobstoječih datotek |
| `test-logika.js` | Globko: vseh 25 iger na vseh petih stopnjah – veljavnost vprašanj, dovolj različnih možnosti, cilji na zemljevidu dovolj veliki za otroški prst, pike znotraj zemljevida in brez prekrivanja |
| `test-igranje.js` | Globko: bot odigra cel krog vsake igre v vsakem področju (28 krogov), pravilno in narobe |
| `test-tap.js` | Globko: pravi tapi in vlečenje – tap zadene državo in piko, vlečenje ne šteje kot odgovor, gumbi za približevanje |
| `test-kviz.js` | Vseved: zbirka 325 vprašanj (podvojitve, možnosti, zahtevnost, pokritost stopenj) in vseh šest načinov od začetka do zaključnega zaslona |
| `test-kviz2.js` | Vseved: pravila lestvice in pomoči, štoparica hitrega ognja, ponovljivost izziva dneva, prehod med načini |

Nastavitve prek okolja: `PW_POGON` (`webkit` ali `chromium`),
`NA_STOPNJO` (koliko vprašanj na igro in stopnjo v `test-logika.js`, privzeto 45),
`PRAVILNO` (delež pravilnih odgovorov bota v `test-igranje.js`, privzeto 1).
