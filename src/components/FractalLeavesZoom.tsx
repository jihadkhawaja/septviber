import { useEffect, useRef, useState } from 'react'
import '../styles/fractal-zoom.css'

/**
 * FractalLeavesZoom
 * - Renders a full-viewport canvas overlay
 * - Draws a seamless leaf tile and animates an infinite zoom (scale doubles, then wraps)
 * - Respects prefers-reduced-motion and theme (day/night) via documentElement.dataset.theme
 */
export function FractalLeavesZoom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [themeToken, setThemeToken] = useState(0)

  useEffect(() => {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return
    const context = ctx as CanvasRenderingContext2D

    let raf = 0
    let running = true
    let lastT = performance.now()

    // Create a seamless tile with leaf shapes
    function makeTile() {
      const isNight = document.documentElement.dataset.theme === 'night'
      const size = 512 // power of two for clean doubling
      const off = document.createElement('canvas')
      off.width = size
      off.height = size
      const octx = off.getContext('2d')!

      // faint base tint to help visibility across blends
      octx.fillStyle = isNight ? 'rgba(20, 30, 50, 0.4)' : 'rgba(255, 248, 235, 0.35)'
      octx.fillRect(0, 0, size, size)      // palette
      const greens = isNight
        ? ['#94a3b8', '#9ca3af', '#64748b'] // cool slates
        : ['#2d5016', '#3d6b1e', '#4a7c59'] // darker greens
      const ambers = isNight
        ? ['#d97706', '#b45309', '#f59e0b']
        : ['#b8860b', '#cc8400', '#e6ac00'] // darker ambers
      const reds = isNight
        ? ['#b91c1c', '#ef4444', '#dc2626']
        : ['#8b1538', '#a02d56', '#b8447a'] // darker reds
      const palette = [...greens, ...ambers, ...reds]

      // helper: draw a stylized leaf at (x,y) with size s and rotation r
      function drawLeaf(x: number, y: number, s: number, r: number, color: string) {
        octx.save()
        octx.translate(x, y)
        octx.rotate(r)
        octx.scale(s, s)

  // leaf body
        const grad = octx.createLinearGradient(0, -1, 0, 1)
        grad.addColorStop(0, color)
        grad.addColorStop(1, isNight ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')
        octx.fillStyle = grad
        octx.beginPath()
        octx.moveTo(0, -1)
        octx.bezierCurveTo(0.9, -0.9, 1, -0.2, 0.6, 0.2)
        octx.bezierCurveTo(0.2, 0.8, -0.2, 0.8, -0.6, 0.2)
        octx.bezierCurveTo(-1, -0.2, -0.9, -0.9, 0, -1)
        octx.closePath()
  octx.fill()
  octx.strokeStyle = isNight ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'
  octx.lineWidth = 0.04
  octx.stroke()

        // midrib
        octx.strokeStyle = isNight ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'
        octx.lineWidth = 0.06
        octx.beginPath()
        octx.moveTo(0, -0.9)
        octx.lineTo(0, 0.9)
        octx.stroke()

        // veins
        octx.lineWidth = 0.04
        for (let i = -0.6; i <= 0.6; i += 0.3) {
          octx.beginPath()
          octx.moveTo(0, i)
          octx.quadraticCurveTo(0.3, i + 0.1, 0.55, i + 0.2)
          octx.stroke()
          octx.beginPath()
          octx.moveTo(0, i)
          octx.quadraticCurveTo(-0.3, i + 0.1, -0.55, i + 0.2)
          octx.stroke()
        }
        octx.restore()
      }

      // tile pattern: mirrored quads for seamlessness
      function scatter(seed: number) {
        const rng = mulberry32(seed)
        for (let i = 0; i < 72; i++) {
          const x = rng() * size
          const y = rng() * size
          const s = 40 + rng() * 80  // much larger leaves
          const r = rng() * Math.PI * 2
          const color = palette[(rng() * palette.length) | 0]
          drawLeaf(x, y, s / 64, r, color)
        }
      }

      // base scatter
      scatter(1)
      // mirror edges by drawing near borders to reduce seams
      octx.globalAlpha = 0.85
      scatter(2)
      octx.globalAlpha = 1

      // subtle noise overlay for texture
      const noise = octx.createImageData(size, size)
      const data = noise.data
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 20) | 0
        data[i] = 0
        data[i + 1] = 0
        data[i + 2] = 0
        data[i + 3] = v
      }
      octx.putImageData(noise, 0, 0)

      return off
    }

    let tile = makeTile()
    let pattern: CanvasPattern | null = null

    function resize() {
      const { innerWidth: w, innerHeight: h } = window
      const cnv = canvasRef.current
      if (!cnv) return
      cnv.width = Math.floor(w * dpr)
      cnv.height = Math.floor(h * dpr)
      cnv.style.width = w + 'px'
      cnv.style.height = h + 'px'
  context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    // scale factor evolves exponentially: s = 2^(t/T). Wrap when >= 2 to keep pattern self-similar
    let s = 1
    let offsetX = 0
    let offsetY = 0
    const periodMs = 16000 // time to double scale

    function frame(t: number) {
      if (!running) return
      const dt = Math.max(0, Math.min(64, t - lastT))
      lastT = t
      // update scale exponentially
      const k = Math.pow(2, dt / periodMs)
      s *= k
      // slowly drift offset for motion parallax
      const drift = dt * 0.003
      offsetX += drift
      offsetY += drift * 0.6

      // wrap when scale grows too large; keep continuity
      if (s >= 2) {
        s /= 2
      }

      // lazily create pattern
  if (!pattern) pattern = context.createPattern(tile, 'repeat')
    if (!pattern) pattern = context.createPattern(tile, 'repeat')
      if (!pattern) return

  const cnv = canvasRef.current
  if (!cnv) return
  const { width, height } = cnv
     context.clearRect(0, 0, width, height)

      // draw scaled pattern, anchoring center
     context.save()
      const px = tile.width
      const py = tile.height
      // translate so that zoom centers on screen middle
     context.translate(width / 2, height / 2)
     context.scale(s, s)
     context.translate(-width / 2, -height / 2)

      // apply offset modulo tile size to avoid drift seams
     const ox = ((offsetX % px) + px) % px
     const oy = ((offsetY % py) + py) % py
     context.translate(-ox, -oy)

     context.fillStyle = pattern
      // fill slightly larger than viewport to hide edges when scaling
     context.fillRect(-px, -py, width + px * 2, height + py * 2)
     context.restore()

      raf = requestAnimationFrame(frame)
    }

    // reduced motion: draw once, don’t animate
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      // one static render
  pattern = ctx.createPattern(tile, 'repeat')
  const cnv = canvasRef.current
  if (!cnv) return
  const { width, height } = cnv
     context.clearRect(0, 0, width, height)
     context.fillStyle = pattern!
     context.fillRect(0, 0, width, height)
    } else {
      raf = requestAnimationFrame(frame)
    }

    // react to theme changes by regenerating tile and pattern
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          tile = makeTile()
          pattern = null
          setThemeToken((t) => t + 1)
        }
      }
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      obs.disconnect()
    }

    // Mulberry32 PRNG for stable scatter
    function mulberry32(a: number) {
      return function () {
        let t = (a += 0x6d2b79f5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
    }
  }, [themeToken])

  return <canvas className="fractal-zoom" ref={canvasRef} aria-hidden />
}
