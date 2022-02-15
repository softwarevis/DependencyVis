import React from "react";
import Graph from "./d3/Graph";
import Sidebar from "./Sidebar";
import Form from "./Form";
import ColorLegend from "./ColorLegend";
import OptionsPane from "./OptionsPane";
import ButtonPane from "./ButtonPane";
import AddPane from "./AddPane";
import ErrorText from "./ErrorText";
import { ChakraProvider } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Routes, Route, Link } from "react-router-dom";
import Vispage from "./Vispage";

const { useState } = React;
const App = () => {
  const [errorText, setErrorText] = useState("");
  const [dbOption, setDBOption] = useState(true);
  const [loadAheadOption, setLoadAheadOption] = useState(true); // switch to false to keep from loading all information ahead of time
  const [colorOption, setColorOption] = useState("loaded");
  const [loadingPageVisibility, setLoadingPageVisibility] = useState(false);
  const [sizeOption, setSizeOption] = useState("nothing");
  const [nodesChanged, setNodesChanged] = useState(false);
  const [links, setLinks] = useState([]);
  const [nodes, setNodes] = useState([]);

  const setGraph = (graph) => {
    if (graph) {
      if (graph.nodes) setNodes(graph.nodes);
      if (graph.links) setLinks(graph.links);
    }
    setNodesChanged(true);
  };

  const handleColorOption = (option) => {
    setColorOption(option);
    setNodesChanged(true);
  };

  const handleSizeOption = (option) => {
    setSizeOption(option);
    setNodesChanged(true);
  };

  let options = {
    mongodb: dbOption,
    loadAhead: loadAheadOption,
    color: colorOption,
    size: sizeOption,
  };
  console.log("options", options);
  return (
    <ChakraProvider>
      <Box id="App">
        <Routes>
          <Route
            path="/"
            element={
              <Form
                setGraph={setGraph}
                // setLoadingPageVisibility={setLoadingPageVisibility}
                setErrorText={setErrorText}
                dbOption={dbOption}
                setDBOption={setDBOption}
                options={options}
              />
            }
          />
          <Route
            path="vispage"
            element={
              <Vispage
                errorText={errorText}
                setErrorText={setErrorText}
                setGraph={setGraph}
                handleSizeOption={handleSizeOption}
                handleColorOption={handleColorOption}
                colorOption={colorOption}
                options={options}
                nodesChanged={nodesChanged}
                setNodesChanged={setNodesChanged}
                nodes={nodes}
                links={links}
              />
            }
          />
        </Routes>
      </Box>
    </ChakraProvider>
  );
};

export default App;
