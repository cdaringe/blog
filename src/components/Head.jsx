import React from "react";
import { useStaticQuery, graphql } from "gatsby";

export function Head() {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (
    <>
      <title>{data.site.siteMetadata.title}</title>
      {[
        { name: "cdaringe", content: "cdaringe-blog" },
        { name: "keywords", content: "cdaringe,blog" },
      ].map((it) => (
        <meta key={it.name} name={it.name} content={it.content} />
      ))}
      <link
        href="//fonts.googleapis.com/css?family=Open+Sans:300italic,700italic,300,700"
        rel="stylesheet"
        type="text/css"
      />
      <link
        href="//fonts.googleapis.com/css?family=Bree+Serif"
        rel="stylesheet"
        type="text/css"
      />
      <link
        href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <html lang="en" />
    </>
  );
}
