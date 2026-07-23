import { useState, useEffect, useRef } from 'react'

import './Navbar.css';

/* ─── Styles ──────────────────────────────────────────────────────────── */


/* ─── Sections for scroll spy ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'AI/ML', href: '#ai-ml-expertise' },
  { label: 'GitHub', href: '#github-activity' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

/* ─── Component ───────────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

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
            <img src="/logo3.webp" alt="Shivam Sharma" className="nav-logo-img" width="30" height="30" loading="eager" />
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
            href="/shivam_resume.pdf"
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
            href="/shivam_resume.pdf"
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