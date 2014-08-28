function circleChart(notes, layout) {

  var total_duration = d3.sum(notes, function(d) {return d.duration;});

  var data = layouts[layout].map(function(d,i) {
    var currentNote = notes.filter(function(a) {return a.pitchClass === d;});
    var names = d3.set(currentNote.map(function(d) {return d.name;})).values();
    var name = names.length > 1 ? names.join('/') : names[0] ? names[0] : common_note_names[d];
    return {
      pitchClass: d,
      duration: d3.sum(currentNote, function(d) { return d.duration; }),
      notes: currentNote,
      name: name
    };
  })

  var maxRatio = d3.max(data, function(d) { return d.duration / total_duration; });
  var factor = (radius.max - radius.mid) / maxRatio;

  var arc = d3.svg.arc()
    .innerRadius(function(d) { return radius.min; })
    .outerRadius(function(d) {
      return radius.min + ((d.data.duration / total_duration) * (2*factor))
    });

  var subArc = d3.svg.arc()
    .innerRadius(function(d) {
      return radius.min + ((d.elapsed / total_duration) * (2*factor))
    })
    .outerRadius(function(d) {
      return radius.min + (((d.elapsed + d.duration) / total_duration)) * (2*factor)
    });

  var slices = circleChartSVG.selectAll('.slice')
    .data(pie(data), function(d) {return d.data.pitchClass});

  var sliceEnter = slices.enter()
    .append('g')
      .attr('class', 'slice');
  sliceEnter.append('g').attr('class', 'subslice-layer');
  sliceEnter.append('g').attr('class', 'label-layer')

/*
  var arcEnter = sliceEnter.append('path');
  var arcUpdate = slices.select('path')
    .transition().duration(1000)
    .attr('d', arc);
*/

  var subSlices = slices.select('.subslice-layer').selectAll('.sub-slice')
    .data(function(d) {
      var nested = d3.nest()
        .key(function(d) {return d.part;})
        .entries(d.data.notes);
      var mapped = nested.reverse().map(function(a,index,array) {
        var previous = array.filter(function(d,i) {return i < index;});
        var elapsed = d3.sum(previous, function(d){return d3.sum(d.values, function(z){return z.duration})})
        return {
          data: a,
          elapsed: elapsed,
          duration: d3.sum(a.values, function(b) {return b.duration}),
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          value: d.value
        };
      });
      return mapped;
    }, function(d) {return d.data.key;});

  var subSliceEnter = subSlices.enter().append('path')
    .attr('class', 'sub-slice')
    .attr('fill', function(d) {return colorScale(d.data.key);})
    .attr('d', 'M0,0Z')
    .style('opacity', 0.1);
  var subSliceUpdate = subSlices.transition().duration(1000)
    .attr('d', subArc)
    .style('opacity', 1.0);
  var subSliceExit = subSlices.exit()
    .transition().duration(500)
    .style('opacity', 0.1)
    .remove()

  var labelEnter = sliceEnter.select('.label-layer')
    .append('g').attr('class', 'label');

  labelEnter.append('circle')
    .attr('cx', 0)
    .attr('cy', 0);

  labelEnter.append('text')
    .attr('alignment-baseline', 'central')
    .attr('text-anchor', 'middle')
    .text(function(d) { return d.data.name; });

  var labelUpdate = slices.select('.label')
    .transition().duration(1000)
    .attr('font-size', function(d) {
      var scale = ((d.data.duration / total_duration) * factor * 0.3);
      return scale;
    })
    .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })

  labelUpdate.select('circle').attr('r', function(d) {
    var scale = ((d.data.duration / total_duration) * factor * 0.25);
    return scale;
  })




}
