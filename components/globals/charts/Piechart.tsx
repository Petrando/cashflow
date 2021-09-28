import React, {useState, useEffect} from 'react';
import {useD3} from "../../../hooks/useD3";
import * as d3 from 'd3';
import { graphDataI } from '../../../types';

const Piechart = ({width, graphData}:{width:number, graphData:graphDataI}):JSX.Element => {
  const ref = useD3(
        (svg) => {
          const height = 450;          
          const margin = { top: 20, right: 30, bottom: 30, left: 40 };

          const pieData = graphData.layers;

          const color = graphData.name==="Expense"?
                        d3.scaleOrdinal()
                          .domain(pieData.map(d => d.name))
                          .range(                                  
                                  d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), 
                                  pieData.length).reverse())
                        :
                        d3.scaleOrdinal(d3.schemeCategory10);
          
          const radius = (Math.min(width, height) / 2) - 1;                                  
          const arc = d3.arc()
                          .innerRadius(radius - 70)
                          .outerRadius(radius);

          const pie = d3.pie()
                          .sort(null)
                          .value(d => d.value);

          const arcs = pie(pieData);

          const canvas = svg.select(".graph-area")
                              .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
                              .attr("stroke", "white");

          svg.selectAll(".tooltip").remove();                             

          const arcPaths = canvas          
              .selectAll("path.arc")
              .data(arcs, d=>d.data.name)

          arcPaths.enter().append("path")
            .attr("class", "arc")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
            .on("mouseover", (e, d)=>{   
              if(graphData.total === 0){
                return;
              }        

              canvas.selectAll("path.arc").filter(function(pathD){return pathD.data._id !== d.data._id}) 
                .style("opacity", 0.5);

              const tooltip = svg.select(".tooltip");
              tooltip
                .transition().duration(250)
                .style("opacity", 1);
              processTooltip(d);
              
            })
            .on("mouseout", (e, d)=>{
              if(graphData.total === 0){
                return;
              }

              canvas.selectAll("path.arc")
                .style("opacity", 1);

              const tooltip = svg.select(".tooltip");
              tooltip
                .transition().duration(250)
                .style("opacity", 0);
            })
              //.transition().duration(500)
            //.attrTween('d', d=>{arcTween(d, arc)})
            
          arcPaths
            .attr("d", arc)
            .on("mouseover", (e, d)=>{ 
              if(graphData.total === 0){
                return;
              }

              arcPaths.filter(function(pathD){return pathD.data._id !== d.data._id})                   
                .style("opacity", 0.5);          
              
              tooltip
                .transition().duration(250)
                .style("opacity", 1);

              processTooltip(d);
            
            })
            .on("mouseout", (e, d)=>{
              if(graphData.total === 0){
                return;
              }

              arcPaths.filter(function(pathD){return pathD.data._id !== d.data._id})                     
                .style("opacity", 1);
              
              tooltip
                .transition().duration(250)
                .style("opacity", 0);
            })
              //.transition().duration(500)
            //.attrTween('d',  d=>{arcTween(d, arc)})

          arcPaths.exit()
              //.transition().duration(1000)
            .attr("opacity", 0)
            .remove();

          const processTooltip = (d) => {                  
              const {data:{name, value}} = d;  
              const percentage = value/graphData.total;        
          
              tooltip.select("text.subCategoryName").text(name);
              tooltip.select("text.subCategoryValue").text('Rp. ' + d3.format(",d")(value) + ' (' + d3.format(",.1%")(percentage) + ')');
              tooltip.select("text.categoryName").text('Total ' + graphData.name);
              tooltip.select("text.categoryValue").text('Rp ' + d3.format(",d")(graphData.total));
          }

          const tooltip = createTooltip(canvas, height);

        },
        [graphData, width]
  );

  const arcTween = (d, arc) => {
    var i = d3.interpolate(d.startAngle, d.endAngle);
    return (t) => {
                    d.endAngle = i(t); 
                    return arc(d)
    }
  }
  
  function createTooltip(mySvgCanvas, height){
    var tooltip = mySvgCanvas.append("g")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none")
        .attr("stroke", "black")
        .attr("transform", "translate(-" + width/14 + ",-" + height/8.5 + ")");         

    tooltip.append("text")
        .attr("class", "subCategoryName")
        .attr("x", 30)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    tooltip.append("text")
        .attr("class", "subCategoryValue")
        .attr("x", 25)
        .attr("y", 20)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    tooltip.append("text")
        .attr("class", "categoryName")
        .attr("x", 30)
        .attr("y", 40)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");                                                       

    tooltip.append("text")
        .attr("class", "categoryValue")
        .attr("x", 30)
        .attr("y", 60)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

    return tooltip;        
  
  }

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
      <g className="graph-area">          
      </g>       
    </svg>    
    
    </>
  );
}

export default Piechart;