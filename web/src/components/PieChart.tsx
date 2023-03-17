import * as d3 from "d3";
import { useEffect, useRef } from "react";

export type Data = {
  value: number;
  symbol?: string;
};

interface IProps {
  data?: Data[];
}

export const PieChart = (props: IProps) => {
  /* The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement) */
  const d3Container = useRef(null);

  /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
  useEffect(
    () => {
      if (props.data && d3Container.current) {
        const svg = d3.select(d3Container.current);

        // set the dimensions and margins of the graph
        const width = 450;
        const height = 450;
        const margin = 5;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin;

        const g = svg
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${width / 2},${height / 2})`);

        const colors = {
          AAPL: "#636363",
          TSLA: "#c30100",
          QS: "#2e8292",
          META: "#027df2",
          INTC: "#048fce",
          VOO: "#c80024",
        };

        const data: any = props.data!;

        const pie = d3.pie().value((d: any) => d.value);
        // shape helper to build arcs:
        const arcGenerator = d3
          .arc()
          .innerRadius(radius - 100)
          .outerRadius(radius);

        g.selectAll("slices")
          .data(pie(data))
          .join("path")
          .attr("d", arcGenerator as any)
          .attr("fill", function (d, i) {
            const data: any = d.data;
            type ObjectKey = keyof typeof colors;
            const symbol = data.symbol as ObjectKey;
            return colors[symbol];
          })
          .attr("stroke", "white")
          .style("stroke-width", "3px");
        // .style("opacity", 0.7);

        g.selectAll("slices")
          .data(pie(data))
          .join("text")
          .text((d: any, i: number, x) => {
            return d.data.symbol;
          })
          .attr("transform", function (d: any) {
            return `translate(${arcGenerator.centroid(d)})`;
          })
          .style("text-anchor", "middle")
          .style("font-size", 16);

        //  const polyline =  g.selectAll("polyline")
        //  .data(pie(data), (d:any) => d.data.symbol);

        //  polyline
        //  .join("polyline")
        //  .attr("stroke", "black")
        //  .attr("stroke-width", "2px")
        //  .attr("fill", "none");

        g.append("text")
          .text(`1`)
          .attr("text-anchor", "middle")
          .attr("dy", "-1.2em");

        g.append("text")
          .text(`222`)
          .attr("text-anchor", "middle")
          .attr("dy", ".6em");
      }
    },

    /*
            useEffect has a dependency array (below). It's a list of dependency
            variables for this useEffect block. The block will run after mount
            and whenever any of these variables change. We still have to check
            if the variables are valid, but we do not have to compare old props
            to next props to decide whether to rerender.
        */
    [props.data, d3Container.current]
  );

  return <svg ref={d3Container} />;
};
