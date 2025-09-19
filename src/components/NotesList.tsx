export type Note = {
  id: string
  title: string
  content: string
  pinned: boolean
  createdAt: number
  updatedAt: number
}

export function NotesList({
  notes,
  onPin,
  onUnpin,
  onDelete,
  onEdit,
}: {
  notes: Note[]
  onPin: (id: string) => void
  onUnpin: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, title: string, content: string) => void
}) {
  if (!notes.length) {
    return <p className="muted empty">No notes yet. Brew a tea and jot a thought 🍵</p>
  }

  return (
    <ul className="notes-grid">
      {notes.map(n => (
        <li key={n.id} className={`note card ${n.pinned ? 'pinned' : ''}`}>
          <header className="note-header">
            <input
              className="note-title"
              value={n.title}
              onChange={e => onEdit(n.id, e.target.value, n.content)}
            />
            <div className="note-actions">
              {n.pinned ? (
                <button className="icon" title="Unpin" aria-label="Unpin" onClick={() => onUnpin(n.id)}>📌</button>
              ) : (
                <button className="icon" title="Pin" aria-label="Pin" onClick={() => onPin(n.id)}>📍</button>
              )}
              <button className="icon" title="Delete" aria-label="Delete" onClick={() => onDelete(n.id)}>🗑️</button>
            </div>
          </header>
          <textarea
            className="note-content"
            value={n.content}
            onChange={e => onEdit(n.id, n.title, e.target.value)}
            rows={5}
          />
          <footer className="note-footer">
            <span className="date" title={new Date(n.updatedAt).toLocaleString()}>
              Updated {timeAgo(n.updatedAt)}
            </span>
          </footer>
        </li>
      ))}
    </ul>
  )
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}
