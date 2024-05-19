const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const colorScale = d3
  .scaleOrdinal()
  .domain(["apple", "lemon"])
  .range(["red", "goldenrod"]);

const radiusScale = d3
  .scaleOrdinal()
  .domain(["apple", "lemon"])
  .range([50, 25]);

const calcPositionX = (d, i) => i * 120 + 60;

const render = (selection, props) => {

  const groups = selection.selectAll("g").data(fruits, d => d.id);
  const groupsEnter = groups.enter().append("g");

  groupsEnter
    .merge(groups)
    .transition()
    .duration(1000)
    .attr("transform", (d, i) => `translate(${i * 120 + 60}, ${height / 2})`);
  groups.exit().remove();

  const circles = groups.select("circle");
  groupsEnter
    .append("circle")
    .merge(circles)
    .attr("r", d => radiusScale(d.type))
    .attr("fill", d => colorScale(d.type))
    .attr("class", d => (d.id === selectedFruitId ? "is-selected" : ""))
    .on("mouseover", d => onClickCircle(d.id))
    .on("mouseout", () => onMouseOut());

  const text = groups.select("text");
  groupsEnter
    .append("text")
    .merge(text)
    .text(d => d.type)
    .attr("y", 70);
};

render(svg, {});
