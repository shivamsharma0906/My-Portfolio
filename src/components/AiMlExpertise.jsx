import { useEffect, useRef, useState } from 'react'

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
    --amber:    #ffb800;
    --purple:   #a855f7;
    --white:    #eeeef2;
    --muted:    #6b6b80;
    --border:   rgba(255,255,255,0.06);
    --border-h: rgba(0,240,255,0.22);
  }

  /* ── Section ── */
  #ai-ml-expertise {
    position: relative;
    padding: 140px 0 160px;
    background: var(--bg);
    overflow: hidden;
  }
  #ai-ml-expertise::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
    pointer-events: none;
  }
  /* glow */
  #ai-ml-expertise::after {
    content: '';
    position: absolute;
    top: 30%;
    right: -5%;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(168,85,247,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .aiml-container {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
  }

  /* ── Header ── */
  .aiml-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cyan);
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px;
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .aiml-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--cyan); }
  .aiml-eyebrow.vis { opacity: 1; transform: translateY(0); }

  .aiml-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800; line-height: 0.95; letter-spacing: -0.03em;
    color: var(--white); margin-bottom: 80px;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
  }
  .aiml-title em { font-style: normal; -webkit-text-stroke: 1px var(--cyan); color: transparent; }
  .aiml-title.vis { opacity: 1; transform: translateY(0); }

  /* ── Body split ── */
  .aiml-body {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 2px;
    align-items: start;
  }

  /* ── Expertise grid (left) ── */
  .aiml-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
  }

  /* ── Expertise card ── */
  .aiml-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 32px 28px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.35s, background 0.35s;
    cursor: default;
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease,
                border-color 0.35s, background 0.35s;
  }
  .aiml-card.vis { opacity: 1; transform: translateY(0); }
  .aiml-card:hover { border-color: var(--card-c, var(--border-h)); background: var(--surface2); }

  .aiml-card::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 28px 28px 0;
    border-color: transparent var(--surface2) transparent transparent;
  }

  /* top bar */
  .aiml-card-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--card-c, var(--cyan));
    box-shadow: 0 0 12px var(--card-c, var(--cyan));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(.22,1,.36,1);
  }
  .aiml-card:hover .aiml-card-bar { transform: scaleX(1); }

  .aiml-card-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.16em;
    color: var(--border);
    margin-bottom: 20px;
    transition: color 0.3s;
  }
  .aiml-card:hover .aiml-card-num { color: var(--card-c, var(--cyan-mid)); }

  .aiml-card-icon {
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border);
    background: var(--bg);
    margin-bottom: 16px;
    font-size: 16px;
    color: var(--muted);
    transition: color 0.3s, border-color 0.3s;
  }
  .aiml-card:hover .aiml-card-icon { color: var(--card-c, var(--cyan)); border-color: var(--card-c, var(--border-h)); }

  .aiml-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--white);
    margin-bottom: 16px;
  }

  .aiml-card-list {
    list-style: none;
    display: flex; flex-direction: column; gap: 8px;
  }
  .aiml-card-list li {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.03em;
    color: var(--muted);
    display: flex; align-items: center; gap: 8px;
    transition: color 0.25s;
  }
  .aiml-card:hover .aiml-card-list li { color: #8a8aa0; }
  .aiml-card-list li::before {
    content: '';
    width: 4px; height: 1px;
    background: var(--card-c, var(--cyan));
    flex-shrink: 0;
  }

  /* ── Philosophy panel (right) ── */
  .aiml-phil {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 40px 36px;
    position: relative;
    overflow: hidden;
    display: flex; flex-direction: column; gap: 28px;
    opacity: 0; transform: translateX(20px);
    transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
  }
  .aiml-phil.vis { opacity: 1; transform: translateX(0); }

  /* corner */
  .aiml-phil::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 36px 36px 0;
    border-color: transparent var(--bg) transparent transparent;
  }

  /* scan lines */
  .aiml-phil::after {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px);
    pointer-events: none; z-index: 0;
  }

  .phil-inner { position: relative; z-index: 1; }

  .phil-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--muted);
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px;
  }
  .phil-label::before { content: ''; width: 20px; height: 1px; background: var(--purple); }

  .phil-heading {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 700; letter-spacing: -0.02em;
    color: var(--white); margin-bottom: 16px;
  }
  .phil-heading span { color: var(--cyan); }

  .phil-text {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px; line-height: 1.8;
    color: var(--muted); margin-bottom: 24px;
  }

  .phil-points {
    display: flex; flex-direction: column; gap: 14px;
    list-style: none;
    margin-bottom: 32px;
  }
  .phil-points li {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13.5px; line-height: 1.6;
    color: var(--muted);
    display: flex; align-items: flex-start; gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .phil-points li:last-child { border-bottom: none; padding-bottom: 0; }
  .phil-points li .point-icon {
    font-size: 11px; color: var(--cyan); opacity: 0.8;
    margin-top: 3px; flex-shrink: 0; width: 14px;
  }

  .phil-cta {
    display: inline-flex;
    align-items: center; gap: 10px;
    padding: 12px 24px;
    border: 1px solid var(--cyan);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--cyan); text-decoration: none;
    position: relative; overflow: hidden;
    transition: color 0.3s;
    cursor: pointer;
  }
  .phil-cta::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--cyan);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(.22,1,.36,1);
  }
  .phil-cta:hover::before { transform: scaleX(1); }
  .phil-cta:hover { color: var(--bg); }
  .phil-cta span { position: relative; z-index: 1; }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .aiml-body { grid-template-columns: 1fr; }
    .aiml-phil { transform: translateX(0) translateY(20px); }
    .aiml-phil.vis { transform: translateX(0) translateY(0); }
  }
  @media (max-width: 768px) {
    .aiml-container { padding: 0 24px; }
    .aiml-grid { grid-template-columns: 1fr; }
    .aiml-phil { padding: 28px 24px; }
  }
