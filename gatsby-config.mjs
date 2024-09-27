import { dirname } from "path";
import { fileURLToPath } from "url";

const { DEBUG } = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import("gatsby").GatsbyConfig['plugins']} */
const mdx = [
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      extensions: [`.mdx`, `.md`],
      gatsbyRemarkPlugins: [
        "gatsby-remark-copy-linked-files",
        {
          resolve: "gatsby-remark-images",
          options: {
            // It's important to specify the maxWidth (in pixels) of
            // the content container as this plugin uses this as the
            // base for generating different widths of each image.
            maxWidth: 590,
          },
        },
        {
          resolve: "gatsby-remark-prismjs",
          options: {
            // Class prefix for <pre> tags containing syntax highlighting;
            // defaults to 'language-' (eg <pre class="language-js">).
            // If your site loads Prism into the browser at runtime,
            // (eg for use with libraries like react-live),
            // you may use this to prevent Prism from re-processing syntax.
            // This is an uncommon use-case though;
            // If you're unsure, it's best to use the default value.
            // classPrefix: 'language-',
            // This is used to allow setting a language for inline code
            // (i.e. single backticks) by creating a separator.
            // This separator is a string and will do no white-space
            // stripping.
            // A suggested value for English speakers is the non-ascii
            // character '›'.
            inlineCodeMarker: "›",
            // This lets you set up language aliases.  For example,
            // setting this to '{ sh: "bash" }' will let you use
            // the language "sh" which will highlight using the
            // bash highlighter.
            aliases: {},
            // This toggles the display of line numbers alongside the code.
            // To use it, add the following line in src/layouts/index.js
            // right after importing the prism color scheme:
            //  `require("prismjs/plugins/line-numbers/prism-line-numbers.css");`
            // Defaults to false.
            showLineNumbers: false,
          },
        },
      ],
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `posts`,
      path: `${__dirname}/src/`,
    },
  },
];

// @warn ONLY GENERATES IN PROD BUILDS!
/** @type {import("gatsby").GatsbyConfig['plugins'][number]} */
const feed =  {
  resolve: `gatsby-plugin-feed`,
  options: {
    query: `
      {
        site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }
      }
    `,
    feeds: [
      {
        serialize: ({ query: { site, allMdx } }) => {
          return allMdx.nodes.map(node => {
            return Object.assign({}, node.frontmatter, {
              title: node.frontmatter.title,
              date: node.frontmatter.date,
              url: site.siteMetadata.siteUrl + node.fields.slug,
              guid: site.siteMetadata.siteUrl + node.fields.slug,
            })
          })
        },
        query: `
          {
            allMdx(
              sort: { order: DESC, fields: [frontmatter___date] },
            ) {
              nodes {
                fields {
                  slug
                }
                frontmatter {
                  title
                  date
                }
              }
            }
          }
        `,
        output: "/rss.xml",
        title: "cdaringe rss feed",
        // optional configuration to insert feed reference in pages:
        // if `string` is used, it will be used to create RegExp and then test if pathname of
        // current page satisfied this regular expression;
        // if not provided or `undefined`, all pages will have feed reference inserted
        match: "^(?!.*about.?$).*$",
        // optional configuration to specify external rss feed, such as feedburner
        // link: "https://cdaringe.com.feedburner.com/gatsby/blog",
      },
    ],
  },
};

/** @type {import("gatsby").GatsbyConfig} */
const config = {
  flags: {},
  siteMetadata: {
    title: " // cdaringe - blog",
    siteUrl: "https://cdaringe.com",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    ...mdx,
    feed,
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/logo.png", // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-remove-serviceworker",
  ].filter(Boolean),
};

export default config;
