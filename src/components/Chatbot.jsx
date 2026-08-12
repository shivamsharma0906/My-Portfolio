import { useState, useRef, useEffect } from 'react'

import './Chatbot.css';

/* ─── Styles ──────────────────────────────────────────────────────────── */


/* ─── Response logic ──────────────────────────────────────────────────── */
const RESPONSES = {
  about:        "I'm Shivam Sharma — an AI/ML student passionate about deep learning, computer vision, and ethical AI. Check the About section for more!",
  projects:     "I've built VisionOS (Life OS), Upasthiti (attendance tracker), Weather App, and a Zomato clone. See the Projects section!",
  skills:       "I work with Python, TensorFlow, PyTorch, OpenCV, LangChain, React, Node.js, and more — check the Skills section!",
  contact:      "You can reach me via the Contact form below or email: shivam17sharma2004@gmail.com",
  hello:        "Hello! 👋 What would you like to know about Shivam's portfolio?",
  hi:           "Hi there! How can I help you today?",
  hey:          "Hey! Feel free to ask about projects, skills, or experience.",
  help:         "I can tell you about Shivam's projects, skills, experience, or contact info. What would you like to know?",
  experience:   "Shivam is pursuing B.Tech CSE (AI/ML) at Techno Main SaltLake and self-studying through hands-on AI/ML projects.",
  education:    "B.Tech in Computer Science with AI/ML specialization — focused on deep learning and computer vision.",
  ai:           "Specializing in ML, Deep Learning, and Computer Vision. Passionate about building responsible AI solutions!",
  ml:           "Working with Scikit-learn, TensorFlow, Keras, and PyTorch to build intelligent systems. Check the projects!",
  thanks:       "You're welcome! Let me know if there's anything else!",
  'thank you':  "Happy to help! Feel free to ask anything else.",
  default:      "I didn't quite catch that. Try asking about projects, skills, experience, or contact info!",
}

function getResponse(input) {
  const cleaned = input.toLowerCase()
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (cleaned.includes(key)) return val
  }
  return RESPONSES.default
}

const CHIPS = ['Projects', 'Skills', 'Contact', 'About']

/* ─── Component ───────────────────────────────────────────────────────── */
export default function Chatbot() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [greeted,   setGreeted]   = useState(false)
  const [messages,  setMessages]  = useState([])
  const [inputVal,  setInputVal]  = useState('')
  const endRef   = useRef(null)
  const inputRef = useRef(null)

  /* Inject styles once */


  /* Auto-scroll */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* Close on outside click / Escape */
  useEffect(() => {
    const onClick = (e) => {
      if (!isOpen) return
      const panel = document.getElementById('ai-chat-panel')
      const btn   = document.getElementById('ai-chat-toggle')
      if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) setIsOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) setIsOpen(false) }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey) }
  }, [isOpen])

  const open = () => {
    setIsOpen(true)
    if (!greeted) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: "Hello! 👋 I'm Shivam's AI assistant. Ask me about projects, skills, or experience!" }])
        setGreeted(true)
      }, 300)
    }
    setTimeout(() => inputRef.current?.focus(), 400)
  }

  const close = () => setIsOpen(false)

  const send = (text) => {
    const msg = (text || inputVal).trim()
    if (!msg) return
    setMessages(prev => [...prev, { type: 'user', text: msg }])
    setInputVal('')
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: getResponse(msg) }])
    }, 600)
  }

  return (
    <>
      {/* ── Panel ── */}
      <div id="ai-chat-panel" className={`chat-panel${isOpen ? ' open' : ''}`} role="dialog" aria-label="AI Assistant">
        {/* Header */}
        <div className="chat-head">
          <span className="chat-head-pip" aria-hidden="true" />
          <div style={{ flex: 1 }}>
            <div className="chat-head-title">AI Assistant</div>
            <div className="chat-head-sub">Online · Shivam's Portfolio</div>
          </div>
          <button className="chat-close-btn" aria-label="Close chat" onClick={close}>×</button>
        </div>

        {/* Messages */}
        <div className="chat-messages" aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.type}`}>{msg.text}</div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Suggestion chips */}
        <div className="chat-chips">
          {CHIPS.map(c => (
            <button key={c} className="chat-chip" onClick={() => send(c.toLowerCase())} aria-label={`Ask about ${c}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            ref={inputRef}
            id="ai-chat-input"
            className="chat-input-field"
            type="text"
            placeholder="Ask me about my work..."
            aria-label="Chat input"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send() } }}
          />
          <button className="chat-send-btn" aria-label="Send message" onClick={() => send()}>
            <i className="fas fa-paper-plane" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Toggle button ── */}
      {!isOpen && (
        <button id="ai-chat-toggle" className="chat-toggle-btn" aria-label="Open AI chat assistant" onClick={open}>
          <span className="chat-toggle-pip" aria-hidden="true" />
          <i className="fas fa-comments" aria-hidden="true" />
          <span>Chat with Me</span>
        </button>
      )}
    </>
  )
}
