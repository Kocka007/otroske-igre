#!/bin/bash
# Požene vse preizkuse. Pogon nastavi s PW_POGON (privzeto webkit, sicer chromium).
cd "$(dirname "$0")"
export PW_POGON="${PW_POGON:-webkit}"
slabo=0
for t in test-zbirka.js test-logika.js test-igranje.js test-tap.js test-kviz.js test-kviz2.js; do
  echo; echo "############ $t ($PW_POGON) ############"
  node "$t" || slabo=$((slabo+1))
done
echo; echo "########################################"
[ "$slabo" -eq 0 ] && echo "VSI PREIZKUSI SO USPELI ✅" || echo "$slabo preizkusnih datotek je javilo napake ❌"
exit "$slabo"
