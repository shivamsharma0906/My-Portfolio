import { useEffect, useRef, useState } from 'react'

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
  #what-i-do {
    position: relative;
    padding: 140px 0 160px;
    background: var(--bg);
    overflow: hidden;
  }
  #what-i-do::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 15%, transparent 100%);
    pointer-events: none;
  }

  .wid-container {
    position: relative; z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
  }

  .wid-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--cyan);
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px;
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .wid-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--cyan); }
  .wid-eyebrow.vis { opacity: 1; transform: translateY(0); }

  .wid-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800; line-height: 0.95; letter-spacing: -0.03em;
    color: var(--white); margin-bottom: 80px;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
  }
  .wid-title em { font-style: normal; -webkit-text-stroke: 1px var(--cyan); color: transparent; }
  .wid-title.vis { opacity: 1; transform: translateY(0); }

  /* ── Service grid ── */
  .wid-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }

  /* ── Service card ── */
  .wid-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 40px 32px 32px;
    position: relative; overflow: hidden;
    transition: border-color 0.35s, background 0.35s;
    cursor: default;
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.6s ease, transform 0.6s ease,
                border-color 0.35s, background 0.35s;
    display: flex; flex-direction: column;
  }
  .wid-card.vis { opacity: 1; transform: translateY(0); }
  .wid-card:hover { border-color: var(--wid-c, var(--border-h)); background: var(--surface2); }

  /* corner */
  .wid-card::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 0; height: 0; border-style: solid;
    border-width: 0 28px 28px 0;
    border-color: transparent var(--surface2) transparent transparent;
    transition: border-color 0.35s;
  }
  .wid-card:hover::before { border-color: transparent var(--bg) transparent transparent; }

  /* top bar */
  .wid-card-bar {
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--wid-c, var(--cyan));
    box-shadow: 0 0 12px var(--wid-c, var(--cyan));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(.22,1,.36,1);
  }
  .wid-card:hover .wid-card-bar { transform: scaleX(1); }

  /* num */
  .wid-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--border);
    margin-bottom: 24px;
    transition: color 0.3s;
  }
  .wid-card:hover .wid-num { color: var(--cyan-mid); }

  /* icon */
  .wid-icon {
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border);
    background: var(--bg);
    margin-bottom: 20px;
    font-size: 18px;
    color: var(--muted);
    transition: color 0.3s, border-color 0.3s, box-shadow 0.3s;
  }
  .wid-card:hover .wid-icon {
    color: var(--wid-c, var(--cyan));
    border-color: var(--wid-c, var(--border-h));
    box-shadow: 0 0 14px rgba(0,240,255,0.12);
  }

  /* title */
  .wid-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 700; letter-spacing: -0.01em;
    color: var(--white); margin-bottom: 12px;
  }

  /* desc */
  .wid-card-desc {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13.5px; line-height: 1.75;
    color: var(--muted);
    flex: 1;
    transition: color 0.3s;
  }
  .wid-card:hover .wid-card-desc { color: #8a8aa0; }

  /* tools row */
  .wid-card-tools {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin-top: 24px; padding-top: 20px;
    border-top: 1px solid var(--border);
  }
  .wid-tool {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 4px 11px;
    border: 1px solid var(--border);
    color: var(--muted);
    transition: color 0.25s, border-color 0.25s;
  }
  .wid-card:hover .wid-tool { color: var(--wid-c, var(--cyan)); border-color: rgba(0,240,255,0.2); }

  /* ── Bottom strip ── */
  .wid-strip {
    display: flex; gap: 2px;
    margin-top: 2px;
  }
  .wid-strip-item {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted);
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .wid-strip-item.vis { opacity: 1; transform: translateY(0); }
  .wid-strip-val {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800; letter-spacing: -0.02em;
    color: var(--white);
  }
  .wid-strip-val span { color: var(--cyan); }

  @media (max-width: 1024px) { .wid-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 768px) {
    .wid-container { padding: 0 24px; }
    .wid-grid { grid-template-columns: 1fr; }
    .wid-strip { flex-direction: column; }
    .wid-card { padding: 28px 24px 24px; }
  }
`

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

const SERVICES = [
  {
    num:   'SVC_01',
    icon:  'fas fa-brain',
    title: 'Machine Learning',
    color: '#00f0ff',
    desc:  'Building ML models for classification, prediction, and intelligent automation using Python — from data preprocessing to model evaluation and deployment.',
    tools: ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib'],
  },
  {
    num:   'SVC_02',
    icon:  'fas fa-network-wired',
    title: 'Deep Learning',
    color: '#00ff88',
    desc:  'Designing and training deep neural networks (CNNs, RNNs, Transformers) for computer vision, NLP, and time-series tasks using TensorFlow and PyTorch.',
    tools: ['TensorFlow', 'PyTorch', 'Keras', 'OpenCV'],
  },
  {
    num:   'SVC_03',
    icon:  'fas fa-code',
    title: 'Web Development',
    color: '#a855f7',
    desc:  'Modern, responsive full-stack web applications with React, Node.js, and MongoDB — designed for performance, accessibility, and delightful UX.',
    tools: ['React.js', 'Node.js', 'MongoDB', 'Firebase'],
  },
  {
    num:   'SVC_04',
    icon:  'fas fa-robot',
    title: 'AI Chatbots',
    color: '#ffb800',
    desc:  'Conversational AI experiences built with LangChain, OpenAI, and vector databases — retrieval-augmented generation (RAG) and intelligent Q&A systems.',
    tools: ['LangChain', 'OpenAI', 'Streamlit', 'Chroma'],
  },
  {
    num:   'SVC_05',
    icon:  'fas fa-eye',
    title: 'Computer Vision',
    color: '#ff6b6b',
    desc:  'Image classification, object detection, and medical imaging analysis — real-world CV systems using OpenCV, transfer learning, and custom CNNs.',
    tools: ['OpenCV', 'YOLO', 'PIL/Pillow', 'Augmentation'],
  },
  {
    num:   'SVC_06',
    icon:  'fas fa-comment-dots',
    title: 'NLP & Text AI',
    color: '#00d4aa',
    desc:  'Text processing, sentiment analysis, summarization, and semantic search — leveraging HuggingFace Transformers and pre-trained language models.',
    tools: ['HuggingFace', 'Transformers', 'NLTK', 'spaCy'],
  },
]

const STATS = [
  { label: 'Areas of Expertise', val: '6+', accent: true  },
  { label: 'Technologies Used',  val: '15+', accent: false },
  { label: 'Projects Delivered', val: '4+', accent: false  },
]

export default function WhatIDo() {
  const [injected, setInjected] = useState(false)
  const headRef  = useRef(null)
  const stripRef = useRef(null)
  const headVis  = useReveal(headRef, 0.08)
  const stripVis = useReveal(stripRef, 0.08)

  useEffect(() => {
    if (injected) return
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setInjected(true)
  }, [injected])

  return (
    <section id="what-i-do">
      <div className="wid-container">
        <div ref={headRef}>
          <p className={`wid-eyebrow${headVis ? ' vis' : ''}`}>Services</p>
          <h2 className={`wid-title${headVis ? ' vis' : ''}`}>What I <em>Do.</em></h2>
        </div>

        {/* Service grid */}
        <div className="wid-grid">
          {SERVICES.map((s, i) => <ServiceCard key={s.num} service={s} index={i} />)}
        </div>

        {/* Stats strip */}
        <div ref={stripRef} className="wid-strip">
          {STATS.map((st, i) => (
            <div
              key={st.label}
              className={`wid-strip-item${stripVis ? ' vis' : ''}`}
              style={{ transitionDelay: stripVis ? `${i * 0.1}s` : '0s' }}
            >
              <span>{st.label}</span>
              <span className="wid-strip-val">
                {st.accent ? <><span>{st.val.replace('+','')}</span>+</> : st.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, index }) {
  const ref = useRef(null)
  const vis = useReveal(ref, 0.08)
  return (
    <div
      ref={ref}
      className={`wid-card${vis ? ' vis' : ''}`}
      style={{ '--wid-c': service.color, transitionDelay: vis ? `${index * 0.08}s` : '0s' }}
    >
      <div className="wid-card-bar" aria-hidden="true" />
      <p className="wid-num" aria-hidden="true">{service.num}</p>
      <div className="wid-icon" aria-hidden="true"><i className={service.icon} /></div>
      <h3 className="wid-card-title">{service.title}</h3>
      <p className="wid-card-desc">{service.desc}</p>
      <div className="wid-card-tools">
        {service.tools.map(t => <span key={t} className="wid-tool">{t}</span>)}
      </div>
    </div>
  )
}