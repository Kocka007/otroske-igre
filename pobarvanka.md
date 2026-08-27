# 🎨 Barvica – pobarvanka

Interaktivna pobarvanka z **19 slikami**, **petimi stopnjami zahtevnosti** in **petimi načini
barvanja**. Ista slika ima na višji stopnji več in manjša polja, zato je primerna tako za
petletnika kot za odraslega, ki se ob mandali umiri.

## Kako se barva

Izbereš barvo in tapneš polje. Nič ni narobe – barvo lahko kadar koli zamenjaš,
z **↩️** razveljaviš zadnjo potezo, z **🧽 radirko** pa polje spet pobelíš.

### Načini barvanja

| Način | Kaj naredi |
|---|---|
| 👆 **Tapni** | Tapneš polje in se pobarva. |
| 🖌️ **Čopič** | Z drsenjem prsta pobarvaš več polj hkrati; cela poteza se razveljavi z enim dotikom. |
| 🔢 **Po številkah** | Vsako polje ima številko, barve v paleti pa so oštevilčene. Napačna barva se ne prime – polje samo pomežikne. |
| ✨ **Preliv** | Barva se prelije iz svetlejše v temnejšo, kar da slikam globino. |
| 🔄 **Simetrija** | En dotik pobarva vsa enaka polja hkrati (metulj, mandala, vitraž). |

### Stopnje zahtevnosti

Ista slika, več podrobnosti: **riba** ima na 1. stopnji 8 polj, na 4. pa 50 (dobi luske,
vodo, pesek in rastline). **Mandala** gre od 25 do 149 polj, **grad** od 18 do 117.
Če slika izbrane stopnje nima, se izbere najbližja.

### Palete

Pet palet po 12 barv: **Osnovne**, **Pastelne**, **Zemeljske**, **Neon** in **Narava**.
Ista slika je v pastelnih barvah povsem drugačna kot v neonskih.

## Slike po temah

- 🐣 **Za najmlajše** – riba, metulj, roža, mačka, ladjica, raketa
- 🦄 **Pravljično** – zmaj, samorog, vila, škrat, grad
- 🦸 **Junaki in roboti** – superjunak, robot
- 🏔️ **Pokrajine** – gore in jezero, svetilnik, mesto ponoči
- 🌀 **Vzorci** – mandala, vitraž, mozaik (skrita slika, ki se pokaže ob barvanju po številkah)

Skupaj **19 slik v 82 različicah**.

## Ko je slika končana

Ob zadnjem pobarvanem polju sledi čestitka in slika se lahko shrani med **🖼️ Moje slike**
(do 24 slik). Shranjeno sliko lahko kasneje odpreš in barvaš naprej.

Z gumbom **💾** se slika pripravi kot **PNG**: na računalniku jo preneseš z gumbom,
na iPadu pa pridržiš prst na sliki in izbereš »Shrani sliko«.

Gumb **👁️** za dve sekundi pokaže, kako je sliko obarval risar – kot namig, ne kot rešitev.

## Kako je narejeno

Slike niso datoteke s sličicami, ampak so **sestavljene v kodi** iz krogov, mnogokotnikov
in gladkih krivulj. Prav zato ima ista slika lahko 8 ali 80 polj – stopnja določi, koliko
podrobnosti se nariše. Vsako polje nosi tudi barvo, kot si jo je zamislil risar; iz teh barv
nastanejo številke za barvanje po številkah in namig pod gumbom 👁️.

Obrobe so zapisane v sami sliki (atributa `fill` in `stroke`), ne v slogih strani, zato so
vidne tudi v sličicah in v izvoženem PNG.

Napredek se shranjuje **samo v brskalniku** (`localStorage`): trenutna slika se ob vrnitvi
nadaljuje tam, kjer si ostal.

## Preverjeno

V motorju **WebKit** (Safari) je preverjeno: vseh pet načinov barvanja (tapni, čopič,
po številkah z zavrnitvijo napačne barve, preliv z izrisom prelivov, simetrija),
razveljavitev (tudi cele poteze s čopičem v enem koraku), radirka, shranjevanje v galerijo,
izvoz v PNG in nadaljevanje po osvežitvi strani. Preverjeno je tudi, da število polj z vsako
stopnjo res raste in da nobena slika nima polj z ničelno površino.
