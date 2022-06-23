import React, { useState } from "react";
import Graph from "./d3/Graph";
import { Box, Button, Center, Flex, Spacer } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import ColorLegend from "./ColorLegend";
import OptionsPane from "./OptionsPane";
import ButtonPane from "./ButtonPane";
import AddPane from "./AddPane";
import ErrorText from "./ErrorText";
import { Link } from "react-router-dom";


const handleClick  = (navigate) =>  {
  navigate('/', {replace: true});
}

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
  navigate
}) => {
  return (
    <Box>
      {/* <ErrorText text={errorText} /> */}
      <Flex>
        <Box>
          {/* <Button type="submit" zIndex={3} m={3} onClick={handleClick(navigate)} >Visualize another repo</Button> */}
          <Link to="/"><Button type="submit" zIndex={3} m={3}>Visualize another repo</Button></Link>
          <Sidebar nodes={nodes} links={links} />
        </Box>
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
        <ButtonPane
          nodes={nodes}
          links={links}
          setGraph={setGraph}
          options={options}
          setErrorText={setErrorText}
        />
        <Spacer />
        <Flex direction="column" className="top-right" m={5}>
          <Flex direction="row">
            <ColorLegend colorOption={colorOption} />
            <OptionsPane
              options={options}
              setColorOption={handleColorOption}
              setSizeOption={handleSizeOption}
            />
          </Flex>
          <Spacer />
          <AddPane
            nodes={nodes}
            links={links}
            setGraph={setGraph}
            options={options}
            setErrorText={setErrorText}
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
