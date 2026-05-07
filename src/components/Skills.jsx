import { useEffect, useRef, useState } from 'react'

import './Skills.css';

/* ─── Styles ──────────────────────────────────────────────────────────── */


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

const CATEGORIES = [
  {
    key: 'lang', icon: 'fas fa-code', label: 'Languages', type: 'bars', color: '#00f0ff',
    items: [
      { name: 'Python', pct: 90 },
      { name: 'JavaScript', pct: 75 },
      { name: 'TypeScript', pct: 70 },
      { name: 'SQL', pct: 75 },
      { name: 'C++', pct: 85 },
      { name: 'C', pct: 90 },

    ]
  },
  {
    key: 'ai', icon: 'fas fa-brain', label: 'AI & Data Science', type: 'bars', color: '#00ff88',
    items: [
      { name: 'TensorFlow', pct: 50 }, { name: 'PyTorch', pct: 75 }, { name: 'OpenCV', pct: 72 },
    ],
  },
  {
    key: 'tools', icon: 'fas fa-tools', label: 'Frameworks & Tools', type: 'tags', color: '#a855f7',
    items: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'Docker', 'Git/GitHub', 'VS Code', 'Pandas/NumPy'],
  },
]

function SkillBar({ name, pct, color, delay = 0 }) {
  const barRef = useRef(null)
  const [anim, setAnim] = useState(false)
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setAnim(true), delay); obs.disconnect() } },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return (
    <div className="sk-row" ref={barRef}>
      <div className="sk-row-head">
        <span className="sk-name">{name}</span>
        <span className="sk-pct">{pct}%</span>
      </div>
      <div className="sk-bar-track">
        <div className={`sk-bar-fill${anim ? ' anim' : ''}`} style={{ '--sk-c': color, '--sk-w': `${pct}%` }} />
      </div>
    </div>
  )
}

export default function Skills() {
  const [activeCat, setActiveCat] = useState('lang')
  const headRef = useRef(null)
  const sideRef = useRef(null)
  const panelRef = useRef(null)
  const headVis = useReveal(headRef, 0.08)
  const sideVis = useReveal(sideRef, 0.08)
  const panelVis = useReveal(panelRef, 0.08)



  const cat = CATEGORIES.find(c => c.key === activeCat)

  return (
    <section id="skills">
      <div className="skills-container">
        <div ref={headRef}>
          <p className={`sk-eyebrow${headVis ? ' vis' : ''}`}>Capabilities</p>
          <h2 className={`sk-title${headVis ? ' vis' : ''}`}>Technical <em>Arsenal.</em></h2>
        </div>
        <div className="skills-body">
          <div ref={sideRef} className={`skills-sidebar${sideVis ? ' vis' : ''}`}>
            <div className="sidebar-head">Categories</div>
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                className={`sk-cat-btn${activeCat === c.key ? ' active' : ''}`}
                onClick={() => setActiveCat(c.key)}
                aria-pressed={activeCat === c.key}
              >
                <i className={`${c.icon} sk-cat-icon`} aria-hidden="true" />
                {c.label}
                <span className="sk-cat-count">{c.items.length}</span>
              </button>
            ))}
          </div>
          <div ref={panelRef} className={`skills-panel${panelVis ? ' vis' : ''}`}>
            <div className="panel-body">
              <h3 className="panel-cat-title">
                <i className={cat.icon} aria-hidden="true" />
                {cat.label}
              </h3>
              {cat.type === 'bars'
                ? (
                  <div className="sk-rows">
                    {cat.items.map((item, i) => (
                      <SkillBar key={item.name} name={item.name} pct={item.pct} color={cat.color} delay={i * 80} />
                    ))}
                  </div>
                ) : (
                  <div className="sk-tools">
                    {cat.items.map(t => <span key={t} className="sk-tool">{t}</span>)}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}