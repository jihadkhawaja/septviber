import { useEffect, useMemo, useState } from 'react'
import { FallingLeaves } from './components/FallingLeaves'
import { ImageBackdrop } from './components/ImageBackdrop'
import { FractalLeavesZoom } from './components/FractalLeavesZoom'
import { NoteEditor } from './components/NoteEditor'
import { NotesList, Note } from './components/NotesList'
import { SearchBar } from './components/SearchBar'
import './styles/theme.css'
import './styles/app.css'
import BackgroundMusicPlayer from './components/BackgroundMusicPlayer'

const STORAGE_KEY = 'Septviber:notes'

export default function App() {
  // Global vibe (0..1): blends quality, detail, and zoom speed
  const [vibe, setVibe] = useState<number>(0.25)
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Note[]) : []
    } catch {
      return []
    }
  })
  const [query, setQuery] = useState('')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [theme, setTheme] = useState<'day' | 'night'>(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notes
      .filter(n => (showPinnedOnly ? n.pinned : true))
      .filter(n => (q ? n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) : true))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt)
  }, [notes, query, showPinnedOnly])

  function addNote(title: string, content: string) {
    const now = Date.now()
    const newNote: Note = { id: crypto.randomUUID(), title, content, pinned: false, createdAt: now, updatedAt: now }
    setNotes(prev => [newNote, ...prev])
  }

  function updateNote(id: string, patch: Partial<Note>) {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n))
    )
  }

  function deleteNote(id: string) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="app-shell">
  <ImageBackdrop />
  <FractalLeavesZoom vibe={vibe} />
      <FallingLeaves count={20} />
      <BackgroundMusicPlayer />
      <header className="app-header">
        <h1>Septviber</h1>
        <div className="header-actions">
          <button
            className="pill"
            aria-label="Toggle theme"
            onClick={() => setTheme(t => (t === 'day' ? 'night' : 'day'))}
            title={theme === 'day' ? 'Switch to Night' : 'Switch to Day'}
          >
            {theme === 'day' ? '🌇 Afternoon' : '🌙 Night'}
          </button>
          <label className="toggle" aria-label="Pinned only">
            <input
              type="checkbox"
              checked={showPinnedOnly}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowPinnedOnly(e.target.checked)}
              aria-checked={showPinnedOnly}
            />
            <span className="track" aria-hidden>
              <span className="thumb" />
            </span>
            <span className="toggle-label">Pinned only</span>
          </label>
          <div className="slider-group" title="Vibe">
            <label className="slider-label" htmlFor="vibe-range">Vibe</label>
            <input
              id="vibe-range"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={vibe}
              onChange={(e) => setVibe(parseFloat(e.target.value))}
              aria-label="Vibe slider controlling fractal quality, detail, and speed"
            />
            <span className="slider-value">{Math.round(vibe * 100)}%</span>
          </div>
        </div>
      </header>

      <main className="content">
        <SearchBar value={query} onChange={setQuery} />
        <NoteEditor onAdd={addNote} />
        <NotesList
          notes={filtered}
          onPin={(id: string) => updateNote(id, { pinned: true })}
          onUnpin={(id: string) => updateNote(id, { pinned: false })}
          onDelete={deleteNote}
          onEdit={(id: string, title: string, content: string) => updateNote(id, { title, content })}
        />
      </main>

      <footer className="app-footer">
        <p>
          Built for Codédex September 2025 Vibe Coding Challenge • React + TypeScript • Made with ❤️ and a lot of ☕
        </p>
      </footer>
    </div>
  )
}
