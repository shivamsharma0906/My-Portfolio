import { useEffect, useRef, useState } from 'react'

import './Experience.css';

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

/* ─── Data ────────────────────────────────────────────────────────────── */
const ITEMS = [
  {
    id: 'EXP_01',
    date: '2024 – Present',
    role: 'B.Tech in CSE (AI/ML)',
    org: 'Techno Main SaltLake',
    icon: 'fas fa-university',
    desc: 'Currently specializing in Artificial Intelligence and Machine Learning. Building a strong foundation in Data Structures, Algorithms, and Deep Learning architectures while working on real-world AI projects.',
    tags: ['Deep Learning', 'Algorithms', 'AI/ML', 'DSA'],
  },
  {
    id: 'EXP_02',
    date: '2026 – Present',
    role: 'AI/ML Self-Directed Learner',
    org: 'Independent',
    icon: 'fas fa-laptop-code',
    desc: 'Actively developing skills in Computer Vision and NLP through hands-on projects like weather forecasting apps, attendance tracking systems, and LangChain chatbots. Contributing to open-source AI communities.',
    tags: ['Computer Vision', 'NLP', 'LangChain', 'OpenCV'],
  },
]

/* ─── Component ───────────────────────────────────────────────────────── */
export default function Experience() {
  const headRef = useRef(null)
  const headVis = useReveal(headRef, 0.08)



  return (
    <section id="experience">
      <div className="exp-container">

        {/* Header */}
        <div ref={headRef}>
          <p className={`exp-eyebrow${headVis ? ' vis' : ''}`}>Career Path</p>
          <h2 className={`exp-title${headVis ? ' vis' : ''}`}>
            Experience &amp; <em>Education</em>
          </h2>
        </div>

        {/* Timeline */}
        <div className="exp-timeline">
          {ITEMS.map((item, idx) => (
            <ExpItem key={item.id} item={item} index={idx} />
          ))}
        </div>

      </div>
    </section>
  )
}

function ExpItem({ item, index }) {
  const ref = useRef(null)
  const vis = useReveal(ref, 0.1)

  return (
    <div
      ref={ref}
      className={`exp-item${vis ? ' vis' : ''}`}
      style={{ transitionDelay: vis ? `${index * 0.15}s` : '0s' }}
    >
      {/* Dot */}
      <div className="exp-dot-col">
        <div className="exp-dot">
          <div className="exp-dot-inner" />
        </div>
      </div>

      {/* Card */}
      <div className="exp-card">
        <div className="exp-card-top">
          <div>
            <span className="exp-date-badge">{item.date}</span>
          </div>
          <span className="exp-card-id" aria-hidden="true">{item.id}</span>
        </div>
        <h3 className="exp-role">{item.role}</h3>
        <p className="exp-org">
          <i className={item.icon} aria-hidden="true" />
          {item.org}
        </p>
        <p className="exp-desc">{item.desc}</p>
        <div className="exp-tags">
          {item.tags.map(t => (
            <span key={t} className="exp-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
