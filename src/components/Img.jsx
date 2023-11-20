import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { useFrontmatter } from "./FrontMatterContext";

const DEFAULT_STYLE = { margin: "auto", display: "block", width: "50%" };

const Img = ({ style, idx, ...rest }) => {
  const fm = useFrontmatter();
  const gatsbyImgSrc = fm.embeddedImagesLocal?.[idx];
  if (!gatsbyImgSrc) {
    throw new Error(`no image found at idx: ${idx}`);
  }
  if (gatsbyImgSrc.childImageSharp) {
    <GatsbyImage image={gatsbyImgSrc} style={DEFAULT_STYLE} {...rest} />;
  }
  return (
    <img
      src={gatsbyImgSrc.publicURL}
      style={{ ...DEFAULT_STYLE, ...style }}
      {...rest}
    />
  );
};

export default Img;
