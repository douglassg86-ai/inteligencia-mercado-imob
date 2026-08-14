import { useEffect, useRef, useState } from 'react'

export default function FilterBar({
  allTags,
  selectedTagIds,
  onToggleTag,
  rangeMin,
  rangeMax,
  onApplyPeriod,
  onClearAll,
  activeFilterCount,
}) {
  const [open, setOpen] = useState(false)
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const applyPeriod = () => {
    if (!periodStart) return
    onApplyPeriod(periodStart, periodEnd || periodStart)
    setOpen(false)
  }

  const clearPeriod = () => {
    setPeriodStart('')
    setPeriodEnd('')
  }

  return (
    <div className="pl-filter-wrap" ref={wrapRef}>
      <button type="button" className="pl-btn pl-filter-btn" onClick={() => setOpen((v) => !v)}>
        Filtros
        {activeFilterCount > 0 && <span className="pl-filter-badge">{activeFilterCount}</span>}
      </button>

      {open && (
        <div className="pl-filter-panel">
          <div className="pl-filter-section">
            <span className="pl-filter-section-label">Tags</span>
            {allTags.length === 0 ? (
              <p className="pl-filter-empty">Nenhuma tag criada ainda.</p>
            ) : (
              <div className="pl-filter-tag-list">
                {allTags.map((tag) => {
                  const active = selectedTagIds.includes(tag.id)
                  return (
                    <button
                      type="button"
                      key={tag.id}
                      className={`pl-filter-tag-chip${active ? ' active' : ''}`}
                      style={
                        active
                          ? { background: `${tag.color}26`, color: tag.color, border: `1px solid ${tag.color}` }
                          : undefined
                      }
                      onClick={() => onToggleTag(tag.id)}
                    >
                      <span className="pl-tag-dot" style={{ background: tag.color }} />
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="pl-filter-section">
            <span className="pl-filter-section-label">Período</span>
            <div className="pl-filter-period-row">
              <input
                type="date"
                value={periodStart}
                min={rangeMin}
                max={rangeMax}
                onChange={(e) => setPeriodStart(e.target.value)}
                aria-label="Data inicial"
              />
              <span className="pl-filter-period-sep">até</span>
              <input
                type="date"
                value={periodEnd}
                min={periodStart || rangeMin}
                max={rangeMax}
                onChange={(e) => setPeriodEnd(e.target.value)}
                aria-label="Data final (opcional)"
              />
            </div>
            <div className="pl-filter-period-actions">
              <button type="button" className="pl-btn-secondary" onClick={clearPeriod}>
                Limpar data
              </button>
              <button type="button" className="pl-btn-primary" onClick={applyPeriod} disabled={!periodStart}>
                Ver período
              </button>
            </div>
          </div>

          <div className="pl-filter-footer">
            <button
              type="button"
              className="pl-btn-danger-text"
              onClick={() => {
                onClearAll()
                clearPeriod()
              }}
            >
              Limpar todos os filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
