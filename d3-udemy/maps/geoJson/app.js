const width = 800;
const height = 600;

const colors = [
  "rgb(255,245,240)",
  "rgb(254,224,210)",
  "rgb(252,187,161)",
  "rgb(252,146,114)",
  "rgb(251,106,74)",
  "rgb(239,59,44)",
  "rgb(203,24,29)",
  "rgb(165,15,21)",
  "rgb(103,0,13)",
];

const colorScale = d3.scaleQuantize().range(colors);
const sizeScale = d3.scaleLinear().range([5, 25]);

const projection = d3
  .geoAlbersUsa()
  .scale([width])
  .translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

Promise.all([
  d3.json("us.json"),
  d3.json("zombie-attacks.json"),
  d3.json("us-cities.json"),
]).then(([geoData, zombieData, cities]) => {
  colorScale.domain(d3.extent(zombieData, (d) => d.num));

  const stateMap = zombieData.reduce((map, val) => {
    map[val.state] = val.num;
    return map;
  }, {});

  geoData.features.forEach((d) => {
    d.properties["num"] = stateMap[d.properties.name];
  });

  cities.forEach((d, i) => {
    const projected = projection([d.lon, d.lat]);
    cities[i].lon = projected[0];
    cities[i].lat = projected[1];
    cities[i].population = +d.population;
  });
  sizeScale.domain(d3.extent(cities, (d) => d.population));

  const num = (d) => d.properties.num;

  svg
    .selectAll("path")
    .data(geoData.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) => (num(d) ? colorScale(num(d)) : "#ddd"))
    .attr("stroke", "black");

  svg
    .selectAll("circle")
    .data(cities)
    .join("circle")
    .attr("cx", (d) => d.lon)
    .attr("cy", (d) => d.lat)
    .attr("r", d => sizeScale(d.population))
    .attr("opacity", .5);
});
