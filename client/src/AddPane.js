import React from "react";
import "./css/AddPane.css";
import HideButton, { TRANSFORMS } from "./HideButton";
import { addSingle } from "./utils/d3";
import { Box, Flex, FormControl, Input, Button } from "@chakra-ui/react";
const { useState } = React;

const AddPane = (props) => {
  const [isHidden, setHidden] = useState(false);
  const [dependency, setDependency] = useState("");

  var addDependency = async (graph, name) => {
    console.log("add dependency", name, graph);

    let ng = await addSingle(
      name,
      graph.nodes[0],
      graph,
      props.options,
      props.setErrorText
    );
    if (ng) props.setGraph(ng);
  };

  var handleSubmit = (event) => {
    event.preventDefault();
    let graph = {
      nodes: props.nodes,
      links: props.links,
    };
    addDependency(graph, dependency);
  };

  let style = {};
  if (isHidden) style.transform = TRANSFORMS.DOWN;

  return (
    <Box>
      <Flex>
        <FormControl onSubmit={handleSubmit}>
          <Input
            type="text"
            value={dependency}
            onChange={(event) => setDependency(event.target.value)}
            placeholder="Try a dependency here"
            required
          />
        </FormControl>
          <Button type="submit">Add</Button>
      </Flex>
      {/* <HideButton
            isHidden={isHidden}
            setHidden={setHidden}
            direction={"up"}
         /> */}
    </Box>
  );
};

export default AddPane;
