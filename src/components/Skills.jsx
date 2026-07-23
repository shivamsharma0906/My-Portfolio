import { useEffect, useRef, useState } from 'react'
import { useTilt } from '../hooks/useTilt'
import './Skills.css';

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
    key: 'ai',
    label: 'AI & Data Science',
    icon: 'fas fa-brain',
    color: '#00f0ff',
    items: [
      { name: 'PyTorch', tag: 'Deep Learning & Vision', level: 'Production', icon: 'fas fa-fire' },
      { name: 'TensorFlow', tag: 'Neural Architectures', level: 'Advanced', icon: 'fas fa-cube' },
      { name: 'OpenCV', tag: 'Computer Vision & Filters', level: 'Advanced', icon: 'fas fa-eye' },
      { name: 'Scikit-Learn', tag: 'Predictive ML Models', level: 'Production', icon: 'fas fa-chart-line' },
      { name: 'LangChain', tag: 'LLMs & RAG Pipelines', level: 'Advanced', icon: 'fas fa-robot' },
      { name: 'Transformers', tag: 'NLP & HuggingFace', level: 'Exploring', icon: 'fas fa-bolt' },
      { name: 'NumPy & Pandas', tag: 'Data Engineering', level: 'Production', icon: 'fas fa-table' },
    ]
  },
  {
    key: 'lang',
    label: 'Languages',
    icon: 'fas fa-code',
    color: '#00ff88',
    items: [
      { name: 'Python', tag: 'AI / Backend / Scripting', level: 'Primary', icon: 'fab fa-python' },
      { name: 'C++', tag: 'Systems & Algorithms', level: 'Advanced', icon: 'fas fa-terminal' },
      { name: 'C', tag: 'Core Programming', level: 'Advanced', icon: 'fas fa-microchip' },
      { name: 'TypeScript', tag: 'Type-Safe Web Systems', level: 'Proficient', icon: 'fab fa-js' },
      { name: 'JavaScript', tag: 'Client Logic & ES6+', level: 'Advanced', icon: 'fab fa-js-square' },
      { name: 'SQL', tag: 'Relational Database Queries', level: 'Proficient', icon: 'fas fa-database' },
    ]
  },
  {
    key: 'web',
    label: 'Web & Full-Stack',
    icon: 'fas fa-layer-group',
    color: '#a855f7',
    items: [
      { name: 'React.js', tag: 'Modern Component Architectures', level: 'Production', icon: 'fab fa-react' },
      { name: 'Next.js', tag: 'Full-Stack SSR & App Router', level: 'Advanced', icon: 'fas fa-globe' },
      { name: 'Node.js', tag: 'REST APIs & Server Runtime', level: 'Advanced', icon: 'fab fa-node-js' },
      { name: 'MongoDB', tag: 'NoSQL & Schema Design', level: 'Production', icon: 'fas fa-database' },
      { name: 'Firebase', tag: 'Realtime DB & Auth', level: 'Production', icon: 'fas fa-fire' },
      { name: 'Tailwind CSS', tag: 'Design Systems', level: 'Production', icon: 'fas fa-paint-brush' },
      { name: 'Framer Motion', tag: 'UI Micro-Animations', level: 'Advanced', icon: 'fas fa-magic' },
    ]
  },
  {
    key: 'tools',
    label: 'DevOps & Arsenal',
    icon: 'fas fa-tools',
    color: '#ffb800',
    items: [
      { name: 'Docker', tag: 'Containerization & Environments', level: 'Proficient', icon: 'fab fa-docker' },
      { name: 'Git & GitHub', tag: 'Version Control & Workflows', level: 'Production', icon: 'fab fa-github' },
      { name: 'Linux / Bash', tag: 'CLI & System Scripting', level: 'Advanced', icon: 'fab fa-linux' },
      { name: 'Vercel & Render', tag: 'CI/CD & Cloud Deployment', level: 'Production', icon: 'fas fa-cloud-upload-alt' },
      { name: 'Postman', tag: 'API Testing & Documentation', level: 'Daily', icon: 'fas fa-vial' },
    ]
  }
]

function SkillCard({ item, color, index }) {
  const ref = useRef(null)
  useTilt({ max: 8, scale: 1.02, glare: true, maxGlare: 0.12 }, ref)

  return (
    <div
      ref={ref}
      className="sk-card"
      style={{ '--sk-color': color, transitionDelay: `${index * 0.05}s` }}
    >
      <div className="sk-card-top">
        <span className="sk-card-icon">
          <i className={item.icon} aria-hidden="true" />
        </span>
        <span className={`sk-level-badge level-${item.level.toLowerCase()}`}>
          {item.level}
        </span>
      </div>
      <h4 className="sk-card-name">{item.name}</h4>
      <p className="sk-card-tag">{item.tag}</p>
    </div>
  )
}

export default function Skills() {
  const [activeCat, setActiveCat] = useState('ai')
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
          {/* Categories Navigation */}
          <div ref={sideRef} className={`skills-sidebar${sideVis ? ' vis' : ''}`}>
            <div className="sidebar-head">SKILL MATRIX</div>
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                className={`sk-cat-btn${activeCat === c.key ? ' active' : ''}`}
                onClick={() => setActiveCat(c.key)}
                aria-pressed={activeCat === c.key}
              >
                <i className={`${c.icon} sk-cat-icon`} aria-hidden="true" style={{ color: c.color }} />
                <span>{c.label}</span>
                <span className="sk-cat-count">{c.items.length}</span>
              </button>
            ))}
          </div>

          {/* Cards Panel */}
          <div ref={panelRef} className={`skills-panel${panelVis ? ' vis' : ''}`}>
            <div className="panel-body">
              <div className="panel-cat-header">
                <h3 className="panel-cat-title">
                  <i className={cat.icon} aria-hidden="true" style={{ color: cat.color }} />
                  {cat.label}
                </h3>
                <span className="panel-cat-badge">{cat.items.length} TECH STACK ITEMS</span>
              </div>

              <div className="sk-grid">
                {cat.items.map((item, i) => (
                  <SkillCard key={item.name} item={item} color={cat.color} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}