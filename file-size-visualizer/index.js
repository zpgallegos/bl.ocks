// https://observablehq.com/@mbostock/file-size-visualizer

const WIDTH = 960;
const HEIGHT = 960;
const MARGINS = { top: 25, right: 25, bottom: 25, left: 25 };
const INNER_HEIGHT = HEIGHT - MARGINS.top - MARGINS.bottom;
const INNER_WIDTH = WIDTH - MARGINS.left - MARGINS.right;

let data;

const svg = d3
  .select("#container-1")
  .append("svg")
  .attr("class", "svg-content")
  .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

const input = d3.select("#input");

const parseData = text => {
  const root = {};
  const map = new Map([[".", root]]);

  const get = path => {
    if (map.has(path)) return map.get(path);
    const i = path.lastIndexOf("/");
    const node = { name: path.substring(i + 1) };
    const parent = get(path.substring(0, i));
    if (parent.children) {
      parent.children.push(node);
    } else {
      parent.children = [node];
    }
    map.set(path, node);
    return node;
  };

  const lines = text
    .trim()
    .split(/\r?\n/g)
    .map(line => line.trim().split(/\s+/g))
    .filter(([, path]) => path !== "total");

  for (let [val, path] of lines) {
    get(path).val = +val;
  }
  return root;
};

input.on("change", function() {
  data = parseData(this.value);
  const partition = d3
    .hierarchy(data)
    .sum(d => (d.children ? 0 : isNaN(d.val) ? 1 : d.val))
    .sort(
      sorted
        ? (a, b) =>
            d3.descending(!!a.children, !!b.children) ||
            d3.ascending(b.value, a.value) ||
            d3.ascending(a.data.name, b.data.name)
        : (a, b) =>
            d3.descending(!!a.children, !!b.children) ||
            d3.ascending(a.data.name, b.data.name)
    );
  console.log(partition);
  return d3.partition().size([2 * Math.PI, radius])(partition);

  console.log(partition);
});
