const WIDTH = 960;
const HEIGHT = 600;
const MARGINS = { top: 20, right: 40, bottom: 30, left: 20 };
const INNER_HEIGHT = HEIGHT - MARGINS.top - MARGINS.bottom;
const INNER_WIDTH = WIDTH - MARGINS.left - MARGINS.right;

const WINDOW_SIZE = 10;
let window_start_pos = 0;
const BARWIDTH = Math.floor(INNER_WIDTH / WINDOW_SIZE) - 1;

const container = d3.select("#container-1");

const svg = container
  .append("svg")
  .attr("class", "svg-content")
  .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT * 2}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`);

const data = d3.range(1, 12).concat(d3.range(0, 11).reverse());
let windowedData = data.map((d, i) =>
  i >= window_start_pos && i < window_start_pos + WINDOW_SIZE ? d : 0
);

const yScale = d3
  .scaleLinear()
  .domain([-d3.max(data), d3.max(data)])
  .range([INNER_HEIGHT * 2, 0]);

g.append("g")
  .attr("class", "y-axis")
  .attr("transform", `translate(${INNER_WIDTH}, 0)`)
  .call(d3.axisRight(yScale));

const xScale = d3
  .scaleLinear()
  .domain([window_start_pos, window_start_pos + WINDOW_SIZE - 1])
  .range([BARWIDTH / 2, INNER_WIDTH - BARWIDTH / 2]);

const wind = g.append("g").attr("class", "sliding-window");

const bars = wind
  .selectAll(".bar-place")
  .data(windowedData.map((d, i) => i))
  .join(enter =>
    enter
      .append("g")
      .attr("class", "bar-place")
      .attr("transform", d => `translate(${xScale(d)}, 0)`)
  );

bars
  .selectAll(".top-rect")
  .data(d => [windowedData[d]])
  .join("rect")
  .attr("class", "top-rect")
  .attr("x", -BARWIDTH / 2)
  .attr("y", d => yScale(d))
  .attr("width", BARWIDTH)
  .attr("height", d => INNER_HEIGHT - yScale(d));

bars
  .selectAll(".bottom-rect")
  .data(d => [-windowedData[d]])
  .join("rect")
  .attr("class", "bottom-rect")
  .attr("x", -BARWIDTH / 2)
  .attr("y", INNER_HEIGHT)
  .attr("width", BARWIDTH)
  .attr("height", d => INNER_HEIGHT - yScale(-d));

bars
  .selectAll(".points")
  .data(d => [d])
  .join("circle")
  .attr("cx", -BARWIDTH / 2)
  .attr("cy", d => yScale(windowedData[d]))
  .attr("r", 2);

bars
  .selectAll(".points")
  .data(d => [d])
  .join("circle")
  .attr("cx", BARWIDTH / 2)
  .attr("cy", d => yScale(windowedData[d]))
  .attr("r", 2);

window.focus();
d3.select(window).on("keydown", () => {
  switch (d3.event.keyCode) {
    case 37:
      window_start_pos = Math.max(0, window_start_pos - 1);
      break;
    case 39:
      window_start_pos = Math.min(
        d3.max(data.map((d, i) => i)) - WINDOW_SIZE,
        window_start_pos + 1
      );
      break;
  }
  update();
});

const update = () => {
  wind
    .transition()
    .duration(500)
    .attr("transform", `translate(${xScale(0) - xScale(window_start_pos)}, 0)`);

  windowedData = data.map((d, i) =>
    i >= window_start_pos && i < window_start_pos + WINDOW_SIZE ? d : 0
  );

  bars
    .selectAll(".top-rect")
    .data(d => [windowedData[d]])
    .transition()
    .duration(500)
    .attr("y", d => yScale(d))
    .attr("height", d => INNER_HEIGHT - yScale(d));

  bars
    .selectAll(".bottom-rect")
    .data(d => [-windowedData[d]])
    .transition()
    .duration(500)
    .attr("y", INNER_HEIGHT)
    .attr("height", d => INNER_HEIGHT - yScale(-d));
};
