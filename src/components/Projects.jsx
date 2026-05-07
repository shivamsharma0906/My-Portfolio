import { useEffect, useRef, useState } from 'react'

import './Projects.css';
import { useTilt } from '../hooks/useTilt';/* ─── Styles ──────────────────────────────────────────────────────────── */


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
    num: 'PRJ_05',
    title: 'AttendX',
    desc: 'Smart employee attendance management system with secure authentication, real-time attendance tracking, analytics dashboard, role-based access, and a modern responsive interface for efficient workforce management.',
    tags: ['React', 'Node.js', 'MongoDB', 'Firebase'],
    github: 'https://github.com/shivamsharma0906/AttendX',
    demo: 'https://attend-x-jade.vercel.app/',
    accent: '#00c2ff',
    category: 'Web Application',
    featured: true,
  },
  {
    num: 'PRJ_03',
    title: 'Juntoz',
    desc: 'Modern futuristic portfolio and agency-style website featuring immersive UI animations, smooth scrolling, glassmorphism effects, interactive sections, responsive layouts, and high-end user experience design.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com/shivamsharma0906/Juntoz',
    demo: 'https://juntoz-phi.vercel.app/',
    accent: '#8b5cf6',
    category: 'Portfolio Website',
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
  const [activeFilter, setActiveFilter] = useState('All')
  const headRef = useRef(null)
  const headVis = useReveal(headRef, 0.08)



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
  useTilt({ max: 10, scale: 1.03, glare: true, maxGlare: 0.15 }, ref);
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