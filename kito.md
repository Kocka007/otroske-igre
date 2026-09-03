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

Prvič sreča medojeda **N'punkta** že v hijenskem brlogu, kjer si vsak koplje
svojo pot; ta mu obljubi, da se vidita na soli. Na slani ravnici res čaka –
z bradavičarjem **Gobojem**, ki gradi pasti. Nista šaljivca; sta edina, ki znata
kaj uporabnega. V Termitni katedrali Gobo prvič reče na glas, da so družina.

Oba nastopita v glavni zgodbi, ne le v dodatnih sobah: **v 3., 5. in 8. nivoju**
(štirje prijatelji, vsak s tremi vrsticami dialoga, ki se sprožijo ob dotiku).

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

### Novi nasprotniki
- **Pavijan metalec** – ne pride blizu, meče kamenje v loku in se umika. Rjovenje
  mu ga izbije iz rok, skok na glavo ga konča.
- **Mravljinčna kolona** – pohoditi se je ne da, preskočiti pa. Rjovenje jo obrne.
- **Zoban, čuvaj jezu** (šef sredi 7. nivoja) – povodni konj s tremi življenji in
  tremi fazami: najprej se zaleti (rjovenje ga med zaletom ustavi), potem skače in
  z udarcem ob tla podre vse, kar stoji, na koncu pljuva. Nad glavo pokaže, koliko
  udarcev še prenese.

### Tuli, gepardka (drugi igralec)
| Poteza | Kako | Kaj naredi |
|---|---|---|
| Tek | ← → | hitrejša od Kita, pospeši že v prvi sekundi |
| Skok | `preslednica` | višji in daljši kot Kitov |
| Odskok od stene | proti steni v zraku, nato skok | oprime se vsake navpične stene, odrine se največ dvakrat v enem letu |
| Drsanje | `↓` med tekom | zniža se in zdrsne pod nizke ovire |
| Skok na plen | `.` | kot mladičev, le hitrejši in bolj plosk |
| Žvižg | `Enter` | omami kobre in kuščarje za dolgo, druge za kratko, ustavi izstrelke; **ne** podre lažnih tal in ne obrne čred |
| Dolgi tek | po Slanem krstu | po dveh sekundah teka je skok za tretjino daljši |

Tuli ima le dve luskini oklepa in se pri Slanem krstu ne preobrazi: gepardi
ne rastejo v moč, rastejo v hitrost.

### Prijatelji (dodatne sobe)
- **N'punkt (medojed)** – koplje skozi blato in krhko zemljo, prenese pike in strupe.
- **Gobo (bradavičar)** – zalet z glavo, lovi padajoče sadje.
- **Volovka** – let: tipka za skok je zamah s krili.
- **Skarabej** – kepa se kotali sama, ti samo skačeš.

### Merilniki
- **Oklep** je iz hroščevih luskin, ne src. Sončni hrošči ga trajno povečajo.
- **Rjovenje** ima svoj merilnik in se polni sproti; sončni hrošči ga podaljšajo.
- **Skarabeji** so denar in hkrati ključ do miroljubnega konca (120 jih odpre dar).
  Zaslon ob koncu nivoja ju loči: *Skarabeji v nivoju* pove, koliko jih je pobranih
  od vseh postavljenih (navadnih in zlatih, tudi tistih v skritih sobah), *Nabranih
  skupaj* pa denarnico, v katero gredo tudi ribe, obroči, kletke, nosilci in šefi.
  Zato je prvi števec vedno manjši ali enak imenovalcu; skarabeji, ki jih spustijo
  premagani sovražniki, gredo le v denarnico.
- **Zlati skarabeji** – trije na vsak glavni nivo (33 v celi igri), vedno stran od
  najkrajše poti: v skriti sobi, na visoki polici, pod prividnimi ploščadmi.
  Vsak šteje za pet navadnih in je pogoj za medaljo.
