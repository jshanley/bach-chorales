(function() {

var bwv = {};

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
bwv.musicxml = {};

d3.selection.prototype.getChildText = function(tag, defaultValue) {
  var sel = this.select(tag);
  return sel.empty() ? defaultValue : sel.text();
}

bwv.musicxml.getPartList = function(xml) {
  var scorePartNodes = d3.select(xml)
    .select('part-list')
    .selectAll('score-part')[0];

  var scoreParts = scorePartNodes.map(function(part) {
      var _part = d3.select(part);
      return {
        id: _part.attr('id'),
        name: _part.getChildText('part-name')
      };
    });
  return scoreParts;
}

// THIS IS WHERE THE MAGIC HAPPENS, MAN IT'S UGLY
bwv.musicxml.getNoteArray = function(xml) {

  var partNodes = d3.select(xml).selectAll('part')[0];
  var parts = partNodes.map(function(part) {
    var _part = d3.select(part);

    // reset these values for each part
    var divisions,
        beats,
        beat_type,
        fifths,
        mode;

    var measureNodes = _part.selectAll('measure')[0];
    var measures = measureNodes.map(function(measure) {
      var _measure = d3.select(measure);
      var hasAttributes = !_measure.selectAll('attributes').empty();
      if (hasAttributes) {
        var attributes = _measure.select('attributes');
        divisions = +attributes.getChildText('divisions', divisions);
        beats     = +attributes.getChildText('beats', beats);
        beat_type = +attributes.getChildText('beat-type', beat_type);
        fifths    = +attributes.getChildText('fifths', fifths);
        mode      = attributes.getChildText('mode', mode);
      }
      // reset elapsed time for each measure
      var elapsed = 0;

      var noteNodes = _measure.selectAll('note')[0];
      var notes = noteNodes.map(function(note) {
        var _note = d3.select(note);
        var isRest = !_note.selectAll('rest').empty();
        var duration = +_note.getChildText('duration', '0') / divisions;
        elapsed += duration;
        var step = _note.getChildText('step', 'R'),
            octave = +_note.getChildText('octave', 0),
            alter = +_note.getChildText('alter', 0);

        return {
          type: isRest ? 'rest' : 'note',
          start: elapsed - duration,
          duration: duration,
          step: step,
          octave: octave,
          alter: alter,
          name: bwv.getNoteName(step, alter)
        };
      }); // END notes

      return {
        number: _measure.attr('number'),
        divisions: divisions,
        beats: beats,
        beat_type: beat_type,
        fifths: fifths,
        mode: mode,
        notes: notes
      };
    }); // END measures

    return {
      id: _part.attr('id'),
      measures: measures
    };
  }); // END parts

  return parts;

}

// thanks mbostock https://github.com/mbostock/d3/blob/master/src/end.js
if (typeof define === "function" && define.amd) define(bwv);
else if (typeof module === "object" && module.exports) module.exports = bwv;
this.bwv = bwv;

})();
