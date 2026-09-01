# Globko 🌍 – geografija za otroke

Ena sama datoteka `geografija.html` (brez knjižnic, brez namestitve, deluje brez interneta).
Otrok se uči na **pravem zemljevidu**: države tapka, jih približuje in premika s prstom.
Skozi igro ga vodi **Globko**, globus z obrazom, ki se veseli, zamisli ali potolaži.

## Kaj se otrok nauči

| Področje | Kaj vsebuje |
|---|---|
| 🇸🇮 **Slovenija** | 25 mest z regijo in prebivalstvom, 21 gora z višinami, 14 rek z dolžinami, jezera, jame in znamenitosti, pokrajine in 12 statističnih regij, podnebni tipi, kotline, mejni prehodi, 54 vprašanj o državi |
| 🏰 **Evropa** | vse evropske države na zemljevidu, zastave, glavna mesta, sosede in igra »vse sosede«, gorstva, reke in morja, Evropska unija |
| 🌍 **Svet** | 130 držav, karte Afrike, Azije in obeh Amerik, celine in oceani na karti, velike reke in jezera, zastave sveta, glavna mesta, znamenitosti, rekordi |
| 🌋 **Zemlja in narava** | 83 vprašanj: dan in noč, letni časi, podnebni pasovi, časovni pasovi, prebivalstvo, vulkani in potresi, Luna in plimovanje, orientacija v naravi, branje zemljevida |

### Države (130)

| Celina | Držav |
|---|---|
| Evropa | 45 (+2 čezcelinski) |
| Azija | 30 |
| Afrika | 24 |
| Južna Amerika | 12 |
| Severna in Srednja Amerika | 12 |
| Avstralija in Oceanija | 5 |

Vsaka država ima glavno mesto, zanimivost in svojo zastavo – **130 zastav**, vse narisane sproti
iz osnovnih likov, nobene slike.

## Igre (32)

| Igra | Kaj dela otrok |
|---|---|
| Kje leži? | tapne državo na zemljevidu Evrope ali sveta |
| Po celinah | tapne državo na karti Afrike, Azije, Južne ali Severne Amerike |
| Tapni celino / Tapni ocean | najde celino oziroma ocean ali morje na svetovni karti |
| Reke in jezera | najde Nil, Amazonko, Bajkalsko jezero … na svetovni karti |
| Kje je mesto? / Gore in reke | tapne pravo piko na zemljevidu Slovenije |
| Znamenitosti | tapne Everest, Saharo, Veliki koralni greben … |
| Merilo in legenda | z merilno palico oceni zračno razdaljo med dvema slovenskima krajema |
| Statistične regije | v kateri od dvanajstih regij leži kraj |
| Vse sosede | po vrsti tapne vse sosede dane države |
| Čigava zastava? / Najdi zastavo | zastava → država in obratno |
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
* pri zemljevidu, koliko držav je osvetljenih (4 → 6 → 8 → 12 → cel zemljevid brez pomoči),
* pri igri Vse sosede, koliko sosed mora otrok najti (2 → 4).

Kartica igre kaže obroč s stopnjo in do tri zvezdice. Na koncu kroga otrok vidi krožni prikaz
odstotka, zvezdice, ki priletijo ena za drugo, konfete ob dobrem rezultatu in **zemljevid
»kaj že znaš«**: zeleno je tisto, kar je že osvojil, oranžno tisto, kar še vadi.

V kotičku za starše (⚙️) je mogoče prilagajanje izklopiti in trdno izbrati lahko, srednje ali težko.
Tam se tudi ugasne zvok (ali kar z gumbom 🔊 v glavi) in ponastavi napredek.
Vse ostane na napravi, nič se ne pošilja na internet.

## Zemljevidi

Obrisi držav so **Natural Earth** (javna last, prek `world-atlas`), poenostavljeni z
Douglas–Peuckerjevim postopkom in vgrajeni kot poti SVG – zato zemljevid deluje tudi brez interneta.

* **Svet** – Robinsonova projekcija, 175 držav
* **Evropa** – Lambertova stožčasta projekcija, 60 držav, obrezano v projicirani ravnini (rob je zato raven)
* **Slovenija** – ista projekcija, približana, s sosedami kot ozadjem
* **Afrika, Azija, Južna Amerika, Severna Amerika** – izrezi svetovne karte. Novih obrisov nismo
  risali: poti svetovne karte premaknemo in povečamo, enako pa preračunamo tudi merilo in izhodišče
  projekcije, zato pretvorba iz stopinj deluje na izrezu enako kot na svetovni karti. Podrobnost
  obrisov je zato enaka kot na svetovni karti – dovolj za tapkanje, ne za natančno merjenje.

Kraji so shranjeni v stopinjah zemljepisne širine in dolžine; igra jih z isto projekcijo sama
preračuna v koordinate zemljevida, zato je dodajanje nove gore ali mesta ena sama vrstica.

