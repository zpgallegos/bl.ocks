const picked = "Income";

Promise.all([
  d3.json("data_age.json"),
  d3.json("data_edu.json"),
  d3.json("data_gen.json"),
  d3.json("data_inc.json"),
  d3.json("data_race.json")
]).then(([data_age, data_edu, data_gen, data_inc, data_race]) => {
  const friendly_labels = {
    // age
    ageunder40: "<40",
    age40to54: "40–54",
    age55to69: "55–69",
    age70plus: "70+",

    // education
    NoHS: "No High School Diploma",
    HS: "High School",
    SomeCollege: "Some College",
    College: "College",

    // generation
    Millenial: "Millenial",
    GenX: "Gen X",
    BabyBoom: "Boomer",
    Silent: "Silent Generation",

    // income
    pct00to20: "Bottom 20%",
    pct20to40: "20%–40%",
    pct40to60: "Middle 20%",
    pct60to80: "60%–80%",
    pct80to99: "80%–99%",
    pct99to100: "Top 1%",

    // race
    Other: "Other",
    Hispanic: "Hispanic",
    Black: "Black",
    White: "White"
  };

  const data_dict = {
    Education: data_edu,
    Age: data_age,
    Generation: data_gen,
    Income: data_inc,
    Race: data_race
  };

  const x_cats = d3
    .nest()
    .key(d => d.Category)
    .entries(data_dict[`${picked}`]);

  console.log(x_cats);

  const STARTCOLOR = "#858585";
  const ENDCOLOR = "#2874A6";
  const colorinterpolate = d3.interpolate(STARTCOLOR, ENDCOLOR);
  const HEIGHT = 450;
  const WIDTH = 960;
  const MARGINS = { top: 20, right: 30, bottom: 30, left: 40 };
  const innerHeight = HEIGHT - MARGINS.top - MARGINS.bottom;
  const innerWidth = WIDTH - MARGINS.left - MARGINS.right;

  const make_y = () => {
    let y;
    if (picked === "Race") {
      y = d3
        .scaleLog()
        .range([innerHeight, 0])
        .domain([2, 100]);
    } else {
      y = d3
        .scaleLinear()
        .range([height - MARGINS.bottom, MARGINS.top])
        .domain([
          0,
          d3.max(pivot_data.map(d => d3.max(d.values.map(e => e.value.total))))
        ]);
    }
    return y;
  };

  const x = d3
    .scaleBand()
    .range([0, innerHeight])
    .domain(x_cats.map(d => friendly_labels[d.key]));

  const line = d3
    .line()
    .x(function(d, i) {
      return x(friendly_labels[d.key]) + x.bandwidth() / 2;
    })
    .y(function(d, i) {
      return y(d.value.total);
    });

  const g = d3
    .select("#container-1")
    .append("svg")
    .attr("class", "svg-content")
    .append("g")
    .attr("transform", `translate(${MARGINS.left}, ${MARGINS.TOP})`);

  g.call(line);
});
