d3.BWV.lineChart = function() {

  var width = 500,
      height = 500;

  var color = d3.scale.ordinal()
    .range(['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69']);

  var xScale = d3.scale.linear()
    .range([0,width]);

  function chart(selection) {
    selection.each(function(xml,i) {

      var el = this;

      var notesByPart = d3.nest()
        .key(function(d) { return d.part; })
        .entries(notes);

      // SET SCALE DOMAINS
      color.domain(notesByPart.map(function(d) { return d.key; }));
      xScale.domain(d3.extent(notes, function(d) { return d.measure; }));
      //yScale.domain(d3.extent(notes, function(d) { return d.midi; }));

      var elapsed = d3.elapsed()
        .sum(function(d) { return d.duration; });

      var parts = d3.select(el).selectAll('.part')
        .data(notesByPart, function(d) { return d.key; });
      var partEnter = parts.enter().append('g')
        .attr('class', 'part');
      var partExit = parts.exit().remove();

      var blocks = parts.selectAll('.block')
        .data(function(d) {
          var elap = elapsed.data(d);
          return d.values.map(function(current, idx) {
            var map = d3.map(current).set('elapsed', elap(idx));
            return map;
          })
        });
      var blockEnter = blocks.enter().append('rect')
        .attr('class', 'block');
      var blockUpdate = blocks.transition()
        .duration(1000)
        .attr('x', )
      var blockExit = blocks.exit().remove();

    })
  }

  function processData(xml) {

    var parts = d3.select(xml).selectAll('part')[0].map(function(d) {
      return {
        id: d3.select(d).attr('id'),
        xml: d
      }
    });
  }

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };
  chart.colors = function(_) {
    if (!arguments.length) return color.range();
    color.range(_);
    return chart;
  }

  return chart;

}
