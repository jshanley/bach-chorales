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
