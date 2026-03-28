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
  #projects {
    position: relative;
    padding: 140px 0 160px;
    background: var(--bg);
    overflow: hidden;
  }

  #projects::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
    pointer-events: none;
  }

  .proj-container {
    position: relative; z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
  }

  /* ── Header ── */
  .proj-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--cyan);
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px;
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .proj-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--cyan); }
  .proj-eyebrow.vis { opacity: 1; transform: translateY(0); }

  .proj-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800; line-height: 0.95; letter-spacing: -0.03em;
    color: var(--white); margin-bottom: 24px;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
  }
  .proj-title em { font-style: normal; -webkit-text-stroke: 1px var(--cyan); color: transparent; }
  .proj-title.vis { opacity: 1; transform: translateY(0); }

  /* ── Filter tabs ── */
  .proj-filters {
    display: flex; align-items: center; gap: 4px;
    margin-bottom: 56px;
    flex-wrap: wrap;
    opacity: 0; transform: translateY(10px);
    transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
  }
  .proj-filters.vis { opacity: 1; transform: translateY(0); }
  .proj-filter {
    padding: 8px 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted);
    border: 1px solid transparent;
    background: none;
    cursor: pointer;
    transition: color 0.25s, border-color 0.25s, background 0.25s;
  }
  .proj-filter:hover { color: var(--white); border-color: var(--border); }
  .proj-filter.active {
    color: var(--cyan);
    border-color: var(--border-h);
    background: var(--cyan-dim);
  }

  /* ── Grid ── */
  .proj-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
  }

  /* ── Card ── */
  .proj-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 36px 36px 28px;
    position: relative;
    overflow: hidden;
    display: flex; flex-direction: column;
    transition: border-color 0.35s, background 0.35s;
    cursor: default;
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.6s ease, transform 0.6s ease,
                border-color 0.35s, background 0.35s;
  }
  .proj-card.vis { opacity: 1; transform: translateY(0); }
  .proj-card:hover { border-color: var(--border-h); background: var(--surface2); }

  /* corner */
  .proj-card::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 0; height: 0; border-style: solid;
    border-width: 0 32px 32px 0;
    border-color: transparent var(--surface2) transparent transparent;
    transition: border-color 0.35s;
  }
  .proj-card:hover::before { border-color: transparent var(--bg) transparent transparent; }

  /* top accent bar */
  .proj-card-bar {
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--card-accent, var(--cyan));
    box-shadow: 0 0 12px var(--card-accent, var(--cyan));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(.22,1,.36,1);
  }
  .proj-card:hover .proj-card-bar { transform: scaleX(1); }

  /* top row */
  .proj-card-head {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .proj-card-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 0.18em;
    color: var(--border);
    transition: color 0.3s;
  }
  .proj-card:hover .proj-card-num { color: var(--cyan-mid); }

  .proj-card-links {
    display: flex; gap: 8px;
  }
  .proj-link {
    display: flex; align-items: center; gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    padding: 5px 12px;
    border: 1px solid var(--border);
    transition: color 0.25s, border-color 0.25s;
  }
  .proj-link:hover { color: var(--cyan); border-color: var(--border-h); }
  .proj-link i { font-size: 12px; }

  /* title + desc */
  .proj-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 700; letter-spacing: -0.01em;
    color: var(--white);
    margin-bottom: 12px;
    transition: color 0.3s;
  }
  .proj-card:hover .proj-card-title { color: var(--white); }

  .proj-card-desc {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13.5px; line-height: 1.7;
    color: var(--muted);
    flex: 1;
    transition: color 0.3s;
  }
  .proj-card:hover .proj-card-desc { color: #8a8aa0; }

  /* tags */
  .proj-tags {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }
  .proj-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 11px;
    border: 1px solid var(--border);
    color: var(--muted);
    transition: color 0.25s, border-color 0.25s;
  }
  .proj-card:hover .proj-tag { color: var(--cyan); border-color: rgba(0,240,255,0.2); }

  /* featured badge */
  .proj-featured-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--amber);
    padding: 3px 10px;
    border: 1px solid rgba(255,184,0,0.3);
    background: rgba(255,184,0,0.06);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .proj-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .proj-container { padding: 0 24px; }
    .proj-card { padding: 24px 20px 20px; }
    .proj-card-head { flex-direction: column; gap: 12px; }
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

