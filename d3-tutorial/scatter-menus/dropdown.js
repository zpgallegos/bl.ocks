export const dropdown = (selection, props) => {
  const { options, onClick, initialVal } = props;

  let select = selection.selectAll("select").data([null]);
  select = select
    .enter()
    .append("select")
    .merge(select)
    .on("change", function() {
      onClick(this.value);
    });

  const option = select.selectAll("option").data(options);
  option
    .enter()
    .append("option")
    .attr("selected", d => d === initialVal ? 'selected' : null)
    .merge(option)
    .attr("value", d => d)
    .text(d => d);
};
