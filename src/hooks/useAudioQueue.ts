import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type Track = {
  src: string
  title: string
}

type UseAudioQueueOptions = {
  initialIndex?: number
  initialVolume?: number // 0..1
  persistKey?: string
}

export function useAudioQueue(tracks: Track[], opts: UseAudioQueueOptions = {}) {
  const { initialIndex = 0, initialVolume = 0.5, persistKey = 'Septviber:audio' } = opts
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [index, setIndex] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(persistKey)
      if (raw) {
        const saved = JSON.parse(raw)
        return Math.min(Math.max(saved.index ?? initialIndex, 0), Math.max(tracks.length - 1, 0))
      }
    } catch {}
    return initialIndex
  })
  const [playing, setPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(persistKey)
      if (raw) {
        const saved = JSON.parse(raw)
        const v = saved.volume
        if (typeof v === 'number') return Math.min(Math.max(v, 0), 1)
      }
    } catch {}
    return initialVolume
  })
  const [muted, setMuted] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(persistKey)
      if (raw) return Boolean(JSON.parse(raw).muted)
    } catch {}
    return false
  })
  const [error, setError] = useState<string | null>(null)

  const current = tracks[index] ?? null

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'auto'
    }
    const a = audioRef.current
    const onEnded = () => {
      // advance to next and continue playing
      setIndex((i) => (tracks.length ? (i + 1) % tracks.length : 0))
      // actual play will be triggered by src change effect below if playing is true
    }
    const onError = () => {
      setError('Audio playback error')
    }
    a.addEventListener('ended', onEnded)
    a.addEventListener('error', onError)
    return () => {
      a.removeEventListener('ended', onEnded)
      a.removeEventListener('error', onError)
    }
  }, [tracks.length])

  // Load track when index changes
  useEffect(() => {
    const a = audioRef.current
    if (!a || !current) return
    setError(null)
    a.src = current.src
    a.currentTime = 0
    a.volume = muted ? 0 : volume
    // Only attempt autoplay if already playing (user initiated previously)
    if (playing) {
      a.play().catch(() => {
        // Autoplay might be blocked; we'll surface the playing state as false
        setPlaying(false)
      })
    }
  }, [index, current?.src])

  // Apply volume/mute to element
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = muted ? 0 : volume
  }, [volume, muted])

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(
        persistKey,
        JSON.stringify({ index, volume, muted })
      )
    } catch {}
  }, [index, volume, muted, persistKey])

  const play = useCallback(async () => {
    const a = audioRef.current
    if (!a) return
    try {
      if (!a.src && current) a.src = current.src
      a.volume = muted ? 0 : volume
      await a.play()
      setPlaying(true)
    } catch (e) {
      setError('Autoplay blocked. Click to play.')
      setPlaying(false)
    }
  }, [current, volume, muted])

  const pause = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.pause()
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (playing) pause()
    else void play()
  }, [playing, pause, play])

  const next = useCallback(() => {
    setIndex((i) => (tracks.length ? (i + 1) % tracks.length : 0))
  }, [tracks.length])

  const prev = useCallback(() => {
    setIndex((i) => (tracks.length ? (i - 1 + tracks.length) % tracks.length : 0))
  }, [tracks.length])

  const setVolumeClamped = useCallback((v: number) => {
    setVolume(Math.min(Math.max(v, 0), 1))
  }, [])

  return useMemo(
    () => ({
      audio: audioRef,
      tracks,
      index,
      current,
      playing,
      volume,
      muted,
      error,
      setIndex,
      play,
      pause,
      toggle,
      next,
      prev,
      setVolume: setVolumeClamped,
      setMuted,
    }),
    [index, current, playing, volume, muted, error, next, prev, toggle, play, pause, setVolumeClamped, tracks]
  )
}
