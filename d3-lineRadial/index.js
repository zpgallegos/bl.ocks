// https://github.com/d3/d3-shape#lines

const WIDTH = 300;
const HEIGHT = 300;

const svg1 = d3
  .select("body")
  .append("svg")
  .attr("height", HEIGHT)
  .attr("width", WIDTH);

const container1 = svg1
  .append("g")
  .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

const spiral = Array.from({ length: 200 }, (_, i) => ({
  angle: (Math.PI / 5) * i,
  radius: i
}));

const lineRadial = d3
  .lineRadial()
  .radius(d => d.radius)
  .angle(d => d.angle);

container1
  .selectAll(".spiral")
  .data([null])
  .join("path")
  .attr("class", "spiral")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("d", lineRadial(spiral));

container1
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 3);

const svg2 = d3
  .select("body")
  .append("svg")
  .attr("height", HEIGHT)
  .attr("width", WIDTH);

const container2 = svg2
  .append("g")
  .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

const side = 100;

const points1 = [
  { angle: (3 / 2) * Math.PI, radius: side },
  { angle: 0, radius: side },
  { angle: (1 / 2) * Math.PI, radius: side },
  { angle: Math.PI, radius: side },
  { angle: (3 / 2) * Math.PI, radius: side }
];

const points2 = [
  { angle: (3 / 2) * Math.PI, radius: side * 0.5 },
  { angle: 0, radius: side * 0.5 },
  { angle: (1 / 2) * Math.PI, radius: side * 0.5 },
  { angle: Math.PI, radius: side * 0.5 },
  { angle: (3 / 2) * Math.PI, radius: side * 0.5 }
];

container2
  .append("path")
  .attr("d", lineRadial(points1))
  .attr("stroke", "black")
  .attr("fill", "none");

container2
  .append("path")
  .attr("d", lineRadial(points2))
  .attr("stroke", "black")
  .attr("fill", "none");

const svg3 = d3
  .select("body")
  .append("svg")
  .attr("height", HEIGHT)
  .attr("width", WIDTH);

const container3 = svg3
  .append("g")
  .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

const N = 300;
const inc = (2 * Math.PI) / N;
const rand = d3.range(0, N + 1).map(i => {
  return {
    angle: i * inc,
    radius: 120 + (Math.random() < 0.5 ? -1 : 1) * Math.random() * 10
  };
});

container3
  .append("path")
  .attr("d", lineRadial(rand))
  .attr("stroke", "black")
  .attr("fill", "none");
