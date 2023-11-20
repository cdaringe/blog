import logo from "../images/logo.png";
import PropTypes from "prop-types";
import React from "react";

import "./rrssb.css";
import "./crisp.css";
import "./gfm.css";
import "./gfm-hacks.css";
import * as layoutStyles from "./layout.module.css";
import * as followStyles from "./rrssb-hacks.module.css";
import ProjectLink from "./ProjectLink";
import SocialIcon from "./SocialIcon";
// import { Emoji } from "./Emoji";

// <a target="_blank" href="http://instagram.com/username"><i className="fa fa-instagram fa-2x"></i></a>
// <a target="_blank" href="http://vimeo.com/username"><i className="fa fa-vimeo-square fa-2x"></i></a>
// <a target="_blank" href="http://flickr.com/username"><i className="fa fa-flickr fa-2x"></i></a>
// <a target="_blank" href="http://pinterest.com/username"><i className="fa fa-pinterest-square fa-2x"></i></a>
// <a target="_blank" href="http://username.tumblr.com"><i className="fa fa-tumblr-square fa-2x"></i></a>

function Layout({ children }) {
  return (
    <div>
      <header id="header">
        <a id="logo" href="/">
          <img className={`${layoutStyles.logo}`} src={logo} alt="logo" />
        </a>
        <h1>
          <a href="/">cdaringe</a>
        </h1>
        <p>learnings, nerdisms, bicycles</p>
        <div id="follow-icons">
          {[
            {
              href: "http://github.com/cdaringe",
              iconName: "fa-github-square",
            },
            {
              href: "http://youtube.com/cdaringe",
              iconName: "fa-youtube-square",
            },
            {
              href: "www.linkedin.com/pub/christopher-dieringer",
              iconName: "fa-linkedin-square",
            },
            {
              href: "mailto:cdaringe@gmail.com",
              iconName: "fa-envelope-square",
            },
            // {
            //   href: "http://blog.cdaringe.com/rss",
            //   iconName: "fa-rss-square",
            // },
          ].map((props, i) => (
            <SocialIcon
              key={i}
              {...{ ...props, iconClass: followStyles.icon }}
            />
          ))}
        </div>
        <h6>
          <a href="/about">about</a>
        </h6>
        {[
          ["https://cdaringe.github.io/rad/", "rad"],
          ["https://upnup.cdaringe.com", "up'n'up"],
          ["https://dvd.js.org?names=han,luke,leia,chewy", "dvd.js.org"],
          ["https://cowtown.surge.sh", "cowtown"],
          ["https://cdaringe.github.io/standup/", "standup"],
          ["https://diary.cdaringe.com/", "github diary"],
          ["https://dino-dna.github.io/donut", "donut"],
          ["https://truth.cdaringe.com", "truth.lol"],
          ["https://github.com/cdaringe/freshawair", "freshawair"],
          [
            "https://fish.js.org/?names=cdaringe,your-name-here,your-best-friend,your-mom",
            "fish.js.org",
          ],
          [
            {
              githubUrl: "https://github.com/cdaringe/factorio-type-kit",
              children: "factorio-type-kit",
              dead: true,
            },
          ],
        ].map(([href, children, extras], i) =>
          typeof href === "string" ? (
            <ProjectLink key={i} {...{ href, children }} />
          ) : (
            <ProjectLink key={i} {...href} />
          ),
        )}
        <ProjectLink
          children="red-or-green"
          href="https://redorgreen.org"
          githubUrl="https://github.com/cdaringe/redorgreen"
          dead
        />
        <ProjectLink
          href="https://senorsalsa.org"
          children="senor-salsa"
          dead
        />
      </header>
      <div className={layoutStyles.content}>{children}</div>
      <footer id="footer">
        <section id="footer-message">
          © {new Date().getFullYear()} cdaringe. Built with{" "}
          <a
            href="https://www.gatsbyjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gatsby
          </a>{" "}
          and a hacked version of{" "}
          <a
            href="https://github.com/kathyqian/crisp-ghost-theme"
            target="_blank"
            rel="noopener noreferrer"
          >
            Crisp
          </a>{" "}
          by{" "}
          <a
            href="http://kathyqian.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            kathy
          </a>
          .
        </section>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
