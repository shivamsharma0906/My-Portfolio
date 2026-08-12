import './Footer.css';

const NAV = [
  { label: 'About',    href: '#about'           },
  { label: 'AI/ML',   href: '#ai-ml-expertise'  },
  { label: 'Projects', href: '#projects'         },
  { label: 'Skills',  href: '#skills'            },
  { label: 'Contact', href: '#contact'           },
]

export default function Footer() {



  const scrollTo = (href) => (e) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Top columns */}
        <div className="footer-top">

          {/* Logo + bio */}
          <div className="footer-col">
            <p className="footer-col-label">Portfolio</p>
            <div className="footer-logo-name">Shivam Sharma</div>
            <div className="footer-logo-sub">AI/ML Student · Developer</div>
            <p className="footer-bio">
              Building intelligent systems at the intersection of research and product engineering.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <p className="footer-col-label">Navigation</p>
            <nav className="footer-nav" aria-label="Footer navigation">
              {NAV.map(n => (
                <a
                  key={n.href}
                  href={n.href}
                  className="footer-nav-link"
                  onClick={scrollTo(n.href)}
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Socials */}
          <div className="footer-col">
            <p className="footer-col-label">Connect</p>
            <div className="footer-socials">
              {[
                { href: 'https://github.com/shivamsharma0906',            icon: 'fab fa-github',    label: 'GitHub'   },
                { href: 'https://www.linkedin.com/in/shivam-sharma0906/', icon: 'fab fa-linkedin',  label: 'LinkedIn' },
                { href: 'https://www.instagram.com/shiva__m0906/',        icon: 'fab fa-instagram', label: 'Instagram'},
                { href: 'mailto:shivam17sharma2004@gmail.com',            icon: 'fas fa-envelope',  label: 'Email'    },
              ].map(s => (
                <a key={s.label} href={s.href} className="footer-social" target="_blank" rel="noopener noreferrer" aria-label={`${s.label} profile`}>
                  <i className={s.icon} aria-hidden="true" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-copy">
            Designed &amp; Built by <span>Shivam Sharma</span> &copy; {new Date().getFullYear()}
          </span>
          <span className="footer-status">
            <span className="footer-pip" aria-hidden="true" />
            All systems operational
          </span>
        </div>

      </div>
    </footer>
  )
}
