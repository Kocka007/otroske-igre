# 🎒 Otroške igre za učenje

Šest interaktivnih iger za otroke, vse v slovenščini, brez oglasov, brez računa in
brez pošiljanja podatkov na internet:

| | Igra | Kaj vadi | Starost | Datoteka |
|---|---|---|---|---|
| 🦊 | **Matko** | matematika in branje – od štetja do enačb, geometrije in Kenguručka | 5–15 let | [`matematika.html`](matematika.html) |
| 🦉 | **Olly** | angleščina – od prvih besed do trpnika in pogojnikov | 5–15 let | [`anglescina.html`](anglescina.html) |
| 🌍 | **Globko** | geografija – Slovenija, Evropa in svet na pravem zemljevidu, zastave, glavna mesta, gore in reke | 6–15 let | [`geografija.html`](geografija.html) |
| 🧠 | **Vseved** | kviz s 336 vprašanji iz dvanajstih področij: lestvica, hitri ogenj, dvoboj za dva, izziv dneva | 7 let in več | [`kviz.html`](kviz.html) |
| 🎨 | **Barvica** | pobarvanka: 146 slik v 17 temah (22 za odrasle), 9 orodij, risanje z Apple Pencil | za vse | [`pobarvanka.html`](pobarvanka.html) |
| 🦁 | **Kito** | ploščadna igra: 10 nivojev savane in 4 dodatne sobe, izvirna zgodba, dva načina težavnosti | 7 let in več | [`kito.html`](kito.html) |

Podroben opis: [matematika.md](matematika.md) · [anglescina.md](anglescina.md) · [geografija.md](geografija.md) · [kviz.md](kviz.md) · [pobarvanka.md](pobarvanka.md) · [kito.md](kito.md)

## Kako zaženeš

**Najpreprosteje:** dvoklikni `matematika.html`, `anglescina.html`, `geografija.html`,
`kviz.html`, `pobarvanka.html` ali `kito.html` – odpre se v brskalniku. Ni namestitve, ni interneta, ni računa.

**Na iPadu ali telefonu** se igri dasta namestiti kot pravi aplikaciji – glej spodaj.

## Objava na spletu (GitHub Pages)

Da so igre dosegljive na spletnem naslovu in namestljive na iPad:

1. *Settings → Pages → Source: **Deploy from a branch***
2. Branch: `main`, mapa `/ (root)` → *Save*
3. Čez minuto ali dve so igre na `https://<uporabnisko-ime>.github.io/otroske-igre/`

GitHub Pages na brezplačnem računu deluje samo za **javne** repozitorije.

## Namestitev na začetni zaslon 📱

Namestitev je **ena sama** – obe igri prideta skupaj, pod eno ikono 🎒.

1. Naslov odpri v **Safariju** (iPad, iPhone) ali v **Chromu** (Android).
2. Tapni gumb za **deljenje** (kvadratek s puščico navzgor) → **Dodaj na začetni zaslon**.

Nameščena aplikacija:

- se odpre **čez cel zaslon**, brez naslovne vrstice, ki bi jo otrok pomotoma spremenil,
- na začetnem zaslonu ponudi izbiro med igrama; z gumbom **⬅️ Domov** se vrne na izbiro,
- **deluje tudi brez interneta** (obe igri sta shranjeni na napravi),
- se ob naslednjem odprtju s povezavo **sama posodobi**, če je bila igra popravljena,
- napredek hrani na napravi, ločeno za vsako igro.

Vsaka igra teče v svojem okviru (`iframe`), zato se njuni slogi in koda ne mešajo –
tako se novo igro doda brez tveganja, da bi pokvarila obstoječi.

## Kaj je v mapi

