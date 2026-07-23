import { useEffect, useRef, useState, useCallback } from 'react'
import './Hero.css'
import { useTilt } from '../hooks/useTilt'

/* ─── Typing hook ─────────────────────────────────────────────────────── */
function useTyping(words) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let wi = 0, ci = 0, del = false, tid
    function tick() {
      const w = words[wi]
      el.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1)
      del ? ci-- : ci++
      let speed = del ? 45 : 140
      if (!del && ci === w.length) { del = true; speed = 2200 }
      if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; speed = 500 }
      tid = setTimeout(tick, speed)
    }
    tick()
    return () => clearTimeout(tid)
  }, [words])
  return ref
}

const WORDS = ['AI/ML Engineer', 'Deep Learning Dev', 'Computer Vision', 'Problem Solver']

/* ─── Terminal commands ───────────────────────────────────────────────── */
const COMMANDS = {
  help: () => [
    '──────────────────────────────────────',
    '       SHIVAM OS • COMMAND HUB        ',
    '──────────────────────────────────────',
    '',
    'init       → Initialize developer profile',
    'Projects   → Explore featured builds',
    'Stack      → View technical arsenal',
    'timeline   → Career progression',
    'status     → Current focus & availability',
    'live       → Active development logs',
    'connect    → Communication channels',
    'github     → Open GitHub profile',
    'resume     → Download resume',
    'clear      → Reset terminal',
    'exit       → Shutdown interface',
    '',
    'Easter Egg: try "matrix" or "coffee"',
  ],
  init: () => [
    '  Initializing developer identity...',
    '',
    '  {',
    '    "name": "Shivam Sharma",',
    '    "role": "AI/ML Engineer",',
    '    "university": "Techno Main Salt Lake",',
    '    "specialization": [',
    '      "Deep Learning",',
    '      "Computer Vision",',
    '      "Creative Frontend Systems"',
    '    ],',
    '    "location": "Kolkata, India",',
    '    "status": "Open to opportunities"',
    '  }',
  ],
  projects: () => [
    '  LOADING MISSION ARCHIVES...',
    '',
    '  [PROJECT_01]',
    '  Upasthiti',
    '  → Smart attendance intelligence platform',
    '',
    '  [PROJECT_02]',
    '  Dermaware',
    '  → AI-powered skincare ecosystem',
    '',
    '  [PROJECT_03]',
    '  VisionOS',
    '  → Personal life management OS',
    '',
    '  [PROJECT_04]',
    '  AI/ML Projects',
    '  → Neural network research & implementation',
    '',
    '  [PROJECT_05]',
    '  Full-stack systems',
    '  → Robust production-ready applications',
  ],
  stack: () => [
    '  ACCESSING TECHNICAL ARSENAL...',
    '',
    '  AI/ML    :: PyTorch, OpenCV, TensorFlow, Scikit-learn',
    '  Frontend :: React.js, Next.js, Framer Motion, Three.js',
    '  Backend  :: Node.js, Python/Flask, Docker, C++',
    '  DB       :: MongoDB, Firebase, PostgreSQL',
    '  Tools    :: Git, Linux, AWS, Vercel',
  ],
  timeline: () => [
    '  2023 → Started development journey',
    '  2024 → Built AI & ML systems',
    '  2025 → Developed production-ready platforms',
    '  2026 → Engineering intelligent experiences',
  ],
  status: () => [
    '  STATUS : ONLINE',
    '',
    '  Current Focus:',
    '  → AI Engineering',
    '  → Intelligent UI Systems',
    '  → Full Stack Development',
    '',
    '  Availability:',
    '  🟢 Open for internships & collaborations',
  ],
  live: () => [
    '  LIVE DEVELOPMENT LOGS',
    '',
    '  → AI-powered portfolio OS',
    '  → Smart productivity systems',
    '  → Experimental frontend experiences',
  ],
  connect: () => [
    '  Establishing secure communication channel...',
    '',
    '  Email     → shivam17sharma2004@gmail.com',
    '  GitHub    → github.com/shivamsharma0906',
    '  LinkedIn  → linkedin.com/in/shivam-sharma0906/',
  ],
  github: () => [
    '  Connecting to GitHub servers...',
    '  Accessing @shivamsharma0906 repositories...',
    '  Redirecting to profile...',
  ],
  resume: () => [
    '  [10%] Accessing secure vault...',
    '  [45%] Bypassing firewall...',
    '  [80%] Decrypting resume.pdf...',
    '  [100%] Access Granted.',
    '  Opening resume...',
  ],
  clear: () => '__CLEAR__',
  exit: () => '__EXIT__',
  matrix: () => [
    '  Wake up, Neo...',
    '  The Matrix has you...',
    '  Follow the white rabbit.',
    '  Knock, knock, Neo.',
  ],
  coffee: () => [
    '  ☕ ERROR: OUT OF CAFFEINE.',
    '  Please refill reservoir and try again.',
  ]
}

