import { useEffect, useRef, useState } from 'react'

/* ─── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500&family=Instrument+Sans:ital,wght@0,400;0,500;1,400&display=swap');

  :root {
    --bg:       #04040a;
    --surface:  #0a0a14;
    --cyan:     #00f0ff;
    --cyan-dim: rgba(0,240,255,0.07);
    --cyan-mid: rgba(0,240,255,0.18);
    --green:    #00ff88;
    --white:    #eeeef2;
    --muted:    #6b6b80;
    --border:   rgba(255,255,255,0.06);
    --border-h: rgba(0,240,255,0.22);
  }

  /* ── Section shell ── */
  #hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 120px 0 80px;
    background: var(--bg);
    overflow: hidden;
  }

  /* fine dot grid */
  #hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 10%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  /* diagonal accent line */
  #hero::after {
    content: '';
    position: absolute;
    top: 0; right: 15%;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom, transparent 10%, var(--border) 30%, var(--border) 70%, transparent 90%);
    pointer-events: none;
    z-index: 0;
  }

  .hero-container {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
    width: 100%;
  }

  /* ── Layout ── */
  .hero-layout {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 80px;
    align-items: center;
  }

  /* ── Left: content ── */
  .hero-left {}

  /* system tags row */
  .hero-tags {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }
  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    background: var(--surface);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .hero-tag.vis { opacity: 1; transform: translateY(0); }
  .hero-tag-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--cyan);
    box-shadow: 0 0 5px var(--cyan);
    animation: heroPip 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* name */
  .hero-name {
    font-family: 'Syne', sans-serif;
    font-size: clamp(52px, 7vw, 96px);
    font-weight: 800;
    line-height: 0.92;
    letter-spacing: -0.03em;
    color: var(--white);
    margin-bottom: 20px;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s;
  }
  .hero-name.vis { opacity: 1; transform: translateY(0); }
  .hero-name em {
    font-style: normal;
    -webkit-text-stroke: 1.5px var(--cyan);
    color: transparent;
  }

  /* role line */
  .hero-role {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
  }
  .hero-role.vis { opacity: 1; transform: translateY(0); }
  .hero-role-prefix {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.12em;
    color: var(--muted);
    white-space: nowrap;
  }
  .hero-typing-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: var(--cyan);
    text-transform: uppercase;
  }
  .hero-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: var(--cyan);
    margin-left: 3px;
    animation: heroCursor 0.9s step-end infinite;
    vertical-align: middle;
    box-shadow: 0 0 6px var(--cyan);
  }

  /* bio */
  .hero-bio {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 15px;
    line-height: 1.85;
    color: var(--muted);
    max-width: 520px;
    margin-bottom: 48px;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s;
  }
  .hero-bio.vis { opacity: 1; transform: translateY(0); }
  .hero-bio em { color: var(--white); font-style: normal; font-weight: 500; }

  /* CTA row */
  .hero-ctas {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s;
  }
  .hero-ctas.vis { opacity: 1; transform: translateY(0); }

  .hero-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 28px;
    background: var(--cyan);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--bg);
    font-weight: 500;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: background 0.3s, box-shadow 0.3s;
    cursor: pointer;
    border: none;
  }
  .hero-cta-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--green);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.35s cubic-bezier(.22,1,.36,1);
  }
  .hero-cta-primary:hover::before { transform: scaleX(1); }
  .hero-cta-primary:hover { box-shadow: 0 0 24px rgba(0,255,136,0.35); }
  .hero-cta-primary span { position: relative; z-index: 1; }

  .hero-cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    border: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: color 0.3s, border-color 0.3s;
  }
  .hero-cta-secondary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--cyan-dim);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(.22,1,.36,1);
  }
  .hero-cta-secondary:hover::before { transform: scaleX(1); }
  .hero-cta-secondary:hover { color: var(--cyan); border-color: var(--border-h); }
  .hero-cta-secondary span { position: relative; z-index: 1; }

  /* stat row */
  .hero-stats {
    display: flex;
    align-items: center;
    gap: 0;
    margin-top: 56px;
    border-top: 1px solid var(--border);
    padding-top: 32px;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s;
  }
  .hero-stats.vis { opacity: 1; transform: translateY(0); }

  .hero-stat {
    flex: 1;
    padding-right: 32px;
    border-right: 1px solid var(--border);
  }
  .hero-stat:last-child { border-right: none; padding-right: 0; padding-left: 32px; }
  .hero-stat:first-child { padding-left: 0; }

  .stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--white);
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-val span { color: var(--cyan); }
  .stat-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* ── Right: terminal card ── */
  .hero-right {
    display: flex;
    flex-direction: column;
    gap: 12px;
    opacity: 0;
    transform: translateX(24px);
    transition: opacity 0.8s ease 0.35s, transform 0.8s ease 0.35s;
  }
  .hero-right.vis { opacity: 1; transform: translateX(0); }

  .hero-card {
    background: var(--surface);
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  /* corner accent */
  .hero-card::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 32px 32px 0;
    border-color: transparent var(--bg) transparent transparent;
  }

  /* terminal header */
  .terminal-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    background: rgba(0,0,0,0.2);
  }
  .terminal-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .terminal-title {
    flex: 1;
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* terminal body */
  .terminal-body {
    padding: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    line-height: 2;
  }
  .t-comment { color: #3a3a55; }
  .t-key   { color: var(--cyan); }
  .t-str   { color: var(--green); }
  .t-num   { color: #ffb800; }
  .t-bool  { color: #a855f7; }
  .t-brace { color: var(--muted); opacity: 0.6; }

  /* avatar card */
  .hero-avatar-card {
    background: var(--surface);
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
  }
  .avatar-img {
    width: 52px;
    height: 52px;
    border-radius: 0;
    object-fit: cover;
    border: 1px solid var(--border);
    flex-shrink: 0;
    filter: grayscale(20%);
  }
  .avatar-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .avatar-name {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--white);
    letter-spacing: -0.01em;
  }
  .avatar-role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .avatar-badge {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--green);
    flex-shrink: 0;
  }

  /* ── vertical coordinate line (decorative) ── */
  .hero-coord {
    position: absolute;
    left: 48px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border) 20%, var(--border) 80%, transparent);
    pointer-events: none;
    z-index: 0;
  }
  .hero-coord-label {
    position: absolute;
    top: 50%;
    left: 56px;
    transform: translateY(-50%) rotate(-90deg);
    transform-origin: left center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--border);
    white-space: nowrap;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Keyframes ── */
  @keyframes heroCursor {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes heroPip {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.25; }
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .hero-layout { grid-template-columns: 1fr; gap: 60px; }
    .hero-right { transform: translateX(0) translateY(24px); }
    .hero-right.vis { transform: translateX(0) translateY(0); }
    .hero-coord, .hero-coord-label { display: none; }
  }
  @media (max-width: 768px) {
    .hero-container { padding: 0 24px; }
    #hero { padding: 110px 0 80px; }
    .hero-stats { flex-direction: column; gap: 24px; }
    .hero-stat { border-right: none; padding: 0 0 24px 0 !important; border-bottom: 1px solid var(--border); }
    .hero-stat:last-child { border-bottom: none; padding-bottom: 0 !important; }
  }
`

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
      if (!del && ci === w.length)  { del = true;  speed = 2200 }
      if (del  && ci === 0)         { del = false; wi = (wi + 1) % words.length; speed = 500 }
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
  const [injected, setInjected] = useState(false)
  const sectionRef = useRef(null)
  const vis        = useReveal(sectionRef, 0.01)
  const typingRef  = useTyping(WORDS)

  useEffect(() => {
    if (injected) return
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setInjected(true)
  }, [injected])

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
                  <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="/shivam-Resume.pdf"
                className="hero-cta-secondary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download resume"
              >
                <span>Download CV</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 1v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

            {/* stats */}
            <div className={`hero-stats${vis ? ' vis' : ''}`}>
              {[
                { val: '4+',   label: 'Projects Shipped',   accent: true  },
                { val: '2+',   label: 'Years of Learning',  accent: false },
                { val: '15+',  label: 'Technologies',        accent: false },
              ].map(s => (
                <div key={s.label} className="hero-stat">
                  <div className="stat-val">
                    {s.accent ? <><span>{s.val.replace('+','')}</span>+</> : s.val}
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className={`hero-right${vis ? ' vis' : ''}`}>

            {/* avatar card */}
            <div className="hero-avatar-card">
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
            <div className="hero-card">
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