- **Sončni cvet** – deset jih je po nivojih. Za sedem sekund je Kito hitrejši za
  tretjino in neranljiv; namesto utripanja ga obda zlat sij.

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
| 7 | Jez iz zob | jahanje nosoroga skozi kotaleče hlode, podiranje nosilcev jezu, **šef Zoban** na sredini |
| 8 | Termitna katedrala | navpičen labirint; stropni hrošči te nesejo z glavo navzdol |
| 9 | Nevihtni baobab | veter obrača skoke, strela za hip pokaže pot |
| 10 | Glasovanje na Visokem kopju | tri dejanja: matriarhinja, beg pred vodo, nato **izbira** – boj ali dar |
| ★ | Jazbečev rov | N'punkt koplje bližnjice tam, kjer drugi obidejo |
| ★ | Gobov lov na sadje | ritem: ujemi 30 kosov, preden jih pet pade – sadje pada tam, kjer si ti |
| ★ | Nad savano | let skozi obroče iz vetra |

Dodatni sobi **Gobov lov** (40×14 → 120×18, štiri dvorišča s klanci, blatno kotanjo
in stolpom) in **Skarabejeva dirka** (ena zanka → devet ročnih odsekov) sta bili
najplitvejši in sta zdaj postavljeni ročno, kot glavni nivoji.
| ★ | Skarabejeva dirka | kepa se kotali sama, ti skačeš čez ovire – devet ročno postavljenih odsekov |

### Skrite sobe
V štirih nivojih (1., 6., 7. in 9.) tla nekje zvenijo votlo. Rjovenje jih podre,
spodaj čaka polica s **sončnim hroščem in zlatim skarabejem**, ob robu pa
stopnička, po kateri se pride nazaj ven. Namig v besedilu pove, kje poslušati.

### Kontrolne točke
Termitnjaki niso več po trije na nivo ne glede na dolžino, ampak **približno eden
na 40 enot** – od treh v ozki Tkalčevi cesti do sedmih v Skarabejevi dirki
(69 skupaj).

### Medalje in način na čas
Vsak nivo ima **tri medalje**: ⏱ za čas pod ciljem (od 80 s v dirki do 260 s v
finalu), 🪲 za vse tri zlate skarabeje in 🦁 za tek brez izgubljenega življenja.
Enkrat prislužena medalja ostane. Vidijo se na kartici nivoja in priletijo ena za
drugo na zaslonu ob koncu nivoja.

Ko je nivo enkrat prehojen, se na zaslonu pred njim odpre **način na čas**: ura v
HUD-u in najboljši čas, shranjen na kartici.

### Epilog
Po finalu ne pride tabela s številkami, ampak **zadnja stran knjige**: dve
različni besedili glede na to, ali si duha suše premagal ali si drevo zbudil z
darom. Šele od tam se igra vrne na zemljevid nivojev.

### Zemljevid savane
Izbor nivojev ni več seznam sivih škatel. Postaje se izmenjujejo levo in desno ob
pikčasti poti, vsaka nosi **barvo in znak svojega bioma**, številko v biomsko
obarvanem krogu, napredek, najboljši čas in tri medalje.

---

## Igra za dva

Dva igralca ob istem zaslonu, brez interneta. Drugi igralec vodi gepardko
**Tuli**, ki so jo karavane prodale istega dne kot Kita.

- **Pridružitev kadar koli.** Med igro pritisni tipko `.` ali kateri koli gumb
  na drugem ploščku (ali v premoru gumb »Pridruži se Tuli«) – Tuli priteče z
  roba zaslona. Nivoja ni treba začeti znova. V premoru lahko tudi odide.
  V dodatnih sobah (jazbec, Gobo, volovka, skarabej) je ni.
- **Ena kamera** gleda težišče obeh in naprej v smeri vodilnega. Kdor zaostane
  za več kot zaslon, po treh sekundah **priteče** k vodilnemu (tek, ne
  teleport; med njim je neranljiv).
- **Oživljanje z glasom.** Kdor pade, obleži, ne izgine. Drugi stopi k njemu
  in dve sekundi drži svoj glas (Kito rjovenje, Tuli žvižg); nad ležečim se
  polni kolobar, potem vstane z eno luskino. Ležanje ne stane življenja.
  Šele ko ležita oba – ali če ležečega 15 sekund nihče ne zbudi – se oba
  vrneta k termitnjaku (v načinu Zgodba se čas zavrti nazaj).
