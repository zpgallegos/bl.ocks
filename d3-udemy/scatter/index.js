let data = [
  [400, 200],
  [210, 140],
  [722, 300],
  [70, 160],
  [250, 50],
  [110, 280],
  [699, 225],
  [90, 220],
];

const margin = { t: 50, r: 50, b: 50, l: 50 };
const width = 960;
const height = 600;
const innerHeight = height - margin.t - margin.b;
const innerWidth = width - margin.r - margin.l;

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.l}, ${margin.t})`);

const xScale = d3
  .scaleLinear()
  .domain(d3.extent(data, (d) => d[0]))
  .range([0, innerWidth]);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, d => d[1])])
  .range([innerHeight, 0]);


const xAxisG = g.append("g").attr("transform", `translate(0, ${innerHeight})`);
xAxisG.call(d3.axisBottom(xScale));

const yAxisG = g.append("g");
yAxisG.call(d3.axisLeft(yScale));

const circ = g.append("g");
const text = g.append("g");

circ
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(d[0]))
  .attr("cy", (d) => yScale(d[1]))
  .attr("r", 3)
  .attr("fill", "steelblue")
  .attr("stroke", "black");

text
  .selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "point-label")
  .attr("x", (d) => xScale(d[0]))
  .attr("y", (d) => yScale(d[1]))
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "ideographic")
  .text((d) => `(${d[0]}, ${d[1]})`);

const redraw = () => {
  circ
    .selectAll("circle")
    .data(data)
    .transition()
    .duration(1000)
    .on("start", function() {
      d3.select(this).attr("fill", "red");
    })
    .on("end", function() {
      d3.select(this).attr("fill", "green");
    })
    .attr("cx", (d) => xScale(d[0]))
    .attr("cy", (d) => yScale(d[1]));

  text
    .selectAll("text")
    .data(data)
    .transition()
    .duration(1000)
    .attr("x", (d) => xScale(d[0]))
    .attr("y", (d) => yScale(d[1]))
    .text((d) => `(${d[0]}, ${d[1]})`);
};

d3.select(".update").on("click", () => {
  data = [];
  for (let i = 0; i < 8; ++i) {
    data.push([Math.floor(Math.random() * 300), Math.floor(Math.random() * 500)]);
  }

  xScale.domain(d3.extent(data, (d) => d[0]));
  xAxisG.transition().duration(1000).call(d3.axisBottom(xScale));

  yScale.domain([0, d3.max(data, d => d[1])]);
  yAxisG.transition().duration(1000).call(d3.axisLeft(yScale));

  redraw();
});

d3.select(".add").on("click", () => {
  const newNum = Math.floor(Math.random() * d3.max(data));
  data.push(newNum);

  xScale.domain(d3.extent(data, (d) => d[0]));
  xAxisG.transition().duration(1000).call(d3.axisBottom(xScale));

  yScale.domain([0, d3.max(data, d => d[1])]);
  yAxisG.transition().duration(1000).call(d3.axisLeft(yScale));

  const circles = circ.selectAll("circle").data(data);

  



});