/* ─── Interactive Terminal ────────────────────────────────────────────── */
function InteractiveTerminal({ tiltRef, active, setActive }) {
  const [lines, setLines]     = useState([])         // { type: 'in'|'out', text: string }[]
  const [input, setInput]     = useState('')
  const [cmdHist, setCmdHist] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const bodyRef   = useRef(null)
  const inputRef  = useRef(null)

  // Scroll to bottom on every new line or active toggle
  useEffect(() => {
    if (bodyRef.current) {
      const timer = requestAnimationFrame(() => {
        if (bodyRef.current)
          bodyRef.current.scrollTop = bodyRef.current.scrollHeight
      })
      return () => cancelAnimationFrame(timer)
    }
  }, [lines, active])

  const activate = () => {
    if (!active) {
      const greetings = [
        '  SHIVAM OS v2.0.4 - Initializing...',
        '  System secure. Welcome, Visitor.',
        '  Connection established. Port 8080 active.',
        '  Authorized access only. Logging session...',
      ]
      const chosen = greetings[Math.floor(Math.random() * greetings.length)]
      
      setActive(true)
      setLines([{ type: 'out', text: chosen }])
      setTimeout(() => {
        setLines(l => [...l, { type: 'out', text: '  Type "help" to explore or "exit" to close →' }])
        inputRef.current?.focus()
      }, 400)
    } else {
      inputRef.current?.focus()
    }
  }

  const run = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd || isTyping) return

    setCmdHist(h => [raw.trim(), ...h])
    setHistIdx(-1)
    setLines(l => [...l, { type: 'in', text: raw.trim() }])

    const handler = COMMANDS[cmd]
    if (!handler) {
      setLines(l => [...l, { type: 'out', text: `  command not found: ${cmd}. Type "help" for commands.` }])
      return
    }

    const result = handler()

    if (result === '__CLEAR__') {
      setLines([])
      return
    }

    if (result === '__EXIT__') {
      setIsTyping(true)
      setTimeout(() => {
        setLines(l => [...l, { type: 'out', text: '  Shutting down ShivamOS...' }])
        setTimeout(() => {
          setLines(l => [...l, { type: 'out', text: '  Session terminated successfully.' }])
          setTimeout(() => {
            setActive(false)
            setLines([])
            setInput('')
            setIsTyping(false)
          }, 500)
        }, 400)
      }, 200)
      return
    }

    if (cmd === 'resume' || cmd === 'github') {
      setIsTyping(true)
      let i = 0
      const interval = setInterval(() => {
        if (i < result.length) {
          setLines(l => [...l, { type: 'out', text: result[i] }])
          i++
        } else {
          clearInterval(interval)
          setIsTyping(false)
          if (cmd === 'resume') window.open('/shivam_resume.pdf', '_blank')
          if (cmd === 'github') window.open('https://github.com/shivamsharma0906', '_blank')
        }
      }, 200)
      return
    }

    // Normal command output
    setLines(l => [...l, ...result.map(t => ({ type: 'out', text: t }))])
  }, [isTyping, setActive])

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setLines([])
      return
    }

    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHist.length > 0) {
        const next = Math.min(histIdx + 1, cmdHist.length - 1)
        setHistIdx(next)
        setInput(cmdHist[next] ?? '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : cmdHist[next])
    } else if (e.key === 'Escape') {
      setActive(false)
      setLines([])
      setInput('')
    }
  }

  return (
    <div
      className={`hero-card hero-terminal${active ? ' terminal-active' : ''}`}
      ref={tiltRef}
      onClick={activate}
      role="application"
      aria-label="Interactive terminal"
    >
      {/* Window chrome */}
      <div className="terminal-header">
        <span className="terminal-dot" style={{ background: '#ff5f57' }} />
        <span className="terminal-dot" style={{ background: '#febc2e' }} />
        <span className="terminal-dot" style={{ background: '#28c840' }} />
        <span className="terminal-title">
          {active ? 'shivam@portfolio:~$' : 'profile.json'}
        </span>
      </div>

      {/* Body */}
      <div className="terminal-body" ref={bodyRef}>
        {!active ? (
          /* ── Static view ── */
          <>
            <span className="t-brace">{'{'}</span><br />
            &nbsp;&nbsp;<span className="t-key">"name"</span><span className="t-brace">: </span><span className="t-str">"Shivam Sharma"</span><span className="t-brace">,</span><br />
            &nbsp;&nbsp;<span className="t-key">"role"</span><span className="t-brace">: </span><span className="t-str">"AI/ML Student"</span><span className="t-brace">,</span><br />
            &nbsp;&nbsp;<span className="t-key">"university"</span><span className="t-brace">: </span><span className="t-str">"Techno Main SaltLake"</span><span className="t-brace">,</span><br />
            &nbsp;&nbsp;<span className="t-key">"focus"</span><span className="t-brace">: [</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"Deep Learning"</span><span className="t-brace">,</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="t-str">"Computer Vision"</span><br />
            &nbsp;&nbsp;<span className="t-brace">],</span><br />
            &nbsp;&nbsp;<span className="t-key">"openToWork"</span><span className="t-brace">: </span><span className="t-bool">true</span><br />
            <span className="t-brace">{'}'}</span>
            <div className="terminal-hint">click to interact →</div>
          </>
        ) : (
          /* ── Interactive view ── */
          <div className="term-interactive">
            {lines.map((l, i) => (
              <div key={i} className={`term-line term-${l.type}`}>
                {l.type === 'in' && <span className="term-prompt">› </span>}
                {l.text}
              </div>
            ))}
            {/* Input row */}
            <div className="term-input-row">
              <span className="term-prompt">› </span>
              <input
                ref={inputRef}
                className="term-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal input"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Hero Component ─────────────────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef(null)
  const vis = true
  const typingRef = useTyping(WORDS)
  const [terminalActive, setTerminalActive] = useState(false)

  const avatarRef = useTilt({ max: 20, scale: 1.05, glare: true, maxGlare: 0.4 })
  const terminalRef = useTilt({ max: 12, scale: 1.02, glare: true, maxGlare: 0.2, disabled: terminalActive })

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="hero" ref={sectionRef}>
      {/* decorative left line */}
      <div className="hero-coord" aria-hidden="true" />
      <span className="hero-coord-label" aria-hidden="true">shivam.sharma // portfolio.v2</span>

      <div className="hero-container">
        <div className="hero-layout">

          {/* ── LEFT ── */}
          <div className="hero-left">

            {/* system tags */}
            <div className="hero-tags">
              {['Available for Hire', 'AI/ML Student', 'India'].map((t, i) => (
                <span
                  key={t}
                  className={`hero-tag${vis ? ' vis' : ''}`}
                  style={{ transitionDelay: vis ? `${i * 0.1}s` : '0s' }}
                >
                  <span className="hero-tag-dot" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>

            {/* name */}
            <h1 className={`hero-name${vis ? ' vis' : ''}`}>
              Shivam<br /><em>Sharma.</em>
            </h1>

            {/* role / typing */}
            <div className={`hero-role${vis ? ' vis' : ''}`}>
              <span className="hero-role-prefix">I am a //</span>
              <span className="hero-typing-wrap">
                <span ref={typingRef}></span>
                <span className="hero-cursor" aria-hidden="true" />
              </span>
            </div>

            {/* bio */}
            <p className={`hero-bio${vis ? ' vis' : ''}`}>
              Computer Science student specializing in <em>AI &amp; Machine Learning</em> —
              building intelligent systems that bridge{' '}
              <em>research &amp; real-world impact</em>.
              Focused on deep learning, computer vision, and ethical AI.
            </p>

            {/* CTAs */}
            <div className={`hero-ctas${vis ? ' vis' : ''}`}>
              <a
                href="#projects"
                className="hero-cta-primary"
                onClick={scrollTo('#projects')}
                aria-label="View my projects"
              >
                <span>Explore Projects</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="/shivam_resume.pdf"
                className="hero-cta-secondary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download resume"
              >
                <span>Download CV</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 1v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* stats */}
            <div className={`hero-stats${vis ? ' vis' : ''}`}>
              {[
                { val: '5+', label: 'Projects Shipped', accent: true },
                { val: '2+', label: 'Years of Learning', accent: false },
                { val: '20+', label: 'Technologies', accent: false },
              ].map(s => (
                <div key={s.label} className="hero-stat">
                  <div className="stat-val">
                    {s.accent ? <><span>{s.val.replace('+', '')}</span>+</> : s.val}
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className={`hero-right${vis ? ' vis' : ''}`}>

            {/* Avatar card - Restored to horizontal with logo4 */}
            <div className="hero-avatar-card" ref={avatarRef}>
              <img src="/logo4.webp" alt="Shivam Sharma" className="avatar-img" />
              <div className="avatar-info">
                <span className="avatar-name">Shivam Sharma</span>
                <span className="avatar-role">B.Tech CSE · AI/ML</span>
              </div>
              <span className="avatar-badge">
                <span className="badge-dot" />
                OPEN
              </span>
            </div>

            {/* Interactive terminal card */}
            <InteractiveTerminal tiltRef={terminalRef} active={terminalActive} setActive={setTerminalActive} />
          </div>
        </div>
      </div>
    </section>
  )
}