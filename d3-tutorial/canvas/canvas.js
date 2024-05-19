const svg = d3.select("svg");

console.log(document.body.clientWidth);

const width = document.body.clientWidth
const height = document.body.clientHeight

svg
.attr('width', width)
.attr('height', height)
.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('rx', 40);