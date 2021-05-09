import React from "react";

export default function SocialIcon({ iconName, iconClass, href, ...rest }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      key={href}
      {...rest}
    >
      <i className={`fa fa-2x ${iconName} ${iconClass}`} />
    </a>
  );
}
