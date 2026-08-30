# Globko 🌍 – geografija za otroke

Ena sama datoteka `geografija.html` (brez knjižnic, brez namestitve, deluje brez interneta).
Otrok se uči na **pravem zemljevidu**: države tapka, jih približuje in premika s prstom.

## Kaj se otrok nauči

| Področje | Kaj vsebuje |
|---|---|
| 🇸🇮 **Slovenija** | 25 mest, 21 gora z višinami, 14 rek z dolžinami, jezera, jame in znamenitosti, pokrajine, sosede, 30 vprašanj o državi |
| 🏰 **Evropa** | vse evropske države na zemljevidu, zastave, glavna mesta, sosede, gorstva, reke in morja, Evropska unija |
| 🌍 **Svet** | države in celine na svetovnem zemljevidu, zastave sveta, glavna mesta, znamenitosti, rekordi |
| 🌋 **Zemlja in narava** | zakaj imamo dan in noč, letne čase, podnebni pasovi, vulkani in potresi, branje zemljevida, pojmi (delta, ledenik, savana, atol …) |

## Igre (25)

| Igra | Kaj dela otrok |
|---|---|
| Kje leži? | tapne državo na zemljevidu Evrope ali sveta |
| Kje je mesto? / Gore in reke | tapne pravo piko na zemljevidu Slovenije |
| Znamenitosti | tapne Everest, Saharo, Amazonko … na svetovnem zemljevidu |
| Čigava zastava? / Najdi zastavo | zastava → država in obratno (88 zastav) |
| Glavna mesta / Čigavo mesto? | država → glavno mesto in obratno |
| Sosede | katera država meji na … |
| Katera celina? | na kateri celini leži država |
| Evropska unija | je država članica ali ne |
| Pokrajine | v kateri pokrajini leži slovenski kraj |
| Najvišja gora / Najdaljša reka | primerjanje višin in dolžin |
| Vse o Sloveniji, Rekordi sveta, Zemlja in pojmi, Celine, Oceani | vprašanja z razlago po vsakem odgovoru |
| Ponovi napake | vrne prav tisto, kar je otroku delalo težave |

## Kako se prilagaja otroku

Vsaka igra ima **pet stopenj**. Trije pravilni odgovori zapored jo dvignejo, dva zaporedna
spodrsljaja spustita. Stopnja določa:

* koliko možnosti je na voljo (2 → 4),
* kako zahtevne kraje in države vprašamo (Italija in Avstrija sta na prvi stopnji, Moldavija in Kosovo na peti),
* pri zemljevidu, koliko držav je osvetljenih (4 → 6 → 8 → 12 → cel zemljevid brez pomoči).

V kotičku za starše (⚙️) je mogoče prilagajanje izklopiti in trdno izbrati lahko, srednje ali težko.
Tam se tudi ugasne zvok in ponastavi napredek. Vse ostane na napravi, nič se ne pošilja na internet.

## Zemljevidi

Obrisi držav so **Natural Earth** (javna last, prek `world-atlas`), poenostavljeni z
Douglas–Peuckerjevim postopkom in vgrajeni kot poti SVG – zato zemljevid deluje tudi brez interneta.

* **Svet** – Robinsonova projekcija, 175 držav
* **Evropa** – Lambertova stožčasta projekcija, 60 držav, obrezano v projicirani ravnini (rob je zato raven)
* **Slovenija** – ista projekcija, približana, s sosedami kot ozadjem

Kraji so shranjeni v stopinjah zemljepisne širine in dolžine; igra jih z isto projekcijo sama
preračuna v koordinate zemljevida, zato je dodajanje nove gore ali mesta ena sama vrstica.

**Zastave niso slike.** Vsaka je sestavljena iz osnovnih likov (proge, križi, zvezde, polmeseci,
šahovnica, orel …) in se nariše sproti. Vse so v razmerju 3 : 2, tudi tiste, ki so v resnici
kvadratne, grbi pa so poenostavljeni – prepoznavni, ne heraldično natančni.

## Upravljanje

| Dejanje | Kako |
|---|---|
| izbira odgovora | tap na gumb |
| izbira države / kraja | tap na zemljevid |
| premikanje zemljevida | vlečenje s prstom |
| približevanje | gumba **–** in **+**, gumb **⤢** pokaže ves zemljevid |
| nazaj | gumb ⬅️, tipka Esc zapre nastavitve |

Vlečenje ne šteje kot odgovor: šele tap brez premika izbere državo.

## Tehnično

* ena datoteka HTML, ~170 kB, brez knjižnic in brez zunanjih slik
* zemljevid je navaden SVG; približevanje je spreminjanje `viewBox`, zato ostane oster na vsaki velikosti
* napredek v `localStorage` pod ključem `globko_geografija_v1`
* zvok je le nekaj piskov prek Web Audio; če naprava zvoka ne dovoli, igra teče naprej brez njega

### Kako je preizkušeno

* **Preizkus logike** – vseh 25 iger na vseh petih stopnjah, 5600 vprašanj: vsako mora imeti
  vprašanje, dovolj različnih možnosti, veljaven pravilen odgovor, cilj na zemljevidu pa mora biti
  dovolj velik za otroški prst. Preveri tudi, da vse točke padejo znotraj obrisa Slovenije.
* **Preizkus igranja** – bot odigra cel krog vsake igre v vsakem področju (28 krogov) in preveri
  odziv, razlago, gumb naprej in zaključni zaslon.
* **Preizkus dotika** – pravi tapi in vlečenje v Safarijevem in Chromovem pogonu: tap zadene državo,
  vlečenje zemljevida ne šteje kot odgovor, tap na piko deluje.
