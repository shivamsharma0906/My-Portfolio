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
        <div ref={headRef}>
          <p className={`ct-eyebrow${headVis ? ' vis' : ''}`}>Get In Touch</p>
          <h2 className={`ct-title${headVis ? ' vis' : ''}`}>
            Let's <em>Connect.</em>
          </h2>
        </div>

        {/* Body */}
        <div className="contact-body">

          {/* Left: info */}
          <div ref={infoRef} className={`contact-info${infoVis ? ' vis' : ''}`}>
            <div className="info-inner">
              <p className="info-panel-label">Direct Line</p>
              <h3 className="info-heading">Say Hello</h3>
              <p className="info-text">
                I'm always interested in discussing <em>AI projects</em>, research
                opportunities, or potential collaborations. Whether you have a question
                or just want to connect — I'll get back to you!
              </p>

              <a
                href="mailto:shivam17sharma2004@gmail.com"
                className="info-email-btn"
                aria-label="Send an email to Shivam"
              >
                <span>shivam17sharma2004@gmail.com</span>
              </a>

              <p className="info-socials-label">Find me on</p>
              <div className="info-socials">
                {[
                  { href: 'https://github.com/shivamsharma0906',            icon: 'fab fa-github',    label: 'GitHub'   },
                  { href: 'https://www.linkedin.com/in/shivam-sharma0906/', icon: 'fab fa-linkedin',  label: 'LinkedIn' },
                  { href: 'https://www.instagram.com/shiva__m0906/',        icon: 'fab fa-instagram', label: 'Insta'    },
                ].map(s => (
                  <a key={s.label} href={s.href} className="social-btn" target="_blank" rel="noopener noreferrer" aria-label={`Visit my ${s.label}`}>
                    <i className={s.icon} />
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>

              <div className="info-strip">
                <div className="info-strip-row"><span>Response Time</span><strong>{'< 24 hours'}</strong></div>
                <div className="info-strip-row"><span>Location</span><strong>Kolkata, India</strong></div>
                <div className="info-strip-row"><span>Availability</span><strong>Open to Internships</strong></div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div ref={formRef} className={`contact-form-panel${formVis ? ' vis' : ''}`}>
            <p className="form-panel-label">Send a Message</p>
            <form className="ct-form" onSubmit={handleSubmit} noValidate>
              <div className="ct-field">
                <label className="ct-label" htmlFor="ct-email">Your Email</label>
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
                <label className="ct-label" htmlFor="ct-message">Message</label>
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
                    ? '✓ Message sent successfully! I\'ll get back to you soon.'
                    : '✕ Something went wrong. Please try again or email directly.'}
                </div>
              )}
              <button type="submit" className="ct-submit" disabled={loading}>
                {loading
                  ? <><div className="ct-spinner" /><span>Sending...</span></>
                  : <><span>Send Message</span>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                }
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
