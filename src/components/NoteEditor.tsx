import { useState } from 'react'

export function NoteEditor({ onAdd }: { onAdd: (title: string, content: string) => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const t = title.trim()
    const c = content.trim()
    if (!t && !c) return
    onAdd(t || 'Untitled', c)
    setTitle('')
    setContent('')
  }

  return (
    <form className="note-editor card" onSubmit={submit}>
      <div className="fields">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
          aria-label="Note title"
          className="title"
          maxLength={120}
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Capture a September vibe..."
          aria-label="Note content"
          rows={4}
        />
      </div>
      <div className="actions">
        <button type="submit" className="primary">Add note</button>
      </div>
    </form>
  )
}
