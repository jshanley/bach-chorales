bwv.commonNoteNames = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

bwv.getMidiNoteNumber = function(step, octave, alter) {
  return bwv.commonNoteNames.indexOf(step) + ((octave + 1) * 12) + alter;
}

bwv.alterToAccidental = function(alter) {
  var a = 0,
      accidental = '';

  while (a + 1 < alter) {
    accidental += 'x'
    a += 2;
  }
  while (a < alter) {
    accidental += '#'
    a += 1;
  }
  while (a > alter) {
    accidental += 'b'
    a -= 1;
  }
  return accidental;
}

bwv.getNoteName = function(step, alter) {
  return step + bwv.alterToAccidental(alter);
}