**Reke in jezera** so ločen sloj poenostavljenih poti v stopinjah (28 rek, 12 jezer). Vsaka karta
sama izračuna, katere so na njej sploh vidne – zato so na slovenski karti Sava, Drava in Soča,
na svetovni pa Amazonka, Nil in Jangce.

Kopno ima blag navpičen preliv in mehko senco, morje pa fin valovit vzorec. Pri veliki povečavi
se izpišejo imena držav (pri iskanju države seveda šele po odgovoru). Premik zemljevida na cilj
je gladek polet z `requestAnimationFrame` (~350 ms); ob `prefers-reduced-motion` se izklopi.

**Zastave niso slike.** Vsaka je sestavljena iz osnovnih likov (proge, križi, zvezde, polmeseci,
šahovnica, orel …) in se nariše sproti. Vse so v razmerju 3 : 2, tudi tiste, ki so v resnici
kvadratne, grbi pa so poenostavljeni – prepoznavni, ne heraldično natančni.

## Videz

* **Globko** je vgrajen SVG globus z obrazom: štiri razpoloženja (pozdrav, veselo, zamišljeno,
  žalostno), mežikanje in rahlo zibanje v mirovanju, poskok ob pravilnem in tresenje ob napačnem
  odgovoru. Ob njem je govorni oblaček s pozdravom, namigom ali spodbudo.
* **Ozadje** so bledi motivi: valovi, kompas in obrisi celin.
* **Kartice** imajo nežen preliv v barvi področja, ikono v barvnem krogu, obroč napredka in zvezdice.
* **Prehodi**: zaslon se pojavi z zdrsom (180 ms), odgovori priletijo eden za drugim, gumb se ob
  pritisku pomanjša. Pravilen odgovor osvetli kartico zeleno, napačen jo strese.
* **Temni način** prek `prefers-color-scheme`; zemljevid dobi temno morje, temnejše kopno in
  svetlejše meje, da ostane berljiv.
* Vse animacije se ob `prefers-reduced-motion: reduce` izklopijo.

## Upravljanje

| Dejanje | Kako |
|---|---|
| izbira odgovora | tap na gumb |
| izbira države / kraja | tap na zemljevid |
| premikanje zemljevida | vlečenje s prstom |
| približevanje | gumba **–** in **+**, gumb **⤢** pokaže ves zemljevid |
| zvok | gumb 🔊 v glavi |
| nazaj | gumb ⬅️, tipka Esc zapre nastavitve |

Vlečenje ne šteje kot odgovor: šele tap brez premika izbere državo.

## Tehnično

* ena datoteka HTML, ~245 kB, brez knjižnic in brez zunanjih slik
* zemljevid je navaden SVG; približevanje je spreminjanje `viewBox`, zato ostane oster na vsaki velikosti
* napredek v `localStorage` pod ključem `globko_geografija_v1` (stari napredek se ohrani; novo polje
  `znam` dobi prazno privzeto vrednost)
* zvok je le nekaj piskov prek Web Audio; če naprava zvoka ne dovoli, igra teče naprej brez njega

### Kako je preizkušeno

Preizkusi so v `preizkusi/`, poganjajo se s Playwrightom. Spodaj so izidi zadnjega zagona
s pogonom Chromium (`PW_POGON=chromium`); WebKit na razvojnem stroju ni bil na voljo.

* **Preizkus logike** (`test-logika.js`) – vseh 32 iger na vseh petih stopnjah, 7875 vprašanj:
  vsako mora imeti vprašanje, dovolj različnih možnosti, veljaven pravilen odgovor, cilj na
  zemljevidu pa mora biti dovolj velik za otroški prst. Preveri tudi, da vse točke padejo znotraj
  obrisa Slovenije in da se pike med seboj ne prekrivajo – sicer otrok prave ne bi mogel tapniti.
  Za igro Vse sosede posebej preveri, da so vse sosede na karti, dovolj velike, osvetljene in da
  so med osvetljenimi tudi motilke. **Izid: brez napak.**
* **Preizkus igranja** (`test-igranje.js`) – bot odigra cel krog vsake igre v vsakem področju
  (35 krogov po 10 vprašanj) in preveri odziv, razlago, gumb naprej in zaključni zaslon. Pri igri
  Vse sosede tapne sosede po vrsti in preveri, da se krog ne zaključi predčasno. Pognan tudi z
  `PRAVILNO=0.5`, kjer bot polovico zgreši. **Izid: brez napak.**
* **Preizkus dotika** (`test-tap.js`) – pravi tapi in vlečenje: tap zadene državo, vlečenje
  zemljevida ne šteje kot odgovor, tap na piko deluje, gumba za približevanje delujeta (preizkus
  počaka, da se polet zemljevida umiri). **Izid: brez napak.**
* **Posnetki zaslona** – začetni zaslon, izbira igre, zemljevid, odgovor, merilo, vse sosede, reke
  in jezera ter zaključni zaslon pri 390×844 in 1024×768, v svetlem in temnem načinu, ter zagon
  z vklopljenim `prefers-reduced-motion`. Konzola je bila povsod prazna.
