# Vseved 🧠 – kviz za vso družino

Ena sama datoteka `kviz.html` (brez knjižnic, brez namestitve, deluje brez interneta).
**555 vprašanj** iz štirinajstih področij, vsako s tremi napačnimi odgovori in z razlago,
ki se pokaže po odgovoru – tudi kadar otrok ugane pravilno.

Igro vodi maskota Vseved – možgani z očali, narisani kot vgrajen SVG. Mežika, se rahlo ziba
in v govornem oblačku pozdravi, spodbudi ali potolaži, odvisno od tega, kako gre.

## Področja

| | Področje | vprašanj | | Področje | vprašanj |
|---|---|---:|---|---|---:|
| 🦊 | Narava in živali | 52 | 🔤 | Jezik in besede | 36 |
| 🫀 | Človeško telo | 38 | 🔢 | Števila in uganke | 40 |
| 🚀 | Vesolje | 36 | 🍎 | Vsakdanje življenje | 44 |
| 🔬 | Znanost in tehnika | 40 | 🇸🇮 | Slovenija | 46 |
| 🏛️ | Zgodovina | 40 | 💻 | Računalništvo in splet | 34 |
| 🗺️ | Geografija | 38 | 🌦️ | Vreme in podnebje | 34 |
| ⚽ | Šport | 34 | | | |
| 🎬 | Glasba, film, knjige | 43 | | **skupaj** | **555** |

Vsako področje ima vprašanja treh zahtevnosti, tako da ista igra deluje za sedemletnika
in za odraslega. Lahkih vprašanj je 225, torej dobrih 40 odstotkov – najmlajšim se igra
odpre takoj, ne šele po nekaj krogih.

Kaj snov pokriva poleg očitnega: slovenske ljudske pripovedke in šege (Martin Krpan, Peter
Klepec, desetnica, povodni mož, kralj Matjaž, perkmandeljc, kurenti, pust, Miklavž),
novejšo slovensko zgodovino (plebiscit 1990, samostojnost 1991, Evropska unija 2004,
evro 2007, Jugoslavija), umetnost in arhitekturo (slogi, freska, kip, Kolosej, arhitekt),
film in risanke, denar in poklice (banka, žepnina, davek, razprodaja, nakup na obroke),
praznike in vere, logične uganke brez računanja ter rastline, glive, gozd in ekologijo.

Novi področji sta **Računalništvo in splet** (kaj je splet, močno geslo, osebni podatki,
kaj storiti ob neprijetnem sporočilu, virus, varnostna kopija, piksel, robot, umetna
inteligenca) in **Vreme in podnebje** (oblaki, strela, mavrica, letni časi, merilniki,
podnebni pasovi, vremenska napoved, učinek tople grede, podnebne spremembe).

## Načini igre

| Način | Kako gre |
|---|---|
| ❓ **Klasični kviz** | deset vprašanj; težavnost se prilagaja odgovorom |
| 🪜 **Lestvica do vrha** | dvanajst vprašanj, vedno težjih. Tri pomoči: **50 : 50**, **namig** in **zamenjaj vprašanje**. Napaka konča vzpon, a stopnički 4 in 8 sta varni – rezultat se tam shrani |
| ⚡ **Hitri ogenj** | ena minuta, brez ustavljanja: koliko pravilnih zmoreš? Igra si zapomni rekord |
| 🤔 **Drži ali ne drži** | vprašanje s ponujenim odgovorom – samo presodi, ali je pravi |
| ⚔️ **Dvoboj za dva** | dva igralca na eni napravi, izmenično po dvanajst vprašanj. Vsak ima svojo barvo in svojo polovico semaforja, črta pod njim pove, kdo je na vrsti |
| 📅 **Izziv dneva** | vsak dan drugih deset vprašanj, **za vse igralce enakih** |

Pred vsakim načinom (razen izzivom dneva) je mogoče izbrati eno področje ali **vse pomešano**.

## Kako se prilagaja igralcu

Igra si za vsako področje zapomni stopnjo (lahko – srednje – težko). Štirje pravilni odgovori
zapored jo dvignejo, dva zaporedna spodrsljaja spustita. Vprašanja, pri katerih se je zataknilo,
se čez čas vrnejo pogosteje – razen v izzivu dneva, ki mora biti za vse enak. Enako se
prilagajajo tudi pomešani krogi, ki napredek vodijo pod svojim ključem.

V kotičku za starše (⚙️) je mogoče prilagajanje izklopiti in trdno izbrati lahko (takrat so
na voljo tri možnosti namesto štirih), srednje ali težko. Tam se tudi ponastavi napredek.
Zvok se preklopi kar z gumbom 🔊 v glavi igre.

