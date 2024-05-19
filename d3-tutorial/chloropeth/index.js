import { load } from "./load.js";
import { legend } from "./legend.js";
import { map } from "./map.js";

// state
let selectedColorValue;
let countries;

const svg = d3.select("svg");
const mapG = svg.append("g");
const colorLegendG = svg.append("g").attr("transform", "translate(40, 200)");

const colorValue = d => d.properties.economy;
const colorScale = d3.scaleOrdinal();

const filterCountries = filterVal => {
  selectedColorValue = filterVal;
  render();
};

load().then(data => {
  countries = data;
  render();
});

const render = () => {
  colorScale
    .domain(countries.features.map(colorValue))
    .domain(
      colorScale
        .domain()
        .sort()
        .reverse()
    )
    .range(d3.schemeSpectral[colorScale.domain().length]);

  colorLegendG.call(legend, {
    colorScale,
    circleRadius: 10,
    spacing: 20,
    textOffset: 15,
    backgroundRectWidth: 250,
    onClickHandler: filterCountries,
    selectedColorValue
  });

  mapG.call(map, {
    countries,
    colorScale,
    colorValue
  });
};
