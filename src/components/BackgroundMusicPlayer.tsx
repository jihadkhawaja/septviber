import { useMemo } from 'react'
import { useAudioQueue } from '../hooks/useAudioQueue'
import '../styles/music-player.css'

function IconPlay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden focusable="false" {...props}>
      <path d="M7 5v14l11-7-11-7z" fill="currentColor" />
    </svg>
  )
}

function IconPause(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden focusable="false" {...props}>
      <rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
    </svg>
  )
}

function IconPrev(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden focusable="false" {...props}>
      {/* Left bar */}
      <path d="M6 5h2v14H6z" fill="currentColor" />
      {/* Left-pointing triangle placed to the right of the bar */}
      <path d="M20 6v12l-10-6 10-6z" fill="currentColor" />
    </svg>
  )
}

function IconNext(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden focusable="false" {...props}>
      <path d="M16 5h2v14h-2z" fill="currentColor" />
      <path d="M4 6v12l10-6L4 6z" fill="currentColor" />
    </svg>
  )
}

function IconVolume(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden focusable="false" {...props}>
      <path d="M4 10v4h3l5 4V6l-5 4H4z" fill="currentColor" />
      <path d="M16 8c1.657 1.333 1.657 6.667 0 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M18.5 6.5c2.828 2.2 2.828 8.8 0 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function IconMute(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden focusable="false" {...props}>
      <path d="M4 10v4h3l5 4V6l-5 4H4z" fill="currentColor" />
      <path d="M19 9l-6 6M13 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function BackgroundMusicPlayer() {
  // Build playlist referencing files in public/music
  const tracks = useMemo(
    () => [
      { src: '/music/Falling Leaf Dreams.mp3', title: 'Falling Leaf Dreams' },
      { src: '/music/Falling Leaves.mp3', title: 'Falling Leaves' },
    ],
    []
  )

  const player = useAudioQueue(tracks, { initialVolume: 0.35, persistKey: 'Septviber:bgmusic' })

  return (
    <div className="music-player" role="region" aria-label="Background music player">
      <button className="mp-btn" onClick={player.toggle} aria-label={player.playing ? 'Pause music' : 'Play music'} title={player.playing ? 'Pause' : 'Play'}>
        {player.playing ? <IconPause className="mp-icon" /> : <IconPlay className="mp-icon" />}
      </button>
      <button className="mp-btn" onClick={player.prev} aria-label="Previous track" title="Previous">
        <IconPrev className="mp-icon" />
      </button>
      <button className="mp-btn" onClick={player.next} aria-label="Next track" title="Next">
        <IconNext className="mp-icon" />
      </button>
      <div className="mp-title" title={player.current?.title || 'No track'}>
        {player.current?.title ?? '—'}
      </div>
      <button
        className="mp-btn"
        onClick={() => player.setMuted(!player.muted)}
        aria-label={player.muted ? 'Unmute' : 'Mute'}
        title={player.muted ? 'Unmute' : 'Mute'}
      >
        {player.muted ? <IconMute className="mp-icon" /> : <IconVolume className="mp-icon" />}
      </button>
      <input
        className="mp-volume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={player.muted ? 0 : player.volume}
        onChange={(e) => player.setVolume(parseFloat(e.target.value))}
        aria-label="Volume"
      />
      {player.error && <span className="mp-error" role="status">{player.error}</span>}
    </div>
  )
}

export default BackgroundMusicPlayer
