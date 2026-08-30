# 🦁 Kito – Krona trave

Ploščadna igra v eni sami datoteki `kito.html`. Brez knjižnic, brez gradnje,
brez interneta – odpri datoteko in teče.

Ta zapis je hkrati **opis igre** in **oblikovni dokument**: zgodba, liki,
seznam potez, nivoji in razlogi za odločitve.

---

## Kaj je to

Deset nivojev savane in štiri dodatne sobe. Igraš levjega mladiča Kita, ki mu
odrasli očitajo nekaj, česar ni storil, in mu vzamejo reko. Igra hoče ujeti
*občutek* ploščadnih iger iz sredine devetdesetih – natančen skok, rjovenje kot
orodje, preobrazbo iz mladiča v odraslega, prizore kot iz risanke – z **izvirno**
zgodbo, imeni, liki, nivoji, glasbo in risbami.

**Izvirnost.** Vse je izmišljeno za to igro: imena, kraji, zgodba, poteze,
razporeditve nivojev, glasba in risbe. Živali so afriške, ker je savana savana,
liki pa niso podobni likom iz nobene risanke ali igre. Nobene zvočne ali slikovne
datoteke od drugod – vse nastane iz kode (Canvas 2D in Web Audio).

---

## Zgodba

V travi ne vlada kri, ampak **Dežna pogodba**: kdor po dolgi suši zbudi
**Nevihtni baobab** na Visokem kopju, sme nositi **Krono prahu**.

**Kito** je pegast levji mladič z zlomljenim rjovenjem – zadnji otrok
osramočenega rodu dežnih pevcev, ki so mu očitali, da je ukradel mokro dobo.
Ko reka izgine, hijenska zveza **Smejoči dvor** zajezi izvire in začne prodajati
vodo. Kita obtožijo, da je zastrupil napajališče. Ne prežene ga krivda –
**prodajo** ga potujoči karavani.

Pobegne v slano ravnico. Tam sreča medojeda **N'punkta**, ki koplje bližnjice,
in bradavičarja **Goboja**, ki gradi pasti. Nista šaljivca; sta edina, ki znata
kaj uporabnega.

Odrasel Kito ne pride po prestol. Podre jez, vrne reko – in krono vzame samo,
če mu jo **črede same izglasujejo**. V finalu se lahko odloči, da duha suše
sploh ne ubije, ampak drevo zbudi z darom nabranih skarabejev.

**Teme:** voda kot moč, govorica proti resnici, najdena družina, ki nekaj zna.

---

## Poteze

### Kito mladič (nivoji 1–5)
| Poteza | Kako | Kaj naredi |
|---|---|---|
| Skok | `preslednica` / `Z` | višina je odvisna od tega, kako dolgo držiš |
| Skok na plen | `X` v zraku | zapiči se navzdol naprej; pobije majhen plen |
| Zalet | `X` na tleh | kratek skok naprej |
| Rjovenje | `C` | omami, razžene tkalce, podre lažna tla, ustavi pljunek kobre |
| Oprijem lubja | proti deblu v zraku | drsi po deblu, s pritiskom na skok se odrine stran |

### Kito odrasel (nivoji 6–10, po Slanem krstu)
| Poteza | Kako | Kaj naredi |
|---|---|---|
| Zamah | `X` | udarec pred sabo; podre nosilce jezu |
| Zalet z ramo | `X` + `dol` | prebije kletke in mehke stene, med zaletom ne obstane |
| Prijem in met | hodi v omamljenega | ga dvigneš; z `X` ga vržeš v druge |
| Dolgo rjovenje | `C` | zruši razpokano skalo, obrne čredo gnujev, prežene straže |

### Prijatelji (dodatne sobe)
- **N'punkt (medojed)** – koplje skozi blato in krhko zemljo, prenese pike in strupe.
- **Gobo (bradavičar)** – zalet z glavo, lovi padajoče sadje.
- **Volovka** – let: tipka za skok je zamah s krili.
- **Skarabej** – kepa se kotali sama, ti samo skačeš.

### Merilniki
- **Oklep** je iz hroščevih luskin, ne src. Sončni hrošči ga trajno povečajo.
- **Rjovenje** ima svoj merilnik in se polni sproti; sončni hrošči ga podaljšajo.
- **Skarabeji** so denar in hkrati ključ do miroljubnega konca (120 jih odpre dar).

---

## Nivoji

Vsak nivo ima svoj **glagol** – nekaj, česar ni v nobenem drugem.

| # | Nivo | Glagol |
|---|---|---|
| 1 | Zorno kopje | rjovenje razžene tkalce z veje, ki je edini most; jahanje žirafinega vratu |
| 2 | Tkalčeva cesta | plezanje po živalih navzgor – vsaka te nese naprej samo ob pravem trenutku |
| 3 | Smejoči dvor | odmev rjovenja podre lažna tla; kostni mostovi, brlogi |
| 4 | Pogreb reke | suha struga se udira pod nogami; ribe v mlakah lahko rešiš |
| 5 | Slani krst | privid ploščadi izgine, ko stopiš nanj; na koncu preobrazba |
| 6 | Razbita karavana | straže te vidijo v stožcu; rjovenje iz teme jih razkropi, ramena odprejo kletke |
| 7 | Jez iz zob | jahanje nosoroga skozi kotaleče hlode, podiranje nosilcev jezu |
| 8 | Termitna katedrala | navpičen labirint; stropni hrošči te nesejo z glavo navzdol |
| 9 | Nevihtni baobab | veter obrača skoke, strela za hip pokaže pot |
| 10 | Glasovanje na Visokem kopju | tri dejanja: matriarhinja, beg pred vodo, nato **izbira** – boj ali dar |
| ★ | Jazbečev rov | N'punkt koplje bližnjice tam, kjer drugi obidejo |
| ★ | Gobov lov na sadje | ritem: ujemi 30 kosov, preden jih pet pade |
| ★ | Nad savano | let skozi obroče iz vetra |
| ★ | Skarabejeva dirka | kepa se kotali sama, ti skačeš čez ovire |

