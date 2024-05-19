const data = [6, 20, 21, 14, 2, 30, 7, 16, 25, 5, 11, 28, 10, 26, 9];

data.forEach((d, i) => {
  data[i] = { id: i, num: d };
});

const width = 960;
const height = 600;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.right - margin.left;

let isSorted = false;

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale = d3
  .scaleBand()
  .domain(data.map((_, i) => i))
  .range([0, innerWidth])
  .padding(0.1);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.num)])
  .range([innerHeight, 0]);

const xAxisG = g.append("g").attr("transform", `translate(0, ${innerHeight})`);
const yAxisG = g.append("g");

const xAxis = (g, scale) =>
  g.transition().duration(1000).call(d3.axisBottom(scale));
xAxis(xAxisG, xScale);

const yAxis = (g, scale) =>
  g.transition().duration(1000).call(d3.axisLeft(scale));
yAxis(yAxisG, yScale);

const rect = g.append("g");
const text = g.append("g");

rect
  .selectAll("rect")
  .data(data, (d) => d.id)
  .enter()
  .append("rect")
  .attr("x", (_, i) => xScale(i))
  .attr("y", (d) => yScale(d.num))
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => innerHeight - yScale(d.num))
  .attr("fill", "steelblue")
  .attr("stroke", "black")
  .on("mouseover", function () {
    d3.select(this).attr("fill", "darkred");
  })
  .on("mouseout", function () {
    d3.select(this).transition("mo").duration(100).attr("fill", "steelblue");
  })
  .on("click", function () {
    if(!isSorted) {
      rect
        .selectAll("rect")
        .sort((a, b) => d3.ascending(a.num, b.num))
        .transition("sort")
        .duration(1000)
        .attr("x", (_, i) => xScale(i));

      text
        .selectAll("text")
        .sort((a, b) => d3.ascending(a.num, b.num))
        .transition("sort_labels")
        .duration(1000)
        .attr("x", (_, i) => xScale(i) + xScale.bandwidth() / 2)
    } else {
      rect
        .selectAll("rect")
        .data(data, d => d.id)
        .transition("sort")
        .duration(1000)
        .attr("x", (_, i) => xScale(i));

      text
        .selectAll("text")
        .data(data, d => d.id)
        .transition("sort_labels")
        .duration(1000)
        .attr("x", (_, i) => xScale(i) + xScale.bandwidth() / 2)
    }
    isSorted = !isSorted;
  });

text
  .selectAll("text")
  .data(data, (d) => d.id)
  .enter()
  .append("text")
  .attr("x", (_, i) => xScale(i) + xScale.bandwidth() / 2)
  .attr("y", (d) => yScale(d.num) + 5)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "hanging")
  .text((d) => d.num)
  .style("pointer-events", "none");

const redraw = () => {
  rect
    .selectAll("rect")
    .data(data, (d) => d.id)
    .transition()
    .duration(1000)
    .attr("y", (d) => yScale(d.num))
    .attr("height", (d) => innerHeight - yScale(d.num));

  text
    .selectAll("text")
    .data(data, (d) => d.id)
    .transition()
    .duration(1000)
    .attr("y", (d) => yScale(d.num) + 5)
    .text((d) => d.num);
};

d3.select("#update").on("click", () => {
  data[0].num = 50;
  yScale.domain([0, d3.max(data, (d) => d.num)]);
  yAxis(yAxisG, yScale);

  redraw();
});

d3.select("#add").on("click", () => {
  const newId = d3.max(data, (d) => d.id) + 1;
  const newNum = Math.floor(Math.random() * d3.max(data, (d) => d.num));
  data.push({ id: newId, num: newNum });

  xScale.domain(data.map((_, i) => i));
  xAxis(xAxisG, xScale);

  yScale.domain([0, d3.max(data, (d) => d.num)]);
  yAxis(yAxisG, yScale);

  const bars = rect.selectAll("rect").data(data, (d) => d.id);

  bars
    .enter()
    .append("rect")
    .attr("height", (d) => innerHeight - yScale(d.num))
    .attr("fill", "steelblue")
    .attr("stroke", "black")
    .attr("x", innerWidth + 100)
    .attr("y", 0)
    .merge(bars)
    .transition()
    .duration(1000)
    .attr("x", (_, i) => xScale(i))
    .attr("y", (d) => yScale(d.num))
    .attr("width", xScale.bandwidth());

  labs = text.selectAll("text").data(data, (d) => d.id);

  labs
    .enter()
    .append("text")
    .text((d) => d.num)
    .attr("x", innerWidth + 100)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "hanging")
    .merge(labs)
    .transition()
    .duration(1000)
    .attr("x", (_, i) => xScale(i) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.num) + 5);
});

d3.select("#remove").on("click", () => {
  data.shift();

  xScale.domain(data.map((_, i) => i));
  xAxis(xAxisG, xScale);

  yScale.domain([0, d3.max(data, (d) => d.num)]);
  yAxis(yAxisG, yScale);

  const bars = rect.selectAll("rect").data(data, (d) => d.id);

  bars
    .transition()
    .duration(1000)
    .attr("x", (_, i) => xScale(i))
    .attr("y", (d) => yScale(d.num))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => innerHeight - yScale(d.num));

  bars.exit().remove();

  labs = text.selectAll("text").data(data, (d) => d.id);

  labs
    .transition()
    .duration(1000)
    .attr("x", (_, i) => xScale(i) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.num) + 5)
    .text((d) => d.num);

  labs.exit().remove();
});
