export const map = (selection, props) => {
  const {
    countries,
    colorScale,
    colorValue
  } = props;

  const projection = d3.geoNaturalEarth1();
  const pathGenerator = d3.geoPath().projection(projection);

  const gUpdate = selection.selectAll("g").data([null]);
  const gEnter = gUpdate.enter().append('g');
  const g = gUpdate.merge(gEnter);

  svg.call(
    d3.zoom().on("zoom", () => {
      mapG.attr("transform", d3.event.transform);
    })
  );

  gEnter
    .append("path")
    .attr("d", pathGenerator({ type: "Sphere" }))
    .attr("class", "sphere");

  const countryPaths = g.selectAll("path").data(countries.features);

  const countryPathsEnter = countryPaths
    .enter()
    .merge(countryPaths)
    .append("path")
    .attr("class", "country");

    // .attr("d", d => pathGenerator(d))
    // .attr("fill", d => colorScale(colorValue(d)))
    // .append("title")
    // .text(d => d.properties.name + ": " + colorValue(d));
};
