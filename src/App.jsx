import React, { Suspense, lazy, useState, useEffect } from 'react'
import AuroraBackground from './components/AuroraBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

// Lazy load heavy and below-the-fold components
const ThreeCanvas = lazy(() => import('./components/ThreeCanvas'))
const About = lazy(() => import('./components/About'))
const Experience = lazy(() => import('./components/Experience'))
const AiMlExpertise = lazy(() => import('./components/AiMlExpertise'))
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const WhatIDo = lazy(() => import('./components/WhatIDo'))
const Contact = lazy(() => import('./components/Contact'))
const Chatbot = lazy(() => import('./components/Chatbot'))
const Footer = lazy(() => import('./components/Footer'))

function App() {
  const [loadWebGL, setLoadWebGL] = useState(false)

  useEffect(() => {
    // Delay heavy WebGL initialization to ensure LCP/FCP finishes first
    const timer = setTimeout(() => {
      setLoadWebGL(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loadWebGL && (
        <Suspense fallback={null}>
          <ThreeCanvas />
        </Suspense>
      )}
      <AuroraBackground />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <About />
          <Experience />
          <AiMlExpertise />
          <Projects />
          <Skills />
          <WhatIDo />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <Chatbot />
      </Suspense>
    </>
  )
}

export default App
