import { useEffect, useRef, useState } from 'react'

import './Hero.css';
import { useTilt } from '../hooks/useTilt';/* ─── Styles ──────────────────────────────────────────────────────────── */


/* ─── Typing hook ─────────────────────────────────────────────────────── */
function useTyping(words) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let wi = 0, ci = 0, del = false, tid
    function tick() {
      const w = words[wi]
      el.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1)
      del ? ci-- : ci++
      let speed = del ? 45 : 140
      if (!del && ci === w.length) { del = true; speed = 2200 }
      if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; speed = 500 }
      tid = setTimeout(tick, speed)
    }
    tick()
    return () => clearTimeout(tid)
  }, [words])
  return ref
}

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

const WORDS = ['AI/ML Engineer', 'Deep Learning Dev', 'Computer Vision', 'Problem Solver']

/* ─── Component ───────────────────────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef(null)
  const vis = useReveal(sectionRef, 0.01)
  const typingRef = useTyping(WORDS)

  const avatarRef = useTilt({ max: 20, scale: 1.05, glare: true, maxGlare: 0.4 });
  const terminalRef = useTilt({ max: 12, scale: 1.02, glare: true, maxGlare: 0.2 });

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="hero" ref={sectionRef}>
      {/* decorative left line */}
      <div className="hero-coord" aria-hidden="true" />
      <span className="hero-coord-label" aria-hidden="true">shivam.sharma // portfolio.v2</span>

      <div className="hero-container">
        <div className="hero-layout">

          {/* ── LEFT ── */}
          <div className="hero-left">

            {/* system tags */}
            <div className="hero-tags">
              {['Available for Hire', 'AI/ML Student', 'India'].map((t, i) => (
                <span
                  key={t}
                  className={`hero-tag${vis ? ' vis' : ''}`}
                  style={{ transitionDelay: vis ? `${i * 0.1}s` : '0s' }}
                >
                  <span className="hero-tag-dot" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>

            {/* name */}
            <h1 className={`hero-name${vis ? ' vis' : ''}`}>
              Shivam<br /><em>Sharma.</em>
            </h1>

            {/* role / typing */}
            <div className={`hero-role${vis ? ' vis' : ''}`}>
              <span className="hero-role-prefix">I am a //</span>
              <span className="hero-typing-wrap">
                <span ref={typingRef}></span>
                <span className="hero-cursor" aria-hidden="true" />
              </span>
            </div>

            {/* bio */}
            <p className={`hero-bio${vis ? ' vis' : ''}`}>
              Computer Science student specializing in <em>AI &amp; Machine Learning</em> —
              building intelligent systems that bridge{' '}
              <em>research &amp; real-world impact</em>.
              Focused on deep learning, computer vision, and ethical AI.
            </p>

            {/* CTAs */}
            <div className={`hero-ctas${vis ? ' vis' : ''}`}>
              <a
                href="#projects"
                className="hero-cta-primary"
                onClick={scrollTo('#projects')}
                aria-label="View my projects"
              >
                <span>Explore Projects</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="/shivam_resume.pdf"
                className="hero-cta-secondary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download resume"
              >
                <span>Download CV</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 1v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* stats */}
            <div className={`hero-stats${vis ? ' vis' : ''}`}>
              {[
                { val: '4+', label: 'Projects Shipped', accent: true },
                { val: '2+', label: 'Years of Learning', accent: false },
                { val: '15+', label: 'Technologies', accent: false },
              ].map(s => (
                <div key={s.label} className="hero-stat">
                  <div className="stat-val">
                    {s.accent ? <><span>{s.val.replace('+', '')}</span>+</> : s.val}
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className={`hero-right${vis ? ' vis' : ''}`}>

            {/* avatar card */}
            <div className="hero-avatar-card" ref={avatarRef}>
              <img src="/logo4.png" alt="Shivam Sharma" className="avatar-img" width="52" height="52" loading="eager" />
              <div className="avatar-info">
                <span className="avatar-name">Shivam Sharma</span>
                <span className="avatar-role">B.Tech CSE · AI/ML</span>
              </div>
              <span className="avatar-badge">
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', display: 'inline-block', flexShrink: 0 }} aria-hidden="true" />
                Open
              </span>
            </div>

            {/* terminal card */}
            <div className="hero-card" ref={terminalRef}>
              <div className="terminal-header">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
                <span className="terminal-title">profile.json</span>
              </div>
              <div className="terminal-body">
                <span className="t-brace">{'{'}</span><br />
                &nbsp;&nbsp;<span className="t-key">"name"</span><span className="t-brace">: </span><span className="t-str">"Shivam Sharma"</span><span className="t-brace">,</span><br />
                &nbsp;&nbsp;<span className="t-key">"role"</span><span className="t-brace">: </span><span className="t-str">"AI/ML Student"</span><span className="t-brace">,</span><br />
                &nbsp;&nbsp;<span className="t-key">"university"</span><span className="t-brace">: </span><span className="t-str">"Techno Main SaltLake"</span><span className="t-brace">,</span><br />
                &nbsp;&nbsp;<span className="t-key">"focus"</span><span className="t-brace">: [</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"Deep Learning"</span><span className="t-brace">,</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"Computer Vision"</span><span className="t-brace">,</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"NLP"</span><br />
                &nbsp;&nbsp;<span className="t-brace">],</span><br />
                &nbsp;&nbsp;<span className="t-key">"openToWork"</span><span className="t-brace">: </span><span className="t-bool">true</span><br />
                <span className="t-brace">{'}'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}