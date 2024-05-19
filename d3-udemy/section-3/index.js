const data = [
  { date: "01/01/2020", num: 25 },
  { date: "01/02/2020", num: 28 },
  { date: "01/03/2020", num: 31 },
  { date: "01/04/2020", num: 35 },
  { date: "01/05/2020", num: 38 },
  { date: "01/06/2020", num: 42 },
  { date: "01/07/2020", num: 50 },
  { date: "01/08/2020", num: 51 },
  { date: "01/09/2020", num: 62 },
  { date: "01/10/2020", num: 65 },
  { date: "01/11/2020", num: 69 },
  { date: "01/12/2020", num: 84 },
  { date: "01/13/2020", num: 90 },
  { date: "01/14/2020", num: 94 },
  { date: "01/15/2020", num: 101 },
];

const timeParse = d3.timeParse("%m/%d/%Y");

data.forEach((d, i) => (data[i].date = timeParse(d.date)));

const m = { t: 50, r: 50, b: 50, l: 50 };
const width = 960;
const height = 600;
const innerHeight = height - m.t - m.b;
const innerWidth = width - m.r - m.l;

const svg = d3
  .select("body")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

const g = svg.append("g").attr("transform", `translate(${m.l}, ${m.t})`);

const xScale = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => d.date))
  .range([0, innerWidth]);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.num)])
  .range([innerHeight, 0]);

const xAxis = (g) => {
  g.attr("transform", `translate(0, ${innerHeight})`).call(
    d3.axisBottom(xScale).ticks(6)
  );
};

g.append("g").call(xAxis);

const yAxis = (g) => {
  g.call(d3.axisLeft(yScale));
};

g.append("g").call(yAxis);

g.selectAll(".circle1")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "circle1")
  .attr("cx", (d) => xScale(d.date))
  .attr("cy", (d) => yScale(d.num))
  .attr("r", 2);

// g.selectAll("circle2")
//   .data(data)
//   .enter()
//   .append("circle")
//   .attr("class", "circle2")
//   .attr("cx", (d) => xScale(d.date) + 20)
//   .attr("cy", (d) => yScale(d.num))
//   .attr("r", 2);

g.selectAll(".labels")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "labels")
  .attr("x", (d) => xScale(d.date))
  .attr("y", (d) => yScale(d.num) - 2)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "ideographic")
  .text((d) => d.num);

g.selectAll(".lines")
  .data(data)
  .enter()
  .append("line")
  .attr("class", "lines")
  .attr("x1", (d) => xScale(d.date))
  .attr("y1", (d) => yScale(d.num))
  .attr("x2", (d) => xScale(d.date))
  .attr("y2", innerHeight)
  .attr("stroke", "black");
