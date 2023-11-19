import React from "react";
import Emoji from "./Emoji.js";

export default function ProjectLink({
  children,
  githubUrl,
  dead,
  ...unhandled
}) {
  return (
    <>
      <h6>
        <a
          target="_blank"
          rel="noopener noreferrer"
          {...unhandled}
          href={dead && githubUrl ? githubUrl : unhandled.href}
        >
          {children}
          {dead && (
            <Emoji
              style={{ marginLeft: 4 }}
              label="project retired"
              children={"\u2620"}
            />
          )}
        </a>
      </h6>
    </>
  );
}
