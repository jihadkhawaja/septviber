import { useEffect, useMemo, useState } from 'react'
import '../styles/svg-backdrop.css'

export function SvgVibeClock() {
  const [now, setNow] = useState(() => new Date())
  const [themeToken, setThemeToken] = useState(0)
  const reduceMotion = useMemo(() =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  [])

  useEffect(() => {
    if (!reduceMotion) {
      const id = setInterval(() => setNow(new Date()), 1000)
      return () => clearInterval(id)
    }
  }, [reduceMotion])

  // React to theme changes without relying on interval
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

  // Always keep fresh theme evaluation
  const isNight = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'night'

  const seconds = now.getSeconds()
  const minutes = now.getMinutes()
  const hours = now.getHours()
  const hh = ((hours % 12) || 12).toString().padStart(2, '0')
  const mm = minutes.toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const showColon = !reduceMotion ? seconds % 2 === 0 : true

  const stars = useMemo(() => {
    // deterministic star positions
    const rng = (seed: number) => () => (seed = (seed * 9301 + 49297) % 233280) / 233280
    const rand = rng(42)
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: 4 + rand() * 92,
      y: 4 + rand() * 40,
      s: 0.4 + rand() * 0.9,
      o: 0.2 + rand() * 0.8,
    }))
  }, [])

  return (
    <svg
      className={`vibe-svg ${isNight ? 'night' : 'day'}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      data-theme-token={themeToken}
      aria-hidden
    >
      <defs>
        <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe7ce" />
          <stop offset="100%" stopColor="#ffd9ae" />
        </linearGradient>
        <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#16213e" />
        </linearGradient>
        <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c674e" />
          <stop offset="100%" stopColor="#5f4f3b" />
        </linearGradient>
        <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a7845f" />
          <stop offset="100%" stopColor="#8f6d4c" />
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="100" height="100" fill={isNight ? 'url(#skyNight)' : 'url(#skyDay)'} />

      {/* subtle sun/moon */}
      {isNight ? (
        <g filter="url(#softGlow)">
          <circle cx="78" cy="16" r="5.2" fill="#c7d2fe" opacity="0.9" />
        </g>
      ) : (
        <g filter="url(#softGlow)">
          <circle cx="78" cy="16" r="6" fill="#ffd089" opacity="0.9" />
        </g>
      )}

      {/* stars for night */}
      {isNight && (
        <g>
          {stars.map((s) => (
            <circle key={s.id} cx={s.x} cy={s.y} r={s.s} fill="#dbeafe" opacity={s.o * 0.6} />
          ))}
        </g>
      )}

      {/* distant skyline silhouette */}
      <g opacity={isNight ? 0.45 : 0.3} fill={isNight ? '#2b2b45' : '#8d7961'}>
        <path d="M-10,62 L8,60 L10,55 L15,55 L16,58 L24,58 L26,54 L31,54 L31,60 L40,60 L42,56 L46,56 L46,60 L55,60 L58,57 L65,57 L67,61 L75,61 L78,58 L85,58 L90,60 L110,62 L110,100 L-10,100 Z" />
      </g>

      {/* layered hills */}
      <path d="M-8,70 C15,65 25,72 38,68 C52,64 60,72 75,69 C88,66 95,70 108,71 L108,100 L-8,100 Z" fill="url(#hill2)" opacity="0.9" />
      <path d="M-8,78 C12,74 22,80 36,77 C51,74 61,82 74,79 C86,76 94,80 108,81 L108,100 L-8,100 Z" fill="url(#hill1)" opacity="0.95" />

      {/* cozy trees (simple triangles) */}
      <g opacity={0.9}>
        <g transform="translate(12,74)">
          <polygon points="0,8 3,0 6,8" fill="#3f3a2f" />
          <rect x="2.6" y="8" width="0.8" height="3" fill="#2a251c" />
        </g>
        <g transform="translate(28,73)">
          <polygon points="0,9 3.5,0 7,9" fill="#4a4235" />
          <rect x="3.1" y="9" width="0.8" height="3" fill="#2a251c" />
        </g>
        <g transform="translate(58,75)">
          <polygon points="0,7 2.8,0 5.6,7" fill="#453c2e" />
          <rect x="2.4" y="7" width="0.8" height="3" fill="#2a251c" />
        </g>
        <g transform="translate(84,74)">
          <polygon points="0,8 3,0 6,8" fill="#3f3a2f" />
          <rect x="2.6" y="8" width="0.8" height="3" fill="#2a251c" />
        </g>
      </g>

      {/* DIGITAL CLOCK */}
      <g className="clock-digital" filter="url(#softGlow)">
        <rect x="62" y="8" width="32" height="12" rx="3" fill={isNight ? '#1f2937' : '#ffffff'} opacity={isNight ? 0.9 : 0.85} stroke={isNight ? '#94a3b8' : '#e7d8c7'} strokeWidth="0.4" />
        <text
          x="78"
          y="16"
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
          fontSize="5.2"
          fontWeight="700"
          letterSpacing="0.5"
          fill={isNight ? '#e5e7eb' : '#3a2a1a'}
        >
          {`${hh}${showColon ? ':' : ' '}${mm}`}
        </text>
        <text
          x="91"
          y="16"
          textAnchor="end"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
          fontSize="3"
          fontWeight="700"
          fill={isNight ? '#cbd5e1' : '#57422f'}
        >
          {ampm}
        </text>
      </g>
    </svg>
  )
}
