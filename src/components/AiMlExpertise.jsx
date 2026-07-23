import { useEffect, useRef, useState } from 'react'
import { useTilt } from '../hooks/useTilt'
import './AiMlExpertise.css'

/* ─── Data ─────────────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    num: '01', icon: 'fas fa-brain', color: '#00f0ff',
    title: 'Machine Learning',
    tag: 'PREDICTIVE INTELLIGENCE',
    desc: 'Designing end-to-end ML pipelines — from raw data preprocessing and feature engineering to training, evaluating, and deploying predictive models at scale.',
    points: [
      'Supervised & unsupervised learning models',
      'Regression, classification & anomaly detection',
      'Hyperparameter tuning & cross-validation',
      'Model interpretability & deployment-ready pipelines',
    ],
    tools: ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'XGBoost'],
  },
  {
    num: '02', icon: 'fas fa-network-wired', color: '#00ff88',
    title: 'Deep Learning',
    tag: 'NEURAL ARCHITECTURES',
    desc: 'Designing and training deep neural networks — CNNs, RNNs, Transformers — for complex vision and sequence tasks, with a focus on transfer learning & efficiency.',
    points: [
      'CNN / RNN / Transformer architectures',
      'Transfer learning & fine-tuning pre-trained models',
      'Model quantization & performance optimization',
      'Custom training loops and loss engineering',
    ],
    tools: ['PyTorch', 'TensorFlow', 'Keras', 'CUDA', 'ONNX'],
  },
  {
    num: '03', icon: 'fas fa-eye', color: '#a855f7',
    title: 'Computer Vision',
    tag: 'VISUAL AI SYSTEMS',
    desc: 'Building real-time perception systems — object detection, segmentation, and medical imaging — with high-accuracy inference pipelines and robust augmentation strategies.',
    points: [
      'Real-time object detection with YOLOv8',
      'Image classification & semantic segmentation',
      'Medical & satellite imagery analysis',
      'OpenCV-based preprocessing & augmentation',
    ],
    tools: ['OpenCV', 'YOLOv8', 'PIL/Pillow', 'Albumentations', 'Detectron2'],
  },
  {
    num: '04', icon: 'fas fa-robot', color: '#ffb800',
    title: 'Generative AI & LLMs',
    tag: 'LANGUAGE MODEL SYSTEMS',
    desc: 'Building production-grade LLM applications — RAG pipelines, intelligent agents, and conversational AI — powered by OpenAI, open-source LLMs, and vector databases.',
    points: [
      'Retrieval-Augmented Generation (RAG) systems',
      'LangChain agents & tool-calling workflows',
      'Vector store integration (Chroma, FAISS)',
      'Fine-tuning & prompt engineering for domain tasks',
    ],
    tools: ['LangChain', 'OpenAI API', 'Chroma', 'FAISS', 'Streamlit'],
  },
  {
    num: '05', icon: 'fas fa-code', color: '#38bdf8',
    title: 'Full-Stack Web',
    tag: 'MODERN WEB ENGINEERING',
    desc: 'Shipping fast, responsive, and visually premium full-stack applications — from Next.js frontends with micro-animations to scalable Node/Express APIs and NoSQL backends.',
    points: [
      'React.js & Next.js responsive frontends',
      'RESTful & GraphQL API design with Node/Express',
      'MongoDB, Firebase & PostgreSQL integrations',
      'Premium UI/UX with animations & glassmorphism',
    ],
    tools: ['React.js', 'Next.js', 'Node.js', 'MongoDB', 'Firebase'],
  },
  {
    num: '06', icon: 'fas fa-database', color: '#ff6b6b',
    title: 'Data & DevOps',
    tag: 'INFRASTRUCTURE & PIPELINES',
    desc: 'Architecting scalable data pipelines, containerized deployments, and cloud infrastructure — ensuring AI models and web applications run reliably at any scale.',
    points: [
      'ETL pipeline design & automation',
      'Docker containerization & Linux workflows',
      'Cloud deployment on Vercel, Render & AWS',
      'CI/CD pipelines & Git-based team workflows',
    ],
    tools: ['Docker', 'SQL / NoSQL', 'Vercel', 'AWS', 'Linux CLI'],
  },
]

/* ─── Reveal hook ───────────────────────────────────────────────── */
function useReveal(ref, threshold = 0.08) {
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

/* ─── Main Component ────────────────────────────────────────────── */
export default function AiMlExpertise() {
  const [active, setActive] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const headRef   = useRef(null)
  const dashboardRef = useRef(null)
  const headVis   = useReveal(headRef, 0.06)
  const dashboardVis = useReveal(dashboardRef, 0.04)

  useTilt({ max: 3, scale: 1.005, glare: true, maxGlare: 0.05 }, dashboardRef)

  const selectCap = (i) => {
    if (i === active) return
    setActive(i)
    setAnimKey(k => k + 1)
  }

  const cap = CAPABILITIES[active]

  return (
    <section id="ai-ml-expertise">
      <div className="aiml-container">

        {/* Header */}
        <div ref={headRef} className="aiml-header-wrap">
          <p className={`aiml-eyebrow${headVis ? ' vis' : ''}`}>
            <span className="eyebrow-line" />
            Specialization &amp; Capabilities
          </p>
          <h2 className={`aiml-title${headVis ? ' vis' : ''}`}>
            Built to <em>Engineer.</em>
          </h2>
          <p className={`aiml-subtitle${headVis ? ' vis' : ''}`}>
            An integrated console mapping my engineering capability domains, technical stacks, and practical outcomes.
          </p>
        </div>

        {/* Integrated Sci-Fi Console Dashboard */}
        <div
          ref={dashboardRef}
          className={`aiml-console-dashboard${dashboardVis ? ' vis' : ''}`}
          style={{ '--console-c': cap.color }}
        >
          {/* Decorative Corner Brackets */}
          <div className="console-corner top-left" />
          <div className="console-corner top-right" />
          <div className="console-corner bottom-left" />
          <div className="console-corner bottom-right" />

          {/* Console Header Bar */}
          <div className="console-header-bar">
            <div className="console-header-left">
              <span className="console-dot-blink" />
              <span className="console-header-text">SYSTEM STATUS: OPERATIONAL // CAPABILITY_CONSOLE</span>
            </div>
            <div className="console-header-right">
              <span>REF_ID: SHIVAM_0906</span>
            </div>
          </div>

          <div className="console-main-split">
            
            {/* Left Console Panel — Interactive Menu */}
            <div className="console-sidebar">
              <div className="console-menu-list">
                {CAPABILITIES.map((c, i) => (
                  <button
                    key={c.num}
                    className={`console-menu-btn${active === i ? ' active' : ''}`}
                    style={{ '--cap-c': c.color }}
                    onClick={() => selectCap(i)}
                  >
                    <div className="menu-btn-glow" />
                    <span className="menu-num">{c.num}</span>
                    <div className="menu-details">
                      <span className="menu-title">{c.title}</span>
                      <span className="menu-tag">{c.tag}</span>
                    </div>
                    <div className="menu-icon">
                      <i className={c.icon} />
                    </div>
                  </button>
                ))}
              </div>

              {/* Sidebar Stats Strip */}
              <div className="console-stats-row">
                <div className="console-stat-box">
                  <span className="c-stat-val">6+</span>
                  <span className="c-stat-lbl">DOMAINS</span>
                </div>
                <div className="console-stat-sep" />
                <div className="console-stat-box">
                  <span className="c-stat-val">25+</span>
                  <span className="c-stat-lbl">TECHS</span>
                </div>
                <div className="console-stat-sep" />
                <div className="console-stat-box">
                  <span className="c-stat-val">5+</span>
                  <span className="c-stat-lbl">PROJECTS</span>
                </div>
              </div>
            </div>

            {/* Vertical Glowing Divider Line */}
            <div className="console-divider-line" />

            {/* Right Console Panel — Capability Details */}
            <div className="console-details-pane">
              <DetailView key={animKey} cap={cap} />
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

/* ─── Detail View Component ─────────────────────────────────────── */
function DetailView({ cap }) {
  return (
    <div className="console-detail-content" style={{ '--cap-c': cap.color }}>
      {/* Detail Panel Background Glow */}
      <div className="detail-glow-blob" />

      {/* Pane Title Card */}
      <div className="pane-head-row">
        <div className="pane-title-left">
          <div className="pane-icon-box">
            <i className={cap.icon} />
          </div>
          <div>
            <span className="pane-domain-tag">{cap.tag}</span>
            <h3 className="pane-title">{cap.title}</h3>
          </div>
        </div>
        <div className="pane-title-right">
          <span className="pane-large-num">CAP_{cap.num}</span>
        </div>
      </div>

      {/* Description */}
      <p className="pane-desc">{cap.desc}</p>

      {/* Key Focus points */}
      <div className="pane-section">
        <span className="pane-section-lbl">
          <i className="fas fa-microchip" /> CORE COMPETENCIES
        </span>
        <ul className="pane-points-list">
          {cap.points.map((p, i) => (
            <li
              key={p}
              className="pane-point"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="point-indicator-dot" />
              <span className="point-text">{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tech Stack tags */}
      <div className="pane-section">
        <span className="pane-section-lbl">
          <i className="fas fa-layer-group" /> TECHNICAL WEAPONRY
        </span>
        <div className="pane-tech-tags">
          {cap.tools.map((t, i) => (
            <span
              key={t}
              className="pane-tech-tag"
              style={{ animationDelay: `${0.25 + i * 0.05}s` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <a
        href="#projects"
        className="pane-action-cta"
        onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
      >
        <span>INITIALIZE WORK_STREAM SOURCE</span>
        <i className="fas fa-arrow-right cta-arrow" />
      </a>
    </div>
  )
}
