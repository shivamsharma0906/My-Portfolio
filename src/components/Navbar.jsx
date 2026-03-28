import { useState, useEffect, useRef } from 'react'

/* ─── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

  :root {
    --bg:         #04040a;
    --surface:    #0a0a14;
    --cyan:       #00f0ff;
    --cyan-dim:   rgba(0,240,255,0.07);
    --green:      #00ff88;
    --white:      #eeeef2;
    --muted:      #6b6b80;
    --border:     rgba(255,255,255,0.06);
    --border-h:   rgba(0,240,255,0.22);
  }

  /* ════════════ NAV SHELL ════════════ */
  .nav-shell {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: background 0.4s ease, padding 0.4s ease, border-color 0.4s ease;
    border-bottom: 1px solid transparent;
  }
  .nav-shell.scrolled {
    background: rgba(4,4,10,0.94) !important;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom-color: var(--border);
  }

  /* reading progress bar */
  .nav-progress {
    position: absolute;
    bottom: -1px; left: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--cyan), var(--green));
    box-shadow: 0 0 10px var(--cyan);
    transition: width 0.1s linear;
    pointer-events: none;
  }

  /* ── Inner row ── */
  .nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  /* ── Logo ── */
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    cursor: pointer;
    flex-shrink: 0;
  }
  .nav-logo-img {
    width: 30px; height: 30px;
    border-radius: 0;
    object-fit: cover;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }
  .nav-logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--white);
    white-space: nowrap;
  }
  .nav-logo-text span { color: var(--cyan); }

  /* ── Desktop links ── */
  .nav-links-desktop {
    display: flex;
    align-items: center;
    gap: 0;
  }
  .nav-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    padding: 6px 16px;
    position: relative;
    transition: color 0.25s;
    cursor: pointer;
    background: none;
    border: none;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 16px; right: 16px;
    height: 1px;
    background: var(--cyan);
    box-shadow: 0 0 6px var(--cyan);
    transform: scaleX(0);
    transition: transform 0.3s cubic-bezier(.22,1,.36,1);
  }
  .nav-link:hover { color: var(--white); }
  .nav-link:hover::after { transform: scaleX(1); }
  .nav-link.active { color: var(--cyan); }
  .nav-link.active::after { transform: scaleX(1); }

  /* ── Resume CTA ── */
  .nav-resume {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 18px;
    border: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: color 0.25s, border-color 0.25s;
    flex-shrink: 0;
    margin-left: 16px;
  }
  .nav-resume::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--cyan-dim);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(.22,1,.36,1);
  }
  .nav-resume:hover::before { transform: scaleX(1); }
  .nav-resume:hover { color: var(--cyan); border-color: var(--border-h); }
  .nav-resume span { position: relative; z-index: 1; }

  /* ── Active indicator dot ── */
  .nav-section-indicator {
    display: none;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .nav-section-pip {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--cyan);
    box-shadow: 0 0 5px var(--cyan);
  }

  /* ═══════════ MOBILE HAMBURGER ═══════════ */
  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }
  .nav-hamburger span {
    display: block;
    width: 22px; height: 1.5px;
    background: var(--muted);
    transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s;
    transform-origin: center;
  }
  .nav-hamburger:hover span { background: var(--cyan); }
  .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .nav-hamburger.open span:nth-child(2) { opacity: 0; }
  .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ═════════ MOBILE DRAWER ═════════ */
  .nav-drawer {
    position: fixed;
    top: 64px; left: 0; right: 0;
    background: rgba(4,4,10,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s cubic-bezier(.22,1,.36,1), border-color 0.4s;
    z-index: 999;
  }
  .nav-drawer.open { max-height: 500px; }
  .nav-drawer-inner {
    padding: 16px 48px 24px;
    display: flex; flex-direction: column; gap: 2px;
  }
  .nav-drawer-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    transition: color 0.25s, padding-left 0.25s;
    cursor: pointer;
    background: none; border-left: none; border-right: none; border-top: none;
    width: 100%; text-align: left;
  }
  .nav-drawer-link:hover { color: var(--cyan); padding-left: 8px; }
  .nav-drawer-link:last-child { border-bottom: none; }
  .nav-drawer-link i { font-size: 11px; opacity: 0.4; }

  /* ═══════════ RESPONSIVE ═══════════ */
  @media (max-width: 900px) {
    .nav-links-desktop, .nav-resume { display: none; }
    .nav-hamburger { display: flex; }
    .nav-section-indicator { display: flex; }
    .nav-inner { padding: 0 24px; }
  }
`

/* ─── Sections for scroll spy ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'About',    href: '#about'          },
  { label: 'AI/ML',   href: '#ai-ml-expertise' },
  { label: 'Projects', href: '#projects'        },
  { label: 'Skills',  href: '#skills'           },
  { label: 'Contact', href: '#contact'          },
]

/* ─── Component ───────────────────────────────────────────────────────── */
export default function Navbar() {
  const [injected,  setInjected]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [active,    setActive]    = useState('')
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    if (injected) return
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setInjected(true)
  }, [injected])

  /* Reading progress + scroll state */
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(scrollY > 80)
      setProgress(docH > 0 ? (scrollY / docH) * 100 : 0)

      // Scroll spy
      let current = ''
      for (const item of NAV_ITEMS) {
        const el = document.querySelector(item.href)
        if (el && window.scrollY >= el.offsetTop - 120) current = item.label
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close drawer on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header
        className={`nav-shell${scrolled ? ' scrolled' : ''}`}
        style={{ background: scrolled ? undefined : 'rgba(4,4,10,0.2)', backdropFilter: scrolled ? undefined : 'blur(12px)' }}
      >
        {/* Reading progress */}
        <div className="nav-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

        <div className="nav-inner">
          {/* Logo */}
          <a
            className="nav-logo"
            href="#hero"
            aria-label="Back to top"
            onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}
          >
            <img src="/logo3.png" alt="Shivam Sharma" className="nav-logo-img" width="30" height="30" loading="eager" />
            <span className="nav-logo-text">My <span>Portfolio</span></span>
          </a>

          {/* Desktop links */}
          <nav className="nav-links-desktop" aria-label="Primary navigation">
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link${active === item.label ? ' active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}
                aria-current={active === item.label ? 'true' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile: current section indicator */}
          <span className="nav-section-indicator" aria-hidden="true">
            <span className="nav-section-pip" />
            {active || 'Home'}
          </span>

          {/* Resume CTA */}
          <a
            href="/shivam-Resume.pdf"
            className="nav-resume"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download resume PDF"
          >
            <span>Resume</span>
          </a>

          {/* Hamburger */}
          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(p => !p)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="nav-drawer-inner">
          {NAV_ITEMS.map(item => (
            <button
              key={item.href}
              className="nav-drawer-link"
              onClick={() => scrollTo(item.href)}
              aria-label={`Navigate to ${item.label}`}
            >
              {item.label}
              <i className="fas fa-arrow-right" aria-hidden="true" />
            </button>
          ))}
          <a
            href="/shivam-Resume.pdf"
            className="nav-drawer-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Resume
            <i className="fas fa-external-link-alt" aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  )
}