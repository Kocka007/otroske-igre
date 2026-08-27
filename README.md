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

1. Naslov odpri v **Safariju** (iPad, iPhone) ali v **Chromu** (Android).
2. Na začetni strani izberi igro.
3. Tapni gumb za **deljenje** (kvadratek s puščico navzgor) → **Dodaj na začetni zaslon**.

Vsaka igra dobi svojo ikono. Nameščena igra:

- se odpre **čez cel zaslon**, brez naslovne vrstice, ki bi jo otrok pomotoma spremenil,
- **deluje tudi brez interneta** (datoteke so shranjene na napravi),
- se ob naslednjem odprtju s povezavo **sama posodobi**, če je bila igra popravljena,
- napredek hrani na napravi, zato zvezdice ostanejo tudi po zaprtju.

## Kaj je v mapi

```
index.html            začetna stran z izbiro igre
matematika.html       🦊 Matko – cela igra v eni datoteki
anglescina.html       🦉 Olly  – cela igra v eni datoteki
matko.webmanifest     podatki za namestitev Matka (ime, ikone, cel zaslon)
olly.webmanifest      podatki za namestitev Ollyja
sw.js                 skrbi za delovanje brez interneta
matko-icon-*.png      ikone za začetni zaslon (🦊)
olly-icon-*.png       ikone za začetni zaslon (🦉)
```

Vsaka igra je samostojna: če vzameš samo `anglescina.html` in jo odpreš z diska,
deluje v celoti tudi brez ostalih datotek.

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
