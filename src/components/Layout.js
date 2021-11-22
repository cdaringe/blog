import { StaticQuery, graphql } from "gatsby";
import Helmet from "react-helmet";
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
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={(data) => (
        <div>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: "cdaringe", content: "cdaringe-blog" },
              { name: "keywords", content: "cdaringe,blog" },
            ]}
          >
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
            />{" "}
            */}
            <html lang="en" />
          </Helmet>
          {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
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
              ].map((props) => (
                <SocialIcon {...{ ...props, iconClass: followStyles.icon }} />
              ))}
            </div>
            <h6>
              <a href="/about">about</a>
            </h6>
            {[
              ["https://cdaringe.github.io/rad/", "rad"],
              ["https://upnup.cdaringe.com", "up'n'up"],
              ["https://dvd.js.org?names=han,luke,leia,chewy", "dvd.js.org"],
              ["https://senorsalsa.org", "senor-salsa"],
              ["https://cowtown.surge.sh", "cowtown"],
              ["https://cdaringe.github.io/standup/", "standup"],
              ["https://diary.cdaringe.com/", "github diary"],
              ["https://dino-dna.github.io/donut", "donut"],
              ["https://truth.lol", "truth.lol"],
              ["https://github.com/cdaringe/freshawair", "freshawair"],
              [
                "https://cdaringe.github.io/factorio-type-kit/",
                "factorio-type-kit",
              ],
              [
                "https://fish.js.org/?names=cdaringe,your-name-here,your-best-friend,your-mom",
                "fish.js.org",
              ],
            ].map(([href, children]) => (
              <ProjectLink {...{ href, children }} />
            ))}
            <ProjectLink
              children="red-or-green"
              href="https://redorgreen.org"
              githubUrl="https://github.com/cdaringe/redorgreen"
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
      )}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
