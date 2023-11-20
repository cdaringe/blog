import React from "react";

const Caption = ({ children, style, ...rest }) => (
  <small
    style={{ display: "block", width: "100%", textAlign: "center", ...style }}
    {...rest}
  >
    {children}
  </small>
);

export default Caption;
