import React, { Component } from 'react'
import * as d3 from 'd3'
import mouse from './mouse'

const DIVSTYLE = {
   position: "absolute",
   left: "0px",
   top: "0px",
   right: "0px",
   bottom: "0px",
}

let graphData = {
   tooltipWidth: 100,
   tooltipHeight: 100,
   tooltipCornerRadius: 15,
   tooltipFill: "lightsteelblue",
   tooltipTextColor: "red",
   tooltipCharWidth: 10,
   tooltipTextOffset: 20,
   tooltipDy: 20
};

class Graph extends Component {
   state = { width: 0, height: 0 };
   updateDimensions = () => {
      this.setState({ width: window.innerWidth, height: window.innerHeight });

      if (graphData.svgCanvas)
         graphData.svgCanvas
            .attr("width", this.state.width)
            .attr("height", this.state.height)

      if (graphData.simulation) {
         graphData.simulation.force("center")
            .x(this.state.width / 2)
            .y(this.state.height / 2)
         graphData.simulation.alpha(0.3).restart();
      }
   };

   componentDidMount() {
      this.updateDimensions();
      this._createCanvas();
      window.addEventListener('resize', this.updateDimensions);
   }

   componentWillUnmount() {
      window.removeEventListener('resize', this.updateDimensions);
   }

   render() { 
      if (this.props.nodesChanged)
      {
         this.props.setNodesChanged(false);
         this._clearCanvas();

         graphData.props = this.props;
         this._createSimulation();
         this._setGraphData();
         this._createTooltip();
         this._startGraph();

         console.log("Changed");
      }
      return <div style={DIVSTYLE} ref={this._setRef.bind(this)}/> 
   }

   /*
   shouldComponentUpdate() {
      // Prevents component re-rendering
      return false;
   }
   */

   // connects component to this
   _setRef(componentNode) {
      graphData.rootNode = componentNode;
   }

   _createTooltip() {
      // Define the div for the tooltip
      graphData.tooltip = graphData.svgCanvas.append("g")	
         .style("opacity", 0)
         //.style("text-align", "center")

      graphData.tooltip.append("rect")
            .attr("width", graphData.tooltipWidth)
            .attr("height", graphData.tooltipHeight)
            .attr("rx", graphData.tooltipCornerRadius)
            .attr("fill", graphData.tooltipFill)

      graphData.tooltip.append("text")
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("fill", graphData.tooltipTextColor)
   }

   _createCanvas() {
      graphData.svgCanvas = d3.select(graphData.rootNode)
         .append("svg")
         .attr("width", this.state.width)
         .attr("height", this.state.height)
         .style("border", "1px solid black");
   }

   _createSimulation() {
      graphData.simulation = d3.forceSimulation(graphData.props.nodes)
         .force("link", d3.forceLink(graphData.props.links)
            .id(d => d.id)
            .distance(d => d.value * 20))
         .force("charge", d3.forceManyBody())
         .force("center", d3.forceCenter(this.state.width / 2, 
                                         this.state.height / 2))
   }

   _setGraphData() {
      graphData.link = graphData.svgCanvas.append("g")
            .attr("stroke", "#999")
         .selectAll("line")
         .data(graphData.props.links)
         .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

      graphData.node = graphData.svgCanvas.append("g")
         .selectAll("g")
         .data(graphData.props.nodes)
         .join("g")
            .call(mouse.drag(graphData.simulation));

      graphData.node.append("circle")
            .attr("id", d => d.id)
            .attr("r", d => d.radius)
            .attr("stroke", "white")
            .attr("fill", d => d.color)
            .on("mouseover", mouse.handleMouseOver.bind(graphData))
            .on("mouseout", mouse.handleMouseOut.bind(graphData))
            .on("click", mouse.handleMouseClicked.bind(graphData))

      graphData.node.append("text")
            .attr("x", d => 1.5 * d.radius)
            .text(d => d.id)
            .attr("dominant-baseline", "middle")
         .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 3);

   }

   _startGraph() {
      graphData.simulation.on("tick", () => {
         graphData.link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
         graphData.node
            .attr("transform", d => `translate(${d.x},${d.y})`)
      });
   }

   _clearCanvas() {
      graphData.svgCanvas.selectAll("*").remove();
   }

}

export default Graph
