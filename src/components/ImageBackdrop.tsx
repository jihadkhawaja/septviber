import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import '../styles/image-backdrop.css'

export function ImageBackdrop() {
  const [now, setNow] = useState(() => new Date())
  const [themeToken, setThemeToken] = useState(0)
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    if (!reduceMotion) {
      const id = setInterval(() => setNow(new Date()), 1000)
      return () => clearInterval(id)
    }
  }, [reduceMotion])

  // React to theme changes
  useEffect(() => {
    if (typeof document === 'undefined') return
    const target = document.documentElement
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          setThemeToken((t) => t + 1)
        }
      }
    })
    observer.observe(target, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const isNight = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'night'

  const seconds = now.getSeconds()
  const minutes = now.getMinutes()
  const hours = now.getHours()
  const hh = ((hours % 12) || 12).toString().padStart(2, '0')
  const mm = minutes.toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const showColon = !reduceMotion ? seconds % 2 === 0 : true

  // Royalty-free images via Unsplash source API (featured). These URLs return free-to-use images.
  // Note: You can replace these with specific image URLs if you prefer fixed assets.
  // Use local images provided in public/images; prefix with BASE_URL for GitHub Pages
  const base = import.meta.env.BASE_URL
  const bgUrl = isNight
    ? `${base}images/leaves_background-dark.jpg`
    : `${base}images/leaves_background-light.jpg`
  const clockUrl = '/images/digital-clock-radio.jpg'

  const clock = (
    <div className="clock-wrap" aria-hidden>
      <svg className="clock-svg" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid meet" aria-label="Digital clock">
          <defs>
            <linearGradient id="clockBodyLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#d1d5db" />
            </linearGradient>
            <linearGradient id="clockBodyDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? '#0b1220' : '#0a1f0b'} stopOpacity="0.95" />
              <stop offset="100%" stopColor={isNight ? '#0e172a' : '#0e2a10'} stopOpacity="0.95" />
            </linearGradient>
            <filter id="clockShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Body */}
          <g filter="url(#clockShadow)">
            <rect x="18" y="20" width="324" height="110" rx="18" fill={isNight ? 'url(#clockBodyDark)' : 'url(#clockBodyLight)'} />
            {/* Speaker grill */}
            <g opacity="0.65" stroke={isNight ? '#94a3b8' : '#9ca3af'} strokeWidth="1.4">
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={i} x1={30} y1={36 + i * 9} x2={78} y2={36 + i * 9} />
              ))}
            </g>
            {/* Feet */}
            <rect x="54" y="130" width="28" height="8" rx="4" fill={isNight ? '#111827' : '#9ca3af'} />
            <rect x="278" y="130" width="28" height="8" rx="4" fill={isNight ? '#111827' : '#9ca3af'} />
          </g>

          {/* Screen */}
          <rect x="100" y="44" width="220" height="68" rx="10" fill="url(#glass)" stroke={isNight ? '#334155' : '#14532d'} strokeWidth="2.2" />
          {/* Subtle glare */}
          <path d="M104,48 h212 a10,10 0 0 1 10,10 v3 h-232 v-3 a10,10 0 0 1 10,-10 z" fill="#ffffff" opacity="0.06" />

          {/* Time text */}
          <g fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fontWeight="800" dominantBaseline="middle">
            <text x="210" y="78" textAnchor="middle" fontSize="44" letterSpacing="4" fill={isNight ? '#a7f3d0' : '#86efac'}>
              {`${hh}${showColon ? ':' : ' '}${mm}`}
            </text>
            <text x="300" y="78" textAnchor="start" fontSize="16" fill={isNight ? '#bae6fd' : '#065f46'}>{ampm}</text>
          </g>

          {/* Label and buttons */}
          <text x="100" y="122" fontSize="12" fill={isNight ? '#cbd5e1' : '#4b5563'} fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, 'Helvetica Neue', Arial">
            SEPT VIBER RADIO
          </text>
          <rect x="290" y="116" width="12" height="12" rx="3" fill={isNight ? '#94a3b8' : '#9ca3af'} />
          <rect x="308" y="116" width="12" height="12" rx="3" fill={isNight ? '#94a3b8' : '#9ca3af'} />
        </svg>
    </div>
  )

  return (
    <>
      <div className={`image-backdrop ${isNight ? 'night' : 'day'}`} data-theme-token={themeToken} aria-hidden>
        <img className="bg-img" src={bgUrl} alt="Cozy bedroom background" loading="eager" decoding="async" />
      </div>
      {typeof document !== 'undefined' ? createPortal(clock, document.body) : null}
    </>
  )
}
