import React, { useState } from "react";
import Graph from "./d3/Graph";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import ColorLegend from "./ColorLegend";
import OptionsPane from "./OptionsPane";
import ButtonPane from "./ButtonPane";
import AddPane from "./AddPane";
import ErrorText from "./ErrorText";

const Vispage = ({
  errorText,
  setErrorText,
  setGraph,
  handleSizeOption,
  handleColorOption,
  colorOption,
  options,
  nodesChanged,
  setNodesChanged,
  nodes,
  links,
}) => {
  return (
    <Box>
      {/* <ErrorText text={errorText} /> */}
      <Flex>
        <Sidebar nodes={nodes} links={links} />
        <Box id="graph-container" minW={500} minH={500}>
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
        <Spacer />
        <Flex className="top-right" m={5}>
          <ColorLegend colorOption={colorOption} />
          <OptionsPane
            options={options}
            setColorOption={handleColorOption}
            setSizeOption={handleSizeOption}
          />
        </Flex>
      </Flex>

      {/* <Sidebar nodes={nodes} links={links} /> */}
      {/* <Box className="top-right">
          <ColorLegend colorOption={colorOption} />
          <OptionsPane
            options={options}
            setColorOption={handleColorOption}
            setSizeOption={handleSizeOption}
          />
        </Box> */}
      {/* <AddPane
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
        /> */}
      {/* <Graph
          nodes={nodes}
          links={links}
          nodesChanged={nodesChanged}
          setNodesChanged={setNodesChanged}
          setGraph={setGraph}
          setErrorText={setErrorText}
          options={options}
        /> */}
    </Box>
  );
};

export default Vispage;
