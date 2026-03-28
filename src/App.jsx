import AuroraBackground from './components/AuroraBackground'
import ParticlesCanvas from './components/ParticlesCanvas'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import AiMlExpertise from './components/AiMlExpertise'
import Projects from './components/Projects'
import Skills from './components/Skills'
import WhatIDo from './components/WhatIDo'
import Contact from './components/Contact'
import Chatbot from './components/Chatbot'
import Footer from './components/Footer'
import { useFadeIn } from './hooks/useFadeIn'

function App() {
  useFadeIn()

  return (
    <>
      <AuroraBackground />
      <ParticlesCanvas />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <AiMlExpertise />
        <Projects />
        <Skills />
        <WhatIDo />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}

export default App