---

## Kaj je narejeno drugače kot v igrah iz devetdesetih

Navdih so stare ploščadne igre, ne pa njihove slabe navade:

1. **Nič nevidnih bodic.** Vsaka nevarnost je narisana tam, kjer tudi rani.
   Trki so pravokotni in vidni.
2. **Skok odpušča.** Po robu imaš še 7 sličic časa za skok (»kojotov čas«),
   skok, pritisnjen tik pred pristankom, se izvede sam. Pri triploščičnem
   prepadu je okno 13 sličic, ne dve.
3. **Rjovenje je orodje, ne samo napad.** Odpira poti, obrača črede, razkriva
   lažna tla, ustavi izstrelke.
4. **Smrt ni kazen za pol ure igranja.** V načinu *Zgodba* se čas ob smrti
   zavrti 8 sekund nazaj, kontrolnih točk (termitnjakov) je več. Kdor hoče
   staro trdoto, izbere *Prah*: brez vračanja časa.
5. **Konec ni nujno pretep.** Zadnjega nasprotnika lahko premagaš – ali pa
   drevo zbudiš z darom in nobenega ne ubiješ.
6. **Zgodba ni maščevanje.** Junak ne pride po prestol, ki mu pripada po rodu;
   krono sprejme šele, če jo dobi z glasovanjem.
7. **Dostopnost je v igri, ne v priročniku:** barvne sheme, manj bliskov,
   »drži za skok na plen«, nesmrtnost za najmlajše, gumbi na zaslonu.

---

## Krmilje

| | Tipkovnica | Plošček | Zaslon na dotik |
|---|---|---|---|
| Hoja | ← → ali A D | levi krmilnik | ◀ ▶ |
| Skok | preslednica, Z, J | A | SKOK |
| Napad | X, K, Shift | X / B | NAPAD |
| Rjovenje | C, L, Enter | Y / R1 | RJOVI |
| Pogled navzdol | ↓ | dol | ▼ |
| Premor | Esc ali P | | ❚❚ |
| Čas nazaj | R (samo v načinu Zgodba) | | v premoru |

---

## Tehnično

- Ena datoteka HTML, čist JavaScript, brez knjižnic in brez gradnje.
- Notranja ločljivost **320×180 pik**, povečana na celo število – pike so ostre
  in enako velike na vseh zaslonih.
- Zanka teče s **stalnim korakom 1/60 s** (kar se izriše, je vedno isto, ne
  glede na hitrost zaslona).
- Vse risbe nastanejo iz kode: živali so sestavljene iz istega ogrodja
  (`stirinozec`), obrobo dobijo iz sence lastne risbe, da se zlata dlaka ne
  zlije s peskom.
- Glasba in učinki nastanejo z Web Audio: trije kanali (glasba, učinki,
  rjovenje); ob rjovenju se glasba za hip umakne.
- Napredek se hrani v `localStorage` (tri shrambe), nič se ne pošilja na splet.

### Kako je preizkušeno

Ob zagonu se v razvijalski konzoli izpiše izid **vgrajenega samopreizkusa**. Ta preveri:

- da se vsi nivoji sestavijo in imajo začetek, izhod in kontrolne točke,
- da mladič **res** preskoči tri ploščice (izmerjeno s pravo fiziko, ne z
  oceno),
- da noben prepad ni širši, kot se da preskočiti (razen tam, kjer čez vozi
  živa ploščad),
- **dosegljivost**: iz začetka se po skokih in padcih res pride do izhoda.
  To preverjanje je med razvojem našlo tri slepe ulice – previsoko stopnišče
  v Tkalčevi cesti, prekrivajoče se police v Termitni katedrali in luknjo pod
  baobabom.

Za preizkušanje zunaj brskalnika je prvi del datoteke označen z
`ČISTA LOGIKA – ZAČETEK/KONEC`: v tem delu ni dostopa do DOM-a, zato se ga da
naložiti v Node.js in pognati robota, ki odigra nivoje sam.

V repozitoriju je poleg tega `preizkusi/test-kito.js` (Playwright), ki igro odpre
v brskalniku in preveri:

* da se **vseh 14 nivojev** sestavi, ima ime, velikost in izhodišče,
* da se Kito nikjer ne rodi v steni ali izven karte (preverjeno s pravo obliko
  lika: mladič do Slanega krsta, odrasel po njem),
* da ima vsak nivo izhod ali duhove – torej način, da se konča,
* da isto seme dvakrat zapored sestavi **enak** nivo (karta, objekti, izhodišče),
* da svet prenese **900 korakov fizike** na nivo, ko bot slepo teče desno in skače:
  brez izjem, brez neveljavnih koordinat, padec v prepad pa svet ujame in Kita
  oživi pri kontrolni točki,
* da vgrajeni samopreizkus ob zagonu ne javi nobene napake.
