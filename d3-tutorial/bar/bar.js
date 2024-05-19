const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  const xValue = d => d.population;
  const yValue = d => d.country;
  const margin = { top: 50, right: 60, bottom: 100, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // map the data values to a range between 0 and the width of the svg container
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => xValue(d))])
    .range([0, innerWidth]);

  
  // map data factors (categorical)
  const yScale = d3
    .scaleBand()
    .domain(data.map(d => yValue(d)))
    .range([0, innerHeight])
    .padding(0.1); // padding between the bars

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // axes

  const yAxis = d3.axisLeft(yScale);
  g.append('g').call(yAxis) // shorthand for: yAxis(g.append('g'));
    .selectAll('.domain, .tick line') // removes the tick next to the bar name
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

  g.selectAll('.bar-labels')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'bar-labels')
    .attr('x', d => xScale(xValue(d)) + 5)
    .attr('y', d => yScale(yValue(d)) + 45)
    .text(d => xAxisTickFormatter(d.population));

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", d => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("y", d => yScale(yValue(d)));
  
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