- **Skupno je vse:** življenja, skarabeji, denarnica, medalje in čas. Nivo se
  konča, ko izhod doseže kateri koli od njiju; prijatelji z dialogom se
  oglasijo ob dotiku katerega koli.
- **Vsak nasprotnik gleda najbližjega.** Bitja, stožci straž, pobiranje in
  kontrolne točke delujejo z obema brez posebnih pravil.
- V nastavitvah je stikalo **Igra za dva**, s katerim se pridružitev izklopi,
  če tipka `.` koga moti.

Enojna igra ostane, kakršna je bila: puščice in WASD oboje vodijo Kita.

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
   Animacije v vmesniku upoštevajo `prefers-reduced-motion`.
8. **Namig ima vsak nivo.** 66 namigov, najmanj dva na nivo; v navpičnih nivojih
   čakajo na višino, ne na razdaljo, sicer bi se sprožili vsi v prvi sekundi.

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

Ko se pridruži Tuli, se tipkovnica razdeli:

| | Kito (igralec 1) | Tuli (igralec 2) |
|---|---|---|
| Hoja | A D (W S gor, dol) | ← → (↑ ↓) |
| Skok | J (ali Z) | preslednica |
| Napad | K (ali X, Shift) | . |
| Glas | L (ali C) | Enter |
| Plošček | prvi | drugi |
| Zaslon na dotik | gumbi na zaslonu | – (drugi igralec s ploščkom) |

---

## Tehnično

- Ena datoteka HTML, čist JavaScript, brez knjižnic in brez gradnje.
- Svet meri **320×180 enot**, riše pa se na **trikrat gostejše platno (960×540)**.
  Risba je vektorska (elipse, črte, pravokotniki), zato nadvzorčenje nič ne stane,
  robovi pa niso kockasti. Če naprava ne dohaja, zanka gostoto sama zniža.
- Zanka teče s **stalnim korakom 1/60 s**, riše pa se lahko hitreje. Med dvema
  korakoma se liki narišejo **na vmesni legi**, zato je gib enako gladek na
  zaslonu s 60 in s 120 sličicami. Tudi kamera se ne zaokrožuje več na celo piko.
- Vse risbe nastanejo iz kode: živali so sestavljene iz istega ogrodja
  (`stirinozec`), obrobo dobijo iz sence lastne risbe, da se zlata dlaka ne
  zlije s peskom.
- **Živali imajo sklepe.** Noga je dvočlenska; iz kolka in stopala se izračuna
  koleno, stopalo pa hodi po ciklu – del na tleh potiska telo naprej, del v
  zraku niha naprej. Telo se pri teku ziba, glava vodi gib, rep je veriga
  štirih členov, ki zaostajajo drug za drugim.
- **Stisk in razteg**: ob doskoku se lik splošči (bolj, hitreje ko je padel),
  ob odrivu raztegne. Ob obratu sredi teka zadrsa in dvigne prah.
- **Globina prizora**: osem slojev, ki drsijo z različnimi hitrostmi – oblaki,
  dve gorski verigi, hribi, drevesa, bližnje grmovje, igralna ravnina in ospredje
  s šopi trave – z meglo med njimi, nizko meglo nad tlemi in mehkim robom prizora.
  Gore in hribi so vsota sinusov s celoštevilskimi frekvencami, narisani enkrat
  na pomožno platno, široko dva zaslona, ki se brez šiva ponavlja; daljni sloji
  so barvno primešani nebu (zračna perspektiva). Drevesa so po biomu: akacije z
  razcepljenim deblom in plosko krošnjo, baobabi, suha drevesa v brlogu, trstje
  ob jezu.
- **Svetloba in ozračje**: sonce z mehkim sijem, ki obarva obzorje, in snopi
  žarkov, ki počasi dihajo (v Termitni katedrali skozi odprtine v stropu); vsak
  biom ima svoj barvni ton čez cel prizor in svoje delce: pelod v zori, žerjavico
  v brlogu, kresničke ponoči, pršec ob jezu, prah v soli in katedrali. V daljavi
  se nekaj dogaja: čreda gnujev na hribu, karavana s svetilkami ponoči, ognji
  hijen v brlogu.
