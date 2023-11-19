module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:mdx/recommended",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "mdx"],
  rules: {
    "no-unused-vars": "off",
    "react/prop-types": "off",
    "react/no-children-prop": "off",
    "no-irregular-whitespace": "off",
  },
  settings: {
    "mdx/code-blocks": false,
  },
};
