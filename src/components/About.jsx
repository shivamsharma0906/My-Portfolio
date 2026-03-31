import { useEffect, useRef, useState } from 'react'

import './About.css';

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
  const headRef = useRef(null)
  const textRef = useRef(null)
  const rightRef = useRef(null)

  const headVis = useReveal(headRef, 0.08)
  const textVis = useReveal(textRef, 0.08)
  const rightVis = useReveal(rightRef, 0.08)



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
