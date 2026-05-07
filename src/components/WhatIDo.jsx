import { useEffect, useRef, useState } from 'react'



import './WhatIDo.css';
import { useTilt } from '../hooks/useTilt';function useReveal(ref, threshold = 0.1) {
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
    desc:  'Designing and training deep neural networks (CNNs, RNNs, Transformers) for computer vision and time-series tasks using TensorFlow and PyTorch.',
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
    icon:  'fas fa-database',
    title: 'Data Engineering',
    color: '#38bdf8',
    desc:  'Designing scalable data pipelines, ETL processes, and database architectures to power high-performance AI models and real-time analytics.',
    tools: ['SQL', 'PySpark', 'Airflow', 'NoSQL'],
  },
]

const STATS = [
  { label: 'Areas of Expertise', val: '6+', accent: true  },
  { label: 'Technologies Used',  val: '20+', accent: false },
  { label: 'Projects Delivered', val: '5+', accent: false  },
]

export default function WhatIDo() {
  const headRef  = useRef(null)
  const stripRef = useRef(null)
  const headVis  = useReveal(headRef, 0.08)
  const stripVis = useReveal(stripRef, 0.08)

  return (
    <section id="what-i-do">
      <div className="wid-container">
        <div ref={headRef} className="wid-header">
          <div className={`wid-eyebrow${headVis ? ' vis' : ''}`}>
            <span className="eyebrow-dot" /> Services & Expertise
          </div>
          <h2 className={`wid-title${headVis ? ' vis' : ''}`}>
            Building the <em>Future</em> of AI.
          </h2>
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
              style={{ transitionDelay: stripVis ? `${i * 0.15}s` : '0s' }}
            >
              <div className="strip-info">
                <span className="strip-label">{st.label}</span>
                <span className="strip-val">
                  {st.accent ? <><span>{st.val.replace('+','')}</span>+</> : st.val}
                </span>
              </div>
              <div className="strip-decoration" aria-hidden="true" />
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
  useTilt({ max: 8, scale: 1.02, glare: true, maxGlare: 0.1 }, ref);

  return (
    <div
      ref={ref}
      className={`wid-card${vis ? ' vis' : ''}`}
      style={{ 
        '--wid-c': service.color, 
        transitionDelay: vis ? `${index * 0.08}s` : '0s' 
      }}
    >
      <div className="wid-card-glow" aria-hidden="true" />
      <div className="wid-card-noise" aria-hidden="true" />
      <div className="wid-card-scanline" aria-hidden="true" />
      
      <div className="wid-card-inner">
        <div className="wid-card-head">
          <span className="wid-num" aria-hidden="true">{service.num}</span>
          <div className="wid-icon-wrap">
            <div className="wid-icon"><i className={service.icon} /></div>
            <div className="wid-icon-ring" />
          </div>
        </div>

        <h3 className="wid-card-title">{service.title}</h3>
        <p className="wid-card-desc">{service.desc}</p>

        <div className="wid-card-footer">
          <div className="wid-card-tools">
            {service.tools.map(t => <span key={t} className="wid-tool">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}