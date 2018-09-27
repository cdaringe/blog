import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return <span>{props.text}</span>
  }
}

const IndexPage = ({ data, pageContext }) => {
  const { group, index, first, last, pageCount } = pageContext
  const previousUrl = index - 1 === 1 ? '' : (index - 1).toString()
  const nextUrl = (index + 1).toString()
  return (
    <Layout>
      {group.map(({ node }) => (
        <div key={node.id} className='post blogListing'>
          {/* <div className="date">{node.frontmatter.date}</div> */}
          <h3 className='post-title'>
            <Link className='blogUrl' to={node.fields.slug}>
              {node.frontmatter.title}
            </Link>
            <span className='separator'> · </span>
            {node.frontmatter.prettyDate}
          </h3>
          <div>{node.excerpt}</div>
        </div>
      ))}
      <nav className='pagination'>
        {!first && <NavLink className='newer-posts' url={previousUrl} text='← Newer' />}
        {!first && <span className='separator'>|</span>}
        <span className='page-number'>
          Page {index} of {pageCount}
        </span>
        {!last && <span className='separator'>|</span>}
        {!last && <NavLink className='older-posts' url={nextUrl} text='Older →' />}
      </nav>
    </Layout>
  )
}

export default IndexPage