/* ─── Data ────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    num: 'PRJ_01',
    title: 'VisionOS',
    desc: 'A personal Life Operating System for aligning daily actions with long-term goals, featuring Deep Work focus, financial tracking, year-progress visualization, and future projections.',
    tags: ['React', 'Node.js', 'MongoDB', 'Render'],
    github: 'https://github.com/shivamsharma0906/VisionOS',
    demo: 'https://shivamsharma0906.github.io/VisionOS/',
    accent: '#ae00ffff',
    category: 'Web App',
    featured: true,
  },
  {
    num: 'PRJ_02',
    title: 'Upasthiti Attendance Tracker',
    desc: 'Smart attendance web app with TypeScript, React, Node.js, MongoDB, and Firebase — offering secure login, real-time attendance, and detailed analytics.',
    tags: ['TypeScript', 'React JS', 'Node.js', 'MongoDB', 'Firebase'],
    github: 'https://github.com/shivamsharma0906/Upasthiti-Attendance-Tracker',
    demo: 'https://upasthiti-gamma.vercel.app/',
    accent: '#00ff55ff',
    category: 'Web App',
    featured: true,
  },
  {
    num: 'PRJ_03',
    title: 'Weather Update App',
    desc: 'Responsive weather app using OpenWeatherMap API with geolocation, 5-day forecast, animated icons, theme toggle, and a dynamic background system.',
    tags: ['HTML', 'CSS', 'JavaScript', 'API'],
    github: 'https://github.com/shivamsharma0906/Weather-App',
    demo: 'https://weather-app-navy-chi-12.vercel.app/',
    accent: '#0099ffff',
    category: 'Web App',
    featured: true,
  },
  {
    num: 'PRJ_04',
    title: 'Lift & Fit',
    desc: 'A high-performance, conversion-focused gym website designed to elevate fitness brands digitally. Built with modern UI/UX principles, featuring smooth scroll-trigger animations, interactive sections, and a visually immersive experience.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/shivamsharma0906/Gym-website',
    demo: 'https://liftandfit.vercel.app/',
    accent: '#fc0505ff',
    category: 'Web App',
    featured: true,
  },
]

const FILTERS = ['All', 'Web App', 'AI/ML']

/* ─── Component ───────────────────────────────────────────────────────── */
export default function Projects() {
  const [injected, setInjected] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const headRef = useRef(null)
  const headVis = useReveal(headRef, 0.08)

  useEffect(() => {
    if (injected) return
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setInjected(true)
  }, [injected])

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter)

  return (
    <section id="projects">
      <div className="proj-container">

        {/* Header */}
        <div ref={headRef}>
          <p className={`proj-eyebrow${headVis ? ' vis' : ''}`}>Portfolio</p>
          <h2 className={`proj-title${headVis ? ' vis' : ''}`}>
            Featured <em>Projects.</em>
          </h2>
          <div className={`proj-filters${headVis ? ' vis' : ''}`}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`proj-filter${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="proj-grid">
          {filtered.map((p, i) => (
            <ProjectCard key={p.num} project={p} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const vis = useReveal(ref, 0.08)
  return (
    <div
      ref={ref}
      className={`proj-card${vis ? ' vis' : ''}`}
      style={{ '--card-accent': project.accent, transitionDelay: vis ? `${index * 0.1}s` : '0s' }}
    >
      <div className="proj-card-bar" aria-hidden="true" />
      {project.featured && <span className="proj-featured-badge">Featured</span>}

      <div className="proj-card-head">
        <span className="proj-card-num" aria-hidden="true">{project.num}</span>
        <div className="proj-card-links">
          <a href={project.github} className="proj-link" target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} source`}>
            <i className="fab fa-github" aria-hidden="true" /> Source
          </a>
          <a href={project.demo} className="proj-link" target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live demo`}>
            <i className="fas fa-external-link-alt" aria-hidden="true" /> Demo
          </a>
        </div>
      </div>

      <h3 className="proj-card-title">{project.title}</h3>
      <p className="proj-card-desc">{project.desc}</p>

      <div className="proj-tags">
        {project.tags.map(t => <span key={t} className="proj-tag">{t}</span>)}
      </div>
    </div>
  )
}