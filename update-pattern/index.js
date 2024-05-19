const randomLetters = () => {
  return d3
    .shuffle("abcdefghijklmnopqrstuvwxyz".split(""))
    .slice(0, Math.floor(6 + Math.random() * 20))
    .sort();
};

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 500)
  .attr("height", 100)
  .attr("viewBox", [0, -20, 500, 100]);

const t = svg.transition().duration(4000);

setInterval(() => {
  svg
    .selectAll("text")
    .data(randomLetters(), (d) => d)
    .join(
      (enter) =>
        enter
          .append("text")
          .attr("fill", "green")
          .attr("y", -30)
          .attr("x", (_, i) => i * 16)
          .text((d) => d)
          .call((enter) => enter.transition(t).attr("y", 0)),
      (update) =>
        update
          .attr("fill", "gray")
          .call((update) => update.transition(t).attr("x", (_, i) => i * 16)),
      (exit) =>
        exit
          .attr("fill", "red")
          .call((exit) => exit.transition(t).attr("y", 50).remove())
    );
}, 5000);
