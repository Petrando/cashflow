import React, {useState, useEffect} from 'react';
import {useD3} from "../../../hooks/useD3";
//import { useWindowDimensions } from '../hooks/useDimension';
import * as d3 from 'd3';

const BarChart = ({width, graphData, isSorted}:{width:number, graphData:any[], isSorted:boolean}):JSX.Element => {
    const ref = useD3(
        (svg) => {
          const height = 450;          
          const margin = { top: 20, right: 30, bottom: 30, left: 40 };
          //const graphData = graphData;
    
          const tooltip = d3.select("div.tooltip").style("display", "none");

          const x = d3
            .scaleBand()
            .domain(graphData.map((d:any) => d.label))
            .rangeRound([margin.left, width - margin.right])
            .padding(0.1);
    
          const y1 = d3
            .scaleLinear()
            .domain([0, d3.max(graphData, (d:any) => d.value)])
            .rangeRound([height - margin.bottom, margin.top]);
    
          const xAxis = (g) =>
            g.attr("transform", `translate(0,${height - margin.bottom})`)
            .transition().duration(1000)
            .call(
              d3
                .axisBottom(x)
                .tickValues(
                  x.domain()
                )
                .tickSizeOuter(0)
            );

          /*
          axis x original tickValues parameter:
          d3
                    .ticks(...d3.extent(x.domain()), width / 40)
                    .filter((v) => x(v) !== undefined)
          */
    
          const y1Axis = (g) =>
            g
              .attr("transform", `translate(${margin.left},0)`)
              .style("color", "steelblue")
              .call(d3.axisLeft(y1).ticks(null, "s"))
              .call((g) => g.select(".domain").remove())              
    
          svg.select(".x-axis").call(xAxis);
          svg.select(".y-axis").call(y1Axis);
    
          const canvas = svg
            .select(".plot-area")
            .attr("fill", "steelblue")

          const bars =  canvas
            .selectAll(".bar")
            .data(graphData, function(d:any){return d.label});

          bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d:any) => x(d.label))
            .attr("width", x.bandwidth())
            .attr("y", y1(0))
            .attr("height", 0)
            .attr("fill", "#34D399")      
            .on("mouseover", (e, d)=>{
              canvas.selectAll("rect.bar")
                  .filter(dBar => dBar.label === d.label)
                .style("stroke", "black")
                .style("stroke-width", 1)

              tooltip.style("display", "inline");
              tooltip.select("p.label").text(d.label);
              tooltip.select("p.value").text(`${d3.format(",")(d.value)}`);
              
              d3.select(".x-axis").selectAll("text")
                .filter(dText=>dText === d.label).style("font-weight", "bold")
            })      
            .on("mousemove", (e, d)=>{
              const reduceFromPageX = 
                    width < 600?0:
                    width >= 600 && width <= 748?35:
                    width >  748 && width <= 1024?50:
                    width > 1024 && width <= 1440?90:
                    150;

              tooltip
                  .style("left", function(){
                      return (e.pageX - reduceFromPageX) + "px";
                  })
                  .style("top", function(){
                      return (e.pageY - 140) + "px";
                  });
            })
            .on("mouseout", (e, d)=>{
              canvas.selectAll("rect.bar")
                  .filter(dBar => dBar.label === d.label)
                .style("stroke", "none")
                .style("stroke-width", 0)

                tooltip.style("display", "none");

                d3.select(".x-axis").selectAll("text")
                  .filter(dText=>dText === d.label).style("font-weight", "normal")
            })
              .transition().duration(1000)  
            .attr("y", (d:any) => y1(d.value))          
            .attr("height", (d) => y1(0) - y1(d.value))
            .transition().duration(500)
            .attr("fill", "steelblue");            
          
          bars
            .transition().duration(1000)
            .attr("x", (d:any) => x(d.label))
            .attr("width", x.bandwidth())
            .attr("y", (d:any) => y1(d.value))
            .attr("height", (d:any) => y1(0) - y1(d.value))
            .attr("fill", "steelblue");
            
          bars.exit()
            .transition().duration(250)
            .attr("fill", "#B45309")
            .transition().duration(750)
            .attr("width", 0).attr("height", 0).attr("y", y1(0))            
            .remove();

        },
        [graphData, width, isSorted]
      );
  return (
    <>
    <svg
      ref={ref}
      style={{
        height: 450,
        width: width,
        marginRight: "0px",
        marginLeft: "0px",
        marginBottom: "0px"
      }}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
    </>
  );
}

export default BarChart;