Na domačem zaslonu je pregled **kako ti gre po področjih** – odstotek pravilnih za vsako
od štirinajstih področij, vsaka vrstica v barvi svojega področja.

## Videz

* maskota kot vgrajen SVG s štirimi razpoloženji (pozdrav, veselo, zamišljeno, žalostno),
  mežikanjem in zibanjem; velika stoji v uvodni kartici, ob izbiri področja, ob vrstici s pikami
  na zaslonu z vprašanjem in na zaključnem zaslonu, majhna pa v glavi igre
* govorni oblaček z repkom proti maskoti: pozdravi, spodbudi med vprašanjem in se odzove na odgovor
* bledo ilustrirano ozadje z žarnicami in vprašaji
* ikone načinov igre v okroglem okvirju z lokom v barvi načina; kartice načinov in čipi področij
  z blagim prelivom v barvi področja
* kratek prehod med zasloni in zaporedni prihod možnosti; `hidden` se preklopi takoj,
  animacija je zgolj vizualna
* pravilen odgovor: zelen blisk okoli kartice; napačen: kratko tresenje in prikaz pravilnega
* zaključni zaslon: krožni prikaz odstotka, ki zraste pred očmi, do tri zvezdice, ki priletijo
  ena za drugo, in konfeti ob odličnem rezultatu
* **temni način** prek `prefers-color-scheme`
* `prefers-reduced-motion` izklopi vse animacije, tudi konfete

## Upravljanje

| Dejanje | Kako |
|---|---|
| odgovor | tap na možnost ali tipke **1**–**4** |
| naprej | gumb **Naprej** ali **Enter** |
| pomoč (lestvica) | gumbi **50 : 50**, **namig**, **zamenjaj** |
| zvok | gumb 🔊 v glavi |
| nazaj | gumb ⬅️, tipka **Esc** zapre nastavitve |

## Tehnično

* ena datoteka HTML, ~150 kB, brez knjižnic in brez zunanjih slik
* vsi načini uporabljajo isti pogon; način je samo zapis pravil (koliko vprašanj, ali teče čas,
  ali napaka konča igro, ali sta igralca dva)
* izziv dneva izbere vprašanja s **ponovljivim naključjem**, katerega seme je datum – zato
  dobita dve napravi isti izziv, tudi če sta brez interneta
* napredek v `localStorage` pod ključem `vseved_kviz_v1`; oblika zapisa se ni spremenila,
  zato star napredek ostane
* zvok je le nekaj piskov prek Web Audio; če naprava zvoka ne dovoli, igra teče naprej brez njega

### Kako je preizkušeno

Preizkusa `preizkusi/test-kviz.js` in `preizkusi/test-kviz2.js` se poganjata z
`PW_POGON=chromium node preizkusi/test-<ime>.js`. Oba sta bila nazadnje pognana in sta bila
v celoti zelena.

* **Preizkus zbirke** – vsako od 555 vprašanj mora imeti veljavno področje in zahtevnost,
  tri različne napačne odgovore, neprazno razlago, se končati z vprašajem in ne sme biti
  podvojeno; vsako področje mora imeti vsaj štiri vprašanja na vsaki stopnji in vsaj dvanajst
  skupaj, da zdrži najdaljši krog brez ponavljanja.
* **Preizkus igranja** – bot odigra vseh šest načinov od začetka do zaključnega zaslona in
  nato še klasični kviz v vsakem od štirinajstih področij posebej.
* **Preizkus videza** – vsako področje ima ime, emoji in veljavno barvo, čip vsakega področja
  dobi barvo v spremenljivki `--c`; maskota izriše vsa štiri razpoloženja in ima oblaček;
  ob prehodu med zasloni se `hidden` preklopi takoj, ne šele po animaciji.
* **Preizkus pravil** – napačen odgovor v lestvici konča vzpon in shrani zadnjo varno
  stopničko; pomoč 50 : 50 skrije prav dva napačna odgovora; štoparica hitrega ognja konča
  krog; izziv dneva dvakrat zapored izbere ista vprašanja in se ne spremeni z napredkom;
  samodejni skok hitrega ognja se ne dotakne kroga, ki se je začel za njim; pomešani hitri
  ogenj bere napredek pod ključem `mesano` (ta preverba pade, če se ključ zapiše s strešico).
* **Konzola** – oba preizkusa igro naložita prek `file://` in zahtevata, da v konzoli ni
  nobene napake.