- **Vgrajene slike.** Naslovnica, slika zgodbe pred 1. nivojem in portreta Kita
  in Tuli v HUD-u so edine slike v igri; nastale so po konceptnih listih,
  narejenih za to igro, in so vgrajene v datoteko kot WebP v base64 (skupaj
  okoli 250 KB), zato igra še vedno deluje brez zunanjih datotek. Ikona igre v
  zbirki je iz istega portreta. Liki v igri ostajajo narisani iz kode; po
  konceptih so usklajene barve (zlata dlaka, kremast trebuh, temna notranjost
  uhljev, pikice za brke, griva s svetlim vrhom, Tulina oranžna dlaka z velikimi
  pegami), zato animacija ostane, kakršna je.
- **Tla** niso opeka: prst se navzdol temni, plasti tečejo čez ploščice, kamenčki
  imajo svetel rob, izpostavljeni robovi senco, pod previsi visijo korenine, trava
  raste v šopih ukrivljenih bilk, ki se v vetru upognejo; skala je lomljena, z
  razpokami in svetlimi ploskvami.
- Glasba in učinki nastanejo z Web Audio: trije kanali (glasba, učinki,
  rjovenje); ob rjovenju se glasba za hip umakne.
- Napredek se hrani v `localStorage` (tri shrambe), nič se ne pošilja na splet.
- **Dva igralca brez podvajanja kode.** Svet ima seznam `igralci`, `igralec`
  pa med korakom kaže na tistega, ki je bitju najbližji – zato vsa bitja,
  straže, pobiranje in točke delujejo z obema, ne da bi jih bilo treba pisati
  dvakrat. Vhod je dva objekta (`V`, `V2`), korak sveta ju sprejme oba; kdor
  ga kliče z enim, dobi enojno igro.

### Kako je preizkušeno

Ob zagonu se v razvijalski konzoli izpiše izid **vgrajenega samopreizkusa**. Ta preveri:

- da se vsi nivoji sestavijo in imajo začetek, izhod in kontrolne točke,
- da izris ostane pod **14 ms na sličico** – gladkost brez hitrosti ni gladkost,
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
* da vgrajeni samopreizkus ob zagonu ne javi nobene napake,
* da **izris nivojev 1, 3, 6, 8 in 9 ostane pod 14 ms na sličico** pri 150 izrisih
  (izmerjeno: 2–4 ms; bitja zunaj vidnega polja se ne rišejo),
* da ima **vsak nivo vsaj dva namiga**, ciljni čas za medaljo in dovolj kontrolnih
  točk glede na svojo dolžino,
* da ima **vsak glavni nivo tri zlate skarabeje**, da so skrite sobe vsaj v treh
  nivojih in da je vsaj en šef zunaj zadnjega nivoja,
* da so prijatelji z dialogom v 3., 5. in 8. nivoju,
* da **stara shramba brez polj za medalje** ne podre izbora nivojev in ne podeli
  medalj, nova pa jih pravilno prešteje,
* da se po finalu res pokaže **epilog** z besedilom, ki se razlikuje glede na izid,
  in da se medalje in najboljši čas v načinu na čas zapišejo v shrambo,
* **igra za dva**: v vseh desetih glavnih nivojih se Tuli pridruži in se ne rodi
  v steni, oba prehodita 900 korakov brez napak in neveljavnih koordinat; v
  dodatnih sobah se ne more pridružiti; zaostali po treh sekundah priteče k
  vodilnemu; padli obleži brez izgube življenja in ga Kito z dve sekundi
  držanim glasom zbudi z eno luskino, brez glasu pa ostane ležati; ko ležita
  oba, ju svet oživi pri točki in odšteje eno življenje; stara shramba brez polja
  za igro za dva se naloži nespremenjena; v enojni igri puščice vodijo Kita, po
  pritisku na `.` pa Tuli, Kito pa obdrži WASD.

Poleg tega je ročno preverjeno v brskalniku (Playwright): rjovenje res podre lažna
tla skrite sobe, Kito pade vanjo, pobere nagrado in skoči nazaj ven; sončni cvet
prižge moč; prijatelj pove vse tri vrstice; Zoban se najavi, zamenja vse tri faze
in ga je mogoče premagati.
