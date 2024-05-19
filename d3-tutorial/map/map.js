const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

Promise.all([
  d3.tsv("https://unpkg.com/world-atlas@1.1.4/world/50m.tsv"),
  d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json")
]).then(([tsvData, data]) => {

  const g = svg.append('g');

  svg.call(
    d3.zoom().on("zoom", () => {
      g.attr("transform", d3.event.transform);
    })
  );

  g
  .append("path")
  .attr("d", pathGenerator({ type: "Sphere" }))
  .attr("class", "sphere");

  const nameMap = tsvData.reduce((map, d) => {
    map[d.iso_n3] = d.name;
    return map;
  }, {});

  const countries = topojson.feature(data, data.objects.countries);
  const paths = g.selectAll("path").data(countries.features);
  paths
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", d => pathGenerator(d))
    .append("title")
    .text(d => nameMap[d.id]);
});
