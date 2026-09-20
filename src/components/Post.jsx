import { MDXProvider } from "@mdx-js/react";
import { graphql } from "gatsby";
import Caption from "./Caption";
import { FrontmatterProvider } from "./FrontMatterContext";
import Img from "./Img";
import ImgLink from "./ImgLink";
import Layout from "./Layout";

export { Head } from "./Head";

const shortcodes = { Caption, Img, ImgLink };

export default function Post(props) {
  const { data } = props;
  if (typeof data.mdx.frontmatter !== "object") {
    throw new Error("missing frontmatter");
  }
  const { prettyDate, title = "" } = data.mdx.frontmatter;
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
          base
          publicURL
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`;