`

/* ─── Data ────────────────────────────────────────────────────────────── */
const EXPERTISE = [
  {
    num:   'DOM_01',
    icon:  'fas fa-chart-bar',
    title: 'Machine Learning',
    color: '#00f0ff',
    items: ['Supervised/Unsupervised Learning', 'Classification & Regression', 'Model Tuning & Evaluation', 'Scikit-learn, Pandas'],
  },
  {
    num:   'DOM_02',
    icon:  'fas fa-network-wired',
    title: 'Deep Learning',
    color: '#00ff88',
    items: ['Neural Networks (CNN/RNN)', 'Transfer Learning', 'Model Deployment', 'TensorFlow, Keras, PyTorch'],
  },
  {
    num:   'DOM_03',
    icon:  'fas fa-eye',
    title: 'Computer Vision',
    color: '#a855f7',
    items: ['Image Classification', 'Object Detection', 'OpenCV & Augmentation', 'Medical Imaging Concepts'],
  },
  {
    num:   'DOM_04',
    icon:  'fas fa-comment-dots',
    title: 'Natural Language',
    color: '#ffb800',
    items: ['LangChain Chatbots', 'Question Answering Systems', 'Transformer Models', 'Streamlit, OpenAI API'],
  },
]

const PHIL_POINTS = [
  { icon: 'fas fa-brain',     text: 'Constantly exploring the frontier of AI tools and research.' },
  { icon: 'fas fa-book',      text: 'Obsessed with learning — from papers to GitHub builds.' },
  { icon: 'fas fa-handshake', text: 'Collaboration and open-source keep me inspired.' },
  { icon: 'fas fa-bullseye',  text: 'I care about practical outcomes, not just benchmarks.' },
]

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
export default function AiMlExpertise() {
  const [injected, setInjected] = useState(false)
  const headRef = useRef(null)
  const philRef = useRef(null)
  const headVis = useReveal(headRef, 0.08)
  const philVis = useReveal(philRef, 0.08)

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
    <section id="ai-ml-expertise">
      <div className="aiml-container">

        {/* Header */}
        <div ref={headRef}>
          <p className={`aiml-eyebrow${headVis ? ' vis' : ''}`}>Specialization</p>
          <h2 className={`aiml-title${headVis ? ' vis' : ''}`}>
            AI/ML <em>Expertise</em>
          </h2>
        </div>

        {/* Body */}
        <div className="aiml-body">

          {/* Expertise grid */}
          <div className="aiml-grid">
            {EXPERTISE.map((card, i) => (
              <ExpertiseCard key={card.num} card={card} index={i} />
            ))}
          </div>

          {/* Philosophy panel */}
          <div ref={philRef} className={`aiml-phil${philVis ? ' vis' : ''}`}>
            <div className="phil-inner">
              <p className="phil-label">My Approach</p>
              <h3 className="phil-heading">My <span>AI Philosophy</span></h3>
              <p className="phil-text">
                I'm fascinated by how AI can change lives — but only if it's built responsibly.
                I enjoy experimenting with models and frameworks that make real tasks faster and smarter.
              </p>
              <ul className="phil-points">
                {PHIL_POINTS.map(p => (
                  <li key={p.text}>
                    <i className={`${p.icon} point-icon`} aria-hidden="true" />
                    {p.text}
                  </li>
                ))}
              </ul>
              <a
                href="#projects"
                className="phil-cta"
                onClick={scrollTo('#projects')}
                aria-label="Explore my projects"
              >
                <span>Explore My Work</span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function ExpertiseCard({ card, index }) {
  const ref = useRef(null)
  const vis = useReveal(ref, 0.1)
  return (
    <div
      ref={ref}
      className={`aiml-card${vis ? ' vis' : ''}`}
      style={{ '--card-c': card.color, transitionDelay: vis ? `${index * 0.1}s` : '0s' }}
    >
      <div className="aiml-card-bar" aria-hidden="true" />
      <p className="aiml-card-num" aria-hidden="true">{card.num}</p>
      <div className="aiml-card-icon" aria-hidden="true">
        <i className={card.icon} />
      </div>
      <h3 className="aiml-card-title">{card.title}</h3>
      <ul className="aiml-card-list">
        {card.items.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}
