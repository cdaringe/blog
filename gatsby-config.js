const markdown = [
  "gatsby-plugin-sharp",
  {
    resolve: "gatsby-transformer-remark",
    options: {
      plugins: [
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
];

module.exports = {
  flags: {
    // FAST_DEV: true,
    // FAST_REFRESH: true,
    // PRESERVE_WEBPACK_CACHE: true,
  },
  siteMetadata: {
    title: " // cdaringe - blog",
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "src",
        path: `${__dirname}/src/`,
      },
    },
    ...markdown,
    "gatsby-plugin-react-helmet",
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
    // 'gatsby-plugin-offline'
    "gatsby-plugin-remove-serviceworker",
  ],
};
