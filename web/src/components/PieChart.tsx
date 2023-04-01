import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { decimalFormat } from "../utils/util";

export type PieData = {
  value: number;
  symbol?: string;
};

interface IProps {
  data?: PieData[];
  title?: string;
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
        const width = 250;
        const height = 250;
        const margin = 5;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin;

        const g = svg
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${width / 2},${height / 2})`);

        const data: any = props.data!;

        const pie = d3.pie().value((d: any) => d.value);
        // shape helper to build arcs:
        const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

        if (data.length > 0) {
          // path
          g.selectAll("slices")
            .data(pie(data))
            .join("path")
            .attr("d", arcGenerator as any)
            .attr("fill", function (d, i) {
              const data: any = d.data;
              return d3.schemeSet1[i];
            })
            .style("stroke", "white")
            .style("opacity", 0.7);

          // text
          g.selectAll("slices")
            .data(pie(data))
            .join("text")
            .text((d: any, i: number) => {
              const angle = d.endAngle - d.startAngle;
              if (angle < 0.2) {
                return "";
              } else {
                return (
                  d.data.symbol + `(${decimalFormat.format(d.data.value)})`
                );
              }
            })
            .attr("transform", function (d: any) {
              return `translate(${arcGenerator.centroid(d)})`;
            })
            .style("stroke", "white")
            .style("text-anchor", "middle")
            .style("font-size", 10);
        } else {
          const pieData = pie([{ symbol: "", value: 1 }]);
          g.selectAll("slices")
            .data(pieData)
            .join("path")
            .attr("d", arcGenerator as any)
            .attr("fill", function (d, i) {
              const data: any = d.data;
              return "lightgray";
            })
            .style("stroke", "white")
            .style("opacity", 0.7);

          g.selectAll("slices")
            .data(pieData)
            .join("text")
            .text("0")
            .style("stroke", "white")
            .style("text-anchor", "middle")
            .style("font-size", 30);
        }
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

  // if (props.data?.length === 0) {
  //   return <div className="w-[250px] h-[250px] flex justify-center items-center">0</div>
  // } else {
  //   return <svg ref={d3Container} />;
  // }
  //
  //

  return (
    <>
      <div className="flex-col items-center content-center">
        <h1 className="text-center">{props.title}</h1>
        <svg ref={d3Container} />
      </div>
    </>
  );
};
