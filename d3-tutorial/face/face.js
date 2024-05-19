const svg = d3.select('svg');

const svgWidth = 960;
const svgHeight = 960;
const eyeSpacing = 120;

svg
  .style('background-color', 'red')
  .attr('width', svgWidth)
  .attr('height', svgWidth);

const circle = svg.append('circle')
  .attr('cx', svgWidth / 2)
  .attr('cy', svgHeight / 2)
  .attr('r', '300')
  .attr('fill', 'yellow')
  .attr('stroke', 'black');

const leftEye = svg.append('circle')
  .attr('cx', svgWidth / 2 - eyeSpacing)
  .attr('cy', svgHeight / 2 - eyeSpacing)
  .attr('r', '30')

const rightEye = svg.append('circle')
  .attr('cx', svgWidth / 2 + eyeSpacing)
  .attr('cy', svgHeight / 2 - eyeSpacing)
  .attr('r', '30')

const g = svg.append('g')
  .attr('transform', 'translate(' + svgWidth / 2 + ',' + (svgHeight / 2 + 60) +  ')');

const mouth = g.append('path')
  .attr('d', d3.arc()({
    innerRadius: 150,
    outerRadius: 180,
    startAngle: 3 * Math.PI / 2,
    endAngle: Math.PI / 2
  }));
