import Bullet from "./Bullet.js";

const svgContainer = d3.select("#container-1");

d3.json("data.json").then(data => {
  const data0 = data[0];

  const bullet1 = Bullet()
    .title(data0.title)
    .subtitle(data0.subtitle)
    .ranges(data0.ranges);

  svgContainer.call(bullet1);
});
