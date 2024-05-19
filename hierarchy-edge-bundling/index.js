// https://observablehq.com/@d3/hierarchical-edge-bundling/2

const WIDTH = 954;

let data;

const svg = d3
  .select("#container-1")
  .append("svg")
  .attr("class", "svg-content")
  .attr("viewBox", [-WIDTH / 2, -WIDTH / 2, WIDTH, WIDTH])
  .attr("preserveAspectRatio", "xMidYMid meet");

const hierarchy = (data, delimiter = ".") => {
  let root;
  const map = new Map();

  const find = data => {
    const { name } = data;
    if (map.has(name)) return map.get(name);
    map.set(name, data);

    const i = name.lastIndexOf(delimiter);
    if (i > 0) {
      const folder = name.substring(0, i);
      const file = name.substring(i + 1);
      find({ name: folder, children: [] }).children.push(data);
      data.name = file;
    } else {
      root = data;
    }
    return data;
  };

  data.forEach(d => find(d));
  return root;
};

function bilink(root) {
  const map = new Map(root.leaves().map(d => [id(d), d]));
  for (const d of root.leaves())
    (d.incoming = []), (d.outgoing = d.data.imports.map(i => [d, map.get(i)]));
  for (const d of root.leaves())
    for (const o of d.outgoing) o[1].incoming.push(o);
  return root;
}

function id(node) {
  return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
}

class Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  split() {
    const { a, b } = this;
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    return [new Line(a, m), new Line(m, b)];
  }
  toString() {
    return `M${this.a}L${this.b}`;
  }
}

class BezierCurve {
  l1 = [4 / 8, 4 / 8, 0 / 8, 0 / 8];
  l2 = [2 / 8, 4 / 8, 2 / 8, 0 / 8];
  l3 = [1 / 8, 3 / 8, 3 / 8, 1 / 8];
  r1 = [0 / 8, 2 / 8, 4 / 8, 2 / 8];
  r2 = [0 / 8, 0 / 8, 4 / 8, 4 / 8];

  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  dot = ([ka, kb, kc, kd], { a, b, c, d }) => {
    return [
      ka * a[0] + kb * b[0] + kc * c[0] + kd * d[0],
      ka * a[1] + kb * b[1] + kc * c[1] + kd * d[1]
    ];
  };

  split = () => {
    const m = this.dot(this.l3, this);
    return [
      new BezierCurve(
        this.a,
        this.dot(this.l1, this),
        this.dot(this.l2, this),
        m
      ),
      new BezierCurve(
        m,
        this.dot(this.r1, this),
        this.dot(this.r2, this),
        this.d
      )
    ];
  };

  toString = () => {
    return `M${this.a}C${this.b},${this.c},${this.d}`;
  };
}

class Path {
  constructor(_) {
    this._ = _;
    this._m = undefined;
  }
  moveTo = (x, y) => {
    this._ = [];
    this._m = [x, y];
  };
  lineTo = (x, y) => {
    this._.push(new Line(this._m, (this._m = [x, y])));
  };
  bezierCurveTo = (ax, ay, bx, by, x, y) => {
    this._.push(
      new BezierCurve(this._m, [ax, ay], [bx, by], (this._m = [x, y]))
    );
  };
  *split(k = 0) {
    const n = this._.length;
    const i = Math.floor(n / 2);
    const j = Math.ceil(n / 2);
    const a = new Path(this._.slice(0, i));
    const b = new Path(this._.slice(j));
    if (i !== j) {
      const [ab, ba] = this._[i].split();
      a._.push(ab);
      b._.unshift(ba);
    }
    if (k > 1) {
      yield* a.split(k - 1);
      yield* b.split(k - 1);
    } else {
      yield a;
      yield b;
    }
  }
  toString = () => this._.join("");
}

const line = d3
  .lineRadial()
  .curve(d3.curveBundle)
  .radius(d => d.y)
  .angle(d => d.x);

const path = ([source, target]) => {
  const p = new Path();
  line.context(p)(source.path(target));
  return p;
};

const color = t => d3.interpolateRdBu(1 - t);
const k = 6;

d3.json("data.json").then(read => {
  const radius = WIDTH / 2;
  const tree = d3.cluster().size([2 * Math.PI, radius - 100]);

  const root = tree(
    bilink(
      d3
        .hierarchy(hierarchy(read))
        .sort(
          (a, b) =>
            d3.ascending(a.height, b.height) ||
            d3.ascending(a.data.name, b.data.name)
        )
    )
  );

  const node = svg
    .append("g")
    .attr("font-size", 9)
    .attr("font-family", "georgia")
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr(
      "transform",
      d => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y}, 0)`
    )
    .append("text")
    .attr("dy", ".31em")
    .attr("x", d => (d.x < Math.PI ? 6 : -6))
    .attr("text-anchor", d => (d.x < Math.PI ? "start" : "end"))
    .attr("transform", d => (d.x >= Math.PI ? "rotate(180)" : null))
    .text(d => d.data.name)
    .call(text =>
      text
        .append("title")
        .text(
          d =>
            `${id(d)} ${d.outgoing.length} outgoing ${
              d.incoming.length
            } incoming`
        )
    );

  const sub = root.leaves().filter(d => d.data.name === "Filter");
  console.log(sub);
  console.log(d3.transpose(
    sub
      .flatMap(leaf => leaf.outgoing.map(path))
      .map(path => Array.from(path.split(k)))
  ));


  svg
    .append("g")
    .attr("fill", "none")
    .selectAll("path")
    // .data(
    //   d3.transpose(
    //     root
    //       .leaves()
    //       .flatMap(leaf => leaf.outgoing.map(path))
    //       .map(path => Array.from(path.split(k)))
    //   )
    // )
    .data(
      d3.transpose(
        sub
          .flatMap(leaf => leaf.outgoing.map(path))
          .map(path => Array.from(path.split(k)))
      )
    )
    .join("path")
    .style("mix-blend-mode", "darken")
    .attr("stroke", (d, i) => color(d3.easeQuad(i / ((1 << k) - 1))))
    .attr("d", d => d.join(""));
});
