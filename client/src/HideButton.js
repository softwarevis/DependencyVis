import React from 'react'

const HIDEBUTTONSTYLE = {
   position: "absolute",
   //left: "100%",
   //top: "50%",
   //transform: "translate(0%, -50%)",
   padding: "0px"
}

function OpenState(open, close, x, y, tx, ty) {
   return {
      OPEN: open,
      CLOSE: close,
      LEFT: `${x}%`,
      TOP: `${y}%`,
      TRANSFORM: `translate(${tx}%, ${ty}%)`
   }
}

const OPEN_STATES = {
   // double down angle brackets, double up angle brackets
   UP: OpenState("\uFE3E", "\uFE3D", 50, 0, -50, -100),

   // double left carets, double right carets
   RIGHT: OpenState("\u27EA", "\u27EB", 100, 50, 0, -50),

   // double up angle brackets, double down angle brackets
   DOWN: OpenState("\uFE3D", "\uFE3E", 50, 100, -50, 0),
   
   // double right carets, double left carets
   LEFT: OpenState("\u27EB", "\u27EA", 0, 50, -100, -50),
}

const HideButton = props => {
   const toggleHidden = () => {
      props.setHidden(!props.isHidden);
   };
   let state = OPEN_STATES[props.direction.toUpperCase()];
   let style = Object.assign({}, HIDEBUTTONSTYLE);
   style.top = state.TOP;
   style.left = state.LEFT;
   style.transform = state.TRANSFORM;

   let buttonContents 
      = props.isHidden ? state.CLOSE : state.OPEN;

   return (
      <button style={style} 
            onClick={toggleHidden}>
         {buttonContents}
      </button>
   )
};

export default HideButton;
