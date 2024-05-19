const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  const xVar = 'horsepower';
  const yVar = 'mpg';
  const xValue = d => d[xVar];
  const yValue = d => d[yVar];

  const margin = { top: 50, right: 60, bottom: 100, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = 5;

  // container for the plot
  const g = svg
    .append("g")  
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // x scale
  // map the data values to a range between 0 and the width of the svg container
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  // y scale
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([0, innerHeight])
    .nice();

  // axes
  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
  const yAxisG = g.append('g').call(yAxis) // shorthand for: yAxis(g.append('g'));
    // .selectAll('.domain') // removes the tick next to the bar name
    // .remove();
  yAxisG.append('text')
    .attr('class', 'y-axis-label')
    .attr('y', -40)
    .attr('x', -innerHeight / 2)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text(yVar);

  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight + 10); // makes the lines from the axis extend to the top
  const xAxisG = g.append('g').call(xAxis).attr("transform", `translate(0, ${innerHeight})`);
  xAxisG.select('.domain').remove(); // removes the domain line for the axis
  xAxisG.append('text')
    .attr('class', 'x-axis-label')
    .attr('y', 50)
    .attr('x', innerWidth / 2)
    .text(xVar);

  // draw points
  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(xValue(d)))
    .attr("cy", d => yScale(yValue(d)))
    .attr("r", radius);
  
  // plot title
  g.append('text')
    .attr('y', -10)
    .text(`${yVar} vs. ${xVar}`)
};

d3.csv("https://vizhub.com/curran/datasets/auto-mpg.csv").then(data => {
  data.forEach(row => {
    row.mpg = +row.mpg;
    row.cylinders = +row.cylinders;
    row.weight = +row.weight;
    row.displacement = +row.displacement;
    row.horsepower = +row.horsepower;
    row.acceleration = +row.acceleration;
    row.year = +row.year;
  });
  render(data);
});
