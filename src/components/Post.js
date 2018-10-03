import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import React from 'react'

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <Layout>
      <Helmet title={`${post.frontmatter.title} - cdaringe - blog`} />
      <div>
        <h1>{post.frontmatter.title}</h1>
        <div className='markdown-body' dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
