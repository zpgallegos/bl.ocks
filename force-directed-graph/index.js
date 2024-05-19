// https://bl.ocks.org/mbostock/aba1a8d1a484f5c5f294eebd353842da#miserables.json

const width = 600;
const height = 600;

const URL =
  "https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json";

const drag = simulation => {
  function dragStarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function drag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragEnded(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragStarted)
    .on("drag", drag)
    .on("end", dragEnded);
};

const color = d => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return scale(d.group);
};

d3.json(URL).then(data => {
  console.log(data);
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  const scale = d3.scaleOrdinal(d3.schemeCategory10).domain(nodes, d => d.group);

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).strength(.1))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.select("svg");

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", d => scale(d.group))
    .call(drag(simulation));

  node.append("title").text(d => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x).attr("cy", d => d.y);
  });

  // invalidation.then(() => simulation.stop());
});
