import { useEffect, useRef, useState } from 'react'

import './AiMlExpertise.css';

/* ─── Styles ──────────────────────────────────────────────────────────── */


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
  const headRef = useRef(null)
  const philRef = useRef(null)
  const headVis = useReveal(headRef, 0.08)
  const philVis = useReveal(philRef, 0.08)



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
