export const scatter = (selection, props) => {
  const { data, xVar, yVar, margin, height, width, circleRadius } = props;

  const xValue = d => d[xVar];
  const yValue = d => d[yVar];

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // x scale
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  // y scale
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  // container for the plot
  const g = selection.selectAll(".container").data([null]);
  const gEnter = g
    .enter()
    .append("g")
    .attr("class", "container");
  gEnter.merge(g).attr("transform", `translate(${margin.left}, ${margin.top})`);

  // axes

  // y
  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
  const yAxisG = g.select(".y-axis");
  const yAxisGEnter = gEnter.append("g").attr("class", "y-axis");
  yAxisG.merge(yAxisGEnter).call(yAxis);

  const yAxisLabelText = yAxisGEnter
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .merge(yAxisG.select(".axis-label"))
    .attr("x", -innerHeight / 2)
    .text(yVar);

  // x
  const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight + 10);
  const xAxisG = g.select(".x-axis");
  const xAxisGEnter = gEnter.append("g").attr("class", "x-axis");
  xAxisG
    .merge(xAxisGEnter)
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`);

  const xAxisLabelText = xAxisGEnter
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 40)
    .merge(xAxisG.select(".axis-label"))
    .attr("x", innerWidth / 2)
    .text(xVar);

  // draw points

  const circles = g.merge(gEnter).selectAll('circle').data(data);

  circles
    .enter()
    .append('circle')
    .attr('cx', innerWidth / 2)
    .attr('cy', innerHeight / 2)
    .attr('r', 0)
    .merge(circles)
    .transition().duration(2000)
    .delay((d, i) => i * 1)
    .attr("cx", d => xScale(xValue(d)))
    .attr("cy", d => yScale(yValue(d)))
    .attr("r", circleRadius);
};
