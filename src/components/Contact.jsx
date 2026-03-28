import { useState, useEffect, useRef } from 'react'

/* ─── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500&display=swap');

  :root {
    --bg:       #04040a;
    --surface:  #0a0a14;
    --surface2: #0f0f1c;
    --cyan:     #00f0ff;
    --cyan-dim: rgba(0,240,255,0.07);
    --cyan-mid: rgba(0,240,255,0.18);
    --green:    #00ff88;
    --white:    #eeeef2;
    --muted:    #6b6b80;
    --border:   rgba(255,255,255,0.06);
    --border-h: rgba(0,240,255,0.22);
  }

  /* ── Section ── */
  #contact {
    position: relative;
    padding: 140px 0 160px;
    background: var(--bg);
    overflow: hidden;
  }

  /* dot grid */
  #contact::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 10%, transparent 100%);
    pointer-events: none;
  }

  /* cyan glow */
  #contact::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%;
    transform: translate(-50%, 30%);
    width: 700px; height: 400px;
    background: radial-gradient(ellipse, rgba(0,240,255,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .contact-wrap {
    position: relative; z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
  }

  /* ── Header ── */
  .ct-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--cyan);
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px;
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .ct-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--cyan); }
  .ct-eyebrow.vis { opacity: 1; transform: translateY(0); }

  .ct-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800; line-height: 0.95; letter-spacing: -0.03em;
    color: var(--white); margin-bottom: 80px;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
  }
  .ct-title em { font-style: normal; -webkit-text-stroke: 1px var(--cyan); color: transparent; }
  .ct-title.vis { opacity: 1; transform: translateY(0); }

  /* ── Body grid ── */
  .contact-body {
    display: grid;
    grid-template-columns: 1fr 480px;
    gap: 2px;
    align-items: start;
  }

  /* ── Left: info + socials ── */
  .contact-info {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 48px;
    position: relative; overflow: hidden;
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
  }
  .contact-info.vis { opacity: 1; transform: translateY(0); }

  /* corner cut */
  .contact-info::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 0; height: 0; border-style: solid;
    border-width: 0 40px 40px 0;
    border-color: transparent var(--surface2) transparent transparent;
  }
  /* scan lines */
  .contact-info::after {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px);
    pointer-events: none; z-index: 0;
  }
  .info-inner { position: relative; z-index: 1; }

  .info-panel-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .info-panel-label::before { content: ''; width: 20px; height: 1px; background: var(--cyan); }

  .info-heading {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800; letter-spacing: -0.02em;
    color: var(--white); margin-bottom: 16px;
  }

  .info-text {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14.5px; line-height: 1.8;
    color: var(--muted); margin-bottom: 40px;
  }
  .info-text em { color: var(--white); font-style: normal; font-weight: 500; }

  /* direct email btn */
  .info-email-btn {
    display: inline-flex;
    align-items: center; gap: 10px;
    padding: 13px 28px;
    background: var(--cyan);
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--bg); font-weight: 500;
    text-decoration: none;
    position: relative; overflow: hidden;
    transition: box-shadow 0.3s;
    margin-bottom: 48px;
  }
  .info-email-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--green);
    transform: scaleX(0); transform-origin: right;
    transition: transform 0.35s cubic-bezier(.22,1,.36,1);
  }
  .info-email-btn:hover::before { transform: scaleX(1); }
  .info-email-btn:hover { box-shadow: 0 0 22px rgba(0,255,136,0.3); }
  .info-email-btn span { position: relative; z-index: 1; }

  /* social row */
  .info-socials-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 16px;
  }
  .info-socials {
    display: flex; gap: 8px;
  }
  .social-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 16px;
    border: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    position: relative; overflow: hidden;
    transition: color 0.25s, border-color 0.25s;
  }
  .social-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--cyan-dim);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(.22,1,.36,1);
  }
  .social-btn:hover::before { transform: scaleX(1); }
  .social-btn:hover { color: var(--cyan); border-color: var(--border-h); }
  .social-btn span { position: relative; z-index: 1; }
  .social-btn i { position: relative; z-index: 1; font-size: 13px; }

  /* info bottom strip */
  .info-strip {
    margin-top: 40px;
    display: flex; flex-direction: column;
    border-top: 1px solid var(--border);
    padding-top: 28px; gap: 16px;
  }
  .info-strip-row {
    display: flex; align-items: center;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted);
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }
  .info-strip-row:last-child { border-bottom: none; padding-bottom: 0; }
  .info-strip-row strong { color: var(--white); font-weight: 400; }

  /* ── Right: form ── */
  .contact-form-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 48px;
    position: relative; overflow: hidden;
    opacity: 0; transform: translateX(20px);
    transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;
  }
  .contact-form-panel.vis { opacity: 1; transform: translateX(0); }

  /* corner */
  .contact-form-panel::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 0; height: 0; border-style: solid;
    border-width: 0 36px 36px 0;
    border-color: transparent var(--bg) transparent transparent;
  }

  .form-panel-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 32px;
    display: flex; align-items: center; gap: 10px;
  }
  .form-panel-label::before { content: ''; width: 20px; height: 1px; background: var(--cyan); }

  /* form fields */
  .ct-form {
    display: flex; flex-direction: column; gap: 20px;
  }

  .ct-field {
    display: flex; flex-direction: column; gap: 8px;
  }
  .ct-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted);
  }
  .ct-input, .ct-textarea {
    width: 100%; box-sizing: border-box;
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 13px 16px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px;
    color: var(--white);
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    resize: none;
  }
  .ct-input::placeholder, .ct-textarea::placeholder { color: var(--muted); opacity: 0.5; }
  .ct-input:focus, .ct-textarea:focus {
    border-color: var(--border-h);
    box-shadow: 0 0 0 2px rgba(0,240,255,0.06);
  }
  .ct-textarea { min-height: 140px; }

  /* submit btn */
  .ct-submit {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 14px 28px;
    background: var(--cyan);
    border: none; cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--bg); font-weight: 500;
    position: relative; overflow: hidden;
    transition: box-shadow 0.3s;
    width: 100%;
  }
  .ct-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--green);
    transform: scaleX(0); transform-origin: right;
    transition: transform 0.35s cubic-bezier(.22,1,.36,1);
  }
  .ct-submit:hover:not(:disabled)::before { transform: scaleX(1); }
  .ct-submit:hover:not(:disabled) { box-shadow: 0 0 22px rgba(0,255,136,0.3); }
  .ct-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .ct-submit span { position: relative; z-index: 1; }

  /* spinner */
  .ct-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(4,4,10,0.3);
    border-top-color: var(--bg);
    border-radius: 50%;
    animation: ctSpin 0.7s linear infinite;
    position: relative; z-index: 1;
  }

  /* status msg */
  .ct-status {
    padding: 10px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.06em;
    border: 1px solid;
    animation: ctFadeIn 0.3s ease;
  }
  .ct-status.success { border-color: rgba(0,255,136,0.4); color: var(--green); background: rgba(0,255,136,0.05); }
  .ct-status.error   { border-color: rgba(255,80,80,0.4);  color: #ff5050;     background: rgba(255,80,80,0.05); }

  /* ── Keyframes ── */
  @keyframes ctSpin    { to { transform: rotate(360deg); } }
  @keyframes ctFadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .contact-body { grid-template-columns: 1fr; }
    .contact-form-panel { transform: translateX(0) translateY(20px); }
    .contact-form-panel.vis { transform: translateX(0) translateY(0); }
  }
  @media (max-width: 768px) {
    .contact-wrap { padding: 0 24px; }
    .contact-info, .contact-form-panel { padding: 28px 24px; }
    .info-socials { flex-wrap: wrap; }
  }
`

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
  const [injected, setInjected] = useState(false)
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

  useEffect(() => {
    if (injected) return
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setInjected(true)
  }, [injected])

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
