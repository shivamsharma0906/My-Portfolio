import { useState, useEffect, useRef } from 'react'

import './Contact.css';

/* ─── Styles ──────────────────────────────────────────────────────────── */


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
  const [email,    setEmail]    = useState('')
  const [message,  setMessage]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [status,   setStatus]   = useState(null)

  const headRef  = useRef(null)
  const infoRef  = useRef(null)
  const formRef  = useRef(null)
  const headVis  = useReveal(headRef, 0.08)
  const infoVis  = useReveal(infoRef, 0.08)
  const formVis  = useReveal(formRef, 0.08)



  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    const fd = new FormData()
    fd.append('email', email)
    fd.append('message', message)
    try {
      const res = await fetch('https://formspree.io/f/xgvyrjqn', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      })
      if (res.ok) {
        setEmail(''); setMessage('')
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

          {/* Left Column: Direct Line */}
          <div ref={infoRef} className={`contact-info${infoVis ? ' vis' : ''}`}>
            <div className="info-inner">
              <p className="info-section-label">
                <span className="label-dash" /> DIRECT LINE
              </p>
              
              <h3 className="info-heading">Say Hello</h3>
              
              <p className="info-text">
                I'm always interested in discussing <strong>AI projects</strong>, research
                opportunities, or potential collaborations. Whether you have a question
                or just want to connect — I'll get back to you!
              </p>

              <a
                href="mailto:shivam17sharma2004@gmail.com"
                className="info-email-btn"
              >
                <span>SHIVAM17SHARMA2004@GMAIL.COM</span>
              </a>

              <div className="info-social-wrap">
                <p className="info-section-label">FIND ME ON</p>
                <div className="info-socials">
                  {[
                    { href: 'https://github.com/shivamsharma0906',            icon: 'fab fa-github',    label: 'GITHUB'   },
                    { href: 'https://www.linkedin.com/in/shivam-sharma0906/', icon: 'fab fa-linkedin',  label: 'LINKEDIN' },
                    { href: 'https://www.instagram.com/shiva__m0906/',        icon: 'fab fa-instagram', label: 'INSTA'    },
                  ].map(s => (
                    <a key={s.label} href={s.href} className="social-btn" target="_blank" rel="noopener noreferrer">
                      <i className={s.icon} />
                      <span>{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="info-details-list">
                <div className="info-detail-item">
                  <span className="detail-label">RESPONSE TIME</span>
                  <span className="detail-val">{'< 24 HOURS'}</span>
                </div>
                <div className="info-detail-item">
                  <span className="detail-label">LOCATION</span>
                  <span className="detail-val">KOLKATA, INDIA</span>
                </div>
                <div className="info-detail-item">
                  <span className="detail-label">AVAILABILITY</span>
                  <span className="detail-val">OPEN TO INTERNSHIPS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send a Message */}
          <div ref={formRef} className={`contact-form-panel${formVis ? ' vis' : ''}`}>
            <p className="info-section-label">
              <span className="label-dash" /> SEND A MESSAGE
            </p>
            
            <form className="ct-form" onSubmit={handleSubmit} noValidate>
              <div className="ct-field">
                <label className="ct-label" htmlFor="ct-email">YOUR EMAIL</label>
                <input
                  id="ct-email"
                  type="email"
                  className="ct-input"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              
              <div className="ct-field">
                <label className="ct-label" htmlFor="ct-message">MESSAGE</label>
                <textarea
                  id="ct-message"
                  className="ct-textarea"
                  placeholder="Tell me about your project or opportunity..."
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>

              {status && (
                <div className={`ct-status ${status}`} role="alert">
                  {status === 'success'
                    ? '✓ Message sent successfully!'
                    : '✕ Something went wrong.'}
                </div>
              )}

              <button type="submit" className="ct-submit" disabled={loading}>
                {loading ? (
                  <span>SENDING...</span>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
