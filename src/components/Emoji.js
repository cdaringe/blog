import React from "react";

export function Emoji({ label, children, ...rest }) {
  return (
    <span
      role="img"
      aria-label={label}
      label={label}
      aria-hidden={!!label ? "false" : "true"}
      {...rest}
    >
      {children}
    </span>
  );
}
