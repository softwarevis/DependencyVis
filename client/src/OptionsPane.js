import React, { Component } from "react";
import "./css/OptionsPane.css";
import "./css/tooltip.css";
import HideButton, { TRANSFORMS } from "./HideButton";
import OPTIONS, { createHandlers } from "./Options";
import { Box } from "@chakra-ui/react";

// -------------- Radio Button ------------- //

const RadioButton = (props) => {
  return (
    <p className={"tooltip options-tooltip options-choice"}>
      <label>
        <input
          type="radio"
          id={props.name}
          name={props.group}
          value={props.name}
          checked={props.option === props.name}
          onChange={props.handler}
        />
        {props.contents}
      </label>
      <span className={"tooltiptext options-tooltiptext"}>{props.tooltip}</span>
    </p>
  );
};

// -------------- Options Pane ------------- //

class OptionsPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
    };
  }
  setHidden = (hidden) => {
    this.setState({ isHidden: hidden });
  };
  handlers = createHandlers(this.props);

  render() {
    let style = {};
    if (this.state.isHidden) style.transform = TRANSFORMS.UP;

    // set pane title
    let toRender = [
      <p key={"pane_title"} className={"options-title"}>
        {"Options"}
      </p>,
    ];

    OPTIONS.forEach((opt, index) => {
      // push option's title element
      toRender.push(
        <p key={index} className={"options-header"}>
          {opt.TITLE}
        </p>
      );

      // push options
      opt.CHOICES.forEach((choice) => {
        toRender.push(
          <RadioButton
            key={index + choice.NAME}
            name={choice.NAME}
            group={opt.TITLE}
            contents={choice.DISPLAY}
            option={this.props.options[opt.ID]}
            tooltip={choice.TOOLTIP}
            handler={this.handlers[opt.ID]}
          />
        );
      });
    });

    return (
      <Box
        m={1}
        px="1em"
        pt="0.5 em"
        pb="0.5 em"
        zIndex={2}
        width="fit-content"
        height="fit-content"
        bgColor="lightsteelblue"
        borderRadius={10}
        boxShadow="dark-lg"

      >
        {toRender}
        {/* <HideButton
          isHidden={this.state.isHidden}
          setHidden={this.setHidden}
          direction={"down"}
        /> */}
      </Box>
    );
  }
}

export default OptionsPane;
