# 🎒 Otroške igre za učenje

Šest interaktivnih iger za otroke, vse v slovenščini, brez oglasov, brez računa in
brez pošiljanja podatkov na internet:

| | Igra | Kaj vadi | Starost | Datoteka |
|---|---|---|---|---|
| 🦊 | **Matko** | matematika in branje – 59 iger: od štetja do enačb, verjetnosti, koordinatnega sistema, grafov in Kenguručka | 5–15 let | [`matematika.html`](matematika.html) |
| 🦉 | **Olly** | angleščina – 540 besed, 21 iger, pet stopenj od A0 do B2, govor, branje in pogovori | 5–15 let | [`anglescina.html`](anglescina.html) |
| 🌍 | **Globko** | geografija – 130 držav na pravem zemljevidu, karte Slovenije, Evrope, sveta in štirih celin, reke, merilo in legenda; 32 iger | 6–15 let | [`geografija.html`](geografija.html) |
| 🧠 | **Vseved** | kviz s 555 vprašanji z razlago iz štirinajstih področij: lestvica, hitri ogenj, dvoboj za dva, izziv dneva | 7 let in več | [`kviz.html`](kviz.html) |
| 🎨 | **Barvica** | pobarvanka: 219 slik v 21 temah (letni časi, črke in številke, Slovenija, mandale za odrasle), 7 načinov barvanja, risanje z Apple Pencil | za vse | [`pobarvanka.html`](pobarvanka.html) |
| 🦁 | **Kito** | ploščadna igra: 10 nivojev savane s šefi, skritimi sobami in medaljami, 4 dodatne sobe, izvirna zgodba z epilogom; za enega ali dva igralca (Kito in gepardka Tuli) | 7 let in več | [`kito.html`](kito.html) |

Podroben opis: [matematika.md](matematika.md) · [anglescina.md](anglescina.md) · [geografija.md](geografija.md) · [kviz.md](kviz.md) · [pobarvanka.md](pobarvanka.md) · [kito.md](kito.md)

## Kako zaženeš

**Najpreprosteje:** dvoklikni `matematika.html`, `anglescina.html`, `geografija.html`,
`kviz.html`, `pobarvanka.html` ali `kito.html` – odpre se v brskalniku. Ni namestitve, ni interneta, ni računa.

**Na iPadu ali telefonu** se igre dajo namestiti kot ena aplikacija – glej spodaj.

## Objava na spletu (GitHub Pages)

Da so igre dosegljive na spletnem naslovu in namestljive na iPad:

1. *Settings → Pages → Source: **Deploy from a branch***
2. Branch: `main`, mapa `/ (root)` → *Save*
3. Čez minuto ali dve so igre na `https://<uporabnisko-ime>.github.io/otroske-igre/`

GitHub Pages na brezplačnem računu deluje samo za **javne** repozitorije.

## Namestitev na začetni zaslon 📱

Namestitev je **ena sama** – vse igre pridejo skupaj, pod eno ikono 🎒.

1. Naslov odpri v **Safariju** (iPad, iPhone) ali v **Chromu** (Android).
2. Tapni gumb za **deljenje** (kvadratek s puščico navzgor) → **Dodaj na začetni zaslon**.

Nameščena aplikacija:

- se odpre **čez cel zaslon**, brez naslovne vrstice, ki bi jo otrok pomotoma spremenil,
- na začetnem zaslonu ponudi izbiro med igrami, pokaže zvezdice vsake igre in gumb »Nadaljuj, kjer si ostal«; z gumbom **⬅️ Domov** se vrne na izbiro,
- **deluje tudi brez interneta** (vse igre so shranjene na napravi),
- se ob naslednjem odprtju s povezavo **sama posodobi**, če je bila igra popravljena
  (service worker jemlje strani mimo brskalnikovega predpomnilnika, sicer bi otrok
  lahko dobil do deset minut staro kopijo),
- napredek hrani na napravi, ločeno za vsako igro.

Vsaka igra teče v svojem okviru (`iframe`), zato se njihovi slogi in koda ne mešajo –
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
Igre ne pošiljajo ničesar na internet in ne zbirajo nobenih podatkov.
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

Kito je ploščadna igra s stalnim korakom 1/60 s; svet meri 320×180 enot, riše
pa se na trikrat gostejše platno, med koraki fizike z vmesnimi sličicami – zato
je gib enako gladek na zaslonu s 60 in s 120 sličicami. Živali imajo dvočlenske
noge s koleni, telo se ob doskoku splošči in ob odrivu raztegne, prizor pa ima
šest slojev globine. Risbe in glasba nastanejo iz kode (Canvas 2D in Web Audio),
brez zunanjih datotek. Zgodba, imena, liki in nivoji so izvirni – navdih so afriške
živali in ploščadne igre iz devetdesetih, ne pa katera koli obstoječa igra ali
risanka.
