export const load = () =>
  Promise.all([
    d3.tsv("https://unpkg.com/world-atlas@1.1.4/world/50m.tsv"),
    d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json")
  ]).then(([tsvData, data]) => {
    console.log('getting data...');
    const infoMap = tsvData.reduce((map, d) => {
      map[d.iso_n3] = d;
      return map;
    }, {});

    const countries = topojson.feature(data, data.objects.countries);

    countries.features.forEach(d => {
      Object.assign(d.properties, infoMap[d.id]);
    });

    return countries;
  });
