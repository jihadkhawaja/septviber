import { useEffect, useMemo, useRef } from 'react'
import '../styles/leaves.css'

type Props = { count?: number }

export function FallingLeaves({ count = 16 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const leaves = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // vw
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 8,
      size: 18 + Math.random() * 16,
      rotate: Math.random() * 360,
      type: Math.random() > 0.5 ? '🍂' : '🍁',
    }))
  }, [count])

  useEffect(() => {
    // Reduce motion respect
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches && containerRef.current) {
      containerRef.current.style.display = 'none'
    }
  }, [])

  return (
    <div className="leaves" aria-hidden ref={containerRef}>
      {leaves.map(l => (
        <span
          key={l.id}
          className="leaf"
          style={{
            left: `${l.left}vw`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
            fontSize: `${l.size}px`,
            transform: `rotate(${l.rotate}deg)`
          }}
        >
          {l.type}
        </span>
      ))}
    </div>
  )
}
