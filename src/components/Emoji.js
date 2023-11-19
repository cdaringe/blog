import React from "react";

export default function Emoji({ label, children, ...rest }) {
  return (
    <span
      role="img"
      aria-label={label}
      label={label}
      aria-hidden={label ? "false" : "true"}
      {...rest}
    >
      {children}
    </span>
  );
}