```
index.html            aplikacija: izbira igre + okvir, v katerem teče izbrana igra
matematika.html       🦊 Matko   – cela igra v eni datoteki
anglescina.html       🦉 Olly    – cela igra v eni datoteki
geografija.html       🌍 Globko  – cela igra v eni datoteki
kviz.html             🧠 Vseved  – cela igra v eni datoteki
pobarvanka.html       🎨 Barvica – cela igra v eni datoteki
kito.html             🦁 Kito    – cela igra v eni datoteki
igre.webmanifest      podatki za namestitev (ime, ikona, cel zaslon)
sw.js                 skrbi za delovanje brez interneta
igre-icon-*.png       ikona nameščene aplikacije (🎒)
matko-icon-*.png      slika na kartici za Matka (🦊)
olly-icon-*.png       slika na kartici za Ollyja (🦉)
globko-icon-*.png     slika na kartici za Globka (🌍)
vseved-icon-*.png     slika na kartici za Vseveda (🧠)
barvica-icon-192.png  slika na kartici za Barvico (🎨)
kito-icon-*.png       slika na kartici za Kita (🦁)
preizkusi/            samodejni preizkusi (Playwright); igre same jih ne potrebujejo
```

Vsaka igra je samostojna: če vzameš samo `anglescina.html` in jo odpreš z diska,
deluje v celoti tudi brez ostalih datotek.

### Kako dodati novo igro

1. Datoteko igre (npr. `pobarvanka.html`) dodaj v mapo.
2. V `index.html` jo vpiši v seznam `IGRE` (datoteka, ime, emodži, slika, barva, opis).
3. Dodaj jo v seznam `ASSETS` v `sw.js` in povečaj `CACHE` (npr. `-v4`), da se
   nameščenim uporabnikom osveži predpomnilnik.
4. Dopiši vrstico v tabelo zgoraj in ustvari `<ime>.md` z opisom in poglavjem
   »Kako je preizkušeno«.
5. Poženi preizkuse: `cd preizkusi && ./pozeni.sh` – `test-zbirka.js` preveri,
   da je igra res vpisana povsod in da se odpre z diska brez interneta.

## Preizkusi

Igre same nimajo knjižnic in ne potrebujejo gradnje; preizkusi so ločeni in
uporabljajo Playwright:

```bash
cd preizkusi
npm install && npx playwright install webkit chromium
./pozeni.sh                    # privzeto v WebKitu (pogon Safarija na iPadu)
PW_POGON=chromium ./pozeni.sh
```

Kaj preverja katera datoteka, piše v [preizkusi/README.md](preizkusi/README.md).

## Zasebnost

Napredek se shranjuje **samo v brskalniku** (`localStorage`), na napravi.
Igri ne pošiljata ničesar na internet in ne zbirata nobenih podatkov.
Edina zunanja stvar je pisava Nunito z Google Fonts; če je ni, se uporabi
sistemska pisava in vse deluje naprej.

## Tehnično

Čist HTML, CSS in JavaScript – brez knjižnic in brez gradnje. Zvoki so ustvarjeni
z Web Audio API, izgovorjava angleščine z Web Speech API. Naloge sestavljajo
generatorji, zato se ne ponavljajo; pravilnost je preverjena s samodejnimi testi
(podrobnosti v opisu vsake igre).

Globkovi zemljevidi so obrisi Natural Earth (javna last), poenostavljeni in
vgrajeni kot poti SVG, zastave pa so sestavljene iz osnovnih likov – zato tudi
zemljevid deluje brez interneta in ostane oster pri vsakem povečanju.

Vseved ima vprašanja shranjena kot zbirko z razlago in tremi napačnimi odgovori;
načini igre (lestvica, hitri ogenj, dvoboj, izziv dneva) so isti pogon z drugačnimi
pravili. Izziv dneva je pri vseh igralcih enak, ker vprašanja izbere ponovljivo
naključje s semenom iz datuma.

Kito je ploščadna igra s stalnim korakom 1/60 s in notranjo ločljivostjo
320×180 pik; risbe in glasba nastanejo iz kode (Canvas 2D in Web Audio), brez
zunanjih datotek. Zgodba, imena, liki in nivoji so izvirni – navdih so afriške
živali in ploščadne igre iz devetdesetih, ne pa katera koli obstoječa igra ali
risanka.
