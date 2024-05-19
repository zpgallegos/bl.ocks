const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  // setup
  const xValue = d => d.year;
  const yValue = d => d.population;
  const xAxisLabel = 'Year';
  const yAxisLabel = 'Population';
  const margin = { top: 50, right: 60, bottom: 100, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // plot container
  const g = svg
    .append("g")  
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // x scale
  const xScale = d3.scaleTime()
    // .domain(d3.extent(data, xValue))
    .domain([new Date('1950.001'), new Date('2015')])
    .range([0, innerWidth])
    .nice();

  // y scale
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, yValue)])
    .range([innerHeight, 0])
    .nice();

  // y-axis
  const yAxisTickFormatter = val => d3.format('.1s')(val).replace('G', 'B');
  const yAxis = d3.axisLeft(yScale).tickFormat(yAxisTickFormatter);
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
  const areaGenerator = d3.area()
    .x(d => xScale(xValue(d)))
    .y0(innerHeight)
    .y1(d => yScale(yValue(d)));

  g.append('path')
    .attr('class', 'area-path')
    .attr('d', areaGenerator(data));
  
  // plot title
  g.append('text')
    .attr('y', -10)
    .text(`World Population by Year`)
};

d3.csv("world-population-by-year-2015.csv").then(data => {
  data.forEach(row => {
    row.year = new Date(row.year);
    row.population = +row.population;
  });
  render(data);
});
