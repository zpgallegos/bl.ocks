// https://bl.ocks.org/mbostock/aba1a8d1a484f5c5f294eebd353842da#miserables.json

const canvas = document.querySelector("canvas"),
  context = canvas.getContext("2d"),
  width = canvas.width,
  height = canvas.height;

const simulation = d3
  .forceSimulation()
  .force(
    "link",
    d3
      .forceLink()
      .id(d => d.id)
      .strength(0.5)
  )
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

d3.select("input[type=range]").on("input", inputted);

function inputted() {
  simulation.force("link").strength(+this.value);
  simulation.alpha(1).restart();
}

function drawLink(d) {
  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
  context.moveTo(d.x + 3, d.y);
  context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}

d3.json("data.json", (error, data) => {
  if (error) throw error;
  console.log(data);

  simulation.nodes(data.nodes).on("tick", ticked);
  simulation.force("link").links(data.links);

  function ticked() {
    context.clearRect(0, 0, width, height);
    context.beginPath();
    data.links.forEach(drawLink);
    context.strokeStyle = "#aaa";
    context.stroke();

    context.beginPath();
    data.nodes.forEach(drawNode);
    context.fill();
    context.strokeStyle = "#fff";
    context.stroke();

  }


});
