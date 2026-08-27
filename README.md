# 🎒 Otroške igre za učenje

Dve interaktivni igri za učenje, obe v slovenščini, brez oglasov, brez računa in
brez pošiljanja podatkov na internet:

| | Igra | Kaj vadi | Starost | Datoteka |
|---|---|---|---|---|
| 🦊 | **Matko** | matematika in branje – od štetja do enačb, geometrije in Kenguručka | 5–15 let | [`matematika.html`](matematika.html) |
| 🦉 | **Olly** | angleščina – od prvih besed do trpnika in pogojnikov | 5–15 let | [`anglescina.html`](anglescina.html) |

Podroben opis: [matematika.md](matematika.md) · [anglescina.md](anglescina.md)

## Kako zaženeš

**Najpreprosteje:** dvoklikni `matematika.html` ali `anglescina.html` – odpre se v brskalniku.
Ni namestitve, ni interneta, ni računa.

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
matematika.html       🦊 Matko – cela igra v eni datoteki
anglescina.html       🦉 Olly  – cela igra v eni datoteki
igre.webmanifest      podatki za namestitev (ime, ikona, cel zaslon)
sw.js                 skrbi za delovanje brez interneta
igre-icon-*.png       ikona nameščene aplikacije (🎒)
matko-icon-*.png      slika na kartici za Matka (🦊)
olly-icon-*.png       slika na kartici za Ollyja (🦉)
```

Vsaka igra je samostojna: če vzameš samo `anglescina.html` in jo odpreš z diska,
deluje v celoti tudi brez ostalih datotek.

### Kako dodati novo igro

1. Datoteko igre (npr. `pobarvanka.html`) dodaj v mapo.
2. V `index.html` jo vpiši v seznam `IGRE` (datoteka, ime, emodži, slika, barva, opis).
3. Dodaj jo v seznam `ASSETS` v `sw.js` in povečaj `CACHE` (npr. `-v4`), da se
   nameščenim uporabnikom osveži predpomnilnik.

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
