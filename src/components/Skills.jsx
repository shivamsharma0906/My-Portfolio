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

  #skills {
    position: relative;
    padding: 140px 0 160px;
    background: var(--bg);
    overflow: hidden;
  }
  #skills::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 15%, transparent 100%);
    pointer-events: none;
  }

  .skills-container {
    position: relative; z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
  }

  .sk-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--cyan);
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px;
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .sk-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--cyan); }
  .sk-eyebrow.vis { opacity: 1; transform: translateY(0); }

  .sk-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800; line-height: 0.95; letter-spacing: -0.03em;
    color: var(--white); margin-bottom: 80px;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
  }
  .sk-title em { font-style: normal; -webkit-text-stroke: 1px var(--cyan); color: transparent; }
  .sk-title.vis { opacity: 1; transform: translateY(0); }

  .skills-body {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 2px;
    align-items: start;
  }

  .skills-sidebar {
    background: var(--surface);
    border: 1px solid var(--border);
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
  }
  .skills-sidebar.vis { opacity: 1; transform: translateY(0); }

  .sidebar-head {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--muted);
  }

  .sk-cat-btn {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 14px 20px;
    background: none; border: none;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--muted);
    text-align: left;
    transition: color 0.25s, background 0.25s;
    position: relative;
  }
  .sk-cat-btn:last-child { border-bottom: none; }
  .sk-cat-btn:hover { color: var(--white); background: rgba(255,255,255,0.02); }
  .sk-cat-btn.active { color: var(--white); background: var(--cyan-dim); }
  .sk-cat-btn.active::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 2px; background: var(--cyan); box-shadow: 0 0 8px var(--cyan);
  }
  .sk-cat-icon { font-size: 14px; }
  .sk-cat-count { margin-left: auto; font-size: 11px; color: var(--muted); opacity: 0.6; }
  .sk-cat-btn.active .sk-cat-count { color: var(--cyan); opacity: 1; }

  .skills-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    position: relative; overflow: hidden;
    opacity: 0; transform: translateX(16px);
    transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
  }
  .skills-panel.vis { opacity: 1; transform: translateX(0); }
  .skills-panel::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 0; height: 0; border-style: solid;
    border-width: 0 36px 36px 0;
    border-color: transparent var(--bg) transparent transparent;
    z-index: 1;
  }
  .skills-panel::after {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px);
    pointer-events: none; z-index: 0;
  }

  .panel-body { position: relative; z-index: 1; padding: 36px 40px; }

  .panel-cat-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 700; letter-spacing: -0.01em;
    color: var(--white); margin-bottom: 32px;
    display: flex; align-items: center; gap: 12px;
  }
  .panel-cat-title i { font-size: 14px; color: var(--cyan); }

  .sk-rows { display: flex; flex-direction: column; gap: 20px; }
  .sk-row { display: flex; flex-direction: column; gap: 8px; }
  .sk-row-head { display: flex; align-items: center; justify-content: space-between; }
  .sk-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--white);
  }
  .sk-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em; color: var(--muted); }
  .sk-bar-track { height: 3px; background: var(--border); position: relative; overflow: hidden; }
  .sk-bar-fill {
    height: 100%;
    background: var(--sk-c, var(--cyan));
    box-shadow: 0 0 8px var(--sk-c, var(--cyan));
    width: 0;
    transition: width 1s cubic-bezier(.22,1,.36,1);
  }
  .sk-bar-fill.anim { width: var(--sk-w); }

  .sk-tools { display: flex; flex-wrap: wrap; gap: 6px; }
  .sk-tool {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 6px 14px;
    border: 1px solid var(--border);
    color: var(--muted);
    transition: color 0.25s, border-color 0.25s, background 0.25s;
    cursor: default;
  }
  .sk-tool:hover { color: var(--cyan); border-color: var(--border-h); background: var(--cyan-dim); }

  @media (max-width: 900px) {
    .skills-body { grid-template-columns: 1fr; }
    .skills-panel { transform: translateX(0) translateY(16px); }
    .skills-panel.vis { transform: translateX(0) translateY(0); }
  }
  @media (max-width: 768px) {
    .skills-container { padding: 0 24px; }
    .panel-body { padding: 24px 20px; }
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

const CATEGORIES = [
  {
    key: 'lang', icon: 'fas fa-code', label: 'Languages', type: 'bars', color: '#00f0ff',
    items: [
      { name: 'Python', pct: 90 }, { name: 'JavaScript', pct: 82 },
      { name: 'TypeScript', pct: 70 }, { name: 'SQL', pct: 65 }, { name: 'C++', pct: 58 },
    ],
  },
  {
    key: 'ai', icon: 'fas fa-brain', label: 'AI & Data Science', type: 'bars', color: '#00ff88',
    items: [
      { name: 'TensorFlow', pct: 80 }, { name: 'PyTorch', pct: 75 },
      { name: 'Scikit-learn', pct: 85 }, { name: 'OpenCV', pct: 72 }, { name: 'LangChain', pct: 68 },
    ],
  },
  {
    key: 'tools', icon: 'fas fa-tools', label: 'Frameworks & Tools', type: 'tags', color: '#a855f7',
    items: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'Docker', 'Git/GitHub', 'VS Code', 'Streamlit', 'Pandas/NumPy', 'HuggingFace', 'FastAPI'],
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
  const [injected, setInjected] = useState(false)
  const [activeCat, setActiveCat] = useState('lang')
  const headRef  = useRef(null)
  const sideRef  = useRef(null)
  const panelRef = useRef(null)
  const headVis  = useReveal(headRef, 0.08)
  const sideVis  = useReveal(sideRef, 0.08)
  const panelVis = useReveal(panelRef, 0.08)

  useEffect(() => {
    if (injected) return
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setInjected(true)
  }, [injected])

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