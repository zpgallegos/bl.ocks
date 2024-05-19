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
  const { fruits } = props;
  const bowl = selection
    .selectAll("rect")
    .data([null])
    .enter()
    .append("rect")
    .attr("y", 380)
    .attr("width", 620)
    .attr("height", 200)
    .attr("rx", 150 / 2);

  const groups = selection.selectAll("g").data(fruits, d => d.id);
  const groupsEnter = groups.enter().append("g");

  groupsEnter
    .merge(groups)
    .transition()
    .duration(1000)
    .attr("transform", (d, i) => `translate(${i * 120 + 60}, ${height / 2})`);

  const circles = groups.select("circle");
  groupsEnter
    .append("circle")
    .merge(circles)
    // .transition().duration(1000)
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

  const exitTransition = groups
    .exit()
    .transition()
    .duration(1000);
  exitTransition
    .select("circle")
    .attr("r", 0)
    .remove();
  groups
    .exit()
    .select("text")
    .remove();
};

const makeFruit = type => ({ id: Math.random(), type });
let fruits = d3.range(5).map(() => makeFruit("apple"));

let selectedFruitId = null;
const onClickCircle = id => {
  selectedFruitId = id;
  render(svg, { fruits });
};

const onMouseOut = () => {
  selectedFruitId = null;
  render(svg, { fruits });
}

render(svg, { fruits });

setTimeout(() => {
  fruits.pop();
  render(svg, { fruits });
  setTimeout(() => {
    fruits[2].type = "lemon";
    render(svg, { fruits });
    setTimeout(() => {
      fruits = fruits.filter((d, i) => i !== 1);
      render(svg, { fruits });
    }, 2000);
  }, 2000);
}, 2000);
