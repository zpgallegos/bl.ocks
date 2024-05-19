// https://observablehq.com/@d3/radial-area-chart

const WIDTH = 975;
const HEIGHT = 975;
const MARGIN = 10;
const INNER_RADIUS = WIDTH / 5;
const OUTER_RADIUS = WIDTH / 2 - MARGIN;

const svg = d3
  .select("body")
  .append("svg")
  .attr("height", HEIGHT)
  .attr("width", WIDTH);

const container = svg
  .append("g")
  .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

const xScale = d3
  .scaleUtc()
  .domain([Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 1) - 1])
  .range([0, 2 * Math.PI]);

const area = d3
  .areaRadial()
  .curve(d3.curveLinearClosed)
  .angle(d => xScale(d.date));

const line = d3
  .lineRadial()
  .curve(d3.curveLinearClosed)
  .angle(d => xScale(d.date));

const xAxis = a => {
  a.attr("font-family", "georgia")
    .attr("font-size", 10)
    .call(b =>
      b
        .selectAll("g")
        .data(xScale.ticks())
        .join("g")
        .call(c =>
          c
            .append("path")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.2)
            .attr("d", d => {
              return `M${d3.pointRadial(
                xScale(d),
                INNER_RADIUS
              )}L${d3.pointRadial(xScale(d), OUTER_RADIUS)}`;
            })
        )
        // two parts below are to add the labels for the months
        // this works by drawing an arc path between the months and then attaching a textPath to it
        // they're linked by id on the path, referred to by xlink:href in the textPath
        .call(c =>
          c
            .append("path")
            .attr("id", d => d3.utcFormat("%B")(d))
            .datum(d => [d, d3.utcMonth.offset(d, 1)])
            .attr("fill", "none")
            .attr(
              "d",
              ([a, b]) =>
                `M${d3.pointRadial(xScale(a), INNER_RADIUS)}
              A${INNER_RADIUS},${INNER_RADIUS} 0,0,1 ${d3.pointRadial(
                  xScale(b),
                  INNER_RADIUS
                )}`
            )
        )
        .call(c =>
          c
            .append("text")
            .append("textPath")
            .attr("startOffset", 6)
            .attr("xlink:href", d => "#" + d3.utcFormat("%B")(d))
            .text(d => d3.utcFormat("%B")(d))
        )
    );
};

d3.csv("data.csv").then(read => {
  const data = Array.from(
    d3
      .rollup(
        read,
        rows => {
          return {
            date: new Date(
              Date.UTC(
                2000,
                new Date(rows[0].DATE).getUTCMonth(),
                new Date(rows[0].DATE).getUTCDate() + 1
              )
            ),
            avg: d3.mean(rows, d => d.TAVG || NaN),
            min: d3.mean(rows, d => d.TMIN || NaN),
            max: d3.mean(rows, d => d.TMAX || NaN),
            minmin: d3.min(rows, d => d.TMIN || NaN),
            maxmax: d3.max(rows, d => d.TMAX || NaN)
          };
        },
        d =>
          `${new Date(d.DATE).getUTCMonth()}-${new Date(d.DATE).getUTCDate() +
            1}`
      )
      .values()
  ).sort((a, b) => d3.ascending(a.date, b.date));

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.minmin), d3.max(data, d => d.maxmax)])
    .range([INNER_RADIUS, OUTER_RADIUS]);

  const ticks = yScale.ticks().reverse();
  const yScaleData = ticks.filter(d => d % 10 === 0);

  const yAxis = a => {
    a.attr("text-anchor", "middle")
      .attr("font-family", "georgia")
      .attr("font-size", 10)
      .call(b =>
        b
          .selectAll("g")
          .data(yScaleData)
          .join("g")
          .attr("fill", "none")
          .call(c =>
            // draws the parallel circles for the temperature axis
            c
              .append("circle")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.2)
              .attr("r", yScale)
          )
          .call(c =>
            // draws the temperature text labels
            c
              .append("text")
              .attr("y", d => -yScale(d))
              .attr("dy", ".35em")
              .attr("stroke", "#fff")
              .attr("stroke-width", 5)
              .text((x, i) => `${x.toFixed(0)}${i ? "" : "°F"}`)
              .clone(true)
              .attr("y", d => yScale(d))
              // this part is to place a white background over the text
              // this, this.previousSibling are the two text elements just appended
              // clone makes a copy of each and then the fill/stroke are changed
              .selectAll(function() {
                return [this, this.previousSibling];
              })
              .clone(true)
              .attr("fill", "currentColor")
              .attr("stroke", "none")
          )
          .call(c =>
            // draws the temperature text labels
            c
              // .append("g")
              // .attr("transform", "rotate(90)")
              .append("text")
              .attr("transform", "rotate(90)")
              .attr("y", d => -yScale(d))
              .attr("dy", ".35em")
              .attr("stroke", "#fff")
              .attr("stroke-width", 5)
              .text((x, i) => `${x.toFixed(0)}${i ? "" : "°F"}`)
              .clone(true)
              .attr("y", d => yScale(d))
              // this part is to place a white background over the text
              // this, this.previousSibling are the two text elements just appended
              // clone makes a copy of each and then the fill/stroke are changed
              .selectAll(function() {
                return [this, this.previousSibling];
              })
              .clone(true)
              .attr("fill", "currentColor")
              .attr("stroke", "none")
          )
      );
  };

  container.append("g").call(xAxis);
  container.append("g").call(yAxis);

  container
    .append("path")
    .attr("fill", "lightsteelblue")
    .attr("fill-opacity", 0.2)
    .attr(
      "d",
      area
        .innerRadius(d => yScale(d.minmin))
        .outerRadius(d => yScale(d.maxmax))(data)
    );

  container
    .append("path")
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.2)
    .attr(
      "d",
      area.innerRadius(d => yScale(d.min)).outerRadius(d => yScale(d.max))(data)
    );

  container
    .append("path")
    .attr("stroke", "steelblue")
    .attr("fill", "none")
    .attr("d", line.radius(d => yScale(d.avg))(data));
});
