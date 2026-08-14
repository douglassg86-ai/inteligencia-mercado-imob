import { useMemo, useRef, useState } from 'react'
import { normalizeTagName } from '../../lib/tagUtils'

export default function TagInput({ allTags, selectedTagIds, onChange, onCreateTag }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const wrapRef = useRef(null)

  const selectedTags = selectedTagIds
    .map((id) => allTags.find((t) => t.id === id))
    .filter(Boolean)

  const normalizedQuery = normalizeTagName(query)

  const matches = useMemo(() => {
    if (!normalizedQuery) return []
    return allTags.filter(
      (t) => !selectedTagIds.includes(t.id) && t.name.includes(normalizedQuery)
    )
  }, [allTags, normalizedQuery, selectedTagIds])

  const exactExists = allTags.some((t) => t.name === normalizedQuery)
  const showCreateOption = normalizedQuery.length > 0 && !exactExists

  const options = showCreateOption ? [...matches, { __create: true }] : matches

  const selectExisting = (tag) => {
    onChange([...selectedTagIds, tag.id])
    setQuery('')
    setOpen(false)
    setHighlight(0)
  }

  const createAndSelect = async () => {
    if (!normalizedQuery) return
    const newTag = await onCreateTag(normalizedQuery)
    if (newTag) onChange([...selectedTagIds, newTag.id])
    setQuery('')
    setOpen(false)
    setHighlight(0)
  }

  const removeTag = (id) => {
    onChange(selectedTagIds.filter((tid) => tid !== id))
  }

  const handleKeyDown = (e) => {
    if (!open || options.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => (h + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (h - 1 + options.length) % options.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = options[highlight]
      if (!opt) return
      if (opt.__create) createAndSelect()
      else selectExisting(opt)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="pl-tag-input-wrap" ref={wrapRef}>
      {selectedTags.length > 0 && (
        <div className="pl-tag-selected">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="pl-tag-chip"
              style={{ background: `${tag.color}26`, color: tag.color, border: `1px solid ${tag.color}55` }}
            >
              {tag.name}
              <button type="button" onClick={() => removeTag(tag.id)} aria-label={`Remover tag ${tag.name}`}>
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        className="pl-input"
        placeholder="Digite para buscar ou criar uma tag..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          setHighlight(0)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={handleKeyDown}
      />

      {open && options.length > 0 && (
        <div className="pl-tag-dropdown">
          {options.map((opt, i) =>
            opt.__create ? (
              <div
                key="__create"
                className={`pl-tag-option pl-tag-option-create${i === highlight ? ' highlighted' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={createAndSelect}
              >
                + Criar tag "{normalizedQuery}"
              </div>
            ) : (
              <div
                key={opt.id}
                className={`pl-tag-option${i === highlight ? ' highlighted' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectExisting(opt)}
              >
                <span className="pl-tag-dot" style={{ background: opt.color }} />
                {opt.name}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
