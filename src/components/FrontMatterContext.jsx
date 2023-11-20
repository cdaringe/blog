import React from "react";

const frontmatterContext = React.createContext({});
export const FrontmatterProvider = frontmatterContext.Provider;
export const useFrontmatter = () => React.useContext(frontmatterContext);
