import React from "react";

const Img = ({ style, ...rest }) => (
  <img style={{ margin: "auto", display: "block", width: "50%" }} {...rest} />
);

export default Img;
