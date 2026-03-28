import { useEffect, useRef, useState } from 'react'

/* ─── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500&family=Instrument+Sans:ital,wght@0,400;0,500;1,400&display=swap');

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
  #about {
    position: relative;
    padding: 140px 0 160px;
    background: var(--bg);
    overflow: hidden;
  }

  #about::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 10%, transparent 100%);
    pointer-events: none;
  }

  .about-container {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
  }

  /* ── Header ── */
  .about-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cyan);
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .about-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--cyan); }
  .about-eyebrow.vis { opacity: 1; transform: translateY(0); }

  .about-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.03em;
    color: var(--white);
    margin-bottom: 80px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
  }
  .about-headline em {
    font-style: normal;
    -webkit-text-stroke: 1px var(--cyan);
    color: transparent;
  }
  .about-headline.vis { opacity: 1; transform: translateY(0); }

  /* ── Body grid ── */
  .about-body {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2px;
    align-items: start;
  }

  /* ── Left: text + facts ── */
  .about-text-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 48px;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
  }
  .about-text-panel.vis { opacity: 1; transform: translateY(0); }

  /* top-right corner cut */
  .about-text-panel::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 40px 40px 0;
    border-color: transparent var(--surface2) transparent transparent;
  }

  /* scan lines */
  .about-text-panel::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 3px,
      rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px
    );
    pointer-events: none;
    z-index: 0;
  }

  .panel-inner-rel { position: relative; z-index: 1; }

  .panel-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .panel-label::before { content: ''; width: 20px; height: 1px; background: var(--cyan); }

  .about-paragraphs {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .about-para {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 15px;
    line-height: 1.85;
    color: var(--muted);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .about-para.vis { opacity: 1; transform: translateY(0); }
  .about-para em { color: var(--white); font-style: normal; font-weight: 500; }

  /* fact grid */
  .about-facts {
    margin-top: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    border-top: 1px solid var(--border);
    padding-top: 40px;
  }
  .fact-item {
    padding: 16px 0 16px 0;
    border-right: 1px solid var(--border);
    padding-right: 24px;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .fact-item:nth-child(even) { border-right: none; padding-left: 24px; padding-right: 0; }
  .fact-item.vis { opacity: 1; transform: translateY(0); }
  .fact-key {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .fact-val {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--white);
    letter-spacing: -0.01em;
  }

  /* ── Right: image + status ── */
  .about-right {
    display: flex;
    flex-direction: column;
    gap: 2px;
    opacity: 0;
    transform: translateX(20px);
    transition: opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s;
  }
  .about-right.vis { opacity: 1; transform: translateX(0); }

  /* image frame */
  .about-img-panel {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .about-img-panel::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 32px 32px 0;
    border-color: transparent var(--bg) transparent transparent;
    z-index: 2;
  }
  .about-img-panel img {
    width: 100%;
    height: 360px;
    object-fit: cover;
    display: block;
    filter: grayscale(15%) contrast(1.05);
    transition: filter 0.5s;
  }
  .about-img-panel:hover img { filter: grayscale(0%) contrast(1.08); }

  /* image overlay info bar */
  .img-info-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 10px 16px;
    background: rgba(4,4,10,0.85);
    backdrop-filter: blur(8px);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    z-index: 3;
  }
  .img-info-bar span { color: var(--cyan); }

  /* status panel */
  .about-status-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .status-row:last-child { border-bottom: none; padding-bottom: 0; }
  .status-row strong { color: var(--white); font-weight: 500; }
  .status-badge {
    padding: 3px 10px;
    border: 1px solid rgba(0,255,136,0.3);
    font-size: 11px;
    color: var(--green);
    letter-spacing: 0.1em;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .about-body { grid-template-columns: 1fr; }
    .about-right { transform: translateX(0) translateY(20px); }
    .about-right.vis { transform: translateX(0) translateY(0); }
  }
  @media (max-width: 768px) {
    .about-container { padding: 0 24px; }
    .about-text-panel { padding: 28px 24px; }
    .about-facts { grid-template-columns: 1fr; }
    .fact-item { border-right: none !important; padding-left: 0 !important; border-bottom: 1px solid var(--border); }
    .fact-item:last-child { border-bottom: none; }
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

/* ─── Facts data ──────────────────────────────────────────────────────── */
const FACTS = [
  // { key: 'Degree', val: 'B.Tech CSE (AI/ML)' },
  // { key: 'Year', val: '2nd Year' },
  { key: 'Location', val: 'Kolkata, India' },
  { key: 'Focus', val: 'Deep Learning' },
  // { key: 'Status', val: 'Seeking Internship' },
  // { key: 'Email', val: 'shivam17sharma2004@gmail.com' },
]

/* ─── Component ───────────────────────────────────────────────────────── */
export default function About() {
  const [injected, setInjected] = useState(false)
  const headRef = useRef(null)
  const textRef = useRef(null)
  const rightRef = useRef(null)

  const headVis = useReveal(headRef, 0.08)
  const textVis = useReveal(textRef, 0.08)
  const rightVis = useReveal(rightRef, 0.08)

  useEffect(() => {
    if (injected) return
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setInjected(true)
  }, [injected])

  return (
    <section id="about">
      <div className="about-container">

        {/* ── Header ── */}
        <div ref={headRef}>
          <p className={`about-eyebrow${headVis ? ' vis' : ''}`}>Who I Am</p>
          <h2 className={`about-headline${headVis ? ' vis' : ''}`}>
            About <em>Me.</em>
          </h2>
        </div>

        {/* ── Body ── */}
        <div className="about-body">

          {/* Left: text panel */}
          <div ref={textRef} className={`about-text-panel${textVis ? ' vis' : ''}`}>
            <div className="panel-inner-rel">
              <p className="panel-label">Bio</p>
              <div className="about-paragraphs">
                {[
                  <>
                    Hello, I'm <strong>Shivam Sharma</strong> — an AI & ML developer building <strong>intelligent, real-world systems</strong>. I turn ideas into <strong>functional products</strong> using machine learning, clean engineering, and thoughtful design.
                  </>,
                  <>
                    I create <strong>AI-powered web applications</strong>, automation tools, and <strong>data-driven systems</strong> with experience in <strong>deep learning, NLP, and computer vision</strong>.
                  </>,
                  <>
                    I actively build projects, explore emerging technologies, and contribute to <strong>open-source</strong>, constantly improving through <strong>real-world development</strong>.
                  </>,
                ].map((para, i) => (
                  <p
                    key={i}
                    className={`about-para${textVis ? ' vis' : ''}`}
                    style={{ transitionDelay: textVis ? `${0.1 + i * 0.12}s` : '0s' }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Facts grid */}
              <div className="about-facts">
                {FACTS.map((f, i) => (
                  <div
                    key={f.key}
                    className={`fact-item${textVis ? ' vis' : ''}`}
                    style={{ transitionDelay: textVis ? `${0.4 + i * 0.07}s` : '0s' }}
                  >
                    <div className="fact-key">{f.key}</div>
                    <div className="fact-val">{f.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: image + status */}
          <div ref={rightRef} className={`about-right${rightVis ? ' vis' : ''}`}>
            <div className="about-img-panel">
              <img
                src="/cafe.jpg"
                alt="Shivam Sharma"
                loading="lazy"
                onLoad={(e) => e.target.classList.add('loaded')}
              />
              <div className="img-info-bar">
                <span>shivam.jpg</span>
                <span>Kolkata · 2026</span>
              </div>
            </div>
            <div className="about-status-panel">
              {[
                { key: 'Status', val: 'Open to Work', badge: true },
                { key: 'Currently', val: 'B.Tech AI/ML', badge: false },
                { key: 'Availability', val: 'Internships', badge: false },
              ].map(s => (
                <div key={s.key} className="status-row">
                  <span>{s.key}</span>
                  {s.badge
                    ? <span className="status-badge">{s.val}</span>
                    : <strong>{s.val}</strong>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
