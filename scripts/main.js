console.clear();



  var w = 750,
      h = 750;

  var margin = 50;

  var tau = 2 * Math.PI;

  var radius = {
    max: Math.min(w/2,h/2),
    min: Math.min(w/2,h/2)/10
  };
  radius.mid = (radius.max + radius.min) / 2

  var circleChartSVG = d3.select('#viz').append('svg')
    .attr('width', w + margin*2)
    .attr('height', h + margin*2)
    .append('g')
      .attr('transform', 'translate(' +
      (margin + (w/2)) + ',' +
      (margin + (h/2))+ ')');

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return 1; })
    .startAngle((-1/24) * tau)
    .endAngle(tau - ((1/24) * tau));

  var common_note_names = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

  var layouts = {
    'fifths': [0,7,2,9,4,11,6,1,8,3,10,5],
    'semitones': [0,1,2,3,4,5,6,7,8,9,10,11]
  };

  var colorScale = d3.scale.ordinal()
    .range(['rgb(141,211,199)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)']);

  d3.xml('xml/000106B_.xml', function(error, xml) {
    if (error) {
      throw error;
    } else {
      parseData(xml);
    }
  });

  function parseData(xml) {

    var parts = d3.select(xml).select('part-list')
      .selectAll('score-part')[0]
      .map(function(d) {
        var id = d3.select(d).attr('id');
        var partName = d3.select(d).select('part-name').text();
        return {
          id: id,
          name: partName
        }
      });

    colorScale.domain(parts.map(function(d) { return d.id; }));

    /*=====================================================
      Part options
    =====================================================*/

    var part_select = d3.select('#controls').append('div')
      .attr('class', 'part-select');

    part_select.selectAll('.part')
      .data(parts)
      .enter().append('div')
        .attr('class', 'part active')
        .style('background-color', function(d) {return colorScale(d.id)})
        .text(function(d) {return d.name;})
        .on('click', function(d) {
          d3.select(this).classed('active', !d3.select(this).classed('active'))
          // activate all if all inactive
          if (d3.selectAll('.part.active').empty()) {
            d3.selectAll('.part').classed('active', true);
          }
          handleOptionChange();
        })
        .on('dblclick', function(d) {
          d3.selectAll('.part').classed('active', false);
          d3.select(this).classed('active', true);
          handleOptionChange();
        })

    /*=====================================================
      Layout options
    =====================================================*/

    var layoutSelect = d3.select('#controls').append('div')
      .attr('class', 'layout-select')
      .selectAll('.layout-option')
      .data(d3.keys(layouts))
      .enter().append('div')
        .attr('class', function(d) {
          var cls = 'layout-option';
          // SET FIFTHS ACTIVE
          if (d === 'fifths') cls += ' active';
          return cls;
        })
        .text(function(d) { return d; })
        .on('click', function() {
          d3.selectAll('.layout-option').classed('active', false);
          d3.select(this).classed('active', true);
          handleOptionChange();
        })

    var notes = d3.select(xml)
      .selectAll('note')[0].filter(function(d) {
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

        var midi = getMidiNoteNumber(step, +octave, +alter);

        return {
          part: part,
          measure: +measure,
          duration: +duration,
          name: getNoteName(step, +alter),
          midi: midi,
          pitchClass: midi % 12
        };
      });

    var svg2 = d3.select('body').append('svg').datum(notes).call(jsb_line_chart())

    function handleOptionChange() {

      var selectedLayout = d3.select('.layout-option.active').text();

      var selectedParts = d3.select('.part-select')
        .selectAll('.part.active');

      var activeIDs = selectedParts.data().map(function(d) {
        return d.id;
      });

      console.log(activeIDs)

      var filtered = notes.filter(function(d) {
        return activeIDs.indexOf(d.part) > -1;
      })
      circleChart(filtered, selectedLayout);
    }

    // init
    handleOptionChange();

  }
