import { useState, useRef, useEffect } from 'react'

/* ─── Styles ──────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Instrument+Sans:wght@400;500&display=swap');

  :root {
    --bg:       #04040a;
    --surface:  #0a0a14;
    --surface2: #0f0f1c;
    --cyan:     #00f0ff;
    --cyan-dim: rgba(0,240,255,0.07);
    --green:    #00ff88;
    --white:    #eeeef2;
    --muted:    #6b6b80;
    --border:   rgba(255,255,255,0.06);
    --border-h: rgba(0,240,255,0.22);
  }

  /* ═══════════════════════════
     CHAT TOGGLE BUTTON
  ═══════════════════════════ */
  .chat-toggle-btn {
    position: fixed;
    bottom: 28px;
    right: 28px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    background: var(--surface);
    border: 1px solid var(--border-h);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--cyan);
    cursor: pointer;
    z-index: 2000;
    transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
    box-shadow: 0 0 20px rgba(0,240,255,0.08);
    position: fixed;
  }
  .chat-toggle-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--cyan-dim);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(.22,1,.36,1);
  }
  .chat-toggle-btn:hover::before { transform: scaleX(1); }
  .chat-toggle-btn:hover { border-color: var(--cyan); box-shadow: 0 0 28px rgba(0,240,255,0.18); }
  .chat-toggle-btn span { position: relative; z-index: 1; }
  .chat-toggle-btn i { position: relative; z-index: 1; font-size: 13px; }
  .chat-toggle-pip {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: chatPip 2s ease-in-out infinite;
    flex-shrink: 0;
    position: relative; z-index: 1;
  }
  @keyframes chatPip { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }

  /* ═══════════════════════════
     CHAT PANEL
  ═══════════════════════════ */
  .chat-panel {
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 360px;
    max-height: 520px;
    background: var(--surface);
    border: 1px solid var(--border-h);
    display: flex;
    flex-direction: column;
    z-index: 2000;
    box-shadow: 0 0 40px rgba(0,240,255,0.1), 0 20px 60px rgba(0,0,0,0.5);
    opacity: 0;
    transform: translateY(16px) scale(0.97);
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(.22,1,.36,1);
    overflow: hidden;
  }
  .chat-panel.open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: all;
  }

  /* corner cut */
  .chat-panel::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 0; height: 0; border-style: solid;
    border-width: 0 28px 28px 0;
    border-color: transparent var(--bg) transparent transparent;
    z-index: 1;
  }

  /* top scan line */
  .chat-panel::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--cyan), var(--green));
    box-shadow: 0 0 10px var(--cyan);
    pointer-events: none;
  }

  /* ── Header ── */
  .chat-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    background: rgba(0,0,0,0.2);
    flex-shrink: 0;
  }
  .chat-head-pip {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: chatPip 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  .chat-head-title {
    flex: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--white);
  }
  .chat-head-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .chat-close-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px; color: var(--muted);
    line-height: 1; padding: 2px 4px;
    transition: color 0.2s;
    flex-shrink: 0;
  }
  .chat-close-btn:hover { color: var(--cyan); }

  /* ── Messages area ── */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 220px;
    max-height: 280px;
    scroll-behavior: smooth;
  }
  .chat-messages::-webkit-scrollbar { width: 3px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); }

  /* ── Message bubbles ── */
  .chat-msg {
    max-width: 85%;
    padding: 9px 13px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    line-height: 1.55;
    animation: msgIn 0.25s ease;
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .chat-msg.bot {
    background: rgba(0,240,255,0.06);
    border: 1px solid var(--border-h);
    color: var(--white);
    align-self: flex-start;
    border-radius: 0;
  }
  .chat-msg.user {
    background: rgba(0,255,136,0.06);
    border: 1px solid rgba(0,255,136,0.2);
    color: var(--white);
    align-self: flex-end;
    border-radius: 0;
  }

  /* ── Chips row ── */
  .chat-chips {
    display: flex;
    gap: 6px;
    padding: 8px 16px;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }
  .chat-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 4px 10px;
    border: 1px solid var(--border);
    color: var(--muted);
    background: none; cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .chat-chip:hover { color: var(--cyan); border-color: var(--border-h); background: var(--cyan-dim); }

  /* ── Input row ── */
  .chat-input-row {
    display: flex;
    align-items: center;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .chat-input-field {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 12px 16px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    color: var(--white);
  }
  .chat-input-field::placeholder { color: var(--muted); opacity: 0.5; }
  .chat-send-btn {
    padding: 12px 16px;
    background: none; border: none; cursor: pointer;
    border-left: 1px solid var(--border);
    color: var(--muted);
    font-size: 13px;
    transition: color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .chat-send-btn:hover { color: var(--cyan); background: var(--cyan-dim); }

  /* ═════════════ RESPONSIVE ═════════════ */
  @media (max-width: 480px) {
    .chat-panel { width: calc(100vw - 24px); right: 12px; bottom: 12px; }
    .chat-toggle-btn { right: 12px; bottom: 12px; }
  }
`

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
  education:    "B.Tech in Computer Science with AI/ML specialization — focused on deep learning, computer vision, and NLP.",
  ai:           "Specializing in ML, Deep Learning, Computer Vision, and NLP. Passionate about building responsible AI solutions!",
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
  const [injected,  setInjected]  = useState(false)
  const [isOpen,    setIsOpen]    = useState(false)
  const [greeted,   setGreeted]   = useState(false)
  const [messages,  setMessages]  = useState([])
  const [inputVal,  setInputVal]  = useState('')
  const endRef   = useRef(null)
  const inputRef = useRef(null)

  /* Inject styles once */
  useEffect(() => {
    if (injected) return
    const tag = document.createElement('style')
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setInjected(true)
  }, [injected])

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
