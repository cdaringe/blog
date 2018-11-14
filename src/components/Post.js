import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from './Layout'
import React from 'react'

export default ({ data }) => {
  const post = data.markdownRemark
  const { prettyDate, title = '' } = post.frontmatter || {}
  return (
    <Layout>
      <Helmet title={`${title}cdaringe - blog`} />
      <div>
        <h1 style={{ marginBottom: 0 }}>{title}</h1>
        {prettyDate && <h6 style={{ margin: '0 0 0.6em 0', fontStyle: 'italic' }}>{prettyDate}</h6>}
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
        prettyDate: date(formatString: "MMMM D, YYYY", locale: "us")
        title
      }
    }
  }
`
