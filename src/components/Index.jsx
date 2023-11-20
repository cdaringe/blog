import { Link } from "gatsby";
import Layout from "./Layout";
import React from "react";

export { Head } from "./Head";

const IndexPage = ({ data: _data, pageContext }) => {
  const { group, index, first, last, pageCount } = pageContext;
  const previousUrl = index - 1 === 1 ? "" : (index - 1).toString();
  const nextUrl = (index + 1).toString();
  return (
    <Layout>
      {group.map(({ node }) => (
        <div key={node.id} className="post blogListing">
          <h3 className="post-title">
            <Link className="blogUrl" to={node.frontmatter.slug}>
              {node.frontmatter.title}
            </Link>
            <span className="separator"> · </span>
            {node.frontmatter.prettyDate}
          </h3>
          <div>{node.excerpt}</div>
        </div>
      ))}
      <nav className="pagination">
        {!first && (
          <Link className="newer-posts" to={`/${previousUrl}`}>
            ← Newer
          </Link>
        )}
        {!first && <span className="separator">|</span>}
        <span className="page-number">
          Page {index} of {pageCount}
        </span>
        {!last && <span className="separator">|</span>}
        {!last && (
          <Link className="older-posts" to={`/${nextUrl}`}>
            Older →
          </Link>
        )}
      </nav>
    </Layout>
  );
};

export default IndexPage;
