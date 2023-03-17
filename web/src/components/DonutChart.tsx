import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { decimalFormat } from "../utils/util";

export const DonutChart = ({
  data,
  title,
  subTitle,
  rate = 1,
  width = 400,
  height = 400,
}: DonutChartProps) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container && data) {
      const colorMap = new Map<string, string>();
      colorMap.set("AAPL", "#636363");
      colorMap.set("TSLA", "#c30100");
      colorMap.set("QS", "#2e8292");
      colorMap.set("META", "#027df2");
      colorMap.set("INTC", "#048fce");
      colorMap.set("VOO", "#c80024");

      const radius = Math.min(width, height) / 2;
      const donutWidth = 75; //This is the size of the hole in the middle

      const stockColor = d3
        .scaleOrdinal<string>()
        .range(colorMap.values())
        .domain(colorMap.keys());

      const container = d3.select(d3Container.current);

      // container.append("div").text("ToolTip");

      const tooltips = container
        .append("div")
        .style("opacity", 0)
        .style("position", "absolute")
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

      const svg = container.append("svg");

      const chartGroup = svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      if (data.length > 0) {
        const arc = d3
          .arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

        const pie = d3.pie<DonutChartData>().value((d) => {
          return d.value;
        });

        const slice = chartGroup
          .selectAll("path")
          .data(pie(data))
          .enter()
          .append("path")
          .attr("d", arc as any)
          .attr("stroke-width", 2)
          .attr("stroke", "white")
          .attr("fill", (d) => {
            return stockColor(d.data.symbol);
          });

        slice
          .on("mouseover", (event) => {
            const data = event.target.__data__;
            let pt = d3.pointer(event, svg); // 抓位置
            tooltips
              .style("opacity", 1)
              .style("left", pt[0] + 30 + "px") // 設定tooltips位置
              .style("top", pt[1] + "px")
              .html(
                `<b>${data.data.symbol} ${decimalFormat.format(
                  (data.data.value / sum) * 100
                )}% (${decimalFormat.format(data.data.value * rate)}  )</b>`
              );
          })
          .on("mouseout", (event) => {
            tooltips.style("opacity", 0);
          });
      } else {
        chartGroup
          .append("circle")
          .attr("r", radius - 5)
          .attr("stroke-width", 2)
          .attr("stroke", "lightgrey")
          .attr("fill", "none");
      }

      const legendRectSize = 13;
      const legendSpacing = 7;

      let sum = 0;
      if (data.length > 0) {
        sum = data.map((d) => d.value).reduce((p, c) => p + c);
      }

      // legend group
      const infoGroup = chartGroup.append("g");

      infoGroup
        .append("text")
        .text(title)
        .attr("text-anchor", "middle")
        .attr("y", -60);

      if (subTitle) {
        infoGroup
          .append("text")
          .text(subTitle)
          .attr("text-anchor", "middle")
          .attr("y", -30);
      }

      // top 5 only
      const legendData = data.sort((a, b) => b.value - a.value).slice(0, 5);

      const legendGroup = chartGroup
        .selectAll(".legend") //the legend and placement
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "circle-legend")
        .attr("transform", function (d, i) {
          const height = legendRectSize + legendSpacing;
          const offset = (height * stockColor.domain().length) / 2;
          const horz = -2 * legendRectSize - 20;
          const vert = i * height - offset + 60;
          return "translate(" + horz + "," + vert + ")";
        });

      legendGroup
        .append("circle") //keys
        .style("fill", (d) => {
          return stockColor(d.symbol);
        })
        .style("stroke", (d) => {
          return stockColor(d.symbol);
        })
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", ".3rem");
      legendGroup
        .append("text") //labels
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .attr("font-size", "0.7rem")
        .text(function (d) {
          return `${d.symbol}(${decimalFormat.format(d.value * rate)})`;
        });
    }
  }, [d3Container, data]);

  return <div ref={d3Container}></div>;
};

export type DonutChartData = {
  symbol: string;
  value: number;
};

type DonutChartProps = {
  width?: number;
  height?: number;
  data: DonutChartData[];
  title: string;
  subTitle?: string;
  rate?: number;
};
