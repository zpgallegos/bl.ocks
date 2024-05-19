const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  const xValue = d => d.population;
  const yValue = d => d.country;
  const margin = { top: 50, right: 60, bottom: 100, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = 20;

  // map the data values to a range between 0 and the width of the svg container
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => xValue(d))])
    .range([0, innerWidth])
    .nice();

  // map data factors (categorical)
  const yScale = d3
    .scalePoint()
    .domain(data.map(d => yValue(d)))
    .range([0, innerHeight])
    .padding(0.5); // padding between the bars

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // axes

  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
  g.append('g').call(yAxis) // shorthand for: yAxis(g.append('g'));
    .selectAll('.domain') // removes the tick next to the bar name
    .remove();

  const xAxisTickFormatter = val => d3.format('.3s')(val).replace('G', 'B');
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(xAxisTickFormatter)
    .tickSize(-innerHeight + 10); // makes the lines from the axis extend to the top
  const xAxisG = g.append('g').call(xAxis).attr("transform", `translate(0, ${innerHeight})`);
  xAxisG.select('.domain').remove(); // removes the domain line for the axis
  xAxisG.append('text')
    .attr('class', 'x-axis')
    .attr('y', 50)
    .attr('x', innerWidth / 2)
    .attr('fill', 'black')
    .text('Population');

  g.selectAll('.point-labels')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'point-labels')
    .attr('x', d => xScale(xValue(d)) - radius)
    .attr('y', d => yScale(yValue(d)) - radius - 10)
    .text(d => xAxisTickFormatter(d.population));

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xValue(d)))
    .attr("cy", d => yScale(yValue(d)))
    .attr("r", 20);
  
  g.append('text')
    .attr('y', -10)
    .text('Top 10 Most Populous Countries')
};

d3.csv("data.csv").then(data => {
  data.sort((a, b) => +a.population < +b.population ? 1 : -1);
  data.forEach(row => {
    row.population = +row.population * 1000;
  });
  render(data);
});
