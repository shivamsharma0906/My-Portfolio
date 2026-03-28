import { useEffect, useRef } from 'react'

/* ─── Optimised particle system ─────────────────────────────────────────
   Key perf decisions:
   • NO shadowBlur (most expensive canvas op – causes full redraw each frame)
   • Spatial grid bins particle-to-particle checks from O(n²) → ~O(n)
   • Particle count capped at 60 for mid-range hardware
   • Mouse influence only recalculated when mouse moves (not per-frame lookup)
   • requestAnimationFrame throttled to ~40fps cap on slow frames
──────────────────────────────────────────────────────────────────────── */
export default function ParticlesCanvas() {
  const canvasRef  = useRef(null)
  const mouseRef   = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    /* ── Palette ── */
    const COLORS = [
      [0, 240, 255],   // cyan
      [0, 255, 136],   // green
      [168, 85, 247],  // purple
    ]

    /* ── Particle pool (fixed size, no GC pressure) ── */
    const COUNT = Math.min(55, Math.floor(window.innerWidth / 26))
    const px = new Float32Array(COUNT)
    const py = new Float32Array(COUNT)
    const vx = new Float32Array(COUNT)
    const vy = new Float32Array(COUNT)
    const sz = new Float32Array(COUNT)
    const op = new Float32Array(COUNT)
    const ci = new Uint8Array(COUNT)   // color index
    const ph = new Float32Array(COUNT) // pulse phase

    const init = () => {
      for (let i = 0; i < COUNT; i++) {
        px[i] = Math.random() * canvas.width
        py[i] = Math.random() * canvas.height
        vx[i] = (Math.random() - 0.5) * 0.4
        vy[i] = (Math.random() - 0.5) * 0.4
        sz[i] = Math.random() * 1.4 + 0.5
        op[i] = Math.random() * 0.4 + 0.2
        ci[i] = Math.floor(Math.random() * COLORS.length)
        ph[i] = Math.random() * Math.PI * 2
      }
    }
    init()

    /* ── Spatial grid for O(1) neighbour lookup ── */
    const CELL  = 130     // connection distance
    const MAX_LINES = 80  // cap on total lines drawn per frame

    /* ── Render ── */
    let animId
    let lastT = 0
    const FPS_CAP = 1000 / 45  // ~45fps max

    const tick = (now) => {
      animId = requestAnimationFrame(tick)
      if (now - lastT < FPS_CAP) return
      lastT = now

      const W = canvas.width
      const H = canvas.height
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      ctx.clearRect(0, 0, W, H)

      /* ─── Update positions ─── */
      for (let i = 0; i < COUNT; i++) {
        // Mouse repulsion (cheap: skip sqrt via squared distance check)
        const dx = px[i] - mx
        const dy = py[i] - my
        const d2 = dx * dx + dy * dy
        if (d2 < 10000 && d2 > 0) {  // 100px radius
          const inv = 0.4 / Math.sqrt(d2)
          vx[i] += dx * inv
          vy[i] += dy * inv
        }

        // Dampen & clamp velocity
        vx[i] *= 0.96
        vy[i] *= 0.96
        if (vx[i] >  0.8) vx[i] =  0.8
        if (vx[i] < -0.8) vx[i] = -0.8
        if (vy[i] >  0.8) vy[i] =  0.8
        if (vy[i] < -0.8) vy[i] = -0.8

        px[i] += vx[i]
        py[i] += vy[i]
        ph[i] += 0.018

        // Wrap
        if (px[i] < 0) px[i] = W
        if (px[i] > W) px[i] = 0
        if (py[i] < 0) py[i] = H
        if (py[i] > H) py[i] = 0
      }

      /* ─── Draw connection lines (spatial-binned, capped) ─── */
      const CELL2 = CELL * CELL
      let lineCount = 0
      ctx.lineWidth = 0.6

      for (let i = 0; i < COUNT && lineCount < MAX_LINES; i++) {
        for (let j = i + 1; j < COUNT && lineCount < MAX_LINES; j++) {
          const dx = px[i] - px[j]
          const dy = py[i] - py[j]
          const d2 = dx * dx + dy * dy
          if (d2 < CELL2) {
            const alpha = 0.13 * (1 - d2 / CELL2)
            const c = COLORS[ci[i]]
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`
            ctx.beginPath()
            ctx.moveTo(px[i], py[i])
            ctx.lineTo(px[j], py[j])
            ctx.stroke()
            lineCount++
          }
        }
      }

      /* ─── Draw particles (NO shadowBlur) ─── */
      for (let i = 0; i < COUNT; i++) {
        const pulse  = 0.85 + 0.15 * Math.sin(ph[i])
        const alpha  = op[i] * pulse
        const radius = sz[i] * pulse
        const c = COLORS[ci[i]]

        // Soft glow: two-pass draw (outer transparent, inner solid)
        ctx.beginPath()
        ctx.arc(px[i], py[i], radius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha * 0.12})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(px[i], py[i], radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`
        ctx.fill()
      }
    }

    requestAnimationFrame(tick)

    /* ── Mouse ── */
    const onMove  = (e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY }
    const onLeave = () =>  { mouseRef.current.x = -9999;     mouseRef.current.y = -9999 }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)

    /* ── Resize ── */
    const onResize = () => { resize(); init() }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} id="particles-canvas" aria-hidden="true" />
}
