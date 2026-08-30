/* Iz matematika.html izlušči čisti del kode z generatorji – brez ovoja IIFE in
   brez dela, ki dela po DOM-u. Igre ne spreminjamo; le beremo njeno kodo. */
const fs = require('fs');
const path = require('path');

const ZACETEK = '(function(){';
const KONEC = 'pluspic:genPlusPic};';

function kodaGeneratorjev(repo){
  const vs = fs.readFileSync(path.join(repo, 'matematika.html'), 'utf8');
  const s = vs.indexOf('<script>');
  if (s < 0) throw new Error('v matematika.html ni skripte');
  const z = vs.indexOf(ZACETEK, s);
  if (z < 0) throw new Error('ovoja IIFE ni bilo mogoče najti');
  const k = vs.indexOf(KONEC, z);
  if (k < 0) throw new Error('konca seznama GEN ni bilo mogoče najti');
  return vs.slice(z + ZACETEK.length, k + KONEC.length);
}

module.exports = { kodaGeneratorjev };
