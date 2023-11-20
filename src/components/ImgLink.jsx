import React from "react";

const ImgLink = ({ src, imgProps, style, ...rest }) => {
  return (
    <a
      href={imgProps.src}
      target="_blank"
      rel="noreferrer"
      style={{
        margin: "auto",
        display: "block",
        ...style,
      }}
      {...rest}
    >
      <img
        {...imgProps}
        style={{
          margin: "auto",
          display: "block",
          width: "50%",
          ...imgProps.style,
        }}
      />
    </a>
  );
};

export default ImgLink;
