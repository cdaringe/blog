import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import logo from '../images/logo.png'
import PropTypes from 'prop-types'
import React from 'react'

import './crisp.css'
import './rrssb.css'
import './gfm.css'
import './gfm-hacks.css'
import layoutStyles from './layout.module.css'
import followStyles from './rrssb-hacks.module.css'

// <a target="_blank" href="http://instagram.com/username"><i className="fa fa-instagram fa-2x"></i></a>
// <a target="_blank" href="http://vimeo.com/username"><i className="fa fa-vimeo-square fa-2x"></i></a>
// <a target="_blank" href="http://flickr.com/username"><i className="fa fa-flickr fa-2x"></i></a>
// <a target="_blank" href="http://pinterest.com/username"><i className="fa fa-pinterest-square fa-2x"></i></a>
// <a target="_blank" href="http://username.tumblr.com"><i className="fa fa-tumblr-square fa-2x"></i></a>

const Layout = ({ children }) => (
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
    render={data => (
      <div>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'cdaringe', content: 'cdaringe-blog' },
            { name: 'keywords', content: 'cdaringe,blog' }
          ]}
        >
          <link
            href='//fonts.googleapis.com/css?family=Open+Sans:300italic,700italic,300,700'
            rel='stylesheet'
            type='text/css'
          />
          <link href='//fonts.googleapis.com/css?family=Bree+Serif' rel='stylesheet' type='text/css' />
          <link href='//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' rel='stylesheet' /> */}
          <html lang='en' />
        </Helmet>
        {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
        <header id='header'>
          <a id='logo' href='/'>
            <img className={`${layoutStyles.logo}`} src={logo} alt='logo' />
          </a>
          <h1>
            <a href='/'>cdaringe</a>
          </h1>
          <p>learnings, nerdisms, bicycles</p>
          <div id='follow-icons'>
            {[
              {
                href: 'http://github.com/cdaringe',
                iconName: 'fa-github-square'
              },
              {
                href: 'http://youtube.com/cdaringe',
                iconName: 'fa-youtube-square'
              },
              {
                href: 'www.linkedin.com/pub/christopher-dieringer',
                iconName: 'fa-linkedin-square'
              },
              {
                href: 'http://plus.google.com/+ChrisDieringer',
                iconName: 'fa-google-plus'
              },
              {
                href: 'mailto:cdaringe@gmail.com',
                iconName: 'fa-envelope-square'
              },
              {
                href: 'http://blog.cdaringe.com/rss',
                iconName: 'fa-rss-square'
              }
            ].map(({ href, iconName }) => (
              <a target='_blank' rel='noopener noreferrer' href={href} key={href}>
                <i className={`fa fa-2x ${iconName} ${followStyles.icon}`} />
              </a>
            ))}
          </div>
          <h6 style={{ margin: 2 }}>
            <a href='/about'>about</a>
          </h6>
          <h6 style={{ margin: 2 }}>
            <a href='https://cowtown.surge.sh' target='_blank' rel='noopener noreferrer'>
              cowtown
            </a>
          </h6>
          <h6 style={{ margin: 2 }}>
            <a href='https://diary.cdaringe.com/' target='_blank' rel='noopener noreferrer'>
              github diary
            </a>
          </h6>
          <h6 style={{ margin: 2 }}>
            <a href='https://redorgreen.org' target='_blank' rel='noopener noreferrer'>
              red-or-green
            </a>
          </h6>
          <h6 style={{ margin: 2 }}>
            <a href='https://senorsalsa.org' target='_blank' rel='noopener noreferrer'>
              senor-salsa
            </a>
          </h6>
          <h6 style={{ margin: 2 }}>
            <a href='https://dino-dna.github.io/donut' target='_blank' rel='noopener noreferrer'>
              donut
            </a>
          </h6>
          <h6 style={{ margin: 2 }}>
            <a href='https://truth.lol' target='_blank' rel='noopener noreferrer'>
              truth.lol
            </a>
          </h6>
          <h6 style={{ margin: 2 }}>
            <a href='https://upnup.cdaringe.com' target='_blank' rel='noopener noreferrer'>
              up'n'up
            </a>
          </h6>
          <h6 style={{ margin: 2 }}>
            <a href='https://dvd.js.org?names=han,luke,leia,chewy' target='_blank' rel='noopener noreferrer'>
              dvd.js.org
            </a>
          </h6>
        </header>
        <div className={layoutStyles.content}>{children}</div>
        <footer id='footer'>
          <section id='footer-message'>
            © {new Date().getFullYear()} cdaringe. Built with{' '}
            <a href='https://www.gatsbyjs.org/' target='_blank' rel='noopener noreferrer'>
              Gatsby
            </a>{' '}
            and a hacked version of{' '}
            <a href='https://github.com/kathyqian/crisp-ghost-theme' target='_blank' rel='noopener noreferrer'>
              Crisp
            </a>{' '}
            by{' '}
            <a href='http://kathyqian.com' target='_blank' rel='noopener noreferrer'>
              kathy
            </a>
            .
          </section>
        </footer>
      </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
