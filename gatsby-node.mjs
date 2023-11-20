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
  if (node.internal.type === "Mdx") {
    const value = node.frontmatter.slug.match(/^\//)
      ? node.frontmatter.slug
      : `/${node.frontmatter.slug}`;
    createNodeField({
      node,
      name: "slug",
      value,
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
      acc.allNodes.push(edge.node);
      const isPage = node.internal.contentFilePath.includes("src/pages");
      if (isPage) {
        acc.pages.push(edge);
      } else {
        acc.posts.push(edge);
      }
      return acc;
    },
    { pages: [], posts: [], allNodes: [] },
  );
  createPaginatedPages({
    edges: posts,
    createPage,
    pageTemplate: path.resolve(__dirname, "./src/components/Index.jsx"),
    pageLength: 10, // This is optional and defaults to 10 if not used
    pathPrefix: "", // This is optional and defaults to an empty string if not used
    context: {}, // This is optional and defaults to an empty object if not used
  });
  allNodes.forEach((node) => {
    const {
      frontmatter: { slug },
      id,
    } = node;
    if (!id || !slug) {
      throw new Error(`invalid node: ${JSON.stringify(node)}`);
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
