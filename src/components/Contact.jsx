import { useState, useEffect, useRef } from 'react'
import { useTilt } from '../hooks/useTilt'
import './Contact.css';

/* ─── Reveal hook ─────────────────────────────────────────────────────── */
function useReveal(ref, threshold = 0.1) {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref?.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])
  return vis
}

/* ─── Component ───────────────────────────────────────────────────────── */
export default function Contact() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [message,  setMessage]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [status,   setStatus]   = useState(null)
  const [copied,   setCopied]   = useState(false)

  const headRef  = useRef(null)
  const infoRef  = useRef(null)
  const formRef  = useRef(null)
  const headVis  = useReveal(headRef, 0.08)
  const infoVis  = useReveal(infoRef, 0.08)
  const formVis  = useReveal(formRef, 0.08)

  useTilt({ max: 8, scale: 1.01, glare: true, maxGlare: 0.15 }, infoRef)
  useTilt({ max: 8, scale: 1.01, glare: true, maxGlare: 0.15 }, formRef)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('shivam17sharma2004@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    const fd = new FormData()
    fd.append('name', name)
    fd.append('email', email)
    fd.append('message', message)
    try {
      const res = await fetch('https://formspree.io/f/xgvyrjqn', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      })
      if (res.ok) {
        setName(''); setEmail(''); setMessage('')
        setStatus('success')
        setTimeout(() => setStatus(null), 4000)
      } else throw new Error()
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(null), 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact">
      <div className="contact-wrap">

        {/* Header */}
        <div ref={headRef} className="contact-header">
          <p className={`ct-eyebrow${headVis ? ' vis' : ''}`}>
            <span className="eyebrow-dash" /> GET IN TOUCH
          </p>
          <h2 className={`ct-title${headVis ? ' vis' : ''}`}>
            Let's <em>Connect.</em>
          </h2>
        </div>

        {/* Body Grid */}
        <div className="contact-body">

          {/* Left Column: Direct Line Card */}
          <div ref={infoRef} className={`contact-info-card${infoVis ? ' vis' : ''}`}>
            <div className="info-corner-accent" aria-hidden="true" />
            
            <div className="info-header-row">
              <span className="info-badge">
                <span className="badge-pulse" />
                DIRECT LINE
              </span>
              <span className="info-tag-sys">SHIVAM_OS // COMM_LINK</span>
            </div>
            
            <h3 className="info-heading">Say Hello.</h3>
            
            <p className="info-text">
              I'm always open to discussing <em>AI/ML projects</em>, research
              opportunities, or high-impact collaborations. Have an idea or question?
              Let's create something extraordinary together.
            </p>

            {/* Email Action Card */}
            <div className="email-action-card">
              <div className="email-meta">
                <span className="email-label">PRIMARY EMAIL ADDRESS</span>
                <a
                  href="mailto:shivam17sharma2004@gmail.com"
                  className="email-address"
                  aria-label="Send email to Shivam"
                >
                  shivam17sharma2004@gmail.com
                </a>
              </div>
              <button
                className={`email-copy-btn${copied ? ' copied' : ''}`}
                onClick={handleCopyEmail}
                type="button"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            {/* Socials */}
            <div className="info-social-wrap">
              <p className="info-section-label">COMMUNICATION CHANNELS</p>
              <div className="info-socials">
                {[
                  { href: 'https://github.com/shivamsharma0906',            icon: 'fab fa-github',    label: 'GITHUB'   },
                  { href: 'https://www.linkedin.com/in/shivam-sharma0906/', icon: 'fab fa-linkedin',  label: 'LINKEDIN' },
                  { href: 'https://www.instagram.com/shiva__m0906/',        icon: 'fab fa-instagram', label: 'INSTAGRAM'}
                ].map(s => (
                  <a key={s.label} href={s.href} className="social-btn" target="_blank" rel="noopener noreferrer">
                    <i className={s.icon} />
                    <span>{s.label}</span>
                    <svg className="social-arrow" width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Meta Grid */}
            <div className="info-meta-grid">
              <div className="meta-card">
                <span className="meta-label">RESPONSE TIME</span>
                <span className="meta-val">&lt; 24 HOURS</span>
              </div>
              <div className="meta-card">
                <span className="meta-label">LOCATION</span>
                <span className="meta-val">KOLKATA, INDIA</span>
              </div>
              <div className="meta-card meta-card-full">
                <span className="meta-label">AVAILABILITY</span>
                <span className="meta-val meta-val-green">
                  <span className="meta-dot-green" />
                  OPEN TO INTERNSHIPS &amp; COLLABS
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Send a Message */}
          <div ref={formRef} className={`contact-form-panel${formVis ? ' vis' : ''}`}>
            <div className="info-corner-accent" aria-hidden="true" />

            <div className="info-header-row">
              <span className="info-badge">
                <span className="badge-pulse" />
                TRANSMIT MESSAGE
              </span>
              <span className="info-tag-sys">FORM_DISPATCH // SECURE</span>
            </div>
            
            <form className="ct-form" onSubmit={handleSubmit} noValidate>
              <div className="ct-field">
                <label className="ct-label" htmlFor="ct-name">
                  <span>YOUR NAME</span>
                </label>
                <div className="ct-input-wrap">
                  <i className="far fa-user ct-field-icon" aria-hidden="true" />
                  <input
                    id="ct-name"
                    type="text"
                    className="ct-input"
                    placeholder="Shivam Sharma"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label" htmlFor="ct-email">
                  <span>YOUR EMAIL</span>
                </label>
                <div className="ct-input-wrap">
                  <i className="far fa-envelope ct-field-icon" aria-hidden="true" />
                  <input
                    id="ct-email"
                    type="email"
                    className="ct-input"
                    placeholder="shivam@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="ct-field">
                <label className="ct-label" htmlFor="ct-message">
                  <span>MESSAGE</span>
                </label>
                <div className="ct-input-wrap">
                  <i className="far fa-comment-alt ct-field-icon ct-icon-top" aria-hidden="true" />
                  <textarea
                    id="ct-message"
                    className="ct-textarea"
                    placeholder="Tell me about your project, idea, or opportunity..."
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>
              </div>

              {status && (
                <div className={`ct-status ${status}`} role="alert">
                  {status === 'success'
                    ? '✓ Message transmitted successfully!'
                    : '✕ Transmission failed. Please try again.'}
                </div>
              )}

              <button type="submit" className="ct-submit" disabled={loading}>
                <span className="ct-submit-text">
                  {loading ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                </span>
                <svg className="ct-submit-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>

            <div className="form-security-note">
              <span className="sec-dot" />
              <span>ENCRYPTED DIRECT DISPATCH // FAST RESPONSE GUARANTEED</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
