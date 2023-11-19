import { graphql } from "gatsby";
import Helmet from "react-helmet";
import Layout from "./Layout";
import React from "react";
import { MDXProvider } from "@mdx-js/react";

export { Head } from "./Head";

const Caption = ({ children, style, ...rest }) => (
  <small
    style={{ display: "block", width: "100%", textAlign: "center", ...style }}
    {...rest}
  >
    {children}
  </small>
);

const Img = ({ style, ...rest }) => (
  <img style={{ margin: "auto", display: "block", width: "50%" }} {...rest} />
);

const shortcodes = { Caption, Img };

export default function Post(props) {
  const { data } = props;

  const { prettyDate, title = "" } = data.mdx.frontmatter || {};
  return (
    <Layout>
      <Helmet title={`${title} - cdaringe - blog`} />
      <div>
        <h1 style={{ marginBottom: 0 }}>{title}</h1>
        {prettyDate && (
          <h6 style={{ margin: "0 0 0.6em 0", fontStyle: "italic" }}>
            {prettyDate}
          </h6>
        )}
        <MDXProvider components={shortcodes}>{props.children}</MDXProvider>
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
      }
    }
  }
`;
