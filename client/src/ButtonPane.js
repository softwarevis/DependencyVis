import React, { Component } from 'react';
import './css/ButtonPane.css'
import HideButton, { TRANSFORMS } from './HideButton';
import { searchNewGraph } from './utils/d3';
import { Box , Button} from '@chakra-ui/react';

class ButtonPane extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isHidden: false
      };
   }
   setHidden = hidden => {this.setState({isHidden: hidden})};

   async loadNextLayer(graph) {
      console.log("loading next layer:", graph);
      let newGraph = {
         nodes: [].concat(graph.nodes), 
         links: [].concat(graph.links)
      };

      console.log("searching...", newGraph);
      // TODO: parallelism? Promise.all(map(...
      for (const node of graph.nodes) {
         console.log("single search params", node, newGraph);
         if (node.clicked) continue;
         let ng = await searchNewGraph(node, newGraph, 
            this.props.options, 
            this.props.setErrorText
         );
         if (ng) newGraph = ng;
      }
      console.log("searched all", newGraph);
      this.props.setGraph(newGraph);
   }

   render() {
      let style = {};
      if (this.state.isHidden)
         style.transform = TRANSFORMS.UP;

      let graph = {
         nodes: this.props.nodes,
         links: this.props.links
      };

      return (
         // <Box id="button-pane" style={style}>
         <Box p={[0, 2, 2, 2]}>
            <Button onClick={e => this.loadNextLayer(graph)}>Load Next Layer</Button>
            {/* <HideButton
               isHidden={this.state.isHidden}
               setHidden={this.setHidden}
               direction={"down"}
            /> */}
         </Box>
      );

   }
}

export default ButtonPane;
