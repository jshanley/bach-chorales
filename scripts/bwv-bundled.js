(function() {

var BWV = {};

BWV.commonNoteNames = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

BWV.getMidiNoteNumber = function(step, octave, alter) {
  return BWV.commonNoteNames.indexOf(step) + ((octave + 1) * 12) + alter;
}

BWV.alterToAccidental = function(alter) {
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

BWV.getNoteName = function(step, alter) {
  return step + BWV.alterToAccidental(alter);
}
BWV.musicxml = {};

BWV.musicxml.getPartList = function(xml) {
  return d3.select(xml).select('part-list')
    .selectAll('score-part')[0].map(function(d) {
      var part = d3.select(d);
      return {
        id: part.attr('id'),
        name: part.select('part-name').text()
      };
    });
}

BWV.musicxml.getAllNotes = function(xml) {

  var notes = d3.select(xml).selectAll('note')[0]
    .filter(function(d) {
      // FILTER OUT RESTS
      return d3.select(d).selectAll('rest').empty();
    })
    .map(function(d) {
      var part = d3.select(d.parentNode.parentNode).attr('id'),
          measure = d3.select(d.parentNode).attr('number'),
          duration = d3.select(d).select('duration').text(),
          pitch = d3.select(d).select('pitch'),
          step = pitch.select('step').text(),
          octave = pitch.select('octave').text();
      var alter = 0;
      if (!pitch.select('alter').empty()) {
        alter = pitch.select('alter').text();
      }

      var midi = BWV.getMidiNoteNumber(step, +octave, +alter);

      return {
        part: part,
        measure: +measure,
        duration: +duration,
        name: BWV.getNoteName(step, +alter),
        midi: midi,
        pitchClass: midi % 12
      };
    });

  return notes;

}

BWV.musicxml.getNoteArray = function(xml) {
  var parts = d3.select(xml).selectAll('part')[0];
  var byPart = parts.map(function(part) {
    var measures = d3.select(part).selectAll('measure')[0];
    var byMeasure = measures.map(function(measure) {
      var hasAttributes = !d3.select(measure).selectAll('attributes').empty();
      console.log("Measure", d3.select(measure).attr('number'), hasAttributes)
    })
  })
}

// thanks mbostock https://github.com/mbostock/d3/blob/master/src/end.js
if (typeof define === "function" && define.amd) define(BWV);
else if (typeof module === "object" && module.exports) module.exports = BWV;
this.BWV = BWV;

})();
