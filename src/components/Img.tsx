import {
  GatsbyImage,
  getImage,
  type IGatsbyImageData,
} from "gatsby-plugin-image";
import type { CSSProperties, ImgHTMLAttributes } from "react";
import { useFrontmatter } from "./FrontMatterContext";

const DEFAULT_STYLE = {
  margin: "auto",
  display: "block",
} satisfies CSSProperties;

const WIDTHS = {
  md: "50%",
  lg: "75%",
  xl: "90%",
  full: "100%",
} as const satisfies Record<string, CSSProperties["width"]>;

export type ImgWidth = keyof typeof WIDTHS;

const SUBTLE_SHADOW = "0 4px 16px rgba(0, 0, 0, 0.3)";

const ROUNDING_RADII = {
  sm: 6,
  md: 12,
  lg: 24,
  full: "9999px",
} as const satisfies Record<string, CSSProperties["borderRadius"]>;

export type ImgRounding = boolean | keyof typeof ROUNDING_RADII;

type ImageNode = {
  base?: string;
  publicURL?: string;
  childImageSharp?: {
    gatsbyImageData: IGatsbyImageData;
  };
};

type Frontmatter = {
  embeddedImagesLocal?: ImageNode[];
};

export type ImgProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "height" | "onLoad" | "src" | "srcSet" | "style" | "width"
> & {
  alt?: string;
  basename?: string;
  clickForFullscreen?: boolean;
  idx?: number;
  rounded?: ImgRounding;
  shadow?: boolean;
  src?: string;
  style?: CSSProperties;
  /** Width preset; defaults to md (50%). style.width overrides this preset. */
  width?: ImgWidth;
};

type InternalImgProps = Omit<
  ImgProps,
  "basename" | "clickForFullscreen" | "rounded" | "shadow" | "width"
> & {
  imageIdx?: number;
  imageNode?: ImageNode;
};

const InternalImg = ({
  alt = "",
  imageNode,
  src,
  imageIdx,
  style,
  ...rest
}: InternalImgProps) => {
  if (imageNode?.childImageSharp) {
    const imageData = getImage(imageNode);
    if (!imageData) {
      throw new Error(`missing childImageSharp data at idx: ${imageIdx}`);
    }
    return <GatsbyImage image={imageData} style={style} alt={alt} {...rest} />;
  }
  return (
    <img src={imageNode?.publicURL || src} style={style} alt={alt} {...rest} />
  );
};

const Img = ({
  style,
  src,
  idx,
  basename,
  clickForFullscreen,
  rounded,
  shadow,
  width = "md",
  ...rest
}: ImgProps) => {
  const fm = useFrontmatter() as Frontmatter;
  const gatsbyImgSrc =
    basename !== undefined
      ? fm.embeddedImagesLocal?.find((image) => image.base === basename)
      : typeof idx === "number"
        ? fm.embeddedImagesLocal?.[idx]
        : undefined;
  if (!gatsbyImgSrc && !src) {
    throw new Error(
      basename !== undefined
        ? `no image found with basename: ${basename}`
        : `no image found at idx: ${idx}`,
    );
  }

  const roundedVariant = rounded === true ? "md" : rounded;
  const roundedStyle: CSSProperties = roundedVariant
    ? {
        borderRadius: ROUNDING_RADII[roundedVariant],
        overflow: "hidden",
      }
    : {};

  const mergedStyle = {
    ...DEFAULT_STYLE,
    width: WIDTHS[width],
    ...roundedStyle,
    ...(shadow ? { boxShadow: SUBTLE_SHADOW } : {}),
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
