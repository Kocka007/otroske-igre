# Vseved 🧠 – kviz za vso družino

Ena sama datoteka `kviz.html` (brez knjižnic, brez namestitve, deluje brez interneta).
**325 vprašanj** iz dvanajstih področij, vsako s tremi napačnimi odgovori in z razlago,
ki se pokaže po odgovoru – tudi kadar otrok ugane pravilno.

## Področja

| | Področje | | Področje |
|---|---|---|---|
| 🦊 | Narava in živali | ⚽ | Šport |
| 🫀 | Človeško telo | 🎬 | Glasba, film, knjige |
| 🚀 | Vesolje | 🔤 | Jezik in besede |
| 🔬 | Znanost in tehnika | 🔢 | Števila in uganke |
| 🏛️ | Zgodovina | 🍎 | Vsakdanje življenje |
| 🗺️ | Geografija | 🇸🇮 | Slovenija |

Vsako področje ima vprašanja treh zahtevnosti, tako da ista igra deluje za sedemletnika
in za odraslega.

## Načini igre

| Način | Kako gre |
|---|---|
| ❓ **Klasični kviz** | deset vprašanj; težavnost se prilagaja odgovorom |
| 🪜 **Lestvica do vrha** | dvanajst vprašanj, vedno težjih. Tri pomoči: **50 : 50**, **namig** in **zamenjaj vprašanje**. Napaka konča vzpon, a stopnički 4 in 8 sta varni – rezultat se tam shrani |
| ⚡ **Hitri ogenj** | ena minuta, brez ustavljanja: koliko pravilnih zmoreš? Igra si zapomni rekord |
| 🤔 **Drži ali ne drži** | vprašanje s ponujenim odgovorom – samo presodi, ali je pravi |
| ⚔️ **Dvoboj za dva** | dva igralca na eni napravi, izmenično po dvanajst vprašanj, s semaforjem |
| 📅 **Izziv dneva** | vsak dan drugih deset vprašanj, **za vse igralce enakih** |

Pred vsakim načinom (razen izzivom dneva) je mogoče izbrati eno področje ali **vse pomešano**.

## Kako se prilagaja igralcu

Igra si za vsako področje zapomni stopnjo (lahko – srednje – težko). Štirje pravilni odgovori
zapored jo dvignejo, dva zaporedna spodrsljaja spustita. Vprašanja, pri katerih se je zataknilo,
se čez čas vrnejo pogosteje – razen v izzivu dneva, ki mora biti za vse enak.

V kotičku za starše (⚙️) je mogoče prilagajanje izklopiti in trdno izbrati lahko (takrat so
na voljo tri možnosti namesto štirih), srednje ali težko. Tam se tudi ugasne zvok in ponastavi
napredek.

Na domačem zaslonu je pregled **kako ti gre po področjih** – odstotek pravilnih za vsako
od dvanajstih področij.

## Upravljanje

| Dejanje | Kako |
|---|---|
| odgovor | tap na možnost ali tipke **1**–**4** |
| naprej | gumb **Naprej** ali **Enter** |
| pomoč (lestvica) | gumbi **50 : 50**, **namig**, **zamenjaj** |
| nazaj | gumb ⬅️, tipka **Esc** zapre nastavitve |

## Tehnično

* ena datoteka HTML, ~86 kB, brez knjižnic in brez zunanjih slik
* vsi načini uporabljajo isti pogon; način je samo zapis pravil (koliko vprašanj, ali teče čas,
  ali napaka konča igro, ali sta igralca dva)
* izziv dneva izbere vprašanja s **ponovljivim naključjem**, katerega seme je datum – zato
  dobita dve napravi isti izziv, tudi če sta brez interneta
* napredek v `localStorage` pod ključem `vseved_kviz_v1`
* zvok je le nekaj piskov prek Web Audio; če naprava zvoka ne dovoli, igra teče naprej brez njega

### Kako je preizkušeno

* **Preizkus zbirke** – vsako vprašanje mora imeti področje, veljavno zahtevnost, tri različne
  napačne odgovore, se končati z vprašajem in ne sme biti podvojeno; vsako področje mora imeti
  dovolj vprašanj za vse tri stopnje.
* **Preizkus igranja** – bot odigra vseh šest načinov od začetka do zaključnega zaslona,
  vmes preizkusi tudi pomoči (50 : 50 mora skriti prav dva napačna odgovora).
* **Preizkus pravil** – napačen odgovor v lestvici res konča vzpon in shrani zadnjo varno
  stopničko; štoparica hitrega ognja res konča krog; izziv dneva dvakrat zapored izbere
  ista vprašanja.
