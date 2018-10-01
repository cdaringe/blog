/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const createPaginatedPages = require('gatsby-paginate')
var path = require('path')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type !== `MarkdownRemark`) return
  createNodeField({
    node,
    name: `slug`,
    value: node.frontmatter.slug
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const { data } = await graphql(`
    {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            id
            fileAbsolutePath
            frontmatter {
              title
              slug
              date
              prettyDate: date(formatString: "MMMM D, YYYY", locale: "us")
              featured
              draft
              _PARENT
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  const pages = []
  const posts = []
  const postsIncubating = []
  data.allMarkdownRemark.edges.forEach(edge => {
    const { node } = edge
    const isPage = node.fileAbsolutePath.match(/pages\/.+\.md/)
    const isIncubating = node.fileAbsolutePath.match(/posts\.incubating/)
    if (isPage) {
      pages.push(edge)
    } else if (isIncubating) {
      postsIncubating.push(edge)
    } else {
      posts.push(edge)
    }
  })
  createPaginatedPages({
    edges: posts,
    createPage,
    pageTemplate: path.resolve(__dirname, 'src/templates/index.js'),
    pageLength: 10, // This is optional and defaults to 10 if not used
    pathPrefix: '', // This is optional and defaults to an empty string if not used
    context: {} // This is optional and defaults to an empty object if not used
  })
  data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/post.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug
      }
    })
  })
}
