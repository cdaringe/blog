import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { useFrontmatter } from "./FrontMatterContext";

const DEFAULT_STYLE = { margin: "auto", display: "block", width: "50%" };

const InternalImg = ({ imageNode, src, imageIdx, style, ...rest }) => {
  if (imageNode?.childImageSharp) {
    const imageData = getImage(imageNode);
    if (!imageData) {
      throw new Error(`missing childImageSharp data at idx: ${imageIdx}`);
    }
    return <GatsbyImage image={imageData} style={style} {...rest} />;
  }
  return <img src={imageNode?.publicURL || src} style={style} {...rest} />;
};

const Img = ({ style, src, idx, clickForFullscreen, ...rest }) => {
  const fm = useFrontmatter();
  const gatsbyImgSrc = fm.embeddedImagesLocal?.[idx];
  if (!gatsbyImgSrc && !src) {
    throw new Error(`no image found at idx: ${idx}`);
  }

  const mergedStyle = {
    ...DEFAULT_STYLE,
    ...style,
    ...(clickForFullscreen ? { cursor: "zoom-in" } : {}),
  };

  const imageEl = (
    <InternalImg
      imageNode={gatsbyImgSrc}
      imageIdx={idx}
      style={mergedStyle}
      src={src}
      {...rest}
    />
  );

  if (clickForFullscreen && gatsbyImgSrc?.publicURL) {
    return (
      <a href={gatsbyImgSrc.publicURL} style={{ display: "block" }}>
        {imageEl}
      </a>
    );
  }

  return imageEl;
};

export default Img;
