// https://github.com/d3/d3-shape#lines

const WIDTH = 960;
const HEIGHT = 600;
const MARGINS = { top: 50, right: 50, bottom: 50, left: 50 };
const INNER_WIDTH = WIDTH - MARGINS.left - MARGINS.right;
const INNER_HEIGHT = HEIGHT - MARGINS.top - MARGINS.bottom;

const svg = d3
  .select("#container-1")
  .append("svg")
  .attr("class", "svg-content")
  .attr("viewBox", [0, 0, WIDTH, HEIGHT])
  .attr("preserveAspectRatio", "xMidYMid meet");

const container = svg
  .append("g")
  .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`);

const yAxisG = container.append("g");
const xAxisG = container
  .append("g")
  .attr("transform", `translate(0,${INNER_HEIGHT})`);
const lineG = container.append("g");
const subG = container.append("g");
const pointsG = container.append("g");

const index = d3.range(0, 100).filter(x => x % 5 === 0);

const t = pointsG.transition().duration(2000);

setInterval(() => {
  const data = index.map(d => {
    return {
      x: d,
      y: 0.25 * d + (Math.random() < 0.5 ? 1 : -1) * 5 * Math.random()
    };
  });
  const sub = data.filter(
    (d, i) => i === 0 || i === 3 || i === d3.max(data.map((e, i) => i))
  );

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([0, INNER_WIDTH]);

  xAxisG.call(d3.axisBottom(xScale));

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.y))
    .range([INNER_HEIGHT, 0]);

  yAxisG.call(d3.axisLeft(yScale));

  const line = d3
    .line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveCatmullRom.alpha(0.5));

  lineG
    .selectAll(".line")
    .data([null])
    .join(
      enter =>
        enter
          .append("path")
          .attr("class", "line")
          .attr("stroke", "red")
          .attr("fill", "none")
          .attr("d", line(data)),
      update =>
        update.call(update =>
          update
            .transition(lineG.transition().duration(2000))
            .attr("d", line(data))
        ),
      exit => exit.remove()
    );

  subG
    .selectAll(".toend")
    .data([null])
    .join(
      enter =>
        enter
          .append("path")
          .attr("class", "toend")
          .attr("stroke", "green")
          .attr("fill", "none")
          .attr("d", line(sub)),
      update =>
        update.call(update =>
          update
            .transition(subG.transition().duration(2000))
            .attr("d", line(sub))
        ),
      exit => exit.remove()
    );

  pointsG
    .selectAll("circle")
    .data(data, d => d.x)
    .join(
      enter =>
        enter
          .append("circle")
          .attr("cx", d => xScale(d.x))
          .attr("cy", d => yScale(d.y))
          .attr("r", 3),
      update =>
        update.call(update =>
          update
            .transition(pointsG.transition().duration(2000))
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 3)
        ),
      exit => exit.remove()
    );
}, 2500);
