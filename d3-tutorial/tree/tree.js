const svg = d3.select("svg");

const width = document.body.clientWidth;
const height = document.body.clientHeight;
const margin = { top: 0, right: 100, bottom: 0, left: 60 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const zoomG = svg
  .attr("width", width)
  .attr("height", height)
  .append("g");

zoomG.call(
  d3.zoom().on("zoom", () => {
    g.attr("transform", d3.event.transform);
  })
);

const g = zoomG
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

svg.call(
  d3.zoom().on("zoom", () => {
    g.attr("transform", d3.event.transform);
  })
);

d3.json("data.json").then(data => {
  const treeLayout = d3.tree().size([innerHeight, innerWidth]);
  const root = d3.hierarchy(data);
  const links = treeLayout(root).links();
  const linkPathGenerator = d3
    .linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);

  g.selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", linkPathGenerator);

  g.selectAll("text")
    .data(root.descendants())
    .enter()
    .append("text")
    .attr("x", d => d.y)
    .attr("y", d => d.x)
    .attr("dy", ".32em")
    .attr("text-anchor", d => (d.children ? "middle" : "start"))
    .attr("font-size", d => {
      if (d.depth === 0) return "2.5em";
      else if (d.depth === 3) return ".3em";
      else return "1em";
    })
    .text(d => d.data.data.id);
});
