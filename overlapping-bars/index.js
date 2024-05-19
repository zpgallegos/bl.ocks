const WIDTH = 960;
const HEIGHT = 600;
const MARGINS = { top: 20, right: 40, bottom: 30, left: 20 };
const INNER_HEIGHT = HEIGHT - MARGINS.top - MARGINS.bottom;
const INNER_WIDTH = WIDTH - MARGINS.left - MARGINS.right;
const BARWIDTH = Math.floor(INNER_WIDTH / 19) - 1;

const container = d3.select("#container-1");

const svg = container
  .append("svg")
  .attr("class", "svg-content")
  .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGINS.left}, ${MARGINS.top})`);

d3.csv("data.csv").then(data => {
  data.forEach(d => {
    d.age = +d.age;
    d.year = +d.year;
    d.people = +d.people;
  });

  const maxAge = d3.max(data, d => d.age); // 90
  const maxYear = d3.max(data, d => d.year); // 2000
  const minYear = d3.min(data, d => d.year); // 1850
  let year = maxYear;

  const xScale = d3
    .scaleLinear()
    .domain([maxYear - maxAge, maxYear]) // [1910, 2000]
    .range([BARWIDTH / 2, INNER_WIDTH - BARWIDTH / 2]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.people)])
    .range([INNER_HEIGHT, 0]);

  const yAxis = d3.axisRight(yScale).tickFormat(d => Math.round(d / 1e6) + "M");

  data = d3
    .nest()
    .key(d => d.year)
    .key(d => d.year - d.age)
    .rollup(d => d.map(e => e.people))
    .map(data);

  g.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${INNER_WIDTH},0)`)
    .call(yAxis);

  const birthYears = g.append("g").attr("class", "birthyears");

  // append labeled rects for all years
  const birthYear = birthYears
    .selectAll(".birthyear")
    .data(d3.range(minYear - maxAge, maxYear + 1, 5)) // 1760 -> 2000
    // years outside the domain get interpolated, so first rect off the left of the screen
    // is the same distance from the farthest left rect and the next one to the right is
    .join(enter =>
      enter
        .append("g")
        .attr("class", "birthyear")
        .attr("transform", d => {
          return `translate(${xScale(d)}, 0)`;
        })
    );

  // draw male/female bars for each rect
  birthYear
    .selectAll("rect")
    .data(d => {
      // console.log(`${d}:`, data[`$${year}`][`$${d}`]);
      return data[`$${year}`][`$${d}`] || [0, 0];
    })
    // d is the year binded above.
    // if the year passed is > maxAge away from the current year, return [0,0]
    // so there's no rects drawn for data too far in the past until the year state
    // changes and new data is binded
    .join("rect")
    .attr("x", -BARWIDTH / 2)
    .attr("width", BARWIDTH)
    .attr("y", d => yScale(d))
    .attr("height", d => INNER_HEIGHT - yScale(d));

  birthYear
    .append("text")
    .attr("y", INNER_HEIGHT - 5)
    .text(d => d);

  g.selectAll(".age")
    .data(d3.range(0, maxAge + 1, 5))
    .join("text")
    .attr("class", "age")
    .attr("x", d => xScale(year - d))
    .attr("y", INNER_HEIGHT + 5)
    .attr("dy", ".7em")
    .text(d => d);

  window.focus();
  d3.select(window).on("keydown", () => {
    switch (d3.event.keyCode) {
      case 37:
        year = Math.max(year - 10, minYear);
        break;
      case 39:
        year = Math.min(year + 10, maxYear);
        break;
    }
    update();
  });

  const title = g
    .append("text")
    .attr("class", "title")
    .attr("dy", ".75em")
    .text(2000);

  const update = () => {
    title.text(year);

    // birthYears
    //   .transition()
    //   .duration(750)
    //   .attr("transform", `translate(${xScale(maxYear) - xScale(year)}, 0)`);

    birthYear
      .selectAll("rect")
      .data(d => {
        console.log(d, data[`$${year}`][`$${d}`]);
        return data[`$${year}`][`$${d}`] || [0, 0];
      })
      .transition()
      .duration(750)
      .attr("y", d => yScale(d))
      .attr("height", d => INNER_HEIGHT - yScale(d));
  };
});
