import { graphql } from "gatsby";
import Layout from "./Layout";
import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

export { Head } from "./Head";

import Caption from "./Caption";
import Img from "./Img";
import ImgLink from "./ImgLink";
import { FrontmatterProvider } from "./FrontMatterContext";

const shortcodes = { Caption, Img, ImgLink };

export default function Post(props) {
  const { data } = props;
  if (typeof data.mdx.frontmatter !== "object") {
    throw new Error("missing frontmatter");
  }
  const {
    prettyDate,
    title = "",
    embeddedImagesLocal = [],
  } = data.mdx.frontmatter;
  return (
    <Layout>
      <div>
        <h1 style={{ marginBottom: 0 }}>{title}</h1>
        {prettyDate ? (
          <h6 style={{ margin: "0 0 0.6em 0", fontStyle: "italic" }}>
            {prettyDate}
          </h6>
        ) : null}
        <MDXProvider components={shortcodes}>
          <FrontmatterProvider value={data.mdx.frontmatter}>
            {props.children}
          </FrontmatterProvider>
        </MDXProvider>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        prettyDate: date(formatString: "MMMM D, YYYY", locale: "us")
        title
        embeddedImagesLocal {
          publicURL
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`;
