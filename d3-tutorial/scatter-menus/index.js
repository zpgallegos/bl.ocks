import { dropdown } from "./dropdown.js";
import { scatter } from "./scatter.js";

const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");
const margin = { top: 50, right: 60, bottom: 200, left: 200 };
const circleRadius = 5;

// state
let data;
let yVar;
let xVar;

const onYClicked = column => {
  yVar = column;
  render();
};

const onXClicked = column => {
  xVar = column;
  render();
};

const render = () => {
  d3.select("#x-menu").call(dropdown, {
    options: data.columns,
    onClick: d => onXClicked(d),
    initialVal: xVar
  });

  d3.select("#y-menu").call(dropdown, {
    options: data.columns,
    onClick: d => onYClicked(d),
    initialVal: yVar
  });

  svg.call(scatter, { data, xVar, yVar, margin, height, width, circleRadius });
};

d3.csv("https://vizhub.com/curran/datasets/auto-mpg.csv").then(read => {
  read.forEach(row => {
    row.mpg = +row.mpg;
    row.cylinders = +row.cylinders;
    row.weight = +row.weight;
    row.displacement = +row.displacement;
    row.horsepower = +row.horsepower;
    row.acceleration = +row.acceleration;
    row.year = +row.year;
  });
  data = read;
  xVar = 'mpg';
  yVar = 'weight';
  render();
});
