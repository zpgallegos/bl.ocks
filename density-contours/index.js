// https://observablehq.com/@d3/density-contours

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

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`);

Promise.all([d3.json("data.json")]).then(data => {
  console.log(data);

});
