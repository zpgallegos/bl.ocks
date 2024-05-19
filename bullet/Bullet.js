const Bullet = () => {
  let title;
  let subtitle;
  let ranges;
  let measures;
  let marks;

  const WIDTH = 960;
  const HEIGHT = 50;
  const MARGINS = { top: 10, right: 10, bottom: 25, left: 100 };
  const INNER_HEIGHT = HEIGHT - MARGINS.top - MARGINS.bottom;
  const INNER_WIDTH = WIDTH - MARGINS.left - MARGINS.right;

  const shades = ["#5c007a", "#8e24aa", "#c158dc"];
  const rectHeight = 20;

  const bullet = selection => {
    selection.each(() => {
      const svg = selection
        .append("svg")
        .attr("class", "svg-content")
        .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      const container = svg
        .append("g")
        .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`);

      const ttl = svg
        .append("g")
        // .style("text-anchor", "end")
        .attr("transform", `translate(0, ${HEIGHT / 2})`);

      ttl
        .append("text")
        .attr("class", "title")
        .text(title);

      ttl
        .append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")
        .text(subtitle);

      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(ranges)])
        .range([0, INNER_WIDTH]);

      container
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${INNER_HEIGHT})`)
        .call(d3.axisBottom(xScale))
        .select(".domain")
        .remove();

      container
        .selectAll("rect")
        .data(ranges)
        .join(enter =>
          enter
            .append("rect")
            .attr("class", "ranges")
            .attr("x", (d, i) =>
              ranges[i - 1] ? xScale(ranges[i - 1]) : xScale(0)
            )
            .attr("width", (d, i) =>
              ranges[i - 1]
                ? xScale(ranges[i]) - xScale(ranges[i - 1])
                : xScale(ranges[i])
            )
            .attr("height", INNER_HEIGHT)
            .attr("fill", (d, i) => shades[i])
        );
    });
  };

  bullet.title = function(value) {
    if (!arguments.length) return title;
    title = value;
    return bullet;
  };

  bullet.subtitle = function(value) {
    if (!arguments.length) return subtitle;
    subtitle = value;
    return bullet;
  };

  bullet.ranges = function(value) {
    if (!arguments.length) return ranges;
    ranges = value;
    return bullet;
  };

  bullet.measures = function(value) {
    if (!arguments.length) return measures;
    measures = value;
    return bullet;
  };

  bullet.marks = function(value) {
    if (!arguments.length) return marks;
    marks = value;
    return bullet;
  };

  return bullet;
};

export default Bullet;
