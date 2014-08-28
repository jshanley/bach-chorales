function getMidiNoteNumber(step, octave, alter) {
  return common_note_names.indexOf(step) + ((octave + 1) * 12) + alter;
}

function getNoteName(step, alter) {
  return step + alterToAccidental(alter);
}

function alterToAccidental(alter) {
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
