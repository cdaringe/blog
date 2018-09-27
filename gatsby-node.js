/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const { createFilePath } = require(`gatsby-source-filesystem`)
const createPaginatedPages = require('gatsby-paginate')
var path = require('path')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const { data } = await graphql(`
    {
      allMarkdownRemark(sort: {
        fields: [frontmatter___date]
        order: DESC
      }) {
        edges {
          node {
            id
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
  createPaginatedPages({
    edges: data.allMarkdownRemark.edges,
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
