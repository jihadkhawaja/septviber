export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="search-bar">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search notes..."
        aria-label="Search notes"
      />
      {value && (
        <button className="icon" aria-label="Clear" title="Clear" onClick={() => onChange('')}>
          ✖️
        </button>
      )}
    </div>
  )
}
