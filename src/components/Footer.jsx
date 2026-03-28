import { useEffect, useState } from 'react'

const STYLES = `
  :root {
    --bg:     #04040a;
    --surface: #0a0a14;
    --cyan:   #00f0ff;
    --green:  #00ff88;
    --white:  #eeeef2;
    --muted:  #6b6b80;
    --border: rgba(255,255,255,0.06);
  }

  .site-footer {
    position: relative;
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 0;
    overflow: hidden;
  }

  /* top scan line */
  .site-footer::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--cyan) 30%, var(--green) 70%, transparent 100%);
    box-shadow: 0 0 12px var(--cyan);
  }

  .footer-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
  }

  /* top bar */
  .footer-top {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
    border-bottom: 1px solid var(--border);
  }
  .footer-col {
    padding: 48px 0;
    border-right: 1px solid var(--border);
    padding-right: 48px;
  }
  .footer-col:nth-child(2) { padding-left: 48px; }
  .footer-col:last-child   { border-right: none; padding-left: 48px; padding-right: 0; }

  .footer-col-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .footer-col-label::before { content: ''; width: 16px; height: 1px; background: var(--cyan); }

  /* logo col */
  .footer-logo-name {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
    color: var(--white); margin-bottom: 8px;
  }
  .footer-logo-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--cyan); margin-bottom: 16px;
  }
  .footer-bio {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13.5px; line-height: 1.75;
    color: var(--muted); max-width: 260px;
  }

  /* nav col */
  .footer-nav { display: flex; flex-direction: column; gap: 10px; }
  .footer-nav-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    display: flex; align-items: center; gap: 8px;
    transition: color 0.25s, padding-left 0.25s;
    cursor: pointer;
  }
  .footer-nav-link::before { content: ''; width: 8px; height: 1px; background: var(--border); flex-shrink: 0; transition: width 0.25s, background 0.25s; }
  .footer-nav-link:hover { color: var(--cyan); padding-left: 4px; }
  .footer-nav-link:hover::before { width: 14px; background: var(--cyan); }

  /* socials col */
  .footer-socials { display: flex; flex-direction: column; gap: 10px; }
  .footer-social {
    display: flex; align-items: center; gap: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    transition: color 0.25s;
  }
  .footer-social:last-child { border-bottom: none; }
  .footer-social:hover { color: var(--cyan); }
  .footer-social i { font-size: 14px; width: 16px; text-align: center; }

  /* bottom bar */
  .footer-bottom {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted);
    gap: 24px;
  }
  .footer-copy span { color: var(--cyan); }
  .footer-status {
    display: flex; align-items: center; gap: 8px;
  }
  .footer-pip {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--green); box-shadow: 0 0 6px var(--green);
    animation: footerPip 2.4s ease-in-out infinite; flex-shrink: 0;
  }
  @keyframes footerPip { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }

  @media (max-width: 900px) {
    .footer-inner { padding: 0 24px; }
    .footer-top { grid-template-columns: 1fr; }
    .footer-col { border-right: none; border-bottom: 1px solid var(--border); padding: 32px 0 !important; }
    .footer-col:last-child { border-bottom: none; }
    .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
  }
`

const NAV = [
  { label: 'About',    href: '#about'           },
  { label: 'AI/ML',   href: '#ai-ml-expertise'  },
  { label: 'Projects', href: '#projects'         },
  { label: 'Skills',  href: '#skills'            },
  { label: 'Contact', href: '#contact'           },
]

export default function Footer() {
  const [injected, setInjected] = useState(false)

  useEffect(() => {
    if (injected) return
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setInjected(true)
  }, [injected])

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
