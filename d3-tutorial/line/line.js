const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  // setup
  const xValue = d => d.timestamp;
  const yValue = d => d.temperature;
  const xAxisLabel = 'Time';
  const yAxisLabel = 'Temperature';
  const margin = { top: 50, right: 60, bottom: 100, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = 5;

  // plot container
  const g = svg
    .append("g")  
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // x scale
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  // y scale
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  // y-axis
  const yAxis = d3.axisLeft(yScale);
  const yAxisG = g.append('g').call(yAxis) // shorthand for: yAxis(g.append('g'));
  
  // y-axis label
  yAxisG.append('text')
    .attr('class', 'y-axis-label')
    .attr('y', -40)
    .attr('x', -innerHeight / 2)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);

  const xAxis = d3.axisBottom(xScale)
  const xAxisG = g.append('g').call(xAxis).attr("transform", `translate(0, ${innerHeight})`);
  xAxisG.append('text')
    .attr('class', 'x-axis-label')
    .attr('y', 50)
    .attr('x', innerWidth / 2)
    .text(xAxisLabel);

  // draw line
  const lineGenerator = d3.line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)));

  g.append('path')
    .attr('class', 'line-path')
    .attr('d', lineGenerator(data))
    .attr('stroke', 'black');

  // draw points
  g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(xValue(d)))
    .attr('cy', d => yScale(yValue(d)))
    .attr('r', 3);
  
  // plot title
  g.append('text')
    .attr('y', -10)
    .text(`Temperature in San Francisco`)
};

d3.csv("temperature-in-san-francisco.csv").then(data => {
  data.forEach(row => {
    row.temperature = +row.temperature;
    row.timestamp = new Date(row.timestamp);
  });
  render(data);
});
