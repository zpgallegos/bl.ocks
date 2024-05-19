// https://observablehq.com/@d3/selection-join

const svg = d3.select("svg");

const randomLetters = () =>
  d3
    .shuffle("abcdefghijklmnopqrstuvwxyz".split(""))
    .slice(0, Math.floor(6 + Math.random() * 20))
    .sort();

setInterval(() => {
  const t = svg.transition().duration(750);

  svg
    .selectAll("text")
    .data(randomLetters(), d => d)
    .join(
      enter =>
        enter
          .append("text")
          .attr("fill", "green")
          .attr("y", -10)
          .attr("x", (d, i) => i * 16)
          .text(d => d)
          .call(enter => enter.transition(t).attr("y", 30)),
      update =>
        update
          .attr("fill", "blue")
          .attr("y", 30)
          .call(update => update.transition(t).attr("x", (d, i) => i * 16)),
      exit =>
        exit
          .attr("fill", "red")
          .call(exit => exit.transition(t).attr("y", 80).exit())
    );
}, 2500);
