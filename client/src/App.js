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

const { useState } = React;
const App = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [nodesChanged, setNodesChanged] = useState(false);
  const [showForm, setFormVisibility] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [dbOption, setDBOption] = useState(true);
  const [loadAheadOption, setLoadAheadOption] = useState(true); // switch to false to keep from loading all information ahead of time
  const [colorOption, setColorOption] = useState("loaded");
  const [sizeOption, setSizeOption] = useState("nothing");

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
                setErrorText={setErrorText}
               //  showForm={showForm}
               //  setFormVisibility={setFormVisibility}
               dbOption={dbOption}
                setDBOption={setDBOption}
                options={options}
              />
            }
          />
          <Route
            path="vispage"
            element={
              <Box>
                <ErrorText text={errorText} />
                <Sidebar nodes={nodes} links={links} />
                <Box className="top-right">
                  <ColorLegend colorOption={colorOption} />
                  <OptionsPane
                    options={options}
                    setColorOption={handleColorOption}
                    setSizeOption={handleSizeOption}
                  />
                </Box>
                <AddPane
                  nodes={nodes}
                  links={links}
                  setGraph={setGraph}
                  options={options}
                  setErrorText={setErrorText}
                />
                <ButtonPane
                  nodes={nodes}
                  links={links}
                  setGraph={setGraph}
                  options={options}
                  setErrorText={setErrorText}
                />
                <Graph
                  nodes={nodes}
                  links={links}
                  nodesChanged={nodesChanged}
                  setNodesChanged={setNodesChanged}
                  setGraph={setGraph}
                  setErrorText={setErrorText}
                  options={options}
                />
              </Box>
            }
          />
        </Routes>
      </Box>
    </ChakraProvider>
  );
};

export default App;
