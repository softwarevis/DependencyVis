import React, { Component } from "react";
import "./css/Sidebar.css";
import "./css/tooltip.css";
import HideButton, { TRANSFORMS } from "./HideButton";
import { getDocumentSize } from "./utils/utils";
import { Box, Flex, Button } from "@chakra-ui/react";
import { TriangleUpIcon } from "@chakra-ui/icons";

const { useState } = React;

function valueToString(key, value) {
  if (!value) return "";
  let v = value;
  switch (key) {
    case "created":
    case "updated":
      v = value.split("T")[0];
      break;
    case "prMeanTime":
      v = `${(value / 1000 / 60 / 60 / 24).toFixed(1)} days`;
      break;
    default:
  }
  return `${key}: ${v}`;
}

const ListNode = (props) => {
  const [active, setActive] = useState(false); // solely to update when clicked
  const node = props.node;
  const toggleActive = () => {
    console.log(node)
    node.active = !node.active;
    setActive(!active);
    if (active == true) {
      let ele = document.getElementById(node.id);
      if (ele) {
        ele.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      }
    }
  };

  if (!node.details) {
    return (
      <li>
        <span className={"sidebar-bullet"}>{node.id}</span>
      </li>
    );
  }

  if (!node.active) {
    return (
      <li>
        <span className={"sidebar-caret"} id={node.id} onClick={toggleActive}>
          {node.id}
        </span>
      </li>
    );
  }

  const propElements = Object.entries(node.details).reduce(
    (elements, value) => {
      const str = valueToString(value[0], value[1]);
      if (str) {
        elements.push(
          <li key={value[0]}>
            <span className={"sidebar-bullet"}>{str}</span>
          </li>
        );
      }
      return elements;
    },
    []
  );

  return (
    <li>
      <span
        className={"sidebar-caret sidebar-caret-down"}
        onClick={toggleActive}
      >
        {node.id}
      </span>
      <ul style={{ marginLeft: "0.5em" }}>{propElements}</ul>
    </li>
  );
};

const CloseDropdownButton = (props) => {
  const closeNodes = () => {
    props.nodes.forEach((node) => {
      node.active = false;
    });
    props.toggleUpdate();
  };

  return (
    <Button
      // id={"sidebar-close-button"}
      // className={"tooltip sidebar-tooltip"}
      zIndex={4}
      onClick={closeNodes}
    >
      <TriangleUpIcon />
      {/* <span className={"tooltiptext sidebar-tooltiptext"}>
        {"Close All Dropdowns"}
      </span> */}
    </Button>
  );
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      isHidden: false,
      update: false,
    };
  }

  // ---------------- helper functions ---------- //
  updateDimensions = () => {
    this.setState(getDocumentSize());
  };
  setHidden = (hidden) => {
    this.setState({ isHidden: hidden });
  };
  toggleUpdate = () => {
    this.setState({ update: !this.state.update });
  };

  // ---------------- render functions ---------- //
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    let nodes = this.props.nodes.map((value, index) => (
      <ListNode key={value.id} node={value} />
    ));
    let style = {};
    if (this.state.isHidden) style.transform = TRANSFORMS.LEFT;

    return (
      <Flex>
        <Box
          zIndex={2}
          bgColor="lightsteelblue"
          width={200}
          height="90vh"
          overflow="auto"
          m={5}
          borderRadius={10}
          boxShadow="dark-lg"
        >
          <Box id={"sidebar-list-container"}>
            <ul className={"sidebar-list"}>{nodes}</ul>
          </Box>
          {/* <HideButton
          isHidden={this.state.isHidden}
          setHidden={this.setHidden}
          direction={"right"}
        /> */}
        </Box>
        <Box mt={5}>
          <CloseDropdownButton
            nodes={this.props.nodes}
            toggleUpdate={this.toggleUpdate}
          />
        </Box>
      </Flex>
    );
  }
}

export default Sidebar;
