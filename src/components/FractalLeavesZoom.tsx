import { useEffect, useRef, useState } from 'react'
import '../styles/fractal-zoom.css'

// Mandelbrot zoom overlay with transparent background so it blends over the image
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

    // Offscreen buffer for computation (smaller for performance)
    const buffer = document.createElement('canvas')
    const bctx = buffer.getContext('2d', { alpha: true })!

    // Seahorse Valley target
    const TARGET_CX = -0.743643887037151
    const TARGET_CY = 0.13182590420533

    // Tunables
    const MAX_ITER = 96
    const ZOOM_SPEED = 1.0012
    const QUALITY = 0.01 // 60% resolution buffer, scaled up

    let zoom = 200
    let raf = 0

    function resize() {
      const cnv = canvasRef.current
      if (!cnv) return

      // CSS size
      const cssW = Math.max(1, cnv.clientWidth || window.innerWidth)
      const cssH = Math.max(1, cnv.clientHeight || window.innerHeight)

      // Backing store in device px
      cnv.width = Math.floor(cssW * dpr)
      cnv.height = Math.floor(cssH * dpr)
      cnv.style.width = cssW + 'px'
      cnv.style.height = cssH + 'px'
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Offscreen buffer in CSS px (rely on putImageData at native scale, then drawImage)
      buffer.width = Math.max(1, Math.floor(cssW * QUALITY))
      buffer.height = Math.max(1, Math.floor(cssH * QUALITY))
      bctx.clearRect(0, 0, buffer.width, buffer.height)
    }

    function hslToRgb(h: number, s: number, l: number) {
      const c = (1 - Math.abs(2 * l - 1)) * s
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = l - c / 2
      let r = 0, g = 0, b = 0
      if (h < 60) { r = c; g = x }
      else if (h < 120) { r = x; g = c }
      else if (h < 180) { g = c; b = x }
      else if (h < 240) { g = x; b = c }
      else if (h < 300) { r = x; b = c }
      else { r = c; b = x }
      return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
    }

    function drawMandelbrot() {
      const w = buffer.width
      const h = buffer.height
      const img = bctx.createImageData(w, h)
      const data = img.data

      // View window centered on target
      const rangeX = 3.5 / zoom
      const rangeY = (rangeX * h) / w
      const minReal = TARGET_CX - rangeX / 2
      const minImag = TARGET_CY - rangeY / 2

      const isNight = document.documentElement.dataset.theme === 'night'
      const hueOffset = isNight ? 220 : 40

      let idx = 0
      for (let y = 0; y < h; y++) {
        const cy = minImag + (y / h) * rangeY
        for (let x = 0; x < w; x++) {
          const cx = minReal + (x / w) * rangeX
          let zx = 0, zy = 0
          let iter = 0
          while (zx * zx + zy * zy < 4 && iter < MAX_ITER) {
            const xtemp = zx * zx - zy * zy + cx
            zy = 2 * zx * zy + cy
            zx = xtemp
            iter++
          }
          if (iter === MAX_ITER) {
            // inside set -> keep transparent so background shows
            data[idx++] = 0
            data[idx++] = 0
            data[idx++] = 0
            data[idx++] = 0
          } else {
            const mag = Math.sqrt(zx * zx + zy * zy)
            const smooth = iter + 1 - Math.log(Math.log(Math.max(1e-12, mag))) / Math.log(2)
            const t = Math.max(0, Math.min(1, Math.sqrt(smooth / MAX_ITER)))
            const hue = (t * 360 + hueOffset) % 360
            const [r, g, b] = hslToRgb(hue, 0.85, 0.55)
            data[idx++] = r
            data[idx++] = g
            data[idx++] = b
            // Slight transparency to blend better
            data[idx++] = 215
          }
        }
      }
      bctx.putImageData(img, 0, 0)
    }

    function frame() {
      // Draw into buffer then scale to canvas
      drawMandelbrot()
      const cnv = canvasRef.current
      if (!cnv) return
      const cssW = cnv.clientWidth || cnv.width / dpr
      const cssH = cnv.clientHeight || cnv.height / dpr
      context.clearRect(0, 0, cssW, cssH)
      context.imageSmoothingEnabled = true
      context.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, cssW, cssH)

      // zoom
      zoom *= ZOOM_SPEED
      if (zoom > 1e7) zoom = 200
      raf = requestAnimationFrame(frame)
    }

    function handleResize() {
      resize()
    }

    resize()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      drawMandelbrot()
      const cssW = canvas.clientWidth || canvas.width / dpr
      const cssH = canvas.clientHeight || canvas.height / dpr
      context.clearRect(0, 0, cssW, cssH)
      context.drawImage(buffer, 0, 0, buffer.width, buffer.height, 0, 0, cssW, cssH)
    } else {
      raf = requestAnimationFrame(frame)
    }

    // Theme observer to tweak palette live
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          setThemeToken((t) => t + 1)
        }
      }
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
      obs.disconnect()
    }
  }, [themeToken])

  return <canvas className="fractal-zoom" ref={canvasRef} aria-hidden />
}
