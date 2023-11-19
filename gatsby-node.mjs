/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
import createPaginatedPages from "gatsby-paginate";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  console.log(node.internal.type);
  if (node.internal.type === "Mdx") {
    createNodeField({
      node,
      name: "slug",
      value: node.frontmatter.slug.match(/^\//)
        ? node.frontmatter.slug
        : `/${node.frontmatter.slug}`,
    });
  }
};

const PAGES_QUERY = `{
  allMdx(sort: {frontmatter: {date: DESC}}) {
    edges {
      node {
        id
        frontmatter {
          date
          draft
          featured
          prettyDate: date(formatString: "MMMM D, YYYY", locale: "us")
          slug
          title
        }
        internal {
          contentFilePath
        }
      }
    }
  }
}`;

export const createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const { errors, data } = await graphql(PAGES_QUERY);
  if (errors) {
    reporter.panicOnBuild("Error loading MDX result", errors);
    return;
  }

  const { pages, posts, allNodes } = data.allMdx.edges.reduce(
    (acc, edge) => {
      const { node } = edge;
      const isPage = node.internal.contentFilePath.match(/pages\/.+\.md/);
      if (isPage) {
        acc.pages.push(edge);
      } else {
        acc.posts.push(edge);
      }
      acc.allNodes.push(edge.node);
      return acc;
    },
    { pages: [], posts: [], allNodes: [] },
  );
  createPaginatedPages({
    edges: posts,
    createPage,
    pageTemplate: path.resolve(__dirname, "./src/components/Index.js"),
    pageLength: 10, // This is optional and defaults to 10 if not used
    pathPrefix: "", // This is optional and defaults to an empty string if not used
    context: {}, // This is optional and defaults to an empty object if not used
  });
  allNodes.forEach((node) => {
    const {
      frontmatter: { slug },
      id,
    } = node;
    console.log(node.internal.type);
    if (!id || !slug) {
      throw new Error(`invalid node: ${JSON.stringify(node)}`);
    }

    // debug idea
    if (slug.includes("components/Post")) {
      throw new Error("wtf");
    }

    const componentFilename = path.resolve(
      __dirname,
      "./src/components/Post.jsx",
    );
    createPage({
      path: slug,
      // https://www.gatsbyjs.com/docs/how-to/routing/mdx/
      component: `${componentFilename}?__contentFilePath=${node.internal.contentFilePath}`,

      // You can use the values in this context in
      // our page layout component
      context: { id },
    });
  });
};
