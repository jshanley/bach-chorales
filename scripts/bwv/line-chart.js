d3.bwv.lineChart = function() {

  var width = 500,
      height = 500;

  var color = d3.scale.ordinal()
    .range(['#8dd3c7','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69']);

  var xScale = d3.scale.linear()
    .range([0,width]);

  function chart(selection) {
    selection.each(function(notes) {

      var el = this;



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
